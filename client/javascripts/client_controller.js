var socket
var coordinates = []
var ships = []
var user
getShip = getShip = (id,ships)=>{
  for(let i=0;i<ships.length;i++){
    if(ships[i].getId()==id){
      console.log('RETURNING SHIP='+ships[i].getId())
      return ships[i]
    }
  }
}
Template.home.events({
    "submit .ip-form": (event) => {
      // Prevent default browser form submit
      event.preventDefault()
      // Get value from form element
      var username = event.target.user.value
      //create socket
      socket = io.connect('http://localhost:9999/', {forceNew: true})
      socket.on('connect',()=>{
        console.log('socket connected!')
      })
      socket.emit('adduser',username)
      Router.go('/waitOpponent')
      // Clear form
      event.target.user.value = ""
    }
});

Template.waitOpponent.onRendered(()=>{
  console.log('enter waitopp')
  socket.emit("getPlayerData")
  socket.on("playerData",(name)=>{
    user = new User(1,name,socket)
    $('.name').append("Welcome "+name)
    socket.emit('findOpp')
  })
  socket.on('opponent',(oppname)=>{
    console.log('Opponent= '+oppname)
    $('.wait').css('display','none')
    $('.wait-ready-button').css('display','inline')
    $('.opponent').append('Your opponent: '+oppname)
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
      let ship = new Ship(id, viablePos(id,coordinates))
      ships.push(ship)
      console.log("new ship id="+ ship.getId())
      console.log("new ship state="+ ship.getState())
      console.log("new ship viablePos"+ ship.getViablePos())
      console.log("get coordinates"+ ship.getCoordinates())
      console.log(ships)
      //change display on screen
      let cdn = ship.getCoordinates()
      for(let i=0;i<cdn.length;i++){
        coordinates.push(cdn[i])
        console.log('curren coordinates'+coordinates)
        let tile = document.getElementById(cdn[i])
        tile.innerHTML = '1'
      }
    } else {
      //delete old coor on screen
      let ship = getShip(id,ships)
      let cdn = ship.getCoordinates()
      for(let i=0;i<cdn.length;i++){
        coordinates.removeIf(cdn[i])
        console.log('curren coordinates'+coordinates)
        let tile = document.getElementById(cdn[i])
        tile.innerHTML = '0'
      }
      //update ship state
      updateShip(id,ships)
      //change display on screen
      //send the update state to the server
      let s = findShip(id,ships)
      console.log('updated ship id='+s.getId())
      console.log('updated state='+s.getState())
      console.log('updated vialbePos='+s.getViablePos())
      console.log(ships)
    }
  },
  'click .setboard': (e) =>{
    socket.emit('ready',ships)
  }

})
