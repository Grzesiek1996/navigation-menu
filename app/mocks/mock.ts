import { MenuItem } from "../types";

export const MockItems: MenuItem[] = [
  {
    id: "1",
    name: "Promocje",
    link: "/promocje",
    children: [
      {
        id: "1-1",
        name: "Zimowe",
        link: "/promocje/zimowe",
        children: [
          {
            id: "1-1-1",
            name: "Zimowe 1",
            link: "/promocje/zimowe/1",
          },
          {
            id: "1-1-2",
            name: "Zimowe 2",
            link: "/promocje/zimowe/2",
          },
        ],
      },
      {
        id: "1-2",
        name: "Letnie",
        link: "/promocje/letnie",
      },
    ],
  },
  {
    id: "2",
    name: "O nas",
    link: "/o-nas",
  },
  {
    id: "3",
    name: "Kontakt",
    link: "/kontakt",
  },
  {
    id: "4",
    name: "Zamówienia",
    link: "/zamowienia",
  },
];
