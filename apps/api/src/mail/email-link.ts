// Builds a link for an email. The token is in the fragment: browsers never send
// it to any server, so it stays out of access logs and Referer headers. The web
// page reads it and posts it to the API.
export function emailLink(
  webBaseUrl: string,
  page: string,
  token: string,
): string {
  return `${webBaseUrl.replace(/\/+$/, '')}/${page}#token=${token}`;
}
