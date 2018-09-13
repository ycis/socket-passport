module.exports = (io, usernames, rooms) => {
    console.log('io-routes established')
    io.sockets.on('connection', function (socket) {
        var socketCalls = {
            adduser:function(username){
                socket.username = username;
                socket.room = 'room1';
                usernames[username] = username;
                socket.join('room1');
                socket.emit('updatechat', 'SERVER', 'you have connected to room1');
                socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
                socket.emit('updaterooms', rooms, 'room1');
            },
            sendchat:function (data) {
                io.sockets.in(socket.room).emit('updatechat', socket.username, data);
            },
            switchRoom:function(newroom){
                socket.leave(socket.room);
                socket.join(newroom);
                socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
                socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
                socket.room = newroom;
                socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
                socket.emit('updaterooms', rooms, newroom);
            },
            disconnect:function(){
                delete usernames[socket.username];
                io.sockets.emit('updateusers', usernames);
                socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
                socket.leave(socket.room);
            }
        }
        socket.on('adduser',    socketCalls.adduser);
        socket.on('sendchat',   socketCalls.sendchat);
        socket.on('switchRoom', socketCalls.switchRoom);
        socket.on('disconnect', socketCalls.disconnect);
        return socketCalls;
    });
};