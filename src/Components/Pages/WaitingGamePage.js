import { io } from "socket.io-client";
import { getSessionObject, setSessionObject } from "../../utils/session";
import { Redirect } from "../Router/Router";
//import imgEnd from "../../img/End.png";
/**
 * View the Login form :
 * render a login page into the #page div (formerly login function)
 */

let waitingPage;
let dataRoom;
let actualRound;
let wordToFind;
let intervalForTimer;
let leDessineur;
let gamerScore = [0, 0];
let gamerRoundPassage = new Array();
let ordrePassage = 0;
let winnerGame;

//jouer qui va commencer a jouer
let messageBeginner;

const socket = io("http://localhost:5000");

waitingPage = `
<div id="screenGame">
  <div class="row" id="headerGame">
    <div class="col-lg-3" id ="timer"></div>
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
    <div class="col-lg-8" id="drawGame"></div>
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
    <div class="col-lg-2"></div>     
    <div class="col-lg-2">
      <h3>Couleur</h3>
      <input type="color" id="colorpicker" value="#000000" class="colorpicker">
    </div>
    <div class="col-lg-2">
      <h3>Couleur de fond</h3>
      <input type="color" value="#ffffff" id="bgcolorpicker" class="colorpicker">
    </div>
            
    <div class="col-lg-2">
      <h3>Outils</h3>
      <button id="eraser" class="btn btn-default">Gomme<span class="glyphicon glyphicon-erase" aria-hidden="true"></span></button>
      <button id="clear" class="btn btn-danger">Effacer tout <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></button>
    </div>
            
    <div class="col-lg-2">
      <h3>Taille crayon <span id="showSize">5</span></h3>
      <input type="range" min="1" max="50" value="5" step="1" id="controlSize">
    </div>
    <div class="col-lg-2"></div>
  </div>
</div>`;

const WaitingGamePage = () => {
  // reset #page div
  const pageDiv = document.querySelector("#page");
  pageDiv.innerHTML = waitingPage;
  getPlayer(); // waiting room
  inGame(); //game page
};

function getPlayer() {
  if (getSessionObject("room") !== undefined) {
    socket.emit("joinRoom", {
      // le joueur rejoins la room
      id: getSessionObject("room").id,
      username: getSessionObject("user").username,
    });

    socket.on("playersList", ({ rooms }) => {
      // on affiche les joueurs present dans la room
      console.log(rooms);
      document.getElementById("usersGameList").innerHTML = "";

      rooms.forEach((e) => {
        console.log("ici le e", e);
        console.log("ici avec le get", getSessionObject("user").username);
        document.getElementById(
          "usersGameList"
        ).innerHTML += `<li class="list-group-item d-flex justify-content-between">
          <p class="p-0 m-0 flex-grow-1 fw-bold" id="room-dispo">Joueur - ${e}</p>
        </li>`;
      });

      document.getElementById(
        "drawGame"
      ).innerHTML = `<h2>Bienvenue dans la liste d'attente. ${rooms.length}/${
        getSessionObject("room").nbPlayers
      }</h2>
      <br>
      <h3> Avant de commencer la partie veuillez introduire 'moi' pour savoir qui va commencer <h3>`;

      setDataRoom(getSessionObject("room").id); // on met a jour la room en memoire

      if (rooms.length == getSessionObject("room").nbPlayers) {
        // on lance la partie
        socket.emit("start-game");

        // on ajoute le canvas
        document.getElementById(
          "drawGame"
        ).innerHTML = `<canvas id="Canva2D" class="border border border-dark"></canvas>`;
        document.getElementById(
          "spec"
        ).innerHTML = `<div class="col-lg-2"></div>     
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
        <div class="col-lg-2"></div>`;

        //commencer au round 1
        actualRound = 1 - rooms.length;

        //gerer le round de passage
        function roundPassage(passage) {
          let numPassage = 1;
          for (let i = 0; i < getSessionObject("room").nbRound + 1; i++) {
            let num = getSessionObject("room").nbPlayers;
            passage[i] = numPassage;

            numPassage++;
            if (numPassage > num) {
              numPassage = 1;
            }
          }
        }

        // remplir la table pour les round
        roundPassage(gamerRoundPassage);

        onGameStarted(); // on lance la partie
      }
    });
  }
}

