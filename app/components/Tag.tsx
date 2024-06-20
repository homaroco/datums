import { getContrastColor } from "../lib/color";
import { TagProps } from "../types";

export function Tag({ name, value, unit, color }: TagProps) {
  let roundedValue = "rounded-tr rounded-br";
  let padding = "pr-[6px]";
  if (unit) roundedValue = "";
  if (!value) padding = "pr-[8px]";
  return (
    <span className="tag inline-flex rounded overflow-hidden h-[30px] font-bold mr-[5px] whitespace-nowrap">
      {name && (
        <button
          className={`inline-flex relative items-center ${padding} pl-[8px]`}
          style={{ backgroundColor: color, color: getContrastColor(color) }}
        >
          {name}
        </button>
      )}
      {value && (
        <button
          className={`inline-flex relative items-center px-[6px] border-2 ${roundedValue}`}
          style={{
            color,
            borderColor: color,
            background: getContrastColor(color),
          }}
        >
          {value}
        </button>
      )}
      {unit && (
        <button
          className="pr-[6px] pl-[4px]"
          style={{ background: color, color: getContrastColor(color) }}
        >
          {unit}
        </button>
      )}
    </span>
  );
}
