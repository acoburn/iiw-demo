export class Utils {
  static nonce() {
    const rand = new Uint32Array(1);
    crypto.getRandomValues(rand);
    return DPoP.stringToBase64(rand);
  }

  static async list(token) {
    return fetch("https://provision.inrupt.com/list", {
      headers: {
        "Authorization": "Bearer " + token
      }})
      .then(res => res.json());
  }

  static format(id, storages) {
    if (storages.length > 0) {
      document.getElementById(id).innerHTML =
          `<p>Solid Pods</p><ul>${storages.map(path => "<li>https://storage.inrupt.com" + path + "</li>").join()}</ul>`;
    }
  }
}
