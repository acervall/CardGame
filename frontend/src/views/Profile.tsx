import LogoutButton from '../components/LogoutButton'
import EditProfile from '../components/EditProfile'
import DeleteAccount from '../components/DeleteAccount'

function Profile() {
  return (
    <div>
      <EditProfile />
      <DeleteAccount />
      <LogoutButton />
    </div>
  )
}

export default Profile
