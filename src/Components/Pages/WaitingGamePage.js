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
let drawer = 1;
let players = getSessionObject("room").players;
var motADeviner;

const socket = io("http://localhost:5000");

waitingPage = `
<div id="screenGame">
        <div class="row" id="headerGame">
            <div class="col-lg-3" id ="timer">xx sec</div>
            <div class="col-lg-5 text-center" id="currentWord"></div>
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

      document.getElementById("drawGame").innerHTML = `<h2> Bienvenue dans la liste d'attente attends qu'il y ait le nombre de joueurs nécessaires pour pouvoir lancer la partie ${rooms.length}/${getSessionObject("room").nbPlayers}  </h2>`;

      setDataRoom(getSessionObject("room").id);
      if (rooms.length == getSessionObject("room").nbPlayers) { // && rooms.host === getSessionObject("user").username : Pour le bouton appuyer
        //ajout du canevas
        document.getElementById("drawGame").innerHTML = `<canvas id="Canva2D" class="border border border-dark"></canvas>`;

        for (let i = 1; i <= getSessionObject("room").nbRound; i++) {
          drawer = 0;
          document.getElementById("round").innerHTML = `Round ${i} of ${getSessionObject("room").nbRound}`;
          for (let j = 1; j < getSessionObject("room").nbPlayers + 1; j++) {
            const currentWord = document.querySelector("#currentWord");
            var mot;
            var lgMot=0; 
            players.forEach((e) => {
              if (players[drawer] == e) {
                const getWord = async () => {
                  //insertion mot random
                  try {// hide data to inform if the pizza menu is already printed
                      const response = await fetch("/api/words"); // fetch return a promise => we wait for the response
                
                      if (!response.ok) {
                          // status code was not 200, error status code
                          throw new Error(
                              "fetch error : " + response.status + " : " + response.statusText
                          );
                      }
                      motADeviner = await response.json(); // json() returns a promise => we wait for the data
                      mot = motADeviner.word;
                      lgMot=mot.length;
                      currentWord.innerHTML = `<h2> ${mot} </h2>`;
                  } catch (error) {
                      console.error("word::error: ", error);
                  }
                }
                getWord();
              }
              else {
                for(let k=0; k<lgMot; k++){
                  currentWord.innerHTML += `<h2> - </h2>`;
                }
              }
            });
          }
        }

        //lancement du canavas
        canvas();
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

  const message = e.target.elements.msg.value;
  console.log(message);
  socket.emit('chat', message);

  e.target.elements.msg.value = '';
}


function outputMessage(msg) {
  let messageElement = document.createElement('div');
  let chatWrapper = document.querySelector('.message-container');
  let user = getSessionObject("user");

  messageElement.className = "message";
  messageElement.innerHTML = `<p class="message-text" style="color:green">  ${msg} </p>`;

  chatWrapper.appendChild(messageElement);
  chatWrapper.scrollTo(0, 1000000);
}

socket.on("message", msg => {
  //let chatWrapper = document.querySelector('.message-container');
  console.log("Message : ", msg);
  outputMessage(msg);

})

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


  /* document.getElementById('canvasUpdate').addEventListener('click', function() {
      createCanvas();
      redraw();
  }); */

  document.getElementById('colorpicker').addEventListener('change', function () {
    currentColor = this.value;
  });

  document.getElementById('bgcolorpicker').addEventListener('change', function () {
    ctx.fillStyle = this.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    redraw();
    currentBg = ctx.fillStyle;
  });
  document.getElementById('controlSize').addEventListener('change', function () {
    currentSize = this.value;
    document.getElementById("showSize").innerHTML = this.value;
  });

  /*document.getElementById('saveToImage').addEventListener('click', function() {
      downloadCanvas(this, 'canvas', 'masterpiece.png');
  }, false);
  */
  document.getElementById('eraser').addEventListener('click', eraser);
  document.getElementById('clear').addEventListener('click', createCanvas);
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
    var mousePos = getMousePos(canvas, evt);
    isMouseDown = true
    var currentPosition = getMousePos(canvas, evt);
    ctx.moveTo(currentPosition.x, currentPosition.y)
    ctx.beginPath();
    ctx.lineWidth = currentSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;

  }


  function mousemove(canvas, evt) {

    if (isMouseDown) {
      var currentPosition = getMousePos(canvas, evt);
      ctx.lineTo(currentPosition.x, currentPosition.y)
      ctx.stroke();
      store(currentPosition.x, currentPosition.y, currentSize, currentColor);
    }
  }

  // STORE DATA

  function store(x, y, s, c) {
    var line = {
      "x": x,
      "y": y,
      "size": s,
      "color": c
    }
    linesArray.push(line);


    //tt le monde voit le dessin
    socket.emit('canvas', line);

    socket.on('drawing', line => {
      console.log(line);

    })
  }

  // ON MOUSE UP

  function mouseup() {
    isMouseDown = false
    store()
  }
}



export default WaitingGamePage;
