import { SmallLaser, BigLaser } from './Laser.js';

class Player {
  constructor(game) {
    this.game = game;
    this.width = 140;
    this.height = 120;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height - this.height;
    this.speed = 5;
    this.lives = 3;
    this.maxLives = 10;
    this.image = document.getElementById('player');
    this.jets_image = document.getElementById('player_jets');

    this.frameX = 0;
    this.jetsFrame = 1;
    this.smallLaser = new SmallLaser(this.game);
    this.bigLaser = new BigLaser(this.game);
    this.energy = 100;
    this.maxEnergy = 100;
    this.cooldown = false;
  }

  draw(context) {
    // context.fillRect(this.x, this.y, this.width, this.height);
    if (this.game.keys.indexOf('1') > -1) {
      this.frameX = 1;
    } else if (this.game.keys.indexOf('2') > -1) {
      this.smallLaser.render(context);
    } else if (this.game.keys.indexOf('3') > -1) {
      this.bigLaser.render(context);
    } else {
      this.frameX = 0;
    }
    context.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.drawImage(
      this.jets_image,
      this.jetsFrame * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update() {
    //energy recharge
    if (this.energy < this.maxEnergy) this.energy += 0.05;
    if (this.energy < 1) {
      this.cooldown = true;
    } else if (this.energy > this.maxEnergy * 0.2) {
      this.cooldown = false;
    }

    if (this.game.keys.indexOf('ArrowLeft') > -1) {
      this.x -= this.speed;
      this.jetsFrame = 0;
    } else if (this.game.keys.indexOf('ArrowRight') > -1) {
      this.x += this.speed;
      this.jetsFrame = 2;
    } else {
      this.jetsFrame = 1;
    }
    //horizontal boundaries
    if (this.x < -this.width * 0.5) this.x = -this.width * 0.5;
    else if (this.x > this.game.width - this.width * 0.5) {
      this.x = this.game.width - this.width * 0.5;
    }
  }

  shoot() {
    const projectile = this.game.getProjectile();
    if (projectile) {
      projectile.start(this.x + this.width * 0.5, this.y);
    }
  }
  restart() {
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height - this.height;
    this.lives = 3;
  }
}

export default Player;
