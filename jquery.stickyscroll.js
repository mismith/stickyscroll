(function($){
	
	$.fn.stickyscroll = function(options){
		if( ! this.length) return this;
		
		options = $.extend({
			fixedTop:    0, // height to stick top to, e.g. 44 (px)
			fixedBottom: 0, // these can also be selectors, e.g. '#footer, #fixed'
		}, options || {});
		
		this.each(function(){
			var that        = this,
				enabled     = false,
				spilling    = false,
				fixedTop    = options.fixedTop    || 0,
				fixedBottom = options.fixedBottom || 0,
				last_scroll_top = 0; // to determine which direction we're scrolling
		
			if( ! $.isNumeric(options.fixedTop)){
				fixedTop = 0;
				$(options.fixedTop).each(function(){ fixedTop += $(this).outerHeight(); });
			}
			if( ! $.isNumeric(options.fixedBottom)){
				fixedBottom = 0;
				$(options.fixedBottom).each(function(){ fixedBottom += $(this).outerHeight(); });
			}
			
			var $el      = $(this).css({width: $(this).width(), height: $(this).height()}), // lock initial dimensions
				el       = {top: $el.offset().top, width: $el.width()}, // store some useful values
				$floater = $el.wrapInner('<div class="floater"></div>').find('> .floater'), // wrap contents with .floater
				resize   = function(){
					enabled  = $('body').height() >= $(window).height();
					spilling = $floater.outerHeight() > ($(window).height() - fixedTop - fixedBottom);
				}
			
			$floater.css({
				position: 'fixed',
				inset:    'visible',
				left:     el.left,
				top:      el.top,
				width:    el.width,
			});
			
			$(window).on('ready.stickyscroll load.stickyscroll resize.stickyscroll', function(){
				resize();
			});
			$(window).on('scroll.stickyscroll touchmove.stickyscroll load.stickyscroll', function(){
				if(enabled){
					if(spilling){
						el.height = $floater.outerHeight();
						
						var top       = $floater.offset().top,
							scrollTop = $(this).scrollTop() + fixedTop,
							height    = $(this).height(),
							inset     = {
								top:    top - scrollTop,
								bottom: height - (top - scrollTop + el.height) - fixedTop - fixedBottom,
							};
							
						if(scrollTop > last_scroll_top){ // scrolling DOWN
							var c_height = $el.outerHeight();
								
							if(scrollTop > el.top + c_height - height + fixedTop + fixedBottom){
								// don't spill out the bottom
								$floater.css({
									position: 'absolute',
									top:      el.top + c_height - el.height,
								});
							}else if(inset.bottom < 0){
								// mid-parallax
								$floater.css({
									position: 'absolute',
									top:      top,
								});
							}else{
								// bottomed-out
								$floater.css({
									position: 'fixed',
									top:      Math.max(inset.top, height - el.height) - fixedBottom,
								});
							}
						}else if(scrollTop < last_scroll_top){ // scrolling UP
							if(scrollTop < el.top){
								// don't spill out the top
								$floater.css({
									position: 'absolute',
									top:      el.top,
								});
							}else if(inset.top < 0){
								// mid-parallax
								$floater.css({
									position: 'absolute',
									top:      top,
								});
							}else{
								// topped-out
								$floater.css({
									position: 'fixed',
									top:      Math.min(0, inset.top) + fixedTop,
								});
							}
						}
					}else{
						$floater.css({
							position: 'fixed',
							top:      el.top,
						});
					}
				}else{
					$floater.css({
						position: 'static',
					});
				}
				last_scroll_top = scrollTop;
			});
		});
	};
	
})(jQuery);
