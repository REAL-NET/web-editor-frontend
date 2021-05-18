import React, { DragEvent } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import '../PropertyBar.css'
import '../Nodes.css'


import www from "./www.png";
import eee from "./eee.png";
import ttt from "./ttt.png";


let ImageLinks = [www,eee,ttt];


const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
};


const NodesWithImages = () => {
    let height:number
    let width:number

    let Images = ImageLinks.map(function(name) {
            let img = new Image();
            img.src = name;
            return img;
        }
        )


    const ListOfNodes = Images.map((name) =>
        <li>
            <div className="imgnode" onDragStart={(event: DragEvent) => onDragStart(event, 'imgnode'+' '+`url(${name.src})`+' '+name.height+' '+ name.width)} draggable
                 style={{
                     backgroundImage: `url(${name.src})`,
                     height: name.height,
                     width : name.width,
            }}>
                Default Node
            </div>
        </li>
    );

    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
            position: 'relative',
            overflow: 'auto',
            maxHeight: 720,
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
            Nodes with images
            { ListOfNodes }
        </List>
    );
};





export default NodesWithImages;