import app from "../App.mjs";
import { ScreenEvent } from "../screen/ScreenEvent.mjs";
import { StarView } from "./StarView.mjs";

const { Container, Graphics, Text } = window.PIXI;

export class LevelButtonView extends Container {
    _levelId;
    _starsData;
    _completed;
    _config;
    _app = app;

    _body;
    _text;
    _stars;

    constructor(id, stars, completed) {
        super();

        this._levelId = id;
        this._starsData = stars;
        this._completed = completed;
        this._config = {
            horizontal: {
                x: 200 + 180 * (id - 1),
                y: 115,
            },
            vertical: {
                x: 115 + 180 * ((id - 1) % 3),
                y: 115 + 180 * Math.floor((id - 1) / 3),
            }
        }

        this._create();
        this.onScreenResize();
        this.interactive = true;
        this.once("pointerdown", () => { this._app.sceneManager.start("Level", this._levelId) });
    }

    _create() {
        this._createBody();
        this._createText();
        this._createStars();
    }

    _createBody() {
        this._body = new Graphics()
            .beginFill(0xFFD700)
            .drawRoundedRect(0, 0, 150, 150, 5);

        this.addChild(this._body);
    }

    _createText() {
        this._text = new Text(`Уровень\n${this._levelId}`, {
            fontSize: 36,
            fill: 0xff1010,
            align: 'center',
        });
        this._text.anchor.set(0.5);
        this._text.x = 75;
        this._text.y = 50;

        this.addChild(this._text);
    }

    _createStars() {
        this._stars = [];
        let elapsedFills = this._starsData;
        for (let i = 0; i < 3; i++, elapsedFills--) {
            const star = new StarView(elapsedFills > 0);
            star.x = 60 * i - 9;
            star.y = i === 1 ? 110 : 100;
            this._stars.push(star);
            this.addChild(star);
        }
    }

    onScreenResize() {
        const orientation = this._app.screen.orientation;
        this.x = this._config[orientation].x;
        this.y = this._config[orientation].y;
    }
}