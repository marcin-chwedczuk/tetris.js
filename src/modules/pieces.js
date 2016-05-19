'use strict';

var COLORS = require('modules/colors.js');
var Block = require('modules/block.js');

// initially piece is located in box that 
// have left upper corner in (0,0)

var NROTATION = 4;

function Piece(type, blocks, rotation) {
    this._type = type;
    this._blocks = blocks;
    this._rotation = rotation;
}

Piece.prototype.copy = function() {
    return new Piece(this._blocks.map(function(block) {
        return block.copy();
    }));
};

Piece.prototype.setColor = function(color) {
    this._blocks.forEach(function(block) {
        block.setColor(color);
    });
};

Piece.prototype.getBlocks = function() {
    return this._blocks;
};

Piece.prototype.translate = function(drow, dcol) {
    this._blocks.forEach(function(block) {
        block.translate(drow, dcol);
    });
};

Piece.prototype.rotateClockwise = function() {
    var rotations = this._type.rotations[this._rotation];

    for (var i = 0; i < rotations.length; i += 1) {
        this._blocks[i].translate(rotations[i][0], rotations[i][1]);
    }

    this._rotation = (this._rotation + 1) % NROTATION;
};

Piece.prototype.boundingBox = function() {
    var box = {
        minRow: Number.MAX_VALUE,
        maxRow: 0,

        minCol: Number.MAX_VALUE,
        maxCol: 0
    };

    this._blocks.forEach(function(b) {
        box.minRow = Math.min(box.minRow, b.row());
        box.maxRow = Math.max(box.maxRow, b.row());

        box.minCol = Math.min(box.minCol, b.col());
        box.maxCol = Math.max(box.maxCol, b.col());
    });   

    return box;
};

var b = function(row, col) {
    return new Block({
        row: row,
        col: col,
        color: COLORS.RED
    });
};

// Types of pieces based on article(s):
// https://en.wikipedia.org/wiki/Tetris and
// http://tetris.wikia.com/wiki/SRS
var PIECES = Object.freeze({
    // indexes (ROW, COLUMN)
    // rows goes down, column to the right
    
    I: {
        name: 'I',

        blocks: [
            b(0,0), b(0,1), b(0,2), b(0,3)
        ],
        
        rotations: [
            [ [-1,2],  [0,1],  [1,0],  [2,-1] ],
            [ [2,1],   [1,0],  [0,-1], [-1,-2] ],
            [ [1,-2],  [0,-1], [-1,0], [-2,1] ],
            [ [-2,-1], [-1,0], [0,1],  [1,2] ]
        ]
    },

    J: {
        name: 'J',

        blocks: [
            b(0,0),
            b(1,0), b(1,1), b(1,2)
        ],

        rotations: [
            [ [0,2],  [-1,1],  [0,0], [1,-1] ],
            [ [2,0],  [1,1],   [0,0], [-1,-1] ],
            [ [0,-2], [1,-1],  [0,0], [-1,1] ],
            [ [-2,0], [-1,-1], [0,0], [1,1] ]
        ]
    },

    L: {
        name: 'L',

        blocks: [
                            b(0,2),
            b(1,0), b(1,1), b(1,2)
        ],

        rotations: [
            [ [2,0],  [-1,1],  [0,0], [1,-1] ],
            [ [0,-2], [1,1],   [0,0], [-1,-1]],
            [ [-2,0], [1,-1],  [0,0], [-1,1] ],
            [ [0,2],  [-1,-1], [0,0], [1,1]  ]
        ]
    },

    O: {
        name: 'O',

        blocks: [
            b(0,0), b(0,1),
            b(1,0), b(1,1)
        ],

        rotations: [
            [ [0,1],  [1,0], [-1,0],  [0,-1] ],
            [ [1,0],  [0,-1], [0,1],  [-1,0] ],
            [ [0,-1], [-1,0], [1,0],  [0,1]  ],
            [ [-1,0], [0,1],  [0,-1], [1,0]  ]
        ]
    },

    S: {
        name: 'S',

        blocks: [
                    b(0,1), b(0,2),
            b(1,0), b(1,1)
        ],

        rotations: [
            [ [1,1],   [2,0],  [-1,1],  [0,0] ],
            [ [1,-1],  [0,-2], [1,1],   [0,0] ],
            [ [-1,-1], [-2,0], [1,-1],  [0,0] ],
            [ [-1,1],  [0,2],  [-1,-1], [0,0] ]
        ]
    },

    T: {
        name: 'T',

        blocks: [
                    b(0,1),
            b(1,0), b(1,1), b(1,2)
        ],

        rotations: [
            [ [1,1],   [-1,1],  [0,0], [1,-1] ],
            [ [1,-1],  [1,1],   [0,0], [-1,-1] ],
            [ [-1,-1], [1,-1],  [0,0], [-1,1] ],
            [ [-1,1],  [-1,-1], [0,0], [1,1] ]
        ]
    },

    Z: {
        name: 'Z',

        blocks: [
            b(0,0), b(0,1),
                    b(1,1), b(1,2)
        ],

        rotations: [
            [ [0,2],  [1,1],   [0,0], [1,-1] ],
            [ [2,0],  [1,-1],  [0,0], [-1,-1] ],
            [ [0,-2], [-1,-1], [0,0], [-1,1] ],
            [ [-2,0], [-1,1],  [0,0], [1,1] ]
        ]
    },

    getPiecesNames: function() {
        return ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    },

    createPiece: function getRandom(pieceType) {
        if (-1 === this.getPiecesNames().indexOf(pieceType)) {
            throw new Error('invalid piece type: ' + pieceType);
        }

        var pieceColor = COLORS.getRandom();
        var pieceBlocks = this[pieceType].blocks.map(function(b) {
            return b.copy();
        });
        var pieceRotation = 0;

        var piece = new Piece(this[pieceType], pieceBlocks, pieceRotation);
        piece.setColor(pieceColor);
        
        return piece;
    }
});

module.exports = PIECES;

