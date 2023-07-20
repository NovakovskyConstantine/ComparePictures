import app from "../App.mjs";
import { ScreenEvent } from "../screen/ScreenEvent.mjs";
import { LevelButtonView } from "../Views/LevelButtonView.mjs";

const { Container } = window.PIXI;

export class SelectLevelScene extends Container {
    _buttons;
    _levelsData;
    _app;
    _resizeFn;

    constructor() {
        super();

        this._app = app;
        this._levelsData = app.levelsData;
        this._createLevelButtons();

        this._resizeFn = this._onResize.bind(this);
        this._app.screen.on(ScreenEvent.ORIENTATION_CHANGE, this._resizeFn);
    }

    _createLevelButtons() {
        this._buttons = [];

        for (let id in this._levelsData.levels) {
            const level = this._levelsData.levels[id];
            this._buttons.push(new LevelButtonView(id, level.stars, level.completed));
        }

        this._buttons.forEach(el => {
            this.addChild(el);
        })
    }

    _onResize() {
        this._buttons.forEach(button => {
            button.onScreenResize();
        })
    }

    destroy() {
        this._app.screen.off(ScreenEvent.ORIENTATION_CHANGE, this._resizeFn);
        this._resizeFn = undefined;
        super.destroy({ children: true });
    }
}