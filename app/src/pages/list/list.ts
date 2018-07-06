import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import  * as $ from "jquery";
import { RequestPage } from '../request/request';
import { ProviderPage } from '../provider/provider';
import { OfferPage } from '../offer/offer';
import { DocsPage } from '../docs/docs';
import { ClientDocsPage } from  '../client-docs/client-docs';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
   docs = [];
   doc: string;
   acc: any;
   type: string;
  constructor(private provider: ProviderPage, public navCtrl: NavController, public navParams: NavParams) {
  	this.acc = this.navParams.get('acc');
  	this.doc = this.navParams.get('doc');
    $(document).ready(function(){
  		var height = $('.colHeight').css('height');
  		$('.colHeight').css('lineHeight',height);
  	});

     this.provider.events.subscribe('request', (data)=>{
    
          switch(data.submodule){
          case 'addRequest':
             this.type = data.type;
          data.request.date = this.provider.changeDate(data.request.dateCreated);
             this.docs.unshift(data.request);
             break;
           case 'showDocs':
              this.type = data.type;
           this.docs = data.docs;
               for(let r = 0; r < this.docs.length; r++){
                this.docs[r].date = this.provider.changeDate(this.docs[r].dateCreated);
             }
             break;
             case 'fetchDocument':
                var ind = this.docs.findIndex(q => q.serial == data.doc.serial);
                if(ind > -1){
                  this.docs[ind].read = true;
                }
               this.goToRequest(data.doc, data.type);
          }
        })
  }
  goToInvoice(doc){
      this.navCtrl.push(ClientDocsPage,  {data: ['invoice','fetchInvoice',this.acc, doc]});
  }
   goToRequest(req, type){
     switch (type) {
       case "Receipts":
      this.navCtrl.push(ClientDocsPage,  {data: ['receipt','receipt',this.acc, req]});
         break;
       case 'DeliveryNotes':
          this.navCtrl.push(ClientDocsPage, {data: ['deliveryNote', 'deliveryNote', this.acc, req]})
         break;
         case 'InspectionCertificates':
          this.navCtrl.push(ClientDocsPage, {data: ['InspectionNote', 'InspectionNote',  req, this.acc]})

         break;
       default:
          this.navCtrl.push(OfferPage, {data: [req, this.acc]});
         break;
     }
  }
  goTo(doc){
       this.provider.socketRequest({
         module: 'fetchDocument',
         item: doc.doc,
         serial: doc.serial,
         date: doc.dateCreated,
         businessName: this.acc.businessName
       })
  }
  goToLPO(doc){
      this.navCtrl.push(DocsPage,  {data: ['lpo','checkInfo',this.acc, doc]});
    }
  ionViewDidLeave() {
     if(this.navCtrl.getActive().name == 'ListPage'){
       this.provider.events.unsubscribe('request');
    }
    }
  ionViewDidLoad(){
    this.provider.socketRequest({
      module: 'fetchDocs',
      type: this.doc,
      email: this.acc.email,
      id: this.acc.businessName
    })
  }

  createDoc(){
  	if(this.doc == 'Quotations'){
  	   this.navCtrl.push(RequestPage, {acc: this.acc});
  	}
  }

}
