var Recorder=function(e,r){var t=this,o=t.config=t._extend({},Recorder.defauts,r);o.context=e};Recorder.prototype={_extend:function(){for(var e=arguments[0],r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)e[o]=t[o]}return e},getStream:function(){var e=this,r=e.config;return new Promise(function(e){r.stream?e(r.stream):navigator.getUserMedia({video:!1,audio:!0},function(r){e(r)},function(e){console.log(e.name?e.name:e)})})},recording:function(){var e=this,r=e.config;e.getStream().then(function(e){r.stream=e,r.audioBufferArray=[];var t=r.context.createMediaStreamSource(r.stream);r.scriptProcessor=r.context.createScriptProcessor(r.bufferSize,1,1),r.scriptProcessor.onaudioprocess=function(e){for(var t=e.inputBuffer.getChannelData(0),o=new Float32Array(r.bufferSize),n=0;n<r.bufferSize;n++)o[n]=t[n];r.audioBufferArray.push(o)},t.connect(r.scriptProcessor),r.scriptProcessor.connect(r.context.destination)})},stopRecording:function(){var e=this,r=e.config;!r.scriptProcessor||r.scriptProcessor.disconnect(),r.stream&&(r.stream.stop(),r.stream=null)},convertToAudioBuffer:function(e){for(var r=this,t=r.config,o=t.context.createBuffer(1,e.length*t.bufferSize,t.context.sampleRate),n=o.getChannelData(0),c=0;c<e.length;c++)for(var i=0;i<t.bufferSize;i++)n[c*t.bufferSize+i]=e[c][i];return o},getAudioBuffer:function(){var e=this,r=e.config;return e.convertToAudioBuffer(r.audioBufferArray)}},Recorder.defauts={bufferSize:4096};