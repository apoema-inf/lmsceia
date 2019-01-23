import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'app/login/login.component';
import { SelfServiceComponent } from 'app/self-service/self-service.component';
import { BreakNewsComponent } from 'app/break-news/break-news.component';
import { TimesComponent } from 'app/times/times.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ChartsModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    NotificationsComponent,
    LoginComponent,
    SelfServiceComponent,
    BreakNewsComponent,
    TimesComponent
  ]
})

export class AdminLayoutModule {}
