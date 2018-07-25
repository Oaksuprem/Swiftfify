import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProviderPage } from '../provider/provider';
import  * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-notify',
  templateUrl: 'notify.html',
})
export class NotifyPage {
  data: any;
  constructor(public navCtrl: NavController, public provider: ProviderPage, public navParams: NavParams) {
     this.data = this.navParams.get('data');
    	$(document).ready(function(){
  		var height = $('.colHeight2').css('height');
  		$('.colHeight2').css('lineHeight',height);
  	});
  }
}
