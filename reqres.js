/**
 * Class representing a request to the HTTP endpoint
 * Similar to Request in Express or SparkJava
 * no methods, just public members
 */

class SimRequest {
  constructor() {
    this._method = "GET";
    /**
     * The Query part of the URL use .get('paramater')
     */
    this.query = {};
    /**
     * The URL path broken into an array of strings
     */
    this.params = [];
     /**
     * The URL as a String
     */
    this.path = "";
    this.protocol = "https";
    /**
     * The Body of a POST request as a string - parse to Objects as needed
     */
    this.body = undefined;
    function octet() {
      return `${Math.floor(Math.random() * 180) + 11}`;
    }
    /**
     * A Fake IP address
     */
    this.sourceIp = octet() + "." + octet() + "." + octet() + "." + octet();
  }

  setPath(url) {
    const URLObj = new URL(url);
    this.protocol = URLObj.protocol;
    this.query = URLObj.searchParams;
    this.path = URLObj.pathname;
    this.params = this.path.split("/");
    return this;
  }

  setBody(body) {
    this.body = body;
    return this;
  }
}
/**
 * Class representing a request to the HTTP endpoint
 * Similar to Response in Express or SparkJava
 * no methods, just public members
 */


class SimResponse {
  constructor() {
    this._status = 200;
    this._data = null;
    this._headers = { "Content-Type": "application/json" };
  }

  /**
   * Set the HTTP Status 200,201,400 etc.
   * @param {number} val HTTP Status code
   * @returns this SimResponse object to allow chaining
   */
  status(val) {
    this._status = val;
    return this;
  }

  end(val) {
    this.send(val);
  }

  json(val) {
    return this.send(JSON.stringify(val));
  }

  text(val) {
    return this.send(vak);
  }

  sendStatus(data) {
    return this.send(data);
  }

  /**
   * The data to return to the caller as a String or Object
   * @param {String|Object} data 
   * @returns this Response object for chaining
   */
  send(data) {
    if (data instanceof Promise) {
      this._status = 500;
      this._data =
        "Server Error - you are passing an unresolved Promise to send(), did you forget await?";
      return this;
    }
    this._data = data;
    return this;
  }

  set(field, value) {
    return this.header(field, value);
  }

  header(field, value) {
    this._headers[field] = value;
    return this;
  }
}
