import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PassService} from '../pass-page/pass-service';
import {Pass} from '../list-page/list-page';

@Component({
  templateUrl: 'build/pages/chain-generator/chain-generator.html'
})
export class ChainGeneratorPage {

  private fact:string;
  private service: PassService;
  private data: Pass[];
  
  constructor(private _navController: NavController, service: PassService) {
    this.service = service;
  }

  generate(){
    this.data = this.service.generateChain(32);
  }
}
