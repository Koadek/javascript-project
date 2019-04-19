/*
NOTE: You will need to add and modify code in this file to complete this project.
I have defined a few functions and variables to help guide you but that doesn't mean no other variables or functions are necessary.
If you think you have a better / different way to do things, you are free to do so :)
*/

const monsterNames = [
  'Bigfoot',
  'Centaur',
  'Cerberus',
  'Chimera',
  'Ghost',
  'Goblin',
  'Golem',
  'Manticore',
  'Medusa',
  'Minotaur',
  'Ogre',
  'Vampire',
  'Wendigo',
  'Werewolf',
];

const RARITY_LIST = ['Common', 'Unusual', 'Rare', 'Epic'];
const GAME_STEPS = ['SETUP_PLAYER', 'SETUP_BOARD', 'GAME_START'];
let gameStep = 0;
let board = []; // The board holds all the game entities. It is a 2D array.

const items = []; // Array of item objects. These will be used to clone new items with the appropriate properties.

const player = {
  name: '',
  level: 1,
  items: [],
  skills: ['confuse'],
  attack: /*player.level * */ 10,
  speed: 4000 /* / player.level*/,
  hp: 100,
  gold: 0,
  exp: 0,
  type: 'player',
  getMaxHp: function() {
    let maxHP = this.level * 100;
    if (this.hp > maxHP) {
      this.hp = maxHP;
    }
  },
  levelUp: function() {
    if (this.exp >= this.getExpToLevel) {
      this.exp = this.exp - this.getExpToLevel;
      this.level += 1;
      if (this.level === 3) {
        player.skills.push('steal');
      }
    }
  },
  getExpToLevel: function() {
    return this.level * 20;
  },
}; // The player object

// Utility function to print messages with different colors. Usage: print('hello', 'red');
function print(arg, color) {
  if (typeof arg === 'object') console.log(arg);
  else console.log('%c' + arg, `color: ${color};`);
}

// Prints a blue string with the indicated number of dashes on each side of the string. Usage: printSectionTitle('hi', 1) // -hi-
// We set a default value for the count to be 20 (i.e. 20 dashes '-')
function printSectionTitle(title, count = 20) {
  let dashes = '-';
  print(dashes.repeat(count) + title + dashes.repeat(count), 'blue');
}

// Sets the name property for the player and prints a message to notice the user of the change
function setName(name) {
  player.name = name;
  print('player name set to ' + name);
}

// Returns a new object with the same keys and values as the input object
function clone(entity) {}

// returns true or false to indicate whether 2 different objects have the same keys and values
function assertEquality(original, clone) {}

// Uses a player item (note: this consumes the item, need to remove it after use)
// itemName is a string. target is an entity (typically player)
function useItem(itemName, target) {}

// Uses a player skill (note: skill is not consumable, it's useable infinitely besides the cooldown wait time)
// skillName is a string. target is an entity (typically monster).
function useSkill(skillName, target) {}

// Updates the value of 'board' by creating the rows and columns
// First and last rows are walls
// First and last columns are walls
// All the other entities are grass entities
function createBoard(rows, columns) {}

// Updates the board by setting the entity at the entity position
// An entity has a position property, each board cell is an object with an entity property holding a reference to the entity at that position
// When a player is on a board cell, the board cell keeps the current entity property (e.g. monster entity at that position) and may need to have an additional property to know the player is there too.
function updateBoard(entity) {}

// Sets the position property of the player object to be in the middle of the board
// You may need to use Math methods such as Math.floor()
function placePlayer() {}

// Creates the board and places player
function initBoard(rows, columns) {}

// Prints the board
function printBoard() {}

// Creates a monster object with a random name with the specified level, items and position
// The entity properties (e.g. hp, attack, speed) must respect the rules defined in the README
function createMonster(level, items, position) {}

// Creates a tradesman object with the specified items and position. hp is Infinity
function createTradesman(items, position) {}

// Creates an item entity by cloning one of the item objects and adding a the position and type properties.
function createItem(itemIdx, position) {}

// Creates a dungeon entity at the specified position
function createDungeon(position) {}

// Moves the player in the specified direction
// You will need to handle encounters with other entities e.g. fight with monster
function move(direction) {}

function setupPlayer() {
  printSectionTitle('SETUP PLAYER');
  print(
    "Please enter your name using the setName function. Usage: setName('Bob')"
  );
  print("Once you're done, go to the next step with next()");
}

function setupBoard() {
  printSectionTitle('SETUP BOARD');
  print('Please create a board using initBoard(rows, columns)');
  print(
    'Setup monsters, items and more using createMonster(attr), createItem(itemIdx, pos), createTradesman(items, pos), createDungeon(pos), updateBoard(entity)'
  );
  print("Once you're done, go to the next step with next()");
}

function startGame() {
  printSectionTitle('START GAME');
  print('Hello ' + player.name);
  print(
    "You are ready to start your adventure. Use move('U' | 'D' | 'L' | 'R') to get going."
  );
  printBoard();
}

function gameOver() {
  printSectionTitle('GAME OVER');
}

function next() {
  gameStep++;
  run();
}

function run() {
  switch (GAME_STEPS[gameStep]) {
    case 'SETUP_PLAYER':
      setupPlayer();
      break;
    case 'SETUP_BOARD':
      setupBoard();
      break;
    case 'GAME_START':
      startGame();
      break;
  }
}

print('Welcome to the game!', 'gold');
print('Follow the instructions to setup your game and start playing');

run();
