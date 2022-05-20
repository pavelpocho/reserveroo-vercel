import React from "react";
import styled from "styled-components";
import { styles } from "~/constants/styles";
import { getStringTimeValue } from "~/utils/forms";

interface TimeInputProps {
  name: string,
  defaultValue: Date | null,
  title: string
}

const isTimePossible = (value: string): boolean => {
  return /^(?:(?:[0-1]|$)(?:\d|$)|(?:[2]|$)(?:[0-3]|$))(?::|$)(?:(?:[0-5]|$)(?:\d|$))$/.test(value);
}

const isTimeValid = (value: string): boolean => {
  return /^(?:(?:[0-1])(?:\d)|(?:[2])(?:[0-3]))(?::)(?:(?:[0-5])(?:\d))$/.test(value);
}

const TimeInputField = styled.input`
  font-size: 0.8rem;
  line-height: 2rem;
  padding: 0rem 1rem;
  border: 1.5px solid ${styles.colors.gray[30]};
  border-radius: 0.3rem;
  outline: none;
  width: 5ch;
  &:focus {
    border: 1.5px solid ${styles.colors.gray[50]};
  }
`;

export const TimeInput: React.FC<TimeInputProps> = ({ name, defaultValue, title }: TimeInputProps) => {

  const [ value, setValue ] = React.useState<string>(defaultValue ? getStringTimeValue(defaultValue) : '');
  const [ isValid, setIsValid ] = React.useState<boolean>(isTimeValid(value));

  React.useEffect(() => {
    setIsValid(isTimeValid(value));
  }, [value]);

  return <div>
    <label>{title}</label>
    <TimeInputField type='text' value={value} onChange={(e) => {
      if (isTimePossible(e.currentTarget.value)) setValue(e.currentTarget.value);
    }} />
    <input name={name} type='time' readOnly={true} value={value} hidden={true} />
  </div>

}
