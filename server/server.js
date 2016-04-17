Meteor.startup(()=>{
  let server = Meteor.npmRequire('http').createServer()
  let io = Meteor.npmRequire('socket.io')(server)
  let users= []
  let matchs= []
  let id = 1

  //helper method for finding current user for each socket
  getUser = (s)=>{
    for(let i=0;i<users.length;i++){
      //user s.conn to compare!!
      // console.log("arr socket id= "+users[i].getSocket().conn)
      // console.log("input socket id= "+s.conn)
      if(users[i].getSocket().conn === s.conn){
        console.log('found user='+users[i].getName())
        return users[i]
      }
    }
    return false;
  }
  findOpp = (s)=>{
    for(let i=0;i<users.length;i++){
      if(users[i].conn != s.conn && users[i].status==0){
        return users[i]
      }
    }
    return false
  }
  //server port here
  server.listen(9999,()=>{
    console.log('listening on port '+9999)
  })
  io.on('connection', (socket)=>{
    socket.on('adduser',(name)=>{
      //new user
      users.push(new User(id,name,socket))
      console.log("New User ="+id+"=="+name)
      socket.room = 'Lobby'
      console.log('User '+name+' has connected.')
      socket.join('Lobby')
      console.log('UPDATE[add_user]: current user in the system= '+users.length)
      id++
    })
    socket.on('getPlayerData',()=>{
      let user = getUser(socket)
      console.log(user.getName())
      socket.emit('playerData', user.getName())
      console.log("sent player data")
    })
    socket.on('findOpp',()=>{
      if(users.length > 1 && users.length %2 == 0){
        let user = getUser(socket)
        let opp = findOpp(socket)
        user.setOpponent(opp)
        opp.setOpponent(user)
        socket.emit('opponent', opp.getName())
        opp.getSocket().emit('opponent', user.getName())
        console.log('[Matchmaking] Success! '+user.getName()+' vs '+opp.getName())
      }
    })
    socket.on('ready',(coordinates)=>{
      let user = getUser(socket)
      user.setCoordinates(coordinates)
      console.log(user.getName()+" coordinates are "+coordinates)
    })
    socket.on('shipdata', (ships)=>{
      console.log(ship)
    })
    socket.on('disconnect', ()=>{
      let user = getUser(socket)
      console.log('User '+user.getName()+' has disconnected')
      let index = users.indexOf(user)
      if (index > -1) {
        users.splice(index, 1);
      }
      console.log('UPDATE[del_user]: current user in the system= '+users.length)
    })

  })
})
