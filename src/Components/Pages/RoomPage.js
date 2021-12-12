import { Redirect } from "../Router/Router";
import Navbar from "../NavBar/Navbar";
import { io } from "socket.io-client";
import { getSessionObject, setSessionObject } from "../../utils/session";
import { removeSessionObject } from "../../utils/session";


const socket = io("http://localhost:5000");

let roomPage;
// quand on crée/rejoins une room
roomPage = `
<div class="row" id="homePage">
<div class="col"></div>
<div class="col text-center">
    <form class="box" id="create">
        <h1>Creer une partie</h1>
        <input type="number" id="round" placeholder="Round : 2-10" required = true min="2" max="10">
        <input type="submit" value="Créer">
    </form>
 </div>
 <div class="col"></div>
</div>`;

function RoomPage() {
  // reset #page div
  removeSessionObject("room");
  const pageDiv = document.querySelector("#page");
  socket.emit("get rooms");
  socket.on("list rooms", (rooms) => {
    if (rooms.length > 0) {
      rooms.forEach((room) => {
        if (room.host !== getSessionObject("user").username) {
          roomPage += `<form id="join">
                            <li class="list-group-item d-flex justify-content-between">
                              <p class="p-0 m-0 flex-grow-1 fw-bold" id="room-dispo">Salon crée par ${room.host} - ${room.id}</p>
                              <input type="submit" class="btn btn-sm btn-success join-room" id="inputJoin" data="${room.id}" value="${room.id}">
                            </li>
                      </form>`;
        }
      });
    }
  });
  pageDiv.innerHTML = roomPage;

  let formCreate = document.getElementById("create");
  formCreate.addEventListener("submit", onSubmitFormCreate);
  let formJoin = document.getElementById("join");
  formJoin.addEventListener("submit", onSubmitFormJoin);

  // si on crée une room
  async function onSubmitFormCreate(e) {
    e.preventDefault();
    // Get the user object from the localStorage
    const nbrRound = document.getElementById("round");
    const round = parseInt(nbrRound.value);
    let user = getSessionObject("user");
    const username = user.username;
    console.log(user);
    console.log("credentials", username);
    try {
      const options = {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify({
          //username: username,
        }), // body data type must match "Content-Type" header
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(`/api/rooms/${round}`, options); // fetch return a promise => we wait for the response

      if (!response.ok) {
        throw new Error(
          "fetch error : " + response.status + " : " + response.statusText
        );
      }
      const room = await response.json(); // json() returns a promise => we wait for the data
      console.log("room créer", room);

      setSessionObject("room", room);
      socket.emit("joinRoom", {
        id: getSessionObject("room").id,
        username: getSessionObject("user").username,
      });
      Redirect("/waiting");
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

  // si on rejoins une room
  async function onSubmitFormJoin(e) {
    e.preventDefault();
    let user = getSessionObject("user");
    const username = user.username;
    const idFormJoin = document.getElementById("inputJoin").value;
    console.log(idFormJoin);
    socket.emit("joinRoom", {
      id: idFormJoin,
      username: username,
    });

    try {
      const response = await fetch(`/api/rooms/${idFormJoin}`); // fetch return a promise => we wait for the response

      if (!response.ok) {
        throw new Error(
          "fetch error : " + response.status + " : " + response.statusText
        );
      }
      const room = await response.json(); // json() returns a promise => we wait for the data
      //console.log("room créer", room);

      setSessionObject("room", room);
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

    Redirect("/waiting");
  }
}

export default RoomPage;
