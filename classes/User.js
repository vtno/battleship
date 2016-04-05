User = class User {
  constructor(id,name,socket){
    this.id = id
    this.name = name
    this.socket = socket
    this.status = 0
  }
  getId(){
    return this.id
  }
  getName(){
    return this.name
  }
  getSocket(){
    return this.socket
  }
  getCoordinates(){
    return this.coordinates
  }
  setShips(ships){
    this.ships = ships
  }
  setOpponent(opp){
    this.opp = opp
    this.setStatus(1)
  }
  setStatus(status){
    //0 = no opp, 1= have opp
    this.status = status
  }
  isHit(ships){
    let c = ships.getCoordinates()
    for(let i=0;i<c.length;i++){
      if(c[i]==coor){
        return true
      }
    }
    return false
  }
}
