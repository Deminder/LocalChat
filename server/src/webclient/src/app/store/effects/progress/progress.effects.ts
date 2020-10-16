import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { filter, map } from 'rxjs/operators';
import {
  progressStart,
  progressStop,
  progressStopAll,
} from '../../actions/progress.actions';

const startPattern = /^\[.+\/API\].*$/;
const stopPattern = /^\[.+\/API\].*(Success|Failure)$/;
const nextPattern = /^.*Next.*$/;

@Injectable()
export class ProgressEffects {
  startProgress$ = createEffect(() =>
    this.actions$.pipe(
      filter(
        (action) =>
          startPattern.test(action.type) && !stopPattern.test(action.type)
      ),
      map((action) => progressStart({ action: action.type }))
    )
  );

  stopProgress$ = createEffect(() =>
    this.actions$.pipe(
      filter((action) => stopPattern.test(action.type)),
      map((action) => action.type.replace(/ (Success|Failure)$/, '')),
      map((action) =>
        nextPattern.test(action)
          ? progressStop({ action })
          : progressStopAll({ action })
      )
    )
  );

  constructor(private actions$: Actions) {}
}
