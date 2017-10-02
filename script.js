

var Player = function(name) {
  this.name = name;
  this.scores = [];

  this.getRemainingScore = function (targetScore) {
    var scored = _.sum(this.scores) || 0;
    return targetScore - scored;
  };
};

var MAX_PLAYER_COUNT = 8;

var app = new Vue({
  el: '#app',
  data: {
    targetScore: 301,
    players: [],
    score: '',

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
      console.log("value");
      var rr= _.range(this.getRoundCount());
      console.log(rr );
      return _.range(this.getRoundCount());
    }
  }
});


app.addPlayer('clay');
app.addPlayer('macy');
// app.addPlayer('aaron');
// app.addPlayer('lance');
// app.addPlayer('axl');

app.focusOnNewScore();
