/**
 * version 2.0
 */


var Ship = Backbone.Model.extend({
    url: '/api/game/ships/add',
    defaults: {
        position: '',
        orientation: 'vertical',
        size: '',
        type: ''
    }

});


var ShipCollection = Backbone.Collection.extend({
    model: Ship,
    url: '/api/game/ships/get',

//    events: {
//        'sync': 'addAll',
//        'change': 'addAll'
//    },

    initialize: function() {
        this.on('sync', this.addAll, this);
    },

    addAll: function() {
        this.trigger('finishSync');
    }

});

var Missil = Backbone.Model.extend({
    defaults: {
        id: '',
        position:'',
        hit:''
    }
});


var MissilCollection = Backbone.Collection.extend({
    model: Missil
});


var Point = Backbone.Model.extend({
    defaults: {
        x: 0,
        y: 0
    }
});
/**
 *
 * Models
 */
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
        collections: {
            listShips: Backbone.Collection.extend({}),
            listPlayerMissils: Backbone.Collection.extend({}),
            listEnemyMissils: Backbone.Collection.extend({})
        },
//        listShips: [],
//        listMissilsHit: [],
//        listMissilsMiss: [],
//        enemyListMissilsHit: [],
//        enemyListMissilsMiss: [],
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
    },

    initialize: function() {
        this.collections = {};
        this.collections.listShips = new ShipCollection([]);
        this.collections.listShips.fetch();
//        this.listPlayerMissils;
//        this.listEnemyMissils;
    },

    getShips: function() {
        return this.collections.listShips;
    },

    addShip: function(ship){
        ship.save();
    },

    fetch: function() {
        // fetch my ships
        this.collections.listShips.fetch();
        // fetch my missils fired
        // fetch enemy missils fired
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


/**
 *
 * Views
 */
var RowView = Backbone.View.extend({
    tagName: 'tr',
    render: function () {
        $(this.el).attr('id', 'row-' + this.model.get('row'));
        return this.$el;
    }
});


var CellView = Backbone.View.extend({
    tagName: 'td',


    render: function () {
        $(this.el).attr('data-row', this.model.get('row')).attr('data-col', this.model.get('col'));
        $(this.el).attr('class', this.model.get('row') + '-' + this.model.get('col') + ' cell').attr('id', 'row-' + this.model.get('row'));
        this.delegateEvents();
        return this.$el;
    }
});




var BoardView = Backbone.View.extend({
    model: GameModel,
    tagName: 'table',
    className: 'game-board',
    enemy: false,
    events: {
        "click td": "cellClicked",
        "mouseover td": "cellHover",
        "mouseout td": "cellHoverEnd"
    },

    initialize: function(params, options){
        this.options = options || {};
        if(this.options.enemy) {
            this.options.enemy = true;
        } else {
            this.options.enemy = false;
        }


        this.listenTo(this.model.getShips(), 'finishSync', this.addShips);
    },

    cellClicked: function (e) {
        this.trigger('cellClicked', e);
        var $targetElem = $(e.target);
        if(this.options.enemy) {
            alert('PooOOW!');
        } else {
            if(this.model.get('gameStatus') === 1){
//                this.addPreviewShip(position);
                var currentPosition = new Point({x: $targetElem.data('col'), y: $targetElem.data('row') });
                var ship = new Ship({position: currentPosition, orientation: this.model.get('currentShipOrientation'), size: this.model.get('currentShipSizeToAdd')});
                this.model.addShip(ship);
            } else {
//                $targetElem.addClass('hover');
            }
        }

    },
    cellHover: function (e) {
        var $targetElem = $(e.target);

        var position = new Point({x: $targetElem.data('col'), y: $targetElem.data('row') });
        if(this.options.enemy) {
            console.log('Only fire!');
        } else {
//            console.log('add ships');
            if(this.model.get('gameStatus') === 1){
                this.addPreviewShip(position);

            } else {
                $targetElem.addClass('hover');
            }
        }
    },
    cellHoverEnd: function (e) {
        var $targetElem = $(e.target);
        $targetElem.removeClass('hover');

        var position = new Point({x: $targetElem.data('col'), y: $targetElem.data('row') });
        if(this.options.enemy) {
            console.log('Only fire!');
        } else {
//            console.log('add ships');
            if(this.model.get('gameStatus') === 1){
                this.removePreviewShip(position);
            }
        }
    },

    addPreviewShip: function(position){
        var shipSize = this.model.get('currentShipSizeToAdd');
        var currentOrientation = this.model.get('currentShipOrientation');
        for (var i = this.model.get('currentShipSizeToAdd'); i > 0; i--) {
            if (currentOrientation == 'vertical') {
                var rowNumber = (position.get('y')-1) + i;
                var colNumber = position.get('x');
            } else {
                var rowNumber = position.get('y');
                var colNumber = (position.get('x')-1) + i;
            }
            var shipPositionClass = 'ship-size-' + shipSize + '-' + currentOrientation + '-' + i;
            $('.cell.' + rowNumber + '-' + colNumber, this.$el).addClass(shipPositionClass);
        }
    },

    removePreviewShip: function(position) {
        var shipSize = this.model.get('currentShipSizeToAdd');
        var currentOrientation = this.model.get('currentShipOrientation');
        for (var i = this.model.get('currentShipSizeToAdd'); i > 0; i--) {
            if (currentOrientation == 'vertical') {
                var rowNumber = (position.get('y')-1) + i;
                var colNumber = position.get('x');
            } else {
                var rowNumber = position.get('y');
                var colNumber = (position.get('x')-1) + i;
            }
            var shipPositionClass = 'ship-size-' + shipSize + '-' + currentOrientation + '-' + i;
            $('.cell.' + rowNumber + '-' + colNumber, this.$el).removeClass(shipPositionClass);
        }
    },

    addShips: function() {
        console.log('draw all ships!');
        alert('got here!');
    },

    render: function () {
        for (var rowNum = this.model.get('rows'); rowNum > 0; rowNum--) {
            var rowModel = new RowModel({row: rowNum});
            var rowView = new RowView({model: rowModel});
            rowView.render();
            var trElem = rowView.el;
            for (var colNum = this.model.get('cols'); colNum > 0; colNum--) {
                var cellModel = new CellModel({row: rowNum, col: colNum});
                var cellView = new CellView({model: cellModel});
                cellView.render();
                $(trElem).append(cellView.el);
            }
            this.$el.append(trElem);
        }

        return this;
    }
});


var GameView = Backbone.View.extend({
    model: GameModel,
    template: _.template('<div class="enemy-board"></div><div class="player-board"></div>'),

    initialize: function(){
        this.playerBoard = new BoardView({model: this.model});
        this.enemyBoard = new BoardView({model: this.model}, {enemy: true});
        this.playerBoard.on('cellClicked', this.playerClickSelfBoard, this);
        this.enemyBoard.on('cellClicked', this.playerClickOnEnemy, this);
    },

    playerClickSelfBoard: function(e){
      console.log('Player clicked on self board triggered!', e.target);
    },
    playerClickOnEnemy: function(e) {
        console.log('Player clicked on enemy board triggered!', e.target);
    },

    // draw the player and the enemy board
    render: function(){
        this.$el.html(this.template({}));
        $('.enemy-board', this.el).append( this.enemyBoard.render().el );
        $('.player-board' ,this.el).append( this.playerBoard.render().el );
    }

});

var gameModel = new GameModel({id: 1});
//gameModel.fetch();
var gameView = new GameView({model: gameModel});
gameView.render();

$('.game-wrapper').append(gameView.el);


//var position = new Point({x: 2, y: 5});

//var ship = new Ship({position: position, orientation: 'vertical', size: 3});
