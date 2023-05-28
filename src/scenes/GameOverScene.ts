import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {

    // constructor(private label: Phaser.GameObjects.Text) {
    constructor(
        private chooseOptions: string[],
        private activeOptionPos: number,
        private options: Phaser.GameObjects.Text []
    ) {

        super('game-over-scene');

        this.chooseOptions = ['Play again', 'Menu'];
        this.activeOptionPos = 0;
        this.options = [];

    }

    preload() {

    }

    create() {

        this.options = [];

        this.cameras.main.fadeIn(200, 0, 0, 0);

        
        this.add.text(300, 50, 'Game over', {
            fontSize: '40px',
            color: '#fff'
        });


        let pos = 1;

        this.chooseOptions.forEach(optionText => {
            const option = this.createOption(this, 330, (100 + pos++ * 50), optionText);
            this.options.push(option);
            this.add.existing(option as Phaser.GameObjects.Text);
        });

        this.input.keyboard?.on('keydown-UP', () => {
            if (this.activeOptionPos !== 0) {
                this.activeOptionPos--;
            }
            this.setActiveOption();
        });

        this.input.keyboard?.on('keydown-DOWN', () => {
            if (this.activeOptionPos !== this.chooseOptions.length - 1) {
                this.activeOptionPos++;
            }
            this.setActiveOption();
        });

        this.setActiveOption();

        this.input.keyboard?.on('keydown-ENTER', () => {

            this.cameras.main.fadeOut(300, 0, 0, 0);

            if (this.chooseOptions[this.activeOptionPos] === 'Play again') {

                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('game-scene');
                });
            }
            else if (this.chooseOptions[this.activeOptionPos] === 'Menu') {

                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('menu-scene');
                });

            }
        });
    }
    
    update() {

    }


    createOption(scene: Phaser.Scene, x: number, y: number, text: string) {
        const option = new Phaser.GameObjects.Text(
            scene, x, y, text,
            {
                fontSize: '24px',
                color: '#fff'
            }
        );

        return option;
    }

    setActiveOption() {
        this.options.forEach(option => {
            if (option.text === this.chooseOptions[this.activeOptionPos]) {
                // option.setStyle({
                //     color: '#770',
                //     fontStyle: 'bold'
                // });
                option.setColor('#660');
            }
            else {
                // option.setStyle({
                //     color: '#fff',
                //     fontStyle: 'normal'
                // });
                option.setColor('#fff');
            }
        });
    }
}