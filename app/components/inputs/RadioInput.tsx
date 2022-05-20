import React from "react";
import styled, { css } from "styled-components";
import { styles } from "~/constants/styles";

interface RadioInputProps {
  name: string,
  title: string,
  values: {
    id: string;
    name: string;
  }[]
  defaultValue: {
    id: string;
    name: string;
  } | null
}

const RadioInputField = styled.input`
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

export const RadioInput: React.FC<RadioInputProps> = ({ name, title, values, defaultValue }: RadioInputProps) => {

  const [ valueId, setValueId ] = React.useState(defaultValue?.id ?? '')

  return <div>
    <label>{title}</label>
    <input type='text' name='reservableId' readOnly={true} value={valueId} hidden={true} />
    { values.map(v => <button style={v.id == valueId ? { backgroundColor: 'red' } : {}} key={v.id} onClick={(e) => {
      e.preventDefault();
      setValueId(valueId == v.id ? '' : v.id);
    }}>{v.name}</button>) }
  </div>

}
