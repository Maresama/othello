'use client';

import { useState } from 'react';
import styles from './page.module.css';

const calcBlackCount = (b: number[][]) => {
  let black = 0;
  for (const row of b) {
    for (const cell of row) {
      if (cell === 1) black++;
    }
  }
  return black;
};
const calcWhiteCount = (b: number[][]) => {
  let white = 0;
  for (const row of b) {
    for (const cell of row) {
      if (cell === 2) white++;
    }
  }
  return white;
};

const boardWithCandidates = (
  board: number[][],
  candidateBoard: number[][],
  color: number,
): number[][] => {
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

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] !== 0) continue;
      for (let i = 0; i < directions.length; i++) {
        const [dy, dx] = directions[i];
        let cy = y + dy;
        let cx = x + dx;
        let hasOpponent = false;
        while (cx >= 0 && cx < 8 && cy >= 0 && cy < 8 && board[cy][cx] === color) {
          hasOpponent = true;
          cy += dy;
          cx += dx;
        }
        if (hasOpponent && cx >= 0 && cx < 8 && cy >= 0 && cy < 8 && board[cy][cx] === 3 - color) {
          candidateBoard[y][x] = 3;
          break;
        }
      }
    }
  }
  return candidateBoard;
};

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
  const newBoard = structuredClone(board);
  const candidateBoard = structuredClone(board);
  const blackCount = calcBlackCount(board);
  const whiteCount = calcWhiteCount(board);
  const [validMoves] = useState<number[][]>([]);
  const [message, setMessage] = useState('');

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
    return board
      .flatMap((row, y) => row.map((cell, x) => ({ x, y, cell })))
      .some(({ x, y, cell }) => {
        if (cell !== 0) return false;

        return directions.some(([dy, dx]) => {
          let cy = y + dy;
          let cx = x + dx;
          let hasOpponent = false;

          while (cx >= 0 && cx < 8 && cy >= 0 && cy < 8 && board[cy][cx] === 3 - color) {
            hasOpponent = true;
            cy += dy;
            cx += dx;
          }

          return hasOpponent && cx >= 0 && cx < 8 && cy >= 0 && cy < 8 && board[cy][cx] === color;
        });
      });
  };

  const clickHandler = (x: number, y: number) => {
    console.log(board);

    if (board[y][x] % 3 !== 0) return;
    // directions すべてに対して裏返す候補の石を収集
    const allFlips = directions
      .map(([dy, dx]) => {
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
          return toFlip;
        }

        return []; // 裏返せない場合は空
      })
      .flat(); // 二次元配列を平坦化

    if (allFlips.length === 0) return; // 裏返す石がなければ無視

    // 裏返す
    allFlips.forEach(([fy, fx]) => {
      newBoard[fy][fx] = turnColor;
    });

    // 自分の石を置く
    newBoard[y][x] = turnColor;
    setBoard(newBoard);

    const nextColor = 3 - turnColor;
    if (canPlace(newBoard, nextColor)) {
      setTurnColor(nextColor);
    } else if (canPlace(newBoard, turnColor)) {
      alert(`${nextColor === 1 ? '黒' : '白'}は置けないのでスキップします`);
      // 自分のターン継続
      setTurnColor(turnColor);
    } else {
      alert('どちらも置けないのでゲーム終了');
    }
  };

  const resetGame = () => {
    setBoard([
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    setTurnColor(1);
  };
  return (
    <div className={styles.container}>
      <div className={styles.scoreBox}>
        <p>SCORE</p>
        <span>
          黒- {blackCount}
          白- {whiteCount}
        </span>
        <button className={styles.resetButton} onClick={resetGame}>
          リセット
        </button>
      </div>

      {message && <div className={styles.message}>{message}</div>}
      <div className={styles.board}>
        {boardWithCandidates(board, candidateBoard, 3 - turnColor).map((row, y) =>
          row.map((color, x) => {
            //const isValidMove = validMoves.some(([vy, vx]) => vy === y && vx === x);
            return (
              // <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              //   {color !== 0 ? (
              //     <div
              //       className={styles.stone}
              //       style={{ background: color === 1 ? '#000' : '#fff' }}
              //     />
              //   ) : isValidMove ? (
              //     <div className={styles.shade} />
              //   ) : null}
              // </div>
              <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
                {color % 3 !== 0 ? (
                  <div
                    className={styles.stone}
                    style={{ background: color === 1 ? '#000' : '#fff' }}
                  />
                ) : color === 3 ? (
                  <div className={styles.shade} />
                ) : (
                  <div />
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
