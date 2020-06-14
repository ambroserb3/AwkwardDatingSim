const socket = io();
console.log("fuck")

document.getElementById("play").addEventListener("click", playbutton);
function playbutton() {
    console.log("clicked")
    // Join game
    socket.emit('play');
}
