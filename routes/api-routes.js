module.exports = function(app, db) {
  if(!app) {
      console.log('failed to send express app into '+module.id)
      return;
  }
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      res.json({});
    }
    else {
      const data = req.user
      delete data.password
      res.json(data);
    }
  });
  // Get a user by email
  app.get("/api/emails/:email", function(req, res) {
    db.User.findOne({
      where: {
        email: req.params.email
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // username check
  app.get("/api/displaynames/:displayname", function(req, res) {
    db.User.findOne({
      attributes: ['displayname'],
      where: {
        displayname: req.params.displayname
      }
    }).then(function(user) {
      res.json(user);
    });
  });
};
