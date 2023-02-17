export class Sensors{
    constructor(owner){
        this.owner=owner
        // console.log(world.view.width)
        this.update()
    }

    update(){
        this.dt=this.owner.y
        this.dl=this.owner.x
        this.db=this.owner.world.view.height-this.owner.y
        this.dr=this.owner.world.view.width -this.owner.x
    }

    destroy(){
        this.owner=undefined
    }
}