var playerBoardId = "MainContent_player_board";
var enemyBoardId = "MainContent_enemy_board";
document.getElementById('player1').style.display = "none";
document.getElementById('player2').style.display = "none";
document.getElementById('error').style.display = "none";
document.getElementById('add_ship').style.display = "none";
document.getElementById('start').style.display = "none";
var Game = {
    defaults: {
        gameStatus: 0,
        currentShipSizeToAdd: 5,
        length_X: 10,
        length_Y: 10,
        orientation: 'vertical'
    },
    currentShipOrientation: 'vertical',
    currentShipSizeToAdd: 5,
    gameStatus: 1,
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
    },
    init: function (table1, table2) {
        if (!buzz.isMP3Supported()) {
            this.sounds.hit.sound = new buzz.sound(this.sounds.hit.src_wav);
            this.sounds.fail.sound = new buzz.sound(this.sounds.fail.src_wav);
        } else {
            this.sounds.hit.sound = new buzz.sound(this.sounds.hit.src_mp3);
            this.sounds.fail.sound = new buzz.sound(this.sounds.fail.src_mp3);
        }

        this.playerBoard = $(table1);
        this.enemyBoard = $(table2);
        // get last game state and update the player board
        this.getGameState();

        // get last enemy game state and update the enemy board
        this.getEnemyGameState();
    },
    addShipToGame: function (ship) {
        var urlToAddNewShip = "/battleship/Game.aspx?action=add_ship";
        var urlData = "&x=" + ship.getPosition().x + "&y=" + ship.getPosition().y + "&size=" + ship.getSize() + "&orientation=" + ship.getOrientation();
        var urlToAddNewShipV2 = '/api/board/add-ship';
        $.ajax({
            url: urlToAddNewShipV2,
            data: urlData,
            success: function (data) {
                Game.addShipToClientSide(ship);
            },
            error: function (data) {
                alert("Invalid Position");
            },
            dataType: "json"
        });


    },
    clear_ship_list: function () {
        var urlToClearShips = "/battleship/Game.aspx?action=clear_ship_list";
        var urlData = "";
        $.ajax({
            url: urlToClearShips,
            data: urlData,
            success: function (data) {
                // alert('ships cleared');
                this.currentShipSizeToAdd = 0;
                Game.setGameStatus(1);
                //apagar barcos do mapa e voltar ao inicio
            },
            error: function (data) {
                //alert(data);
            },

        });

    },
    addShipToClientSide: function (ship) {
        Game.listShips.push(ship);
        // update the board
        Game.refreshBoard();
        this.currentShipSizeToAdd--;

        if (this.currentShipSizeToAdd < 1) {
            this.setGameStatus(2);
            //alert('game status -> 2 , comecou o jogo');
        }
    },

    drawShip: function (ship) {
        var shipPosition = ship.getPosition();
        var shipSize = ship.getSize();
        for (var i = 1; i <= shipSize; i++) {
            var rowNumber = shipPosition.y;
            var colNumber = shipPosition.x;
            if( ship.getOrientation() == 'vertical' ) {
                rowNumber -= ( i - 1 );
            } else {
                colNumber -= ( i - 1 );
            }

            console.log('row:' + rowNumber + ' orientation:' + ship.getOrientation());

            //console.log("$('#" + rowNumber + "-" + shipPosition.x + "').addClass('ship-size" + ship.getSize() + "-" + ship.getOrientation() + "-" + i + "');");
            //$("#MainContent_player_board ." + rowNumber + "-" + colNumber).addClass('ship-size-' + ship.getSize() + '-' + ship.getOrientation() + '-' + i);
        }
    },

    drawMissil: function (position) {
        $("#MainContent_player_board ." + position.y + "-" + position.x).addClass("burn");
    },
    drawMissilMiss: function (position) {
        $("#MainContent_player_board ." + position.y + "-" + position.x).addClass("missil-miss");
    },
    drawEnemyMissilHit: function (position) {
        $("#MainContent_enemy_board ." + position.y + "-" + position.x).addClass("burn");
    },
    drawEnemyMissilMiss: function (position) {
        $("#MainContent_enemy_board ." + position.y + "-" + position.x).addClass("missil-miss");
    },
    refreshBoard: function () {
        // ver como limpar todas as imagens menos a class que indica a posicao ou apagar tudo e adicionar as classes certas
        //$("#MainContent_player_board td").removeClass("ship-size-5-vertical-2");
        //$("#MainContent_player_board td").addClass("cell");

        // update all ships UI
        for (var i in Game.listShips) {
            //console.error(Game.listShips[i]);
            this.drawShip(Game.listShips[i]);
        }

        // update all fired missils hit success by Enemy UI
        for (var m in Game.listMissilsHit) {
            this.drawMissil(Game.listMissilsHit[m]);
        }

        // update all fired missils hit success by Enemy UI
        for (var m in Game.listMissilsMiss) {
            this.drawMissilMiss(Game.listMissilsMiss[m]);
        }
    },
    refreshEnemyBoard: function () {
        // update all fired missils hit success by Enemy UI
        for (var m in Game.enemyListMissilsHit) {
            this.drawEnemyMissilHit(Game.enemyListMissilsHit[m]);
        }

        // update all fired missils hit success by Enemy UI
        for (var m in Game.enemyListMissilsMiss) {
            this.drawEnemyMissilMiss(Game.enemyListMissilsMiss[m]);
        }
    },
    getGameStatus: function () {
        return this.gameStatus;
    },
    setGameStatus: function (status) {
        this.gameStatus = parseInt(status);
    },
    previewShipInGame: function (position) {
        for (var i = 0; i <= this.currentShipSizeToAdd; i++) {
            //console.log('row:' + (position.y - i));
            if (this.getShipOrientation() == 'vertical') {
                var rowNumber = position.y - (i - 1);
                var colNumber = position.x;
            } else {
                var rowNumber = position.y;
                var colNumber = position.x + (i - 1);
            }

            var shipPositionClass = 'ship-size-' + this.currentShipSizeToAdd + '-' + this.getShipOrientation() + '-' + i;
            $("#" + playerBoardId + " ." + rowNumber + "-" + colNumber).addClass(shipPositionClass);
        }
    },
    previewShipInGameRemove: function () {
        for (var i = 0; i <= this.currentShipSizeToAdd; i++) {
            var shipPositionClass = 'ship-size-' + this.currentShipSizeToAdd + '-' + this.getShipOrientation() + '-' + i;
            $("td").removeClass(shipPositionClass);
        }
    },
    getShipOrientation: function () {
        if (this.currentShipOrientation.length > 1) {
            return this.currentShipOrientation;
        }
        return this.defaults.orientation;
    },
    setShipOrientation: function (orientation) {
        switch (orientation) {
            case 'vertical':
            case 'horizontal':
                this.currentShipOrientation = orientation;
                break;
            default:
                console.error('invalid orientation defined!');
        }
    },
    fire: function (position) {
        // check on server if hit the enemy or not
        var urlToFire = "/battleship/Game.aspx?action=ajax_fire";
        var urlData = "&x=" + position.x + "&y=" + position.y;
        $.ajax({
            cache: false,
            url: urlToFire,
            data: urlData,
            success: function (data) {
                //console.error(data);
                var hitStatus = data;
                if (hitStatus == 0) {
                    Game.sounds.fail.sound.play();
                    $("#MainContent_enemy_board ." + position.y + "-" + position.x).addClass("missil-miss");
                } else if (hitStatus == 1) {
                    Game.sounds.hit.sound.play();
                    $("#MainContent_enemy_board ." + position.y + "-" + position.x).addClass("missil-hit");
                } else if (hitStatus == 3) {
                    Game.sounds.hit.sound.play();
                    $("#MainContent_enemy_board ." + position.y + "-" + position.x).addClass("missil-hit");
                    alert("terminou o jogo");
                }
                Game.getGameState();

            },
            error: function (data) {
                // alert("errooo!" + data);
            },
            dataType: "json"
        });


    },
    getGameState: function () {
        var urlToGetPlayerGameState = "/battleship/Game.aspx?action=ajax_get_game_state";
        var urlData = "";
        $.ajax({
            cache: false,
            url: urlToGetPlayerGameState,
            data: urlData,
            success: function (data) {
                var newShip;
                for (var i in data.listShips) {
                    var responseShip = data.listShips[i];
                    var shipPos = new Point(responseShip.position.x, responseShip.position.y);
                    newShip = new Ship(shipPos, responseShip.orientation, responseShip.size, "update model");
                    //Game.listShips.push(newShip);
                    Game.addShipToClientSide(newShip);
                }

                for (var i in data.listMissilsHit) {
                    var missil = data.listMissilsHit[i];
                    var missilPosition = new Point(missil.x, missil.y);
                    Game.listMissilsHit.push(missilPosition);
                }

                for (var i in data.listMissilsMiss) {
                    var missil = data.listMissilsMiss[i];
                    var missilPosition = new Point(missil.x, missil.y);
                    Game.listMissilsMiss.push(missilPosition);
                }

                Game.refreshBoard();

            },
            error: function (data) {
                // alert("errooo!" + data);
            },
            dataType: "json"
        });
    },
    getEnemyGameState: function () {
        var urlToGetEnemyGameState = "/battleship/Game.aspx?action=ajax_get_enemy_game_state";
        var urlData = "";
        $.ajax({
            cache: false,
            url: urlToGetEnemyGameState,
            data: urlData,
            success: function (data) {

                for (var i in data.listMissilsHit) {
                    var missil = data.listMissilsHit[i];
                    var missilPosition = new Point(missil.x, missil.y);
                    Game.enemyListMissilsHit.push(missilPosition);
                }

                for (var i in data.listMissilsMiss) {
                    var missil = data.listMissilsMiss[i];
                    var missilPosition = new Point(missil.x, missil.y);
                    Game.enemyListMissilsMiss.push(missilPosition);
                }
                Game.refreshEnemyBoard();

            },
            error: function (data) {
                //alert("errooo!" + data); 
            },
            dataType: "json"
        });
    }
};


