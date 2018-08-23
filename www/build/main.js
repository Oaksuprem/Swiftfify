webpackJsonp([0],{

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OfferPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__provider_provider__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__docs_docs__ = __webpack_require__(140);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





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
            _this.req.props = parseInt(__WEBPACK_IMPORTED_MODULE_2_jquery__('#proposals').text()) + 1;
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
                    _this.req.props = parseInt(__WEBPACK_IMPORTED_MODULE_2_jquery__('#proposals').text()) - 1;
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
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__docs_docs__["a" /* DocsPage */], { data: ['quotation', this.selections, this.acc, this.req.dateCreated] });
        }
    };
    OfferPage.prototype.gotoQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__docs_docs__["a" /* DocsPage */], { data: ['quotation', 'checkInDb', this.acc, this.req.quotationId, this.req.Id] });
    };
    OfferPage.prototype.count = function (value) {
        if (value && value.trim() !== '') {
            var initial = __WEBPACK_IMPORTED_MODULE_2_jquery__('.max').attr('value');
            var rem = initial - value.length;
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.max').text('Remaining: ' + rem);
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
            this.provider.events.unsubscribe('userProposed');
            this.provider.events.unsubscribe('quotation');
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
        if (this.provider.supplier.status == 'pending') {
            alert('You are not yet approved as a supplier');
        }
        else if (this.provider.supplier.status == 'approved' && this.provider.acc.address) {
            this.provider.Load('show', 'Sending offer...');
            this.provider.socketRequest({
                module: 'saveOffer',
                id: this.req.dateCreated,
                toId: this.req.businessName,
                info: {
                    name: this.acc.businessName,
                    pic: this.acc.pic,
                    request: detail,
                    id: this.provider.acc.email,
                    image: this.provider.acc.pic,
                    date: Date.now()
                }
            });
        }
        else if (!this.provider.acc.address) {
            alert('You must add your address before you continue.');
        }
        else {
            alert('You must be registered as a supplier.');
        }
    };
    OfferPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-offer',template:/*ion-inline-start:"/Users/brianhenry/Desktop/siwfity/src/pages/offer/offer.html"*/'\n<ion-header>\n\n  <ion-navbar color="headerColor">\n    <div class="header">Creating an offer\n     	<button (click)="createDoc()" class="button" *ngIf="(!req.quotationId && req.Id == acc.email)" [disabled]="selections.length < 3">Create quotation</button>\n    </div>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content style="background-color:white">\n	<ion-grid>\n		<ion-row>\n			<ion-col offset-xl-2 col-xl-8 offset-lg-2 col-lg-8 >\n				<div *ngIf="req.quotationId && (req.Id == acc.email || sentQuotation)">\n					<button (click)="gotoQuotation()" class="viewQuot">View Quotation</button>\n				</div>\n				<div class="ContentDiv">\n	    	      <div class="title0">\n	    	      	<img src="{{provider.url+\'/\'+req.pic}}" class="profileImg" imageViewer/>\n	    	        <div> {{req.businessName}}</div></div>\n			    	<div class="title"><a href="#">{{req.title}}</a></div>\n			    	<div class="posted">Posted on {{req.postedAt}}</div><br/>\n			    	<div class="title1">{{req.details}}</div>\n			    	<div class=" title2">\n			    		<span>Search tags</span><br/><br/>\n			    		<button  *ngFor="let tag of req.searchTags" >{{tag}}</button>\n			    	</div>\n			    	<div class="title3">\n			    		<span >Proposals submitted: <span id="proposals">{{req.props}}</span></span>\n			    		<button>\n			    			<ion-icon name="pin"></ion-icon>\n			    			{{req.location}}\n			    		</button>\n			    	</div>\n			    </div>\n			    <ion-list class="ionlist" *ngIf="acc.email !== req.Id && !sentRequest">\n					<ion-item no-lines>\n						<ion-label stacked>Type your offer response here</ion-label>\n						<ion-textarea [(ngModel)]="details" maxlength="600" rows="15" (keyup)="count(details)"  class="ionitem1">\n							\n						</ion-textarea>\n					</ion-item>\n					<div class="max" value="600">Remaining: 600</div>\n					<div style="text-align: center; margin-top: 20px; width:100%;">\n		          		<button *ngIf="!sentRequest" (click)="sendOffer(details)" [disabled]="!details || details.trim() == \'\' " class="sbmtReason">Submit</button> \n		          	</div>\n				</ion-list>\n				\n		        <div *ngIf="sentRequest" >\n					<div col-12 class="ContentDiv">\n						 <div class="title0">\n			    	      	<img src="{{provider.url+\'/\'+req.proposal.image}}" style="float: left;" class="profileImg" imageViewer/>\n			    	        <div offset-1 style="float: left;width: 70%"> {{req.proposal.name}}  <span class="posted" style="float: left;">{{changeDate(req.proposal.date)}}</span></div>\n			    	     </div>\n				    	<div class="title1">{{req.proposal.request}}</div>\n				    	<div *ngIf="!req.quotationId" style="text-align: center; margin-top: 20px; width:100%;">\n			            	<button (click)="removeRequest(acc.email)" *ngIf="req.proposal.accepted !== true" class="sbmtReason"   style="width: auto;">Remove offer</button> \n		                </div>\n			    	</div>\n			    </div>\n				<div *ngIf="acc.email == req.Id">\n					<div col-12 class="ContentDiv" *ngFor="let proposal of req.proposals let Q = index">\n						 <div class="title0">\n			    	      	<img src="{{provider.url+\'/\'+proposal.image}}" style="float: left;" class="profileImg" imageViewer/>\n			    	        <div offset-1 style="float: left;width: 70%"> {{proposal.name}}  <span class="posted" style="float: left;">{{changeDate(proposal.date)}}</span></div>\n			    	     </div>\n				    	<div class="title1">{{proposal.request}}</div>\n				    	<div *ngIf="!req.quotationId" style="text-align: right; margin-bottom: 10px; width:100%;">\n			          		<button class="sbmtReason" (click)="actionOffer(proposal, Q, \'add\')"  *ngIf="!proposal.accepted" style="width: 100px;">Accept</button> \n			          		<button class="sbmtReason" (click)="actionOffer(proposal, Q, \'remove\')" *ngIf="proposal.accepted"style="width: 100px;background-color: grey">Decline</button> \n			          	</div>\n			    	</div>\n	              </div>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n\n</ion-content>\n'/*ion-inline-end:"/Users/brianhenry/Desktop/siwfity/src/pages/offer/offer.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__provider_provider__["a" /* ProviderPage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */]])
    ], OfferPage);
    return OfferPage;
}());

//# sourceMappingURL=offer.js.map

/***/ }),

/***/ 140:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DocsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__terms_terms__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__provider_provider__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__client_docs_client_docs__ = __webpack_require__(141);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






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
                { title: 'Name', bind: datam.approvals[1].name },
                { title: 'Date', bind: datam.approvedDate },
            ];
            this.data[3] = datam.serial;
        }
        else {
            this.tos = this.data[1];
            this.from = {
                email: this.acc.email,
                businessName: this.acc.businessName
            };
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
                    if (data.info.notQuoting && data.info.notQuoting.findIndex(function (q) { return q == _this.provider.acc.businessName; }) > -1) {
                        __WEBPACK_IMPORTED_MODULE_2_jquery__('.reason').hide();
                    }
                    _this.from = {
                        email: data.info.from.email,
                        businessName: data.info.from.buyerName
                    };
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
                    if (_this.from && _this.from.email !== _this.acc.email) {
                        __WEBPACK_IMPORTED_MODULE_2_jquery__(document).ready(function () {
                            __WEBPACK_IMPORTED_MODULE_2_jquery__('.designations').attr('disabled', true);
                        });
                    }
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
        __WEBPACK_IMPORTED_MODULE_2_jquery__('#instr').slideToggle(600);
    };
    DocsPage.prototype.makeInvoice = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__client_docs_client_docs__["a" /* ClientDocsPage */], { data: ['invoice', this.acc, this.biderSelections, this.data[3], this.from.email] });
    };
    DocsPage.prototype.ionViewDidLeave = function () {
        if (this.navCtrl.getActive().name == 'DocsPage') {
            this.events.unsubscribe('quotation');
        }
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
        var thisx = this;
        thisx.biderSelections.forEach(function (bider, index) {
            if (bider.amount == 0) {
                thisx.biderSelections.splice(index, 1);
            }
        });
    };
    DocsPage.prototype.createLPo = function () {
        this.provider.Load('show', 'Creating LPO');
        this.provider.socketRequest({
            module: 'createLPO',
            biders: this.biderSelections,
            id: this.data[3],
            approvement: this.moreLPOs,
            owner: {
                email: this.provider.acc.email,
                name: this.provider.acc.businessName,
                pic: this.provider.acc.pic
            }
        });
    };
    DocsPage.prototype.notQuot = function (reason) {
        __WEBPACK_IMPORTED_MODULE_2_jquery__('.reason').hide();
        this.provider.socketRequest({
            module: 'notQuoting',
            from: {
                name: this.provider.acc.businessName,
                pic: this.provider.acc.pic,
                email: this.provider.acc.email
            },
            toId: this.from.businessName,
            reason: reason,
            serial: this.quotationInfo.id
        });
    };
    DocsPage.prototype.makeEvaluation = function () {
        var _this = this;
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
        var _loop_1 = function (xy) {
            this_1.biderSelections.push({
                inputs: [{ title: 'Vendors Name', ngBind: this_1.tos[xy].name },
                    { title: 'Email', ngBind: this_1.tos[xy].id },
                    { title: 'Terms of Payment', ngBind: '' },
                    { title: 'Delivery Point', ngBind: '' },
                    { title: 'Order Date', ngBind: dateFunction()[0] }
                ],
                pic: this_1.biders[this_1.biders.findIndex(function (q) { return q.name == _this.tos[xy].name; })].pic,
                items: [],
                amount: 0,
                amntWords: ''
            });
        };
        var this_1 = this;
        for (var xy = 0; xy < this.biders.length; xy++) {
            _loop_1(xy);
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
                myPic: this.provider.acc.pic,
                myName: this.acc.businessName,
                quotationId: this.data[3]
            });
        }
    };
    DocsPage.prototype.addItem = function () {
        this.items.push({ desc: '', unit: '', qty: '', price: '', brand: '', origin: '', selection: '' });
    };
    DocsPage.prototype.showDets = function (id) {
        if (this.biders && this.biders.length > 0) {
            this.items = this.biders[this.biders.findIndex(function (q) { return q.id == id; })].items;
        }
    };
    DocsPage.prototype.remove = function (index) {
        this.items.splice(index, 1);
    };
    DocsPage.prototype.toggleIntr0 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__terms_terms__["a" /* TermsPage */]);
    };
    DocsPage.prototype.makeQuotation = function (id) {
        this.provider.Load('show', 'Sending your quotation...');
        this.provider.socketRequest({
            module: 'updateQuotation',
            items: this.items,
            fromId: id,
            myData: {
                id: this.acc.email,
                pic: this.provider.acc.pic,
                name: this.acc.businessName
            },
            quotation: this.data[3]
        });
    };
    DocsPage.prototype.continue = function (decision) {
        switch (decision) {
            case "Yes":
                __WEBPACK_IMPORTED_MODULE_2_jquery__('#notQuoting, .notQuoting').hide(400);
                __WEBPACK_IMPORTED_MODULE_2_jquery__('#quoting, .quoting').show(400);
                break;
            case 'No':
                __WEBPACK_IMPORTED_MODULE_2_jquery__('#notQuoting, .notQuoting').show(400);
                __WEBPACK_IMPORTED_MODULE_2_jquery__('#quoting, .quoting').hide(400);
                break;
        }
    };
    DocsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-docs',template:/*ion-inline-start:"/Users/brianhenry/Desktop/siwfity/src/pages/docs/docs.html"*/'\n<ion-header>\n\n  <ion-navbar color="headerColor">\n    <div *ngIf="doc == \'quotation\' " class="reQuest"><span>Request for quotation </span>\n     <button (click)="makeEvaluation()" style="float: right" ion-button *ngIf="biders && biders.length > 0 && from.email == acc.email">Evaluate</button></div>\n   \n    <ion-title *ngIf="doc == \'evaluation\' " style="text-align: center;">Evaluation Schedule</ion-title>\n    <div *ngIf="doc == \'lpo\' " class="reQuest">Local Purchase Order\n    	<button (click)="makeInvoice()" style="float: right" ion-button *ngIf="from.email !== acc.email">Invoice</button></div>\n  </ion-navbar>\n</ion-header>\n<ion-content style="margin:0px;padding:0px;background-color: white" >\n	<ion-grid style="margin:0px;padding:0px" >\n		<div *ngIf="doc == \'quotation\'">\n			<ion-row style="margin:0px;padding:0px" >\n						<ion-col style="display: inline-block;margin:0px;padding:0px">\n							<ul *ngIf="quotationInfo" col-12 col-lg-3 offset-lg-2 class="list1" style="margin:0px;padding:10px;">\n								<li style="font-weight:bold">Date </li>\n								<div col-12  style="padding-left: 10px;font-size:14px;">\n									<li>Quotation number <span class="info">{{quotationInfo.id}}</span></li>\n									<li>Date <span class="info">{{quotationInfo.processDate}}</span></li>\n							    </div>\n							</ul>\n							<ul col-12 col-lg-3 offset-lg-1 class="list1" style="margin-top:0px;padding-left:20px;padding-right:20px;">\n								<li style="font-weight:bold">To </li>\n								<div *ngIf="!from || from.email == acc.email">\n									<div style="padding-left: 10px;font-size:14px" *ngFor="let to of tos">\n										<li (click)="showDets(to.id)">Supplier\'s name <span class="info">{{to.name}}</span></li>\n										<li>Email <span class="info">{{to.id}}</span></li>\n								    </div>\n								</div>\n								<div *ngIf="from && from.email !== acc.email">\n									<div style="padding-left: 10px;font-size:14px" *ngFor="let to of tos">\n										<div *ngIf="to.id == acc.email">\n											<li >Supplier\'s name <span class="info">{{to.name}}</span></li>\n											<li>Email <span class="info">{{to.id}}</span></li>\n										</div>\n								    </div>\n								</div>\n							</ul>\n							<ul  col-12 col-lg-3 offset-lg-1 class="list1" style="margin-top:0px;padding-right:20px;padding-left:20px">\n								<li style="font-weight:bold">From </li>\n								<div style="padding-left: 10px;font-size:14px">\n									<li *ngIf="!from" >Buyer\'s name <span class="info">{{acc.businessName}}</span></li>\n									<li *ngIf="from && from.businessName">Buyer\'s name <span class="info">{{from.businessName}}</span></li>\n									<li *ngIf="!from">Email <span class="info">{{acc.email}}</span></li>\n									<li *ngIf="from && from.email">Email <span class="info">{{from.email}}</span></li>\n							    </div>\n							</ul>\n							<div col-11 offset-1 *ngIf="from && from.email !== acc.email">\n								<span style="font-weight:bold">Note: </span><br/>\n								<ol style="list-style-type: lower-alpha;">\n									<li>THIS IS AN ORDER. Read the conditions and instructions before quoting.</li>\n									<li>Your quotation should indicate final unit price which includes all costs for delivery, discount, duty and sales tax.</li>\n								</ol>\n								<button (click)="toggleIntr()" class="readInstr">Read conditions and instructions here</button>\n									<ol id="instr" style="list-style-type: lower-alpha;display:none;">\n										<span style="font-weight:bold;">Conditions</span>\n										<li>The General condition of Contract with our company applies to this transaction. This form properly submitted constitutes the entire agreement.</li>\n										<li>The offer shall remain firm for 30 days from the closing date unless otherwise stipulted by the seller.</li>\n										<li>The buyer shal;l not be bound to accept the lowest or any other offer, and reserves the right to accept any offer in part unless the contrary is stipulated by the seller.</li>\n										<li>Samples of the offer when required will be provided free, and if not destroyed during tests will, upon request, be returned at the seller\'s expenses.</li><br/>\n										<span style="font-weight:bold;">Instructions</span>\n										<li>Quote on each item separately, and in units as specified.</li>\n										<li>The form must be filled by a competent person.</li>\n										<li>If you do not wish to quote, please check the last part of this document and endorse the reason, otherwise you name may be deleted from the buyer\'s maling listfor the items listed hereon.</li>\n									</ol>\n							</div>\n						</ion-col>\n					</ion-row>\n					 <ion-row id="quoting"  style="margin-top:2%;width:100%; overflow: hidden; overflow-x: auto;">\n			            <div class="scrollmenu" offset-lg-2 offset-md-1  >\n			            	  <span *ngFor=" let title of titles let j =  index">\n								  <button *ngIf="(j == 0 || j == 2 || j==5 || j==3)" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:75px;"  >\n								  	{{title}}\n								   </button>\n								    <button *ngIf="(j == 1 || j == 4 || j==6 || j==7)"  style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:150px;"  >\n								    	{{title}}\n								   </button>\n							 </span>\n							 <div *ngFor=" let item of items let x = index" >\n							 <span  *ngFor=" let title of titles let f = index " >\n							  	<button  *ngIf="f == 0 "  class="input1 over0" ><ion-icon *ngIf="x > 0 && !quotationInfo"  (click)="remove(x)" name="close" style="color:red; float: left;"></ion-icon>{{x+1}}</button>\n								  	<input *ngIf=" f==1 && (!from || from.email == acc.email)" [(ngModel)]=item.desc class="input"  type="text">\n								  	<input *ngIf=" f==2 && (!from || from.email == acc.email)" [(ngModel)]=item.unit class="input1"  type="text">\n								  	<input *ngIf=" f==3 && (!from || from.email == acc.email)" [(ngModel)]=item.qty class="input1"  type="number">\n               					<div *ngIf=" f==1 && (from && from.email !== acc.email)"  class="input over"  >{{item.desc}}</div>\n							  	<div *ngIf=" f==2 && (from && from.email !== acc.email)"  class="input1 over" >{{item.unit}}</div>\n							  	<div *ngIf=" f==3 && (from && from.email !== acc.email)" class="input1 over"  >{{item.qty}}</div>\n							  	\n							  	<input *ngIf=" f==5 && (from && from.email !== acc.email)" [(ngModel)]=item.brand class="input1"   type="text">\n							  	<input *ngIf=" f==4 && (from && from.email !== acc.email)" [(ngModel)]=item.price class="input"  type="number">\n							  	<input *ngIf=" f==6 && (from && from.email !== acc.email)" [(ngModel)]=item.origin class="input"  type="text">\n\n							  	<div *ngIf=" f==5 && (!from || from.email == acc.email)"  class="input1 over"  >{{item.brand}}</div>\n							  	<div *ngIf=" f==4 && (!from || from.email == acc.email)"  class="input over" >{{item.price}}</div>\n							  	<div *ngIf=" f==6 && (!from || from.email == acc.email)" class="input over"  >{{item.origin}}</div>\n							  </span>\n							</div>\n						 </div>\n						 <div *ngIf="!quotationInfo" style="width:100%; text-align: center;">\n							 <button (click)="addItem()" class="addItem">Add item</button>\n						</div>\n						<div  *ngIf="from && from.email !== acc.email && !quoted" style="text-align: center; margin-top: 10px; width:100%;">\n			          		<button  (click)="makeQuotation(from.businessName)" class="sbmtReason reason">Submit</button> \n			          	</div>\n			          </ion-row>\n			           <div *ngIf="from && from.email !== acc.email && !quoted" style="text-align: center;width: 100%; margin-bottom: 10px; margin-top: 5px">\n				            <span class="quoting reason" style="color: #750481">If you do not want to quote, click  <button class="No" (click)="continue(\'No\')" >Here</button></span>\n				             <span class="notQuoting reason" style="display:none;color: #750481">If you would like to quote, click  <button class="Yes" (click)="continue(\'Yes\')" >Here</button></span>\n				        </div>\n			          <ion-row  offset-lg-1 col-lg-11 offset-md-1 col-md-11  id="notQuoting" style="display:none;margin-top: 15px;font-size:16px; font-weight:bold;padding-left:20px">\n			          	<span style="color: grey">If you do not wish to quote, Please endorse the reason int the input field below</span><br/>\n			          	<textarea col-11 class="textarea" [(ngModel)] = \'reason\'>\n			          	</textarea>\n			          	<br/>\n			          	<div  style="text-align: center; margin-top: 10px; width:100%;">\n			          		<button (click)="notQuot(reason)" [disabled]="!reason || reason.trim() == \'\'"  class="sbmtReason reason">Submit</button> \n			          	</div>\n			          	\n			          </ion-row>\n			          		<div style="margin-top: 20px ;text-align: center; width: 100%">FOR OFFICIAL USE ONLY</div><br/>\n			          <ion-row col-12style="margin-top:20px">\n			          	<div col-12 style="padding-left:10px">\n			          		   <div offset-lg-3 offset-md-3 style="text-align:left;">Opened and reviewed by:</div>\n			          		   <ol col-lg-8 offset-lg-2 col-12  class="list1" style="list-style-type: lower-alpha;padding:5px;text-align: center;">\n			          		   	<div offset-lg-3 offset-md-2 >\n			          		   		<div style="font-weight: bold; margin-bottom: 10px;">\n			          		   			<span>Name</span>\n			          		   			<span style="float: right; margin-right: 20%">Designation</span>\n			          		   		</div>\n				          		   	<li  *ngFor="let approver of approvers">\n				          		   		<input class="input2 designations" [(ngModel)]=approver.name type="text">\n				          		   		<input  class="input2 designations" [(ngModel)]=approver.designation offset-md-3 offset-lg-3 type="text" >\n				          		   	</li>\n			          		   		<div *ngIf="!quotationInfo"  style="text-align: center; margin-top: 20px; width:100%;">\n						          		<button (click)="saveQuotation()"  class="sbmtReason">Submit</button> \n						          	</div>\n				          		 </div>\n			          		   </ol>\n			          	</div>\n	          </ion-row>\n      </div>\n      <div *ngIf="doc == \'evaluation\'">\n      	<ion-row>\n      		<div style="text-align: center;font-size: 15px; font-weight: bold;width:100%;margin-top: 10px;">Quotation no. {{data[3]}}</div>\n      			 <div class="scrollmenu" style="width:100%; margin-top: 30px;text-align: center;" >\n	      			 <span *ngFor=" let title of evaLTitles let z = index " >\n						 <button *ngIf="z !== 0" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold;width: 100px"  >\n										  	{{title}}\n						   </button>\n						   <button *ngIf="z  == 0" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold;width: 150px"  >\n										  	{{title}}\n						   </button>\n					</span><br/>\n					<div  *ngFor=" let item of items let a = index">\n	      			     <span *ngFor=" let itemx of evaLTitles let q = index " >\n								 <button *ngIf="q !== 0 && q < evaLTitles.length - 1" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold;width: 100px"  >\n												<span *ngIf="q == 1">{{biders[0].items[a].price}}</span>\n												<span *ngIf="q == 2">{{biders[1].items[a].price}}</span>\n												<span *ngIf="q == 3">{{biders[2].items[a].price}}</span>\n							   </button>\n							   <button *ngIf="q  == 0"style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold;width: 150px;overflow: hidden;overflow-y: auto;"  >\n											  	{{item.desc}}\n							   </button>\n							   <select *ngIf="itemx == \'Award to\'" [(ngModel)]=item.selection style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold;width: 100px"  >\n									<option value="None">None</option>\n									<option *ngFor="let supplier of suppliers let m = index" value="{{m}}">\n									{{supplier}}</option>\n							   </select>\n						</span>\n					</div>\n	      		</div>\n	      		<div style="text-align: center; margin-top: 20px; width:100%;">\n	          		<button class="sbmtReason" (click)="CreateLPO()">Proceed</button> \n	          	</div>\n      	</ion-row>\n      </div>\n      <div *ngIf="doc == \'lpo\'">\n      	<ion-row *ngFor="let bider of biderSelections let indx = index">\n      		<div style="float: right; width:100%; margin-top: 15px; padding-right: 20px">\n      			<input type="text" [(ngModel)]=data[3] class="inputSerial"/>\n      			<span style="float: right; font-size: 14px; color: grey;">Serial No. </span>\n\n      		</div>\n      		<ion-list style="display: inline-block;">\n      			<ion-item no-lines *ngFor="let input of bider.inputs let x = index" style="display: inline-block; width:400px;">\n      				<ion-label stacked>{{input.title}}</ion-label>\n      				<ion-input *ngIf="(x !== 2 && x!==3)" readonly style="border: none;border-bottom: 2px solid lightgrey;width:400px; height:40px;padding-left: 15px;" class="inputLpo" [(ngModel)]=input.ngBind></ion-input>\n      				<ion-input *ngIf="(x == 3)" style="border: none;border-bottom: 2px solid lightgrey;width:400px; height:40px;padding-left: 15px;" class="inputLpo" [(ngModel)]=input.ngBind></ion-input>\n      				<ion-select  *ngIf=" x == 2" [(ngModel)]=input.ngBind  style="border: none;border-bottom: 2px solid lightgrey;width:400px;" >\n      					<ion-option>Pay on Delivery</ion-option>\n      					<ion-option>Pay within 1 week</ion-option>\n      					<ion-option>Pay within 2 months</ion-option>\n      				</ion-select>\n      			</ion-item>\n      		</ion-list>\n      		<div style="color:grey; margin: 10px; text-align: center;;width: 100%">This document constitutes an agreement between the vendor and the buyer.\n      		 <button (click)="toggleIntr0()" class="readInstr">See terms and conditions</button>\n      		</div>\n      	    <div class="scrollmenu" offset-lg-3 offset-md-1  style="margin-top: 20px">\n      	    	<div>\n	        	  <span *ngFor=" let title of LpO let v = index" >\n					  <button *ngIf="v ==0" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:70px;"  >\n					  	{{title}}\n					   </button>\n					   <button *ngIf="v !==0 && v !== 1" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:100px;"  >\n					  	{{title}}\n					   </button>\n					    <button   *ngIf="v == 1" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:150px;overflow: hidden;"  >\n					  	{{title}}\n					   </button>\n					</span>\n				</div>\n				<div>\n					<div *ngFor="let itemy of bider.items let f = index">\n		        	  <span *ngFor=" let title of LpO let v = index" >\n						  <button *ngIf="v ==0"  style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:70px;color:grey"  >\n						  	  {{f+1}}\n						   </button>\n						   <button *ngIf="v == 1" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:150px;color:grey;overflow: hidden;"  >\n						  	  {{itemy.desc}}\n						   </button>\n						   <button *ngIf="v ==2" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:100px;color:grey"  >\n						  	  {{itemy.unit}}\n						   </button>\n						    <button *ngIf="v ==3" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:100px;color:grey"  >\n						  	  {{itemy.qty}}\n						   </button>\n						    <button *ngIf="v ==4" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:100px;color:grey"  >\n						  	  {{itemy.price}}\n						   </button>\n						    <button *ngIf="v ==5" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:100px;color:grey"  >\n						  	  {{itemy.total_value}}\n						   </button>\n						</span>\n					</div>\n				</div>\n				<div style="width: 100%; float: right;">\n	        	  <span style="float:right;">\n					  <button  style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:14px; width:100px;color:grey"  >\n					  	Total Value\n					   </button>\n					   <button  style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:14px; width:100px;color:grey"  >\n					   {{bider.amount}}\n					</button>\n					</span>\n				</div>\n			</div>		\n				<div style="width: 100%;margin-left: 20px;margin-bottom: 5px;">Amount in Words</div>\n  				<textarea   style="height:30px; resize: none;border: none;border-bottom: 2px solid lightgrey;width:400px;margin-left: 10px;" class="inputLpo" [(ngModel)]=bider.amntWords>\n  				</textarea>	   \n      	</ion-row>\n      		<div  style="text-align: center;">\n				<ion-list style="display: inline-block;margin-bottom: 10px;">\n      			  <div  style="font-weight: bold;">Approval</div> \n      			<ion-item no-lines *ngFor="let more of moreLPOs let y = index " style="display: inline-block; width:400px;">\n      				<div> \n      					<div *ngIf="y == 0" style="font-size: 12px; color:grey; margin-top: 5px; margin-bottom: 5px">1. Procurement Manager</div>\n      					<div *ngIf="y == 1" style="font-size: 12px; color:grey; margin-top: 5px; margin-bottom: 5px">2. Project Manager/ Director/ Head of Dept</div>\n      				</div>\n	      			<div>\n	      				<div >{{more.title}}</div>\n	      				<textarea  style="height:30px; resize: none;border: none;border-bottom: 2px solid lightgrey;width:400px" class="inputLpo" [(ngModel)]=moreLPOs[y].bind>\n	      				</textarea>\n	      			</div>\n	      		</ion-item>\n      		</ion-list>\n      		<div *ngIf="!lpoMade" style="text-align: center; margin-bottom: 10px; width:100%;">\n          		<button (click)="createLPo()" class="sbmtReason">Submit</button> \n          	</div>\n		</div>\n\n      </div>\n\n	</ion-grid>\n\n</ion-content>\n'/*ion-inline-end:"/Users/brianhenry/Desktop/siwfity/src/pages/docs/docs.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__provider_provider__["a" /* ProviderPage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */]])
    ], DocsPage);
    return DocsPage;
}());

