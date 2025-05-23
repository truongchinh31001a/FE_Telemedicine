export function getTokenFromCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : null;
}

export async function fetchLiveKitToken(room, username) {
  const res = await fetch(`/api/token?room=${room}&username=${username}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to fetch LiveKit token');
  }
  const data = await res.json();
  return data.token;
}