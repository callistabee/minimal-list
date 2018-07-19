function containingList(node) {
    if(!node || node.nodeName === "body") {
        return null;
    }

    if(node.nodeName === "UL" || node.nodeName === "OL") {
        return node;
    }

    else {
        return containingList(node.parentNode);
    }
}

function atOuterIndent(currentNode) {
    if(currentNode.nodeName === "OL" || currentNode.nodeName === "UL") {
        return false;
    }

    const outerParent = containingList(currentNode).parentElement;
    return outerParent != null && outerParent.hasAttribute("contentEditable");
}

function atListTop(currentNode, editorNode) {
    return (currentNode.nodeName === "LI" &&
            editorNode.firstChild.firstChild === currentNode);
}

function switchListType(currentNode) {
    const currentOffset = window.getSelection().anchorOffset;

    // make sure current node is text or list item
    const listNode = containingList(currentNode);

    const fragment = document.createDocumentFragment();
    while(listNode.firstChild) {
        fragment.appendChild(listNode.firstChild);
    }
    const newListType = listNode.tagName === "UL" ? "OL" : "UL";
    const newListNode = document.createElement(newListType);
    newListNode.appendChild(fragment);

    listNode.parentNode.replaceChild(newListNode, listNode);

    window.getSelection().collapse(currentNode, currentOffset);
}

function handleKbEvent(kbEvent) {
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

        // prevent the top level list from being deleted
        case "Enter":
        case "Backspace":
            if (atListTop(currentNode, editorNode)) {
                kbEvent.preventDefault();
            }
            break;

        case "l":
            if(kbEvent.ctrlKey) {
                switchListType(currentNode);
            }
            break;

        default:
            break;
    }
}

export default function (selector) {
    const list = document.createElement("ol");
    list.appendChild(document.createElement("li"));

    const container = document.querySelector(selector);
    container.appendChild(list);
    container.setAttribute("contentEditable", "true");
    container.addEventListener("keydown", handleKbEvent);
}