const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);


let joueurs = [];


io.on('connection', (socket) => {
  console.log('Un joueur s\'est connecté');
  

  joueurs.push(socket);


  socket.on('joueur-move', (data) => {
    console.log('Mouvement reçu:', data);

    io.emit('joueur-move', data);
  });

  socket.on('point-capture', (point) => {
    console.log('Point capturé !', point);
    
    io.emit('point-capture', point);
  });

  
  socket.on('disconnect', () => {
    console.log('Un joueur s\'est déconnecté');
    joueurs = joueurs.filter(player => player !== socket);
  });
});


app.use(express.static('public'));


server.listen(8080, () => {
  console.log('Serveur démarré sur le port 8080');
});
