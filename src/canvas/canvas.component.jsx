import React, { useState, useEffect, useRef } from 'react';
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
const MAX_CIRCLE_RADIUS_PX = 250;

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
  const containerRef = useRef(null);
  const initializer = useRef(null);
  const [isInitialized, setInitialized] = useState(false);
  const [enableNoSleep] = useNoSleep();
  const [generate, setGenerate] = useState(false);
  const generationToggleButton = useRef(null);
  const alexBainterLink = useRef(null);
  const canvasRef = useRef(null);
  const circlesRef = useRef([]);
  const [delay, setDelay] = useState(
    Math.random() * MAX_EXTRA_DELAY_MS + MIN_DELAY_MS
  );

  const toggleGeneration = () => {
    setGenerate(!generate);
  };

  useEffect(
    () => {
      containerRef.current.ontouchend = event.preventDefault();
      let input$ = makeInputSource(containerRef.current);
      if (generate) {
        input$ = merge(input$, generation$);
      }
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
          circlesRef.current.push(
            Object.assign({}, coordinate, { startedAtMS: Date.now() })
          );

          player(coordinate);
          forceRender();
        });
      return () => {
        inputSubscription.unsubscribe();
      };
    },
    [containerRef, generate]
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

  const touchableRefs = [initializer, containerRef];

  useEffect(() => {
    touchableRefs.forEach(ref => {
      if (ref.current) {
        ref.current.ontouchend = () => {
          event.preventDefault();
        };
      }
    });
  }, touchableRefs);

  const drawFrame = () => {
    const canvasEl = canvasRef.current;
    const ctx = canvasEl.getContext('2d');
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    const frameTimeMS = Date.now();
    circlesRef.current = circlesRef.current.filter(circle => {
      const { xPct, yPct, color, startedAtMS, velocity } = circle;
      const drawnForMS = frameTimeMS - startedAtMS;
      const lifePct = drawnForMS / 6000;
      if (lifePct <= 1) {
        const radius = Math.round(lifePct * MAX_CIRCLE_RADIUS_PX);
        const x = Math.round((xPct / 100) * canvasEl.clientWidth);
        const y = Math.round((yPct / 100) * canvasEl.clientHeight);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${(1 -
          lifePct) *
          velocity})`;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        return true;
      }
      return false;
    });
    window.requestAnimationFrame(drawFrame);
  };

  const setCanvasDimensions = () => {
    if (containerRef.current && canvasRef.current) {
      canvasRef.current.height = containerRef.current.clientHeight;
      canvasRef.current.width = containerRef.current.clientWidth;
    }
  };

  useEffect(() => {
    window.requestAnimationFrame(drawFrame);
    window.addEventListener('resize', setCanvasDimensions);
  }, []);

  useEffect(setCanvasDimensions, [canvasRef, containerRef]);

  const contents =
    isInitialized || true ? (
      <canvas height="100%" width="100%" className="canvas" ref={canvasRef} />
    ) : (
      <div className="initializer" ref={initializer}>
        Press anywhere
      </div>
    );
  return (
    <div className="canvas-container" ref={containerRef}>
      {contents}
    </div>
  );
};

export default Canvas;
