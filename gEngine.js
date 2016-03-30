var Render = {
	handle: null,
	buffers: [],
	messBuffers: [],
	animId : null,
	main: function (arrMain) {
		arrMain.forEach(function (arrX) {
			arrX.forEach(function (cell) {
				Data.map.drawImage(imgs[cell.imgId].o,
									imgs[cell.imgId].x,
									imgs[cell.imgId].y,
									imgs[cell.imgId].width,
									imgs[cell.imgId].height,
									cell.x + Data.offsetMain.x,
									cell.y + Data.offsetMain.y,
									cell.width,
									cell.height);
			});
		});
	},
	nextElem: function (nextElemErr) {
		nextElemErr.forEach(function (arrX) {
			arrX.forEach(function (cell) {
				Data.map.drawImage(imgs[cell.imgId].o,
									imgs[cell.imgId].x,
									imgs[cell.imgId].y,
									imgs[cell.imgId].width,
									imgs[cell.imgId].height,
									cell.x + Data.offsetNextElem.x,
									cell.y + Data.offsetNextElem.y,
									cell.width,
									cell.height);
			});
		});
	},
	clear: function (x, y, width, height) {
		Data.map.clearRect(x, y, width, height);
	},
	anim: function () {
		Render.buffers.forEach(function (buffer, i) {
			if (buffer.curFrame >= buffer.tFrames) {
				Render.buffers.splice(i, 1);
				return false;
			};
			Render.drawFrame(buffer.img,
							buffer.pos,
							buffer.frames[buffer.curFrame],
							buffer.width,
							buffer.height);
		});
	},
	drawFrame: function (img, pos, frame, width, height) {
		Data.map.drawImage(img, frame.x, frame.y, width, height,
							pos.x + Data.offsetMain.x,
							pos.y + Data.offsetMain.y, width, height);
	},
	showScope: function () {
		Data.map.fillStyle = "#000";
		Data.map.font = "bold 20px Electrolize";
		Data.map.textAlign = "left";
		Data.map.textBaseline = "top";
		Data.map.fillText("Scope: " + Data.scope,
							Data.offsetInfo.x + Data.infoPos.scope.x,
							Data.offsetInfo.y + Data.infoPos.scope.y);
	},
	showLevel: function () {
		Data.map.fillStyle = "#000";
		Data.map.font = "bold 20px Electrolize";
		Data.map.textAlign = "left";
		Data.map.textBaseline = "top";
		Data.map.fillText("Level: " + Data.level,
							Data.offsetInfo.x + Data.infoPos.level.x,
							Data.offsetInfo.y + Data.infoPos.level.y);
	},
	button: function () {
		Data.map.drawImage(Data.buttons[Data.button.main].img.o,
							Data.buttons[Data.button.main].x,
							Data.buttons[Data.button.main].y,
							Data.buttons[Data.button.main].width,
							Data.buttons[Data.button.main].height,
							Data.buttonPos.x,
							Data.buttonPos.y,
							Data.buttons[Data.button.main].width,
							Data.buttons[Data.button.main].height);
	},
	message: function () {
		Render.messBuffers.forEach(function (message) {
			var color = "rgba(" + message.color.r + "," +
									message.color.g + "," +
									message.color.b + "," +
									message.color.a + ")";
			Data.map.fillStyle = color;
			Data.map.font = "bold " + message.size + "px Electrolize";
			Data.map.textAlign = "center";
			Data.map.textBaseline = "middle";
			Data.map.fillText(message.text, message.x, message.y);
		});
	}
};