/*
0. randomize masses and locations
1. Keep track of score and highScore
2. tbl
3. make a video
4. check for bugs
*/

var score = 0;
var highScore = 10000000;
var scoreDisplay = document.getElementById('score')
var highDisplay = document.getElementById('high')
var momentDisplay = document.getElementById('moment')


function Canvas2D(){
  this._canvas = document.getElementById('canvas');
  this._canvasContext = this._canvas.getContext('2d');
  this._canvas.addEventListener("click", function(e){console.log(e.offsetX,e.offsetY)});
}

Canvas2D.prototype.clear = function(){
  this._canvasContext.clearRect(0,0,this._canvas.width, this._canvas.height)
}

Canvas2D.prototype.drawImage = function(image,position, origin,rotation){

  if (!position){
    position = new Vector2();
  }

  if (!origin){
    origin = new Vector2();
  }
  this._canvasContext.save();
  this._canvasContext.translate(position.x, position.y);
  this._canvasContext.rotate(rotation);
  this._canvasContext.drawImage(image, -origin.x, -origin.y);
  this._canvasContext.restore();
}

let Canvas = new Canvas2D();

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
  sprites.whiteBall = loadSprite('qBall.png');
  sprites.redBall = loadSprite('red.png');
  sprites.blackBall = loadSprite('black.png');
  sprites.yellowBall = loadSprite('yellow.png');
  assetsLoadingLoop(callback);
};

function getBallSpriteByColor(color){
  switch(color){
    case COLOR.RED:
      return sprites.redBall;
    case COLOR.YELLOW:
      return sprites.yellowBall;
    case COLOR.BLACK:
      return sprites.blackBall;
    case COLOR.WHITE:
      return sprites.whiteBall;

  }
}
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

const BALL_INIT_POS = new Vector2(435,435)

function GameWorld(){
  this.reset();
}

GameWorld.prototype.reset = function(){
  function randomPostion() {
    var xPos = Math.random()* 1200 + 200;
    var yPos = Math.random() * 600 + 200;
    return new Vector2(xPos, yPos);
  }
  positions = [];
  function checkValidPos(vector){
    positions.forEach(function(position){
      if (position.distFrom(vector) < 2.5 * BALL_DIAMETER){
        return false;
      }
    })
    return true;
  }
  for(var i = 0; i<4; i++){
    var vector = randomPostion();
    while (!checkValidPos(vector)){
      console.log('sameshit')
      vector = randomPostion();
    }
    positions.push(vector);
  }

  function randomMass(){
    return Math.floor(Math.random() * 21 + 10)/10;
  };
  this.redBall = new Ball(positions[0].copy(),COLOR.RED, randomMass() );
  this.blackBall = new Ball(positions[1].copy(),COLOR.BLACK, randomMass());
  this.yellowBall = new Ball(positions[2].copy(),COLOR.YELLOW, randomMass());
  this.qball = new Ball(positions[3].copy(),COLOR.WHITE, randomMass());
  this.balls = [this.redBall, this.blackBall, this.yellowBall, this.qball];
  this.stick = new Stick(positions[3].copy(), this.qball.shoot.bind(this.qball));
  this.table = {
    TopY:85,
    RightX: 1493,
    BottomY: 785,
    LeftX: 80
  }
}

