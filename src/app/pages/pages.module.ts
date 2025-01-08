import { NgModule } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesRoutes } from './pages.routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { AppDashboardComponent } from './explore/explore.component';
import { SongsPageComponent } from './ui-components/songs/components/songs-page.component';
import { ArtistPageComponent } from './ui-components/artists/artist-page.component';

@NgModule({
  declarations: [AppDashboardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    SongsPageComponent,
    ArtistPageComponent,
    RouterModule.forChild(PagesRoutes),
    TablerIconsModule.pick(TablerIcons),
    
    ],
  exports: [TablerIconsModule],
})
export class PagesModule {}
