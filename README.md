Undo-Buffer
==================



```javascript
const undoBuffer = new UndoBuffer({
    objectHash: function(d, i) {
        // Allow matching for arrays of objects by object key rather than array index.
        if (d && Object.prototype.hasOwnProperty.call(d, '_id')) {
            return d._id;
        } else if (d && Object.prototype.hasOwnProperty.call(d, 'id')) {
            return d.id;
        } else {
            return '$$index:' + i;
        }
    },
});

const observe = { a: 'foo', b: 'bar' };
undoBuffer.add(observe);
observe.a = 'bar';
delete observe.b;
undoBuffer.undo(observe);
undoBuffer.undo(observe);
undoBuffer.redo(observe);
```


API
===
