import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import  * as $ from "jquery";
import { ProviderPage } from '../provider/provider';
import { DocsPage } from '../docs/docs';

@IonicPage()
@Component({
  selector: 'page-offer',
  templateUrl: 'offer.html',
})
export class OfferPage {
   req: any;
   acc: any;
   sentRequest: boolean;
   selections:any = [];
   sentQuotation: boolean = false;
  constructor(private provider: ProviderPage, public navCtrl: NavController, public navParams: NavParams) {
  	let data = this.navParams.get('data');
  	this.req = data[0];
  	this.acc = data[1];
  	this.provider.events.subscribe('indexResponse', (data)=>{
	    this.req.props = parseInt($('#proposals').text()) + 1;
  		this.navCtrl.pop();
  	})
  	this.provider.events.subscribe('userProposed', (data)=>{
  		switch (data.submodule) {
  			case 'proposalsFound':
  			    this.req.proposals = data.proposal;
  			    break;
  			case "requestExists":
	  				this.sentRequest = true;
	  				this.req.proposal = data.proposal;
  				break;
  			case "offerRemoved":
            this.sentRequest = undefined;
	  			  this.req.proposal = [];
	  			  this.req.props = parseInt($('#proposals').text()) - 1;
  				break;
  				case "quotationSent":
  				    this.sentQuotation = true;
  					break;
  		}
  		
  	})
     this.provider.events.subscribe('quotation', (data)=>{
     switch (data.submodule ) {
       case 'newsaved':
            if(data.id == this.req.dateCreated){
              this.req.quotationId = data.info.id
            }
            break;
          }
          })
  	var owner: boolean;
  	if(this.acc.email == this.req.Id){
       owner = true;
  	}else{
      owner = false
  	}

  	this.provider.socketRequest({
  		module: 'checkProposal',
  	    email: this.acc.email,
        id: this.req.dateCreated,
        owner: owner,
        quotation: this.req.quotationId
  	   });
  }
  createDoc(){
  	if(this.selections.length > 3){
  		alert("Only up to 3 selections needed");
  	}else{
  		this.navCtrl.push(DocsPage,  {data: ['quotation', this.selections, this.acc, this.req.dateCreated]});
  	}
   }
   gotoQuotation(){
   	this.navCtrl.push(DocsPage,  {data: ['quotation','checkInDb',this.acc, this.req.quotationId, this.req.Id]});
   }
    count(value){
        if(value && value.trim() !== ''){
        	let initial = $('.max').attr('value');
        	var rem = initial - value.length;
        	$('.max').text('Remaining: '+rem);
        }
  }
  actionOffer(id, index, action){
  		switch (action) {
  			case "add":
  				this.selections.push(id);
  				this.req.proposals[index].accepted = true;
  				break;
  			case "remove":
  			   var ind  = this.selections.findIndex(g => g == 'id');
  				this.selections.splice(ind, 1);
  				this.req.proposals[index].accepted = false;
  				 break;
  		}
  }
  removeRequest(id){
  	    this.provider.socketRequest({
  		module: 'removeOffer',
  	    email: this.acc.email,
        id: this.req.dateCreated,
  	   });
  }
   ionViewDidLeave() {
     if(this.navCtrl.getActive().name == 'OfferPage'){
       this.provider.events.unsubscribe('indexResponse');
    }
  }
  changeDate(date){
     var dateString:any = new Date(date);
        dateString = dateString.toString();
         date = dateString.substr(0, 15);
        let time = dateString.substr(16, 5);
        dateString = date + ' at '+time;
        return dateString;
  }
  sendOffer(detail){
     this.provider.Load('show', 'Sending offer...');
     this.provider.socketRequest({

     	module: 'saveOffer',
        id: this.req.dateCreated,
        toId: this.req.businessName,
     	info:{
	        name: this.acc.businessName,
	        pic: this.acc.pic,
	        request: detail,
	        id: this.acc.email,
          image: this.acc.pic,
	        date: Date.now()
     	}
     })
  }
}
