import { list_players, ctx, WINDOW_SIZE } from "./main.js";
import { vector2 } from "./vector2.js";
import { Sprite } from "./sprite.js";
import { ressources } from "./ressources.js";
import { Player } from "./player.js";

const MAX_STRENGTH = 10;
const MAX_SIZE = 3;
const MIN_SIZE = 0.5;

var MAX_NB_ATT = 4;

class AttackCircle {
    constructor ({
            pos,
            rad,
            speed
        }) {
        this.radius = rad;
        if (rad<MIN_SIZE){
            this.radius=MIN_SIZE;
        }
        if (rad>MAX_SIZE){
            this.radius=MAX_SIZE;
        }

        this.speed = speed;

        this.position = pos ?? new vector2(0,0);
        
        this.sprite = new Sprite({_ressource:ressources.images["circle"], 
            frameSize:new vector2(32,32), 
            scale:0, 
            position:pos,
            isPixelated:true,
            opacity:0.6});
        this.alert_sprite = new Sprite({_ressource:ressources.images["circle"], 
            frameSize:new vector2(32,32), 
            scale:this.radius, 
            position:pos,
            isPixelated:true,
            opacity:0.2});

        this.render = true;
        this.current_radius = 0;
    }
    update() {
        this.sprite.position = this.position;
        if (this.current_radius<this.radius)
            this.current_radius+=this.speed;
        else{
            this.destroy();
        }
        if (this.current_radius>=this.radius*0.99){
            //kill players inside
            this.sprite.opacity=1;
            this.kill();
        }
    }
    draw() {
        if (this.render){
            const DrawX = this.position.x - (this.sprite.frameSize.x * this.sprite.xScale) / 2;
            const DrawY = this.position.y - (this.sprite.frameSize.y * this.sprite.yScale) / 2;
            this.sprite.drawSprite(ctx, false, DrawX, DrawY);
            this.alert_sprite.drawSprite(ctx, false, this.position.x-16*this.radius, this.position.y-16*this.radius);
            this.sprite.updateSize(this.current_radius);
        }
    }

    kill() {
        if (this.render){
            for (let i in list_players){
                var attackRadius = this.current_radius*16;

                const playerCenter = new vector2(
                    list_players[i].position.x + list_players[i].sprite.frameSize.x * list_players[i].sprite.xScale / 2,
                    list_players[i].position.y + list_players[i].sprite.frameSize.y * list_players[i].sprite.yScale / 2
                );
                const DrawX = playerCenter.x - (list_players[i].sprite.frameSize.x * list_players[i].sprite.xScale) / 2;
                const DrawY = playerCenter.y - (list_players[i].sprite.frameSize.y * list_players[i].sprite.yScale) / 2;

                const pos = new vector2(DrawX, DrawY);
                const attPos = new vector2(this.position.x-9,this.position.y-9);
                
                const distBetween = Math.sqrt(((attPos.x-pos.x)**2+(attPos.y-pos.y)**2))
                if (distBetween<attackRadius*0.84-this.current_radius*2){ //safe dist
                    list_players[i].death();
                }
            }
        }
        this.render = false;
    }

    destroy(){
        this.render = false;
        let ind = 0;
        for (let i in attackManager.attacks) {
            if (attackManager.attacks[i] == this) {
                ind=i;
                break;
            }
        }
        attackManager.attackstoRemove.push(ind);
    }
}

