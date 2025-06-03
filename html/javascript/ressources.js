import { start_func } from "./main.js";
class Ressources {
    constructor() {
        this.toLoad = {
            player:"./javascript/src/player.png",
            img_background:"./javascript/src/img_background.jpg",
        };

        this.images={};

        Object.keys(this.toLoad).forEach(key => {
            const img= new Image();
            img.src=this.toLoad[key];
            this.images[key] = {
                image:img,
                isLoaded:false,
            };
            img.onload=() => {
                this.images[key].isLoaded=true;
                nb_img_loaded+=1;
                if (nb_img_loaded==Object.keys(this.toLoad).length){
                    //then we can start the game
                    console.log('loaded');
                    start_func();
                }
            };
        });
    }
}

var nb_img_loaded = 0;

export const ressources = new Ressources();