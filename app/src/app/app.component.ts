import { Component , ViewChild} from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { Storage } from '@ionic/storage';
import  * as $ from "jquery";
import { ProviderPage } from '../pages/provider/provider';
import { ListPage } from '../pages/list/list';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
	 @ViewChild(Nav) nav: Nav;
     rootPage:any = HomePage;
     pages: Array<{title: string, icon: string, component: any, docs: string}>
     pages2: Array<{title: string, icon: string, component: any, docs: string}>
     inputs: any;
     accountInfo: any;
     docs: any = [
                 {title: 'Certificate of Registration', abr: 'COR', uploaded: false},
                 {title: 'KRA certificate', abr: 'KCR', uploaded: false}
               ]
  constructor(private provider:ProviderPage, private storage: Storage, platform: Platform, 
    statusBar: StatusBar, private events: Events,  splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.manipulateData();
    });
    //events
    this.events.subscribe('app', (data)=>{
      if(data.submodule == 'updateProfile'){
        this.provider.toast('Your profile has been updated.', null);
         $('.updateInpts').slideUp(300);
        this.accountInfo = data.user;
        this.storage.remove('swiftifyVariables');
        this.storage.set('swiftifyVariables', JSON.stringify(this.accountInfo)).catch(function(err){
        if(err)
          console.log(err);
      })
      }else if(data.submodule == 'loggedIn'){
       this.manipulateData()
      }else if (data.submodule == 'changePic'){
      this.provider.profilePic == data.pic;
      alert(this.provider.profilePic);
    }
    })
  }
  manipulateData(){
     this.storage.ready().then(()=>{
          this.storage.get('swiftifyVariables').then((val)=>{
            if(val){
                this.accountInfo = JSON.parse(val);
                let acc = this.accountInfo;
             this.inputs = [
                  {title: 'Business name', type:'text', ngBind: acc.businessName},
                  {title: 'Phone', type:'number', ngBind: acc.phone},
                  {title: 'Street', type:'text', ngBind: acc.address.street},
                  {title: 'Town', type:'text', ngBind: acc.address.town},
                  {title: 'ZIP', type:'text', ngBind: acc.address.zip}
               ]
              this.pages = [
                {title: 'Notifications', icon: 'notifications', component: ListPage, docs: 'Notifications'},
                {title: 'Requests', icon: 'create', component: ListPage, docs: 'Quotations'},
                {title: 'Offers', icon: 'document', component: ListPage, docs: 'Offers'},
                {title: 'Invoices', icon: 'card', component: ListPage, docs: 'Invoices'},
                {title: 'Receipts', icon: 'pricetag', component: ListPage, docs: 'Receipts'}
              ]
               this.pages2 = [
                {title: 'LPOs', icon: 'paper', component: ListPage, docs: 'LPOs'},
                {title: 'Delivery Notes', icon: 'cart', component: ListPage, docs: 'DeliveryNotes'},
                {title: 'Inspection Certificates', icon: 'clipboard', component: ListPage, docs: 'InspectionCertificates'}
              ]  }
          });
      });
  }
  updateValue(){
    let inputs = this.inputs;
    this.provider.socketRequest({
       module: 'updateProfile',
       businessName: inputs[0].ngBind,
       phone: inputs[1].ngBind,
       email: this.accountInfo.email,
        address: {
            street: inputs[2].ngBind,
            town: inputs[3].ngBind,
            zip: inputs[4].ngBind
        },
    })
    this.provider.Load('show', null);
  }
  toggleList(){
    $('.updateInpts').slideToggle(300);
  }
  openPage(page) {
    this.nav.push(page.component, {acc: this.accountInfo, doc: page.docs});
  }
  signedOut(){
    this.nav.setRoot(HomePage);
     this.events.publish('indexResponse', {submodule: 'logOut'});
     
  }
}

