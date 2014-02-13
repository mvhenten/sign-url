'use strict';

var assert = require('assert'),
    util = require('util'),
    _ = require('lodash'),
    Query = require('querystring'),
    Sign = require('../lib/url'),
    Faker = require('Faker');


function _randomURL() {
    var query = Faker.Lorem.words(9).reduce(function(query, word) {
        query[word] = Faker.random.number(99999);
        return query;
    }, {});

    return util.format('http://%s?%s', Faker.Internet.domainName(), Query.stringify(query));
}

// test to prove url can be signed
// and check is ok
// test to prove url cannot be tampered with
// and is not valid
// test to prove the order of url params can be mangled


suite('Sign and verify signatures', function() {
    test('Sign should sign an url, and check should validate ok for that url', function() {
        _.times(999, function() {
            var url = _randomURL(),
                secret = Faker.random.number(Date.now()).toString(36),
                signed = Sign.sign(url, secret);
            assert.ok(Sign.check(signed, secret));
        });
    });
});
