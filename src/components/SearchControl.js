import React, { useEffect } from 'react';
import Search from "esri/widgets/Search";
import FeatureLayer from "esri/layers/FeatureLayer";

const SearchControl = ({view, popup}) => {
    const nodeRef = React.createRef(); // useRef(null);

    let search;
    useEffect(() => {
        const runEffect = async () => {
            search = new Search({
                id: 'searchWidget',
                view: view,
                container: nodeRef.current,
                sources: [{
                        layer: new FeatureLayer({
                            url: "https://gissd.sandag.org/rdw/rest/services/Parcel/Parcels/MapServer/1",
                            outFields: ["*"]
                        }),
                        searchFields: ["APN_8"],
                        displayField: "APN_8",
                        exactMatch: false,
                        outFields: ["*"],
                        popupTemplate: popup,
                        name: "SD Parcels",
                        placeholder: "search by apn",
                        maxResults: 6,
                        maxSuggestions: 6,
                        suggestionsEnabled: true,
                        minSuggestCharacters: 0
                    },
                ],
                activeSourceIndex: 1
            });
        }
        runEffect();
        return () => {
            if (!!search) {
                search.container = null;
            }
        }
    }, [nodeRef.current]);

    return ( <
        div id = 'search'
        ref = {
            nodeRef
        }
        />
    )
}

export {
    SearchControl
};