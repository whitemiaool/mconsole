'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.default = function () {
    var logProto = console.log;
    var errProto = console.error;
    var promisePro = Promise.prototype.catch;
    // let ObjProto              = Object.prototype.toString
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
    var appendRenderStrToBody = Symbol();
    var getSpaceStr = Symbol();
    var getObjStr = Symbol();
    var getRenderStr = Symbol();
    var updateBuffer = Symbol();
    var shouldrenderflag = Symbol();
    var hasRenderConsoleFlag = Symbol();
    var logarr = Symbol();
    var rootEleSelector = Symbol();
    var renderRootErr = Symbol();
    var windowOnError = Symbol();

    var logToHtml = function () {
        function logToHtml() {
            _classCallCheck(this, logToHtml);

            this[logarr] = [];
            this.netarr = [];
            this[shouldrenderflag] = false;
            this[hasRenderConsoleFlag] = false;
            this[rootEleSelector] = '#root';
            this.initPromiseCatch();
            this[initLog]();
            this[windowOnError]();
        }

        _createClass(logToHtml, [{
            key: windowOnError,
            value: function value() {
                var that = this;
                window.addEventListener('unhandledrejection', function (e) {
                    console.log(e);
                });
                // let that = this;
                window.addEventListener('error', function (e) {
                    that[renderRootErr](e);
                });
            }
        }, {
            key: 'initPromiseCatch',
            value: function initPromiseCatch() {
                Promise.prototype.catch = function (fn) {
                    function inner(r) {
                        console.log('catch', r);
                    }
                    promisePro.call(this, inner);
                    promisePro.call(this, fn);
                };
            }
        }, {
            key: 'dealHtml',
            value: function dealHtml(h) {
                return h.replace(/<|>/g, function (e) {
                    return e == '<' ? '&lt' : '&gt';
                });
            }
        }, {
            key: 'setRootEleSelector',
            value: function setRootEleSelector(id) {
                this[rootEleSelector] = id;
            }
        }, {
            key: 'sayNoWTF',
            value: function sayNoWTF() {}
        }, {
            key: renderRootErr,
            value: function value(e) {
                console.log(e);
                var that = this;
                if (!document.querySelector(this[rootEleSelector])) return;
                setTimeout(function () {
                    if (document.querySelector(that[rootEleSelector]).innerHTML.trim() == '') {
                        var div = document.createElement('div');
                        div.innerHTML = 'info:<br>' + e.filename + '<br>msg:' + e.message + '<br><br>';
                        document.body.insertBefore(div, document.querySelector(that[rootEleSelector]));
                    }
                }, 1000);
            }
        }, {
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
                div.innerHTML = '\n                <div id="' + this.toolbarId + '">\n                    <div data-type="1" style="background:#fff" id="' + this.logId + '">Log</div>\n                    <div data-type="2" id="' + this.netId + '">Net</div>\n                </div>\n                <div id="' + this.logId + 'id"></div>\n                <div id="' + this.netId + 'id"></div>\n                <div id="' + this.clearId + '">clear</div>                     \n            ';
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
                style.innerHTML = 'div#' + this.wrapId + ' {\n                position: fixed;\n                height: 75vh;\n                width: 100vw;\n                overflow-y:scroll;\n                background:rgb(218, 218, 218);\n                overflow-x: hidden;\n                bottom: 0px;\n                box-sizing: border-box;\n                padding: 30px 3px;\n                display: flex;\n                flex-direction: column;\n                overflow: hidden;\n                z-index:999;\n            }\n            #' + this.toolbarId + ' {\n                display: flex;\n                position: absolute;\n                justify-content: space-around;\n                width: 100%;\n                top:0px;\n                height:30px;\n                line-height:30px;\n                left:0px;\n                background:#f3f3f3;\n                border-bottom: 1px solid #ccc;\n            }\n            #' + this.toolbarId + '>div {\n                width:50%;\n                text-align:center;\n                border-left: 1px solid #ccc;\n            }\n            #' + this.logId + 'id,#' + this.netId + 'id {\n                overflow:auto;\n            }\n            #' + this.netId + 'id {\n                display:none\n            }\n            div#' + this.logId + 'id>div,div#' + this.netId + 'id>div{\n                background: #fff;\n                border-top: 1px solid #ccc;\n                padding: 5px 3px;\n                word-break: break-all;\n                min-height:19px;\n            }\n            div#' + this.buttonId + '{\n                border-radius: 5px;\n                position: fixed;\n                left: 14px;\n                top:50%;\n                background: #1abd10;\n                padding: 5px 10px;\n                color: #fff;\n                z-index:9999;\n                box-shadow: 0px 0px 7px 3px rgba(204, 204, 204,0.5);\n            }\n            #' + this.clearId + ' {\n                height: 30px;\n                text-align: center;\n                background: #f3f3f3;\n                position: absolute;\n                bottom: 0px;\n                width: 100%;\n                left: 0px;\n                line-height: 30px;\n                border-top: 1px solid #ccc;\n            }\n            div#' + this.netId + 'id h5,div#' + this.logId + 'id h5 {\n                margin: 0px;\n                color: blue;\n                margin-bottom: 5px;\n                display: inline-block;\n            }\n            .c_p_obj {\n                background: #e6ebff;\n                border-radius: 5px;\n            }\n            .c_p_obj b{\n                color: #0000ff;\n                font-weight: 400;\n            }\n            .c_e_obj {\n                background: #e4cece;\n                border-radius: 5px;\n            }\n            .c_e_obj b{\n                color: red;\n                font-weight: 400;\n            }\n            ';
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
                this.netcontent = document.getElementById(this.netId + 'id');
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

                function showObj(e) {
                    if (e.target.nodeName == 'H5') {
                        var target = e.target.parentNode.querySelector('div');
                        if (!target) return;
                        var display = target.style.display;
                        var value = target.previousSibling.textContent;
                        value = value.slice(1);
                        target.previousSibling.textContent = display == 'none' ? '▼' + value : '▶' + value;
                        target.style.display = display == 'none' ? 'block' : 'none';
                    }
                }
                // 内容区域
                var content = document.getElementById(this.logId + 'id');
                content.addEventListener('click', function (e) {
                    showObj(e);
                });

                var netcontent = document.getElementById(this.netId + 'id');
                netcontent.addEventListener('click', function (e) {
                    showObj(e);
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
                    var args = [].slice.call(arguments);
                    if (that[shouldRender]()) {
                        that.appendOneToBody(arguments);
                    } else {
                        that[updateBuffer](arguments);
                    }
                    logProto.apply(null, args);
                };
                console.error = function (e) {
                    var args = [].slice.call(arguments);
                    that[updateBuffer](arguments);
                    if (!document.querySelector(that[rootEleSelector])) return;
                    setTimeout(function () {
                        if (document.querySelector(that[rootEleSelector]).innerHTML.trim() == '') {
                            var div = document.createElement('div');
                            div.innerHTML = 'info:<br>' + args[0].replace(/\sin\s/g, '<br>&nbsp;&nbsp;in&nbsp;&nbsp;') + '<br><br>';
                            document.body.insertBefore(div, document.querySelector(that[rootEleSelector]));
                        }
                    }, 1000);
                    errProto.apply(args);
                };
            }
        }, {
            key: 'appendOneToBody',
            value: function appendOneToBody(item) {
                var str = '';
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = item[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var one = _step2.value;

                        if (typeof one == 'string' && /color:/.test(one)) continue;
                        str += (item.length == 1 ? '' : this[getSpaceStr](2)) + ' ' + this[getRenderStr](one);
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

                this[appendRenderStrToBody](this.content, str);
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
                this.netarr.reverse().map(function (item, i) {
                    _this2.renderNet(item);
                });
                this[logarr].reverse().map(function (item, i) {
                    _this2.appendOneToBody(item);
                });
            }
        }, {
            key: 'renderNet',
            value: function renderNet(msg) {
                this[appendRenderStrToBody](this.netcontent, '<h5>\u25B6' + msg.url + ' ' + msg.status + '</h5><div style="display:none">' + this[getObjStr](msg) + '</div>', true);
            }
        }, {
            key: getRenderStr,
            value: function value(msg) {
                if (msg instanceof MouseEvent) {
                    this[renderEvent](msg);
                } else if (msg instanceof ErrorEvent) {
                    objcount = 0;
                    var stack = msg.error.stack.replace(/\sat\s/g, '<br>&nbsp;&nbsp;at&nbsp;&nbsp;');
                    return '<h5 style="color:red">▶Error</h5><div class="c_e_obj" style="display:none">' + this[getObjStr]({ filename: msg.filename, msg: msg.message, stack: stack }) + '<br>&nbsp;</div>';
                } else if (msg instanceof PromiseRejectionEvent) {
                    objcount = 0;
                    var _stack = msg.reason.stack.replace(/\sat\s/g, '<br>&nbsp;&nbsp;at&nbsp;&nbsp;');
                    return '<h5 style="color:red">▶Error</h5><div class="c_e_obj" style="display:none">' + this[getObjStr]({ msg: msg.reason.message, stack: _stack }) + '<br>&nbsp;</div>';
                } else if (msg instanceof Error) {
                    objcount = 0;
                    var _stack2 = msg.stack.replace(/\sat\s/g, '<br>&nbsp;&nbsp;at&nbsp;&nbsp;');
                    return '<h5 style="color:red">▶Error</h5><div class="c_e_obj" style="display:none">' + this[getObjStr]({ filename: msg.filename, msg: msg.message, stack: _stack2 }) + '<br>&nbsp;</div>';
                } else if (msg instanceof Event) {
                    this[renderEvent](msg);
                } else if (Object.prototype.toString.call(msg) === '[object Object]') {
                    objcount = 0;
                    return '<h5>\u25B6Object</h5><div class="c_p_obj" style="display:none">{<br> ' + this[getObjStr](msg) + ' <br>}&nbsp;</div>';
                } else if (Object.prototype.toString.call(msg) === '[object Array]') {
                    objcount = 0;
                    return '<h5>\u25B6Array</h5><div class="c_p_obj" style="display:none">[<br> ' + this[getObjStr](msg) + ' <br>]&nbsp;</div>';
                } else {
                    if (typeof msg === 'undefined' || msg === null) {
                        return '<i style="color:#909090">' + JSON.stringify(msg) + '</i>';
                    }
                    msg = typeof msg === 'string' ? msg : JSON.stringify(msg);
                    msg = msg && msg.replace(/%c.+?%c/g, '');
                    return msg;
                }
            }
        }, {
            key: getObjStr,
            value: function value(obj, flag) {
                var res = [];
                var space = this[getSpaceStr](flag ? objcount * 4 + 2 : 2);
                objcount++;
                for (var item in obj) {
                    var str = space + '<b>' + item + ':</b>&nbsp;';
                    if (Object.prototype.toString.call(obj[item]) === '[object Object]') {
                        str += '{<br>';
                        str += '' + this[getObjStr](obj[item], true);
                        str += '<br>' + space + '},';
                        res.push(str);
                        continue;
                    }
                    str = '' + str + obj[item] + ',';
                    res.push(str);
                }
                objcount = 1;
                return res.join('<br>');
            }
        }, {
            key: getSpaceStr,
            value: function value(i) {
                var str = [];
                while (i--) {
                    str.push('&nbsp;');
                }
                return str.join('');
            }
        }, {
            key: appendRenderStrToBody,
            value: function value(ele, html, isObj) {
                var div = document.createElement('div');
                if (isObj) {
                    div.setAttribute('data-obj', '1');
                }
                div.innerHTML = html;
                ele.appendChild(div);
            }
        }, {
            key: renderEvent,
            value: function value(e) {
                var res = ['{'];
                for (var item in e) {
                    var str = '&nbsp;&nbsp;' + item + ':&nbsp;' + e[item] + ',';
                    res.push(str);
                }
                res.push('}');
                this[appendRenderStrToBody](this.content, '<h5>▶Object</h5><div class="c_p_obj" style="display:none">' + res.join('<br>') + '</div>', true);
            }
        }]);

        return logToHtml;
    }();

    if (!instance) {
        instance = new logToHtml();
    }
    return instance;
}();