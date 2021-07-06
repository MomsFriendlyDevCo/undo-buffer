const debug = require('debug')('undo-buffer:main');
const _ = require('lodash');
const jsondiffpatch = require('jsondiffpatch');

/**
 * UndoBuffer
 *
 * @type {class}
 * @param {Object} [settings] Configuration options
 * @param {Number} [settings.limit] Length of undo window
 * @param {Function} [settings.objectHash] Callback to map arrays of objects by internal keys rather than array index position
 */
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

	/**
	 * Record a variable modification
	 *
	 * @type {method}
	 * @param {Object} newVal Changed value as reported by watchers
	 * @param {Object} [oldVal] Previous value before change
	 */
	this.update = (newVal, oldVal) => {
		if (!this.enabled) return;
		if (!oldVal) return;

		console.log('UndoBuffer.update', newVal, oldVal);

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

	/**
	 * Execute an undo action
	 *
	 * @type {method}
	 * @param {Object} doc The current state to patch
	 */
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

	/**
	 * Execute a redo action
	 *
	 * @type {method}
	 * @param {Object} doc The current state to patch
	 */
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