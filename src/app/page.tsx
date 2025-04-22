'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);

  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 2, 0],
    [0, 0, 0, 1, 2, 0, 2, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 2, 0],
    [0, 0, 0, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = structuredClone(board);

    let i = 1;
    while (board[y + i] !== undefined && board[y + i][x] === 3 - turnColor) {
      i++;
    }
    if (i > 1 && board[y + i] !== undefined && board[y + i][x] === turnColor) {
      newBoard[y][x] = turnColor;
      for (let k = 1; k < i; k++) {
        newBoard[y + k][x] = turnColor;
      }
      setTurnColor(3 - turnColor);
    }
    while (board[y - i] !== undefined && board[y - i][x] === 3 - turnColor) {
      i++;
    }
    if (i > 1 && board[y - i] !== undefined && board[y - i][x] === turnColor) {
      newBoard[y][x] = turnColor;
      for (let k = 1; k < i; k++) {
        newBoard[y - k][x] = turnColor;
      }
      setTurnColor(3 - turnColor);
    }

    setBoard(newBoard);
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
