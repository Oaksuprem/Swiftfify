var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, Events, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { Socket } from "ng-socket-io";
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
var ProviderPage = /** @class */ (function () {
    function ProviderPage(storage, socket, loadCtrl, actionCtrl, toastCtrl, events) {
        var _this = this;
        this.storage = storage;
        this.socket = socket;
        this.loadCtrl = loadCtrl;
        this.actionCtrl = actionCtrl;
        this.toastCtrl = toastCtrl;
        this.events = events;
        this.storage.get('swiftifyVariables').then(function (val) {
            if (val) {
                _this.acc = JSON.parse(val);
            }
        });
        this.socketResponse().subscribe(function (data) {
            var datam = data;
            var module = datam.module;
            if (_this.loadCtroller) {
                _this.Load('hide', null);
            }
            _this.events.publish(module, datam);
        });
    }
    ProviderPage.prototype.socketRequest = function (data) {
        this.socket.emit('appData', { data: data });
    };
    ProviderPage.prototype.socketResponse = function () {
        var _this = this;
        var observable = new Observable(function (observer) {
            _this.socket.on('serverData', function (data) {
                observer.next(data);
            });
        });
        return observable;
    };
    ProviderPage.prototype.Load = function (action, msg) {
        if (action == 'show') {
            if (!msg) {
                msg = 'Just a moment...';
            }
            this.loadCtroller = this.loadCtrl.create({
                content: msg,
                duration: 10000
            });
            this.loadCtroller.present();
        }
        else {
            this.loadCtroller.dismiss();
        }
    };
    ProviderPage.prototype.toast = function (message, pos) {
        this.toastCtroller = this.toastCtrl.create({
            message: message,
            position: pos,
            duration: 2000
        });
        this.toastCtroller.present();
    };
    ProviderPage.prototype.action = function (action) {
        var buttons;
        if (action = 'changeProfile') {
            buttons = [
                {
                    text: 'Take a new picture',
                    icon: 'camera',
                    role: 'destructive',
                    handler: function () {
                        //this.takePicture(action);
                    }
                },
                {
                    text: 'Choose from photos',
                    icon: 'images',
                    handler: function () {
                        // this.choosePicture(action)
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                }
            ];
        }
        var actionSheet = this.actionCtrl.create({
            buttons: buttons
        });
        actionSheet.present();
    };
    ProviderPage.prototype.changeDate = function (date) {
        var dateString = new Date(date);
        dateString = dateString.toString();
        date = dateString.substr(0, 15);
        var time = dateString.substr(16, 5);
        dateString = date + ' at ' + time;
        return dateString;
    };
    ProviderPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-provider',
            templateUrl: 'provider.html',
        }),
        __metadata("design:paramtypes", [Storage, Socket, LoadingController, ActionSheetController, ToastController, Events])
    ], ProviderPage);
    return ProviderPage;
}());
export { ProviderPage };
//# sourceMappingURL=provider.js.map