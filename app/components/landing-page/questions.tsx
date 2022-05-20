import { Parallax, ParallaxLayer } from "@react-spring/parallax";

function Questions() {
  return (
    <Parallax pages={2}>
      <ParallaxLayer
        speed={0.5}
      >
        <p>Scroll down</p>
      </ParallaxLayer>

      <ParallaxLayer
        offset={1}
        speed={0.6}
        style={{ backgroundColor: "#ff6d6d" }}
      />

      <ParallaxLayer
        offset={1}
        speed={0.5}
      >
        <p>Scroll up</p>
      </ParallaxLayer>
    </Parallax>
  );
}

export default Questions