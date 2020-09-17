import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { ConversationEffects } from './store/effects/conversation.effects';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './authorize/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthorizeComponent } from './authorize/authorize.component';
import { RegisterComponent } from './authorize/register/register.component';
import { AuthorizeEffects } from './store/effects/authorize/authorize.effects';
import { routerKey } from './store/reducers/router.reducer';
import { FieldErrorComponent } from './authorize/field-error/field-error.component';
import { FielderrorPipe } from './shared/fielderror.pipe';

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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatProgressBarModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    StoreModule.forRoot(
      {
        [routerKey]: routerReducer,
        ...appreducer,
      },
      { metaReducers }
    ),
    EffectsModule.forRoot([ConversationEffects, AuthorizeEffects]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
