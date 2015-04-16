window.AudioHelper = function(audioContext){
	this.config = {
		audioContext: audioContext,
		audioBuffers: {},
        audioInfo: {}
	}
};
AudioHelper.prototype.loadAudioBuffer = function(id, url, data){
    var o = this, c = o.config;
    return new Promise(function(resolve){
        //キャッシュがあった場合それを返す
        if(c.audioBuffers[id]){
            resolve(c.audioBuffers[id]);
        }
        else{
            return AudioHelper.loadAudioBuffer(c.audioContext, url).then(function(buffer){
            //初めて取得した場合はキャッシュする
            c.audioBuffers[id] = buffer;
            c.audioInfo[id] = data;
            resolve(buffer);
        })
    }
    });
}
AudioHelper.prototype.setAudioBuffer = function(id, buffer, data){
    var o = this, c = o.config;
    c.audioBuffers[id] = buffer;
    c.audioInfo[id] = data;
}
AudioHelper.prototype.getAudioBuffers = function(){
    return this.config.audioBuffers;
}
AudioHelper.loadAudioBuffer = function(audioContext, url){
    var _decodeAudioData = function(audioFile, cb){
            audioContext.decodeAudioData(
                audioFile,
                function(buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    cb(buffer);
                },
                function(error) {
                    alert('decodeAudioData error', error);
                }
            );
    }
    var _requestFile = function(cb){
        var _xhr = new XMLHttpRequest();
        _xhr.open("GET", url, true);
        _xhr.responseType = "arraybuffer";
        _xhr.onload = function(){
            cb(_xhr.response);
        };
        _xhr.send();
    }
    return new Promise(function(resolve, reject){
        _requestFile(function(response){
            _decodeAudioData(response, function(buffer){
                resolve(buffer);
            });
        });
    });
}
