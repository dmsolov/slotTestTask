import { gsap } from 'gsap';
import * as PIXI from "pixi.js";
import { WinFeature } from './../feature/WinFeature';
import { GameView } from "./GameView";
import { WinLabelView } from './WinLabelView';

export class ReelsView {
    private readonly SYMBOL_KEYS: string[] = [
        "lp1", "lp2", "lp3", "lp4", "lp5", "lp6",
        "hp1", "hp2", "hp3", "hp4", "hp5", "hp6",

    ];
    private readonly SYMBOL_PATHS: string[] = [
        "./img/9.png", "./img/10.png", "./img/J.png", "./img/Q.png", "./img/K.png", "./img/A.png",
        "./img/H1.png", "./img/H2.png", "./img/H3.png", "./img/H4.png", "./img/H5.png", "./img/H6.png",
    ];
    private readonly SYMBOL_TRANSFORM_KEYS: string[] = [
        "lp1_connect", "lp2_connect", "lp3_connect", "lp4_connect", "lp5_connect", "lp6_connect",
        "hp1_connect", "hp2_connect", "hp3_connect", "hp4_connect", "hp5_connect", "hp6_connect",
    ];
    private readonly SYMBOL_TRANSFORM_PATHS: string[] = [
        "./img/9_connect.png", "./img/10_connect.png", "./img/J_connect.png", "./img/Q_connect.png", "./img/K_connect.png", "./img/A_connect.png",
        "./img/H1_connect.png", "./img/H2_connect.png", "./img/H3_connect.png", "./img/H4_connect.png", "./img/H5_connect.png", "./img/H6_connect.png",
    ];
    private readonly REEL_SYMBOLS_TARGET_Y_POS: number[] = [300, 200, 100];
    private readonly REELS_SPIN_START_DELAYS: number[] = [0, 100, 200, 300, 400];
    private readonly CLEAR_SYMBOLS_DELAY: number = 500;
    private readonly SYMBOL_DROP_DURATION: number = 0.10;

    private _winFeature: WinFeature;
    private _winLabelView: WinLabelView;
    private _reelsContainer: PIXI.Container[];
    private _reelWithMaskContainer: PIXI.Container;
    private _normalTexturesPromise: any;
    private _transformTexturesPromise: any;

    private _app: PIXI.Application;
    public set app(value: PIXI.Application) {
        this._app = value;
    }

    constructor(winLabelView: WinLabelView) {
        this._winFeature = new WinFeature();
        this._winLabelView = winLabelView;

        this._reelsContainer = [];
        this._reelWithMaskContainer = new PIXI.Container();

        let ctr = GameView.REELS;
        while (ctr--) {
            this._reelsContainer.push(new PIXI.Container());
        }

        this._winFeature.reelsContainer = this._reelsContainer;
        this.preloadAssets();
    }

    private async preloadAssets(): Promise<any> {
        for (const idx in this.SYMBOL_KEYS) {
            PIXI.Assets.add(this.SYMBOL_KEYS[idx], this.SYMBOL_PATHS[idx]);
        }
        this._normalTexturesPromise = await PIXI.Assets.load(this.SYMBOL_KEYS);

        for (const idx in this.SYMBOL_TRANSFORM_KEYS) {
            PIXI.Assets.add(this.SYMBOL_TRANSFORM_KEYS[idx], this.SYMBOL_TRANSFORM_PATHS[idx]);
        }
        this._transformTexturesPromise = await PIXI.Assets.load(this.SYMBOL_TRANSFORM_KEYS);

        this.prepareReels();
    }

    private prepareReels(): void {
        this._app.stage.addChild(this._reelWithMaskContainer);

        this.createReels();
        this.createMask();
        this.repositionReels();
    }

    private createReels(): void {
        this._reelsContainer.forEach((reelContainer, reelIdx) => {
            this.createReel(reelContainer, reelIdx);
        });
    }

