export default class Control{
  constructor(){
    this.x=0
    this.y=0
    this.r=0
  }
}

export class kbdControl extends Control{
  constructor(me){
    super()
    this.keyHandler=this.key.bind(this)
    globalThis.addEventListener('keydown',this.keyHandler)
    globalThis.addEventListener('keyup',this.keyHandler)

    let stage=me.parent
    stage.cursor='crosshair'

    // Follow the pointer
    stage.addEventListener('pointermove', (e) => {
        me.crosshair=e.global
    });

    let clickity=(e)=>{
      // console.log(e.type)
      me.shoot(e.type == 'mousedown' , e.button)
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