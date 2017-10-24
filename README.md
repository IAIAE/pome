# pome
pome(granate) a cli helper that create sprite image and output the raw offset information.
![](https://github.com/IAIAE/pome/blob/master/pome.png)

# usage

## module
read all images in `./js_images` and generate a sprite image named `sprite.png`
```javascript
const Pome = require('pomeg')

let task = new Pome('./js_images', {
    padding: 0,
    order: 'binary-tree'
})
let {sourceMap} = task.sprite('./sprite.png')
console.info(sourceMap)
```

## CLI
```
$> npm install -g pomeg
$> pome ./js_images ./sprite.png
```

enjoy it