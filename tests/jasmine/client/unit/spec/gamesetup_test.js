describe("tesing gamesetup", function() {
  
  it("Test nextState()", function() {
    let vp = ['t','r']
    let ship = new Ship('00',['t','r'])
    expect(ship.getId()).toMatch('00')
    expect(ship.getState()).toMatch('t')
    ship.nextState(vp)
    expect(ship.getState()).toMatch('r')
  });
  it("Test viablePos", ()=>{
    let ids = ['00','12','66','30','77','05']
    let ans = [['r','b'],['r','b'],['t','l'],['r','t','b'],['t','l'],['r','b','l']]
    for(let i=0;i<ids.length;i++){
      expect(viablePos(ids[i]).toEqual(ans[i])
    }
  })
  it("Test getting coordinates", function(){

  })
});
