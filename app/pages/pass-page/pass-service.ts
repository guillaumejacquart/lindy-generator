import { Injectable } from '@angular/core';
import { Pass } from '../list-page/list-page';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class PassService {


  data: [Pass];
  private local: Storage;
  private number_combinations: number[][] = [];
  private number_uniques: number[] = [];

  constructor(private http: Http) {
  }

  getPasses() {
    this.local = new Storage(LocalStorage);
		var that = this;
		return new Promise<Pass[]>(resolve => {
			try {
				this.local.get('moves').then((dataString) => {
					if (dataString) {
						var localData = JSON.parse(dataString);
						that.data = localData;
						that.getData();
						resolve(that.data);
					} else {
						that.getData().then(function (data) {
							resolve(data);
						});
					}
				}, (err) => {
					that.getData().then(function (data) {
						resolve(data);
					});
				});
			}
			catch (e) {
				that.getData();
			}
		}
    );

  }

  getData() {
		var that = this;
		return new Promise<Pass[]>(resolve => {
			that.http.get('moves.json')
				.map(res => res.json())
				.subscribe(data => {
					if(!that.data || data.length > that.data.length){
						that.data = data;
						that.local.set('moves', JSON.stringify(data));
					}
					if(!this.number_combinations.length){
						that.getArraysCombinations();
					}
					resolve(that.data);
				},
				err => console.log(err),
				() => console.log('Completed'));
		}
		)
  }

  save() {
		this.saveData();
  }
	
	getArraysCombinations(){
		var that = this;
		this.numbers_unique = [];
		this.data.sort((p1, p2) => {
			if (p1.length < p2.length)
				return -1;
			if (p1.length > p2.length)
				return 1;

			return 0;
		}).forEach(function(p: Pass){
			if(that.numbers_unique.indexOf(p.length) == -1){
				that.numbers_unique.push(p.length);
			}
		});
		
		var total = 32;
		
		var vector_length = that.numbers_unique.length;

		var min = Math.min.apply(null, that.numbers_unique);
		var base = Math.ceil(total / min) + 1;

		var i = 1;
		var max = Math.pow(base, (vector_length));
		
		this.number_combinations = [];
		while(i < max){	
			var numInBase = i.toString(base);
			var vector: number[] = [];
			for(var j = 0; j < vector_length; j++){
				vector.push(parseInt(numInBase[j]));
			}
			var sum = multiplyVector(that.numbers_unique, vector);
			if(sum == total){		
				this.number_combinations.push(vector);
			}
			i+= 1;
		}
		
		generateChain2(total);

		function multiplyVector(arr1, arr2){	
			var sum = 0;
			for(var i=0; i< arr1.length; i++) {
				sum += arr1[i]*arr2[i];
			}
			return sum;
		}
	}
	
	generateChain(length:number):Pass[]{
		var count:number = 0;
		var lastPass: Pass = null;
		var data = this.data.slice(0);
		var res:Pass[] = [];
		var lengthArray = data.map((p) => p.length);
		var uniqueLengths = lengthArray.filter(function(item, pos) {
				return lengthArray.indexOf(item) == pos;
		});
		var minLength = Math.min.apply(null, uniqueLengths);
		var maxLength = Math.max.apply(null, uniqueLengths);
		
		while(count < length){
			var currentArray = data;		
			if(length - count <= maxLength){
				currentArray = data.filter((p) => p.length == (length - count));
			}
			
			if(lastPass){
				currentArray = currentArray.filter((p) => p.start_position == lastPass.end_position);
			}
			var arrayLength = currentArray.length;
			if(arrayLength == 0){
				continue;
			}
			var index = Math.round((Math.random() * (arrayLength - 1)));
			
			lastPass = currentArray[index];
			res.push(lastPass);
			count += lastPass.length;
		}
		
		return res;
	}
	
	generateChain2(length:number):Pass[]{
		var that = this;
		var combis_passes: Pass[][] = [];
		this.number_combinations.forEach((c)=>{
			var combi_passes = Pass[][];
			c.forEach((n, i) => {
				var passes = that.data.filter((p) => {
					return p.length == that.number_uniques[i];
				}));
				
				for(var j=0;j<n;j++){
					var combi_pass: Pass[][] = [];
					for(var k=0;k<passes.length;k++){
						if(!combi_pass[j]){
							combi_pass[j] = [];
						}
						combi_pass[j]
					}
				}
			});
		});
		console.log(combis_passes);
		
		return combis_passes;
	}

  private saveData() {
		this.local.set('moves', JSON.stringify(this.data));
		this.getArraysCombinations();
  }
}