function dateFunction() {
    var date = new Date(Date.now());
    var date1 = date.toString();
    return [date1.substr(0, 15) + ' at ' + date1.substr(16, 5)];
}
//# sourceMappingURL=docs.js.map

/***/ }),

/***/ 141:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClientDocsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__provider_provider__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jquery__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_jquery__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




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
            this.invoicedata = this.data[3];
            this.provider.Load('show', 'Getting invoice information...');
            this.provider.socketRequest({
                module: 'fetchInvoice',
                user: this.data[2].email,
                invoiceInfo: this.invoicedata
            });
        }
        else if (this.data[1] == 'receipt') {
            this.receipt = this.data[3];
            this.dateCreated = this.receipt.dateCreated;
            this.serial = this.receipt.serial;
            this.invoicedata = this.receipt.from;
            this.acc = this.data[2];
            this.invoicedata = {
                creator: this.receipt.to.email
            };
            this.to = {
                businessName: this.receipt.to.name
            };
            this.from = {
                businessName: this.receipt.from.name
            };
            this.bider = {
                amount: this.receipt.amount
            };
        }
        else if (this.data[1] == 'deliveryNote') {
            this.deliveryNote = this.data[3];
            this.change();
            this.acc = this.data[2];
        }
        else if (this.data[1] == 'InspectionNote') {
            this.ins = this.data[2];
            this.acc = this.data[3];
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
                case 'rating':
                    if (data.ins)
                        _this.ins = data.ins;
                    else {
                        _this.ins.rate = true;
                        alert('inspectiona already done');
                    }
                    break;
                case 'invoiceSent':
                    _this.provider.toast('Invoice has been sent', 'middle');
                    _this.bider.invoiced = true;
                    break;
                case 'updatedReceipt':
                    _this.receipt.confirmed = true;
                    break;
                case 'updatedDelivery':
                    _this.provider.toast("Your delivery has been saved", 'middle');
                    if (!_this.deliveryNote) {
                        _this.deliveryNote = {
                            delivers: [data.del]
                        };
                    }
                    else if (!_this.deliveryNote.delivers) {
                        _this.deliveryNote.delivers = [data.del];
                    }
                    else {
                        _this.deliveryNote.delivers.push(data.del);
                    }
                    _this.change();
                    break;
                case 'invoiceFound':
                    if (_this.acc.email == _this.data[3].creator) {
                        _this.to = _this.acc;
                        _this.from = data.person;
                    }
                    else {
                        _this.to = data.person;
                        _this.from = _this.acc;
                        _this.del = data.del;
                    }
                    _this.bider = data.invoice;
                    _this.bider.amount = _this.bider.TotalValue;
                    _this.receipt = data.invoice.receipt;
                    _this.items = _this.bider.items;
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
                    _this.calculateDate(hours);
                    break;
                case 'savedReceipt':
                    _this.provider.toast('Receipt has been sent', 'middle');
                    _this.receipt = data.receipt;
                    break;
                case 'getDeliery':
                    _this.deliveryNote.newDel = data.doc;
                    break;
            }
        });
    }
    ClientDocsPage.prototype.ionViewDidLeave = function () {
        if (this.navCtrl.getActive().name == 'ClientDocsPage') {
            this.provider.events.unsubscribe('invoice');
        }
    };
    ClientDocsPage.prototype.change = function () {
        var iq = this.deliveryNote.delivers[this.deliveryNote.delivers.length - 1].items;
        iq.forEach(function (q, index) {
            iq[index].qty = q.bal;
            iq[index].del = '';
            iq[index].bal = '';
        });
        this.deliveryNote.newDel = {
            date: this.provider.changeDate(Date.now()),
            items: iq,
            received: '',
            delivered: false
        };
        this.newDel = this.deliveryNote.newDel;
    };
    ClientDocsPage.prototype.sendInvoice = function () {
        var acc = this.provider.acc;
        this.provider.Load('show', 'Sending invoice...');
        this.provider.socketRequest({
            module: 'updateInvoice',
            lpoId: this.data[3],
            toId: this.from.businessName,
            from: {
                email: acc.email,
                name: acc.businessName,
                pic: acc.pic
            }
        });
    };
    ClientDocsPage.prototype.makedeliveryNote = function (items) {
        this.doc = 'deliveryNote';
        this.deliveryNote = {
            serial: this.serial,
            from: this.from,
            to: this.to,
            delivers: [],
            newDel: {
                date: this.provider.changeDate(Date.now()),
                items: items,
                received: '',
                delivered: false
            }
        };
    };
    ClientDocsPage.prototype.deliveryChange = function (ind) {
        if (ind == 'New') {
            this.deliveryNote.newDel = this.newDel;
            __WEBPACK_IMPORTED_MODULE_3_jquery__('.sbmtQt').show();
        }
        else {
            __WEBPACK_IMPORTED_MODULE_3_jquery__('.sbmtQt').hide();
            this.provider.socketRequest({
                module: 'getDeliery',
                id: ind,
                serial: this.deliveryNote.serial,
                dateCreated: this.deliveryNote.dateCreated
            });
        }
    };
    ClientDocsPage.prototype.itemCal = function (event, index) {
        var item = this.deliveryNote.newDel.items[index];
        if ((item.qty - item.del) < 1 || event.keyCode == 45 || event.keyCode == 46) {
            return false;
        }
    };
    ClientDocsPage.prototype.makedeliveryNote1 = function () {
        var allNotEmpty;
        var items = this.deliveryNote.newDel.items;
        this.deliveryNote.newDel.items = [];
        var thisx = this;
        items.map(function (q) {
            q.bal = parseInt(q.qty) - parseInt(q.del);
            if (isNaN(q.bal)) {
                q.bal = q.qty;
                q.del = 0;
            }
            if (q.del !== 0) {
                allNotEmpty = 1;
            }
            thisx.deliveryNote.newDel.items.push(q);
        });
        if (allNotEmpty !== undefined) {
            this.provider.Load('show', 'Creating delivery note...');
            this.provider.socketRequest({
                module: 'createDelivery',
                deliveryNote: this.deliveryNote
            });
        }
        else {
            alert('You cannot submit an empty delivery');
        }
    };
    ClientDocsPage.prototype.makeReceipt = function () {
        this.doc = 'receipt';
    };
    ClientDocsPage.prototype.calculateBal = function (event, val) {
        var item = this.deliveryNote.newDel.items[val];
        if (item.del <= item.qty) {
            item.bal = item.qty - item.del;
        }
        else {
            item.del = item.qty - item.bal;
        }
    };
    ClientDocsPage.prototype.makePayment = function () {
        this.provider.Load('show', 'Sending receipt...');
        this.provider.socketRequest({
            module: 'sendingReceipt',
            from: {
                name: this.from.businessName,
                email: this.from.email
            },
            to: {
                name: this.to.businessName,
                email: this.to.email,
                pic: this.provider.acc.pic
            },
            amount: this.bider.amount,
            serial: this.serial
        });
    };
    ClientDocsPage.prototype.confirmPayment = function () {
        this.provider.Load('show', 'Just a moment...');
        this.provider.socketRequest({
            module: 'updatePayment',
            serial: this.serial,
            dateCreated: this.dateCreated,
            toId: this.to.businessName,
            from: {
                name: this.provider.acc.businessName,
                email: this.provider.acc.email,
                pic: this.provider.acc.pic
            }
        });
    };
    ClientDocsPage.prototype.calculateDate = function (hours) {
        if (hours) {
            var secs = this.bider.dateInvoiced + hours * 3600 * 1000;
            var date = this.provider.changeDate(secs);
            this.dueDate = 'Payment due ' + date.substr(0, 15);
        }
    };
    ClientDocsPage.prototype.todayDate = function () {
        return this.provider.changeDate(Date.now());
    };
    ClientDocsPage.prototype.makeInspection = function () {
        this.doc = 'InspectionNote';
        this.ins = {
            serial: this.deliveryNote.serial,
            to: this.deliveryNote.to,
            from: this.deliveryNote.from,
            items: this.deliveryNote.delivers[0].items,
            approvedBy: [
                { name: '', design: '' },
                { name: '', design: '' },
                { name: '', design: '' }
            ]
        };
    };
    ClientDocsPage.prototype.createInspection = function () {
        this.provider.Load('show', 'Rating...');
        this.provider.socketRequest({
            module: 'rating',
            ins: this.ins
        });
    };
    ClientDocsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-client-docs',template:/*ion-inline-start:"/Users/brianhenry/Desktop/siwfity/src/pages/client-docs/client-docs.html"*/'<ion-header >\n  <ion-navbar color="headerColor">\n    <div class="reQuest" *ngIf="doc ==\'deliveryNote\' ">Delivery Note\n      <button (click)="makeInspection()" style="float: right" ion-button *ngIf="deliveryNote.to.email == acc.email">Inspection</button>\n    </div> \n    <div class="reQuest" *ngIf="doc ==\'invoice\' ">Invoice\n      <button (click)="makedeliveryNote(bider.items)" style="float: right" ion-button *ngIf="invoicedata && invoicedata.creator !== acc.email && !del">Delivery Note</button>\n      <button (click)="makeReceipt()" style="float: right" ion-button *ngIf="invoicedata && invoicedata.creator == acc.email && !receipt">Receipt</button>\n    </div>\n    <ion-title *ngIf="doc ==\'InspectionNote\' ">Inspection certificate</ion-title>\n    <ion-title *ngIf="doc ==\'receipt\' ">Receipt</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content style="background-color: white;">\n	 <ion-grid col-12 style="padding:0px; margin:0px;">\n	 	<div *ngIf="doc ==\'invoice\' " offset-lg-2 offset-md-2 style="padding:0px;">\n 			<div style="padding:0px; margin:0px;">\n				 <div class="invoiceTitle1">	Order No. {{serial}}</div>\n\n 				<div *ngIf="to" style="margin-top: 20px;">\n 					<ul style="list-style: none;margin: 0px;padding: 10px; font-size: 16px;">\n 						<li>{{to.businessName}}</li>\n 						<li style="margin-top: 10px;">Street: {{to.address.street}}</li>\n 						<li><span style="font-weight: bold;margin-right: 50px">Phone: </span>+254 {{to.phone}}</li>\n 						<li><span style="font-weight: bold;margin-right: 50px">Email: </span>{{to.email}}</li>\n 					</ul>\n 				</div>\n\n 				<div style="margin-top: 20px;" *ngIf="from">\n 					<span class="billText">Bill To</span>\n 					<ul style="list-style: none;margin: 0px;padding: 10px; font-size: 16px;">\n 						<li>{{from.businessName}}</li>\n 						<li style="margin-top: 10px;">Street: {{from.address.street}}</li>\n 						<li><span style="font-weight: bold;margin-right: 50px">Phone: </span>+254 {{from.phone}}</li>\n 						<li><span style="font-weight: bold;margin-right: 50px">Email: </span>{{from.email}}</li>\n 					</ul>\n 				</div>\n 			</div>\n 			<div style="margin-top:25px;">\n 				<div class="scrollmenu" offset-lg-1 offset-md-1  >\n	            	 <div>\n			        	  <span *ngFor=" let title of titles let v = index" >\n							  <button *ngIf="v ==0" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:70px;"  >\n							  	{{title}}\n							   </button>\n							   <button *ngIf="v !==0 && v !== 1" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:100px;"  >\n							  	{{title}}\n							   </button>\n							    <button   *ngIf="v == 1" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:150px;overflow: hidden;"  >\n							  	{{title}}\n							   </button>\n							</span>\n						</div>\n					<div>\n					<div *ngFor="let itemy of items let f = index">\n		        	  <span *ngFor=" let title of titles let v = index" >\n						  <button *ngIf="v ==0"  style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:70px;color:grey"  >\n						  	  {{f+1}}\n						   </button>\n						   <button *ngIf="v == 1" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:150px;color:grey;overflow: hidden;"  >\n						  	  {{itemy.desc}}\n						   </button>\n						   <button *ngIf="v ==2" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:100px;color:grey"  >\n						  	  {{itemy.unit}}\n						   </button>\n						    <button *ngIf="v ==3" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:100px;color:grey"  >\n						  	  {{itemy.qty}}\n						   </button>\n						    <button *ngIf="v ==4" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:100px;color:grey"  >\n						  	  {{itemy.price}}\n						   </button>\n						    <button *ngIf="v ==5" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:100px;color:grey"  >\n						  	  {{itemy.total_value}}\n						   </button>\n						</span>\n					</div>\n				</div>\n				<div style="width: 100%;" col-lg-8>\n	        	  <span style="float:right; margin-right: 50px; font-family: arial">\n					  <button  style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:15px; width:100px;color:black"  >\n					  	Total Value\n					   </button>\n					   <button *ngIf="bider"  style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:15px; width:100px;color:black"  >\n					   {{bider.amount}}\n					</button>\n					</span>\n				</div>\n				 </div>\n\n 			</div>\n 			<div class="conditions">\n 				<ul>\n 					<li>{{dueDate}}</li>\n 					<li>If failure to honour payment date, is subject to 2% of total invoice amount penalty</li>\n 				</ul>\n 			</div>\n 			<div *ngIf="bider && !bider.invoiced" style="text-align: center; margin-top: 10px;margin-bottom: 10px; width:100%;">\n          		<button (click)="sendInvoice()"class="sbmtReason">Submit</button> \n          	</div>\n	 	</div>\n	 	<div *ngIf="doc ==\'deliveryNote\' "  offset-lg-2 offset-md-2 style="padding:0px;">\n			 <div class="invoiceTitle1">	Order No. {{deliveryNote.serial}}</div>\n\n 				<div style="margin-top: 20px;">\n 					<ul style="list-style: none;margin: 0px;padding: 10px; font-size: 16px;">\n 						<li>{{deliveryNote.to.businessName}}</li>\n 						<li style="margin-top: 10px;">Street: {{deliveryNote.to.address.street}}</li>\n 						<li><span style="font-weight: bold;margin-right: 50px">Phone: </span>+254{{deliveryNote.to.phone}}</li>\n 						<li><span style="font-weight: bold;margin-right: 50px">Email: </span>{{deliveryNote.to.email}}</li>\n 					</ul>\n 				</div>\n\n 				<div style="margin-top: 20px;">\n 					<span class="billText">Supplied By</span>\n 					<ul style="list-style: none;margin: 0px;padding: 10px; font-size: 16px;">\n 						<li>{{deliveryNote.from.businessName}}</li>\n 						<li style="margin-top: 10px;">Street: {{deliveryNote.from.address.street}}</li>\n 						<li><span style="font-weight: bold;margin-right: 50px">Phone: </span>+254{{deliveryNote.from.phone}}</li>\n 						<li><span style="font-weight: bold;margin-right: 50px">Email: </span>{{deliveryNote.from.email}}</li>\n 					</ul>\n 				</div>\n 				<div class="deliveryDates">\n 					<ion-item no-lines>\n 						<ion-label>Other deliveries</ion-label>\n 						<ion-select [(ngModel)]="del" (ionChange)="deliveryChange(del)">\n 							<ion-option selected value="New">New Delivery</ion-option>\n 							<ion-option  *ngFor="let delivery of deliveryNote.delivers let inx = index" value="{{delivery.date}}">{{delivery.date}}</ion-option>\n 						</ion-select>\n 					</ion-item>\n 				</div>\n 				<div class="scrollmenu"  offset-lg-1 offset-md-1  style="margin-top:30px; ">\n	            	  <span *ngFor=" let title of titles0 let j =  index">\n						  <button *ngIf="j == 0" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:200px;"  >\n						  	{{title}}\n						   </button>\n						   <button *ngIf="j !== 0" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:100px;"  >\n						  	{{title}}\n						   </button>\n					 </span>\n					 <div *ngFor=" let item of deliveryNote.newDel.items let G = index" >\n						 <span  *ngFor=" let title of titles0 let f = index " >\n						  	<input *ngIf="f == 0" [(ngModel)]="item.desc" readonly class="input1"  style="width: 200px;" type="text">\n						  	<input *ngIf="f == 3 " [(ngModel)]="item.bal" readonly class="input1"  style="width: 100px;" type="text">\n						  	<input *ngIf="f == 1" [(ngModel)]="item.qty" readonly class="input1"  style="width: 100px;" type="text">\n						  	<input *ngIf="f == 2 && deliveryNote.to.email !== acc.email" [(ngModel)]="item.del" (keypress)="itemCal($event, G)" (keyup)="calculateBal($event, G)" class="input1"  style="width: 100px;" type="number">\n						  	<input *ngIf="f == 2 && deliveryNote.to.email == acc.email" [(ngModel)]="item.del" readonly="" class="input1"  style="width: 100px;" type="number">\n					  	</span>\n					 </div>\n			    </div>\n			   <div style="display: inline-block;padding: 10px; margin-top:20px">\n			   	  <ul style="margin: 0px;padding: 10px">\n			   	    <li>Notice must be given to us on any goods not received within 10days from the date of despatch stated on the invoice.</li>\n			   	    <li>Any shortage or damage must be notified within 72hours of receipt of goods.</li>\n			   	    <li>Complains can only be accepted if made within 30days of goods receipt.</li>\n			   	    <li>No goods may be returned without prior authorisation from the company.</li>\n			      </ul>\n			   </div>\n			    	<div style="padding: 15px;" >\n		      		   		<div style="font-weight: bold; margin-bottom: 10px;">\n		      		   			<div style="margin-bottom: 10px;">Received by</div>\n				      		   			<ion-input [(ngModel)]=deliveryNote.newDel.received class="input2" type="text"></ion-input>\n		      		   			<div style="margin-top: 15px;">Date</div>\n	      		   			<ion-item no-lines>\n				          		<ion-input style="background-color: white" [(ngModel)]=deliveryNote.newDel.date class="input3"  type="text" ></ion-input>\n				          	</ion-item>\n			      		   	</div>\n		      		</div>\n		      		<div *ngIf="deliveryNote.to.email !== acc.email" class="sbmtQt">\n		          		<button (click)="makedeliveryNote1()" class="sbmtReason">Submit</button> \n		          	</div>\n       </div>\n       <div  *ngIf="doc ==\'InspectionNote\' ">\n		 <div class="invoiceTitle1">	Date {{provider.changeDate(ins.dateCreated)}}</div>\n		 <div class="invoiceTitle1">	Order No. {{ins.serial}}</div>\n		 <div style="margin-top: 20px;">\n 					<div  style="margin-top: 20px;">\n 					<ul style="list-style: none;margin: 0px;padding: 10px; font-size: 16px;">\n 						<li>{{ins.to.businessName}}</li>\n 						<li style="margin-top: 10px;">Street: {{ins.to.address.street}}</li>\n 						<li><span style="font-weight: bold;margin-right: 50px">Phone: </span>+254 {{ins.to.phone}}</li>\n 						<li><span style="font-weight: bold;margin-right: 50px">Email: </span>{{ins.to.email}}</li>\n 					</ul>\n 				</div>\n\n 				<div style="margin-top: 20px;">\n 					<span class="billText">Supplied by</span>\n 					<ul style="list-style: none;margin: 0px;padding: 10px; font-size: 16px;">\n 						<li>{{ins.from.businessName}}</li>\n 						<li style="margin-top: 10px;">Street: {{ins.from.address.street}}</li>\n 						<li><span style="font-weight: bold;margin-right: 50px">Phone: </span>+254 {{ins.from.phone}}</li>\n 						<li><span style="font-weight: bold;margin-right: 50px">Email: </span>{{ins.from.email}}</li>\n 					</ul>\n 				</div>\n\n           <div style="padding: 10px; font-size: 14px; font-family: sans-serif;">\n	           We hereby certify that the following item have been duly inspected by our representatives and made up in accordance with all the requirements as order specified;\n	       </div>\n           <div class="scrollmenu" offset-lg-1 offset-md-1  style="margin-top:10px; ">\n        	  <span *ngFor=" let title of titles1 let j =  index">\n				  <button *ngIf="j == 0" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:300px;"  >\n				  	{{title}}\n				   </button>\n				   <button *ngIf="j == 1" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:150px;"  >\n				  	{{title}}\n				   </button>\n				</span>\n				<div *ngFor=" let item of ins.items" >\n			     <span  *ngFor=" let title of titles1 let f = index " >\n			  	<button *ngIf="f == 0" style="border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px; width:300px;"  >\n				  	{{item.desc}}\n				   </button>\n			  	<select *ngIf="(f == 1)" [(ngModel)]="item.rate" style="border: 1px solid lightgrey; width:150px;">\n			  		<option value="None">None</option>\n			  		<option value="Satisfied">Satisfied</option>\n			  		<option value="Unsatisfied">Unsatisfied</option>\n			  	</select>\n			  </span>\n			</div>\n           </div>\n\n			<div style="padding: 8px">\n				 <div col-lg-8 offset-lg-2 col-12  class="list1" >\n	      		   	<div >\n	      		   		<div offset-lg-1 offset-xl-1 style="font-weight: bold; margin-bottom: 10px;text-align: left;">\n	      		   			<span>Name</span>\n	      		   			<span style="float: right; margin-right: 15%">Designation</span>\n	      		   		</div>\n	          		   	<div *ngFor="let apps of ins.approvedBy" offset-lg-2 offset-xl-2>\n	          		   		<input class="input3" [(ngModel)]="apps.name" type="text">\n	          		   		<input  class="input3" [(ngModel)]="apps.design"  type="text" >\n	          		   	</div>\n	          		   \n	          		   		<div *ngIf="!ins.rated" style="text-align: center; margin-top: 20px; width:100%;">\n				          		<button (click)="createInspection()" class="sbmtReason">Submit</button> \n				          	</div>\n	      		   </div>\n      		   </div>\n           </div>\n       </div>\n   </div>\n           <div  *ngIf="doc ==\'receipt\' ">\n		 		<div class="invoiceTitle1">	 No. {{serial}}</div>\n		 		<div class="Pay" style="margin-top:40px">Paid by: <span class="value">{{to.businessName}}</span></div>\n		 		<div class="Pay">Paid To: <span class="value">{{from.businessName}}</span></div>\n           \n              <div class="scrollmenu" offset-lg-1 offset-md-1  style="margin-top:10px; ">\n	        	  <span *ngFor=" let title of titles2 let j =  index">\n					  <button *ngIf="j == 0" style="height:50px;border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:300px;"  >\n					  	{{title}}\n					   </button>\n					   <button *ngIf="j == 1" style="height:50px;border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px;font-weight:bold; width:150px;"  >\n					  	{{title}}\n					   </button>\n					</span>\n					<div  >\n					     <span  >\n					  	<button  style="height:150px;border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px; width:300px;"  >\n		 						LPO NO. {{serial}}\n		  				   </button>\n		  				   <button style="height:150px;border: 1px solid lightgrey;text-align: left;background-color: transparent;font-size:16px; width:150px;"  >\n		 							{{bider.amount}}\n		  				   </button>\n					  </span>\n					</div>\n			  </div>\n		 		<div *ngIf="!receipt" class="Pay">Date: <span class="value">{{todayDate()}}</span></div>\n		 		<div *ngIf="receipt && receipt.dateCreated" class="Pay">Date: <span class="value">{{provider.changeDate(receipt.dateCreated)}}</span></div>\n		 		<div *ngIf="receipt" style="text-align: center;">\n			 		<!--<div padding style="font-size: 16px; color:grey; margin-top: 10px; margin-bottom: 10px;">\n			 				Transaction Id:  <span class="value">KSDFJGKSDFKGSJDFGSDF.</span>\n			 		</div>-->\n			 		<span *ngIf="receipt.confirmed == false && invoicedata.creator == acc.email" class="sbmtReason" style="background-color: lightgrey; color: black">Awaiting confirmation</span> \n			 		<span *ngIf="receipt.confirmed == true" class="sbmtReason" style="background-color: lightgreen; color: black">Payment confirmed</span> \n			 	</div>\n			 	<div *ngIf="receipt">\n			 		<div *ngIf="receipt.confirmed  == false && invoicedata.creator !== acc.email" style="text-align: center; margin-top: 20px; width:100%;">\n		          		<button (click)="confirmPayment()" class="sbmtReason">Confirm payment</button> \n		          	</div>\n	             </div>\n	             <div *ngIf="!receipt && invoicedata.creator == acc.email " style="text-align: center; margin-top: 20px; width:100%;">\n		          		<button (click)="makePayment()" ion-button class="sbmtReason" style="color: white">Make payment</button> \n	          	</div>\n           </div>\n \n	 </ion-grid>\n\n</ion-content>\n'/*ion-inline-end:"/Users/brianhenry/Desktop/siwfity/src/pages/client-docs/client-docs.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__provider_provider__["a" /* ProviderPage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */]])
    ], ClientDocsPage);
    return ClientDocsPage;
}());

