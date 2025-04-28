'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);

  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const directions = [
    [1, 0], //下
    [-1, 0], //上
    [0, -1], //左
    [1, -1], //左下
    [-1, -1], //左上
    [1, 1], //右上
    [0, 1], //右
    [-1, 1], //右下
  ];

  // 置ける場所があるかチェックする関数
  const Move = (color: number) => {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board[y][x] === 0) {
          // 空き場所があれば
          const newBoard = structuredClone(board);
          let flipped = false;

          for (let i = 0; i < directions.length; i++) {
            const [dy, dx] = directions[i];
            const toFlip: [number, number][] = [];
            let cy = y + dy;
            let cx = x + dx;

            while (cx >= 0 && cx < 8 && cy >= 0 && cy < 8 && newBoard[cy][cx] === 3 - color) {
              toFlip.push([cy, cx]);
              cy += dy;
              cx += dx;
            }

            if (
              cx >= 0 &&
              cx < 8 &&
              cy >= 0 &&
              cy < 8 &&
              newBoard[cy][cx] === color &&
              toFlip.length > 0
            ) {
              flipped = true;
            }
          }

          if (flipped) return true;
        }
      }
    }
    return false;
  };

  const clickHandler = (x: number, y: number) => {
    if (board[y][x] !== 0) return; // すでに石があるなら何もしない

    const newBoard = structuredClone(board);
    let flipped = false;

    for (let i = 0; i < directions.length; i++) {
      const [dy, dx] = directions[i];
      const toFlip: [number, number][] = [];
      let cy = y + dy;
      let cx = x + dx;

      while (cx >= 0 && cx < 8 && cy >= 0 && cy < 8 && newBoard[cy][cx] === 3 - turnColor) {
        toFlip.push([cy, cx]);
        cy += dy;
        cx += dx;
      }

      if (
        cx >= 0 &&
        cx < 8 &&
        cy >= 0 &&
        cy < 8 &&
        newBoard[cy][cx] === turnColor &&
        toFlip.length > 0
      ) {
        for (let j = 0; j < toFlip.length; j++) {
          const [fy, fx] = toFlip[j];
          newBoard[fy][fx] = turnColor;
        }
        flipped = true;
      }
    }

    if (flipped) {
      newBoard[y][x] = turnColor;
      setBoard(newBoard);
      setTurnColor(3 - turnColor); // ターン交代
    }
  };

  const skipTurn = () => {
    if (!Move(turnColor)) {
      // 置ける場所がない場合
      setTurnColor(3 - turnColor); // ターン交代
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
