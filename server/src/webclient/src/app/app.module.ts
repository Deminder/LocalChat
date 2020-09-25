import { NgModule, LOCALE_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConversationComponent } from './conversation/conversation.component';
import { appreducer } from './store/reducers/app.reducer';
import { ConversationEffects } from './store/effects/conversation/conversation.effects';
import { UserEffects } from './store/effects/user/user.effects';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './authorize/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthorizeComponent } from './authorize/authorize.component';
import { RegisterComponent } from './authorize/register/register.component';
import { AuthorizeEffects } from './store/effects/authorize/authorize.effects';
import { ProgressEffects } from './store/effects/progress/progress.effects';
import { routerKey } from './store/reducers/router.reducer';
import { FieldErrorComponent } from './authorize/field-error/field-error.component';
import { FielderrorPipe } from './shared/fielderror.pipe';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthorNamePipe } from './shared/author-name.pipe';
import { MessageListComponent } from './conversation/message-list/message-list.component';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { AuthorColorPipe } from './shared/author-color.pipe';
import { WriterComponent } from './conversation/writer/writer.component';
import { DisplayTextPipe } from './shared/display-text.pipe';

registerLocaleData(localeDe);

export const metaReducers = [];

@NgModule({
  declarations: [
    AppComponent,
    ConversationComponent,
    LoginComponent,
    AuthorizeComponent,
    RegisterComponent,
    FieldErrorComponent,
    FielderrorPipe,
    SidenavComponent,
    SettingsComponent,
    AuthorNamePipe,
    MessageListComponent,
    AuthorColorPipe,
    WriterComponent,
    DisplayTextPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatCardModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    StoreModule.forRoot(
      {
        [routerKey]: routerReducer,
        ...appreducer,
      },
      { metaReducers }
    ),
    EffectsModule.forRoot([ConversationEffects, AuthorizeEffects, ProgressEffects, UserEffects]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !environment.production,
    }),
  ],
  providers: [{provide: LOCALE_ID, useValue: 'de'}],
  bootstrap: [AppComponent],
})
export class AppModule {}
