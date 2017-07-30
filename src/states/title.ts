import * as Assets from "../assets"

export default class Title extends Phaser.State {
  private static BASE_SPEED: number = 100
  private static STAR_MIN_SPEED: number = Title.BASE_SPEED * 0.1
  private static STAR_MAX_SPEED: number = Title.BASE_SPEED

  private titleScreen: Phaser.Sprite
  private instructions: Phaser.Text

  private player: Phaser.Sprite
  private flare: Phaser.Sprite

  private stars: Phaser.Group
  private gameSfx: Phaser.AudioSprite

  private floor: number = 0
  private floorBoost: number = 0
  private cursors: Phaser.CursorKeys

  public create(): void {
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
    this.game.stage.backgroundColor = "#ffdc91"
    this.floor = this.game.height - 50
    // Player
    this.player = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY + 128,
      Assets.Spritesheets.SpritesheetsShip.getName()
    )
    this.player.anchor.setTo(0.5, 1)

    const flare = this.game.add.sprite(
      0,
      0,
      Assets.Images.ImagesFlare.getName()
    )
    flare.anchor.setTo(0.5, 0.5)
    this.player.addChild(flare)

    this.flare = this.game.add.sprite(0, 0, Assets.Images.ImagesFlare.getName())
    this.flare.anchor.setTo(0.5, 0.5)
    this.player.addChild(this.flare)

    // Bg stars
    this.initStars()

    // CONTROLS
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.game.input.onDown.add(this.mobileTouch, this)

    // MUSIC
    this.game.sound.stopAll()
    this.gameSfx = this.game.add.audioSprite(
      Assets.Audiosprites.AudiospritesGameSfx.getName()
    )
    this.game.sound.play(Assets.Audio.AudioMusic.getName(), 0.3, true)

    this.titleScreen = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      Assets.Images.ImagesEnerzoid.getName()
    )
    this.titleScreen.anchor.set(0.5, 0.5)

    this.instructions = this.game.add.text(
      this.game.world.centerX,
      this.game.height - 100,
      "Press ← or → to start",
      {
        font: "20px sans-serif",
        fill: "#5f4d8b"
      }
    )
    this.instructions.anchor.set(0.5, 1)

    // Sort layers
    this.game.world.bringToTop(this.stars)
    this.game.world.bringToTop(this.instructions)
    this.game.world.bringToTop(this.player)
    this.game.world.bringToTop(this.titleScreen)
  }

  // UPDATE

  public update() {
    this.updateStars(Title.BASE_SPEED * 2)
    if (this.cursors.left.isDown || this.cursors.right.isDown) {
      this.startGame()
    }
  }

  private startGame() {
    const playerTween = this.game.add.tween(this.player)
    playerTween.to(
      { x: this.player.x, y: this.floor },
      1000,
      Phaser.Easing.Cubic.Out,
      false
    )
    playerTween.onComplete.addOnce(() => {
      this.game.state.start("game")
    }, this)
    playerTween.start()
  }

  private initStars() {
    this.stars = this.game.add.group()
    this.stars.enableBody = true
    this.stars.createMultiple(200, Assets.Images.ImagesStar.getName())
    this.stars.iterate("exists", false, Phaser.Group.RETURN_TOTAL, star => {
      star.tint = "#46426c"
      star.exists = true
      star.position.setTo(
        this.game.world.randomX,
        this.game.rnd.integerInRange(
          this.game.height,
          this.game.world.height - this.game.height
        )
      )
      this.setStarSpeed(star)
    })
  }

  private updateStars(playerSpeed: number) {
    this.stars.iterate("exists", true, Phaser.Group.RETURN_TOTAL, star => {
      if (star.position.y > this.game.height) {
        star.position.setTo(
          this.game.world.randomX,
          -this.game.rnd.integerInRange(1, 10)
        )
        this.setStarSpeed(star, playerSpeed)
      } else if (playerSpeed > 0) {
        star.body.velocity.y = star.body.vel + playerSpeed
      }
    })
  }

  private setStarSpeed(star: Phaser.Sprite, playerSpeed: number = 0) {
    star.body.vel = this.game.rnd.integerInRange(
      Title.STAR_MIN_SPEED,
      Title.STAR_MAX_SPEED
    )
    star.body.velocity.y = star.body.vel + playerSpeed
    star.alpha =
      (star.body.vel - Title.STAR_MIN_SPEED) / Title.STAR_MAX_SPEED + 0.1
    star.scale.setTo(star.alpha * 2, star.alpha * 2)
  }

  private mobileTouch(point) {
    this.startGame()
  }
}
