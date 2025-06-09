var list_players = [];

const MAX_PLAYER = 3;

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
        for (i in list_players){
            if (temp!=null) {
                n_list.push(temp);
            }
            temp=list_players[i];
        }
        list_players=n_list;
        //remove html
        document.getElementById(list_players.length).remove();
    }
}