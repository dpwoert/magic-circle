declare module '*.svg' {
  const content: string;
  const ReactComponent: React.FunctionComponent<
    React.SVGAttributes<SVGElement>
  >;
  export const ReactComponent;
  export default content;
}
