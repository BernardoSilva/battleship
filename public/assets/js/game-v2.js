/**
 * version 2.0
 */


var Ship = Backbone.Model.extend({
    defaults: {
        position: '',
        orientation: 'vertical',
        size: '',
        type: ''
    }
});


var Point = Backbone.Model.extend({
    defaults: {
        x: 0,
        y: 0
    }
});

var GameModel = Backbone.Model.extend({
    defaults: {
        id: null,
        gameStatus: 1,
        currentShipSizeToAdd: 5,
        cols: 10,
        rows: 10,
        cellWidth: 35,
        cellHeight: 35,
        orientation: 'vertical',
        currentShipOrientation: 'vertical',
        listShips: [],
        listMissilsHit: [],
        listMissilsMiss: [],
        enemyListMissilsHit: [],
        enemyListMissilsMiss: [],
        sounds: {
            hit: {
                src_mp3: '/assets/sounds/bomb_drop.mp3',
                src_wav: '/assets/sounds/bomb_drop.wav'
            },
            fail: {
                src_mp3: '/assets/sounds/fail.mp3',
                src_wav: '/assets/sounds/fail.wav'
            }
        }
    }
});

var RowModel = Backbone.Model.extend({
    defaults: {
        row: 0
    }
});


var CellModel = Backbone.Model.extend({
    defaults: {
        row: 0,
        col: 0
    }
});

var RowView = Backbone.View.extend({
    tagName: 'tr',
    render: function () {
        $(this.el).attr('id', 'row-' + this.model.get('row'));
        return this.$el;
    }
});


var CellView = Backbone.View.extend({
    tagName: 'td',
    events: {
        "click": "cellClicked",
        "mouseover": "cellHover",
        "mouseout": "cellHoverEnd"
    },
    cellClicked: function (e) {
        alert('PoOWW!!');
    },
    cellHover: function (e) {
        this.$el.addClass('hover');
    },
    cellHoverEnd: function () {
        this.$el.removeClass('hover');
    },
    render: function () {
        $(this.el).attr('data-row', this.model.get('row')).attr('data-col', this.model.get('col'));
        $(this.el).attr('class', this.model.get('row') + '-' + this.model.get('col') + ' cell').attr('id', 'row-' + this.model.get('row'));
        this.delegateEvents();
        return this.$el;
    }
});

var BoardView = Backbone.View.extend({
    tagName: 'table',
    className: 'game-board',
    render: function () {
        for (var rowNum = this.model.get('rows'); rowNum > 0; rowNum--) {
            var rowModel = new RowModel({row: rowNum});
            var rowView = new RowView({model: rowModel});
            rowView.render();
            var trElem = rowView.el;
            for (colNum = this.model.get('cols'); colNum > 0; colNum--) {
                var cellModel = new CellModel({row: rowNum, col: colNum});
                var cellView = new CellView({model: cellModel});
                cellView.render();
                $(trElem).append(cellView.el);
            }
            this.$el.append(trElem);
        }

        return this.$el;
    }
});


var gameModel = new GameModel({id: 1});
var playerBoardView = new BoardView({model: gameModel});
playerBoardView.render();

$('.player-board').append(playerBoardView.el);

var position = new Point({x: 2, y: 5});

var ship = new Ship({position: position, orientation: 'vertical', size: 3});


console.log(ship);
console.log(game);