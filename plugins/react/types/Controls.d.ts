export declare const NumberControl: ({
  reference,
  key,
  ...props
}: {
  reference: Record<string, any>;
  key: string;
} & {
  label?: string;
  watch?: boolean;
} & {
  range?: [number, number];
  stepSize?: number;
}) => any;
export declare const TextControl: ({
  reference,
  key,
  ...props
}: {
  reference: Record<string, any>;
  key: string;
} & {
  label?: string;
  watch?: boolean;
} & {
  keys?: string[];
  labels?: string[];
}) => any;
