'use strict';

require('should');
var Http = require('../Http');

describe('<Unit Test>', function () {
  describe('Http Spec', function () {

    var http;

    beforeEach(function () {
      http = new Http;
    });

    it('creates fake responses', function () {
      var options = {
        method: 'GET',
        url: '/some-url/adsf/asdfasd',
        headers: {
          'Content-Type': 'text/plain'
        }
      };

      http.mock(options, [
        null, {
          data: 'fake'
        },
        'some string or whatever u want'
      ]);

      http.sendGet(options, function (err, res, otherData) {
        res.should.have.property('data');
        res.data.should.be.eql('fake');
        otherData.should.be.eql('some string or whatever u want');
      });
    });

    it('can send real HTTP requests', function (done) {
      var options = {
        method: 'GET',
        url: 'http://google.com/',
        headers: {
          'Content-Type': 'text/plain'
        }
      };

      http.sendGet(options, function (err, res) {
        res.statusCode.should.be.equal(200);
        done();
      });
    });

    it('can clear own mock-cache', function () {
      var options = {
        method: 'GET',
        url: 'http://google.com/',
        headers: {
          'Content-Type': 'text/plain'
        }
      };

      http.mock(options, [
        null, {
          data: 'fake'
        },
        'some string or whatever u want'
      ]);

      /*eslint-disable */
      http.listMocks().should.not.be.empty;
      http.clearMocks();
      http.listMocks().should.be.empty;
      /*eslint-enable */
    });

  });
});
