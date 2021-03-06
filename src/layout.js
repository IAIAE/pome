import layout from 'layout'

const TopDown = {
    sort(items) {
        return sortBy(items, item => item.height)
    },
    placeItems(items) {
        let y = 0

        items.forEach(function (item) {
          item.x = 0
          item.y = y

          y += item.height
        })

        return items
    }
}

const LeftRight = {
    sort(items) {
        items.sort((a, b)=>{
            return a.width - b.width;
        })
    },
    placeItems(items) {
        let x = 0

        items.forEach(function (item) {
          item.x = x
          item.y = 0

          x += item.width
        })

        return items
    }
}

layout.addAlgorithm('top-down', TopDown)
layout.addAlgorithm('left-right', LeftRight)

export default layout