const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer((req, res) => {
  res.write('Chat server working...');
  res.end();
});

const io = socketIo(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Yeni bir kullanıcı bağlandı:', socket.id);


  socket.on('chatMessage', (msg) => {
    console.log('Mesaj alındı:', msg);
    io.emit('message', msg);
  });

  socket.on('typing', (username) => {
    console.log('typing', username);
    io.emit('typing', username); 
    
  });

  socket.on('stopTyping', () => {
    io.emit('typing', '');
  });



  socket.on('disconnect', () => {
    console.log('kullanıcı ayrıldı:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor...');
});
