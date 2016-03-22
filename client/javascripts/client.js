var socket = io.connect('http://localhost:9999/')
socket.on('connect',()=>{
  console.log('socket connected!')
})
socket.emit('hello', {text: "yeaahhhh"})
Template.home.events({
    "submit .ip-form": (event) => {
      // Prevent default browser form submit
      event.preventDefault()

      // Get value from form element
      var ip = event.target.ip.value;
      var port = event.target.port.value;
      console.log(ip)
      console.log(port)


      //Sent value to wait opponent page
      RoutingInfo.insert({
        ip: ip,
        port: port,
        createAt: new Date()
      })
      console.log('insert success')
      console.log('ip='+ip)
      console.log('port='+port)
      Router.go('/waitOpponent')
      // Clear form
      event.target.ip.value = ""
      event.target.port.value = ""

    }
});
Template.waitOpponent.helpers({
  routingData: ()=>{
    // return RoutingInfo.find({})
    console.log(RoutingInfo.findOne({}, {sort: {createAt: -1, limit: 1}}))
    return RoutingInfo.findOne({}, {sort: {createAt: -1, limit: 1}})
  }
})

Template.main.onRendered(()=>{
  $(document).ready(()=>{
    console.log("render main")
    let script = document.createElement('script')
    script.type = "text/javascript"
    script.src = "socket.io/socket.io.js"
    // $('#script_div').append(script)
  })
})
