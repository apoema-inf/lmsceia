import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, FormBuilder } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'environments/environment';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ToastrModule } from 'ngx-toastr';
import { AngularFirestore } from 'angularfire2/firestore';
import { FirebaseService } from './services/firebase.service';
import { AdminGuard } from './services/admin-guard.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    ChartsModule,
    AngularFireAuthModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, AdminGuard, AuthGuard, AuthService, AngularFirestore, FirebaseService, FormBuilder],
  bootstrap: [AppComponent]
})
export class AppModule { }
