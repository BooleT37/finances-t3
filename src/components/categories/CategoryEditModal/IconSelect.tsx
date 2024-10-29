import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select, Space } from "antd";
import { type SelectProps } from "antd/lib";
import { useCallback, useMemo } from "react";
import { CategoryIconComp } from "../categoryIcons/CategoryIconComp";
import { categoryIconsGroups } from "../categoryIcons/categoryIcons";

interface Props {
  value?: string;
  onChange?: (value: string | null) => void;
}

interface SelectOption {
  label: React.ReactNode;
  value: string;
  text: string;
  group: string;
}
// eslint-disable-next-line mobx/missing-observer
export const IconSelect: React.FC<Props> = ({ value, onChange }) => {
  const options = useMemo(
    () =>
      categoryIconsGroups.map((group) => ({
        label: group.group,
        options: group.icons.map((icon) => ({
          label: (
            <Space>
              <div style={{ width: 20 }}>
                <FontAwesomeIcon icon={icon.icon} />
              </div>
              <div style={{ color: "gray" }}>{icon.label}</div>
            </Space>
          ),
          value: icon.value,
          text: icon.label,
          group: group.group,
        })),
      })),
    []
  );

  const labelRender = useCallback<Required<SelectProps>["labelRender"]>(
    ({ value }) => {
      if (value === "" || typeof value !== "string") {
        return "";
      }
      return <CategoryIconComp value={value} />;
    },
    []
  );

  return (
    <Select
      showSearch
      value={value}
      onSelect={onChange}
      allowClear
      onClear={() => onChange?.(null)}
      style={{ width: "120px" }}
      labelRender={labelRender}
      filterOption={(input, option) => {
        if (option?.options) {
          return false;
        }
        const inputLower = input.toLowerCase().trim();
        return (
          (option as unknown as SelectOption).group
            .toLowerCase()
            .includes(inputLower) ||
          (option as unknown as SelectOption).text
            .toLowerCase()
            .includes(inputLower) ||
          (option as unknown as SelectOption).value
            .toLowerCase()
            .includes(inputLower)
        );
      }}
      popupMatchSelectWidth={false}
      options={options}
    />
  );
};
