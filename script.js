

var Player = function(name) {
  this.name = name;
  this.scores = [];
};

var app = new Vue({
  el: '#app',
  data: {
    players: [],

    addPlayer: function(){
      var name = prompt("Enter name: ");
      this.players.push(new Player(name));
    },

    getRoundCount: function() {
      return _.max(players.select(p => p.scores.length)) || 0;
    }
  }
});
