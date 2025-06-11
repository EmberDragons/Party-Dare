class Ressources {
    constructor() {
        this.toLoad = {
            player_1:"./javascript/src/p1.png",
            player_2:"./javascript/src/p2.png",
            player_3:"./javascript/src/p3.png",
            move_1:"./javascript/src/move_p1.png",
            move_2:"./javascript/src/move_p2.png",
            move_3:"./javascript/src/move_p3.png",
            img_background:"./javascript/src/img_background.jpg",
            circle:"./javascript/src/circle.png",
            horizontal:"./javascript/src/horizontal.png",
            vertical:"./javascript/src/vertical.png",
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