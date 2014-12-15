var msg = (function () {

	var lastOuterMsg = null;
	var msgDB = [];
    var msgTop = 100;
    var msgRight = 100;	

    var countDownMap = {}


	var tpl = ['<div data-id="' + generateId() + '"  class="coming-msg shadow">',
					'<a target="blank" href="http://example.com" class="block msg ui message small info">',
						'<i class="close-btn close icon"></i>',
		  				'<div class="header">',
		    				'{{title}}',
		  				'</div>',
		  				'<p class="msg-content trans-3">{{detail}}</p>',
					'</a>',
				'</div>'].join("");

	function generateId () {
		return +new Date();
	}

	function render (msg) {
		var result = "";
		result = tpl.replace("{{title}}", msg.title);
		result = result.replace("{{detail}}", msg.detail);

		return $(result);
	}

	function removeMsg (ele, callback) {
		$(ele).animate({
    		right: -100,
    		opacity: 0
    	}, 500, function () {
			$(ele).remove();
			if (callback) callback();
    	});
	}

	function removeOuterMsg () {

	}

	function showMsg (ele, callback) {
		$(ele).css({
			top: msgTop + "px",
			right: msgRight + "px",
			display: "none"
		});

		$(document.body).append($(ele));
		$(ele).transition('vertical  flip', '600ms');

		if (callback) callback();
	}	

	function removeCountDown (msg) {
		var timerEle = $('<span class="timerEle">4</span>');
		var counterEle = $('<div class="ui green  bottom right attached label">秒后消失</div>');
		counterEle.prepend(timerEle);
		msg.find(".message").append(counterEle);

		var count = 4;
		var counter;
		var id = msg.data("id");

		countDownMap[id] = counter = setInterval(function () {
			count--;
			// 如果倒计时完毕
			if (count <= 0) {
				// 清空计时器
				clearInterval(counter);
				// 清空计时表
				countDownMap[id] = null;
				// 移除当前消息
				removeMsg(msg);
				// 已经没有消息暴露在外面了
				lastOuterMsg = null;
				// 计数器+1
				docker.addUnReadCount();
				return;
			}
			timerEle.html(count);
		}, 1000);
	}

	function removeLastOuterMsg (callback) {
		// 如果没有最后一条消息（比如首次到达或者上一条已经计时完关闭了）
		if (!lastOuterMsg) {
			if (callback) callback();
			return;
		}

		// 如果上一条消息真的存在
		removeMsg(lastOuterMsg, function () {
			var lastId = lastOuterMsg.data("id");
			// 清除上一条的倒计时
			clearInterval(countDownMap[lastId]);
			countDownMap[lastId] = null;
			docker.addUnReadCount();
			// 把最后一条消息置空
			lastOuterMsg = null;
			if (callback) callback()
		});
	}



	function Message () {
		this.title = "百度";
		this.detail = "内容内容";
		this.time = +new Date();
		this.url = "http://example.com/";
	}

	function markReaded (msg) {
		msg.removeClass("info")
			.addClass("teal")
			.addClass("readed")
	}

	var msgDB = [];

	var addOne = function () {

		var msg = new Message();
		msgDB.push(msg);

		var elem = render(msg);
		var dockmsg = elem.find(".message").clone().hide();
		
		// 如果docker未展开，则显示弹出对话框
		if (!docker.dockerIsExpand()) {
			
			elem.on("click", function () {
				removeMsg($(this));
				markReaded(dockmsg);

				var id = elem.data("id");
				clearInterval(countDownMap[id]);
				countDownMap[id] = null;				
				lastOuterMsg = null;
			});

			elem.find(".close-btn").on("click", function (e) {

				var id = elem.data("id");
				clearInterval(countDownMap[id]);
				countDownMap[id] = null;
				
				removeMsg(elem);
				lastOuterMsg = null;
				docker.addUnReadCount();

				e.stopPropagation();	
				e.preventDefault();
			});
			
			// 需要移除前一个还在展示的消息
			removeLastOuterMsg(function () {
				// 展示现在的消息
				showMsg(elem);
				// 加入倒计时
				removeCountDown(elem);
				// 标记现在的消息是最后一个消息
				lastOuterMsg = elem;
			})
		}
		// 如果docker已经展开
		else {
			docker.addUnReadCount();
		}

		// 同时在消息栏中插入新消息
		dockmsg.on("click", function () {
			markReaded(dockmsg);
			docker.minusUnReadCount();
		});

		dockmsg.find(".close-btn").on("click", function (e) {

			removeMsg(dockmsg);
			docker.minusUnReadCount();

			e.stopPropagation();	
			e.preventDefault();
		});

		docker.addOneMessage(dockmsg);	
	}

	return {
		come: function () {
			addOne();
		},
		removeMsg: removeMsg,
		removeOuterMsg: function () {
			removeLastOuterMsg();
		}
	}

})();