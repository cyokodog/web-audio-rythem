;(function(){

    // ================================================
    // : Header Section                               :
    // ================================================

    App = function(){
        this.init.apply(this, Array.prototype.slice.call(arguments));
    };

    App.prototype = {
        init: init,
        getAudioBuffers: getAudioBuffers,
        setupAudioParam: setupAudioParam,
        getNowScore: getNowScore,
        addSourceBuffer: addSourceBuffer,
        playStart: playStart,
        playStop: playStop,
        control: control
    }

    // ================================================
    // : Body Section                                 :
    // ================================================

    function init(setting){
        var o = this, c = o.config = Ut.extend({}, App.defauts, setting||{});

        //setup
        c.audioContext = new AudioContext();
        c.audioHelper = new AudioHelper(c.audioContext);

        c.sts = {
            nowScoreId : c.nowScoreId || c.scoreSet[0].id,
            nowEffectSoundId : c.nowEffectSoundId || c.effectSoundSource[0].id,
            tempo: c.tempo,
            nowRecording: false,
            autoVoiceNo: 1
        }

        c.view = new App.View({
            app: o
        });
        c.view.renderInfoUi();
        c.view.renderScoreSection();

        c.view.config.el.message.textContent = 'now loading...';
        o.getAudioBuffers(function(audioBuffers){
            c.view.config.el.message.textContent = '';
            c.audio = new Audio(c.audioContext, {
               audioBuffers: audioBuffers
            });
            o.setupAudioParam();
            c.recorder = new Recorder(c.audioContext);
            o.control();
        });

    }

    function getAudioBuffers(cb){
        var o = this, c = o.config;
        Promise.all(c.soundSource.concat(c.effectSoundSource).map(function(obj) {
            if(obj.url){
                return c.audioHelper.loadAudioBuffer(obj.id, obj.url);
            }
            else
            if(obj.buffer){
                return c.audioHelper.setAudioBuffer(obj.id, obj.buffer);
            }
        })).then(function(){
            !cb || cb.call(o, c.audioHelper.getAudioBuffers());
        })
    }

    function setupAudioParam(){
        var o = this, c = o.config;
        c.audio.setParam({
            effectSoundId: c.sts.nowEffectSoundId,
            score: o.getNowScore().score,
            tempo: c.sts.tempo
        });
        c.audio.chancelPlaySchedule();
    }

    function getNowScore(){
        var o = this, c = o.config;
        return Ut.arrayToJson(c.scoreSet, 'id')[c.sts.nowScoreId]
    }

    function addSourceBuffer(soundId, buffer){
        var o = this, c = o.config;
        c.soundSource.push({
            id: soundId,
            buffer: buffer
        });
        o.getAudioBuffers();
    }

    function playStart(){
        var o = this, c = o.config;
        o.setupAudioParam();
        c.audio.playScore();
        c.view.config.el.playBtn.textContent = 'STOP';
    }

    function playStop(){
        var o = this, c = o.config;
        c.audio.stopScore();
        c.view.config.el.playBtn.textContent = 'PLAY';
    }

    function control(){
        var o = this, c = o.config;

        'click change'.split(' ').forEach(function(eventName){
            document.body.addEventListener(eventName, function(event){
                for(var name in elements){
                    if(event.target.classList.contains(name)){
                        elements[name].call(o, event);
                    }
                }
            }, false);
         });


        var elements = {};

        elements.tempo = function(event){
            if(event.type == 'change'){
                c.sts.tempo = event.target.value;
                o.setupAudioParam();
            }
        }

        elements.scoreSelector = function(event){
            if(event.type == 'change'){
                c.sts.nowScoreId = event.target.value;
                c.view.renderScoreSection();
                o.setupAudioParam();
            }
        }
        elements.effectSoundSelector = function(event){
            if(event.type == 'change'){
                c.sts.nowEffectSoundId = event.target.value;
                o.setupAudioParam();
            }
        }

        elements.playBtn = function(event){
            if(event.type == 'click'){
                if(c.sts.nowRecording) return;
                if(c.audio.config.isPlaying){
                    o.playStop();
                }
                else{
                    o.playStart();
                }
            }

        }

        elements.part__soundId = function(event){
            if(event.type == 'change'){
                o.getNowScore().score = c.view.getScoreData();
                o.setupAudioParam();
            }
        }

        elements.score__attack = function(event){
            if(event.type == 'change'){
                o.getNowScore().score = c.view.getScoreData();
                o.setupAudioParam();
            }
        }

        elements.recBtn = function(event){
            if(event.type == 'click'){
                var parts = document.querySelectorAll('.part');
                for(var i = 0; i < parts.length; i++){
                    (function(i){
                        var part = parts.item(i);
                        if(part.querySelector('.recBtn') == event.target){
                            if(!c.sts.nowRecording){
                                o.playStop();
                                c.sts.nowRecording = true;
                                c.recorder.recording();
                                event.target.textContent = 'REC FINISH & PLAY';
                            }
                            else{
                                c.sts.nowRecording = false;
                                c.recorder.stopRecording();
                                event.target.textContent = 'REC';

                                var soundId = 'voice'+(c.sts.autoVoiceNo++);
                                o.addSourceBuffer(soundId, c.recorder.getAudioBuffer());
                                o.getNowScore().score[i].soundId = soundId;
                                c.view.renderScoreSection();
                                o.playStart();
                            }
                        }
                   })(i);
                }
            }
        }
    }
    App.defauts = {
        tempo: 80,
        beat: 16,
        soundSource: [],
        effectSoundSource: [],
        scoreSet: []
    }    

})();


