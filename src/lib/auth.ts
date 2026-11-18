import { createHash, randomBytes } from "node:crypto";

export const newToken = () => randomBytes(32).toString("base64url");
export const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");

export function bearer(req: Request): string | null {
  const h = req.headers.get("authorization");
  const m = h?.match(/^Bearer\s+(\S+)$/i);
  return m ? m[1] : null;
}
