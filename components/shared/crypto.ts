// Crypto utilities compartilhadas — SHA256 e HMAC-SHA256
// Usa crypto.subtle do browser (Chromium 103+ no FiveM CEF)

export async function sha256(input: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const enc = new TextEncoder();
    const hash = await window.crypto.subtle.digest("SHA-256", enc.encode(input));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return fallbackHash(input);
}

export async function hmacSHA256(key: string, message: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const enc = new TextEncoder();
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const sig = await window.crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
    return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return fallbackHash(key + message);
}

export function generateSecureSeed(): string {
  const arr = new Uint8Array(32);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < 32; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Gera par serverSeed + hash SHA256 real (seeds relacionadas de verdade)
export async function createSeedPair(): Promise<{ serverSeed: string; serverSeedHash: string }> {
  const serverSeed = generateSecureSeed();
  const serverSeedHash = await sha256(serverSeed);
  return { serverSeed, serverSeedHash };
}

// Hash fallback pra ambientes sem crypto.subtle
function fallbackHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, "0");
}
