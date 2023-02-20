import * as PIXI from "./lib/pixi.mjs"

export class Drop extends PIXI.Graphics{
    constructor({color=0xc7c723,x,y,type='mana',value,world}={}){
        super()
        this.world=world
        this.x=x??world.screen.width/2
        this.y=y??world.screen.height/2
        this.color=color
        this.type=type
        this.value=value

        this.beginFill(color)
        this.drawStar(0,0,4,20)
        this.endFill()
  

        world.stage.drops.push(this)
        world.stage.addChildAt(this,0)
        console.log(world.stage)
    }

    destroy(){
        this.world=undefined
        super.destroy()
    }
}


export default Drop
