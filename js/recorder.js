var Recorder = function(context, options){
    var o = this , c = o.config = o._extend({}, Recorder.defauts, options);
    c.context = context;
}
Recorder.prototype = {
    _extend: function(){
        var ret = arguments[0]
        for(var i = 1; i < arguments.length; i++){
            var arg = arguments[i];
            for(var j in arg) ret[j] = arg[j]
        }
        return ret;
    },
    getStream : function(){
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
    },
    recording: function(){
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
    },
    stopRecording: function(){
        var o = this, c = o.config;
        !c.scriptProcessor || c.scriptProcessor.disconnect();
        if(c.stream){
            c.stream.stop();
            c.stream = null;
        }
    },
    convertToAudioBuffer: function(audioBufferArray){
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
    },
    getAudioBuffer: function(){
        var o = this, c = o.config;
        return o.convertToAudioBuffer(c.audioBufferArray);
    }
}
Recorder.defauts = {
    bufferSize : 4096,
    detectionMinVolume: 10000
}
