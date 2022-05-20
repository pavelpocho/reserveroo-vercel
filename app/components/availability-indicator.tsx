import styled from "styled-components"
import { styles } from "~/constants/styles";
import { useLangs } from "~/contexts/langsContext";
import { FreeOrBusy } from "~/types/types";

const Wrap = styled.div`
  display: flex;
`;

const Indicator = styled.div<{ color: FreeOrBusy }>`
  height: 1rem;
  width: 1rem;
  background-color: ${props => styles.colors[props.color]};
`;

const Text = styled.p<{ color: FreeOrBusy }>`
  color: ${props => styles.colors[props.color]};
  margin: 0;
`;

interface AvailabilityIndicatorProps {
  color: FreeOrBusy
}

export const AvailabilityIndicator: React.FC<AvailabilityIndicatorProps> = ({ color }: AvailabilityIndicatorProps) => {
  const { translations: l } = useLangs();
  return <Wrap>
    <Indicator color={color} />
    <Text color={color}>{color == 'free' ? l.availability.mostlyFree : l.availability.fairlyBusy}</Text>
  </Wrap>
}