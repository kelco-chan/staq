import type Scene from "./Scene";
import Vector from "./Vector";
type TranslationalInformation = {
    mass: number,
    position: Vector,
    velocity: Vector
}
type RotationalInformation = {
    momentOfInertia: number | {
        mass: number,
        sideLength: number
    },//object option automatically uses cube formula to derive
    angle: number, //+ve anticlockwise, 0 is up, in radians
    angularSpeed: number
}
type Engine = {
    name?: string, //name of engine
    thrustVector: Vector,//the maximum thrust of the engine as a vector, with y axis being the central axis of the lander
    axisDistance: Vector,//how far apart the engine is from the cg
}
export default class Lander{
    position: Vector;
    velocity: Vector;
    angle: number;
    momentOfInertia: number;
    mass: number;
    registeredForces: Vector[];
    registeredTorques: number[];
    scene: Scene;
    angularSpeed: number;
    engines: Engine[];

    constructor(scene: Scene, {mass, position, velocity}: TranslationalInformation, {momentOfInertia, angle, angularSpeed}: RotationalInformation, engines:Engine[]){
        this.scene = scene;
        
        this.mass = mass;
        this.position = position;
        this.velocity = velocity;

        this.momentOfInertia = (typeof momentOfInertia === "number")? momentOfInertia : (momentOfInertia.mass * momentOfInertia.sideLength * momentOfInertia.sideLength)/6;
        this.angle = angle;
        this.angularSpeed = angularSpeed;

        this.engines = engines;

        this.registeredForces = [];
        this.registeredTorques = [];
    }
    
    registerForce(f: Vector){
        this.registeredForces.push(f);
    }
    registerTorque(t: number){
        this.registeredTorques.push(t);
    }
    /**
     * Updates physical properties of the lander
     * @param scene Scene object which this lander is in
     * @param dt timestep, in seconds
     */
    update(dt: number){
        //this.registeredForces.push(new Vector(60-20*Math.random(), 0))

        const netAngularAccel = this.registeredTorques.reduce((a,b) => a+b, 0) / this.momentOfInertia;
        this.angle += this.angularSpeed * dt + 0.5 * netAngularAccel * dt * dt;
        this.angularSpeed += netAngularAccel * dt;

        const netAcceleration = this.registeredForces.reduce((prev, curr) => prev.add(curr), new Vector()).scale(1/this.mass).add(this.scene.gravity);
        this.position.add(this.velocity.clone().scale(dt)).add(netAcceleration.clone().scale(0.5 * dt * dt));
        this.velocity.add(netAcceleration.clone().scale(dt));


        this.registeredForces = [];
        this.registeredTorques = []
    }

    get energy(): number{
        return 0.5 * this.mass * this.velocity.magntiude * this.velocity.magntiude + this.mass * (-this.scene.gravity.y) * this.position.y;
    }

    fireEngine(indexOrName: number|string, throttle: number){
        if(throttle < 0 || throttle > 1) throw new Error("Beyond throttle margin");
        const engine = (typeof indexOrName === "number")?this.engines[indexOrName]:this.engines.find(e => e.name ===indexOrName);
        const force = engine.thrustVector.clone().scale(throttle).rotate(this.angle);
        const torque = engine.axisDistance.scalarCross(engine.thrustVector) * throttle;

        this.registerForce(force);
        this.registerTorque(torque);
    }
}
export type {TranslationalInformation, RotationalInformation, Engine};