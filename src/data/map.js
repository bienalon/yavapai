import WebMap from "esri/WebMap";
import Map from "esri/Map";
import esriConfig from "esri/config";
import domConstruct from "dojo/dom-construct";
import Portal from "esri/portal/Portal";
import OAuthInfo from "esri/identity/OAuthInfo";
import identityManager from "esri/identity/IdentityManager";
import PopupTemplate from "esri/PopupTemplate";
import MapView from "esri/views/MapView";
import Search from "esri/widgets/Search";
import Basemap from "esri/Basemap";
import BasemapToggle from "esri/widgets/BasemapToggle";
import TileLayer from "esri/layers/TileLayer";
import GroupLayer from "esri/layers/GroupLayer";
import ImageryLayer from "esri/layers/ImageryLayer";
import WebTileLayer from "esri/layers/WebTileLayer";
import SpatialReference from "esri/geometry/SpatialReference";
import TileInfo from "esri/layers/support/TileInfo";
import LOD from "esri/layers/support/LOD";
import Layer from "esri/layers/Layer";
import CIMSymbol from "esri/symbols/CIMSymbol";
import FeatureLayer from "esri/layers/FeatureLayer";
import MapImageLayer from "esri/layers/MapImageLayer";
import VectorTileLayer from "esri/layers/VectorTileLayer";
import FeatureFilter from "esri/views/layers/support/FeatureFilter";
import FeatureEffect from "esri/views/layers/support/FeatureEffect";
import LayerView from "esri/views/layers/LayerView";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Point from "esri/geometry/Point";
import Print from "esri/widgets/Print";
import Expand from "esri/widgets/Expand";
import SketchViewModel from "esri/widgets/Sketch/SketchViewModel";
import * as watchUtils from 'esri/core/watchUtils';
import * as webMercatorUtils from "esri/geometry/support/webMercatorUtils";

import BasemapImage from '../../public/assets/basemap_imagery.jpg';
import RickLogo from '../../public/assets/LogoRick.png';
import { layer } from "esri/views/3d/support/LayerPerformanceInfo";
import MapImage from "esri/layers/support/MapImage";


export let login = false;
export let editableLayers = [];

esriConfig.portalUrl = 'https://portal2.rickengineering.com/portal';
esriConfig.locale = "en-US";

function handleSignedIn() {
    const portal = new Portal({
        canSignInArcGIS: false
    });
    portal.load().then(() => {
        const results = { name: portal.user.fullName, username: portal.user.username };
        console.log(JSON.stringify(results, null, 2));
    });
}

const info = new OAuthInfo({
    appId: 'ktD0PwHS1Zt2dEPO',
    portalUrl: 'https://portal2.rickengineering.com/portal',
    expiration: 180,
    minTimeUntilExpiration: 180,
    popup: false,
    // preserveUrlHash: true,
});
identityManager.registerOAuthInfos([info]);
identityManager.getCredential(info.portalUrl + "/sharing", {oAuthPopupConfirmation: false});
identityManager.checkSignInStatus(info.portalUrl + "/sharing").then((cred) => {
    //console.log("Signed In")
    login = true;
    handleSignedIn();
}).catch((err) => {
    login = false;
    console.log(err);
});

// Set basemap to vector tiles
const nightBasemap = Basemap.fromId("gray-vector");
export const webmap = new WebMap({
    portalItem: {
        id: "efce1270b5af44f39855d9ae5554aa41"
    }
});
// Override tile infos
var lods = [];
var tilesize = 256;
var earthCircumference = 40075016.685568;
var halfEarthCircumference = earthCircumference * 0.5;
var inchesPerMeter = 39.37;
var initialResolution = earthCircumference / tilesize;
for (var zoom = 0; zoom <= 24; zoom++) {
    var resolution = initialResolution / Math.pow(2, zoom);
    var scale = resolution * 96 * inchesPerMeter;
    lods.push(new LOD({
        level: zoom,
        scale: scale,
        resolution: resolution
    }));
}
var tileInfo = new TileInfo({
    cols: 256,
    dpi: 72,
    format: "jpg",
    height: 256,
    lods: lods,
    origin: new Point({
        x: -20037508.342787,
        y: 20037508.342787
    }),
    rows: 256,
    spatialReference: SpatialReference.WebMercator,
    width: 256
});

