import { Redirect } from "../Router/Router";
import Navbar from "../NavBar/Navbar";
import { io } from "socket.io-client";
import { getSessionObject, setSessionObject } from "../../utils/session";
/**
 * View the Login form :
 * render a login page into the #page div (formerly login function)
 */

let waitingPage;

const socket = io("http://localhost:5000");

waitingPage = `
<div class="row" id="homePage">
  <div class="col"></div>
  <div class="col text-center">
  <div id="waiting"></div>
</div>
<div class="col"></div>
</div>
`;

function WaitingGamePage() {
  // reset #page div
  //addPlayer();

  const pageDiv = document.querySelector("#page");

  pageDiv.innerHTML = waitingPage;
}

if (getSessionObject("room") !== undefined) {
  socket.emit("joinRoom", {
    id: getSessionObject("room").id,
    username: getSessionObject("user").username,
  });

  socket.emit("playerList", getSessionObject("room").id);
  socket.on("list players", (players) => {
    players.forEach((e) => {
      console.log(e);
      document.getElementById(
        "waiting"
      ).innerHTML += `<li class="list-group-item d-flex justify-content-between">
                      <p class="p-0 m-0 flex-grow-1 fw-bold" id="room-dispo">Joueur - ${e}</p>
                    </li>`;
    });
    if (players.length > 1) {
      document.getElementById(
        "waiting"
      ).innerHTML += `<p></p>
                      <input type="submit" class="btn btn-sm btn-success join-room" id="inputJoin" value="Lancer">`;
    }
  });
}

export default WaitingGamePage;
