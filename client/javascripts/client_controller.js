var socket
var sSocket
var coordinates = []
var ships = []
var user
var gameData
var myscore = 0
var oppscore =0
var cont = false
var resultData
var interval
getShip = getShip = (id,ships)=>{
  for(let i=0;i<ships.length;i++){
    if(ships[i].getId()==id){
      console.log('RETURNING SHIP='+ships[i].getId())
      return ships[i]
    }
  }
}
//custom sInterval

Template.home.events({
    "submit .ip-form": (event) => {
      // Prevent default browser form submit
      event.preventDefault()
      // Get value from form element
      var username = event.target.user.value
      //create socket
      // socket = io.connect('169.254.152.170:9999', {forceNew: true})
      socket = io.connect('localhost:9999', {forceNew: true})
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
    $('.name').html("Welcome "+name)
    socket.emit('findOpp')
  })
  socket.on('opponent',(oppname)=>{
    console.log('Opponent= '+oppname)
    $('.wait').css('display','none')
    $('.wait-ready-button').css('display','inline')
    $('.opponent').html('Your opponent: '+oppname)
  })
  socket.on('oppDis',(announce)=>{
    console.log('enter OppDis')
    $('#alert').html(announce)
    $('#notice').html('finding new opponent')
    $('.opponent').html('')
    setTimeout(()=>{
      $('#alert').html('')
      $('#notice').html('')
    }, 3000)
    $('.wait').css({
      'display': 'block'
    })
    $('.wait-ready-button').css({
      'display' : 'none'
    })
  })
})

Template.waitOpponent.events({
  'click .wait-ready-button': (event)=>{
    console.log('Ready clicked')
    event.preventDefault()
    Router.go('/gamesetup')
  }
})
Template.gamesetup.onRendered(()=>{
  clearInterval(interval)
  ships=[]
  coordinates=[]
  socket.on('re_notice',(name)=>{
    console.log('renotice')
    $('#notice').html('The game has been reset by '+name)
  })
  socket.on('oppDis',(announce)=>{
    $('#alert').html(announce)
    $('#notice').html('Your opponent has disconnected. You will be redirect to finding opponent shortly')
    setTimeout(()=>{
      Router.go('/waitOpponent')
    },4000)
  })
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
    if(ships.length < 1){
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
  $('#score').html(gameData.name+' '+gameData.score+' vs '+gameData.oppscore+' '+gameData.oppname)
  $('#oppName').html(gameData.oppname+'\'s ship')
  $('#playerName').html(gameData.name+'\'s ship')
  //random a number

  socket.emit('board init')
  //boolean
  socket.on('first',(first)=>{
    if(first){
      $('#startFirst').html('You start first')
    } else {
      $('#startFirst').html('Your opponent start first')
    }
  })
  socket.on('play',()=>{
    let time = 10
    clearInterval(interval)
    interval = setInterval(()=>{
      $('#timer').html('Time: '+time)
      console.log(time)
      time--
      if(time==0){
        clearInterval(interval)
        $('#timer').html('Time out')
        $('.panel2').unbind()
        $('.panel2').click(()=>{
          $('#notice').html('')
          $('#alert').html('Please wait for your turn!')
        })
        socket.emit('endturn')
      }
    },1000)

    $('#notice').html('Your turn')
    $('#alert').html('')
    console.log('playing')
    $('.panel2').unbind()
    $('.panel2').click((event)=>{
      let dom = event.target || event.src
      let atk = dom.id.toString()
      console.log('attack at '+atk)
      socket.emit('atk',atk)
      clearInterval(interval)
      $('#timer').css({
        'color' : 'red'
      })
      socket.emit('endturn')
      $('#startFirst').html('')
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
    $('#notice').html('Opponent turn')
    $('.panel2').unbind()
    $('.panel2').click(()=>{
      $('#notice').html('')
      $('#alert').html('Please wait for your turn!')
    })
  })
  socket.on('oppDis',(announce)=>{
    $('#alert').html(announce)
    $('#notice').html('Your opponent has disconnected. You will be redirect to finding opponent shortly')
    setTimeout(()=>{
      Router.go('/waitOpponent')
    },4000)

  })
  socket.on('continue',()=>{
    Router.go('/gamesetup')
  })
  socket.on('win',(scores)=>{
    $('#notice').html('You WIN!')
    $('.panel2').unbind()
    $('#score').html(gameData.name+' '+scores[0]+' vs '+scores[1]+' '+gameData.oppname)
    $('.end, .continue').css({
      'display' : 'inline'
    })
  })
  socket.on('lose',(scores)=>{
    $('#alert').html('You LOSE!')
    $('.panel2').unbind()
    $('#score').html(gameData.name+' '+scores[1]+' vs '+scores[0]+' '+gameData.oppname)
    $('.end, .continue').css({
      'display' : 'inline'
    })
  })
  socket.on('reset',()=>{
    clearInterval(interval)
    $('#notice').html('The game has been resetted by the server You will be redirect to gamesetup shortly.')
    setTimeout(()=>{
        Router.go('/gamesetup')
    },4000)
  })
  socket.on('oppEnd',(data)=>{
    Router.go('/result')
    resultData = data
  })
})
Template.game.events({
  'click .reset' : (e)=>{
    clearInterval(interval)
    socket.emit('reset')
    ships = []
    coordinates = []
    Router.go('/gamesetup')
  },
  'click .end' : (e)=>{
    socket.emit('endgame')
  },
  'click .continue' : (e)=>{
    socket.emit('continue')
    ships = []
    coordinates = []
    Router.go('/gamesetup')
  }
})

Template.result.onRendered(()=>{
  if(resultData.uScore > resultData.oScore){
    $('#result').html('YOU WIN')
  } else if (resultData.uScore < resultData.oScore) {
    $('#result').html('YOU LOSE')
  } else {
    $('#result').html('TIE')
  }

  $('#name').html(resultData.name)
  $('#score').html(resultData.uScore)
  $('#oppname').html(resultData.oppname)
  $('#oppscore').html(resultData.oScore)

  $('.restart').click(()=>{
    Router.go('/')
  })
})

Template.server.onRendered(()=>{
  //create sSocket
  sSocket = io.connect('localhost:9999')
  sSocket.emit('addserverGUI')
  sSocket.on('resetAll',()=>{
    $('#notice').html('All games are resetted')
    console.log('All game are resetted')
    setTimeout(()=>{
      $('#notice').html('')
    },4000)
  })
  sSocket.on('updateServer',(data)=>{
    $('#notice').html('')
    let total = data.total
    let names = data.names
    $('#total').html('Total players in the system: '+total)
    $('#name').html('<h2>Online players:</h2>')
    for(let i=0;i<names.length;i++){
      $('#name').append('<h4 id="'+ names[i]+'">'+names[i]+'</h4><br>')
    }
  })
})
Template.server.events({
  'click .reset' : (e)=>{
    console.log('reset all clicked')
    sSocket.emit('resetAll')
  }
})
