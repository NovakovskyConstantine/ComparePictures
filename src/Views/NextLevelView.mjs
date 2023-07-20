import app from "../App.mjs";
import { ScreenEvent } from "../screen/ScreenEvent.mjs";
import { ButtonView } from "./ButtonView.mjs";

const { Container, Graphics } = window.PIXI;

export class NextLevelView extends Container {
    _nextButton;
    _toMenuButton;
    _bg;
    _config;
    _app = app;

    constructor() {
        super();
        this._create();

        this._onScreenResize();
        this._app.screen.on(ScreenEvent.RESIZE, this._onScreenResize.bind(this));
        this.visible = false;
    }

    _create() {
        this._bg = new Graphics().beginFill(0x333333).drawRect(0, 0, 400, 400).endFill();
        this._nextButton = new ButtonView("Следующий уровень");
        this._nextButton.x = (400 - this._nextButton.width) / 2;
        this._nextButton.y = 300;

        this._toMenuButton = new ButtonView("В меню");
        this._toMenuButton.x = (400 - this._toMenuButton.width) / 2;
        this._toMenuButton.y = 150;

        this.addChild(this._bg);
        this.addChild(this._nextButton);
        this.addChild(this._toMenuButton);
        this._setInteractive();
    }

    _setInteractive() {
        this._nextButton.interactive = true;
        this._toMenuButton.interactive = true;

        this.interactive = true;
        this._nextButton.on("pointerdown", () => this.emit("toNextLevel"));
        this._toMenuButton.on("pointerdown", () => this.emit("toMenu"));
    }

    _onScreenResize() {
        this.x = (this._app.screen.width - this.width) / 2;
        this.y = (this._app.screen.height - this.height) / 2;
    }
}