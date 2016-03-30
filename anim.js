var Anim = {
	ready: false,
	load: [],
	handle: null,
	cFHandle: null,
	dir: "anim/",
	files: ["bang.png"],
	onload: function () {
		if (Anim.load.length < 26) {
			return false;
		};
		clearInterval(Anim.handle);
		Anim.ready = true;
	},
	init: function () {
		Anim.files.forEach(function (file) {
			var id = Data.animArr.length;
			var name = file.split(".");
			name = name[0];
			var img = new Image();
			img.src = file;
			img.onload = function () {
				Anim.load.push(true);
			};
			var tFrames = img.height / 32;
			var frames = Anim.getFrames(tFrames);
			var animation = new Animation(id, name, img, tFrames, frames);
			Data.animArr.push(animation);
		});
		Anim.handle = setInterval(Anim.onload, 200);
	},
	getFrames: function (tFrames) {
		var frames = [];
		for (var i = 0; i < tFrames; i++) {
			var frame = new Frame(i, i * 32);
			frames.push(frame);
		};
		return frames;
	},
	render: function (animId, x, y) {
		var buffer = new Buffer(Data.animArr[animId], x, y);
		Render.buffers.push(buffer);
	},
	changeFrame: function () {
		Render.buffers.forEach(function (buffer, i) {
				Render.buffers[i].curFrame = buffer.curFrame + 1;
		});
	}
};
var Messages = {
	cFHandle: null,
	show: function (text, type, color, start, end, tFrames) {
	},
	gameOver: function () {
		var color = {
			r: 0,
			g: 0,
			b: 0,
			a: 0.7
		};
		var start = {
			x: -160,
			y: 280
		};
		var end = {
			x: 360,
			y: 280
		};
		var message = new MessageO("Game Over", 60, start, end, color, 0, 20);
		Render.messBuffers.push(message);
	},
	counting: function () {
		var color = {
			r: 0,
			g: 0,
			b: 0,
			a: 0.7
		};
		var start = 500;
		var end = 60;
		var textArr = ["5", "4", "3", "2", "1", "Go!"];
		var message = new MessageS(textArr[0], textArr, start, 360, 280, start, end, color, 1, 20);
		Render.messBuffers.push(message);
	},
	changeFrame: function () {
		Render.messBuffers.forEach(function (message, i) {
			if (message.type == 0) {
				message.curFrame = message.curFrame + 1;
				var res = Messages.offsetHandler(message);
				if (res == false) {
					return false;
				};
				message.x = res.x;
				message.y = res.y;
			} else if (message.type == 1) {
				message.curFrame = message.curFrame + 1;
				var res = Messages.sizeHandler(message);
				if (res == false) {
					Messages.delMessages();
					return false;
				};
				message.text = res.text;
				message.curFrame = res.curFrame;
				message.curText = res.curText;
				message.size = res.size;
			};
		});
	},
	offsetHandler: function (message) {
		if (message.curFrame > message.tFrames) {
			return false;
		};
		var dX = message.end.x - message.start.x;
		var dY = message.end.y - message.start.y;
		var step = {
			x: dX / message.tFrames,
			y: dY / message.tFrames
		};
		var res = {
			x: message.x + step.x,
			y: message.y + step.y
		}
		return res;
	},
	sizeHandler: function (message) {
		if (message.curFrame == message.tFrames &&
			message.curText == message.textArr.length - 1) {
			return false;
		};
		if (message.curFrame == message.tFrames) {
			message.curFrame = 0;
			message.curText = message.curText + 1;
			message.text = message.textArr[message.curText];
			message.size = message.start;
		} else {
			var step = (message.start - message.end) / message.tFrames;
			message.size = message.size - step;
		};
		var res = {
			text: message.text,
			curText: message.curText,
			curFrame: message.curFrame,
			size: message.size
		};
		return res;
	},
	delMessages: function () {
		Render.messBuffers = [];
	}
};