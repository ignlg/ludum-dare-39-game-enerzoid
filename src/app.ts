import "p2"
import "pixi"
import "phaser"

import * as WebFontLoader from "webfontloader"

import Boot from "./states/boot"
import Preloader from "./states/preloader"
import Title from "./states/title"
import Game from "./states/game"
import * as Utils from "./utils/utils"
import * as Assets from "./assets"

class App extends Phaser.Game {
  constructor(config: Phaser.IGameConfig) {
    super(config)

    this.state.add("boot", Boot)
    this.state.add("preloader", Preloader)
    this.state.add("title", Title)
    this.state.add("game", Game)

    this.state.start("boot")
  }
}

function startApp(): void {
  let gameWidth: number = DEFAULT_GAME_WIDTH
  let gameHeight: number = DEFAULT_GAME_HEIGHT

  const ratio = Utils.ratio()

  if (DEFAULT_GAME_WIDTH * ratio < window.innerWidth) {
    gameWidth = Math.min(MAX_GAME_WIDTH, Math.floor(window.innerWidth / ratio))
  }

  if (DEFAULT_GAME_HEIGHT * ratio < window.innerHeight) {
    gameHeight = Math.min(
      MAX_GAME_HEIGHT,
      Math.floor(window.innerHeight / ratio)
    )
  }

  const gameConfig: Phaser.IGameConfig = {
    width: gameWidth,
    height: gameHeight,
    renderer: Phaser.AUTO,
    parent: "",
    resolution: 1
  }

  const app = new App(gameConfig)
}

window.onload = () => {
  let webFontLoaderOptions: any = null
  const webFontsToLoad: string[] = GOOGLE_WEB_FONTS

  if (webFontsToLoad.length > 0) {
    webFontLoaderOptions = webFontLoaderOptions || {}

    webFontLoaderOptions.google = {
      families: webFontsToLoad
    }
  }

  if (Object.keys(Assets.CustomWebFonts).length > 0) {
    webFontLoaderOptions = webFontLoaderOptions || {}

    webFontLoaderOptions.custom = {
      families: [],
      urls: []
    }

    for (const font in Assets.CustomWebFonts) {
      webFontLoaderOptions.custom.families.push(
        Assets.CustomWebFonts[font].getFamily()
      )
      webFontLoaderOptions.custom.urls.push(
        Assets.CustomWebFonts[font].getCSS()
      )
    }
  }

  if (webFontLoaderOptions === null) {
    startApp()
  } else {
    // Load the fonts defined in webFontsToLoad from Google Web Fonts,
    // and/or any Local Fonts then start the game knowing the fonts are available
    webFontLoaderOptions.active = startApp

    WebFontLoader.load(webFontLoaderOptions)
  }
}
