import { vector2 } from "./vector2.js";
import { maths } from "./math.js";
export class Sprite {
    constructor({
        _ressource, // image we want to draw
        frameSize, // size of the crop (animations)
        hFrames, // height of animation sheet
        vFrames, // width of animation sheet
        frame, // number of the frame
        scale, // size of the image 
        position,
        isPixelated,
        opacity,
    }) {
        this.ressource = _ressource;

        this.frameSize = frameSize ?? new vector2(16,16);
        this.hFrames = hFrames ?? 1;
        this.vFrames = vFrames ?? 1;
        this.frame = frame ?? 0;
        this.frameMap = new Map();

        this.xScale = scale ?? 1;
        this.yScale = scale ?? 1;
        this.position = position ?? new vector2(0,0);

        this.isPixelated=isPixelated ?? false;
        this.opacity = opacity ?? 1;

        this.buildFrameMap();
    }

    updateSize(scale) {
        this.xScale=scale;
        this.yScale=scale;
    }

    buildFrameMap() {
        /*method to set up animation frames*/
        let frameCount = 0;
        for(let v=0; v<this.vFrames; v++) {
            for(let h=0; h<this.hFrames; h++) {
                this.frameMap.set(
                    frameCount,
                    new vector2(h*this.frameSize.x,v*this.frameSize.y),
                )
                frameCount++;
            }
        }
    }

    drawSprite(ctx, flipX=false, x=this.position.x, y=this.position.y) {
        /*method to draw images on screen*/
        if (!this.ressource.isLoaded) {
            return;
        }

        ctx.save();
        // Set smoothing based on isPixelated property
        ctx.imageSmoothingEnabled = !this.isPixelated;
        ctx.webkitImageSmoothingEnabled = !this.isPixelated;
        ctx.mozImageSmoothingEnabled = !this.isPixelated;

        let posMult=1;
        if (flipX) {
            ctx.translate(x + this.frameSize.x * this.xScale, y);
            ctx.scale(-1, 1);
            posMult=-1;
        } else {
            ctx.translate(x, y);
        }

        // Find the sprite through the sprite sheet
        let frameCoordX=0;
        let frameCoordY=0;
        const frame = this.frameMap.get(this.frame);
        if (frame){
            frameCoordX=frame.x;
            frameCoordY=frame.y;
        }
        
        const frameSizeX = this.frameSize.x;
        const frameSizeY = this.frameSize.y;
        // Actually drawing the sprite
        ctx.globalAlpha = this.opacity; 
        ctx.drawImage(
            this.ressource.image,
            frameCoordX, // getting the frame size + pos ready
            frameCoordY,
            frameSizeX, // how we crop the image
            frameSizeY,
            this.position.x*posMult,
            this.position.y,
            frameSizeX*this.xScale,
            frameSizeY*this.yScale,
        );
        ctx.restore();
    }

    //player position updates
    updatePosition(pos, t) {
        /*lerping to the player pos*/
        this.position = maths.lerp(this.position, pos, t);
    }

    setPosInt(){
        //set to int pos
        this.position.x=Math.round(this.position.x);
        this.position.y=Math.round(this.position.y);
    }

}

