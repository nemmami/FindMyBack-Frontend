import { Redirect } from "../Router/Router";
import Navbar from "../NavBar/Navbar";
import { io } from "socket.io-client";
import { getSessionObject, setSessionObject } from "../../utils/session";
/**
 * View the Login form :
 * render a login page into the #page div (formerly login function)
 */

let waitingPage;
let gamePage;
let reponseTrouvee = false;
let dataRoom;
let actualRound;
let wordToFind;
let messageUser;
let intervalForTimer;

const socket = io("http://localhost:5000");

waitingPage = `
<div id="screenGame">
        <div class="row" id="headerGame">
            <div class="col-lg-3" id ="timer">xx sec</div>
            <div class="col-lg-5 text-center" id="currentWord">mot a deviner</div>
            <div class="col-lg-3" id ="round"></div>
        </div>

        <div class="row" id="bottomGame">
            <div class="col-lg-2" id="settingGame">
               <div class="col-lg-2" id="usersGame">
               <h3>Players</h3>
               <br>
               <div id="usersGameList"></div>
               </div>
        </div>
            <div class="col-lg-8" id="drawGame">

            </div>
            <div class="col-lg-2" id="chatGame">
                <div class="message-container"></div> 
                   <div class="wrapper"> 
                   <form id="formMsg">
                        <input id="msg" type="text" >
                       <!-- <input type="submit" value="Envoyer"> -->
                    </form>
                  </div>
                </div>
            </div>
            <div class="row" id="spec">
                    <div class="col-lg-2">
                    </div>     
                    <div class="col-lg-2">
                        <h3>Color</h3>
                        <input type="color" id="colorpicker" value="#000000" class="colorpicker">
                    </div>
   
                    <div class="col-lg-2">
                        <h3>Background color</h3>
                        <input type="color" value="#ffffff" id="bgcolorpicker" class="colorpicker">
                    </div>
            
                    <div class="col-lg-2">
                        <h3>Tools(outils)</h3>
                        <button id="eraser" class="btn btn-default">Gomme<span class="glyphicon glyphicon-erase" aria-hidden="true"></span></button>
                        <button id="clear" class="btn btn-danger">All clear <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></button>
                    </div>
            
                    <div class="col-lg-2">
                        <h3>Size <span id="showSize">5</span></h3>
                        <input type="range" min="1" max="50" value="5" step="1" id="controlSize">
                    </div>
                    <div class="col-lg-2">
                    </div>
            </div>
  </div>
            `;


const WaitingGamePage = () => {
  // reset #page div
  const pageDiv = document.querySelector("#page");
  pageDiv.innerHTML = waitingPage;
  getPlayer(); // waiting room
  inGame(); //game page
}

function getPlayer() {
  if (getSessionObject("room") !== undefined) {
    socket.emit("joinRoom", {
      id: getSessionObject("room").id,
      username: getSessionObject("user").username,
    });

    socket.on("playersList", ({ rooms }) => {
      console.log(rooms);
      document.getElementById("usersGameList").innerHTML = '';
      rooms.forEach((e) => {
        console.log(e);
        document.getElementById("usersGameList").innerHTML +=
          `<li class="list-group-item d-flex justify-content-between">
          <p class="p-0 m-0 flex-grow-1 fw-bold" id="room-dispo">Joueur - ${e}</p>
        </li>`;
      });

<<<<<<< HEAD
      document.getElementById("drawGame").innerHTML = `<h2> Bienvenue dans la liste d'attente attends qu'il y ait le nombre de joueurs nécessaires pour pouvoir lancer la partie ${rooms.length}/${getSessionObject("room").nbPlayers}  </h2>`;

=======
      document.getElementById("drawGame").innerHTML = `<h2>Bienvenue dans la liste d'attente. ${rooms.length}/${getSessionObject("room").nbPlayers}</h2>`;
>>>>>>> 0827d2568e9ba1c7587200c29e413c2f5ffc0968
      setDataRoom(getSessionObject("room").id);

      if (rooms.length == getSessionObject("room").nbPlayers) { // && rooms.host === getSessionObject("user").username : Pour le bouton appuyer

        socket.emit('start-game');

        //ajout du canevas
        document.getElementById("drawGame").innerHTML = `<canvas id="Canva2D" class="border border border-dark"></canvas>`;
        document.getElementById("spec").innerHTML = 
          `<div class="col-lg-2">
          </div>     
          <div class="col-lg-2">
              <h3>Color</h3>
              <input type="color" id="colorpicker" value="#000000" class="colorpicker">
          </div>
          <div class="col-lg-2">
              <h3>Background color</h3>
              <input type="color" value="#ffffff" id="bgcolorpicker" class="colorpicker">
          </div>
          <div class="col-lg-2">
              <h3>Tools(outils)</h3>
              <button id="eraser" class="btn btn-default">Gomme<span class="glyphicon glyphicon-erase" aria-hidden="true"></span></button>
              <button id="clear" class="btn btn-danger">All clear <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></button>
          </div>
          <div class="col-lg-2">
              <h3>Size <span id="showSize">5</span></h3>
              <input type="range" min="1" max="50" value="5" step="1" id="controlSize">
          </div>
          <div class="col-lg-2">
          </div>`;


          //lancement du canavas
          
          canvas();
          //commencer au round 1
          actualRound = 1 - rooms.length;
          onGameStarted();
      }

    });
  }
}

