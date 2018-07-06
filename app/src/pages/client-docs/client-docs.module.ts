import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientDocsPage } from './client-docs';

@NgModule({
  declarations: [
    ClientDocsPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientDocsPage),
  ],
})
export class ClientDocsPageModule {}
