var socket = io.connect('http://localhost:9999/')
socket.on('connect',()=>{
  console.log('socket connected!')
})
Template.home.events({
    "submit .ip-form": (event) => {
      // Prevent default browser form submit
      event.preventDefault()

      // Get value from form element
      var username = event.target.user.value

      console.log('username='+username)

      socket.emit('playerName',{user: username})
      Router.go('/waitOpponent')
      // Clear form
      event.target.user.value = ""

    }
});

Template.waitOpponent.onRendered(()=>{
  console.log('enter waitopp')
  socket.emit("getPlayerData")
  socket.on("playerData",(name)=>{
      $('.name').append("Welcome "+name.user)
  })

})
