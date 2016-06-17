'use strict';

var _ = require('lodash'),
    async = require('async');

module.exports = function(schema) {
    schema.statics.pagination = function pagination(tableState) {

        var model = this;

        function Pagination(tableState) {
            //var conditions = {}; // Build up conditions object to pass to find see metadata for 'where' conditions
            tableState = tableState || {};
            this.model = model;
            this.limit = tableState.limit || 10;
            this.skip = tableState.page ? (tableState.page - 1) * this.limit : 0;
            this.sort = tableState.order || '';

            this.query = model.find({});
            this.query.limit(this.limit);
            this.query.skip(this.skip);
            this.query.sort(this.sort);
        }

        Pagination.prototype.exec = function(callback) {
            var _this = this;
            async.parallel({
                results: function(callback) {
                    _this.query.exec(function(err, results) {
                        if (err) return callback(err);
                        callback(null, results);
                    })
                },
                count: function(callback) {
                    _this.model.count(function(err, results) {
                        if (err) return callback(err);
                        callback(null, results);
                    })
                }
            }, function(err, data) {
                if (err) return callback(err);
                callback(null, {
                    metadata: {
                        totalCount: data.count
                    },
                    records: data.results
                })
            })
        };

        return new Pagination(tableState)
    }
};