Router.configure({
  layoutTemplate: 'main'
})
Router.route('/',{
  template: 'home'
})
Router.route('/waitOpponent', {
  template: 'waitOpponent'
})
Router.route('/gamesetup', {
  template: 'gamesetup'
})
Router.route('/game', {
  template: 'game'
})
Router.route('/result', {
  template: 'result'
})
console.log("WORKING")