GameWorld.prototype.handleCollisions = function() {
  for (var i = 0; i<this.balls.length; i++){
    this.balls[i].handleBallInPocket();
    this.balls[i].collidesWith(this.table);
    for (var j = i +1; j <this.balls.length; j++){
      const firstBall = this.balls[i];
      const secondBall = this.balls[j];
      firstBall.collidesWith(secondBall);
    }
  }
  if (document.getElementById("table") == null){
    createTable([
        {Ball: 'Cue', Mass: this.balls[3]['mass'] + ' kg', XVelocity: Math.trunc(this.balls[3]['velocity']['x']*1000)/1000 + 'm/s', YVelocity: Math.trunc(this.balls[3]['velocity']['y']*1000)/1000 + 'm/s', XMomentum: Math.trunc(this.balls[3]['mass']*this.balls[3]['velocity']['x']*1000)/1000 + "kgm/s", YMomentum: Math.trunc(this.balls[3]['mass']*this.balls[3]['velocity']['y']*1000)/1000 + "kgm/s", NetMomentum: Math.trunc(Math.sqrt(Math.pow(this.balls[3]['mass']*this.balls[3]['velocity']['x'], 2) + Math.pow(this.balls[3]['mass']*this.balls[3]['velocity']['y'], 2))*1000)/1000 + 'kgm/s'},
        {Ball: 'Red', Mass: this.balls[0]['mass'] + ' kg', XVelocity: Math.trunc(this.balls[0]['velocity']['x']*1000)/1000 + 'm/s', YVelocity: Math.trunc(this.balls[0]['velocity']['y']*1000)/1000 + 'm/s', XMomentum: Math.trunc(this.balls[0]['mass']*this.balls[0]['velocity']['x']*1000)/1000 + "kgm/s", YMomentum: Math.trunc(this.balls[0]['mass']*this.balls[0]['velocity']['y']*1000)/1000 + "kgm/s", NetMomentum: Math.trunc(Math.sqrt(Math.pow(this.balls[0]['mass']*this.balls[0]['velocity']['x'], 2) + Math.pow(this.balls[0]['mass']*this.balls[0]['velocity']['y'], 2))*1000)/1000 + 'kgm/s'},
        {Ball: 'Yellow', Mass: this.balls[2]['mass'] + ' kg', XVelocity: Math.trunc(this.balls[2]['velocity']['x']*1000)/1000 + 'm/s', YVelocity: Math.trunc(this.balls[2]['velocity']['y']*1000)/1000 + 'm/s', XMomentum: Math.trunc(this.balls[2]['mass']*this.balls[2]['velocity']['x']*1000)/1000 + "kgm/s", YMomentum: Math.trunc(this.balls[2]['mass']*this.balls[2]['velocity']['y']*1000)/1000 + "kgm/s", NetMomentum: Math.trunc(Math.sqrt(Math.pow(this.balls[2]['mass']*this.balls[2]['velocity']['x'], 2) + Math.pow(this.balls[2]['mass']*this.balls[2]['velocity']['y'], 2))*1000)/1000 + 'kgm/s'},
        {Ball: 'Black', Mass: this.balls[1]['mass'] + ' kg', XVelocity: Math.trunc(this.balls[1]['velocity']['x']*1000)/1000 + 'm/s', YVelocity: Math.trunc(this.balls[1]['velocity']['y']*1000)/1000 + 'm/s', XMomentum: Math.trunc(this.balls[1]['mass']*this.balls[1]['velocity']['x']*1000)/1000 + "kgm/s", YMomentum: Math.trunc(this.balls[1]['mass']*this.balls[1]['velocity']['y']*1000)/1000 + "kgm/s", NetMomentum: Math.trunc(Math.sqrt(Math.pow(this.balls[1]['mass']*this.balls[1]['velocity']['x'], 2) + Math.pow(this.balls[2]['mass']*this.balls[2]['velocity']['y'], 2))*1000)/1000 + 'kgm/s'}

    ])  }
    else{
      document.getElementById("table").outerHTML = "";
      createTable([
        {Ball: 'Cue', Mass: this.balls[3]['mass'] + ' kg', XVelocity: Math.trunc(this.balls[3]['velocity']['x']*1000)/1000 + 'm/s', YVelocity: Math.trunc(this.balls[3]['velocity']['y']*1000)/1000 + 'm/s', XMomentum: Math.trunc(this.balls[3]['mass']*this.balls[3]['velocity']['x']*1000)/1000 + "kgm/s", YMomentum: Math.trunc(this.balls[3]['mass']*this.balls[3]['velocity']['y']*1000)/1000 + "kgm/s", NetMomentum: Math.trunc(Math.sqrt(Math.pow(this.balls[3]['mass']*this.balls[3]['velocity']['x'], 2) + Math.pow(this.balls[3]['mass']*this.balls[3]['velocity']['y'], 2))*1000)/1000 + 'kgm/s'},
        {Ball: 'Red', Mass: this.balls[0]['mass'] + ' kg', XVelocity: Math.trunc(this.balls[0]['velocity']['x']*1000)/1000 + 'm/s', YVelocity: Math.trunc(this.balls[0]['velocity']['y']*1000)/1000 + 'm/s', XMomentum: Math.trunc(this.balls[0]['mass']*this.balls[0]['velocity']['x']*1000)/1000 + "kgm/s", YMomentum: Math.trunc(this.balls[0]['mass']*this.balls[0]['velocity']['y']*1000)/1000 + "kgm/s", NetMomentum: Math.trunc(Math.sqrt(Math.pow(this.balls[0]['mass']*this.balls[0]['velocity']['x'], 2) + Math.pow(this.balls[0]['mass']*this.balls[0]['velocity']['y'], 2))*1000)/1000 + 'kgm/s'},
        {Ball: 'Yellow', Mass: this.balls[2]['mass'] + ' kg', XVelocity: Math.trunc(this.balls[2]['velocity']['x']*1000)/1000 + 'm/s', YVelocity: Math.trunc(this.balls[2]['velocity']['y']*1000)/1000 + 'm/s', XMomentum: Math.trunc(this.balls[2]['mass']*this.balls[2]['velocity']['x']*1000)/1000 + "kgm/s", YMomentum: Math.trunc(this.balls[2]['mass']*this.balls[2]['velocity']['y']*1000)/1000 + "kgm/s", NetMomentum: Math.trunc(Math.sqrt(Math.pow(this.balls[2]['mass']*this.balls[2]['velocity']['x'], 2) + Math.pow(this.balls[2]['mass']*this.balls[2]['velocity']['y'], 2))*1000)/1000 + 'kgm/s'},
        {Ball: 'Black', Mass: this.balls[1]['mass'] + ' kg', XVelocity: Math.trunc(this.balls[1]['velocity']['x']*1000)/1000 + 'm/s', YVelocity: Math.trunc(this.balls[1]['velocity']['y']*1000)/1000 + 'm/s', XMomentum: Math.trunc(this.balls[1]['mass']*this.balls[1]['velocity']['x']*1000)/1000 + "kgm/s", YMomentum: Math.trunc(this.balls[1]['mass']*this.balls[1]['velocity']['y']*1000)/1000 + "kgm/s", NetMomentum: Math.trunc(Math.sqrt(Math.pow(this.balls[1]['mass']*this.balls[1]['velocity']['x'], 2) + Math.pow(this.balls[1]['mass']*this.balls[1]['velocity']['y'], 2))*1000)/1000 + 'kgm/s'}

      ])
    }
    momentDisplay.innerHTML = "System Momentum: " + Math.trunc((Math.sqrt(Math.pow(this.balls[3]['mass']*this.balls[3]['velocity']['x'], 2) + Math.pow(this.balls[3]['mass']*this.balls[3]['velocity']['y'], 2)) + Math.sqrt(Math.pow(this.balls[0]['mass']*this.balls[0]['velocity']['x'], 2) + Math.pow(this.balls[0]['mass']*this.balls[0]['velocity']['y'], 2)) + Math.sqrt(Math.pow(this.balls[2]['mass']*this.balls[2]['velocity']['x'], 2) + Math.pow(this.balls[2]['mass']*this.balls[2]['velocity']['y'], 2)) + Math.sqrt(Math.pow(this.balls[1]['mass']*this.balls[1]['velocity']['x'], 2) + Math.pow(this.balls[1]['mass']*this.balls[1]['velocity']['y'], 2)))*1000)/1000 + "kgm/s"

}


