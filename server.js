//static const values for quick ajdustment
const secret =              'change this immediately';
const key =                 'cookie.sid';
const handlebarSettings =   {defaultLayout: "main"};
const bodyParserSettings =  {extended:true}
const dbSyncOptions =       {
  //be sure to change this to true to est tables on first run
  force: process.env.NODE_ENV === "test"||true
}; 
const PORT =                process.env.PORT || 8080;

//temp io room storage
const usernames = {};
const rooms = ['room1','room2','room3'];

// Requiring necessary npm packages
const cookieParser =        require('cookie-parser');
const express =             require("express");
const app =                 express();
const bodyParser =          require("body-parser");
const session =             require("express-session");
//flash messages after redirect, built in but not included w/passport
const flash =               require('connect-flash');
const handlebars =          require("express-handlebars");

//configuration
const db =                  require("./models")(false);//added logging disable
//we need a session store for authentication
const sessionSettings =     require("./config/session-settings-mongo")(session, secret, key);
//returns and configures passport routing
const passport =            require("./config/passport")(db.User);

// Creating express app and configuring middleware needed for authentication
app.use(bodyParser.urlencoded(bodyParserSettings));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cookieParser());

// We need to use sessions to keep track of our user's login status
app.use(session(sessionSettings)); // session secret
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.engine("handlebars",handlebars(handlebarSettings));
app.set("view engine", "handlebars");
app.set("port", PORT);

// Requiring our routes
//include auth first to make sure it hits this for testing if authenticated
require("./routes/authHtml/auth-routes")(app, passport);
//automatically compiles all routes in main folder like sequelize db
require("./routes")(app, db);
//include html last to catch landing and 404
require("./routes/authHtml/html-routes")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync(dbSyncOptions).then(function() {
  var server = app.listen(app.get("port"), function() {
    let io = require('socket.io').listen(server);
    require('./config/socket-io-connection')(io, usernames, rooms);
    require('./config/socket-auth-settings')(io, cookieParser, sessionSettings);
    console.log("==> 🌎Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
