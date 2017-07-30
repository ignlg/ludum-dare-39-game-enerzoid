import * as Utils from "../utils/utils"
import * as Assets from "../assets"

export default class Boot extends Phaser.State {
  public preload(): void {
    // Load any assets you need for your preloader state here.
    this.game.load.atlasJSONArray(
      Assets.Atlases.AtlasesPreloadSpritesArray.getName(),
      Assets.Atlases.AtlasesPreloadSpritesArray.getPNG(),
      Assets.Atlases.AtlasesPreloadSpritesArray.getJSONArray()
    )
  }

  public create(): void {
    this.input.maxPointers = 1
    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
    const ratio = Utils.ratio()
    this.game.scale.setUserScale(ratio, ratio)
    this.game.renderer.renderSession.roundPixels = true
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)

    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true

    window.onresize = () => {
      this.resize()
    }

    if (this.game.device.desktop) {
      // Any desktop specific stuff here
    } else {
      this.game.scale.forceOrientation(false, true)
    }

    if (DEBUG) {
      // Use DEBUG to wrap code that should only be included in a DEBUG build of the game
      // DEFAULT_GAME_WIDTH is the safe area width of the game
      // DEFAULT_GAME_HEIGHT is the safe area height of the game
      // MAX_GAME_WIDTH is the max width of the game
      // MAX_GAME_HEIGHT is the max height of the game
      // game.width is the actual width of the game
      // game.height is the actual height of the game
      // GOOGLE_WEB_FONTS are the fonts to be loaded from Google Web Fonts
      // SOUND_EXTENSIONS_PREFERENCE is the most preferred to least preferred order to look for audio sources
      console.log(
        `DEBUG....................... ${DEBUG}
             \nDEFAULT_GAME_WIDTH.......... ${DEFAULT_GAME_WIDTH}
             \nDEFAULT_GAME_HEIGHT......... ${DEFAULT_GAME_HEIGHT}
             \ngame.width.................. ${this.game.width}
             \ngame.height................. ${this.game.height}
             \nGOOGLE_WEB_FONTS............ ${GOOGLE_WEB_FONTS}
             \nSOUND_EXTENSIONS_PREFERENCE. ${SOUND_EXTENSIONS_PREFERENCE}`
      )
      console.log(
        this.game.scale.width,
        this.game.scale.height,
        this.game.scale
      )
    }
    this.game.state.start("preloader")
  }

  public resize() {
    const ratio = Utils.ratio()
    this.game.scale.setUserScale(ratio, ratio)
  }
}
