/**
 * Created by Mark on 2016/8/14.
 */


function addEvent(el,event,func){
    if(el.attachEvent){
        el.attachEvent("on"+event,func);
    }else{
        el.addEventListener(event,func);
    }
};

var mousePos=(function() {
    var mousePosHandle= function () {
        console.log("run");
    };
    var fn=mousePosHandle.prototype;
    fn.getMouseScreenPos=function(e){
        console.log(e);
        console.log("clientX: "+e.clientX);
        console.log("clientY: "+e.clientY);
    }

    fn.getPagePos=function(e){
         e = e||window.event;
         var pageX= e.pageX;
         var pageY= e.pageY;

         //IE
         if(pageX==undefined){
             pageX= e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
             pageY= e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
         }
         console.log(pageX+":"+pageY);
         return {x:pageX,y:pageY};        
    }

    return new mousePosHandle();
})();


addEvent(document.getElementById("con"),"click",function(e){
    console.log(this);
    mousePos.getMouseScreenPos(e);
});

