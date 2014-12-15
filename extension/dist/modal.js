$(function () {

	var addBtn = $(".sub-nav-add");
    var adminBtn = $(".sub-nav-admin");

    var addPanel = $(".sub-tab-add");
    var adminPanel = $(".sub-tab-admin");
    var freezePanel = $(".sub-tab-freeze");

    var subsNav = $(".sub-nav");
    var subsWrap = $(".sub-tab-wrap");
    var subsFreeze = $(".sub-tab-freeze");

    $(".sub-nav-btn").on("click", function () {
        if (addBtn.hasClass("active")) {
            addBtn.removeClass("active");
            adminBtn.addClass("active");

            addPanel.hide();
            adminPanel.show();
        } else {
            adminBtn.removeClass("active");
            addBtn.addClass("active");

            adminPanel.hide();
            addPanel.show();                      
        }
    });


    $(".enable-ai-check").checkbox({
        onChecked: function () {
        	subsNav.hide(300);
        	subsWrap.hide(300);
        	subsFreeze.show(300);
        },
        onUnchecked: function () {
        	subsNav.show(300);
        	subsWrap.show(300);
        	subsFreeze.hide(300);
        }
    });    
});