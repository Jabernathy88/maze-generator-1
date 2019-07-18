var Maze = (function () {
  var LEFT = 0b0001; //1
  var RIGHT = 0b0010; //2
  var BOTTOM = 0b0100; //4
  var TOP = 0b1000; //8
  var MAZE_SIZE;

  function srand(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  class Maze {
    generate(seed, size) {
      MAZE_SIZE = size;
      this.currentSeed = seed;
      this.maze = new Array(MAZE_SIZE);

      var maze = this.maze;
      var seen = {};
      for (var i = 0; i < MAZE_SIZE; ++i) {
        maze[i] = new Array(MAZE_SIZE);
        for (var j = 0; j < MAZE_SIZE; ++j) {
          maze[i][j] = LEFT | TOP | BOTTOM | RIGHT;
          seen[this._hashKeyForCoord([i, j])] = false;
        }
      }

      var stack = [];
      var coord = [0, 0];
      var nextCoord;
      var seenCount = 0;
      while (seenCount < MAZE_SIZE * MAZE_SIZE) {
        if (!seen[this._hashKeyForCoord(coord)]) {
          ++seenCount;
        }
        seen[this._hashKeyForCoord(coord)] = true;

        var brokeWall = this._breakRandomWall(maze, coord, seen);
        if (brokeWall) {
          stack.push(coord);
          nextCoord = this._coordForDirection(coord, brokeWall);
        } else {
          nextCoord = stack.pop();
        }
        coord = nextCoord;
      }
    }

    draw(canvas) {
      var width = canvas.width();
      var c = canvas.get(0).getContext("2d");

      var gridSize = width / MAZE_SIZE;
      c.clearRect(0, 0, canvas.width(), canvas.height());

      c.beginPath();
      c.moveTo(0, gridSize);
      for (var y = 0; y < MAZE_SIZE; ++y) {
        for (var x = 0; x < MAZE_SIZE; ++x) {
          var item = this.maze[y][x];
          if ((item & BOTTOM) > 0) {
            c.moveTo(x * gridSize, (y + 1) * gridSize);
            c.lineTo((x + 1) * gridSize, (y + 1) * gridSize);
          }
          if ((item & RIGHT) > 0) {
            c.moveTo((x + 1) * gridSize, (y) * gridSize);
            c.lineTo((x + 1) * gridSize, (y + 1) * gridSize);
          }
        }
      }
      c.stroke();
    }

    hasWall(pos, direction) {
      console.log("I am maze:", this.maze)

      var walls = this.maze[pos[1]][pos[0]];
      return (walls & direction) > 0;
    }

    _hashKeyForCoord(c) { return c[0] + ',' + c[1]; }

    _coordForDirection(coord, direction) {
      var nextCoord = [coord[0], coord[1]];
      switch (direction) {
        case TOP:
          nextCoord[1]--;
          break;
        case LEFT:
          nextCoord[0]--;
          break;
        case BOTTOM:
          nextCoord[1]++;
          break;
        case RIGHT:
          nextCoord[0]++;
          break;
      }
      if (nextCoord[0] < 0 || nextCoord[0] >= MAZE_SIZE ||
        nextCoord[1] < 0 || nextCoord[1] >= MAZE_SIZE) return false;

      return nextCoord;
    }

    _oppositeDirection(direction) {
      switch (direction) {
        case LEFT: return RIGHT;
        case RIGHT: return LEFT;
        case TOP: return BOTTOM;
        case BOTTOM: return TOP;
      }
    }

    _breakRandomWall(maze, coord, seen) {
      var y = coord[1];
      var x = coord[0];
      var walls = maze[y][x];
      if (walls > 0) {
        var directions = [LEFT, TOP, BOTTOM, RIGHT];
        this._shuffleArray(directions);

        for (let wall of directions) {
          if (x == 0 && wall == LEFT) continue;
          if (x >= MAZE_SIZE - 1 && wall == RIGHT) continue;
          if (y == 0 && wall == TOP) continue;
          if (y >= MAZE_SIZE - 1 && wall == BOTTOM) continue;

          var otherWall = this._coordForDirection(coord, wall);
          if (!otherWall) continue;
          if (seen[this._hashKeyForCoord(otherWall)]) continue;
          if ((walls & wall) > 0) { // wall is not broken
            maze[y][x] ^= wall;
            if (otherWall) {
              maze[otherWall[1]][otherWall[0]] ^= this._oppositeDirection(wall);
            }
            return wall;
          }
        }
      }
      return 0;
    }

    _shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(this._random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }

    _random() {
      return srand(this.currentSeed++);
    }
  }

  console.log("I am Maze !!", Maze)

  return {
    Maze : Maze,
    LEFT: LEFT,
    TOP: TOP,
    RIGHT: RIGHT,
    BOTTOM: BOTTOM
  };
})();

