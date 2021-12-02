import { Navbar as BootstrapNavbar } from "bootstrap";
import homeNavBar from "../../img/homeNavBar.png";
import { getSessionObject } from "../../utils/session";

const Navbar = () => {
  const navbarWrapper = document.querySelector("#navbarWrapper");
  let navbar;
  // Get the user object from the localStorage
  let user = getSessionObject("user");

  if (!user) {
    navbar = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
    <img id="homeLogo" src="${homeNavBar}" alt="homeLogo" href="#" data-uri="/">
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
    <span class="navbar-toggler-icon"></span>
    </button>

    
    
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="#" data-uri="/login">Jouer</a>
        </li>           
      </ul>
    </div>

    <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
		  <ul class="navbar-nav">
			<li class="nav-item">
      <a class="nav-link" href="#" data-uri="/login">Login</a>
			</li>
			<li class="nav-item">
      <a class="nav-link" href="#" data-uri="/register">Register</a>
			</li>			
		  </ul>		  
		</div>
  </div>
  </nav>
  `;
  } else {
    navbar = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
    <img id="homeLogo" src="${homeNavBar}" alt="homeLogo" href="#" data-uri="/">
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
    <span class="navbar-toggler-icon"></span>
    </button>

    
    
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="#" data-uri="/game">Jouer</a>
        </li>           
      </ul>
    </div>

    <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
		  <ul class="navbar-nav">
      <li class="nav-item">
              <a class="nav-item nav-link disabled" href="#">${user.username}</a>
              </li>
      <li class="nav-item">
                <a class="nav-link" href="#" data-uri="/logout">Logout</a>
              </li>
		  </ul>		  
		</div>
  </div>
  </nav>
    `;
  }

  navbarWrapper.innerHTML = navbar;
};

export default Navbar;
