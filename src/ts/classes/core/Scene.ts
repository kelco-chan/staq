import type Lander from "./Lander";
import Vector from "./Vector";
type Hook = {fn: (scene:Scene)=>any, throttle: number};

export default class Scene{
    landers: Lander[];
    gravity: Vector;
    frames: number;
    hooks: Hook[];
    constructor(g: number, landers: Lander[]){
        this.landers = landers;
        this.gravity = new Vector(0, -g);
        this.hooks = [];
    }
    step(dt: number){
        for(let lander of this.landers){
            lander.update(dt);
        }
        this.frames += 1;
        for(let hook of this.hooks){
            hook.fn(this);
        }
    }
    addHook(h: Hook){
        this.hooks.push(h);
    }
    addLander(l: Lander){
        this.landers.push(l);
        return this;
    }
    //to be called every frame by raf;
    
}