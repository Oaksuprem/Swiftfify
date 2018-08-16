var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TermsPage } from '../pages/terms/terms';
import { ClientDocsPage } from '../pages/client-docs/client-docs';
import { ProviderPage } from '../pages/provider/provider';
import { DocsPage } from '../pages/docs/docs';
import { RequestPage } from '../pages/request/request';
import { ListPage } from '../pages/list/list';
import { OfferPage } from '../pages/offer/offer';
import { IonicStorageModule } from '@ionic/storage';
import { SocketIoModule } from 'ng-socket-io';
//const config: SocketIoConfig = { url: 'http://192.168.43.136:8081', options: {} };
var config = { url: 'http://192.168.1.103:8081', options: {} };
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
                HomePage,
                DocsPage,
                TermsPage,
                ClientDocsPage,
                ListPage,
                OfferPage,
                RequestPage
            ],
            imports: [
                BrowserModule,
                IonicImageViewerModule,
                IonicStorageModule.forRoot(),
                SocketIoModule.forRoot(config),
                IonicModule.forRoot(MyApp, {
                    backButtonText: ''
                })
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp,
                HomePage,
                DocsPage,
                TermsPage,
                ClientDocsPage,
                OfferPage,
                ListPage,
                RequestPage
            ],
            providers: [
                StatusBar,
                SplashScreen,
                ProviderPage,
                HomePage,
                { provide: ErrorHandler, useClass: IonicErrorHandler }
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map