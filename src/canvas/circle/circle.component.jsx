import React from 'react';
import './circle.styles.scss';

const Circle = ({ xPct, yPct, color, opacity }) => (
  <div
    className="circle"
    style={{
      backgroundColor: color,
      left: `${xPct}%`,
      top: `${yPct}%`,
      opacity: opacity,
    }}
  />
);

export default Circle;
