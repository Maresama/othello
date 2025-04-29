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

  const canPlace = (board: number[][], color: number) => {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board[y][x] !== 0) continue;
        for (let i = 0; i < directions.length; i++) {
          const [dy, dx] = directions[i];
          let cy = y + dy;
          let cx = x + dx;
          let hasOpponent = false;
          while (cx >= 0 && cx < 8 && cy >= 0 && cy < 8 && board[cy][cx] === 3 - color) {
            hasOpponent = true;
            cy += dy;
            cx += dx;
          }
          if (hasOpponent && cx >= 0 && cx < 8 && cy >= 0 && cy < 8 && board[cy][cx] === color) {
            return true; // 置ける場所が見つかった
          }
        }
      }
    }
    return false; // どこにも置けない
  };

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    if (board[y][x] !== 0) return; //石が置かれていたら何もしない

    const newBoard = structuredClone(board);

    let Flipped = false;
    for (let i = 0; i < directions.length; i++) {
      const [dy, dx] = directions[i];
      const toFlip: [number, number][] = []; //裏返せそうな石の座標を保存
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
        for (let k = 0; k < toFlip.length; k++) {
          const [fy, fx] = toFlip[k];
          newBoard[fy][fx] = turnColor;
        }
        Flipped = true;
      }
    }
    if (Flipped) {
      newBoard[y][x] = turnColor;
      setBoard(newBoard);
      const nextColor = 3 - turnColor;
      if (canPlace(newBoard, nextColor)) {
        setTurnColor(nextColor);
      } else if (canPlace(newBoard, turnColor)) {
        alert(`${nextColor === 1 ? '黒' : '白'}は置けないのでスキップします`);
        setTurnColor(turnColor); //自分のターン継続
      } else {
        alert('どちらも置けないのでゲーム終了');
        // ゲーム終了処理が必要ならここで追加
      }
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
