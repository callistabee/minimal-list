function parent(node, levels) {
    if (levels === 0 || node === null) {
        return node;
    } else {
        return parent(node.parentNode, levels - 1)
    }
}

function atOuterIndent(currentNode) {
    const outerParent = currentNode.nodeName === "LI"
                      ? parent(currentNode, 2)
                      : parent(currentNode, 3);

    return outerParent != null && outerParent.hasAttribute("contentEditable");
}

function atListTop(currentNode, editorNode) {
    return (currentNode.nodeName === "LI" &&
            editorNode.firstChild.firstChild === currentNode);
}

function switchListType(currentNode) {
    // make sure current node is text or list item
    const nodeName = currentNode.nodeName;
    if (nodeName !== "#text" && nodeName !== "LI") {
        return;
    }

    const listNode = nodeName === "#text"
                   ? parent(currentNode, 2)
                   : parent(currentNode, 1);

    const fragment = document.createDocumentFragment();
    while(listNode.firstChild) {
        fragment.appendChild(listNode.firstChild);
    }
    const newListType = listNode.tagName === "UL" ? "OL" : "UL";
    const newListNode = document.createElement(newListType);
    newListNode.appendChild(fragment);

    listNode.parentNode.replaceChild(newListNode, listNode);
}

export function handleKbEvent(kbEvent) {
    const editorNode = this;
    const currentNode = window.getSelection().anchorNode;
    switch (kbEvent.key) {

        case "Tab":
            // prevent tabbing out of editor
            kbEvent.preventDefault();

            if (kbEvent.shiftKey) {
                // only outdent if not at top level
                if (!atOuterIndent(currentNode)) {
                    document.execCommand("outdent");
                }
            } else {
                document.execCommand("indent");
            }
            break;

        case "Backspace":
            // prevent the top level list from being deleted
            if (atListTop(currentNode, editorNode)) {
                kbEvent.preventDefault();
            }
            break;

        case "l":
            if(kbEvent.ctrlKey) {
                switchListType(currentNode);
            }
    }
}

