const minimalList = (function() {
    function containingElement(node, elementNameList) {
        if(!node || node.nodeName === "body") {
            return null;
        }

        if(elementNameList.indexOf(node.nodeName) >= 0) {
            return node;
        }

        return containingElement(node.parentNode, elementNameList);
    }

    function containingList(node) {
        return containingElement(node, ["UL", "OL"]);
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

    function handleStrike(node) {
        const currentOffset = window.getSelection().anchorOffset;

        if (node.nodeName !== "#text") {
            return;
        }

        if (node.parentNode.nodeName === "LI") {
            switchStrikes(node.parentNode, true);
        } else if(node.parentNode.nodeName === "STRIKE") {
            switchStrikes(node.parentNode.parentNode, false);
        }

        window.getSelection().collapse(node, currentOffset);
    }

    function switchStrikes(listItem, strikeOn) {
        // only apply to list items
        if(listItem.nodeName !== "LI") {
            return;
        }

        const text = listItem.firstChild;

        if(strikeOn && text.nodeName === "#text") {
            const strike = document.createElement("strike");
            strike.appendChild(text);
            listItem.appendChild(strike);
        } else if(!strikeOn && text.nodeName === "STRIKE") {
            listItem.appendChild(text.firstChild);
            text.remove();
        }

        // get sublist
        listItem.id = "current";
        const sublist = document.querySelector("#current+ol,#current+ul");
        listItem.removeAttribute("id");

        if(sublist) {
            // change strikes in sublist
            for(let child of sublist.children) {
                switchStrikes(child, strikeOn);
            }
        }

    }

    function handleKeyUp() {
        const currentNode = window.getSelection().anchorNode;

        let listItem = containingElement(currentNode, ["LI"]);
        if(listItem) {
            for (let child of listItem.children) {
                if (child.nodeName === "BR") {
                    child.remove();
                }
            }
        }
    }

    function handleKeyDown(kbEvent) {
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

            case "x":
                if(kbEvent.ctrlKey) {
                    handleStrike(currentNode);
                }
                break;

            default:
                break;
        }
    }

    function minimalList (selector, fresh) {
        const container = document.querySelector(selector);
        container.setAttribute("contentEditable", "true");

        if (fresh) {
            const list = document.createElement("ol");
            list.appendChild(document.createElement("li"));
            container.appendChild(list);
        } else {
            // normalize existing editor content
            container.innerHTML = container.innerHTML.replace(/(\r|\n|\r\n)/gm, "");
        }

        container.addEventListener("keydown", handleKeyDown);
        container.addEventListener("keyup", handleKeyUp)
    }

    return minimalList;
})();
