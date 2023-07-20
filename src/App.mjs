const { Application } = window.PIXI;
import { LevelsData } from "./LevelsData.mjs";
import { Loader } from "./Loader.mjs";
import { SceneManager } from "./SceneManager.mjs";
import { ScenesConfig } from "./scenes/configs/ScenesConfig.mjs";
import { Screen } from "./screen/Screen.mjs";

class App {
    _htmlElement;
    _pixiApp;
    _loader;
    _screen;
    _levelsData;
    _sceneManager;

    constructor() {
    }

    async start() {
        this._createApp();
        this._screen = new Screen(this._pixiApp.renderer);
        this._loader = new Loader();
        await this._initLevelData();
        this._sceneManager = new SceneManager(this._pixiApp.stage, ScenesConfig);
        this._sceneManager.start("SelectLevel");
    }

    async _initLevelData() {
        const data = await this._loader.loadLevelData();
        this._levelsData = new LevelsData(data);
    }

    _createApp() {
		let canvas = document.getElementById("game-canvas");
		if (!canvas) {
			canvas = document.createElement("canvas");
			canvas.setAttribute("id", "game-canvas");
			document.body.appendChild(canvas);
		}

		const appParams = {
			view: canvas,
			width: 100,
			height: 100,
			resolution: Math.ceil(devicePixelRatio),
            backgroundColor: 0x444444,
			antialias: true,
		}

		this._pixiApp = new Application(appParams);
	}

    get screen() {
        return this._screen;
    }

    get sceneManager() {
        return this._sceneManager;
    }

    get levelsData() {
        return this._levelsData;
    }

    get loader() {
        return this._loader;
    }
}

const app = new App();
export default app;