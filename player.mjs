import * as PIXI from "./pixi.mjs"
import {kbdControl,rndControl,stcControl} from './Control.mjs'
import {Bullet}  from './Bullet.mjs'
import {Sensors} from "./Sensors.mjs"

const pTypes={
  player:0,
  human :1,
  rnd   :10,
  stc   :11,
}

export default class player extends PIXI.Container{

  constructor({color=0x438753,x,y,r=0,type='player',world}={}){
    super()
    this.world=world
    this.x=x??world.screen.width/2
    this.y=y??world.screen.height/2
    this.rotation=r
    this.color=color
    this.type=pTypes[type]
    this.maxSpeed=6
    this.maxrSpeed=0.1
    this.hp=this.maxhp=1000
    this.mana=this.maxMana=1000
    this.sensorResolution=this.nextSensorUpdate=30  // in frames
    this.lastShot=[0,0,0]
    this.fireRate=[5,60,30]
    this.wepPos=[null,null,null]
    this.wepType=['makarov',null,null]
    
    this.sensors=new Sensors(this)

    this.interactive=true
    this.cursor='crossw'

    this.addTorso()
    this.addHealthBar()
    this.addRhand()
    if(type.match(/rnd|stc/)) this.setControl(type)
  }

  destroy(){
    this.world=undefined
    this.control.destroy()
    this.sensors.destroy()
    super.destroy()
  }

  setControl(type){
    if(type=='kbd'){
      this.control=new kbdControl(this)
      this.crosshair={x:this.x+200,y:this.y}
  }else if(type=='rnd'){
      this.control=new rndControl(this)
    }else if(type=='stc'){
      this.control=new stcControl(this)
    }else{
      console.log('not a player')
    }
  }

  addTorso(){
    let torso = this.torso = new PIXI.Graphics()
    torso.beginFill(this.color) // body
    torso.drawCircle(0,0,30)
    torso.endFill()
    this.addChild(torso)

    let eyes = this.eyes = new PIXI.Graphics()
    eyes.x=eyes.pivot.x=17
    eyes.beginFill(0xffffff)   // eyes
    eyes.drawCircle(10, 13,10)
    eyes.drawCircle(10,-13,10)
    eyes.beginFill(0x0)        // pupils
    eyes.drawCircle(15, 13,4)
    eyes.drawCircle(15,-13,4)
    eyes.endFill()
    this.addChild(eyes)
  }

  addHealthBar(){
    let hb=this.hb=new PIXI.Graphics()
    this.addChild(hb)
    hb.lineStyle(1,0,1,0)      // health bar 
    hb.beginFill(0xff0000)
    hb.drawRect(-30,-3,60,6)
    hb.endFill()
    hb.scale.x=0
  }

  addRhand(){
    let rhand = this.rhand = new PIXI.Graphics()
    // console.log(rhand)
    rhand.x=30
    rhand.y=24
    this.addChild(rhand)
    rhand.beginFill(this.color)
    rhand.drawCircle(0,1,7)
    rhand.beginFill(0x0)
    rhand.drawRect(0,-4,20,8)
    rhand.endFill()
    this.wepPos[0]=
    this.wepPos[1]=
    this.wepPos[2]=rhand
  }

  // shoot(isShooting, which){
  //   // console.log(isShooting,which)
  //   this.isShooting[which]=isShooting
  // }

  takeDamage(amount){
    // health update
    this.hp-=amount
    if(this.hp<0) this.hp=0
    this.hb.scale.x=1-this.hp/this.maxhp
  }

  shoot(elapsed){
    //update shooting status
    for(let i=0;i<3;++i){
      if(!this.wepPos[i]) continue
      if(!this.control.isShooting[i] || elapsed - this.lastShot[i] < this.fireRate[i]) continue
      this.lastShot[i]=elapsed  // to control the firerate even when not enough resource

      if(Bullet.cost[this.wepType[i]]>this.mana){continue}

      let {x,y}=this.wepPos[i].toGlobal(this.parent.position) // origin point of bullet
        , r=this.rotation + this.wepPos[i].rotation           // rotation of bullet

      let bullet=new Bullet({ x:x, y:y, r:r, startFrame:elapsed})
      // Bullet.sounds.shot.play()
      this.mana-=bullet.damage
      this.parent.addChildAt(bullet,0)
      this.parent.bullets.push(bullet)

      this.eyes.scale.x=this.mana/this.maxMana
    };
  }

  update(elapsed){
    if(this.hp<=0){   // die
      this.destroy()
      return true
    }

    // update movement direction
    if(this.control.x || this.control.y){
      let k=this.maxSpeed/Math.hypot(this.control.x, this.control.y)
      this.x+= k * this.control.x * this.control.d
      this.y+= k * this.control.y * this.control.d
    }


    // sensor update
    if(this.nextSensorUpdate<elapsed){
      this.sensors.update()
      this.nextSensorUpdate=elapsed+this.sensorResolution
      // console.log(this.sensors)
    }


    ////////////// circle.position.copyFrom(e.global);

    switch(this.type){
      case pTypes.player: return this.updatePlayer(elapsed)
      default           : return this.updateBot(elapsed)
    }
  }

  updateBot(elapsed){
    if(this.x<-100 || this.y<-100 || this.x>2000 || this.y>1000){
      this.destroy()
      return true // signals removal
    }
    this.rotation+=this.maxrSpeed*this.control.r
    this.shoot(elapsed)
    return false  // signals still going
  }

  updatePlayer(elapsed){


    // rotate body
    let r=Math.atan(((this.crosshair.y-this.y)||.001)/(this.crosshair.x-this.x)) + (this.x>this.crosshair.x?Math.PI:0)
    this.rotation=r

    // rotate right hand
    let {x,y}=this.rhand.toGlobal(this.parent.position)
    r=Math.atan((this.crosshair.y-y)/(this.crosshair.x-x)) + (x>this.crosshair.x?Math.PI:0)
    this.rhand.rotation=-this.rotation+r
    // console.log(x,y)

    this.shoot(elapsed)
  }
}