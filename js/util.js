;(function(global){

	// ================================================
	// : Header Section                               :
	// ================================================

	var Ut = window.Ut = {
		extend: extend,
		arrayToJson: arrayToJson
	};

	// ================================================
	// : Body Section                                 :
	// ================================================

	function extend(){
		var ret = arguments[0]
		for(var i = 1; i < arguments.length; i++){
			var arg = arguments[i];
			for(var j in arg) ret[j] = arg[j]
		}
		return ret;
	}

	function arrayToJson(array, key, json){
		return array.reduce(function(prev, current, index, array){
			prev[current[key]] = current;
			return prev;
		}, json || {})
	}

})(window);
