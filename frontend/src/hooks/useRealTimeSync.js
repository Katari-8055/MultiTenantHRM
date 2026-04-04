import { useEffect, useContext, useRef } from 'react';
import { GlobleContext } from '../context/GlobleContext';

export const useRealTimeSync = (entities, fetchFunction) => {
  const { socket } = useContext(GlobleContext);
  const fetchRef = useRef(fetchFunction);

  // Keep the latest fetch reference updated without re-triggering the socket setup
  useEffect(() => {
    fetchRef.current = fetchFunction;
  }, [fetchFunction]);

  // Use a stable stringified dependency for arrays to prevent infinite churn
  const entitiesString = JSON.stringify(Array.isArray(entities) ? entities : [entities]);

  useEffect(() => {
    if (!socket) return;

    const handleRefresh = (data) => {
      const entityArray = JSON.parse(entitiesString);
      if (data && data.type && entityArray.includes(data.type)) {
         if (fetchRef.current) fetchRef.current();
      }
    };

    socket.on("refresh-data", handleRefresh);

    return () => {
      socket.off("refresh-data", handleRefresh);
    };
  }, [socket, entitiesString]); // Dependencies remain completely stable!
};
