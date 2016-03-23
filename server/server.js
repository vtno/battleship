Meteor.startup(()=>{
  let server = Meteor.npmRequire('http').createServer()
  let io = Meteor.npmRequire('socket.io')(server)
  let users = []
  io.on('connection', (socket)=>{
    users.push(socket)
    socket.on('adduser',(user)=>{
      socket.username = user.username
      console.log(user)
      socket.room = 'Lobby'
      let username = user.username
      console.log('User '+username+' has connected.')
      socket.join('Lobby')
      socket.broadcast.emit('updateLobby', username)
      console.log('current user in the system= '+users.length)

    })
    socket.on('getPlayerData',()=>{
      socket.emit('playerData',socket.username)
    })
    socket.on('ready',()=>{
      console.log('current user in the system= '+users.length)
      socket.broadcast.emit('opponent', users[0].username)
    })
    socket.on('disconnect', ()=>{
      let index = users.indexOf(socket)
      if (index > -1) {
          users.splice(index, 1);
      }
      console.log(socket.username+" has disconnect.")
      console.log('current user in the system= '+users.length)
    })

  })
  server.listen(9999,()=>{
    console.log('listening on port '+9999)
  })
})
