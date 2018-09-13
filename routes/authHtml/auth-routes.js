module.exports = function (app, passport) {
    if(!app||!passport) {
        console.log('failed to send '+!app?'app':'passport'+' into '+module.id)
        return;
    }
    const postBackOptions = {
      successRedirect: '/members',
      failureRedirect: '/form',
      failureFlash: true
    }
    const isAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.render("form", {
            login_errors: req.flash('error')
        })
    }
    app.get("/members", isAuthenticated, function(req, res) {
        const data = req.user;
        data.login_errors = req.flash('error')
        delete data.password; //dont want to send the hashed email in the data to client
        res.render('members',data)
    });
    app.get("/logout", function(req, res) {
      req.logout();
      res.render("form", {
          login_errors: req.flash('error')
      })
    });
    app.post("/login", passport.authenticate("local-login", postBackOptions));
    app.post("/signup", passport.authenticate("local-signup", postBackOptions));
    console.log('auth-routes')
}
