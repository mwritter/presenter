import { GroupType } from "./components/show/helpers/slide.helper";

export const song: SongType = {
  id: 123,
  title: "Mighty Worrior",
  content: [
    {
      text: "You call us out from the depths Into Your freedom",
      group: "VERSE",
    },
    {
      text: "You call us out from the depths Into Your freedom",
      group: "VERSE",
    },
    {
      text: "You call us out from the depths Into Your freedom",
      group: "CHORUS",
    },
    {
      text: "You call us out from the depths Into Your freedom",
      group: "VERSE",
    },
    {
      text: "You call us out from the depths Into Your freedom",
      group: "VERSE",
    },
    {
      text: "You call us out from the depths Into Your freedom",
      group: "CHORUS",
    },
    {
      text: "You call us out from the depths Into Your freedom",
      group: "VERSE",
    },
    {
      text: "You call us out from the depths Into Your freedom",
      group: "VERSE",
    },
    {
      text: "You call us out from the depths Into Your freedom",
      group: "CHORUS",
    },
  ],
};

export const slides = [song, { ...song, id: 345 }];

type SongType = {
  id: number;
  title: string;
  content: { text: string; group: GroupType }[];
};

export const playlist = [
  {
    header: "",
    filePath: "",
    data: null,
  },
  {
    header: "",
    filePath: "",
    data: null,
  },
];
