!function(){function e(e){var t=this,o=t.config=Ut.extend({},App.defauts,e||{});o.audioContext=new AudioContext,o.audioHelper=new AudioHelper(o.audioContext),o.sts={nowScoreId:o.nowScoreId||o.scoreSet[0].id,nowEffectSoundId:o.nowEffectSoundId||o.effectSoundSource[0].id,tempo:o.tempo,nowRecording:!1,autoVoiceNo:1},o.view=new App.View({app:t}),o.view.renderInfoUi(),o.view.renderScoreSection(),o.view.config.el.message.textContent="now loading...",t.getAudioBuffers(function(e){o.view.config.el.message.textContent="",o.audio=new Audio(o.audioContext,{audioBuffers:e}),t.setupAudioParam(),o.recorder=new Recorder(o.audioContext),t.control()})}function t(e){var t=this,o=t.config;Promise.all(o.soundSource.concat(o.effectSoundSource).map(function(e){return e.url?o.audioHelper.loadAudioBuffer(e.id,e.url):e.buffer?o.audioHelper.setAudioBuffer(e.id,e.buffer):void 0})).then(function(){!e||e.call(t,o.audioHelper.getAudioBuffers())})}function o(){var e=this,t=e.config;t.audio.setParam({effectSoundId:t.sts.nowEffectSoundId,score:e.getNowScore().score,tempo:t.sts.tempo})}function r(){var e=this,t=e.config;return Ut.arrayToJson(t.scoreSet,"id")[t.sts.nowScoreId]}function n(e,t){var o=this,r=o.config;r.soundSource.push({id:e,buffer:t}),o.getAudioBuffers()}function c(){var e=this,t=e.config;e.setupAudioParam(),t.audio.playScore(),t.view.config.el.playBtn.textContent="STOP"}function i(){var e=this,t=e.config;t.audio.stopScore(),t.view.config.el.playBtn.textContent="PLAY"}function a(){var e=this,t=e.config;"click change".split(" ").forEach(function(t){document.body.addEventListener(t,function(t){for(var r in o)t.target.classList.contains(r)&&o[r].call(e,t)},!1)});var o={};o.tempo=function(o){"change"==o.type&&(t.sts.tempo=o.target.value,e.setupAudioParam())},o.scoreSelector=function(o){"change"==o.type&&(t.sts.nowScoreId=o.target.value,t.view.renderScoreSection(),e.setupAudioParam())},o.effectSoundSelector=function(o){"change"==o.type&&(t.sts.nowEffectSoundId=o.target.value,e.setupAudioParam())},o.playBtn=function(o){if("click"==o.type){if(t.sts.nowRecording)return;t.audio.config.isPlaying?e.playStop():e.playStart()}},o.part__soundId=function(o){"change"==o.type&&(e.getNowScore().score=t.view.getScoreData(),e.setupAudioParam())},o.score__attack=function(o){"change"==o.type&&(e.getNowScore().score=t.view.getScoreData(),e.setupAudioParam())},o.recBtn=function(o){if("click"==o.type)for(var r=document.querySelectorAll(".part"),n=0;n<r.length;n++)!function(n){var c=r.item(n);if(c.querySelector(".recBtn")==o.target)if(t.sts.nowRecording){t.sts.nowRecording=!1,t.recorder.stopRecording(),o.target.textContent="REC";var i="voice"+t.sts.autoVoiceNo++;e.addSourceBuffer(i,t.recorder.getAudioBuffer()),e.getNowScore().score[n].soundId=i,t.view.renderScoreSection(),e.playStart()}else e.playStop(),t.sts.nowRecording=!0,t.recorder.recording(),o.target.textContent="REC FINISH & PLAY"}(n)}}App=function(){this.init.apply(this,Array.prototype.slice.call(arguments))},App.prototype={init:e,getAudioBuffers:t,setupAudioParam:o,getNowScore:r,addSourceBuffer:n,playStart:c,playStop:i,control:a},App.defauts={tempo:80,beat:16,soundSource:[],effectSoundSource:[],scoreSet:[]}}(),function(){function e(e){var t=this,o=t.config=Ut.extend({},e||{});o.el={message:document.querySelector(".message"),playBtn:document.querySelector(".playBtn"),scoreSelector:document.querySelector(".scoreSelector"),effectSoundSelector:document.querySelector(".effectSoundSelector"),tempo:document.querySelector(".tempo"),part__template:document.querySelector(".part__template"),l_part:document.querySelector(".l_part")}}function t(){var e=this,t=e.config,o=t.el;t.app.config.scoreSet.forEach(function(e){var r=document.createElement("option");r.textContent=e.id,e.id==t.app.config.sts.nowScoreId&&(r.selected=!0),o.scoreSelector.appendChild(r)}),t.app.config.effectSoundSource.forEach(function(e){var r=document.createElement("option");r.textContent=e.id,e.id==t.app.config.sts.nowEffectSoundId&&(r.selected=!0),o.effectSoundSelector.appendChild(r)}),o.tempo.value=t.app.config.sts.tempo}function o(){var e=this,t=e.config,o=t.el;o.l_part.innerHTML="",t.app.getNowScore().score.forEach(function(e,r){var n=o.part__template.cloneNode(!0);n.classList.remove("part__template"),n.classList.add("part"),o.l_part.appendChild(n),t.app.config.soundSource.forEach(function(t){var o=document.createElement("option");o.textContent=t.id,e.soundId==t.id&&(o.selected=!0),n.querySelector(".part__soundId").appendChild(o)});for(var r=0;r<t.app.config.beat/4-1;r++)n.querySelector(".score__section").appendChild(n.querySelector(".score__attack").cloneNode(!0));for(var r=0;3>r;r++)n.querySelector(".score").appendChild(n.querySelector(".score__section").cloneNode(!0));for(var c=n.querySelectorAll(".score__attack"),r=0;r<c.length;r++)e.pattern[r]&&(c.item(r).checked=!0)})}function r(){for(var e=this,t=(e.config,e.el,[]),o=document.querySelectorAll(".part"),r=0;r<o.length;r++){var n={},c=o.item(r);n.soundId=c.querySelector(".part__soundId").value;for(var i=[],a=c.querySelectorAll(".score__attack"),u=0;u<a.length;u++){var d=a.item(u);i.push(d.checked?1:0)}n.pattern=i,t.push(n)}return t}App.View=function(){this.init.apply(this,Array.prototype.slice.call(arguments))},App.View.prototype={init:e,renderInfoUi:t,renderScoreSection:o,getScoreData:r}}();