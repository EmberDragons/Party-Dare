
const ABSOLUTE_SQRT = 0.71;

export class vector2 {
    constructor(x=0,y=0) {
        this.x=x;
        this.y=y;
    }

    //vector maths
    add(vec2) {
        let x=this.x+vec2.x;
        let y=this.y+vec2.y;
        return new vector2(x,y);
    }
    multiply(val) {
        let x=this.x*val;
        let y=this.y*val;
        return new vector2(x,y);
    }
    inverse() {
        let x=this.x;
        let y=this.y;
        return new vector2(-x, -y);
    }

    // vector Infos
    getVectLength() {
        /* method to get vector size */
        let value = Math.sqrt(this.x**2+this.y**2);
        return value;
    }
    getVectDist(point) {
        /* method to get vector distance to ther point */
        let value = Math.sqrt((point.x-this.x)**2+(point.y-this.y**2));
        return value;
    }

    getAbsolute() {
        if (this.x != 0 && this.y != 0){
            let absolute_vec = new vector2(ABSOLUTE_SQRT*this.x, ABSOLUTE_SQRT*this.y);
            return absolute_vec;
        }
        else {
            return this;
        }
    }
}