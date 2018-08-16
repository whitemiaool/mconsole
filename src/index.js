export default (() => {
    let logProto              = console.log;
    let errProto              = console.error;
    let promisePro = Promise.prototype.catch
    // let ObjProto              = Object.prototype.toString
    let objcount              = 0;
    let instance              = null;
    let initId                = Symbol();
    let initHtml              = Symbol();
    let initCss               = Symbol();
    let init                  = Symbol();
    let initEvent             = Symbol();
    let initLog               = Symbol()
    let shouldRender          = Symbol();
    let renderEvent           = Symbol();
    let appendRenderStrToBody = Symbol();
    let getSpaceStr           = Symbol();
    let getObjStr             = Symbol();
    let getRenderStr          = Symbol();
    let updateBuffer          = Symbol();
    let shouldrenderflag      = Symbol();
    let hasRenderConsoleFlag  = Symbol();
    let logarr                = Symbol();
    let rootEleSelector       = Symbol();
    let renderRootErr         = Symbol();
    let windowOnError         = Symbol();

    class Net {
        constructor() {
            this.initNet();
        }
        initNet() {
            this.ajaxPolyfill();
            this.rewriteAjax();
            this.initNetEvent()
        }
        ajaxPolyfill() {
            if ( typeof window.self.CustomEvent === "function" ) return false;
            function CustomEvent ( event, params ) {
                params = params || { bubbles: false, cancelable: false, detail: undefined };
                let evt = document.createEvent( 'CustomEvent' );
                evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
                return evt;
            }
            CustomEvent.prototype = window.self.Event.prototype;
            window.self.CustomEvent = CustomEvent;
        }

        rewriteAjax() {
            // copy from aliyun blog
            function ajaxEventTrigger(event) {
                let ajaxEvent = new CustomEvent(event, { detail: this });
                window.self.dispatchEvent(ajaxEvent);
            }
            let oldXHR = window.self.XMLHttpRequest;
         
            function newXHR() {
                let realXHR = new oldXHR();
                realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);
                realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);
                realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
                realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
                realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);        
                realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);        
                realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);       
                realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);      
                return realXHR;
            }
            window.self.XMLHttpRequest = newXHR;
        }
        initNetEvent() {
            let that = this;
            window.self.addEventListener('ajaxReadyStateChange', function (e) {
                if(e.detail.readyState === 4) {
                    let res = {read:e.detail.readyState,url:e.detail.responseURL,status:e.detail.status,response:that.dealHtml(e.detail.responseText)}
                    if(that[shouldRender]()) {
                        that.renderNet(res);
                    } else {
                        that.netarr.unshift(res);
                        that.netarr.length = 50;
                    }
                }   
            });
            window.self.addEventListener('ajaxAbort', function (e) {
                // console.warn('eeeeee',e.detail.responseText); // XHR 返回的内容
            });
            // window.self.addEventListener('ajaxLoad', function (e) {
            //     console.warn('eeeeee',e); // XHR 返回的内容
            // });
        }
    }
    class logToHtml extends Net{
        constructor() {
            super();
            this[logarr]               = [];
            this.netarr                = [];
            this[shouldrenderflag]     = false;
            this[hasRenderConsoleFlag] = false;
            this[rootEleSelector]      = '#root';
            this.initPromiseCatch();
            this[initLog]();
            this[windowOnError]();
        }
        [windowOnError]() {
            let that = this;
            window.addEventListener('unhandledrejection', (e)=>{
                console.log(e)
            });
            // let that = this;
            window.addEventListener('error',(e)=>{
                that[renderRootErr](e);
            })
        }
        initPromiseCatch() {
            Promise.prototype.catch = function(fn) {
                function inner(r) {
                    console.log('catch',r)
                }
                promisePro.call(this,inner)
                promisePro.call(this,fn)
            }
        }
        dealHtml(h) {
            return h.replace(/<|>/g,(e)=>{
                return e == '<'?'&lt':'&gt'
            })
        }
        setRootEleSelector(id) {
            this[rootEleSelector] = id;
        }
        sayNoWTF() {
            
        }
        [renderRootErr](e) {
            console.log(e);
            let that = this;
            if(!document.querySelector(this[rootEleSelector])) return
            setTimeout(() => {
                if(document.querySelector(that[rootEleSelector]).innerHTML.trim() == '') {
                    let div = document.createElement('div');
                    div.innerHTML = `info:<br>${e.filename}<br>msg:${e.message}<br><br>`;
                    document.body.insertBefore(div,document.querySelector(that[rootEleSelector]));
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
            function showObj(e) {
                if(e.target.nodeName == 'H5') {
                    let target = e.target.parentNode.querySelector('div');
                    if (!target) return
                    let display = target.style.display;
                    let value = target.previousSibling.textContent;
                    value = value.slice(1);
                    target.previousSibling.textContent = display == 'none' ? '▼'+value : '▶'+value;
                    target.style.display = display == 'none' ? 'block' : 'none';
                }
            }
            // 内容区域
            let content = document.getElementById(this.logId + 'id');
            content.addEventListener('click', (e)=>{
                showObj(e)
            });

            let netcontent = document.getElementById(this.netId + 'id');
            netcontent.addEventListener('click',(e)=>{
                showObj(e)
            })


            // 显示隐藏按钮
            let bt = document.getElementById(this.buttonId);
            bt.addEventListener('click', (e) => {
                this.wrap.style.display = this.wrap.style.display == 'none' ? 'flex' : 'none'
            }, false)
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
            console.error = function(e) {
                let args = [].slice.call(arguments);
                that[updateBuffer](arguments)
                if(!document.querySelector(that[rootEleSelector])) return
                setTimeout(() => {
                    if(document.querySelector(that[rootEleSelector]).innerHTML.trim() == '') {
                        let div = document.createElement('div');
                        div.innerHTML = `info:<br>${args[0].replace(/\sin\s/g,'<br>&nbsp;&nbsp;in&nbsp;&nbsp;')}<br><br>`;
                        document.body.insertBefore(div,document.querySelector(that[rootEleSelector]));
                    }
                }, 1000);                
                errProto.apply(args)
            }
        }
        appendOneToBody(item) {
            let str = '';
            for (let one of item) {
                if (typeof one == 'string'&&/color:/.test(one)) continue
                str+=`${item.length==1?'':this[getSpaceStr](2)} ${this[getRenderStr](one)}`
            }
            this[appendRenderStrToBody](this.content,str)
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
            this[appendRenderStrToBody](this.netcontent,`<h5>▶${msg.url} ${msg.status}</h5><div style="display:none">${this[getObjStr](msg)}</div>`, true);
        }

        [getRenderStr](msg) {
            if (msg instanceof MouseEvent) {
                this[renderEvent](msg);
            } else if(msg instanceof ErrorEvent) {
                objcount = 0;
                let stack = msg.error.stack.replace(/\sat\s/g,'<br>&nbsp;&nbsp;at&nbsp;&nbsp;')           
                return '<h5 style="color:red">▶Error</h5><div class="c_e_obj" style="display:none">' + this[getObjStr]({filename:msg.filename,msg:msg.message,stack:stack}) + '<br>&nbsp;</div>'
            } else if(msg instanceof PromiseRejectionEvent) {
                objcount = 0;
                let stack = msg.reason.stack.replace(/\sat\s/g,'<br>&nbsp;&nbsp;at&nbsp;&nbsp;')          
                return '<h5 style="color:red">▶Error</h5><div class="c_e_obj" style="display:none">' + this[getObjStr]({msg:msg.reason.message,stack:stack}) + '<br>&nbsp;</div>'
            } else if(msg instanceof Error) {
                objcount = 0;
                let stack = msg.stack.replace(/\sat\s/g,'<br>&nbsp;&nbsp;at&nbsp;&nbsp;')           
                return '<h5 style="color:red">▶Error</h5><div class="c_e_obj" style="display:none">' + this[getObjStr]({filename:msg.filename,msg:msg.message,stack:stack}) + '<br>&nbsp;</div>'
            } else if (msg instanceof Event) {
                this[renderEvent](msg);
            } else if (Object.prototype.toString.call(msg) === '[object Object]') {
                objcount = 0;
                return `<h5>▶Object</h5><div class="c_p_obj" style="display:none">{<br> ${this[getObjStr](msg)} <br>}&nbsp;</div>`
            } else if (Object.prototype.toString.call(msg) === '[object Array]') {
                objcount = 0;
                return `<h5>▶Array</h5><div class="c_p_obj" style="display:none">[<br> ${this[getObjStr](msg)} <br>]&nbsp;</div>`
            }else {
                if(typeof msg === 'undefined'|| msg === null) {
                    return `<i style="color:#909090">${JSON.stringify(msg)}</i>`
                }
                msg = typeof msg === 'string' ? msg : JSON.stringify(msg);
                msg = msg&&msg.replace(/%c.+?%c/g, '');
                return msg
            }
        }
        [getObjStr](obj, flag) {
            let res = [];
            let space = this[getSpaceStr](flag ? objcount * 4 + 2: 2);
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

        [appendRenderStrToBody](ele,html, isObj) {
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
            this[appendRenderStrToBody](this.content,'<h5>▶Object</h5><div class="c_p_obj" style="display:none">' + res.join('<br>') + '</div>', true)
        }
    }
    if (!instance) {
        instance = new logToHtml()
    }
    return instance
})()

