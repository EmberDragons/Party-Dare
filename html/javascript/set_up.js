import { AnimationLoop } from "./animation_loop.js";
import { PlayerAnim } from "./player_animation.js";
import { ressources } from "./ressources.js";
import { Sprite } from "./sprite.js";
import { vector2 } from "./vector2.js";

var list_players = [];
const MAX_PLAYER = 3;

const ctx = canvas.getContext("2d");
var Anims = [];

//position of where the animation will appear
const anim_pos = [
    [20,45,27],
    [70,57,24],
    [82,25,30],
]


function Play() {
    if (list_players.length!=0){
        let names = "";
        let victories = "";
        for (let player in list_players) {
            names+=list_players[player]+"&";
            victories+="0&";
        }

        localStorage.setItem("player_names", names);
        localStorage.setItem("player_victories", victories);

        open("index.html", '_self');
    } else {
        alert('You must have players in order to have fun XD');
    }
}

function addPlayer() {
    if (list_players.length<MAX_PLAYER){
        let nme = document.getElementById("name").value;
        document.getElementById("name").value = "";
        if (nme!="" && list_players.includes(nme)==false){
            document.getElementById("players").innerHTML+="<div class='players' id='"+list_players.length+"'>"+nme+"</div>";
            list_players.push(nme);
            addAnim(Anims.length, anim_pos[list_players.length-1][0], anim_pos[list_players.length-1][1], anim_pos[list_players.length-1][2]);
        } else {
            alert("Please enter a name (that is not already used)");
        }
    }
    else alert("Saddly more players is not yet supported");
}
function removePlayer() {
    if (list_players.length!=0){
        let n_list = [];
        let temp = null;
        for (let i in list_players){
            if (temp!=null) {
                n_list.push(temp);
            }
            temp=list_players[i];
        }
        list_players=n_list;
        //remove html
        document.getElementById(list_players.length).remove();
        removeAnim()
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
    var anim = new PlayerAnim(ctx, nb, posx, posy, dist_travel);
    Anims.push(anim);
}

function removeAnim() {
    let ind = Anims.length-1;
    var tempList = [];
    if (ind>0){
        for (let i in Anims){
            if (i<Anims.length-1) {
                tempList.push(Anims[i]);
            }
        }
    }
    Anims=tempList;
}


const gameLoop = new AnimationLoop(update, draw);
gameLoop.start();

document.getElementById("play").onclick = Play;
document.getElementById("add_player").onclick = addPlayer;
document.getElementById("remove_player").onclick = removePlayer;