export const view = new MapView({
    map: webmap,
    constraints: {
        lods: lods
    },
    // container: document.getElementById("viewDiv")
});

// Layers
// Index Layer
export let projectPointsLayer = null;
export let projectAreasLayer = null;

// Popups
function ShowPopup(featureLayer, title, excluded) {
    featureLayer.when(() => {
        featureLayer.popupTemplate = null;
        var fieldInfos = [];
        featureLayer.fields.forEach((field, index) => {
            if (!(excluded.includes(field.name))) {
                if (field.type === "double") {
                    var popupField = {
                        "fieldName": field.name,
                        "label": field.alias,
                        format: {
                            places: 3,
                            digitSeparator: false
                        }
                    };
                    fieldInfos.push(popupField);
                } else if (field.type === "date") {
                    var popupField2 = {
                        "fieldName": field.name,
                        "label": field.alias,
                        format: {
                            dateFormat: "short-date"
                        }
                    };
                    fieldInfos.push(popupField2);
                } else {
                    var popupField3 = {
                        "fieldName": field.name,
                        "label": field.alias
                    };
                    fieldInfos.push(popupField3);
                }
            }
        });
        var popTemplate = new PopupTemplate({
            title: title,
            content: [{
                type: "fields",
                fieldInfos: fieldInfos
            }]
        });
        featureLayer.popupTemplate = popTemplate;
    });
}

// Existing group
const waterSystemGroup = new GroupLayer({
    title: "Water System",
    listMode: 'show',
    visible: true
});
const basemapGroup = new GroupLayer({
    title: "Basemap",
    listMode: 'show',
    visible: true
});

// const commentsLayer = new FeatureLayer({
//     title: "Comments",
//     url: "https://portal2.rickengineering.com/server/rest/services/Hosted/StarValley_WebServices_Comments/FeatureServer/0",
//     outFields: ["*"],
//     popupTemplate: {
//         title: "Comments",
//         content: [{
//             type: "fields",
//             fieldInfos: [
//                 {
//                     fieldName: "comment",
//                     label: "Comment"
//                 },
//                 {
//                     fieldName: "author",
//                     label: "Author"
//                 },
//                 {
//                     fieldName: "entity",
//                     label: "Source"
//                 }
//             ],
//         }],
//         actions: [{
//             title: "Edit",
//             id: "edit-popup",
//             className: "esri-icon-edit edit-color"
//         }]
//     },
//     outFields: ["*"],
// });

webmap.when(() => {
    var waterLayers = [];
    var basemapLayers = [];
    webmap.layers.forEach((layer) => {
        if (layer.type === "feature" && layer.title === "Town Limits") {
            basemapLayers.push(layer);
            layer.editingEnabled = false;
        } else if (layer.type === "feature" && layer.title === "Incorporated Boundaries") {
            basemapLayers.push(layer);
            layer.editingEnabled = false;
        } else if (layer.type === "feature" && layer.title === "Roads") {
            basemapLayers.push(layer);
            layer.editingEnabled = false;
        } else if (layer.type === "feature" && layer.title === "Buildings") {
            basemapLayers.push(layer);
            layer.editingEnabled = false;
        } else if (layer.type === "feature" && layer.title === "Parcels") {
            basemapLayers.push(layer);
            layer.editingEnabled = false;
        } else if (layer.type === "feature" && layer.title === "wFitting") {
            waterLayers.push(layer);
        } else if (layer.type === "feature" && layer.title === "wHydrant") {
            waterLayers.push(layer);
        } else if (layer.type === "feature" && layer.title === "wMeter") {
            waterLayers.push(layer);
            projectPointsLayer = layer; // Load first?
        } else if (layer.type === "feature" && layer.title === "wWell") {
            waterLayers.push(layer);
        } else if (layer.type === "feature" && layer.title === "wTank") {
            waterLayers.push(layer);
        } else if (layer.type === "feature" && layer.title === "wLine") {
            waterLayers.push(layer);
        } else if (layer.type === "feature" && layer.title === "wFacility") {
            waterLayers.push(layer);
        }

        if (layer.type === "feature" && layer.editingEnabled == true){
            editableLayers.push(layer.title);
        }
    });
    // projectAreasLayer = commentsLayer;
    // editableLayers.unshift(projectAreasLayer.title);
    // waterSystemGroup.addMany(waterLayers);
    // basemapGroup.addMany(basemapLayers);
    // webmap.addMany([basemapGroup, waterSystemGroup]);
});

