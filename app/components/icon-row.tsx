import styled from "styled-components"
import BaseballIcon from "~/assets/icons/Baseball";
import BowlingBallIcon from "~/assets/icons/BowlingBall";
import DumbellIcon from "~/assets/icons/Dumbell";
import FireFlameCurvedIcon from "~/assets/icons/FireFlameCurved";
import FutbolIcon from "~/assets/icons/Futbol";
import GolfBallTeeIcon from "~/assets/icons/GolfBallTee";
import HeartIcon from "~/assets/icons/Heart";
import PersonSwimmingIcon from "~/assets/icons/PersonSwimming";
import SpaIcon from "~/assets/icons/Spa";
import TableTennisPaddleBallIcon from "~/assets/icons/TableTennisPaddleBall";
import VolleyballIcon from "~/assets/icons/Volleyball";
import WeightHangingIcon from "~/assets/icons/WeightHanging";
import { styles } from "~/constants/styles";

const Wrap = styled.div<{ invertedColors?: boolean }>`
  display: flex;
  gap: 0.25rem;
  justify-content: center;
  position: relative;
  background-color: ${props => props.invertedColors ? styles.colors.white : styles.colors.primary};
  padding: 1rem 0rem;
  max-width: 968px;
  width: 66vw;
  overflow: hidden;
  margin: 0 auto;
`;

const Overlay = styled.div<{ invertedColors?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-image: ${props => props.invertedColors ? (
    `linear-gradient(to right, ${styles.colors.white}FF, ${styles.colors.white}00, ${styles.colors.white}FF)`
  ) : (
    `linear-gradient(to right, ${styles.colors.primary}FF, ${styles.colors.primary}00, ${styles.colors.primary}FF)`
  )};
`;

const ListItem = styled.div`
  display: flex;
  gap: 0.25rem;
  &>svg {
    flex-shrink: 0;
  }
`;

interface Props {
  invertColors?: boolean
}

export const IconRow: React.FC<Props> = ({ invertColors }) => <Wrap invertedColors={invertColors}>
  <Overlay invertedColors={invertColors} />
  {[...Array(4).keys()].map(i => <ListItem key={i}>
    <TableTennisPaddleBallIcon height={'1.64rem'} fill={styles.colors.gray[70]} />
    <FireFlameCurvedIcon height={'1.64rem'} fill={styles.colors.gray[70]} />
    <BowlingBallIcon height={'1.64rem'} fill={styles.colors.gray[70]} />
    <DumbellIcon height={'1.64rem'} fill={styles.colors.gray[70]} />
    <VolleyballIcon height={'1.64rem'} fill={styles.colors.gray[70]} />
    <GolfBallTeeIcon height={'1.64rem'} fill={styles.colors.gray[70]} />
    <SpaIcon height={'1.64rem'} fill={styles.colors.gray[70]} />
    <FutbolIcon height={'1.64rem'} fill={styles.colors.gray[70]} />
    <HeartIcon height={'1.64rem'} fill={styles.colors.gray[70]} />
    <WeightHangingIcon height={'1.64rem'} fill={styles.colors.gray[70]} />
    <BaseballIcon height={'1.64rem'} fill={styles.colors.gray[70]} />
    <PersonSwimmingIcon height={'1.64rem'} fill={styles.colors.gray[70]} />
  </ListItem>)}
</Wrap>