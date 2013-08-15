function Figure(options) {
	this.options = options;
	this.detailLevel = options.detailLevel;
	this.ctx = options.ctx;
}


Figure.prototype = {
	source: [],
	target: [],
	current: [],
	/**
	 * Создаёт правильный многоугольник, вписанный в единичную окружность с центром в декартовом (0; 0)
	 * @param {number} ribs кол-во рёбер, должно быть делителем detailLevel
	 * @return {Array} of (x, y)
	 */
	_setRibs: function(ribs) {
		var vertices = [],
			points = [],
			ribLength = this.detailLevel / ribs,
			angleStep = Math.PI*2 / ribs;

		// нахожу вершины
		for (var rib = 0; rib < ribs; rib++) {
			//console.log(rib);
			vertices.push({
				// синус и косинус намеренно перепутаны местами
				// чтобы первый угол начинался на 12-ти часах (в самом верху)
				// и далее вершины по часовой стрелке
				// иначе треугольник будет на боку лежать))
				x: Math.sin(angleStep * rib),
				y: Math.cos(angleStep * rib)
			});
		}

		// заполняю рёбра
		vertices.forEach(function(vertex, index) {
			var nextIndex = index + 1 === ribs ? 0 : index + 1,
				nextVertex = vertices[nextIndex],
				xStep = (nextVertex.x - vertex.x) / ribLength,
				yStep = (nextVertex.y - vertex.y) / ribLength;

			for (var i = 0; i < ribLength; i++) {
				points.push({
					x: vertex.x + xStep * i,
					y: vertex.y + yStep * i
				});
			}
		});

		return points
	},

	/**
	 * Заполняет исходную фигуру
	 * @param {number} ribs кол-во рёбер, должно быть делителем detailLevel
	 * @return {Figure}
	 */
	setSource: function(ribs) {
		this.source = this._setRibs(ribs);
		return this
	},

	/**
	 * Заполняет конечную фигуру
	 * @param {number} ribs кол-во рёбер, должно быть делителем detailLevel
	 * @return {Figure}
	 */
	setTarget: function(ribs) {
		this.target = this._setRibs(ribs);
		return this
	},

	/**
	 * Создаёт промежуточный многоугольник
	 * заполняет this.current актуальными значениями
	 * @param {number} progress должен быть в интервале [0; 1]
	 * @return {Figure}
	 */
	interpolate: function(progress) {
		for (var i = 0; i < this.detailLevel; i++) {
			this.current[i] = {
				x: this.source[i].x + progress * (this.target[i].x - this.source[i].x),
				y: this.source[i].y + progress * (this.target[i].y - this.source[i].y)
			}
		}
		return this
	},

	/**
	 * Рисует фигуру
	 * @return {Figure}
	 */
	render: function() {
		var context = this.ctx;

		context.beginPath();

		this.current.forEach(function(point) {
			context.lineTo(point.x * 100 + 500, point.y * 100 + 500);
		});

		context.closePath();
		context.lineWidth = 1;
		context.fillStyle = 'blue';
		context.fill();

		return this
	},

	clear: function() {

	}
};