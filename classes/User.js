User = class User {
  constructor(id,name,socket){
    this.id = id
    this.name = name
    this.socket = socket
    this.status = 0
    this.score = 0
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
  getOpponent(){
    return this.opp
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
  setCoordinates(coor){
    this.coordinates = coor
  }
  reset(){
    this.score = 0
    this.coordinates = []
    this.status = 1
  }
  hardReset(){
    this.score = 0
    this.coordinates = []
    this.status = 0
  }
  isHit(coor){
    coor = coor.substring(1)
    console.log('atk position= '+coor)
    console.log('ship postions= '+this.coordinates)
    let c = this.coordinates
    for(let i=0;i<c.length;i++){
      if(c[i]==coor){
        removeIf(c[i],this.coordinates)
        return true
      }
    }
    return false
  }
  isLost(){
    if(this.coordinates.length == 0){
      return true
    }else{
      return false
    }
  }
}
