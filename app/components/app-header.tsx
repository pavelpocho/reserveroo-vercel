import { Form, Link, useLocation } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { styles } from "~/constants/styles";
import { useLangs } from "~/contexts/langsContext";
import { useWhereAreWe } from "~/contexts/whereAreWeContext";
import { useUsername } from "~/contexts/usernameContext";
import * as cs_texts from "~/assets/langs/cs.texts.json";
import * as en_texts from "~/assets/langs/en.texts.json";
import { createCookie } from "@remix-run/node";
import GbIcon from "~/assets/icons/gb";
import CzIcon from "~/assets/icons/cz";
import { FaBars } from 'react-icons/fa';

const Wrap = styled.header`
  background-color: ${styles.colors.primary};
  transition: transform 0.2s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.2s ease-out;
  top: 0px;
  position: sticky;
  width: 100%;
  box-sizing: border-box;
  gap: 2rem;
  padding: 1.3rem 0.2rem 1.3rem 1rem;
  z-index: 4;
`;

const InnerWrap = styled.div`
  display: flex;
  position: relative;
  margin: 0 auto;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  height: 100%;
  max-width: 938px;
  @media (max-width: 800px) {
    display: grid;
    grid-template-columns: 1fr 4rem;
  }
`;

const Title = styled.h6`
  color: ${styles.colors.primary};
  padding: 0.5rem;
  border-radius: 0.4rem;
  font-size: 1.375rem;
  font-weight: bold;
  margin: 0px;
  background-color: ${styles.colors.white};
  transition: background-color 0.15s;
  &:hover {
    background-color: ${styles.colors.gray[20]};
  }
  &:active {
    background-color: ${styles.colors.gray[40]};
  }
`;

const MenuItem = styled.p<{ border?: boolean }>`
  margin: 0px;
  font-size: 0.875rem;
  color: ${styles.colors.white};
  box-sizing: border-box;
  border: ${(props) =>
    props.border ? `1px solid ${styles.colors.white}` : ""};
  background-color: transparent;
  transition: background-color 0.15s;
  padding: 0.5rem 0.8rem;
  display: flex;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  border-radius: 0.4rem;
  &:hover {
    background-color: ${styles.colors.white}30;
  }
  &:active {
    background-color: ${styles.colors.white}30;
  }
`;

const WrappedMenuItem = styled.p`
  margin: 0px;
  font-size: 0.875rem;
  color: ${styles.colors.white};
  box-sizing: border-box;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
`;

interface AppHeaderProps {
  children: React.ReactNode;
}

const ProfileImage = styled.span`
  height: 2rem;
  width: 2rem;
  font-size: 1rem;
  color: ${styles.colors.primary};
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${styles.colors.white};
`;

const Side = styled.div`
  display: flex;
  align-items: stretch;
`;

const BarLink = styled(Link)<{ hide?: boolean }>`
  display: ${props => props.hide === true ? 'none' : 'flex'};
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${styles.colors.white};
  text-decoration: none;
  padding: 0 0.4rem;
`;

const StretchForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: stretch;
`;

const BarButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  margin: 0px;
  font-weight: 500;
  background-color: transparent;
  cursor: pointer;
  padding: 0 1.5rem;
  color: ${styles.colors.white};
  border: none;
`;

const HoverBarButton = styled(BarButton)`
  border-radius: 0.4rem;
  padding: 0.5rem 1.5rem;
  &:hover {
    background-color: ${styles.colors.gray[10]}20;
  }
`;

const Circle = styled.div`
  border-radius: 100%;
  height: 1.875rem;
  width: 1.875rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${styles.colors.action};
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  &:hover {
    transform: scale(1.1);
  }
`;

const In = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MenuButton = styled(BarButton)`
  @media (min-width: 800px) {
    display: none;
  }
`;

const RightSide = styled(Side)<{ showMenu: boolean }>`
  @media (max-width: 800px) {
    display: ${props => props.showMenu ? 'flex' : 'none'};
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    grid-row: 2;
    grid-column: 1 / span 2;
  };
  
`;

const BarLinkMoreThan400 = styled(BarLink)`
  @media (max-width: 400px) {
    display: none;
  }
`;

