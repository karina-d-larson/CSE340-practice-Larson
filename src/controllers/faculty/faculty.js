import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

const sortOptions = ['name', 'department', 'title'];

export function facultyListPage(req, res) {
  const currentSort = sortOptions.includes(req.query.sort) ? req.query.sort : 'name';

  res.render('faculty/list', {
    title: 'Faculty Directory',
    faculty: getSortedFaculty(currentSort),
    currentSort,
  });
}

export function facultyDetailPage(req, res, next) {
  const faculty = getFacultyById(req.params.facultyId);

  if (!faculty) {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
    return;
  }

  res.render('faculty/detail', {
    title: faculty.name,
    faculty,
  });
}
