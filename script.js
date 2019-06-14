function Canvas2D(){
  this._canvas = document.getElementById('canvas');
  this._canvasContext = this._canvas.getContext('2d');
}

Canvas2D.prototype.clear = function(){
  this._canvasContext.clearRect(0,0,this._canvas.width, this._canvas.height)
}

Canvas2D.prototype.drawImage = function(image,position, origin){

  if (!position){
    position = new Vector2();
  }

  if (!origin){
    origin = new Vector2();
  }
  this._canvasContext.save();
  this._canvasContext.translate(position.x, position.y);
  this._canvasContext.drawImage(image, -origin.x, -origin.y);
  this._canvasContext.restore();
}

let Canvas = new Canvas2D();
//let image = new Image();
//image.src = "pool.png"
//setTimeout( () =>{
//  Canvas.drawImage(image,{x:0,y:0});
//}, 1000);



let sprites = {};
let assetsStillLoading = 0;
function assetsLoadingLoop(callback){
  if(assetsStillLoading != 0){
    requestAnimationFrame(assetsLoadingLoop.bind(this, callback));
  }
  else{
    callback();
  }
};

function loadAssets(callback){
  function loadSprite(file){
    assetsStillLoading++;
    let spriteImage = new Image();
    spriteImage.src = file;
    spriteImage.onload = function(){
      assetsStillLoading--;
    }
    return spriteImage;
  }
  sprites.background = loadSprite('pool.png');
  sprites.stick = loadSprite('cue.png');
  sprites.whiteBall = loadSprite();
  assetsLoadingLoop(callback);
};

function Game(){

}

Game.prototype.init = function(){
  this.gameWorld = new GameWorld();
}

Game.prototype.start = function(){
  PoolGame.init();
  PoolGame.mainLoop();

}

Game.prototype.mainLoop = function(){
  Canvas.clear();
  PoolGame.gameWorld.update();
  PoolGame.gameWorld.draw();
  Mouse.reset();

  requestAnimationFrame(PoolGame.mainLoop);
}

let PoolGame = new Game();

function GameWorld(){
  this.stick = new Stick();
}

GameWorld.prototype.update = function() {
  this.stick.update();
}

GameWorld.prototype.draw = function(){
  Canvas.drawImage(sprites.background, {x:0, y:0});
  this.stick.draw();
}

function Stick(){
  this.position = new Vector2(400, 400);
  this.origin =  new Vector2(400, 10);
}

Stick.prototype.update = function() {
  this.position = Mouse.position;
  if(Mouse._left.pressed){
    console.log("left nigga");
  }
}

Stick.prototype.draw = function(){
  Canvas.drawImage(sprites.stick, this.position, this.origin);
}

function Vector2(x,y){
  this.x = typeof x !== 'undefined' ? x : 0;
  this.y = typeof y !== 'undefined' ? y: 0;
}

function ButtonState(){
  this.down = false;
  this.pressed = false;
}

function handleMouseMove(evt){
  let x = evt.pageX;
  let y = evt.pageY;

  Mouse.position = new Vector2(x, y);
}

function handleMouseDown(evt){
  handleMouseMove(evt);
  if (evt.which === 1) {
        if (!Mouse._left.down)
            Mouse._left.pressed = true;
        Mouse._left.down = true;
    } else if (evt.which === 2) {
        if (!Mouse._middle.down)
            Mouse._middle.pressed = true;
        Mouse._middle.down = true;
    } else if (evt.which === 3) {
        if (!Mouse._right.down)
            Mouse._right.pressed = true;
        Mouse._right.down = true;
    }
}

function handleMouseUp(evt){
  handleMouseMove(evt);
  if (evt.which === 1)
      Mouse._left.down = false;
  else if (evt.which === 2)
      Mouse._middle.down = false;
  else if (evt.which === 3)
      Mouse._right.down = false;
}

function MouseHandler(){
  this._left = new ButtonState();
  this._middle = new ButtonState();
  this._right = new ButtonState();

  this.position = new Vector2();

  document.onmousemove = handleMouseMove;
  document.onmousedown = handleMouseDown;
  document.onmouseup = handleMouseUp;
}

MouseHandler.prototype.reset = function(){
  this._left.pressed = false;
  this._middle.pressed = false;
  this._right.pressed = false;
}

let Mouse = new MouseHandler();

const BALL_ORIGIN = new Vector2(25, 25);

function Ball(position){
  this.position = position;
}

Ball.prototype.update = function() {

}

Ball.prototype.draw = function(){
  Canvas.draw
}

//
