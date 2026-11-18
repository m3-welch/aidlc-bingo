"use client";

export interface CardCell {
  index: number;
  text: string;
  rarity: "common" | "rare" | "free";
  free: boolean;
  marked: boolean;
}

export default function BingoCard({
  card,
  winningLine,
  onToggle,
}: {
  card: CardCell[];
  winningLine: number[] | null;
  onToggle: (index: number, marked: boolean) => void;
}) {
  return (
    <div className="card" role="grid" aria-label="Your bingo card">
      {card.map((c) => {
        const cls = ["cell", c.rarity, c.marked ? "marked" : "", winningLine?.includes(c.index) ? "win" : ""].join(" ");
        return (
          <button
            key={c.index}
            className={cls}
            disabled={c.free}
            aria-pressed={c.marked}
            onClick={() => onToggle(c.index, !c.marked)}
          >
            {c.rarity === "rare" && <span className="badge">★ rare</span>}
            {c.text}
          </button>
        );
      })}
    </div>
  );
}
