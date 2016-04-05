Ship = class Ship {
  constructor(id, viablePos){
    this.id = id
    this.viablePos = viablePos
    this.state = viablePos[0]
    this.cur = 0
    this.coordinates = this.setCoordinates(this.id,this.state)
    //create an occupied space of the ship
    console.log('New ship created id=' + id +" "+ viablePos)
  }
  nextState(viablePos){
    this.cur++
    console.log('viablePos length='+ viablePos.length)
    console.log('iterator=' + this.cur)
    if(this.cur>=viablePos.length){
      this.cur = 0
    }
    this.state = viablePos[this.cur]
    console.log('NEXT STATE COMPLETE CURSTATE='+this.state)
  }
  getViablePos(){
    return this.viablePos
  }
  getState(){
    return this.state
  }
  getId(){
    return this.id
  }
  setCoordinates(id, state){
    console.log("set coor for state= "+id+"[ "+state+" ]")
    let coor = []
    let row = parseInt(id.charAt(0))
    let col = parseInt(id.charAt(1))
    let pos1,pos2,pos3
    switch (state) {
      case 't':
        pos1 = (row-1).toString()+col.toString()
        pos2 = (row-2).toString()+col.toString()
        pos3 = (row-3).toString()+col.toString()
        coor.push(pos1)
        coor.push(pos2)
        coor.push(pos3)
      break;
      case 'r':
        console.log('enter state R')
        pos1 = row.toString()+(col+1).toString()
        pos2 = row.toString()+(col+2).toString()
        pos3 = row.toString()+(col+3).toString()
        coor.push(pos1)
        coor.push(pos2)
        coor.push(pos3)
      break;
      case 'b':
        pos1 = (row+1).toString()+col.toString()
        pos2 = (row+2).toString()+col.toString()
        pos3 = (row+3).toString()+col.toString()
        coor.push(pos1)
        coor.push(pos2)
        coor.push(pos3)
      break;
      case 'l':
        pos1 = row.toString()+(col-1).toString()
        pos2 = row.toString()+(col-2).toString()
        pos3 = row.toString()+(col-3).toString()
        coor.push(pos1)
        coor.push(pos2)
        coor.push(pos3)
      break;
      default:
        return "error"
    }
    return coor
  }
  getCoordinates(){
    return this.coordinates
  }
}

viablePos = viablePos=(id)=>{
  let arr = ['r','t','b','l']
  let row = parseInt(id.charAt(0))
  console.log('row='+row)
  let col = parseInt(id.charAt(1))
  console.log('col='+col)
  if(row+3>7){
    let v = arr.indexOf('b')
    arr.splice(v,1)
    console.log('cannot bottom')
  }
  if(row-3<0){
    let v = arr.indexOf('t')
    arr.splice(v,1)
    console.log('cannot top')
  }
  if(col+3>7){
    let v = arr.indexOf('r')
    arr.splice(v,1)
    console.log('cannot right')
  }
  if(col-3<0){
    let v = arr.indexOf('l')
    arr.splice(v,1)
    console.log('cannot left')
  }
  console.log(arr)
  return arr
}
checkShip = checkShip = (id,ships)=>{
  for(let i = 0;i<ships.length;i++){
    console.log('enter checking loop')
    console.log(ships[i].getId())
    if(ships[i].getId()== id){
      console.log('ship id='+id+' exist!')
      return true;
    }
  }
  console.log('ship id='+id+' does not exist!')
  return false
}
updateShip = updateShip = (id,ships)=>{
  for(let i = 0;i<ships.length;i++){
    if(ships[i].getId()== id){
      let vp = ships[i].getViablePos()
      ships[i].nextState(vp)
    }
  }
}
findShip = findShip = (id,ships)=>{
  for(let i = 0;i<ships.length;i++){
    if(ships[i].getId()== id){
      return ships[i]
    }
  }
  return 'cannot find ship id='+id
}