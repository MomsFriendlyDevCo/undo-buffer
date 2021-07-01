const expect = require('chai').expect;
const UndoBuffer = require('../');

const generateUpdate = () => {
	const before = { a: 1, b: 2, c: 3 };
	const after = {};
	Object.assign(after, before);
	delete after.c;
	after.a = 4;
	return {
		before: before,
		after: after,
	};
};

describe('undo-buffer', function () {
	let sut;
	beforeEach(done => {
		sut = new UndoBuffer();
		done();
	});

	it('should generate patch and store in reverse buffer', () => {
		const { before, after } = generateUpdate();
		sut.update(after, before);
		expect(sut.reverse).to.be.an('array');
		expect(sut.reverse[0]).to.have.property('a');
		expect(sut.reverse[0]).to.have.property('c');
		// TODO: Test contents?
	});

	it('should remove from reverse buffer on undo', () => {
		const delta = {
			a: [
				4,
				1,
			],
			c: [
				3,
			]
		};
		const { before, after } = generateUpdate();
		expect(sut.reverse).to.not.deep.include(delta);
		sut.update(after, before);
		expect(sut.reverse).to.deep.include(delta);
		const undone = sut.undo(after);
		expect(undone).to.have.property('a', before.a);
		expect(undone).to.have.property('b', before.b);
		expect(undone).to.have.property('c', before.c);
		expect(sut.reverse).to.not.deep.include(delta);
	});

	it('should remove from forward buffer on redo', () => {
		const delta = {
			a: [
				4,
				1,
			],
			c: [
				3,
			]
		};
		const { before, after } = generateUpdate();
		expect(sut.forward).to.not.deep.include(delta);
		sut.update(after, before);
		expect(sut.forward).to.not.deep.include(delta);
		const undone = sut.undo(after);
		const redone = sut.redo(undone);
		expect(redone).to.have.property('a', after.a);
		expect(redone).to.have.property('b', after.b);
		expect(redone).to.not.have.property('c');
		expect(sut.reverse).to.deep.include(delta);
		expect(sut.forward).to.not.deep.include(delta);
	});

	xit('should add to forward buffer on undo', () => {

	});

	xit('should add to reverse buffer on redo', () => {

	});

	it('should have no further undo at start', () => {
		sut.config.limit = 10;

		for (let i = 0; i < 20; i++) {
			sut.update({ a: i }, { a: i - 1 });
		}

		for (let i = 19; i > 9; i--) {
			const doc = sut.undo({ a: i });
			//console.log('In/Out', { a: i }, '/', doc);
			expect(doc).to.have.property('a', i - 1);
		}

		for (let i = 9; i > 0; i--) {
			const doc = sut.undo({ a: i });
			//console.log('In/Out', { a: i }, '/', doc);
			expect(doc).to.have.property('a', i);
		}
	});

	it('should have no further redo at end', () => {
		for (let i = 0; i < 20; i++) {
			sut.update({ a: i }, { a: i - 1 });
		}
		for (let i = 19; i > 9; i--) {
			const doc = sut.undo({ a: i });
			//console.log('In/Out', { a: i }, '/', doc);
		}

		for (let i = 9; i < 19; i++) {
			const doc = sut.redo({ a: i });
			//console.log('In/Out', { a: i }, '/', doc);
			expect(doc).to.have.property('a', i + 1);
		}

		for (let i = 19; i < 25; i++) {
			const doc = sut.redo({ a: i });
			//console.log('In/Out', { a: i }, '/', doc);
			expect(doc).to.have.property('a', i);
		}
	});

	xit('should clear forward buffer when adding new states', () => {
	});
});
