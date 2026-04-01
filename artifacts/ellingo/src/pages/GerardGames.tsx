import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── SNAKE GAME ───────────────────────────────────────────────────────────────
function SnakeGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<{
    snake: Array<{ x: number; y: number }>;
    dir: { x: number; y: number };
    food: { x: number; y: number };
    score: number;
    running: boolean;
    interval: ReturnType<typeof setInterval> | null;
  }>({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    score: 0,
    running: false,
    interval: null,
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const CELL = 20;
  const COLS = 20;
  const ROWS = 20;

  const randomFood = useCallback((snake: Array<{ x: number; y: number }>) => {
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some(s => s.x === pos!.x && s.y === pos!.y));
    return pos;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const g = gameRef.current;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    g.snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#58cc02" : "#4caf50";
      ctx.beginPath();
      ctx.roundRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2, 4);
      ctx.fill();
    });
    ctx.fillStyle = "#ff4b4b";
    ctx.beginPath();
    ctx.arc(g.food.x * CELL + CELL / 2, g.food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const tick = useCallback(() => {
    const g = gameRef.current;
    if (!g.running) return;
    const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || g.snake.some(s => s.x === head.x && s.y === head.y)) {
      g.running = false;
      if (g.interval) clearInterval(g.interval);
      setGameOver(true);
      return;
    }
    g.snake.unshift(head);
    if (head.x === g.food.x && head.y === g.food.y) {
      g.score++;
      setScore(g.score);
      g.food = randomFood(g.snake);
    } else {
      g.snake.pop();
    }
    draw();
  }, [draw, randomFood]);

  const startGame = useCallback(() => {
    const g = gameRef.current;
    if (g.interval) clearInterval(g.interval);
    g.snake = [{ x: 10, y: 10 }];
    g.dir = { x: 1, y: 0 };
    g.food = randomFood([{ x: 10, y: 10 }]);
    g.score = 0;
    g.running = true;
    setScore(0);
    setGameOver(false);
    setStarted(true);
    g.interval = setInterval(tick, 120);
    draw();
  }, [tick, draw, randomFood]);

  useEffect(() => {
    draw();
    const handleKey = (e: KeyboardEvent) => {
      const g = gameRef.current;
      if (e.key === "ArrowUp" && g.dir.y !== 1) g.dir = { x: 0, y: -1 };
      if (e.key === "ArrowDown" && g.dir.y !== -1) g.dir = { x: 0, y: 1 };
      if (e.key === "ArrowLeft" && g.dir.x !== 1) g.dir = { x: -1, y: 0 };
      if (e.key === "ArrowRight" && g.dir.x !== -1) g.dir = { x: 1, y: 0 };
    };
    window.addEventListener("keydown", handleKey);
    return () => { window.removeEventListener("keydown", handleKey); const g = gameRef.current; if (g.interval) clearInterval(g.interval); };
  }, [draw]);

  const swipe = (dx: number, dy: number) => {
    const g = gameRef.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && g.dir.x !== -1) g.dir = { x: 1, y: 0 };
      else if (dx < 0 && g.dir.x !== 1) g.dir = { x: -1, y: 0 };
    } else {
      if (dy > 0 && g.dir.y !== -1) g.dir = { x: 0, y: 1 };
      else if (dy < 0 && g.dir.y !== 1) g.dir = { x: 0, y: -1 };
    }
  };
  const touchStart = useRef({ x: 0, y: 0 });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="font-bold gap-1"><ArrowLeft className="w-4 h-4" /> Mbrapa</Button>
        <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full">
          <Trophy className="w-4 h-4 text-green-600" />
          <span className="font-bold text-green-700">{score}</span>
        </div>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="rounded-2xl shadow-2xl border-4 border-green-500/30"
          onTouchStart={e => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
          onTouchEnd={e => { swipe(e.changedTouches[0].clientX - touchStart.current.x, e.changedTouches[0].clientY - touchStart.current.y); }}
        />
        {(!started || gameOver) && (
          <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center gap-4 text-white">
            {gameOver && <div className="text-5xl">💀</div>}
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'Fredoka One, sans-serif' }}>{gameOver ? "Loja Mbaroi!" : "Snake 🐍"}</h2>
            {gameOver && <p className="font-bold text-lg">Rezultati: {score}</p>}
            <Button onClick={startGame} size="lg" className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl">
              {gameOver ? "Lësh Përsëri" : "Fillo Lojën"}
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div />
        <Button variant="outline" size="sm" onClick={() => swipe(0, -50)} className="rounded-xl font-bold">↑</Button>
        <div />
        <Button variant="outline" size="sm" onClick={() => swipe(-50, 0)} className="rounded-xl font-bold">←</Button>
        <Button variant="outline" size="sm" onClick={() => swipe(0, 50)} className="rounded-xl font-bold">↓</Button>
        <Button variant="outline" size="sm" onClick={() => swipe(50, 0)} className="rounded-xl font-bold">→</Button>
      </div>
    </div>
  );
}

