import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule, ActionReducer } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizeComponent } from './authorize/authorize.component';
import { FieldErrorComponent } from './authorize/field-error/field-error.component';
import { LoginComponent } from './authorize/login/login.component';
import { RegisterComponent } from './authorize/register/register.component';
import { ConversationComponent } from './conversation/conversation.component';
import { MessageListComponent } from './conversation/message-list/message-list.component';
import { WriterComponent } from './conversation/writer/writer.component';
import { MaterialModule } from './material/material.module';
import { MembersComponent } from './members/members.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthorColorPipe } from './shared/author-color.pipe';
import { AuthorNamePipe } from './shared/author-name.pipe';
import { AddConversationComponent } from './shared/dialogs/add-conversation/add-conversation.component';
import { AddMemberComponent } from './shared/dialogs/add-member/add-member.component';
import { DisplayTextPipe } from './shared/display-text.pipe';
import { FielderrorPipe } from './shared/fielderror.pipe';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AuthorizeEffects } from './store/effects/authorize/authorize.effects';
import { ConversationEffects } from './store/effects/conversation/conversation.effects';
import { ProgressEffects } from './store/effects/progress/progress.effects';
import { UserEffects } from './store/effects/user/user.effects';
import { RouterEffects } from './store/effects/router/router.effects';
import { appreducer } from './store/reducers/app.reducer';
import { routerKey } from './store/reducers/router.reducer';
import { AuthInterceptor } from './http-interceptors/auth.interceptor';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { localStorageSync } from 'ngrx-store-localstorage';
import { SearcherComponent } from './searcher/searcher.component';
import { TokenTableComponent } from './settings/token-table/token-table.component';
import { EditMessageComponent } from './shared/dialogs/edit-message/edit-message.component';
import { VoiceVisualComponent } from './members/voice-visual/voice-visual.component';
import { EnterKeyDownDirective } from './shared/enter-key-down.directive';

registerLocaleData(localeDe);

export function debug<T>(reducer: ActionReducer<T>): ActionReducer<T> {
  return (state, action) => {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}

export const metaReducers = [
  localStorageSync({
    keys: [{ user: ['sidenavOpen', 'desktopNotifications', 'soundAlerts'] }],
    rehydrate: true,
    syncCondition: (_) => true
  }),
].concat(environment.production ? [] : [debug]);

@NgModule({
  declarations: [
    AppComponent,
    ConversationComponent,
    EnterKeyDownDirective,
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
    AddConversationComponent,
    MembersComponent,
    AddMemberComponent,
    SearcherComponent,
    TokenTableComponent,
    EditMessageComponent,
    VoiceVisualComponent,
    EnterKeyDownDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ScrollingModule,
    AppRoutingModule,
    StoreModule.forRoot(
      {
        [routerKey]: routerReducer,
        ...appreducer,
      },
      { metaReducers }
    ),
    EffectsModule.forRoot([
      ConversationEffects,
      AuthorizeEffects,
      ProgressEffects,
      UserEffects,
      RouterEffects,
    ]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !environment.production,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'de' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
