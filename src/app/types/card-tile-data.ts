export type CardTileData = {
  rank: CardTileRank;
  suit: CardTileSuit;
  // allowedSuitsToBePlacedOn: CardTileSuit[];
  // allowedRanksToBePlacedOn: CardTileRank[];
  isRed: boolean;
  canBePlacedOnEmpty: boolean;
  priority: number
};

// export enum CardTileName {
//   Ace= 0,
//   Two = 1,
//   Three = 2,
//   Four = 3,
//   Five = 4,
//   Six = 5,
//   Seven = 6,
//   Eight = 7,
//   Nine = 8,
//   Ten = 9,
//   Jack = 10,
//   Queen = 11,
//   King = 12
// }

export type CardTileRank =
  | 'ace'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'jack'
  | 'queen'
  | 'king';

export type CardTileSuit = 'heart' | 'diamond' | 'club' | 'spade';

export type CardRowIndex = 0 | 1 | 2 | 3;
export type CardColIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// function getRowsIndexes () {
//   return Array.from({ length: ROWS }).map((_, i) => i)
// }
