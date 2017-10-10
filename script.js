
var Player = function(name) {
  this.name = name;
  this.scores = [];

  this.getRemainingScore = function(targetScore) {
    var scored = _.sum(this.scores) || 0;
    return targetScore - scored;
  };

  this.getCummulativeScores = function(targetScore) {
    var crt = targetScore;
    var cs = [];
    this.scores.forEach(function(s) { crt -= s; cs.push(crt); });
    return cs;
  }
};

var MAX_PLAYER_COUNT = 8;

var app = new Vue({
  el: '#app',
  data: {
    targetScore: 301,
    players: [],
    score: '',
    canRemovePlayers: false,
    showCummulativeScore: false,

    addPlayer: function(name){
      if (this.players.length >= MAX_PLAYER_COUNT) {
        alert('Too many players!');
        return;
      }
      name = name || prompt("Enter name: ");
      this.players.push(new Player(name));
      this.save();
    },

    getRoundCount: function() {
      return _.max(this.players.map(function(p){ return  p.scores.length; })) || 0;
    },

    getNextPlayer: function() {
      var playersWithIndices = this.players.map(function(p, i) { return {player: p, index: i};});
      var next = _.minBy(playersWithIndices, function(x) { return x.player.scores.length * 1e9 + x.index; });
      return next && next.player;
    },

    getNextPlayerName: function () {
      var nextPlayer = this.getNextPlayer();
      return nextPlayer && nextPlayer.name;
    },

    focusOnNewScore: function() {
      var scoreEl = document.getElementById('newScore');
      scoreEl.focus();
    },

    modifyScore: function(player, round) {
      var existingScore = player.scores[round];
      if (isNaN(existingScore)) {
        return;
      }
      var newScore = window.prompt(`Enter the new score for player ${player.name}, round ${round}`, existingScore);
      var newScore = parseInt(newScore, 10);
      if (isNaN(newScore) || newScore < 0 || newScore > 180) {
        alert('Invalid score!');
        return;
      }
      var newRemaining = this.targetScore - (_.sum(player.scores) || 0) + existingScore - newScore;
      if (newRemaining < 0) {
        alert('Cannot go below 0!!!');
        return
      }
      player.scores[round] = newScore;
      this.$forceUpdate();
      this.save();
    },

    toggleRemovePlayers: function() {
      this.canRemovePlayers = !this.canRemovePlayers;
    },

    removePlayer: function(index) {
      var playerToRemove = this.players[index];
      var result = window.confirm(`Are you sure ${playerToRemove.name} wants to leave?`);
      if (result) {
        this.players.splice(index, 1);
        this.save();
      }
    },

    addScore: function() {
      var newScore = parseInt(this.score, 10);
      if (isNaN(newScore) || newScore < 0 || newScore > 180){
        alert('Invalid score!');
        return;
      }
      var nextPlayer = this.getNextPlayer();
      if (!nextPlayer) {
        return;
      }
      if (newScore > nextPlayer.getRemainingScore(this.targetScore)) { newScore = 0; }
      nextPlayer.scores.push(newScore);
      this.save();
      this.score = '';
      this.focusOnNewScore();
    },

    rounds: function () {
      var rr = _.range(this.getRoundCount());
      return _.range(this.getRoundCount());
    },

    getColor: function(score) {
      var level = Math.floor(score / 100);
      return `rgb(${level * 30 + 200}, ${255 - level * 10}, ${255 - level * 20})`;
    },

    newGame: function() {
      var confirmation = window.confirm('Are you sure you want to start a new game?');
      if (confirmation) {
        this.players.forEach(function(p) { p.scores = []; });
        this.save();
      }
    },

    save: function() {
      try {
      localStorage.gameData = JSON.stringify({
        target: this.targetScore,
        players: this.players
      });
      } catch(e) {
        // This fails if there's no localStorage, or if iOS is in private browsing mode.
      }
    },

    load: function() {
      try {
        var gameData = JSON.parse(localStorage.gameData);
        this.players = gameData.players.map(function(p) {
          var pl = new Player(p.name);
          pl.scores = p.scores;
          return pl;
        });
        this.targetScore = gameData.target || 301;
      } catch(e) {
        this.players = [ new Player('Player1') ];
        this.targetScore = 301;
      }
    }
  }
});


var addTestPlayerScores = function() {
  var clay = new Player('Clay');
  var macy = new Player('Macy');
  clay.scores = [10, 180, 33, 52];
  macy.scores = [2, 54, 78, 88];
  app.players = [clay, macy, clay, macy];
};

var addUsualPlayers = function() {
  app.addPlayer('Adrian');
  app.addPlayer('Bogdan');
  app.addPlayer('Radu');
  app.addPlayer('Cristi');
};

// addUsualPlayers();
// addTestPlayerScores();
app.load();

app.focusOnNewScore();
