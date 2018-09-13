let meme = 1;
var socket = io.connect('localhost:6568');
socket.emit('eventerino', {})
socket.on('pairConnection', function(data) {
    console.log('New connection, ID: ' + data.id);
});
