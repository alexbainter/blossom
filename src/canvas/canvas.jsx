import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import uuid from 'uuid';
import NoSleep from 'nosleep.js';
import Circle from './circle/circle.component.jsx';
import generation$ from '../core/input/generation.source';
import makeInputSource from '../core/input/make-input-source';
import feedbackDelay from '../core/operators/feedback-delay.operator';
import WithPlayer from '../with-player.component.jsx';
import colored from '../core/operators/colored.operator';
import './canvas.styles.scss';

const useForceRender = () => {
  const [state, setState] = useState();
  return () => setState(state);
};

const useNoSleep = () => {
  const noSleepRef = useRef(new NoSleep());
  return [
    () => noSleepRef.current.enable(),
    () => noSleepRef.current.disable(),
  ];
};

const Canvas = ({ player }) => {
  const forceRender = useForceRender();
  const coordinatesRef = useRef([]);
  const container = useRef(null);
  const initializer = useRef(null);
  const circleDisplay = useRef(null);
  const [isInitialized, setInitialized] = useState(false);
  const [enableNoSleep, disableNoSleep] = useNoSleep();

  useEffect(
    () => {
      container.current.ontouchend = event.preventDefault();
      const input$ = makeInputSource(container.current);
      const delay = Math.random() * 5000 + 7000;
      const inputSubscription = input$
        .pipe(
          colored(),
          feedbackDelay(delay)
        )
        .subscribe(coordinate => {
          if (!isInitialized) {
            enableNoSleep();
            setInitialized(true);
          }
          coordinatesRef.current.push(
            Object.assign({}, coordinate, { id: uuid(), delay })
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

  const touchendRefs = [initializer, container, circleDisplay];

  useEffect(() => {
    touchendRefs.forEach(ref => {
      if (ref.current) {
        ref.current.ontouchend = () => {
          event.preventDefault();
        };
      }
    });
  }, touchendRefs);

  const removeCircle = ({ id }) => {
    coordinatesRef.current.splice(
      coordinatesRef.current.findIndex(c => c.id === id),
      1
    );
    forceRender();
  };
  const contents = isInitialized ? (
    <TransitionGroup ref={circleDisplay}>
      {coordinatesRef.current.map(c => (
        <CSSTransition
          timeout={{ enter: 7100, exit: 0 }}
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
  ) : (
    <div className="initializer" ref={initializer}>
      Press anywhere
    </div>
  );
  return (
    <div className="canvas" ref={container}>
      {contents}
    </div>
  );
};

render(<WithPlayer Component={Canvas} />, document.getElementById('root'));
