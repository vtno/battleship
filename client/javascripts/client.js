var socket
Template.home.events({
    "submit .ip-form": (event) => {
      // Prevent default browser form submit
      event.preventDefault()

      // Get value from form element
      var username = event.target.user.value
      //create socket
      socket = io.connect('http://localhost:9999/')
      socket.on('connect',()=>{
        console.log('socket connected!')
      })

      console.log('username='+username)

      socket.emit('adduser',{username: username})
      Router.go('/waitOpponent')
      // Clear form
      event.target.user.value = ""

    }
});

Template.waitOpponent.onRendered(()=>{
  console.log('enter waitopp')
  socket.emit("getPlayerData")
  socket.on("playerData",(name)=>{
      $('.name').append("Welcome "+name)
  })
  socket.on('updateLobby',(data)=>{
    console.log('Opponent ='+data)
    socket.emit('ready')
  })
  socket.on('opponent',(data)=>{
    console.log('Opponent= '+data)
  })


})