class AttackHorizontal {
    constructor ({
            pos,
            size,
            speed
        }) {
        this.size = size;
        if (size<MIN_SIZE){
            this.size=MIN_SIZE;
        }
        if (size>MAX_SIZE){
            this.size=MAX_SIZE;
        }

        this.speed = speed;

        this.position = pos ?? new vector2(0,0);
        
        this.sprite = new Sprite({_ressource:ressources.images["horizontal"], 
            frameSize:new vector2(32,32), 
            scale:this.size, 
            position:pos,
            isPixelated:true,
            opacity:0.6});
        this.sprite.updateSizeY(0);
        this.sprite.updateSizeX(50);
        
        this.alert_sprite = new Sprite({_ressource:ressources.images["horizontal"], 
            frameSize:new vector2(32,32), 
            scale:this.size, 
            position:pos,
            isPixelated:true,
            opacity:0.2});
        this.alert_sprite.updateSizeX(50);

        this.render = true;
        this.current_size = 0;
    }
    update() {
        this.sprite.position = this.position;
        if (this.current_size<this.size)
            this.current_size+=this.speed;
        else{
            this.destroy();
        }
        if (this.current_size>=this.size*0.99){
            //kill players inside
            this.sprite.opacity=1;
            this.kill();
        }
    }
    draw() {
        if (this.render){
            const DrawX = this.position.x - (this.sprite.frameSize.x * this.sprite.xScale) / 2;
            const DrawY = this.position.y - (this.sprite.frameSize.y * this.sprite.yScale) / 2;
            this.sprite.drawSprite(ctx, false, DrawX, DrawY);
            this.alert_sprite.drawSprite(ctx, false, DrawX, this.position.y-16*this.size);
            this.sprite.updateSizeY(this.current_size);
        }
    }

    kill() {
        if (this.render){
            for (let i in list_players){
                var attackSize = list_players[i].sprite.xScale+this.current_size*3.8; 
                if (attackSize>15.5) attackSize = 15.5;
                if (this.size<=2) {
                    attackSize = 5+this.size*this.size*1.7;
                }
                if (this.size<=1.5) {
                    attackSize = 5+this.size*3.5;
                }
                const playerCenter = list_players[i].position.y + list_players[i].sprite.frameSize.y * list_players[i].sprite.yScale / 2;
                const DrawY = playerCenter - (list_players[i].sprite.frameSize.y * list_players[i].sprite.yScale) / 2;

                const pos = DrawY;
                const attPos = this.position.y-11;
                this.position=pos;
                
                const distBetween = Math.sqrt((attPos-pos)**2)

                if (distBetween<attackSize){ 
                    list_players[i].death();
                }
            }
        }
        this.render = false;
    }

    destroy(){
        this.render = false;
        let ind = 0;
        for (let i in attackManager.attacks) {
            if (attackManager.attacks[i] == this) {
                ind=i;
                break;
            }
        }
        attackManager.attackstoRemove.push(ind);
    }
}

class AttackVertical {
    constructor ({
            pos,
            size,
            speed
        }) {
        this.size = size;
        if (size<MIN_SIZE){
            this.size=MIN_SIZE;
        }
        if (size>MAX_SIZE){
            this.size=MAX_SIZE;
        }

        this.speed = speed;

        this.position = pos ?? new vector2(0,0);
        
        this.sprite = new Sprite({_ressource:ressources.images["vertical"], 
            frameSize:new vector2(32,32), 
            scale:this.size, 
            position:pos,
            isPixelated:true,
            opacity:0.6});
        this.sprite.updateSizeX(0);
        this.sprite.updateSizeY(50);
        
        this.alert_sprite = new Sprite({_ressource:ressources.images["vertical"], 
            frameSize:new vector2(32,32), 
            scale:this.size, 
            position:pos,
            isPixelated:true,
            opacity:0.2});
        this.alert_sprite.updateSizeY(50);

        this.render = true;
        this.current_size = 0;
    }
    update() {
        this.sprite.position = this.position;
        if (this.current_size<this.size)
            this.current_size+=this.speed;
        else{
            this.destroy();
        }
        if (this.current_size>=this.size*0.99){
            //kill players inside
            this.sprite.opacity=1;
            this.kill();
        }
    }
    draw() {
        if (this.render){
            const DrawX = this.position.x - (this.sprite.frameSize.x * this.sprite.xScale) / 2;
            const DrawY = this.position.y - (this.sprite.frameSize.y * this.sprite.yScale) / 2;
            this.sprite.drawSprite(ctx, false, DrawX, DrawY);
            this.alert_sprite.drawSprite(ctx, false, this.position.x-16*this.size, DrawY);
            this.sprite.updateSizeX(this.current_size);
        }
    }

