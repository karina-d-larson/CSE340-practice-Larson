export function homePage(req, res) {
  res.render('home', { title: 'Home' });
}

export function aboutPage(req, res) {
  res.render('about', { title: 'About' });
}

export function demoPage(req, res) {
  res.render('demo', { title: 'Middleware Demo Page' });
}

export function testErrorPage(req, res, next) {
  const err = new Error('This is a test error');
  err.status = 500;
  next(err);
}
