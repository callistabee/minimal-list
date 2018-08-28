### Minimal List
A barebones wysiwyg editor, just for HTML lists.


#### Setup
Add `minimal-list.js` to your `<head>` tag:
```
<script type="text/javascript" src="minimal-list.js">
```
Then, to create a new editor the body:
```
<body>
<div id="editor"></div>
<script type="text/javascript">
    minimalList("#editor", true);
</script>
</body>
```

If your editor `div` contains an existing list, set the second option to
`minimalList` to false:
```
<body>
<div id="editor">
    <ol>
        <li>Food shopping</li>
        <ul>
            <li>Cat food</li>
            <li>Pizza</li>
        </ul>
        <li>Call mom</li>
    </ol>
</div>
<script type="text/javascript">
    minimalList("#editor", false);
</script>
</body>
```

#### Editing Commands
* `(Shift-)Tab`: (un-)indent current item.
* `Ctrl-l`: toggle current list between ordered and unordered.
* `Ctrl-x`: toggle strikethrough on current item and its sublists.