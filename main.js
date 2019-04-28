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

function getPlayerPosition() {
  return board[player.position.row][player.position.column];
}

function getEntity() {
  return getPlayerPosition()[0];
}

const RARITY_LIST = ['Common', 'Unusual', 'Rare', 'Epic'];
const items = [
  {
    name: 'Common potion',
    type: 'potion',
    value: 5,
    rarity: 0,
    use: function(target) {
      target.hp += 25;
      target.resetToMaxHp();
      print('Used potion! +25hp (Total HP: ' + target.hp + ')', 'green');
    },
  },
  {
    name: 'Unusual potion',
    type: 'potion',
    value: 10,
    rarity: 1,
    use: function(target) {
      target.hp += 50;
      target.resetToMaxHp();
      print('Used potion! +50hp (Total HP: ' + target.hp + ')', 'green');
    },
  },
  {
    name: 'Rare potion',
    type: 'potion',
    value: 20,
    rarity: 2,
    use: function(target) {
      target.hp += 100;
      target.resetToMaxHp();
      print('Used potion! +100hp (Total HP: ' + target.hp + ')', 'green');
    },
  },
  {
    name: 'Epic potion',
    type: 'potion',
    value: 50,
    rarity: 3,
    use: function(target) {
      target.hp = Infinity;
      target.resetToMaxHp();
      print('Used potion! +100%hp (Total HP: ' + target.hp + ')', 'green');
    },
  },
  {
    name: 'Common bomb',
    type: 'bomb',
    value: 7,
    rarity: 0,
    use: function(target) {
      target.hp -= 50;
      if (target.hp < 0) {
        target.hp = 0;
      }
      print('Used bomb!', 'orange');
      print(target.name + ' hit! -50hp', 'purple');
      print('HP left: ' + target.hp, 'purple');
    },
  },
  {
    name: 'Unusual bomb',
    type: 'bomb',
    value: 12,
    rarity: 1,
    use: function(target) {
      target.hp -= 100;
      if (target.hp < 0) {
        target.hp = 0;
      }
      print('Used bomb!', 'orange');
      print(target.name + ' hit! -100hp', 'purple');
      print('HP left: ' + target.hp, 'purple');
    },
  },
  {
    name: 'Rare bomb',
    type: 'bomb',
    value: 25,
    rarity: 2,
    use: function(target) {
      target.hp -= 200;
      if (target.hp < 0) {
        target.hp = 0;
      }
      print('Used bomb!', 'orange');
      print(target.name + ' hit! -200hp', 'purple');
      print('HP left: ' + target.hp, 'purple');
    },
  },
  {
    name: 'Epic bomb',
    type: 'bomb',
    value: 100,
    rarity: 3,
    use: function(target) {
      print('Used bomb!', 'orange');
      print(target.name + ' hit!' + target.hp + 'hp', 'purple');
      target.hp = 0;
      print('HP left: ' + target.hp, 'purple');
    },
  },
  {
    name: 'key',
    type: 'key',
    value: 150,
    rarity: 3,
    use: function(target) {
      target.isLocked = false;
      print('Unlocking dungeon...', 'red');
      isUnlocked();
    },
  },
]; // Array of item objects. These will be used to clone new items with the appropriate properties.
const GAME_STEPS = ['SETUP_PLAYER', 'SETUP_BOARD', 'GAME_START'];
let gameStep = 0; // The current game step, value is index of the GAME_STEPS array.
let board = []; // The board holds all the game entities. It is a 2D array.

const player = {
  name: '',
  level: 1,
  items: [],
  attack: 10,
  speed: 3000,
  hp: 100,
  gold: 0,
  exp: 0,
  type: 'player',
  resetToMaxHp: function() {
    let maxHP = this.level * 100;
    if (this.hp > maxHP) {
      this.hp = maxHP;
    }
  },
  levelUp: function() {
    if (this.exp >= this.getExpToLevel()) {
      this.exp = this.exp - this.getExpToLevel();
      this.level += 1;
      this.hp = this.level * 100;
      print('Level up! Level: ' + player.level);
    }
  },
  getExpToLevel: function() {
    return this.level * 20;
  },
  visual: 'P',
}; // The player object

const grass = {
  type: 'grass',
  visual: '.',
};

const wall = {
  type: 'wall',
  visual: '#',
};

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

// Returns a new object with the same keys and values as the input object
function clone(entity) {
  return Object.assign({}, entity);
}

