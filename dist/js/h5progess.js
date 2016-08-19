var h5Progess = (function() {
    "use strict";

    var h5Progess = function(args) {
        return new h5Progess.prototype.init(args);
    };


    var fn = h5Progess.prototype;

    fn.mouseX = 0;
    fn.mouseY = 0;
    fn.idNum = 0;
    fn.deviceType=0;

    function chekOutValue(self){
        var timeHandle=setTimeout(function(){
            if(parseInt(self._pf.style.width)===self._nowProgessPosPx){
                return;                
            }else{
                self._nowProgessPosPx=parseInt(self._pf.style.width);
            }
        },100);
    };

    fn.browserType = function() {

        var sUserAgent = navigator.userAgent.toLowerCase(),
            bIsIpad = sUserAgent.match(/ipad/i) == 'ipad',
            bIsIphone = sUserAgent.match(/iphone os/i) == 'iphone os',
            bIsMidp = sUserAgent.match(/midp/i) == 'midp',
            bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4',
            bIsUc = sUserAgent.match(/ucweb/i) == 'web',
            bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce',
            bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile';

        if (bIsIpad || bIsIphone || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM) {
            return 1;
        } else {
            return 0;
        }
    };
    function initEventPc(self) {

        function dotMove(e) {
            console.log("move");            
            var posPx = parseInt(self._nowProgessPosPx) + (e.clientX - fn.mouseX);

            if (posPx > parseInt(self._pWidth)) {
                posPx = parseInt(self._pWidth);
            } else if (posPx < 0) {
                posPx = 0;
            }

            fn.showPos.call(self, posPx);
        }

        function dotPress(e) {
            console.log("press");
            if (e.which === 3){
                return;                
            }

            self.eventSate = 1;
            fn.mouseX = e.clientX;
            fn.addEvent(document, "mousemove", dotMove);
        }


        fn.addEvent(self._dot, "mousedown", dotPress);


        fn.addEvent(self._dom, "mouseup", function() {
            self._nowProgessPosPx = parseInt(fn.currenStyleFactort(self._pf, "width"));                
            chekOutValue(self);

            fn.removeEvent(document, "mousemove", dotMove);
        });

        fn.addEvent(document, "mouseup", function() {
            self._nowProgessPosPx = parseInt(fn.currenStyleFactort(self._pf, "width"));
           
            if (self.eventSate === 1) {
                self._afterEven(self._nowProgessPosPx / self._pWidth);
                self.eventSate = 0;
            }

            fn.removeEvent(document, "mousemove", dotMove);
        });

    }

    function initEventMb(self) {

        function dotTouchMove(e) {

            e = e.changedTouches[0];
            var posPx = parseInt(self._nowProgessPosPx) + (e.clientX - fn.mouseX);

            if (posPx > parseInt(self._pWidth)) {
                posPx = parseInt(self._pWidth);
            } else if (posPx < 0) {
                posPx = 0;
            }

            fn.showPos.call(self, posPx);
        }

        function dotTouchStart(e) {
            var touch;
            if (e.changedTouches.length === 1) {
                touch = e.changedTouches[0];
            } else {
                return;
            }

            console.log(touch);
            self.eventSate = 1;

            fn.mouseX = touch.clientX;
            fn.addEvent(document, "touchmove", dotTouchMove);
        }

        fn.addEvent(self._dot, "touchstart", dotTouchStart);


        fn.addEvent(self._dom, "touchend", function() {
            self._nowProgessPosPx = parseInt(fn.currenStyleFactort(self._pf, "width"));
            chekOutValue(self);
            if (self.eventSate === 1) {
                self._afterEven(self._nowProgessPosPx / self._pWidth);
                self.eventSate = 0;
            }            
            fn.removeEvent(document, "touchmove", dotTouchMove);
        });

        fn.addEvent(document, "touchend", function() {
            self._nowProgessPosPx = parseInt(fn.currenStyleFactort(self._pf, "width"));
            if (self.eventSate === 1) {
                self._afterEven(self._nowProgessPosPx / self._pWidth);
                self.eventSate = 0;
            }
            fn.removeEvent(document, "touchmove", dotTouchMove);
        });

        //endMobile        
    }


    fn.addEvent = function(el, event, func) {
        if (el.attachEvent) {
            el.attachEvent("on" + event, func);
        } else {
            el.addEventListener(event, func);
        }
    };

    fn.removeEvent = function(el, event, func) {
        if (el.detachEvent) {
            el.detachEvent("on" + event, func);
        } else {
            el.removeEventListener(event, func);
        }
    };

    fn.selectChild = function(pe, el) {

        var allEl = pe.childNodes;
        var i = 0;
        for (i = 0; i < allEl.length; i = i + 1) {
            if (allEl[i].nodeType === 1) {
                if (allEl[i].id === el) {
                    return allEl[i];
                }
            }
        }
        return null;
    };

    fn.currenStyleFactort = function(el, attr) {
        var elT = el;
        if ((typeof el) === "string") {
            elT = document.querySelector(el);
        }
        var style = window.getComputedStyle ? window.getComputedStyle(elT, false) : elT.currentStyle;
        return style[attr];
    };



    fn.setPos = function(x) {
        this._nowProgessPos = x;
        this._nowProgessPosPx = this._nowProgessPos * this._pWidth;
        this.showPos(this._nowProgessPosPx);
        return this;
    };

    fn.getPos = function() {
        return this._nowProgessPos;
    };


    fn.showPos = function(xs) {
        console.log("showPos:"+xs);
        this._pf.style.width = xs + "px";
    };

    fn.afterStop=function(func){
        this._afterEven=func;
        return this;
    };

    fn.init = function(args) {

        this._afterEven=function(){};
        this._domID = args.pid || "";
        this._dom = document.getElementById(this._domID);

        if (!this._dom) {
            console.log(this._dom);
            throw new Error("元素不存在");
        }

        this._dom.className = "processbody-con";

        //初始化html
        this.eventSate=0;
        this.idNum = fn.idNum;
        fn.idNum = this.idNum + 1;
        this.tempHtml = '    <div id="processbody-bg' + this.idNum + '" class="processbody-bg"></div>' +
            '    <div id="processbody-fw' + this.idNum + '" class="processbody-fw">' +
            '        <div id="processDot' + this.idNum + '" class="processDot"></div>' +
            '    </div>';

        this._dom.innerHTML = this.tempHtml;


        this._pSize = args.pSize || 3;
        this._pWidth = args.width || 100;
        this._dotSize = args.dotSize|| 10;
        this._pDotColor = "";
        this._pBgColor = "";
        this._pFwColor = "";

        this._nowProgessPos = parseInt(args.pos) || 0.5;


        this._pf = fn.selectChild(this._dom, "processbody-fw" + this.idNum);
        this._bg = fn.selectChild(this._dom, "processbody-bg" + this.idNum);
        this._dot = fn.selectChild(this._pf, "processDot" + this.idNum);

        var self = this;

        // 初始化样式

        this._dom.style.cursor = "pointer";
        this._dom.style.overflow = "hidden";
        this._dom.style.width = (typeof this._pWidth)==="string"?this._pWidth:(parseInt(this._pWidth) + "px");
        //计算现在的宽度;
        console.log(fn.currenStyleFactort(this._bg,"width")+"now width");
        this._pWidth=parseInt(fn.currenStyleFactort(this._dom,'width'))-this._dotSize;

        this._nowProgessPosPx = this._nowProgessPos * this._pWidth;

        console.log("now Width :"+this._pWidth);
        this._dom.style.padding = "0 " + Math.round(this._dotSize / 2) + "px";

        this._bg.style.height = this._pSize + "px";
        this._pf.style.height = this._pSize + "px";

        this._bg.style.margin = Math.round((this._dotSize - this._pSize) / 2) + 1 + "px 0";
        this._pf.style.top = Math.round((this._dotSize - this._pSize) / 2) + "px";

        this._dot.style.width = this._dotSize + "px";
        this._dot.style.height = this._dotSize + "px";
        this._dot.style.borderRadius = this._dotSize / 2 + "px";
        this._dot.style.top = -(this._dotSize - this._pSize) / 2 + "px";
        this._dot.style.right = -(this._dotSize) / 2 + "px";

        // ui初始化
        console.log("ui");
        fn.showPos.call(self, parseInt(this._nowProgessPosPx));

        //事件初始化

        var deviceType=fn.browserType();

        if(deviceType===0){
            // pc
            initEventPc(self);
        }else if(deviceType===1){
            //mobile
            console.log("mb");
            initEventMb(self);
        }
        return this;
    };

    fn.init.prototype = h5Progess.prototype;

    return h5Progess;
})();