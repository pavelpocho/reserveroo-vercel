import React from "react";
import styled from "styled-components";
import { styles } from "~/constants/styles";
import { MainButton, MainButtonBtn, SecondaryButtonBtn } from "./place/place-summary";

interface ConfirmationDialogProps {
  hidden: boolean,
  onConfirm: () => void,
  title: string,
  text: string,
  confirmText: string,
  cancelText: string,
  close: () => void
}

const Wrap = styled.div<{ hidden: boolean }>`
  position: fixed;
  visibility: ${props => props.hidden ? 'hidden' : 'visible'};
  transition: opacity 0.15s ease-in-out, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: scale(0.9);
  opacity: 0;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Window = styled.div`
  background-color: ${styles.colors.white};
  box-shadow: ${styles.shadows[0]};
  width: 32rem;
  display: flex;
  max-width: 100%;
  border-radius: 1rem;
  @media (max-width: 650px) {
    width: 100%;
    border-radius: 0;
  }
  flex-direction: column;
  gap: 1.3rem;
  padding: 1.5rem;
  z-index: 8;
`;

const Backdrop = styled.div<{ hidden?: boolean }>`
  position: fixed;
  z-index: 7;
  display: ${props => props.hidden ? 'none' : ''};
  background-color: ${styles.colors.black}40;
  top: 0;
  left: 0;
  transform-origin: center;
  transform: scale(150%);
  width: 100vw;
  height: 100vh;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0px;
  font-weight: 600;
`;

const Text = styled.p`
  margin: 0px;
  font-weight: 500;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ hidden, title, text, confirmText, cancelText, onConfirm, close }) => {

  const wrap = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setTimeout(() => {
      if (wrap.current) {
        wrap.current.style.opacity = hidden ? '0' : '1';
        wrap.current.style.transform = hidden ? 'scale(0.9)' : 'scale(1)';
      }
    }, 100);
  }, [hidden]);

  return <Wrap hidden={hidden} ref={wrap}>
    <Backdrop onClick={close} />
    <Window>
      <Title>{title}</Title>
      <Text>{text}</Text>
      <ButtonRow>
        <SecondaryButtonBtn onClick={(e) => {
          e.preventDefault();
          close();
        }}>{cancelText}</SecondaryButtonBtn>
        <MainButtonBtn onClick={(e) => {
          onConfirm();
          close();
          e.preventDefault();
        }}>{confirmText}</MainButtonBtn>
      </ButtonRow>
    </Window>
  </Wrap>
}