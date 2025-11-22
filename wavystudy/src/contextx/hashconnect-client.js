
  import { useCallback } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import {
    getConnectedAccountIds,
    hc,
    hcInitPromise,
  } from "../services/hashconnect";
  import { actions } from "../services/store";
  
  export const HashConnectClient = () => {
    const dispatch = useDispatch();
    const syncWithHashConnect = useCallback(() => {
      try {
        
      const connectedAccountIds = getConnectedAccountIds();
      if (connectedAccountIds.length > 0) {
        dispatch(
          actions.hashconnect.setAccountIds(
            connectedAccountIds.map((o) => o.toString())
          )
        );
        dispatch(actions.hashconnect.setIsConnected(true));
        dispatch(actions.hashconnect.setPairingString(hc.pairingString ?? ""));
      } else {
        dispatch(actions.hashconnect.setAccountIds([]));
        dispatch(actions.hashconnect.setIsConnected(false));
        dispatch(actions.hashconnect.setPairingString(hc.pairingString ?? ""));
      }
      } catch (error) {
        
      }
    }, [dispatch]);
  
    syncWithHashConnect();
    hcInitPromise.then(() => {
      syncWithHashConnect();
    });
    hc.pairingEvent.on(() => {
      syncWithHashConnect();
    });
    hc.disconnectionEvent.on(() => {
      syncWithHashConnect();
    });
    hc.connectionStatusChangeEvent.on(() => {
      syncWithHashConnect();
    });
    return null;
  };
  