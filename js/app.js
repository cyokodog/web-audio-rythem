;(function(global){

	// ================================================
	// Header Section
	// ================================================

	var App = global.App = function(){
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

	App.defauts = {
		tempo: 80,
		beat: 16,
		soundSource: [],
		effectSoundSource: [],
		scoreSet: []
	}    

	// ================================================
	// Body Section
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

})(window);
