(function binary_gap( N ) {

	var binary = N.toString(2),
		j = binary.length,
		started = false,
		counter = 0,
		longest = 0;
	while (j--) {
		if (binary[j] === "1") {
			if (started === false) {
				started = true;
			} else if (counter > 0) {
				started = false;
				longest = counter > longest ? counter : longest;
			}
			counter = 0;
		} else {
			if (started === true) {
				counter++;
			}
		}
	}
	return longest;
})(483);

(function count_div ( A,B,K ) {
	for (var counter = 0; A < B; A++) {
		if ( A % K === 0) {
			counter++;
		}
	}
	return counter;
})(6,11,2);


(function triangular( N,P,Q,R ){
	var array = [], length = N;
	while (length--) {
		array.push(Math.random());
	}
	function check ( pos,X ){
		if (pos !== false) {
			for(var i = pos; i <= N; i++) {
				if (array[i] < X) {
					return i+1;
				}
			}
		}
		return false;
	}
	return +!!check(check(check(0,P),Q),R);
})(100,0.3,0.5,0.7);