var Ship = function (position, orientation, size, type) {
    this.typeName = type;
    this.orientation = orientation;
    this.size = size;
    this.position = position;

    this.getSize = function () {
        return this.size;
    }
    this.getOrientation = function () {
        return this.orientation;
    }
    this.getPosition = function () {
        return this.position;
    }

}


// 1 - colocar navios
// 2 - Disparar
// 3 - espera de jogar
/*
 var gameStatus = 1;
 var currentShipSizeToAdd = 5;
 var gameBoard = {"size_y": 10, "size_x": 10};
 var shipOrientation = '';
 var defaultOrientation = 'vertical';

 */


var Point = function (x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
}

// ao colocar barcos o rato marca sempre a ponta do barco inferior esquerda

$(document).ready(function () {
    Game.init('#MainContent_player_board', '#MainContent_enemy_board');


    $('#' + playerBoardId + ' td.cell').click(function () {
        // pedido ajax
        var position = new Point($(this).data('col'), $(this).data('row'));
        var newShip = new Ship(position, Game.getShipOrientation(), Game.currentShipSizeToAdd, "test model");

        if (Game.getGameStatus() == 1) {
            Game.addShipToGame(newShip);
            document.getElementById('add_ship').style.display = "";
        } else if (Game.getGameStatus() == 2) {
            //mySound.play();

        } else if (Game.getGameStatus() == 3) {
            alert('is not your turn');
        }

    });


    $('#reset').click(function () {
        if (Game.getGameStatus() == 1) {
            Game.clear_ship_list();
            // Game.setGameStatus(1);
        } else {
            alert('ja estas a jogar');
        }
    });

    $('#' + playerBoardId + ' td.cell').hover(
        function () {
            if (Game.getGameStatus() == 1) {
                var position = new Point($(this).data('col'), $(this).data('row'));
                //console.log(position);
                //previewShipInGame(position, currentShipSizeToAdd, getShipOrientation());
                Game.previewShipInGame(position, Game.getShipOrientation());
            } else {
                $(this).addClass("hover");
            }

        },
        function () {
            if (Game.getGameStatus() == 1) {
                //previewShipInGameRemove(currentShipSizeToAdd, getShipOrientation() );
                Game.previewShipInGameRemove(Game.getShipOrientation());
                document.getElementById('add_ship').style.display = "";
            } else {
                document.getElementById('add_ship').style.display = "none";
                $(this).removeClass("hover");
            }

        }
    );


    $('#' + enemyBoardId + ' td.cell').click(function () {
        if (Game.getGameStatus() == 2) {
            var position = new Point($(this).data('col'), $(this).data('row'));
            Game.fire(position);
        }
    });


});





