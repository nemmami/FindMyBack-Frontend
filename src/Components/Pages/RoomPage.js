import { Redirect } from "../Router/Router";
import Navbar from "../NavBar/Navbar";
import { io } from "socket.io-client";
import { getSessionObject, setSessionObject } from "../../utils/session";
import { removeSessionObject } from "../../utils/session";

let roomPage;

const socket = io("http://localhost:5000");

roomPage = `
<div class="row" id="homePage">
<div class="col"></div>
<div class="col text-center">
    <form class="box">
        <h1>Creer une partie</h1>
        <input type="number" id="round" placeholder="Round : 2-10" required = true min="2" max="10">
    <input type="submit" value="Créer">
    </form>
 </div>
 <div class="col"></div>
 </div>
 `;

function RoomPage() {
  // reset #page div
  removeSessionObject("room");
  const pageDiv = document.querySelector("#page");
  pageDiv.innerHTML = roomPage;
  let form = document.querySelector("form");
  form.addEventListener("submit", onSubmit);

  async function onSubmit(e) {
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
      join();
      Redirect('/waiting');
    } catch (error) {
      const errorAlert = document.createElement("div");
      errorAlert.className = "alert alert-danger";
      errorAlert.role = "alert";
      const message = document.createElement("a");

      if ((error.status = 401)) {
        message.innerHTML = "user not found";
      }

      errorAlert.appendChild(message);
      form.appendChild(errorAlert);
      console.error("RoomPage::error: ", error);
    }
  }

  function join() {
    // user se connecte
    if (getSessionObject("room") !== undefined)
      socket.emit("joinRoom", {
        id: getSessionObject("room").id,
        username: getSessionObject("user").username,
      });
    console.log(getSessionObject("room"));
  }
}

export default RoomPage;
