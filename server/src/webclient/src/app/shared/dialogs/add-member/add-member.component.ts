import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dictionary } from '@ngrx/entity';
import { MemberDto } from 'src/app/openapi/model/models';
import { UserService } from 'src/app/store/effects/user/user.service';
import { Subject } from 'rxjs';
import {
  debounceTime,
  switchMap,
  map,
  distinctUntilChanged,
  first,
} from 'rxjs/operators';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent implements OnInit {
  // TODO validator async: check if username exits
  nameControl = new FormControl(
    '',
    Validators.required,
    this.createUsernameChecker()
  );

  suggestions: string[];

  constructor(
    public dialogRef: MatDialogRef<AddMemberComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { conversationId: number; members: Dictionary<MemberDto> },
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.nameControl.valueChanges
      .pipe(
        debounceTime(1000),
        switchMap(() =>
          this.userService.search({ search: this.nameControl.value })
        )
      )
      .subscribe((resp) => {
        this.suggestions = resp.usernames;
      });
  }

  confirm(): void {
    this.userService
      .getUserId({ username: this.nameControl.value })
      .subscribe((resp) => this.dialogRef.close(resp.id));
  }

  createUsernameChecker(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((username) => this.userService.getUserId({ username })),
        map((resp) => (resp.id >= 0 ? null : { userNotFound: true })),
        first()
      );
  }

  displayFn(username: string): string {
    return username;
  }
}