//# sourceMappingURL=client-docs.js.map

/***/ }),

/***/ 152:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 152;

/***/ }),

/***/ 194:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 194;

/***/ }),

/***/ 258:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__provider_provider__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__offer_offer__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__term_term__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__admin_admin__ = __webpack_require__(277);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var HomePage = /** @class */ (function () {
    function HomePage(plt, events, alertCtrl, storage, provider, navCtrl) {
        var _this = this;
        this.plt = plt;
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.provider = provider;
        this.navCtrl = navCtrl;
        this.menuItems = [
            { title: 'Home', hide: 'containery', show: 'container3' },
            { title: 'Requests', hide: 'containery', show: 'container4' },
            { title: 'Log in', hide: 'container', show: 'container2' },
            { title: 'About', hide: 'containery', show: 'container5' },
        ];
        this.inputs = [];
        this.submitButtons = [
            { title: 'Log in' },
            { title: 'Log in' },
            { title: 'Sign up' },
            { title: 'Forgot password ?' },
            { title: 'Create a new account' },
            { title: 'Already have an account? Log in.' },
            { title: 'Back to log in.' },
            { title: 'Verify' },
        ];
        this.requests = [];
        this.logged = false;
        this.provider.makeInfo();
        __WEBPACK_IMPORTED_MODULE_2_jquery__(document).ready(function () {
            var height = __WEBPACK_IMPORTED_MODULE_2_jquery__('.colHeight').css('height');
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.colHeight').css('lineHeight', height);
        });
        this.inputs = [
            [
                { title: 'Email', type: 'email', ngBind: '' },
                { title: 'Password', type: 'password', ngBind: '' },
            ],
            [
                { title: 'Full name', type: 'text', ngBind: '' },
                { title: 'Business name', type: 'text', ngBind: '' },
                { title: 'Email', type: 'email', ngBind: '' },
                /* {title: 'Phone number', type: 'number', ngBind: 'phoneNumber'},
                 {title: 'Address', type: 'text', ngBind: 'address' },
                 {title: 'Location'},*/
                { title: 'Password', type: 'password', ngBind: '' },
            ],
            [
                { title: 'Enter verification code sent to your email', type: 'number', ngBind: '' },
            ]
        ];
        __WEBPACK_IMPORTED_MODULE_2_jquery__(document).ready(function () {
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.scrollmenu button').eq(0).css('borderBottom', '2px solid white');
        });
        //events
        this.provider.events.subscribe('request', function (data) {
            switch (data.submodule) {
                case 'addRequest':
                    _this.provider.toast("Your request has been uploaded", 'middle');
                    _this.fetch('all', null);
                    break;
            }
        });
        this.provider.events.subscribe('quotation', function (data) {
            switch (data.submodule) {
                case 'newsaved':
                    var indx = _this.requests.findIndex(function (r) { return r.dateCreated == data.id; });
                    if (indx > -1) {
                        _this.requests[indx].quotationId = data.info.id;
                    }
                    break;
            }
        });
        this.provider.events.subscribe('userProposed', function (data) {
            switch (data.submodule) {
                case "offerRemoved":
                    var ind = _this.requests.findIndex(function (q) { return q.dateCreated == data.id; });
                    if (ind !== -1) {
                        _this.requests[ind].prop -= 1;
                    }
            }
        });
        this.events.subscribe('indexResponse', function (data) {
            _this.errorPass = undefined;
            _this.errorEmail = undefined;
            _this.errorEmail1 = undefined;
            if (data.submodule == 'signUp' || data.submodule == 'logIn') {
                if (data.err) {
                    if (data.err == 'errSignUp') {
                        _this.errorEmail = data.message;
                    }
                    else if (data.err == 'errorEmail') {
                        _this.errorEmail1 = data.message;
                    }
                    else if (data.err == 'errorPass') {
                        _this.errorPass = data.message;
                    }
                }
                else {
                    _this.accountInfo = data.message;
                    if (data.message.status !== 'active') {
                        __WEBPACK_IMPORTED_MODULE_2_jquery__('.signUpDiv, .loginDiv').fadeOut(300);
                        __WEBPACK_IMPORTED_MODULE_2_jquery__('.verifDiv').fadeIn(300);
                    }
                    else {
                        _this.loggedIn();
                    }
                }
            }
            else if (data.submodule == 'passChanged') {
                _this.provider.toast(data.message, null);
                _this.hideShow('verifDiv1', 'loginDiv');
            }
            else if (data.submodule == 'offerSent') {
                if (data.owner == _this.provider.acc.businessName)
                    _this.provider.toast("Your request has been sent.", 'middle');
                var ind = _this.requests.findIndex(function (q) { return q.dateCreated == data.req; });
                if (ind !== -1) {
                    _this.requests[ind].props += 1;
                }
            }
            else if (data.submodule == 'logOut') {
                _this.storage.ready().then(function () {
                    _this.storage.remove('swiftifyVariables').then(function () {
                        _this.accountInfo = undefined;
                        _this.logged = false;
                        location.reload();
                    }).catch(function (err) {
                        if (err)
                            throw err;
                    });
                }).catch(function (err) {
                    if (err)
                        throw err;
                });
            }
            else if (data.submodule == 'foundReqs') {
                if (data.message == 'No request found') {
                    _this.provider.toast(data.message, 'bottom');
                }
                else {
                    _this.requests = data.message;
                    for (var r = 0; r < _this.requests.length; r++) {
                        _this.requests[r].postedAt = _this.changeDate(_this.requests[r].dateCreated);
                    }
                }
            }
            else {
                if (data.err == 'emailError') {
                    _this.emailPassErr = data.message;
                }
                else if (!data.err) {
                    __WEBPACK_IMPORTED_MODULE_2_jquery__('.part1').hide();
                    __WEBPACK_IMPORTED_MODULE_2_jquery__('.part2').fadeIn(600);
                    _this.code = data.message;
                }
            }
        });
    }
    HomePage.prototype.goToAdmin = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__admin_admin__["a" /* AdminPage */]);
    };
    HomePage.prototype.terms = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__term_term__["a" /* TermPage */]);
    };
    HomePage.prototype.changeDate = function (date) {
        var dateString = new Date(date);
        dateString = dateString.toString();
        date = dateString.substr(0, 15);
        var time = dateString.substr(16, 5);
        dateString = date + ' at ' + time;
        return dateString;
    };
    HomePage.prototype.loggedIn = function () {
        this.provider.profilePic = this.provider.url + '/' + this.accountInfo.pic;
        this.provider.events.publish('app', { submodule: 'changePic', pic: this.provider.profilePic });
        this.storage.set('swiftifyVariables', JSON.stringify(this.accountInfo)).catch(function (err) {
            if (err)
                console.log(err);
        });
        this.logged = true;
        this.hideShow('container2', 'container0');
        this.provider.makeInfo();
        this.provider.toast('You are now logged in.', null);
        this.events.publish('app', {
            submodule: 'loggedIn',
            acc: this.accountInfo
        });
    };
    HomePage.prototype.resetPass = function (pass, cpass) {
        if (pass !== cpass) {
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.verError1').show();
        }
        else {
            this.provider.socketRequest({
                module: 'updatePass',
                pass: pass,
                userId: this.emailPass
            });
        }
    };
    HomePage.prototype.verify1 = function (data) {
        if (data !== this.code) {
            this.verError1 = true;
        }
        else {
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.part2').hide();
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.part3').fadeIn(600);
        }
    };
    HomePage.prototype.inputKey = function (index) {
        if (index == 2) {
            if (!this.ValidateEmail(this.inputs[1][2].ngBind)) {
                this.errorEmail = 'Invalid email.';
            }
            else {
                this.errorEmail = undefined;
            }
        }
    };
    HomePage.prototype.inputKey1 = function (index) {
        if (index == 0) {
            if (!this.ValidateEmail(this.inputs[0][0].ngBind)) {
                this.errorEmail1 = 'Invalid email.';
            }
            else {
                this.errorEmail1 = undefined;
            }
        }
        else {
            this.errorPass = undefined;
        }
    };
    HomePage.prototype.inputKey2 = function () {
        this.verError = undefined;
        this.verError1 = undefined;
    };
    HomePage.prototype.verify = function (data) {
        this.verError = undefined;
        if (this.accountInfo.status !== data) {
            this.verError = 'err';
        }
        else {
            this.loggedIn();
            this.provider.socketRequest({
                module: 'updateLog',
                email: this.accountInfo.email,
            });
        }
    };
    HomePage.prototype.ionViewDidLoad = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_jquery__('.container3').show();
        __WEBPACK_IMPORTED_MODULE_2_jquery__('.searchIconx').hide();
        this.storage.ready().then(function () {
            _this.storage.get('swiftifyVariables').then(function (val) {
                _this.accountInfo = JSON.parse(val);
                if (_this.accountInfo) {
                    _this.logged = true;
                    _this.fetch('all', null);
                }
                else {
                    _this.fetch('all', null);
                }
            });
        });
    };
    HomePage.prototype.goToRequest = function (req) {
        var _this = this;
        if (!this.accountInfo) {
            var alert_1 = this.alertCtrl.create({
                title: "Login required",
                message: 'Please log in first to view this content',
                buttons: [{
                        text: 'Ok',
                        role: 'destructive',
                        handler: function () {
                            var item = _this.menuItems[2];
                            _this.itemClicked(item, 2, item.hide, item.show);
                        }
                    }]
            });
            alert_1.present();
        }
        else
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__offer_offer__["a" /* OfferPage */], { data: [req, this.accountInfo] });
    };
    HomePage.prototype.fetch = function (value, value0) {
        if (!value0) {
            this.provider.Load('show', 'Fetching requests...');
        }
        var email;
        if (this.accountInfo) {
            email = this.accountInfo.email;
        }
        this.provider.socketRequest({
            module: 'fetchRequests',
            user: email,
            value: value.toLowerCase()
        });
    };
    HomePage.prototype.implictSearch = function (tag) {
        __WEBPACK_IMPORTED_MODULE_2_jquery__('.itemSearch').show();
        this.search_value = tag;
        this.fetch(tag, null);
    };
    HomePage.prototype.toggleMenu = function (item) {
        if (item) {
            this.fetch('all', 'no');
        }
        __WEBPACK_IMPORTED_MODULE_2_jquery__('.itemSearch').toggle();
    };
    HomePage.prototype.hideError = function () {
        this.emailPassErr = undefined;
        __WEBPACK_IMPORTED_MODULE_2_jquery__('.verError1').hide();
    };
    HomePage.prototype.itemClicked = function (item, index, hide, show) {
        if (item.title == 'Requests') {
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.searchIconx').show();
        }
        else {
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.searchIconx').hide();
        }
        __WEBPACK_IMPORTED_MODULE_2_jquery__('.scrollmenu button').css('borderBottom', 'none');
        __WEBPACK_IMPORTED_MODULE_2_jquery__('#btn' + index + '').css('borderBottom', '2px solid white');
        this.hideShow(hide, show);
        if (index == 2) {
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.homePage').fadeOut(600);
        }
    };
    HomePage.prototype.hideShow = function (hide, show) {
        __WEBPACK_IMPORTED_MODULE_2_jquery__('.part2, .part3').hide();
        __WEBPACK_IMPORTED_MODULE_2_jquery__('.part1').fadeIn(600);
        __WEBPACK_IMPORTED_MODULE_2_jquery__('.' + hide + '').fadeOut(300);
        __WEBPACK_IMPORTED_MODULE_2_jquery__('.' + show + '').fadeIn(300);
        this.errorEmail = undefined;
        this.errorEmail1 = undefined;
        this.errorPass = undefined;
    };
    HomePage.prototype.indexAction = function (data) {
        if (!this.errorEmail && !this.errorPass && !this.errorEmail1) {
            this.provider.socketRequest(data);
            this.provider.Load('show', null);
        }
    };
    HomePage.prototype.verify2 = function (email) {
        if (!this.ValidateEmail(email)) {
            this.emailPassErr = 'Invalid email';
        }
        else {
            this.provider.socketRequest({
                module: 'checkEmail',
                email: email
            });
        }
    };
    HomePage.prototype.ValidateEmail = function (mail) {
        if (/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true);
        }
        return (false);
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/brianhenry/Desktop/siwfity/src/pages/home/home.html"*/'\n<ion-content class="content">\n	<ion-grid class="containerx" >\n		<ion-row col-12  style="padding: 0px; margin: 0px;">\n			<ion-col class="container container0" col-12 col-md-12 col-lg-12 col-xl-10  offset-xl-1 style="overflow: hidden;background-color: white" >\n				<div id="Header" col-12 col-xl-10>\n					<div id="appName">\n						<button class="searchIcon menuToggle" menuToggle *ngIf="(accountInfo && logged == true)" >\n				          <ion-icon style="font-size: 25px;font-weight: bold" name="menu"></ion-icon>\n				           <ion-icon *ngIf="provider.notifications > 0" class="notIcon" name="notifications"></ion-icon>\n				         </button>\n					    	<span class="appName">Swiftify</span>\n					    	<button class="searchIcon searchIconx" (click)="toggleMenu()">\n					    		<ion-icon name="search"></ion-icon>\n					    	</button>\n					    	<button class="searchIcon searchIconx" (click)="fetch(\'all\', null)">\n					    		<ion-icon name="refresh"></ion-icon>\n					    	</button>\n				    </div>\n				    <div class="scrollmenu">\n				    	<span *ngFor="let item of menuItems let r = index ">\n						  <button *ngIf="item.title !== \'Log in\' " col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 id="btn{{r}}"  (click)="itemClicked(item, r, item.hide, item.show)">{{item.title}}</button>\n						  <button id="btn{{r}}" *ngIf="(item.title == \'Log in\' && !accountInfo)" col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 (click)="itemClicked(item, r, item.hide, item.show)">{{item.title}}</button>\n						</span>\n						<span *ngIf="provider.acc && provider.acc.businessName == \'SwiftifyAdmin\' ">\n						  <button col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3   (click)="goToAdmin()">Admin</button>\n						</span>\n					</div>\n			   </div>\n  \n				<ion-list style="margin-top: 70px;height: 93%; overflow: hidden;">\n					<ion-item *ngIf="requests.length !== 0" class="itemSearch searchIconx" style="display: none;" col-12>\n			    	   <ion-searchbar col-12 showCancelButton="false" cancelButtonText=\'\' [(ngModel)]="searchVal" color="headerColor" [(ngModel)]="search_value"   class="searchInput">\n	                     </ion-searchbar>\n				    	<button (click)="fetch(search_value)" *ngIf="search_value && search_value.trim() !== \'\'"  item-end class="searchIcon2">\n					      <ion-icon name="search"></ion-icon>\n					    </button>\n					    <button *ngIf="!search_value || search_value.trim() == \'\'" (click)="toggleMenu(\'refresh\')" item-end class="searchIcon2">\n					      <ion-icon name="arrow-up"></ion-icon>\n					    </button>\n				    </ion-item>\n		    <div class="containery container4" *ngIf="requests.length !== 0" style="height:100%;overflow: hidden;padding-bottom:20px;overflow-y: auto;">\n				   <div class="ContentDiv " *ngFor="let req of requests" >\n		    	      <div (click)="goToRequest(req)" class="title0">\n		    	      	<img src="{{provider.url+\'/\'+req.pic}}" class="profileImg" imageViewer/>\n		    	        <div > {{req.businessName}}</div>\n		    	       </div>\n				    	<div class="title" (click)="goToRequest(req)"><a href="#">{{req.title}}</a></div>\n				    	<div class="posted">Posted on {{req.postedAt}}</div><br/>\n				    	<div (click)="goToRequest(req)" class="title1">{{req.details}}</div>\n				    	<div class=" title2">\n				    		<button  (click)="implictSearch(tag)" *ngFor="let tag of req.searchTags" >{{tag}}</button>\n				    	</div>\n				    	<div (click)="goToRequest(req)" class="title3">\n				    		<span>Proposals submitted: {{req.props}}</span>\n				    		<button>\n				    			<ion-icon name="pin"></ion-icon>\n				    			{{req.location}}\n				    		</button>\n				    	</div>\n				    </div>\n	    	</div>\n<div class="containery container5" style="padding:10px;height: 100%;overflow: hidden;overflow-y: auto">\n	<div style="text-align: center;">\n		<h3>Welcome to Swiftify</h3>\n	    <i>Simplifying your order-to-payment circle.</i>\n	</div>\n  <section>\n  	<div style="text-align: center;margin-top: 20px;">Accessible, convenient & simple.</div>\n  	   <div style="text-align: center;">Control, track and report your company’s spend. Robust request to approve functionality, purchase order management, and authenticate deliveries all in one place.</div>\n  </section>\n  <div>\n  	<ul><strong>What are we really offering?</strong>\n  		<li>A virtual elimination of paperwork and paperwork handling.</li>\n  		<li>A reduction in the time between need recognition and the receipt of the order.</li>\n  		<li>Improved communication both within the company and the supplier.</li>\n  		<li>A reduction in errors.</li>\n  		<li>Lower overhead costs in the purchasing area.</li>\n  		<li>Purchasing personnels spend less time on processing of purchasing orders and invoices and more time on strategic value-added purchasing activities.</li>\n  		<li>Purchase management and tracking from the same platform. The system permantly stores all your procuring documents safely allowing the users to make an audit trail at any time.</li>\n  	</ul>\n  	<ul>\n  		<strong>How do we do it?</strong>\n  		<li><strong>Identify need and Requisition generation.</strong>\n  		Identify your company\'s need and generate the necessary and detailed requisition.</li>\n  		<li><strong>Foward the Requisition.</strong>The requisition will be forward directly to your pool of suppliers on your database to invite them to submit a bid for the purchase contract.</li>\n  		<li><strong>Bidding, Negotiation, and Supplier selection.</strong>After the bidding is done, evaluate and select your most suitable bidder.</li>\n  		<li><strong>Purchase approval and Ordering.</strong>Get the right approvals and proceed to electronically drafting of a purchasing order(L.P.O).</li>\n  		<li><strong>Invoicing, Delivery and Inspection.</strong>Electronically recieve invoices and delivery notes and issue inspection certificates upon confirm that the order has been billed, delivered and inspected.</li>\n  		<li><strong>Three-way matching and payment.</strong>We align your Purchase Order, Invoice and Delivery Note for conformity before proceedin to payment. This ensures that your order has been delivered in full and confirmed to be what had been ordered.</li>\n  		<li><strong>Continously measure and manage supplier performance.</strong>Track the suppliers performance after awarding the contract.</li>\n  		<li><strong>Reviews.</strong>Leave a rating for the supplier who got the job done for other clients who would love to enjoy the same.</li>\n  		<li>\n\n  	</ul>\n  </div>\n  <div>\n      <strong>What are the benefits.</strong><br/>\n      Swiftify enables an organization-wide, coordinated, normalized and strategic approach to e-procurement, by creating an environment, which encompasses all stakeholders - buyers, suppliers, auditors and decision makers, in a transparent, collaborative and fair practice environment. This tool transforms a rigid, process driven environment into a flexible, result driven landscape, where in "purchasing silos" merge to make way for one comprehensive, collaborative procurement platform.\n      <br/>\n\n      We maximizes your savings potential through optimizing supplier selection and making dramatic efficiency improvements in the administrative processes of preparing tenders and requesting supplier quotations.\n    <ul>\n      <li>Smart.\n        <ul>\n        Free capacity via full Source-to-Pay digitization.<br/>\n        Actionable insights at your fingertips. <br/> \n        Improve transparency & data quality. <br/>\n        </ul>\n      </li>\n      <li>Agile.\n        <ul>\n        Rapidly deploy deep capabilities. <br/>\n        Easily configure to meet unique or changing needs.<br/>\n        Great experience on any device.<br/>\n        </ul>\n      <li>Collaborative.\n        <ul>\n        Connect all internal and external stakeholders. <br/>\n        Deep, workflow-enabled collaboration.<br/>\n        </ul>\n      </li>\n    </ul>   \n  </div>\n	  <div id="contact" style="background-image:  url(\'assets/imgs/img1.jpeg\');margin-bottom: 20px;">\n	  	<h3>Contact us</h3>\n	  	<div class="info">Email: <span class="value">swiftifyinc@gmail.com</span>\n	  	</div>\n	  	<div class="info">Phone: <span class="value">+254 791620503</span>\n	  	</div>\n	  </div>\n\n    </div>\n     <div class="containery container3" style="background-image: url(\'assets/imgs/bg1.png\'); height: 100%;">\n    	<div id="cont">\n    		<div style="display: inline-block;">\n    			<img src="assets/icon/icon.png">\n    		<div id="wording">\n    			<ul style="list-style-type: kannada;">\n    			<li><h3>Building Web requisitions</h3></li>\n    			<li><h3>Online Bidding</h3><li><h3>Automated evaluation</h3></li>\n    			<li><h3>Reporting and Archival</h3>\n    			</li>\n				</ul>\n    		</div>\n    		<div id="button">\n    			<span *ngIf="this.plt && (this.plt.is(\'core\') || this.plt.is(\'mobileweb\'))">\n	    			<button ion-button  >\n	    				<img src="assets/imgs/ios.png">\n	    			</button>\n	    			<button ion-button >\n	    				<a href="{{provider.url}}/kits/Swiftify.apk" download> <img src="assets/imgs/android.png"></a>\n	    			</button>\n	    			<br/><br/>\n	    		</span>\n	    		<button *ngIf=" this.plt && !this.plt.is(\'core\') && !this.plt.is(\'mobileweb\')" ion-button class="reqsView" (click)="itemClicked(menuItems[1], 1, menuItems[1].hide, menuItems[1].show)">View Requests</button>\n    			<button (click)="terms()" ion-button class="reqsView reqsView1">Terms and Conditions</button>\n    		</div>\n    		</div>\n    	</div>\n    </div>\n				 <div class="colHeight containery container4">\n				     <div  *ngIf="requests.length == 0" class="warn">\n						    <span style="color:grey;font-size:30px;">Oops!!</span><br/>\n						     <span style="color:grey;font-size:13px;">There are no any\n						    requests at the moment</span>\n						</div>\n				</div>\n				</ion-list>\n			</ion-col>\n			<ion-col  style="display:none;background-image: url(\'assets/imgs/bg.jpg\');overflow: hidden;padding: 0px;overflow-y: auto; " class="container2 colHeight" col-12 col-md-9 col-lg-9 col-xl-9  offset-lg-1 offset-md-1>\n				<div style="height:100%;background-color: rgba(0,0,0,0.3)">\n					<div class="swiffty">\n						<button (click)="hideShow(\'container2\', \'container0\')" class="backArrow">\n							<ion-icon name="arrow-back"></ion-icon>\n						</button>\n						<div class="welcomeNote warn">\n							<div id="welcome">Welcome</div>\n							<button (click)="hideShow(\'welcomeNote\', \'loginDiv\')" [disabled] ="!terms" class="logBtn">Log in</button>\n								<ion-item no-lines id="termsAndConditions">\n							      <ion-label>Agree to our Terms of service</ion-label>\n							      <ion-checkbox [(ngModel)]="terms"></ion-checkbox>\n							   </ion-item>\n						</div>\n						<ion-list class="loginDiv warn" style="display:none;">\n							<ion-item no-lines class="loginText">Log in</ion-item>\n							<ion-item *ngFor="let button of inputs[0] let y = index" no-lines class="input">\n								<ion-label stacked style="color: white; font-size:15px;margin-left: 10%; font-family: sans-serif;"> {{button.title}}\n									<span class="errorMessage" *ngIf="y == 0 && errorEmail1">*{{errorEmail1}}</span>\n									<span class="errorMessage" *ngIf="y == 1 && errorPass">*{{errorPass}}</span>\n								</ion-label>\n								<ion-input type="{{button.type}}" (keyup)="inputKey1(y)"   [(ngModel)]=button.ngBind></ion-input>\n							</ion-item>\n\n							<div style="text-align: center;margin-top:15px;">\n								<div><button class="logBtn" style="width:200px;"\n									[disabled]="(inputs[0][0].ngBind.trim() == \'\' || inputs[0][1].ngBind.trim() == \'\')"\n									(click)="indexAction({module: \'logIn\', credentials: [inputs[0][0].ngBind, inputs[0][1].ngBind]})">{{submitButtons[1].title}}</button></div>\n								<button class="logBtn" (click)="hideShow(\'loginDiv\', \'verifDiv1\')" style="background-color: transparent;margin-top: 15px;">{{submitButtons[3].title}}</button>\n								<button class="logBtn" (click)="hideShow(\'loginDiv\', \'signUpDiv\')" style="background-color: transparent; font-size:17px;margin-top: 10px;">{{submitButtons[4].title}}</button>\n							</div>\n						</ion-list>\n						<ion-list class="signUpDiv warn" style="display:none">\n							<ion-item no-lines class="loginText">Sign up</ion-item>\n							<ion-item *ngFor="let button of inputs[1] let z = index" no-lines class="input">\n								<ion-label stacked style="color: white; font-size:15px;margin-left: 10%; font-family: sans-serif;"> {{button.title}} <span class="errorMessage" *ngIf="z == 2 && errorEmail">*{{errorEmail}}</span></ion-label>\n								<ion-input (keyup)="inputKey(z)" type="{{button.type}}"  [(ngModel)]=button.ngBind></ion-input>\n							</ion-item>\n							<div style="text-align: center;margin-top:15px;">\n								<button \n			                       [disabled]="(inputs[1][0].ngBind.trim() == \'\' ||inputs[1][1].ngBind.trim() == \'\' || inputs[1][2].ngBind.trim() == \'\'|| inputs[1][3].ngBind.trim() == \'\')"\n								class="logBtn" style="width:200px;" (click)="indexAction({module: \'signUP\', credentials: [inputs[1][0].ngBind, inputs[1][1].ngBind, inputs[1][2].ngBind, inputs[1][3].ngBind] })">{{submitButtons[2].title}}</button><br/>\n								<button class="logBtn" (click)="hideShow(\'signUpDiv\', \'loginDiv\')" style="background-color: transparent; font-size:17px;margin-top: 20px;">{{submitButtons[5].title}}</button>\n							</div>\n						</ion-list>\n						<ion-list class="verifDiv warn" style="display:none;">\n							<ion-item no-lines class="loginText">Verifying Account</ion-item>\n							<ion-item *ngFor="let button of inputs[2] let y = index" no-lines class="input">\n								<ion-label stacked style="color: white; font-size:15px;margin-left: 10%; font-family: sans-serif;"> {{button.title}}\n									<span class="errorMessage" *ngIf="verError">* Invalid verification code</span>\n								</ion-label>\n								<ion-input type="tel" (ionFocus)="inputKey2()"  maxlength="6" [(ngModel)]=button.ngBind></ion-input>\n							</ion-item>\n							<div style="text-align: center;margin-top:15px;">\n								<div><button class="logBtn" (click)="verify(inputs[2][0].ngBind)" style="width:200px;"\n									[disabled]="(inputs[2][0].ngBind.trim() == \'\')">{{submitButtons[7].title}}</button></div>\n								<button class="logBtn" (click)="hideShow(\'verifDiv\', \'loginDiv\')" style="background-color: transparent; font-size:17px;margin-top: 10px;">{{submitButtons[6].title}}</button>\n							</div>\n						</ion-list>\n						<ion-list class="verifDiv1 warn" style="display: none;">\n							<ion-item no-lines class="loginText">Password reset</ion-item>\n							<div class="part1">\n								<ion-item  no-lines class="input">\n									<ion-label stacked style="color: white; font-size:15px;margin-left: 10%; font-family: sans-serif;"> Enter your email\n										<span class="errorMessage" *ngIf="emailPassErr">* {{emailPassErr}}</span>\n									</ion-label>\n									<ion-input type="email" (focus)="hideError()" (keyup)="inputKey2()" [(ngModel)]="emailPass" ></ion-input>\n								</ion-item>\n								<div style="text-align: center;margin-top:15px;">\n										<button class="logBtn" (click)="verify2(emailPass)" style="width:200px;"\n										[disabled]="(!emailPass || emailPass.trim() == \'\')">Continue</button>\n							    </div>\n							</div>\n							<div class="part2">\n								<ion-item no-lines class="input">\n								<ion-label stacked style="color: white; font-size:15px; font-family: sans-serif;"> Enter verification code sent to your email\n									<span class="errorMessage" *ngIf="verError1">* Invalid verification code</span>\n									</ion-label>\n									<ion-input type="tel" (ionFocus)="inputKey2()"  maxlength="6" [(ngModel)]="verifCode"></ion-input>\n								</ion-item>\n								<div style="text-align: center;margin-top:15px;">\n									<button class="logBtn" (click)="verify1(verifCode)" style="width:200px;"\n										[disabled]="(!verifCode || verifCode.trim() == \'\')">Continue</button>\n								</div>\n							</div>\n							<div class="part3">\n								<ion-item no-lines class="input">\n								<ion-label stacked style="color: white; font-size:15px;margin-left: 10%; font-family: sans-serif;"> New password\n									</ion-label>\n									<ion-input type="password" (keyup)="inputKey2()"   [(ngModel)]="newPass"></ion-input>\n								</ion-item>\n								<ion-item no-lines class="input">\n								<ion-label stacked style="color: white; font-size:15px;margin-left: 10%; font-family: sans-serif;"> Confrim password\n									<span class="errorMessage verError1" >* Passwords do not match</span>\n									</ion-label>\n									<ion-input type="password" (keyup)="inputKey2()" (focus)="hideError()"  [(ngModel)]="confPass"></ion-input>\n								</ion-item>\n								<div style="text-align: center;margin-top:15px;">\n									<button class="logBtn" (click)="resetPass(newPass, confPass)" style="width:200px;"\n										[disabled]="(!newPass || newPass.trim() == \'\' || !confPass || confPass.trim() == \'\')">Reset password</button>\n								</div>\n							</div>\n							<div style="text-align: center;">\n								<button class="logBtn" (click)="hideShow(\'verifDiv1\', \'loginDiv\')" style="background-color: transparent; font-size:17px;margin-top: 10px;">{{submitButtons[6].title}}</button>\n							</div>\n						</ion-list>\n					</div>\n				</div>\n			</ion-col>\n			<ion-col class="container"></ion-col>\n			<ion-col class="container"></ion-col>\n		</ion-row>\n	</ion-grid>\n \n</ion-content>\n'/*ion-inline-end:"/Users/brianhenry/Desktop/siwfity/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["t" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_3__provider_provider__["a" /* ProviderPage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 275:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TermsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the TermsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var TermsPage = /** @class */ (function () {
    function TermsPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    TermsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad TermsPage');
    };
    TermsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-terms',template:/*ion-inline-start:"/Users/brianhenry/Desktop/siwfity/src/pages/terms/terms.html"*/'\n<ion-header>\n\n  <ion-navbar color="headerColor">\n    <ion-title>\n    	<div style="font-size: 16px; font-weight: bold">Terms and Conditions.</div>\n    </ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content style="background-color: white;">\n	<div style="padding: 5px">\n	    <i style="padding: 5px;"><b>Each Purchase Order placed by buyer for goods and/or services is subject to these standard purchase terms and the terms of the applicable Purchase Order, and is conditional upon Supplier’s agreement to such terms. Supplier shall be deemed to have agreed to be bound by such terms by accepting the Purchase Order, delivering the goods, and/or performing the services.</b></i>\n	</div>\n    <ol>\n	<li>\n		<strong>Definitions.</strong> In these Standard Purchase Terms, the following definitions apply:\n			<ol style="list-style-type: lower-alpha;">\n				<li>“Agreement” means the agreement between Supplier and Buyer for the purchase and sale of Goods and/or Services.</li>\n			    <li>“Buyer” means the purchasing/contracting company/organisation.</li>\n			    <li>“Deliverable” means any deliverable or other product or result from Services that is referred to in a Purchase Order, and any related materials, data, documentation, and includes any Intellectual Property Rights developed by Supplier pursuant to such Purchase Order.</li>\n			    <li>"Date” means the date of delivery for Goods or performance of Services as specified in a Purchase Order.</li>\n			    <li>“Delivery Point” means the location identified by Buyer in the Purchase Order to which the Supplier is to deliver Goods and/or perform the services, or such other delivery area or point which is specified in writing by Buyer.</li>\n			    <li>“Goods” means the goods that are required to be delivered by Supplier pursuant to a Purchase Order, and include all materials, component parts, packaging and labelling of such goods.</li>\n			    <li>“Intellectual Property Rights” means all intellectual and industrial property rights and rights of a similar nature including all rights in and to, patents including all issued patents and pending applications therefore and patents which may be issued therefrom (including divisions, reissues, re-examinations, continuations and continuations-in-part); trade-marks; copyrights; industrial design rights; rights pertaining to trade secrets and confidential information; publicity rights; personality rights; moral rights; and other intellectual property rights whether registered or not and all applications, registrations, renewals and extensions pertaining to the foregoing.</li>\n			    <li>“Purchase Order” means the purchase order between Buyer and Supplier for the purchase and sale of Goods and/or Services, to which these Standard Purchase Terms are attached or are incorporated by reference.</li>\n			    <li>“Services” means any services to be provided by Supplier to Buyer pursuant to a Purchase Order.</li>\n			    <li>“Specifications” means the requirements, attributes and specifications for the Goods or Services that are set out in the applicable Purchase Order. Specifications also include: (a) documentation published by Supplier relating to the Goods or Services; (b) operational and technical features and functionality of the Goods or Services; (c) standards or levels of service performance for Services; and (d) Buyer business requirements that are expressly set out in a Purchase Order.</li>\n			    <li>“Supplier” means the party indicated on the face page of the Purchase Order that is contracting with Buyer for the purchase and sale of Goods and/or Services.</li>\n			    <li>“Supplier Proposal” means any acknowledgement, estimate, quote, offer to sell, invoice, or proposal of Supplier relating to the supply of Goods and/or Services to Buyer, including any delivered in connection with a request for quotations, request for proposal or similar process initiated by Buyer.</li>\n			    <li>“Warranty Period” means in respect of any Goods or Services, the longer of: (i) the express written warranty period provided by Supplier for the Goods or Services; and (ii) the period commencing on the date of Acceptance of such Goods or Services and ending on the date that is one (1) year from that date.</li>	\n	</ol>\n	</li>\n	<li>\n				<strong>Agreement.</strong>The Agreement consists only of:\n				 (a) these Standard Purchase Terms;  (b) the applicable Purchase Order; and (c) any Specifications or other documents expressly referenced in the Purchase Order. Any reference in the Purchase Order to any Supplier Proposal is solely for the purpose of incorporating the descriptions and specifications of the Goods and/or Services contained in the Proposal, and only to the extent that the terms of the Supplier Proposal do not conflict with the descriptions and Specifications set out in the Purchase Order. Buyer’s acceptance of, or payment for, Goods and/or Services will not constitute Buyer’s acceptance of any additional or different terms in any Supplier Proposal, unless otherwise accepted in writing by Buyer. If there is any conflict or inconsistency between the documents constituting the Agreement, then unless otherwise expressly provided, the documents will rank in the order of precedence in accordance with the order in which they are listed in this Section 2.\n	</li>\n	<li>\n		<strong>Delivery of Goods and Services.</strong>\n		<ol style="list-style-type: lower-alpha;">\n				<li>Supplier agrees to supply and deliver the Goods to Buyer and to perform the Services, as applicable, on the terms set out in this Agreement.</li>\n	            <li>Supplier shall, at its own expense, pack, load, and deliver Goods to the Delivery Point and in accordance with the invoicing, delivery terms, shipping, packing, and other instructions printed on the face of the Purchase Order or otherwise provided to Supplier by Buyer in writing. No charges will be allowed for freight, transportation, insurance, shipping, storage, handling, demurrage, cartage, packaging or similar charges unless provided for in the applicable Purchase Order or otherwise agreed to in writing by Buyer.</li>\n				<li>Time is of the essence with respect to delivery of the Goods and performance of Services. Goods shall be delivered and Services performed by the applicable Delivery Date. Supplier must immediately notify Buyer if Supplier is likely to be unable to meet a Delivery Date. At any time prior to the Delivery Date, Buyer may, upon notice to Supplier, cancel or change a Purchase Order, or any portion thereof, for any reason, including, without limitation, for the convenience of Buyer or due to failure of Supplier to comply with this Agreement, unless otherwise noted.</li>\n				<li>Supplier shall follow all instructions of Buyer and cooperate with Buyer’s customs broker as directed by Buyer (including by providing requested shipping documentation) with respect to all Goods that originate from sources or suppliers based outside Canada. Supplier shall comply with all the requirements of the Canada Border Services Agency (or any successor organization) with respect to the importation of Goods from outside Canada.</li>\n		</ol>\n	</li>\n	<li>\n		<strong>Inspection; Acceptance and Rejection.</strong>\n          <ol style="list-style-type: lower-alpha;">\n          	<li>All shipments of Goods and performance of Services shall be subject to Buyer’s right of inspection. Buyer shall have ninety (90) days (the “Inspection Period“) following the delivery of the Goods at the Delivery Point or performance of the Services to undertake such inspection, and upon such inspection Buyer shall either accept the Goods or Services (“Acceptance“) or reject them. Buyer shall have the right to reject any Goods that are delivered in excess of the quantity ordered or are damaged or defective. In addition, Buyer shall have the right to reject any Goods or Services that are not in conformance with the Specifications or any term of this Agreement. Transfer of title to Buyer of Goods shall not constitute Buyer’s Acceptance of those Goods. Buyer shall provide Supplier within the Inspection Period notice of any Goods or Services that are rejected, together with the reasons for such rejection. If Buyer does not provide Supplier with any notice of rejection within the Inspection Period, then Buyer will be deemed to have provided Acceptance of such Goods or Services. Buyer’s inspection, testing, or Acceptance or use of the Goods or Services hereunder shall not limit or otherwise affect Supplier’s warranty obligations hereunder with respect to the Goods or Services, and such warranties shall survive inspection, test, Acceptance and use of the Goods or Services.</li>\n            <li>Buyer shall be entitled to return rejected Goods to Supplier at Supplier’s expense and risk of loss for, at Buyer’s option, either: (i) full credit or refund of all amounts paid by Buyer to Supplier for the rejected Goods; or (ii) replacement Goods to be received within the time period specified by Buyer. Title to rejected Goods that are returned to Supplier shall transfer to Supplier upon such delivery and such Goods shall not be replaced by Supplier except upon written instructions from Buyer. Supplier shall not deliver Goods that were previously rejected on grounds of non-compliance with this Agreement, unless delivery of such Goods is approved in advance by Buyer, and is accompanied by a written disclosure of Buyer’s prior rejection(s).</li>\n          </ol>\n	</li>\n	\n	<li>\n		<strong>Price/Payment Terms.</strong>\n		<ol style="list-style-type: lower-alpha;">\n				Prices for the Goods and/or Services will be set out in the applicable Order. Price increases or charges not expressly set out in the Purchase Order shall not be effective unless agreed to in advance in writing by Buyer. Supplier will issue all invoices on a timely basis. All invoices delivered by Supplier must meet Buyer’s requirements, and at a minimum shall reference the applicable Purchase Order. Buyer will pay the undisputed portion of properly rendered invoices within the promised time during contracting. Buyer shall have the right to withhold payment of any invoiced amounts that are disputed in good faith until the parties reach an agreement with respect to such disputed amounts and such withholding of disputed amounts shall not be deemed a breach of this Agreement nor shall any interest be charged on such amounts. Notwithstanding the foregoing, Buyer agrees to pay the balance of the undisputed amounts on any invoice that is the subject of any dispute within the time periods specified herein.\n		</ol>\n	</li>\n	<li>\n		<strong>Taxes.</strong>\n		       Unless otherwise stated in a Purchase Order, all prices or other payments stated in the Purchase Order are exclusive of any taxes. Supplier shall separately itemize all applicable taxes each on each invoice and indicate on each invoice its applicable tax registration number(s). Buyer will pay all applicable taxes to Supplier when the applicable invoice is due. Supplier will remit all applicable taxes to the applicable government authority as required by applicable laws. Notwithstanding any other provision of this Agreement, Buyer may withhold from all amounts payable to Supplier all applicable withholding taxes and to remit those taxes to the applicable governmental authorities as required by applicable laws.\n	</li>\n	<li>\n		<strong>Hazardous Materials.</strong>\n			  Supplier agrees to provide, upon and as requested by Buyer, to satisfy any applicable laws governing the use of any hazardous substances either of the following: (a) all reasonably necessary documentation to verify the material composition, on a substance by substance basis, including quantity used of each substance, of any Goods, and/or of any process used to make, assemble, use, maintain or repair any Goods; or (b) all reasonably necessary documentation to verify that any Goods and/or any process used to make, assemble, use, maintain or repair any Goods, do not contain, and the Services do not require the use of, any particular hazardous substances specified by Buyer.\n	</li>\n	<li>\n		<strong>Legal Compliance; Workplace Safety.</strong>\n		      In carrying out its obligations under the Agreement, including the performance of Services, Supplier shall at all times comply with all applicable regulations, standards, and codes. Supplier shall be at all times and shall maintain its workers’ compensation accounts in good standing, and provide Buyer with evidence of good standing upon request. Supplier shall obtain all applicable permits, licences, exemptions, consents and approvals required for the Supplier to manufacture and deliver the Goods and perform the Services.\n		\n	</li>\n	<li>\n		<ol style="list-style-type: lower-alpha;">\n			<li><strong>Product Warranties.</strong>Supplier warrants to Buyer that during the Goods Warranty Period all Goods provided hereunder shall be: (i) of merchantable quality; (ii) fit for the purposes intended; (iii) unless otherwise agreed to by Buyer, new; (iv) free from defects in design, material and workmanship; (v) in strict compliance with the Specifications; (vi) free from any liens or encumbrances on title whatsoever; (vii) in conformance with any samples provided to Buyer; and (viii) compliant with all applicable federal, provincial, and municipal laws, regulations, standards, and codes.</li>\n			<li><strong>Service Warranties.</strong> Supplier shall perform all Services: (i) exercising that degree of professionalism, skill, diligence, care, prudence, judgment, and integrity which would reasonably be expected from a skilled and experienced service provided providing services under the same or similar circumstances as the Services under this Agreement; (ii) in accordance with all Specifications and all Buyer policies, guidelines, by-laws and codes of conduct applicable to Supplier; and (iii) using only personnel with the skills, training, expertise, and qualifications necessary to carry out the Services. Buyer may object to any of the Supplier’s personnel engaged in the performance of Services who, in the reasonable opinion of Buyer, are lacking in appropriate skills or qualifications, engage in misconduct, constitute a safety risk or hazard or are incompetent or negligent, and the Supplier shall promptly remove such personnel from the performance of any Services upon receipt of such notice, and shall not re-employ the removed person in connection with the Services without the prior written consent of Buyer.</li>\n			<li><strong>Intellectual Property Warranty.</strong>Supplier further warrants to Buyer that at all times all Goods and or Services (including any Deliverables) will not be in violation of or infringe any Intellectual Property Rights of any person.</li>\n			<li><strong>Manufacturer Warranties.</strong>Supplier shall assign to Buyer all manufacturer’s warranties for Goods not manufactured by or for Supplier, and shall take all necessary steps as required by such third party manufacturers to effect assignment of such warranties to Buyer.</li>\n		</ol>\n	</li>\n	<li>\n		<strong>Warranty Remedies</strong>\n		<ol style="list-style-type: lower-alpha;">\n			<li>In the event of breach of any of the warranties in Section a or 9.b, and without prejudice to any other right or remedy available to Buyer (including Buyer’s indemnification rights hereunder), Supplier will, at Buyer’s option and Supplier’s expense, refund the purchase price for, or correct or replace the affected Goods, or re-perform the affected Services, within 10 day(s) after notice by Buyer to Supplier of warranty breach. All associated costs, including costs of re-performance, costs to inspect the Goods and/or Services, transport the Goods from Buyer to Supplier, and return shipment to Buyer, and costs resulting from supply chain interruptions, will be borne by Supplier. If Goods are corrected or replaced or Services are re-performed, the warranties in Section 9.a will continue as to the corrected or replaced Goods for a further Goods Warranty Period commencing on the date of Acceptance of the corrected or replaced Goods by Buyer. If Supplier fails to repair or replace the Product within the time periods required above, Buyer may repair or replace the Goods at Supplier’s expense.</li>\n			<li>In the event that any Goods provided by Supplier to Buyer are subject to a claim or allegation of infringement of Intellectual Property Rights of a third party, Supplier shall, at its own option and expense, without prejudice to any other right or remedy of Buyer (including Buyer’s indemnification rights hereunder), promptly provide Buyer with a commercially reasonable alternative, including the procurement for Buyer of the right to continue using the Goods in question, the replacement of such Goods with a non-infringing alternative satisfactory to Buyer, or the modification of such Goods (without affecting functionality) to render them non-infringing.</li>\n		</ol>\n	</li>\n	<li>\n		<strong>Intellectual Property Rights</strong>\n		All Intellectual Property Rights in and to each Deliverable shall vest in Buyer free and clear of all liens and encumbrances on receipt of payment by Supplier for each Deliverable. To the extent that any Deliverables contain any intellectual property of Supplier, Supplier hereby grants to Buyer a worldwide, royalty-free, non-exclusive, perpetual license to use, copy, modify and distribute such intellectual property as part of the Deliverables. Supplier agrees to provide to Buyer all assistance reasonably requested by Buyer to perfect the rights described herein, including obtaining all assignments and waivers of moral rights necessary or appropriate to vest the entire right, title and interest in such materials in Buyer and its successors and assigns.\n	</li>\n	<li>\n		<strong>Confidentiality.</strong>\n		Supplier shall safeguard and keep confidential any and all information relating to Buyer obtained by it or provided to it by Buyer in connection with this Agreement, and shall use such information only for the purposes of carrying out its obligations under this Agreement.\n	</li>\n	<li>\n		<strong>Insurance.</strong>\n		Supplier represents and warrants to Buyer that it has in place with reputable insurers such insurance policies in coverage amounts that would be maintained by a prudent supplier of goods and services similar to the Goods and Services provided hereunder, including, as applicable, professional errors and omissions liability insurance and comprehensive commercial general liability insurance (including product liability coverage, all-risk contractors’ equipment insurance, and automobile liability insurance). In addition, Supplier will take out and maintain, at its own cost, such insurance policies and coverages as may be reasonably required by Buyer from time to time. Supplier will promptly deliver to Buyer, as and when requested, written proof of such insurance. If requested, Buyer will be named as an additional insured under any such policies. If requested by Buyer, such insurance will provide that it cannot be cancelled, or materially changed so as to affect the coverage provided under this Agreement, without the insurer providing at least 30 days prior written notice to Buyer.\n	</li>\n	<li>\n		<strong>Indemnities.</strong>\n		Supplier shall indemnify, defend and hold harmless Buyer, its Affiliates, and their respective officers, directors, employees, consultants, and agents (the “Buyer Indemnified Parties“) from and against any claims, fines, losses, actions, damages, expenses, legal fees and all other liabilities brought against or incurred by the Buyer Indemnified Parties or any of them arising out of: (a) death, bodily injury, or loss or damage to real or tangible personal property resulting from the use of or any actual or alleged defect in the Goods or Services, or from the failure of the Goods or Services to comply with the warranties hereunder; (b) any claim that the Goods or Services infringe or violate the Intellectual Property Rights or other rights of any person; (c) any intentional, wrongful or negligent act or omission of Supplier or any of its Affiliates or subcontractors; (d) Supplier’s breach of any of its obligations under this Agreement; or (e) any liens or encumbrances relating to any Goods or Services.\n	</li>\n	<li>\n		<strong>Limitation of Liability.</strong>\n		EXCEPT FOR SUPPLIER’S OBLIGATIONS UNDER SECTION 14, AND EXCEPT FOR DAMAGES THAT ARE THE RESULT OF THE GROSS NEGLIGENCE OR WILFUL MISCONDUCT OF A PARTY, IN NO EVENT WILL EITHER PARTY BE LIABLE TO THE OTHER PARTY OR ANY OTHER PERSON FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING ANY LOST PROFITS, DATA, GOODWILL, OR BUSINESS OPPORTUNITY FOR ANY MATTER RELATING TO THIS AGREEMENT.\n	</li>\n	<li>\n		<strong>Independent Contractors.</strong>\n		Supplier will perform its obligations under the Agreement as an independent contractor and in no way will Supplier or its employees be considered employees, agents, partners, fiduciaries, or joint venturers of Buyer. Supplier and its employees will have no authority to represent Buyer or its Affiliates or bind Buyer or its Affiliates in any way, and neither Supplier nor its employees will hold themselves out as having authority to act for Buyer or its Affiliates.\n	</li>\n	<li>\n		<strong>Further Assurances.</strong>\n		The parties shall sign such further and other documents, cause such meetings to be held, resolutions passed and do and perform and cause to be done and performed such further and other acts and things as may be necessary or desirable in order to give full effect to this Agreement and every part thereof.\n	</li>\n	<li>\n		<strong>Severability.</strong>\n		If any provision of this Agreement is determined to be unenforceable or invalid for any reason whatsoever, in whole or in part, such invalidity or unenforceability shall attach only to such provision or part thereof and the remaining part thereof and all other provisions shall continue in full force and effect.\n	</li>\n	<li>\n		<strong>Waiver.</strong>\n		No waiver of any provision of this Agreement shall be enforceable against that party unless it is in writing and signed by that party.\n	</li>\n	<li>\n		<strong>Assignment.</strong>\n		Supplier may not assign or subcontract this Agreement, in whole or in part, without Buyer’s prior written consent. Supplier’s permitted assignment or subcontracting of this Agreement or any part thereof will not release Supplier of its obligations under this Agreement, and it will remain jointly and severally liable with the assignee or subcontractor for any obligations assigned or subcontracted. The acts of omissions of any subcontractors of Supplier will be deemed to be the acts and omissions of the Supplier. Buyer may assign this Agreement, in whole or in part, to any Affiliate of Buyer, without the consent of Supplier. This Agreement shall enure to the benefit of and be binding upon the parties and their respective legal personal representatives, heirs, executors, administrators, assigns or successors.\n	</li>\n	<li>\n		<strong>Cumulative Remedies.</strong>\n		Subject to Section 15, the rights and remedies of the Buyer in this Agreement are cumulative and in addition to any other rights and remedies at law or in equity.\n	</li>\n	<li>\n		<strong>Survival.</strong>\n		Any provision of this Agreement which expressly or by implication from its nature is intended to survive the termination or completion of the Agreement will continue in full force and effect after any termination, expiry or completion of this Agreement.\n	</li>\n	<li><strong>Interpretation.</strong>\n		The headings used in this Agreement and its division into articles, sections, schedules, exhibits, appendices, and other subdivisions do not affect its interpretation. Unless the context requires otherwise, words importing the singular number include the plural and vice versa; words importing gender include all genders. References in this Agreement to articles, sections, schedules, exhibits, appendices, and other subdivisions are to those parts of this Agreement. Where this Agreement uses the word “including,” it means “including without limitation,” and where it uses the word “includes,” it means “includes without limitation.\n	</li>\n	<li>\n		<strong>Governing Law.</strong>\n		The United Nations Convention on Contracts for the International Sale of Goods shall not apply to this Agreement. This Agreement shall be governed by the laws of the Republic of Kenya and the Public Procurement law applicable therein.\n	</li>\n</ol>\n\n</ion-content>\n'/*ion-inline-end:"/Users/brianhenry/Desktop/siwfity/src/pages/terms/terms.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */]])
    ], TermsPage);
    return TermsPage;
}());

