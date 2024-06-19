import {ChangeDetectionStrategy, Component, forwardRef, inject, input, viewChild} from '@angular/core';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgModel} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionSelectionChange} from "@angular/material/core";
import {BaseControlValueAccessor} from "../../../shared/utils/base-control-value-accessor.directive";
import {CityService} from "../../data-access/city.service";
import {toObservable} from "@angular/core/rxjs-interop";
import {debounceTime, of, switchMap} from "rxjs";
import {AsyncPipe} from "@angular/common";

type Option = string;

@Component({
  selector: 'app-city-autocomplete',
  template: `
    <mat-form-field subscriptSizing="dynamic" (keyup.enter)="handleSubmit()">
      <mat-icon matPrefix>search</mat-icon>
      <input #input matInput [placeholder]="placeholder()" [ngModel]="currentValue()"
             (ngModelChange)="handleValueChange($event)"
             [matAutocomplete]="auto" [disabled]="disabled()">
    </mat-form-field>
    <mat-autocomplete #auto="matAutocomplete">
      @for (option of options$ | async; track option) {
        <mat-option (onSelectionChange)="handleSelection($event)" [value]="option.name">{{ option.name }}</mat-option>
      }
    </mat-autocomplete>
  `,
  styles: [
    `
      :host {
        --mat-form-field-trailing-icon-color: black;
        --mat-form-field-leading-icon-color: black;
        /*--mat-form-field-container-text-line-height: 16px;*/
      }

      .mat-mdc-form-field {
        width: 100%;
      }
    `
  ],
  standalone: true,
  imports: [MatAutocompleteModule, FormsModule, MatFormFieldModule, MatIconModule, MatInputModule, AsyncPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent extends BaseControlValueAccessor<Option> {
  placeholder = input.required<string>();

  model = viewChild.required(NgModel);
  valueAccessor!: ControlValueAccessor;

  private cityService: CityService = inject(CityService);


  protected options$ = toObservable(this.currentValue).pipe(
    debounceTime(200),
    switchMap((query) => {
        if (!query || query.length < 3) {
          return of([]);
        }
        return this.cityService.searchCitiesByName(query)
      }
    ),
  );

  override ngOnInit() {
    this.valueAccessor = this.model().valueAccessor!;
    super.ngOnInit();
  }

  protected handleValueChange(value: Option): void {
    this.currentValue.set(value);
  }

  protected handleSelection(event: MatOptionSelectionChange<Option>): void {
    if (event.source.selected) {
      this.currentValue.set(event.source.value);
      if (this.propagateChange) {
        this.propagateChange(this.currentValue())
      }
    }
  }

  protected handleSubmit(): void {
    if (this.propagateChange) {
      this.propagateChange(this.currentValue());
    }
  }
}
