;(function(){

	navigator.getUserMedia = 
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia;

	window.URL = 
		window.URL || 
		window.webkitURL || 
		window.mozURL || 
		window.msURL;

	window.AudioContext = 
		window.AudioContext||
		window.webkitAudioContext;

})();