//# sourceMappingURL=terms.js.map

/***/ }),

/***/ 276:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TermPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the TermPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var TermPage = /** @class */ (function () {
    function TermPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    TermPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad TermPage');
    };
    TermPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-term',template:/*ion-inline-start:"/Users/brianhenry/Desktop/siwfity/src/pages/term/term.html"*/'\n<ion-header>\n\n  <ion-navbar color="headerColor">\n    <ion-title>Terms and conditions</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding style="background-color: white">\n<h2>Welcome to Swiftify Inc</h2>\n	<p>These terms and conditions outline the rules and regulations for the use of Swiftify Inc\'s Website.</p> <br /> \n	<span style="text-transform: capitalize;"> Swiftify Inc</span> is located at:<br /> \n	<address>27 Thika, Thika<br />Kiambu County - 010100, Kenya<br />\n	</address>\n	<p>By accessing this website we assume you accept these terms and conditions in full. Do not continue to use Swiftify Inc\'s website \n	if you do not accept all of the terms and conditions stated on this page.</p>\n	<p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice\n	and any or all Agreements: “Client”, “You” and “Your” refers to you, the person accessing this website\n	and accepting the Company’s terms and conditions. “The Company”, “Ourselves”, “We”, “Our” and “Us”, refers\n	to our Company. “Party”, “Parties”, or “Us”, refers to both the Client and ourselves, or either the Client\n	or ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake\n	the process of our assistance to the Client in the most appropriate manner, whether by formal meetings\n	of a fixed duration, or any other means, for the express purpose of meeting the Client’s needs in respect\n	of provision of the Company’s stated services/products, in accordance with and subject to, prevailing law\n	of Kenya. Any use of the above terminology or other words in the singular, plural,\n	capitalisation and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p><h2>Cookies</h2>\n	<p>We employ the use of cookies. By using Swiftify Inc\'s website you consent to the use of cookies \n	in accordance with Swiftify Inc’s privacy policy.</p><p>Most of the modern day interactive web sites\n	use cookies to enable us to retrieve user details for each visit. Cookies are used in some areas of our site\n	to enable the functionality of this area and ease of use for those people visiting. Some of our \n	affiliate / advertising partners may also use cookies.</p><h2>License</h2>\n	<p>Unless otherwise stated, Swiftify Inc and/or it’s licensors own the intellectual property rights for\n	all material on Swiftify Inc. All intellectual property rights are reserved. You may view and/or print\n	pages from http://www.swiftify.com for your own personal use subject to restrictions set in these terms and conditions.</p>\n	<p>You must not:</p>\n	<ol>\n		<li>Republish material from http://www.swiftify.com</li>\n		<li>Sell, rent or sub-license material from http://www.swiftify.com</li>\n		<li>Reproduce, duplicate or copy material from http://www.swiftify.com</li>\n	</ol>\n	<p>Redistribute content from Swiftify Inc (unless content is specifically made for redistribution).</p>\n<h2>Hyperlinking to our Content</h2>\n	<ol>\n		<li>The following organizations may link to our Web site without prior written approval:\n			<ol>\n			<li>Government agencies;</li>\n			<li>Search engines;</li>\n			<li>News organizations;</li>\n			<li>Online directory distributors when they list us in the directory may link to our Web site in the same\n				manner as they hyperlink to the Web sites of other listed businesses; and</li>\n			<li>Systemwide Accredited Businesses except soliciting non-profit organizations, charity shopping malls,\n				and charity fundraising groups which may not hyperlink to our Web site.</li>\n			</ol>\n		</li>\n	</ol>\n	<ol start="2">\n		<li>These organizations may link to our home page, to publications or to other Web site information so long\n			as the link: (a) is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or\n			approval of the linking party and its products or services; and (c) fits within the context of the linking\n			party\'s site.\n		</li>\n		<li>We may consider and approve in our sole discretion other link requests from the following types of organizations:\n			<ol>\n				<li>commonly-known consumer and/or business information sources such as Chambers of Commerce, American\n					Automobile Association, AARP and Consumers Union;</li>\n				<li>dot.com community sites;</li>\n				<li>associations or other groups representing charities, including charity giving sites,</li>\n				<li>online directory distributors;</li>\n				<li>internet portals;</li>\n				<li>accounting, law and consulting firms whose primary clients are businesses; and</li>\n				<li>educational institutions and trade associations.</li>\n			</ol>\n		</li>\n	</ol>\n	<p>We will approve link requests from these organizations if we determine that: (a) the link would not reflect\n	unfavorably on us or our accredited businesses (for example, trade associations or other organizations\n	representing inherently suspect types of business, such as work-at-home opportunities, shall not be allowed\n	to link); (b)the organization does not have an unsatisfactory record with us; (c) the benefit to us from\n	the visibility associated with the hyperlink outweighs the absence of <?=$companyName?>; and (d) where the\n	link is in the context of general resource information or is otherwise consistent with editorial content\n	in a newsletter or similar product furthering the mission of the organization.</p>\n\n	<p>These organizations may link to our home page, to publications or to other Web site information so long as\n	the link: (a) is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or approval\n	of the linking party and it products or services; and (c) fits within the context of the linking party\'s\n	site.</p>\n\n	<p>If you are among the organizations listed in paragraph 2 above and are interested in linking to our website,\n	you must notify us by sending an e-mail to <a href="mailto:swiftifyinc@gmail.com" title="send an email to swiftifyinc@gmail.com">swiftifyinc@gmail.com</a>.\n	Please include your name, your organization name, contact information (such as a phone number and/or e-mail\n	address) as well as the URL of your site, a list of any URLs from which you intend to link to our Web site,\n	and a list of the URL(s) on our site to which you would like to link. Allow 2-3 weeks for a response.</p>\n\n	<p>Approved organizations may hyperlink to our Web site as follows:</p>\n\n	<ol>\n		<li>By use of our corporate name; or</li>\n		<li>By use of the uniform resource locator (Web address) being linked to; or</li>\n		<li>By use of any other description of our Web site or material being linked to that makes sense within the\n			context and format of content on the linking party\'s site.</li>\n	</ol>\n	<p>No use of Swiftify Inc’s logo or other artwork will be allowed for linking absent a trademark license\n	agreement.</p>\n<h2>Iframes</h2>\n	<p>Without prior approval and express written permission, you may not create frames around our Web pages or\n	use other techniques that alter in any way the visual presentation or appearance of our Web site.</p>\n<h2>Reservation of Rights</h2>\n	<p>We reserve the right at any time and in its sole discretion to request that you remove all links or any particular\n	link to our Web site. You agree to immediately remove all links to our Web site upon such request. We also\n	reserve the right to amend these terms and conditions and its linking policy at any time. By continuing\n	to link to our Web site, you agree to be bound to and abide by these linking terms and conditions.</p>\n<h2>Removal of links from our website</h2>\n	<p>If you find any link on our Web site or any linked web site objectionable for any reason, you may contact\n	us about this. We will consider requests to remove links but will have no obligation to do so or to respond\n	directly to you.</p>\n	<p>Whilst we endeavour to ensure that the information on this website is correct, we do not warrant its completeness\n	or accuracy; nor do we commit to ensuring that the website remains available or that the material on the\n	website is kept up to date.</p>\n<h2>Content Liability</h2>\n	<p>We shall have no responsibility or liability for any content appearing on your Web site. You agree to indemnify\n	and defend us against all claims arising out of or based upon your Website. No link(s) may appear on any\n	page on your Web site or within any context containing content or materials that may be interpreted as\n	libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or\n	other violation of, any third party rights.</p>\n<h2>Disclaimer</h2>\n	<p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill). Nothing in this disclaimer will:</p>\n	<ol>\n	<li>limit or exclude our or your liability for death or personal injury resulting from negligence;</li>\n	<li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>\n	<li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>\n	<li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>\n	</ol>\n	<p>The limitations and exclusions of liability set out in this Section and elsewhere in this disclaimer: (a)\n	are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer or\n	in relation to the subject matter of this disclaimer, including liabilities arising in contract, in tort\n	(including negligence) and for breach of statutory duty.</p>\n	<p>To the extent that the website and the information and services on the website are provided free of charge,\n	we will not be liable for any loss or damage of any nature.</p>\n<h2></h2>\n	<p></p>\n<h2>Credit & Contact Information</h2>\n	<p>This Terms and conditions page was created at <a style="color:inherit;text-decoration:none;cursor:text;"\n		href="https://termsandconditionstemplate.com">termsandconditionstemplate.com</a> generator. If you have\n	any queries regarding any of our terms, please contact us.</p>		\n</ion-content>\n'/*ion-inline-end:"/Users/brianhenry/Desktop/siwfity/src/pages/term/term.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */]])
    ], TermPage);
    return TermPage;
}());

