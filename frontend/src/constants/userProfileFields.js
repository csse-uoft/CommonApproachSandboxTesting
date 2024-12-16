import {Validator} from "../helpers";
import {defaultField} from "./index";
export const userProfileFields = {
  givenName: {
    ...defaultField,
    label: 'Given name',
  },
  familyName: {
    ...defaultField,
    label: 'Family name',
  },
  formalName: {
    ...defaultField,
    label: 'Formal name'
  },
  telephone: {
    ...defaultField,
    required: true,
    label: 'Telephone',
    validator: Validator.phone,
    type: 'phoneNumber',
  },
  email: {
    ...defaultField,
    required: true,
    label: 'Primary Email',
    type: 'email',
    validator: Validator.email,
  },
  altEmail: {
    ...defaultField,
    label: 'Secondary Email',
    type: 'email',
    validator: Validator.email,
  }
};
