export default (() => {
    let logProto = console.log;
    let errProto = console.error;
    let promisePro = Promise.prototype.catch
    let objcount = 0;
    let instance = null;
    let initId = Symbol();
    let initHtml = Symbol();
    let initCss = Symbol();
    let init = Symbol();
    let initEvent = Symbol();
    let initLog = Symbol()
    let shouldRender = Symbol();
    let renderEvent = Symbol();
    let appendRenderStrToBody = Symbol();
    let getSpaceStr = Symbol();
    let getObjStr = Symbol();
    let getRenderStr = Symbol();
    let updateBuffer = Symbol();
    let shouldrenderflag = Symbol();
    let hasRenderConsoleFlag = Symbol();
    let logarr = Symbol();
    let rootEleSelector = Symbol();
    let renderRootErr = Symbol();
    let windowOnError = Symbol();

    class Net {
        constructor() {
            this.mockAJAX()
            this.reqList = {};
        }

        mockAJAX() {
            let _XMLHttpRequest = window.XMLHttpRequest;
            if (!_XMLHttpRequest) { return; }

            let that = this;
            let _open = window.XMLHttpRequest.prototype.open,
                _send = window.XMLHttpRequest.prototype.send;
            that._open = _open;
            that._send = _send;
            window.XMLHttpRequest.prototype.open = function () {
                let XMLReq = this;
                let args = [].slice.call(arguments),
                    method = args[0],
                    url = args[1],
                    id = that[initId]();
                let timer = null;
                // may be used by other functions
                XMLReq._requestID = id;
                XMLReq._method = method;
                XMLReq._url = url;

                // mock onreadystatechange
                let _onreadystatechange = XMLReq.onreadystatechange || function () { };
                let onreadystatechange = function () {

                    let item = that.reqList[id] || {};

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
                            item.startTime = (+new Date());
                        }
                    } else if (XMLReq.readyState == 1) {
                        // OPENED
                        if (!item.startTime) {
                            item.startTime = (+new Date());
                        }
                    } else if (XMLReq.readyState == 2) {
                        // HEADERS_RECEIVED
                        item.header = {};
                        let header = XMLReq.getAllResponseHeaders() || '',
                            headerArr = header.split("\n");
                        // extract plain text to key-value format
                        for (let i = 0; i < headerArr.length; i++) {
                            let line = headerArr[i];
                            if (!line) { continue; }
                            let arr = line.split(': ');
                            let key = arr[0],
                                value = arr.slice(1).join(': ');
                            item.header[key] = value;
                        }
                    } else if (XMLReq.readyState == 3) {
                        // LOADING
                    } else if (XMLReq.readyState == 4) {
                        // DONE
                        clearInterval(timer);
                        item.endTime = +new Date(),
                            item.costTime = item.endTime - (item.startTime || item.endTime);
                        item.response = XMLReq.response;
                        if(that[shouldRender]()) {
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
                let preState = -1;
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
                let XMLReq = this;
                let args = [].slice.call(arguments),
                    data = args[0];

                let item = that.reqList[XMLReq._requestID] || {};
                item.method = XMLReq._method.toUpperCase();

                let query = XMLReq._url.split('?'); // a.php?b=c&d=?e => ['a.php', 'b=c&d=', '?e']
                item.url = query.shift(); // => ['b=c&d=', '?e']

                if (query.length > 0) {
                    item.getData = {};
                    query = query.join('?'); // => 'b=c&d=?e'
                    query = query.split('&'); // => ['b=c', 'd=?e']
                    for (let q of query) {
                        q = q.split('=');
                        item.getData[q[0]] = q[1];
                    }
                }

                if (item.method == 'POST') {

                    // save POST data
                    if (typeof data === 'string') {
                        let arr = data.split('&');
                        item.postData = {};
                        for (let q of arr) {
                            q = q.split('=');
                            item.postData[q[0]] = q[1];
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
        updateRequest(id, data) {
            let item = this.reqList[id] || {};
            for (let key in data) {
                item[key] = data[key];
            }
            this.reqList[id] = item;
        }
    }
    class logToHtml extends Net {
        constructor() {
            super();
            this[logarr] = [];
            this.netarr = [];
            this[shouldrenderflag] = false;
            this[hasRenderConsoleFlag] = false;
            this.btmove = false
            this[rootEleSelector] = '#root';
            this.initPromiseCatch();
            this[initLog]();
            this[windowOnError]();
        }
        [windowOnError]() {
            let that = this;

            window.addEventListener('unhandledrejection', (e) => {
                console.log(e)
            });
            window.addEventListener('error', (e) => {
                e.stopPropagation();
                that[renderRootErr](e);
            }, false)
        }
        initPromiseCatch() {
            Promise.prototype.catch = function (fn) {
                function inner(r) {
                    console.log('catch', r)
                }
                promisePro.call(this, inner)
                promisePro.call(this, fn)
            }
        }
        dealHtml(h) {
            return h.replace(/<|>/g, (e) => {
                return e === '<' ? '&lt' : '&gt'
            })
        }
        setRootEleSelector(id) {
            this[rootEleSelector] = id;
        }
        [renderRootErr](e) {
            console.log(e);
            if (!document.querySelector(this[rootEleSelector])) return
            let that = this;
            setTimeout(() => {
                if (document.querySelector(that[rootEleSelector]).innerHTML.trim() === '') {
                    let div = document.createElement('div');
                    let stack = e.error && e.error.stack && e.error.stack.replace(/\sat\s/g, '<br>&nbsp;&nbsp;at&nbsp;&nbsp;')
                    div.innerHTML = `info:<br>file:${e.filename}<br>msg:${e.message}<br>stack:${stack}<br><br>`;
                    document.body.appendChild(div);
                }
            }, 1000);
        }
        [initId]() {
            const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            return `id${s4() + s4()}-${s4()}`;
        }

        [initHtml]() {
            let div = document.createElement('div');
            div.setAttribute('id', this.wrapId);
            div.innerHTML = `
            <div id="${this.toolbarId}">
                <div data-type="1" style="background:#fff" id="${this.logId}">Log</div>
                <div data-type="2" id="${this.netId}">Net</div>
                </div>
                <div id="${this.logId}id"></div>
                <div id="${this.netId}id"></div>
                <div id="${this.clearId}">clear</div>                     
            `;
            document.body.appendChild(div);
            let div1 = document.createElement('div');
            div1.setAttribute('id', this.buttonId);
            div1.innerHTML = 'dConsole';
            document.body.appendChild(div1);
        }

        [initCss]() {
            let style = document.createElement('style');
            style.innerHTML = `div#${this.wrapId} {
                position: fixed;
                height: 75vh;
                width: 100vw;
                overflow-y:scroll;
                background:rgb(218, 218, 218);
                overflow-x: hidden;
                bottom: 0px;
                box-sizing: border-box;
                padding: 30px 3px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index:999;
            }
            #${this.toolbarId} {
                display: flex;
                position: absolute;
                justify-content: space-around;
                width: 100%;
                top:0px;
                height:30px;
                line-height:30px;
                left:0px;
                background:#f3f3f3;
                border-bottom: 1px solid #ccc;
            }
            #${this.toolbarId}>div {
                width:50%;
                text-align:center;
                border-left: 1px solid #ccc;
            }
            #${this.logId}id,#${this.netId}id {
                overflow:auto;
            }
            #${this.netId}id {
                display:none
            }
            div#${this.logId}id>div,div#${this.netId}id>div{
                background: #fff;
                border-top: 1px solid #ccc;
                padding: 5px 3px;
                word-break: break-all;
                min-height:19px;
            }
            div#${this.buttonId}{
                border-radius: 5px;
                position: fixed;
                left: 14px;
                top:50%;
                background: #1abd10;
                padding: 5px 10px;
                color: #fff;
                z-index:9999;
                box-shadow: 0px 0px 7px 3px rgba(204, 204, 204,0.5);
            }
            #${this.clearId} {
                height: 30px;
                text-align: center;
                background: #f3f3f3;
                position: absolute;
                bottom: 0px;
                width: 100%;
                left: 0px;
                line-height: 30px;
                border-top: 1px solid #ccc;
            }
            div#${this.netId}id h5,div#${this.logId}id h5 {
                margin: 0px;
                color: blue;
                margin-bottom: 5px;
                display: inline-block;
            }
            .c_p_obj {
                background: #e6ebff;
                border-radius: 5px;
            }
            .c_p_obj b{
                color: #0000ff;
                font-weight: 400;
            }
            .c_e_obj {
                background: #e4cece;
                border-radius: 5px;
            }
            .c_e_obj b{
                color: red;
                font-weight: 400;
            }
            `;
            document.head.appendChild(style)
        }

        [init]() {
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

        [updateBuffer](args) {
            this[logarr].unshift(args);
            this[logarr].length = 50;
        }

        [initEvent]() {
            let that = this;
            function showObj(e) {
                if (e.target.nodeName === 'H5') {
                    let target = e.target.parentNode.querySelector('div');
                    if (!target) return
                    let display = target.style.display;
                    let value = target.previousSibling.textContent;
                    value = value.slice(1);
                    target.previousSibling.textContent = display === 'none' ? '▼' + value : '▶' + value;
                    target.style.display = display === 'none' ? 'block' : 'none';
                }
            }
            // 内容区域
            let content = document.getElementById(this.logId + 'id');
            content.addEventListener('click', (e) => {
                showObj(e)
            });

            let netcontent = document.getElementById(this.netId + 'id');
            netcontent.addEventListener('click', (e) => {
                showObj(e)
            })


            // 显示隐藏按钮
            let bt = document.getElementById(this.buttonId);
            bt.addEventListener('click', (e) => {
                if (that.btmove == true) return
                that.wrap.style.display = this.wrap.style.display === 'none' ? 'flex' : 'none'
            })
            bt.addEventListener('touchmove', function (event) {
                if (event.targetTouches.length == 1) {
                    let touch = event.targetTouches[0];
                    bt.style.left = touch.pageX - 48 + 'px';
                    bt.style.top = touch.pageY - 15 + 'px';
                }
            }, false);

            // 清除log
            let clear = document.getElementById(this.clearId);
            clear.addEventListener('click', (e) => {
                this.content.innerHTML = ''
            }, false);

            // Toolbar
            let tool = document.getElementById(this.toolbarId);
            tool.addEventListener('click', (e) => {
                if (!e.target.hasAttribute('data-type')) return
                let targetId = e.target.getAttribute('id');
                let parent = e.target.parentNode;
                let childs = parent.childNodes;
                e.target.style.background = '#fff';
                for (let item of childs) {
                    if (!(item.nodeType == 1)) continue
                    if (item.getAttribute('id') == targetId) {
                        document.getElementById(targetId + 'id').style.display = 'block';
                        continue;
                    }
                    document.getElementById(item.getAttribute('id')).style.background = '';
                    document.getElementById(item.getAttribute('id') + 'id').style.display = 'none';
                }
            }, false)
        }
        [initLog]() {
            let that = this;
            console.log = function () {
                let args = [].slice.call(arguments);
                if (that[shouldRender]()) {
                    that.appendOneToBody(arguments)
                } else {
                    that[updateBuffer](arguments)
                }
                logProto.apply(null, args)
            }
            console.error = function (e) {
                let args = [].slice.call(arguments);
                that[updateBuffer](arguments);
                if (!document.querySelector(that[rootEleSelector])) return
                errProto.apply(args)
                setTimeout(() => {
                    if (document.querySelector(that[rootEleSelector]).innerHTML.trim() == '') {
                        let div = document.createElement('div');
                        div.innerHTML = `info:<br>${args[0].replace(/\sin\s/g, '<br>&nbsp;&nbsp;in&nbsp;&nbsp;')}<br><br>`;
                        document.body.insertBefore(div, document.querySelector(that[rootEleSelector]));
                    }
                }, 1000);
            }
        }
        appendOneToBody(item) {
            let str = '';
            for (let one of item) {
                if (typeof one == 'string' && /color:/.test(one)) continue
                str += `${item.length == 1 ? '' : this[getSpaceStr](2)} ${this[getRenderStr](one)}`
            }
            this[appendRenderStrToBody](this.content, str)
        }
        [shouldRender]() {
            return this[shouldrenderflag]
        }
        hackInstall() {
            if (this[hasRenderConsoleFlag]) return
            this[hasRenderConsoleFlag] = true
            this[shouldrenderflag] = true;
            this[init]();
            this.netarr.reverse().map((item, i) => {
                this.renderNet(item)
            })
            this[logarr].reverse().map((item, i) => {
                this.appendOneToBody(item)
            })
        }

        renderNet(msg) {
            this[appendRenderStrToBody](this.netcontent,`<h5>▶${msg.url} ${msg.status}</h5><div class="c_n_obj" style="display:none">${this[getObjStr](msg)}</div>`, true);
        }

        [getRenderStr](msg) {
            if (msg instanceof MouseEvent) {
                this[renderEvent](msg);
            } else if (msg instanceof ErrorEvent) {
                objcount = 0;
                let stack = msg.error.stack.replace(/\sat\s/g, '<br>&nbsp;&nbsp;at&nbsp;&nbsp;')
                return '<h5 style="color:red">▶Error</h5><div class="c_e_obj" style="display:none">' + this[getObjStr]({ filename: msg.filename, msg: msg.message, stack: stack }) + '<br>&nbsp;</div>'
            } else if (msg instanceof PromiseRejectionEvent) {
                objcount = 0;
                let stack = msg.reason.stack.replace(/\sat\s/g, '<br>&nbsp;&nbsp;at&nbsp;&nbsp;')
                return '<h5 style="color:red">▶Error</h5><div class="c_e_obj" style="display:none">' + this[getObjStr]({ msg: msg.reason.message, stack: stack }) + '<br>&nbsp;</div>'
            } else if (msg instanceof Error) {
                objcount = 0;
                let stack = msg.stack.replace(/\sat\s/g, '<br>&nbsp;&nbsp;at&nbsp;&nbsp;')
                return '<h5 style="color:red">▶Error</h5><div class="c_e_obj" style="display:none">' + this[getObjStr]({ filename: msg.filename, msg: msg.message, stack: stack }) + '<br>&nbsp;</div>'
            } else if (msg instanceof Event) {
                this[renderEvent](msg);
            } else if (Object.prototype.toString.call(msg) === '[object Object]') {
                objcount = 0;
                return `<h5>▶Object</h5><div class="c_p_obj" style="display:none">{<br> ${this[getObjStr](msg)} <br>}&nbsp;</div>`
            } else if (Object.prototype.toString.call(msg) === '[object Array]') {
                objcount = 0;
                return `<h5>▶Array</h5><div class="c_p_obj" style="display:none">[<br> ${this[getObjStr](msg)} <br>]&nbsp;</div>`
            } else {
                if (typeof msg === 'undefined' || msg === null) {
                    return `<i style="color:#909090">${JSON.stringify(msg)}</i>`
                }
                msg = typeof msg === 'string' ? msg : JSON.stringify(msg);
                msg = msg && msg.replace(/%c.+?%c/g, '');
                return msg
            }
        }
        [getObjStr](obj, flag) {
            let res = [];
            let space = this[getSpaceStr](flag ? objcount * 4 + 2 : 2);
            objcount++;
            for (let item in obj) {
                let str = `${space}<b>${item}:</b>&nbsp;`;
                if (Object.prototype.toString.call(obj[item]) === '[object Object]') {
                    str += `{<br>`;
                    str += `${this[getObjStr](obj[item], true)}`;
                    str += `<br>${space}},`;
                    res.push(str);
                    continue
                }
                str = `${str}${obj[item]},`;
                res.push(str)
            }
            objcount = 1;
            return res.join('<br>')
        }

        [getSpaceStr](i) {
            let str = [];
            while (i--) {
                str.push('&nbsp;')
            }
            return str.join('')
        }

        [appendRenderStrToBody](ele, html, isObj) {
            let div = document.createElement('div');
            if (isObj) {
                div.setAttribute('data-obj', '1')
            }
            div.innerHTML = html
            ele.appendChild(div)
        }

        [renderEvent](e) {
            let res = ['{'];
            for (let item in e) {
                let str = `&nbsp;&nbsp;${item}:&nbsp;${e[item]},`
                res.push(str)
            }
            res.push('}')
            this[appendRenderStrToBody](this.content, '<h5>▶Object</h5><div class="c_p_obj" style="display:none">' + res.join('<br>') + '</div>', true)
        }
    }
    if (!instance) {
        instance = new logToHtml()
    }
    return instance
})()

