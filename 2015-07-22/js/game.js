// Canvas 
var canvas  = document.getElementById('canvas');
var ctx     = canvas.getContext('2d');
var level   = 1;
var total   = 3;
var arr     = [1,2,3,4,5,6,7];
var arr_num = [];
var l       = 0;
var score   = 0;
var startTime = +new Date();
var pos = [[{
	'x': 0,
	'y': 0,
	'w': 150,
	'h': 150
},{
	'x': 150,
	'y': 0,
	'w': 150,
	'h': 150
},{
	'x': 75,
	'y': 150,
	'w': 150,
	'h': 150
}],[{
	'x': 0,
	'y': 0,
	'w': 150,
	'h': 150
},{
	'x': 150,
	'y': 0,
	'w': 150,
	'h': 150
},{
	'x': 0,
	'y': 150,
	'w': 150,
	'h': 150
},{
	'x': 150,
	'y': 150,
	'w': 150,
	'h': 150
}],[{
	'x': 50,
	'y': 0,
	'w': 100,
	'h': 100
},{
	'x': 150,
	'y': 0,
	'w': 100,
	'h': 100
},{
	'x': 50,
	'y': 100,
	'w': 100,
	'h': 100
},{
	'x': 150,
	'y': 100,
	'w': 100,
	'h': 100
},{
	'x': 100,
	'y': 200,
	'w': 100,
	'h': 100
}],[{
	'x': 50,
	'y': 0,
	'w': 100,
	'h': 100
},{
	'x': 150,
	'y': 0,
	'w': 100,
	'h': 100
},{
	'x': 50,
	'y': 100,
	'w': 100,
	'h': 100
},{
	'x': 150,
	'y': 100,
	'w': 100,
	'h': 100
},{
	'x': 50,
	'y': 200,
	'w': 100,
	'h': 100
},{
	'x': 150,
	'y': 200,
	'w': 100,
	'h': 100
}],[{
	'x': 50,
	'y': 0,
	'w': 100,
	'h': 100
},{
	'x': 150,
	'y': 0,
	'w': 100,
	'h': 100
},{
	'x': 0,
	'y': 100,
	'w': 100,
	'h': 100
},{
	'x': 100,
	'y': 100,
	'w': 100,
	'h': 100
},{
	'x': 200,
	'y': 100,
	'w': 100,
	'h': 100
},{
	'x': 50,
	'y': 200,
	'w': 100,
	'h': 100
},{
	'x': 150,
	'y': 200,
	'w': 100,
	'h': 100
}]];

var image = new Image();
image.src = 'http://2.zol-img.com.cn/zt/tm_55a/e166bbb807/image.png';
image.onload = function(){
	init();
};
image.p
function init(){
	// Get nums array
	function getNums(arr, num) {
	    var temp_array = new Array();
	    for (var index in arr) {
	        temp_array.push(arr[index]);
	    }
	    var nums = new Array();
	    for (var i = 0; i<num; i++) {
	        if (temp_array.length>0) {
	            var arrIndex = Math.floor(Math.random()*temp_array.length);
	            nums[i] = temp_array[arrIndex];
	            temp_array.splice(arrIndex, 1);
	        } else {
	            break;
	        }
	    }
	    return nums;
	}
	var nums = getNums(arr,  total);
	var num  = getNums(nums, 1);

	// Make show different every level
	if (arr_num.length > 0) {
		function in_arry(s, a){
			for (var i in a) {
				if (a[i] == s) {
					return true;
				}
			};
			return false;
		}
		(function fac(b){
			if (b == true) {
				nums = getNums(arr,  total);
				num  = getNums(nums, 1);
				fac(in_arry(num[0], arr_num));
			} else {
				arr_num.push(num[0]);
				return;
			}
		})(in_arry(num[0], arr_num));
	} else {
		arr_num.push(num[0]);
	}
	// console.log(nums);
	// console.log(num);
	// console.log(arr_num);

	// L
	for (var i = 0; i < nums.length; i++) {
		if (nums[i] == num[0]) {
			l = i;
		};
	};

	// show
	function imageShow(){
		ctx.clearRect(0, 0, 300, 300);
		document.documentElement.style.pointerEvents = 'none';
		ctx.drawImage(image, (300*(num[0]-1)), 0, 300, 300, 0, 0, 300, 300);
		count.classList.add('animation');
		tips.innerHTML = '<span>\u8BF7\u8BB0\u4F4F\u8FD9\u4E2A\u6307\u7EB9</span>';
	}
	imageShow();

	// play
	function imagePlay(){
		ctx.clearRect(0, 0, 300, 300);
		document.documentElement.style.pointerEvents = 'all';
		for (var i = 0, len = nums.length; i < len; i++) {
			ctx.drawImage(image, (300*(nums[i]-1)), 0, 300, 300, pos[level-1][i].x, pos[level-1][i].y, pos[level-1][i].w, pos[level-1][i].h);
		};
		count.classList.remove('animation');
		tips.innerHTML = '\u521A\u624D\u7684\u6307\u7EB9\u662F\u54EA\u4E2A\uFF1F';
	};
	setTimeout(function(){
		imagePlay();
	}, 3000)
}

