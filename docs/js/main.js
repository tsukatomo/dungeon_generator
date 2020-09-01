/*
  main.js
*/

// get elements in html
let dungeonWidth = document.getElementById("width");
let dungeonHeight = document.getElementById("height");
let dungeonRoom = document.getElementById("room");
let createButton = document.getElementById("create");
let canvas = document.getElementById('main_lay');
let ctx = canvas.getContext('2d');

let resetCanvas = function () {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// drawing func
let drawDungeon = function (dung) {
  //console.log(dungeon.map);
  //console.log(dung.rectList);
  // reset canvas
  resetCanvas();
  // draw dungeon map to canvas
  let fillColor = {
    'wall': 'dimgray',
    'boundary': 'dimgray', //'silver',
    'room': 'yellow',
    'aisle': 'darkorange' //'red'
  };
  let strokeColor = 'black';
  let strokeWidth = 2.0;
  let squareSize = 8.0;
  let dungeonDrawWidth = squareSize * dung.width;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  for (let y = 0; y < dung.height; y++) {
    for (let x = 0; x < dung.width; x++) {
      ctx.strokeRect(squareSize * x + (canvas.width - dungeonDrawWidth) / 2, squareSize * y, squareSize, squareSize);
      ctx.fillStyle = fillColor[dung.getMapAt(x, y).name];
      ctx.fillRect(squareSize * x + (canvas.width - dungeonDrawWidth) / 2, squareSize * y, squareSize, squareSize);
    }
  }
};

// draw text to top of canvas
let drawTextToCanvas = function (text) {
  resetCanvas();
  // draw text
  ctx.font = '20px ＭＳ ゴシック';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'center';
  ctx.fillStyle = 'red';
  ctx.fillText(text, canvas.width / 2, 32);
};

// onload func (create first dungeon)
window.onload = function () {
  let dungeon = new DungeonMap(48, 48);
  dungeon.createDungeon(48, 48, 8);
  drawDungeon(dungeon);
};

// create button - onclick
createButton.addEventListener('click', (e) => {
  // input error check
  if (+dungeonWidth.value < +dungeonWidth.min || +dungeonWidth.value > +dungeonWidth.max){
    drawTextToCanvas('エラー：幅の値が不正です');
    return;
  }
  if (+dungeonHeight.value < +dungeonHeight.min || +dungeonHeight.value > +dungeonHeight.max){
    drawTextToCanvas('エラー：高さの値が不正です');
    return;
  }
  if (+dungeonRoom.value < +dungeonRoom.min || +dungeonRoom.value > +dungeonRoom.max){
    drawTextToCanvas('エラー：部屋数の値が不正です');
    return;
  }
  // create dungeon
  let dungeon = new DungeonMap(48, 48);
  dungeon.createDungeon(+dungeonWidth.value, +dungeonHeight.value, +dungeonRoom.value);
  drawDungeon(dungeon);
});
