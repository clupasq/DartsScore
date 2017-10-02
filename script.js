
var Player = function(name) {
  this.name = name;
  this.scores = [];

  this.getRemainingScore = function (targetScore) {
    var scored = _.sum(this.scores) || 0;
    return targetScore - scored;
  };

  this.getCummulativeScores = function (targetScore) {
    var crt = targetScore;
    var cs = [];
    this.scores.forEach(s => { crt -= s; cs.push(crt); });
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
    },

    getRoundCount: function() {
      return _.max(this.players.map(p => p.scores.length)) || 0;
    },

    getNextPlayer: function() {
      var playersWithIndices = this.players.map((p, i) => ({player: p, index: i}));
      var next = _.minBy(playersWithIndices, x => [x.player.scores.length, x.index]);
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
    },

    toggleCummulativeScore: function() {
      this.showCummulativeScore = !this.showCummulativeScore;
    },

    toggleRemovePlayers: function() {
      this.canRemovePlayers = !this.canRemovePlayers;
    },

    removePlayer: function(index) {
      var playerToRemove = this.players[index];
      var result = window.confirm(`Are you sure ${playerToRemove.name} wants to leave?`);
      if (result) {
        this.players.splice(index, 1);
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
      this.score = '';
      this.focusOnNewScore();
    },

    rounds: function () {
      var rr= _.range(this.getRoundCount());
      return _.range(this.getRoundCount());
    },

    getColor: function(score) {
      var level = Math.floor(score / 100);
      return `rgb(${level * 30 + 200}, ${255 - level * 10}, ${255 - level * 20})`;
    }

  }
});


// app.addPlayer('clay');
// app.addPlayer('macy');
// // app.addPlayer('axl');
//

var clay = new Player('Clay');
var macy = new Player('Macy');

clay.scores = [10, 180, 33, 52];
macy.scores = [2, 54, 78, 88];

console.log(clay.getCummulativeScores(app.targetScore));

app.players = [clay, macy, clay, macy];

app.focusOnNewScore();
