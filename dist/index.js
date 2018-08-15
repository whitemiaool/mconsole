'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.default = function () {
    var logProto = console.log;
    var objcount = 0;
    var instance = null;
    var initId = Symbol();
    var initHtml = Symbol();
    var initCss = Symbol();
    var init = Symbol();
    var initEvent = Symbol();
    var initLog = Symbol();
    var shouldRender = Symbol();
    var renderEvent = Symbol();
    var renderHtml = Symbol();
    var renderSpace = Symbol();
    var renderObj = Symbol();
    var render = Symbol();
    var updateBuffer = Symbol();
    var shouldrenderflag = Symbol();
    var hasRenderConsoleFlag = Symbol();
    var logarr = Symbol();

    var logToHtml = function () {
        function logToHtml() {
            _classCallCheck(this, logToHtml);

            this[logarr] = [];
            this[shouldrenderflag] = false;
            this[hasRenderConsoleFlag] = false;
            this[initLog]();
        }

        _createClass(logToHtml, [{
            key: initId,
            value: function value() {
                var s4 = function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                };
                return 'id' + (s4() + s4()) + '-' + s4();
            }
        }, {
            key: initHtml,
            value: function value() {
                var div = document.createElement('div');
                div.setAttribute('id', this.wrapId);
                div.innerHTML = '\n            <div id="' + this.toolbarId + '">\n                <div data-type="1" style="background:#fff" id="' + this.logId + '">Log</div>\n                <div data-type="2" id="' + this.netId + '">Net</div>\n            </div>\n            <div id="' + this.logId + 'id"></div>\n            <div id="' + this.netId + 'id"></div>\n            <div id="' + this.clearId + '">clear</div>                     \n        ';
                document.body.appendChild(div);

                var div1 = document.createElement('div');
                div1.setAttribute('id', this.buttonId);
                div1.innerHTML = 'dConsole';
                document.body.appendChild(div1);
            }
        }, {
            key: initCss,
            value: function value() {
                var style = document.createElement('style');
                style.innerHTML = 'div#' + this.wrapId + ' {\n            position: fixed;\n            height: 75vh;\n            width: 100vw;\n            overflow-y:scroll;\n            background:rgb(218, 218, 218);\n            overflow-x: hidden;\n            bottom: 0px;\n            box-sizing: border-box;\n            padding: 30px 3px;\n            display: flex;\n            flex-direction: column;\n            overflow: hidden;\n        }\n        #' + this.toolbarId + ' {\n            display: flex;\n            position: absolute;\n            justify-content: space-around;\n            width: 100%;\n            top:0px;\n            height:30px;\n            line-height:30px;\n            left:0px;\n            background:#f3f3f3;\n            border-bottom: 1px solid #ccc;\n        }\n        #' + this.toolbarId + '>div {\n            width:50%;\n            text-align:center;\n            border-left: 1px solid #ccc;\n        }\n        #' + this.logId + 'id {\n            overflow:auto;\n        }\n        div#' + this.logId + 'id>div{\n            background: #fff;\n            border-top: 1px solid #ccc;\n            padding: 5px 3px;\n            word-break: break-all;\n        }\n        div#' + this.buttonId + '{\n            border-radius: 5px;\n            position: fixed;\n            left: 14px;\n            top:50%;\n            background: #1abd10;\n            padding: 5px 10px;\n            color: #fff;\n            box-shadow: 0px 0px 7px 3px rgba(204, 204, 204,0.5);\n        }\n        #' + this.clearId + ' {\n            height: 30px;\n            text-align: center;\n            background: #f3f3f3;\n            position: absolute;\n            bottom: 0px;\n            width: 100%;\n            left: 0px;\n            line-height: 30px;\n            border-top: 1px solid #ccc;\n        }\n        ';
                document.head.appendChild(style);
            }
        }, {
            key: init,
            value: function value() {
                // this.contentId = this[initId]();
                this.wrapId = this[initId]();
                this.buttonId = this[initId]();
                this.logId = this[initId]();
                this.netId = this[initId]();
                this.clearId = this[initId]();
                this.toolbarId = this[initId]();
                this[initCss]();
                this[initHtml]();
                this[initEvent]();
                this.content = document.getElementById(this.logId + 'id');
                this.wrap = document.getElementById(this.wrapId);
                this.button = document.getElementById(this.buttonId);
            }
        }, {
            key: updateBuffer,
            value: function value(args) {
                this[logarr].unshift(args);
                this[logarr].length = 50;
            }
        }, {
            key: initEvent,
            value: function value() {
                var _this = this;

                // 内容区域
                var content = document.getElementById(this.logId + 'id');
                content.addEventListener('click', function (e) {
                    if (e.target.hasAttribute('data-obj')) {
                        var target = e.target.querySelector('div');
                        if (!target) return;
                        var display = target.style.display;
                        e.target.firstChild.nodeValue = display == 'none' ? '▼Object' : '▶Object';
                        target.style.display = display == 'none' ? 'block' : 'none';
                    }
                });

                // 显示隐藏按钮
                var bt = document.getElementById(this.buttonId);
                bt.addEventListener('click', function (e) {
                    _this.wrap.style.display = _this.wrap.style.display == 'none' ? 'flex' : 'none';
                }, false);
                bt.addEventListener('touchmove', function (event) {
                    if (event.targetTouches.length == 1) {
                        var touch = event.targetTouches[0];
                        bt.style.left = touch.pageX - 48 + 'px';
                        bt.style.top = touch.pageY - 15 + 'px';
                    }
                }, false);

                // 清除log
                var clear = document.getElementById(this.clearId);
                clear.addEventListener('click', function (e) {
                    _this.content.innerHTML = '';
                }, false);

                // Toolbar
                var tool = document.getElementById(this.toolbarId);
                tool.addEventListener('click', function (e) {
                    if (!e.target.hasAttribute('data-type')) return;
                    var targetId = e.target.getAttribute('id');
                    var parent = e.target.parentNode;
                    var childs = parent.childNodes;
                    e.target.style.background = '#fff';
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = childs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var item = _step.value;

                            if (!(item.nodeType == 1)) continue;
                            if (item.getAttribute('id') == targetId) {
                                document.getElementById(targetId + 'id').style.display = 'block';
                                continue;
                            }
                            document.getElementById(item.getAttribute('id')).style.background = '';
                            document.getElementById(item.getAttribute('id') + 'id').style.display = 'none';
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                }, false);
            }
        }, {
            key: initLog,
            value: function value() {
                var that = this;
                console.log = function () {
                    that[updateBuffer](arguments);
                    var args = [].slice.call(arguments);
                    if (that[shouldRender]()) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = arguments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var item = _step2.value;

                                if (/color:/.test(item)) continue;
                                that[render](item);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    }
                    logProto.apply(null, args);
                };
            }
        }, {
            key: shouldRender,
            value: function value() {
                return this[shouldrenderflag];
            }
        }, {
            key: 'hackInstall',
            value: function hackInstall() {
                var _this2 = this;

                if (this[hasRenderConsoleFlag]) return;
                this[hasRenderConsoleFlag] = true;
                this[shouldrenderflag] = true;
                this[init]();
                this[logarr].reverse().map(function (item, i) {
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = item[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var one = _step3.value;

                            if (/color:/.test(one)) continue;
                            _this2[render](one);
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }
                });
            }
        }, {
            key: render,
            value: function value(msg) {
                if (msg instanceof Event) {
                    this[renderEvent](msg);
                } else if (Object.prototype.toString.call(msg) === '[object Object]') {
                    this[renderHtml]('▶Object<div style="display:none">' + this[renderObj](msg) + '</div>', true);
                    objcount = 0;
                } else {
                    msg = typeof msg === 'string' ? msg : JSON.stringify(msg);
                    msg = msg.replace(/%c.+?%c/g, '');
                    this[renderHtml](msg);
                }
            }
        }, {
            key: renderObj,
            value: function value(obj, flag) {
                var res = [];
                objcount++;
                var space = this[renderSpace](flag ? objcount * 2 : 1);
                for (var item in obj) {
                    var str = '' + space + item + ':';
                    if (Object.prototype.toString.call(obj[item]) === '[object Object]') {
                        str += '{<br>';
                        str += '' + this[renderObj](obj[item], true);
                        str += '<br>' + space + '},';
                        res.push(str);
                        continue;
                    }
                    str = '' + str + obj[item] + ',';
                    res.push(str);
                }
                objcount = 0;
                return res.join('<br>');
            }
        }, {
            key: renderSpace,
            value: function value(i) {
                var str = [];
                while (i--) {
                    str.push('&nbsp;');
                }
                return str.join('');
            }
        }, {
            key: renderHtml,
            value: function value(html, isObj) {
                var div = document.createElement('div');
                if (isObj) {
                    div.setAttribute('data-obj', '1');
                }
                div.innerHTML = html;
                this.content.appendChild(div);
            }
        }, {
            key: renderEvent,
            value: function value(e) {
                var res = ['{'];
                for (var item in e) {
                    var str = '&nbsp;&nbsp;' + item + ':' + e[item] + ',';
                    res.push(str);
                }
                res.push('}');
                this.renderHtml('▶Object<div style="display:none">' + res.join('<br>') + '</div>', true);
            }
        }]);

        return logToHtml;
    }();

    if (instance) {
        return instance;
    } else {
        return instance = new logToHtml();
    }
}();