'use strict';

require('should');
let HttpBackend = require('../Http');

describe('Http Backend Spec', () => {
  let http = new HttpBackend;
  let serverRequestsChecker = (done, err, res) => {
    if (err) {
      err.code.should.be.equal('ECONNREFUSED');
      done();
    } else {
      res.statusCode.should.be.equal(200);
      done();
    }
  };

  it('can store and return mocks by the same set of params', () => {
    let options = {
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

    http.send('GET', options, (err, res, otherData) => {
      res.should.have.property('data');
      res.data.should.be.eql('fake');
      otherData.should.be.eql('some string or whatever u want');
    });
  });

  it('can send requests if no mock is presented', done => {
    http.send('put', 'http://localhost:3000/',
      serverRequestsChecker.bind(null, done));
  });

  it('can send requests if no mock is presented 31312 port', done => {
    http.send('get', 'http://localhost:31312/',
      serverRequestsChecker.bind(null, done));
  });

  it('the sending method is not case sensitive Put', done => {
    http.send('Put', 'http://localhost:3000/',
      serverRequestsChecker.bind(null, done));
  });

  it('the sending method is not case sensitive DELETE', done => {
    http.send('DELETE', 'http://localhost:3000/',
      serverRequestsChecker.bind(null, done));
  });

  it('the sending method is not case sensitive patch', done => {
    http.send('patch', 'http://localhost:3000/',
      serverRequestsChecker.bind(null, done));
  });

  it('the sending method throws an error if no such sending method', () => {
    (() => {
      http.send.call(http, 'freaky method', 'http://localhost:6000/', () => {})
    }).should.throw('The method "freaky method" does not exists');
  });

  it('can clear own mock-cache', () => {
    let options = {
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
