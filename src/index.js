const jsondiffpatch = require('jsondiffpatch');
const Worker = require('./worker.js');

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

	this.config = {
		limit: 10,
		objectHash: undefined,
		...settings,
	};

	this._worker = new Worker();
	//this._worker.addEventListener('message', e => {
	//	console.log('UndoBuffer message', e);
	//});

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
			this._worker.postMessage({opcode: 'update', data: [newVal, oldVal]});

			//console.log('delta', JSON.stringify(delta, null, 2));
			this.reverse.unshift(delta);
			this.reverse.length = this.config.limit;
			this.forward = []; // Invalidate forward redo when new state comes in
			console.log('queues', this.reverse.filter(d => d).length, this.forward.filter(d => d).length);
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

		console.log('UndoBuffer.undo', doc, this.reverse.filter(d => d).length);

		const delta = this.reverse.shift();
		this.forward.unshift(delta);
		console.log('delta', JSON.stringify(delta, null, 2));
		console.log('queues', this.reverse.length, this.forward.length);

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

		console.log('UndoBuffer.redo', doc, this.forward.filter(d => d).length);

		const delta = this.forward.shift();
		this.reverse.unshift(delta);
		console.log('delta', JSON.stringify(delta, null, 2));
		console.log('queues', this.reverse.length, this.forward.length);

		// FIXME: Validate delta?

		return this._jsondiffpatch.unpatch(doc, delta);
	};
};

module.exports = UndoBuffer;
