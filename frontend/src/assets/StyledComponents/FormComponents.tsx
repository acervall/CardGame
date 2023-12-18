import styled from '@emotion/styled'
import { color } from '../colors'

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  gap: 20px;
`

export const FormField = styled.div`
  display: grid;
  position: relative;
  height: 45px;

  label {
    background-color: ${color.white};
    font-size: 10px;
    color: ${color.gray};
    width: fit-content;
    z-index: 1;
    margin-left: 8px;
    padding: 3px;
    height: 10px;
    text-transform: capitalize;
  }

  input {
    margin-top: -20px;
    padding: 5px;
    border: 1px solid ${color.lightGray};
    width: 250px;

    &:active,
    &:focus-within,
    &:focus-visible {
      border: transparent !important;
      border-bottom: 1px solid ${color.black};
    }
  }
`

interface ButtonProps {
  backgroundColor?: string
  color?: string
  backgroundColorHover?: string
  width?: string
}

export const SubmitButton = styled.button<ButtonProps>`
  border: transparent;
  background-color: ${(props) => props.backgroundColor || color.darkGray};
  padding: 10px;
  text-transform: uppercase;
  color: ${(props) => props.color || color.white};
  letter-spacing: 0.3px;
  width: ${(props) => props.width || '120px'};
  border-radius: 50px;
  margin: 5px;

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.backgroundColorHover || color.black};
  }
`
