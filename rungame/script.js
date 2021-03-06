// --- get html elements
var character = document.getElementById("character");
var animal = document.getElementById("animal");

// --- get information labels
var title = document.getElementById("title");
var cyclingSpeed = document.getElementById("cyclingspeed");
var levelSpeed = document.getElementById("levelspeed");
var countdown = document.getElementById("countdown");
var countdownMessage = document.getElementById("countdownmessage");

// --- get start location of the character
var characterLeftStart = parseInt(getComputedStyle(character).getPropertyValue("left"));

// --- variables canvas element
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

// --- variabelen used in game
let gameSpeed = 2;
let randomIndex = 0;
let levelcount = 1;
let characterReset = false;
let counter = 10;
let gameOver = true;
let speed = 0;
let gameStart = false;

cyclingSpeed.innerHTML = `Huidige snelheid: <br>${speed} km/u`;
levelSpeed.innerHTML = "Druk op het scherm om te starten";

// --- array animals
const animals = ["img/icons/test_dog.gif", "img/icons/cat_test.gif"];
const animalTops = [511, 547];

// --- set layers of canvas (the moving background)
const backgroundLayer1 = new Image();
backgroundLayer1.src = 'img/layers/layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'img/layers/layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'img/layers/layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'img/layers/layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'img/layers/layer-5.png';

function startGame(){
    levelSpeed.innerHTML = `Minimum snelheid: <br> ${levelcount + 10} km/u`;
    gameOver = false;
    gameStart = true;
};

function changeSpeed(s){
    speed = s;
};

setInterval(function () {
    if (gameStart) {
        // --- get location values of character
        var characterLeft = parseInt(getComputedStyle(character).getPropertyValue("left"));
        var characterWidth = parseInt(getComputedStyle(character).getPropertyValue("width"));
        var characterHeight = parseInt(getComputedStyle(character).getPropertyValue("height"));
        var characterY = parseInt(getComputedStyle(character).getPropertyValue("top"));

        // --- get location values of the animal (dog is the default animal)
        var dogLeft = parseInt(getComputedStyle(animal).getPropertyValue("left"));
        var dogWidth = parseInt(getComputedStyle(animal).getPropertyValue("width"));
        var dogHeight = parseInt(getComputedStyle(animal).getPropertyValue("height"));
        var dogY = parseInt(getComputedStyle(animal).getPropertyValue("top"));
        var animalImage = document.getElementById("animalImage");

        // --- speed diff
        if ((10 + levelcount) < 25){
            if (speed > 10 + (levelcount)) {
                characterLeft = (characterLeft + (speed - (10 + levelcount)));
                character.style.left = characterLeft + "px";
            }
            if (characterLeft <= 5){
                character.style.left = 5;
            }
            else {
                characterLeft = (characterLeft + (speed - (10 + levelcount)));
                character.style.left = characterLeft + "px";
            } 
        }
        else{
            if (speed > 25) {
                characterLeft = (characterLeft + (speed - 25));
                character.style.left = characterLeft + "px";
            }
            if (characterLeft <= 5){
                character.style.left = 5;
            }
            else {
                characterLeft = (characterLeft + (speed - 25));
                character.style.left = characterLeft + "px";
            } 
        }

        // --- check if the animal div and character div collide
        if (characterLeft < dogLeft + dogWidth &&
            characterLeft - 80 + characterWidth > dogLeft &&
            characterY < dogY + dogHeight &&
            characterY + characterHeight > dogY) 
        {
            // --- collision detected
            // --- collision event + set next level event
            levelcount++;
            title.innerHTML = `level ${levelcount}`;
            character.style.left = characterLeftStart + "px";
            randomIndex = Math.floor(Math.random() * animals.length);
            animalImage.src = animals[randomIndex];
            animal.style.top = animalTops[randomIndex] + "px";
            
            if ((levelcount + 10) > 25){
                levelSpeed.innerHTML = `Minimum snelheid: <br> ${25} km/u`;
            }
            else{
                levelSpeed.innerHTML = `Minimum snelheid: <br> ${levelcount + 10} km/u`;
            }
        }
    
        // --- when no if --> no collision
    }
}, 100);

// --- check every second if speed is slower than levelspeed
setInterval(function () {
    if ((speed < 10 + levelcount) && (!gameOver)){
        counter--
        countdown.innerHTML = counter;

        if (counter == 4 || counter == 5){
            countdown.style.color = "orange";
        }
        else if (counter < 4){
            countdown.style.color = "red";
        }

        if (counter == 0){
            countdownMessage.innerHTML = "Game Over";
            gameOver = true;
            gameObjects.forEach(element => {
                element.speedModifier = 0;
            });
        }
    }
    else if(!gameOver){
        counter = 10;
        countdown.innerHTML = counter;
        countdown.style.color = "white";
    }
}, 1000);

// --- get speed from c# and the sensor
function getSpeed(sensorSpeed) {
    
    if(gameOver){
        speed = 0;
        cyclingSpeed.innerHTML = "Game over";
        levelSpeed.innerHTML = "Game Over";
        return levelcount;
    } else{
        speed = Math.round(sensorSpeed, 0);
        cyclingSpeed.innerHTML = `Huidige snelheid: <br>${speed} km/u`;

        return "on";
    }
}

// --- code used for the background, this is displayed in a canvas
class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.x2 = this.width;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update() {
        this.speed = gameSpeed * this.speedModifier;

        if (this.x <= -this.width) {
            this.x = this.width + this.x2 - this.speed;
        }

        if (this.x2 <= -this.width) {
            this.x2 = this.width + this.x - this.speed;
        }
        this.x = Math.floor(this.x - this.speed);
        this.x2 = Math.floor(this.x2 - this.speed);
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
}


// --- set the speed of the layers
const layer1 = new Layer(backgroundLayer1, 0.1);
const layer2 = new Layer(backgroundLayer2, 0.4);
const layer3 = new Layer(backgroundLayer3, 0.5);
const layer4 = new Layer(backgroundLayer4, 0.8);
const layer5 = new Layer(backgroundLayer5, 1.1);

// --- array of all the layers
const gameObjects = [layer1, layer2, layer3, layer4, layer5];

// --- animate the layers in the canvas
function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    });
    requestAnimationFrame(animate);
};
animate();