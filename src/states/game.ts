import * as Assets from "../assets"

// Music: http://sb.bitsnbites.eu/?data=U0JveAsC7dkxSgNBFADQv5NksdVCLPcOdjmJB7CyswgSRUwhWCSVYula2HgFGxGs9DIeQQexEFkJETMRfA9md-Yz-5n97FZ_uB6x2UTM4n28tm2bZ9upSsOXaHaqqxQrdtgdvukK7i2Yuy1w_rvPi8s5m88XyXxbpP7Xzz99cvplfb_Kz2jUGR13Rk8CAAAAAABgidLDJI_ZRkR78NGvSoOIJmJrrYoUvRRVL9-rPI2UI_1-sbONvol3tVVO_2Btj5aUd7_oW8yv7PHCOad-PAAAAAAA4F9Ku5PoPU3ybFAP8_WxrtJZRHNRj2vVAQAAAAAAgN-jNwcAAAAAAABl6M0BAAAAAABAGXpzAAAAAAAAUIbeHAAAAAAAAJShNwcAAAAAAABlvAE
// GameSFX: http://sb.bitsnbites.eu/?data=U0JveAsC7dwxSsRAFAbgl4wJC3bK9rmAF7AUPILdwjaC4A1EixRCWNjKFW3sBM8hpPIWHsURrYKlJGT5PkiYnzSPmfIns1lGVE152Ub6aCOv69P87uuiPItodvVNXqWDmNBmkG9jXrpBvp_Z_LtBfpnZ_K-D_BYAAAAAAADTKt_b_GyPIk7Or3LuqyItVsvmsbpYfH8vJpzt2fEAAAAAAACwR9LDNorPNkWsYp1jXxXlXXd4_JTWP__MTVjOXTseAAAAAAAA9shfd1p2v3da2h0AAAAAAAD4P7o5AAAAAAAAGIduDgAAAAAAAMahmwMAAAAAAIBx6OYAAAAAAABgHF8

export default class Game extends Phaser.State {
  private static ORB_ENERGY: number = 100
  private static BASE_SPEED: number = 300
  private static STAR_MIN_SPEED: number = Game.BASE_SPEED * 0.1
  private static STAR_MAX_SPEED: number = Game.BASE_SPEED * 0.5

  private score: number = 0
  private highScore: number = 0
  private scoreText: Phaser.Text
  private scoreTween: Phaser.Tween
  private highScoreText: Phaser.Text

  private player: Phaser.Sprite
  private shadow: Phaser.Sprite
  private flare: Phaser.Sprite
  private line: Phaser.Rope
  private lineSections = 20

  private orbs: Phaser.Group
  private stars: Phaser.Group
  // private clouds: Phaser.Group
  private gameSfx: Phaser.AudioSprite
  private orbSfxSounds: Array<any>

  private blurXFilter: Phaser.Filter.BlurX
  private blurYFilter: Phaser.Filter.BlurY

  private floor: number = 0
  private floorBoost: number = 0
  private cursors: Phaser.CursorKeys

  private playerEnergyDecay: number = 1
  private playerEnergy: number
  private playerPower: number
  private playerEnergyAlert: boolean

  private energyText: Phaser.Text

  private mobileLeft: boolean = false
  private mobileRight: boolean = false

