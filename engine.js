var Eng = {
	elem: function () {
		Data.curElem = Data.nextElem;
		Data.curElem.id = Data.nextElem.id;
		Data.angle = 0;
		Data.elemPos.x = 0;
		Data.elemPos.y = 0;
		Eng.alignElem();
		if (Game.checkGameOver()) {
			Game.gameOver();
			return true;
		};
		Eng.addElem();
		return false;
	},
	addElem: function () {
		Data.curElem.pos[Data.angle].forEach(function (square, i) {
			Data.mainArr[Data.elemPos.x + square.x]
						[Data.elemPos.y + square.y].imgId = 1;
		});
	},
	clearElem: function () {
		Data.curElem.pos[Data.angle].forEach(function (square, i) {
			Data.mainArr[Data.elemPos.x + square.x]
						[Data.elemPos.y + square.y].imgId = 0;
		});
	},
	addNextElem: function () {
		Data.nextElem.pos[0].forEach(function (square) {
			Data.nextElemArr[Data.nextElemPos.x + square.x]
							[Data.nextElemPos.y + square.y].imgId = 1;
		});
	},
	clearNextElem: function () {
		if (Data.nextElem == null) {
			return false;
		};
		Data.nextElem.pos[0].forEach(function (square) {
			Data.nextElemArr[Data.nextElemPos.x + square.x]
							[Data.nextElemPos.y + square.y].imgId = 0;
		});
	},
	alignNextElem: function () {
		Data.nextElemPos.x = 0;
		Data.nextElemPos.y = 0;
		var width = 0;
		var height = 0;
		Data.nextElem.pos[0].forEach(function (square) {
			if (square.x > width) {
				width = square.x;
			};
			if (square.y > height) {
				height = square.y;
			};
		});
		if (width < 2) {
			Data.nextElemPos.x = 1;
		};
		if (height < 2) {
			Data.nextElemPos.y = 1;
		};
	},
	alignElem: function () {
		var length = 0;
		for (var i = 0; i < 4; i++) {
			var tempLength;
			var tempLength = Data.curElem.pos[Data.angle].filter(function (square) {
				if (square.y == i) {
					return true;
				} else {
					return false;
				};
			});
			if (tempLength.length > length) {
				length = tempLength.length;
			};
		};
		if (length == 4) {
			Data.elemPos.x = 3;
		} else {
			Data.elemPos.x = 4;
		};
	},
	startMoving: function () {
		Data.movingHandle = setInterval(Eng.moving, Data.time);
	},
	stopMoving: function () {
		clearInterval(Data.movingHandle);
	},
	moving: function () {
		var offset = {
			x: 0,
			y: 1,
			angle: Data.angle
		};
		var res = Collision.check(offset);
		if (res) {
			Eng.stopMoving();
			Game.handleEndCycle();
			Game.changeElem();
			return false;
		};
		Eng.clearElem();
		Data.elemPos.x = Data.elemPos.x + offset.x;
		Data.elemPos.y = Data.elemPos.y + offset.y;
		Data.angle = offset.angle;
		Eng.addElem();
	},
	lineCheck: function () {
		var lines = [];
		line: for (var y = 0; y < 20; y++) {
			for (var x = 0; x < 10; x++) {
				if (Data.mainArr[x][y].imgId == 0) {
					continue line;
				};
			};
			lines.push(y);
		};
		if (lines.length > 0) {
			return lines;
		} else {
			return false;
		};
	},
	delLine: function (line) {
		for (var x = 0; x < 10; x++) {
			Data.mainArr[x][line].imgId = 0;
			Anim.render(0, Data.mainArr[x][line].x, Data.mainArr[x][line].y);
		};
		setTimeout(function () {
			Eng.offsetLines(line);
		}, 200);
		Game.addPoints(200);
	},
	offsetLines: function (line) {
		var elem = Data.curElem.pos[Data.angle];
		for (var y = line; y >= 0; y--) {
			outer: for (var x = 0; x < 10; x++) {
				for (var i = 0; i < elem.length; i++) {
					if (x == elem[i].x + Data.elemPos.x &&
						y - 1 == elem[i].y + Data.elemPos.y) {
						continue outer;
					};
					if (x == elem[i].x + Data.elemPos.x &&
						y == elem[i].y + Data.elemPos.y) {
						continue outer;
					};
				};
				if (y == 0) {
					Data.mainArr[x][y].imgId = 0;
					continue;
				};
				Data.mainArr[x][y].imgId = Data.mainArr[x][y - 1].imgId;
			};
		};
	}
};