async function setDataRoom(id) {
  try {
    const response = await fetch(`/api/rooms/${id}`); // fetch return a promise => we wait for the response

    if (!response.ok) {
      throw new Error(
        "fetch error : " + response.status + " : " + response.statusText
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
  let chatForm = document.getElementById("formMsg");
  chatForm.addEventListener("submit", submitMess);
}

//gerer le chat
const submitMess = (e) => {
  e.preventDefault();

  const message = e.target.elements.msg.value;
  console.log("message send", message);
  socket.emit("chat", message);

  e.target.elements.msg.value = "";
};

function outputMessage(msg) {
  let messageElement = document.createElement("div");
  let chatWrapper = document.querySelector(".message-container");

  messageElement.className = "message";
  messageElement.innerHTML = `<p class="message-text">  ${msg.username} : ${msg.txt} </p>`;

  if (msg.txt === "moi") {
    messageBeginner = msg.username;
  }
  console.log(messageBeginner);

  chatWrapper.appendChild(messageElement);
  chatWrapper.scrollTo(0, 1000000);
}

function outputRightMessage(msg) {
  let messageElement = document.createElement("div");
  let chatWrapper = document.querySelector(".message-container");

  messageElement.className = "message";
  messageElement.innerHTML = `<p class="message-text" style="color:green">  ${msg.username} : ${msg.txt} </p>`;
  console.log(msg.username);

  chatWrapper.appendChild(messageElement);
  chatWrapper.scrollTo(0, 1000000);
}

const foundRightAnswer = (msg) => {
  // quand un joueur devine le bon mot
  //insertion mot random
  const currentWord = document.querySelector("#currentWord");
  currentWord.innerHTML = " ";
  currentWord.innerHTML = `<h2> La reponse à été trouvéé par ${msg.username}</h2>`;
};

socket.on("message", (msg) => {
  if (wordToFind !== undefined && msg.txt === wordToFind.word) {
    outputRightMessage(msg);
    foundRightAnswer(msg);

    //joueur 1 trouve le mot
    if (getSessionObject("room").players[0] === msg.username) {
      gamerScore[0] += 1;
      setTimeout(onGameStarted, 3000);
    }

    if (getSessionObject("room").players[1] === msg.username) {
      gamerScore[1] += 1;
      setTimeout(onGameStarted, 3000);
    }
  } else {
    outputMessage(msg);
  }
});

//gerer la recuperation d'un mot
socket.on("get-word", ({ word }) => {
  console.log("mot à trouver:", word.word);
  wordToFind = word;
  showWord(word);
});

const showWord = (data) => {
  leDessineur = gamerRoundPassage[ordrePassage];
  console.log("leDessineur", leDessineur);

  if (messageBeginner === getSessionObject("room").players[leDessineur - 1]) {
    const currentWord = document.querySelector("#currentWord");

    currentWord.innerHTML = `<h2> ${data.word} </h2>`;
  }

  if (messageBeginner !== getSessionObject("room").players[leDessineur - 1]) {
    //mot en _
    let motCacher = " ";
    const currentWord = document.querySelector("#currentWord");
    for (let index = 0; index < data.word.length; index++) {
      motCacher += " _ ";
    }
    console.log("motCacher", motCacher);
    currentWord.innerHTML = `<h2> ${motCacher}  </h2>`;
  }

  ordrePassage++;
};

//gerer score pour endGame
function endGameScore(data) {
  let gagnant = 0;
  if (data[0] > data[1]) {
    gagnant = 0;
  } else {
    gagnant = 1;
  }
  console.log("iciiiii", getSessionObject("room").players[gagnant]);
  winnerGame = getSessionObject("room").players[gagnant];
}

//gerer les round
socket.on("get-round", () => {
  const round = document.getElementById("round");
  console.log("round actuel : ", actualRound);
  actualRound++;
  round.innerHTML = `<h2> Round ${actualRound} of ${
    getSessionObject("room").nbRound
  } </h2>`;

  if (actualRound > getSessionObject("room").nbRound) {
    console.log("jeu fini");

    //lancer methode, voir qui gagne
    endGameScore(gamerScore);
    console.log("enbas la", winnerGame);
    const end = document.getElementById("screenGame");
    end.innerHTML = `<div class="container">
      <div class="row">
        <div class="col-lg-2"></div>
        <div class="col-lg-8 text-center" id="endGamePage">
          <h1>Jeu terminé!</h1>
          <br>
          <h3>Le vainqueur est ${winnerGame}</h3>
        </div>
        <div class="col-lg-2"></div>
      </div>
    </div>`;
    setTimeout(() => Redirect("/"), 10000);
  }
});

//gerer le timer
socket.on("reset-timer", () => {
  let time = 20;
  const timer = document.querySelector("#timer");
  timer.innerHTML = `<h2> ${time} secondes</h2>`;
  console.log("timer", time);

  function diminuerTime() {
    timer.innerHTML = `<h2> ${time} secondes</h2>`;
    time--;

    if (time < 0) {
      clearInterval(intervalForTimer);
      onGameStarted();
    }
  }

  clearInterval(intervalForTimer);
  intervalForTimer = setInterval(diminuerTime, 1000);
});

function onGameStarted() {
  // document.getElementById("state").innerHTML = ``;//On remet l'état à "zéro"

  //lancer le canvas
  canvas();

  socket.emit("start-timer");

  socket.emit("start-round");

  //recup un mot
  socket.emit("find-word");
}

//gerer le canvas
const canvas = () => {
  //canvas
  let canvas = document.getElementById("Canva2D");

  var isMouseDown = false;
  //var body = document.getElementsByTagName("body")[0];
  var ctx = canvas.getContext("2d");
  var linesArray = [];
  var currentSize = 5;
  var currentColor = "black";
  var currentBg = "white";

  createCanvas();

  socket.on("mouse", (data) => {
    // on recupere ce que l'autre joueur dessine sur le canvas
    console.log(
      "Got: " + data.x + " " + data.y + " " + data.size + " " + data.color
    );

    // on affcihe ici le dessin de l'autre joueur
    ctx.beginPath();
    ctx.lineWidth = data.size;
    ctx.lineCap = "round";
    ctx.strokeStyle = data.color;
    ctx.moveTo(data.x, data.y);
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
  });

  function sendCanvas(xPos, yPos, sizePos, colorPos) {
    // on envoie son dessin à l'autre joueur
    console.log("Send: " + xPos + " " + yPos + " " + sizePos + " " + colorPos);
    var data = {
      x: xPos,
      y: yPos,
      size: sizePos,
      color: colorPos,
    };
    socket.emit("mouse", data);
  }

  document
    .getElementById("colorpicker")
    .addEventListener("change", function () {
      currentColor = this.value;
    });

  document
    .getElementById("bgcolorpicker")
    .addEventListener("change", function () {
      ctx.fillStyle = this.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      currentBg = ctx.fillStyle;
    });

  document
    .getElementById("controlSize")
    .addEventListener("change", function () {
      currentSize = this.value;
      document.getElementById("showSize").innerHTML = this.value;
    });

  document.getElementById("eraser").addEventListener("click", eraser);
  document.getElementById("clear").addEventListener("click", createCanvas);

  // DRAWING EVENT HANDLERS
  canvas.addEventListener("mousedown", function () {
    mousedown(canvas, event);
  });

  canvas.addEventListener("mousemove", function () {
    mousemove(canvas, event);
  });

  canvas.addEventListener("mouseup", mouseup);

  // CREATE CANVAS
  function createCanvas() {
    canvas.width = 1100;
    canvas.height = 400;
    canvas.style.zIndex = 8;
    canvas.style.border = "1px solid";
    ctx.fillStyle = currentBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // fonction gomme (eraser=gomme)
  function eraser() {
    currentSize = 50;
    currentColor = ctx.fillStyle;
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }

  function mousedown(canvas, evt) {
    var mousePos = getMousePos(canvas, evt);
    isMouseDown = true;
    var currentPosition = getMousePos(canvas, evt);
    ctx.moveTo(currentPosition.x, currentPosition.y);
    ctx.beginPath();
    ctx.lineWidth = currentSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
  }

  function mousemove(canvas, evt) {
    if (isMouseDown) {
      var currentPosition = getMousePos(canvas, evt);
      ctx.lineTo(currentPosition.x, currentPosition.y);
      ctx.stroke();
      store(currentPosition.x, currentPosition.y, currentSize, currentColor);
      sendCanvas(
        currentPosition.x,
        currentPosition.y,
        currentSize,
        currentColor
      );
    }
  }

  // STORE DATA
  function store(x, y, s, c) {
    var line = {
      x: x,
      y: y,
      size: s,
      color: c,
    };
    linesArray.push(line);
  }

  // ON MOUSE UP
  function mouseup() {
    isMouseDown = false;
    store();
  }
};

export default WaitingGamePage;
