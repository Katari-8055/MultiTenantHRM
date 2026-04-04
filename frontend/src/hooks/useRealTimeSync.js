import { useEffect, useContext } from 'react';
import { GlobleContext } from '../context/GlobleContext';

export const useRealTimeSync = (entities, fetchFunction) => {
  const { socket } = useContext(GlobleContext);

  useEffect(() => {
    if (!socket || !fetchFunction) return;

    const entityArray = Array.isArray(entities) ? entities : [entities];

    const handleRefresh = (data) => {
      // data.type will be something like 'departments', 'projects', 'stats'
      if (data && data.type && entityArray.includes(data.type)) {
         // console.log(`🔄 Real-time sync triggered for: ${data.type}`);
         fetchFunction();
      }
    };

    socket.on("refresh-data", handleRefresh);

    return () => {
      socket.off("refresh-data", handleRefresh);
    };
  }, [socket, entities, fetchFunction]);
};
