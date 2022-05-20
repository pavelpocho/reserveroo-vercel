import React from "react";
import styled from "styled-components";
import { styles } from "~/constants/styles";

interface NumberInputProps {
  name: string,
  title: string,
  defaultValue: number
}

const NumberInputField = styled.input`
  font-size: 0.8rem;
  line-height: 2rem;
  padding: 0rem 1rem;
  border: 1.5px solid ${styles.colors.gray[30]};
  border-radius: 0.3rem;
  outline: none;
  &:focus {
    border: 1.5px solid ${styles.colors.gray[50]};
  }
`;

export const NumberInput: React.FC<NumberInputProps> = ({ name, title, defaultValue }: NumberInputProps) => {

  const [ value, setValue ] = React.useState<number | null>(defaultValue);

  return <div>
    <label>{title}</label>
    <NumberInputField type='text' value={value?.toString() ?? ''} onChange={(e) => {
      if (e.currentTarget.value == '') {
        setValue(null);
      }
      else if (!isNaN(parseInt(e.currentTarget.value))) {
        setValue(parseInt(e.currentTarget.value));
      }
    }} />
    <input name={name} type='number' readOnly={true} value={value ?? ''} hidden={true} />
  </div>

}
