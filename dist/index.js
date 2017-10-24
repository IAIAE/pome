(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('images'), require('fs'), require('path'), require('layout')) :
	typeof define === 'function' && define.amd ? define(['images', 'fs', 'path', 'layout'], factory) :
	(global.pome = factory(global.Images,global.fs,global.path,global.layout));
}(this, (function (Images,fs,path,layout) { 'use strict';

Images = Images && Images.hasOwnProperty('default') ? Images['default'] : Images;
fs = fs && fs.hasOwnProperty('default') ? fs['default'] : fs;
path = path && path.hasOwnProperty('default') ? path['default'] : path;
layout = layout && layout.hasOwnProperty('default') ? layout['default'] : layout;

var TopDown = {
    sort: function sort(items) {
        return sortBy(items, function (item) {
            return item.height;
        });
    },
    placeItems: function placeItems(items) {
        var y = 0;

        items.forEach(function (item) {
            item.x = 0;
            item.y = y;

            y += item.height;
        });

        return items;
    }
};

var LeftRight = {
    sort: function sort(items) {
        items.sort(function (a, b) {
            return a.width - b.width;
        });
    },
    placeItems: function placeItems(items) {
        var x = 0;

        items.forEach(function (item) {
            item.x = x;
            item.y = 0;

            x += item.width;
        });

        return items;
    }
};

layout.addAlgorithm('top-down', TopDown);
layout.addAlgorithm('left-right', LeftRight);

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

// import praan from 'praan'
var Pome = function () {
    function Pome(path$$1, config) {
        classCallCheck(this, Pome);

        this.sourcePath = path$$1;
        this.config = config;
    }

    createClass(Pome, [{
        key: 'sprite',
        value: function sprite(distPath) {
            var _gene2 = this._gene(),
                image = _gene2.image,
                coordinates = _gene2.coordinates,
                properties = _gene2.properties;

            fs.writeFileSync(path.resolve(process.cwd(), distPath), new Buffer(image), 'binary');
            return {
                sourceMap: coordinates,
                width: properties.width,
                height: properties.height
            };
        }
    }, {
        key: '_gene',
        value: function _gene() {
            var config = this.config,
                sourcePath = this.sourcePath;
            var padding = config.padding,
                order = config.order;

            var layer = layout(order);
            var dirPath = path.resolve(process.cwd(), sourcePath);
            var files = fs.readdirSync(dirPath);
            files = files.filter(function (_) {
                return (/\.(png|jpg|gif|jpeg)$/.test(_)
                );
            });
            files.map(function (file) {
                var img = Images(path.resolve(dirPath, file));
                var size = img.size();
                var meta = {
                    file: file,
                    img: img
                };

                var item = Object.assign({}, meta, {
                    width: size.width + padding,
                    height: size.height + padding
                });

                layer.addItem(item);
            });

            var _layer$export = layer.export(),
                width = _layer$export.width,
                height = _layer$export.height,
                items = _layer$export.items;

            width -= padding;
            height -= padding;

            Images.setLimit(10e8, 10e8);

            var sprite = Images(width, height);

            var coordinates = {};
            var properties = {
                width: width,
                height: height
            };

            items.map(function (item) {
                var file = item.file,
                    img = item.img,
                    x = item.x,
                    y = item.y,
                    width = item.width,
                    height = item.height;


                width -= padding;
                height -= padding;

                coordinates[file] = {
                    x: x,
                    y: y,
                    width: width,
                    height: height
                };

                sprite.draw(img, x, y);
            });

            return {
                image: sprite.encode('png'),
                coordinates: coordinates,
                properties: properties
            };
        }
    }]);
    return Pome;
}();

return Pome;

})));
