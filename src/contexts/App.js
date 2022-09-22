import React, { createContext, useEffect, useState, useMemo } from 'react';
import { queryFeatures } from '@esri/arcgis-rest-feature-layer';

// main application context
export const AppContext = createContext(null);

// main application provider
export const AppProvider = ({ children }) => {
    const [container, setContainer] = useState(null);
    const [view, setView] = useState(null);
    const [inputValue, setInputValue] = useState(null);
    const [filtering, setFiltering] = useState(false);
    const [filteredSchools, loadFilteredSchools] = useState(null);
    const [allSchools, loadSchoolFeatures] = useState(null);
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [tableOpen, setTableOpen] = useState(false);
    const [rows, setTableRows] = useState([]);
    const [docLayer, setDocLayer] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [tabValue2, setTabValue2] = useState(0);

    // when container is ready, we can load the
    // mapping portion of our application
    // and initialize it
    const loadMap = async () => {
        if (container) {
            const mapping = await import('../data/map');
            mapping.initialize(container);
            mapping.view.when().then(_ => {
                setView(mapping.view);
                mapping.view.popup.on("trigger-action", function (event) {
                    if (event.action.id === "edit-popup") {
                        console.log("you clicked the edit button");
                        //setTabValue2(2);
                    }
                });
                setDocLayer(mapping.projectPointsLayer);
            });
            
        }
    };

    useEffect(() => {
        loadMap();
    }, [container]);

    const value = useMemo(() => ({
        container,
        setContainer,
        view,
        setView,
        inputValue,
        setInputValue,
        filtering,
        setFiltering,
        filteredSchools,
        loadFilteredSchools,
        allSchools,
        loadSchoolFeatures,
        schools,
        setSchools,
        selectedSchool, 
        setSelectedSchool,
        drawerOpen,
        setDrawerOpen,
        tableOpen,
        setTableOpen,
        rows, 
        setTableRows,
        docLayer, 
        setDocLayer,
        selectedIndex, 
        setSelectedIndex,
        setTabValue2,
      }), [
        container,
        view,
        inputValue,
        filtering,
        filteredSchools,
        allSchools,
        schools,
        selectedSchool, 
        drawerOpen,
        tableOpen,
        rows, 
        docLayer, 
        selectedIndex,
        tabValue2,
        ]);

    // const value = {
         
    // };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};