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
import { RequestPage } from '../request/request';
import { ProviderPage } from '../provider/provider';
import { OfferPage } from '../offer/offer';
import { DocsPage } from '../docs/docs';
import { ClientDocsPage } from '../client-docs/client-docs';
var ListPage = /** @class */ (function () {
    function ListPage(provider, navCtrl, navParams) {
        var _this = this;
        this.provider = provider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.docs = [];
        this.acc = this.navParams.get('acc');
        this.doc = this.navParams.get('doc');
        $(document).ready(function () {
            var height = $('.colHeight').css('height');
            $('.colHeight').css('lineHeight', height);
        });
        this.provider.events.subscribe('request', function (data) {
            _this.type = data.type;
            switch (data.submodule) {
                case 'addRequest':
                    data.request.date = _this.provider.changeDate(data.request.dateCreated);
                    _this.docs.unshift(data.request);
                    break;
                case 'showDocs':
                    _this.docs = data.docs;
                    for (var r = 0; r < _this.docs.length; r++) {
                        _this.docs[r].date = _this.provider.changeDate(_this.docs[r].dateCreated);
                    }
            }
        });
    }
    ListPage.prototype.goToInvoice = function (doc) {
        this.navCtrl.push(ClientDocsPage, { data: ['invoice', 'fetchInvoice', this.acc, doc] });
    };
    ListPage.prototype.goToRequest = function (req) {
        this.navCtrl.push(OfferPage, { data: [req, this.acc] });
    };
    ListPage.prototype.goToLPO = function (doc) {
        this.navCtrl.push(DocsPage, { data: ['lpo', 'checkInfo', this.acc, doc] });
    };
    ListPage.prototype.ionViewDidLeave = function () {
        if (this.navCtrl.getActive().name == 'ListPage') {
            this.provider.events.unsubscribe('request');
        }
    };
    ListPage.prototype.ionViewDidLoad = function () {
        this.provider.socketRequest({
            module: 'fetchDocs',
            type: this.doc,
            email: this.acc.email
        });
    };
    ListPage.prototype.createDoc = function () {
        if (this.doc == 'Quotations') {
            this.navCtrl.push(RequestPage, { acc: this.acc });
        }
    };
    ListPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-list',
            templateUrl: 'list.html',
        }),
        __metadata("design:paramtypes", [ProviderPage, NavController, NavParams])
    ], ListPage);
    return ListPage;
}());
export { ListPage };
//# sourceMappingURL=list.js.map