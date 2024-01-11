// USERS

import { ComponentPropsWithoutRef } from 'react'

export interface User {
  accessToken: string
  user: {
    id: number
    username: string
    first_name: string
    last_name: string
    email: string
  }
}

export interface IdentifierPassword {
  identifier: string
  password: string
}

export interface NewUser {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface UserSettings {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  opacity: number
  background_color: string
  password?: string
}

export interface OnlySettings {
  id: number
  opacity: number
  background_color: string
}

export interface UserId {
  id: number
}

// FORMS

export interface Field extends ComponentPropsWithoutRef<'input'> {
  label?: string
  typeKey: string
}

export interface SubmitButtonInterface<T> extends ComponentPropsWithoutRef<'button'> {
  label: string
  func: (values: T) => void
}

export interface AuthFormProps<T> {
  fields: Field[]
  submitButton: SubmitButtonInterface<T>
}
