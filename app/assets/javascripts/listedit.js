$(function($){
  //Masonry
  var $container = $('.lists');
  $container.masonry({
    itemSelector: '.list'
  });
  function reloadMasonry() {
    $container.masonry('layout');
  }

  //Autosave
  var autosaveDelay = 3000;
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
  //After any input state change, dirty list to make save
  $(document).on('change keyup paste', '.list[data-post-url] :input', function(){
    $(this).closest('.list').trigger('dirty').trigger('processparse');
    reloadMasonry();
  });

  //Adding new list items
  $(document).on('click', '.list .controls .add-item', function(e){
    e.preventDefault();
    var $itemList = $(this).closest('.list').find('.items');
    $itemList.append('<li class="item"><textarea name="item-text[]"></textarea><div class="controls"><a class="remove ui fa fa-trash-o" href="#"></a></div></li>');
    $itemList.children().last().find('textarea').expanding();
    reloadMasonry();
  });
  //Deleting items
  $(document).on('click', '.list .item .remove', function(e){
    e.preventDefault();
    var $list = $(this).closest('.list');
    $(this).closest('.item').remove();
    $list.trigger('dirty');
    reloadMasonry();
  });
  //Deleting the list
  $(document).on('click', '.list .remove-list', function(e){
    e.preventDefault();
    if(confirm('Are you sure you want to completely destroy this list?')){
      var $list = $(this).closest('.list').addClass('dirty');
      $.post($list.data('post-url'), { delete: true }, function(data){
        if(data == 'Deleted') {
          $list.remove();
          reloadMasonry();
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
  //Any links in this item?
  $(document).on('urlcheck', '.list .items .item', function(){
    $(this).find('.controls .ext-link').remove();
    var val = $(this).find('textarea').val();
    var found = val.match(/(https?:\/\/[^\ $]*)/gi);
    if(found != null) {
      for(var i=0; i<found.length; i++) {
        $('<a class="ext-link fa fa-external-link"></a>').attr({ target: '_blank', href: found[i], title: found[i] }).appendTo($(this).find('.controls'));
      }
    }
  });
  $(document).on('change keyup paste', '.list .items .item :input', function(){
    $(this).closest('.item').trigger('urlcheck');
  });

  //Config area
  $(document).on('click', '[data-togglesib]', function(e){
    e.preventDefault();
    $(this).siblings($(this).data('togglesib')).toggleClass('hidden');
  });
  $(document).on('click', 'a[class^=toggle]:has(input[type=checkbox])', function(e){
    e.preventDefault();
    var $box = $(this).find('input[type=checkbox]');
    $box.prop('checked', !$box.prop('checked')).trigger('change');
  });

  $(document).on('processparse', '.list', function(){
    $(this).find('.item .parsed').remove();
    if($(this).find('[name=is_in_parsed_mode]').is(':checked')) {
      $(this).addClass('mode-parsed');
      $(this).find('.item').each(function(){
        var $parsed = $('<div class="parsed"/>').appendTo(this);
        //Actually parse!
        var html = $(this).find('textarea').val();
        html = html.replace(/(\[([^\|\]]*)\|([^\]]*)\])/ig, '<a href="$3" target="_blank">$2</a>');
        $parsed.html(html);
      });
    } else {
      $(this).removeClass('mode-parsed');
    }
    reloadMasonry(); 
  });

  //To do when a list if first shown (inc page load)
  $('.list').on('firstinit', function(){
    //Parse
    $(this).trigger('processparse');
    
    //Url links
    $(this).find('.item').trigger('urlcheck');

    //All textareas are expandable
    $(this).find('textarea').expanding();
  }).trigger('firstinit');

  //Do last
  $(window).on('load', reloadMasonry);
});
