import React, { useState, useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import uuid from 'uuid';
import NoSleep from 'nosleep.js';
import { merge } from 'rxjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import Circle from './circle/circle.component.jsx';
import generation$ from '../core/input/generation.source';
import makeInputSource from '../core/input/make-input-source';
import feedbackDelay from '../core/operators/feedback-delay.operator';
import colored from '../core/operators/colored.operator';
import startAudioContext from '../audio/start-audio-context';
import './canvas.styles.scss';

const MIN_DELAY_MS = 7000;
const MAX_EXTRA_DELAY_MS = 5000;

const useForceRender = () => {
  //eslint-disable-next-line no-unused-vars
  const [state, setState] = useState(true);
  return () => setState(prevState => !prevState);
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
  const [isInitialized, setInitialized] = useState(false);
  const [enableNoSleep] = useNoSleep();
  const [generate, setGenerate] = useState(false);
  const generationToggleButton = useRef(null);
  const alexBainterLink = useRef(null);

  const toggleGeneration = () => {
    setGenerate(!generate);
  };

  useEffect(
    () => {
      container.current.ontouchend = event => event.preventDefault();
      let input$ = makeInputSource(container.current);
      if (generate) {
        input$ = merge(input$, generation$);
      }
      const delay = Math.random() * MAX_EXTRA_DELAY_MS + MIN_DELAY_MS;
      const inputSubscription = input$
        .pipe(
          colored(),
          feedbackDelay(delay)
        )
        .subscribe(coordinate => {
          if (!isInitialized) {
            startAudioContext();
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
    [container, generate]
  );

  const handleButtonEvent = event => {
    event.stopPropagation();
    toggleGeneration();
  };

  useEffect(() => {
    if (generationToggleButton.current) {
      generationToggleButton.current.onclick = handleButtonEvent;
      generationToggleButton.current.ontouchstart = handleButtonEvent;
    }
    if (alexBainterLink.current) {
      alexBainterLink.current.ontouchend = event => {
        event.stopPropagation();
      };
    }
  });

  const touchableRefs = [initializer, container];

  useEffect(() => {
    touchableRefs.forEach(ref => {
      if (ref.current) {
        ref.current.ontouchend = () => {
          event.preventDefault();
        };
      }
    });
  }, touchableRefs);

  const removeCircle = ({ id }) => {
    coordinatesRef.current.splice(
      coordinatesRef.current.findIndex(c => c.id === id),
      1
    );
    forceRender();
  };
  const contents = isInitialized ? (
    <div>
      <TransitionGroup>
        {coordinatesRef.current.map(c => (
          <CSSTransition
            timeout={{ enter: 7100, exit: 0 }}
            onEntering={el =>
              Object.assign(el.style, {
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
      <button className="generation-toggle-btn" ref={generationToggleButton}>
        <FontAwesomeIcon
          icon={generate ? faStopCircle : faPlayCircle}
          size="lg"
        />
      </button>
      <a
        href="https://alexbainter.com"
        className="alex-bainter-link"
        ref={alexBainterLink}
      >
        made by alex bainter
      </a>
    </div>
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

Canvas.propTypes = {
  player: propTypes.func,
};

export default Canvas;
