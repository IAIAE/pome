const Pome = require('../index')
var sourceDir = process.argv[2];
var distFile = process.argv[3]
var fs = require('fs')
var path = require('path')

module.exports = function(){

    if(!sourceDir || !distFile){
        console.info('error:: two parameter need! check it.')
        return;
    }

    let task = new Pome(sourceDir, {
        padding: 1,
        order: 'binary-tree'
    });
    let {sourceMap} = task.sprite(distFile);
    console.info('sprite image done');
    let str = 'export default {\n__}';
    let keys = Object.keys(sourceMap);
    let objStr = keys.map((key, index)=>{
        let isLast = (index == (keys.length - 1));
        let val = sourceMap[key];
        let _val = {
            left: val.x,
            top: val.y,
            width: val.width,
            height: val.height
        };
        return `${removeEx(key)}: ${obj2str(_val)}` + (isLast?'':',')
    }).join('\n');
    str = str.replace('__', objStr)
    let dirName = path.dirname(path.resolve(process.cwd(), distFile));

    fs.writeFileSync(dirName+'/'+path.basename(distFile, path.extname(distFile))+'-map.js', str, 'utf-8');
    console.info('sourceMap done')
}

function obj2str(obj){
    let keys = Object.keys(obj)
    let str = keys.map((key, index)=>{
        let isLast = (index == keys.length - 1);
        let val = obj[key];
        return (`${key}: ${val}` + (isLast?'':','))
    }).join('\n')
    return '{\n'+str+'}'
}

function removeEx(name){
    return name.split('.')[0]
}