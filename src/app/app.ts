import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  Application,
  Container,
  Assets,
  Sprite,
  Rectangle,
  Texture,
  PerspectiveMesh,
  FederatedPointerEvent,
} from 'pixi.js';
import { GameCard, BaseCard } from './card';
import { CardTileData } from './types/card-tile-data';
import { GAME_CONFIG } from './constants/game-config';
import { getCardDataFromSprite } from './helpers/get-card-data-from-sprite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('solitaire-1');

  constructor() {
    (async () => {
      // Create a new application
      const app = new Application();

      (globalThis as any).__PIXI_APP__ = app;

      // Initialize the application
      await app.init({ background: '#1099bb', resizeTo: window });

      // Append the application canvas to the document body
      document.body.appendChild(app.canvas);

      // Create and add a container to the stage
      const container = new Container();
      // container.width = 500;
      // container.height = 100;

      let dragTarget: FederatedPointerEvent['target'] | null = null;

      function onDragEnd(e: FederatedPointerEvent) {
        console.log('END', e);
        if (dragTarget) {
          app.stage.off('pointermove', onDragMove);
          // dragTarget.x = 0
          // dragTarget.y = 0

          if (dragTarget && dragTarget.uid) {
            const foundCard = cards.find((card) => card.card.sprite.uid === dragTarget?.uid);

            if (foundCard) {
              const dropCard = cards.find((card) => {
                if (
                  e.x >= card.coordinates.x - cardWidth / 2 &&
                  e.x <= card.coordinates.x + cardWidth / 2 &&
                  e.y >= card.coordinates.y - cardHeight / 2 &&
                  e.y <= card.coordinates.y + cardHeight / 2
                ) {
                  return true;
                }
                return false;
              });
              console.log(foundCard?.coordinates, dropCard?.coordinates, e.x, e.y);
              if (dropCard) {
                foundCard.updateCoordinates(e.x, e.y);
              }
              foundCard.setSpritePosition();
              // dragTarget.y = foundCard.card.sprite.y
            }
          }

          dragTarget.alpha = 1;
          dragTarget.zIndex = 0;
          dragTarget = null;
        }
      }

      const onDragStart = (e: FederatedPointerEvent) => {
        dragTarget = e.target;
        dragTarget.zIndex = 1;
        console.log(dragTarget);

        app.stage.on('pointermove', onDragMove);
      };

      const onDragMove = (event: FederatedPointerEvent) => {
        if (dragTarget && dragTarget.parent) {
          dragTarget.parent.toLocal(event.global, undefined, dragTarget.position);
        }
      };

      app.stage.eventMode = 'static';
      app.stage.hitArea = app.screen;
      app.stage.on('pointerup', onDragEnd);
      app.stage.on('pointerupoutside', onDragEnd);

      app.stage.addChild(container);

      // Load the bunny texture
      const texture = await Assets.load('CuteCards.png');

      const cardWidth = GAME_CONFIG.cardWidth;
      const cardHeight = GAME_CONFIG.cardHeight;

      const cols = GAME_CONFIG.cols;
      const rows = GAME_CONFIG.rows;

      const cards: GameCard[] = [];

      // Rectangle for the first tile (top-left)
      // const tile1Rectangle = new Rectangle(0, 0, tileWidth, tileHeight);

      // // Rectangle for the second tile (next column)
      // const tile2Rectangle = new Rectangle(tileWidth, 0, tileWidth, tileHeight);

      // // Rectangle for the third tile (second row, first column)
      // const tile3Rectangle = new Rectangle(0, tileHeight, tileWidth, tileHeight);

      // const tile1Texture = new Texture({
      //   frame: texture,
      //   trim: tile1Rectangle
      // })

      // texture.frame = tile1Rectangle
      // const ct = new Texture({
      //   frame: tile1Rectangle,
      //   source: texture,
      // });
      // const cards = new Sprite({
      //   texture: ct,
      //   // position: {x: 100, y:100 }
      //   // width: 100,
      //   // height: 100
      // });

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = cardWidth * i;
          const y = j * cardHeight;
          const card = new GameCard(
            texture,
            cardWidth,
            cardHeight,
            i * cardWidth,
            j * cardHeight,
            x,
            y,
            getCardDataFromSprite(j, i),
          );

          const isRed = j % 2 === 0;
          //     const darkBackCard = new Card(
          //   texture,
          //   cardWidth,
          //   cardHeight,
          //   14 * cardWidth,
          //   2 * cardHeight,
          //   0,
          //   4 * cardHeight,
          //   false
          // );
          const backCard = new BaseCard(
            texture,
            cardWidth,
            cardHeight,
            14 * cardWidth,
            (isRed ? 2 : 3) * cardHeight,
            x,
            y,
          );
          // backCard.card.anchor.set(0.5);
          // backCard.card.x += backCard.card.width / 2;
          // backCard.card.y += backCard.card.height / 2;
          // backCard.card.pivot.x = backCard.card.width/2
          // backCard.card.pivot.y = backCard.card.height/2
          // backCard.card.pivot.set(0.5,0.5)
          // setInterval(() => {
          //   // backCard.card.rotation -= 0.1;
          //   backCard.card.rotation
          // }, 100);

          cards.push(card);
          // app.stage.addChild(card.card, backCard.card);
        }
      }
      console.log(cards);
      cards.forEach((card, index) => {
        // if (index % 2 === 0) {

        card.card.sprite.on('pointerdown', onDragStart);
        app.stage.addChild(card.card.sprite);
        // } else {
        // const points = [
        //   { x: 0, y: 0 },
        //   { x: card.card.width, y: 0 },
        //   { x: card.card.width, y: card.card.height },
        //   { x: 0, y: texture.height },
        // ];
        // const outPoints = points.map((p) => ({ ...p }));

        // const mesh = app.stage.addChild(
        //   new PerspectiveMesh({
        //     texture,
        //     pivot: {
        //       x: texture.width / 2,
        //       y: texture.height / 2,
        //     },
        //     x: app.screen.width / 2,
        //     y: app.screen.height / 2,
        //     width: texture.width,
        //     height: texture.height,
        //   }),
        // );
        // mesh.scale = 2
        // console.log(mesh)
        // const mesh = new PerspectiveMesh({
        //   texture: card.cardTexture,
        //   verticesX: 20,
        //   verticesY: 20,
        //   // Define corners clockwise from top-left
        //   x0: 0,
        //   y0: 0, // Top-left
        //   x1: 20,
        //   y1: 40, // Top-right (raised)
        //   x2: 100,
        //   y2: 100, // Bottom-right
        //   x3: 0,
        //   y3: 80, // Bottom-left (raised)
        // });
        // app.stage.addChild(mesh);
        // }
      });

      // app.stage.addChild(darkBackCard.card!);
      // app.stage.addChild(whiteBackCard.card!);

      // Listen for animate update
      app.ticker.add((time) => {
        cards.forEach((card, index) => {
          // card.shake()
          // card.anchor.set(0.5);
          // card.x += card.width / 2;
          // card.y += card.height / 2;
          if (index % 2 === 1) {
            // card.card.rotation -= 0.01 * time.deltaTime
            // card.card.tran
            // card.card
          }
        });
        // Continuously rotate the container!
        // * use delta to create frame-independent transform *
      });
    })();
  }
}
