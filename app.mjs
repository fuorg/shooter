import * as PIXI from "./pixi.mjs"
import player from "./player.mjs";

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

app.renderer.events.cursorStyles.crosshair="url('cross.png') 31 31 ,crosshair"
app.stage.interactive = true;
app.stage.hitArea = app.screen;

// let sprite = PIXI.Sprite.from('sample.png')
// app.stage.addChild(sprite);

let me = new player();
me.canvas=canvas
app.stage.addChild(me);
me.setControl('kbd')


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
    me.update(elapsed)
});