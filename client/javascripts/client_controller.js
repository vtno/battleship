var socket
var coordinates = []
var ships = []

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
    $('.wait').css('display','none')
    $('.wait-ready-button').css('display','inline')
  })
  socket.on('opponent',(data)=>{
    console.log('Opponent= '+data)
    $('.wait').css('display','none')
    $('.wait-ready-button').css('display','inline')
  })
  socket.on('startgame')
})

Template.waitOpponent.events({
  'click .wait-ready-button': (event)=>{
    console.log('Ready clicked')
    event.preventDefault()
    Router.go('/gamesetup')
  }
})


Template.gamesetup.events({
  "click .panel": (event) => {
    event.preventDefault()
    //find dom id that is clicked
    let dom = event.target || event.src
    let id = dom.id.toString()
    console.log('id='+id+' is clicked')
    //check if the position is viable
    if(!checkShip(id,ships)){
      //create new ship
      let ship = new Ship(id, viablePos(id))
      ships.push(ship)
      console.log("new ship id="+ ship.getId())
      console.log("new ship state="+ ship.getState())
      console.log("new ship viablePos"+ ship.getViablePos())
      console.log(ships)
    } else {
      //update ship state
      updateShip(id,ships)
      let s = findShip(id,ships)
      console.log('updated ship id='+s.getId())
      console.log('updated state='+s.getState())
      console.log('updated vialbePos='+s.getViablePos())
      console.log(ships)
    }
    let coordinate = dom.id
    coordinates.push(coordinate)
  }

})
