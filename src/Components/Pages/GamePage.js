import { Navbar as BootstrapNavbar } from "bootstrap";

let gamePage;

 gamePage = ` 
<div id="screenGame">
    
        <div class="row" id="headerGame">
            <div class="col-lg-1"></div>
            <div class="col-lg-1" id ="timer">50 sec</div>
            <div class="col-lg-9 text-center" id="currentWord">lee hwek</div>
            <div class="col-lg-1"></div>
        </div>

        <div class="row" id="midGame" >
        <div class="col-lg-1"></div>
            <div class="col-lg-10 " id="usersGame"> settings drawing</div>
            <div class="col-lg-1"></div>
        </div>

        <div class="row" id="bottomGame">

            <div class="col-lg-2" id="settingGame">

                <div id="sidebar">
                    <div class="colorButtons">
                        <h3>Color</h3>
                        <input type="color" id="colorpicker" value="#c81464" class="colorpicker">
                    </div>

                    <div class="colorButtons">
                        <h3>Background color</h3>
                        <input type="color" value="#ffffff" id="bgcolorpicker" class="colorpicker">
                    </div>
            
                    <div class="toolsButtons">
                        <h3>Tools(outils)</h3>
                        <button id="eraser" class="btn btn-default">Gomme<span class="glyphicon glyphicon-erase" aria-hidden="true"></span></button>
                        <button id="clear" class="btn btn-danger">all clear <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></button>
                    </div>
            
                    <div class="buttonSize">
                        <h3>Size <span id="showSize">5</span></h3>
                        <input type="range" min="1" max="50" value="5" step="1" id="controlSize">
                    </div>
                
                </div>
            </div>

            <div class="col" id="drawGame">
                <canvas id="Canva2D" class="border border border-dark"></canvas>
            </div>

            <div class="col-lg-3" id="chatGame">
                <div class="message-container"></div> 
                   <div class="wrapper"> 
                   <form id="send-container">
                        <input type="text" id="message-input">
                        <button type="submit" id="send-button">Send</button>
                    </form>
                </div>
                </div>
        </div>
</div>
 `;

const GamePage = () => {
  const page = document.querySelector("#page");
  page.innerHTML = gamePage;

  //chat
  //const socket = io('http://localhost:8080');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');


messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  
  appendMessage(` ${message}`);
  //socket.emit('send-chat-message', message)
 // messageInput.value = ''
})


function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerText = message;
  console.log(messageElement);

  document.querySelector('.message-container').appendChild(messageElement);
}

//canvas
let canvas = document.getElementById("Canva2D");
let drawGame = document.getElementById("drawGame");
console.log("bababababab" + drawGame.width + drawGame.height);

var isMouseDown=false;
//var body = document.getElementsByTagName("body")[0];
var ctx = canvas.getContext('2d');
var linesArray = [];
var currentSize = 5;
var currentColor = "rgb(200,20,100)";
var currentBg = "white";

createCanvas();


/* document.getElementById('canvasUpdate').addEventListener('click', function() {
    createCanvas();
    redraw();
}); */

document.getElementById('colorpicker').addEventListener('change', function() {
    currentColor = this.value;
});

document.getElementById('bgcolorpicker').addEventListener('change', function() {
    ctx.fillStyle = this.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    redraw();
    currentBg = ctx.fillStyle;
});
document.getElementById('controlSize').addEventListener('change', function() {
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
            ctx.moveTo(linesArray[i-1].x, linesArray[i-1].y);
            ctx.lineWidth  = linesArray[i].size;
            ctx.lineCap = "round";
            ctx.strokeStyle = linesArray[i].color;
            ctx.lineTo(linesArray[i].x, linesArray[i].y);
            ctx.stroke();
        }
}

// DRAWING EVENT HANDLERS

canvas.addEventListener('mousedown', function() {mousedown(canvas, event);});
canvas.addEventListener('mousemove',function() {mousemove(canvas, event);});
canvas.addEventListener('mouseup',mouseup);

// CREATE CANVAS

function createCanvas() {
 
    canvas.width = 650  ;
    canvas.height = 500;
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
    isMouseDown=true
    var currentPosition = getMousePos(canvas, evt);
    ctx.moveTo(currentPosition.x, currentPosition.y)
    ctx.beginPath();
    ctx.lineWidth  = currentSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;

}


function mousemove(canvas, evt) {

    if(isMouseDown){
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
    isMouseDown=false
    store()
}
};





export default GamePage;