//# sourceMappingURL=term.js.map

/***/ }),

/***/ 277:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__provider_provider__ = __webpack_require__(29);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AdminPage = /** @class */ (function () {
    function AdminPage(navCtrl, provider, navParams) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.provider = provider;
        this.navParams = navParams;
        this.users = [];
        this.transctions = [];
        this.doccs = ['All documents', "KRA certificate", "Certificate of Registration"];
        this.current_table = 'approval';
        this.load();
        this.provider.makeInfo();
        //events
        this.provider.events.subscribe('suppliers', function (data) {
            switch (data.submodule) {
                case "message":
                    if (data.status) {
                        _this.provider.toast('User supplier status has been changed', 'middle');
                        if (data.status == 'null')
                            _this.users.splice(_this.users.findIndex(function (q) { return q.businessName == data.user; }), 1);
                        else
                            _this.users[_this.users.findIndex(function (q) { return q.businessName == data.user; })].supplier.status == data.status;
                    }
                    else {
                        _this.provider.toast('Message sent', 'middle');
                        _this.message = '';
                        _this.rejected = undefined;
                    }
                    break;
                default:
                    _this.users = data.users;
                    console.log(data);
                    _this.transctions = data.transactions;
                    break;
            }
        });
    }
    AdminPage.prototype.hideShow = function (status, user) {
        this.notApprove = status;
        this.currentUser = user;
        __WEBPACK_IMPORTED_MODULE_2_jquery__('#tables').hide();
        __WEBPACK_IMPORTED_MODULE_2_jquery__('#messageArea').show();
    };
    AdminPage.prototype.show = function () {
        __WEBPACK_IMPORTED_MODULE_2_jquery__('#messageArea').hide();
        __WEBPACK_IMPORTED_MODULE_2_jquery__('#tables').show();
        this.notApprove = '';
        this.currentUser = '';
    };
    AdminPage.prototype.changeTable = function (data) {
        __WEBPACK_IMPORTED_MODULE_2_jquery__('.btn').removeClass('active');
        __WEBPACK_IMPORTED_MODULE_2_jquery__('#' + data + '').addClass('active');
        this.current_table = data;
    };
    AdminPage.prototype.load = function () {
        this.provider.socketRequest({
            module: 'fetchSuppliers'
        });
    };
    AdminPage.prototype.sendMessage = function (mess) {
        this.changeStatus(this.notApprove, this.currentUser, mess);
        __WEBPACK_IMPORTED_MODULE_2_jquery__('#messageArea').hide();
        __WEBPACK_IMPORTED_MODULE_2_jquery__('#tables').show();
        this.notApprove = '';
        this.currentUser = '';
    };
    AdminPage.prototype.changeStatus = function (status, user, reason) {
        var acc = this.provider.acc;
        this.provider.socketRequest({
            module: 'sendAction',
            status: status,
            user: user,
            reason: reason,
            rejected: this.rejected,
            from: {
                name: acc.businessName,
                email: acc.email,
                pic: acc.pic
            },
            serial: Date.now()
        });
    };
    AdminPage.prototype.ionViewDidLeave = function () {
        if (this.navCtrl.getActive().name == 'AdminPage') {
            this.provider.events.unsubscribe('suppliers');
        }
    };
    AdminPage.prototype.calTime = function (data, invoicedate) {
        var hours;
        if (data == 'Pay within 2 months') {
            hours = 168 * 8;
            return this.calculateDate(hours, invoicedate);
        }
        else if (data == 'Pay within 1 week') {
            hours = 168;
            return this.calculateDate(hours, invoicedate);
        }
        else {
            return 'On delivery.';
        }
    };
    AdminPage.prototype.calculateDate = function (hours, invoicedate) {
        if (hours) {
            var secs = invoicedate + hours * 3600 * 1000;
            var date = this.provider.changeDate(secs);
            return date.substr(0, 15);
        }
    };
    AdminPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-admin',template:/*ion-inline-start:"/Users/brianhenry/Desktop/siwfity/src/pages/admin/admin.html"*/'\n<ion-header>\n\n  <ion-navbar color="headerColor">\n    <div style="padding-left: 20px"><span style="color: white; font-size: 18px;">Swiftify</span></div>\n    <div>\n    	<button col-5 ion-button id="approval" (click)="changeTable(\'approval\')" class="btn active">Documents approval</button>\n    	<button col-5 ion-button  id="transactions" (click)="changeTable(\'transactions\')" class="btn">Transactions</button>\n    </div>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content style="background-color: white">\n	<ion-col col-12 style="text-align: center;">\n		<div class="scrollmenu"   style="margin-top:30px; ">\n		<div id="tables">\n		<table offset-1 *ngIf="current_table == \'transactions\'">\n			<thead>\n				<td>No.</td>\n				<td>Buyer</td>\n				<td>Supplier</td>\n				<td>Invoice date</td>\n				<td>Payment due</td>\n				<td>Action</td>\n			</thead>\n			<tr *ngFor="let tra of transctions let x = index">\n				<td>{{x + 1}}</td>\n				<td>{{tra.from.name}}</td>\n				<td>{{tra.info.vendorName}}</td>\n				<td>{{provider.changeDate(tra.info.dateInvoiced)}}</td>\n				<td>{{calTime(tra.info.top, tra.info.dateInvoiced)}}</td>\n				<td>\n					<tr>\n						<button (click)="hideShow(null, tra.from.name)" class="actionBtn" style="color: white;background-color: #319ac4">Message buyer</button>\n					</tr>\n					<tr>\n						<button (click)="hideShow(null, tra.info.vendorName)" class="actionBtn" style="color: white;background-color: #319ac4">Message supplier</button>\n					</tr>\n				</td>\n			</tr>\n		</table>\n		<table offset-1 *ngIf="current_table == \'approval\'">\n			<thead>\n				<td>No.</td>\n				<td>Business name</td>\n				<td>Certificate of registration</td>\n				<td>KRA Certificate</td>\n				<td>Status</td>\n				<td>Action</td>\n			</thead>\n			<tr *ngFor="let user of users let q = index">\n				<td>{{q + 1}}</td>\n				<td>{{user.businessName}}</td>\n				<td>\n					<span *ngFor="let doc of user.supplier.docs">\n					  <img imageViewer class="docImage" *ngIf="doc.name == \'Certificate of Registration\' " src="{{provider.url+\'/\'+doc.url}}"/>\n					</span>\n			    </td>\n				<td>\n					<span *ngFor="let doc of user.supplier.docs">\n					  <img imageViewer class="docImage" *ngIf="doc.name == \'KRA certificate\' " src="{{provider.url+\'/\'+doc.url}}"/>\n					</span>\n				</td>\n				<td>{{user.supplier.status}}</td>\n				<td> \n					<tr><button (click)="changeStatus(\'approved\', user.businessName, \'Your supplier application request has been approved\')" class="actionBtn" style="color: white;background-color: green">Approve</button></tr>\n					<tr><button (click)="changeStatus(\'suspended\', user.businessName, \'We are sorry to inform you that your account has been suspended.\')"  class="actionBtn" style="color: white;background-color: #b90505">Suspend</button></tr>\n					<tr><button (click)="hideShow(\'not approved\', user.businessName)" class="actionBtn" style="color: white;background-color: #319ac4">Send message</button></tr>\n				</td>\n			</tr>\n		</table>\n		</div>\n		<div style="display: none" id="messageArea">\n			<div style="display: inline-block;" id="messDiv">\n				<div style="padding-left: 10px;text-align: left;font-size: 16px">\n					Sending message to <strong>{{currentUser}}</strong>\n				</div><br/>\n				<textarea placeholder="Type your message here" [(ngModel)]="message">\n				</textarea>\n				<br/><br/>\n				<div style="font-size:18px;" *ngIf="current_table == \'approval\'">\n					Which document need to be re-uploaded?\n				 <ion-list radio-group [(ngModel)]="rejected" style="text-align: center;">\n                   <ion-item *ngFor="let doc of doccs" no-lines class="ionItem" style="width:50%;">\n                      <ion-label style="color:darkmagenta;font-size: 20px;font-weight: bold;">{{doc}}</ion-label>\n                      <ion-radio value="{{doc}}" checked></ion-radio>\n                    </ion-item>\n                  </ion-list>\n				</div>\n				<div>\n				<button style="background-color: darkmagenta" (click)="sendMessage(message)" [disabled]="(!rejected && current_table == \'approval\') || !message || message.trim() ==\'\'">\n					Send\n				</button>\n				<button style="background-color: grey" (click)="show()" >\n					Cancel\n				</button>\n			  </div>\n		  </div>\n		</div>\n	</div>\n	</ion-col>\n\n</ion-content>\n'/*ion-inline-end:"/Users/brianhenry/Desktop/siwfity/src/pages/admin/admin.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__provider_provider__["a" /* ProviderPage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */]])
    ], AdminPage);
    return AdminPage;
}());

