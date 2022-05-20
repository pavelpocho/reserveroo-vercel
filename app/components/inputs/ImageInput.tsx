import React from "react";
import { IdInput } from "./ObjectInput";

interface ImageInputProps {
  name: string,
  hidden?: boolean,
  onChange?: (v: string | null | undefined) => void
}

export const ImageInput: React.FC<ImageInputProps> = ({ name, hidden, onChange }) => {

  return <div style={{ visibility: hidden ? 'hidden' : 'visible' }}>
    <input type='file' name={name} accept='.png,.jpg,.jpeg,.webp,.gif' onChange={(e) => {
      if (onChange) onChange(e.currentTarget.value);
    }} />
  </div>
}