//ShowPopup(existingJunctionLayer, existingJunctionLayer.title, ["objectid", "created_user", "created_date", "last_edited_user", "last_edited_date", "globalid"]);


// Image tiled layer.
const imageryLayer = new TileLayer({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    // opacity: 0.6,
    maxScale: 10000
});
const transportationLayer = new TileLayer({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer",
    //minScale: 6000
});
// Nearmap
const imageryNearmap = new WebTileLayer({
    urlTemplate: "https://us{subDomain}.nearmap.com/maps/?z={level}&x={col}&y={row}&version=2&nml=Vert&client=wmts_integration&httpauth=false&apikey=Mjc1YzE2NTgtNGIyOS00ZTIxLThlOWItNWNlNWU1NjI1MzVh",
    subDomains: ["0", "1", "2", "3"],
    copyright: 'PhotoMaps &copy; <a href="http://www.nearmap.com/">NearMap</a>',
    id: 'Nearmap',
    minScale: 10000,
    tileInfo: tileInfo
});

// Basemap
const imageryBasemap = new Basemap({
    baseLayers: [imageryLayer, imageryNearmap, transportationLayer],
    title: "Imagery",
    thumbnailUrl: BasemapImage
});
// Basemap Toggle widget
const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: imageryBasemap,
    visibleElements: {
        title: true,
    },
});
view.ui.add(basemapToggle, 'bottom-left');


// Print Widget
const print = new Print({
    view: view,
    container: document.createElement("div"),
    // specify your own print service
    printServiceUrl:
        //"https://portal2.rickengineering.com/server/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
        "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
});
const printExpand = new Expand({
    expandIconClass: "esri-icon-printer",
    expandTooltip: "Open to print",
    collapseTooltip: "Close the print options",
    view: view,
    content: print.domNode
});
view.ui.add(printExpand, {
    position: "top-right",
    index: 0
});

const search = new Search({ 
    view,  
});
view.ui.add(search, {
    position: "top-right",
    index: 0
});

const rickLink = domConstruct.toDom("<a style='cursor:pointer;height:24px;' href='https://rickengineering.com' target='_blank'>" +
    "<img src='" + RickLogo + "' id='rick_logo' title='RICK' style='height:24px;'>" +
    "</a>");
view.ui.add(rickLink, "bottom-right");

/**
 * Assigns the container element to the View
 * @param container
 */
export const initialize = (container) => {
    view.container = container;
    view.when().then(_ => {
        console.log('Map and View are ready');
        // view.whenLayerView(projectPointsLayer).then(function (layerView) {
        //     console.log('layer view loaded');
        //     watchUtils.whenFalseOnce(layerView, 'updating', (event) => {
        //         //projectPointsLayer.definitionExpression = "status = 'Added' OR status = 'Changed Field'";
        //     });
        //     // districtLayer.on('layerview-create', function(event) {
        //     //     console.log('the layer view got created');
        //     // });
        //     //view.map.addMany(utilityLayers, 1);
        // });
    }).catch(error => {
        console.warn('An error in creating the map occured:', error);
    });
};

