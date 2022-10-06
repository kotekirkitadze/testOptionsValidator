import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';

function getAllIndexes(arr: string[], val: string | undefined) {
  var indexes = [],
    i = -1;
  if (val)
    while ((i = arr.indexOf(val, i + 1)) != -1) {
      indexes.push(i);
    }
  return indexes;
}

function toFindDuplicatesIndices(arry: string[]) {
  const duplicateElement = arry.find((item: string, index: number) => {
    return item != '' && arry.indexOf(item) !== index;
  });
  return getAllIndexes(arry, duplicateElement);
}

export function optionsUniqueValidator(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const values = (c as FormArray<FormGroup>)['controls'].map(
    (fg: FormGroup) => fg.controls['option'].value
  );
  const repetitive = toFindDuplicatesIndices(values);

  repetitive.forEach((v: number) => {
    (c as FormArray<FormGroup>)['controls'][v].setErrors({ duplicated: true });
  });

  if (repetitive.length) {
    return null;
  } else {
    (c as FormArray<FormGroup>)['controls'].forEach((c: FormGroup) => {
      c.setErrors({ duplicated: null });
    });
  }

  return { duplicated: true };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form: FormGroup = new FormGroup({
    options: new FormArray([this.buildOptionForm()], {
      validators: optionsUniqueValidator,
    }),
  });

  constructor(private fb: FormBuilder) {}

  buildOptionForm() {
    return this.fb.group({
      option: '',
    });
  }

  get getOptionsForm(): FormArray | null {
    return <FormArray>this.form.get('options');
  }

  addOption() {
    this.getOptionsForm?.push(this.buildOptionForm());
  }

  removeOption(i: number) {
    this.getOptionsForm?.removeAt(i);
  }
}

new FormArray([
  new FormGroup({ option: new FormControl() }),
  new FormGroup({ option: new FormControl() }),
  new FormGroup({ option: new FormControl() }),
]);
