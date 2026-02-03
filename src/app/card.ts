import { Rectangle, Sprite, Texture, TextureSource, ContainerChild } from 'pixi.js';
import { CardTileData } from './types/card-tile-data';

export class BaseCard {
  card: { sprite: Sprite };
  cardTexture: Texture;
  rectangleFrame: Rectangle;
  isShaking: boolean = false;
  x: number;
  y: number;

  constructor(
    source: TextureSource,
    width: number,
    height: number,
    imageX: number,
    imageY: number,
    x: number,
    y: number,
  ) {
    this.rectangleFrame = new Rectangle(imageX, imageY, width, height);
    this.x = x;
    this.y = y;
    this.cardTexture = new Texture({
      frame: this.rectangleFrame,
      source,
    });
    this.card = {
      sprite: new Sprite({
        texture: this.cardTexture,
      }),
    };

    this.setSpritePosition();
  }

  flip() {
    // this.card.ro
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

    // this.card.sprite.on('pointerdown', () => console.log(this.card));
  }

  updateCoordinates(x: number, y: number) {
    this.x = x - this.card.sprite.width / 2;
    this.y = y - this.card.sprite.height / 2;
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
  override card: { sprite: Sprite; state: CardTileData };

  constructor(
    source: TextureSource,
    width: number,
    height: number,
    imageX: number,
    imageY: number,
    x: number,
    y: number,
    data: CardTileData,
  ) {
    super(source, width, height, imageX, imageY, x, y);
    this.card = {
      sprite: new Sprite({
        texture: this.cardTexture,
      }),
      state: data,
    };
    this.setSpritePosition();
  }
}
