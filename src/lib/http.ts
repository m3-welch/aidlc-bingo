import { NextResponse } from "next/server";
import { ConflictError, NotFoundError, UnauthorizedError } from "./mobs";
import { ValidationError } from "./validate";

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await req.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export function handle<T>(fn: () => T | Promise<T>, status = 200) {
  return Promise.resolve()
    .then(fn)
    .then((data) => NextResponse.json(data, { status }))
    .catch((e: unknown) => {
      const map: [unknown, number][] = [
        [ValidationError, 400],
        [RangeError, 400],
        [UnauthorizedError, 401],
        [NotFoundError, 404],
        [ConflictError, 409],
      ];
      for (const [cls, code] of map) {
        if (e instanceof (cls as new () => Error)) {
          return NextResponse.json({ error: (e as Error).message }, { status: code });
        }
      }
      console.error(e);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    });
}
