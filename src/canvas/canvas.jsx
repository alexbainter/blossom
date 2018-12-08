import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import uuid from 'uuid';
import Circle from './circle/circle.component.jsx';
import generation$ from '../core/input/generation.source';
import makeClickSource from '../core/input/make-click-source';
import feedbackDelay from '../core/operators/feedback-delay.operator';
import WithPlayer from '../with-player.component.jsx';
import colored from '../core/operators/colored.operator';

const useForceRender = () => {
  const [state, setState] = useState();
  return () => setState(state);
};

const Canvas = ({ player }) => {
  const forceRender = useForceRender();
  const coordinatesRef = useRef([]);
  const container = useRef(null);
  useEffect(
    () => {
      //const clicks$ = makeClickSource(container.current);
      const inputSubscription = generation$
        .pipe(
          colored(),
          feedbackDelay(Math.random() * 7000 + 5000)
        )
        .subscribe(coordinate => {
          coordinatesRef.current.push(
            Object.assign({}, coordinate, { id: uuid() })
          );
          player(coordinate);
          forceRender();
        });
      return () => {
        inputSubscription.unsubscribe();
      };
    },
    [container]
  );

  const removeCircle = ({ id }) => {
    coordinatesRef.current.splice(
      coordinatesRef.current.findIndex(c => c.id === id),
      1
    );
    forceRender();
  };
  return (
    <div style={{ height: '100%' }} ref={container}>
      <TransitionGroup style={{ height: '100%' }}>
        {coordinatesRef.current.map(c => (
          <CSSTransition
            timeout={{ enter: 6100, exit: 0 }}
            onEntering={el =>
              Object.assign(el.style, {
                left: `calc(${c.xPct}% - 250px)`,
                top: `calc(${c.yPct}% - 250px)`,
                opacity: 0,
              })
            }
            onEntered={() => removeCircle(c)}
            classNames="circle"
            key={c.id}
          >
            <Circle
              xPct={c.xPct}
              yPct={c.yPct}
              opacity={c.velocity}
              color={c.color}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

render(<WithPlayer Component={Canvas} />, document.getElementById('root'));
