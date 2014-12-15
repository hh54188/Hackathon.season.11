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

	$(function () {
		num = $(".trigger-num");
		icon = $(".trigger-icon");
		trigger = $("#trigger");

		docker = $("#docker");
		dockerIsExpand = false;
		dockerMsgContainer = $("#docker-message");

		emptyBtn = $("#empty-msg");
		subscribeBtn = $(".btn-subscribe");
		configBtn = $(".btn-config");
	    
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
			expandTrigger();
		}).on("mouseout", function () {
			shrinkTriggger();
		}).click(function () {
			if (!dockerIsExpand) {
				expandDocker();
				dockerIsExpand = true;
			} else if (dockerIsExpand) {
				shrinkDocker();
				dockerIsExpand = false;
			}
		});

		subscribeBtn.on("click", function () {

		});
	});

	var addUnReadCount = function () {
		unReadCount++;
		num.html(unReadCount);
		if (unReadCount > 0) {
			num.show();
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