Meteor.startup(()=>{
  let server = Meteor.npmRequire('http').createServer()
  let io = Meteor.npmRequire('socket.io')(server)
  let users= []
  let matchs= []
  let id = 1
  let init = 0
  // let ran = 0

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
      let opp = user.getOpponent()
      user.setCoordinates(coordinates)
      console.log(user.getName()+" coordinates are "+coordinates)
      user.status = 'ready'
      if(opp.status == 'ready'){
        console.log('==========commence battle!=========')
        console.log(user.getName()+' VS '+opp.getName())
        let gameData1 = {
          name: user.getName(),
          oppname: opp.getName(),
          yourCoor: user.getCoordinates()
        }
        let gameData2 = {
          name: opp.getName(),
          oppname: user.getName(),
          yourCoor: opp.getCoordinates()
        }
        user.getSocket().emit('gameStart',gameData1)
        user.getOpponent().getSocket().emit('gameStart',gameData2)
      }
    })
    socket.on('board init', ()=>{
      init++
      if(init%2==0){
        let user = getUser(socket)
        let opp = user.getOpponent()
        // if(ran==0){
        //   ran = Math.floor((Math.random() * 2) + 1);
        // }
        let ran = Math.floor((Math.random() * 2) + 1);
        console.log(ran)
        if(ran == 1){
          user.getSocket().emit('first', true)
          opp.getSocket().emit('first',false)
          user.getSocket().emit('play')
          opp.getSocket().emit('wait')
        }else{
          user.getSocket().emit('first', false)
          opp.getSocket().emit('first',true)
          user.getSocket().emit('wait')
          opp.getSocket().emit('play')
        }
      }
    })
    socket.on('atk',(atk)=>{
      let user = getUser(socket)
      let opp = user.getOpponent()
      if(opp.isHit(atk)){
        user.getSocket().emit('atkHit',atk)
        opp.getSocket().emit('hit',atk)
        if(opp.isLost()){
          user.getSocket().emit('win')
          opp.getSocket().emit('lose')
        }
      }else {
        user.getSocket().emit('atkMiss',atk)
        opp.getSocket().emit('miss',atk)
      }
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
