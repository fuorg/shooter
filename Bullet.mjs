import * as PIXI from "./pixi.mjs"

export class Bullet extends PIXI.Graphics{
  constructor({x=0,y=0,r=0,type='makarov', startFrame=0}={}){
    super()
    this.x=x
    this.y=y
    this.rotation=r
    this.type=type
    this.fallen=false
    this.startFrame=startFrame
    // this.matrix=new PIXI.Matrix()

    if(type=='makarov'){
      this.beginFill(0x888888)
      this.drawRect(0,-4,12,8)
      this.endFill()
      this.endFrame=startFrame+50
      this.velocity=15
      // this.matrix.translate(1,0)
    }
  }

  update(elapsed){
    // console.log(elapsed)
    if(elapsed > this.endFrame){
      this.destroy()
      return true // signals removal
    }
    this.transform.position.x+=Math.cos(this.rotation)*this.velocity
    this.transform.position.y+=Math.sin(this.rotation)*this.velocity
    return false // signals still going
  }
}

export default Bullet