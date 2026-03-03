'use client'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Checkbox as CheckboxUi } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Width } from '../Width'
import { Error } from '../Error'

export const Checkbox: React.FC<any> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const props = register(name, { required })
  const { setValue } = useFormContext()

  return (
    <Width width={width}>
      <div className="flex items-center gap-2">
        <CheckboxUi
          id={name}
          defaultChecked={defaultValue}
          onCheckedChange={(checked: boolean) => {
  // Directly set the boolean. No "on" strings.
  setValue(name, !!checked, { shouldValidate: true })
}}
        />
        <Label htmlFor={name} className="whitespace-nowrap text-sm leading-tight">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      </div>
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