// ─── MEMORY MATCH GAME ────────────────────────────────────────────────────────
const EMOJI_PAIRS = ["🦴", "💊", "❤️", "🧠", "🔬", "🫁", "👁️", "🦷", "🫀", "💉", "🧬", "🩻"];

function MemoryGame({ onBack }: { onBack: () => void }) {
  const makeCards = () => {
    const pairs = EMOJI_PAIRS.slice(0, 8);
    return [...pairs, ...pairs].map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false })).sort(() => Math.random() - 0.5);
  };
  const [cards, setCards] = useState(makeCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [checking, setChecking] = useState(false);

  const flip = (id: number) => {
    if (checking || selected.length >= 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    const newSelected = [...selected, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setSelected(newSelected);
    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      setChecking(true);
      setTimeout(() => {
        const [a, b] = newSelected;
        const cardA = cards.find(c => c.id === a)!;
        const cardB = cards.find(c => c.id === b)!;
        const match = cardA.emoji === cardB.emoji;
        setCards(prev => prev.map(c => {
          if (c.id === a || c.id === b) return { ...c, matched: match, flipped: match };
          return c;
        }));
        setSelected([]);
        setChecking(false);
        if (match && cards.filter(c => c.matched).length + 2 === cards.length) setWon(true);
      }, 800);
    }
  };

  const reset = () => { setCards(makeCards()); setSelected([]); setMoves(0); setWon(false); };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="font-bold gap-1"><ArrowLeft className="w-4 h-4" /> Mbrapa</Button>
        <span className="font-bold text-muted-foreground">Lëvizje: {moves}</span>
        <Button variant="outline" size="sm" onClick={reset} className="rounded-xl font-bold">Rifillo</Button>
      </div>
      {won && (
        <div className="text-center bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 w-full max-w-sm">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-bold text-lg text-yellow-700">Fitove në {moves} lëvizje!</p>
        </div>
      )}
      <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => flip(card.id)}
            className={`h-16 rounded-2xl text-3xl font-bold transition-all duration-300 border-2 shadow-sm ${
              card.flipped || card.matched
                ? card.matched
                  ? "bg-green-100 border-green-400 scale-95"
                  : "bg-primary/10 border-primary/40"
                : "bg-card border-border hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            {card.flipped || card.matched ? card.emoji : "?"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── TIC TAC TOE ─────────────────────────────────────────────────────────────
function TicTacToe({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const checkWinner = (b: (string|null)[]) => {
    for (const [a,c,d] of lines) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    return b.every(Boolean) ? "Draw" : null;
  };

  const play = (i: number) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = xTurn ? "X" : "O";
    setBoard(newBoard);
    setXTurn(!xTurn);
    setWinner(checkWinner(newBoard));
  };

  const reset = () => { setBoard(Array(9).fill(null)); setXTurn(true); setWinner(null); };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-xs">
        <Button variant="ghost" size="sm" onClick={onBack} className="font-bold gap-1"><ArrowLeft className="w-4 h-4" /> Mbrapa</Button>
        <span className="font-bold">{winner ? (winner === "Draw" ? "Barazim! 🤝" : `${winner} Fitoi! 🎉`) : `Radha: ${xTurn ? "✕" : "◯"}`}</span>
        <Button variant="outline" size="sm" onClick={reset} className="rounded-xl font-bold">Rifillo</Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {board.map((v, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            className={`w-24 h-24 rounded-2xl text-4xl font-bold border-2 transition-all duration-200 shadow-sm ${
              v === "X" ? "bg-primary/10 border-primary text-primary"
              : v === "O" ? "bg-red-50 border-red-400 text-red-500"
              : "bg-card border-border hover:bg-muted"
            }`}
          >
            {v === "X" ? "✕" : v === "O" ? "◯" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ANGRY BIRDS (Simplified Canvas Physics) ──────────────────────────────────
function AngryBirdsGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    bird: { x: 80, y: 300, vx: 0, vy: 0, flying: false, used: false },
    pigs: [
      { x: 340, y: 310, r: 20, hp: 2, alive: true },
      { x: 380, y: 280, r: 16, hp: 1, alive: true },
      { x: 360, y: 340, r: 18, hp: 1, alive: true },
    ],
    blocks: [
      { x: 310, y: 330, w: 80, h: 20, alive: true },
      { x: 325, y: 310, w: 60, h: 20, alive: true },
      { x: 335, y: 290, w: 50, h: 20, alive: true },
    ],
    score: 0,
    dragging: false,
    dragStart: { x: 0, y: 0 },
    currentDrag: { x: 0, y: 0 },
    slingOrigin: { x: 80, y: 300 },
    animFrame: 0,
    birdReset: { x: 80, y: 300 },
    shots: 3,
  });
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(3);
  const [message, setMessage] = useState("");

  const GROUND = 380;
  const W = 480;
  const H = 400;

  const reset = () => {
    const s = stateRef.current;
    s.bird = { x: 80, y: 300, vx: 0, vy: 0, flying: false, used: false };
    s.pigs = [
      { x: 340, y: 310, r: 20, hp: 2, alive: true },
      { x: 380, y: 280, r: 16, hp: 1, alive: true },
      { x: 360, y: 340, r: 18, hp: 1, alive: true },
    ];
    s.blocks = [
      { x: 310, y: 330, w: 80, h: 20, alive: true },
      { x: 325, y: 310, w: 60, h: 20, alive: true },
      { x: 335, y: 290, w: 50, h: 20, alive: true },
    ];
    s.score = 0;
    s.shots = 3;
    s.dragging = false;
    setScore(0);
    setShots(3);
    setMessage("");
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let rafId: number;

    const drawScene = () => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, W, H);

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, "#87CEEB");
      skyGrad.addColorStop(1, "#E0F7FA");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Ground
      ctx.fillStyle = "#4caf50";
      ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.fillStyle = "#388e3c";
      ctx.fillRect(0, GROUND, W, 8);

      // Clouds (decorative)
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      [[150, 60, 50, 30], [300, 40, 70, 35]].forEach(([cx, cy, rw, rh]) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Slingshot
      ctx.strokeStyle = "#8B4513";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(65, GROUND); ctx.lineTo(72, 290); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(95, GROUND); ctx.lineTo(88, 290); ctx.stroke();

      // Rubber band
      if (s.dragging && !s.bird.flying) {
        ctx.strokeStyle = "#a0522d80";
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(72, 290); ctx.lineTo(s.currentDrag.x, s.currentDrag.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(88, 290); ctx.lineTo(s.currentDrag.x, s.currentDrag.y); ctx.stroke();
      } else if (!s.bird.flying && !s.bird.used) {
        ctx.strokeStyle = "#a0522d60";
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(72, 290); ctx.lineTo(s.bird.x, s.bird.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(88, 290); ctx.lineTo(s.bird.x, s.bird.y); ctx.stroke();
      }

      // Blocks
      s.blocks.filter(b => b.alive).forEach(b => {
        ctx.fillStyle = "#a0522d";
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = "#6d3a1a";
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      });

      // Pigs
      s.pigs.filter(p => p.alive).forEach(p => {
        ctx.fillStyle = "#4caf50";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#2e7d32";
        ctx.lineWidth = 2;
        ctx.stroke();
        // Eyes
        ctx.fillStyle = "white";
        ctx.beginPath(); ctx.arc(p.x - 6, p.y - 5, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x + 6, p.y - 5, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#111";
        ctx.beginPath(); ctx.arc(p.x - 6, p.y - 5, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x + 6, p.y - 5, 2, 0, Math.PI * 2); ctx.fill();
        // HP
        if (p.hp > 1) { ctx.fillStyle = "#ff0"; ctx.font = "bold 10px sans-serif"; ctx.fillText("❤️".repeat(p.hp), p.x - 10, p.y + p.r + 12); }
      });

      // Bird
      if (!s.bird.used) {
        const bx = s.dragging ? s.currentDrag.x : s.bird.x;
        const by = s.dragging ? s.currentDrag.y : s.bird.y;
        ctx.fillStyle = "#ff4b4b";
        ctx.beginPath(); ctx.arc(bx, by, 18, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#c0392b";
        ctx.lineWidth = 2;
        ctx.stroke();
        // Angry eyebrows
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(bx - 9, by - 8); ctx.lineTo(bx - 2, by - 5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx + 9, by - 8); ctx.lineTo(bx + 2, by - 5); ctx.stroke();
        ctx.fillStyle = "white";
        ctx.beginPath(); ctx.arc(bx - 5, by - 3, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx + 5, by - 3, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#111";
        ctx.beginPath(); ctx.arc(bx - 4, by - 3, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx + 6, by - 3, 2, 0, Math.PI * 2); ctx.fill();
      }
    };

    const update = () => {
      const s = stateRef.current;
      if (s.bird.flying) {
        s.bird.vy += 0.4; // gravity
        s.bird.x += s.bird.vx;
        s.bird.y += s.bird.vy;

        // Check blocks
        s.blocks.filter(b => b.alive).forEach(b => {
          if (s.bird.x + 16 > b.x && s.bird.x - 16 < b.x + b.w &&
              s.bird.y + 16 > b.y && s.bird.y - 16 < b.y + b.h) {
            b.alive = false;
            s.score += 50;
            setScore(s.score);
          }
        });

        // Check pigs
        s.pigs.filter(p => p.alive).forEach(p => {
          const dx = s.bird.x - p.x, dy = s.bird.y - p.y;
          if (Math.sqrt(dx*dx + dy*dy) < p.r + 18) {
            p.hp--;
            if (p.hp <= 0) {
              p.alive = false;
              s.score += 200;
              setScore(s.score);
            }
            s.bird.flying = false;
            s.bird.used = true;
            s.shots--;
            setShots(s.shots);
            if (s.pigs.every(p => !p.alive)) setMessage("🎉 Të gjithë derrat u goditën! Fiton!");
            else if (s.shots <= 0 && s.pigs.some(p => p.alive)) setMessage("💔 Jo mjaft zogj! Provo përsëri.");
          }
        });

        // Ground
        if (s.bird.y >= GROUND - 18) {
          s.bird.flying = false;
          s.bird.used = true;
          s.shots--;
          setShots(s.shots);
          if (s.pigs.every(p => !p.alive)) setMessage("🎉 Të gjithë derrat u goditën! Fiton!");
          else if (s.shots <= 0 && s.pigs.some(p => p.alive)) setMessage("💔 Jo mjaft zogj! Provo përsëri.");
        }

        // Out of bounds
        if (s.bird.x > W + 50) {
          s.bird.flying = false;
          s.bird.used = true;
          s.shots--;
          setShots(s.shots);
          if (s.shots <= 0 && s.pigs.some(p => p.alive)) setMessage("💔 Jo mjaft zogj! Provo përsëri.");
        }
      }
      drawScene();
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);

    const getPos = (e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e instanceof MouseEvent ? e.clientX : e.clientX) - rect.left) * (W / rect.width),
        y: ((e instanceof MouseEvent ? e.clientY : e.clientY) - rect.top) * (H / rect.height),
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      const s = stateRef.current;
      if (s.bird.flying || s.bird.used || s.shots <= 0) return;
      const pos = getPos(e, canvas);
      const dx = pos.x - s.bird.x, dy = pos.y - s.bird.y;
      if (Math.sqrt(dx * dx + dy * dy) < 25) {
        s.dragging = true;
        s.currentDrag = { ...pos };
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s.dragging) return;
      const pos = getPos(e, canvas);
      const dx = pos.x - s.slingOrigin.x, dy = pos.y - s.slingOrigin.y;
      const dist = Math.min(60, Math.sqrt(dx*dx + dy*dy));
      const angle = Math.atan2(dy, dx);
      s.currentDrag = { x: s.slingOrigin.x + dist * Math.cos(angle), y: s.slingOrigin.y + dist * Math.sin(angle) };
    };
    const onMouseUp = () => {
      const s = stateRef.current;
      if (!s.dragging) return;
      s.dragging = false;
      const dx = s.slingOrigin.x - s.currentDrag.x;
      const dy = s.slingOrigin.y - s.currentDrag.y;
      s.bird.x = s.currentDrag.x;
      s.bird.y = s.currentDrag.y;
      s.bird.vx = dx * 0.18;
      s.bird.vy = dy * 0.18;
      s.bird.flying = true;
    };
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", e => { e.preventDefault(); onMouseDown(e.touches[0] as any); }, { passive: false });
    canvas.addEventListener("touchmove", e => { e.preventDefault(); onMouseMove(e.touches[0] as any); }, { passive: false });
    canvas.addEventListener("touchend", e => { e.preventDefault(); onMouseUp(); }, { passive: false });

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-lg">
        <Button variant="ghost" size="sm" onClick={onBack} className="font-bold gap-1"><ArrowLeft className="w-4 h-4" /> Mbrapa</Button>
        <div className="flex gap-4">
          <span className="font-bold">🐦 {"🐦".repeat(shots)}</span>
          <span className="font-bold text-primary">⭐ {score}</span>
        </div>
        <Button variant="outline" size="sm" onClick={reset} className="rounded-xl font-bold">Rifillo</Button>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={480} height={400} className="rounded-2xl shadow-2xl border-4 border-red-400/30 max-w-full" style={{ touchAction: "none" }} />
        {message && (
          <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center gap-4 text-white">
            <div className="text-5xl">{message.startsWith("🎉") ? "🎉" : "💔"}</div>
            <h2 className="text-2xl font-bold text-center px-4">{message}</h2>
            <p className="font-bold">Rezultati: {score}</p>
            <Button onClick={reset} size="lg" className="bg-red-500 hover:bg-red-600 rounded-2xl font-bold">Provo Përsëri</Button>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground font-medium">Tërhiq zogun me miun/gishtin dhe lëshoje!</p>
    </div>
  );
}

// ─── MAIN GAMES HUB ──────────────────────────────────────────────────────────
type GameId = "angry-birds" | "snake" | "memory" | "tictactoe" | null;

const GAMES = [
  { id: "angry-birds" as GameId, emoji: "🐦", title: "Angry Birds", desc: "Godit derrat me zogun e tërbuar!", color: "#ff4b4b", bg: "from-red-400 to-orange-500" },
  { id: "snake" as GameId, emoji: "🐍", title: "Snake", desc: "Drejtoje gjarprin, mos u prek!", color: "#4caf50", bg: "from-green-400 to-emerald-600" },
  { id: "memory" as GameId, emoji: "🃏", title: "Memory Match", desc: "Gjej çiftet e ikonave mjekësore!", color: "#7c3aed", bg: "from-violet-500 to-purple-700" },
  { id: "tictactoe" as GameId, emoji: "✕◯", title: "Tic Tac Toe", desc: "Kush fiton — X apo O?", color: "#0ea5e9", bg: "from-sky-400 to-blue-600" },
];

export default function GerardGames() {
  const [activeGame, setActiveGame] = useState<GameId>(null);

  if (activeGame === "angry-birds") return <div className="max-w-2xl mx-auto"><AngryBirdsGame onBack={() => setActiveGame(null)} /></div>;
  if (activeGame === "snake") return <div className="max-w-lg mx-auto"><SnakeGame onBack={() => setActiveGame(null)} /></div>;
  if (activeGame === "memory") return <div className="max-w-sm mx-auto"><MemoryGame onBack={() => setActiveGame(null)} /></div>;
  if (activeGame === "tictactoe") return <div className="max-w-sm mx-auto"><TicTacToe onBack={() => setActiveGame(null)} /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
          <span className="shimmer-text">Gerard Games</span> 🎮
        </h1>
        <p className="text-muted-foreground font-semibold text-lg">Relakso me lojërat e preferuara!</p>
        <p className="text-xs text-muted-foreground mt-1 font-medium italic">by Elson</p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className="group relative overflow-hidden rounded-3xl p-6 text-left text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${game.bg}`} />
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 select-none pointer-events-none">{game.emoji}</div>
            <div className="relative z-10">
              <div className="text-5xl mb-3">{game.emoji}</div>
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Fredoka One, sans-serif' }}>{game.title}</h2>
              <p className="text-white/80 font-medium text-sm">{game.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-bold">
                Luaj Tani →
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Credit */}
      <div className="text-center mt-8 text-sm text-muted-foreground font-medium">
        🎮 Gerard Games · Lojëra mini në El_lingo · <span className="text-primary font-bold">Created by Elson</span>
      </div>
    </div>
  );
}
