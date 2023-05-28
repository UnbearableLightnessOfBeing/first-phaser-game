import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {

    constructor() {

        super('menu-scene');
    }

    preload() {

        this.load.image('sky', '/game-assets/sky.png');
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);

        this.add.image(400, 300, 'sky');

        this.add.text(60, 300, 'Press Enter to start the game', {
            fontSize: '50px',
            fontFamily: 'Roboto',
            fontStyle: 'bold',
            color: '#000'
        });

        this.input.keyboard?.once('keydown-ENTER', () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('game-scene');
        });
    }
}