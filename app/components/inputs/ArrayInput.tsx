import React, { PropsWithChildren } from "react";
import styled from "styled-components";
import { styles } from "~/constants/styles";

interface ArrayInputProps {
  deletedIdsName?: string,
  deletedIds?: string[],
  arrayTitle: string,
  children?: React.ReactNode,
  onAdd?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  addButtonText?: string
}

export const ArrayInput: React.FC<ArrayInputProps> = <T,>({ onAdd, deletedIdsName, deletedIds, arrayTitle, children, addButtonText }: ArrayInputProps) => {

  return <div>
    <label>{arrayTitle}</label>
    { deletedIdsName && deletedIds ? deletedIds.map(id => (
      <input key={id} name={ deletedIdsName } type='text' readOnly={true} value={id} hidden={true} />
    )) : null }
    { children }
    { onAdd && addButtonText && <button onClick={(e) => {
      e.preventDefault();
      onAdd(e);
    }}>{addButtonText}</button> }
  </div>

}