// ================================================
// :                                              :
// : View                                         :
// :                                              :
// ================================================

;(function(){

    // ================================================
    // : Header Section                               :
    // ================================================

    App.View = function(){
        this.init.apply(this, Array.prototype.slice.call(arguments));
    };
    App.View.prototype = {
        init: init,
        renderInfoUi: renderInfoUi,
        renderScoreSection: renderScoreSection,
        getScoreData: getScoreData
    }

    // ================================================
    // : Body Section                                 :
    // ================================================

    function init(setting){
        var o = this, c = o.config = Ut.extend({}, setting||{});
        c.el = {
            message: document.querySelector('.message'),
            playBtn: document.querySelector('.playBtn'),
            scoreSelector: document.querySelector('.scoreSelector'),
            effectSoundSelector: document.querySelector('.effectSoundSelector'),
            tempo: document.querySelector('.tempo'),
            part__template: document.querySelector('.part__template'),
            l_part: document.querySelector('.l_part')
        }
    }
    function renderInfoUi(){
        var o = this, c = o.config , el = c.el;

        //scoreSet
        c.app.config.scoreSet.forEach(function(v, i){
            var opt = document.createElement('option');
            opt.textContent = v.id;
            if(v.id == c.app.config.sts.nowScoreId){
                opt.selected = true;
            }
            el.scoreSelector.appendChild(opt);
        });

        //effectSoundSource
        c.app.config.effectSoundSource.forEach(function(v, i){
            var opt = document.createElement('option');
            opt.textContent = v.id;
            if(v.id == c.app.config.sts.nowEffectSoundId){
                opt.selected = true;
            }
            el.effectSoundSelector.appendChild(opt);
        })

        //tempo
        el.tempo.value = c.app.config.sts.tempo;
    }

    function renderScoreSection(){
        var o = this, c = o.config , el = c.el;
        el.l_part.innerHTML = '';
        c.app.getNowScore().score.forEach(function(nowScore, i){
            var el_part = el.part__template.cloneNode(true);
            el_part.classList.remove('part__template');
            el_part.classList.add('part');
            el.l_part.appendChild(el_part);
            c.app.config.soundSource.forEach(function(soundSource){
                var opt = document.createElement('option');
                opt.textContent = soundSource.id;
                if(nowScore.soundId == soundSource.id) opt.selected = true;
                el_part.querySelector('.part__soundId').appendChild(opt);
            })

            for(var i = 0; i < (c.app.config.beat / 4)-1; i++){
                el_part.querySelector('.score__section').appendChild(
                    el_part.querySelector('.score__attack').cloneNode(true)
                );
            }
            for(var i = 0; i < 4-1; i++){
                el_part.querySelector('.score').appendChild(
                    el_part.querySelector('.score__section').cloneNode(true)
                );
            }
            var el_attacks = el_part.querySelectorAll('.score__attack');
            for(var i = 0;i < el_attacks.length; i++){
                if(nowScore.pattern[i]) el_attacks.item(i).checked = true;
            }
        });

    };

    function getScoreData(){
        var o = this, c = o.config , el = o.el;
        var score = [];
        var el_partSet = document.querySelectorAll('.part');
        for(var i = 0; i < el_partSet.length; i++){
            var json = {};
            var el_part = el_partSet.item(i);
            json.soundId = el_part.querySelector('.part__soundId').value;
            var pattern = [];
            var el_attacks = el_part.querySelectorAll('.score__attack');
            for(var j = 0; j < el_attacks.length; j++){
                var el_attack = el_attacks.item(j);
                pattern.push(el_attack.checked ? 1: 0);
            }
            json.pattern = pattern;
            score.push(json);
        }
        return score;
    }

})();
