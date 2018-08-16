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
import { DocsPage } from '../docs/docs';
var OfferPage = /** @class */ (function () {
    function OfferPage(provider, navCtrl, navParams) {
        var _this = this;
        this.provider = provider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.selections = [];
        this.sentQuotation = false;
        var data = this.navParams.get('data');
        this.req = data[0];
        this.acc = data[1];
        this.provider.events.subscribe('indexResponse', function (data) {
            _this.req.props = parseInt($('#proposals').text()) + 1;
            _this.navCtrl.pop();
        });
        this.provider.events.subscribe('userProposed', function (data) {
            switch (data.submodule) {
                case 'proposalsFound':
                    _this.req.proposals = data.proposal;
                    break;
                case "requestExists":
                    _this.sentRequest = true;
                    _this.req.proposal = data.proposal;
                    break;
                case "offerRemoved":
                    _this.sentRequest = undefined;
                    _this.req.proposal = [];
                    _this.req.props = parseInt($('#proposals').text()) - 1;
                    break;
                case "quotationSent":
                    _this.sentQuotation = true;
                    break;
            }
        });
        this.provider.events.subscribe('quotation', function (data) {
            switch (data.submodule) {
                case 'newsaved':
                    if (data.id == _this.req.dateCreated) {
                        _this.req.quotationId = data.info.id;
                    }
                    break;
            }
        });
        var owner;
        if (this.acc.email == this.req.Id) {
            owner = true;
        }
        else {
            owner = false;
        }
        this.provider.socketRequest({
            module: 'checkProposal',
            email: this.acc.email,
            id: this.req.dateCreated,
            owner: owner,
            quotation: this.req.quotationId
        });
    }
    OfferPage.prototype.createDoc = function () {
        if (this.selections.length > 3) {
            alert("Only up to 3 selections needed");
        }
        else {
            this.navCtrl.push(DocsPage, { data: ['quotation', this.selections, this.acc, this.req.dateCreated] });
        }
    };
    OfferPage.prototype.gotoQuotation = function () {
        this.navCtrl.push(DocsPage, { data: ['quotation', 'checkInDb', this.acc, this.req.quotationId, this.req.Id] });
    };
    OfferPage.prototype.count = function (value) {
        if (value && value.trim() !== '') {
            var initial = $('.max').attr('value');
            var rem = initial - value.length;
            $('.max').text('Remaining: ' + rem);
        }
    };
    OfferPage.prototype.actionOffer = function (id, index, action) {
        switch (action) {
            case "add":
                this.selections.push(id);
                this.req.proposals[index].accepted = true;
                break;
            case "remove":
                var ind = this.selections.findIndex(function (g) { return g == 'id'; });
                this.selections.splice(ind, 1);
                this.req.proposals[index].accepted = false;
                break;
        }
    };
    OfferPage.prototype.removeRequest = function (id) {
        this.provider.socketRequest({
            module: 'removeOffer',
            email: this.acc.email,
            id: this.req.dateCreated,
        });
    };
    OfferPage.prototype.ionViewDidLeave = function () {
        if (this.navCtrl.getActive().name == 'OfferPage') {
            this.provider.events.unsubscribe('indexResponse');
        }
    };
    OfferPage.prototype.changeDate = function (date) {
        var dateString = new Date(date);
        dateString = dateString.toString();
        date = dateString.substr(0, 15);
        var time = dateString.substr(16, 5);
        dateString = date + ' at ' + time;
        return dateString;
    };
    OfferPage.prototype.sendOffer = function (detail) {
        this.provider.Load('show', 'Sending offer...');
        this.provider.socketRequest({
            module: 'saveOffer',
            id: this.req.dateCreated,
            info: {
                name: this.acc.businessName,
                image: this.acc.image,
                request: detail,
                id: this.acc.email,
                date: Date.now()
            }
        });
    };
    OfferPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-offer',
            templateUrl: 'offer.html',
        }),
        __metadata("design:paramtypes", [ProviderPage, NavController, NavParams])
    ], OfferPage);
    return OfferPage;
}());
export { OfferPage };
//# sourceMappingURL=offer.js.map