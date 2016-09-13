'use strict';

var projectname = { // Change the namespace
	// All pages
	common: {
		init: function() {
			// JS
			// Lightbox, navigation etc
		},
		finalize: function() {
			// JS
		}
	},
	// Home
	home: {
		init: function() {
			// JS
			// Slideshow etc
		}
	},
	// Users
	users: {
		init: function() {
			// JS
		},
		show: function() {
			// JS
		}
	}
};

var UTIL = {
	exec: function( controller, action ) {
		var ns = projectname, // Change the namespace
			action = ( action === undefined ) ? 'init' : action;
		
		if ( controller !== '' && ns[controller] && typeof ns[controller][action] === 'function' ) {
			ns[controller][action]();
		}
	},

	init: function() {
		var body = document.body,
			controller = body.getAttribute( 'data-controller' ),
			action = body.getAttribute( 'data-action' );

		UTIL.exec( 'common' );
		UTIL.exec( controller );
		UTIL.exec( controller, action );
		UTIL.exec( 'common' , 'finalize' );
	}
};

$( document ).ready( UTIL.init );