import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import  * as $ from "jquery";
import { RequestPage } from '../request/request';
import { ProviderPage } from '../provider/provider';
import { OfferPage } from '../offer/offer';
import { DocsPage } from '../docs/docs';
import { ClientDocsPage } from  '../client-docs/client-docs';
import { NotifyPage } from '../notify/notify';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
   docs = [];
   docx: string;
   acc: any;
   type: string;
   searchVal: string;
  constructor(private provider: ProviderPage, public navCtrl: NavController, public navParams: NavParams) {
  	this.acc = this.navParams.get('acc');
  	this.docx = this.navParams.get('doc');
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
                switch (data.type) {
                  case "LPOs":
                    this.goToLPO(data.doc);
                    break;
                  case "Invoices":
                    this.goToInvoice(data.doc);
                  break;
                  case "Notes":
                  this.navCtrl.push(NotifyPage, {data: data.doc});
                  break;
                  default:
                    this.goToRequest(data.doc, data.type);
                    break;
                }
              
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

  toggleSearch(btn){
    switch (btn) {
      case "searchIcon":
       $('#searchPosition').toggle();
        break;

      case "backArrow":
       $('#searchPosition').hide();
        $('.docs').show();
         this.searchVal = '';
        break;

        case "close":
         this.searchVal = '';
          $('.docs').show();
        break;
    
    }
  }
  
  search(val){
    var index;
    if(val && val.trim() !==''){
    $('.docs').hide();
    let thisx = this;
     this.docs.map(function(x){
       if(thisx.docx == 'Receipts' && thisx.provider.acc.businessName !== x.to.name)
         index = x.to.name.toLowerCase().indexOf(val.toLowerCase());
       else if(thisx.docx == 'DeliveryNotes' || thisx.docx == 'InspectionCertificates')
         index = x.from.businessName.toLowerCase().indexOf(val.toLowerCase());
       else if(thisx.docx =='Offers')
         index = x.businessName.toLowerCase().indexOf(val.toLowerCase());
       else if(thisx.docx =='Quotations')
         index = x.title.toLowerCase().indexOf(val.toLowerCase());
       else
         index = x.from.name.toLowerCase().indexOf(val.toLowerCase());
          if(index > -1 ){
             $('#'+x.dateCreated+'').show();
          }
     })
   }else{
      $('.docs').show();
   }
  }
  goTo(doc, index){
    var serial = doc.serial;
    this.docs[index].read = true;
       this.provider.socketRequest({
         module: 'fetchDocument',
         item: doc.doc,
         serial: serial,
         date: doc.dateCreated,
         businessName: this.acc.businessName,
         toId: doc.from.name
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
      type: this.docx,
      email: this.acc.email,
      id: this.acc.businessName
    })
  }

  createDoc(){
  	if(this.docx == 'Quotations'){
      if(this.provider.acc.address){
  	   this.navCtrl.push(RequestPage, {acc: this.acc});
      }else{
        alert('You need to update your address');
      }
  	}
  }

}
