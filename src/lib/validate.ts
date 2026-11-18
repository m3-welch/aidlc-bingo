export class ValidationError extends Error {}

function clean(value: unknown, label: string, max: number): string {
  if (typeof value !== "string") throw new ValidationError(`${label} is required`);
  const v = value.replace(/\s+/g, " ").trim();
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(v)) throw new ValidationError(`${label} has invalid characters`);
  if (v.length < 1) throw new ValidationError(`${label} is required`);
  if (v.length > max) throw new ValidationError(`${label} must be at most ${max} characters`);
  return v;
}

export const validateMobName = (v: unknown) => clean(v, "Mob name", 50);
export const validatePlayerName = (v: unknown) => clean(v, "Player name", 30);
