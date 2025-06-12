import { GameLoop } from './game_system.js';
import { Player } from './player.js';
import { ressources } from './ressources.js';
import { Sprite } from './sprite.js';
import { vector2 } from './vector2.js';
import { attackManager } from './attack.js';

const canvas = document.querySelector("#canvas");
export const ctx = canvas.getContext("2d");
export const FRAMERATE = 60;

export var list_players = [];
export var list_victories= [];
export const list_all_movement_keys = {"0":["w","s","a","d"],
                                "1":["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],
                                "2":["i","k","j","l"],
};

// important var
const WINDOW_SIZE_MULT = 0.1665;
export const WINDOW_SIZE = new vector2(130,20); //set by me duh

//image set up
const background_sprite = new Sprite({
    _ressource:ressources.images.img_background,
    frameSize:new vector2(1800,2000),
    hFrames:0,
    vFrames:0,
    scale:WINDOW_SIZE_MULT,
});




//input for player control
window.addEventListener("keydown", (event) => {
    for (let p in list_players) {
        list_players[p].control(event, true);
    }
});
window.addEventListener("keyup", (event) => {
    for (let p in list_players) {
        list_players[p].control(event, false);
    }
});


export const setPlayer = () => {
    let players = localStorage.getItem("player_names").split("&");
    let vict = localStorage.getItem("player_victories").split("&");
    for (let i in players) {
        if (players[i]!=""){
            var player = new Player({
                ctx:ctx,
                p_id:parseInt(i),
                name_player:players[i],
                startingPos:new vector2(Math.round(WINDOW_SIZE.x/2),Math.round(WINDOW_SIZE.y/2)+12),
                list_all_movement_key:list_all_movement_keys,
                WINDOW_SIZE:WINDOW_SIZE,
            });
            list_players.push(player);
            list_victories.push(parseInt(vict[i]));
        }
    }
}

//main code part
const update = () =>{
    //player logic
    for (let id in list_players) {
        list_players[id].update();
    }
    attackManager.update();
}

const draw = () => {
    //first draw background
    background_sprite.drawSprite(ctx);
    
    //player logic
    //we want to draw them based on their z (y) position
    let list_players_priorities = []; //for dome reason copying the list also comes with border effects
    for (let id in list_players) {
        list_players_priorities.push(list_players[id]);
    }
    for (let id in list_players_priorities) {
        if (id>0 && list_players_priorities[id-1].position.y > list_players_priorities[id].position.y){
            //swap places
            let temp_var = list_players_priorities[id-1];
            list_players_priorities[id-1] = list_players_priorities[id]
            list_players_priorities[id] = temp_var;
        }
    }
    for (let id in list_players_priorities) {
        list_players_priorities[id].draw();
    }
    attackManager.draw();
}


export const gameLoop = new GameLoop(update, draw);
gameLoop.start();