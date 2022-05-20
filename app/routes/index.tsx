import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { Link } from "@remix-run/react";
import React from "react";
import styled from "styled-components";
import { styles } from "~/constants/styles";
import { useWhereAreWe } from "~/contexts/whereAreWeContext";
import { faCircleArrowDown, faQuestion } from "@fortawesome/free-solid-svg-icons";

const H1 = styled.h1`
  margin-top: 4rem;
  color: ${styles.colors.primary};
  text-align: center;
`;

const Button = styled.button`
  color: ${styles.colors.white};
  background-color: ${styles.colors.primary};
  border-radius: 0.4rem;
  padding: 0.7rem;
  cursor: pointer;
  margin: 0 auto;
  display: block;
  border: none;
`;

const Wrapper = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${styles.shadows[1]};
  width: 300px;
  padding: 2rem;
  color: ${styles.colors.primary};
  background-color: ${styles.colors.gray};
`;

const ALink = styled(Link)`
  text-decoration: none;
`;

// const Arrow = styled(FontAwesomeIcon)`
//   display: flex;
//   margin: 0 auto;
//   font-size: 2.5rem;
//   color: ${styles.colors.primary};
// `;

// const FirstQuestionMark = styled(FontAwesomeIcon)`
//   margin-left: 2rem;
//   font-size: 2.5rem;
//   transform: rotate(25deg);
// `

export default function About() {
  const { setLandingPage } = useWhereAreWe();

  React.useEffect(() => {
    setLandingPage(true);
    return () => {
      setLandingPage(false);
    };
  }, []);

  return (
    <>
      <Parallax pages={6}>
        <ParallaxLayer factor={1} speed={0.3}>
          <H1>
            All the
            <span style={{ color: styles.colors.busy }}> activities </span>
            you love in
            <span style={{ color: styles.colors.busy }}> one place</span>
          </H1>
          <ALink to='/places'>
            <Button>Check out activities</Button>
          </ALink>
          <H1>Why was Reserveroo created?</H1>
          {/* <Arrow icon={faCircleArrowDown}></Arrow> */}
          <p style={{ textAlign: "center" }}>Scroll down</p>
        </ParallaxLayer>
        <ParallaxLayer
          offset={1}
          factor={0.5}
          speed={0.4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: styles.colors.busy,
          }}
        >
          <Wrapper>
            Imagine you are in a new city and you want to have some fun with
            your friend.
            <br />
            What do you do?
          </Wrapper>
        </ParallaxLayer>

        <ParallaxLayer sticky={{ start: 1.3 }}>
          {/* <FirstQuestionMark icon={faQuestion}></FirstQuestionMark> */}
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={0.5}
          factor={0.5}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "red",
          }}
        >
          {/* <QuestionIcon></QuestionIcon> */}
          <Wrapper>
            How do you find out what activities are available?
            <br />A Google search perhaps?
          </Wrapper>
          {/* <QuestionIcon></QuestionIcon> */}
        </ParallaxLayer>

        <ParallaxLayer
          offset={3}
          factor={0.5}
          speed={0.6}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: styles.colors.busy,
          }}
        >
          <Wrapper>Do you look at each website that pops up?</Wrapper>
        </ParallaxLayer>

        <ParallaxLayer
          offset={4}
          factor={0.5}
          speed={0.7}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: styles.colors.busy,
          }}
        >
          <Wrapper>How do you know each place is legit and open?</Wrapper>
        </ParallaxLayer>

        <ParallaxLayer
          offset={5}
          factor={0.5}
          speed={0.8}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: styles.colors.busy,
          }}
        >
          <Wrapper>Do you have to book a spot? No? Are you sure?</Wrapper>
        </ParallaxLayer>

        <ParallaxLayer
          offset={6}
          factor={0.5}
          speed={2}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: styles.colors.busy,
          }}
        >
          <Wrapper>How do you book a spot?</Wrapper>
        </ParallaxLayer>
      </Parallax>
    </>
  );
}
