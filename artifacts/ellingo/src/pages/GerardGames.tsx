import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── 2048 GAME ────────────────────────────────────────────────────────────────
const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0:    { bg: "#eee4da26", text: "#776e65" },
  2:    { bg: "#eee4da",   text: "#776e65" },
  4:    { bg: "#ede0c8",   text: "#776e65" },
  8:    { bg: "#f2b179",   text: "#f9f6f2" },
  16:   { bg: "#f59563",   text: "#f9f6f2" },
  32:   { bg: "#f67c5f",   text: "#f9f6f2" },
  64:   { bg: "#f65e3b",   text: "#f9f6f2" },
  128:  { bg: "#edcf72",   text: "#f9f6f2" },
  256:  { bg: "#edcc61",   text: "#f9f6f2" },
  512:  { bg: "#edc850",   text: "#f9f6f2" },
  1024: { bg: "#edc53f",   text: "#f9f6f2" },
  2048: { bg: "#edc22e",   text: "#f9f6f2" },
};

function make2048Grid() {
  const g = Array(4).fill(null).map(() => Array(4).fill(0));
  addRandom(g); addRandom(g);
  return g;
}

function addRandom(g: number[][]) {
  const empties: [number, number][] = [];
  g.forEach((row, r) => row.forEach((v, c) => { if (v === 0) empties.push([r, c]); }));
  if (!empties.length) return;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function slide(row: number[]) {
  const nums = row.filter(n => n !== 0);
  let score = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) {
      nums[i] *= 2; score += nums[i]; nums[i + 1] = 0;
    }
  }
  const result = nums.filter(n => n !== 0);
  while (result.length < 4) result.push(0);
  return { row: result, score };
}

function move2048(grid: number[][], dir: "up" | "down" | "left" | "right") {
  const g = grid.map(r => [...r]);
  let score = 0;
  let moved = false;

  if (dir === "left") {
    for (let r = 0; r < 4; r++) {
      const { row, score: s } = slide(g[r]);
      if (row.join() !== g[r].join()) moved = true;
      g[r] = row; score += s;
    }
  } else if (dir === "right") {
    for (let r = 0; r < 4; r++) {
      const { row, score: s } = slide([...g[r]].reverse());
      const result = row.reverse();
      if (result.join() !== g[r].join()) moved = true;
      g[r] = result; score += s;
    }
  } else if (dir === "up") {
    for (let c = 0; c < 4; c++) {
      const col = g.map(r => r[c]);
      const { row, score: s } = slide(col);
      if (row.join() !== col.join()) moved = true;
      row.forEach((v, r) => { g[r][c] = v; }); score += s;
    }
  } else {
    for (let c = 0; c < 4; c++) {
      const col = g.map(r => r[c]).reverse();
      const { row, score: s } = slide(col);
      const result = row.reverse();
      const orig = g.map(r => r[c]);
      if (result.join() !== orig.join()) moved = true;
      result.forEach((v, r) => { g[r][c] = v; }); score += s;
    }
  }
  if (moved) addRandom(g);
  return { grid: g, score, moved };
}

function isGameOver(grid: number[][]) {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (grid[r][c] === 0) return false;
    if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
    if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
  }
  return true;
}

