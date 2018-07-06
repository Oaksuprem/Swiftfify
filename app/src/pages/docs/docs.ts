import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import * as $ from 'jquery';
import { TermsPage } from '../terms/terms';
import { ProviderPage } from '../provider/provider';
import { ClientDocsPage } from  '../client-docs/client-docs';

@IonicPage()
@Component({
  selector: 'page-docs',
  templateUrl: 'docs.html',
})
export class DocsPage {
   titles: any = ['Code No.', 'Item descritpion', 'Unit', 'Qty', 'Unit Price', 'Brand', 'Country of origin']; 
   doc: string;
   items: any = [];
   items1: any = [];
   data: any;
   lpoMade:boolean;
   action: string;
   biderSelections: any = [];
   quotationInfo: any;
   from: any;
   approvers = [
               {name:'', designation:''},
               {name:'', designation:''},
               {name:'', designation:''},
              ]
   evaLTitles: any = ['Item', 'Supplier A', 'Award to'];
  
   acc: any;
   tos: any = [];
   quotationComplete:boolean = false;
   LpO: any = ['Item No.', 'Specification', 'Unit', 'Quantity', 'Unit price', 'Total Value']; 
   quoted: boolean;
   biders: any;
   suppliers: any = ["Supplier A"];
    moreLPOs:any = [
      {title: 'Name', bind: ''},
      {title: 'Name', bind: ''},
      {title: 'Date', bind: ''}
    ];


   constructor(public provider:ProviderPage, public events: Events, public navCtrl: NavController, public navParams: NavParams) {
	  this.data = this.navParams.get('data');
    this.acc = this.data[2];
    this.doc = this.data[0];
    if(this.data[1]=='checkInDb'){
       this.provider.socketRequest({
         module: 'checkQuotation',
         id: this.data[3]
       })
       this.from = {email: this.data[4]};
    }else if(this.data[1] == 'checkInfo'){
      let datam = this.data[3];
       this.from = {email: datam.Id};
         this.lpoMade = true;
         if(this.acc.email == datam.Id){
           this.biderSelections = datam.info;
         }else{
           this.biderSelections = [datam.info[datam.info.findIndex(x => x.email == this.acc.email)]];
         }

         let thisx = this;
         this.biderSelections.forEach(function(bider, index){
            var bidder = thisx.biderSelections[index];
                bider.inputs = [
                  {title: 'Vendors Name', ngBind:  bider.vendorName},
                  {title: 'Email', ngBind: bider.email},
                  {title: 'Terms of Payment', ngBind: bider.top},
                  {title: 'Delivery Point', ngBind: bider.pod},
                  {title: 'Order Date', ngBind: bider.dor}
                 
                ];
             bidder.amount  = bider.TotalValue
             bidder.amntWords  = bider.AmountInWords
         })
        
         this.moreLPOs = [
            {title: 'Name', bind: datam.approvals[0].name},
            {title: 'Name', bind: datam.approvals[1].name},
            {title: 'Date', bind: datam.approvedDate},
         ]
         this.data[3] = datam.serial;
    }else{
    this.tos = this.data[1];
    this.from = {
      email: this.acc.email,
      businessName: this.acc.businessName
      }
    this.action = this.data.action;
    this.items = [
    {desc: '', unit: '', qty: '', price: '', brand:'', origin: '', selection: ''},
    {desc: '', unit: '', qty: '', price: '', brand:'', origin: '', selection: ''},
    {desc: '', unit: '', qty: '', price: '', brand:'', origin: '', selection: ''},
    {desc: '', unit: '', qty: '', price: '', brand:'', origin: '', selection: ''},
    {desc: '', unit: '', qty: '', price: '', brand:'', origin: '', selection: ''}
    ]
  }
    this.events.subscribe('quotation', (data)=>{
     switch (data.submodule ) {
       case 'newsaved':
            if(this.acc.email == data.from.email){
              this.provider.toast("Your quotation has been sent", 'midlle');
              this.quotationComplete = false;
              this.quotationInfo = data.info;
            }
         break;
         case 'quotationFound':
         this.from = {
           email: data.info.from.email,
           businessName: data.info.from.buyerName
         }
         this.items = data.info.items;
         this.items1 = data.info.items;
         this.biders = data.info.biders;
          if(this.biders && this.biders.length>0){
            var index = this.biders.findIndex(q => q.id == this.acc.email);
            if(index > -1){
              this.quoted = true;
              this.items = this.biders[index].items
            }else if(this.from.email == this.acc.email){
              this.items = this.biders[0].items
            }
          }
         this.quotationInfo = {
           processDate: data.info.processDate,
           id: data.info.id
         }
         this.approvers = data.info.witness;
          this.doc = this.data[0];
         this.tos = data.info.to;
          break;
          case 'quoted':
          this.quoted = true;
          break;
          case 'sentLPO':
            this.provider.toast(data.res, 'middle');
          break;
      
     }
    })
  }
  

