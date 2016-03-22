Meteor.startup(()=>{
  let server = Meteor.npmRequire('http').createServer()
  let io = Meteor.npmRequire('socket.io')(server)
  let players ={}
  let username = ""
  io.on('connection', (socket)=>{
    socket.on('hello',(data)=>{
      console.log('HELLO BISH')
      console.log(data.text)
    })
    socket.on('playerName',(data)=>{
      console.log(data)
      username = data.user
    })
    socket.on('getPlayerData',()=>{
      socket.emit('playerData',{
        user:username
      })
    })
  })
  server.listen(9999,()=>{
    console.log('listening on port '+9999)
  })
})
