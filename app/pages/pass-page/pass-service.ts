import { Injectable } from '@angular/core';
import { Pass } from '../list-page/list-page';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class PassService {
  
  
  private data:[Pass];
  private local:Storage;
  
  constructor(private http:Http){
  }

  getPasses() {
    this.local = new Storage(LocalStorage);
	var that = this;
	return new Promise<Pass[]>(resolve => {  
			try{
				this.local.get('moves').then((dataString) => {		
					if(dataString){
						var localData = JSON.parse(dataString);
						that.data = localData;
						resolve(that.data);
					} else {
						that.getData().then(function(data){
							resolve(data);
						});
					}
				}, (err) => {
					that.getData().then(function(data){
						resolve(data);
					});
				});
			}
			catch(e){
				that.getData();
			}	
		}
    );
	
  }
  
  getData(){
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
}