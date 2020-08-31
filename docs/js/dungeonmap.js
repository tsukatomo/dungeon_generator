/*
  create rogue-like dungeon map
*/

// CONSTANTS
let maptype = Object.freeze({
  wall: {
    name: 'wall',
    id: 0
  },
  boundary: {
    name: 'boundary',
    id: 1
  },
  room: {
    name: 'room',
    id: 2
  },
  aisle: {
    name: 'aisle',
    id: 3
  }
});

let MIN_ROOM_SIZE = 5;
let MIN_RECT_REGION_SIZE = MIN_ROOM_SIZE + 2;

/* object constructors */
// dungeon room object
function Room(x0, y0, x1, y1) {
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  this.width = x1 - x0 + 1;
  this.height = y1 - y0 + 1;
}

// rectangle region object
function RectRegion(x0, y0, x1, y1, room) {
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  this.width = x1 - x0 + 1;
  this.height = y1 - y0 + 1;
  this.room = room;
}

// dungeon map object
function DungeonMap(width, height) {
  this.width = width;
  this.height = height;
  this.rectList = [new RectRegion(0, 0, width - 1, height - 1, null)];
  this.map = new Array(width);
  for (let x = 0; x < width; x++){
    this.map[x] = new Array(height).fill(maptype.wall);
  }
}

DungeonMap.prototype.getMapAt = function (x, y) {
  return this.map[x][y];
};

DungeonMap.prototype.reset = function (width, height) {
  this.width = width;
  this.height = height;
  this.rectList = [new RectRegion(0, 0, width - 1, height - 1, null)];
  this.map = new Array(width);
  for (let x = 0; x < width; x++){
    this.map[x] = new Array(height).fill(maptype.wall);
  }
};

/*
DungeonMap.prototype.createDungeon = function (numberOfRoom) {
  this.splitMap(numberOfRoom);
  this.createRoom();
  this.createAisle();
};
*/

DungeonMap.prototype.createDungeon = function (width, height, numberOfRoom) {
  this.reset(width, height);
  this.splitMap(numberOfRoom);
  this.createRoom();
  this.createAisle();
};

DungeonMap.prototype.splitMap = function (numberOfRoom) {
  for (let i = 0; i < numberOfRoom - 1; i++) {
    //this.shuffleRectList();
    this.sortRectListByMaxLength();
    if (this.rectList[this.rectList.length - 1].width >= this.rectList[this.rectList.length - 1].height) {
      this.splitRectVertically();
    }
    else {
      this.splitRectHorizontally();
    }
  }
};

DungeonMap.prototype.shuffleRectList = function () {
  let temp;
  for (let i = 0; i < this.rectList.length - 1; i++) {
    let j = randInt(i, this.rectList.length - 1);
    temp = this.rectList[i];
    this.rectList[i] = this.rectList[j];
    this.rectList[j] = temp;
  }
};

DungeonMap.prototype.sortRectListByMaxLength = function () {
  this.rectList.sort((rect1, rect2) => {
    return Math.max(rect1.width, rect1.height) - Math.max(rect2.width, rect2.height);
  });
};


DungeonMap.prototype.splitRectVertically = function () {
  // If the width is too small, do nothing
  if (this.rectList[this.rectList.length - 1].width < 2 * MIN_RECT_REGION_SIZE + 1) return;
  // Split rect0 into rect1 and rect2 (rect 0 is the last element of rectList)
  let rect0 = this.rectList.pop();
  let splitX = randInt(rect0.x0 + MIN_RECT_REGION_SIZE, rect0.x1 - MIN_RECT_REGION_SIZE);
  let rect1 = new RectRegion(rect0.x0, rect0.y0, splitX - 1, rect0.y1);
  let rect2 = new RectRegion(splitX + 1, rect0.y0, rect0.x1, rect0.y1);
  this.rectList.push(rect1, rect2);
  // Reflect the split line to dungeon map as boundary
  for (let i = rect0.y0; i <= rect0.y1; i++) {
    this.map[splitX][i] = maptype.boundary;
  }
};

DungeonMap.prototype.splitRectHorizontally = function () {
  // If the height is too small, do nothing
  if (this.rectList[this.rectList.length - 1].height < 2 * MIN_RECT_REGION_SIZE + 1) return;
  // Split rect0 into rect1 and rect2 (rect 0 is the last element of rectList)
  let rect0 = this.rectList.pop();
  let splitY = randInt(rect0.y0 + MIN_RECT_REGION_SIZE, rect0.y1 - MIN_RECT_REGION_SIZE);
  let rect1 = new RectRegion(rect0.x0, rect0.y0, rect0.x1, splitY - 1);
  let rect2 = new RectRegion(rect0.x0, splitY + 1, rect0.x1, rect0.y1);
  this.rectList.push(rect1, rect2);
  // Reflect the split line to dungeon map as boundary
  for (let i = rect0.x0; i <= rect0.x1; i++) {
    this.map[i][splitY] = maptype.boundary;
  }
};

