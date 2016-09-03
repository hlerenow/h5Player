
var lrcScroll=(function(){
    "use strict";
    var Hlib=function(){
    };


    Hlib.addEvent = function(el, event, func) {
        if (el.attachEvent) {
            el.attachEvent("on" + event, func);
        } else {
            el.addEventListener(event, func);
        }
    };

    Hlib.addClass=function(el,newClass){
        if(el.classList){
            el.classList.add(newClass);
        }else if(!this.hasClass(el,newClass)){
            el.className=el.className+" "+newClass;
        }

    }

    Hlib.removeClass=function(el,oldClass){
        if(el.classList){
            el.classList.remove(oldClass)
        }else{
            console.log(el);
            el.className=el.className.replace(new RegExp('\\b'+oldClass+'\\b','g'),'');
            console.log(el.className);
        }
    }

    Hlib.toggleClass=function(el,className){

        if(this.hasClass(el,className)){
            this.removeClass(el,className);
        }else{
            this.addClass(el,className);
        }
    }

    Hlib.hasClass=function(el,newClass) {
        console.log(new RegExp('\\b'+newClass+'\\b').test(el.className));
        return el.classList?el.classList.contains(newClass):new RegExp('\\b'+newClass+'\\b').test(el.className);
    }

    Hlib.removeEvent = function(el, event, func) {
        if (el.detachEvent) {
            el.detachEvent("on" + event, func);
        } else {
            el.removeEventListener(event, func);
        }
    };

    Hlib.getCurrentStyle=function(el,attr){
        var elT=((typeof el)==='string')?document.querySelector(el):el;
        var style=window.getComputedStyle?window.getComputedStyle(elT,false):elT.currentStyle;
        return style[attr];

    }

    var con=document.getElementById("lrcConP");


    document.querySelector("p[timer='t100']");

    var returnHandle=function(args){
        if(!(this instanceof returnHandle)){
            console.log("new");
            return new returnHandle(args);
        }

        this._lrc=args.lrc||"";
        this.beforeTimer="t0";
        this._id=args.id||null;
        this._dom=document.getElementById(this._id)||null;
        this._domWidth=parseInt(Hlib.getCurrentStyle(this._dom,"height"));
        this._domContent=null;
        this._analyLrc={};
        this._timeToLrc={};
        this._changLrc=function(){}

        this.initLrc();
        return this;
    }

    var fn=returnHandle.prototype;
    fn.createHtml=function(){
        var i=0;
        var htmlTemp="<div id='"+this._id+"_content'>";
        var lrcOrder=this._analyLrc.getLrcOrder();
        var lrcLrcFiled=this._analyLrc.getLrcFiled();
        var LrcTagFiled=this._analyLrc.getTagFiled();
        var tap="";
        for(i=0;i<lrcOrder.length;i=i+1){
            if(i===0){
                tap="tOn";
            }else{
                tap="";
            }

            this._timeToLrc[parseInt(lrcOrder[i]/1000)]="t"+i;
            htmlTemp+='<p class="'+tap+'" timer="t'+i+'">'+lrcLrcFiled['t'+lrcOrder[i]]+'</p>';            
        }
        htmlTemp+="</div>";

        this._dom.innerHTML=htmlTemp;


        this._domContent=document.getElementById(this._id+"_content");

       // console.log(this._timeToLrc);
    }

    fn.beforChangeLrc=function(func){
        this._changLrc=func;
        return this;
    }
    fn.clear=function(){
        this._dom.innerHTML="";
        this._changLrc();
        return this;
    }

    fn.initLrc=function(){
        if(this._lrc===""||!this._lrc){
            this._lrc="[00:00.00] 暂无歌词";
        }

        this._analyLrc=analyseLrc(this._lrc).innitLrc();
       // console.log(this);
        this.createHtml();

        return this;
    }

    fn.timeToTimer=function(time){

        if(this._timeToLrc[time]){
            //alert(this._timeToLrc[time]+"ex");

            return this._timeToLrc[time];            
        }else{
            return null;
        }                
    }

    fn.getLrcLineYPosBySec=function(time){
        var timer=this.timeToTimer(time);
        var lineDom="";
       // alert(timer);
        if(timer!==null){
            //alert("66");
            lineDom=this._domContent.querySelector("p[timer='"+timer+"']");
            //alert(lineDom);
            return {
                top:lineDom.offsetTop,
                width:lineDom.offsetWidth,
                height:lineDom.offsetHeight
            }
        }
        else{
            return -1;
        }
    }


    fn.srcollToLrcByTime=function(time){
        //console.log(time);

        var pos=this.getLrcLineYPosBySec(time);
        var nowTimer=this.timeToTimer(time);
        var nowLine,beforeLine;


        if(pos!==-1&&this.beforeTimer!==nowTimer){
           //alert((pos.top+pos.height/2)-this._domWidth/2);

        
            this._dom.scrollTop=(pos.top+pos.height/2)-this._domWidth/2; 

            beforeLine=this._domContent.querySelector("p[timer='"+this.beforeTimer+"']");
            nowLine=this._domContent.querySelector("p[timer='"+nowTimer+"']");
            Hlib.removeClass(beforeLine,"tOn");
            Hlib.addClass(nowLine,"tOn");
            this.beforeTimer=nowTimer;
        }

        return this;
    }

    fn.changLrc=function(lrc){
        this._lrc=lrc||"";
        this.beforeTimer="t0";
        this._domContent=null;
        this._analyLrc={};
        this._timeToLrc={};        
        this.initLrc();
    }

    return  returnHandle;
})(analyseLrc);


