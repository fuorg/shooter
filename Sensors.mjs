import * as PIXI from './lib/pixi.mjs'

export class Sensors{
    constructor(owner,nd=3,np=5){
        this.owner=owner
        this.nd=nd
        // console.log(world.view.width)
        this.update()
    }

    destroy(){
        this.owner=undefined
    }

    update(){
        this.dt=this.owner.y    // distance to top
        this.dl=this.owner.x    //          to left
        this.db=this.owner.world.view.height-this.owner.y   // to bottom
        this.dr=this.owner.world.view.width -this.owner.x   // to right
        this.hf=this.owner.hp/this.owner.maxhp              // health fraction
        this.mf=this.owner.mana/this.owner.maxMana          // mana fraction

        this.r=this.owner.rotation
        this.r0=this.r+this.owner.rhand.rotation

        // let mypoint = this.owner.getGlobalPosition()
        let relPoint= new PIXI.Point()
        let arr=this.owner.world.stage.drops.sort()
        for(let i=0; i<arr.length && i<this.nd;){
            arr[i].toLocal(this.owner.world.stage.position,this.owner,relPoint,true)
            if(relPoint.magnitude() < 50 ){
                
            }
            ++i
        }
    }

    get state(){
        return {
            dt:this.dt,
            db:this.db,
            dl:this.dl,
            dr:this.dr,
            hf:this.hf,
            mf:this.mf,
            r:this.r,
            r0:this.r0,
        }
    }
}