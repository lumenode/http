'use strict';

let request = require('request');
let aliases = {
  'delete': 'del'
};

class HttpBackend {

  constructor() {
    this.mocks = {};
  }

  /**
   * Fires any method request to specific url
   *
   * @param  {String}   method - Any method to be sent. E.x. 'GET', 'PUT'
   * @param  {Object}   options
   * @param  {Function} cb - callback
   * @return Result of invoking callback function with mocked data OR it makes
   *         original request if stringified params are missed in mocks.
   */
  send(method, options, cb) {
    let optionsJson = JSON.stringify(options);
    let methodOfRequest;
    let methodLowerCased = method.toLowerCase();

    /**
     * request module has all http send methods available as .methodname. For
     * instance `.put()`, so if it is called with method, which does not exists,
     * the Error should be thrown.
     */
    try {
      methodOfRequest = request[methodLowerCased];
    } catch (e) {
      throw new Error(`The method "${method}" is absent in standard methods list`);
    }

    /**
     * Method could have alias, for example `delete()` has alias `del()`
     */
    methodOfRequest = methodOfRequest || request[aliases[methodLowerCased]];

    if (!methodOfRequest) {
      throw new Error(`The method "${method}" does not exists`);
    }

    if (this.mocks[optionsJson] !== undefined) {
      return cb.apply(null, this.mocks[optionsJson]);
    }

    methodOfRequest.call(request, options, cb);
  }

  /**
   * Mocks request by it options
   *
   * @param  {Object} options
   * @param  {Mixed} data
   * @return {void}
   */
  mock(options, data) {
    let optionsJson = JSON.stringify(options);

    this.mocks[optionsJson] = data;
  }

  /**
   * List all available mocks.
   *
   * @return {Object}
   */
  listMocks() {
    return this.mocks;
  }

  /**
   * Remove all the mocks.
   *
   * @return {void}
   */
  clearMocks() {
    this.mocks = {};
  }

}

module.exports = HttpBackend;
