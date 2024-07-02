import {ChangeDetectionStrategy, Component, forwardRef, input, InputSignal, viewChild} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatPrefix} from "@angular/material/form-field";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgModel} from "@angular/forms";
import {BaseControlValueAccessor} from "../../utils/base-control-value-accessor.directive";
import {MatAutocomplete, MatAutocompleteModule} from "@angular/material/autocomplete";

@Component({
  selector: 'app-input',
  template: `
    <div class="app-input-wrapper" matAutocompleteOrigin #origin="matAutocompleteOrigin">
      <mat-icon matPrefix>search</mat-icon>
      <input class="app-input" #input [placeholder]="placeholder()" [ngModel]="currentValue()"
             (ngModelChange)="handleValueChange($event)"
             [matAutocomplete]="matAutocomplete()"
             [matAutocompleteConnectedTo]="origin"
             [disabled]="disabled()">
    </div>
  `,
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [
    MatIcon,
    MatPrefix,
    FormsModule,
    MatAutocompleteModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InputComponent extends BaseControlValueAccessor<string> {
  matAutocomplete: InputSignal<MatAutocomplete> = input.required()
  model = viewChild.required(NgModel);
  placeholder = input.required<string>();

  valueAccessor!: ControlValueAccessor;

  override ngOnInit() {
    this.valueAccessor = this.model().valueAccessor!;
    super.ngOnInit();
  }

  protected handleValueChange(value: string): void {
    this.currentValue.set(value);
    if (this.propagateChange) {
      this.propagateChange(this.currentValue())
    }
  }
}
