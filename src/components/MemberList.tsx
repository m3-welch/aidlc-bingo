"use client";

import { useEffect, useState } from "react";

interface Member {
  name: string;
  marked: number;
  bingo: boolean;
  grid: boolean[];
  rare: boolean[];
}

export default function MemberList({ mobId, self, refreshKey }: { mobId: string; self: string; refreshKey: unknown }) {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    let stop = false;
    const poll = async () => {
      if (document.hidden) return;
      const res = await fetch(`/api/mobs/${mobId}/members`, { cache: "no-store" }).catch(() => null);
      if (res?.ok && !stop) setMembers(((await res.json()) as { members: Member[] }).members);
    };
    void poll();
    const timer = setInterval(poll, 4000);
    document.addEventListener("visibilitychange", poll);
    return () => {
      stop = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", poll);
    };
  }, [mobId, refreshKey]);

  return (
    <section className="panel">
      <h2>Mob members ({members.length})</h2>
      <p className="muted">Gold outline: rare square</p>
      <ul className="members">
        {members.map((m) => (
          <li key={m.name}>
            <div>
              <div>{m.name}{m.name === self ? " (you)" : ""}</div>
              <div className="muted">{m.bingo ? "🎉 BINGO!" : `${m.marked} marked`}</div>
            </div>
            <div className="mini" role="img" aria-label={`${m.name}'s board: filled squares are marked, gold outlines indicate rare squares`}>
              {m.grid.map((on, i) => <span key={i} className={`${on ? "on" : ""} ${m.rare?.[i] ? "rare" : ""}`} />)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
