let contactPage;

contactPage = `
<div class="row" id="homePage">
<div class="col"></div>
<div class="col text-center">
<form class="boxContactPage">
<h1> A propos de nous</h1>
  <div id="contactText"> 
  <h5> Nous sommes des étudiants en 2ème année d'informatique de gestion à  <a id="linkContact" href="https://www.vinci.be/fr/"> l'institut Paul Lambin. </a></h5>
    <br>
  <h5> Nous avons choisi de créer un jeu multijoueur qui consiste à deviner le mot associé au dessin.
  <br>
  Ce jeu est composé de plusieurs rounds et à chaque tour quelqu'un doit dessiner le mot qui apparait à l'écran. Les autres joueurs doivent le deviner afin de gagner des points.  </h5>

<br>

<h6>Voici les développeurs de ce jeu ainsi que leur email et leur profil github :</h6>

<div id="firstName">
<p>Bostajii Thomas : <br>
 thomas.bostaji@student.vinci.be <br>
<a id="linkContact" href="https://github.com/bostattitude"> github</a></p>
</div>

<div id="firstName">
<p>El Haddadi Haddouchene Bilal : <br>
 bilal.elhaddadi@student.vinci.be <br>
<a id="linkContact" href="https://github.com/billy-20"> github</a></p>
</div>

<div id="firstName">
<p>Nemmaoui Amine : <br>
 amine.nemmaoui@student.vinci.be <br>
<a id="linkContact" href="https://github.com/DonIsmael"> github</a></p>
</div>

<div id="firstName">
<p>De Cock Arnaud : <br>
 arnaud.a.decock@student.vinci.be <br>
 <a id="linkContact" href="https://github.com/prysmmm"> github</a></p>
</div>

  </div>
  
</form>
</div>
<div class="col"></div>
</div>
`;

const ContactPage = () => {
  const page = document.querySelector("#page");
  page.innerHTML = contactPage;
};

export default ContactPage;
