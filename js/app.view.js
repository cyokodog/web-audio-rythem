;(function(global){

	// ================================================
	// Header Section
	// ================================================

	var App = global.App;

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
	// Body Section
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

})(window);
