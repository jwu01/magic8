var c = document.getElementById("canvas");
var width = c.getAttribute("width");
var height = c.getAttribute("height");
var ctx = c.getContext("2d");

function setup(){
    var table = new Image();
    table.src = "pool.PNG";
    table.onload = function(){
        ctx.drawImage(table,20,10,width-100,height-50);
    }
}
