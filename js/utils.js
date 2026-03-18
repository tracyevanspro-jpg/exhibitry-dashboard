export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeAttribute(value = '') {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function normalizeUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
  } catch (_error) {
    return null;
  }

  return null;
}

export function formatRichText(value = '') {
  const escaped = escapeHtml(value);
  const withLinks = escaped.replace(/https?:\/\/[^\s<]+/g, (rawUrl) => {
    const safeUrl = normalizeUrl(rawUrl);
    if (!safeUrl) return rawUrl;

    return `<a href="${escapeAttribute(safeUrl)}" target="_blank" rel="noopener noreferrer" class="inline-link">${escapeHtml(rawUrl)}</a>`;
  });

  return withLinks
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\n)-\s(.*?)(?=\n|$)/g, '$1&bull; $2')
    .replace(/\n/g, '<br>');
}

export function buildMailtoHref(email, subject) {
  const safeEmail = String(email || '').trim();
  if (!safeEmail) return '';

  return `mailto:${encodeURIComponent(safeEmail)}?subject=${encodeURIComponent(subject || '')}`;
}
