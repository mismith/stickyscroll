(function($){
	
	$.fn.stickyscroll = function(options){
		if( ! this.length) return this;
		
		options = $.extend({
			fixedTop:    0, // height to stick top to, e.g. 44 (px)
			fixedBottom: 0, // these can also be selectors, e.g. '#footer, #fixed'
			useFixedPositioning: true, // disable this if using position: fixed is broken by your layout somehow; NB: disabling this will significantly reduce performance / introduce janky-ness
		}, options || {});
		
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
					spilling = $floater.outerHeight() > ($(window).height() - fixedTop - fixedBottom);
				}
			
			$floater.css({
				position: 'fixed',
				inset:    'visible',
				left:     el.left,
				top:      el.top,
				width:    el.width,
			});
			
			$(window).on('scroll.stickyscroll touchmove.stickyscroll', function(){
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
								position: options.useFixedPositioning ? 'fixed' : 'absolute',
								top:      Math.max(inset.top, height - el.height) - fixedBottom + (options.useFixedPositioning ? 0 : scrollTop),
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
								position: options.useFixedPositioning ? 'fixed' : 'absolute',
								top:      Math.min(0, inset.top) + fixedTop + (options.useFixedPositioning ? 0 : scrollTop),
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
			$(window).on('load.stickyscroll resize.stickyscroll', function(){
				resize();
			});
		});
	};
	
})(jQuery);
