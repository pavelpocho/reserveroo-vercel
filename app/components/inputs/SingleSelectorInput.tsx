import React from "react";
import styled from "styled-components";
import CaretDownIcon from "~/assets/icons/CaretDown";
import { Button } from "../button";
import { Dropdown, DropdownButton, DropdownWrap, IconWrap, Overlay, TextWrap } from "./MultiSelectorInput";
import { IdInput } from "./ObjectInput";
import { TextInput } from "./TextInput";

type ValueAndText = {
  value: string;
  text: string;
}

interface SingleSelectorProps {
  possibleValuesAndTexts: ValueAndText[],
  defaultValueAndText: ValueAndText | null,
  name?: string,
  title?: string,
  placeholder?: string
}

const Wrap = styled.div`
  height: 2rem;
`;

export const SingleSelectorInput: React.FC<SingleSelectorProps> = ({ title, placeholder, name, possibleValuesAndTexts, defaultValueAndText }) => {

  const [ valueAndText, setValueAndText ] = React.useState<ValueAndText | null>(defaultValueAndText);
  const [ dropdown, setDropdown ] = React.useState<boolean>(false);

  return <Wrap>
    <TextWrap onClick={() => {
        console.log('x');
        setDropdown(true);
      }}>
      <TextInput placeholder={placeholder} style={{ cursor: 'pointer', whiteSpace: 'nowrap', textOverflow: 'ellipsis', paddingRight: '2.25rem' }} containerStyle={{ gridColumn: '1 / span 2', gridRow: '1' }} value={valueAndText?.text} readOnly={true} />
      <IconWrap>
        <CaretDownIcon height={'1rem'} />
      </IconWrap>
    </TextWrap>
    <DropdownWrap visible={dropdown}>
      <Overlay onClick={() => {
        setDropdown(false);
      }} />
      <Dropdown>
        { possibleValuesAndTexts.map(pv => <DropdownButton highlighted={pv.value == valueAndText?.value} key={pv.value} onClick={(e) => {
          e.preventDefault();
          if (pv.value == valueAndText?.value) {
            setValueAndText(null);
          }
          else {
            setValueAndText(pv);
          }
          setDropdown(false);
        }}>{pv.text}</DropdownButton>) }
      </Dropdown>
    </DropdownWrap>
    { name && valueAndText?.value && <IdInput key={valueAndText.value} name={name} value={valueAndText.value} /> }
  </Wrap>
}
