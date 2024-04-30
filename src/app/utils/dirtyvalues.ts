import { FormGroup } from '@angular/forms';

export const getDirtyValues = (form: FormGroup<any>): any => {
    const dirtyValues: any = {};

    Object.keys(form.controls).forEach((key) => {
        const control = form.get(key);

        if (control.dirty) {
            dirtyValues[key] = control.value;
        }
    });

    return dirtyValues;
};
