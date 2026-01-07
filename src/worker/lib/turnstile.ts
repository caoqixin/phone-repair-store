export async function verifyTurnstile(
  token: string,
  secretKey: string,
  ip?: string
) {
  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });

  const outcome = (await result.json()) as any;
  return outcome.success;
}
