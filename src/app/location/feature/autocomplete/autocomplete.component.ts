import {ChangeDetectionStrategy, Component, forwardRef, inject, input, ViewChild} from '@angular/core';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionSelectionChange} from "@angular/material/core";
import {BaseControlValueAccessor} from "../../../shared/utils/base-control-value-accessor.directive";
import {CityService} from "../../data-access/city.service";
import {toObservable} from "@angular/core/rxjs-interop";
import {debounceTime, of, switchMap} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {InputComponent} from "../../../shared/ui/input/input.component";

type Option = string;

@Component({
  selector: 'app-city-autocomplete',
  template: `
    <app-input class="app-input" #input [placeholder]="placeholder()" [ngModel]="currentValue()"
               (ngModelChange)="handleValueChange($event)"
               (keyup.enter)="handleSubmit()"
               [matAutocomplete]="auto" [disabled]="disabled()"/>
    <mat-autocomplete #auto="matAutocomplete">
      @for (option of options$ | async; track option) {
        <mat-option (onSelectionChange)="handleSelection($event)" [value]="option.name">{{ option.name }}</mat-option>
      }
    </mat-autocomplete>
  `,
  styleUrls: ['./autocomplete.component.scss'],
  standalone: true,
  imports: [MatAutocompleteModule, FormsModule, MatFormFieldModule, MatIconModule, MatInputModule, AsyncPipe, InputComponent],
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

  @ViewChild(InputComponent, {static: true})
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
