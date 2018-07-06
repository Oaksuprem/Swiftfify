import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import  * as $ from "jquery";
import { StatusBar } from '@ionic-native/status-bar';
import { ProviderPage } from '../provider/provider';
import { Storage } from '@ionic/storage';
import { OfferPage } from '../offer/offer';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
   menuItems: any = [{title:'Requests'}, 
    				 {title: 'Products'},
    				 {title: 'Log in', hide: 'container', show: 'container2'},
    				 {title: 'Contact us'},
    				 {title: 'About'}
    				 ];
   inputs: any = [];
   search_value: string;
   emailPassErr: string;
   submitButtons: any = [
       {title: 'Log in'}, 
       {title: 'Log in'}, 
       {title: 'Sign up'}, 
       {title: 'Forgot password ?'}, 
       {title: 'Create a new account'}, 
       {title: 'Already have an account? Log in.'}, 
       {title: 'Back to log in.'}, 
       {title: 'Verify'}, 
   ];
   requests:any = [];
   emailPass: string;
   loginFname:string;
   errorEmail: string;
   errorEmail1: string;
   errorPass: string;
   verError: string;
   accountInfo: any;
   code: any;
   verError1: boolean;
   logged: boolean = false;
  constructor(private events: Events, private storage: Storage, public provider: ProviderPage, public navCtrl: NavController, private statusBar: StatusBar) {
  	  this.provider.makeInfo();
      $(document).ready(function(){
        var height = $('.colHeight').css('height');
        $('.colHeight').css('lineHeight',height);
      });
     this.inputs = [
        [
          {title: 'Email', type:'email', ngBind: '' },
          {title: 'Password', type:'password', ngBind: '' },
        ],

        [
          {title: 'Full name', type: 'text', ngBind: '' },
          {title: 'Business name', type: 'text', ngBind: ''},
          {title: 'Email', type: 'email', ngBind: ''},
         /* {title: 'Phone number', type: 'number', ngBind: 'phoneNumber'},
          {title: 'Address', type: 'text', ngBind: 'address' },
          {title: 'Location'},*/
          {title: 'Password', type: 'password', ngBind: '' },
         // {title: 'Confirm password', type: 'password', ngBind: 'cpass' },
        ],
        [
          {title: 'Enter verification code sent to your email', type: 'number', ngBind: '' },

         ]

  	 ]
      $(document).ready(function(){
      	$('.scrollmenu button').eq(0).css('borderBottom', '2px solid white');
      })


      //events
  this.provider.events.subscribe('request', (data)=>{
          switch(data.submodule){
          case 'addRequest':
              this.provider.toast("Your request has been uploaded", 'middle');
              this.fetch('all', null);

          break;
        }
      })
   this.provider.events.subscribe('quotation', (data)=>{
     switch (data.submodule ) {
       case 'newsaved':
       var indx = this.requests.findIndex(r => r.dateCreated == data.id);
            if(indx > -1){
              this.requests[indx] = data.info.id;
            }
            break;
          }
          });
   this.provider.events.subscribe('userProposed', (data)=>{
      switch (data.submodule) {
        case "offerRemoved":
        var ind = this.requests.findIndex(q => q.dateCreated == data.id);
         if(ind !==-1){
           this.requests[ind].prop -=1;
         }
      }
      });
      this.events.subscribe('indexResponse', (data)=>{
        this.errorPass = undefined;
        this.errorEmail = undefined;
        this.errorEmail1 = undefined;
        if(data.submodule == 'signUp' || data.submodule == 'logIn' ){
          if(data.err){
            if(data.err == 'errSignUp'){
               this.errorEmail = data.message;
            }else if(data.err == 'errorEmail'){
               this.errorEmail1 = data.message;
            }else if(data.err ==  'errorPass'){
               this.errorPass = data.message;
            }
          }else{
               this.accountInfo = data.message;
              if(data.message.status !== 'active'){
                $('.signUpDiv, .loginDiv').fadeOut(300);
                $('.verifDiv').fadeIn(300);
              }else{
                this.loggedIn();
              }
            }
          }else if(data.submodule == 'passChanged'){
              this.provider.toast(data.message, null);
              this.hideShow('verifDiv1', 'loginDiv');
          }else if(data.submodule == 'offerSent'){
              if(data.owner == this.provider.acc.businessName)
                  this.provider.toast("Your request has been sent.", 'middle');
               var ind = this.requests.findIndex(q => q.dateCreated == data.req);
               if(ind !==-1){
                 this.requests[ind].props+=1;
               }
          }else if(data.submodule == 'logOut'){
             this.storage.remove('swiftifyVariables').then(() => {
               this.accountInfo = undefined;
               this.logged = false;
             }).catch(function(err){
               if(err)
                 throw err;
             });
             
          }else if(data.submodule == 'foundReqs'){
            if(data.message == 'No request found'){
                this.provider.toast(data.message,'bottom');
            }else{
              this.requests = data.message;
             for(let r = 0; r < this.requests.length; r++){
              this.requests[r].postedAt = this.changeDate(this.requests[r].dateCreated);
           }
            }
            
          }else{
            if(data.err == 'emailError'){
              this.emailPassErr = data.message;
            }else if(!data.err){
              $('.part1').hide();
              $('.part2').fadeIn(600);
              this.code = data.message;
            }
          }
      })
  }
  changeDate(date){
     var dateString:any = new Date(date);
        dateString = dateString.toString();
         date = dateString.substr(0, 15);
        let time = dateString.substr(16, 5);
        dateString = date + ' at '+time;
        return dateString;
  }
  loggedIn(){
    this.provider.profilePic = this.provider.url+'/'+ this.accountInfo.pic;
    this.provider.events.publish('app', {submodule: 'changePic',pic:this.provider.profilePic});
    this.storage.set('swiftifyVariables', JSON.stringify(this.accountInfo)).catch(function(err){
        if(err)
          console.log(err);
      })
    this.logged = true;
     this.hideShow('container2', 'container0');
     this.provider.toast('You are now logged in.', null)
     this.events.publish('app', {
       submodule: 'loggedIn',
       acc: this.accountInfo
     })
  }
  resetPass(pass, cpass){
    if(pass !== cpass){
      $('.verError1').show();
    }else{
      this.provider.socketRequest({
        module: 'updatePass',
        pass: pass,
        userId: this.emailPass
      })
    }
  }
  verify1(data){
    if(data !== this.code){
       this.verError1 = true;
    }else{
       $('.part2').hide();
       $('.part3').fadeIn(600);
    }
  }
  inputKey(index){
    if(index == 2){
       if(!this.ValidateEmail(this.inputs[1][2].ngBind)){
          this.errorEmail = 'Invalid email.'
       }else{
          this.errorEmail = undefined;
       }
    }
  }
   inputKey1(index){
    if(index == 0){
       if(!this.ValidateEmail(this.inputs[0][0].ngBind)){
          this.errorEmail1 = 'Invalid email.'
       }else{
          this.errorEmail1 = undefined;
       }
    }else{
      this.errorPass = undefined;
    }
  }
  inputKey2(){
    this.verError = undefined
  }
  verify(data){
      this.verError = undefined;
    if(this.accountInfo.status !== data ){
          this.verError = 'err';
    }else{
       this.loggedIn();
       this.provider.socketRequest({
         module: 'updateLog',
         email: this.accountInfo.email,
       })
      
    }
  }
  ionViewDidLoad(){
    this.storage.ready().then(()=>{
          this.storage.get('swiftifyVariables').then((val)=>{
              this.accountInfo = JSON.parse(val);
                  if(this.accountInfo){
                    this.logged = true;
                    this.fetch('all', null);
                  }else{
                   this.fetch('all', null);
                  }
            })
        });
  }
  goToRequest(req){
    if(!this.accountInfo)
      alert('Please log in first to view this content');
    else
    this.navCtrl.push(OfferPage, {data: [req, this.accountInfo]});
  }
 
  fetch(value, value0){
    if(!value0){
     this.provider.Load('show', 'Fetching requests...');
    }
    let email;
    if(this.accountInfo){
      email = this.accountInfo.email;
    }
    this.provider.socketRequest({
      module:'fetchRequests',
      user: email,
      value: value.toLowerCase()
    })
  }
  implictSearch(tag){
    $('.itemSearch').slideDown();
    this.search_value = tag;
    this.fetch(tag, null);
  }
    toggleMenu(item){
      if(item){
       this.fetch('all', 'no');
      }
      $('.itemSearch').slideToggle();
    }
    hideError(){
      this.emailPassErr = undefined;
      $('.verError1').hide();

    }
  itemClicked(item, index, hide, show){
  		$('.scrollmenu button').css('borderBottom', 'none');
      	$('.scrollmenu button').eq(index).css('borderBottom', '2px solid #750481');
      this.hideShow(hide, show)	
      if(index == 2){

	  	$('.homePage').fadeOut(600);
        this.statusBar.hide();
      }
  }
  hideShow(hide, show){
      $('.part2, .part3').hide();
       $('.part1').fadeIn(600);
	  	$('.'+hide+'').fadeOut(300)
	  	$('.'+show+'').fadeIn(300);
      this.errorEmail = undefined;
      this.errorEmail1 = undefined;
      this.errorPass = undefined;

  }
  indexAction(data){
    if(!this.errorEmail && !this.errorPass && !this.errorEmail1 ){
       this.provider.socketRequest(data);
       this.provider.Load('show', null);
    }

  }
  verify2(email){
    if(!this.ValidateEmail(email)){
      this.emailPassErr = 'Invalid email';
    }else{
      this.provider.socketRequest({
        module: 'checkEmail',
        email: email
      })
    }
  }
  ValidateEmail(mail)
        {
          if (/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test(mail))
          {
          return (true)
          }
          return (false)
      }

}
