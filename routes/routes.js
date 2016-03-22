Router.configure({
  layoutTemplate: 'main'
})
Router.route('/',{
  template: 'home'
})
Router.route('/waitOpponent', {
  template: 'waitOpponent'
})
console.log("WORKING")
