$(document).ready(function() {
    var origBoard = [];
    var huPlayer, aiPlayer, stillPlay = true;
  
    // Create a clean array for origBoard
    reloadBoard();
  
    // Check if the radio button is already checked when the page is loaded
    if ($("#inlineRadio1").is(':checked')) {
      huPlayer = "X";
      aiPlayer = "O";
    }
  
    // set the letter choose for the player
    $('input').click(function() {
      if ($("#inlineRadio1").is(':checked')) {
        huPlayer = "X";
        aiPlayer = "O";
      }
      else {
        huPlayer = "O";
        aiPlayer = "X";
      }
    });
  
    $('.cell').click(function(e) {
      var chances;
  
      // check if for some reason the letter are not set for each player
      if (huPlayer == undefined) {
        alert("Please select 'X' or 'O' before playing");
        return;
      }
  
      var cellID = e.target.id;
  
      // check if the cell clicked is not already take from another player
      if (origBoard[cellID] != "X" && origBoard[cellID] != "O" && stillPlay) {
        origBoard[cellID] = huPlayer;
        var bestSpot = minimax(origBoard, aiPlayer);
        origBoard[bestSpot.index] = aiPlayer;
  
        // set the corresponding letter to the cell selected for the human and AI player
        $(this).html(huPlayer).addClass("cell-press");
        $("#" + bestSpot.index).html(aiPlayer).addClass("cell-press");
      }
  
      // check how many spots are aviable
      chances = emptyIndex(origBoard);
  
      // check who win the game
      if (winning(origBoard, huPlayer)) {
        console.log("You win");
        endGame(huPlayer);
        stillPlay = false;
      }
      else if (winning(origBoard, aiPlayer)) {
        console.log("AI Win!");
        endGame(aiPlayer);
        stillPlay = false;
      }
      else if (chances.length == 0) {
        console.log("Is a tie");
        endGame("tie");
        stillPlay = false;
      }
    });
  
    $('#reset').click(function() {
      reloadBoard();
      $('.cell').css('opacity', '1').html("").removeClass("cell-press");
      $('.alert').slideUp(800);
  
      stillPlay = true;
    })
  
    function reloadBoard() {
      // clean the board.
      origBoard.splice(0, origBoard.length);
  
      for (var i = 0; i < 9; i++) {
        origBoard.push(i);
      }
    }
  
    function endGame(player) {
      var winner = "It is a Tie!";
  
      if (player === huPlayer) {
        winner = "You win!";
      }
      else if (player === aiPlayer) {
        winner = "Computer win!";
      }
  
      var alert = $('<div role="alert"></div>').addClass('alert alert-warning alert-dismissible fade show');
      var button = $('<button type="button" data-dismiss="alert" aria-label="Close"></button>').addClass("close").appendTo($(alert));
      var span = $('<span aria-hidden="true">&times;</span>').appendTo($(button));
      var strong = $('<strong>'+ winner + '</strong>').appendTo($(alert));
  
      $(alert).hide().appendTo("#alert").slideDown(1000);
  
      // set opacity for each cell, because the games has ended
      $('.cell').css('opacity', '0.5').click(function() {
        event.preventDefault();
        return false;
      });
    }
  
    // return the aviable spots
    function emptyIndex(board) {
      return board.filter(s => s != "O" && s != "X");
    }
  
    // return true if board have a winner combination
    function winning(board, player) {
      if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
        ) {
        return true;
      }
      else
        return false;
    }
  
    function minimax(newBoard, player) {
      // aviable spots
      var aviableSpots = emptyIndex(newBoard);
  
      // if the next move, the human win, the score has to be -10
      if (winning(newBoard, huPlayer)) {
        return {score:-10};
      }
      else if (winning(newBoard, aiPlayer)) {
        return {score:10};
      }
      else if (aviableSpots.length === 0) {
        return {score:0};
      }
  
      var moves = [];
  
      for (var i = 0; i < aviableSpots.length; i++) {
        var move = {};
        move.index = newBoard[aviableSpots[i]];
  
        newBoard[aviableSpots[i]] = player;
  
        if (player == aiPlayer) {
          var result = minimax(newBoard, huPlayer);
          move.score = result.score;
        }
        else {
          var result = minimax(newBoard, aiPlayer);
          move.score = result.score;
        }
  
        newBoard[aviableSpots[i]] = move.index;
  
        moves.push(move);
      }
  
      var bestMove;
  
      if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
          if(moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }
      else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
          if(moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }
  
      return moves[bestMove];
    }
  });