GameWorld.prototype.update = function() {
  this.handleCollisions();
  this.stick.update();
  for(var i = 0; i < this.balls.length; i++){
    this.balls[i].update()
  }

  if(!this.ballsMoving() && this.stick.shot){
    this.stick.reposition(this.qball.position);
  }
  var that = this;
  var reset = function(){
    that.reset();
    score = 0;
    scoreDisplay.innerHTML = "Number of Shots: " + score
  }

  if (!this.qball.visible){
    score = "YOU POTTED THE CUE BALL STUPID HEAD";
    scoreDisplay.innerHTML = "Number of Shots: " + score
    console.log(that);
    window.setTimeout(reset, 2000)
  }

  if(!(this.redBall.visible || this.blackBall.visible || this.yellowBall.visible)){
    if(score < highScore){
      highScore = score
      highDisplay.innerHTML = "High Score: " + highScore;
    }
    window.setTimeout(reset,2000);
  }
}

GameWorld.prototype.draw = function(){
  Canvas.drawImage(sprites.background, {x:0, y:0});
  for(var i = 0; i < this.balls.length; i++){
    this.balls[i].draw();
  }
  this.stick.draw();
}

GameWorld.prototype.ballsMoving = function () {
  let ballsMoving = false;
  for(var i =0; i< this.balls.length; i++ ){
    if(this.balls[i].moving){
      ballsMoving = true;
      break;
    }
  }
  return ballsMoving;
};

