import logoNavbar from "../img/FindMyDraw.png";

const homePage = `
<div class="row" id="homePage">
<div class="col-6 col-md-4"></div>
<div class="col-6 col-md-4 text-center">
    <img id="logo" class="mt-2 mb-3" src="${logoNavbar}" alt="logo">
    <h1 id="titleHomePage" class="display-2 mb-2 mb-md-5 text-center">Let's Find The Drawings</h1>
    <button type="button" class="btn btn-primary homepage_play_button mt-5" href="#" data-uri="/">Jouer</button>
</div>
<div class="col-6 col-md-4"></div>
</div>
 `;

const HomePage = () => {
  const page = document.querySelector("#page");
  page.innerHTML = homePage;
};


const colors = [
  '#2196f3',
  '#e91e63',
  '#ffeb3b',
  '#74ff1d'
]

function createSquare(){
 const page = document.querySelector('#page');
 const square = document.createElement('span');

 let pageWidth = page.clientWidth;
 let pageHeight = page.clientWidth;

 var size = Math.random() * 20;

 square.style.width = 20 + size + 'px';
 square.style.height = 20 + size + 'px';

 square.style.top = Math.random() * pageHeight + 'px';
 square.style.left = Math.random() * pageWidth + 'px';

 const bg = colors[Math.floor(Math.random() * colors.length)];

 square.style.background = bg;

 page.appendChild(square);
 
 setTimeout(() =>{
   square.remove()
 },50000)
}

setInterval(createSquare, 50);

export default HomePage;