import React, { useEffect, useState } from 'react';
import Loading from './loading/loading.component.jsx';
import getPlayer from './audio/get-player';

const WithPlayer = ({ Component }) => {
  const [player, setPlayer] = useState();
  useEffect(() => {
    getPlayer().then(resolvedPlayer => setPlayer(resolvedPlayer));
  }, []);
  return player ? <Component player={player} /> : <Loading />;
};

export default WithPlayer;
