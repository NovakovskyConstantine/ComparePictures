const { Container } = window.PIXI;
import { ScenesConfig } from "./scenes/configs/ScenesConfig.mjs";

export class SceneManager {
    _current;
    _parentContainer;
    _scenes;

    constructor(parentContainer) {
        this._parentContainer = parentContainer;
        this._scenes = ScenesConfig;
    }

    start(name, data = undefined) {
        console.log(data)
        if (this._current) {
            this._parentContainer.removeChild(this._current);
            this._current.destroy();
        }

        this._current = new this._scenes[name](data);
        this._parentContainer.addChild(this._current);
    }
}