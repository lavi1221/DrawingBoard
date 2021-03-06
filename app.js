const express=require('express');


const app=express();

const server=app.listen(process.env.PORT || 3000,function(){
  console.log("Server running >>>");
});

const io =require("socket.io")(server);

app.use(express.static("public"));
app.use(express.static("views"));

app.get("/",function(req,res){
  res.sendFile("index.html");
});



var line_history=[];
var widtharr=[];
var colorarr=[];
var glowarr=[];
var userarr=[];

io.on("connection",function(socket){
  socket.on('username',function(username){
   socket.username = username;
   userarr.push(username);
   io.emit('is_online', socket.username );
   io.emit('arrive',userarr);

 });
   for(var i in line_history){
     socket.emit("draw_line",{line: line_history[i], width : widtharr[i], color:colorarr[i] , glow:glowarr[i]});
   }

   socket.on("clear",function(text){
     line_history=[];
     var cl='';
     io.emit("clear",cl);
   });

   socket.on("draw_line",function(data){
     line_history.push(data.line);
     widtharr.push(data.width);
     colorarr.push(data.color);
     glowarr.push(data.glow);
     io.emit("draw_line",{line:data.line , width : data.width, color : data.color,glow:data.glow});
   });

  socket.on('disconnect', function(username) {
    const index = userarr.indexOf(socket.username);
     if (index > -1) {
           userarr.splice(index, 1);
      }
        io.emit('is_gone', socket.username);
        io.emit('arrive',userarr);

    });

    socket.on('chat_message', function(message) {
          io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
      });
});
