import { SVGProps } from 'react';
import { styles } from '~/constants/styles';

const TableListIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 512 512"
    style={{
      height: props.height
    }}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 96C0 60.65 28.65 32 64 32H448C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96zM64 160H128V96H64V160zM448 96H192V160H448V96zM64 288H128V224H64V288zM448 224H192V288H448V224zM64 416H128V352H64V416zM448 352H192V416H448V352z"
      fill={props.fill ?? styles.colors.black}
    />
  </svg>
);

export default TableListIcon;