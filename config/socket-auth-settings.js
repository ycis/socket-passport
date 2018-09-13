module.exports = (io, cookieParser, sessionSettings) => {
    const Settings = {
        cookieParser:   cookieParser,  
        key:            sessionSettings.name,     
        secret:         sessionSettings.secret,  
        store:          sessionSettings.store, 
        success: (data, accept) => {
            console.log('successful connection to socket.io');
            accept(null, true); 
        },
        fail: (data, message, error, accept) => {
            if(error) throw new Error(message);
            console.log('failed connection to socket.io:', message);
            accept(null, false);
        }
    }
    const passportSocketIo = require("passport.socketio");
    io.use(passportSocketIo.authorize(Settings)); 
    return passportSocketIo;
}