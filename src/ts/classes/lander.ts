import type Scene from "./scene";
import Vector from "./vector";
import { landerHeight, landerWidth } from "../config";
export default class Lander{
    position: Vector;
    velocity: Vector;
    angle: number;
    color: string;
    _previousNetAcceleration: null | Vector;
    mass: number;
    registeredForces: Vector[];
    constructor(mass:number, position: Vector, velocity: Vector, angle:number, color:string){
        this.position = position;
        this.velocity = velocity;
        this.angle = angle;
        this.color = color;
        this._previousNetAcceleration = null;
        this.registeredForces = [];
        this.mass = mass;
    }
    render(scene:Scene){
        //Transforms physics coordinate system into canvas coordinate system;
        const renderedPosition = scene.transformCoordinates(this.position);
        /*scene.ctx.save();
        scene.ctx.translate(renderedPosition.x, renderedPosition.y);
        scene.ctx.rotate(this.angle);
        scene.ctx.translate(-renderedPosition.x, -renderedPosition.y);*/
        //draw
        scene.ctx.fillStyle = this.color;
        scene.ctx.fillRect(renderedPosition.x - landerWidth/2, renderedPosition.y - landerHeight/2, landerWidth, landerHeight)
        //scene.ctx.restore();
    }
    registerForce(v: Vector){
        this.registeredForces.push(v);
    }
    /**
     * Updates physical properties of the lander
     * @param scene Scene object which this lander is in
     * @param dt timestep, in seconds
     */
    update(scene: Scene, dt: number){
        const netAcceleration = this.registeredForces.reduce((prev, curr) => prev.add(curr), new Vector()).scale(1/this.mass).add(scene.gravity);
        this.position.add(this.velocity.clone().scale(dt)).add(netAcceleration.clone().scale(0.5 * dt * dt));
        this.velocity.add(netAcceleration.clone().scale(dt));
        this.registeredForces = [];
    }
}