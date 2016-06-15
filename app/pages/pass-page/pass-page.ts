import {Component} from '@angular/core';
import {NavController, NavParams, Alert} from 'ionic-angular';
import {Pass} from '../list-page/list-page';
import {PassService} from './pass-service';
import {SelectedFactPage} from '../selected-fact-page/selected-fact-page';

@Component({
  templateUrl: 'build/pages/pass-page/pass-page.html'
})
export class PassPage {

  private pass: Pass;
  private service: PassService;
  
  constructor(private _navController: NavController, private _navParams: NavParams, service: PassService) {
    this.pass = this._navParams.data.pass;
	this.service = service;	
  }

  ionViewWillEnter(){
  }
  
  onSubmit(event) { 
    //event.preventDefault();
	if(this.pass.is_new){
		this.service.data.push(this.pass);
	}
	this.service.save();
	let alert = Alert.create({
      title: 'Passe sauvegardée !',
      subTitle: 'Votre passe a bien été sauvegardée',
      buttons: ['OK']
    });
    this._navController.present(alert);
  }

}
