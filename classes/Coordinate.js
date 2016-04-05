Coordinate = class Coordinate {
  constructor(x,y){
    this.x = x
    this.y = y
  }
  changeX(i){
    this.x = this.x+i
  }
  changeY(i){
    this.y = this.y+i
  }
  getX(){
    return this.x
  }
  getY(){
    return this.y
  }
}
