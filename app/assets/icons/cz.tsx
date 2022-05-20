import { SVGProps } from 'react';
import { styles } from '~/constants/styles';

const CzIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 640 480"
    style={{
      height: props.height
    }}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="#fff" d="M0 0h640v240H0z"/>
    <path fill="#d7141a" d="M0 240h640v240H0z"/>
    <path fill="#11457e" d="M360 240 0 0v480z"/>
  </svg>
);

export default CzIcon;