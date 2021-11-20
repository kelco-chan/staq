import Scene from "./ts/classes/scene";
import Lander from "./ts/classes/lander";
import Vector from "./ts/classes/vector";
import "./styles/index.css"
window.addEventListener("load", function(){
    //start the landing sequence
    console.log("Loading scene ...")
    const canvas = document.querySelector("canvas");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height
    const scene = new Scene(5, canvas,[
        new Lander(100, new Vector(0,0), new Vector(0,0), 0, "red")
    ]);
    //@ts-ignore
    window["scene"] = scene;
})