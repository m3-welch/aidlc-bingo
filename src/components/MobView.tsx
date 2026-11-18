"use client";

import { useCallback, useEffect, useState } from "react";
import { copyText } from "@/lib/clipboard";
import BingoCard, { type CardCell } from "./BingoCard";
import MemberList from "./MemberList";

interface MyCard {
  name: string;
  card: CardCell[];
  bingo: boolean;
  winningLine: number[] | null;
}

type State =
  | { kind: "loading" }
  | { kind: "notfound" }
  | { kind: "join"; mobName: string }
  | { kind: "play"; mobName: string; me: MyCard };

export default function MobView({ mobId }: { mobId: string }) {
  const tokenKey = `bingo:token:${mobId}`;
  const [state, setState] = useState<State>({ kind: "loading" });
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [inviteToCopy, setInviteToCopy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const mobRes = await fetch(`/api/mobs/${mobId}`);
    if (!mobRes.ok) return setState({ kind: "notfound" });
    const mob = (await mobRes.json()) as { name: string };
    const token = localStorage.getItem(tokenKey);
    if (token) {
      const res = await fetch(`/api/mobs/${mobId}/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) return setState({ kind: "play", mobName: mob.name, me: await res.json() });
      localStorage.removeItem(tokenKey);
    }
    setState({ kind: "join", mobName: mob.name });
  }, [mobId, tokenKey]);

  useEffect(() => {
    void load();
  }, [load]);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch(`/api/mobs/${mobId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error ?? "Could not join");
    localStorage.setItem(tokenKey, data.token);
    await load();
  }

  async function toggle(index: number, marked: boolean) {
    const token = localStorage.getItem(tokenKey);
    if (!token || state.kind !== "play") return;
    const res = await fetch(`/api/mobs/${mobId}/me/squares/${index}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ marked }),
    });
    if (res.ok) setState({ ...state, me: await res.json() });
  }

  async function copyLink() {
    const url = window.location.href;
    const success = await copyText(url);
    setInviteToCopy(success ? null : url);
    setCopied(success);
    if (success) setTimeout(() => setCopied(false), 1500);
  }

  if (state.kind === "loading") return <p className="muted">Loading…</p>;
  if (state.kind === "notfound") {
    return (
      <>
        <h1>Mob not found</h1>
        <p className="muted">Check the link you were given.</p>
        <a href="/">Create a new mob</a>
      </>
    );
  }
  if (state.kind === "join") {
    return (
      <>
        <h1>{state.mobName}</h1>
        <form onSubmit={join} className="panel">
          <label htmlFor="player-name">Your name</label>
          <input id="player-name" value={name} maxLength={30} onChange={(e) => setName(e.target.value)} />
          {error && <p className="error" role="alert">{error}</p>}
          <button>Join mob</button>
        </form>
      </>
    );
  }
  return (
    <>
      <header className="row">
        <h1>{state.mobName}</h1>
        <button className="secondary" onClick={copyLink}>{copied ? "Copied!" : "Copy invite link"}</button>
      </header>
      {inviteToCopy && (
        <div className="panel">
          <label htmlFor="invite-link" role="alert">Could not copy automatically. Select and copy the invite link:</label>
          <input id="invite-link" readOnly value={inviteToCopy} onFocus={(e) => e.currentTarget.select()} />
        </div>
      )}
      {state.me.bingo && <p className="bingo-banner">🎉 BINGO! 🎉</p>}
      <BingoCard card={state.me.card} winningLine={state.me.winningLine} onToggle={toggle} />
      <MemberList mobId={mobId} self={state.me.name} refreshKey={state.me.card.filter((c) => c.marked).length} />
    </>
  );
}
