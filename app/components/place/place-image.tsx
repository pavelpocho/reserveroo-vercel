import styled from "styled-components"
import { styles } from "~/constants/styles";
import { ImageShape } from "~/types/types";

const ImageWrap = styled.div<{ shape: ImageShape }>`
  border-radius: ${props => props.shape == 'circle' ? '100%' : '8px'};
  aspect-ratio: ${props => props.shape == 'circle' ? '1' : ''};
  overflow: hidden;
  width: ${props => props.shape == 'square' ? '100%' : '9rem'};
  height: ${props => props.shape == 'square' ? '100%' : '9rem'};
  align-self: center;
  box-shadow: ${props => props.shape == 'circle' ? styles.shadows[1] : ''};
  background-color: ${styles.colors.gray[30]};
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  height: 100%;
`;

interface PlaceImageProps {
  shape: ImageShape,
  imageUrl: string | null | undefined
}

export const PlaceImage: React.FC<PlaceImageProps> = ({ shape, imageUrl }) => {

  return <ImageWrap shape={shape}>
    {imageUrl && <Image loading='lazy' src={/*imageUrl*/''} />}
  </ImageWrap>
}