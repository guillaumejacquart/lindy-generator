import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PassPage} from '../pass-page/pass-page';
import {PassService} from '../pass-page/pass-service';

@Component({
  templateUrl: 'build/pages/list-page/list-page.html'
})
export class ListPage {
  private data:[Pass];
  private service: PassService;
  
  constructor(private _navController: NavController, service: PassService) {
	this.service = service;	
	var that = this;
	this.service.getPasses().then(function(data){
		that.data = data;
	});
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
  }
}

export class Pass {
	is_break: boolean;
	end_position: EndPosition;
}

export enum EndPosition{
	FaceToFace,
	ClosePosition
}
