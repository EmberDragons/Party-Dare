class Ressources {
    constructor() {
        this.toLoad = {
            player:"./javascript/src/player-sprite.png",
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
            };
        });
    }
}


export const ressources = new Ressources();