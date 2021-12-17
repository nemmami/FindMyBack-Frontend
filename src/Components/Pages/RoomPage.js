import { Redirect } from "../Router/Router";
import Navbar from "../NavBar/Navbar";
import { io } from "socket.io-client";
import { getSessionObject, setSessionObject } from "../../utils/session";
import { removeSessionObject } from "../../utils/session";

let roomPage;
// quand on crée/rejoins une room
roomPage = `
<div class="row" id="homePage">
<div class="col"></div>
<div></div>
<div class="col text-center">
    <form class="box" id="create">
        <h1>Creer une partie</h1>
        <input type="number" id="round" placeholder="Round : 2-10" required = true min="2" max="10">
        <input type="number" id="players" require=true value="2" min="2" max="2">
        <input type="submit" value="Créer">
    </form>
 </div>
 <div class="col"></div>
</div>`;


function RoomPage() {
  if (!getSessionObject("user")) return Redirect("/login"); // si user pas connecté

  // reset #page div
  const pageDiv = document.querySelector("#page");
  pageDiv.innerHTML = roomPage;

  let formCreate = document.getElementById("create");
  formCreate.addEventListener("submit", onSubmitFormCreate);

  // si on crée une room
  async function onSubmitFormCreate(e) {
    e.preventDefault();
    // Get the user object from the localStorage
    const nbrRound = document.getElementById("round");
    const nbPlayers = document.getElementById("players");
    const round = parseInt(nbrRound.value);
    const player = parseInt(nbPlayers.value);
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
          Authorization: getSessionObject("user").token,
        },
      };

      const response = await fetch(`/api/rooms/${round}/${player}`, options); // fetch return a promise => we wait for the response

      if (!response.ok) {
        throw new Error(
          "fetch error : " + response.status + " : " + response.statusText
        );
      }
      const room = await response.json(); // json() returns a promise => we wait for the data
      console.log("room créer", room);
      setSessionObject("room", room);
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
}



export default RoomPage;
