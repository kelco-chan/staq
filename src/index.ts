import Lander from "./ts/classes/core/Lander";
import Vector from "./ts/classes/core/Vector";
import "./styles/index.css";
import "./ts/components/DraggableBox"
import "./ts/components/pages"
import KeyboardLander from "./ts/classes/rendered/KeyboardLander";
import RenderedScene, { landerHook } from "./ts/classes/rendered/RenderedScene";
window.addEventListener("load", function(){
    //start the landing sequence
    console.log("Loading scene ...")
    const canvas = document.querySelector("canvas");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height
    const scene = new RenderedScene(5, canvas,[]);
    scene.addLander(new KeyboardLander(scene, {
        mass: 100, 
        position:new Vector(0, 50), 
        velocity:new Vector(0, 50)
    }, {
        momentOfInertia:{mass:100, sideLength: 10},
        angle: 0,
        angularSpeed: 0
    }, [
        {
            name:"up",
            thrustVector: new Vector(0, 1000),
            axisDistance: new Vector(0, -5)
        },{
            name:"topleft",
            thrustVector:new Vector(150, 0),
            axisDistance: new Vector(-5, 5)
        },{
            name:"bottomleft",
            thrustVector:new Vector(150, 0),
            axisDistance: new Vector(-5, -5)
        },{
            name:"topright",
            thrustVector:new Vector(-150, 0),
            axisDistance: new Vector(5, 5)
        },{
            name:"bottomright",
            thrustVector:new Vector(-150, 0),
            axisDistance: new Vector(5, -5)
        }
    ], "red", {
        ArrowUp: [{engine:"up", throttle: 1}],
        ",": [{engine: "topright", throttle: 1}, {engine:"bottomleft", throttle: 1}],
        ".": [{engine: "topleft", throttle: 1}, {engine:"bottomright", throttle: 1}],
        ArrowLeft: [{engine:"topright", throttle: 1}, {engine: "bottomright", throttle:1}],
        ArrowRight: [{engine:"topleft", throttle: 1}, {engine: "bottomleft", throttle:1}],
    }))

    scene.addLander(new KeyboardLander(scene, {
        mass: 100, 
        position:new Vector(20, 50), 
        velocity:new Vector(0, 50)
    }, {
        momentOfInertia:{mass:100, sideLength: 10},
        angle: 0,
        angularSpeed: 0
    }, [
        {
            name:"up",
            thrustVector: new Vector(0, 1000),
            axisDistance: new Vector(0, -5)
        },{
            name:"topleft",
            thrustVector:new Vector(150, 0),
            axisDistance: new Vector(-5, 5)
        },{
            name:"bottomleft",
            thrustVector:new Vector(150, 0),
            axisDistance: new Vector(-5, -5)
        },{
            name:"topright",
            thrustVector:new Vector(-150, 0),
            axisDistance: new Vector(5, 5)
        },{
            name:"bottomright",
            thrustVector:new Vector(-150, 0),
            axisDistance: new Vector(5, -5)
        }
    ], "black", {
        w: [{engine:"up", throttle: 1}],
        q: [{engine: "topright", throttle: 1}, {engine:"bottomleft", throttle: 1}],
        e: [{engine: "topleft", throttle: 1}, {engine:"bottomright", throttle: 1}],
        a: [{engine:"topright", throttle: 1}, {engine: "bottomright", throttle:1}],
        d: [{engine:"topleft", throttle: 1}, {engine: "bottomleft", throttle:1}],
    }));
    scene.addHook(
        landerHook(document.querySelector(".lander-telemetry .body"))
    )
    
    scene.start()
    //@ts-ignore
    window["scene"] = scene;
})