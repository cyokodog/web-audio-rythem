var Audio = function(context, options){
    var o = this , c = o.config = o._extend({}, Audio.defauts, options);
    c.context = context
    c.gain = c.context.createGain();
    c.convolver = c.context.createConvolver();
    c.gain.connect(c.convolver);
    c.convolver.connect(c.context.destination)
    o.setParam();
}
Audio.prototype = {
    _extend: function(){
        var ret = arguments[0]
        for(var i = 1; i < arguments.length; i++){
            var arg = arguments[i];
            for(var j in arg) ret[j] = arg[j]
        }
        return ret;
    },
    setParam: function(options){
        var oldEffectSoundId = this.config.effectSoundId;
        var o = this , c = o.config = o._extend(o.config, options||{});
        if(c.audioBuffers && c.effectSoundId != oldEffectSoundId) c.convolver.buffer = c.audioBuffers[c.effectSoundId];
    },
    playScore: function(){
        var o = this , c = o.config;
        var currentTime = c.context.currentTime;
        var loop = 0;
        var currentLoop = 0;
        c.isPlaying = true;
        c.bufferSources = [];
        var noteSchedule = function(){
            for(var i = 0;i < c.beat; i++){
                c.score.forEach(function(v, j){
                    if(!v.pattern[i]) return;
                    var bufferSource = c.context.createBufferSource();
                    bufferSource.buffer = c.audioBuffers[v.soundId];
                    bufferSource.connect(c.gain);
                    bufferSource.start(0.1 + currentTime + (i + loop * c.beat)/4 * (60/c.tempo)) ;
                    c.bufferSources.push(bufferSource);
                    bufferSource.onended = function(){
                        c.bufferSources.shift();
                    }
                });
            }
            loop ++;
        }
        var playSchedule = function(){
            c.timer = setTimeout(function(){
                if((c.context.currentTime - currentTime) >= (loop * c.beat)/4 * (60/c.tempo)){
                    noteSchedule();
                }
                playSchedule();
            },0)
        }
        playSchedule();
    },
    stopScore : function(){
        var o = this , c = o.config;
        if(!c.isPlaying) return;
        c.isPlaying = false;
        c.bufferSources.forEach(function(bufferSource){
            bufferSource.stop();
        })
        c.bufferSources = [];
        clearTimeout(c.timer);
    }
}
Audio.defauts = {
    beat: 16,
    tempo: 80
}
