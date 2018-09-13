module.exports = (session, secret , key, expiry, uriLocation, collectionName) => {
    const cookieExpiry = {maxAge: (expiry||1000 * 60 * 60 * 24 * 7)};//one week unless sent in differently
    const MongoDBStore = require('connect-mongodb-session')((session||require("express-session")));
    const store = new MongoDBStore({
      uri: (uriLocation || 'mongodb://localhost:27017/connect_mongodb_session_test'),
      collection: (collectionName || 'mySessions')
    });
    store.on('connected', () => store.client);
    store.on('error', error => {
      assert.ifError(error);
      assert.ok(false);
    });
    return {
      name              : (key || 'connect.sid'),
      secret            : (secret || 'keyboard cat'),
      cookie            : cookieExpiry,
      store             : store,
      resave            : true,
      saveUninitialized : true
    };
};