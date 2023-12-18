import { useState } from 'react'
import styled from '@emotion/styled'

import Signin from './Signin'
import Signup from './Signup'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  gap: 20px;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
`

const GrayText = styled.p`
  margin-top: 10px;
  font-size: 0.875rem;
  color: #6b7280;
`

const Button = styled.button`
  all: unset;
  font-weight: 600;
  line-height: 1.5rem;
  color: #6366f1;
  cursor: pointer;
  &:hover {
    color: #4f46e5;
  }
`

function SigninSignup() {
  const [hasAccount, setHasAccount] = useState(true)

  return (
    <Container>
      <Title>{hasAccount ? 'Signin' : 'Signup'}</Title>
      {hasAccount ? <Signin /> : <Signup />}
      <GrayText>
        {hasAccount ? 'Not a member? ' : 'Already a member? '}
        <Button onClick={() => setHasAccount(!hasAccount)}>
          {hasAccount ? 'Create account' : 'Sign in'}
        </Button>
      </GrayText>
    </Container>
  )
}

export default SigninSignup
