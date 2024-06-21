import {Directive, OnInit, signal, WritableSignal} from "@angular/core";
import {ControlValueAccessor} from "@angular/forms";

export type PropagateChange<T> = (value: T | null) => void;

@Directive()
export abstract class BaseControlValueAccessor<T> implements ControlValueAccessor, OnInit {
  disabled = signal<boolean>(false);
  currentValue: WritableSignal<T | null> = signal<T | null>(null);

  abstract valueAccessor: ControlValueAccessor;
  protected propagateChange?: PropagateChange<T>;

  propagateTouched: () => void = () => ({});

  ngOnInit(): void {
    if (!this.valueAccessor) {
      throw new Error(
        `valueAccessor is not provided. Missing #valueAccessor in template of component wrapped with ControlValueAccessorWrapper.`
      );
    }
  }

  writeValue(value: T): void {
    this.currentValue.set(value);
    if (this.valueAccessor && this.valueAccessor.writeValue) {
      this.valueAccessor.writeValue(value);
    }
  }

  registerOnChange(fn: PropagateChange<T>): void {
    if (this.valueAccessor && this.valueAccessor.registerOnChange) {
      this.valueAccessor.registerOnChange(fn);
    }
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    if (this.valueAccessor) {
      this.valueAccessor.registerOnChange(fn);
    }
    this.propagateTouched = fn;
    //TODO - internal to external
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    if (this.valueAccessor && this.valueAccessor.setDisabledState) {
      this.valueAccessor.setDisabledState(isDisabled);
    }
  }
}
