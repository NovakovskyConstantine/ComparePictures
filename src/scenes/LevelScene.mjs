import app from "../App.mjs";
import { LayerView } from "../Views/LayerView.mjs"
import { NextLevelView } from "../Views/NextLevelView.mjs";
import { TextView } from "../Views/TextView.mjs";
import { ScreenEvent } from "./../screen/ScreenEvent.mjs"
const { Container, Assets } = window.PIXI;

export class LevelScene extends Container{
    _levelData;
    _levelId;
    _layerA;
    _layerB;
    _elapsedElements;
    _textElapsed;
    _textMistakes;
    _nextLevelView;

    _app = app;

    constructor(levelId) {
        super();

        this._levelId = levelId;
        this._levelData = app.levelsData;
        this._levelData.setCurrentLevel(levelId);
        this._elapsedElements = this._levelData.currentLevel.images.length - 1;

        this._init();

        this._app.screen.on(ScreenEvent.RESIZE, this._onScreenResize.bind(this))
    }

    async _init() {
        await this._app.loader.loadAssets(this._levelId, this._levelData.currentLevel.images);
        this._createImages();
        this._createTextElapsed();
        this._createNextLevelView();
    }

    _createImages() {
        const layerName = this._levelData.currentLevel.images.find(el => el.layer === "standart").name;
        const layerAItems = [];
        const layerBItems = [];
        this._levelData.currentLevel.images.forEach(el => {
            if (el.layer === "LayerA") {
                layerAItems.push(el);
            } else if (el.layer === "LayerB") {
                layerBItems.push(el);
            }
        });
        this._layerA = new LayerView(layerName, layerAItems);
        this._layerB = new LayerView(layerName, layerBItems);
        this.addChild(this._layerA);
        this.addChild(this._layerB);
        this._onScreenResize();
        this._createInteractions();
    }

    _createInteractions() {
        this._layerA.on("differenceFound", this._onDifferenceFound.bind(this))
        this._layerB.on("differenceFound", this._onDifferenceFound.bind(this))
    }

    _onDifferenceFound(id) {
        this._layerA.getInteractionElementById(id).showGraphics();
        this._layerB.getInteractionElementById(id).showGraphics();
        this._elapsedElements--;
        this._textElapsed.changeMiddleString(`${this._levelData.currentLevel.images.length - 1 - this._elapsedElements}`)
        this._checkComplete();
    }

    _checkComplete() {
        if (this._elapsedElements === 0) {
            this._nextLevelView.visible = true;
        }
    }

    _createTextElapsed() {
        this._textElapsed = new TextView(`Отличий найдено:\n`, `0`, `/${this._elapsedElements}`, {
            horizontal: { x: 20, y: 50, },
            vertical: { x: 360, y: 50, }
        });
        this.addChild(this._textElapsed);
        this._textMistakes = new TextView("Ошибок: ", "0", "", {
            horizontal: { x: 1100, y: 50, },
            vertical: { x: 360, y: 1000, }
        });
        this.addChild(this._textMistakes);
    }

    _createNextLevelView() {
        this._nextLevelView = new NextLevelView();
        this.addChild(this._nextLevelView);
        console.log(this._levelData)
        this._nextLevelView.on("toNextLevel", () => {
            if (!this._levelData.levels[+this._levelId + 1]) {
                this._app.sceneManager.start("SelectLevel");
            } else {
                this._app.sceneManager.start("Level", +this._levelId + 1)
            }
        });
        this._nextLevelView.on("toMenu", () => {
            this._app.sceneManager.start("SelectLevel");
        });
    }

    _onScreenResize() {
        let xA;
        let xB;
        let yA;
        let yB
        if (this._app.screen.orientation === "horizontal") {
            this._setScale(0.67);
            if (this._layerA.layerOrientation === "horizontal") {
                xA = xB = (this._app.screen.width - this._layerA.width) / 2;
                yA = 6;
                yB = this._app.screen.height / 2 + 6;
            } else {
                yA = yB = (this._app.screen.height - this._layerA.height) / 2;
                xA = this._app.screen.width / 2 - this._layerA.width - 10;
                xB = this._app.screen.width / 2 + 10;
            }
        } else {
            this._setScale(0.62);
            if (this._layerA.layerOrientation === "horizontal") {
                xA = xB = (this._app.screen.width - this._layerA.width) / 2;
                yA = (this._app.screen.height - this._layerA.height * 2) / 2;
                yB = (this._app.screen.height - this._layerA.height * 2);
            } else {
                yA = yB = (this._app.screen.height - this._layerA.height) / 2;
                xA = 8;
                xB = this._app.screen.width / 2 + 2;
            }
        }

        this._layerA.x = xA;
        this._layerB.x = xB;
        this._layerA.y = yA;
        this._layerB.y = yB;
    }

    _setScale(scale) {
        this._layerA.scale.set(scale, scale);
        this._layerB.scale.set(scale, scale);
    }
}