import React, {useEffect, useRef} from 'react';
import Legend from "esri/widgets/Legend";

const LegendControl = ({view}) => {
    const nodeRef = React.createRef();

    let legend;
    useEffect(() => {
        legend = new Legend({
            view: view,
            container: nodeRef.current
        });
        return () => {
            if (!!legend) {
                legend.container = null;
            }
        }
    }, []);

    return (
        <div ref={nodeRef}/>
    )  
}

export { LegendControl };