  public create(): void {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
    this.game.stage.backgroundColor = "#ffdc91"
    this.floor = this.game.height - 50
    this.floorBoost = this.game.height / 2 + 50
    // Player
    this.player = this.game.add.sprite(
      this.game.world.centerX,
      this.floor,
      Assets.Spritesheets.SpritesheetsShip.getName()
    )
    this.player.anchor.setTo(0.5, 1)
    this.game.physics.arcade.enable(this.player)
    this.player.body.setSize(
      this.player.width * 0.8,
      this.player.height * 0.80,
      this.player.width * 0.2 / 2,
      this.player.height * 0.20
    )
    this.player.body.fixedRotation = true
    this.player.body.collideWorldBounds = true
    this.player.body.gravity.y = 50
    this.playerEnergy = Game.ORB_ENERGY
    this.playerEnergyAlert = false
    this.player.body.velocity.y = -Game.BASE_SPEED * 0.2
    // this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.2)

    this.blurXFilter = this.game.add.filter(
      Assets.Scripts.ScriptsBlurX.getName()
    ) as Phaser.Filter.BlurX
    this.blurXFilter.blur = 8
    this.blurYFilter = this.game.add.filter(
      Assets.Scripts.ScriptsBlurY.getName()
    ) as Phaser.Filter.BlurY
    this.blurYFilter.blur = 2

    const shadowBmd = this.game.make.bitmapData()
    shadowBmd.load(Assets.Spritesheets.SpritesheetsShip.getName())
    shadowBmd.processPixelRGB(pixel => {
      pixel.r = 0x5f
      pixel.g = 0x4d
      pixel.b = 0x8b
      return pixel
    }, this)
    this.game.cache.addSpriteSheet(
      "shadow",
      null,
      shadowBmd.canvas,
      64,
      64,
      3,
      0,
      0
    )
    this.shadow = this.game.add.sprite(
      24,
      -this.player.height / 2 + 10,
      "shadow"
    )
    this.shadow.scale.set(0.6)
    this.shadow.anchor.setTo(0, 1)
    this.shadow.alpha = 0.5
    this.shadow.filters = [this.blurXFilter, this.blurYFilter]
    this.player.addChild(this.shadow)

    const line = this.game.add.bitmapData(this.game.height, 6)
    line.context.fillStyle = "#dbf3fc"
    line.context.fillRect(0, 0, this.game.height, 1)
    line.context.fillRect(0, 5, this.game.height, 1)
    line.context.fillStyle = "#ffffff"
    line.context.fillRect(0, 1, this.game.height, 4)

    const lineSpace = this.game.height / this.lineSections
    const linePath = []
    for (let i = 0; i < this.lineSections; ++i) {
      linePath[i] = new Phaser.Point(0, i * lineSpace)
    }
    this.line = this.game.add.rope(
      this.player.x,
      this.game.height + this.player.y,
      line,
      null,
      linePath
    )
    //this.line.scale.set(1, 1)
    this.line.angle = 180

    const player = this.player
    const game = this.game
    this.line.updateAnimation = function() {
      for (let i = 0; i < this.points.length - 1; ++i) {
        // this.points[i + 1].x = this.points[i].x
        this.points[i].x = this.points[i + 1].x
      }
      this.points[this.points.length - 1].x = -player.x + game.width / 2
      // this.points[0].x = player.x
    }
    // this.lineSprite = this.game.add.sprite(-3,0,line)
    // this.player.addChild(this.line)

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
    // Orbs
    this.initOrbs()
    // Clouds
    //this.initClouds()

    // Sort layers
    // this.game.world.bringToTop(this.clouds)
    this.game.world.bringToTop(this.stars)
    this.game.world.bringToTop(this.orbs)
    this.game.world.bringToTop(this.line)
    this.game.world.bringToTop(this.player)

    // CONTROLS
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.game.input.onUp.add(this.mobileUntouch, this)
    this.game.input.onDown.add(this.mobileTouch, this)

    // SCORE
    this.score = 0
    if (window.localStorage) {
      const hs = window.localStorage.getItem("highscore")
      if (hs) {
        this.highScore = parseInt(hs) || 0
      }
    }
    this.scoreText = this.game.add.text(this.game.width / 2, 20, "0", {
      font: "20px sans-serif",
      fill: "#5f4d8b"
    })
    this.scoreText.anchor.set(0.5, 0.5)
    this.scoreTween = this.game.add.tween(this.scoreText.scale)
    this.scoreTween.to(
      { x: 1.5, y: 1.5 },
      100,
      Phaser.Easing.Cubic.Out,
      false,
      0,
      0,
      true
    )

    this.highScoreText = this.game.add.text(
      this.game.width - 8,
      8,
      "BEST: " + this.highScore,
      {
        font: "14px sans-serif",
        fill: "#5f4d8b"
      }
    )
    this.highScoreText.anchor.set(1, 0)

    // MUSIC
    // this.game.sound.stopAll()
    this.gameSfx = this.game.add.audioSprite(
      Assets.Audiosprites.AudiospritesGameSfx.getName()
    )
    const availableSFX = Assets.Audiosprites.AudiospritesGameSfx.Sprites
    this.orbSfxSounds = [
      availableSFX.Orb2,
      availableSFX.Orb4,
      availableSFX.Orb3,
      availableSFX.Orb1,
      availableSFX.Orb5,
      availableSFX.Orb6,
      availableSFX.Orb7,
      availableSFX.Orb8
    ]
    // this.game.sound.play(Assets.Audio.AudioMusic.getName(), 0.3, true)

    // ENERGY TEXT
    if (DEBUG) {
      this.energyText = this.game.add.text(0, 0, "0", {
        font: "20px Arial",
        fill: "#FFFFFF"
      })
      this.energyText.anchor.setTo(0.5)
    }
  }

