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
let lancerGame = false;
let dataRoom;

const socket = io("http://localhost:5000");

waitingPage = `
<div class="row" id="homePage">
  <div class="col"></div>
  <div class="col text-center">
  <div id="waiting">
    <div id="players"></div>
    <div id="bouton"></div> 
  </div>
  <div id="game">
  </div>
</div>
<div class="col"></div>
</div>
`;

gamePage = ` 
<div id="screenGame">

    
        <div class="row" id="headerGame">
            <div class="col-lg-3" id ="timer"></div>
            <div class="col-lg-5 text-center" id="currentWord"></div>
            <div class="col-lg-3" id ="round">Round 1 of 3</div>
        </div>

        <div class="row" id="bottomGame">

            <div class="col-lg-2" id="settingGame">
               <div class="col-lg-2" id="usersGame"><h3>Players</h3></div>
            </div>

            <div class="col-lg-8" id="drawGame">
                <canvas id="Canva2D" class="border border border-dark"></canvas>
            </div>

            <div class="col-lg-2" id="chatGame">
                <div class="message-container"></div> 
                   <div class="wrapper"> 
                   <form id="send-container">
                        <input type="text" id="message-input">
                        <input type="submit" value="Envoyer">
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



function WaitingGamePage() {
  // reset #page div
  const pageDiv = document.querySelector("#page");
  pageDiv.innerHTML = waitingPage;
  getPlayer();
}

function getPlayer() {
  if (getSessionObject("room") !== undefined) {
    socket.emit("joinRoom", {
      id: getSessionObject("room").id,
      username: getSessionObject("user").username,
    });

    socket.on("playersList", ({ rooms }) => {
      console.log(rooms);
      document.getElementById(
        "players"
      ).innerHTML = ``;
      rooms.forEach((e) => {
        console.log(e);
        document.getElementById(
          "players"
        ).innerHTML += `<li class="list-group-item d-flex justify-content-between">
                      <p class="p-0 m-0 flex-grow-1 fw-bold" id="room-dispo">Joueur - ${e}</p>
                    </li>`;
      });
      
      setDataRoom(getSessionObject("room").id);
      if (rooms.length == getSessionObject("room").nbPlayers) { // && rooms.host === getSessionObject("user").username : Pour le bouton appuyer
        const pageDiv = document.querySelector("#page");
        pageDiv.innerHTML = gamePage;
      }
      
    });
  }
}

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

export default WaitingGamePage;
