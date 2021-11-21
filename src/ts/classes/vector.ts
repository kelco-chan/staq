export default class Vector{
    x: number = 0;
    y: number = 0; 
    constructor(x?: number,y?: number){
        this.x = x || 0;
        this.y = y || 0;
    }
    clone(){
        return new Vector(this.x, this.y);
    }
    get magntiude(): number{
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    add(x:number, y:number): this;
    add(v2: Vector): this;
    add(xOrv2: Vector|number, y?:number): this{
        if(typeof xOrv2 === "number"){
            this.x += xOrv2;
            this.y += (y as number);
        }else{
            this.x += xOrv2.x;
            this.y += xOrv2.y;
        }
        return this;
    }
    scale(factor: number){
        this.x *= factor;
        this.y *= factor;
        return this;
    }
    normalise(length:number = 1){
        return this.scale(length/this.magntiude);
    }
    multiply(a11: number, a12:number, a21:number, a22:number){
        let x = this.x;
        let y = this.y;
        this.x = a11 * x + a12 * y;
        this.y = a21 * x + a22 * y;
        return this;
    }
    rotate(radians: number){
        return this.multiply(Math.cos(radians), -Math.sin(radians), Math.sin(radians), Math.cos(radians))
    }
    scalarCross(v2: Vector){
        return this.x * v2.y - v2.x * this.y
    }
    toString(): string{
        return `X: ${this.x.toFixed(0)} Y: ${this.y.toFixed(0)} MAGN: ${this.magntiude.toFixed(0)}`
    }
}