import * as PIXI from "./pixi.mjs"

export class Bullet extends PIXI.Graphics{
  constructor({x=0,y=0,r=0,type='makarov'}={}){
    super()
    this.x=x
    this.y=y
    this.rotation=r
    this.type=type

    if(type=='makarov'){
      this.beginFill('#888')
      this.drawRect(0,-1,4,2)
      this.endFill()
    }
  }
}

export default Bullet