const STICK_ORIGIN = new Vector2(420,13);
const STICK_SHOT_ORIGIN = new Vector2(400,13);
const MAX_P = 72;
function Stick(position,onShoot){
  this.position = position;
  this.origin = STICK_ORIGIN.copy();
  this.rotation = 0;
  this.momentum = 0;
  this.onShoot = onShoot;
  this.shot = false;
}

Stick.prototype.update = function(position) {
  if (this.shot){
    return;
  }
  if(Mouse._left.down){
    this.increaseMomentum();
  }
  else if(this.momentum>0){
    this.shoot();
    score++;
    scoreDisplay.innerHTML = "Number of Shots: " + score;
  }
  this.updateRotation();
}

Stick.prototype.draw = function(){
  if(this.shot){
    return;
  }
  Canvas.drawImage(sprites.stick, this.position, this.origin, this.rotation);
}

Stick.prototype.updateRotation = function(){
  let opposite = Mouse.position.y - this.position.y;
  let adjacent = Mouse.position.x - this.position.x;
  this.rotation = Math.atan2(opposite,adjacent);
}

Stick.prototype.increaseMomentum = function(){
  if (this.momentum > MAX_P){
    return;
  }
  this.momentum += 1.5;
  this.origin.x += 5;
}

Stick.prototype.shoot = function(){
  this.onShoot(this.momentum, this.rotation);
  this.momentum = 0;
  this.origin = STICK_SHOT_ORIGIN.copy();
  this.shot = true;
}

Stick.prototype.reposition = function(position){
  this.position = position.copy();
  this.origin = STICK_ORIGIN.copy();
  this.shot = false;
}
function Vector2(x=0,y=0){
  this.x = x;
  this.y = y;
}

Vector2.prototype.add = function(vector){
  return new Vector2(this.x+vector.x,this.y+vector.y);
}

Vector2.prototype.addTo = function(vector){
  this.x += vector.x;
  this.y += vector.y;
}

Vector2.prototype.subtract = function(vector){
  return new Vector2(this.x-vector.x,this.y-vector.y);
}

Vector2.prototype.mult = function(scalar){
  return new Vector2(this.x*scalar, this.y*scalar);
}

Vector2.prototype.copy = function () {
  return new Vector2(this.x, this.y);
};

Vector2.prototype.dot = function(vector){
  return this.x * vector.x + this.y * vector.y;
}

Vector2.prototype.length = function () {
  return Math.sqrt(this.x*this.x + this.y*this.y);
};

