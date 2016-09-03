var h5Progess = (function() {
    "use strict";

    var h5Progess = function(args) {
        return new h5Progess.prototype.init(args);
    };


    var fn = h5Progess.prototype;

    fn.mouseX = 0;
    fn.mouseY = 0;
    fn.idNum = 0;
    fn.deviceType=0;//0 pc , 1 mb;

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
            e.preventDefault();
            e.stopPropagation();                   
            var posPx = parseInt(self._nowProgessPosPx) + (e.clientX - fn.mouseX);

            if (posPx > parseInt(self._pWidth)) {
                posPx = parseInt(self._pWidth);
            } else if (posPx < 0) {
                posPx = 0;
            }

            self._afterChangedEven(posPx/self._pWidth);            
            fn.showPos.call(self, posPx);
        }

        function dotPress(e) {
            e.preventDefault();
            e.stopPropagation();
            var posPx = parseInt(self._nowProgessPosPx) + (e.clientX - fn.mouseX);   
                     
            if(parseInt(self._pf.style.width)!==self._nowProgessPosPx){
                self._nowProgessPosPx=parseInt(self._pf.style.width);
            } 

            if (e.which === 3){
                return;                
            }
            self._afterPressEven(posPx/self._pWidth);
            self.eventSate = 1;
            fn.mouseX = e.clientX;
            fn.addEvent(document, "mousemove", dotMove);
        }


        fn.addEvent(self._dot, "mousedown", dotPress);


        fn.addEvent(self._dom, "mouseup", function() {
            self._nowProgessPosPx = parseInt(fn.currenStyleFactort(self._pf, "width"));                
            chekOutValue(self);

            self._afterStopEven(self._nowProgessPosPx / self._pWidth);            
            fn.removeEvent(document, "mousemove", dotMove);
        });

        fn.addEvent(document, "mouseup", function() {
            self._nowProgessPosPx = parseInt(fn.currenStyleFactort(self._pf, "width"));
           
            if (self.eventSate === 1) {
                self._afterStopEven(self._nowProgessPosPx / self._pWidth);
                self.eventSate = 0;
            }

            fn.removeEvent(document, "mousemove", dotMove);
        });

    }

    function initEventMb(self) {

        function dotTouchMove(e) {
            e.preventDefault();
            e.stopPropagation();

            e = e.changedTouches[0];
            var posPx = parseInt(self._nowProgessPosPx) + (e.clientX - fn.mouseX);

            if (posPx > parseInt(self._pWidth)) {
                posPx = parseInt(self._pWidth);
            } else if (posPx < 0) {
                posPx = 0;
            }
            self._afterChangedEven(posPx/self._pWidth);
            fn.showPos.call(self, posPx);
        }

        function dotTouchStart(e) {
            var touch;
            var posPx = parseInt(self._nowProgessPosPx) + (e.clientX - fn.mouseX);            

            e.preventDefault();
            e.stopPropagation();
            if(parseInt(self._pf.style.width)!==self._nowProgessPosPx){
                self._nowProgessPosPx=parseInt(self._pf.style.width);
            } 

            if (e.changedTouches.length === 1) {
                touch = e.changedTouches[0];
            } else {
                return;
            }

            self._afterPressEven(posPx/self._pWidth);
            
            self.eventSate = 1;

            fn.mouseX = touch.clientX;
            fn.addEvent(document, "touchmove", dotTouchMove);
        }

        fn.addEvent(self._dot, "touchstart", dotTouchStart);


        fn.addEvent(self._dot, "touchend", function() {
            self._nowProgessPosPx = parseInt(fn.currenStyleFactort(self._pf, "width"));
            chekOutValue(self);
            if (self.eventSate === 1) {
                self._afterStopEven(self._nowProgessPosPx / self._pWidth);
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
       
        this._pf.style.width = xs + "px";
    };

    fn.showPosPx=function(x){
        this._pf.style.width = x*this._pWidth+ "px";
    }

    fn.afterPress=function(func){
        this._afterPressEven=func;
        return this;
    };

    fn.afterStop=function(func){
        this._afterStopEven=func;
        return this;
    };

    fn.afterChanged=function(func){
        this._afterChangedEven=func;
        return this;
    };    

    fn.init = function(args) {

        this._afterPressEven=function(x){};
        this._afterStopEven=function(x){};
        this._afterChangedEven=function(x){};
        this._domID = args.pid || "";

     
        this.deviceType=args.deviceType||0;
   

        this._dom = document.getElementById(this._domID);

        if (!this._dom) {
       
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
        this._pDotColor = args.dotColor||"white";
        this._pBgColor =  args.bgColor||"rgb(226, 226, 228)";
        this._pFwColor = args.fwColor||"#f44336";

        this._nowProgessPos = parseFloat(args.pos) || 0;


        this._pf = fn.selectChild(this._dom, "processbody-fw" + this.idNum);
        this._bg = fn.selectChild(this._dom, "processbody-bg" + this.idNum);
        this._dot = fn.selectChild(this._pf, "processDot" + this.idNum);

        var self = this;

        // 初始化样式

        this._bg.style.background=this._pBgColor;
        this._pf.style.background=this._pFwColor;
        this._dot.style.background=this._pDotColor;

        this._dom.style.cursor = "pointer";
        this._dom.style.overflow = "hidden";
        this._dom.style.width = (typeof this._pWidth)==="string"?this._pWidth:(parseInt(this._pWidth) + "px");
        //计算现在的宽度;

     
        this._pWidth=parseInt(fn.currenStyleFactort(this._dom,'width'))-this._dotSize-4;

        
        this._nowProgessPosPx = this._nowProgessPos * this._pWidth;


        this._dom.style.padding = "0 " + Math.round((this._dotSize+4)/ 2) + "px";

        this._bg.style.height = this._pSize + "px";
        this._pf.style.height = this._pSize + "px";

        this._bg.style.margin = Math.round((this._dotSize - this._pSize) / 2) + 2 + "px 0";
        this._pf.style.top = Math.round((this._dotSize - this._pSize) / 2)+2 + "px";

        this._dot.style.width = this._dotSize + "px";
        this._dot.style.height = this._dotSize + "px";
        this._dot.style.borderRadius = this._dotSize / 2 + "px";
        this._dot.style.top = -(this._dotSize - this._pSize) / 2 + "px";
        this._dot.style.right = -parseInt(this._dotSize/ 2) + "px";
        // ui初始化
     

       
        fn.showPos.call(self, parseInt(this._nowProgessPosPx));

        //事件初始化


        if(this.deviceType===0){
            // pc
            initEventPc(self);
        }else if(this.deviceType===1){
            //mobile

            initEventMb(self);
        }

        return this;
    };

    fn.init.prototype = h5Progess.prototype;

    return h5Progess;
})();