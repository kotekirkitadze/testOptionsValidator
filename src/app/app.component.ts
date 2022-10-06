import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';

function getAllIndexes(arr: any, val: any) {
  var indexes = [],
    i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

function toFindDuplicatesIndices(arry: any[]) {
  const duplicateElement = arry.find((item: any, index: any) => {
    return item != '' && arry.indexOf(item) !== index;
  });
  return getAllIndexes(arry, duplicateElement);
}

export function passwordMatcher(
  c: AbstractControl
): { [key: string]: boolean } | null {
  console.log(c, 'eee');
  const values = (c as any)['controls'].map(
    (fg: any) => fg.controls.option.value
  );
  const repetitive = toFindDuplicatesIndices(values);
  console.log(repetitive);
  repetitive.forEach((v) => {
    (c as any)['controls'][v].setErrors({ bla: true });
  });
  console.log(repetitive);
  if (repetitive.length) {
    return null;
  } else {
    (c as any)['controls'].forEach((c: any) => {
      c.setErrors({ bla: null });
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
      validators: passwordMatcher,
    }),
  });
  title = 'testOptions';

  constructor(private fb: FormBuilder) {}

  buildOptionForm() {
    // return new FormControl();
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

  bla(a: any, i: any) {
    console.log(i, a);
    return a?.errors?.bla;
  }
}
