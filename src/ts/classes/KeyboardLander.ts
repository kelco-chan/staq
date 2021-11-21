import Lander, {TranslationalInformation, RotationalInformation, Engine} from "./lander";
import Scene from "./scene";
import Vector from "./vector";
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
    constructor(scene: Scene, t: TranslationalInformation, r: RotationalInformation, e: Engine[], color:string, keyboardMapping: KeyboardMapping){
        super(scene, t, r, e, color);
        this.keyMap = new Map();
        this.path = [];
        scene.canvas.tabIndex = 1000;
        scene.canvas.focus();
        this.keyboardMapping = keyboardMapping;
        document.addEventListener("keydown", e => {
            this.keyMap.set(e.key, true);
        })
        document.addEventListener("keyup", e => {
            this.keyMap.set(e.key, false)
        })
    }
    update(dt: number){
        for(const key in this.keyboardMapping){
            if(this.keyMap.get(key)){
                for(let {engine, throttle} of this.keyboardMapping[key]){
                    this.fireEngine(engine, throttle)
                }
            }
        }
        this.path.push(this.scene.transformCoordinates(this.position))
        super.update(dt);
    }
    render(){
        this.scene.ctx.strokeStyle = this.color;
        this.scene.ctx.lineWidth = 1
        if(this.path.length > 1){
            this.scene.ctx.moveTo(this.path[0].x, this.path[1].y);
            for(let i = 1; i < this.path.length; i++){
                this.scene.ctx.lineTo(this.path[i].x, this.path[i].y);
            }
            this.scene.ctx.stroke();
        }
        super.render();
    }
}