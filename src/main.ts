import Phaser from 'phaser';

import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';
import MenuScene from './scenes/MenuScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 330 },
    },
  },
  scene: [MenuScene, GameScene, GameOverScene]
}

export default new Phaser.Game(config);
