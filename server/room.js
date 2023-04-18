const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: [ 'GET', 'POST' ]
	}
})

io.on('connection', (socket) => {

    socket.emit('sockId', socket.id)

    socket.on('joinRoom', (data) => {
        socket.join(data.roomId)
        socket.to(data.roomId).emit('userJoined', {name : data.name , stream :data.stream , sockId : data.sockId})
    })

    socket.on('getJoined', (data) => {
        socket.to(data.roomId).emit('getJoined' , data.sockId)
    })

    socket.on('sendMyDetails' , (data) =>{
        io.to(data.senderSockId).emit('getDetails', {name : data.name , stream : data.stream , sockId : data.sockId})
    })

    socket.on('leaveCall' , (data) =>{
        socket.to(data.roomId).emit('leftCall', {name : data.name , stream : data.stream , sockId : data.sockId})

        //socket.emit('callEnded')
    })
})

server.listen(5000, () => console.log('server is running on port 5000'))