  // UPDATE

  public update() {
    if (this.playerEnergy > 0) {
      const maxLatSpeed =
        Game.BASE_SPEED + this.playerPower * Game.BASE_SPEED * 8

      if (this.cursors.left.isDown || this.mobileLeft) {
        this.player.body.velocity.x = Math.max(
          this.player.body.velocity.x - Game.BASE_SPEED * 0.4,
          -maxLatSpeed
        )
        this.player.frame = 1
        this.shadow.frame = 1
      } else if (this.cursors.right.isDown || this.mobileRight) {
        this.player.body.velocity.x = Math.min(
          this.player.body.velocity.x + Game.BASE_SPEED * 0.4,
          maxLatSpeed
        )
        this.player.frame = 2
        this.shadow.frame = 2
      } else {
        this.player.frame = 0
        this.shadow.frame = 0
        this.player.body.velocity.x *= 0.8
      }

      this.game.physics.arcade.overlap(
        this.player,
        this.orbs,
        this.collectOrb,
        null,
        this
      )

      if (this.player.y >= this.game.height) {
        if (!this.playerEnergyAlert) {
          this.playerEnergyAlert = true
          this.gameSfx.play("lowEnergy")
        }
        this.playerEnergy -= this.playerEnergyDecay
        this.player.alpha =
          this.game.rnd.integerInRange(
            this.playerEnergy * 0.8,
            this.playerEnergy * 1.2
          ) / Game.ORB_ENERGY
      } else {
        this.player.alpha = 1.0
        this.playerEnergyAlert = false
      }
      this.playerPower = -(this.player.y - this.game.height) / this.floorBoost
      this.line.y = this.game.height + this.player.y - 36
      this.flare.alpha = this.playerPower + 0.1
      this.flare.scale.set(1, 1 + this.playerPower)
    } else {
      this.playerDead()
    }

    this.updateStars(this.playerPower * Game.BASE_SPEED * 2)
    this.updateOrbs(this.playerPower * Game.BASE_SPEED * 2)
    // this.updateClouds(this.playerPower * Game.BASE_SPEED)
    if (DEBUG) {
      this.updateEnergy()
    }
  }

