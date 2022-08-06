const gameState = {};

function preload() {
  this.load.image('bug1', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png');
  this.load.image('bug2', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_2.png');
  this.load.image('bug3', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_3.png');
  this.load.image('codey', 'https://content.codecademy.com/courses/learn-phaser/physics/codey.png');
}

function create() {
  gameState.active = true;
  gameState.cursors = this.input.keyboard.createCursorKeys();

  gameState.road1 = this.add.rectangle(config.width / 2, 150, config.width, 200, 0xbbbbbb);
  gameState.road2 = this.add.rectangle(config.width / 2, 450, config.width, 200, 0xbbbbbb);

  gameState.enemies = this.add.group()

  function makeBug() {
    const lane = this.lane

    const isEven = Boolean(lane % 2);
    const startY = config.height - (25 + (lane * 50));
    const bugs = ['bug1', 'bug2', 'bug3'];
    const bugChoice = bugs[lane % bugs.length];
    let startX, angle;

    if (isEven) {
      startX = config.width;
      angle = 90;
    } else {
      startX = 0;
      angle = -90;
    }

    const enemy = gameState.enemies.create(startX, startY, bugChoice).setAngle(angle)
    enemy.speed = this.speed
  }

  const lanes = [1, 2, 3, 4, 7, 8, 9, 10];
  const speeds = [3, 3, 5, 4, 8, 6, 6, 9];

  gameState.bugCreationEvents = [];

  for (let i = 0; i < lanes.length; i++) {
    gameState.bugCreationEvents.push(this.time.addEvent({
      delay: Math.random() * 600 + 1800,
      callback: makeBug,
      callbackScope: { lane: lanes[i], speed: speeds[i] },
      loop: true,
    }))
  }

  gameState.player = this.add.sprite(config.width / 2, config.height - 25, 'codey')

  this.input.on('pointerup', () => {
    if (gameState.active === false) {
      this.scene.restart();
    }
  })
}

function update(time) {
  if (gameState.active) {
    if (time > 3000) {
      if (gameState.cursors.left.isDown && gameState.player.x > 25) {
        gameState.player.x -= 5
      } else if (gameState.cursors.right.isDown && gameState.player.x < 675) {
        gameState.player.x += 5
      }

      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.up) && gameState.player.y > 25) {
        gameState.player.y -= 50
      } else if (Phaser.Input.Keyboard.JustDown(gameState.cursors.down) && gameState.player.y < 575) {
        gameState.player.y += 50
      }
    }

    const playerRect = gameState.player.getBounds();

    gameState.enemies.getChildren().forEach(bug => {
      if (bug.angle === 90) {
        bug.x -= bug.speed
      } else if (bug.angle === -90) {
        bug.x += bug.speed
      }
      if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, bug.getBounds())) {
        gameState.active = false

        this.add.text(300, 300, 'Game Over!', { fontSize: '15px', fill: '#000000' })
        for (let e of gameState.bugCreationEvents) {
          e.destroy();
        }
      }
    })

    if (gameState.player.y === 25) {

      this.add.text(300, 300, 'You Won!', { fontSize: '15px', fill: '#000000' })
      gameState.active = false

      for (let e of gameState.bugCreationEvents) {
        e.destroy();
      }
    }
  }
}

const config = {
  width: 700,
  height: 600,
  backgroundColor: 0xaaffaa,
  scene: {
    preload,
    create,
    update
  },
}

const game = new Phaser.Game(config)
