export interface Screen {
  name: string;
  component: () => JSX.Element;
}
