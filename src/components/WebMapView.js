import React, { useContext, useEffect, useRef } from 'react';
import * as webMercatorUtils from "esri/geometry/support/webMercatorUtils";
import Polygon from "esri/geometry/Polygon";

import { useStore } from '../usestore';

const WebMapView = () => {
    const mapRef = useRef(null);
    //const { setContainer, view } = useContext(AppContext);
    const [state, actions] = useStore();

    const loadMap = async () => {
        if (state.container) {
            const mapping = await import('../data/map');
            mapping.initialize(state.container);
            mapping.view.when().then(_ => {
                actions.setView(mapping.view);
                mapping.view.popup.on("trigger-action", function (event) {
                    if (event.action.id === "edit-popup") {
                        //actions.setTabValue(0);
                        console.log("you clicked the edit button");
                        let feature = mapping.view.popup.selectedFeature;
                        actions.setEditAttFeature(feature);
                        actions.setTabValue(4);
                        actions.setEditFormState('edit-attributes');
                        mapping.view.popup.visible = false;
                    }
                });
                //actions.setProjectPointLayer(mapping.projectPointsLayer);
                actions.setProjectAreaLayer(mapping.projectAreasLayer);
                actions.setLogin(mapping.login);
                actions.setEditableLayers(mapping.editableLayers);
            });
            
        }
    };

    useEffect(() => {
        loadMap();
    }, [state.container]);

    // useEffect(() => {
    //     actions.setLogin(mapping.login);
    // }, [state.login]);

    // we can let the application context
    // know that the component is ready
    useEffect(() => {
        actions.setContainer(mapRef.current);
    }, [mapRef.current]);

    useEffect(() => {
        actions.setContainer(mapRef.current);
    }, [mapRef.current]);

    useEffect(() => {
        if (state.view != null) {
            console.log('rendereing view');
            //viewState.goTo(state.schoolFeatures.geometry);
            }
    }, []);

    return <div className="viewDiv" ref={mapRef} />;
};

export { WebMapView };