// // returns true or false to indicate whether 2 different objects have the same keys and values
// function assertEqual(obj1, obj2) {}

// Clones an array of objects
// returns a new array of cloned objects. Useful to clone an array of item objects
function cloneArray(objs) {
  let cloneArray = [];
  for (var i = 0; i < objs.length; i++) {
    cloneArray[i] = clone(objs[i]);
  }
  return cloneArray;
}

// Uses a player item (note: this consumes the item, need to remove it after use)
// itemName is a string, target is an entity (i.e. monster, tradesman, player, dungeon)
// If target is not specified, item should be used on player for type 'potion'. Else, item should be used on the entity at the same position
// First item of matching type is used
function useItem(itemName, target) {
  let creature = getEntity();
  let usedItem;
  for (let i = 0; i < player.items.length; i++) {
    if (itemName === player.items[i].name) {
      usedItem = player.items[i];
      switch (usedItem.type) {
        case 'potion':
          if (target == undefined) {
            target = player;
          }
          usedItem.use(target);
          break;
        case 'bomb':
          if (target === undefined) {
            if (creature.type === 'monster' || creature.type === 'tradesman') {
              target = creature;
            } else {
              target = player;
            }
          }
          usedItem.use(target);
          break;
        case 'key':
          if (target === undefined) {
            target = creature;
          }
          if (target.type === 'dungeon') {
            usedItem.use(target);
          } else {
            print('You cannot use this item here');
          }
          break;
      }
      return;
    }
  }
  print('You do not have such item!');
}

// Uses a player skill (note: skill is not consumable, it's useable infinitely besides the cooldown wait time)
// skillName is a string. target is an entity (typically monster).
// If target is not specified, skill shoud be used on the entity at the same position
function useSkill(skillName, target = getEntity()) {
  if (target.type === 'monster' || target.type === 'tradesman') {
    switch (skillName) {
      case 'confuse':
        print('Confusing ' + target.name + '...');
        target.name = target.name.split('');
        target.name = target.name.reverse();
        target.name = target.name.join('');
        print(
          '...' +
            target.name +
            ' is confused! it hurts itself in its confusion!',
          'red'
        );
        target.hp -= target.attack;
        print(target.name + ' hit! -' + target.attack + 'hp', 'purple');
        print('HP LEFT: ' + target.hp, 'purple');
        break;
      case 'steal':
        if (player.level >= 3) {
          const basicItems = target.items.filter(item => item.rarity <= 1);
          player.items = player.items.concat(basicItems);
          target.items = target.items.filter(item => item.rarity > 1);
          print('Succesfully stole items:');
          print(basicItems);
        } else {
          print('Your level is too low. Required level 3');
        }
    }
    return;
  }
  print('Now is not the time to use that!');
}

function checkRarity(item) {
  return item.rarity <= 1;
}
function buy(itemIdx) {
  const creature = getEntity();
  if (creature.type === 'tradesman') {
    if (player.gold >= creature.items[itemIdx].value) {
      player.gold -= creature.items[itemIdx].value;
      player.items.push(creature.items[itemIdx]);
      print('Purchased  ' + creature.items[itemIdx].name);
      creature.items.splice(itemIdx, 1);
      print('Gold :' + player.gold);
    } else {
      print(
        'Not enough gold :( Required: ' +
          creature.items[itemIdx].value +
          ', gold: ' +
          player.gold +
          ')'
      );
    }
  } else {
    print('Young punk get off my lawn');
  }
}

function sell(itemIdx) {
  const creature = getEntity();
  if (creature.type === 'tradesman') {
    player.gold += player.items[itemIdx].value;
    creature.items.push(player.items[itemIdx]);
    print('Sold  ' + player.items[itemIdx].name);
    player.items.splice(itemIdx, 1);
    print('Gold :' + player.gold);
  } else {
    print('Young punk get off my lawn');
  }
}

// Sets the board variable to a 2D array of rows and columns
// First and last rows are walls
// First and last columns are walls
// All the other entities are grass entities
function createBoard(rows, columns) {
  for (let i = 0; i < rows; i++) {
    board.push([]);
    for (let j = 0; j < columns; j++) {
      if (i === 0 || i === rows - 1 || j === 0 || j === columns - 1) {
        board[i][j] = [
          { type: 'wall', visual: '#', position: { row: i, column: j } },
        ];
      } else {
        board[i][j] = [
          { type: 'grass', visual: '.', position: { row: i, column: j } },
        ];
      }
    }
  }
}