    private createReel(reelContainer: PIXI.Container, reelIdx: number): void {
        for (let i = GameView.ROWS - 1; i >= 0; i--) {
            const symbolSprite = this.getRandomSymbol();
            symbolSprite.y = this.REEL_SYMBOLS_TARGET_Y_POS[i];
            reelContainer.addChild(symbolSprite);
        }

        reelContainer.x = reelIdx * (reelContainer.width);
        this._reelWithMaskContainer.addChild(reelContainer);
    }

    private createMask(): void {
        this._reelsContainer.forEach((reelContainer) => {
            const { x, width, height } = reelContainer;
            const columnMask = PIXI.Sprite.from(PIXI.Texture.WHITE);

            columnMask.position.set(x, reelContainer.getChildAt(0).y);
            columnMask.width = width;
            columnMask.height = height;
            reelContainer.mask = columnMask;
            this._reelWithMaskContainer.addChild(columnMask);
        });
    }

    private repositionReels(): void {
        this._reelWithMaskContainer.x = (this._app.screen.width / 2) - this._reelWithMaskContainer.width / 2;
    }

    private clearAllSymbols(): Promise<void> {
        return new Promise((resolve) => {
            this._reelsContainer.forEach((reelContainer) => {
                for (let symbol of reelContainer.children) {
                    symbol.destroy();
                }
                reelContainer.removeChildren();
            });

            setTimeout(() => resolve(), this.CLEAR_SYMBOLS_DELAY);
        });
    }

    private async startDroppingSymbols(): Promise<any> {
        this.REELS_SPIN_START_DELAYS.forEach((delay, reelIdx) => {
            setTimeout(() => this.dropSymbolsPerReel(reelIdx), delay);
        });
    }

    private dropSymbolsPerReel(reelIdx: number): Promise<void> {
        return new Promise((resolve) => {
            this.dropSymbolsResolved(resolve, reelIdx);
        });
    }

    private dropSymbolsResolved(resolve: Function, reelIdx: number, rowIdx: number = 0): void {
        const symbolSprite = this.getRandomSymbol();
        this._reelsContainer[reelIdx].addChild(symbolSprite);

        gsap.to(symbolSprite, {
            y: this.REEL_SYMBOLS_TARGET_Y_POS[rowIdx],
            duration: this.SYMBOL_DROP_DURATION,
            ease: "back.out",
            onComplete: () => {
                rowIdx++;
                rowIdx <= 2
                    ? this.dropSymbolsResolved(resolve, reelIdx, rowIdx)
                    : resolve();
            }
        });
    }

    private getRandomSymbol(): PIXI.Sprite {
        const symbolKey = this.SYMBOL_KEYS[Math.floor(Math.random() * this.SYMBOL_KEYS.length)];
        const symbolSprite = PIXI.Sprite.from(this._normalTexturesPromise[symbolKey]);
        symbolSprite.scale.set(0.5);
        symbolSprite.name = symbolKey;

        return symbolSprite;
    }

    private dimNonWinningSymbols(sum: string): void {
        if (sum === '0') return;

        this._reelsContainer.forEach((reelContainer) => {
            for (let symbol of reelContainer.children) {
                if (!symbol.name.includes("_connect")) {
                    (symbol as PIXI.Sprite).tint = 0x808080;
                }
            }
        });
    }

    public repositionAndScaleReels(scaleFactor: number): void {
        this.repositionReels();
        this._reelWithMaskContainer.scale.set(scaleFactor);
    }

    public async generateNewSymbols(): Promise<void> {
        this._winLabelView.setWinLabel();
        await this.clearAllSymbols();
        this.startDroppingSymbols();
    }

    public checkWinnings(): void {
        const { allSymbolWins, sum } = this._winFeature.getWinData();

        allSymbolWins.forEach((data) => {
            data.texture = PIXI.Texture.from(this._transformTexturesPromise[`${data.name}_connect`].baseTexture.resource.src);
            data.name = `${data.name}_connect`;
        })

        this.dimNonWinningSymbols(sum);
        this._winLabelView.setWinLabel(sum);
    }
}
