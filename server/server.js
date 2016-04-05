Meteor.startup(()=>{
  let server = Meteor.npmRequire('http').createServer()
  let io = Meteor.npmRequire('socket.io')(server)
  let users = []
  let id = 1

  getUser = (socket)=>{
    for(let i=0;i<users.length;i++){
      if(users[i].getSocket()== socket){
        return users[i]
      }
    }
    return false;
  }
  server.listen(9999,()=>{
    console.log('listening on port '+9999)
  })
  io.on('connection', (socket)=>{
    socket.on('adduser',(username)=>{
      //new user
      let user = new User(id++,username,socket)
      users.push(user)
      let name = user.getName()
      console.log("New User ="+id+"=="+name)
      socket.room = 'Lobby'
      console.log('User '+name+' has connected.')
      socket.join('Lobby')
      socket.broadcast.emit('updateLobby', name)
      console.log('current user in the system= '+users.length)
    })
    socket.on('getPlayerData',()=>{
      let user = getUser(socket)
      console.log(user.getName())
      socket.emit('playerData', user.getName())
      console.log("sent player data")
    })
    socket.on('ready',()=>{
      console.log('[ready]current user in the system= '+users.length)
      socket.broadcast.emit('opponent', users[0].username)
      socket.on('shipdata', (ships)=>{

      })
      socket.on('disconnect', ()=>{
        let user = getUser(socket)
        let index = users.indexOf(user)
        if (index > -1) {
          users.splice(index, 1);
        }
        console.log('current user in the system= '+users.length)
      })

    })
  })
})
