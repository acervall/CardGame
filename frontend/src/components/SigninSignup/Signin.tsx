import AuthForm from '../AuthForm'
import { LoginUser } from '../../api/user'
import { IdentifierPassword, Field, SubmitButtonInterface } from '../../utils/types'
import { useQueryClient } from '@tanstack/react-query'
import Context from '../../context/Context'
import { useContext } from 'react'

const Signin = () => {
  const queryClient = useQueryClient()
  const { setAccessToken } = useContext(Context)

  const fields: Field[] = [
    { label: 'Username or email', typeKey: 'identifier', type: 'text', required: true },
    { label: 'Password', typeKey: 'password', type: 'password', required: true },
  ]

  const submitButton: SubmitButtonInterface<IdentifierPassword> = {
    label: 'Login',
    type: 'submit',
    func: (values) => LoginUser(values as IdentifierPassword, queryClient, setAccessToken),
  }

  return <AuthForm<IdentifierPassword> fields={fields} submitButton={submitButton} />
}
export default Signin
