import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { SongsPageComponent } from './songs/components/songs-page.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { ArtistPageComponent } from './artists/artist-page.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'badge',
        component: AppBadgeComponent,
      },
      {
        path: 'chips',
        component: AppChipsComponent,
      },
      {
        path: 'songs',
        component: SongsPageComponent,
      },
      {
        path: 'artists',
        component: ArtistPageComponent,
      },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
      },
      
    ],
  },
];
