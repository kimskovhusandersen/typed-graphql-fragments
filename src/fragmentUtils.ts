import { FieldSelectionConfig } from "./types";

// Overload signatures
export function generateTemplate<T>(
  config: FieldSelectionConfig<T>,
  asFieldConfig: true
): FieldSelectionConfig<T>;

export function generateTemplate<T>(
  config: FieldSelectionConfig<T>,
  asFieldConfig?: false | undefined
): string;

export function generateTemplate<T>(
  config: FieldSelectionConfig<T>,
  asFieldConfig?: boolean
): string | FieldSelectionConfig<T> {
  const buildFields = (obj: any, indentLevel: number = 0): string => {
    const indent = "  ".repeat(indentLevel);

    if (Array.isArray(obj)) {
      return obj.map((item) => buildFields(item, indentLevel)).join("\n");
    }

    return Object.entries(obj)
      .filter(([, value]) => value !== false)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${indent}${key} {\n${buildFields(
            value,
            indentLevel + 1
          )}\n${indent}}`;
        } else if (typeof value === "object" && value !== null) {
          const nestedFields = buildFields(value, indentLevel + 1);
          return `${indent}${key} {\n${nestedFields}\n${indent}}`;
        } else if (value === true) {
          return `${indent}${key}`;
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");
  };

  return asFieldConfig ? config : `\n${buildFields(config, 1)}\n`;
}

export function createFragment<T>(config: FieldSelectionConfig<T>) {
  return <B extends boolean | undefined = undefined>(
    asFieldConfig?: B
  ): B extends true ? FieldSelectionConfig<T> : string => {
    if (asFieldConfig) {
      return generateTemplate<T>(config, true) as any;
    } else {
      return generateTemplate<T>(config, false) as any;
    }
  };
}
