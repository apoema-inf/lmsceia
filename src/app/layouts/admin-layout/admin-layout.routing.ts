import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { LoginComponent } from 'app/login/login.component';
import { AuthGuard } from 'app/services/auth-guard.service';
import { SelfServiceComponent } from 'app/self-service/self-service.component';
import { BreakNewsComponent } from 'app/break-news/break-news.component';
import { TimesComponent } from 'app/times/times.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'user-profile',   component: UserProfileComponent, canActivate: [AuthGuard]  },
    { path: 'self-service',          component: SelfServiceComponent, canActivate: [AuthGuard]  },
    { path: 'break-news',           component: BreakNewsComponent, canActivate: [AuthGuard]  },
    { path: 'notifications',  component: NotificationsComponent, canActivate: [AuthGuard]  },
    { path: 'times',  component: TimesComponent, canActivate: [AuthGuard]  },
    { path: 'login',  component: LoginComponent },
];
