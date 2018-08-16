import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import  * as $ from "jquery";
import { ProviderPage } from '../provider/provider';



@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  current_table: any;
  users:any = [];
  notApprove: String;
  currentUser: string;
  message: string;
  transctions: any = [];
  constructor(public navCtrl: NavController, private provider:ProviderPage,  public navParams: NavParams) {
  	this.current_table = 'approval';
  	this.load();
  	this.provider.makeInfo()
  	//events
  	this.provider.events.subscribe('suppliers', (data)=>{
  		switch (data.submodule) {
  			case "message":
  				if(data.status){
  					this.provider.toast('User supplier status has been changed', 'middle');
  					if(data.status == 'null')
                       this.users.splice(this.users.findIndex(q => q.businessName == data.user), 1);
  					else
  						this.users[this.users.findIndex(q => q.businessName == data.user)].supplier.status == data.status
  				}else{
  					this.provider.toast('Message sent', 'middle');
  					this.message = '';
  				}
  				break;
  			
  			default:
           this.users = data.users;
           this.transctions = data.transactions;
  				break;
  		}
  	})
  }
	hideShow(status, user){
		this.notApprove = status;
		this.currentUser = user;
		$('#tables').hide();
		$('#messageArea').show();

	}
	show(){
		$('#messageArea').hide();
		$('#tables').show();
		this.notApprove = '';
		this.currentUser = '';
	}
 changeTable(data){
 	$('.btn').removeClass('active');
 	$('#'+data+'').addClass('active');
    this.current_table = data;
 }
 load(){
 	this.provider.socketRequest({
  		module: 'fetchSuppliers'
  	})
 }
 sendMessage(mess){
	this.changeStatus(this.notApprove, this.currentUser, mess);
 	$('#messageArea').hide();
	$('#tables').show();
	this.notApprove = '';
	this.currentUser = '';
 }
 changeStatus(status, user, reason){
 	let acc = this.provider.acc;
    this.provider.socketRequest({
    	module: 'sendAction',
    	status: status,
    	user: user,
    	reason: reason,
    	from: {
    		name: acc.businessName,
    		email: acc.email,
    		pic: acc.pic
    	},
    	serial: Date.now()
    })
 }
 calTime(data, invoicedate){
 	          var hours;
               if (data == 'Pay within 2 months'){
                 hours = 168*8;
                 return this.calculateDate(hours, invoicedate);
               }
              else if (data == 'Pay within 1 week'){
                    hours = 168;
              
                return this.calculateDate(hours, invoicedate);
                }else{
                   return 'On delivery.';
                }
            
            
 }
 calculateDate(hours,invoicedate){
    if(hours){
      var secs = invoicedate + hours*3600*1000;
      var date = this.provider.changeDate(secs);

      return date.substr(0,15);
    }
 }
}
