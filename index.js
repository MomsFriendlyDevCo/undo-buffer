const debug = require('debug')('undo-buffer:main');
const _ = require('lodash');
const jsondiffpatch = require('jsondiffpatch');

const UndoBuffer = function (settings) {
    this.forward = [];
    this.reverse = [];
    this.enabled = true;

    this.config = _.defaults(settings, {
        limit: 10,
    });

    //var diffpatcher = jsondiffpatch.create(); Need a configured instance?

    // TODO: add method instead which returns a Proxy?
    this.update = (newVal, oldVal) => {
        debug('UndoBuffer.update', newVal, oldVal);
        if (!this.enabled) return;
        if (!oldVal) return;

        // FIXME: Dates being treated as strings? Convert before comparison?
        var delta = jsondiffpatch.diff(newVal, oldVal);
        if (delta) {
            debug('delta', newVal, oldVal, delta);
            this.reverse.unshift(delta);
            this.reverse.length = this.config.limit;
            //this.forward = []; // TODO: Invalidate forward redo when new state comes in?
            //debug('reverse', JSON.stringify(this.reverse, null, 2));
            //debug('forward', JSON.stringify(this.forward, null, 2));
            debug('queues', this.reverse.length, this.forward.length);

            //var state = this.undo(newVal);
            //console.assert(state === oldVal, state, oldVal, 'Undo should equal old value');
            //state = this.redo(state);
            //console.assert(state === newVal, state, newVal, 'Redo should equal new value');
        }
    };


    this.undo = doc => {
        if (!doc) return;
        if (!this.reverse.filter(d => d).length) return doc;

        debug('UndoBuffer.undo', doc);

        var delta = this.reverse.shift();
        this.forward.unshift(delta);
        // TODO: Limit forward undos or allow all the way to first undone state
        debug('delta', delta);
        debug('queues', this.reverse.length, this.forward.length);

        return jsondiffpatch.unpatch(doc, delta);

        //if (!this.deltas || this.cursor === -1) return doc;
        //console.log('UndoBuffer.undo', doc, this.cursor, this.deltas[this.cursor]);
        //return jsondiffpatch.unpatch(doc, this.deltas[this.cursor--]);
    };


    this.redo = doc => {
        if (!doc) return;
        if (!this.forward.filter(d => d).length) return doc;

        debug('UndoBuffer.redo', doc);

        var delta = this.forward.shift();
        this.reverse.unshift(delta);

        debug('delta', delta);
        debug('queues', this.reverse.length, this.forward.length);

        return jsondiffpatch.patch(doc, delta);

        //if (this.deltas.length === 0 || this.cursor >= this.deltas.length) return doc;
        //console.log('UndoBuffer.redo', doc, this.cursor + 1, this.deltas[this.cursor + 1]);
        //return jsondiffpatch.patch(doc, this.deltas[++this.cursor]);
    };


    this.history = () => {
        debug('UndoBuffer.history');
    };
};

module.exports = UndoBuffer;