Vector2.prototype.distFrom = function(vector){
  return this.subtract(vector).length();
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

const COLOR = {RED:1, YELLOW:2,BLACK:3,WHITE:4};
const BALL_ORIGIN = new Vector2(25, 25);
const BALL_DIAMETER = 38;
const BALL_RADIUS = BALL_DIAMETER/2;
function Ball(position,color,mass){
  this.position = position;
  this.velocity = new Vector2();
  this.moving = false;
  this.sprite = getBallSpriteByColor(color);
  this.mass = mass;
  this.visible = true;
}

Ball.prototype.update = function() {
  if(!this.visible){
    return;
  }
  this.position.addTo(this.velocity);
  //friction
  this.velocity  = this.velocity.mult(1 - .01*this.mass);
  if (this.velocity.length()< 0.5){
    this.velocity = new Vector2();
    this.moving = false;
  }

}

Ball.prototype.draw = function(){
  if(!this.visible){
    return;
  }
  Canvas.drawImage(this.sprite, this.position, BALL_ORIGIN);
}

Ball.prototype.shoot = function(momentum,rotation) {
  v = momentum/(this.mass);
  this.velocity = new Vector2(v * Math.cos(rotation), v *   Math.sin(rotation));
  this.moving = true;
};

Ball.prototype.collidesWithBall = function(ball){

  if(!this.visible || !ball.visible){
    return;
  }
  const n = this.position.subtract(ball.position);
  const dist = n.length();

  if (dist > BALL_DIAMETER){
    return;
  }

  const mtd = n.mult((BALL_DIAMETER-dist)/dist);
  this.position = this.position.add(mtd.mult(0.51));
  ball.position = ball.position.subtract(mtd.mult(0.51));

  m1 = new Number( this.mass);
  m2 = new Number( ball.mass);
  v1 = this.velocity.copy();
  v2 = ball.velocity.copy();
  pos1 = this.position.copy();
  pos2 = ball.position.copy();

  const un = n.mult(1/dist);
  const ut = new Vector2(-un.y, un.x);

  const v1n = un.dot(v1);
  const v1t = ut.dot(v1);
  const v2n = un.dot(v2);
  const v2t = ut.dot(v2);

  let v1tS= v1t;
  let v2tS = v2t;
  let v1nS = (v1n*(m1-m2) + v2n*(2*m2))/(m1+m2);
  let v2nS = (v2n*(m2-m1) + v1n*(2*m1))/(m1+m2);

  v1nP = un.mult(v1nS);
  v1tP = ut.mult(v1tS);
  v2nP = un.mult(v2nS);
  v2tP = ut.mult(v2tS);

  this.velocity = v1nP.add(v1tP);
  ball.velocity = v2nP.add(v2tP);

  this.moving = true;
  ball.moving = true;
}

POCKET_RADIUS = 46;
POCKETS = [
  new Vector2(80,80),
  new Vector2(80,785),
  new Vector2(785,60),
  new Vector2(785,800),
  new Vector2(1500,800),
  new Vector2(1500,80),
]

Ball.prototype.handleBallInPocket = function(){
  if(!this.moving || !this.visible){
    return;
  }
  var inPocket = POCKETS.some(pocket => {
    return this.position.distFrom(pocket) < POCKET_RADIUS;
  });

  if(!inPocket){
    return;
  }
  this.visible = false;
  this.moving = false;
  this.velocity = new Vector2(0,0);
}

Ball.prototype.collidesWithTable = function(table){
  if(!this.moving){
    return;
  }

  var collided = false;
  if (this.position.y <= table.TopY + BALL_RADIUS) {
    this.position.y = table.TopY + BALL_RADIUS
    this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
    collided = true;
  }

  if (this.position.x >= table.RightX - BALL_RADIUS) {
    this.position.x = table.RightX - BALL_RADIUS
    this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
    collided = true;
  }

  if (this.position.y >= table.BottomY - BALL_RADIUS) {
    this.position.y = table.BottomY - BALL_RADIUS
    this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
    collided = true;
  }

  if (this.position.x <= table.LeftX + BALL_RADIUS) {
    this.position.x = table.LeftX + BALL_RADIUS
    this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
    collided = true;
  }

  if (collided){
    this.velocity = this.velocity.mult(0.98);
  }

}

Ball.prototype.collidesWith = function(object){
  if(object instanceof Ball){
    this.collidesWithBall(object);
  }
  else{
    this.collidesWithTable(object);
  }
}

function createTable(objectArray, fields, fieldTitles) {
    let body = document.getElementsByTagName('body')[0];
    let tbl = document.createElement('table');
    tbl.setAttribute("style","width: 1500px; height: 200px; text-align:center; font-size: 22px")

    tbl.id = "table";
    let thead = document.createElement('thead');
    let thr = document.createElement('tr');

    for (p in objectArray[0]){
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(p));
        thr.appendChild(th);

    }

    thead.appendChild(thr);
    tbl.appendChild(thead);

    let tbdy = document.createElement('tbody');
    let tr = document.createElement('tr');
    objectArray.forEach((object) => {
        let n = 0;
        let tr = document.createElement('tr');
        for (p in objectArray[0]){
            var td = document.createElement('td');
            td.setAttribute("style","border: 1px solid green");
            td.appendChild(document.createTextNode(object[p]));
            tr.appendChild(td);
            n++;
        };
        tbdy.appendChild(tr);
    });
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
    return tbl;
}
