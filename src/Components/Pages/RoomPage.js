import { Redirect } from "../Router/Router";
import Navbar from "../NavBar/Navbar";
import { getSessionObject, setSessionObject } from "../../utils/session";
import { removeSessionObject } from "../../utils/session";

let roomPage;

roomPage = `
<div class="row" id="homePage">
<div class="col"></div>
<div class="col text-center">
    <form class="box">
        <h1>Creer une partie</h1>
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

      const response = await fetch("/api/rooms/", options); // fetch return a promise => we wait for the response

      if (!response.ok) {
        throw new Error(
          "fetch error : " + response.status + " : " + response.statusText
        );
      }
      const room = await response.json(); // json() returns a promise => we wait for the data
      console.log("room créer", room);
      /*
      console.log(room.id);
      user = getSessionObject("user");
      let tab = room.players.push(user.username);
      console.log(tab);
      console.log("room créer", room);
      */
      setSessionObject("room", room);

      setTimeout(() => Redirect('/waiting'), 3000);
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
}

export default RoomPage;
