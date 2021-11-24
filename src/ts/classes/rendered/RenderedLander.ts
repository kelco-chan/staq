import type RenderedScene from "./RenderedScene";
import Lander, { TranslationalInformation, RotationalInformation, Engine } from "../core/Lander";
import { LANDER_RENDER_HEIGHT, LANDER_RENDER_WIDTH} from "../../config";
export default class RenderedLander extends Lander{
    color: string;
    scene: RenderedScene
    constructor(scene: RenderedScene, t: TranslationalInformation, r: RotationalInformation, engines:Engine[], color: string){
        super(scene, t, r, engines)
        this.color = color;
    }
    render(){
        //Transforms physics coordinate system into canvas coordinate system;
        const renderedPosition = this.scene.transformCoordinates(this.position);

        this.scene.ctx.save();
        this.scene.ctx.translate(renderedPosition.x, renderedPosition.y);
        this.scene.ctx.rotate(-this.angle);
        this.scene.ctx.translate(-renderedPosition.x, -renderedPosition.y);
        //draw
        this.scene.ctx.fillStyle = this.color;
        this.scene.ctx.strokeStyle = this.color;
        //this.scene.ctx.fillRect(renderedPosition.x - LANDER_RENDER_WIDTH/2, renderedPosition.y - LANDER_RENDER_HEIGHT/2, LANDER_RENDER_WIDTH, LANDER_RENDER_HEIGHT)
        this.scene.ctx.beginPath();

        this.scene.ctx.moveTo(renderedPosition.x - LANDER_RENDER_WIDTH/2, renderedPosition.y - LANDER_RENDER_HEIGHT/2);
        this.scene.ctx.lineTo(renderedPosition.x + LANDER_RENDER_WIDTH/2,renderedPosition.y - LANDER_RENDER_HEIGHT/2);
        this.scene.ctx.lineTo(renderedPosition.x + LANDER_RENDER_WIDTH/2,renderedPosition.y + LANDER_RENDER_HEIGHT/6);
        this.scene.ctx.lineTo(renderedPosition.x + LANDER_RENDER_WIDTH/6,renderedPosition.y + LANDER_RENDER_HEIGHT/6);
        this.scene.ctx.lineTo(renderedPosition.x + LANDER_RENDER_WIDTH/2,renderedPosition.y + LANDER_RENDER_HEIGHT/2)
        this.scene.ctx.lineTo(renderedPosition.x - LANDER_RENDER_WIDTH/2,renderedPosition.y + LANDER_RENDER_HEIGHT/2)
        this.scene.ctx.lineTo(renderedPosition.x - LANDER_RENDER_WIDTH/6,renderedPosition.y + LANDER_RENDER_HEIGHT/6);
        this.scene.ctx.lineTo(renderedPosition.x - LANDER_RENDER_WIDTH/2,renderedPosition.y + LANDER_RENDER_HEIGHT/6);

        this.scene.ctx.fill();

        this.scene.ctx.restore();
    }
}