function Game2048({ onBack }: { onBack: () => void }) {
  const [grid, setGrid] = useState(make2048Grid);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("2048best") || 0));
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });

  const doMove = useCallback((dir: "up" | "down" | "left" | "right") => {
    setGrid(prev => {
      const { grid: newGrid, score: gained, moved } = move2048(prev, dir);
      if (!moved) return prev;
      setScore(s => {
        const total = s + gained;
        setBest(b => { const nb = Math.max(b, total); localStorage.setItem("2048best", String(nb)); return nb; });
        return total;
      });
      if (newGrid.some(r => r.includes(2048))) setWon(true);
      if (isGameOver(newGrid)) setOver(true);
      return newGrid;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); doMove("left"); }
      if (e.key === "ArrowRight") { e.preventDefault(); doMove("right"); }
      if (e.key === "ArrowUp") { e.preventDefault(); doMove("up"); }
      if (e.key === "ArrowDown") { e.preventDefault(); doMove("down"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doMove]);

  const reset = () => { setGrid(make2048Grid()); setScore(0); setWon(false); setOver(false); };

  const tileSize = 76;
  const gap = 10;
  const pad = 12;
  const boardSize = 4 * tileSize + 3 * gap + 2 * pad;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="font-bold gap-1"><ArrowLeft className="w-4 h-4" /> Mbrapa</Button>
        <div className="flex gap-3">
          <div className="bg-[#bbada0] text-white rounded-xl px-4 py-1.5 text-sm font-bold text-center min-w-[70px]">
            <div className="text-[10px] opacity-70 uppercase tracking-wide">PIKË</div>
            <div>{score}</div>
          </div>
          <div className="bg-[#bbada0] text-white rounded-xl px-4 py-1.5 text-sm font-bold text-center min-w-[70px]">
            <div className="text-[10px] opacity-70 uppercase tracking-wide">REKORD</div>
            <div>{best}</div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={reset} className="rounded-xl font-bold">Rifillo</Button>
      </div>

      <div
        className="relative select-none"
        style={{ width: boardSize, height: boardSize, background: "#bbada0", borderRadius: 16, padding: pad, userSelect: "none" }}
        onTouchStart={e => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - touchStart.current.x;
          const dy = e.changedTouches[0].clientY - touchStart.current.y;
          if (Math.abs(dx) > Math.abs(dy)) { if (dx > 30) doMove("right"); else if (dx < -30) doMove("left"); }
          else { if (dy > 30) doMove("down"); else if (dy < -30) doMove("up"); }
        }}
      >
        {/* Background cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap }}>
          {Array(16).fill(0).map((_, i) => (
            <div key={i} style={{ width: tileSize, height: tileSize, background: "#cdc1b4", borderRadius: 8 }} />
          ))}
        </div>
        {/* Tiles */}
        <div style={{ position: "absolute", top: pad, left: pad, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap }}>
          {grid.flat().map((v, i) => {
            const colors = TILE_COLORS[Math.min(v, 2048)] || TILE_COLORS[2048];
            const fontSize = v >= 1000 ? 20 : v >= 100 ? 26 : v >= 10 ? 32 : 38;
            return (
              <div key={i} style={{
                width: tileSize, height: tileSize, background: v ? colors.bg : "#cdc1b426",
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize, fontWeight: 900, color: colors.text,
                fontFamily: "'Fredoka One', sans-serif",
                transition: "background 0.1s",
                boxShadow: v >= 128 ? "0 4px 12px rgba(0,0,0,0.25)" : undefined,
              }}>
                {v > 0 ? v : ""}
              </div>
            );
          })}
        </div>

        {(won || over) && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(238,228,218,0.75)", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ fontSize: 56 }}>{won ? "🏆" : "😢"}</div>
            <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "Fredoka One, sans-serif", color: "#776e65" }}>
              {won ? "Fitove 2048!" : "Loja Mbaroi!"}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#776e65" }}>Pikë: {score}</div>
            <button onClick={reset} style={{ background: "#8f7a66", color: "white", border: "none", borderRadius: 12, padding: "10px 28px", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "Fredoka One, sans-serif" }}>
              Provo Përsëri
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground font-medium">⬆️⬇️⬅️➡️ Shtyp tastet për të lëvizur</p>
    </div>
  );
}

