import { Navbar as BootstrapNavbar } from "bootstrap";
import { getSessionObject } from "../../utils/session";


let gamePage;

gamePage = ` 
 <div id="screenGame">
 
     
         <div class="row" id="headerGame">
             <div class="col-lg-3" id ="timer"></div>
             <div class="col-lg-5 text-center" id="currentWord"></div>
             <div class="col-lg-3" id ="round"></div>
         </div>
 
         <div class="row" id="bottomGame">
 
             <div class="col-lg-2" id="settingGame">
                <div class="col-lg-2" id="usersGame"><h3>Players</h3></div>
             </div>
 
             <div class="col-lg-8" id="drawGame">
                 
             </div>
 
             <div class="col-lg-2" id="chatGame">
                 <div class="message-container"></div> 
                    <div class="wrapper"> 
                    <form id="send-container">
                         <input type="text" id="message-input">
                         <input type="submit" value="Envoyer">
                     </form>
                   </div>
                 </div>
             </div>

            <div class="row" id="spec">
                 
            </div>
 </div>
  `;

let user = getSessionObject("user");
let wordToFind;
let intervalForTimer;
<<<<<<< HEAD
let joueurs = getSessionObject("room").players;
let joueurDessinateur = 0;
const page = document.querySelector("#page");
=======
let maxRound = 5;



>>>>>>> aa594514a73aa24c670ba28555a4c8fd837fb55c

const GamePage = () => {
    page.innerHTML = gamePage;

    game();

};

function game() {
    for (let i = 1; i < getSessionObject("room").nbRound; i++) {
        console.log(joueurs.length);
        for (let j = 0; j <getSessionObject("room").players.length; j++) {
            joueurs.forEach((e) => {
                console.log(joueurs[joueurDessinateur], e);
                if (joueurs[joueurDessinateur] == e) {
                    dessinateur();
                }
                else {
                    devineur();
                }
            });
            chat();
        }
    }
}

const chat = () => {
    //chat
    //const socket = io('http://localhost:8080');
    const messageForm = document.getElementById('send-container');
    const messageInput = document.getElementById('message-input');

    messageForm.addEventListener('submit', e => {
        e.preventDefault();
        const message = messageInput.value;

        appendMessage(message);
        //socket.emit('send-chat-message', message)
        messageInput.value = ''
    })


    function appendMessage(message) {
        let messageElement = document.createElement('div');
        messageElement.className = "message";
        let chatWrapper = document.querySelector('.message-container');


        //good answer
        if (message === wordToFind.word) {
            messageElement.innerHTML = `<p class="message-text" style="color:green">  ${user.username} : ${message} </p>`;
            foundRightAnswer();
            //attendre 3sec avant prochain mot

            startGame(3000);


        } else {
            messageElement.innerHTML = `<p class="message-text" style="color:red">  ${user.username} : ${message} </p>`;
        };

        console.log(messageElement);

        chatWrapper.appendChild(messageElement);
        chatWrapper.scrollTo(0, 1000000);
    }



}


const getWord = async () => {
    //insertion mot random
    const currentWord = document.querySelector("#currentWord");

    try {// hide data to inform if the pizza menu is already printed
        const response = await fetch("/api/words"); // fetch return a promise => we wait for the response

        if (!response.ok) {
            // status code was not 200, error status code
            throw new Error(
                "fetch error : " + response.status + " : " + response.statusText
            );
        }
        wordToFind = await response.json(); // json() returns a promise => we wait for the data

        console.log(wordToFind);
        currentWord.innerHTML = `<h2> ${wordToFind.word} </h2>`;
    } catch (error) {
        console.error("word::error: ", error);
    }
}

