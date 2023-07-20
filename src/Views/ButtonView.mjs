const { Container, Graphics, Text } = window.PIXI;

export class ButtonView extends Container {
    _graphics;
    _text;
    _textString;

    constructor(textString) {
        super();

        this._textString = textString;
        this._create();
    }

    _create() {
        this._text = new Text(this._textString, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center',
        });
        this._graphics = new Graphics().beginFill(0x999999).drawRect(0, 0, this._text.width + 10, this._text.height + 20).endFill();
        this._text.x = 5;
        this._text.y = 10;
        this.addChild(this._graphics);
        this.addChild(this._text);
    }
}