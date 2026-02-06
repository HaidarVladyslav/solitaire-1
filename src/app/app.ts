import { Component, signal } from '@angular/core';
import { Application, Container, Assets, FederatedPointerEvent, Graphics } from 'pixi.js';
import { GameCard, BaseCard } from './card';
import { CardTileSuit } from './types/card-tile-data';
import { GAME_CONFIG } from './constants/game-config';
import { getCardDataFromSprite } from './helpers/get-card-data-from-sprite';

@Component({
  selector: 'app-root',
  imports: [],
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

      // function onDragEnd(e: FederatedPointerEvent) {
      //   console.log('END', e);
      //   if (dragTarget) {
      //     app.stage.off('pointermove', onDragMove);
      //     // dragTarget.x = 0
      //     // dragTarget.y = 0

      //     if (dragTarget && dragTarget.uid) {
      //       const foundCard = cards.find((card) => card.card.sprite.uid === dragTarget?.uid);

      //       if (foundCard) {
      //         const dropCard = cards.find((card) => {
      //           if (
      //             e.x >= card.coordinates.x - cardWidth / 2 &&
      //             e.x <= card.coordinates.x + cardWidth / 2 &&
      //             e.y >= card.coordinates.y - cardHeight / 2 &&
      //             e.y <= card.coordinates.y + cardHeight / 2
      //           ) {
      //             return true;
      //           }
      //           return false;
      //         });
      //         console.log(foundCard?.coordinates, dropCard?.coordinates, e.x, e.y);
      //         if (dropCard) {
      //           foundCard.updateCoordinates(e.x, e.y);
      //         }
      //         foundCard.setSpritePosition();
      //         // dragTarget.y = foundCard.card.sprite.y
      //       }
      //     }

      //     dragTarget.alpha = 1;
      //     dragTarget.zIndex = 0;
      //     dragTarget = null;
      //   }
      // }

      // const onDragStart = (e: FederatedPointerEvent) => {
      //   dragTarget = e.target;
      //   dragTarget.zIndex = 1;
      //   console.log(dragTarget);

      //   app.stage.on('pointermove', onDragMove);
      // };

      // const onDragMove = (event: FederatedPointerEvent) => {
      //   if (dragTarget && dragTarget.parent) {
      //     dragTarget.parent.toLocal(event.global, undefined, dragTarget.position);
      //   }
      // };

      // app.stage.eventMode = 'static';
      // app.stage.hitArea = app.screen;
      // app.stage.on('pointerup', onDragEnd);
      // app.stage.on('pointerupoutside', onDragEnd);

      app.stage.addChild(container);

      // Load the bunny texture
      const texture = await Assets.load('CuteCards.png');

      const cardWidth = GAME_CONFIG.cardWidth;
      const cardHeight = GAME_CONFIG.cardHeight;
      const gap = 40;
      const Y_SHIFT_FOR_PLAYING_CARDS = (cardHeight * 3) / 7;

      const cols = GAME_CONFIG.cols;
      const rows = GAME_CONFIG.rows;

      const cards: GameCard[] = [];

      const readyCards: { [key in CardTileSuit]: GameCard[] } = {
        club: [],
        diamond: [],
        heart: [],
        spade: [],
      };
      const deck: GameCard[] = [];
      const playingZoneCards: { [key: number]: GameCard[] } = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
      } as const;

      const placeholdersReadyItems: { [key in CardTileSuit]: { x: number; y: number } } =
        drawEmptyReadyPlaceholders();
      const placeholdersPlayingItems: {
        [key: number]: { x: number; y: number };
      } = drawPlayingCardsPlaceholders();

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
          const x = cardWidth * j;
          const y = i * cardHeight;
          const card = new GameCard(
            app,
            texture,
            cardWidth,
            cardHeight,
            i * cardWidth,
            j * cardHeight,
            x,
            y / 2,
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
            app,
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
      const data = cards.reduce(
        (acc, cur) => {
          const suit = cur.card.state.suit;
          if (acc[suit]) {
            acc[suit].push(cur);
          } else {
            acc[suit] = [cur];
          }
          return acc;
        },
        {} as { [key in CardTileSuit]: GameCard[] },
      );
      cards.forEach((card, index) => {
        // if (index % 2 === 0) {

        // card.card.sprite.on('pointerdown', onDragStart);
        app.stage.addChild(card.card.sprite);

        card.card.sprite.on('pointerdown', () => {
          moveCardToAllowedPosition(card);
        });
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

      function getEmptyPlaceholderXPosition(index: number, startXPosition: number) {
        return startXPosition + index * cardWidth + gap * index;
      }

      function drawEmptyReadyPlaceholders() {
        const centerOfScreen = app.screen.width / 2;
        const y = 40;
        return Object.entries(readyCards).reduce(
          (acc, data, index) => {
            const x = getEmptyPlaceholderXPosition(index, centerOfScreen);
            const rect = new Graphics()
              .roundRect(x, y, cardWidth, cardHeight, 10)
              .stroke({ color: 0x000000 });
            app.stage.addChild(rect);
            const key = data[0] as unknown as keyof typeof readyCards;
            acc[key] = { x, y };
            return acc;
          },
          {} as { [K in keyof typeof readyCards]: { x: number; y: number } },
        );
      }

      function drawPlayingCardsPlaceholders() {
        const centerOfScreen = app.screen.width / 2;
        const y = 40 * 3 + cardHeight;
        return Object.entries(playingZoneCards).reduce(
          (acc, cur, index, array) => {
            const x = getEmptyPlaceholderXPosition(
              index,
              centerOfScreen - getEmptyPlaceholderXPosition(array.length - 4, 0),
            );
            const rect = new Graphics()
              .roundRect(x, y, cardWidth, cardHeight, 10)
              .stroke({ color: 0x000000 });
            app.stage.addChild(rect);
            const key = cur[0];
            acc[+key] = { x, y };
            return acc;
          },
          {} as { [K in keyof typeof playingZoneCards]: { x: number; y: number } },
        );
      }

      function moveCardToAllowedPosition(card: GameCard) {
        const rank = card.card.state.rank;
        const suit = card.card.state.suit;
        const priority = card.card.state.priority;
        if (rank === 'ace') {
          const x = placeholdersReadyItems[suit].x + cardWidth / 2;
          const y = placeholdersReadyItems[suit].y + cardHeight / 2;
          readyCards[suit].push(card);
          card.setNewCoordindatesSlowly(x, y);
        } else {
          if (
            readyCards[suit].length &&
            readyCards[suit].at(-1)?.card.state.priority === priority - 1
          ) {
            const x = placeholdersReadyItems[suit].x + cardWidth / 2;
            const y = placeholdersReadyItems[suit].y + cardHeight / 2;

            const itemToBeRemovedFromPlayingZone = Object.entries(playingZoneCards).find(
              ([key, value]) => {
                if (value.length === 0) {
                  return null;
                }
                return value.find((item) => item.card.sprite.uid === card.card.sprite.uid);
              },
            );
            if (itemToBeRemovedFromPlayingZone) {
              const indexOfCurrentCard = itemToBeRemovedFromPlayingZone[1].findIndex(
                (item) => item.card.sprite.uid === card.card.sprite.uid,
              );
              if (indexOfCurrentCard !== -1) {
                itemToBeRemovedFromPlayingZone[1].splice(indexOfCurrentCard, 1);
              }
            }

            card.card.sprite.zIndex = (readyCards[suit].at(-1)?.card.sprite.zIndex || 0) + 1;
            readyCards[suit].push(card);

            card.setNewCoordindatesSlowly(x, y);
            return;
          }

          const isKingAndCanBeMovedToEmptySpace =
            card.card.state.rank === 'king' &&
            Object.entries(playingZoneCards).find(([key, value]) => {
              return value.length === 0;
            });

          if (isKingAndCanBeMovedToEmptySpace) {
            const isKingInPlayingZone = Object.entries(playingZoneCards).find(([key, value]) => {
              return value.find(
                (existingCard) =>
                  card.card.state.rank === existingCard.card.state.rank &&
                  card.card.state.suit === existingCard.card.state.suit,
              );
            });

            let playingZoneCardsIndexToBeSet = +isKingAndCanBeMovedToEmptySpace[0];

            const x = placeholdersPlayingItems[playingZoneCardsIndexToBeSet].x + cardWidth / 2;
            const y = placeholdersPlayingItems[playingZoneCardsIndexToBeSet].y + cardHeight / 2;
            const zIndexToSet =
              (playingZoneCards[playingZoneCardsIndexToBeSet].at(-1)?.card?.sprite?.zIndex || 0) +
              1;
            card.setNewCoordindatesSlowly(x, y);
            card.card.sprite.zIndex = zIndexToSet;
            playingZoneCards[playingZoneCardsIndexToBeSet].push(card);

            if (isKingInPlayingZone) {
              const indexOfCurrentCardToBeRemoved = playingZoneCards[
                +isKingInPlayingZone[0]
              ].findIndex((existingCard) => existingCard.card.sprite.uid === card.card.sprite.uid);
              if (indexOfCurrentCardToBeRemoved !== -1) {
                playingZoneCards[+isKingInPlayingZone[0]].forEach((existingCard, index) => {
                  if (index > indexOfCurrentCardToBeRemoved) {
                    existingCard.setNewCoordindatesSlowly(
                      x,
                      y + (index - indexOfCurrentCardToBeRemoved) * Y_SHIFT_FOR_PLAYING_CARDS,
                    );
                    existingCard.card.sprite.zIndex = zIndexToSet;
                    playingZoneCards[playingZoneCardsIndexToBeSet].push(existingCard);
                  }
                });
                playingZoneCards[+isKingInPlayingZone[0]].splice(indexOfCurrentCardToBeRemoved);
              }
            }
            return;
          }

          const foundElement = Object.entries(playingZoneCards).find(([key, value]) => {
            if (value.length === 0) {
              return false;
            }
            const lastValue = value.at(-1);
            return (
              lastValue &&
              ((lastValue.card.state.isRed && !card.card.state.isRed) ||
                (!lastValue.card.state.isRed && card.card.state.isRed)) &&
              card.card.state.priority === lastValue.card.state.priority - 1
            );
          });

          if (foundElement) {
            const isFoundCardInPlayingZone = Object.entries(playingZoneCards).find(
              ([key, value]) => {
                return value.find(
                  (existingCard) =>
                    card.card.state.rank === existingCard.card.state.rank &&
                    card.card.state.suit === existingCard.card.state.suit,
                );
              },
            );

            const x = placeholdersPlayingItems[+foundElement[0]].x + cardWidth / 2;
            const y =
              placeholdersPlayingItems[+foundElement[0]].y +
              cardHeight / 2 +
              playingZoneCards[+foundElement[0]].length * Y_SHIFT_FOR_PLAYING_CARDS;
            card.setNewCoordindatesSlowly(x, y);

            card.card.sprite.zIndex =
              (playingZoneCards[+foundElement[0]].at(-1)?.card?.sprite?.zIndex || 0) + 1;
            playingZoneCards[+foundElement[0]].push(card);

            if (isFoundCardInPlayingZone) {
              const indexOfCurrentCardToBeRemoved = playingZoneCards[
                +isFoundCardInPlayingZone[0]
              ].findIndex((existingCard) => existingCard.card.sprite.uid === card.card.sprite.uid);

              if (indexOfCurrentCardToBeRemoved !== -1) {
                playingZoneCards[+isFoundCardInPlayingZone[0]].forEach((existingCard, index) => {
                  if (index > indexOfCurrentCardToBeRemoved) {
                    existingCard.setNewCoordindatesSlowly(
                      x,
                      y + (index - indexOfCurrentCardToBeRemoved) * Y_SHIFT_FOR_PLAYING_CARDS,
                    );
                    existingCard.card.sprite.zIndex = card.card.sprite.zIndex;
                    playingZoneCards[+foundElement[0]].push(existingCard);
                  }
                });
                playingZoneCards[+isFoundCardInPlayingZone[0]].splice(
                  indexOfCurrentCardToBeRemoved,
                );
              }
            }
          }
        }
      }

      function shuffle() {
        const fourHeart = cards.find(
          (card) => card.card.state.suit === 'heart' && card.card.state.rank === '4',
        );
        const queenSpade = cards.find(
          (card) => card.card.state.suit === 'spade' && card.card.state.rank === 'queen',
        );
        const kingDiamond = cards.find(
          (card) => card.card.state.suit === 'diamond' && card.card.state.rank === 'king',
        );
        if (fourHeart) {
          const indexToSet = 5;
          const x = placeholdersPlayingItems[indexToSet].x + cardWidth / 2;
          const y = placeholdersPlayingItems[indexToSet].y + cardHeight / 2;
          playingZoneCards[indexToSet].push(fourHeart);
          fourHeart.updateCoordinates(x, y);
          fourHeart.setSpritePosition();
        }
        if (queenSpade) {
          const indexToSet = 3;
          const x = placeholdersPlayingItems[indexToSet].x + cardWidth / 2;
          const y = placeholdersPlayingItems[indexToSet].y + cardHeight / 2;
          playingZoneCards[indexToSet].push(queenSpade);
          queenSpade.updateCoordinates(x, y);
          queenSpade.setSpritePosition();
        }
        if (kingDiamond) {
          const indexToSet = 2;
          const x = placeholdersPlayingItems[indexToSet].x + cardWidth / 2;
          const y = placeholdersPlayingItems[indexToSet].y + cardHeight / 2;
          playingZoneCards[indexToSet].push(kingDiamond);
          kingDiamond.updateCoordinates(x, y);
          kingDiamond.setSpritePosition();
        }
      }

      shuffle();

      // Listen for animate update
      app.ticker.add((time) => {
        cards.forEach((card, index) => {
          card.updateCurrentCoordinatesToNew();
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