const BarLinkLessThan400 = styled(BarLink)`
  @media (min-width: 400px) {
    display: none;
  }
`;

const Separator = styled.div`
  @media (min-width: 800px) {
    display: none;
  }
  background-color: ${styles.colors.white}40;
  width: 80%;
  height: 0.0625rem;
`;

const Separator400 = styled(Separator)`
  @media (min-width: 400px) {
    display: none;
  }
`;

const Backdrop = styled.div<{ hidden?: boolean }>`
  position: fixed;
  z-index: 3;
  display: ${props => props.hidden ? 'none' : ''};
  background-color: ${styles.colors.black}60;
  top: 0;
  left: 0;
  transform-origin: center;
  transform: scale(150%);
  width: 100vw;
  height: 100vh;
  align-items: center;
`;


export default function AppHeader({ children }: AppHeaderProps) {
  const location = useLocation();
  const [ isLandingPage, setIsLandingPage ] = useState(false);
  const [ showMenu, setShowMenu ] = useState(false);

  const { username, admin, usernameToVerify } = useUsername();

  const { setTranslations: setL, translations: l, lang, setLang } = useLangs();

  const { signingIn } = useWhereAreWe();

  useEffect(() => {
    setIsLandingPage(location.pathname === "/");
  }, [location]);

  return (<>
    <Backdrop hidden={!showMenu} />
    <Wrap>
      <InnerWrap>
        <Side>
          <BarLink onClick={(e) => {
            console.log('x');
            setShowMenu(false);
          }} to='/places'>
            <Title>{children}</Title>
          </BarLink>
          <BarLinkMoreThan400 onClick={(e) => {
            console.log('x');
            setShowMenu(false);
          }} to={isLandingPage ? "/places" : "/"}>
            <MenuItem>{isLandingPage ? "Places" : "Who are we?"}</MenuItem>
          </BarLinkMoreThan400>
        </Side>
        <MenuButton onClick={(e) => {
          console.log('x');
          e.preventDefault();
          setShowMenu(!showMenu);
        }}>
          <FaBars />
        </MenuButton>
        <RightSide showMenu={showMenu} >
          <BarLinkLessThan400 onClick={(e) => {
            console.log('x');
            setShowMenu(false);
          }} to={isLandingPage ? "/places" : "/"}>
            <MenuItem>{isLandingPage ? "Places" : "Who are we?"}</MenuItem>
          </BarLinkLessThan400>
          <Separator400 />
          <BarLink onClick={(e) => {
            console.log('x');
            setShowMenu(false);
          }} style={{ marginRight: "0.6rem" }} to={"/admin/reservations"}>
            <MenuItem border={true}>List a business</MenuItem>
          </BarLink>
          <Separator />
          <BarButton
            onClick={() => {
              setL(lang == "czech" ? en_texts : cs_texts);
              setLang(lang == "czech" ? "english" : "czech");
            }}
          >
            {l.name == "cs" ? (
              <Circle>
                <In>
                  <CzIcon height={"2.5rem"} />
                </In>
              </Circle>
            ) : (
              <Circle>
                <In>
                  <GbIcon height={"2.5rem"} />
                </In>
              </Circle>
            )}
          </BarButton>
          <Separator />
          <BarLink onClick={(e) => {
            console.log('x');
            setShowMenu(false);
          }} hide={signingIn ?? false} to={"/profile"} style={{ fontWeight: "bold" }}>
            <MenuItem>
              {usernameToVerify ? "Verify your email" : username ?? "Sign In"}
              <ProfileImage>{username ? username[0] : ""}</ProfileImage>
            </MenuItem>
          </BarLink>
          {!signingIn && <Separator />}
          <StretchForm action='/logout' method='post'>
            <input type='text' name={'redirectUrl'} hidden={true} defaultValue={'/authenticate'} />
            {(username || usernameToVerify) && <HoverBarButton onClick={(e) => {
            console.log('x');
            setShowMenu(false);
          }}>Logout</HoverBarButton> }
          </StretchForm>
        </RightSide>
      </InnerWrap>
    </Wrap>
  </>);
}