 toggleIntr(){
   $('#instr').slideToggle(600);
 }
 makeInvoice(){
   this.navCtrl.push(ClientDocsPage, {data: ['invoice', this.acc, this.biderSelections, this.data[3], this.from.email]})
 }
 CreateLPO(){
   this.doc = 'lpo';
     for(let xz = 0; xz< this.items.length; xz++){
       var selection = this.items[xz].selection;
       var item = this.items[xz];
        item = this.biders[selection].items[xz]; 
       item.total_value = item.qty * item.price;
       if(selection == 0 || selection == 1 ||selection == 2){

         this.biderSelections[selection].items.push(item);
         this.biderSelections[selection].amount+=item.total_value;
       }
     }
 }
 createLPo(){
   this.provider.Load('show','Creating LPO');
   this.provider.socketRequest({
     module: 'createLPO',
     biders: this.biderSelections,
     id: this.data[3],
     approvement: this.moreLPOs,
     owner: this.acc.email
   })
 }
 makeEvaluation(){
   this.doc = 'evaluation';
   this.items = this.items1;
   switch (this.biders.length) {
     case 3:
       this.evaLTitles = ['Item', 'Supplier A','Supplier B','Supplier C', 'Award to'];
       this.suppliers = ["Supplier A", "Supplier B", "Supplier C" ];
       break;
     case 2:
       this.suppliers = ["Supplier A", "Supplier B"];
       this.evaLTitles = ['Item', 'Supplier A','Supplier B', 'Award to'];
   }

    for(let xy = 0; xy< this.biders.length; xy++){
   this.biderSelections.push({ 
          inputs: [{title: 'Vendors Name', ngBind: this.tos[xy].name},
          {title: 'Email', ngBind: this.biders[xy].id},
          {title: 'Terms of Payment', ngBind: ''},
          {title: 'Delivery Point', ngBind: ''},
          {title: 'Order Date', ngBind: dateFunction()[0]}
         ],
         items: [],
         amount: 0,
         amntWords: ''
     })
    }
   
 }
 saveQuotation(){
   var items = [];
   this.items.map(function(item){
     if(item.desc && item.desc.trim()!=='' && item.qty && item.desc.trim()!==''){
       items.push(item);
     }
   })
   if(items.length == 0){
     alert('You need to add at least 1 item');
   }
   else{
   this.provider.Load('show', 'Sending quotation...');
   this.provider.socketRequest({
     module: 'saveQuotation',
     tos: this.tos,
     items: items,
     approvers: this.approvers,
     businessName: this.acc.businessName,
     myId: this.acc.email,
     quotationId: this.data[3]
   })
 }
 }
 addItem(){
 	this.items.push({desc: '', unit: '', qty: '', price: '', brand:'', origin: '', selection: ''});

 }
 remove(index){
   this.items.splice(index,1);
 }
 toggleIntr0(){
   this.navCtrl.push(TermsPage);
 }
 makeQuotation(){
   this.provider.Load('show','Sending your quotation...');
   this.provider.socketRequest({
     module: 'updateQuotation',
     items: this.items,
     myId: this.acc.email,
     quotation: this.data[3]
   })
 }
 continue(decision){
 	switch (decision) {
 		case "Yes":
		   $('#notQuoting, .notQuoting').hide(400);
 		   $('#quoting, .quoting').show(400);
 			break;
 		case 'No':
 		   $('#notQuoting, .notQuoting').show(400);
 		   $('#quoting, .quoting').hide(400);
 			break;
 		
 	}
 }
}
function dateFunction(){
  var date = new Date(Date.now());
   var date1 = date.toString();
      return [date1.substr(0, 15)+' at '+date1.substr(16, 5)];
}
