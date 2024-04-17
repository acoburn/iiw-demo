import { JOSE, DPoP } from './authentication.js';

function list(token) {
    return fetch("https://provision.inrupt.com/list", {
      headers: {
        "Authorization": "Bearer " + token
      }})
      .then(res => res.json());
}

(() => {

  const rand = new Uint32Array(1);
  crypto.getRandomValues(rand);
  console.log(DPoP.stringToBase64(rand));

  navigator.credentials.get({
      identity: {
        context: "signin",
        providers: [
          {
            configURL: "https://fedcm.dev.inrupt.com/fedcm.json",
            clientId: "https://acoburn.github.io/iiw-demo/client.json",
            nonce: DPoP.stringToBase64(rand)
          }
        ]
      },
      mediation: "optional"
  }).then(credential => {
    const token = credential.token;
    const jwt = JOSE.parse(token);
    document.getElementById("webid").innerHTML = `WebID: <code>${jwt.body.webid}</code>`;
    document.getElementById("provision").disabled = false;

    list(token)
      .then(storages => {
        if (storages.length > 0) {
          document.getElementById("storages").innerHTML =
            `<p>Solid Pods</p><ul>${storages.map(path => "<li>https://storage.inrupt.com" + path + "</li>").join()}</ul>`;
        }
      });
    document.getElementById("provision").addEventListener("click", () => {
      fetch("https://provision.inrupt.com/", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        }})
      .then(res => list(token))
      .then(storages => {
        document.getElementById("storages").innerHTML =
          `<p>Solid Pods</p><ul>${storages.map(path => "<li>https://storage.inrupt.com" + path + "</li>").join()}</ul>`;
      });
    });
  });
})();
