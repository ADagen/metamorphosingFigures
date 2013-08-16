(function() {

	var canvas = document.getElementsByTagName('canvas')[0],
		ctx = canvas.getContext('2d'),
		width = 0,
		height = 0,
		phase = 0, // 0 - от ромба до треугольника, 1 - от треугольника до круга
		oldScrollPos = -1,
		currentScrollPos = 0,
		touchSensitivity = 150, // сколько пикселей при touchmove равны одному шелчку колёсика

		// положение фигуры:
		figureWidth = 0.1, // 10% от самой маленькой стороны экрана
		xPos = 0.5, // в центре экрана по горизонтали
		startYPos = 0.2,
		yPos = 0.2,
		endYPos = 0.8,


		// измеряется в засечках на колёсике мышки
		scrollPhase = [{
			start: 0,
			end: 15
		}, {
			start: 15,
			end: 30
		}],

		figure = (new Figure({
				detailLevel: 60,
				ctx: ctx
			}))
			.setSource(4)
			.setTarget(3)
			.interpolate(0)
			.setRandomSourceColor()
			.setRandomTargetColor()
			.interpolateColor(0)
			.render();


	//
	function transmission() {
		currentScrollPos = Math.max(currentScrollPos, scrollPhase[0].start);
		currentScrollPos = Math.min(currentScrollPos, scrollPhase[1].end);

		if (oldScrollPos === currentScrollPos) { return	}
		oldScrollPos = currentScrollPos;

		// окончание первой фазы
		if (currentScrollPos > scrollPhase[0].end && phase === 0) {
			phase = 1;
			figure
				.setSource(3)
				.setTarget(60);
		}

		// возврат к первой фазе
		if (currentScrollPos <= scrollPhase[1].start && phase === 1) {
			phase = 0;
			figure
				.setSource(4)
				.setTarget(3);
		}

		if (currentScrollPos == scrollPhase[1].end) figure.setRandomSourceColor();
		if (currentScrollPos == scrollPhase[0].start) figure.setRandomTargetColor();

		// интерполировать относительно только текущей фазы
		var actual = currentScrollPos - scrollPhase[phase].start,
			range =  scrollPhase[phase].end - scrollPhase[phase].start;

		figure
			.interpolate(actual/range)
			.interpolateColor(currentScrollPos/scrollPhase[1].end)
			.clear()
			.render();
	}



	// обслуживание ресайза окна
	(function() {

		function updateCanvas() {
			canvas.width = width;
			canvas.height = height;

			figure
				.setValue('left', width * xPos)
				.setValue('top', height * yPos)
				.setValue('radius', Math.min(width, height) * figureWidth)
				.clear()
				.render();
		}

		var timeout = false;
		function resizeHandler() {
			if (timeout) return;
			timeout = true;
			setTimeout(function() { timeout = false }, 50);

			width = (window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.offsetWidth));
			height = (window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight));

			updateCanvas();
		}

		window.onresize = resizeHandler;
		resizeHandler();
	} ());


	// обслуживание скролла
	(function() {
		canvas.addEventListener("mousewheel", MouseWheelHandler, false);
		canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);

		function MouseWheelHandler(event) {
			var e = window.event || event,
				delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

			currentScrollPos += delta;
			transmission();

			e.preventDefault();
			return false
		}
	} ());


	// поддержка тачскринов
	(function() {
		document.addEventListener("touchmove",   touchMoveHandler);
		document.addEventListener("touchstart",   touchStartHandler);

		var timeout = false,
			oldY = 0;

		function touchStartHandler(e) {
			oldY = e.changedTouches[0].clientY || e.changedTouches[0].pageY;
		}

		function touchMoveHandler(e) {
			if (timeout) return;
			timeout = true;
			setTimeout(function() { timeout = false }, 50);

			var y = e.changedTouches[0].clientY || e.changedTouches[0].pageY,
				deltaY = y - oldY;

			currentScrollPos -= deltaY / touchSensitivity;
			transmission();

			e.preventDefault();
			return false
		}

	} ());

})();

