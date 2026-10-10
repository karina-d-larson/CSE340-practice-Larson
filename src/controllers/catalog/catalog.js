import {
  getAllCourses,
  getCourseById,
  getSortedSections,
} from '../../models/catalog/catalog.js';

export function catalogPage(req, res) {
  res.render('catalog', {
    title: 'Course Catalog',
    courses: getAllCourses(),
  });
}

export function courseDetailPage(req, res, next) {
  const storedCourse = getCourseById(req.params.courseId);

  if (!storedCourse) {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
    return;
  }

  const currentSort = req.query.sort || 'time';
  const course = {
    ...storedCourse,
    sections: getSortedSections(storedCourse.sections, currentSort),
  };

  res.render('course-detail', {
    title: course.title,
    course,
    currentSort,
  });
}
