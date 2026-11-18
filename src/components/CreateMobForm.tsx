"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateMobForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/mobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setBusy(false);
      return;
    }
    router.push(`/m/${data.id}`);
  }

  return (
    <form onSubmit={submit} className="panel">
      <label htmlFor="mob-name">Name your mob</label>
      <input id="mob-name" value={name} maxLength={50} onChange={(e) => setName(e.target.value)} placeholder="Team Rocket Inception" />
      {error && <p className="error" role="alert">{error}</p>}
      <button disabled={busy}>Create mob</button>
    </form>
  );
}
