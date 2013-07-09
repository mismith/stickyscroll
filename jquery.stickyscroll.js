(function($){
  
	$.support.stickyscroll = true;
	
	$.fn.stickyscroll = function(options){
		if( ! this.length) return this;
		
		options = $.extend({
			fixedTop:    0, // can also be a selector, e.g. '#header, #menu'
			fixedBottom: 0,
		}, options);
		
		this.each(function(){
			var that        = this,
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
					spilling = $floater.outerHeight() > $(window).height() - fixedTop - fixedBottom;
				}
			
			$floater.css({
				position: 'fixed',
				inset:    'visible',
				left:     el.left,
				top:      el.top,
				width:    el.width,
			});
			
			$(window).on('scroll touchmove', function(){
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
							
						if(scrollTop > el.top + c_height - height + fixedBottom){
							// don't spill out the bottom
							$floater.css({
								position: 'absolute',
								top:      el.top + c_height - el.height - fixedBottom,
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
				last_scroll_top = scrollTop;
			});
			$(window).on('resize', function(){
				resize();
			});
			resize();
		});
	};
	
})(jQuery);
