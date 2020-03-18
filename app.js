const express=require('express');
const app=express();

const server=app.listen(3000 || process.env.PORT,function(){
  console.log("Server running >>>");
});

const io =require("socket.io")(server);

app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});
var line_history=[];

io.on("connection",function(socket){

   for(var i in line_history){
     socket.emit("draw_line",{line: line_history[i]});
   }

   socket.on("clear",function(text){
     line_history=[];
     var cl='';
     io.emit("clear",cl);
   });

   socket.on("draw_line",function(data){
     line_history.push(data.line);
     io.emit("draw_line",{line:data.line});
   });
});