// Updates the board by setting the entity at the entity position
// An entity has a position property, each board cell is an object with an entity property holding a reference to the entity at that position
// When a player is on a board cell, the board cell keeps the current entity property (e.g. monster entity at that position) and may need to have an additional property to know the player is there too.
function updateBoard(entity) {
  board[entity.position.row][entity.position.column].pop();
  board[entity.position.row][entity.position.column].push(entity);
}

// Sets the position property of the player object to be in the middle of the board
// You may need to use Math methods such as Math.floor()
function placePlayer() {
  player.position = {
    row: Math.floor(board.length / 2),
    column: Math.floor(board[0].length / 2),
  };
  getPlayerPosition().push(player);
}

// Creates the board and places player
function initBoard(rows, columns) {
  createBoard(rows, columns);
  placePlayer();
  print('Creating board and placing Player...');
}

// Prints the board
function printBoard() {
  for (let i = 0; i < board.length; i++) {
    let rowlog = '';
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j][1] === player) {
        rowlog += board[i][j][1].visual;
      } else {
        rowlog += board[i][j][0].visual;
      }
    }
    print(rowlog);
  }
}

// Sets the player variable to a player object based on the specifications of the README file
// The items property will need to be a new array of cloned item objects
// Prints a message showing player name and level (which will be 1 by default)
function createPlayer(name, level = 1, items = []) {
  player.name = name;
  player.level = level;
  player.hp = level * 100;
  player.items = cloneArray(items);
  player.speed = 3000 / player.level;
  player.attack = 10 * player.level;
  print('Create player with name ' + name + ' and level ' + level);
}

// Creates a monster object with a random name with the specified level, items and position
// The items property will need to be a new array of cloned item objects
// The entity properties (e.g. hp, attack, speed) must respect the rules defined in the README
function createMonster(level, items, position) {
  let monster = {
    name: monsterNames[Math.floor(Math.random() * 14)],
    level,
    hp: level * 100,
    attack: level * 10,
    speed: 6000 / level,
    items: cloneArray(items),
    position,
    type: 'monster',
    visual: 'M',
    resetToMaxHp: function() {
      let maxHP = this.level * 100;
      if (this.hp > maxHP) {
        this.hp = maxHP;
      }
    },
    getExp: function() {
      player.exp += this.level * 10;
      player.levelUp();
    },
  };
  print('Creating monster...');
  return monster;
}

// Creates a tradesman object with the specified items and position. hp is Infinity
// The items property will need to be a new array of cloned item objects
function createTradesman(items, position) {
  let tradesman = {
    name: 'Mysterious trader',
    hp: Infinity,
    items: cloneArray(items),
    position,
    type: 'tradesman',
    visual: 'T',
    resetToMaxHp: function() {
      let maxHP = this.level * 100;
      if (this.hp > maxHP) {
        this.hp = maxHP;
      }
    },
  };
  print('Creating tradesman...');
  return tradesman;
}

// Creates an item entity by cloning one of the item objects and adding the position and type properties.
// item is a reference to one of the items in the items variable. It needs to be cloned before being assigned the position and type properties.
function createItem(item, position) {
  let object = clone(item);
  object.position = position;
  object.type = 'item';
  object.visual = 'I';
  print('Creating item...');
  return object;
}

// Creates a dungeon entity at the specified position
// The other parameters are optional. You can have unlocked dungeons with no princess for loot, or just empty ones that use up a key for nothing.
function createDungeon(
  position,
  isLocked = true,
  hasPrincess = true,
  items = [],
  gold = 0
) {
  let dungeon = {
    isLocked,
    hasPrincess,
    items,
    gold,
    position,
    type: 'dungeon',
    visual: 'D',
  };
  return dungeon;
}

// Moves the player in the specified direction
// You will need to handle encounters with other entities e.g. fight with monster
function move(direction) {
  getPlayerPosition().pop();
  switch (direction) {
    case 'U':
      if (
        board[player.position.row - 1][player.position.column][0].type ===
        'wall'
      ) {
        print('You bumped into a wall loser!');
      } else {
        player.position.row -= 1;
      }
      break;
    case 'D':
      if (
        board[player.position.row + 1][player.position.column][0].type ===
        'wall'
      ) {
        print('You bumped into a wall loser!');
      } else {
        player.position.row += 1;
      }
      break;
    case 'L':
      if (
        board[player.position.row][player.position.column - 1][0].type ===
        'wall'
      ) {
        print('You bumped into a wall loser!');
      } else {
        player.position.column -= 1;
      }
      break;
    case 'R':
      if (
        board[player.position.row][player.position.column + 1][0].type ===
        'wall'
      ) {
        print('You bumped into a wall loser!');
      } else {
        player.position.column += 1;
      }
      break;
  }
  getPlayerPosition().push(player);
  verifyPosition();
  printBoard();
}

