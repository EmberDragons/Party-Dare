import { gameLoop } from "./main.js";


export class Text {
    constructor (text) {
        this.text = text;
        this.set_html();
    }

    set_html() {
        this.textHTML = document.createTextNode(this.text);

        document.getElementById("BET").appendChild(this.textHTML);
        this.start_anim();
    }

    start_anim() {
        let style = document.getElementById("BET").style;
        style.animation = "BET_ANIMATION_IN 2.5s ease";
        setTimeout(() => {
            this.end_anim()
        }, "2500"
        );
    }

    end_anim() {
        let style = document.getElementById("BET").style;
        style.animation = "BET_ANIMATION_OUT 2.5s ease";
        setTimeout(() => {
            this.end()
        }, "2500"
        );
    }

    end() {
        gameLoop.next_game();
    }
}