  private initStars() {
    this.stars = this.game.add.group()
    this.stars.enableBody = true
    this.stars.createMultiple(200, Assets.Images.ImagesStar.getName())
    this.stars.iterate("exists", false, Phaser.Group.RETURN_TOTAL, star => {
      star.tint = 0x46426c
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
      Game.STAR_MIN_SPEED,
      Game.STAR_MAX_SPEED
    )
    star.body.velocity.y = star.body.vel + playerSpeed
    star.alpha =
      (star.body.vel - Game.STAR_MIN_SPEED) / Game.STAR_MAX_SPEED + 0.1
    star.scale.setTo(star.alpha * 2, star.alpha * 2)
  }

  private initOrbs() {
    this.orbs = this.game.add.group()
    this.orbs.enableBody = true
    this.orbs.createMultiple(1, Assets.Images.ImagesOrb.getName())

    this.orbs.forEach(orb => {
      orb.exists = true
      orb.anchor.set(0.5, 0.5)
      orb.body.vel = Game.BASE_SPEED
      orb.body.angularVelocity = orb.body.vel
    }, this)
  }

  private updateOrbs(playerSpeed: number) {
    this.orbs.forEach(orb => {
      if (!orb.alive) {
        orb.revive()
        orb.position.setTo(
          this.game.rnd.integerInRange(orb.width, this.game.width - orb.width),
          -128
        )
      } else if (orb.y > this.game.height) {
        orb.body.velocity.y = orb.body.vel + playerSpeed
        orb.position.setTo(
          this.game.rnd.integerInRange(orb.width, this.game.width - orb.width),
          -32
        )
        this.updateScore(0)
      } else {
        orb.body.velocity.y = orb.body.vel + playerSpeed
        // orb.body.angularVelocity = orb.body.vel + playerSpeed
      }
    }, this)
  }

  private collectOrb(player, orb) {
    // Removes the star from the screen
    orb.kill()
    // Play sound
    const idx = Math.min(
      Math.floor(this.orbSfxSounds.length * this.playerPower),
      this.orbSfxSounds.length - 1
    )
    this.gameSfx.play(this.orbSfxSounds[idx])
    this.game.camera.flash(0xffffff, 100)
    //  Add and update the score
    this.playerEnergy = Game.ORB_ENERGY
    this.updateScore(this.score + 1)
    this.playerBoost()
  }

  private updateEnergy() {
    this.energyText.text = [this.playerEnergy, this.playerPower]
      .map(e => e.toFixed(2))
      .join("\n")
    this.energyText.position.set(this.player.x, this.player.y - 100)
    if (this.playerEnergy < Game.ORB_ENERGY) {
      this.energyText.fill = "#FF0000"
    } else {
      this.energyText.fill = "#FFFFFF"
    }
  }

  private updateScore(newScore: number) {
    if (newScore !== this.score) {
      this.score = newScore
      this.scoreText.text = this.score.toString()
      if (this.score > 0) {
        this.scoreTween.start()
      }
      if (this.score > this.highScore) {
        this.highScore = this.score
        if (window.localStorage) {
          window.localStorage.setItem("highscore", this.highScore.toString())
        }
      }
      this.highScoreText.text = "BEST: " + this.highScore.toString()
    }
  }

  private playerBoost() {
    if (this.player.y > this.floorBoost) {
      this.player.body.velocity.y =
        -Game.BASE_SPEED * Math.max(0, 1 - this.playerPower) * 0.5
    }
  }

  private playerDead() {
    this.player.body.velocity.x = 0
    this.player.alpha = 0
    this.gameSfx.play("gameOver")
    //go to gameover after a few miliseconds
    this.gameOver()
  }

  private gameOver() {
    this.game.camera.onFadeComplete.addOnce(() => {
      this.game.state.start("game")
    }, this)
    this.game.camera.fade(0xffdc91, 1000)
  }

  private mobileTouch(point) {
    if (point.x > this.game.width / 2) {
      this.mobileRight = true
    } else {
      this.mobileLeft = true
    }
  }

  private mobileUntouch(point) {
    this.mobileRight = false
    this.mobileLeft = false
  }

  // public render() {
  //   if (DEBUG) {
  //     this.game.debug.bodyInfo(this.player, 16, 64);
  //     this.game.debug.body(this.player);
  //   }
  // }

  // private initClouds() {
  //   this.clouds = this.game.add.group()
  //   this.clouds.enableBody = true
  //   this.clouds.createMultiple(5, Assets.Images.ImagesCloud.getName())

  //   this.clouds.forEach(cloud => {
  //     cloud.exists = true
  //     cloud.anchor.set(0.5, 0)
  //     cloud.scale.set(this.game.rnd.integerInRange(2.5, 3))
  //     cloud.body.vel = this.game.rnd.integerInRange(
  //       Game.BASE_SPEED * 0.05, Game.BASE_SPEED * 0.01
  //     )
  //     cloud.position.setTo(
  //       this.game.rnd.integerInRange(0, this.game.width),
  //       this.game.rnd.integerInRange(-cloud.height, -this.game.height),
  //     )
  //   }, this)
  // }

  // private updateClouds(playerSpeed: number) {
  //   this.clouds.forEach(cloud => {
  //     if (cloud.y > this.game.height) {
  //       cloud.body.velocity.y = cloud.body.vel + playerSpeed * 0.3
  //       cloud.position.setTo(
  //         this.game.rnd.integerInRange(0, this.game.width),
  //         this.game.rnd.integerInRange(-cloud.height, -this.game.height),
  //       )
  //     } else {
  //       cloud.body.velocity.y = cloud.body.vel + playerSpeed * 0.3
  //     }
  //   }, this)
  // }
}