//# sourceMappingURL=admin.js.map

/***/ }),

/***/ 278:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__request_request__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__provider_provider__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__offer_offer__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__docs_docs__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__client_docs_client_docs__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__notify_notify__ = __webpack_require__(280);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var ListPage = /** @class */ (function () {
    function ListPage(provider, navCtrl, navParams) {
        var _this = this;
        this.provider = provider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.docs = [];
        this.acc = this.navParams.get('acc');
        this.docx = this.navParams.get('doc');
        __WEBPACK_IMPORTED_MODULE_2_jquery__(document).ready(function () {
            var height = __WEBPACK_IMPORTED_MODULE_2_jquery__('.colHeight').css('height');
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.colHeight').css('lineHeight', height);
        });
        this.provider.events.subscribe('request', function (data) {
            switch (data.submodule) {
                case 'addRequest':
                    _this.type = data.type;
                    data.request.date = _this.provider.changeDate(data.request.dateCreated);
                    _this.docs.unshift(data.request);
                    break;
                case 'showDocs':
                    _this.type = data.type;
                    _this.docs = data.docs;
                    for (var r = 0; r < _this.docs.length; r++) {
                        _this.docs[r].date = _this.provider.changeDate(_this.docs[r].dateCreated);
                    }
                    break;
                case 'fetchDocument':
                    var ind = _this.docs.findIndex(function (q) { return q.serial == data.doc.serial; });
                    if (ind > -1) {
                        _this.docs[ind].read = true;
                    }
                    switch (data.type) {
                        case "LPOs":
                            _this.goToLPO(data.doc);
                            break;
                        case "Invoices":
                            _this.goToInvoice(data.doc);
                            break;
                        case "Notes":
                            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__notify_notify__["a" /* NotifyPage */], { data: data.doc });
                            break;
                        default:
                            _this.goToRequest(data.doc, data.type);
                            break;
                    }
            }
        });
    }
    ListPage.prototype.goToInvoice = function (doc) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__client_docs_client_docs__["a" /* ClientDocsPage */], { data: ['invoice', 'fetchInvoice', this.acc, doc] });
    };
    ListPage.prototype.goToRequest = function (req, type) {
        switch (type) {
            case "Receipts":
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__client_docs_client_docs__["a" /* ClientDocsPage */], { data: ['receipt', 'receipt', this.acc, req] });
                break;
            case 'DeliveryNotes':
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__client_docs_client_docs__["a" /* ClientDocsPage */], { data: ['deliveryNote', 'deliveryNote', this.acc, req] });
                break;
            case 'InspectionCertificates':
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__client_docs_client_docs__["a" /* ClientDocsPage */], { data: ['InspectionNote', 'InspectionNote', req, this.acc] });
                break;
            default:
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__offer_offer__["a" /* OfferPage */], { data: [req, this.acc] });
                break;
        }
    };
    ListPage.prototype.toggleSearch = function (btn) {
        switch (btn) {
            case "searchIcon":
                __WEBPACK_IMPORTED_MODULE_2_jquery__('#searchPosition').toggle();
                break;
            case "backArrow":
                __WEBPACK_IMPORTED_MODULE_2_jquery__('#searchPosition').hide();
                __WEBPACK_IMPORTED_MODULE_2_jquery__('.docs').show();
                this.searchVal = '';
                break;
            case "close":
                this.searchVal = '';
                __WEBPACK_IMPORTED_MODULE_2_jquery__('.docs').show();
                break;
        }
    };
    ListPage.prototype.search = function (val) {
        var index;
        if (val && val.trim() !== '') {
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.docs').hide();
            var thisx_1 = this;
            this.docs.map(function (x) {
                if (thisx_1.docx == 'Receipts' && thisx_1.provider.acc.businessName !== x.to.name)
                    index = x.to.name.toLowerCase().indexOf(val.toLowerCase());
                else if (thisx_1.docx == 'DeliveryNotes' || thisx_1.docx == 'InspectionCertificates')
                    index = x.from.businessName.toLowerCase().indexOf(val.toLowerCase());
                else if (thisx_1.docx == 'Offers')
                    index = x.businessName.toLowerCase().indexOf(val.toLowerCase());
                else if (thisx_1.docx == 'Quotations')
                    index = x.title.toLowerCase().indexOf(val.toLowerCase());
                else
                    index = x.from.name.toLowerCase().indexOf(val.toLowerCase());
                if (index > -1) {
                    __WEBPACK_IMPORTED_MODULE_2_jquery__('#' + x.dateCreated + '').show();
                }
            });
        }
        else {
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.docs').show();
        }
    };
    ListPage.prototype.goTo = function (doc, index) {
        var serial = doc.serial;
        this.docs[index].read = true;
        this.provider.socketRequest({
            module: 'fetchDocument',
            item: doc.doc,
            serial: serial,
            date: doc.dateCreated,
            businessName: this.acc.businessName,
            toId: doc.from.name
        });
    };
    ListPage.prototype.goToLPO = function (doc) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__docs_docs__["a" /* DocsPage */], { data: ['lpo', 'checkInfo', this.acc, doc] });
    };
    ListPage.prototype.ionViewDidLeave = function () {
        if (this.navCtrl.getActive().name == 'ListPage') {
            this.provider.events.unsubscribe('request');
        }
    };
    ListPage.prototype.ionViewDidLoad = function () {
        this.provider.socketRequest({
            module: 'fetchDocs',
            type: this.docx,
            email: this.acc.email,
            id: this.acc.businessName
        });
    };
    ListPage.prototype.createDoc = function () {
        if (this.docx == 'Quotations') {
            if (this.provider.acc.address) {
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__request_request__["a" /* RequestPage */], { acc: this.acc });
            }
            else {
                alert('You need to update your address');
            }
        }
    };
    ListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-list',template:/*ion-inline-start:"/Users/brianhenry/Desktop/siwfity/src/pages/list/list.html"*/'\n<ion-header>\n  <ion-navbar color="headerColor">\n     <div id="header">\n     	<span>{{docx}}</span>\n     	<button *ngIf="docx == \'Quotations\' " (click)="createDoc()">Create</button>\n     	<button *ngIf="docs.length > 1  && type !=\'Notifications\'" class="searchIcon" (click)="toggleSearch(\'searchIcon\')">\n    		<ion-icon name="search"></ion-icon>\n    	</button>\n     </div>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content  style="background-color: white" >\n	<ion-grid style="margin:0px;padding:0px;height:100%">\n		<ion-row id="searchPosition">\n			<ion-col>\n				<div class="search">\n					<button (click)="toggleSearch(\'backArrow\')">\n						<ion-icon name="arrow-back"></ion-icon>\n					</button>\n					<div id="input">\n						<input placeholder="Search" type="text" [(ngModel)]="searchVal" (keyup)="search(searchVal)">\n						<button (click)="toggleSearch(\'close\')">\n							<ion-icon name="close"></ion-icon>\n						</button>\n					</div>\n				</div>\n		   </ion-col>\n		</ion-row>\n		<ion-row style="height:100%;">\n			\n			<ion-col style="margin:0px;padding:0px;" class="colHeight">\n			    <div  *ngIf="docs.length == 0" class="warn">\n				    <span style="color:grey;font-size:30px;">Oops!!</span><br/>\n				     <span style="color:grey;font-size:13px;">You don\'t have any \n				    {{docx}} at the moment</span>\n				</div>\n				<ion-list class="list" *ngIf="docs.length !== 0">\n					<div *ngFor="let doc of docs let q = index" >\n						<ion-item *ngIf="type !== \'LPOs\' && type !== \'Invoices\' && type !=\'Notifications\' "  (click)="goToRequest(doc, type)" id="{{doc.dateCreated}}" class="docs">\n								<div class="userImg">\n									<img *ngIf="docx !== \'Receipts\' && docx !==\'Quotations\'  && docx !==\'Offers\' && docx !== \'DeliveryNotes\' && docx !== \'InspectionCertificates\'"  src="{{provider.url+\'/\'+doc.from.pic}}">\n									<img *ngIf="docx == \'Receipts\' &&( provider.acc.businessName !== doc.to.name || !doc.from.pic) "  src="{{provider.url+\'/\'+doc.to.pic}}">\n									<img *ngIf="docx == \'Receipts\' && provider.acc.businessName == doc.to.name && doc.from.pic"  src="{{provider.url+\'/\'+doc.from.pic}}">\n									<img *ngIf="docx ==\'Offers\' || docx ==\'Quotations\' " src="{{provider.url+\'/\'+doc.pic}}">\n								</div>\n								<div class="details">\n									<span *ngIf="docx !== \'Receipts\' && docx !==\'Quotations\'  && docx 	!==\'Offers\'" class="name">{{doc.from.name}}</span>\n									<span *ngIf="docx == \'Receipts\' && provider.acc.businessName !== doc.to.name" class="name">{{doc.to.name}}</span>\n									<span *ngIf="docx == \'Receipts\' && provider.acc.businessName == doc.to.name" class="name">{{doc.from.name}}</span>\n									<span *ngIf="docx == \'DeliveryNotes\' || docx == \'InspectionCertificates\'" class="name">{{doc.from.businessName}}</span>\n									<span *ngIf="docx ==\'Quotations\'  || docx ==\'Offers\'"     class="name">{{doc.businessName}}</span>\n									<span class="time">{{provider.changeDate(doc.dateCreated)}}</span>\n									<br/>\n									<div class="text" style="font-size: 11px;">\n										Id: {{doc.dateCreated}}\n										<div style="font-size: 13px;" *ngIf="doc.title">\n											{{doc.title}}\n										</div>\n									</div>\n								</div>\n						</ion-item>\n						<ion-item  *ngIf="type ==\'Notifications\' && doc.read ==false "  (click)="goTo(doc, q)" class="notify docs" id="{{doc.dateCreated}}">\n								<div class="userImg">\n									<img src="{{provider.url+\'/\'+doc.from.pic}}">\n								</div>\n								<div class="details">\n									<span class="name">{{doc.from.name}}</span>\n									<span class="time">{{provider.changeDate(doc.dateCreated)}}</span>\n									<div class="text">\n										{{doc.note}}\n									</div>\n								</div>\n						</ion-item>\n						<ion-item  *ngIf="type ==\'Notifications\'  && doc.read == true "  (click)="goTo(doc, q)" class="docs" id="{{doc.dateCreated}}">\n								<div class="userImg">\n									<img src="{{provider.url+\'/\'+doc.from.pic}}">\n								</div>\n								<div class="details">\n									<span class="name">{{doc.from.name}}</span>\n									<span class="time">{{provider.changeDate(doc.dateCreated)}}</span>\n									<div class="text">\n										{{doc.note}}\n									</div>\n								</div>\n						</ion-item>\n					<ion-item *ngIf="type == \'LPOs\' "  (click)="goToLPO(doc)" class="docs" id="{{doc.dateCreated}}">\n						<div class="userImg">\n							<img src="{{provider.url+\'/\'+doc.from.pic}}">\n						</div>\n						<div class="details">\n							<span class="name">{{doc.from.name}}</span>\n							<span class="time">{{doc.info[0].dor}}</span>\n							<div class="text" style="font-size: 11px;">\n								Id: {{doc.serial}}\n							</div>\n						</div>\n					</ion-item>\n					<ion-item *ngIf="type == \'Invoices\' "  (click)="goToInvoice(doc)" class="docs" id="{{doc.dateCreated}}">\n						<div class="userImg">\n							<img src="{{provider.url+\'/\'+doc.from.pic}}">\n						</div>\n						<div class="details">\n							<span class="name">{{doc.from.name}}</span>\n							<span class="time">{{provider.changeDate(doc.dateCreated)}}</span>\n							<div class="text" style="font-size: 11px;">\n								Id: {{doc.serial}}\n							</div>\n						</div>\n					</ion-item>\n				</div>\n				</ion-list>\n		    </ion-col>\n		</ion-row>\n	</ion-grid>\n</ion-content>\n'/*ion-inline-end:"/Users/brianhenry/Desktop/siwfity/src/pages/list/list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__provider_provider__["a" /* ProviderPage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */]])
    ], ListPage);
    return ListPage;
}());

