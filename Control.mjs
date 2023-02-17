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
    this.pointerHandler=(e) => me.crosshair=e.global
    stage.addEventListener('pointermove', this.pointerHandler);

    this.clickity=(e)=>{
      this.isShooting[e.button]=e.type == 'mousedown'
      e.preventDefault()
    }
    me.canvas.addEventListener('mousedown',this.clickity)
    me.canvas.addEventListener('mouseup',this.clickity)
  }

  destroy(){
    globalThis.removeEventListener('keydown',this.keyHandler)
    globalThis.removeEventListener('keyup',this.keyHandler)
    this.owner.parent.removeEventListener('pointermove', this.pointerHandler);
    this.owner.canvas.removeEventListener('mousedown',this.clickity)
    this.owner.canvas.removeEventListener('mouseup',this.clickity)
    super.destroy()
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