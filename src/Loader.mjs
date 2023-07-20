const { Assets, utils } = window.PIXI;

export class Loader extends utils.EventEmitter {
    _baseUrl = "https://hgstudio.ru/jstesttask/levels/";
    _maxLevels = 6;
    _currentNames = [];
    _currentUrls = [];

    constructor() {
        super();
    }

    async loadLevelData() {
        const promises = [];
        for (let i = 1; i <= this._maxLevels; i++) {
            promises.push(this.loadLevel(i));
        }

        const pr = await Promise.all(promises);
        const data = {}
        pr.forEach((pr, index) => {
            if (pr.target.status !== 404) {
                data[index + 1] = { images: pr.target.response.slots };
            };
        });
        return data;
    }

    loadLevel(lvlNumber) {
        return new Promise((resolve, reject) => {
            const xml = new XMLHttpRequest();
            xml.open("GET", `${this._baseUrl}/${lvlNumber}/level.json`);
            xml.responseType = "json";
            xml.onload = (response) => {
                resolve(response);
            };
            xml.send();
        })
    }

    async loadAssets(levelId, images) {
        const names = [];
        images.forEach(el => {
            const name = `${levelId}_${el.name}`;
            const url = `${this._baseUrl}${levelId}/images/${el.name}.jpg`
            Assets.add(name, url);
            names.push(name);
        });

        return await Assets.load(names);
    }
}