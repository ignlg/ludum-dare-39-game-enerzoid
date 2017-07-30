/* AUTO GENERATED FILE. DO NOT MODIFY. YOU WILL LOSE YOUR CHANGES ON BUILD. */

export namespace Images {
    export class ImagesCloud {
        static getName(): string { return 'cloud'; }

        static getPNG(): string { return require('assets/images/cloud.png'); }
    }
    export class ImagesEnerzoid {
        static getName(): string { return 'enerzoid'; }

        static getPNG(): string { return require('assets/images/enerzoid.png'); }
    }
    export class ImagesFlare {
        static getName(): string { return 'flare'; }

        static getPNG(): string { return require('assets/images/flare.png'); }
    }
    export class ImagesLine {
        static getName(): string { return 'line'; }

        static getPNG(): string { return require('assets/images/line.png'); }
    }
    export class ImagesOrb {
        static getName(): string { return 'orb'; }

        static getPNG(): string { return require('assets/images/orb.png'); }
    }
    export class ImagesShip {
        static getName(): string { return 'ship'; }

        static getPNG(): string { return require('assets/images/ship.png'); }
    }
    export class ImagesStar {
        static getName(): string { return 'star'; }

        static getPNG(): string { return require('assets/images/star.png'); }
    }
}

export namespace Spritesheets {
    export class SpritesheetsShip {
        static getName(): string { return 'ship'; }

        static getPNG(): string { return require('assets/spritesheets/ship.[64,64,3,0,0].png'); }
        static getFrameWidth(): number { return 64; }
        static getFrameHeight(): number { return 64; }
        static getFrameMax(): number { return 3; }
        static getMargin(): number { return 0; }
        static getSpacing(): number { return 0; }
    }
}

export namespace Atlases {
    enum AtlasesPreloadSpritesArrayFrames {
        PreloadBar = 'preload_bar.png' as any,
        PreloadFrame = 'preload_frame.png' as any,
    }
    export class AtlasesPreloadSpritesArray {
        static Frames = AtlasesPreloadSpritesArrayFrames;

        static getName(): string { return 'preload_sprites_array'; }

        static getJSONArray(): string { return require('assets/atlases/preload_sprites_array.json'); }

        static getPNG(): string { return require('assets/atlases/preload_sprites_array.png'); }
    }
}

export namespace Audio {
    export class AudioMusic {
        static getName(): string { return 'music'; }

        static getMP3(): string { return require('assets/audio/music.mp3'); }
        static getOGG(): string { return require('assets/audio/music.ogg'); }
    }
}

export namespace Audiosprites {
    enum AudiospritesGameSfxSprites {
        Orb1 = 'orb1' as any,
        Orb2 = 'orb2' as any,
        Orb3 = 'orb3' as any,
        Orb4 = 'orb4' as any,
        Orb5 = 'orb5' as any,
        Orb6 = 'orb6' as any,
        Orb7 = 'orb7' as any,
        Orb8 = 'orb8' as any,
        LowEnergy = 'lowEnergy' as any,
        GameOver = 'gameOver' as any,
    }
    export class AudiospritesGameSfx {
        static Sprites = AudiospritesGameSfxSprites;

        static getName(): string { return 'gameSfx'; }

        static getJSON(): string { return require('assets/audiosprites/gameSfx.json'); }
        static getMP3(): string { return require('assets/audiosprites/gameSfx.mp3'); }
        static getOGG(): string { return require('assets/audiosprites/gameSfx.ogg'); }
    }
}

export namespace GoogleWebFonts {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace CustomWebFonts {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace BitmapFonts {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace JSON {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace XML {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Text {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Scripts {
    export class ScriptsBlurX {
        static getName(): string { return 'BlurX'; }

        static getJS(): string { return require('assets/scripts/BlurX.js'); }
    }
    export class ScriptsBlurY {
        static getName(): string { return 'BlurY'; }

        static getJS(): string { return require('assets/scripts/BlurY.js'); }
    }
}
export namespace Shaders {
    export class ShadersPixelate {
        static getName(): string { return 'pixelate'; }

        static getFRAG(): string { return require('assets/shaders/pixelate.frag'); }
    }
}
export namespace Misc {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}
