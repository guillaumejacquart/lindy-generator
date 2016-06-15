import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PassPage} from '../pass-page/pass-page';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {Storage, LocalStorage} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/list-page/list-page.html'
})
export class ListPage {
  private data:[Pass];
  private local:Storage;

  constructor(private _navController: NavController, private http: Http) {
	this.local = new Storage(LocalStorage);
	var that = this;
	try{
		this.local.get('moves').then((dataString) => {		
			if(dataString){
				var localData = JSON.parse(dataString);
				that.data = localData;
			} else {
				that.getData();
			}
		}, (err) => {
			that.getData();
		});
	}
	catch(e){
		that.getData();
	}
						
  }
  
  add(){
	this._navController.push(PassPage, {pass: new Pass()});
  }

  edit(pass: Pass){
    this._navController.push(PassPage, {pass: pass});
  }

  remove(index){
	if (index > -1) {
	   this.data.splice(index, 1);
	}
  }
  
  getData(){
	var that = this;
	that.http.get('moves.json')
		.map(res => res.json())
		.subscribe(data => {							
						that.data = data;							
						that.local.set('moves', JSON.stringify(data));
					},
					err => console.log(err),
					() => console.log('Completed'));
  }
}

export class Pass {
	is_break: boolean;
}
