/**
 * Medway Hub — SSO Token Validator (Vanilla JS)
 * -----------------------------------------------
 * Use este arquivo em projetos HTML puros que são embedados no Medway Hub.
 *
 * COMO USAR:
 * 1. Copie este arquivo para seu projeto
 * 2. Inclua no HTML antes do seu código:
 *    <script src="/medway-hub-auth.js"></script>
 * 3. Configure HUB_BASE_URL com a URL do seu Medway Hub
 * 4. O script valida o token e popula window.__hubUser com os dados do usuário
 *
 * EXEMPLO:
 *   <script>
 *     window.HUB_BASE_URL = "https://hub.medway.com.br";
 *   </script>
 *   <script src="/medway-hub-auth.js"></script>
 */

(function () {
  "use strict";

  // Configuration — override before including this script:
  //   window.HUB_BASE_URL = "https://your-hub.vercel.app";
  var HUB_BASE_URL = window.HUB_BASE_URL || "https://hub.medway.com.br";

  /**
   * Redirect user back to the Hub login/catalog.
   */
  function redirectToHub() {
    var returnUrl = encodeURIComponent(window.location.href);
    window.location.href = HUB_BASE_URL + "/login?callbackUrl=" + returnUrl;
  }

  /**
   * Read hub_token from the current URL query params.
   */
  function getTokenFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get("hub_token");
  }

  /**
   * Validate the token against the Hub's public verify endpoint.
   * Returns a Promise resolving to the user payload, or rejects on error.
   */
  function validateToken(token) {
    return fetch(HUB_BASE_URL + "/api/sso/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    }).then(function (res) {
      if (!res.ok) {
        return Promise.reject(new Error("Token validation failed: " + res.status));
      }
      return res.json();
    }).then(function (data) {
      if (!data.valid) {
        return Promise.reject(new Error(data.error || "Token inválido"));
      }
      return data.user;
    });
  }

  /**
   * Main auth flow.
   * Call this at the start of your page. Optionally pass a callback
   * that receives the authenticated user object.
   *
   * @param {function} [onSuccess] - Called with user object when authenticated
   * @param {function} [onError]   - Called with error; default redirects to Hub
   */
  window.medwayHubAuth = function (onSuccess, onError) {
    var token = getTokenFromUrl();

    if (!token) {
      if (onError) {
        onError(new Error("Nenhum hub_token encontrado na URL"));
      } else {
        redirectToHub();
      }
      return;
    }

    validateToken(token)
      .then(function (user) {
        // Store globally for other scripts
        window.__hubUser = user;

        // Remove token from URL without page reload
        try {
          var url = new URL(window.location.href);
          url.searchParams.delete("hub_token");
          window.history.replaceState({}, document.title, url.toString());
        } catch (e) {}

        if (onSuccess) {
          onSuccess(user);
        }
      })
      .catch(function (err) {
        if (onError) {
          onError(err);
        } else {
          console.error("[MedwayHub] Auth error:", err.message);
          redirectToHub();
        }
      });
  };

  // Auto-run if data-auto attribute is present:
  // <script src="medway-hub-auth.js" data-auto></script>
  var currentScript = document.currentScript;
  if (currentScript && currentScript.hasAttribute("data-auto")) {
    window.medwayHubAuth();
  }
})();