function verifyPosition() {
  const creature = getEntity();
  switch (creature.type) {
    case 'tradesman':
      print(
        'Encountered Mysterious trader! You can buy(itemIdx) and sell(itemIdx) items $$$'
      );
      print('Items for sale:');
      console.log(creature.items);
      break;
    case 'monster':
      print('Encountered a ' + creature.name + '!');
      intervalFunct();
      break;
    case 'dungeon':
      print('Found the dungeon!');
      isUnlocked();
      break;
    case 'item':
      print('Found item! ' + creature.name);
      player.items = player.items.concat(creature);
      getPlayerPosition().shift();
      getPlayerPosition().unshift(grass);
      break;
  }
}

function isUnlocked() {
  const creature = getEntity();
  if (creature.isLocked === false) {
    print('The dungeon is unlocked!');
    if (creature.hasPrincess === true) {
      print('You have freed the princess! Congratulations!');
      print(
        'the adventurer ' +
          player.name +
          ' and the princess lived happily ever after...'
      );
      return gameOver();
    }
    print(
      'Thank you ' + player.name + '! But our princess is in another castle!'
    );
    print(
      'As consolation, you found ' +
        creature.items.length +
        ' items and ' +
        creature.gold +
        ' gold.'
    );
    player.items = player.items.concat(creature.items);
    player.gold += creature.gold;
    print(creature.items);
    print('You now have ' + player.gold + ' gold.');
    creature.items = [];
    creature.gold = 0;
    return;
  }
  print(
    "You need the key to open it. If you have the key, try useItem('key') to unlock the door."
  );
  print(
    "Rumours are some monsters have keys to dungeons. the trade sman might also have spare keys to sell but they don't come cheap"
  );
}

let intervalPlayer;
let intervalMonster;

function intervalFunct() {
  const creature = getEntity();
  intervalPlayer = setInterval(function() {
    playerAttack();
  }, player.speed);
  intervalMonster = setInterval(function() {
    monsterAttack();
  }, creature.speed);
}

function playerAttack() {
  const creature = getEntity();
  creature.hp -= player.attack;
  if (creature.hp <= 0) {
    creature.hp = 0;
  }
  print(creature.name + ' hit! - ' + player.attack + 'hp', 'purple');
  print('HP left: ' + creature.hp, 'purple');
  if (creature.hp === 0) {
    print(creature.name + ' defeated.');
    print(
      'Congratulations! You have received ' +
        creature.level * 10 +
        ' exp points.'
    );
    creature.getExp();
    print('You received the following items:');
    print(creature.items);
    player.items = player.items.concat(creature.items);
    getPlayerPosition().shift();
    getPlayerPosition().unshift(grass);
    printBoard();
    clearTimeout(intervalMonster);
    clearTimeout(intervalPlayer);
  }
}

function monsterAttack() {
  const creature = getEntity();
  player.hp -= creature.attack;
  if (player.hp <= 0) {
    player.hp = 0;
  }
  print(player.name + ' hit! - ' + creature.attack + 'hp', 'red');
  print('HP left: ' + player.hp, 'red');
  if (player.hp === 0) {
    print("You're dead to me!");
    gameOver();
    clearTimeout(intervalPlayer);
    clearTimeout(intervalMonster);
  }
}

function setupPlayer() {
  printSectionTitle('SETUP PLAYER');
  print(
    "Please create a player using the createPlayer function. Usage: createPlayer('Bob')"
  );
  print(
    "You can optionally pass in a level and items, e.g. createPlayer('Bob', 3, [items[0], items[2]]). items[0] refers to the first item in the items variable"
  );
  print("Once you're done, go to the next step with next()");
}

function setupBoard() {
  printSectionTitle('SETUP BOARD');
  print('Please create a board using initBoard(rows, columns)');
  print(
    'Setup monsters, items and more using createMonster(attr), createItem(item, pos), createTradesman(items, pos), createDungeon(pos), updateBoard(entity)'
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
