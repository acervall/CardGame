import LogoutButton from '../components/LogoutButton'
import EditProfile from '../components/EditProfile'
import { useNavigate } from 'react-router-dom'
import DeleteAccount from '../components/DeleteAccount'
import { SubmitButton } from '../assets/StyledComponents/FormComponents'
function Profile() {
  const navigate = useNavigate()

  const handleClick = async () => {
    navigate(`/`)
  }
  return (
    <div>
      <EditProfile />
      <DeleteAccount />
      <SubmitButton onClick={handleClick}>Home</SubmitButton>
      <LogoutButton />
    </div>
  )
}

export default Profile
