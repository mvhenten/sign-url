'use strict';

var assert = require('assert'),
    util = require('util'),
    _ = require('lodash'),
    Url = require('url'),
    Query = require('querystring'),
    Sign = require('../lib/url'),
    Faker = require('Faker');


function _randomURL() {
    var query = Faker.Lorem.words(3).reduce(function(query, word) {
        query[word] = Faker.random.number(99999);
        return query;
    }, {});

    return util.format('http://%s?%s', Faker.Internet.domainName(), Query.stringify(query));
}

suite('Sign and verify signatures', function() {
    test('Sign should sign an url, and check should validate ok for that url', function() {
        _.times(999, function() {
            var url = _randomURL(),
                secret = Faker.random.number(Date.now()).toString(36),
                signed = Sign.url(url, secret);

            assert.ok(Sign.check(signed, secret));
        });
    });

    test('Optional parameters may be passed in as third argument', function() {
        var url = _randomURL(),
            secret = Faker.random.number(Date.now()).toString(36);

        var signed = Sign.url(url, secret, {
            algo: 'sha512',
            digest: 'hex'
        }),
            check = Url.parse(signed, true);

        assert.equal(check.query.signature.length, 128, 'sha1 hex digest is 128 characters');
    });

    test('Query cannot be tampered with', function() {
        _.times(999, function() {
            var url = _randomURL(),
                secret = Faker.random.number(Date.now()).toString(36),
                signed = Sign.url(url, secret),
                hacked = Url.parse(signed, true),
                query = hacked.query;

            query[_.sample(_.keys(hacked.query))] = _.random(999);
            hacked.search = Query.stringify(query);

            assert.equal(Sign.check(hacked.format(), secret), false);
        });
    });


    test('The order of the query string keys is not relevant', function() {
        _.times(999, function() {
            var url = _randomURL(),
                secret = Faker.random.number(Date.now()).toString(36),
                signed = Sign.url(url, secret),
                shuffled = Url.parse(signed, true),
                query = shuffled.query;

            query = _.reduce(_.shuffle(_.keys(query)), function(q, key) {
                q[key] = query[key];
                return q;
            }, {});

            shuffled.search = Query.stringify(query);

            assert.equal(Sign.check(shuffled.format(), secret), true);
        });
    });

});
