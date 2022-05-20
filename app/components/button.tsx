import styled from "styled-components"

interface ButtonProps {
  children?: React.ReactNode,
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any,
}

const ButtonWrap = styled.button`

`;

export const Button: React.FC<ButtonProps> = ({ children, onClick }: ButtonProps) => <ButtonWrap onClick={(e) => {
  e.preventDefault();
  onClick(e)
}}>{children}</ButtonWrap>