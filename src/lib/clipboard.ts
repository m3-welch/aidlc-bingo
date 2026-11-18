export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Try the legacy copy command when clipboard access is denied.
    }
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.readOnly = true;
  input.style.position = "fixed";
  input.style.opacity = "0";
  const previous = document.activeElement;
  document.body.appendChild(input);
  try {
    input.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    input.remove();
    if (previous instanceof HTMLElement) previous.focus();
  }
}
