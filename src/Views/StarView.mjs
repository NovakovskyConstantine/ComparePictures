const { Container, Graphics } = window.PIXI;

export class StarView extends Container {
    _graphics;
    _fillColor;

    constructor(isFilled) {
        super();

        this._fillColor = isFilled ? 0xff0000 : 0xffffff;
        this._createGraphics();
    }

    _createGraphics() {
        this._graphics = new Graphics();
        this._graphics.beginFill(this._fillColor);
        this._graphics.drawPolygon([
            25, 0,
            31, 17,
            49, 17,
            34, 27,
            40, 45,
            25, 33,
            9, 45,
            15, 27,
            0, 17,
            18, 17,
        ]);
        this._graphics.endFill();

        this.addChild(this._graphics);
    }
}