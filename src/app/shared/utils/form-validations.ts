import { FormGroup } from "@angular/forms";

export function isValidField(form: FormGroup, nameField: string) {
  return form.get(nameField)?.invalid && form.get(nameField)?.touched;
}

export function isValidFieldRequired(form: FormGroup, nameField: string) {
  return form.get(nameField)?.invalid && form.get(nameField)?.errors?.['required'] && form.get(nameField)?.touched;
}

export function isValidFieldCustom(form: FormGroup, nameField: string, nameError: string) {
  return form.get(nameField)?.errors?.[nameError];
}
