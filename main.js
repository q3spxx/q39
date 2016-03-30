var Data = {
	canvas: {
		width: 720,
		height: 660
	},
	offsetMain: {
		x: 200,
		y: 10
	},
	offsetNextElem: {
		x: 540,
		y: 10
	},
	offsetInfo: {
		x: 50,
		y: 10
	},
	infoPos: {
		scope: {
			x: 0,
			y: 0
		},
		level: {
			x: 0,
			y: 40
		}
	},
	elemPos: {
		x: 0,
		y: 0
	},
	nextElemPos: {
		x: 0,
		y: 0
	},
	stage: 0,
	speed: 50,
	time: 1000,
	movingHandle: null,
	collisionSide: true,
	angle: 0,
	mainArr: [],
	nextElemArr: [],
	curElem: null,
	nextElem: null,
	map: null,
	scope: 0,
	level: 0,
	animArr: [],
	buttons: [],
	button: {
		main: 0,
		normal: 0,
		hover: 1
	},
	buttonPos: {
		x: 540,
		y: 200
	}
};

var imgs = [];

var Game = {
	setDefault: function () {
		Data.elemPos.x = 0;
		Data.elemPos.y = 0;
		Data.speed = 50;
		Data.time = 1000;
		Data.movingHandle = null;
		Data.collisionSide = true;
		Data.angle = 0;
		Data.curElem = null;
		Data.nextElem = null;
		Data.scope = 0;
		Data.level = 0;
		Data.mainArr.forEach(function (arrX) {
			arrX.forEach(function (cell) {
				cell.imgId = 0;
			});
		});
		Data.nextElemArr.forEach(function (arrX) {
			arrX.forEach(function (cell) {
				cell.imgId = 0;
			});
		});
	},
	handle: null,
	load: [],
	onload: function () {
		if (imgs.length > Game.load.length) {
			return false;
		};
		clearInterval(Game.handle);
		Game.continueInit();
	},
	continueInit: function () {
		Game.createMainArr();
		Game.createNextElemArr();
		Game.anim();
		Anim.cFHandle = setInterval(Anim.changeFrame, 30);
		Messages.cFHandle = setInterval(Messages.changeFrame, 30);
		Game.controls.on();
	},
	start: function () {
		Data.level = 1;
		var random = Game.getRandom();
		Data.nextElem = elems[random];
		Data.nextElem.id = random;
		Game.changeElem();
	},
	changeElem: function () {
		var gameOver = Eng.elem();
		if (gameOver) {
			return false;
		};
		Eng.clearNextElem();
		var random = Game.getRandom();
		Data.nextElem = elems[random];
		Data.nextElem.id = random;
		Eng.alignNextElem();
		Eng.addNextElem();
		Eng.startMoving();
	},
	getRandom: function () {
		var random;
		var arr = [0, 1, 2, 3, 4, 5, 6];
		var temp = arr;
		while (temp.length != 1) {
			temp = Game.randomArr(arr);
			if (temp.length > 0) {
				arr = temp;
			};
			if (temp.length == 0) {
				temp = arr;
			};
		};
		random = temp[0]
		return random;
	},
	randomArr: function (arr) {
		var tmp;
		tmp = arr.filter(function (num) {
			random = Math.round(Math.random());
			if (random == 0) {
				return false;
			} else {
				return true;
			};
		});
		return tmp;
	},
	checkGameOver: function () {
		var elem = Data.curElem.pos[Data.angle];
		for (var i = 0; i < elem.length; i++) {
			if (Data.mainArr[Data.elemPos.x + elem[i].x]
							[Data.elemPos.y + elem[i].y].imgId == 1) {
				return true;
			};
		};
		return false;
	},
	gameOver: function () {
		Data.button.main = 0;
		Data.button.normal = 0;
		Data.button.hover = 1;
		Data.stage = 0;
		Game.keydown.off();
		Messages.gameOver();
	},
	controls: {
		on: function () {
			document.addEventListener("mousemove", Controls.handle);
			document.addEventListener("click", Controls.handle);
		},
		off: function () {
			document.removeEventListener("mousemove", Controls.handle);
			document.removeEventListener("click", Controls.handle);
		}
	},
	keydown: {
		on: function () {
			document.addEventListener("keydown", Controls.handle);
		},
		off: function () {
			document.removeEventListener("keydown", Controls.handle);
		}
	},
	anim: function () {
		Render.clear(0, 0,
						Data.canvas.width,
						Data.canvas.height);
		Render.main(Data.mainArr);
		Render.nextElem(Data.nextElemArr);
		Render.showScope();
		Render.showLevel();
		Render.anim();
		Render.button();
		Render.message();
		window.requestAnimationFrame(Game.anim);
	},
	init: function () {
		var canvas = document.getElementById("map");
		canvas.width = Data.canvas.width;
		canvas.height = Data.canvas.height;
		Data.map = canvas.getContext("2d");

		Game.initImgs();
		Game.initButtons();
		Anim.init();
		Game.handle = setInterval(Game.onload, 200);
	},
	initButtons: function () {
		for (var i = 0; i < 6; i++) {
			var button = new Button(Data.buttons.length, imgs[2], 0, i * 30, 70, 30);
			Data.buttons.push(button);
		};
	},
	addPoints: function (points) {
		Data.scope = Data.scope + points;
		Game.checkNextLevel();
	},
	checkNextLevel: function () {
		var level = Data.scope / 2000
		level = Number(level.toFixed(0)) + 1;
		if (level > Data.level) {
			Data.level = level;
			Data.time = Math.round(Data.time - Math.sqrt(Math.pow(Data.speed, 2) + Math.pow(Data.level, 2)));
		};
	},
	createMainArr: function () {
		var x = 32;
		var y = 32;
		for (var xI = 0; xI < 10; xI++) {
			var temp = [];
			for (var yI = 0; yI < 20; yI++) {
				var cell = new Cell(0, x * xI, y * yI, 32, 32);
				temp.push(cell);
			};
			Data.mainArr.push(temp);
		};
	},
	createNextElemArr: function () {
		var x = 32;
		var y = 32;
		for (var xI = 0; xI < 4; xI++) {
			var temp = [];
			for (var yI = 0; yI < 4; yI++) {
				var cell = new Cell(0, x * xI, y * yI, 32, 32);
				temp.push(cell);
			};
			Data.nextElemArr.push(temp);
		};
	},

	initImgs: function () {
		imgs.push(new Img("cell.png", "cell", 0, 0, 32, 32));
		imgs.push(new Img("square.png", "square", 0, 0, 32, 32));
		imgs.push(new Img("buttons.png", "buttons", 0, 0, 70, 180));
	},
	handleEndCycle: function () {
		var lines = Eng.lineCheck();
		if (lines == false) {
			return false;
		};
		lines.forEach(function (line) {
			Eng.delLine(line);
		});
	}
};

window.onload = Game.init;