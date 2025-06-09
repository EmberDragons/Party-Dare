import { gameLoop, list_all_movement_keys } from "./main.js";
import { WINDOW_SIZE } from "./main.js";
import { ressources } from "./ressources.js";
import { Sprite } from "./sprite.js";
import { vector2 } from "./vector2.js";
import { Animation } from "./animation.js";
import { AnimationHandler } from "./animation.js";

const LERP_MULT = 0.07;

export class Player {
    constructor({
        ctx,
        p_id,
        name_player,
        startingPos=new vector2(0,0),
    }) {
        this.alive=true;
        this.render=true;
        this.ctx=ctx;
        this.playerId = p_id;
        this.name_player = name_player;
        let startFrame = 6;
        this.sprite = new Sprite({_ressource:ressources.images["player_"+(p_id+1).toString()], 
                                  frameSize:new vector2(32,34),
                                  hFrames:6, 
                                  vFrames:2, 
                                  frame:startFrame, 
                                  scale:1, 
                                  position:startingPos,
                                  isPixelated:false});
        this.position = new vector2(startingPos.x, startingPos.y);

        this.speed=1;
        this.buildSpeed=0; //value that corresponds to t between 0 and 1 (will control speed of mvt)

        //bounds
        this.height_mult = 0.5;

        //inputs
        this.listKeys = list_all_movement_keys[p_id]; //for all inputs and keys
        this.keyControlSetUp();

        this.isMoving = false;
        this.flipX = false; //rotate the img

        //animation
        this.frameRateAnimation = 9; //corresponds to ... fps
        this.setAnimationHandler(startFrame = startFrame);


        //updates first
        this.update();
    }
    update() {
        //called to update all var and sprite
        this.checkMvt();
        this.handleAnim();
    }
    draw() {
        //called to update all var and sprite
        if (this.render)
            this.drawPlayer();
    }
    
    /* Player drawing part */
    drawPlayer() {
        this.sprite.drawSprite(this.ctx, this.flipX);
    }
    switchFrame(frameId) {
        this.sprite.frame=frameId;
    }
    updatePosSprite() {
        this.sprite.updatePosition(this.position, this.buildSpeed);
    }

    /* Player moving part */
    checkMvt() {
        var dir = new vector2(0,0);
        for (let i in this.listKeys){
            let key = this.listKeys[i];
            if (this.controller[key]){
                if (i==0){
                    dir.y-=this.speed;
                }else if (i==1){
                    dir.y+=this.speed;
                }else if (i==2){
                    dir.x-=this.speed;
                }else if (i==3){
                    dir.x+=this.speed;
                }else{
                    console.log("ERROR, YOU FORGOT A VALUE XD");
                }
            }
        }
        //animation/rotation
        if (dir.x<0){
            this.flipX = true;
        }
        else{
            this.flipX = false;
        }

        //normal vector for dir multiplications and maths
        if (dir.getVectLength()!=0){
            dir = this.checkOutOfBounds(dir)
            this.isMoving=true;
            if (this.buildSpeed<1){
                this.buildSpeed+=LERP_MULT;
            }
            this.move(dir.multiply(this.buildSpeed));
        }
        else{
            //set to a int pos
            if (this.isMoving) {
                this.sprite.setPosInt();
                this.isMoving=false;
            }
            //to smooth movement
            if (this.buildSpeed>0){
                this.buildSpeed=0;
            }
        }
    }

    checkOutOfBounds(dir) {
        let pos = this.position.add(dir);
        //console.log(pos, WINDOW_SIZE);
        if (pos.x >0 && pos.x < WINDOW_SIZE.x) {
            //only go in one direction
            if (pos.y > WINDOW_SIZE.y && pos.y < WINDOW_SIZE.y*3) {
                return dir;
            }
            else{
                return new vector2(dir.x,0); 
            }
        } if (pos.y > WINDOW_SIZE.y && pos.y < WINDOW_SIZE.y*3) {
            //only go in one direction
            if (pos.x >0 && pos.x < WINDOW_SIZE.x) {
                return dir;
            }
            else{
                return new vector2(0,dir.y); 
            }
        }
        return new vector2();
    }

    move(dir=new vector2(0,0)) {
        var absolute_dir = dir.getAbsolute();
        this.position = this.position.add(absolute_dir);
        this.updatePosSprite();
    }

    /*Animation Part*/
    setAnimationHandler() {
        let dic_anims = {'idle':new Animation({name:'idle',frameStart:6,frameEnd:9}),
                         'running':new Animation({name:'running',frameStart:0,frameEnd:5}),
        };

        this.animHandler = new AnimationHandler(dic_anims, 'idle', this.sprite, this.frameRateAnimation);
    }

    handleAnim() {
        if (this.isMoving){
            this.animHandler.setAnim("running");
        }
        else{
            this.animHandler.setAnim("idle");
        }
        this.animHandler.updateAnim();
    }

    /* Player control part */
    keyControlSetUp() {
        this.controller = {};
        for (let i in this.listKeys){
            this.controller[this.listKeys[i]]=false;
        }
    }

    control(event, set_true=true) {
        if (this.listKeys.includes(event.key)) {
            let pos_list = this.listKeys.indexOf(event.key) //get the pos in list to check which side it is
            if (pos_list=="0"){
                this.controller[this.listKeys[pos_list]] = set_true;
            }else if (pos_list=="1"){
                this.controller[this.listKeys[pos_list]] = set_true;
            }else if (pos_list=="2"){
                this.controller[this.listKeys[pos_list]] = set_true;
            }else if (pos_list=="3"){
                this.controller[this.listKeys[pos_list]] = set_true;
            }else{
                console.error('ERROR : KEY MESSED UP');
            }
        }
    }

    death() {
        this.alive = false;
        this.render = false;

        if (gameLoop.firstDeath == null){
            gameLoop.firstDeath = this.name_player;
        }
    }
}