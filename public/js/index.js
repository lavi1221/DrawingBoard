

   var socket  = io.connect();
   var mouse = {
      move:false,
      pos: {x:0, y:0},
      pos_prev:{x:0, y:0}
   };

   var canvas =document.getElementById("draw");
   var context = canvas.getContext("2d");
   var width   = canvas.width;
   var height  = canvas.height;
   context.strokeStyle='white';
   context.shadowColor='blue';
   context.shadowBlur=15;

   context.fillStyle = 'black';
   context.fillRect(0,0,canvas.width,canvas.height);
   context.lineJoin = 'round';


   var linewidth;
   var strokecolor;
   var glow;
   document.getElementById("change").onclick = function() {
     linewidth = document.getElementById('size').value;
     strokecolor= document.getElementById('color').value;
     glow=document.getElementById('glow').value;
   };
   canvas.addEventListener('mousedown',function(event){
     mouse.move = true;
     mouse.pos.x = event.clientX -canvas.offsetLeft;
     mouse.pos.y = event.clientY-canvas.offsetTop;

   });

   canvas.addEventListener('mousemove',function(event){
    if(mouse.move){
      mouse.pos_prev.x=mouse.pos.x;
      mouse.pos.x=event.clientX -canvas.offsetLeft;
      mouse.pos_prev.y=mouse.pos.y;
      mouse.pos.y=event.clientY-canvas.offsetTop;

      socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ], width : linewidth , color:strokecolor ,glow :glow });
    }
   });

   canvas.addEventListener('mouseleave',function(event){
     mouse.move=false;
    });
    canvas.addEventListener('mouseup',function(event){
    mouse.move=false;
    });


     document.getElementById("bn").onclick = function() {
       var text=[];
       context.clearRect(0, 0, canvas.width, canvas.height);
       context.fillStyle = 'black';
       context.fillRect(0,0,canvas.width,canvas.height);
       socket.emit("clear",text);
      };

      socket.on("clear",function(cl){
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.fillRect(0,0,canvas.width,canvas.height);
      });


    socket.on('draw_line', function (data) {
        var line = data.line;
        context.lineWidth=data.width;
        context.strokeStyle=data.color;
        context.shadowColor=data.glow;
        context.shadowBlur=15;
        context.beginPath();
        context.moveTo(line[0].x , line[0].y);
        context.lineTo(line[1].x , line[1].y );
        context.closePath();
        context.stroke();
   });


      canvas.addEventListener('touchstart',function(event){
            mouse.move = true;
            mouse.pos.x = event.touches[0].clientX -canvas.offsetLeft;
            mouse.pos.y = event.touches[0].clientY-canvas.offsetTop;
      });

      canvas.addEventListener('touchend',function(event){
        mouse.move=false;
      });

      canvas.addEventListener('touchcancel',function(event){
        mouse.move=false;
      });

      canvas.addEventListener('touchmove',function(event){
        if(mouse.move){
          mouse.pos_prev.x=mouse.pos.x;
          mouse.pos.x=event.touches[0].clientX -canvas.offsetLeft;
          mouse.pos_prev.y=mouse.pos.y;
          mouse.pos.y=event.touches[0].clientY-canvas.offsetTop;

          socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ], width : linewidth , color:strokecolor ,glow :glow});
          }
      });
