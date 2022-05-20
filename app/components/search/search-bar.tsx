import { LoaderFunction } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import React from "react";
import styled from "styled-components"
import SearchIcon from "~/assets/icons/Search";
import { styles } from "~/constants/styles";
import { useLangs } from "~/contexts/langsContext";

interface SearchBarProps {
  defaultValue?: string,
}

const SearchBarWrap = styled.div`
  height: 3.25rem;
  box-shadow: ${styles.shadows[1]};
  background-color: ${styles.colors.white};
  border-radius: 0.375rem;
  display: flex;
  position: relative;
  align-items: stretch;
  justify-content: stretch;
  gap: 0.9rem;
  align-items: center;
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  & input {
    border: none;
    outline: none;
    font-size: 1.2rem;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0px;
  }
`;

export const SearchBar: React.FC<SearchBarProps> = ({ defaultValue }: SearchBarProps) => {

  const { translations: l } = useLangs();

  return <SearchBarWrap>
    <SearchIcon height={'1rem'} fill={styles.colors.gray[90]} />
    <input placeholder={l.searchPlaceholder} name='searchTerm' type='text' defaultValue={defaultValue} />
  </SearchBarWrap>
}