const cache = {};

export async function resolveIcon(name) {
  if (!name) return null;
  if (cache[name]) return cache[name];

  try {
    const allIcons = await import('@tabler/icons-react');
    cache[name] = allIcons[name] || null;
    return cache[name];
  } catch {
    cache[name] = null;
    return null;
  }
}
