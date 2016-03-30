function Cell (imgId, x, y, width, height) {
	this.imgId = imgId;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

function Img (src ,name, x, y, width, height) {
	this.id = imgs.length;
	this.name = name;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.o = createImg(src);
};

function Button (id, img, x, y, width, height) {
	this.id = id;
	this.img = img;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

function createImg(src) {
	var img = new Image();
	img.src = src;
	img.onload = function () {
		Game.load.push(true);
	};
	return img;
};
function Buffer (animation, x, y) {
	this.curFrame = 0;
	this.img = animation.img;
	this.frames = animation.frames;
	this.tFrames = animation.tFrames;
	this.pos = {
		x: x,
		y: y
	};
	this.width = animation.width;
	this.height = animation.height;
};
function Animation (id, name, img, tFrames, frames) {
	this.id = id;
	this.name = name;
	this.img = img;
	this.width = 32;
	this.height = 32;
	this.tFrames = tFrames;
	this.frames = frames;
	this.curFrame = 0;
	this.pos = {
		x: 0,
		y: 0
	};
};
function Frame (id, y) {
	this.id = id;
	this.x = 0;
	this.y = y;
};
function MessageO (text, size, start, end, color, type, tFrames) {
	this.text = text;
	this.size = size;
	this.x = start.x;
	this.y = start.y;
	this.start = start;
	this.end = end;
	this.color = color;
	this.type = type;
	this.curFrame = 0;
	this.tFrames = tFrames;
};
function MessageS (text, textArr, size, x, y, start, end, color, type, tFrames) {
	this.text = text;
	this.textArr = textArr;
	this.size = size;
	this.x = x;
	this.y = y;
	this.start = start;
	this.end = end;
	this.color = color;
	this.type = type;
	this.curFrame = 0;
	this.tFrames = tFrames;
	this.curText = 0;
}