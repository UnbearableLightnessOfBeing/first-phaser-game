import Phaser from 'phaser';
import ScoreLabel from './../ui/ScoreLabel';
import BombSpawner from './../baddies/BombSpawner';

const GROUND_KEY = 'ground';
const DUDE_KEY = 'dude';
const STAR_KEY = 'star';
const BOMB_KEY = 'bomb';

export default class GameScene extends Phaser.Scene {


    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private stars?: Phaser.Physics.Arcade.Group;
    private scoreText?: ScoreLabel;
    // private bombs?: Phaser.Physics.Arcade.Group;
    private bombSpawner?: BombSpawner;

    private gameOver: boolean = false;

    constructor() {
        super('game-scene');
    }

    preload() {
        this.load.image('yellow', 'https://labs.phaser.io/assets/particles/yellow.png');

        this.load.image('sky', '/game-assets/sky.png');
        this.load.image(GROUND_KEY, '/game-assets/platform.png');
        this.load.image(STAR_KEY, '/game-assets/star.png');
        this.load.image(BOMB_KEY, '/game-assets/bomb.png');
        this.load.spritesheet(DUDE_KEY,
            '/game-assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);

        this.add.image(400, 300, 'sky');

        this.platforms = this.createPlatforms();

        this.player = this.createPlayer();

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard?.createCursorKeys();

        this.stars = this.createStars();

        this.physics.add.collider(this.stars, this.platforms);

        this.physics.add.overlap(
            this.player,
            this.stars,
            this.collectStars as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        this.scoreText = this.createScoreLabel(16, 16, 0);

        this.bombSpawner = new BombSpawner(this, BOMB_KEY);
        const bombsGroup = this.bombSpawner.getGroup();
        this.physics.add.collider(bombsGroup, this.platforms);
        this.physics.add.collider(
            this.player,
            bombsGroup,
            this.hitBomb as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('game-over-scene');
        });

            this.bombSpawner?.spawn(this.player.x);
            this.bombSpawner?.spawn(this.player.x);
            this.bombSpawner?.spawn(this.player.x);
    }

    createScoreLabel(x: number, y: number, score: number): ScoreLabel {
        const label = new ScoreLabel(
            this,
            x,
            y,
            score,
            { fontSize: '32px', color: '#000' } as Phaser.GameObjects.TextStyle
        );

        this.add.existing(label);

        return label;
    }

    createStars(): Phaser.Physics.Arcade.Group {
        const stars = this.physics.add.group({
            key: STAR_KEY,
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate((child: Phaser.GameObjects.GameObject) => {
            const c = child as Phaser.Physics.Arcade.Image;
            c.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            return null;
        })

        return stars;
    }

    createPlatforms(): Phaser.Physics.Arcade.StaticGroup {
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();
        platforms.create(600, 400, GROUND_KEY);
        platforms.create(50, 250, GROUND_KEY);
        platforms.create(750, 220, GROUND_KEY);
        return platforms;
    }

    createPlayer(): Phaser.Physics.Arcade.Sprite {
        const player = this.physics.add.sprite(100, 450, DUDE_KEY);
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ {key: DUDE_KEY, frame: 4 }],
            frameRate: 20,
        });

        return player;
    }

    update() {
        if (this.gameOver) {
            this.cameras.main.fadeOut(200, 0, 0, 0);
            this.gameOver = false;
        }

        if (!this.cursors) {
            return;
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body?.touching.down) {
            this.player.setVelocityY(-330);
        }
        
    }

    private collectStars(player: Phaser.Physics.Arcade.Sprite, star: Phaser.GameObjects.GameObject) {
        (<Phaser.Physics.Arcade.Image>star).disableBody(true, true);

        this.scoreText?.add(10);

        if (this.stars?.countActive(true) === 0) {
            this.stars.children.iterate((child: Phaser.GameObjects.GameObject) => {
                const s = child as Phaser.Physics.Arcade.Image;
                s.enableBody(true, s.x, 0, true, true);
                return null;
            });

            this.bombSpawner?.spawn(player.x);
        }

        this.emitParticles(star);
    }

    private emitParticles(star: Phaser.GameObjects.GameObject) {

        const emitter = this.add.particles(0, 0, 'yellow', {
            speed: 150,
            scale: { start: 0.15, end: 0 },
            blendMode: "ADD",
            lifespan: 800
        });

        emitter.startFollow(star);
        setTimeout(() => {
            emitter.stop();
        }, 200);
        setTimeout(() => {
            emitter.destroy();
        }, 1000);

    }

    private hitBomb(player: Phaser.Physics.Arcade.Sprite) {
        this.physics.pause();
        player.setTint(0xff00000);
        player.anims.play('turn');
        this.gameOver = true;
    }
}