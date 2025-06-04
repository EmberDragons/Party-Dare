import { GameLoop } from './game_system.js';
import { Player } from './player.js';
import { ressources } from './ressources.js';
import { Sprite } from './sprite.js';
import { vector2 } from './vector2.js';

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

var list_players = [];
export const list_all_movement_keys = {"0":["z","s","q","d"],
                                "1":["ArrowUp","ArrowDown","ArrowRight","ArrowLeft"],
                                "2":["o","l","k","m"],
};

//image set up
const background_sprite = new Sprite({
    _ressource:ressources.images.img_background,
    frameSize:new vector2(1800,2000),
    hFrames:0,
    vFrames:0,
    scale:0.1665,
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


export const addPlayer = () => {
    
    console.log("player added");
    let nb_players=list_players.length;
    var player = new Player({
        ctx:ctx,
        p_id:nb_players,
    });
    list_players.push(player);
}

//main code part
const update = () =>{
    //player logic
    for (let id in list_players) {
        list_players[id].update();
    }


}

const draw = () => {
    //first draw background
    background_sprite.drawSprite(ctx);
    
    //player logic
    for (let id in list_players) {
        list_players[id].draw();
    }
}


const gameLoop = new GameLoop(update, draw);
gameLoop.start();