var Collision = {
	square: null,
	checkWalls: function (offset) {
		var newPos = {
			x: Data.elemPos.x + offset.x,
			y: Data.elemPos.y + offset.y,
			angle: offset.angle
		};
		var squares = Data.curElem.pos[newPos.angle];
		for (var i = 0; i < squares.length; i++) {
			if (newPos.x + squares[i].x < 0) {
				Collision.square = {
					x: newPos.x + squares[i].x,
					y: newPos.y + squares[i].y
				};
				return true;
			};
			if (newPos.y + squares[i].y < 0) {
				Collision.square = {
					x: newPos.x + squares[i].x,
					y: newPos.y + squares[i].y
				};
				return true;
			};
			if (newPos.x + squares[i].x > 9) {
				Collision.square = {
					x: newPos.x + squares[i].x,
					y: newPos.y + squares[i].y
				};
				return true;
			};
			if (newPos.y + squares[i].y > 19) {
				Collision.square = {
					x: newPos.x + squares[i].x,
					y: newPos.y + squares[i].y
				};
				return true;
			};
		};
		return false;
	},
	checkSquares: function (offset) {
		var newPos = {
			x: Data.elemPos.x + offset.x,
			y: Data.elemPos.y + offset.y,
			angle: offset.angle
		};
		var curPos = Data.curElem.pos[Data.angle];
		var squares = Data.curElem.pos[newPos.angle];
		squares = squares.filter(function (square) {
			for (var i = 0; i < curPos.length; i++) {
				if (curPos[i].x + Data.elemPos.x == square.x + newPos.x &&
					curPos[i].y + Data.elemPos.y == square.y + newPos.y) {
					return false;
				};
			};
			return true;
		});
		for (var i = 0; i < squares.length; i++) {
			var x = squares[i].x + newPos.x;
			var y = squares[i].y + newPos.y;
			if (Data.mainArr[x][y].imgId == 1) {
				Collision.square = {
					x: x,
					y: y
				};
				return true;
			};
		};
		return false;

	},
	handle: function (offset) {
		var sideX = 0;
		var sideY = 0;
		var width = 0;
		var height = 0;
		var newOffset = offset;
		Data.curElem.pos[Data.angle].forEach(function (square) {
			if (square.x > width) {
				width = square.x;
			};
			if (square.y > height) {
				height = square.y;
			};
		});
		if (Data.elemPos.x + width > Collision.square.x) {
			sideX = 1;
		} else if (Data.elemPos.x + width < Collision.square.x) {
			sideX = -1;
		} else {
			sideX = 0;
		};
		if (Data.elemPos.y + height > Collision.square.y) {
			sideY = 1;
		} else if (Data.elemPos.y + height < Collision.square.y) {
			sideY = -1;
		} else {
			sideY = 0;
		};
		if (Data.curElem.id == 0) {			
			for (var i = 1; i < 3; i++) {
				var test = {
					x: newOffset.x,
					y: newOffset.y,
					angle: newOffset.angle
				};
				test.y = test.y + sideY * i;
				res = Collision.check(test);
				if (res == false) {
					newOffset.y = test.y;
					return newOffset;
				};
				test.y = newOffset.y;
				test.x = test.x + sideX * i;
				var res = Collision.check(test);
				if (res == false) {
					newOffset.x = test.x;
					return newOffset;
				};
			};
		} else {
			for (var i = 1; i < 3; i++) {
				var test = {
					x: newOffset.x,
					y: newOffset.y,
					angle: newOffset.angle
				};
				test.x = test.x + sideX * i;
				var res = Collision.check(test);
				if (res == false) {
					newOffset.x = test.x;
					return newOffset;
				};
				test.x = newOffset.x;
				test.y = test.y + sideY * i;
				res = Collision.check(test);
				if (res == false) {
					newOffset.y = test.y;
					return newOffset;
				};
			};
		};
		return false;

	},
	check: function (offset) {
		var walls = Collision.checkWalls(offset);
		if (walls) {
			return true;
		};
		var squares = Collision.checkSquares(offset);
		if (squares) {
			return true;
		};
		return false;
	}
};

