window.onload = function(){
	// 各種データを宣言
	// 画面サイズ
	size = {
		main:{ w:500*2, h:300*2 },
		map:{ w:150*2, h:150*2 }
	};
	// 自機を描く位置の調整
	shiftY = -27;
	// 位置・角度を初期化
	x = -300; y = -300; rad = 0;
	
	// キャンバスを宣言(コンテキストだけでよさそう)
	var body = document.getElementsByTagName("body").item(0); 
	
	var mapCanvas = document.createElement('canvas');
	mapCanvas.width = size.map.w/2;
	mapCanvas.height = size.map.h/2;
	mapCanvas.style.display = 'none';
	body.appendChild(mapCanvas);
	
	var lineCanvas = document.createElement('canvas');
	lineCanvas.width = size.map.w/2;
	lineCanvas.height = 1;
	lineCanvas.style.display = 'none';
	body.appendChild(lineCanvas);
	
	canvas = {
		main : document.getElementById('mainCanvas'),
		map  : mapCanvas,
		line : lineCanvas
	};
	context = {
		main : canvas.main.getContext('2d'),
		map  : canvas.map.getContext('2d'),
		line : canvas.line.getContext('2d')
	};
	
	// DPIのうんぬん
	for(n in canvas){
        oldWidth = canvas[n].width;
        oldHeight = canvas[n].height;
        canvas[n].width = oldWidth * 2;
        canvas[n].height = oldHeight * 2;
        canvas[n].style.width = oldWidth + 'px';
        canvas[n].style.height = oldHeight + 'px';
	}
	
	// 画像をロード
	me = new Image();
	me.src = '/img/me.png' + '?' + new Date().getTime();
	map = new Image();
	map.src = '/img/circuit01.png' + '?' + new Date().getTime();
	
	// メイン処理へ
	map.onload = function(){
		setInterval("enterFrame()" , 1000/30);
	}
}

function enterFrame(){
	// キー操作
	if(input_key_buffer[37]){
		rad += 0.1;
	}
	if(input_key_buffer[39]){
		rad -= 0.1;
	}
	if(input_key_buffer[38]){
		y += Math.cos(rad)*5;
		x += Math.sin(rad)*5;
	}
	
	// マップを描画
	drawMap();
}

function drawMap(){
	// マップキャンバスに回転・移動したマップ画像を描画
	context.map.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), size.map.w/2, size.map.h+shiftY);
    context.map.translate(-size.map.w/2, -(size.map.h+shiftY)); 
	context.map.drawImage(map, x, y);
	
	// 自機っぽいのをマップキャンバスに描画。影…
	context.map.setTransform(Math.cos(0), Math.sin(0), -Math.sin(0), Math.cos(0), 0, 0);
	context.map.translate(0, 0); 
	context.map.fillStyle = 'rgba(0, 0, 0, 0.5)';
	context.map.fillRect(size.map.w/2-3, size.map.h+shiftY-3, 6, 10);
	
	// マップキャンバスをget→ラインキャンバスにput→サイズ変更してメインキャンバスにdraw
	// 遠くのものは細く短く、近くのものは太く長く表示させることで3Dっぽくしている
	for(var i=0; i<size.map.h; i++){
		for(var u=i; (size.main.h/(size.map.h-u)*15)-(size.main.h/(size.map.h-i)*15)<3; u++){}
		i = u ;
		imageData = context.map.getImageData(0, i, size.map.w, 1);
		context.line.putImageData(imageData, 0, 0);
		wi = size.main.w/(size.map.h-i)*size.map.h;
		he = size.main.h/(size.map.h-i)*12;
		context.main.drawImage(canvas.line, (size.main.w-wi)/2, he+100, wi, he/2);
		if(he>size.main.h) break;
	}
	
	// 自機を描画
	//context.main.drawImage(me, size.main.w/2-150, size.main.h/3*1-30);
}

// キー入力関連
input_key_buffer = new Array();
document.onkeydown = function (e){
	if(!e) e = window.event;
	input_key_buffer[e.keyCode] = true;
}
document.onkeyup = function (e){
	if(!e) e = window.event;
	input_key_buffer[e.keyCode] = false;
}
