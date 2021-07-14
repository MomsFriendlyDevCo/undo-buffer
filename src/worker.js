const jsondiffpatch = require('jsondiffpatch');

const forward = [];
const reverse = [];
const updates = [];
let timer;

const config = {
	interval: 500,
	// FIXME: Possible to pass these in when setting up worker?
	limit: 10,
	objectHash: function (d, i) {
		// Allow matching for arrays of objects by object key rather than array index.
		if (d && Object.prototype.hasOwnProperty.call(d, '_id')) {
			return d._id;
		} else if (d && Object.prototype.hasOwnProperty.call(d, 'id')) {
			return d.id;
		} else {
			return '$$index:' + i;
		}
	},
};

const processor = jsondiffpatch.create({
	objectHash: config.objectHash,
});

// Private methods {{{
const undo = doc => {
	if (!doc) return;
	if (!reverse.filter(d => d).length) return doc;

	// Finish processing pending queue before applying changes
	if (updates.length > 0) {
		clearTimeout(timer);
		while (updates.length > 0) doWork(false);
		timer = setTimeout(doWork, config.interval);
	}

	const delta = reverse.shift();
	forward.unshift(delta);
	console.log('delta', JSON.stringify(delta, null, 2));
	console.log('queues', updates.length, reverse.length, forward.length);

	// FIXME: Validate delta?

	return processor.patch(doc, delta);
};

const redo = doc => {
	if (!doc) return;
	if (!forward.filter(d => d).length) return doc;

	console.log('UndoBuffer.redo', doc, forward.filter(d => d).length);

	const delta = forward.shift();
	reverse.unshift(delta);
	console.log('delta', JSON.stringify(delta, null, 2));
	console.log('queues', updates.length, reverse.length, forward.length);

	// FIXME: Validate delta?

	return processor.unpatch(doc, delta);
};
// }}}

// Background thread {{{
const doWork = (background = true) => {
	if (!updates || !updates.length > 0)
		return background??timer = setTimeout(doWork, config.interval);

	const change = updates.shift();
	console.log('change', change);
	const delta = processor.diff(...change);
	if (delta) {
		console.log('delta', JSON.stringify(delta, null, 2));
		reverse.unshift(delta);
		reverse.length = config.limit;
		forward.length = 0; // Invalidate forward redo when new state comes in
		console.log('queues', updates.length, reverse.filter(d => d).length, forward.filter(d => d).length);
	}

	background??timer = setTimeout(doWork, config.interval);
};
timer = setTimeout(doWork, config.interval);
// }}}

/*
addEventListener('install', e => {
	console.log('ServiceWorker.install', e);
});

addEventListener('activate', e => {
	console.log('ServiceWorker.activate', e);
});
*/

addEventListener('message', e => {
	console.log('ServiceWorker.message', e);
	switch (e.data.opcode) {
		case 'update':
			updates.push(e.data.data);
			break;
		case 'undo':
			postMessage({ opcode: 'undone', data: undo(e.data.data) });
			break;
		case 'redo':
			postMessage({ opcode: 'redone', data: redo(e.data.data) });
			break;
	}
	console.log('queues', updates.length, reverse.filter(d => d).length, forward.filter(d => d).length);
});
