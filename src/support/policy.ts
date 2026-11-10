/** Pure support gating helpers, used by both the browser and API. */
export const BLOCKED_SUPPORT_ROUTES=/^\/(?:tests|exams|attempts)(?:\/|$)/;
export function supportAllowedRoute(pathname:string):boolean {
 return pathname.startsWith('/')&&!pathname.startsWith('//')&&!BLOCKED_SUPPORT_ROUTES.test(pathname);
}
export function tawkEmbedUrl(propertyId:string,widgetId:string):string|null {
 if(!/^[a-z0-9_-]{3,64}$/i.test(propertyId)||!/^[a-z0-9_-]{3,64}$/i.test(widgetId))return null;
 return `https://embed.tawk.to/${propertyId}/${widgetId}`;
}
