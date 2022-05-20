import styled from "styled-components";
import { useLangs } from "~/contexts/langsContext";
import { TagWithTexts } from "~/types/types"
import { TagCategoryButton } from "../search/search-ui";

interface TagListProps {
  tags: TagWithTexts[]
}

const Wrap = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-self: center;
`;

export const TagList: React.FC<TagListProps> = ({ tags }) => {

  const { lang } = useLangs();

  return <Wrap>
    { tags.map(t => <TagCategoryButton noCursor={true} selected={false} key={t.id}>{t.multiLangName && t.multiLangName[lang]}</TagCategoryButton>) }
  </Wrap>
}