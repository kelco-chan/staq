import type Lander from "./lander";
import Vector from "./vector";
export default class Scene{
    landers: Lander[];
    gravity: Vector;
    active: boolean;
    ctx: CanvasRenderingContext2D;
    camera: Vector;
    lastRun?: number;
    canvas: HTMLCanvasElement;
    constructor(g: number, canvas: HTMLCanvasElement, landers: Lander[]){
        this.landers = landers;
        this.gravity = new Vector(0, -g);
        this.update = this.update.bind(this);
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.camera = new Vector(0, 0);
        this.active = true;
        
        //finally start the scene
        console.log("Launching RAf")
        requestAnimationFrame(this.update);
    }
    //to be called every frame by raf;
    update(timestamp: number){
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
        
        
        if(this.active && this.lastRun){
            let dt = (timestamp - this.lastRun)/1000;
            for(const lander of this.landers){
                lander.update(this, dt);
                lander.render(this);
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
}