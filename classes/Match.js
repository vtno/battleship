Match = class Match {
  constructor(id,user1,user2) {
    this.id = id
    this.users = [user1,user2]
    this.scores = [0,0]
  }
  getUsers(){
    return users;
  }
  getScores(){
    return scores;
  }
  setScores(s){
    this.scores = s
  }
}
