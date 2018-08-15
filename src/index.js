export default (()=>{
let logProto             = console.log;
let objcount             = 0;
let instance             = null;
let initId               = Symbol();
let initHtml             = Symbol();
let initCss              = Symbol();
let init                 = Symbol();
let initEvent            = Symbol();
let initLog              = Symbol()
let shouldRender         = Symbol();
let renderEvent          = Symbol();
let renderHtml           = Symbol();
let renderSpace          = Symbol();
let renderObj            = Symbol();
let render               = Symbol();
let updateBuffer         = Symbol()
let shouldrenderflag     = Symbol();
let hasRenderConsoleFlag = Symbol();
let logarr               = Symbol();
class logToHtml {
    constructor() {
        this[logarr] = [];
        this[shouldrenderflag] = false;  
        this[hasRenderConsoleFlag] = false;
        this[initLog]();
    }

    [initId]() {
        const s4=()=> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return `id${s4() + s4()}-${s4()}`;
    }

    [initHtml]() {
        let div = document.createElement('div');
        div.setAttribute('id',this.wrapId);
        div.innerHTML = `
            <div id="${this.toolbarId}">
                <div data-type="1" style="background:#fff" id="${this.logId}">Log</div>
                <div data-type="2" id="${this.netId}">Net</div>
            </div>
            <div id="${this.logId}id"></div>
            <div id="${this.netId}id"></div>
            <div id="${this.clearId}">clear</div>                     
        `
        document.body.appendChild(div);

        let div1 = document.createElement('div');
        div1.setAttribute('id',this.buttonId);
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
        #${this.logId}id {
            overflow:auto;
        }
        div#${this.logId}id>div{
            background: #fff;
            border-top: 1px solid #ccc;
            padding: 5px 3px;
            word-break: break-all;
        }
        div#${this.buttonId}{
            border-radius: 5px;
            position: fixed;
            left: 14px;
            top:50%;
            background: #1abd10;
            padding: 5px 10px;
            color: #fff;
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
        this.content = document.getElementById(this.logId+'id');
        this.wrap = document.getElementById(this.wrapId);
        this.button = document.getElementById(this.buttonId);
    }

    [updateBuffer](args) {
        this[logarr].unshift(args)
        this[logarr].length = 50;
    }

    [initEvent]() {
        // 内容区域
        let content = document.getElementById(this.logId+'id')
        content.addEventListener('click',(e)=>{
            if(e.target.hasAttribute('data-obj')) {
                let target = e.target.querySelector('div');
                if(!target) return
                let display = target.style.display;
                e.target.firstChild.nodeValue = display=='none'?'▼Object':'▶Object';
                target.style.display = display=='none'?'block':'none';
            }
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
        }, false)

        // Toolbar
        let tool = document.getElementById(this.toolbarId);
        tool.addEventListener('click', (e) => {
            if(!e.target.hasAttribute('data-type')) return
            let targetId = e.target.getAttribute('id');
            let parent = e.target.parentNode;
            let childs = parent.childNodes;
            e.target.style.background = '#fff';
            for(let item of childs) {
                if(!(item.nodeType == 1)) continue
                if(item.getAttribute('id') == targetId) {
                    document.getElementById(targetId+'id').style.display = 'block';
                    continue;
                }
                document.getElementById(item.getAttribute('id')).style.background = '';
                document.getElementById(item.getAttribute('id')+'id').style.display = 'none';
            }
        }, false)
    }
    [initLog]() {
        let that = this;
        console.log = function() {
            that[updateBuffer](arguments)
            let args = [].slice.call(arguments);
            if(that[shouldRender]()) {
                for(let item of arguments) {
                    if(/color:/.test(item)) continue
                    that[render](item)
                }
            }
            logProto.apply(null,args)
        }
    }
    [shouldRender]() {
        return this[shouldrenderflag]
    }
    hackInstall() {
        if(this[hasRenderConsoleFlag]) return
        this[hasRenderConsoleFlag] = true
        this[shouldrenderflag] = true;
        this[init]();
        this[logarr].reverse().map((item,i)=>{
            for(let one of item) {
                if(/color:/.test(one)) continue
                this[render](one)
            }
        })
    }
    [render](msg) {
        if(msg instanceof Event) {
            this[renderEvent](msg);
        } else if(Object.prototype.toString.call(msg) === '[object Object]') {
            this[renderHtml]('▶Object<div style="display:none">'+this[renderObj](msg)+'</div>',true);
            objcount = 0;
        } else {
            msg = typeof msg === 'string'?msg:JSON.stringify(msg)
            msg = msg.replace(/%c.+?%c/g,'')
            this[renderHtml](msg)
        }
    }

    [renderObj](obj,flag) {
        let res = [];
        objcount++;
        let space = this[renderSpace](flag?objcount*2:1);
        for(let item in obj) {
            let str = `${space}${item}:`;
            if(Object.prototype.toString.call(obj[item]) === '[object Object]') {
                str+=`{<br>`;
                str+=`${this[renderObj](obj[item],true)}`;
                str+=`<br>${space}},`;
                res.push(str);
                continue
            }
            str = `${str}${obj[item]},`;
            res.push(str)
        }
        objcount = 0;
        return res.join('<br>')
    }

    [renderSpace](i) {
        let str = [];
        while(i--) {
            str.push('&nbsp;')
        }
        return str.join('')
    }

    [renderHtml](html,isObj) {
        let div = document.createElement('div');
        if(isObj) {
            div.setAttribute('data-obj','1')
        }
        div.innerHTML = html
        this.content.appendChild(div) 
    }

    [renderEvent](e) {
        let res = ['{'];
        for(let item in e) {
            let str = `&nbsp;&nbsp;${item}:${e[item]},`
            res.push(str)
        }
        res.push('}')
        this.renderHtml('▶Object<div style="display:none">'+res.join('<br>')+'</div>',true)
    }
}
if(instance) {
    return instance
} else {
    return instance = new logToHtml()
}
})()

