class Laser {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.height = this.game.height - 50;
  }
  render(context) {
    this.x = this.game.player.x + this.game.player.width * 0.5 - this.width * 0.5;
    this.game.player.energy -= this.damage;

    context.save();
    context.fillStyle = 'gold';
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = 'white';
    context.fillRect(this.x + this.width * 0.2, this.y, this.width * 0.6, this.height);
    context.restore();

    if (this.game.spriteUpdate) {
      this.game.waves.forEach((wave) => {
        wave.enemies.forEach((enemy) => {
          if (this.game.checkCollision(enemy, this) && enemy.y >= 0) {
            enemy.hit(this.damage);
          }
        });
      });

      this.game.bossArray.forEach((boss) => {
        if (this.game.checkCollision(boss, this) && boss.y >= 0) {
          boss.hit(this.damage);
        }
      });
    }
  }
  play(audio) {
    audio.play();
  }
}
class SmallLaser extends Laser {
  constructor(game) {
    super(game);
    this.width = 5;
    this.damage = 0.3;
    this.audio = document.getElementById('laser12');
  }
  render(context) {
    if (this.game.player.energy > 1 && !this.game.player.cooldown) {
      super.render(context);
      super.play(this.audio);
      this.game.player.frameX = 2;
    }
  }
}
class BigLaser extends Laser {
  constructor(game) {
    super(game);
    this.width = 25;
    this.damage = 0.7;
    this.audio = document.getElementById('laser8');
  }
  render(context) {
    if (this.game.player.energy > 1 && !this.game.player.cooldown) {
      super.render(context);
      super.play(this.audio);
      this.game.player.frameX = 3;
    }
  }
}

export {SmallLaser, BigLaser}