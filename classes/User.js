User = class User {
  constructor(id,name,socket,coordinates){
    this.id = id
    this.name = name
    this.socket = socket
    this.coordinates = coordinates
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
  isHit(coor){
    let c = this.coordinates
    for(let i=0;i<c.length;i++){
      if(c[i]==coor){
        return true
      }
    }
    return false
  }
}
