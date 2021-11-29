import { Navbar as BootstrapNavbar } from "bootstrap";


const Navbar = () => {
  const navbarWrapper = document.querySelector("#navbarWrapper");
  let navbar;
  // Get the user object from the localStorage

    navbar = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark" id="navbar">
    <div class="container-fluid">
    <a class="navbar-brand" href="#" data-uri="/">Home</a>
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
  
  navbarWrapper.innerHTML = navbar;
};

export default Navbar;