const canvas = () => {
    document.getElementById("drawGame").innerHTML = `<canvas id="Canva2D" class="border border border-dark"></canvas>`;
    
    //canvas
    let canvas = document.getElementById("Canva2D");


    var isMouseDown = false;
    //var body = document.getElementsByTagName("body")[0];
    var ctx = canvas.getContext('2d');
    var linesArray = [];
    var currentSize = 5;
    var currentColor = "black";
    var currentBg = "white";

    createCanvas();

    document.getElementById("spec").innerHTML = `<div class="col-lg-2">
    </div>     
    <div class="col-lg-2">
        <h3>Color</h3>
        <input type="color" id="colorpicker" value="#000000" class="colorpicker">
    </div>

    <div class="col-lg-2">
        <h3>Background color</h3>
        <input type="color" value="#ffffff" id="bgcolorpicker" class="colorpicker">
    </div>

    <div class="col-lg-2">
        <h3>Tools(outils)</h3>
        <button id="eraser" class="btn btn-default">Gomme<span class="glyphicon glyphicon-erase" aria-hidden="true"></span></button>
        <button id="clear" class="btn btn-danger">All clear <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></button>
    </div>

    <div class="col-lg-2">
        <h3>Size <span id="showSize">5</span></h3>
        <input type="range" min="1" max="50" value="5" step="1" id="controlSize">
    </div>
    <div class="col-lg-2">
    </div>`;


    /* document.getElementById('canvasUpdate').addEventListener('click', function() {
        createCanvas();
        redraw();
    }); */

    document.getElementById('colorpicker').addEventListener('change', function () {
        currentColor = this.value;
    });

    document.getElementById('bgcolorpicker').addEventListener('change', function () {
        ctx.fillStyle = this.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        redraw();
        currentBg = ctx.fillStyle;
    });
    document.getElementById('controlSize').addEventListener('change', function () {
        currentSize = this.value;
        document.getElementById("showSize").innerHTML = this.value;
    });

    /*document.getElementById('saveToImage').addEventListener('click', function() {
        downloadCanvas(this, 'canvas', 'masterpiece.png');
    }, false);
    */
    document.getElementById('eraser').addEventListener('click', eraser);
    document.getElementById('clear').addEventListener('click', createCanvas);
    //document.getElementById('save').addEventListener('click', save);
    //document.getElementById('load').addEventListener('click', load);
    /*document.getElementById('clearCache').addEventListener('click', function() {
        //localStorage.removeItem("savedCanvas");
        linesArray = [];
        console.log("Cache cleared!");
    });
    */


    function redraw() {
        for (var i = 1; i < linesArray.length; i++) {
            ctx.beginPath();
            ctx.moveTo(linesArray[i - 1].x, linesArray[i - 1].y);
            ctx.lineWidth = linesArray[i].size;
            ctx.lineCap = "round";
            ctx.strokeStyle = linesArray[i].color;
            ctx.lineTo(linesArray[i].x, linesArray[i].y);
            ctx.stroke();
        }
    }

    // DRAWING EVENT HANDLERS

    canvas.addEventListener('mousedown', function () { mousedown(canvas, event); });
    canvas.addEventListener('mousemove', function () { mousemove(canvas, event); });
    canvas.addEventListener('mouseup', mouseup);

    // CREATE CANVAS

    function createCanvas() {

        canvas.width = 1100;
        canvas.height = 400;
        canvas.style.zIndex = 8;

        // canvas.style.position = "absolute";
        canvas.style.border = "1px solid";
        ctx.fillStyle = currentBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // fonction gomme (eraser=gomme)
    function eraser() {
        currentSize = 50;
        currentColor = ctx.fillStyle
    }



    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }


    function mousedown(canvas, evt) {
        var mousePos = getMousePos(canvas, evt);
        isMouseDown = true
        var currentPosition = getMousePos(canvas, evt);
        ctx.moveTo(currentPosition.x, currentPosition.y)
        ctx.beginPath();
        ctx.lineWidth = currentSize;
        ctx.lineCap = "round";
        ctx.strokeStyle = currentColor;

    }


    function mousemove(canvas, evt) {

        if (isMouseDown) {
            var currentPosition = getMousePos(canvas, evt);
            ctx.lineTo(currentPosition.x, currentPosition.y)
            ctx.stroke();
            store(currentPosition.x, currentPosition.y, currentSize, currentColor);
        }
    }

    // STORE DATA

    function store(x, y, s, c) {
        var line = {
            "x": x,
            "y": y,
            "size": s,
            "color": c
        }
        linesArray.push(line);
    }

    // ON MOUSE UP

    function mouseup() {
        isMouseDown = false
        store()
    }
}

const foundRightAnswer = () => {
    //insertion mot random
    const currentWord = document.querySelector("#currentWord");
    currentWord.innerHTML = " ";
    currentWord.innerHTML = `<h2> ${user.username} a trouvé le mot qui était ${wordToFind.word} </h2>`;
}

