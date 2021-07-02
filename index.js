const debug = require('debug')('undo-buffer:main');
const _ = require('lodash');
const jsondiffpatch = require('jsondiffpatch');

const UndoBuffer = function (settings) {
	this.forward = [];
	this.reverse = [];
	this.enabled = true;

	this.config = _.defaults(settings, {
		limit: 10,
		objectHash: undefined,
	});

	this._jsondiffpatch = jsondiffpatch.create({
		objectHash: this.config.objectHash,
	});

	this.update = (newVal, oldVal) => {
		if (!this.enabled) return;
		if (!oldVal) return;

		debug('UndoBuffer.update', newVal, oldVal);

		// FIXME: jsondiffpatch dateReviver needed for handling any date fields?
		const delta = this._jsondiffpatch.diff(newVal, oldVal);
		if (delta) {
			debug('delta', JSON.stringify(delta, null, 2));
			this.reverse.unshift(delta);
			this.reverse.length = this.config.limit;
			//this.forward = []; // TODO: Invalidate forward redo when new state comes in?
			debug('queues', this.reverse.length, this.forward.length);
		}
	};


	this.undo = doc => {
		if (!doc) return;
		if (!this.reverse.filter(d => d).length) return doc;

		debug('UndoBuffer.undo', doc, this.reverse.filter(d => d).length);

		const delta = this.reverse.shift();
		this.forward.unshift(delta);
		debug('delta', JSON.stringify(delta, null, 2));
		debug('queues', this.reverse.length, this.forward.length);

		// FIXME: Validate delta?

		return this._jsondiffpatch.patch(doc, delta);
	};


	this.redo = doc => {
		if (!doc) return;
		if (!this.forward.filter(d => d).length) return doc;

		debug('UndoBuffer.redo', doc, this.forward.filter(d => d).length);

		const delta = this.forward.shift();
		this.reverse.unshift(delta);
		debug('delta', JSON.stringify(delta, null, 2));
		debug('queues', this.reverse.length, this.forward.length);

		// FIXME: Validate delta?

		return this._jsondiffpatch.unpatch(doc, delta);
	};
};

module.exports = UndoBuffer;