(function() {

	var SOUND_SOURCE = [
		{id:'piano', url:'sound/piano_c.wav'},
		{id:'base', url:'sound/base13.wav'},
		{id:'snare', url:'sound/snare.wav'},
		{id:'hihat', url:'sound/hihat.wav'},
		{id:'kick', url:'sound/kick.wav'}
	];
	var EFFECT_SOUND_SOURCE = [
		{id:'underground_car_park', url:'sound/ir/underground_car_park.wav'},
		{id:'maes_howe', url:'sound/ir/maes_howe.wav'},
		{id:'hamilton_mausoleum', url:'sound/ir/hamilton_mausoleum.wav'},
	];
	var SCORE_SET = [
		{
			id: 'pattern_1',
			score: [
				{
					soundId: 'hihat',
					pattern: [1,0,1,0,  1,0,1,0,  1,0,1,0,  1,0,1,0]
				},
				{
					soundId: 'snare',
					pattern: [0,0,0,0,  1,0,0,0,  0,0,0,0,  1,0,0,0]
				},
				{
					soundId: 'kick',
					pattern: [1,0,0,0,  0,0,0,0,  1,0,1,0,  0,0,0,0]
				}
			]
		},
		{
			id: 'pattern_2',
			score: [
				{
					soundId: 'hihat',
					pattern: [1,1,1,0,  1,0,1,0,  1,0,1,0,  1,0,1,0]
				},
				{
					soundId: 'snare',
					pattern: [0,0,0,0,  1,0,0,0,  0,0,0,0,  1,1,0,1]
				},
				{
					soundId: 'kick',
					pattern: [1,0,0,0,  0,0,0,0,  1,1,1,0,  0,0,1,0]
				}
			]
		},
		{
			id: 'pattern_3',
			score: [
				{
					soundId: 'hihat',
					pattern: [1,0,0,0,  0,0,0,0,  1,0,1,0,  1,0,1,0]
				},
				{
					soundId: 'snare',
					pattern: [1,0,0,0,  0,0,0,0,  0,0,0,0,  1,0,0,1]
				},
				{
					soundId: 'kick',
					pattern: [1,0,0,0,  0,0,0,0,  1,0,1,0,  0,1,1,0]
				},
				{
					soundId: 'base',
					pattern: [1,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0]
				}
			]
		}
	];

	new App({
		tempo: 130,
		soundSource: SOUND_SOURCE,
		effectSoundSource: EFFECT_SOUND_SOURCE,
		scoreSet: SCORE_SET
	});

})();

