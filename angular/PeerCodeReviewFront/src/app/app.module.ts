import { BrowserModule } from '@angular/platform-browser';
// These two modules will help us with Angular forms and submitting data to 
// our Express backend
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// This will allow us to navigate between our components
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

// These are the four components in our app so far
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProtectedComponentComponent } from './protected-component/protected-component.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeMenuComponent } from './home-menu/home-menu.component';
import { UploadComponent } from './upload/upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { AuthGuard } from './auth.guard';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { MyCodeListComponent } from './my-code-list/my-code-list.component';
import { CodeComponent } from './code/code.component';
import { MyCodeReviewListComponent } from './my-code-review-list/my-code-review-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RubricDialogComponent } from './rubric-dialog/rubric-dialog.component';



const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'protected', component: ProtectedComponentComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeMenuComponent, canActivate: [AuthGuard] },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'mycode', component: MyCodeListComponent, canActivate: [AuthGuard]},
  { path: 'code', component: CodeComponent, canActivate: [AuthGuard]},
  { path: 'review', component: MyCodeReviewListComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [				
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ProtectedComponentComponent,
    NavbarComponent,
    HomeMenuComponent,
    UploadComponent,
    MyCodeListComponent,
    CodeComponent,
    MyCodeReviewListComponent,
    RubricDialogComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    HttpClientModule,
    MonacoEditorModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [RubricDialogComponent]
})
export class AppModule { }
