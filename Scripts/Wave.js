import { Beetlemorph, Rhinomorph } from './Enemy.js';

export class Wave {
  constructor(game) {
    this.game = game;
    this.width = this.game.columns * this.game.enemySize;
    this.height = this.game.rows * this.game.enemySize;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = 0 - this.height;
    this.speedX = Math.random() < 0.5 ? -1 : 1;
    this.speedY = 0;
    this.enemies = [];
    this.nextWaveTrigger = false;
    this.markedForDeletion = false;
    this.create();
  }

  render(context) {
    if (this.y < 0) this.y += 5;
    this.speedY = 0;
    if (this.x < 0 || this.x > this.game.width - this.width) {
      this.speedX *= -1;
      this.speedY = this.game.enemySize;
    }
    this.x += this.speedX;
    this.y += this.speedY;
    this.enemies.forEach((enemy) => {
      enemy.update(this.x, this.y);
      enemy.draw(context);
    });
    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    if (this.enemies.length <= 0) this.markedForDeletion = true;
  }

  create() {
    for (let y = 0; y < this.game.rows; y++) {
      for (let x = 0; x < this.game.columns; x++) {
        if (Math.random() < 0.7) {
          this.enemies.push(new Beetlemorph(this.game, this.game.enemySize * x, this.game.enemySize * y));
        } else {
          this.enemies.push(new Rhinomorph(this.game, this.game.enemySize * x, this.game.enemySize * y));
        }
      }
    }
  }
}
