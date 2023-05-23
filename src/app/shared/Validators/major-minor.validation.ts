import { Validator, AbstractControl, ValidationErrors } from '@angular/forms';

export class NumberCompareValidator implements Validator {
  constructor(private num1: number, private num2: number) {}

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && value !== undefined) {
      if (value < this.num1 || value > this.num2) {
        return { numberCompare: true };
      }
    }
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {}
}
