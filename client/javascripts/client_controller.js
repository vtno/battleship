var socket
var coordinates = []
var ships = []

class Ship {
  constructor(id, viablePos){
    this.id = id
    this.viablePos = viablePos
    this.state = viablePos[0]
    this.cur = 0
    //create an occupied space of the ship
    console.log('New ship created id=' + id +" "+ viablePos)
  }
  nextState(viablePos){
    this.cur++
    console.log('viablePos length='+ viablePos.length)
    console.log('iterator=' + this.cur)
    if(this.cur>=viablePos.length){
      this.cur = 0
    }
    this.state = viablePos[this.cur]
    console.log('NEXT STATE COMPLETE CURSTATE='+this.state)
  }
  getViablePos(){
    return this.viablePos
  }
  getState(){
    return this.state
  }
  getId(){
    return this.id
  }
}
var viablePos=(id)=>{
  let arr = ['r','t','b','l']
  let row = parseInt(id.charAt(0))
  console.log('row='+row)
  let col = parseInt(id.charAt(1))
  console.log('col='+col)
  if(row+3>7){
    let v = arr.indexOf('b')
    arr.splice(v,1)
    console.log('cannot bottom')
  }
  if(row-3<0){
    let v = arr.indexOf('t')
    arr.splice(v,1)
    console.log('cannot top')
  }
  if(col+3>7){
    let v = arr.indexOf('r')
    arr.splice(v,1)
    console.log('cannot right')
  }
  if(col-3<0){
    let v = arr.indexOf('l')
    arr.splice(v,1)
    console.log('cannot left')
  }
  console.log(arr)
  return arr
}

var checkShip = (id)=>{
  for(let i = 0;i<ships.length;i++){
    console.log('enter checking loop')
    console.log(ships[i].getId())
    if(ships[i].getId()== id){
      console.log('ship id='+id+' exist!')
      return true;
    }
  }
  console.log('ship id='+id+' does not exist!')
  return false
}
var updateShip = (id)=>{
  for(let i = 0;i<ships.length;i++){
    if(ships[i].getId()== id){
      let vp = ships[i].getViablePos()
      ships[i].nextState(vp)
    }
  }
}
var findShip = (id)=>{
  for(let i = 0;i<ships.length;i++){
    if(ships[i].getId()== id){
      return ships[i]
    }
  }
  return 'cannot find ship id='+id
}


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
    if(!checkShip(id)){
      //create new ship
      let ship = new Ship(id, viablePos(id))
      ships.push(ship)
      console.log("new ship id="+ ship.getId())
      console.log("new ship state="+ ship.getState())
      console.log("new ship viablePos"+ ship.getViablePos())
      console.log(ships)
    } else {
      //update ship state
      updateShip(id)
      let s = findShip(id)
      console.log('updated ship id='+s.getId())
      console.log('updated state='+s.getState())
      console.log('updated vialbePos='+s.getViablePos())
      console.log(ships)
    }
    let coordinate = dom.id
    coordinates.push(coordinate)
  }

})
