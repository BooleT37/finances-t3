import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByValue } from "./categoryIcons";

interface Props {
  value: string;
}

export const CategoryIconComp: React.FC<Props> = ({ value }) => {
  const foundIcon = getIconByValue(value);
  if (!foundIcon) {
    return null;
  }
  return <FontAwesomeIcon icon={foundIcon} />;
};
