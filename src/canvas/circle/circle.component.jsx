import React from 'react';
import './circle.styles.scss';

const Circle = ({ xPct, yPct, color = 'coral', opacity }) => (
  <div
    className="circle"
    style={{
      backgroundColor: color,
      left: `${xPct}%`,
      top: `${yPct}%`,
      opacity: opacity,
      color: color,
    }}
  />
);

export default Circle;
