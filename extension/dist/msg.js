var msg = (function () {

	var lastOuterMsg = null;
	var msgDB = [];
    var msgTop = 100; 
    var msgRight = 100;	

    var countDownMap = {}
    var readedArr = [];


	var tpl = ['<div data-id="' + generateId() + '"  class="coming-msg shadow">',
					'<a target="blank" href="{{url}}" class="block msg ui message small info">',
						'<i  class="close-btn custom-icon del-icon"></i>',
						'<i style="display:none;" class="share-btn custom-icon share-icon"></i>',
						'<i style="display:none;" class="custom-icon fav-icon fav-icon-no"></i>',
		  				'<div class="header">',
		    				'{{website}}',
		  				'</div>',
		  				'<p class="msg-content trans-3">{{detail}}</p>',
					'</a>',
				'</div>'].join("");

	$(function () {
		$("#docker-message .message").on("click", function () {
			var target = $(this);
			var id = target.data("id");
			markReaded($(this));

			if (readedArr.indexOf(id) == -1) {
				readedArr.push(id);
				docker.minusUnReadCount();
			}
		}).find(".close-btn").on("click", function (e) {
				var target = $(this).parent(".message");
				var id = target.data("id");
				removeMsg(target);
				
				if (readedArr.indexOf(id) <= -1) {
					readedArr.push(id);
					docker.minusUnReadCount();
				}

				e.stopPropagation();	
				e.preventDefault();
		});

		docker.addUnReadCount(9);
	});

	function generateId () {
		return +new Date();
	}

	function render (msg) {
		var result = "";
		result = tpl.replace("{{website}}", msg.website);
		result = result.replace("{{detail}}", msg.detail);
		result = result.replace("{{url}}", msg.url);

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
		var counterEle = $('<div class="ui blue  bottom right attached label">秒后消失</div>');
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



	function Message (obj) {

		obj = obj || {};
		obj.website = obj.website || "百度";
		obj.channel = obj.channel || "内容内容";
		obj.url = obj.url || "http://exmpale.com";
		obj.detail = obj.detail || "这是测试文本";

		this.website = obj.website;
		this.channel = obj.channel;
		this.url = obj.url;
		this.detail = obj.detail;
	}

	function markReaded (msg) {
		var id = msg.data("id");
		msg.removeClass("info")
			.addClass("teal")
			.addClass("readed")
	}

	var msgDB = [];

	var addOne = function (obj) {

		var msg = new Message(obj);
		msgDB.push(msg);

		var elem = render(msg);
		var dockmsg = elem.find(".message").clone().hide();
		dockmsg.find(".share-btn").show().end()
				.find(".fav-icon").show();

		
		// 如果docker未展开，则显示弹出对话框
		if (!docker.dockerIsExpand()) {
			
			elem.on("click", function () {
				var id = elem.data("id");
				removeMsg($(this));
				markReaded(dockmsg);

				// 标记为已读
				if (readedArr.indexOf(id) <= -1) {
					readedArr.push(id);
				}

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
			
			var id = dockmsg.data("id");
			markReaded(dockmsg);

			// 如果还未阅读
			// 则标记为已读
			// 并且未读数-1
			if (readedArr.indexOf(id) <= -1) {
				readedArr.push(id);
				docker.minusUnReadCount();
			}
		});

		dockmsg.find(".close-btn").on("click", function (e) {
			
			var id = dockmsg.data("id");
			removeMsg(dockmsg);
			
			if (readedArr.indexOf(id) <= -1) {
				readedArr.push(id);
				docker.minusUnReadCount();
			}

			e.stopPropagation();	
			e.preventDefault();
		}).end().find(".fav-icon").on("click", function (e) {
			var target = $(this);
			if (target.hasClass("fav-icon-no")) {
				target.removeClass("fav-icon-no").addClass("fav-icon-yes");
			} else {
				target.removeClass("fav-icon-yes").addClass("fav-icon-no");
			}

			e.stopPropagation();
			e.preventDefault();	

		}).end().find(".fav-icon").on("click", function (e) {
			e.stopPropagation();
			e.preventDefault();
		});

		docker.addOneMessage(dockmsg);	
	}

	return {
		come: function (obj) {
			addOne(obj);
		},
		removeMsg: removeMsg,
		removeOuterMsg: function () {
			removeLastOuterMsg();
		}
	}

})();