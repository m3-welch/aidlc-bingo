import { afterEach, describe, expect, it, vi } from "vitest";
import { copyText } from "@/lib/clipboard";

afterEach(() => vi.unstubAllGlobals());

function legacyClipboard(result: boolean) {
  const input = { value: "", readOnly: false, style: {}, select: vi.fn(), remove: vi.fn() };
  const execCommand = vi.fn(() => result);
  vi.stubGlobal("HTMLElement", class {});
  vi.stubGlobal("document", {
    activeElement: null,
    createElement: () => input,
    body: { appendChild: vi.fn() },
    execCommand,
  });
  return { input, execCommand };
}

describe("copyText", () => {
  it("uses the clipboard API when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    expect(await copyText("invite")).toBe(true);
    expect(writeText).toHaveBeenCalledWith("invite");
  });

  it("copies using the legacy command when the clipboard API is unavailable", async () => {
    vi.stubGlobal("navigator", {});
    const { input, execCommand } = legacyClipboard(true);
    expect(await copyText("invite")).toBe(true);
    expect(input.value).toBe("invite");
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(input.remove).toHaveBeenCalled();
  });

  it("reports failure when clipboard access is denied and the fallback fails", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    const { input } = legacyClipboard(false);
    expect(await copyText("invite")).toBe(false);
    expect(input.remove).toHaveBeenCalled();
  });
});
