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
<form class="box">
  <h1>Salle d'attente</h1>
</form>
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

export default WaitingGamePage;
