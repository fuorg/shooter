export default class Control{
  constructor(owner){
    this.owner=owner
    this.x=0
    this.y=0
    this.d=1
    this.r=0
    this.isShooting=[false,false,false]
  }
  destroy(){
    this.owner=undefined
  }
}

export class stcControl extends Control{
  constructor(owner){
    super(owner)

  }
}

export class rndControl extends Control{
  constructor(owner){
    super(owner)
    this.x=Math.random()*2-1
    this.y=Math.random()*2-1
    this.d=Math.random()
    this.r=Math.random()*2-1
  }
}

export class kbdControl extends Control{
  constructor(me){
    super(me)
    this.keyHandler=this.key.bind(this)
    globalThis.addEventListener('keydown',this.keyHandler)
    globalThis.addEventListener('keyup',this.keyHandler)

    let stage=me.parent
    stage.cursor='crossg'

    // Follow the pointer
    stage.addEventListener('pointermove', (e) => {
        me.crosshair=e.global
    });

    let clickity=(e)=>{
      // console.log(e.type)
      // me.shoot(e.type == 'mousedown' , e.button)
      this.isShooting[e.button]=e.type == 'mousedown'
    }
    // stage.addEventListener('pointerdown',clickity)
    // stage.addEventListener('pointerup',clickity)
    me.canvas.addEventListener('mousedown',clickity)
    me.canvas.addEventListener('mouseup',clickity)
  }

  key(e){
    let k
    if(e.type == 'keydown'){  k=1
    }else{                    k=-1}
    if(!e.repeat){
      if(e.code=='KeyA'){ this.x+= -1 * k}
      if(e.code=='KeyD'){ this.x+=  1 * k}
      if(e.code=='KeyW'){ this.y+= -1 * k}
      if(e.code=='KeyS'){ this.y+=  1 * k}
    }
    if(this.x> 1) this.x= 1
    if(this.x<-1) this.x=-1
    if(this.y> 1) this.y= 1
    if(this.y<-1) this.y=-1
    // console.log(e)
  }
}