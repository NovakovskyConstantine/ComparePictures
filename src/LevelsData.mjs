
export class LevelsData {
    _data;
    _currentLevel;

    constructor(data) {
        this._data = {};

        for (let key in data) {
            this._data[key] = {
                ...data[key],
                completed: false,
                stars: 0,
                id: key,
            }
        }
    }

    setCurrentLevel(number) {
        if (!number) {
            this._currentLevel = undefined;
            return;
        }
        this._currentLevel = this._data[number];
    }

    setStars(number) {
        if (this._currentLevel) {
            this._currentLevel.stars = number;
        }
    }

    completeLevel() {
        if (this._currentLevel) {
            this._currentLevel.completed = true;
        }
    }

    get currentLevel() {
        return this._currentLevel;
    }

    get levels() {
        return this._data;
    }
}