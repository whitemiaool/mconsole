'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.default = function () {
    var logProto = console.log;
    var errProto = console.error;
    var promisePro = Promise.prototype.catch;
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

    var Net = function () {
        function Net() {
            _classCallCheck(this, Net);

            this.mockAJAX();
            this.reqList = {};
        }

        _createClass(Net, [{
            key: 'mockAJAX',
            value: function mockAJAX() {
                var _XMLHttpRequest = window.XMLHttpRequest;
                if (!_XMLHttpRequest) {
                    return;
                }

                var that = this;
                var _open = window.XMLHttpRequest.prototype.open,
                    _send = window.XMLHttpRequest.prototype.send;
                that._open = _open;
                that._send = _send;
                window.XMLHttpRequest.prototype.open = function () {
                    var XMLReq = this;
                    var args = [].slice.call(arguments),
                        method = args[0],
                        url = args[1],
                        id = that[initId]();
                    var timer = null;
                    // may be used by other functions
                    XMLReq._requestID = id;
                    XMLReq._method = method;
                    XMLReq._url = url;

                    // mock onreadystatechange
                    var _onreadystatechange = XMLReq.onreadystatechange || function () {};
                    var onreadystatechange = function onreadystatechange() {

                        var item = that.reqList[id] || {};

                        // update status
                        item.readyState = XMLReq.readyState;
                        item.status = 0;
                        if (XMLReq.readyState > 1) {
                            item.status = XMLReq.status;
                        }
                        item.responseType = XMLReq.responseType;

                        if (XMLReq.readyState == 0) {
                            // UNSENT
                            if (!item.startTime) {
                                item.startTime = +new Date();
                            }
                        } else if (XMLReq.readyState == 1) {
                            // OPENED
                            if (!item.startTime) {
                                item.startTime = +new Date();
                            }
                        } else if (XMLReq.readyState == 2) {
                            // HEADERS_RECEIVED
                            item.header = {};
                            var header = XMLReq.getAllResponseHeaders() || '',
                                headerArr = header.split("\n");
                            // extract plain text to key-value format
                            for (var i = 0; i < headerArr.length; i++) {
                                var line = headerArr[i];
                                if (!line) {
                                    continue;
                                }
                                var arr = line.split(': ');
                                var key = arr[0],
                                    value = arr.slice(1).join(': ');
                                item.header[key] = value;
                            }
                        } else if (XMLReq.readyState == 3) {
                            // LOADING
                        } else if (XMLReq.readyState == 4) {
                            // DONE
                            clearInterval(timer);
                            item.endTime = +new Date(), item.costTime = item.endTime - (item.startTime || item.endTime);
                            item.response = XMLReq.response;
                            if (that[shouldRender]()) {
                                that.renderNet(item);
                            } else {
                                that.netarr.unshift(item);
                                that.netarr.length = 50;
                            }
                        } else {
                            clearInterval(timer);
                        }

                        that.updateRequest(id, item);
                        return _onreadystatechange.apply(XMLReq, arguments);
                    };
                    XMLReq.onreadystatechange = onreadystatechange;

                    // some 3rd libraries will change XHR's default function
                    // so we use a timer to avoid lost tracking of readyState
                    var preState = -1;
                    timer = setInterval(function () {
                        if (preState != XMLReq.readyState) {
                            preState = XMLReq.readyState;
                            onreadystatechange.call(XMLReq);
                        }
                    }, 10);

                    return _open.apply(XMLReq, args);
                };

                // mock send()
                window.XMLHttpRequest.prototype.send = function () {
                    var XMLReq = this;
                    var args = [].slice.call(arguments),
                        data = args[0];

                    var item = that.reqList[XMLReq._requestID] || {};
                    item.method = XMLReq._method.toUpperCase();

                    var query = XMLReq._url.split('?'); // a.php?b=c&d=?e => ['a.php', 'b=c&d=', '?e']
                    item.url = query.shift(); // => ['b=c&d=', '?e']

                    if (query.length > 0) {
                        item.getData = {};
                        query = query.join('?'); // => 'b=c&d=?e'
                        query = query.split('&'); // => ['b=c', 'd=?e']
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = query[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var q = _step.value;

                                q = q.split('=');
                                item.getData[q[0]] = q[1];
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
                    }

                    if (item.method == 'POST') {

                        // save POST data
                        if (typeof data === 'string') {
                            var arr = data.split('&');
                            item.postData = {};
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = arr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var _q = _step2.value;

                                    _q = _q.split('=');
                                    item.postData[_q[0]] = _q[1];
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
                        } else if (Object.prototype.toString.call(data) === '[object Object]') {
                            item.postData = data;
                        }
                    }

                    // if (!XMLReq._noVConsole) {
                    that.updateRequest(XMLReq._requestID, item);
                    // }

                    return _send.apply(XMLReq, args);
                };
            }
        }, {
            key: 'updateRequest',
            value: function updateRequest(id, data) {
                var item = this.reqList[id] || {};
                for (var key in data) {
                    item[key] = data[key];
                }
                this.reqList[id] = item;
            }
        }]);

        return Net;
    }();

    var logToHtml = function (_Net) {
        _inherits(logToHtml, _Net);

        function logToHtml() {
            _classCallCheck(this, logToHtml);

            var _this = _possibleConstructorReturn(this, (logToHtml.__proto__ || Object.getPrototypeOf(logToHtml)).call(this));

            _this[logarr] = [];
            _this.netarr = [];
            _this[shouldrenderflag] = false;
            _this[hasRenderConsoleFlag] = false;
            _this.btmove = false;
            _this[rootEleSelector] = '#root';
            _this.initPromiseCatch();
            _this[initLog]();
            _this[windowOnError]();
            return _this;
        }

        _createClass(logToHtml, [{
            key: windowOnError,
            value: function value() {
                var that = this;

                window.addEventListener('unhandledrejection', function (e) {
                    console.log(e);
                });
                window.addEventListener('error', function (e) {
                    e.stopPropagation();
                    that[renderRootErr](e);
                }, false);
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
                    return e === '<' ? '&lt' : '&gt';
                });
            }
        }, {
            key: 'setRootEleSelector',
            value: function setRootEleSelector(id) {
                this[rootEleSelector] = id;
            }
        }, {
            key: renderRootErr,
            value: function value(e) {
                console.log(e);
                if (!document.querySelector(this[rootEleSelector])) return;
                var that = this;
                setTimeout(function () {
                    if (document.querySelector(that[rootEleSelector]).innerHTML.trim() === '') {
                        var div = document.createElement('div');
                        var stack = e.error && e.error.stack && e.error.stack.replace(/\sat\s/g, '<br>&nbsp;&nbsp;at&nbsp;&nbsp;');
                        div.innerHTML = 'info:<br>file:' + e.filename + '<br>msg:' + e.message + '<br>stack:' + stack + '<br><br>';
                        document.body.appendChild(div);
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
                div.innerHTML = '\n            <div id="' + this.toolbarId + '">\n                <div data-type="1" style="background:#fff" id="' + this.logId + '">Log</div>\n                <div data-type="2" id="' + this.netId + '">Net</div>\n                </div>\n                <div id="' + this.logId + 'id"></div>\n                <div id="' + this.netId + 'id"></div>\n                <div id="' + this.clearId + '">clear</div>                     \n            ';
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
                var _this2 = this;

                var that = this;
                function showObj(e) {
                    if (e.target.nodeName === 'H5') {
                        var target = e.target.parentNode.querySelector('div');
                        if (!target) return;
                        var display = target.style.display;
                        var value = target.previousSibling.textContent;
                        value = value.slice(1);
                        target.previousSibling.textContent = display === 'none' ? '▼' + value : '▶' + value;
                        target.style.display = display === 'none' ? 'block' : 'none';
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
                    if (that.btmove == true) return;
                    that.wrap.style.display = _this2.wrap.style.display === 'none' ? 'flex' : 'none';
                });
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
                    _this2.content.innerHTML = '';
                }, false);

                // Toolbar
                var tool = document.getElementById(this.toolbarId);
                tool.addEventListener('click', function (e) {
                    if (!e.target.hasAttribute('data-type')) return;
                    var targetId = e.target.getAttribute('id');
                    var parent = e.target.parentNode;
                    var childs = parent.childNodes;
                    e.target.style.background = '#fff';
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = childs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var item = _step3.value;

                            if (!(item.nodeType == 1)) continue;
                            if (item.getAttribute('id') == targetId) {
                                document.getElementById(targetId + 'id').style.display = 'block';
                                continue;
                            }
                            document.getElementById(item.getAttribute('id')).style.background = '';
                            document.getElementById(item.getAttribute('id') + 'id').style.display = 'none';
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
                    errProto.apply(args);
                    setTimeout(function () {
                        if (document.querySelector(that[rootEleSelector]).innerHTML.trim() == '') {
                            var div = document.createElement('div');
                            div.innerHTML = 'info:<br>' + args[0].replace(/\sin\s/g, '<br>&nbsp;&nbsp;in&nbsp;&nbsp;') + '<br><br>';
                            document.body.insertBefore(div, document.querySelector(that[rootEleSelector]));
                        }
                    }, 1000);
                };
            }
        }, {
            key: 'appendOneToBody',
            value: function appendOneToBody(item) {
                var str = '';
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = item[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var one = _step4.value;

                        if (typeof one == 'string' && /color:/.test(one)) continue;
                        str += (item.length == 1 ? '' : this[getSpaceStr](2)) + ' ' + this[getRenderStr](one);
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
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
                var _this3 = this;

                if (this[hasRenderConsoleFlag]) return;
                this[hasRenderConsoleFlag] = true;
                this[shouldrenderflag] = true;
                this[init]();
                this.netarr.reverse().map(function (item, i) {
                    _this3.renderNet(item);
                });
                this[logarr].reverse().map(function (item, i) {
                    _this3.appendOneToBody(item);
                });
            }
        }, {
            key: 'renderNet',
            value: function renderNet(msg) {
                this[appendRenderStrToBody](this.netcontent, '<h5>\u25B6' + msg.url + ' ' + msg.status + '</h5><div class="c_n_obj" style="display:none">' + this[getObjStr](msg) + '</div>', true);
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
    }(Net);

    if (!instance) {
        instance = new logToHtml();
    }
    return instance;
}();