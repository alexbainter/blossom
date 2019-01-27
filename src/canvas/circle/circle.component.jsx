import React from 'react';
import './circle.styles.scss';

const Circle = ({ xPct, yPct, color, opacity }) => (
  <div
    className="circle"
    style={{
      backgroundColor: color,
      left: `calc(${xPct}% - 250px)`,
      top: `calc(${yPct}% - 250px)`,
      opacity: opacity,
    }}
  />
);

export default Circle;
