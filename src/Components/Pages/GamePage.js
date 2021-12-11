import { Navbar as BootstrapNavbar } from "bootstrap";

let gamePage;


 gamePage = ` 
<div class="row" id="homePage">
<div class="col"></div>
<div class="col text-center">

<h1 id="titleHomePage" class="display-2 mb-2 mb-md-5 text-center">Commençons le jeu</h1>
    
</div>
<div class="col"></div>
</div>
 `;

const GamePage = () => {
  const page = document.querySelector("#page");
  page.innerHTML = gamePage;
};

export default GamePage;