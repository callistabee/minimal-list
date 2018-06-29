import * as mlist from '../src/main.js';

window.onload = function() {
    const list = document.createElement("ol");
    list.appendChild(document.createElement("li"));

    const editor = document.getElementById("editor");
    editor.appendChild(list);
    editor.setAttribute("contentEditable", "true");
    editor.addEventListener("keydown", mlist.handleKbEvent);
};

