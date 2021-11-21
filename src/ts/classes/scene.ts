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
    frames: number;
    recentFps: number;
    fps: number;
    cameraZoom: number;
    constructor(g: number, canvas: HTMLCanvasElement, landers: Lander[]){
        this.landers = landers;
        this.gravity = new Vector(0, -g);
        this.update = this.update.bind(this);
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.camera = new Vector(0, 0);
        this.active = false;

        this.frames = 0;
        this.recentFps = 0;
        this.fps = 0;
        
        //finally start the scene
        console.log("Launching RAf")
        requestAnimationFrame(this.update);
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