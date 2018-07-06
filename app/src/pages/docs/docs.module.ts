import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocsPage } from './docs';

@NgModule({
  declarations: [
    DocsPage,
  ],
  imports: [
    IonicPageModule.forChild(DocsPage),
  ],
})
export class DocsPageModule {}
