import * as React from "react"
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider } from "react-hook-form"

export const Form = FormProvider

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />
}
