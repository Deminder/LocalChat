import * as fromRouter from '@ngrx/router-store';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const routerKey = 'router';

export interface RouterState {
  router: fromRouter.RouterReducerState<any>;
}

export const selectRouter = createFeatureSelector<
  RouterState,
  fromRouter.RouterReducerState<any>
>(routerKey);

export const {
  selectCurrentRoute, // select the current route
  selectFragment, // select the current route fragment
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl, // select the current url
} = fromRouter.getSelectors(selectRouter);

export const selectRegisteredUsername = selectQueryParam('registered');

export const selectedConversationId = createSelector(
  selectRouteParam('conversationId'),
  (id) => Number(id)
);

export const isSettingsOpen = createSelector(
  selectUrl,
  (data) => data === '/settings'
);