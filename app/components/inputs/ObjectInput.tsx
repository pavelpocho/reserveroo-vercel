import React from "react";
import styled from "styled-components";
import { styles } from "~/constants/styles";

interface IdInput {
  name?: string,
  value: string,
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
}

export const IdInput: React.FC<IdInput> = ({ name, value, onChange }: IdInput) => {

  return <>
    <input name={name} type='text' readOnly={true} value={value} hidden={true} onChange={onChange} />
  </>

}
