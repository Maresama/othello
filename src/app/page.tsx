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
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = structuredClone(board);

    let flipped = false; //裏返っていないならfalse

    //下方向
    let i = 1;
    while (
      board[y + i] !== undefined &&
      board[y + i][x] !== undefined &&
      board[y + i][x] === 3 - turnColor
    ) {
      i++;
    }
    if (
      board[y + i] !== undefined &&
      board[y + i][x] !== undefined &&
      i > 1 &&
      board[y + i][x] === turnColor
    ) {
      newBoard[y][x] = turnColor;
      for (let k = 1; k < i; k++) {
        newBoard[y + k][x] = turnColor;
      }
      flipped = true; // ← 石を裏返せたら true
    }

    // 上方向
    i = 1;
    while (
      board[y - i] !== undefined &&
      board[y - i][x] !== undefined &&
      board[y - i][x] === 3 - turnColor
    ) {
      i++;
    }
    if (
      board[y - i] !== undefined &&
      board[y - i][x] !== undefined &&
      i > 1 &&
      board[y - i][x] === turnColor
    ) {
      newBoard[y][x] = turnColor;
      for (let k = 1; k < i; k++) {
        newBoard[y - k][x] = turnColor;
      }
      flipped = true; // ← 石を裏返せたら true
    }

    // 右方向
    i = 1;
    while (
      board[y] !== undefined &&
      board[y][x + i] !== undefined &&
      board[y][x + i] === 3 - turnColor
    ) {
      i++;
    }
    if (
      board[y] !== undefined &&
      board[y][x + i] !== undefined &&
      i > 1 &&
      board[y][x + i] === turnColor
    ) {
      newBoard[y][x] = turnColor;
      for (let k = 1; k < i; k++) {
        newBoard[y][x + k] = turnColor;
      }
      flipped = true; // ← 石を裏返せたら true
    }

    // 左方向
    i = 1;
    while (
      board[y] !== undefined &&
      board[y][x - i] !== undefined &&
      board[y][x - i] === 3 - turnColor
    ) {
      i++;
    }
    if (
      board[y] !== undefined &&
      board[y][x - i] !== undefined &&
      i > 1 &&
      board[y][x - i] === turnColor
    ) {
      newBoard[y][x] = turnColor;
      for (let k = 1; k < i; k++) {
        newBoard[y][x - k] = turnColor;
      }
      flipped = true; // ← 石を裏返せたら true
    }
    //左上
    i = 1;
    while (
      board[y - i] !== undefined &&
      board[y - i][x - i] !== undefined &&
      board[y - i][x - i] === 3 - turnColor
    ) {
      i++;
    }
    if (
      board[y - i] !== undefined &&
      board[y - i][x - i] !== undefined &&
      i > 1 &&
      board[y - i][x - i] === turnColor
    ) {
      newBoard[y][x] = turnColor;
      for (let k = 1; k < i; k++) {
        newBoard[y - k][x - k] = turnColor;
      }
      flipped = true; // ← 石を裏返せたら true
    }
    //右上
    i = 1;
    while (
      board[y - i] !== undefined &&
      board[y - i][x + i] !== undefined &&
      board[y - i][x + i] === 3 - turnColor
    ) {
      i++;
    }
    if (
      board[y - i] !== undefined &&
      board[y - i][x + i] !== undefined &&
      i > 1 &&
      board[y - i][x + i] === turnColor
    ) {
      newBoard[y][x] = turnColor;
      for (let k = 1; k < i; k++) {
        newBoard[y - k][x + k] = turnColor;
      }
      flipped = true; // ← 石を裏返せたら true
    }
    //左下
    i = 1;
    while (
      board[y + i] !== undefined &&
      board[y + i][x - i] !== undefined &&
      board[y + i][x - i] === 3 - turnColor
    ) {
      i++;
    }
    if (
      board[y + i] !== undefined &&
      board[y + i][x - i] !== undefined &&
      i > 1 &&
      board[y + i][x - i] === turnColor
    ) {
      newBoard[y][x] = turnColor;
      for (let k = 1; k < i; k++) {
        newBoard[y + k][x - k] = turnColor;
      }
      flipped = true; // ← 石を裏返せたら true
    }
    //右下
    i = 1;
    while (
      board[y + i] !== undefined &&
      board[y + i][x + i] !== undefined &&
      board[y + i][x + i] === 3 - turnColor
    ) {
      i++;
    }
    if (
      board[y + i] !== undefined &&
      board[y + i][x + i] !== undefined &&
      i > 1 &&
      board[y + i][x + i] === turnColor
    ) {
      newBoard[y][x] = turnColor;
      for (let k = 1; k < i; k++) {
        newBoard[y + k][x + k] = turnColor;
      }
      flipped = true; // ← 石を裏返せたら true
    }
    if (flipped) {
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
