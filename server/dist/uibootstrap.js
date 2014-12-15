$(function () {
    $('#docker .menu .item')
        .tab({
            context: $('#docker')
        });

    $('.ui.accordion').accordion();

    $('.ui.checkbox').checkbox();


    $(".pop-tip").popup();

    $('.ui.dropdown').dropdown();

    $('.ui.modal-subscribe').modal({
          closable  : false,
          selector :{
              approve: '.modal-approve',
              deny: '.modal-deny'
          },
          onDeny : function(){
              console.log('Wait not yet!');
          },
          onApprove : function() {
              console.log('Approved!');
          }
      })
      .modal('attach events', '.btn-subscribe')

    $(".ui.modal-setting").modal({

    }).modal('attach events', '.btn-config')


})