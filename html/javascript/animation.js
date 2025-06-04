import { FRAMERATE } from "./main.js";
export class Animation {
    constructor({name,
                 frameStart,
                 frameEnd,
    }) {
        this.name = name,
        this.frameStart = frameStart,
        this.frameEnd = frameEnd,
        this.frame = frameStart
    };

    startAnim() {
        this.frame = this.frameStart;
    }

    addFrame() {
        this.frame+=1;
        if (this.frame>this.frameEnd) {
            this.frame=this.frameStart;
        }
    }
}


export class AnimationHandler {
    constructor(allAnimations, basedAnimName, sprite, frameRate) {
        this.animations = allAnimations,
        this.animation = allAnimations[basedAnimName],
        this.sprite = sprite,

        this.frameRate = frameRate, //speed of animatiuon call per second
        this.frameDiff = Math.round(FRAMERATE/this.frameRate),
        this.frame = 0
    };

    updateAnim() {
        //called to update the current frame / handler
        this.frame+=1;
        if (this.frame == this.frameDiff){
            this.frame=0;
            this.augmentFrame();
        }

    }

    setAnim(name) {
        //sets the current animation
        if (this.animation!=null && name==this.animation.name) return;

        for (let anim in this.animations) {
            if (this.animations[anim].name == name){
                this.animation = this.animations[anim];
                this.animation.startAnim();
            }
        }
    }

    augmentFrame() {
        //sets the current frame on the sprite object
        if (this.animation!=null){
            this.animation.addFrame();
            this.sprite.frame = this.animation.frame;
        }
    }

}