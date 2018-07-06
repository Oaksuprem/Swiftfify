import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import  * as $ from "jquery";
import { ProviderPage } from '../provider/provider';

@IonicPage()
@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage {
    acc: any;
  constructor(private provider: ProviderPage, public navCtrl: NavController, public navParams: NavParams) {
      this.acc = this.navParams.get('acc');
  }
  count(index, value){
        if(value && value.trim() !== ''){
        	let initial = $('.max').eq(index).attr('value');
        	var rem = initial - value.length;
        	$('.max').eq(index).text('Remaining: '+rem);
        }
  }
 ionViewDidLeave() {
     if(this.navCtrl.getActive().name == 'ListPage'){
       this.provider.events.unsubscribe('request');
    }
  }
  goToQuot(data){
    var serch = data.searchTags.trim().split(",");
        if(serch.length > 5){
          alert('Only up o 5 tags required.');
        }else{
          var tags = [];
             serch.map(function(tag){
               if(tag){
                 tags.push(tag);
               }
             })
             data.searchTags = tags;
          this.provider.Load('show', 'Creating request');
          this.provider.socketRequest({
            module: 'storeRequest',
            data: data,
            acc: this.acc.email,
            businessName: this.acc.businessName,
            pic: this.acc.pic
          })
           this.navCtrl.pop();
        }  	
  }

}
