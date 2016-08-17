'use strict';

var _ = require('lodash'),
    async = require('async');

module.exports = function(schema) {
    /**{
     * I added a version of this to Stack Exchange Code Review
     * @link http://codereview.stackexchange.com/questions/109408/a-plugin-that-integrates-angular-smart-tables-with-mongoose-db-for-server-side-p
     * exports.getEventFeed = function(req, res, next) {
     * var tableState = req.query.tableState;
     *
     *     EventFeed
     *         .stPagination(tableState)
     *         .select('id eventDate eventName processed')
     *         .where('eventDate', {$gte: new Date()})
     *         .exec(function (err, results) {
     *             if (err) return next(err);
     *             res.json(results);
     *         });
     *     };
     */

    schema.statics.pagination = function pagination(tableState) {

        var model = this;

        function Pagination(tableState) {
            //var conditions = {}; // Build up conditions object to pass to find see metadata for 'where' conditions
            tableState = tableState || {};
            this.model = model;
            this.limit = parseInt(tableState.limit) || 10;
            this.skip = tableState.page ? (tableState.page - 1) * this.limit : 0;
            this.sort = tableState.order || '';

            this.query = model.find({});
            this.query.limit(this.limit);
            this.query.skip(this.skip);
            this.query.sort(this.sort);

            this.countQuery = model.count({});
            return this;
        }

        // .select('id eventDate eventName processed')
        Pagination.prototype.select = function(fields) {
            this.query.select(fields);
            return this;
        };

        Pagination.prototype.where = function(path, condition) {
            this.query.where(path, condition);
            this.countQuery.where(path, condition);
            return this;
        };

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
                    _this.countQuery.count(function(err, results) {
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