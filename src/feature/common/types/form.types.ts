export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

export type FormFieldErrorMap<T extends string = string> = Partial<
  Record<T, string>
>;