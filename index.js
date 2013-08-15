(function() {

	var canvas = document.getElementsByTagName('canvas')[0],
		ctx = canvas.getContext('2d'),
		width = 0,
		height = 0,

		figureWidth = 0.2,

		startYPos = 0.2,
		currentYPos = 0.2,
		endYPos = 0.8,

		currentXPos = 0.5,


		startScrollPos = 0,
		currentScrollPos = 0,
		endScrollPos = 30, // количество срабатываний колёсика

		figure = new Figure({
			detailLevel: 60,
			ctx: ctx
		});

	figure.setSource(4)
		.setTarget(60)
		.interpolate(0);
	var interpolate = 0;
	setInterval(function() {
		figure.interpolate(++interpolate/100).render();
	}, 100);

	// обслуживание ресайза окна
	(function() {
		var timeout = false;

		function updateCanvas() {
			canvas.width = width;
			canvas.height = height;

			figure.render();
		}

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
			var e = window.event || event, // old IE support
				delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

			currentScrollPos -= delta;
			currentScrollPos = Math.max(currentScrollPos, startScrollPos);
			currentScrollPos = Math.min(currentScrollPos, endScrollPos);

			console.log(currentScrollPos, delta);

			return false;
		}
	} ());

})();

