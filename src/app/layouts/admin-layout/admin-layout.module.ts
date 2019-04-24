import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { GameComponent } from 'app/game/game.component';
import { GetJogadorPipe } from 'app/pipes/get-jogador.pipe';
import { TimeItemComponent } from 'app/time-item/time-item.component';
import { TimeBigComponent } from 'app/time-big/time-big.component';

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
    TimesComponent,
    GameComponent,
    GetJogadorPipe,
    TimeItemComponent,
    TimeBigComponent
  ]
})

export class AdminLayoutModule {}
