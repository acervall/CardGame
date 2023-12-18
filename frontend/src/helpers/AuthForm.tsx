import { StyledForm, FormField, SubmitButton } from '../assets/StyledComponents/FormComponents'
import { AuthFormProps } from '../utils/types'
import { useState } from 'react'

const AuthForm = <T,>({ fields, submitButton }: AuthFormProps<T>) => {
  const [formValues, setFormValues] = useState<T>(
    fields.reduce((values, field) => ({ ...values, [field.typeKey]: field.value || '' }), {}) as T,
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('handleSubmit', formValues)
    submitButton.func(formValues)
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      {fields.map(
        (field, index) =>
          field.label && (
            <FormField key={index}>
              <label>{field.label}</label>
              <input
                required={field.required}
                name={field.typeKey}
                value={(formValues as Record<string, string>)[field.typeKey]}
                onChange={handleInputChange}
                type={field.type}
              />
            </FormField>
          ),
      )}

      <SubmitButton type={submitButton.type}>{submitButton.label}</SubmitButton>
    </StyledForm>
  )
}

export default AuthForm
