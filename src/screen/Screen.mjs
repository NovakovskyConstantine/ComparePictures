const { Point, Rectangle, utils } = window.PIXI;
import { ScreenEvent } from "./ScreenEvent.mjs";
import { ScreenOrientation } from "./ScreenOrientation.mjs";
import { ScreenType } from "./ScreenType.mjs";

export class Screen extends utils.EventEmitter {

	_renderer;
	_windowWidth;
	_windowHeight;
	_screenWidth;
	_screenHeight;
	_rendererWidth;
	_rendererHeight;
	_pivot = new Point();
	_bounds = new Rectangle();
	_center = new Point();
	_orientation;
	_type = ScreenType.DEFAULT;
	_config;
	_isOrientationDirty = false;

	constructor(renderer) {
		super();
		this._renderer = renderer;
		this._config = {
			default: {
				horizontal: {
					width: 1280,
					height: 720,
				},
				vertical: {
					width: 720,
					height: 1280,
				}
			}
		};

		this._renderer.view.style.position = "absolute";

		this._onWindowResize();

		window.addEventListener("resize", this._onWindowResize, false);
	}

	get renderer() {
		return this._renderer;
	}

	get x() {
		return this._pivot.x;
	}

	get y() {
		return this._pivot.y;
	}

	get config() {
		return this._config;
	}

	getBounds() {
		this._bounds.x = this.x;
		this._bounds.y = this.y;
		this._bounds.width = this.width;
		this._bounds.height = this.height;
		return this._bounds;
	}

	getLocalBounds() {
		this._bounds.x = this.x;
		this._bounds.y = this.y;
		this._bounds.width = this.width;
		this._bounds.height = this.height;
		return this._bounds;
	}

	get windowWidth() {
		return this._windowWidth;
	}

	get windowHeight() {
		return this._windowHeight;
	}

	get screenWidth() {
		return this._screenWidth;
	}

	get screenHeight() {
		return this._screenHeight;
	}

	get width() {
		return this._rendererWidth;
	}

	get height() {
		return this._rendererHeight;
	}

	get type() {
		return this._type;
	}

	get orientation() {
		return this._orientation;
	}

	get isVertical() {
		return this._orientation === ScreenOrientation.VERTICAL;
	}

	get isHorizontal() {
		return this._orientation === ScreenOrientation.HORIZONTAL;
	}

	get pivot() {
		return this._pivot;
	}

	get center() {
		return this._center.set(
			this._pivot.x + this._rendererWidth / 2,
			this._pivot.y + this._rendererHeight / 2
		);
	}

	_onWindowResize = () => {
		this._calcSize();
		this._applySize();
	};

	_calcSize() {
		const windowWidth = window.outerWidth;
		const windowHeight = window.outerHeight;

		this._type = ScreenType.DEFAULT;

		let newOrientation;

		if (windowHeight > windowWidth) {
			newOrientation = ScreenOrientation.VERTICAL;
		} else {
			newOrientation = ScreenOrientation.HORIZONTAL;
		}

		if (newOrientation !== this._orientation) {
			this._orientation = newOrientation;
			this._isOrientationDirty = true;
		}

		let size;

		let newWidth = windowWidth;
		let newHeight = windowHeight;

		if (this._config) {
			let layouts = this._config[this._type];
			if (!layouts) {
				layouts = this._config[ScreenType.DEFAULT];
			}

			size = layouts?.[this._orientation];

			if (size) {
				const sizeWidth = size.width;
				const sizeHeight = size.height;

				const maxWidth = size.maxWidth || Infinity;
				const maxHeight = size.maxHeight || Infinity;

				const minWidth = size.minWidth || -Infinity;
				const minHeight = size.minHeight || -Infinity;

				const kW = sizeWidth / sizeHeight;
				if (this._orientation === ScreenOrientation.VERTICAL) {
					newWidth = Math.min(Math.floor(newHeight * kW), windowWidth);
					newHeight = Math.floor(newWidth / kW);
				} else if (this._orientation === ScreenOrientation.HORIZONTAL) {
					newHeight = Math.min(Math.floor(newWidth / kW), windowHeight);
					newWidth = Math.floor(newHeight * kW);
				}

				newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
				newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
			}
		}

		this._windowWidth = windowWidth;
		this._windowHeight = windowHeight;

		this._screenWidth = newWidth;
		this._screenHeight = newHeight;

		this._rendererWidth = this._screenWidth;
		this._rendererHeight = this._screenHeight;

		if (!this._config?.noScale && size) {
			this._rendererWidth = size.width;
			this._rendererHeight = size.height;
		}
	}

	_applySize() {
		this._renderer.view.style.width = `${this._screenWidth}px`;
		this._renderer.view.style.height = `${this._screenHeight}px`;
		this._renderer.resize(this._rendererWidth, this._rendererHeight);

		const x = (this._windowWidth - this._screenWidth) / 2;
		const y = (this._windowHeight - this._screenHeight) / 2;
		this._renderer.view.style.left = `${x}px`;
		this._renderer.view.style.top = `${y}px`;

		this.emit(ScreenEvent.RESIZE, this);

		if (this._isOrientationDirty) {
			this._isOrientationDirty = false;
			this.emit(ScreenEvent.ORIENTATION_CHANGE, this);
		}
	}
}