    kill() {
        if (this.render){
            for (let i in list_players){
                var attackSize = list_players[i].sprite.yScale+this.current_size*3.8; 
                if (attackSize>15.5) attackSize = 15.5;
                if (this.size<=2) {
                    attackSize = 5+this.size*this.size*1.7;
                }
                if (this.size<=1.5) {
                    attackSize = 5+this.size*3.5;
                }
                const playerCenter = list_players[i].position.x + list_players[i].sprite.frameSize.x * list_players[i].sprite.xScale / 2;
                const DrawX = playerCenter - (list_players[i].sprite.frameSize.x * list_players[i].sprite.xScale) / 2;

                const pos = DrawX;
                const attPos = this.position.x-11;
                this.position=pos;
                
                const distBetween = Math.sqrt((attPos-pos)**2)

                if (distBetween<attackSize){ 
                    list_players[i].death();
                }
            }
        }
        this.render = false;
    }

    destroy(){
        this.render = false;
        let ind = 0;
        for (let i in attackManager.attacks) {
            if (attackManager.attacks[i] == this) {
                ind=i;
                break;
            }
        }
        attackManager.attackstoRemove.push(ind);
    }
}

class AttackManager {
    constructor({base_time, base_size}) {
        this.start = Date.now();
        this.timer = this.start;
        this.base_delta = base_time ?? 1000;
        this.base_size = base_size ?? 2;

        this.delta = 2000;
        this.size = 0;
        this.attacks = [];

        this.attackstoRemove=[];

        this.difficultyUp = Date.now();
    }
    update() {
        if (Date.now()-this.difficultyUp> 5000){
            //we up the diff every ... secs
            MAX_NB_ATT++;
            console.log(MAX_NB_ATT);
            this.difficultyUp=Date.now();
        }

        if (Date.now()-this.timer > this.delta){
            this.timer = Date.now();
            let pos = this.getPos();

            let attackType = getRandomInt(3);
            let att;
            if(attackType == 0)
                att = new AttackCircle({pos:pos, rad:this.size/15, speed:10/(this.delta)});
            if(attackType == 1)
                att = new AttackHorizontal({pos:pos, size:this.size/15, speed:10/(this.delta)});
            if(attackType == 2)
                att = new AttackVertical({pos:pos, size:this.size/15, speed:10/(this.delta)});
            if (attackType == 3) console.error("wtf");
            if (this.attacks.length<MAX_NB_ATT)
                this.attacks.push(att);

            //net attack set up
            let currStr = this.getRandomStrength()+(this.timer-this.start)*0.003;
            this.delta = (500+(this.base_delta/currStr)*2);
            this.size = (this.base_size+currStr);
        }
        for (let i in this.attacks){
            this.attacks[i].update();
        }
        this.removeEndedAttacks();
    }
    removeEndedAttacks() {
        if (this.attackstoRemove.length>0){
            this.attackstoRemove.sort();
            this.attackstoRemove.reverse();
            for (let attack in this.attackstoRemove){
                attackManager.attacks = attackManager.attacks.slice(attack);
            }
            this.attackstoRemove = [];
        }
    }
    draw() {
        for (let i in this.attacks){
            this.attacks[i].draw();
        }
    }
    getRandomStrength() {
        return getRandomInt(MAX_STRENGTH);
    }

    getPos(){
        let nb = getRandomInt(2);
        if (nb==0) {
            let pos = new vector2(0,0);
            pos.x = getRandomInt(WINDOW_SIZE.x);
            pos.y = getRandomInt(WINDOW_SIZE.y*3);
            return pos;
        }    
        if (nb==1) {
            let n_nb = getRandomInt(list_players.length-1);
            return list_players[n_nb];
        }
    }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export const attackManager = new AttackManager(2000,2);