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
    console.log(jwt.body);
  });
})();
