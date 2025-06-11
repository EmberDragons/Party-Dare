import { vector2 } from "./vector2.js";
import { ressources } from "./ressources.js";
import { Sprite } from "./sprite.js";

const FRAMERATE = 45;

export class PlayerAnim {
    constructor (ctx,nb, posx, posy, dist_travel) {
        this.player_id = nb;
        this.position = new vector2(posx, posy);
        this.dist_travel = dist_travel;

        this.fake_player = new Player({ctx:ctx,p_id:this.player_id,startingPos:this.position});
        this.fake_player.isMoving=true; //we need to set it up right

        this.vector_move = new vector2(1,0);
    }

    move() {
        this.fake_player.handleAnim();
        if (this.vector_move.x>0) {
            this.fake_player.flipX = false;
            if (this.fake_player.position.x<this.position.x+this.dist_travel)
                this.fake_player.move(this.vector_move);
            else
                this.vector_move = new vector2(-1,0);
        }
        else if (this.vector_move.x<0) {
            this.fake_player.flipX = true;
            if (this.fake_player.position.x>this.position.x)
                this.fake_player.move(this.vector_move);
            else
                this.vector_move = new vector2(1,0);
        }
    }
    draw() {
        this.fake_player.draw();
    }
}


class Player {
    constructor({
        ctx,
        p_id,
        startingPos=new vector2(0,0),
    }) {
        this.alive=true;
        this.render=true;
        this.ctx=ctx;
        this.playerId = p_id;
        let startFrame = 6;
        this.sprite = new Sprite({_ressource:ressources.images["player_"+(p_id+1).toString()], 
                                  frameSize:new vector2(32,34),
                                  hFrames:6, 
                                  vFrames:2, 
                                  frame:startFrame, 
                                  scale:1, 
                                  position:startingPos,
                                  isPixelated:false});
        this.moveSprite = new Sprite({_ressource:ressources.images["move_"+(p_id+1).toString()], 
                                  frameSize:new vector2(126,126),
                                  scale:0.5, 
                                  position:startingPos,
                                  isPixelated:false});
        this.position = new vector2(startingPos.x, startingPos.y);

        this.speed=1;
        this.buildSpeed=1; //value that corresponds to t between 0 and 1 (will control speed of mvt)


        this.isMoving = false;
        this.flipX = false; //rotate the img

        //animation
        this.frameRateAnimation = 9; //corresponds to ... fps
        this.setAnimationHandler(startFrame = startFrame);

    }
    draw() {
        //called to update all var and sprite
        if (this.render)
            this.drawPlayer();
    }
    
    /* Player drawing part */
    drawPlayer() {
        this.moveSprite.drawSprite(this.ctx);
        this.sprite.drawSprite(this.ctx, this.flipX);
    }
    switchFrame(frameId) {
        this.sprite.frame=frameId;
    }
    updatePosSprite() {
        this.moveSprite.updatePosition(new vector2(Math.round(this.position.x-8), Math.round(this.position.y-20)), this.buildSpeed);
        this.sprite.updatePosition(this.position, this.buildSpeed);
    }

    move(dir=new vector2(0,0)) {
        console.log(dir);
        var absolute_dir = dir.getAbsolute();
        this.position = this.position.add(absolute_dir);
        this.updatePosSprite();
    }

    /*Animation Part*/
    setAnimationHandler() {
        let dic_anims = {'running':new Animation({name:'running',frameStart:0,frameEnd:5}),
        };

        this.animHandler = new AnimationHandler(dic_anims, 'idle', this.sprite, this.frameRateAnimation);
        this.animHandler.setAnim("running");
    }

    handleAnim() {
        this.animHandler.updateAnim();
    }
}
class Animation {
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


class AnimationHandler {
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