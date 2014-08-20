$(function($){
  //Autosave
  var autosaveDelay = 4000;
  $(document).on('dirty', '.list[data-post-url]', function(){
    var $list = $(this).closest('.list');
    //Set status
    $list.addClass('dirty');
    if(typeof $list.data('timeoutID') == 'undefined' || $list.data('timeoutID') == -1) {
      $list.data('timeoutID', setTimeout(function(){
        //Permit more saves
        $list.data('timeoutID', -1);
        //Serialise data
        var data = $list.find('input, textarea, select').serialize();
        //Post
        $.post($list.data('post-url'), data, function(res){
          $list.removeClass('dirty failed-save');
        }).error(function(res){
          $list.addClass('failed-save');
          console.log(res);
          alert('Error saving list');
        });
      }, autosaveDelay));
    }
  });
  $(document).on('change keyup paste', '.list[data-post-url] :input', function(){
    $(this).closest('.list').trigger('dirty');
  });

  //Adding new list items
  $(document).on('click', '.list .controls .add-item', function(e){
    e.preventDefault();
    var $itemList = $(this).closest('.list').find('.items');
    $itemList.append('<li class="item"><textarea name="item-text[]"></textarea><a class="remove edit-ui" href="#"><i class="fa fa-trash-o"></i></a></li>');
    $itemList.children().last().find('textarea').expanding();
  });
  //Deleting items
  $(document).on('click', '.list .item .remove', function(e){
    e.preventDefault();
    var $list = $(this).closest('.list');
    $(this).closest('.item').remove();
    $list.trigger('dirty');
  });
  //Deleting the list
  $(document).on('click', '.list .remove-list', function(e){
    e.preventDefault();
    if(confirm('Are you sure you want to completely destroy this list?')){
      var $list = $(this).closest('.list').addClass('dirty');
      $.post($list.data('post-url'), { delete: true }, function(data){
        if(data == 'Deleted') {
          $list.remove();
        } else {
          $list.removeClass('dirty');
        }
      }).error(function(e){
        console.log(e);
        alert('A thing did an error');
      });
    }
  });
  //Rearranging items
  //Showing config
  //All textareas are expandable
  $('.list textarea').expanding();
});
