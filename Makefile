build/minimal-list.js:
	rollup -f iife -i src/main.js -n minimalList -o build/minimal-list.js

clean:
	rm -rf build
