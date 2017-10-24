// import praan from 'praan'
import Images from 'images'
import fs from 'fs'
import path from 'path'
import layout from './layout'

class Pome{
    constructor(path, config){
        this.sourcePath = path;
        this.config = config;
    }
    sprite(distPath){
        let {image, coordinates, properties} = this._gene();
        fs.writeFileSync(path.resolve(process.cwd(), distPath), new Buffer(image), 'binary');
        return {
            sourceMap: coordinates,
            width: properties.width,
            height: properties.height
        };
    }
    _gene() {
        let {config, sourcePath} = this;
        let {padding, order} = config;
        let layer = layout(order)
        let dirPath = path.resolve(process.cwd(), sourcePath)
        let files = fs.readdirSync(dirPath);
        files = files.filter(_=>{
            return /\.(png|jpg|gif|jpeg)$/.test(_)
        });
        files.map(file => {
            let img = Images(path.resolve(dirPath, file))
            let size = img.size()
            let meta = {
                file,
                img
            }

            let item = Object.assign({}, meta, {
                width: size.width + padding,
                height: size.height + padding
            })

            layer.addItem(item)
        })

        let {width, height, items} = layer.export()

        width -= padding
        height -= padding

        Images.setLimit(10e8, 10e8)

        let sprite = Images(width, height)

        let coordinates = {}
        let properties = {
            width,
            height
        }

        items.map(item => {
            let {file, img, x, y, width, height} = item

            width -= padding
            height -= padding

            coordinates[file] = {
                x,
                y,
                width,
                height
            }

            sprite.draw(img, x, y)
        })

        return {
            image: sprite.encode('png'),
            coordinates,
            properties
        }
    }
}

export default Pome