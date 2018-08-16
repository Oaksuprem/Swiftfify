import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { ProviderPage } from '../provider/provider';
import * as $ from 'jquery';

@Component({
  selector: 'page-client-docs',
  templateUrl: 'client-docs.html',
})
export class ClientDocsPage {
   items: any = [];
   titles: any;
   titles0: any;
   titles1:any;
   titles2:any;
   doc: any;
   data;
   acc: any;
   from: any;
   bider: any;
   deliveryNote;
   to: any;
   receipt: any;
   serial: number;
   dueDate: string;
   invoicedata: any;
   newDel: any;
   dateCreated: number;
   del:boolean;
   ins: any;
  constructor(private provider:ProviderPage, public navCtrl: NavController, public navParams: NavParams) {

     this.data = this.navParams.get('data');
     this.doc = this.data[0];
     if(this.data[1] == 'fetchInvoice'){
      this.acc = this.data[2];
       this.serial = this.data[3].serial;
       this.invoicedata =this.data[3];
      this.provider.Load('show','Getting invoice information...');
      this.provider.socketRequest({
        module: 'fetchInvoice',
        user: this.data[2].email,
        invoiceInfo: this.invoicedata
      })

     }else if(this.data[1] == 'receipt'){
       this.receipt = this.data[3];
       this.dateCreated = this.receipt.dateCreated;
       this.serial = this.receipt.serial;
       this.invoicedata = this.receipt.from;
       this.acc = this.data[2];
       this.invoicedata ={
         creator: this.receipt.to.email
       }
       this.to = {
         businessName: this.receipt.to.name
       }
       this.from = {
         businessName: this.receipt.from.name
       }
       this.bider = {
         amount: this.receipt.amount
       }
     }else if(this.data[1] == 'deliveryNote'){
           this.deliveryNote = this.data[3];
           this.change();
           this.acc =this.data[2];
     }else if(this.data[1] == 'InspectionNote'){
       this.ins = this.data[2];
       this.acc = this.data[3];
     }else{
       this.serial = this.data[3];
      this.acc = this.data[1];
      this.to = this.acc;
      this.items = this.data[2][0].items;
      this.bider = this.data[2][0];
      this.provider.socketRequest({
        module: 'getInvoDetails',
        user: this.data[4]
      })
     }

  	this.titles = ['Item No.', 'Specification', 'Unit', 'Quantity', 'Unit price', 'Total Value']
  	this.titles0 = ['Description', 'Ordered', 'Delivered', 'Outstanding']
  	this.titles1 = ['Description','Remarks'];
  	this.titles2 = ['Description','Amount'];
    
    this.provider.events.subscribe('invoice', (data)=>{
      switch (data.submodule) {
        case "checkSender":
          this.from = data.res;
          break;
          case'rating':
          if(data.ins)
             this.ins = data.ins;
           else{
             this.ins.rate = true;
             alert('inspectiona already done');
           }
            break;
          case 'invoiceSent':
           this.provider.toast('Invoice has been sent', 'middle');
           this.bider.invoiced = true;
          break;
          case 'updatedReceipt':
          this.receipt.confirmed = true;
          break;
          case 'updatedDelivery':
           this.provider.toast("Your delivery has been saved", 'middle');
           if(!this.deliveryNote){
              this.deliveryNote = {
                delivers: [data.del]
              }
           }else if(!this.deliveryNote.delivers){
                  this.deliveryNote.delivers = [data.del];
           }
           else{
              this.deliveryNote.delivers.push(data.del);
           }
            this.change();
          break;
          case 'invoiceFound':
          if(this.acc.email == this.data[3].creator){
             this.to = this.acc
             this.from = data.person;

          }else{
             this.to = data.person
             this.from = this.acc 
             this.del = data.del;
          }
            this.bider = data.invoice;
            this.bider.amount = this.bider.TotalValue;
            this.receipt = data.invoice.receipt;
            this.items = this.bider.items;
            var hours;
            switch (this.bider.top) {
              case 'Pay within 2 months': 
                 hours = 168*8;
                break;
              case 'Pay within 1 week':
                    hours = 168;
                 break;
              default:
               this.dueDate = 'Payment on delivery.';
                break;
            }
           this.calculateDate(hours);

          break;
          case 'savedReceipt':
          this.provider.toast('Receipt has been sent', 'middle');
          this.receipt = data.receipt;
          break;
          case 'getDeliery':
          this.deliveryNote.newDel = data.doc[0];
          break;
      }

    })
   

  }
   ionViewDidLeave() {
     if(this.navCtrl.getActive().name == 'ClientDocsPage'){
       this.provider.events.unsubscribe('invoice');
    }
  }
  change(){
    let iq = this.deliveryNote.delivers[this.deliveryNote.delivers.length-1].items
              iq.forEach(function(q, index){
                iq[index].qty = q.bal;
                iq[index].del = '';
                iq[index].bal = '';
          });
           this.deliveryNote.newDel= {
               date: this.provider.changeDate(Date.now()),
               items: iq,
               received: '',
               delivered: false
           }
      this.newDel = this.deliveryNote.newDel;
  }
   sendInvoice(){
     var acc = this.provider.acc;
     this.provider.Load('show', 'Sending invoice...');
      this.provider.socketRequest({
        module: 'updateInvoice',
        lpoId: this.data[3],
        toId: this.from.businessName,
        from: {
            email: acc.email,
            name: acc.businessName,
            pic: acc.pic
        }
      })
    }
    makedeliveryNote(items){
      this.doc = 'deliveryNote';
       this.deliveryNote = {
           serial: this.serial,
           from: this.from,
           to: this.to,
           delivers: [],
           newDel: {
             date: this.provider.changeDate(Date.now()),
             items: items,
             received: '',
             delivered: false
           }
       }
    }
    deliveryChange(ind){
      if(ind == 'New'){
         this.deliveryNote.newDel = this.newDel;
         $('.sbmtQt').show();
      }else{
         $('.sbmtQt').hide();
        this.provider.socketRequest({
               module: 'getDeliery',
               id: ind,
               serial: this.deliveryNote.serial,
               dateCreated: this.deliveryNote.dateCreated
        });
      }
    }
    itemCal(event, index){
      let item = this.deliveryNote.newDel.items[index];
      if((item.qty - item.del) < 1 ||   event.keyCode == 45 ||   event.keyCode == 46){
          return false;
      }
    }
    makedeliveryNote1(){
      let allNotEmpty;
      let items = this.deliveryNote.newDel.items;
       this.deliveryNote.newDel.items = [];
       let thisx = this;
        items.map(function(q){
          q.bal = parseInt(q.qty) - parseInt(q.del);
          if(isNaN(q.bal)){
            q.bal = q.qty;
            q.del = 0
          }
          if(q.del !== 0){
             allNotEmpty = 1;
          }
          thisx.deliveryNote.newDel.items.push(q);
        });
        if(allNotEmpty !== undefined){
           this.provider.Load('show', 'Creating delivery note...');
          this.provider.socketRequest({
            module: 'createDelivery',
            deliveryNote: this.deliveryNote
          })
        }else{
          alert('You cannot submit an empty delivery');
        }
     
    }
    makeReceipt(){
      this.doc = 'receipt'; 
    }
    calculateBal(event, val){
      let item = this.deliveryNote.newDel.items[val];
      if(item.del <= item.qty){
        item.bal = item.qty - item.del;
      }else{
        item.del = item.qty - item.bal;
      }

    }
    makePayment(){
      this.provider.Load('show', 'Sending receipt...');
      this.provider.socketRequest({
        module: 'sendingReceipt',
        from: {
           name:  this.from.businessName,
           email: this.from.email
        },
        to: {
           name: this.to.businessName,
           email: this.to.email,
           pic: this.provider.acc.pic
        },
        amount: this.bider.amount,
        serial: this.serial
      })
    }
 confirmPayment(){
   this.provider.Load('show', 'Just a moment...');
   this.provider.socketRequest({
     module: 'updatePayment',
     serial: this.serial,
     dateCreated: this.dateCreated,
     toId: this.to.businessName,
     from: {
           name: this.provider.acc.businessName,
           email: this.provider.acc.email,
           pic: this.provider.acc.pic
     }
   })
 }
 calculateDate(hours){
    if(hours){
      var secs = this.bider.dateInvoiced + hours*3600*1000;
      var date = this.provider.changeDate(secs);
      this.dueDate = 'Payment due '+ date.substr(0,15);
    }
 }
 todayDate(){
   return this.provider.changeDate(Date.now());
 }
 makeInspection(){
    this.doc ='InspectionNote';
    this.ins = {
      serial: this.deliveryNote.serial,
      to: this.deliveryNote.to,
      from: this.deliveryNote.from,
      items: this.deliveryNote.delivers[0].items,
      approvedBy:[
          {name: '', design: ''},
          {name: '', design: ''},
          {name: '', design: ''}
       ]

    }
 }
 createInspection(){

  this.provider.Load('show', 'Rating...');
  this.provider.socketRequest({
    module: 'rating',
    ins: this.ins
  })
 }
}
