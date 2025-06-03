import { list_all_movement_keys } from "./main.js";
import { ressources } from "./ressources.js";
import { Sprite } from "./sprite.js";
import { vector2 } from "./vector2.js";

const LERP_MULT = 0.25;

export class Player {
    constructor({
        ctx,
        p_id,
        startingPos=new vector2(0,0),
    }) {
        this.ctx=ctx;
        this.playerId = p_id;
        this.sprite = new Sprite({_ressource:ressources.images.player, 
                                  frameSize:new vector2(330,500),
                                  hFrames:4, 
                                  vFrames:4, 
                                  frame:0, 
                                  scale:0.1, 
                                  position:startingPos});
        this.position = new vector2(startingPos.x, startingPos.y);

        this.speed=12;
        this.buildSpeed=0; //value that corresponds to t between 0 and 1 (will control speed of mvt)

        this.listKeys = list_all_movement_keys[p_id]; //for all inputs and keys
        this.keyControlSetUp();
        this.update();
    } 
    update() {
        //called to update all var and sprite
        this.checkMvt()
        this.drawPlayer()
    }
    
    /* Player drawing part */
    drawPlayer() {
        this.sprite.drawSprite(this.ctx);
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
        if (dir.getVectLength()!=0){
            if (this.buildSpeed<1){
                this.buildSpeed+=LERP_MULT;
            }
            this.move(dir)
        }
        else{
            //to smooth movement
            if (this.buildSpeed>0){
                this.buildSpeed-=LERP_MULT;
            }
        }
    }

    move(dir=new vector2(0,0)) {
        this.position = this.position.add(dir);
        this.updatePosSprite();
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
}