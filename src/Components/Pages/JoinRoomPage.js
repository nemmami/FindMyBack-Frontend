import { Redirect } from "../Router/Router";
import Navbar from "../NavBar/Navbar";
import { io } from "socket.io-client";
import { getSessionObject, setSessionObject } from "../../utils/session";
import { removeSessionObject } from "../../utils/session";


let joinRoomPage;
// quand on crée/rejoins une room
function JoinRoomPage() {
  if (!getSessionObject("user")) return Redirect("/login"); // si user pas connecté

  // reset #page div
  //removeSessionObject("allRoom");
  getAllRooms();
  if (getSessionObject("allRoom") !== undefined && getSessionObject("user") !== undefined) {
    const rooms = getSessionObject("allRoom");
    if (rooms.length > 0) {
      joinRoomPage = ``;
      rooms.forEach((room) => {
        if (room.host !== getSessionObject("user").username) {
          joinRoomPage += `<form id="join">
                            <li class="list-group-item d-flex justify-content-between">
                              <p class="p-0 m-0 flex-grow-1 fw-bold" id="room-dispo">Salon crée par ${room.host} - ${room.id}</p>
                              <input type="submit" class="btn btn-sm btn-success join-room" id="inputJoin" data="${room.id}" value="${room.id}">
                            </li>
                      </form>`;
        }
      });
    }
  }
  const pageDiv = document.querySelector("#page");

  let pageJoin = `
  <div class="container">
    <div class="row">
        <div class="col-lg-2"></div>
        <div class="col-lg-8 text-center" id="formJoin"><h1> Rejoignez une partie</h1> <br> ${joinRoomPage}</div>
        <div class="col-lg-2"></div>
    </div>
  </div> `;
  pageDiv.innerHTML = pageJoin;


  let formJoin = document.getElementById("join");
  formJoin.addEventListener("submit", onSubmitFormJoin);

  
  // si on rejoins une room
  async function onSubmitFormJoin(e) {
    e.preventDefault();
    let user = getSessionObject("user");
    const username = user.username;
    const idFormJoin = document.getElementById("inputJoin").value;
    console.log(idFormJoin);

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

async function getAllRooms() {
  try {
    const options = {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      body: JSON.stringify({
        //username: username,
      }), // body data type must match "Content-Type" header
      headers: {
        "Content-Type": "application/json",
      },
    };
    const reponse = await fetch("api/rooms/");

    if (!reponse.ok) {
      throw new Error(
        "fetch error : " + reponse.status + " : " + reponse.statusText
      );
    }
    const tab = await reponse.json();
    console.log(tab);
    setSessionObject("allRoom", tab);
  } catch (err) {
    console.error("getRooms::error: ", err);
  }
}

export default JoinRoomPage;