// Touch
canvas.addEventListener(Event.Touch.move,Event.preventDefault);
canvas.addEventListener(Event.Touch.up,Event.preventDefault);
canvas.addEventListener(Event.Touch.down,function(e){
	Event.preventDefault(e);
	e = e.changedTouches && e.changedTouches[0];
	var bound = this.getBoundingClientRect();
	var x     = e.pageX - bound.left;
	var y     = e.pageY - bound.top;
	var x_min = pos[level-1][l].x;
	var x_max = pos[level-1][l].x + pos[level-1][l].w;
	var y_min = pos[level-1][l].y;
	var y_max = pos[level-1][l].y + pos[level-1][l].h;

	var f     = pop_up.querySelector('.pop-up-failed');
	var s     = pop_up.querySelector('.pop-up-success');
	var f_b   = f.querySelector('.button');
	var s_b   = s.querySelector('.button');
	var s_l   = s.querySelector('.level');
	var sa    = pop_up.querySelector('.pop-up-success-all');
	var time  = sa.querySelector('span.time');
	
	pop_up.classList.add('visible');
	f.classList.contains('visible') && f.classList.remove('visible');
	s.classList.contains('visible') && s.classList.remove('visible');
	sa.classList.contains('visible') && sa.classList.remove('visible');

	if (x > x_min && x < x_max && y > y_min && y < y_max) {
		if (level < 5) {
			level++;
			total++;

			s.classList.add('visible');
			s_l.innerHTML = parseInt(level);
			s_b.addEventListener('tap', function(){
				pop_up.classList.remove('visible');
				s.classList.remove('visible');
				s_b.next && clearTimeout(s_b.next);
				s_b.next = setTimeout(init, 0);
			});
		} else {
			sa.classList.add('visible');
			var endTime = +new Date();
			var ss = (endTime - startTime)/1000;
			var m  = parseInt(Math.floor(ss/60));
			var s  = (ss%60).toFixed(2);
			var t  = ss/60 < 1 ? (s + '\u79D2') : (m + '\u5206' + s + '\u79D2');
			time.innerHTML = t;
			score = ss;
		}
	} else {
		f.classList.add('visible');
		f_b.addEventListener('tap', function(){
			pop_up.classList.remove('visible');
			f.classList.remove('visible');
		});
	}
});

// Submit
var pattern = new RegExp(phone.getAttribute('partten'));
window.onload = function(){
	var storageTel = localStorage.getItem('tel');
	if(storageTel){
		phone.value = storageTel;	
	};
	form.check();
}
form.check = function(){
	submit.disabled = (phone.value.length===11) ? false : true;	
};
phone.addEventListener('input',form.check);
phone.addEventListener('focus',form.check);
if (submit) {
	form.addEventListener('submit', function(e){
		e.preventDefault();
		var phoneValue = phone.value;
		if(!pattern.test(phoneValue)){
			alert('\u8bf7\u586b\u5199\u6b63\u786e\u624b\u673a\u53f7'); // 请填写正确手机号
		} else {
			submit.disabled = true;
			$.ajax({
				type:this.method,
				url:this.action,
				data:{'action': 'adduser', 'tel': phoneValue, 'ctime': score},
				dataType:'jsonp',
				success:function(response){
					if(response && response.result){
						localStorage.setItem('tel',phoneValue);
						submit.style.pointerEvents = 'none';
						alert('\u63D0\u4EA4\u6210\u529F'); // 提交成功
						location.href = 'http://m.zol.com.cn/topic/5316018.html';
					}else{
						submit.disabled = false;
						alert('\u63D0\u4EA4\u5931\u8D25'); // 提交失败	
					}
				},
				error:function(){
					submit = false;
					alert('\u8bf7\u586b\u5199\u6b63\u786e\u624b\u673a\u53f7'); // 请填写正确手机号
				}	
			})
		}
	});
};
submit_no.addEventListener('tap', function(e){
	e.preventDefault();
	location.href = 'http://m.zol.com.cn/topic/5316018.html';
});