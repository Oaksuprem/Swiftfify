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
import { NavController, Events } from 'ionic-angular';
import * as $ from "jquery";
import { StatusBar } from '@ionic-native/status-bar';
import { ProviderPage } from '../provider/provider';
import { Storage } from '@ionic/storage';
import { OfferPage } from '../offer/offer';
var HomePage = /** @class */ (function () {
    function HomePage(events, storage, provider, navCtrl, statusBar) {
        var _this = this;
        this.events = events;
        this.storage = storage;
        this.provider = provider;
        this.navCtrl = navCtrl;
        this.statusBar = statusBar;
        this.menuItems = [{ title: 'Requests' },
            { title: 'Products' },
            { title: 'Log in', hide: 'container', show: 'container2' },
            { title: 'Contact us' },
            { title: 'About' }
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
        $(document).ready(function () {
            var height = $('.colHeight').css('height');
            $('.colHeight').css('lineHeight', height);
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
        $(document).ready(function () {
            $('.scrollmenu button').eq(0).css('borderBottom', '2px solid white');
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
                        _this.requests[indx] = data.info.id;
                    }
                    break;
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
                        $('.signUpDiv, .loginDiv').fadeOut(300);
                        $('.verifDiv').fadeIn(300);
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
                _this.provider.toast("Your request has been sent.", 'middle');
            }
            else if (data.submodule == 'logOut') {
                _this.storage.remove('swiftifyVariables').then(function () {
                    _this.accountInfo = undefined;
                    _this.logged = false;
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
                    $('.part1').hide();
                    $('.part2').fadeIn(600);
                    _this.code = data.message;
                }
            }
        });
    }
    HomePage.prototype.changeDate = function (date) {
        var dateString = new Date(date);
        dateString = dateString.toString();
        date = dateString.substr(0, 15);
        var time = dateString.substr(16, 5);
        dateString = date + ' at ' + time;
        return dateString;
    };
    HomePage.prototype.loggedIn = function () {
        this.storage.set('swiftifyVariables', JSON.stringify(this.accountInfo)).catch(function (err) {
            if (err)
                console.log(err);
        });
        this.logged = true;
        this.hideShow('container2', 'container0');
        this.provider.toast('You are now logged in.', null);
        this.events.publish('app', {
            submodule: 'loggedIn',
            acc: this.accountInfo
        });
    };
    HomePage.prototype.resetPass = function (pass, cpass) {
        if (pass !== cpass) {
            $('.verError1').show();
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
            $('.part2').hide();
            $('.part3').fadeIn(600);
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
        if (!this.accountInfo)
            alert('Please log in first to view this content');
        else
            this.navCtrl.push(OfferPage, { data: [req, this.accountInfo] });
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
        $('.itemSearch').slideDown();
        this.search_value = tag;
        this.fetch(tag, null);
    };
    HomePage.prototype.toggleMenu = function (item) {
        if (item) {
            this.fetch('all', 'no');
        }
        $('.itemSearch').slideToggle();
    };
    HomePage.prototype.hideError = function () {
        this.emailPassErr = undefined;
        $('.verError1').hide();
    };
    HomePage.prototype.itemClicked = function (item, index, hide, show) {
        $('.scrollmenu button').css('borderBottom', 'none');
        $('.scrollmenu button').eq(index).css('borderBottom', '2px solid #750481');
        this.hideShow(hide, show);
        if (index == 2) {
            $('.homePage').fadeOut(600);
            this.statusBar.hide();
        }
    };
    HomePage.prototype.hideShow = function (hide, show) {
        $('.part2, .part3').hide();
        $('.part1').fadeIn(600);
        $('.' + hide + '').fadeOut(300);
        $('.' + show + '').fadeIn(300);
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
        Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        }),
        __metadata("design:paramtypes", [Events, Storage, ProviderPage, NavController, StatusBar])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map