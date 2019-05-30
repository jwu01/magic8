var c = document.getElementById("canvas");
var width = c.getAttribute("width");
var height = c.getAttribute("height");
var ctx = c.getContext("2d");
var cueOffsetX=280;
var cueOffsetY=145;
function setup(){
    var table = new Image();
    table.src = "pool.PNG";
    table.onload = function(){
        ctx.drawImage(table,100,100,800,450);
    }
    var cue = new Image();
    cue.src = "cue.PNG";
    cue.onload = function(){
	ctx.drawImage(cue, 500-cueOffsetX, 325-cueOffsetY,300,300);
    }
    
}

//function cueUp(){
 //   var cue = new Image();
   // cue.src = "cue.PNG";
   // ctx.addEventListener(){
    
    
   // cue.onload = function(){
//	ctx.drawImage(cue, 500, 325,300,300);
  //  }
   
//}
    
setup();
