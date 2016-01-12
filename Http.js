'use strict';

var _ = require('lodash');
var request = require('request');

function Http() {
  var mockings = {};

  /**
   * Fires GET request to specific url
   *
   * @param  {Object}   options
   * @param  {Function} cb
   * @return {void}
   */
  this.sendGet = function (options, cb) {
    var key = this.generateKey(options);

    if (mockings[key] !== undefined) {
      return cb.apply(null, mockings[key]);
    }

    request.get(options, cb);
  };

  /**
   * Fires POST request to specific url
   *
   * @param  {Object}   options
   * @param  {Function} cb
   * @return {void}
   */
  this.sendPost = function (options, cb) {
    var key = this.generateKey(options);

    if (mockings[key] !== undefined) {
      return cb.apply(null, mockings[key]);
    }
    
    request.post(options, cb);
  };

  /**
   * Mocks request by it options
   *
   * @param  {Object} options
   * @param  {Mixed} data
   * @return {void}
   */
  this.mock = function (options, data) {
    var key = this.generateKey(options);

    mockings[key] = data;
  };

  this.generateKey = function(options) {
    return _.trim(JSON.stringify(options).replace(/[\s\r\n]/g, ''));
  };

  /**
   * Clear mockings cacha
   *
   * @return {void}
   */
  this.clearMocks = function () {
    mockings = {};
  };

  /**
   * Show list of avaliable mocks
   *
   * @return {Object}
   */
  this.listMocks = function () {
    return mockings;
  };
}

module.exports = Http;
