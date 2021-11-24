import Lander from "../core/Lander";
import RenderedLander from "./RenderedLander";
import Scene from "./../core/Scene";
import Vector from "./../core/Vector";
export function landerHook(element: HTMLElement){
    return {
        fn(scene: RenderedScene){
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

export default class RenderedScene extends Scene{
    active: boolean;
    ctx: CanvasRenderingContext2D;
    camera: Vector;
    focusLander: Lander | null;
    lastRun?: number;
    canvas: HTMLCanvasElement;
    recentFps: number;
    fps: number;
    landers: RenderedLander[];
    constructor(g: number, canvas:HTMLCanvasElement, landers: RenderedLander[]){
        super(g, landers);
        
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.camera = new Vector(0, 0);
        this.active = false;

        this.focusLander = null;
        this.canvas.addEventListener("click", this.onClick.bind(this))

        this.frames = 0;
        this.recentFps = 0;
        this.fps = 0;

        this.raf = this.raf.bind(this);
        requestAnimationFrame(this.raf);
    }
    
    start(){ 
        this.active = true;
        return this
    }
    stop(){
        this.active = false; 
        return this
    }
    
    onClick(e: PointerEvent){
        const rect = this.canvas.getBoundingClientRect();
        const clickPos = this.transformToPhysicsCoordinates(new Vector(e.clientX - rect.left, e.clientY - rect.top));
        const distances = this.landers.map(({position}) => clickPos.clone().scale(-1).add(position).magntiude);
        this.focusLander = this.landers[distances.indexOf(Math.min(...distances))]
    }
    render(){
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 1;
        this.ctx.font = "10px Roboto"
        this.ctx.strokeText(`${(this.fps).toFixed(0)} fps`, 0, 10)

        //rely on pointer sharing

        if(this.focusLander){
            this.camera.x = this.focusLander.position.x;
            this.camera.y = Math.max(this.canvas.height/2 - 5, this.focusLander.position.y)
        }

        //update landers
        for(let lander of this.landers){
            lander.render();
        }
        //stroke the ground
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.camera.y + this.canvas.height/2);
        this.ctx.lineTo(this.canvas.width, this.camera.y + this.canvas.height/2);
        this.ctx.stroke();
    }
    raf(timestamp: number){
        if(this.active && this.lastRun){
            let dt = (timestamp - this.lastRun)/1000;
            if(this.frames % 10 === 0){
                this.fps = this.recentFps / 10;
                this.recentFps = 0;
            }
            this.recentFps += 1/dt;
            super.step(dt);
            this.render();
        }
        this.lastRun = timestamp;
        requestAnimationFrame(this.raf);
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