var socket
var coordinates = []
var ships = []
var user
var gameData
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
      $('#notice').html('')
      //create new ship
      let ship = new Ship(id, viablePos(id,coordinates))
      if(ships.length<4){
        ships.push(ship)
        //change display on screen
        let cdn = ship.getCoordinates()
        for(let i=0;i<cdn.length;i++){
          coordinates.push(cdn[i])
          // console.log('curren coordinates'+coordinates)
          $('#'+cdn[i]).css({
            'background-color':'green'
          })
        }
      } else {
        $('#alert').html("You already have 4 ships! Please remove one to add new ship.")
      }
      // console.log("new ship id="+ ship.getId())
      // console.log("new ship state="+ ship.getState())
      // console.log("new ship viablePos"+ ship.getViablePos())
      // console.log("get coordinates"+ ship.getCoordinates())
      // console.log(ships)



    } else {
      //delete old coor on screen
      let ship = findShip(id,ships)
      let cdn = ship.getCoordinates()

      for(let i=0;i<cdn.length;i++){
        removeIf(cdn[i],coordinates)
        console.log('curren coordinates'+coordinates)
        $('#'+cdn[i]).css({
          'background-color':'grey'
        })
      }
      console.log("========REMOVED============\n"+cdn)
      //update ship state
      updateShip(id,ships)

      //delete ship if state 0
      if(ship.getState()=='0'){
        removeIf(ship,ships)
        console.log('========SHIP REMOVED===========')
        console.log('ID=' + ship.getId() +" Ship length=" + ships.length)
        $('#notice').html('')
        $('#alert').html('')
      } else {
        //update coor on screen
        ship = findShip(id,ships)
        cdn = ship.getCoordinates()
        // ships.push(ship)
        console.log("========NEW============\n"+cdn)
        for(let i=0;i<cdn.length;i++){
          coordinates.push(cdn[i])
          // console.log('curren coordinates'+coordinates)
          $('#'+cdn[i]).css({
            'background-color':'green'
          })
        }
      }
    }
  },
  'click .setboard': (e) =>{
    if(ships.length < 4){
      $('#alert').html("You only create "+ships.length+"ships You need 4 ship!")
    } else {
      $('#notice').html("Your coordinates are sent to the server.<br> Now waiting for opponent.")
      socket.emit('ready',coordinates)
      socket.on('gameStart',(data)=>{
        //set data for the game
        gameData = data
        Router.go('/game')
      })
    }
  }

})

Template.game.onRendered(()=>{
  //generate user board
  let coor = gameData.yourCoor
  for(let i=0;i<coor.length;i++){
    $('#'+coor[i]).css({
      'background-color' : 'green'
    })
  }
  //random a number

  socket.emit('board init')
  //boolean
  socket.on('first',(first)=>{
    if(first){
      $('#notice').html('You start first')
    } else {
      $('#notice').html('Your opponent start first')
    }
  })
  socket.on('play',()=>{
    console.log('playing')
    $('.panel2').click((event)=>{
      let dom = event.target || event.src
      let atk = dom.id.toString()
      console.log('attack at '+atk)
      socket.emit('atk',atk)
    })
  })
  socket.on('atkHit',(atk)=>{
    console.log('ATK HIT!'+atk)
    $('#'+atk).css({
      'background-color' : 'red'
    })
  })
  socket.on('atkMiss',(atk)=>{
    console.log('ATK MISS='+atk)
    $('#'+atk).css({
      'background-color' : 'black'
    })
  })
  socket.on('hit',(atk)=>{
    console.log('GOT HIT'+atk)
    atk = atk.substring(1)
    $('#'+atk).css({
      'background-color' : 'red'
    })
  })
  socket.on('miss',(atk)=>{
    console.log('OPP MISS'+atk)
    atk = atk.substring(1)
    $('#'+atk).css({
      'background-color' : 'black'
    })
  })
  socket.on('wait',()=>{
    $('.panel2').click(()=>{
      $('#notice').html('')
      $('#alert').html('Please wait for your turn!')
    })
  })
})
