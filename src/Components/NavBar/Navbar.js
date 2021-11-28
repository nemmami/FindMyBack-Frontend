import { Navbar as BootstrapNavbar } from "bootstrap";


const Navbar = () => {
  const navbarWrapper = document.querySelector("#navbarWrapper");
  let navbar;
  // Get the user object from the localStorage

    navbar = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark" id="navbar">
    <div class="container-fluid">
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
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <button type="button" class="btn btn-primary" href="#" data-uri="/">Jouer</button>
          </li>
        </ul>

      

        <ul class="navbar-nav">
          <li class="nav-item">
            <button type="button" class="btn btn-secondary" href="#" data-uri="/">Se connecter</button>
          </li>
          <li class="nav-item">
            <button type="button" class="btn btn-secondary" href="#" data-uri="/">S'inscrire</button>
          </li>                    
        </ul>
      </div>
    </div>
  </nav>
  `;
  
  navbarWrapper.innerHTML = navbar;
};

export default Navbar;

