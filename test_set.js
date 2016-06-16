function getArraysCombinations(numbers_unique, total){
	var vector_length = numbers_unique.length;

	var min = Math.min.apply(null, numbers_unique);
	var base = Math.ceil(total / min) + 1;

	var i = 1;
	var max = Math.pow(base, (vector_length));

	while(i < max){	
		var numInBase = i.toString(base);
		var vector = [];
		for(var j = 0; j < vector_length; j++){
			vector.push(parseInt(numInBase[j]));
		}
		var sum = multiplyVector(numbers_unique, vector);
		if(sum == 32){		
			console.log(vector);
		}
		i+= 1;
	}

	function multiplyVector(arr1, arr2){	
		var sum = 0;
		for(var i=0; i< arr1.length; i++) {
			sum += arr1[i]*arr2[i];
		}
		return sum;
	}
}

var numbers_unique = [2, 4, 6, 8];
getArraysCombinations(numbers_unique, 32);