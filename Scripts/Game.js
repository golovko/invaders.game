import { Boss } from './Boss.js';
import Player from './Player.js';
import { Projectile } from './Projectile.js';
import { Wave } from './Wave.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = this.canvas.height;
    this.keys = [];
    this.player = new Player(this);

    this.projectilesPool = [];
    this.numberOfProjectile = 15;
    this.createProjectiles();
    this.fired = false;

    //waves
    this.columns = 1;
    this.rows = 1;
    this.enemySize = 80;
    this.waves = [];
    this.waves.push(new Wave(this));
    this.waveCount = 1;

    this.spriteUpdate = false;
    this.spriteTimer = 0;
    this.spriteInterval = 150;

    this.score = 0;
    this.gameOver = false;

    this.bossArray = [];
    this.bossLives = 10;
    this.restart();

    window.addEventListener('keydown', (e) => {
      if (this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      }
      if (e.key === '1' && !this.fired) this.player.shoot();
      this.fired = true;
      if (e.key === 'r' && this.gameOver) this.restart();
    });

    window.addEventListener('keyup', (e) => {
      this.fired = false;
      const index = this.keys.indexOf(e.key);
      if (index > -1) this.keys.splice(index, 1);
    });
  }

  render(context, deltaTime) {
    if (this.spriteTimer > this.spriteInterval) {
      this.spriteUpdate = true;
      this.spriteTimer = 0;
    } else {
      this.spriteUpdate = false;
      this.spriteTimer += deltaTime;
    }

    this.drawStatusText(context);
    this.projectilesPool.forEach((projectile) => {
      projectile.update();
      projectile.draw(context);
    });
    this.bossArray.forEach((boss) => {
      boss.draw(context);
      boss.update();
    });
    this.bossArray = this.bossArray.filter((boss) => !boss.markedForDeletion);

    this.player.draw(context);
    this.player.update();
    this.waves.forEach((wave) => {
      wave.render(context);
      if (wave.enemies.length < 1 && !wave.nextWaveTrigger && !this.gameOver) {
        this.newWave();
        wave.nextWaveTrigger = true;
      }
    });
  }

  createProjectiles() {
    for (let i = 0; i < this.numberOfProjectile; i++) {
      this.projectilesPool.push(new Projectile());
    }
  }

  getProjectile() {
    for (let i = 0; i < this.projectilesPool.length; i++) {
      if (this.projectilesPool[i].free) return this.projectilesPool[i];
    }
  }

  checkCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  drawStatusText(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = 'black';
    context.fillText('Score: ' + this.score, 20, 40);
    context.fillText('Wave: ' + this.waveCount, 20, 80);
    for (let i = 0; i < this.player.maxLives; i++) {
      context.strokeRect(20 + 20 * i, 100, 8, 15);
    }
    for (let i = 0; i < this.player.lives; i++) {
      context.fillRect(20 + 20 * i, 100, 8, 15);
    }
    // energy
    context.save();
    this.player.cooldown ? (context.fillStyle = 'red') : (context.fillStyle = 'gold');
    for (let i = 0; i < this.player.energy; i++) {
      context.fillRect(20 + 2 * i, 130, 2, 15);
    }
    context.restore();
    if (this.gameOver) {
      context.textAlign = 'center';
      context.font = '100px Impact';
      context.fillText('GAME OVER!', this.width * 0.5, this.height * 0.5);
      context.font = '20px Impact';
      context.fillText('Press R to restart', this.width * 0.5, this.height * 0.5 + 60);
    }
    context.restore();
  }

  newWave() {
    this.waveCount++;
    if (this.player.lives < this.player.maxLives) this.player.lives++;
    if (this.waveCount % 2 === 0) {
      this.bossArray.push(new Boss(this, this.bossLives));
    } else {
      if (Math.random() < 0.5 && this.columns * this.enemySize < this.width * 0.8) {
        this.columns++;
      } else if (this.rows * this.enemySize < this.height * 0.6) {
        this.rows++;
      }
      this.waves.push(new Wave(this));
      this.waves = this.waves.filter((wave) => !wave.markedForDeletion);
    }
  }

  restart() {
    this.player.restart();
    this.columns = 2;
    this.rows = 2;
    this.waves = [];
    this.waves.push(new Wave(this));
    this.bossArray = [];
    this.bossLives = 10;
    // this.bossArray.push(new Boss(this, this.bossLives));
    this.waveCount = 1;
    this.score = 0;
    this.gameOver = false;
  }
}
