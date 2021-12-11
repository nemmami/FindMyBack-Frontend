import { Redirect } from "../Router/Router";
import Navbar from "../NavBar/Navbar";
import { getSessionObject, setSessionObject } from "../../utils/session";
/**
 * View the Login form :
 * render a login page into the #page div (formerly login function)
 */
let loginPage;

loginPage = `
<div class="row" id="homePage">
<div class="col"></div>
<div class="col text-center">
<form class="box">
  <h1> Login</h1>
  <input type="text" id="username" placeholder="Username" required = true>
  <input type="password" id="password" placeholder="Password">
  <input type="submit" value="Login">
</form>

</div>
<div class="col"></div>
</div>
`;

function LoginPage() {
  // reset #page div
  const pageDiv = document.querySelector("#page");
  pageDiv.innerHTML = loginPage;
  let form = document.querySelector("form");
  form.addEventListener("submit", onSubmit);

  async function onSubmit(e) {
    e.preventDefault();
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    console.log("credentials", username.value, password.value);
    try {
      const options = {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }), // body data type must match "Content-Type" header
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("/api/auths/login", options); // fetch return a promise => we wait for the response

      if (!response.ok) {
        throw new Error(
          "fetch error : " + response.status + " : " + response.statusText
        );
      }
      const user = await response.json(); // json() returns a promise => we wait for the data
      console.log("user authenticated", user);
      // save the user into the localStorage
      setSessionObject("user", user);

      // Rerender the navbar for an authenticated user : temporary step prior to deal with token
      Navbar({ isAuthenticated: true });

      // call the HomePage via the Router
      Redirect("/");
    } catch (error) {
        const errorAlert = document.createElement("div");
        errorAlert.className = "alert alert-danger";
        errorAlert.role = "alert";
        const message = document.createElement("a");
         
        if(error.status = 401){
          message.innerHTML = "username or password is incorect";
        }
        
        errorAlert.appendChild(message);
        form.appendChild(errorAlert);
      console.error("LoginPage::error: ", error);
      
    }
  }
}

export default LoginPage;
