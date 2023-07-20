const { Container, Sprite, Graphics } = window.PIXI;
import app from "./../App.mjs";
import { InteractionElementView } from "./InteractionElementView.mjs";

export class LayerView extends Container {
    _layer;
    _childrensConfig;
    _childrens;
    _interactionElements;
    _layerOrientation;
    _app = app;

    constructor(layerName, childrens) {
        super();

        this._childrensConfig = childrens;
        this._layer = Sprite.from(`${this._app._levelsData.currentLevel.id}_${layerName}`);
        this.addChild(this._layer);
        this._addChildrens();
        this._createInteractiveElements();
        this. interactive = true;
        this.on("pointerdown", (event) => {
            if (event.target instanceof InteractionElementView) {
                this.emit("differenceFound", event.target.id);
            } else {
                
            }
        })
    }

    _addChildrens() {
        this._childrens = [];
        this._childrensConfig.forEach(el => {
            const sprite = Sprite.from(`${this._app._levelsData.currentLevel.id}_${el.name}`);
            sprite.x = el.x;
            sprite.y = el.y;
            this._childrens.push(sprite);
            this.addChild(sprite);
        });
    }

    _createInteractiveElements() {
        this._interactionElements = [];

        this._app.levelsData.currentLevel.images.forEach(el => {
            if (el.layer !== "standart") {
                const element = new InteractionElementView(el);
                this._interactionElements.push(element);
                this.addChild(element);
            }
        });
    }

    _createErrorGraphics(x, y) {
        const graphics = new Graphics().lineStyle(5, 0xff0000).drawRect(x, y, 50, 50);
        this.emit("error");

        this.addChild(graphics);
        const timer = setTimeout(() => {
            this.removeChild(graphics);
            clearTimeout(timer);
        }, 2000);
    }

    getInteractionElementById(id) {
        return this._interactionElements.find(el => el.id === id);
    }

    get layerOrientation() {
        if (this._layer.width > this._layer.height) {
            return "horizontal";
        }
        return "vertical";
    }

    get interactionElements() {
        return this._interactionElements;
    }
}