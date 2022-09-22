import { createStore, createHook } from 'react-sweet-state';

export const Store = createStore({
    // Value on store initialize
    initialState: {
        count: 0,
        loading: false,
        container: null,
        drawerOpen: true,
        tabValue: 0,
        selectedIndex: -1,
        projectPointLayer: null,
        projectAreaLayer: null,
        view: null,
        tableOpen: false,
        editAttFeature: null,
        graphicsLayer: null,
        highlight: null,
        editFeature: null,
        graphicFeature: null,
        featureForm: null,
        editFormState: 'add-template',
        attributes: null,
        point: null,
        searchWidget: null,
        templates: null,
        radioValue: 'point',
        measurement: null,
        featureTable: null,
        tableFeatures: [],
        tableLayer: null,
        sketch: null,
        tableSource: 'existing junctions',
        aboutOpen: false,
        cookies: null,
        login: false,
        editableLayers: [],
    },
    // Actions
    actions: {
        increment: () => ({ setState, getState }) => {
            const currentCount = getState().count;
            setState({ count: currentCount + 1 });
        },
        setContainer: (container) => ({ setState, getState }) => {
            setState({
                container: container,
            });
        },
        setDrawerOpen: (bool) => ({ setState, getState }) => {
            setState({
                drawerOpen: bool,
            });
        },
        setTableOpen: (bool) => ({ setState, getState }) => {
            setState({
                tableOpen: bool,
            });
        },
        setTabValue: (num) => ({ setState, getState }) => {
            setState({
                tabValue: num,
            });
            if (getState().drawerOpen === false) {
                setState({
                    drawerOpen: true,
                });
            }
        },
        setView: (view) => ({ setState, getState }) => {
            setState({
                view: view,
            });
        },
        setProjectPointLayer: (value) => ({ setState, getState }) => {
            setState({
                projectPointLayer: value,
            });
        },
        setProjectAreaLayer: (value) => ({ setState, getState }) => {
            setState({
                projectAreaLayer: value,
            });
        },
        // setSelectedSchool: (feature) => ({ setState, getState }) => {
        //     setState({
        //         selectedSchool: feature,
        //     });
        // },
        setEditAttFeature: (value) => ({ setState, getState }) => {
            //const currentSchool = getState().selectedSchool;
            // setState({
            //     loading: true,
            // });
            setState({
                // loading: false,
                editAttFeature: value,
            });
        },
        setGraphicsLayer: (layer) => ({ setState, getState }) => {
            setState({
                graphicsLayer: layer,
            });
        },
        setHighlight: (highlight) => ({ setState, getState }) => {
            setState({
                highlight: highlight,
            });
        },
        setEditFeature: (editFeature) => ({ setState, getState }) => {
            setState({
                editFeature: editFeature,
            });
        },
        setFeatureForm: (value) => ({ setState, getState }) => {
            setState({
                featureForm: value,
            });
        },
        setEditFormState: (value) => ({ setState, getState }) => {
            setState({
                editFormState: value
            });
        },
        setAttributes: (value) => ({ setState, getState }) => {
            setState({
                attributes: value
            });
        },
        setPoint: (value) => ({ setState, getState }) => {
            setState({
                point: value
            });
        },
        setGraphicFeature: (value) => ({ setState, getState }) => {
            setState({
                graphicFeature: value
            });
        },
        setSearchWidget: (value) => ({ setState, getState }) => {
            setState({
                searchWidget: value
            });
        },
        setTemplates: (value) => ({ setState, getState }) => {
            const newVal = getState().templates;
            setState({
                templates: value
            });
        },
        setRadioValue: (value) => ({ setState, getState }) => {
            setState({
                radioValue: value
            });
        },
        setSelectMeasure: (value) => ({ setState, getState }) => {
            setState({
                measurement: value
            });
        },
        setFeatureTable: (value) => ({ setState, getState }) => {
            setState({
                featureTable: value
            });
        },
        setTableFeatures: (value) => ({ setState, getState }) => {
            setState({
                tableFeatures: value
            });
        },
        setTableLayer: (value) => ({ setState, getState }) => {
            setState({
                tableLayer: value
            });
        },
        setSketch: (value) => ({ setState, getState }) => {
            setState({
                sketch: value
            });
        },
        setTableSource: (value) => ({ setState, getState }) => {
            setState({
                tableSource: value
            });
        },
        setAboutOpen: (value) => ({ setState, getState }) => {
            setState({
                aboutOpen: value
            });
        },
        setCookies: (value) => ({ setState, getState }) => {
            //const newVal = getState().name;
            setState({
                cookies: value
            });
        },
        setLogin: (value) => ({ setState, getState }) => {
            setState({
                login: value
            });
        },
        setEditableLayers: (value) => ({ setState, getState }) => {
            setState({
                editableLayers: value
            });
        },
    },
});