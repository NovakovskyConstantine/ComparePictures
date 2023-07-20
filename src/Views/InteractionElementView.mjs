import app from "../App.mjs";
import { ScreenEvent } from "../screen/ScreenEvent.mjs";

const { Container, Graphics, Rectangle } = window.PIXI;

export class InteractionElementView extends Container {
    _graphics;
    _config;
    _completed;
    _id;
    _app = app;
    
    constructor(config) {
        super();

        this._config = config;
        this._id = config.name;
        this._completed = false;
        this.x = this._config.x;
        this.y = this._config.y;

        this.interactive = true;
        this._createGraphics();
        this._createInteraction();
    }

    _createGraphics() {
        this._graphics = new Graphics();
        this._graphics.lineStyle(5, 0x00ff00);
        this._graphics.drawRect(0, 0, this._config.width, this._config.height);

        this._graphics.alpha = 0;
        this.addChild(this._graphics);
    }

    _createInteraction() {
        this.interactive = true;
        this.hitArea = new Rectangle(0, 0, this._config.width, this._config.height);
        // this.on("pointerdown", () => {
        //     this.emit("differenceFound", this._id)
        // })
    }

    showGraphics() {
        this.removeAllListeners();
        this._graphics.alpha = 1;
    }

    get id() {
        return this._id;
    }
}