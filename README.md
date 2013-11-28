stickyscroll
============

**Fixed-position scrollable area whose contents 'sticky'-scroll along with the document.**

This is a progressive enhancement specifically useful for sidebars that are taller than the browser window but want to remain visible/fixed/stuck/onscreen even with very long page content.

Demo: [![Demo](https://raw.github.com/mismith/stickyscroll/master/demo.gif)](http://jsfiddle.net/UpHUf/2/)

Example Code (with default options):

    $('#sidebar').stickyscroll({
    	fixedTop:    0, // height to stick top tom, e.g. 44 (px)
    	fixedBottom: 0, // these can also be selectors, e.g. '#footer, #fixed'
    });

License
-------

Copyleft: Feel free to use this basically any way you want.
