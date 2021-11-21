import Lander, {TranslationalInformation, RotationalInformation, Engine} from "./Lander";
import Scene from "./Scene";
import Vector from "./Vector";
type KeyboardMapping = {
    [key:string]: {
        engine:string,
        throttle: number
    }[]
}
export default class KeyboardLander extends Lander{
    keyMap: Map<string, boolean>
    path: Vector[];
    keyboardMapping: KeyboardMapping
    frames: number;
    constructor(scene: Scene, t: TranslationalInformation, r: RotationalInformation, e: Engine[], color:string, keyboardMapping: KeyboardMapping){
        super(scene, t, r, e, color);
        this.keyMap = new Map();
        this.path = [];
        scene.canvas.tabIndex = 1000;
        scene.canvas.focus();
        this.frames = 0;
        this.keyboardMapping = keyboardMapping;
        document.addEventListener("keydown", e => {
            this.keyMap.set(e.key, true);
        })
        document.addEventListener("keyup", e => {
            this.keyMap.set(e.key, false)
        })
    }
    update(dt: number){
        this.frames += 1;
        for(const key in this.keyboardMapping){
            if(this.keyMap.get(key)){
                for(let {engine, throttle} of this.keyboardMapping[key]){
                    this.fireEngine(engine, throttle)
                }
            }
        }
        if(this.frames % 10 === 1){
            this.path.unshift(this.position.clone())
            this.path = this.path.slice(0, 100)
        }
        super.update(dt);
    }
    render(){
        this.scene.ctx.strokeStyle = this.color;
        this.scene.ctx.lineWidth = 1;
        const points = this.path.map(p => this.scene.transformCoordinates(p))
        if(points.length > 1){
            this.scene.ctx.beginPath();
            this.scene.ctx.moveTo(points[0].x, points[0].y);
            for(let i = 1; i < points.length; i++){
                this.scene.ctx.lineTo(points[i].x, points[i].y);
            }
            this.scene.ctx.stroke();
        }
        super.render();
    }
}