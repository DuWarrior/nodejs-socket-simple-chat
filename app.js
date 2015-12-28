var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

/*�����˿�*/
server.listen(3001, function () {
    console.log('listening port: 3001')
});

/*���þ�̬��ԴĿ¼*/
app.use('/static', express.static('static'));

/*Ĭ��·��*/
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


var connectionList = {}; //�洢��ǰ������Ϣ

/*�ͻ��˽�������*/
io.sockets.on('connection', function (socket) {

    var socketId = socket.id;

    /*�ͻ�������ʱ������socketId���û���*/
    connectionList[socketId] = {
        socket: socket
    };

    /* �û����������ң��������û��㲥���û���*/
    socket.on('join', function (data) {
        console.log(data.username + ' join, IP: ' + socket.client.conn.remoteAddress);
        connectionList[socketId].username = data.username;
        socket.broadcast.emit('broadcast_join', data);
    });

    /*�û��뿪�����ң��������û��㲥���뿪*/
    socket.on('disconnect', function () {
        if (connectionList[socketId].username) {
            console.log(connectionList[socketId].username + ' quit');
            socket.broadcast.emit('broadcast_quit', {
                username: connectionList[socketId].username
            });
        }
        delete connectionList[socketId];
    });

    /*�û����ԣ��������û��㲥����Ϣ*/
    socket.on('say', function (data) {
        console.log("Received Message: " + data.text);
        socket.broadcast.emit('broadcast_say', {
            username: connectionList[socketId].username,
            text: data.text
        });
    });


});