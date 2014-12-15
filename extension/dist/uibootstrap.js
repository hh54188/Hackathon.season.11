$(function () {
    $('#docker .menu .item')
        .tab({
            context: $('#docker')
        });

    $('.ui.accordion').accordion();

    $('.ui.checkbox').checkbox();


    // $(".pop-tip").popup();

    $('.ui.dropdown').dropdown();

    function modalOnShow () {
        $("#docker").css('z-index', 0);
    }

    function modalOnHide () {
        $("#docker").css('z-index', 9999999);
    }

    $('.ui.modal-subscribe').modal({
          closable  : false,
          selector :{
              approve: '.modal-approve',
              deny: '.modal-deny'
          },
          onHide: modalOnHide,
          onShow: modalOnShow,   
          onDeny : function(){
              console.log('Wait not yet!');
          },
          onApprove : function() {
              console.log('Approved!');
          }
      })
      .modal('attach events', '.btn-subscribe')

    $(".ui.modal-setting").modal({
          onHide: modalOnHide,
          onShow: modalOnShow,
    }).modal('attach events', '.btn-config')


})