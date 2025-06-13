import { BETS } from "./bet.js";
import { Text } from "./display.js";
import { list_players,list_victories,setPlayer,FRAMERATE } from "./main.js";
export class GameLoop{
    constructor(update, render){

        this.lastFrameTime=0;
        this.accumulatedTime=0;
        this.timeStep = 1000/FRAMERATE; //60 fps 


        this.update=update;
        this.render=render;

        this.rafTd = null;
        this.isRunning = false;

        this.firstDeath = null;
    }
    
    mainLoop = (timeStamp) => {
        if(!this.isRunning) return;

        let delta = timeStamp - this.lastFrameTime;
        this.lastFrameTime = timeStamp;

        this.accumulatedTime += delta;

        //we update only if the frame has passed
        while(this.accumulatedTime>=this.timeStep) {
            this.update(this.timeStep);
            this.accumulatedTime -= this.timeStep;
        }
        this.checkEnd(); //to be sure we haven't rech the end

        this.render();

        this.rafTd=requestAnimationFrame(this.mainLoop);
    }

    start() {
        setPlayer();
        if (!this.isRunning) {
            this.isRunning=true;
            this.rafTd=requestAnimationFrame(this.mainLoop);
        }
    }

    stop() {
        if(this.rafTd) {
            cancelAnimationFrame(this.rafId);
        }
        this.isRunning=false;
    }

    checkEnd() {
        let players_id = [];
        let storage_vict = "";
        
        for (let i in list_players){
            if (list_players[i].alive) {
                players_id.push(i);
            }
        }
        if (players_id.length == 0) {
            //wtf end or smth
            if (list_players.length == 1) {
                storage_vict=(list_victories[0]+1)+"&";
                localStorage.setItem("player_victories", storage_vict);
                this.end(list_players[0].name_player);
            }else
                this.end();
        }
        else if (players_id.length == 1){
            if (list_players.length !=1) {
                list_victories[players_id]+=1;
                for (let i in list_players){
                    storage_vict+=list_victories[i]+"&";
                }
                localStorage.setItem("player_victories", storage_vict);
                this.stop();
                this.end(this.firstDeath);
            }
        }
    }

    end(id=null) {
        if (this.text == undefined){
            let nb = Math.round(Math.random()*(BETS.length-1));
            this.bet = "damn that was cool...";
            if (id != null)
                this.bet = id+BETS[nb];
            this.text = new Text(this.bet);
        }
    }

    next_game() {
        open("continue.html", '_self');
    }
}
