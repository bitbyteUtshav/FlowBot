/** Facebook OAuth redirect helper. Configure both values in frontend/.env. */
export function startFacebookLogin() {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
  const redirectUri = import.meta.env.VITE_FACEBOOK_REDIRECT_URI;
  if (!appId || !redirectUri) {
    window.alert('Facebook login is not configured yet. Add VITE_FACEBOOK_APP_ID and VITE_FACEBOOK_REDIRECT_URI to frontend/.env.');
    return;
  }
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: 'pages_show_list,pages_messaging,pages_manage_metadata,pages_read_engagement',
  });
  window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
}
