Meteor.startup(()=>{
  let server = Meteor.npmRequire('http').createServer()
  let io = Meteor.npmRequire('socket.io')(server)
  let users = []
  let id = 1

  getUser = (s)=>{
    for(let i=0;i<users.length;i++){
      //user s.conn to compare!!
      console.log("arr socket id= "+users[i].getSocket().conn)
      console.log("input socket id= "+s.conn)

      if(users[i].getSocket().conn === s.conn){
        console.log('found user='+users[i].getName())
        return users[i]
      }
    }
    return false;
  }
  server.listen(9999,()=>{
    console.log('listening on port '+9999)
  })
  io.on('connection', (socket)=>{
    socket.on('adduser',(name)=>{
      //new user
      socket.name = name
      // let user = new User(id++,name,socket)
      users.push(new User(id,name,socket))
      // console.log(user.getSocket().name)
      console.log("New User ="+id+"=="+name)
      socket.room = 'Lobby'
      console.log('User '+name+' has connected.')
      socket.join('Lobby')
      socket.broadcast.emit('updateLobby', name)
      console.log('current user in the system= '+users.length)
      id++
    })
    socket.on('getPlayerData',()=>{
      let user = getUser(socket)
      console.log(user.getName())
      socket.emit('playerData', user.getName())
      console.log("sent player data")
    })
    socket.on('ready',()=>{
      console.log('[ready]current user in the system= '+users.length)
      socket.broadcast.emit('opponent', getUser(socket).getName())
    })
    socket.on('shipdata', (ships)=>{

    })
    socket.on('disconnect', ()=>{
      let user = getUser(socket)
      console.log(user)
      let index = users.indexOf(user)
      if (index > -1) {
        users.splice(index, 1);
      }
      console.log('User '+user.getName()+' has disconnected')
      console.log('current user in the system= '+users.length)
    })

  })
})
