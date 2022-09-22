import React, { useEffect } from 'react';
import Bookmarks from "esri/widgets/Bookmarks";

const BookmarksControl = ({view}) => {
    const nodeRef = React.createRef();

    let bookmarks;
    useEffect(() => {
        const runEffect = async () => {
            bookmarks = new Bookmarks({
                view: view,
                // editingEnabled: false,
                // bookmarkCreationOptions: {
                //     takeScreenshot: true,
                //     captureExtent: false,
                //     screenshotSettings: {
                //         width: 100,
                //         height: 100
                //     }
                // },
                container: nodeRef.current
            });
        }
        runEffect();
        return () => {
            if (!!bookmarks) {
                bookmarks.container = null;
            }
        }
    }, [nodeRef.current]);

    return (
        <div id='bookmarks' ref={nodeRef}/>
    )  
}

export { BookmarksControl };