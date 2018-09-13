module.exports = function(app) {
  if(!app) {
      console.log('failed to send express app into '+module.id)
      return;
  }
  const getLogin = (req, res, signup) => {
    res.render("form", {
      signup: (signup||false),
      login_errors: req.flash('error')
    })
  };
  app.get("/", (req, res, next) => getLogin(req, res))
  app.get("/login", (req, res, next) => getLogin(req, res))
  app.get("/form", (req, res, next) => getLogin(req, res))
  app.get("/signup", (req, res, next) => getLogin(req, res, true))

  // Render 404 page for any unmatched routes
  app.get("*", (req, res) => {
    res.status(404);
    res.render("invalid")
  })
  console.log('html-routes')
}
