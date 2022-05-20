import React from "react";
import styled from "styled-components";
import CaretDownIcon from "~/assets/icons/CaretDown";
import { styles } from "~/constants/styles";
import { Button } from "../button";
import { IdInput } from "./ObjectInput";
import { TextInput } from "./TextInput";

type ValueAndText = {
  value: string;
  text: string;
}

interface MultiSelectorProps {
  possibleValuesAndTexts: ValueAndText[],
  defaultValuesAndTexts: ValueAndText[],
  name?: string,
  removedName?: string,
  placeholder?: string,
  addedName?: string,
}

const Wrap = styled.div`
  height: 2.375rem;
  position: relative;
`;

export const DropdownWrap = styled.div<{ visible: boolean }>`
  display: ${props => props.visible ? 'block' : 'none'};
  position: relative;
  width: 100%;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
`;

export const Dropdown = styled.div`
  position: absolute;
  z-index: 3;
  background-color: white;
  box-shadow: ${styles.shadows[1]};
  width: 100%;
  border-radius: 0.375rem;
  overflow: hidden;
  padding: 0;
`;

export const TextWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.25rem;
  height: 2.375rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const IconWrap = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DropdownButton = styled.button<{ highlighted: boolean }>`
  display: block;
  background-color: ${props => props.highlighted ? styles.colors.primary : styles.colors.white};
  color: ${props => props.highlighted ? styles.colors.white : styles.colors.black};
  border: none;
  width: 100%;
  text-align: left;
  padding: 0.4rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
`;

export const MultiSelectorInput: React.FC<MultiSelectorProps> = ({ name, placeholder, removedName, addedName, possibleValuesAndTexts, defaultValuesAndTexts }) => {
  
  // These keep track of what was added or removed compared to the default value
  // This is useful for updating the database, where when updating many relations,
  // you can specify a list of ids to disconnect and a list of ids to connect
  // It also lowers the amount of things sent

  const [ valuesAndTexts, setValuesAndTexts ] = React.useState<ValueAndText[]>(defaultValuesAndTexts);
  const [ addedValuesAndTexts, setAddedValuesAndTexts ] = React.useState<ValueAndText[]>([]);
  const [ removedValuesAndTexts, setRemovedValuesAndTexts ] = React.useState<ValueAndText[]>([]);
  const [ dropdown, setDropdown ] = React.useState<boolean>(false);

  return <Wrap>
    <TextWrap onClick={() => {
        console.log('x');
        setDropdown(true);
      }}>
      <TextInput placeholder={placeholder} style={{ cursor: 'pointer', whiteSpace: 'nowrap', textOverflow: 'ellipsis', paddingRight: '2.25rem' }} containerStyle={{ gridColumn: '1 / span 2', gridRow: '1' }} value={valuesAndTexts.map(v => v.text).join(', ')} readOnly={true} />
      <IconWrap>
        <CaretDownIcon height={'1rem'} />
      </IconWrap>
    </TextWrap>
    <DropdownWrap visible={dropdown}>
      <Overlay onClick={() => {
        setDropdown(false);
      }} />
      <Dropdown>
          { possibleValuesAndTexts.map(pv => <DropdownButton highlighted={valuesAndTexts.map(v => v.value).includes(pv.value)} key={pv.value} onClick={(e) => {
            e.preventDefault();
            setRemovedValuesAndTexts(() => {
              if (valuesAndTexts.find(v => v.value == pv.value) && defaultValuesAndTexts.find(v => v.value == pv.value)) {
                return [...removedValuesAndTexts, pv];
              }
              else if (removedValuesAndTexts.find(v => v.value == pv.value)) {
                return [...removedValuesAndTexts.filter(v => v.value != pv.value)]
              }
              else {
                return removedValuesAndTexts
              }
            });
            setAddedValuesAndTexts(() => {
              if (!defaultValuesAndTexts.find(v => v.value == pv.value) && !valuesAndTexts.find(v => v.value == pv.value)) {
                return [...addedValuesAndTexts, pv];
              }
              else if (addedValuesAndTexts.find(v => v.value == pv.value)) {
                return [...addedValuesAndTexts.filter(v => v.value != pv.value)]
              }
              else {
                return addedValuesAndTexts
              }
            });
            setValuesAndTexts(() => {
              if (valuesAndTexts.find(v => v.value == pv.value)) {
                return [...valuesAndTexts.filter(v => v.value != pv.value)]
              }
              else {
                return [...valuesAndTexts, pv];
              }
            });
          }}
        >{pv.text}</DropdownButton>) }
      </Dropdown>
    </DropdownWrap>
    { name && valuesAndTexts.map(v => <IdInput key={v.value} name={name} value={v.value} />) }
    { removedName && removedValuesAndTexts.map(v => <IdInput key={v.value} name={removedName} value={v.value} />) }
    { addedName && addedValuesAndTexts.map(v => <IdInput key={v.value} name={addedName} value={v.value} />) }
  </Wrap>
}