//# sourceMappingURL=list.js.map

/***/ }),

/***/ 279:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RequestPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__provider_provider__ = __webpack_require__(29);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var RequestPage = /** @class */ (function () {
    function RequestPage(provider, navCtrl, navParams) {
        this.provider = provider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.acc = this.navParams.get('acc');
    }
    RequestPage.prototype.count = function (index, value) {
        if (value && value.trim() !== '') {
            var initial = __WEBPACK_IMPORTED_MODULE_2_jquery__('.max').eq(index).attr('value');
            var rem = initial - value.length;
            __WEBPACK_IMPORTED_MODULE_2_jquery__('.max').eq(index).text('Remaining: ' + rem);
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
                businessName: this.acc.businessName,
                pic: this.acc.pic
            });
            this.navCtrl.pop();
        }
    };
    RequestPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-request',template:/*ion-inline-start:"/Users/brianhenry/Desktop/siwfity/src/pages/request/request.html"*/'\n<ion-header>\n\n  <ion-navbar color="headerColor">\n    <ion-title><span style="color: white">New Request</span></ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content style="background-color: white">\n	<ion-grid>\n		<ion-row>\n			<ion-col offset-sm-1 col-sm-10>\n				<ion-list class="ionlist">\n					<ion-item no-lines>\n						<ion-label stacked>Title</ion-label>\n						<ion-textarea [(ngModel)]="title" maxlength="50" (keyup)="count(0, title)" class="ionitem" >\n							\n						</ion-textarea>\n					</ion-item>\n					<div class="max" value="50">Remaining: 50</div>\n					<ion-item no-lines>\n						<ion-label stacked>Details</ion-label>\n						<ion-textarea [(ngModel)]="details" maxlength="600" rows="15" (keyup)="count(1, details)"  class="ionitem1">\n							\n						</ion-textarea>\n					</ion-item>\n					<div class="max" value="600">Remaining: 600</div>\n					<ion-item no-lines>\n						<ion-label stacked>Search tags <span class="warnText">(at least 1 and at most 5. Separated by comma)</span></ion-label>\n						<ion-input [(ngModel)]="searchTags" class="ionitem2" >\n							\n						</ion-input>\n					</ion-item>\n					<ion-item no-lines>\n						<ion-label stacked>Location</ion-label>\n						<ion-input [(ngModel)]="location" class="ionitem3" >\n						</ion-input>\n					</ion-item>\n					<ion-item no-lines>\n						<button (click)="goToQuot({\n 								title: title,\n 								details: details,\n 								searchTags: searchTags,\n 								location: location\n					        })" [disabled]="(!title || title.trim() == \'\' ||\n						  !details || details.trim() == \'\' || !searchTags || searchTags.trim() == \'\' || !location || location.trim() == \'\')" ion-button class="ionitem4">\n							 Next\n						</button>\n					</ion-item>\n				</ion-list>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n</ion-content>\n'/*ion-inline-end:"/Users/brianhenry/Desktop/siwfity/src/pages/request/request.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__provider_provider__["a" /* ProviderPage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */]])
    ], RequestPage);
    return RequestPage;
}());

