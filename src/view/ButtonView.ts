import * as PIXI from "pixi.js";
import { GameController } from "./../controller/GameController";
import { ReelsView } from "./ReelsView";

export class ButtonView {
    private readonly SPIN_DISABLED_DURATION: number = 1350;

    private _reelsView: ReelsView;
    private _buttonsContainer: PIXI.Container;

    private _app: PIXI.Application;
    private _texturesPromise: any;
    public set app(value: PIXI.Application) {
        this._app = value;
    }

    constructor(reelsView: ReelsView) {
        this._reelsView = reelsView;
        this._buttonsContainer = new PIXI.Container();

        this.preloadAssets();
    }

    private async preloadAssets(): Promise<void> {
        PIXI.Assets.add("spin", "./img/Spin.png")

        this._texturesPromise = await PIXI.Assets.load("./img/Spin.png");

        this._app.stage.addChild(this._buttonsContainer);

        this.createSpinButton();
    }

    private createSpinButton(): void {
        const spinButton = PIXI.Sprite.from(this._texturesPromise);
        spinButton.scale.set(0.4);
        spinButton.anchor.set(0.5);
        spinButton.y = GameController.GAME_HEIGHT - (spinButton.height + 40);

        spinButton.interactive = true;
        spinButton.cursor = "pointer";

        spinButton.on('pointerup', () => {
            spinButton.interactive = false;
            spinButton.tint = 0x808080;
            setTimeout(() => {
                spinButton.interactive = true;
                spinButton.tint = 0xFFFFFF;
                this._reelsView.checkWinnings();
            }, this.SPIN_DISABLED_DURATION);

            this._reelsView.generateNewSymbols();
        });

        this._buttonsContainer.addChild(spinButton);
    }

    public repositionAndScaleButton(scaleFactor: number): void {
        this._buttonsContainer.scale.set(scaleFactor);
        this._buttonsContainer.x = this._app.screen.width / 2;
    }
}
