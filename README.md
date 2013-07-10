stickyscroll
============

**Fixed position vertically scrollable area whose contents 'parallax'-scroll to match the containing document's scrolling.**

This is a progressive enhancement specifically useful for sidebars that are taller than the browser window but want to remain visible/fixed/stuck/onscreen even with very long page content.

Demo: http://jsfiddle.net/3C8NU/8/

Example Code (with default options):

    $('#sidebar').stickyscroll({
  		fixedTop:    0, // height to stick top tom, e.g. 44 (px)
			fixedBottom: 0, // these can also be selectors, e.g. '#footer, #fixed'
		});
