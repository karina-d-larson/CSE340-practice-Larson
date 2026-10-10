/* ================================
   Imports
   ================================ */
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

/* ================================
   Important variables
   ================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

/* ================================
   Express server setup
   ================================ */
const app = express();

/* ================================
   Middleware configuration
   ================================ */
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/* ================================
   Course catalog data
   ================================ */
const courses = {
  CS121: {
    id: 'CS121',
    title: 'Introduction to Programming',
    description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
    credits: 3,
    sections: [
      { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
      { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
      { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' },
    ],
  },
  MATH110: {
    id: 'MATH110',
    title: 'College Algebra',
    description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
    credits: 4,
    sections: [
      { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
      { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
      { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' },
    ],
  },
  ENG101: {
    id: 'ENG101',
    title: 'Academic Writing',
    description: 'Develop writing skills for academic and professional communication.',
    credits: 3,
    sections: [
      { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
      { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
      { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' },
    ],
  },
};

/* ================================
   Routes
   ================================ */
app.get('/', (req, res) => {
  const title = 'Welcome Home';
  res.render('home', { title });
});

app.get('/about', (req, res) => {
  const title = 'About Me';
  res.render('about', { title });
});

app.get('/products', (req, res) => {
  const title = 'Our Products';
  res.render('products', { title });
});

app.get('/catalog', (req, res) => {
  const title = 'Course Catalog';
  res.render('catalog', { title, courses });
});

app.get('/catalog/:courseId', (req, res, next) => {
  const courseId = req.params.courseId;
  const requestedSort = req.query.sort || 'time';
  const currentSort = ['time', 'professor', 'room'].includes(requestedSort)
    ? requestedSort
    : 'time';

  console.log(`Requested course ID: ${courseId}`);
  console.log(`Selected sort: ${currentSort}`);

  const course = courses[courseId];
  if (!course) {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
    return;
  }

  const sections = course.sections.slice();
  if (currentSort === 'professor') {
    sections.sort((a, b) => a.professor.localeCompare(b.professor));
  } else if (currentSort === 'room') {
    sections.sort((a, b) => a.room.localeCompare(b.room));
  }

  res.render('course-detail', {
    title: course.title,
    course,
    sections,
    currentSort,
  });
});

/* ================================
   Error handling
   ================================ */
app.get('/test-error', (req, res, next) => {
  const err = new Error('This is a test error');
  err.status = 500;
  next(err);
});

app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (res.headersSent || res.finished) {
    next(err);
    return;
  }

  const status = err.status || 500;
  const isDevelopment = NODE_ENV === 'development';
  const title = status === 404 ? 'Page Not Found' : 'Something Went Wrong';
  const view = status === 404 ? 'errors/404' : 'errors/500';
  const fallbackMessage = status === 404
    ? 'The page you requested does not exist.'
    : 'Sorry, something went wrong. Please try again later.';

  console.error(err);

  res.status(status).render(view, {
    title,
    error: isDevelopment ? (err.message || '') : '',
    stack: isDevelopment ? (err.stack || '') : '',
    NODE_ENV,
  }, (renderErr, html) => {
    if (renderErr) {
      console.error(renderErr);
      if (res.headersSent || res.finished) {
        next(renderErr);
        return;
      }

      res.status(status).type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <h1>${title}</h1>
  <p>${fallbackMessage}</p>
  <p><a href="/">Return to the homepage</a></p>
</body>
</html>`);
      return;
    }

    res.send(html);
  });
});

/* ================================
   Server startup
   ================================ */
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
  console.log(`Environment: ${NODE_ENV}`);
});
