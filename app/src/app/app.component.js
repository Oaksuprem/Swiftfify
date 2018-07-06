var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { Storage } from '@ionic/storage';
import * as $ from "jquery";
import { ProviderPage } from '../pages/provider/provider';
import { ListPage } from '../pages/list/list';
var MyApp = /** @class */ (function () {
    function MyApp(provider, storage, platform, statusBar, events, splashScreen) {
        var _this = this;
        this.provider = provider;
        this.storage = storage;
        this.events = events;
        this.rootPage = HomePage;
        this.docs = [
            { title: 'Certificate of Registration', abr: 'COR', uploaded: false },
            { title: 'KRA certificate', abr: 'KCR', uploaded: false }
        ];
        platform.ready().then(function () {
            statusBar.styleDefault();
            splashScreen.hide();
            _this.manipulateData();
        });
        //events
        this.events.subscribe('app', function (data) {
            if (data.submodule == 'updateProfile') {
                _this.provider.toast('Your profile has been updated.', null);
                $('.updateInpts').slideUp(300);
                _this.accountInfo = data.user;
                _this.storage.remove('swiftifyVariables');
                _this.storage.set('swiftifyVariables', JSON.stringify(_this.accountInfo)).catch(function (err) {
                    if (err)
                        console.log(err);
                });
            }
            else if (data.submodule == 'loggedIn') {
                _this.manipulateData();
            }
        });
    }
    MyApp.prototype.manipulateData = function () {
        var _this = this;
        this.storage.ready().then(function () {
            _this.storage.get('swiftifyVariables').then(function (val) {
                if (val) {
                    _this.accountInfo = JSON.parse(val);
                    var acc = _this.accountInfo;
                    _this.inputs = [
                        { title: 'Business name', type: 'text', ngBind: acc.businessName },
                        { title: 'Phone', type: 'number', ngBind: acc.phone },
                        { title: 'Street', type: 'text', ngBind: acc.address.street },
                        { title: 'Town', type: 'text', ngBind: acc.address.town },
                        { title: 'ZIP', type: 'text', ngBind: acc.address.zip }
                    ];
                    _this.pages = [
                        { title: 'Requests', icon: 'create', component: ListPage, docs: 'Quotations' },
                        { title: 'Offers', icon: 'document', component: ListPage, docs: 'Offers' },
                        { title: 'Invoices', icon: 'card', component: ListPage, docs: 'Invoices' },
                        { title: 'Receipts', icon: 'pricetag', component: ListPage, docs: 'Receipts' }
                    ];
                    _this.pages2 = [
                        { title: 'LPOs', icon: 'paper', component: ListPage, docs: 'LPOs' },
                        { title: 'Delivery Notes', icon: 'cart', component: ListPage, docs: 'Delivery Notes' },
                        { title: 'Inspection Certificates', icon: 'clipboard', component: ListPage, docs: 'Inspection Certificates' }
                    ];
                }
            });
        });
    };
    MyApp.prototype.updateValue = function () {
        var inputs = this.inputs;
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
        });
        this.provider.Load('show', null);
    };
    MyApp.prototype.toggleList = function () {
        $('.updateInpts').slideToggle(300);
    };
    MyApp.prototype.openPage = function (page) {
        this.nav.push(page.component, { acc: this.accountInfo, doc: page.docs });
    };
    MyApp.prototype.signedOut = function () {
        this.nav.setRoot(HomePage);
        this.events.publish('indexResponse', { submodule: 'logOut' });
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [ProviderPage, Storage, Platform,
            StatusBar, Events, SplashScreen])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map