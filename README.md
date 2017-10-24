# pomeg
pomeg(ranate) a cli helper that create sprite image and output the raw offset information.

# usage

## module
read all images in `./js_images` and generate a sprite image named `sprite.png`
```javascript
const Pome = require('../dist/index')

let task = new Pome('./js_images', {
    padding: 0,
    order: 'binary-tree'
})
let {sourceMap} = task.sprite('./sprite.png')
console.info(sourceMap)
```

## CLI
```
$> npm install -g pome
$> pome ./js_images ./sprite.png
```

enjoy it