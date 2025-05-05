'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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

  const [blackCount, setBlackCount] = useState(2);
  const [whiteCount, setWhiteCount] = useState(2);
  const [validMoves, setvalidMoves] = useState<number[][]>([]);
  const [message, setMessage] = useState('');

  const directions = useMemo(
    () => [
      [1, 0], //下
      [-1, 0], //上
      [0, -1], //左
      [1, -1], //左下
      [-1, -1], //左上
      [1, 1], //右上
      [0, 1], //右
      [-1, 1], //右下
    ],
    [],
  );
  const updatevalidMoves = useCallback(
    (board: number[][], color: number) => {
      const moves: number[][] = [];
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
              moves.push([y, x]);
              break;
            }
          }
        }
      }
      setvalidMoves(moves);
    },
    [directions],
  );

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
        setMessage(''); // メッセージ消す
      } else if (canPlace(newBoard, turnColor)) {
        setMessage(`%c${nextColor === 1 ? '黒' : '白'}は置けないのでスキップします`);
        setTurnColor(turnColor);
      } else {
        setMessage('ゲーム終了');
      }
    }
  };

  const updateScore = (b: number[][]) => {
    let black = 0,
      white = 0;
    for (const row of b) {
      for (const cell of row) {
        if (cell === 1) black++;
        if (cell === 2) white++;
      }
    }
    setBlackCount(black);
    setWhiteCount(white);
  };

  useEffect(() => {
    updateScore(board); // 得点
    updatevalidMoves(board, turnColor); // 候補地
  }, [board, turnColor, updatevalidMoves]);

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
        {board.map((row, y) =>
          row.map((color, x) => {
            const isValidMove = validMoves.some(([vy, vx]) => vy === y && vx === x);
            return (
              <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
                {color !== 0 ? (
                  <div
                    className={styles.stone}
                    style={{ background: color === 1 ? '#000' : '#fff' }}
                  />
                ) : isValidMove ? (
                  <div className={styles.shade} />
                ) : null}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
