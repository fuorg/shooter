import * as PIXI from "./pixi.mjs"
import {kbdControl} from './Control.mjs'
import {Bullet} from './Bullet.mjs'

export default class player extends PIXI.Container{
  constructor({color=0x438753,x=100,y=100,type='player'}={}){
    super()
    this.x=x
    this.y=y
    this.angle=0
    this.color=color
    this.maxSpeed=6
    this.crosshair={x:0,y:0}
    this.isShooting=[false,false,false]
    this.lastShot=[0,0,0]
    this.fireRate=[10,60,30]

    this.addTorso()
    this.addRhand()
  }

  setControl(type){
    if(type=='kbd'){
      this.control=new kbdControl(this)
    }else{
      console.log('not a player')
    }
  }

  addTorso(){
    let torso = this.torso = new PIXI.Graphics()
    this.addChild(torso)
    torso.beginFill(this.color)
    torso.drawCircle(0,0,30)
    // torso.endFill()
    torso.beginFill(0xffffff)
    torso.drawCircle(10, 10,5)
    torso.drawCircle(10,-10,5)
    torso.beginFill(0x0)
    torso.drawCircle(13, 10,2)
    torso.drawCircle(13,-10,2)
    torso.endFill()
  }

  addRhand(){
    let rhand = this.rhand = new PIXI.Graphics()
    console.log(rhand)
    rhand.x=30
    rhand.y=24
    this.addChild(rhand)
    rhand.beginFill(this.color)
    rhand.drawCircle(0,1,7)
    rhand.beginFill(0x0)
    rhand.drawRect(0,-4,20,8)
    rhand.endFill()
  }

  shoot(isShooting, which){
    // console.log(isShooting,which)
    this.isShooting[which]=isShooting
  }

  update(elapsed){
    if(this.control.x || this.control.y){
      let k=this.maxSpeed/Math.hypot(this.control.x, this.control.y)
      this.x+= k * this.control.x
      this.y+= k * this.control.y
    }

    ////////////// circle.position.copyFrom(e.global);

    // rotate body
    let r=Math.atan(((this.crosshair.y-this.y)||.001)/(this.crosshair.x-this.x)) + (this.x>this.crosshair.x?Math.PI:0)
    this.rotation=r

    // rotate right hand
    let {x,y}=this.rhand.toGlobal(this.parent.position)
    r=Math.atan((this.crosshair.y-y)/(this.crosshair.x-x)) + (x>this.crosshair.x?Math.PI:0)
    this.rhand.rotation=-this.rotation+r
    // console.log(x,y)

    for(let i=0;i<3;++i){
      if(!this.isShooting[i] || elapsed - this.lastShot[i] < this.fireRate[i]) continue
      let bullet=new Bullet({x:x,y:y,r:r})
      this.parent.addChildAt(bullet,0)
      this.lastShot[i]=elapsed
    }
  }
}