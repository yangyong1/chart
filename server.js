/**
 * Created by 37392_000 on 2016/7/24.
 */
// var http = require("http");
//     server = http.createServer(function(request,response){
//         response.writeHeader(200,{"Context-Type":"text/plain"});
//
//         response.write("Hello world!");
//
//         response.end();
//     });
//     server.listen(8800);
//
//     console.log("server start!");

var express = require("express");
    app = express();
    server = require("http").createServer(app);
    io = require("socket.io").listen(server);//引入socket.io模块并绑定到服务器
app.use("/",express.static(__dirname + "/www"));
users = [];//保存所有在线用户的昵称
server.listen(8800);

console.log("server start!");
//socket部分
io.on("connection",function(socket){
    /**
     * 在connection事件的回调函数中，socket表示的是当前连接到服务器的那个客户端。
     * 所以代码socket.emit('foo')则只有自己收得到这个事件，
     * 而socket.broadcast.emit('foo')则表示向除自己外的所有人发送该事件
     * io表示服务器整个socket连接，所以代码io.sockets.emit('foo')表示所有人都可以收到该事件。
     */
    //接收并处理客户端发送的foo事件
    socket.on("login",function(nickname){

        if (users.indexOf(nickname)>-1){
            socket.emit("nicknameExited");
        }else{
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit("loginSuccess");
            console.log("现有用户为:"+users);
            io.sockets.emit("system",nickname,users.length,"login");
        }
    });

    socket.on("disconnect",function () {

        users.splice(socket.userIndex,1);

        socket.broadcast.emit("system",socket.nickname,users.length,"logout");

    });
    //接收到消息通知，分发给出自己以外的其他人
    socket.on("postMsg",function (msg,color) {
        socket.broadcast.emit("newMsg",socket.nickname,msg,color);
    });
    
    //接收图片通知
    socket.on("postImg",function (imgData) {
        socket.broadcast.emit("newImg",socket.nickname,imgData);
    })
});








