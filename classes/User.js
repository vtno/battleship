User = class User {
  constructor(id,name,socket){
    this.id = id
    this.name = name
    this.socket = socket
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
