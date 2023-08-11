import app from "../app-logo.jpg";
import javaScript from "../js-logo.png";
import angular from "../angular-logo.png";
import react from "../react-logo.png";
import next from "../next-logo.png";
import phone from "../phone-solid.svg";
import radio from "../radio-solid.svg";

export const d3Nodes = [
  {
    index: 0,
    r: 35,
    icon: app,
    x: 3.474105281373113,
    y: -322.67023955207907,
  },
  {
    index: 1,
    r: 35,
    icon: javaScript,
    x: 3.98930250217461,
    y: -158.74868789850302,
  },
  {
    index: 2,
    r: 35,
    icon: angular,
    x: -138.80979040587215,
    y: 14.468417172968714,
  },
  {
    index: 3,
    r: 35,
    icon: react,
    x: 103.97006992652467,
    y: 36.64253926810437,
  },
  {
    index: 4,
    r: 35,
    icon: next,
    x: 325.79293974057543,
    y: 36.78072799528189,
  },
];
export const d3Links = [
  {
    source: 0,
    target: 1,
    icon: phone,
  },
  {
    source: 1,
    target: 0,
  },
  {
    source: 1,
    target: 2,
    icon: radio,
  },
  {
    source: 1,
    target: 3,
    icon: radio,
  },
  {
    source: 3,
    target: 4,
    icon: radio,
  },
];
export const allData = {
  d3Data: [
    {
      r: 35,
      x: 3.474105281373113,
      y: -322.67023955207907,
      icon: app,
      target: [
        {
          id: 1,
          source: { x: 15.474105281373113, y: -322.67023955207907 },
          target: { x: 15.98930250217461, y: -158.74868789850302 },
          icon: phone,
        },
      ],
    },
    {
      r: 35,
      x: 3.98930250217461,
      y: -158.74868789850302,
      icon: javaScript,
      target: [
        {
          id: 0,
          source: { x: 3.98930250217461, y: -158.74868789850302 },
          target: { x: 3.474105281373113, y: -322.67023955207907 },
        },
        {
          id: 2,
          source: { x: 3.98930250217461, y: -158.74868789850302 },
          target: { x: -138.80979040587215, y: 14.468417172968714 },
          icon: radio,
        },
        {
          id: 3,
          source: { x: 3.98930250217461, y: -158.74868789850302 },
          target: { x: 103.97006992652467, y: 36.64253926810437 },
          icon: radio,
        },
      ],
    },
    {
      r: 35,
      x: -138.80979040587215,
      y: 14.468417172968714,
      icon: angular,
      target: [],
    },
    {
      r: 35,
      x: 103.97006992652467,
      y: 36.64253926810437,
      icon: react,
      target: [
        {
          id: 4,
          source: { x: 103.97006992652467, y: 36.64253926810437 },
          target: { x: 325.79293974057543, y: 36.78072799528189 },
          icon: radio,
        },
      ],
    },
    {
      r: 35,
      x: 325.79293974057543,
      y: 36.78072799528189,
      icon: next,
      target: [],
    },
    // {
    //   r: 35,
    //   x: 3.79293974057543,
    //   y: -290.9587351646175,
    //   icon: next,
    //   target: [],
    // },
  ],
};