DungeonMap.prototype.createRoom = function () {
  this.rectList.forEach((elem) => {
    // Create room and add room data to rectangle list
    let roomWidth  = randInt(MIN_ROOM_SIZE, elem.width  - 2);
    let roomHeight = randInt(MIN_ROOM_SIZE, elem.height - 2);
    let roomX0 = randInt(elem.x0 + 1, elem.x1 - roomWidth );
    let roomY0 = randInt(elem.y0 + 1, elem.y1 - roomHeight);
    let roomX1 = roomX0 + roomWidth  - 1;
    let roomY1 = roomY0 + roomHeight - 1;
    elem.room = new Room(roomX0, roomY0, roomX1, roomY1);
    // Reflect the room to dungeon map
    for (let j = roomY0; j <= roomY1; j++) {
      for (let i = roomX0; i <= roomX1; i++) {
        this.map[i][j] = maptype.room;
      }
    }
  });
};

DungeonMap.prototype.createAisle = function () {
  this.shuffleRectList();
  for (let j = 0; j < this.rectList.length; j++) {
    for (let i = 0; i < this.rectList.length; i++) {
      if (i === j) continue;
      if (this.isAdjacentVertically(this.rectList[i], this.rectList[j])) {
        this.createAisleVertically(this.rectList[i], this.rectList[j]);
      }
      else if (this.isAdjacentHorizontally(this.rectList[i], this.rectList[j])) {
        this.createAisleHorizontally(this.rectList[i], this.rectList[j]);
      }
    }
  }
};

DungeonMap.prototype.isAdjacentVertically = function (rect1, rect2) {
  if (rect1.x1 < rect2.x0 || rect2.x1 < rect1.x0) return false;
  if (rect2.y0 != rect1.y1 + 2) return false;
  return true;
};

DungeonMap.prototype.isAdjacentHorizontally = function (rect1, rect2) {
  if (rect1.y1 < rect2.y0 || rect2.y1 < rect1.y0) return false;
  if (rect2.x0 != rect1.x1 + 2) return false;
  return true;
};

DungeonMap.prototype.createAisleVertically = function (rect1, rect2) {
  // Augument error check
  if (rect1.x1 < rect2.x0 || rect2.x1 < rect1.x0) return 1;
  if (rect2.y0 != rect1.y1 + 2) return 1;
  // Set start and end point of aisle
  let aisleStartX = randInt(rect1.room.x0, rect1.room.x1);
  let aisleEndX = randInt(rect2.room.x0, rect2.room.x1);
  // Check if aisle is already exist or not
  let aisleL = aisleStartX < aisleEndX ? aisleStartX : aisleEndX;
  let aisleR = aisleStartX < aisleEndX ? aisleEndX : aisleStartX;
  for (let i = aisleL - 1; i <= aisleR + 1; i++) {
    if (this.map[i][rect1.y1 + 1].id === maptype.aisle.id) return 1;
  }
  // Make Aisle
  for (let i = aisleL; i <= aisleR; i++) {
    this.map[i][rect1.y1 + 1] = maptype.aisle;
  }
  for (let i = rect1.room.y1 + 1; i <= rect1.y1; i++) {
    this.map[aisleStartX][i] = maptype.aisle;
  }
  for (let i = rect2.y0; i <= rect2.room.y0 - 1; i++) {
    this.map[aisleEndX][i] = maptype.aisle;
  }
};

DungeonMap.prototype.createAisleHorizontally = function (rect1, rect2) {
  // Augument error check
  if (rect1.y1 < rect2.y0 || rect2.y1 < rect1.y0) return 1;
  if (rect2.x0 != rect1.x1 + 2) return 1;
  // Set start and end point of aisle
  let aisleStartY = randInt(rect1.room.y0, rect1.room.y1);
  let aisleEndY = randInt(rect2.room.y0, rect2.room.y1);
  // Check if aisle is already exist or not
  let aisleU = aisleStartY < aisleEndY ? aisleStartY : aisleEndY;
  let aisleD = aisleStartY < aisleEndY ? aisleEndY : aisleStartY;
  for (let i = aisleU - 1; i <= aisleD + 1; i++) {
    if (this.map[rect1.x1 + 1][i].id === maptype.aisle.id) return 1;
  }
  // Make Aisle
  for (let i = aisleU; i <= aisleD; i++) {
    this.map[rect1.x1 + 1][i] = maptype.aisle;
  }
  for (let i = rect1.room.x1 + 1; i <= rect1.x1; i++) {
    this.map[i][aisleStartY] = maptype.aisle;
  }
  for (let i = rect2.x0; i <= rect2.room.x0 - 1; i++) {
    this.map[i][aisleEndY] = maptype.aisle;
  }
};

/* useful function */
// get random integer (min ~ max)
function randInt(min, max) {
  let minInt = Math.ceil(min);
  let maxInt = Math.floor(max);
  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}
