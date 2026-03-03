import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Text: React.FC<any> = ({
  name,
  label,
  required,
  register,
  errors,
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium">
          {label} {required && '*'}
        </label>
      )}

      <input
        {...register(name, { required })}
        className={`
          w-full
          rounded-lg
          border
          px-4
          py-3
          text-sm
          transition
          outline-none
          focus:ring-2
          focus:ring-primary
          ${errors?.[name] ? 'border-red-500' : 'border-border'}
        `}
      />

      {errors?.[name] && (
        <p className="text-sm text-red-500">
          This field is required
        </p>
      )}
    </div>
  )
}
