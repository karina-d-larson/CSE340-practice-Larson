const themes = ['blue-theme', 'green-theme', 'red-theme'];

export function getCurrentGreeting(hour = new Date().getHours()) {
  if (hour < 12) {
    return 'Good Morning!';
  }
  if (hour <= 17) {
    return 'Good Afternoon!';
  }
  return 'Good Evening!';
}

export function addLocalVariables(req, res, next) {
  if (!req.path.startsWith('/.')) {
    console.log(`${req.method} ${req.url}`);
  }

  const environment = (process.env.NODE_ENV || 'production').toLowerCase() || 'production';

  res.locals.currentYear = new Date().getFullYear();
  res.locals.NODE_ENV = environment;
  res.locals.queryParams = { ...req.query };
  res.locals.greeting = `<p>${getCurrentGreeting()}</p>`;
  res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];
  next();
}
