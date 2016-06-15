import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PassPage} from '../pass-page/pass-page';
import {PassService} from '../pass-page/pass-service';

@Component({
  templateUrl: 'build/pages/list-page/list-page.html'
})
export class ListPage {
  private data:Pass[];
  private service: PassService;
  
  constructor(private _navController: NavController, service: PassService) {
	this.service = service;	
	var that = this;
	this.service.getPasses().then(function(data){
		that.data = data;
	});
  }
  
  add(){
    var pass:Pass = new Pass();
	pass.is_new = true;
	this._navController.push(PassPage, {pass: pass});
  }

  edit(pass: Pass){
    this._navController.push(PassPage, {pass: pass});
  }

  remove(index){
	if (index > -1) {
	   this.data.splice(index, 1);
	   this.service.save();
	}
  }
  
  getData(){
	var that = this;
  }
}

export class Pass {
	is_break: boolean;
	end_position: EndPosition;
	name: string;
	length: number;
	is_new: boolean;
}

export enum EndPosition{
	FaceToFace,
	ClosePosition
}
