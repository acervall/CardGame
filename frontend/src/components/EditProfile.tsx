import AuthForm from './AuthForm'
import { EditUser, EditUserSettings } from '../api/user'
import { User, Field, SubmitButtonInterface, OnlySettings } from '../utils/types'
import { useQueryClient } from '@tanstack/react-query'
import useUser from '../hooks/useUser'

const EditProfile = () => {
  const queryClient = useQueryClient()
  const { data: user, isLoading, error } = useUser()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (user) {
    const fields: Field[] = [
      {
        typeKey: 'id',
        value: user.id,
      },
      {
        label: 'Username',
        typeKey: 'username',
        value: user.username,
        type: 'text',
        required: true,
      },
      { label: 'Email', typeKey: 'email', value: user.email, type: 'email', required: true },
      {
        label: 'password',
        typeKey: 'password',
        value: user.password,
        type: 'password',
        required: true,
      },
      {
        label: 'first name',
        typeKey: 'first_name',
        value: user.first_name,
        type: 'text',
        required: false,
      },
      {
        label: 'last name',
        typeKey: 'last_name',
        value: user.last_name,
        type: 'text',
        required: false,
      },
    ]

    const submitButton: SubmitButtonInterface<User> = {
      label: 'Save changes',
      type: 'submit',
      func: (values) => EditUser(values as User, queryClient),
    }

    console.log('user', user)

    const changeBackgroundColor = (color: string) => {
      const userSettings: OnlySettings = {
        id: user.id,
        opacity: user.opacity,
        background_color: color,
      }
      EditUserSettings(userSettings, queryClient)
      console.log('userSettings', userSettings)
    }

    return (
      <div>
        <h1>Edit Profile</h1>
        <button data-testid="change-color-red" onClick={() => changeBackgroundColor('red')}>
          Red
        </button>
        <button onClick={() => changeBackgroundColor('blue')}>Blue</button>
        <button onClick={() => changeBackgroundColor('gray')}>Gray</button>
        <button onClick={() => changeBackgroundColor('green')}>Green</button>
        <button onClick={() => changeBackgroundColor('purple')}>Purple</button>
        <button onClick={() => changeBackgroundColor('yellow')}>Yellow</button>
        <p>Edit you user information</p>
        <AuthForm<User> fields={fields} submitButton={submitButton} />
      </div>
    )
  }
}

export default EditProfile
