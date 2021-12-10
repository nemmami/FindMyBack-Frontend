import { Redirect } from "../Router/Router";
import Navbar from "../NavBar/Navbar";
import { io } from 'socket.io-client';
import { getSessionObject, setSessionObject } from "../../utils/session";
/**
 * View the Login form :
 * render a login page into the #page div (formerly login function)
 */


let waitingPage;

const socket = io('http://localhost:5000');

function join() {
  // user se connecte
  if(getSessionObject("room") !== undefined)
    socket.emit('joinRoom', { id: getSessionObject("room").id, username: getSessionObject("user").username });
    console.log(getSessionObject("room"));
}
join();
// user se connecte
//socket.emit('joinRoom', { id: getSessionObject("room").id, username: getSessionObject("user").username });

socket.on('connect', () => { // Quand la connexion est établie
  console.log('Socket Client ID:' + socket.id); // 'G5p5...'
  console.log('Socket Connection Established');
  socket.emit(socket.id);
});

waitingPage = `
<div class="row" id="homePage">
<div class="col"></div>
<div class="col text-center">
<form class="box">
  <h1></h1>
  <input type="number" id="nbrRound" placeholder="nombre de round" required = true>
  <input type="submit" value="Ajouter">
</form>
</div>
<div class="col"></div>
</div>
`;

/*
async function addPlayer() {
  if (room.players.length === 0) {
    let table = room.players;
    table.push(user.username);
    console.log(table);

    try {
      const options = {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify({
          players: table,
        }), // body data type must match "Content-Type" header
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `/api/rooms/updatePlayers/${room.id}`,
        options
      ); // fetch return a promise => we wait for the response

      if (!response.ok) {
        throw new Error(
          "fetch error : " + response.status + " : " + response.statusText
        );
      }
      room = await response.json(); // json() returns a promise => we wait for the data
      setSessionObject("room", room);
    } catch (error) {
      const errorAlert = document.createElement("div");
      errorAlert.className = "alert alert-danger";
      errorAlert.role = "alert";
      const message = document.createElement("a");

      if ((error.status = 401)) {
        message.innerHTML = "username or password is incorect";
      }

      errorAlert.appendChild(message);
      form.appendChild(errorAlert);
      console.error("LoginPage::error: ", error);
    }

    // pour mettre a jour les attributs du player
    try {

    } catch(error) {

    }
  }
}
*/

function WaitingGamePage() {
  // reset #page div
  //addPlayer();
  const pageDiv = document.querySelector("#page");
  pageDiv.innerHTML = waitingPage;
  let form = document.querySelector("form");
  form.addEventListener("submit", onSubmit);

  let user = getSessionObject("user");
  let room = getSessionObject("room");

  async function onSubmit(e) {
    e.preventDefault();
    const nbRound = document.getElementById("nbrRound");
    console.log("credentials", nbRound.value);
    try {
      const options = {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify({
          nbRound: parseInt(nbRound.value),
        }), // body data type must match "Content-Type" header
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `/api/rooms/updateNbRound/${room.id}`,
        options
      ); // fetch return a promise => we wait for the response

      if (!response.ok) {
        throw new Error(
          "fetch error : " + response.status + " : " + response.statusText
        );
      }
      room = await response.json(); // json() returns a promise => we wait for the data
      setSessionObject("room", room);
      console.log(getSessionObject("room"));
    } catch (error) {
      const errorAlert = document.createElement("div");
      errorAlert.className = "alert alert-danger";
      errorAlert.role = "alert";
      const message = document.createElement("a");

      if ((error.status = 401)) {
        message.innerHTML = "username or password is incorect";
      }

      errorAlert.appendChild(message);
      form.appendChild(errorAlert);
      console.error("LoginPage::error: ", error);
    }
  }
}

export default WaitingGamePage;
