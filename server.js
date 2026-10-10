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
