'use strict';

var crypto = require('crypto'),
    Query = require('querystring'),
    Url = require('url');

var _stringifySorted = function(query) {
    var keys = Object.keys(query).sort();

    var pairs = keys.reduce(function(collect, key) {
        return collect.concat(Query.escape(key) + '=' + Query.escape(query[key]))
    }, []);

    return pairs.join('&');
};

var Sign = {
    signature: function(url, secret, algo) {
        var u = Url.parse(url, true);

        u.search = _stringifySorted(u.query);

        return crypto.createHmac(algo || 'sha1', secret).update(u.format()).digest('base64');
    },

    sign: function(url, secret, algo) {
        var u = Url.parse(url, true),
            query = u.query;

        query.signature = Sign.signature(url, secret, algo);
        u.search = Query.stringify(query);

        return u.format();
    },

    check: function(url, secret, algo) {
        var u = Url.parse(url, true),
            query = u.query,
            signature = query.signature;

        delete(query.signature);
        u.search = Query.stringify(query);

        return signature === Sign.signature(u.format(), secret, algo);
    },

};

module.exports = Sign;
