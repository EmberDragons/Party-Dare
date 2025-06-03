//lerp + bezier curve
import { vector2 } from "./vector2.js";

class Math {
    //lerp + bezier curve
    lerp(point1, point2, t) {
        let temp = point1.multiply(1-t);
        let n_point = temp.add(point2.multiply(t)); //p1*(1-t)+p2*t
        return n_point;
    }
    bezier_curve(point1, point2, point3, t) {
        let mid_point = this.lerp(point1,point3,t);
        let n_point = this.lerp(mid_point,point2,t);
        return n_point;
    }
}

export const maths = new Math();