const path = require('path')
const http = require('http');
const express = require('express')
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server)

const PORT = process.env.PORT || 5000
//////////////////////////////////////////////////////////////////////

///////////////////////// Run App and Web Sockets ///////////////////////////////
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/home'))

io.on('connection', (socket) => {
  console.log('a user connected');
  let output = "hey"
  socket.emit("Output", output)
  socket.on("Input", async() => {
      let output = "hey"
      socket.emit("Output", output)
  })
});
server.listen(PORT, () => console.log("Server started!", `Listening on ${ PORT }`));
////////////////////////////////////////////////////////////////////////////////////////////




