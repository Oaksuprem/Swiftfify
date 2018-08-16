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
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import * as $ from 'jquery';
import { TermsPage } from '../terms/terms';
import { ProviderPage } from '../provider/provider';
import { ClientDocsPage } from '../client-docs/client-docs';
var DocsPage = /** @class */ (function () {
    function DocsPage(provider, events, navCtrl, navParams) {
        var _this = this;
        this.provider = provider;
        this.events = events;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.titles = ['Code No.', 'Item descritpion', 'Unit', 'Qty', 'Unit Price', 'Brand', 'Country of origin'];
        this.items = [];
        this.items1 = [];
        this.biderSelections = [];
        this.approvers = [
            { name: '', designation: '' },
            { name: '', designation: '' },
            { name: '', designation: '' },
        ];
        this.evaLTitles = ['Item', 'Supplier A', 'Award to'];
        this.tos = [];
        this.quotationComplete = false;
        this.LpO = ['Item No.', 'Specification', 'Unit', 'Quantity', 'Unit price', 'Total Value'];
        this.suppliers = ["Supplier A"];
        this.moreLPOs = [
            { title: 'Name', bind: '' },
            { title: 'Name', bind: '' },
            { title: 'Date', bind: '' }
        ];
        this.data = this.navParams.get('data');
        this.acc = this.data[2];
        this.doc = this.data[0];
        if (this.data[1] == 'checkInDb') {
            this.provider.socketRequest({
                module: 'checkQuotation',
                id: this.data[3]
            });
            this.from = { email: this.data[4] };
        }
        else if (this.data[1] == 'checkInfo') {
            var datam = this.data[3];
            this.from = { email: datam.Id };
            this.lpoMade = true;
            if (this.acc.email == datam.Id) {
                this.biderSelections = datam.info;
            }
            else {
                this.biderSelections = [datam.info[datam.info.findIndex(function (x) { return x.email == _this.acc.email; })]];
            }
            var thisx_1 = this;
            this.biderSelections.forEach(function (bider, index) {
                var bidder = thisx_1.biderSelections[index];
                bider.inputs = [
                    { title: 'Vendors Name', ngBind: bider.vendorName },
                    { title: 'Email', ngBind: bider.email },
                    { title: 'Terms of Payment', ngBind: bider.top },
                    { title: 'Delivery Point', ngBind: bider.pod },
                    { title: 'Order Date', ngBind: bider.dor }
                ];
                bidder.amount = bider.TotalValue;
                bidder.amntWords = bider.AmountInWords;
            });
            this.moreLPOs = [
                { title: 'Name', bind: datam.approvals[0].name },
                { title: 'Name', bind: datam.approvals[0].name },
                { title: 'Date', bind: datam.approvedDate },
            ];
            this.data[3] = datam.serial;
        }
        else {
            this.tos = this.data[1];
            this.from = { email: this.acc.email };
            this.action = this.data.action;
            this.items = [
                { desc: '', unit: '', qty: '', price: '', brand: '', origin: '', selection: '' },
                { desc: '', unit: '', qty: '', price: '', brand: '', origin: '', selection: '' },
                { desc: '', unit: '', qty: '', price: '', brand: '', origin: '', selection: '' },
                { desc: '', unit: '', qty: '', price: '', brand: '', origin: '', selection: '' },
                { desc: '', unit: '', qty: '', price: '', brand: '', origin: '', selection: '' }
            ];
        }
        this.events.subscribe('quotation', function (data) {
            switch (data.submodule) {
                case 'newsaved':
                    if (_this.acc.email == data.from.email) {
                        _this.provider.toast("Your quotation has been sent", 'midlle');
                        _this.quotationComplete = false;
                        _this.quotationInfo = data.info;
                    }
                    break;
                case 'quotationFound':
                    _this.from = data.info.from;
                    _this.items = data.info.items;
                    _this.items1 = data.info.items;
                    _this.biders = data.info.biders;
                    if (_this.biders && _this.biders.length > 0) {
                        var index = _this.biders.findIndex(function (q) { return q.id == _this.acc.email; });
                        if (index > -1) {
                            _this.quoted = true;
                            _this.items = _this.biders[index].items;
                        }
                        else if (_this.from.email == _this.acc.email) {
                            _this.items = _this.biders[0].items;
                        }
                    }
                    _this.quotationInfo = {
                        processDate: data.info.processDate,
                        id: data.info.id
                    };
                    _this.approvers = data.info.witness;
                    _this.doc = _this.data[0];
                    _this.tos = data.info.to;
                    break;
                case 'quoted':
                    _this.quoted = true;
                    break;
                case 'sentLPO':
                    _this.provider.toast(data.res, 'middle');
                    break;
            }
        });
    }
    DocsPage.prototype.toggleIntr = function () {
        $('#instr').slideToggle(600);
    };
    DocsPage.prototype.makeInvoice = function () {
        this.navCtrl.push(ClientDocsPage, { data: ['invoice', this.acc, this.biderSelections, this.data[3], this.from.email] });
    };
    DocsPage.prototype.CreateLPO = function () {
        this.doc = 'lpo';
        for (var xz = 0; xz < this.items.length; xz++) {
            var selection = this.items[xz].selection;
            var item = this.items[xz];
            item = this.biders[selection].items[xz];
            item.total_value = item.qty * item.price;
            if (selection == 0 || selection == 1 || selection == 2) {
                this.biderSelections[selection].items.push(item);
                this.biderSelections[selection].amount += item.total_value;
            }
        }
    };
    DocsPage.prototype.createLPo = function () {
        this.provider.Load('show', 'Creating LPO');
        this.provider.socketRequest({
            module: 'createLPO',
            biders: this.biderSelections,
            id: this.data[3],
            approvement: this.moreLPOs,
            owner: this.acc.email
        });
    };
    DocsPage.prototype.makeEvaluation = function () {
        this.doc = 'evaluation';
        this.items = this.items1;
        switch (this.biders.length) {
            case 3:
                this.evaLTitles = ['Item', 'Supplier A', 'Supplier B', 'Supplier C', 'Award to'];
                this.suppliers = ["Supplier A", "Supplier B", "Supplier C"];
                break;
            case 2:
                this.suppliers = ["Supplier A", "Supplier B"];
                this.evaLTitles = ['Item', 'Supplier A', 'Supplier B', 'Award to'];
        }
        console.log(dateFunction()[0]);
        for (var xy = 0; xy < this.biders.length; xy++) {
            this.biderSelections.push({
                inputs: [{ title: 'Vendors Name', ngBind: this.tos[xy].name },
                    { title: 'Email', ngBind: this.biders[xy].id },
                    { title: 'Terms of Payment', ngBind: '' },
                    { title: 'Delivery Point', ngBind: '' },
                    { title: 'Order Date', ngBind: dateFunction()[0] }
                ],
                items: [],
                amount: 0,
                amntWords: ''
            });
        }
    };
    DocsPage.prototype.saveQuotation = function () {
        var items = [];
        this.items.map(function (item) {
            if (item.desc && item.desc.trim() !== '' && item.qty && item.desc.trim() !== '') {
                items.push(item);
            }
        });
        if (items.length == 0) {
            alert('You need to add at least 1 item');
        }
        else {
            this.provider.Load('show', 'Sending quotation...');
            this.provider.socketRequest({
                module: 'saveQuotation',
                tos: this.tos,
                items: items,
                approvers: this.approvers,
                businessName: this.acc.businessName,
                myId: this.acc.email,
                quotationId: this.data[3]
            });
        }
    };
    DocsPage.prototype.addItem = function () {
        this.items.push({ desc: '', unit: '', qty: '', price: '', brand: '', origin: '', selection: '' });
    };
    DocsPage.prototype.remove = function (index) {
        this.items.splice(index, 1);
    };
    DocsPage.prototype.toggleIntr0 = function () {
        this.navCtrl.push(TermsPage);
    };
    DocsPage.prototype.makeQuotation = function () {
        this.provider.Load('show', 'Sending your quotation...');
        this.provider.socketRequest({
            module: 'updateQuotation',
            items: this.items,
            myId: this.acc.email,
            quotation: this.data[3]
        });
    };
    DocsPage.prototype.continue = function (decision) {
        switch (decision) {
            case "Yes":
                $('#notQuoting, .notQuoting').hide(400);
                $('#quoting, .quoting').show(400);
                break;
            case 'No':
                $('#notQuoting, .notQuoting').show(400);
                $('#quoting, .quoting').hide(400);
                break;
        }
    };
    DocsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-docs',
            templateUrl: 'docs.html',
        }),
        __metadata("design:paramtypes", [ProviderPage, Events, NavController, NavParams])
    ], DocsPage);
    return DocsPage;
}());
export { DocsPage };
function dateFunction() {
    var date = new Date(Date.now());
    var date1 = date.toString();
    return [date1.substr(0, 15) + ' at ' + date1.substr(16, 5)];
}
//# sourceMappingURL=docs.js.map