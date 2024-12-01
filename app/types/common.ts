export type FormValues = {
  name: string;
  link: string;
};

export type MenuItem = {
  id: string;
  name: string;
  link: string;
  children?: MenuItem[];
};

export enum HoverPosition {
  Top = "top",
  Bottom = "bottom",
  BottomChildren = "bottomChildren",
}
