import AuthForm from '../../helpers/AuthForm'
import { SignupUser } from '../../api/user'
import { NewUser, Field, SubmitButtonInterface } from '../../utils/types'
import { useQueryClient } from '@tanstack/react-query'
import Context from '../../constants/Context'
import { useContext } from 'react'

const Signup = () => {
  const queryClient = useQueryClient()
  const { setAccessToken } = useContext(Context)

  const fields: Field[] = [
    { label: 'Username', typeKey: 'username', type: 'text', required: true },
    { label: 'Email', typeKey: 'email', type: 'email', required: true },
    { label: 'password', typeKey: 'password', type: 'password', required: true },
    { label: 'first name', typeKey: 'first_name', type: 'text', required: false },
    { label: 'last name', typeKey: 'last_name', type: 'text', required: false },
  ]

  const submitButton: SubmitButtonInterface<NewUser> = {
    label: 'Signup',
    type: 'submit',
    func: (values) => SignupUser(values as NewUser, queryClient, setAccessToken),
  }

  return <AuthForm<NewUser> fields={fields} submitButton={submitButton} />
}
export default Signup
