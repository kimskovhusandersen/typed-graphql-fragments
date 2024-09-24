export type FieldSelectionConfig<T> = T extends object
  ? {
      [P in keyof T]?: T[P] extends (infer U)[]
        ? FieldSelectionConfig<U>[] | boolean
        : FieldSelectionConfig<T[P]> | boolean;
    }
  : boolean;