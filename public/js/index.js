
document.addEventListener("DOMContentLoaded", function() {
   var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };

   var canvas =document.getElementById("draw");
   var context =canvas.getContext("2d");
   var width   =canvas.width;
   var height  = canvas.height;
   var socket  = io.connect()
  console.log(width + " "+height);
   canvas.onmousedown = function(e){
         mouse.click = true;
    };
    canvas.onmouseup = function(e){
         mouse.click = false;
    };

    canvas.onmousemove = function(e) {
          mouse.pos.x = (e.clientX-315) / width;
          mouse.pos.y = (e.clientY-65) / height;
          mouse.move = true;
     };
     document.getElementById("bn").onclick = function() {
       var text=[];
       context.clearRect(0, 0, canvas.width, canvas.height);
       socket.emit("clear",text);
    };

  socket.on("clear",function(cl){
    context.clearRect(0, 0, canvas.width, canvas.height);
   });
    socket.on('draw_line', function (data) {
         var line = data.line;
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();
   });

   function mainLoop(){
   if(mouse.click && mouse.move && mouse.pos_prev){
      socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
      mouse.move=false;
   }
   mouse.pos_prev={x:mouse.pos.x , y: mouse.pos.y};
   setTimeout(mainLoop,25);
 }

mainLoop();
});