const timerFinish = () => {
    //insertion mot random
    const currentWord = document.querySelector("#currentWord");
    currentWord.innerHTML = " ";
    currentWord.innerHTML = `<h2> Le temps est écoulé, le mot à trouver était ${wordToFind.word} </h2>`;
}

const timer = () => {
    let time = 45;
    const timer = document.querySelector('#timer');
    timer.innerHTML = `<h2> ${time} secondes</h2>`;

    function diminuerTime() {
        timer.innerHTML = `<h2> ${time} secondes</h2>`;
        time--;

        if (time < 0) {
            clearInterval(intervalForTimer);
            timerFinish();
            startGame(3000);
        }
    }

    clearInterval(intervalForTimer);
    intervalForTimer = setInterval(diminuerTime, 1000);
}

function startGame(timeWait) {
    setTimeout(clearChat, timeWait);
    setTimeout(getWord, timeWait);
    setTimeout(timer, timeWait);
    setTimeout(canvas, timeWait);
}


function clearChat() {
    let chatWrapper = document.querySelector('.message-container');
    chatWrapper.innerHTML = " ";
}

const dessinateur = () => {
    gamePage = ` 
    <div id="screenGame">
    
        
            <div class="row" id="headerGame">
                <div class="col-lg-3" id ="timer"></div>
                <div class="col-lg-5 text-center" id="currentWord"></div>
                <div class="col-lg-3" id ="round"></div>
            </div>
    
            <div class="row" id="bottomGame">
    
                <div class="col-lg-2" id="settingGame">
                   <div class="col-lg-2" id="usersGame"><h3>Players</h3></div>
                </div>
    
                <div class="col-lg-8" id="drawGame">
                    <canvas id="Canva2D" class="border border border-dark"></canvas>
                </div>
    
                <div class="col-lg-2" id="chatGame">
                    <div class="message-container"></div> 
                       <div class="wrapper"> 
                       <form id="send-container">
                            <input type="text" id="message-input">
                            <input type="submit" value="Envoyer">
                        </form>
                      </div>
                    </div>
                </div>
   
               <div class="row" id="spec">
                    <div class="col-lg-2">
                    </div>     
                    <div class="col-lg-2">
                        <h3>Color</h3>
                        <input type="color" id="colorpicker" value="#000000" class="colorpicker">
                    </div>
   
                    <div class="col-lg-2">
                        <h3>Background color</h3>
                        <input type="color" value="#ffffff" id="bgcolorpicker" class="colorpicker">
                    </div>
            
                    <div class="col-lg-2">
                        <h3>Tools(outils)</h3>
                        <button id="eraser" class="btn btn-default">Gomme<span class="glyphicon glyphicon-erase" aria-hidden="true"></span></button>
                        <button id="clear" class="btn btn-danger">All clear <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></button>
                    </div>
            
                    <div class="col-lg-2">
                        <h3>Size <span id="showSize">5</span></h3>
                        <input type="range" min="1" max="50" value="5" step="1" id="controlSize">
                    </div>
                    <div class="col-lg-2">
                    </div>
             
               </div>
    </div>
     `;
    page.innerHTML = gamePage;
}

const devineur = () => {
    gamePage = ` 
<div id="screenGame">


 <div class="row" id="headerGame">
     <div class="col-lg-3" id ="timer"></div>
     <div class="col-lg-5 text-center" id="currentWord"></div>
     <div class="col-lg-3" id ="round"></div>
 </div>

 <div class="row" id="bottomGame">

     <div class="col-lg-2" id="settingGame">
        <div class="col-lg-2" id="usersGame"><h3>Players</h3></div>
     </div>

     <div class="col-lg-8" id="drawGame">
         <canvas id="Canva2D" class="border border border-dark"></canvas>
     </div>

     <div class="col-lg-2" id="chatGame">
         <div class="message-container"></div> 
            <div class="wrapper"> 
            <form id="send-container">
                 <input type="text" id="message-input">
                 <input type="submit" value="Envoyer">
             </form>
           </div>
         </div>
     </div>
  
    </div>
</div>
`;
    page.innerHTML = gamePage;

}

export default GamePage;