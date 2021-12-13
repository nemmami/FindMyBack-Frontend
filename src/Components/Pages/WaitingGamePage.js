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
<div id="screenGame">
        <div class="row" id="headerGame">
            <div class="col-lg-3" id ="timer">xx sec</div>
            <div class="col-lg-5 text-center" id="currentWord">mot a deviner</div>
            <div class="col-lg-3" id ="round">Round 1 of 3</div>
        </div>

        <div class="row" id="bottomGame">
            <div class="col-lg-2" id="settingGame">
               <div class="col-lg-2" id="usersGame"><h3>Players</h3></div>
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
           </div>
</div>
`;

gamePage = ` 
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
      document.getElementById("usersGame").innerHTML = '';
      rooms.forEach((e) => {
        console.log(e);
        document.getElementById("usersGame").innerHTML += 
        `<li class="list-group-item d-flex justify-content-between">
          <p class="p-0 m-0 flex-grow-1 fw-bold" id="room-dispo">Joueur - ${e}</p>
        </li>`;
      });

      document.getElementById("drawGame").innerHTML = `<h2> Binvunue dans la liste d'attente mon gars sûre att qu'il y ai le nombre nsesaire pour pouvoir lancer la partie ${rooms.length}/${getSessionObject("room").nbPlayers}  </h2>`;
      
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

function inGame() {
  let chatForm = document.getElementById('formMsg');
  chatForm.addEventListener('submit', submitMess);
}


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

socket.on("message", msg =>{
  let chatWrapper = document.querySelector('.message-container');
  console.log("Message : ", msg);
  outputMessage(msg);

})

export default WaitingGamePage;
