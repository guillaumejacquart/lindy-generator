import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Pass} from '../list-page/list-page';
import {SelectedFactPage} from '../selected-fact-page/selected-fact-page';

@Component({
  templateUrl: 'build/pages/pass-page/pass-page.html'
})
export class PassPage {

  private pass: Pass;
  constructor(private _navController: NavController, private _navParams: NavParams) {
    this.pass = this._navParams.data.pass;
  }

  ionViewWillEnter(){
  }
  
  onSubmit() { 
  }

}
