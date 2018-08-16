import { Component } from '@angular/core';
import { Events, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { Socket } from "ng-socket-io";
import {Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
@Component({
  selector: 'page-provider',
  templateUrl: 'provider.html',
})
export class ProviderPage {
   loadCtroller: any;
   toastCtroller: any;
   acc: any;
   imgUpload: any;
   profilePic: any;
   notifications: number;
   supplier: any;
   url: string = 'http://swiftify.co.ke:3000/';
  constructor(private transfer: FileTransfer,
    private camera: Camera,
    private storage: Storage, 
    public socket: Socket, 
    public loadCtrl: LoadingController, 
    public actionCtrl: ActionSheetController,  
    public toastCtrl: ToastController, 
    public events: Events) {
  this.socketResponse().subscribe(data =>{
        let datam:any = data;
          var module = datam.module;

          if(module == 'notification'){
              switch (datam.submodule) {
              	case "fetch":
              		this.notifications = datam.number;
              		 this.profilePic = this.url+'/'+datam.pic;
              		  this.supplier = datam.supplierStatus;
              		  this.acc.pic = datam.pic;
                       this.storage.set('swiftifyVariables', JSON.stringify(this.acc)).catch(function (err) {
                     });
              		break;
          		case 'newNote':
          		    var xr = datam.tos.findIndex(q => q ==  this.acc.businessName );
	          		if(xr > -1){
	              		  this.notifications +=1;
	              		  if(datam.status){
	              		  	this.supplier.status = datam.status;
	              		  }
	          		}
              		break;
              	default:
              		this.notifications = 0;
              		break;
              }
          }else{
          	 if(this.loadCtroller){
	               this.Load('hide', null);
	           }
          }
	           this.events.publish(module, datam);

	          
           
        });

  }
  makeInfo(){
  	this.storage.ready().then(()=>{
  	this.storage.get('swiftifyVariables').then((val)=>{
            if(val){
                this.acc = JSON.parse(val);
                this.profilePic = this.url +'/'+this.acc.pic;
                this.socketRequest({
                	module: 'notification',
                	action: 'fetch',
                	userId: this.acc.businessName
                })
            }
        });
  }).catch(function(err){
  	   console.log(err);
  })
  }
  socketRequest(data){
  	this.socket.emit('appData', {data: data});
  }
  socketResponse(){
	let observable = new Observable( observer =>{
      this.socket.on('serverData', data=>{
	          observer.next(data);
	      });
	    });
	      return observable;
	}
	 Load(action, msg){
	 	if(action == 'show'){
	 		if(!msg){
	 			msg = 'Just a moment...';
	 		}
		 	this.loadCtroller = this.loadCtrl.create({
		 		content: msg,
		 		duration: 10000
		 	})
	 	    this.loadCtroller.present();
		 }else{
		 	this.loadCtroller.dismiss();

		 }
	 }
	 toast(message,pos){
		 	this.toastCtroller = this.toastCtrl.create({
		 		message: message,
		 		position: pos,
		 		duration: 2000
		 	})
	 	    this.toastCtroller.present();
	 }
	 action(){
	 	let buttons;
	 	  	buttons = [
		            {
		              text: 'Take a new picture',
		              icon: 'camera',
		              role: 'destructive',
		              handler: () => {
		               this.takePicture();
		              }
		            },
		            {
		              text: 'Choose from photos',
		              icon: 'images',
		              handler: () => {
		                 this.choosePicture()
		              }
					    },
					    {
					      text: 'Cancel',
					      role: 'cancel',
					      handler: () => {
					      }
					    }
					    
					  ]
	 	let actionSheet = this.actionCtrl.create({
			  buttons: buttons
			   });
			actionSheet.present();
	 }
	 takePicture(){
		     const  options2: CameraOptions = {
		                   quality: 60,
		                   destinationType: this.camera.DestinationType.DATA_URL,
		                   encodingType: this.camera.EncodingType.JPEG,
		                   mediaType: this.camera.MediaType.PICTURE,
                           targetWidth: 350,
                           targetHeight: 350,
		                   allowEdit: true,
		                   correctOrientation: true,
		                    }
		                      this.camera.getPicture(options2).then((imageData) => {
		                            this.imgUpload = 'data:image/jpeg;base64,' + imageData;
		                           this.profilePic = this.imgUpload;
		                           this.upldImage();
		                      }, (err) => {
		                      });
		   }
   choosePicture(){
	         const  options2: CameraOptions = {
	                   quality: 60,
	                   destinationType: this.camera.DestinationType.DATA_URL,
	                   encodingType: this.camera.EncodingType.JPEG,
	                   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
	                   targetWidth: 350,
                       targetHeight: 350,
		               allowEdit: true,
		               correctOrientation: true,
	                    }
	                      this.camera.getPicture(options2).then((imageData) => {
	                            this.imgUpload = 'data:image/jpeg;base64,' + imageData;
		                           this.profilePic = this.imgUpload;
		                           this.upldImage();
	                      }, (err) => {
	               });
	          }
	 changeDate(date){
    var dateString:any = new Date(date);
        dateString = dateString.toString();
         date = dateString.substr(0, 15);
        let time = dateString.substr(16, 5);
        dateString = date + ' at '+time;
        return dateString;
  }
  upldImage(){ 
 	  
	     const fileTransfer: FileTransferObject = this.transfer.create();
	        let options: FileUploadOptions = {
	          fileKey: 'swiftify',
	          fileName: 'swiftify',
	          chunkedMode: false,
	          mimeType: "image/jpeg",
	          headers: {},
	          params: {
	          		action: 'profile',
                    userId: this.acc.businessName
	            }
	          }
 	
	    fileTransfer.upload(this.imgUpload, this.url+'imageUpload',  options)
	          .then((data) => {
	            let datx:any = JSON.stringify(data);
	               let string = datx.split('\\"');
	               this.storage.ready().then(()=>{
               			 this.storage.get('swiftifyVariables').then((val)=>{
		                 let vals = JSON.parse(val);
		                  this.toast('Profile updated', 'middle');
		                         vals.pic = string[1];
		                         this.profilePic = this.url+''+vals.pic;
		                         this.acc.pic = vals.pic;
		                        this.storage.set('swiftifyVariables', JSON.stringify(vals)).catch(function (err) {
		                     });
		                  });
	               })
	            
	        }, (err) => {
	            this.toast('Photo could not be uploaded', 'middle');
	        });
	   }
   upload(doc){
   	  const options: CameraOptions = {
	                   destinationType: this.camera.DestinationType.DATA_URL,
	                   encodingType: this.camera.EncodingType.JPEG,
	                   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
		               allowEdit: true,
		               correctOrientation: true,
	                    }
	                      this.camera.getPicture(options).then((imageData) => {
	                            this.imgUpload = 'data:image/jpeg;base64,' + imageData;
		                           this.upldImage1(doc);
	                      }, (err) => {
	               });


   }
   /*download(app) {
   	const fileTransfer: FileTransferObject = this.transfer.create();
	  const url = this.url+'/kits/'+app;
	  fileTransfer.download(url, this.file.dataDirectory + 'Swiftify.apk').then((entry) => {
	   this.toast("Your app has been downloaded.", 'bottom');
	  }, (error) => {
	   console.log(error)
	     this.toast("App could not be downloaded", 'bottom');
	  });
	}*/
   upldImage1(doc){
   	 const fileTransfer: FileTransferObject = this.transfer.create();
	        let options: FileUploadOptions = {
	          fileKey: 'swiftify',
	          fileName: 'swiftify',
	          chunkedMode: false,
	          mimeType: "image/jpeg",
	          headers: {},
	          params: {
	          		action: 'doc',
                    userId: this.acc.businessName,
                    doc: doc
	            }
	          }
	    fileTransfer.upload(this.imgUpload, this.url+'imageUpload',  options)
	          .then((data) => {
	            let datx:any = data.response;
	            if(datx == 2){
	            	this.supplier.status = 'pending';
	            }
	            this.toast('document has been uploaded', 'bottom');
	        }, (err) => {
	            this.toast('Photo could not be uploaded', 'middle');
	        });
   }
}
