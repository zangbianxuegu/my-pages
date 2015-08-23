//http://m.zol.com.cn/topic/feima/play.php

var timeRemain = 600, score = 5, started;
var windVelocity = document.getElementById('wind-velocity');
function randomWind() {
	var r = (Math.round(Math.random() * 40) - 20) / 4, v = Math.abs(r);
	windVelocity.setAttribute('data-velocity', v.toFixed(2));
	windVelocity.value = r;
	if (r) {
		fan.style.display = 'block';
		fan.className = r < 0 ? 'right' : 'left';
		flabellum.style.webkitAnimation = flabellum.style.animation = 'none';
		setTimeout(function () {
			flabellum.style.webkitAnimation = flabellum.style.animation = 'rotation-ani ' + (0.5 / v).toFixed(2) + 's linear infinite';
		}, 100);
	} else {
		fan.style.display = 'none';
	}
}

var tipsClosed = 0, tips;
try {
	tipsClosed = sessionStorage.getItem('tips-closed');
} catch (error) {
}
if (tipsClosed !== '1') {
	tips = document.createElement('div');
	tips.id = 'tips';
	canvas.insertBefore(tips, fan);
	tips.addEventListener('tap', function () {
		tips.style.opacity = '0';
		setTimeout(function () {
			tips.parentNode.removeChild(tips);
			randomWind();
			try {
				sessionStorage.setItem('tips-closed', 1);
			} catch (error) {
			}
		});
	});
}

window.addEventListener('load', function () {
	if (!tips) {
		randomWind();
	}
	play.style.visibility = 'visible';

	randomWind();
	arrow.value = 45;
	var arrowDuration = 1500;
	arrow.starttime = new Date().getTime();
	arrow.style[$.transition] = $.CSSTransform + ' linear ' + arrowDuration + 'ms';
	arrow.style[$.CSSTransform] = 'rotate(45deg)';

	setInterval(function () {
		arrow.starttime = new Date().getTime();
		if (arrow.value > 0) {
			arrow.value = -45;
			arrow.style[$.CSSTransform] = 'rotate(-45deg)';
		} else {
			arrow.value = 45;
			arrow.style[$.CSSTransform] = 'rotate(45deg)';
		}
	}, arrowDuration + 100);

	function start() {
		if (started) return;
		started = 1;
		function timeInterval() {
			timeRemain--;
			document.getElementById('time-remain').innerHTML = timeRemain ? (timeRemain + 1000 + '').substr(2, 2) : '0';
			if (timeRemain === 0) {
				clearInterval(timeout);
				over.classList.add('visible');
				o_fail.classList.add('visible');
			}
			if (score == 0) {
				clearInterval(timeout);
			};
		}
		timeInterval();
		var timeout = setInterval(timeInterval, 1000);
	}
	function getArrowValue() {
		var value = arrow.value - -45;
		var time = new Date().getTime() - parseInt(arrow.starttime);
		var offset = Math.min(1, time / arrowDuration) * 90;
		value = value ? (offset) : (90 - offset);
		value -= 45;
		return value;
	}

	var lastTarget = 0, targeted = 0, dismiss;
	function throwAppIcon(icon) {
		var wind = parseFloat(windVelocity.value) || 0;
		var dir = getArrowValue() + wind * 9;
		if (dir > 25) dir = 25;
		else if (dir < -25) dir = -25;
		var offsetX, offsetY;
		if (dir < 0) {
			icon.classList.remove('r1');
			icon.classList.add('r2');
		} else {
			icon.classList.remove('r2');
			icon.classList.add('r1');
		}

		increment.classList.remove('visible');
		increment.classList.remove('dismiss');
		if (Math.abs(dir) <= 7) {
			// 在角度 7° 范围内算进
			var offsetDir = dir;
			if (dir > 2) offsetDir = 2;
			else if (dir < -2) offsetDir = -2;
			offsetX = parseInt(offsetDir * 640 / 45);
			offsetY = 800;
			var trashicon = document.createElement('div');
			trashicon.style.visibility = 'hidden';
			trash.appendChild(trashicon);
			trashicon.className = 'trashicon ' + throwIcon.className;
			if (dismiss) {
				clearTimeout(dismiss);
				dismiss = 0;
			}
			setTimeout(function () {
				trashicon.style.visibility = 'visible';
				icon.style.visibility = 'hidden';
				var x = dir * 3;
				var y = Math.round(Math.random() * (12 - Math.abs(x)));
				var z = Math.round(Math.random() * 60) - 30;
				trashicon.style[$.CSSTransform] = 'translate(' + x + 'px,' + (120 + y) + 'px) skew(' + z + 'deg) scaleX(.5) scaleY(.2)';
				increment.setAttribute('data-value', lastTarget + 1);
				increment.classList.add('visible');
				dismiss = setTimeout(function () {
					increment.classList.add('dismiss');
				}, 700);
				score--;
				if (score < 0) score = 0;
				document.getElementById('score').innerHTML = score;
				if (score == 0) {
					over.classList.add('visible');
					o_success.classList.add('visible');
				};
			}, 1000);

		} else {
			// 未成功添加进列表
			var iconClassNames = String(throwIcon.className),
				cnArr = iconClassNames.split(' '),
				iconClassName = cnArr[0];
			var list = document.querySelector('#icons ul'),
				li = document.createElement('li');
			li.className = iconClassName;
			list.appendChild(li);

			offsetX = parseInt(dir * 1136 / 45);
			offsetY = 1136;
			lastTarget = 0;
		}
		icon.style[$.CSSTransform] = 'translate(' + offsetX + 'px,-' + offsetY + 'px) scale(.7)';
	}

	var icons = document.querySelectorAll('#icons li'), throwIcon = throwing.querySelector('div');
	throwIcon.className = document.querySelector('#icons .current').className;
	var enabled = true;
	function swipeAppIcon(e) {
		// if (!timeRemain) return;
		start();
		var current = document.querySelector('#icons .current'), next;
		if (current && enabled) {
			// 最后一个的情况
			if (!current.nextElementSibling) {
				var lastIcon = current.cloneNode();
				lastIcon.classList.remove('current');
				current.parentNode.appendChild(lastIcon);
				next = lastIcon;
			} else {
				next = current.nextElementSibling;
			}

			current.classList.add('throwing');
			throwing.classList.remove('back');
			throwing.style.visibility = 'visible';
			setTimeout(function () {
				throwAppIcon(throwing);
			}, 0);
			enabled = false;
			if (next) {
				setTimeout(function () {
					throwing.classList.remove('throwing');
					throwing.classList.remove('r1');
					throwing.classList.remove('r2');
					current.classList.remove('current');
					var transform = 'translate(' + (next.parentNode.getBoundingClientRect().right - next.getBoundingClientRect().right - 20) + 'px,0)';
					next.parentNode.style[$.CSSTransform] = transform;
					throwing.classList.add('back');

					setTimeout(function () {
						throwing.style[$.CSSTransform] = 'none';
						throwIcon.className = next.className;
						setTimeout(function () {
							throwing.classList.remove('back');
						}, 100);
						enabled = true;
					}, 200);
					next.classList.add('current');
					randomWind();
				}, 1000);
			} 
		}
	}
	document.getElementById('screen').addEventListener('swipeup', swipeAppIcon);
	document.addEventListener('keydown', function (e) {
		if (e.keyCode === 38) {
			swipeAppIcon(e);
		}
	});

	var agins = document.querySelectorAll('.agin');
	for (var i = 0; i < agins.length; i++) {
		agins[i].addEventListener('tap', function(){
			window.history.go(0);
		});
	};
});