import { JOSE, DPoP } from './authentication.js';
import { Utils } from './utils.js';


(() => {

  navigator.credentials.get({
      identity: {
        context: "signin",
        providers: [
          {
            configURL: "https://fedcm.dev.inrupt.com/fedcm.json",
            clientId: "https://acoburn.github.io/iiw-demo/client.json",
            nonce: Utils.nonce()
          }
        ]
      },
      mediation: "optional"
  }).then(credential => {
    const token = credential.token;
    const jwt = JOSE.parse(token);
    document.getElementById("webid").innerHTML = `WebID: <code>${jwt.body.webid}</code>`;
    document.getElementById("provision").disabled = false;

    Utils
      .list(token)
      .then(storages => Utils.format("storages", storages));

    document.getElementById("provision").addEventListener("click", () => {
      fetch("https://provision.inrupt.com/", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        }})
      .then(res => Utils.list(token))
      .then(storages => Utils.format("storages", storages));
    });
  });
})();
