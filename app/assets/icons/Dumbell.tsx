import { SVGProps } from 'react';
import { styles } from '~/constants/styles';

const DumbellIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 640 512"
    style={{
      height: props.height
    }}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M104 96h-48C42.75 96 32 106.8 32 120V224C14.33 224 0 238.3 0 256c0 17.67 14.33 32 31.1 32L32 392C32 405.3 42.75 416 56 416h48C117.3 416 128 405.3 128 392v-272C128 106.8 117.3 96 104 96zM456 32h-48C394.8 32 384 42.75 384 56V224H256V56C256 42.75 245.3 32 232 32h-48C170.8 32 160 42.75 160 56v400C160 469.3 170.8 480 184 480h48C245.3 480 256 469.3 256 456V288h128v168c0 13.25 10.75 24 24 24h48c13.25 0 24-10.75 24-24V56C480 42.75 469.3 32 456 32zM608 224V120C608 106.8 597.3 96 584 96h-48C522.8 96 512 106.8 512 120v272c0 13.25 10.75 24 24 24h48c13.25 0 24-10.75 24-24V288c17.67 0 32-14.33 32-32C640 238.3 625.7 224 608 224z"
      fill={props.fill ?? styles.colors.black}
    />
  </svg>
);

export default DumbellIcon;