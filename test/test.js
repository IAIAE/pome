const Pome = require('../dist/index')

let task = new Pome('/Users/richcao/Desktop/js_images', {
    padding: 0,
    order: 'binary-tree'
})
let {sourceMap} = task.sprite('./test.png')
console.info(sourceMap)
