import { Redirect } from "../Router/Router"

const Footer = () =>{

  const footer = document.querySelector("footer");

  footer.innerHTML = '<button type="button" class="btn btn-primary homepage_play_button mt-5" href="#" data-uri="/contact"">Contact</button>';


  //faire fonctionner le redirect
  footer.querySelectorAll("button").forEach(button=>{
    button.addEventListener("click",(e)=>{
        Redirect(e.target.dataset.uri);
    })
  })
}

export default Footer;