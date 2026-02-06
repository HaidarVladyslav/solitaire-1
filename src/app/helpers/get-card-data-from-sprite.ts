import { CardColIndex, CardRowIndex, CardTileData } from '../types/card-tile-data';

export function getCardDataFromSprite(row: number, col: number): CardTileData {
  const rank: CardTileData['rank'] =
    col === 0
      ? 'ace'
      : col === 1
        ? '2'
        : col === 2
          ? '3'
          : col === 3
            ? '4'
            : col === 4
              ? '5'
              : col === 5
                ? '6'
                : col === 6
                  ? '7'
                  : col === 7
                    ? '8'
                    : col === 8
                      ? '9'
                      : col === 9
                        ? '10'
                        : col === 10
                          ? 'jack'
                          : col === 11
                            ? 'queen'
                            : 'king';

  const suit: CardTileData['suit'] =
    row === 0 ? 'club' : row === 1 ? 'diamond' : row === 2 ? 'spade' : 'heart';
  const isRed: CardTileData['isRed'] = row % 2 === 1;
  const canBePlacedOnEmpty: CardTileData['canBePlacedOnEmpty'] = rank === 'king';
  return {
    rank,
    suit,
    isRed,
    canBePlacedOnEmpty,
    priority: col,
    isBack: false,
  };
}
