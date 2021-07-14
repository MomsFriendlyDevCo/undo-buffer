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
	this.enabled = true;

	this.config = {
		// TODO: Pass these through to the worker.
		//limit: 10,
		//objectHash: undefined,
		...settings,
	};

	this._worker = new Worker();

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

		this._worker.postMessage({opcode: 'update', data: [newVal, oldVal]});
	};

	/**
	 * Execute an undo action
	 *
	 * @type {method}
	 * @param {Object} doc The current state to patch
	 */
	this.undo = doc => {
		if (!doc) return Promise.resolve();

		// TODO: Reject on messaging timeout or error
		return new Promise((resolve, reject) => {
			const workerResponse = e => {
				if (e.data.opcode !== 'undone') return resolve();

				this._worker.removeEventListener('message', workerResponse);
				resolve(e.data.data);
			};
			this._worker.addEventListener('message', workerResponse);
			this._worker.postMessage({opcode: 'undo', data: doc});
		});
	};

	/**
	 * Execute a redo action
	 *
	 * @type {method}
	 * @param {Object} doc The current state to patch
	 */
	this.redo = doc => {
		if (!doc) return Promise.resolve();

		// TODO: Reject on messaging timeout or error
		return new Promise((resolve, reject) => {
			const workerResponse = e => {
				if (e.data.opcode !== 'redone') return resolve();
				
				this._worker.removeEventListener('message', workerResponse);
				resolve(e.data.data);
			};
			this._worker.addEventListener('message', workerResponse);
			this._worker.postMessage({opcode: 'redo', data: doc});
		});
	};
};

module.exports = UndoBuffer;
