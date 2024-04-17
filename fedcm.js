import { JOSE } from './authentication.js';


(() => {
  navigator.credentials.get({
      identity: {
        context: "signin",
        providers: [
          {
            configURL: "https://fedcm.dev.inrupt.com/fedcm.json",
            clientId: "https://acoburn.github.io/iiw-demo/client.json",
            nonce: "not-a-nonce"
          }
        ]
      }
  }).then(credential => {
    const token = credential.token;
    const jwt = JOSE.parse(token);
    document.getElementById("webid").innerHTML = `WebID: <code>${jwt.body.webid}</code>`;
    document.getElementById("provision").disabled = false;
    fetch("https://provision.inrupt.com/list", {
      headers: {
        "Authorization": "Bearer " + token
      }})
      .then(res => {
        console.log(res.json());
      });
  });
})();
