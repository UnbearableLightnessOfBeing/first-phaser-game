import Phaser from "phaser";

export default class BombSpawner {

    private group: Phaser.Physics.Arcade.Group;

    constructor(private scene: Phaser.Scene, private key: string = 'bomb') {
        this.group = this.scene.physics.add.group();
    }

    public getGroup() {
        return this.group;
    }

    public spawn(playerX: number = 0) {
        const x = (playerX < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400); 
        const bomb = this.group.create(x, 16, this.key) as Phaser.Physics.Arcade.Image;
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        return bomb;
    }
}