;(function(global){

	// ================================================
	// Header Section
	// ================================================

	var Recorder = global.Recorder = function(){
		this.init.apply(this, Array.prototype.slice.call(arguments));
	};

	Recorder.prototype = {
		init: init,
		getStream: getStream,
		recording: recording,
		stopRecording: stopRecording,
		convertToAudioBuffer: convertToAudioBuffer,
		getAudioBuffer: getAudioBuffer
	}

	Recorder.defauts = {
		bufferSize : 4096,
		detectionMinVolume: 10000
	}

	// ================================================
	// Body Section
	// ================================================

	function _extend(){
		var ret = arguments[0]
		for(var i = 1; i < arguments.length; i++){
			var arg = arguments[i];
			for(var j in arg) ret[j] = arg[j]
		}
		return ret;
	}


	function init(context, options){
		var o = this , c = o.config = _extend({}, Recorder.defauts, options);
		c.context = context;
	}

	function getStream(){
		var o = this, c = o.config;
		return new Promise(function(resolve, reject){
			if(c.stream){
				resolve(c.stream);
			}
			else{
				navigator.getUserMedia(
					{video: false, audio: true},
					function(stream){
						resolve(stream);
					},
					function(err){
						console.log(err.name ? err.name : err);
					}
				);
			}
		});
	}

	function recording(){
		var o = this, c = o.config;
		o.getStream().then(function(s){
			c.stream = s;
			c.audioBufferArray = []
			var mediaStreamSource = c.context.createMediaStreamSource(c.stream);
			var analyser = c.context.createAnalyser();
			c.scriptProcessor = c.context.createScriptProcessor(c.bufferSize, 1, 1);
			c.scriptProcessor.onaudioprocess = function(event){
				var getVolume = function(){
					var volume = 0;
					var view = new Uint8Array(analyser.frequencyBinCount);
					analyser.getByteFrequencyData(view);
					for(var i = 0; i < view.length; i++){
						volume += view[i]
					}
					return volume;
				}
				var saveAudioBuffer = function(){
					var channel = event.inputBuffer.getChannelData(0);
					var buffer = new Float32Array(c.bufferSize);
					for (var i = 0; i < c.bufferSize; i++) {
						buffer[i] = channel[i];
					}
					c.audioBufferArray.push(buffer);
				}
				if(getVolume() >= c.detectionMinVolume){
					saveAudioBuffer();
				}
			}
			mediaStreamSource.connect(analyser);
			analyser.connect(c.scriptProcessor);
			c.scriptProcessor.connect(c.context.destination);
		})
	}

	function stopRecording(){
		var o = this, c = o.config;
		!c.scriptProcessor || c.scriptProcessor.disconnect();
		if(c.stream){
      c.stream.getAudioTracks()[0].stop();
			c.stream = null;
		}
	}

	function convertToAudioBuffer(audioBufferArray){
		var o = this, c = o.config;
		var buffer = c.context.createBuffer(
			1,
			audioBufferArray.length * c.bufferSize,
			c.context.sampleRate
		);
		var channel = buffer.getChannelData(0);
		for (var i = 0; i < audioBufferArray.length; i++) {
			for (var j = 0; j < c.bufferSize; j++) {
				channel[i * c.bufferSize + j] = audioBufferArray[i][j];
			}
		}
		return buffer;
	}

	function getAudioBuffer(){
		var o = this, c = o.config;
		return o.convertToAudioBuffer(c.audioBufferArray);
	}

})(window);
