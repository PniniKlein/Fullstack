import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DisplayUsersComponent } from './components/display-users/display-users.component';
import { GraphesComponent } from './components/graphes/graphes.component';
import { entryAuthGuard } from './guard/entry-auth.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { SongsComponent } from './components/songs/songs.component';

export const routes: Routes = [
    {path: '',component: LoginComponent},
    {path: 'home',component: HomeComponent},
    {path: 'users',component: DisplayUsersComponent,canActivate:[entryAuthGuard]},
    {path: 'graph',component: GraphesComponent,canActivate:[entryAuthGuard]},
    {path: 'songs',component: SongsComponent,canActivate:[entryAuthGuard]},
    {path: 'settings',component: SettingsComponent,canActivate:[entryAuthGuard]},

];
