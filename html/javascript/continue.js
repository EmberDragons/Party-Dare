import { AnimationLoop } from "./animation_loop.js";
import { PlayerAnim } from "./player_animation.js";
import { ressources } from "./ressources.js";
import { Sprite } from "./sprite.js";
import { vector2 } from "./vector2.js";

var list_players = [];

const ctx = canvas.getContext("2d");
var Anims = [];

//position of where the animation will appear
const anim_pos = [
    [20,45,27],
    [70,57,24],
    [82,25,30],
]

setUpPlayers();

function setUpPlayers(){
    list_players = localStorage.getItem('player_victories').split("&");
    for (let elt in list_players){
        if (list_players[elt] != "") {
            addAnim(Anims.length, anim_pos[elt][0], anim_pos[elt][1], anim_pos[elt][2]);
        }
    }
}



const update = () => {
    for (let player in Anims){
        Anims[player].move();
    }
}


const draw = () => {
    ctx.clearRect(0, 0, 800, 500); //clears the whole rect /page
    for (let player in Anims){
        Anims[player].draw();
    }
}

function addAnim(nb, posx, posy, dist_travel) {
    var anim = new PlayerAnim(ctx, nb, posx, posy, dist_travel, false, true);
    Anims.push(anim);
}



const gameLoop = new AnimationLoop(update, draw);
gameLoop.start();



document.getElementById("play").onclick = Play;
document.getElementById("menu").onclick = Menu;

function Play() {
    open("index.html",'_self');
}

function Menu() {
    open("game_set_up.html",'_self');
}