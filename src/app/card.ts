import { Rectangle, Sprite, Texture, TextureSource, ContainerChild, Application } from 'pixi.js';
import { CardTileData } from './types/card-tile-data';

export class BaseCard {
  card: { sprite: Sprite };
  cardTexture: Texture;
  initialCardTexture: Texture;
  rectangleFrame: Rectangle;
  isShaking: boolean = false;
  x: number;
  y: number;
  app: Application;
  width: number;
  height: number;
  newX: number;
  newY: number;

  constructor(
    app: Application,
    source: TextureSource,
    width: number,
    height: number,
    imageX: number,
    imageY: number,
    x: number,
    y: number,
  ) {
    this.app = app;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.newX = x;
    this.newY = y;
    this.rectangleFrame = new Rectangle(imageX, imageY, width, height);
    this.cardTexture = new Texture({
      frame: this.rectangleFrame,
      source,
    });
    this.initialCardTexture = this.cardTexture;
    this.card = {
      sprite: new Sprite({
        texture: this.cardTexture,
      }),
    };

    this.setSpritePosition();
  }

  shake() {
    console.log('shake');
    if (this.isShaking) {
      return;
    }

    let i = 0;
    // this.isShaking = true;
    // this.card.anchor.set(0.5);
    // this.card.x += this.card.width / 2;
    // this.card.y += this.card.height / 2;

    // const interval = setInterval(() => {
    //   console.log(this.card.rotation, i);
    //   // if (++i >= 50) {
    //     clearInterval(interval);
    //     this.card.rotation = this.card.rotation + 0.01;
    //   // }
    // }, 50);
  }

  setSpritePosition() {
    this.card.sprite.x = this.x;
    this.card.sprite.y = this.y;
    this.card.sprite.x += this.card.sprite.width / 2;
    this.card.sprite.y += this.card.sprite.height / 2;
    this.card.sprite.anchor.set(0.5);
    this.card.sprite.eventMode = 'static';
  }

  updateCoordinates(x: number, y: number) {
    this.x = x - this.card.sprite.width / 2;
    this.y = y - this.card.sprite.height / 2;
    this.newX = this.x;
    this.newY = this.y;
  }

  setNewCoordindatesSlowly(x: number, y: number) {
    this.newX = x;
    this.newY = y;
  }

  updateCurrentCoordinatesToNew() {
    if (this.newX === this.x && this.newY === this.y) {
      return;
    }
    const increment = 20;
    const minimalClosestIncrementValue = increment * 2;
    if (this.x - this.newX < 0) {
      this.card.sprite.x += increment;
      this.x += increment;
    } else if (this.x - this.newX > 0) {
      this.card.sprite.x -= increment;
      this.x -= increment;
    }
    if (this.y - this.newY < 0) {
      this.card.sprite.y += increment;
      this.y += increment;
    } else if (this.y - this.newY > 0) {
      this.card.sprite.y -= increment;
      this.y -= increment;
    }

    if (this.x - this.newX < increment && this.x - this.newX > -increment) {
      this.x = this.newX;
      this.card.sprite.x = this.x;
    }
    if (this.y - this.newY < increment && this.y - this.newY > -increment) {
      this.y = this.newY;
      this.card.sprite.y = this.y;
    }
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  get uid() {
    return this.card.sprite.uid;
  }
}

export class GameCard extends BaseCard {
  backCard: BaseCard;
  isShownBackCard: boolean = false;

  override card: { sprite: Sprite; state: CardTileData };

  constructor(
    app: Application,
    source: TextureSource,
    width: number,
    height: number,
    imageX: number,
    imageY: number,
    x: number,
    y: number,
    data: CardTileData,
    backCard: BaseCard,
  ) {
    super(app, source, width, height, imageX, imageY, x, y);
    this.card = {
      sprite: new Sprite({
        texture: this.cardTexture,
      }),
      state: data,
    };
    this.setSpritePosition();
    this.backCard = backCard;
  }

  turnCard() {
    this.card.state.isBack = !this.card.state.isBack;
    if (this.isShownBackCard) {
      this.isShownBackCard = false;
      this.card.sprite.texture = this.initialCardTexture;
    } else {
      this.isShownBackCard = true;
      this.card.sprite.texture = this.backCard.cardTexture;
    }
  }
}
