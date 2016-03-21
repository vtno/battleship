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
  infos: ()=>{
    // return RoutingInfo.find({})
    console.log(RoutingInfo.findOne({}, {sort: {createAt: -1, limit: 1}}))
    return RoutingInfo.findOne({}, {sort: {createAt: -1, limit: 1}})
  }
  // ip:()=>{
  //   return this.ip
  // },
  // port:()=>{
  //   return this.port
  // }
})
