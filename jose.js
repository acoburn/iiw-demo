/** A class for simple operations with JOSE objects. */
export class JOSE {
  constructor(header, body) {
    this._header = header;
    this._body = body;
  }
  get header() {
    return this._header;
  }

  get body() {
    return this._body;
  }

  serialize() {
    return JOSE.objectToBase64(this.header) + '.' + JOSE.objectToBase64(this.body);
  }

  static objectToBase64(value) {
    return btoa(JSON.stringify(value)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  static parse(token) {
    const [header, body, ...rest] = token.split(/\./);
    return new JOSE(JSON.parse(JOSE.decode(header)), JSON.parse(JOSE.decode(body)));
  }

  static decode(value) {
    return atob(value.replace(/-/g, '+').replace(/_/g, '/'));
  }

  static algorithm(jwk) {
    if (jwk.kty === 'EC') {
      return {
        name: 'ECDSA',
        namedCurve: jwk.crv };
    }
    throw new Error(`Not a supported algorithm type: [${jwk.kty}]`);
  }

  static params(alg) {
    if (alg === 'ES256') {
      return {
        name: 'ECDSA',
        hash: 'SHA-256'
      };
    }
    throw new Error(`Not a supported algorithm type: [${alg}]`);
  }
}