/*function setTurnMessage(classToRemove, classToAdd, html) {
  turnMsg.classList.remove(classToRemove);
  turnMsg.classList.add(classToAdd);
  turnMsg.innerHTML = html;
}*/

async function setDataRoom(id) {
  try {
    const response = await fetch(`/api/rooms/${id}`); // fetch return a promise => we wait for the response

    if (!response.ok) {
      throw new Error(
        "fetch error : " + response.status + " : " + response.statusText
      );
    }
    dataRoom = await response.json(); // json() returns a promise => we wait for the data
    //console.log("room créer", room);

    setSessionObject("room", dataRoom);
  } catch (error) {
    const errorAlert = document.createElement("div");
    errorAlert.className = "alert alert-danger";
    errorAlert.role = "alert";
    const message = document.createElement("a");

    if ((error.status = 401)) {
      message.innerHTML = "user not found";
    }

    errorAlert.appendChild(message);
    formCreate.appendChild(errorAlert);
    console.error("RoomPage::error: ", error);
  }
}

function inGame() {
  let chatForm = document.getElementById('formMsg');
  chatForm.addEventListener('submit', submitMess);

}

//gerer le chat
const submitMess = (e) => {
  e.preventDefault();

  messageUser = e.target.elements.msg.value;
  console.log(messageUser);
  socket.emit('chat', messageUser);

  e.target.elements.msg.value = '';
}

function outputMessage(msg) {
  let messageElement = document.createElement('div');
  let chatWrapper = document.querySelector('.message-container');
        
  messageElement.className = "message";
  messageElement.innerHTML = `<p class="message-text">  ${msg} </p>`;

  chatWrapper.appendChild(messageElement);
  chatWrapper.scrollTo(0, 1000000);
}

function outputRightMessage(msg) {
  let messageElement = document.createElement('div');
  let chatWrapper = document.querySelector('.message-container');
        
  messageElement.className = "message";
  messageElement.innerHTML = `<p class="message-text" style="color:green">  ${msg} </p>`;
  console.log(msg.user);



  chatWrapper.appendChild(messageElement);
  chatWrapper.scrollTo(0, 1000000);
}

const foundRightAnswer =  (msg) => {
  //insertion mot random
  const currentWord = document.querySelector("#currentWord");
      currentWord.innerHTML = " ";
      currentWord.innerHTML = `<h2> La reponse à été trouvé. ${msg} </h2>`;  
       // userNameRightAnswer = 
}


socket.on("message", msg =>{
  console.log(messageUser + " " + wordToFind.word);
  if(messageUser === wordToFind.word){

    outputRightMessage(msg);
    foundRightAnswer(msg);

    //attendre 3 sec avant de lancer un nvx round
setTimeout(onGameStarted, 3000);
  }else{
    outputMessage(msg);
  }
  
  

})

//gerer la recup d'un mot
socket.on("get-word", ({word}) =>{
console.log("mots a trouver:", word.word);
wordToFind = word;
showWord(word);

})

const showWord = (data) => {
  const currentWord = document.querySelector("#currentWord");

  currentWord.innerHTML = `<h2> ${data.word} </h2>`;
}




//gerer les round
socket.on("get-round", () =>{
  const round = document.getElementById("round");
  console.log("round actuel : ", actualRound);
  actualRound++;
  round.innerHTML = `<h2> Round ${actualRound} of ${getSessionObject("room").nbRound} </h2>`

  if(actualRound>getSessionObject("room").nbRound){
    console.log("jeu fini");
  }
})

//gerer le timer
socket.on('reset-timer', () => {
  let time = 15;
  const timer = document.querySelector('#timer');
  timer.innerHTML = `<h2> ${time} secondes</h2>`;
  console.log("timer" , time);

  function diminuerTime(){
      timer.innerHTML = `<h2> ${time} secondes</h2>`;
      time--;

      if(time < 0){
      clearInterval(intervalForTimer);
      onGameStarted();
  }
  }

  clearInterval(intervalForTimer);
  intervalForTimer =  setInterval(diminuerTime, 1000);

})


const onGameStarted = () => {
 // document.getElementById("state").innerHTML = ``;//On remet l'état à "zéro"

  socket.emit('start-timer');

  socket.emit('start-round');

  //recup un mot
  socket.emit('find-word');

}



