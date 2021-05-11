import React, { DragEvent } from 'react';

import '../PropertyBar.css'
import '../Nodes.css'


import www from "./www.png";
import eee from "./eee.png";
import ttt from "./ttt.png";

let Images=[www,eee,ttt];
function getDimensions(_src:string,_callback:Function){
    /* create a new image , not linked anywhere in document */
    var img = document.createElement('img');
    /* set the source of the image to what u want */
    img.src=_src;
    /* Wait the image to load and when its so call the callback function */
    /* If you want the actual natural dimensions of the image use naturalWidth and natural height instead */
    img.onload = function () { _callback(img.width,img.height) };
}

const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
};


const NodesWithImages = () => {
    let height:number
    let width:number

    let Images2=Images.map(function(name) {
            let img = new Image();
            img.src=name;

            return img;
        }
        )


    const ListOfNodes = Images2.map((name) =>
        <li>
            <div className="dndnode default" onDragStart={(event: DragEvent) => onDragStart(event, 'default'+' '+`url(${name.src})`+' '+name.height+' '+ name.width)} draggable
                 style={{
                     backgroundImage: `url(${name.src})`,
                     height: name.height,
                     width : name.width,
            }}>
                Default Node
            </div>
        </li>
    );


    return (
        <ul>
            {ListOfNodes}
        </ul>
    );
};





export default NodesWithImages;