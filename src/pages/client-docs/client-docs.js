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
import { ProviderPage } from '../provider/provider';
var ClientDocsPage = /** @class */ (function () {
    function ClientDocsPage(provider, navCtrl, navParams) {
        var _this = this;
        this.provider = provider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.items = [];
        this.data = this.navParams.get('data');
        this.doc = this.data[0];
        if (this.data[1] == 'fetchInvoice') {
            this.acc = this.data[2];
            this.serial = this.data[3].serial;
            this.provider.Load('show', 'Getting invoice information...');
            this.provider.socketRequest({
                module: 'fetchInvoice',
                user: this.data[2].email,
                invoiceInfo: this.data[3]
            });
        }
        else {
            this.serial = this.data[3];
            this.acc = this.data[1];
            this.to = this.acc;
            this.items = this.data[2][0].items;
            this.bider = this.data[2][0];
            this.provider.socketRequest({
                module: 'getInvoDetails',
                user: this.data[4]
            });
        }
        this.titles = ['Item No.', 'Specification', 'Unit', 'Quantity', 'Unit price', 'Total Value'];
        this.titles0 = ['Description', 'Ordered', 'Delivered', 'Outstanding'];
        this.titles1 = ['Description', 'Remarks'];
        this.titles2 = ['Description', 'Amount'];
        this.provider.events.subscribe('invoice', function (data) {
            switch (data.submodule) {
                case "checkSender":
                    _this.from = data.res;
                    break;
                case 'invoiceSent':
                    _this.provider.toast('Invoice has been sent', 'middle');
                    _this.bider.invoiced = true;
                    break;
                case 'invoiceFound':
                    console.log(_this.acc.email + ' ' + _this.data[3].creator + ' ' + data.person.email);
                    if (_this.acc.email == _this.data[3].creator) {
                        _this.to = _this.acc;
                        _this.from = data.person;
                    }
                    else {
                        _this.to = data.person;
                        _this.from = _this.acc;
                    }
                    _this.bider = data.invoice;
                    _this.bider.amount = _this.bider.TotalValue;
                    _this.items = _this.bider.items;
                    var days;
                    var hours;
                    switch (_this.bider.top) {
                        case 'Pay within 2 months':
                            hours = 168 * 8;
                            break;
                        case 'Pay within 1 week':
                            hours = 168;
                            break;
                        default:
                            _this.dueDate = 'Payment on delivery.';
                            break;
                    }
                    break;
            }
        });
    }
    ClientDocsPage.prototype.sendInvoice = function () {
        this.provider.Load('show', 'Sending invoice...');
        this.provider.socketRequest({
            module: 'updateInvoice',
            user: this.acc.email,
            lpoId: this.data[3]
        });
    };
    ClientDocsPage.prototype.calculateDate = function (hours) {
        if (hours) {
            var secs = this.bider.dateInvoiced + hours * 3600 * 1000;
            var date = this.provider.changeDate(secs);
            this.dueDate = 'Payment due ' + date.substr(0, 15);
        }
    };
    ClientDocsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-client-docs',
            templateUrl: 'client-docs.html',
        }),
        __metadata("design:paramtypes", [ProviderPage, NavController, NavParams])
    ], ClientDocsPage);
    return ClientDocsPage;
}());
export { ClientDocsPage };
//# sourceMappingURL=client-docs.js.map