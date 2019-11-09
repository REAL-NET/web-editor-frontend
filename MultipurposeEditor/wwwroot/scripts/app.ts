import "jquery";
import "jquery-ui";

class Editor {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;
    tr: HTMLElement;
    spaces: HTMLElement;
    comforts: HTMLElement;
    conditions: HTMLElement;
    container: HTMLElement;

    constructor() {
        //var model = JSON.parse(requestSmth('GET', 'https://localhost:3626/api/Model/AirSimMetamodel'));
        this.spaces = document.getElementById('spaces');
        this.comforts = document.getElementById('comforts');
        this.conditions = document.getElementById('conditions');

        var allSpaces = ["Room1", "Room2"]; //elements from metamodel (rooms)
        //var allSpaces = JSON.parse(requestSmth('GET', "http://localhost:3626/api/Model/AirSimMetamodel")).elements;
        for (var i = 0; i < allSpaces.length; i++) {
            var div = document.createElement('div');
            var p = document.createElement('p');
            div.setAttribute('class', "draggable draggableStyle ui-widget-content");
            div.setAttribute("margine", "30px");
            p.innerText = allSpaces[i];
            div.append(p);
            this.spaces.append(div);
            $('.draggable').draggable();
        }

        var allComforts = ["Comf1", "Comf2"]; //elements from metamodel (comforts)
        for (var i = 0; i < allComforts.length; i++) {
            var div = document.createElement('div');
            var p = document.createElement('p');
            div.setAttribute('class', "draggable draggableStyle ui-widget-content");
            div.setAttribute("style", "position: relative");
            p.innerText = allComforts[i];
            div.append(p);
            this.comforts.append(div);
            $('.draggable').draggable();
        }

        var allConditions = ["Condition1", "Condition2"]; //elements from metamodel (conditions)
        for (var i = 0; i < allConditions.length; i++) {
            var div = document.createElement('div');
            var p = document.createElement('p');
            div.setAttribute('class', "draggable draggableStyle ui-widget-content");
            div.setAttribute("style", "position: relative");
            p.innerText = allConditions[i];
            div.append(p);
            this.conditions.append(div);
            $('.draggable').draggable();
        }
    }

    start() {
    }

    stop() {
        clearTimeout(this.timerToken);
    }
}

window.onload = () => {
    var editor = new Editor();
    editor.start();
};

function requestSmth(type: string, url: string) {
    var postRequest = new XMLHttpRequest();
    postRequest.open(type, url, false);
    var result;
    postRequest.onload = function () {
        result = this.response;
    }
    postRequest.send();
    return result;
}
