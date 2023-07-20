import app from "../App.mjs";
import { ScreenEvent } from "../screen/ScreenEvent.mjs";

const { Text } = window.PIXI;

export class TextView extends Text {
    _startString;
    _middleString;
    _endString;
    _layerConfig;
    _app = app;

    constructor(startString, middleString, endString, layerConfig) {
        super(`${startString}${middleString}${endString}`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            align: 'center',
        });

        this._startString = startString;
        this._middleString = middleString;
        this._endString =endString;
        this._layerConfig = layerConfig;

        this._onScreenResize();
        this._app.screen.on(ScreenEvent.RESIZE, this._onScreenResize.bind(this));
    }

    changeMiddleString(string) {
        this._middleString = string;

        this.text = `${this._startString}${this._middleString}${this._endString}`;
    }

    _onScreenResize() {
        this.x = this._layerConfig[this._app.screen.orientation].x;
        this.y = this._layerConfig[this._app.screen.orientation].y;

        if (this._app.screen.isVertical) {
            this.anchor.set(0.5);
        } else {
            this.anchor.set(0);
        }
    }
}