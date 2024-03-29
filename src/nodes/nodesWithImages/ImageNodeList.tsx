import React, {DragEvent} from 'react';

import {Theme} from '@mui/material';
import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';

<<<<<<<< HEAD:src/nodes/nodesWithImages/ImageNodeList.tsx
import './ImageNode.css'
========
import './Nodes.css'
>>>>>>>> query:src/elements/nodes/ImageNodeList.tsx

import image1 from '../images/image1.png';
import image2 from '../images/image2.png';
import image3 from '../images/image3.png';
import image4 from '../images/image4.png';

let ImageLinks = [image1, image2, image3, image3, image4];

const onDragStart = (event: DragEvent, nodeType: string, source: string, height: string, width: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType + ' ' + source + ' ' + height + ' ' + width);
    event.dataTransfer.effectAllowed = 'move';
};

const ImageNodeList = () => {
    let Images = ImageLinks.map(function (name) {
            let img = new Image();
            img.src = name;
            return img;
        }
    )

    const ListOfNodes = Images.map((image) =>
        <li>
            <div className="imgnode"
                 onDragStart={(event: DragEvent) => onDragStart(event, 'ImageNode', `url(${image.src})`, `${image.height}`,
                  `${image.width}`)}
                 draggable
                 style={{
                     backgroundImage: `url(${image.src})`,
                     height: image.height,
                     width: image.width,
                 }}>
                Image Node
            </div>
        </li>
    );

    const useStyles = makeStyles((theme: Theme) => ({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
            position: 'relative',
            overflow: 'auto',
            maxHeight: 360,
        },
        listSection: {
            backgroundColor: 'inherit',
        },
        ul: {
            backgroundColor: 'inherit',
            padding: 0,
        },
    }));

    const classes = useStyles();

    return (
        <List className={classes.root} subheader={<li/>}>
            {ListOfNodes}
        </List>
    );
};


export default ImageNodeList;