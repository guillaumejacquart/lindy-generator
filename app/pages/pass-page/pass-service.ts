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
		
		while(count < length - 2 	* maxLength){
			var currentArray = data;	
			
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
				
		var leftCount = length - count;
		var hasFound = false;
		shuffle(data);
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data.length;j++){
				var move1 = data[i];
				var move2 = data[j];
				if(move1.start_position == lastPass.end_position 
					 && move2.start_position == move1.end_position
					 && (move1.length + move2.length == leftCount
					 		|| move1.length == leftCount)) {
						 res.push(move1);
						 if(move1.length != leftCount){
						 	res.push(move2);
						 }
						 hasFound = true;
						 break;
				};
			}
			
			if(hasFound){
				break;
			}
		}
		
		/**
		 * Shuffles array in place.
		 * @param {Array} a items The array containing the items.
		 */
		function shuffle(a) {
			var j, x, i;
			for (i = a.length; i; i -= 1) {
				j = Math.floor(Math.random() * i);
				x = a[i - 1];
				a[i - 1] = a[j];
				a[j] = x;
			}
		}
		
		return res;
	}

  private saveData() {
		this.local.set('moves', JSON.stringify(this.data));
  }
}