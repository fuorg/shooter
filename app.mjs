import * as PIXI from "./lib/pixi.mjs"
import './lib/graphics-extras.js'
import './lib/math-extras.js'
import Player from "./Player.mjs";
import {Drop} from "./Drop.mjs"

let canvas=document.querySelector('canvas#canvas')
canvas.oncontextmenu=e=>e.preventDefault()

globalThis.app = new PIXI.Application({
    // width: 1500,
    // height: 500,
    antialias: true,
    // autoDensity: true,
    view: canvas,
    resizeTo: canvas,
    background: '#403730'
});
// document.body.appendChild(app.view)

app.renderer.events.cursorStyles.crossw="url('img/cross-white.png') 24 24 ,crosshair"
app.renderer.events.cursorStyles.crossg="url('img/cross-grey.png') 24 24 ,crosshair"
app.stage.interactive = true;
app.stage.hitArea = app.screen;
let bullets = app.stage.bullets=[]
let bots    = app.stage.bots   =[]
let drops   = app.stage.drops  =[]
let rootBoundary=app.renderer.events.rootBoundary

// let sprite = PIXI.Sprite.from('sample.png')
// app.stage.addChild(sprite);



// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;
// Tell our application's ticker to run a new callback every frame, passing
// in the amount of time that has passed since the last tick
app.ticker.add((delta) => {
  // Add the time to our total elapsed time
  elapsed += delta;
  // Update the sprite's X position based on the cosine of our elapsed time.  We divide
  // by 50 to slow the animation down a bit...
//   sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
    // me.x=120 + Math.cos(elapsed/50.0) * 100.0;

    for(let i=0; i<bullets.length;){
        if(bullets[i].update(elapsed) ){
            bullets.splice(i,1)
            continue
        }
        
        let target=rootBoundary.hitTest(bullets[i].x,bullets[i].y)
        if(target && target.takeDamage){
            // console.log(target)
            target.takeDamage(bullets[i])
            bullets[i].destroy()
            bullets.splice(i,1)
            continue
        }
        ++i
    }
    for(let i=0; i<bots.length;){
        if(bots[i].update(elapsed) ){
            bots.splice(i,1)
        }else{++i}
    }
});


app.addme=function(n=1){
    for(let i=0; i<n; ++i){
        let angle=Math.PI*2/n*i
          , r=n*80/(2*Math.PI)
          , x0=this.screen.width/2
          , y0=this.screen.height/2
          , x=x0+r*Math.cos(angle)
          , y=y0+r*Math.sin(angle)
        let me = new Player({x,y,world:this});
        me.canvas=this.view
        this.stage.bots.push(me)
        this.stage.addChild(me);
        me.setControl('kbd')
    }
}

app.addbot=function(type){
    let bot=new Player({type:type,color:0xaa2244,world:app})
    this.stage.bots.push(bot)
    this.stage.addChild(bot);

    console.log(bots)
}

new Drop({world:app,value:1000})
app.addme()
app.keyHandler=key.bind(app)
globalThis.addEventListener('keyup',app.keyHandler)
app.debugDiv=document.querySelector('div#debug')
setInterval(updateDebug.bind(app),500)

// end

function updateDebug(){
    if(this.stage.bots.length==0) return
    this.debugDiv.textContent=JSON.stringify(this.stage.bots[0].sensors.state,null,2)
}

function key(e){
    // let k
    // if(e.type == 'keydown'){  k=1
    // }else{                    k=-1}
    if(!e.repeat){
      if(e.code=='Digit1'){this.addme()}
      if(e.code=='Digit2'){this.addbot('rnd')}
      if(e.code=='Digit3'){this.addbot('stc')}
    }
    // console.log(e)
}
