import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByValue } from "./categoryIcons";

interface Props {
  value: string;
}

// eslint-disable-next-line mobx/missing-observer
export const CategoryIconComp: React.FC<Props> = ({ value }) => {
  const foundIcon = getIconByValue(value);
  if (!foundIcon) {
    return null;
  }
  return <FontAwesomeIcon icon={foundIcon} />;
};