//# sourceMappingURL=request.js.map

/***/ }),

/***/ 280:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotifyPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__provider_provider__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jquery__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_jquery__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var NotifyPage = /** @class */ (function () {
    function NotifyPage(navCtrl, provider, navParams) {
        this.navCtrl = navCtrl;
        this.provider = provider;
        this.navParams = navParams;
        this.data = this.navParams.get('data');
        __WEBPACK_IMPORTED_MODULE_3_jquery__(document).ready(function () {
            var height = __WEBPACK_IMPORTED_MODULE_3_jquery__('.colHeight2').css('height');
            __WEBPACK_IMPORTED_MODULE_3_jquery__('.colHeight2').css('lineHeight', height);
        });
    }
    NotifyPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-notify',template:/*ion-inline-start:"/Users/brianhenry/Desktop/siwfity/src/pages/notify/notify.html"*/'<ion-header>\n\n  <ion-navbar color="headerColor">\n    <ion-title>Message</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content style="background-color: white">\n	<ion-grid style="margin:0px;padding:0px;height:100%">\n		<ion-row style="height:100%">\n			<ion-col style="margin:0px;padding:0px;" class="colHeight2">\n			     <div id="info">\n			     	<img src="{{provider.url+\'/\'+data.from.pic}}">\n			     	<div id="name">{{data.from.name}}</div>\n			     	<div id="message">\n			     		<span>{{data.serial}}</span><br/>\n			     		{{data.reason}}\n			     	</div>\n			     </div>\n		    </ion-col>\n		</ion-row>\n	</ion-grid>\n</ion-content>\n'/*ion-inline-end:"/Users/brianhenry/Desktop/siwfity/src/pages/notify/notify.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__provider_provider__["a" /* ProviderPage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */]])
    ], NotifyPage);
    return NotifyPage;
}());

//# sourceMappingURL=notify.js.map

/***/ }),

/***/ 282:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(289);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_img_viewer__ = __webpack_require__(335);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(441);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_home_home__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_terms_terms__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_term_term__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_client_docs_client_docs__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_provider_provider__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_docs_docs__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_notify_notify__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_request_request__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_list_list__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_admin_admin__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_offer_offer__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_storage__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_file_transfer__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ionic_native_file__ = __webpack_require__(471);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ionic_native_camera__ = __webpack_require__(274);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_ng_socket_io__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_ng_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22_ng_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__ionic_native_header_color__ = __webpack_require__(281);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
























//const config: SocketIoConfig = { url: 'http://192.168.1.101:8081', options: {} };
var config = { url: 'http://swiftify.co.ke:8080', options: {} };
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_docs_docs__["a" /* DocsPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_terms_terms__["a" /* TermsPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_client_docs_client_docs__["a" /* ClientDocsPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_offer_offer__["a" /* OfferPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_request_request__["a" /* RequestPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_notify_notify__["a" /* NotifyPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_term_term__["a" /* TermPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_admin_admin__["a" /* AdminPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_5_ionic_img_viewer__["a" /* IonicImageViewerModule */],
                __WEBPACK_IMPORTED_MODULE_18__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_22_ng_socket_io__["SocketIoModule"].forRoot(config),
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */], {
                    backButtonText: '',
                    scrollPadding: false,
                    scrollAssist: true,
                    autoFocusAssist: false
                }, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_docs_docs__["a" /* DocsPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_terms_terms__["a" /* TermsPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_client_docs_client_docs__["a" /* ClientDocsPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_offer_offer__["a" /* OfferPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_request_request__["a" /* RequestPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_notify_notify__["a" /* NotifyPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_term_term__["a" /* TermPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_admin_admin__["a" /* AdminPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_11__pages_provider_provider__["a" /* ProviderPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_19__ionic_native_file_transfer__["a" /* FileTransfer */],
                __WEBPACK_IMPORTED_MODULE_19__ionic_native_file_transfer__["b" /* FileTransferObject */],
                __WEBPACK_IMPORTED_MODULE_20__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_23__ionic_native_header_color__["a" /* HeaderColor */],
                __WEBPACK_IMPORTED_MODULE_21__ionic_native_camera__["a" /* Camera */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProviderPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng_socket_io__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ng_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_transfer__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_camera__ = __webpack_require__(274);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ProviderPage = /** @class */ (function () {
    function ProviderPage(transfer, camera, storage, socket, loadCtrl, actionCtrl, toastCtrl, events) {
        var _this = this;
        this.transfer = transfer;
        this.camera = camera;
        this.storage = storage;
        this.socket = socket;
        this.loadCtrl = loadCtrl;
        this.actionCtrl = actionCtrl;
        this.toastCtrl = toastCtrl;
        this.events = events;
        this.url = 'http://swiftify.co.ke:3000/';
        this.socketResponse().subscribe(function (data) {
            var datam = data;
            var module = datam.module;
            if (module == 'notification') {
                switch (datam.submodule) {
                    case "fetch":
                        _this.notifications = datam.number;
                        _this.profilePic = _this.url + '/' + datam.pic;
                        _this.supplier = datam.supplierStatus;
                        _this.acc.pic = datam.pic;
                        _this.storage.set('swiftifyVariables', JSON.stringify(_this.acc)).catch(function (err) {
                        });
                        break;
                    case 'newNote':
                        if (_this.acc) {
                            var xr = datam.tos.findIndex(function (q) { return q == _this.acc.businessName; });
                            if (xr > -1) {
                                _this.notifications += 1;
                                if (datam.status) {
                                    _this.supplier.status = datam.status;
                                }
                            }
                        }
                        break;
                    default:
                        _this.notifications = 0;
                        break;
                }
            }
            else {
                if (_this.loadCtroller) {
                    _this.Load('hide', null);
                }
            }
            _this.events.publish(module, datam);
        });
    }
    ProviderPage.prototype.makeInfo = function () {
        var _this = this;
        this.storage.ready().then(function () {
            _this.storage.get('swiftifyVariables').then(function (val) {
                if (val) {
                    _this.acc = JSON.parse(val);
                    _this.profilePic = _this.url + '/' + _this.acc.pic;
                    _this.socketRequest({
                        module: 'notification',
                        action: 'fetch',
                        userId: _this.acc.businessName
                    });
                }
            });
        }).catch(function (err) {
            console.log(err);
        });
    };
    ProviderPage.prototype.socketRequest = function (data) {
        this.socket.emit('appData', { data: data });
    };
    ProviderPage.prototype.socketResponse = function () {
        var _this = this;
        var observable = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"](function (observer) {
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
    ProviderPage.prototype.action = function () {
        var _this = this;
        var buttons;
        buttons = [
            {
                text: 'Take a new picture',
                icon: 'camera',
                role: 'destructive',
                handler: function () {
                    _this.takePicture();
                }
            },
            {
                text: 'Choose from photos',
                icon: 'images',
                handler: function () {
                    _this.choosePicture();
                }
            },
            {
                text: 'Cancel',
                role: 'cancel',
                handler: function () {
                }
            }
        ];
        var actionSheet = this.actionCtrl.create({
            buttons: buttons
        });
        actionSheet.present();
    };
    ProviderPage.prototype.takePicture = function () {
        var _this = this;
        var options2 = {
            quality: 60,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 350,
            targetHeight: 350,
            allowEdit: true,
            correctOrientation: true,
        };
        this.camera.getPicture(options2).then(function (imageData) {
            _this.imgUpload = 'data:image/jpeg;base64,' + imageData;
            _this.profilePic = _this.imgUpload;
            _this.upldImage();
        }, function (err) {
        });
    };
    ProviderPage.prototype.choosePicture = function () {
        var _this = this;
        var options2 = {
            quality: 60,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            targetWidth: 350,
            targetHeight: 350,
            allowEdit: true,
            correctOrientation: true,
        };
        this.camera.getPicture(options2).then(function (imageData) {
            _this.imgUpload = 'data:image/jpeg;base64,' + imageData;
            _this.profilePic = _this.imgUpload;
            _this.upldImage();
        }, function (err) {
        });
    };
    ProviderPage.prototype.changeDate = function (date) {
        var dateString = new Date(date);
        dateString = dateString.toString();
        date = dateString.substr(0, 15);
        var time = dateString.substr(16, 5);
        dateString = date + ' at ' + time;
        return dateString;
    };
    ProviderPage.prototype.upldImage = function () {
        var _this = this;
        var fileTransfer = this.transfer.create();
        var options = {
            fileKey: 'swiftify',
            fileName: 'swiftify',
            chunkedMode: false,
            mimeType: "image/jpeg",
            headers: {},
            params: {
                action: 'profile',
                userId: this.acc.businessName
            }
        };
        fileTransfer.upload(this.imgUpload, this.url + 'imageUpload', options)
            .then(function (data) {
            var datx = JSON.stringify(data);
            var string = datx.split('\\"');
            _this.storage.ready().then(function () {
                _this.storage.get('swiftifyVariables').then(function (val) {
                    var vals = JSON.parse(val);
                    _this.toast('Profile updated', 'middle');
                    vals.pic = string[1];
                    _this.profilePic = _this.url + '' + vals.pic;
                    _this.acc.pic = vals.pic;
                    _this.storage.set('swiftifyVariables', JSON.stringify(vals)).catch(function (err) {
                    });
                });
            });
        }, function (err) {
            _this.toast('Photo could not be uploaded', 'middle');
        });
    };
    ProviderPage.prototype.upload = function (doc) {
        var _this = this;
        var options = {
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            correctOrientation: true,
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.imgUpload = 'data:image/jpeg;base64,' + imageData;
            _this.upldImage1(doc);
        }, function (err) {
        });
    };
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
    ProviderPage.prototype.upldImage1 = function (doc) {
        var _this = this;
        var fileTransfer = this.transfer.create();
        var options = {
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
        };
        fileTransfer.upload(this.imgUpload, this.url + 'imageUpload', options)
            .then(function (data) {
            var datx = data.response;
            if (datx == 2) {
                _this.supplier.status = 'pending';
            }
            _this.toast('document has been uploaded', 'bottom');
        }, function (err) {
            _this.toast('Photo could not be uploaded', 'middle');
        });
    };
    ProviderPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-provider',template:/*ion-inline-start:"/Users/brianhenry/Desktop/siwfity/src/pages/provider/provider.html"*/'<!--\n  Generated template for the ProviderPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>provider</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n</ion-content>\n'/*ion-inline-end:"/Users/brianhenry/Desktop/siwfity/src/pages/provider/provider.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__ionic_native_file_transfer__["a" /* FileTransfer */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_2_ng_socket_io__["Socket"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Events */]])
    ], ProviderPage);
    return ProviderPage;
}());

//# sourceMappingURL=provider.js.map

/***/ }),

/***/ 441:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_jquery__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_provider_provider__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_list_list__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_header_color__ = __webpack_require__(281);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var MyApp = /** @class */ (function () {
    function MyApp(hederClr, provider, storage, platform, statusBar, events, splashScreen) {
        var _this = this;
        this.hederClr = hederClr;
        this.provider = provider;
        this.storage = storage;
        this.events = events;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        this.docs = [
            { title: 'Certificate of Registration', abr: 'COR', uploaded: false },
            { title: 'KRA certificate', abr: 'KCR', uploaded: false }
        ];
        platform.ready().then(function () {
            statusBar.styleLightContent();
            _this.hederClr.tint('#490451');
            statusBar.backgroundColorByHexString('#490451');
            splashScreen.hide();
            _this.manipulateData();
        });
        //events
        this.events.subscribe('app', function (data) {
            if (data.submodule == 'updateProfile') {
                _this.provider.toast('Your profile has been updated.', null);
                __WEBPACK_IMPORTED_MODULE_6_jquery__('.updateInpts').slideUp(300);
                _this.accountInfo = data.user;
                if (_this.accountInfo.address) {
                    _this.provider.acc.address = _this.accountInfo.address;
                }
                _this.storage.remove('swiftifyVariables');
                _this.storage.set('swiftifyVariables', JSON.stringify(_this.accountInfo)).catch(function (err) {
                    if (err)
                        console.log(err);
                });
            }
            else if (data.submodule == 'loggedIn') {
                _this.manipulateData();
            }
            else if (data.submodule == 'changePic') {
                _this.provider.profilePic == data.pic;
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
                        { title: 'Notifications', icon: 'notifications', component: __WEBPACK_IMPORTED_MODULE_8__pages_list_list__["a" /* ListPage */], docs: 'Notifications' },
                        { title: 'Requests', icon: 'create', component: __WEBPACK_IMPORTED_MODULE_8__pages_list_list__["a" /* ListPage */], docs: 'Quotations' },
                        { title: 'Offers', icon: 'document', component: __WEBPACK_IMPORTED_MODULE_8__pages_list_list__["a" /* ListPage */], docs: 'Offers' },
                        { title: 'Invoices', icon: 'card', component: __WEBPACK_IMPORTED_MODULE_8__pages_list_list__["a" /* ListPage */], docs: 'Invoices' },
                        { title: 'Receipts', icon: 'pricetag', component: __WEBPACK_IMPORTED_MODULE_8__pages_list_list__["a" /* ListPage */], docs: 'Receipts' }
                    ];
                    _this.pages2 = [
                        { title: 'LPOs', icon: 'paper', component: __WEBPACK_IMPORTED_MODULE_8__pages_list_list__["a" /* ListPage */], docs: 'LPOs' },
                        { title: 'Delivery Notes', icon: 'cart', component: __WEBPACK_IMPORTED_MODULE_8__pages_list_list__["a" /* ListPage */], docs: 'DeliveryNotes' },
                        { title: 'Inspection Certificates', icon: 'clipboard', component: __WEBPACK_IMPORTED_MODULE_8__pages_list_list__["a" /* ListPage */], docs: 'InspectionCertificates' }
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
        __WEBPACK_IMPORTED_MODULE_6_jquery__('.updateInpts').slideToggle(300);
    };
    MyApp.prototype.openPage = function (page) {
        this.nav.push(page.component, { acc: this.accountInfo, doc: page.docs });
    };
    MyApp.prototype.signedOut = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */]);
        this.events.publish('indexResponse', { submodule: 'logOut' });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"/Users/brianhenry/Desktop/siwfity/src/app/app.html"*/'<ion-menu type="overlay" [content]="content" *ngIf="accountInfo">\n\n  <ion-toolbar color="headerColor">\n    <ion-title>Swiftify</ion-title>\n  </ion-toolbar>\n\n  <ion-content class="appSideMenu" >\n   \n     	<div *ngIf="accountInfo" style="text-align: center;padding-top: 50px">\n        <div>\n    	  	<img src="{{provider.profilePic}}" id="profileImg" imageViewer/>\n        </div>\n        <div >\n           <button class="regBtn" (click)="provider.action()" style="background-color: transparent;border: none;margin-bottom: 0px">\n              <ion-icon name="brush" style="color: DarkGray ;"></ion-icon>Change picture\n          </button>\n        </div>\n        <div >\n    	  	<span id="businessName">{{accountInfo.businessName}}</span>\n        </div>\n    	  	<div class="cont">Email: <span class="appvalue">{{accountInfo.email}}</span></div>\n    	  	<div *ngIf="accountInfo.phone" class="cont">Phone: <span class="appvalue">+254{{accountInfo.phone}}</span></div>\n    	  	<div class="cont" style="text-align: center;">\n    	  		<button class="editBtn" (click)="toggleList()">\n      	  		<ion-icon name="brush" style="color: DarkGray ;"></ion-icon> Edit profile\n      	  	</button>\n          </div>\n          <ion-list class="updateInpts">\n            <ion-item no-lines *ngFor="let input of inputs">\n              <ion-label stacked style="color:darkgrey">{{input.title}}</ion-label>\n              <ion-input type="{{input.type}}" [(ngModel)]=input.ngBind class="inputApp"></ion-input>\n            </ion-item>\n               <button (click)="updateValue()" class="regBtn" style="margin-top: 20px;">Update</button>\n          </ion-list>\n        </div>\n        <div *ngFor="let p of pages let q = index"  style="margin-top: 20px;">\n          <button menuClose style="margin-left: 20px; font-weight:lighter; background-color: transparent;font-size:16px;color: white;"  (click)="openPage(p)">\n            <ion-icon style="color: DarkGray ;font-size: 20px; margin-right: 25px;" name="{{p.icon}}"></ion-icon>\n            {{p.title}}\n            <span *ngIf="q == 0 &&  provider.notifications > 0" class="unreadTexts2">{{provider.notifications}}</span>\n          </button>\n      </div>\n      <div>\n      	<div class="others">Other documents</div>\n      	  <div *ngFor="let p of pages2"  style="margin-top: 20px; margin-left: 20px">\n          <button menuClose style="margin-left: 20px;background-color: transparent;font-size:16px;color: DarkGray;"  (click)="openPage(p)">\n            <ion-icon style="color: grey ;font-size: 20px; margin-right: 25px;" name="{{p.icon}}"></ion-icon>\n            {{p.title}}\n          </button>\n      </div>\n      <div style="margin-bottom: 20px">\n          <button class="signOutBtn" menuClose (click)="signedOut()">\n            <ion-icon name="log-out"></ion-icon>\n            Sign out\n          </button><br/>\n      </div>\n      <div *ngIf="!registration && (!provider.supplier || provider.supplier.status ==\'\')" style="text-align: center;margin-top:20px;">\n        <button (click)="registration = true" class="regBtn">Register as a supplier</button>\n      </div>\n       <div *ngIf="provider.supplier && provider.supplier.status == \'pending\'" style="text-align: center;margin-top:20px;">\n        <button  class="regBtn">Pending supplier registration</button>\n      </div>\n      <div *ngIf="registration && provider.supplier.status !==\'pending\' && provider.supplier.status !==\'approved\' && provider.supplier.status !==\'suspended\'" id="regDivSupp" style="margin-top: 10px;width: 100%; margin-bottom: 20px;">\n        <div class="spReg" >Supplier registration</div>\n        <div class="spReg1"><span style="color:red; font-size:17px">* </span>You need to upload these files for verification</div><br/>\n        <div>\n             <div class="docReg" *ngFor="let doc of docs let x = index">\n               <span>{{x+1}}. {{doc.title}}</span>\n               <button (click)="provider.upload(doc.title)"><ion-icon name="attach"></ion-icon></button><br/>\n             </div>\n        </div>\n        <div style="text-align: center;"><button ion-button style="background-color: transparent;color: white; font-size: 16px" (click)="registration =  false">Cancel</button></div>\n      </div>\n    </div>\n  </ion-content>\n</ion-menu>\n<ion-nav id="nav" [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n\n'/*ion-inline-end:"/Users/brianhenry/Desktop/siwfity/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_9__ionic_native_header_color__["a" /* HeaderColor */], __WEBPACK_IMPORTED_MODULE_7__pages_provider_provider__["a" /* ProviderPage */], __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["t" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Events */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 465:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[282]);
//# sourceMappingURL=main.js.map