// ─── FLAPPY BIRD GAME ─────────────────────────────────────────────────────────
function FlappyBird({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    bird: { y: 250, vy: 0 },
    pipes: [] as { x: number; gap: number; scored: boolean }[],
    score: 0,
    best: Number(localStorage.getItem("flappybest") || 0),
    started: false,
    dead: false,
    frameCount: 0,
    bg: { x: 0 },
    ground: { x: 0 },
  });
  const [uiScore, setUiScore] = useState(0);
  const [uiBest, setUiBest] = useState(Number(localStorage.getItem("flappybest") || 0));
  const [phase, setPhase] = useState<"idle" | "playing" | "dead">("idle");
  const rafRef = useRef(0);

  const W = 360, H = 500;
  const BIRD_X = 80, BIRD_R = 18;
  const PIPE_W = 52, GAP = 145, PIPE_SPEED = 2.8, GRAVITY = 0.38, JUMP = -7.5;
  const GROUND_H = 70;

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.dead) return;
    if (!s.started) {
      s.started = true;
      setPhase("playing");
    }
    s.bird.vy = JUMP;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const drawBird = (y: number, vy: number) => {
      const angle = Math.max(-0.4, Math.min(0.5, vy * 0.06));
      ctx.save();
      ctx.translate(BIRD_X, y);
      ctx.rotate(angle);
      // Body
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.ellipse(0, 0, BIRD_R, BIRD_R - 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Wing
      ctx.fillStyle = "#FFA500";
      ctx.beginPath();
      ctx.ellipse(-4, 3, 10, 6, -0.3, 0, Math.PI * 2);
      ctx.fill();
      // Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(8, -5, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.arc(10, -5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(11, -6, 1, 0, Math.PI * 2);
      ctx.fill();
      // Beak
      ctx.fillStyle = "#FF8C00";
      ctx.beginPath();
      ctx.moveTo(16, -2); ctx.lineTo(26, 0); ctx.lineTo(16, 4);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    };

    const drawPipe = (x: number, gapY: number) => {
      const topH = gapY - GAP / 2;
      const botY = gapY + GAP / 2;

      // Pipe gradients
      const grad = ctx.createLinearGradient(x, 0, x + PIPE_W, 0);
      grad.addColorStop(0, "#3da329");
      grad.addColorStop(0.4, "#5cb85c");
      grad.addColorStop(1, "#2d7a1f");
      ctx.fillStyle = grad;

      // Top pipe
      ctx.beginPath();
      ctx.roundRect(x, 0, PIPE_W, topH - 10, [0, 0, 4, 4]);
      ctx.fill();
      ctx.fillRect(x - 6, topH - 30, PIPE_W + 12, 30);

      // Bottom pipe
      ctx.beginPath();
      ctx.roundRect(x, botY + 10, PIPE_W, H - botY - 10 - GROUND_H, [4, 4, 0, 0]);
      ctx.fill();
      ctx.fillRect(x - 6, botY, PIPE_W + 12, 30);

      // Highlights
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(x + 4, 0, 10, topH - 10);
      ctx.fillRect(x + 4, botY + 10, 10, H - botY - 10 - GROUND_H);
    };

    const loop = () => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, W, H);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H - GROUND_H);
      skyGrad.addColorStop(0, "#70C5CE");
      skyGrad.addColorStop(1, "#c9e8f0");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H - GROUND_H);

      // Clouds (static decorative)
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      [[60, 80, 55, 28], [200, 55, 70, 32], [290, 90, 45, 22]].forEach(([cx, cy, rw, rh]) => {
        ctx.beginPath(); ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 20, cy - 8, rw - 15, rh - 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx - 15, cy - 4, rw - 20, rh - 6, 0, 0, Math.PI * 2); ctx.fill();
      });

      // Scrolling ground
      if (s.started && !s.dead) s.ground.x = (s.ground.x - PIPE_SPEED * 1.2) % 40;
      ctx.fillStyle = "#DEB887";
      ctx.fillRect(0, H - GROUND_H, W, GROUND_H);
      ctx.fillStyle = "#5cb85c";
      ctx.fillRect(0, H - GROUND_H, W, 16);
      // Ground pattern
      ctx.fillStyle = "#4cae4c";
      for (let i = 0; i < W / 40 + 2; i++) {
        ctx.beginPath();
        ctx.arc(s.ground.x + i * 40, H - GROUND_H + 8, 16, Math.PI, 0);
        ctx.fill();
      }

      // Update & draw pipes
      if (s.started && !s.dead) {
        s.frameCount++;
        if (s.frameCount % 90 === 0) {
          const gap = 120 + Math.random() * 120;
          s.pipes.push({ x: W + 10, gap: gap, scored: false });
        }
        s.pipes = s.pipes.filter(p => p.x > -PIPE_W - 20);
        s.pipes.forEach(p => { p.x -= PIPE_SPEED; });
      }
      s.pipes.forEach(p => drawPipe(p.x, p.gap));

      // Bird physics
      if (s.started && !s.dead) {
        s.bird.vy += GRAVITY;
        s.bird.y += s.bird.vy;
      }

      drawBird(s.bird.y, s.bird.vy);

      // Collision
      if (s.started && !s.dead) {
        if (s.bird.y + BIRD_R >= H - GROUND_H || s.bird.y - BIRD_R <= 0) {
          s.dead = true;
          if (s.score > s.best) { s.best = s.score; localStorage.setItem("flappybest", String(s.score)); setUiBest(s.score); }
          setPhase("dead");
        }
        s.pipes.forEach(p => {
          const inX = BIRD_X + BIRD_R > p.x + 4 && BIRD_X - BIRD_R < p.x + PIPE_W - 4;
          const inY = s.bird.y - BIRD_R < p.gap - GAP / 2 + 6 || s.bird.y + BIRD_R > p.gap + GAP / 2 - 6;
          if (inX && inY && !s.dead) {
            s.dead = true;
            if (s.score > s.best) { s.best = s.score; localStorage.setItem("flappybest", String(s.score)); setUiBest(s.score); }
            setPhase("dead");
          }
          if (!p.scored && p.x + PIPE_W < BIRD_X) {
            p.scored = true; s.score++;
            setUiScore(s.score);
          }
        });
      }

      // Score overlay
      if (s.started) {
        ctx.fillStyle = "white";
        ctx.font = "bold 36px 'Fredoka One', sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 6;
        ctx.fillText(String(s.score), W / 2, 52);
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const restart = () => {
    const s = stateRef.current;
    s.bird = { y: 250, vy: 0 };
    s.pipes = [];
    s.score = 0;
    s.started = false;
    s.dead = false;
    s.frameCount = 0;
    s.ground = { x: 0 };
    setUiScore(0);
    setPhase("idle");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === "Space") { e.preventDefault(); jump(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="font-bold gap-1"><ArrowLeft className="w-4 h-4" /> Mbrapa</Button>
        <div className="flex items-center gap-2 bg-yellow-400/20 px-4 py-2 rounded-full">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="font-bold text-yellow-700">Rekord: {uiBest}</span>
        </div>
        <Button variant="outline" size="sm" onClick={restart} className="rounded-xl font-bold">Rifillo</Button>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="rounded-3xl shadow-2xl border-4 border-yellow-300/40 max-w-full cursor-pointer"
          onClick={jump}
          onTouchStart={e => { e.preventDefault(); jump(); }}
          style={{ touchAction: "none" }}
        />

        {phase === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-3xl gap-4">
            <div className="text-7xl drop-shadow-lg">🐦</div>
            <h2 className="text-4xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Flappy Bird</h2>
            <p className="text-white/90 font-bold text-lg drop-shadow">Klik ose Space për të fluturuar!</p>
            <button onClick={jump} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold rounded-2xl px-8 py-3 text-lg shadow-xl transition-all active:scale-95">
              Fillo! 🚀
            </button>
          </div>
        )}

        {phase === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-3xl gap-3">
            <div className="text-6xl">💀</div>
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Loja Mbaroi!</h2>
            <div className="bg-white/20 rounded-2xl px-8 py-3 text-center">
              <p className="text-white font-bold text-2xl">{uiScore}</p>
              <p className="text-white/70 font-semibold text-sm">Pikët tuaja</p>
            </div>
            {uiScore >= uiBest && uiScore > 0 && (
              <div className="bg-yellow-400 text-yellow-900 font-bold rounded-xl px-4 py-1.5 text-sm">🏆 Rekord i Ri!</div>
            )}
            <button onClick={restart} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold rounded-2xl px-8 py-3 text-lg shadow-xl mt-2 transition-all active:scale-95">
              Provo Përsëri
            </button>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground font-medium">Klik / Space / Prekje për të fluturuar</p>
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

// ─── MAIN GAMES HUB ──────────────────────────────────────────────────────────
type GameId = "2048" | "flappy" | "memory" | "tictactoe" | null;

const GAMES = [
  { id: "2048" as GameId,      emoji: "🔢", title: "2048",         desc: "Bashko numrat, arrit 2048!",        bg: "from-amber-400 to-orange-500" },
  { id: "flappy" as GameId,    emoji: "🐦", title: "Flappy Bird",  desc: "Fluturimi i zogjve — sa larg?",     bg: "from-sky-400 to-cyan-600" },
  { id: "memory" as GameId,    emoji: "🃏", title: "Memory Match", desc: "Gjej çiftet e ikonave mjekësore!",  bg: "from-violet-500 to-purple-700" },
  { id: "tictactoe" as GameId, emoji: "✕◯", title: "Tic Tac Toe", desc: "Kush fiton — X apo O?",             bg: "from-rose-400 to-pink-600" },
];

export default function GerardGames() {
  const [activeGame, setActiveGame] = useState<GameId>(null);

  if (activeGame === "2048")      return <div className="max-w-sm mx-auto"><Game2048 onBack={() => setActiveGame(null)} /></div>;
  if (activeGame === "flappy")    return <div className="max-w-sm mx-auto"><FlappyBird onBack={() => setActiveGame(null)} /></div>;
  if (activeGame === "memory")    return <div className="max-w-sm mx-auto"><MemoryGame onBack={() => setActiveGame(null)} /></div>;
  if (activeGame === "tictactoe") return <div className="max-w-sm mx-auto"><TicTacToe onBack={() => setActiveGame(null)} /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
          <span className="shimmer-text">Gerard Games</span> 🎮
        </h1>
        <p className="text-muted-foreground font-semibold text-lg">Relakso me lojërat e preferuara!</p>
        <p className="text-xs text-muted-foreground mt-1 font-medium italic">by Elson</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className={`group relative overflow-hidden rounded-3xl p-6 text-left text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br ${game.bg}`}
          >
            <div className="absolute -right-4 -bottom-4 text-9xl opacity-15 select-none pointer-events-none">{game.emoji}</div>
            <div className="relative z-10">
              <div className="text-5xl mb-3 drop-shadow">{game.emoji}</div>
              <h2 className="text-2xl font-bold mb-1 drop-shadow" style={{ fontFamily: 'Fredoka One, sans-serif' }}>{game.title}</h2>
              <p className="text-white/85 font-semibold text-sm">{game.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 bg-white/25 backdrop-blur rounded-full px-4 py-1.5 text-sm font-bold shadow">
                Luaj Tani →
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center mt-8 text-sm text-muted-foreground font-medium">
        🎮 Gerard Games · Lojëra mini në El_lingo · <span className="text-primary font-bold">Created by Elson</span>
      </div>
    </div>
  );
}