var Controls = {
	handle: function (e) {
		if (e.keyCode == 37) {
			Actions.moveLeft();
		} else if (e.keyCode == 38) {
			Actions.changeAngle();
		} else if (e.keyCode == 39) {
			Actions.moveRight();
		} else if (e.keyCode == 40) {
			Actions.moveDown()
		};
		if (e.type == "mousemove") {
			Actions.mouseMove(Controls.buttonHandler(e));
		};
		if (e.type == "click") {
			Actions.mouseClick(Controls.buttonHandler(e));
		};
	},
	buttonHandler: function (e) {
		if (e.offsetX > Data.buttonPos.x &&
			e.offsetY > Data.buttonPos.y &&
			e.offsetX < Data.buttonPos.x + Data.buttons[Data.button.main].width &&
			e.offsetY < Data.buttonPos.y + Data.buttons[Data.button.main].height) {
			return true;
		};
		return false;
	}
};

var Actions = {
	mouseMove: function (action) {
		if (action) {
			document.getElementById("map").style.cursor = "pointer";
			Data.button.main = Data.button.hover;
		} else {
			document.getElementById("map").style.cursor = "default";
			Data.button.main = Data.button.normal;
		};
	},
	mouseClick: function (action) {
		if (action) {
			if (Data.stage == 0) {
				Data.button.normal = 2;
				Data.button.hover = 3;
				Data.stage = 1;
				Game.setDefault()
				Game.keydown.on();
				Messages.delMessages();
				Messages.counting();
				Game.controls.off();
				setTimeout(Game.controls.on, 3600);
				setTimeout(Game.start, 3500);
			} else if (Data.stage == 1) {
				Data.button.normal = 4;
				Data.button.hover = 5;
				Data.stage = 2;
				Game.keydown.off();
				Eng.stopMoving();
			} else if (Data.stage == 2) {
				Data.button.normal = 2;
				Data.button.hover = 3;
				Data.stage = 1;
				Game.keydown.on();
				Eng.startMoving();
			};
		};
	},
	moveDown: function () {
		var offset = {
			x: 0,
			y: 1,
			angle: Data.angle
		};
		if (Collision.check(offset)) {
			return false;
		};
		Eng.clearElem();
		Actions.setPos(offset);
		Eng.addElem();
		Game.addPoints(5);
	},
	moveRight: function () {
		var offset = {
			x: 1,
			y: 0,
			angle: Data.angle
		};
		if (Collision.check(offset)) {
			return false;
		};
		Eng.clearElem();
		Actions.setPos(offset);
		Eng.addElem();
	},
	moveLeft: function () {
		var offset = {
			x: -1,
			y: 0,
			angle: Data.angle
		};
		if (Collision.check(offset)) {
			return false;
		};
		Eng.clearElem();
		Actions.setPos(offset);
		Eng.addElem();
	},
	changeAngle: function () {
		var newAngle;
		if (Data.angle == 3) {
			newAngle = 0;
		} else {
			newAngle = Data.angle + 1;
		};
		var offset = {
			x: 0,
			y: 0,
			angle: newAngle
		};
		if (Collision.check(offset)) {
			var res = Collision.handle(offset);
			if (res != false) {
				offset = res;
			} else {
				return false;
			};
		};
		Eng.clearElem();
		Actions.setPos(offset);
		Eng.addElem();
	},
	setPos: function (offset) {
		Data.elemPos.x = Data.elemPos.x + offset.x;
		Data.elemPos.y = Data.elemPos.y + offset.y;
		Data.angle = offset.angle;
	}
};