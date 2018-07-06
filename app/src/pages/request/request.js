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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from "jquery";
import { ProviderPage } from '../provider/provider';
var RequestPage = /** @class */ (function () {
    function RequestPage(provider, navCtrl, navParams) {
        this.provider = provider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.acc = this.navParams.get('acc');
    }
    RequestPage.prototype.count = function (index, value) {
        if (value && value.trim() !== '') {
            var initial = $('.max').eq(index).attr('value');
            var rem = initial - value.length;
            $('.max').eq(index).text('Remaining: ' + rem);
        }
    };
    RequestPage.prototype.ionViewDidLeave = function () {
        if (this.navCtrl.getActive().name == 'ListPage') {
            this.provider.events.unsubscribe('request');
        }
    };
    RequestPage.prototype.goToQuot = function (data) {
        var serch = data.searchTags.trim().split(",");
        if (serch.length > 5) {
            alert('Only up o 5 tags required.');
        }
        else {
            var tags = [];
            serch.map(function (tag) {
                if (tag) {
                    tags.push(tag);
                }
            });
            data.searchTags = tags;
            this.provider.Load('show', 'Creating request');
            this.provider.socketRequest({
                module: 'storeRequest',
                data: data,
                acc: this.acc.email,
                businessName: this.acc.businessName
            });
            this.navCtrl.pop();
        }
    };
    RequestPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-request',
            templateUrl: 'request.html',
        }),
        __metadata("design:paramtypes", [ProviderPage, NavController, NavParams])
    ], RequestPage);
    return RequestPage;
}());
export { RequestPage };
//# sourceMappingURL=request.js.map