import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TermsPage } from '../pages/terms/terms';
import { TermPage } from '../pages/term/term';
import { ClientDocsPage } from '../pages/client-docs/client-docs';
import { ProviderPage } from '../pages/provider/provider';
import { DocsPage } from '../pages/docs/docs';
import { NotifyPage } from '../pages/notify/notify';
import { RequestPage } from '../pages/request/request';
import { ListPage } from '../pages/list/list';
import { AdminPage } from '../pages/admin/admin';
import { OfferPage } from '../pages/offer/offer';
import { IonicStorageModule } from '@ionic/storage';
import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
//const config: SocketIoConfig = { url: 'http://192.168.1.101:8081', options: {} };
const config: SocketIoConfig = { url: 'http://swiftify.co.ke:8080', options: {} };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DocsPage,
    TermsPage,
    ClientDocsPage,
    ListPage,
    OfferPage,
    RequestPage,
    NotifyPage,
    TermPage,
    AdminPage
  ],
  imports: [
    BrowserModule,
    IonicImageViewerModule,
    IonicStorageModule.forRoot(),
    SocketIoModule.forRoot(config),
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
     scrollPadding: false,
            scrollAssist: true,
            autoFocusAssist: false})
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
    RequestPage,
    NotifyPage,
    TermPage,
    AdminPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ProviderPage,
    HomePage,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
     FileTransfer,
    FileTransferObject,
    File,
    Camera
  ]
})
export class AppModule {}
