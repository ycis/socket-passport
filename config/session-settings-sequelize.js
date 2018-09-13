module.exports = (key, secret, db, session) => {
    const SequelizeStore = require('connect-session-sequelize')((session||require("express-session")).Store);
    const sessionSettings = { 
        name              : (key || 'connect.sid'),
        secret            : (secret || 'keyboard cat'),
        resave            : true,
        store             : new SequelizeStore({db: (db || require("./models")).sequelize}),
        saveUninitialized : true,
        resave            : false
    }
    return sessionSettings;
}