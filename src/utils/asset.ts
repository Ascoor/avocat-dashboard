import API_CONFIG from '@/config/config';

export function resolveAssetUrl(path?: string | null): string | undefined {
  if (!path) {
    return undefined;
  }

  if (/^(?:https?:)?\/\//.test(path) || path.startsWith('data:')) {
    return path;
  }

  const sanitized = path
    .replace(/^storage\/brand\//, 'branding/')
    .replace(/^storage\/landing\//, 'branding/landing/')
    .replace(/^branding\/landing\/hero\//, 'branding/landing/');

  const baseUrl = API_CONFIG.baseURL.replace(/\/$/, '');
  const normalized = sanitized.startsWith('/') ? sanitized : `/${sanitized}`;

  return `${baseUrl}${normalized}`;
}
