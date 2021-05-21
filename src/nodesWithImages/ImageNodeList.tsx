import React, { DragEvent } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import '../PropertyBar.css'
import '../Nodes.css'


import www from "./Images/ttt.png";
import eee from "./Images/eee.png";
import ttt from "./Images/ttt.png";
import mmm from "./Images/mmm.png";


let ImageLinks = [www,eee,ttt,mmm,mmm,ttt];


const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
};


const ImageNodeList = () => {

    let Images = ImageLinks.map(function(name) {
            let img = new Image();
            img.src = name;
            return img;
        }
        )


    const ListOfNodes = Images.map((name) =>
        <li>
            <div className="imgnode" onDragStart={(event: DragEvent) => onDragStart(event, 'ImageNode'+' '+`url(${name.src})`+' '+name.height+' '+ name.width)} draggable
                 style={{
                     backgroundImage: `url(${name.src})`,
                     height: name.height,
                     width : name.width,
            }}>
                Image Node
            </div>
        </li>
    );

    const useStyles = makeStyles((theme) => ({
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
        <List className={classes.root}  subheader={<li />}>
            { ListOfNodes }
        </List>
    );
};





export default ImageNodeList;