import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  inject,
  input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {InstantSearchService} from "./instant-search.service";
import {connectHits, connectSearchBox} from "instantsearch.js/es/connectors";
import {Hit} from "instantsearch.js";
import {AsyncPipe} from "@angular/common";
import {InputComponent} from "../ui/input/input.component";
import {MatAutocomplete, MatOption} from "@angular/material/autocomplete";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {BaseControlValueAccessor} from "../utils/base-control-value-accessor.directive";
import {MatOptionSelectionChange} from "@angular/material/core";

type Option = string;

@Component({
  selector: 'app-search',
  template: `
    <app-input class="app-input" #input [placeholder]="placeholder()" [ngModel]="currentValue()"
               (ngModelChange)="handleValueChange($event)"
               (keyup.enter)="handleSubmit()"
               [matAutocomplete]="auto" [disabled]="disabled()"/>
    <mat-autocomplete #auto="matAutocomplete">
      @for (hit of hits; track hit.objectID) {
        <mat-option (onSelectionChange)="handleSelection($event)" [value]="hit['name']">{{ hit['name'] }}</mat-option>
      }
    </mat-autocomplete>
  `,
  providers: [
    InstantSearchService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [
    AsyncPipe,
    InputComponent,
    MatAutocomplete,
    MatOption,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchComponent extends BaseControlValueAccessor<Option> implements AfterContentInit, OnDestroy {
  placeholder = input.required<string>();
  private instantSearchService: InstantSearchService = inject(InstantSearchService);
  protected hits?: Hit[];
  private query?: string;
  private search?: (value: string) => void;

  @ViewChild(InputComponent, {static: true})
  valueAccessor!: ControlValueAccessor;

  constructor() {
    super();
    this.instantSearchService.addWidgets([
      connectSearchBox(({refine, query}) => {
        this.search = refine;
        this.query = query;
      })({
        // ...widgetParams
      }),
      connectHits(({hits}) => {
        this.hits = hits;
      })({}),
    ]);

    effect(() => {
      const value = this.currentValue();
      if (value) {
        this.search!(value);
      }
    });
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

  ngAfterContentInit() {
    this.instantSearchService.start();
  }

  ngOnDestroy() {
    this.instantSearchService.dispose();
  }
}