//gerer le canvas
const canvas = () => {

  //canvas
  let canvas = document.getElementById("Canva2D");
 
      

  var isMouseDown = false;
  //var body = document.getElementsByTagName("body")[0];
  var ctx = canvas.getContext('2d');
  var linesArray = [];
  var currentSize = 5;
  var currentColor = "black";
  var currentBg = "white";

  createCanvas();

  socket.on('mouse', data => {
    console.log("Got: " + data.x + " " + data.y + " " + data.size + " " + data.color);
    ctx.beginPath();
    ctx.lineWidth = data.size;
    ctx.lineCap = "round";
    ctx.strokeStyle = data.color;
    ctx.moveTo(data.x, data.y);
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
  });

  function sendCanvas(xPos, yPos, sizePos, colorPos) {
    console.log("Send: " + xPos + " " + yPos + " " + sizePos + " " + colorPos);
    var data = {
      x: xPos,
      y: yPos,
      size: sizePos,
      color: colorPos
    };

    socket.emit('mouse', (data));
  }

  document.getElementById('colorpicker').addEventListener('change', function () {
    currentColor = this.value;
  });

  document.getElementById('bgcolorpicker').addEventListener('change', function () {
<<<<<<< HEAD
    ctx.fillStyle = this.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    redraw();
    currentBg = ctx.fillStyle;
=======
      ctx.fillStyle = this.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      currentBg = ctx.fillStyle;
>>>>>>> 0827d2568e9ba1c7587200c29e413c2f5ffc0968
  });
  document.getElementById('controlSize').addEventListener('change', function () {
    currentSize = this.value;
    document.getElementById("showSize").innerHTML = this.value;
  });
  document.getElementById('eraser').addEventListener('click', eraser);
  document.getElementById('clear').addEventListener('click', createCanvas);
<<<<<<< HEAD
  //document.getElementById('save').addEventListener('click', save);
  //document.getElementById('load').addEventListener('click', load);
  /*document.getElementById('clearCache').addEventListener('click', function() {
      //localStorage.removeItem("savedCanvas");
      linesArray = [];
      console.log("Cache cleared!");
  });
  */


  function redraw() {
    for (var i = 1; i < linesArray.length; i++) {
      ctx.beginPath();
      ctx.moveTo(linesArray[i - 1].x, linesArray[i - 1].y);
      ctx.lineWidth = linesArray[i].size;
      ctx.lineCap = "round";
      ctx.strokeStyle = linesArray[i].color;
      ctx.lineTo(linesArray[i].x, linesArray[i].y);
      ctx.stroke();
    }
  }

=======
>>>>>>> 0827d2568e9ba1c7587200c29e413c2f5ffc0968
  
  // DRAWING EVENT HANDLERS
  canvas.addEventListener('mousedown', function () { mousedown(canvas, event); });
  canvas.addEventListener('mousemove', function () { mousemove(canvas, event); });
  canvas.addEventListener('mouseup', mouseup);

  // CREATE CANVAS

  function createCanvas() {

    canvas.width = 1100;
    canvas.height = 400;
    canvas.style.zIndex = 8;

    // canvas.style.position = "absolute";
    canvas.style.border = "1px solid";
    ctx.fillStyle = currentBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // fonction gomme (eraser=gomme)
  function eraser() {
    currentSize = 50;
    currentColor = ctx.fillStyle
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function mousedown(canvas, evt) {
<<<<<<< HEAD
    var mousePos = getMousePos(canvas, evt);
    isMouseDown = true
    var currentPosition = getMousePos(canvas, evt);
    ctx.moveTo(currentPosition.x, currentPosition.y)
    ctx.beginPath();
    ctx.lineWidth = currentSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;

      

=======
      var mousePos = getMousePos(canvas, evt);
      isMouseDown = true
      var currentPosition = getMousePos(canvas, evt);
      ctx.moveTo(currentPosition.x, currentPosition.y)
      ctx.beginPath();
      ctx.lineWidth = currentSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = currentColor;
      //sendCanvas(currentPosition.x, currentPosition.y, currentSize, currentColor);
>>>>>>> 0827d2568e9ba1c7587200c29e413c2f5ffc0968
  }

  function mousemove(canvas, evt) {
<<<<<<< HEAD

    if (isMouseDown) {
      var currentPosition = getMousePos(canvas, evt);
      ctx.lineTo(currentPosition.x, currentPosition.y)
      ctx.stroke();
      store(currentPosition.x, currentPosition.y, currentSize, currentColor);
    }
=======
      if (isMouseDown) {
          var currentPosition = getMousePos(canvas, evt);
          ctx.lineTo(currentPosition.x, currentPosition.y)
          ctx.stroke();
          store(currentPosition.x, currentPosition.y, currentSize, currentColor);
          sendCanvas(currentPosition.x, currentPosition.y, currentSize, currentColor);
      }
>>>>>>> 0827d2568e9ba1c7587200c29e413c2f5ffc0968
  }

  // STORE DATA
  function store(x, y, s, c) {
      var line = {
          x: x,
          y: y,
          size: s,
          color: c
      }
      linesArray.push(line);
  }

  

  // ON MOUSE UP

  function mouseup() {
      isMouseDown = false
      store();      
  }
}

socket


export default WaitingGamePage;
