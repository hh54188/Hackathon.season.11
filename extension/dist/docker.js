var docker = (function () {

	var unReadCount = 0;
	var num;
	var icon;
	var trigger;
	
	var docker;
	var dockerIsExpand;
	var dockerMsgContainer;
	
	var emptyBtn;
	var subscribeBtn;
	var configBtn;

	var isEmptyObject = function (obj) {
		for (var key in obj) {
			return false;
		}
		return true;
	}

	$(function () {

		function update () {
			$.get("http://127.0.0.1:8000/message/", function (data) {
				console.log(data);
				if (!isEmptyObject(data)) {
					msg.come(data);
				}
			});
		}

		setInterval(function () {
			update();
		}, 1000 * 3); 

		num = $(".trigger-num");
		icon = $(".trigger-icon");
		trigger = $("#trigger");

		docker = $("#docker");
		dockerIsExpand = false;
		dockerMsgContainer = $("#docker-message");

		emptyBtn = $("#empty-msg");
		subscribeBtn = $(".btn-subscribe");
		configBtn = $(".btn-config");

		docker.find(".msg").delegate(".fav-icon", "click", function (e) {
			var target = $(this);
			if (target.hasClass("fav-icon-no")) {
				target.removeClass("fav-icon-no").addClass("fav-icon-yes");
			} else {
				target.removeClass("fav-icon-yes").addClass("fav-icon-no");
			}

			e.stopPropagation();
			e.preventDefault();

		}).delegate(".share-btn", "click", function (e) {
			
			e.stopPropagation();
			e.preventDefault();
		});
	    
		function showNumIcon () {
			num.show(300);
		}

		function hideNumIcon () {
			num.hide(300);
		}

	    function expandTrigger () {
	    	trigger.removeClass("shrink").addClass("expand");
	    }

	    function shrinkTriggger () {
	    	trigger.removeClass("expand").addClass("shrink");
	    }

	    function expandDocker () {
	    	// 展开之后需要移除外面弹出的消息
	    	msg.removeOuterMsg();
	    	docker.removeClass("shrink").addClass("expand").addClass("shadow");
	    }

	    function shrinkDocker () {
	    	docker.removeClass("expand").removeClass("shadow").addClass("shrink");
	    }

	    emptyBtn.on("click", function () {
	    	var msgs = dockerMsgContainer.find(".message");
	    	resetUnReadCount();

	    	msgs.each(function (index, item) {
				msg.removeMsg($(item));
	    	});
	    });
		
		trigger.on("mouseover", function () {
			// expandTrigger();
		}).on("mouseout", function () {
			// shrinkTriggger();
		}).click(function () {
			if (!dockerIsExpand) {
				$(this).find(".trigger-icon")
						.removeClass("left")
						.addClass("right")
						.css("left", "9px");
				expandDocker();
				dockerIsExpand = true;
			} else if (dockerIsExpand) {
				shrinkDocker();
				dockerIsExpand = false;
				$(this).find(".trigger-icon")
						.removeClass("right")
						.addClass("left")
						.css("left", "");
			}
		});

		subscribeBtn.on("click", function () {

		});
	});

	var addUnReadCount = function (count) {
		if (!count) {
			unReadCount++;
			num.html(unReadCount);
			if (unReadCount > 0) {
				num.show();
			}		
		} else {
			unReadCount = count;
			$(".trigger-num").html(count).show();
		}
	}

	var minusUnReadCount = function () {
		unReadCount--;
		num.html(unReadCount);
		if (unReadCount == 0) {
			num.hide();
		}		
	}

	var resetUnReadCount = function () {
		unReadCount = 0;
		num.html(unReadCount);
		num.hide();		
	}
	
	return {
		addUnReadCount: addUnReadCount,

		minusUnReadCount: minusUnReadCount,

		resetUnReadCount: resetUnReadCount,

		dockerIsExpand: function () {
			return dockerIsExpand;
		},

		addOneMessage: function (ele) {
			dockerMsgContainer.prepend(ele);
			ele.transition('vertical  flip', '600ms');
		}
	}

})();