import type Lander from "./Lander";
import Vector from "./Vector";
type Hook = {fn: (scene:Scene)=>any, throttle: number};
const hooks = {
    focusLander(element: HTMLElement){
        return {
            fn(scene: Scene){
                if(!scene.focusLander){
                    element.innerHTML = "Please click on lander to view its information";
                    return;
                }
                element.innerHTML = 
`Position: ${scene.focusLander.position.toString()}
Velocity: ${scene.focusLander.velocity.toString()}
Angle: ${(scene.focusLander.angle / Math.PI * 180).toFixed(1)} degrees
Angular velocity: ${(scene.focusLander.angularSpeed / Math.PI * 180).toFixed(1)} degrees
`.replace(/ /g, "&nbsp;").replace(/\n/g, "<br />")
            },
            throttle: 5 //upate every 5 frames
        }
    }
}
export default class Scene{
    landers: Lander[];
    gravity: Vector;
    active: boolean;
    ctx: CanvasRenderingContext2D;
    camera: Vector;
    focusLander: Lander | null;
    lastRun?: number;
    canvas: HTMLCanvasElement;
    frames: number;
    recentFps: number;
    fps: number;
    cameraZoom: number;
    hooks: Hook[];
    constructor(g: number, canvas: HTMLCanvasElement, landers: Lander[]){
        this.landers = landers;
        this.gravity = new Vector(0, -g);
        this.update = this.update.bind(this);
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.camera = new Vector(0, 0);
        this.active = false;

        this.focusLander = null;
        this.canvas.addEventListener("click", this.onClick.bind(this))

        this.frames = 0;
        this.recentFps = 0;
        this.fps = 0;

        this.hooks = [];
        
        //finally start the scene
        console.log("Launching RAf")
        requestAnimationFrame(this.update);
    }
    addHook(h: Hook){
        this.hooks.push(h);
    }
    onClick(e: PointerEvent){
        const rect = this.canvas.getBoundingClientRect();
        const clickPos = this.transformToPhysicsCoordinates(new Vector(e.clientX - rect.left, e.clientY - rect.top));
        const distances = this.landers.map(({position}) => clickPos.clone().scale(-1).add(position).magntiude);
        this.focusLander = this.landers[distances.indexOf(Math.min(...distances))]
    }
    addLander(l: Lander){
        this.landers.push(l);
        return this;
    }
    start(){ 
        this.active = true;
        return this
    }
    stop(){
        this.active = false; 
        return this
    }
    //to be called every frame by raf;
    update(timestamp: number){
               
        if(this.active && this.lastRun){
            let dt = (timestamp - this.lastRun)/1000;
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            if(this.frames % 10 === 0){
                this.fps = this.recentFps / 10;
                this.recentFps = 0;
            }
            this.recentFps += 1/dt;
            this.ctx.strokeStyle = "Black";
            this.ctx.lineWidth = 2;
            this.ctx.strokeText(`${(this.fps).toFixed(0)} fps`, 0, 10)

            //rely on pointer sharing

            if(this.focusLander){
                this.camera.x = this.focusLander.position.x;
                this.camera.y = Math.max(this.canvas.height/2 - 5, this.focusLander.position.y)
            }

            //update landers
            for(const lander of this.landers){
                lander.update(dt);
                lander.render();
            }
            //stroke the ground
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.camera.y + this.canvas.height/2);
            this.ctx.lineTo(this.canvas.width, this.camera.y + this.canvas.height/2);
            this.ctx.stroke();
            this.frames += 1;
        }
        for(let {fn, throttle} of this.hooks){
            if(this.frames % throttle === 0){
                fn(this);
            }
        }
        this.lastRun = timestamp;
        requestAnimationFrame(this.update);
    }
    transformCoordinates(physicsCoordinates: Vector): Vector{
        return new Vector(
            physicsCoordinates.x - this.camera.x + this.canvas.width/2,
            this.camera.y + this.canvas.height/2 - physicsCoordinates.y
        )
    }
    transformToPhysicsCoordinates(renderingCoordinates: Vector): Vector{
        return new Vector(
            renderingCoordinates.x + this.camera.x - this.canvas.width/2,
            this.camera.y + this.canvas.height/2 - renderingCoordinates.y
        )
    }
}
export {hooks};