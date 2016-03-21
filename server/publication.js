Meteor.publish('routinginfo',()=>{
  return RoutingInfo.find({})
})
