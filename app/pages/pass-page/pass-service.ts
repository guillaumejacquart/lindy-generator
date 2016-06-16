import { Injectable } from '@angular/core';
import { Pass } from '../list-page/list-page';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class PassService {


  data: [Pass];
  private local: Storage;

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
					that.data = data;
					that.local.set('moves', JSON.stringify(data));
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

  private saveData() {
		this.local.set('moves', JSON.stringify(this.data));
  }
}