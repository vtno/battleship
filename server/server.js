Meteor.startup(()=>{
  let server = Meteor.npmRequire('http').createServer()
  let io = Meteor.npmRequire('socket.io')(server)
  io.on('connection', (socket)=>{
    socket.on('hello',(data)=>{
      console.log('HELLO BISH')
      console.log(data.text)
    })
  })
  server.listen(9999,()=>{
    console.log('listening on port 9999')
  })
})
