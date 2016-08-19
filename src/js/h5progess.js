
var h5Progess=(function(){


    var h5Progess=function(args){
            return new h5Progess.prototype.init(args); 
    };


    var fn=h5Progess.prototype;

        fn.mouseX=0;
        fn.mouseY=0;

        fn.idNum=0;
        
        fn.addEvent=function(el,event,func){
             if(el.attachEvent){
                 el.attachEvent("on"+event,func);
             }else{
                 el.addEventListener(event,func);
             }
         };

         fn.removeEvent=function(el,event,func){
             if(el.detachEvent){
                 el.detachEvent("on"+event,func);
             }else{
                 el.removeEventListener(event,func);
             }
         };

         fn.selectChild=function(pe,el){

            var allEl=pe.childNodes;
            var i=0;
            for(i=0;i<allEl.length;i=i+1){
                if(allEl[i].nodeType===1){
                    if(allEl[i].id===el){
                        return allEl[i];
                    }
                }
            }
            return null;
         };

         fn.currenStyleFactort=function(el,attr){
            var elT=el
            if((typeof el)==="string"){
                elT=document.querySelector(el);
            }
            var style=window.getComputedStyle?window.getComputedStyle(elT,false):elT.currentStyle;
            return style[attr];
         };

         fn.init=function(args){

            this._domID=args["pid"]||"";
            this._dom=document.getElementById(this._domID);

            if(!this._dom){
                console.log(this._dom);            
                throw new Error("元素不存在");                
            }                

            console.log(this._dom);
            this._dom.className="processbody-con";
            //初始化html

            this.idNum=fn.idNum;
            fn.idNum=this.idNum+1;
            this.tempHtml='    <div id="processbody-bg'+this.idNum+'" class="processbody-bg"></div>'+
                         '    <div id="processbody-fw'+this.idNum+'" class="processbody-fw">'+
                         '        <div id="processDot'+this.idNum+'" class="processDot"></div>'+
                         '    </div>';

            this._dom.innerHTML=this.tempHtml;
            this._pSize=args["pSize"]||3;
            this._pWidth=args["width"]||100;
            this._dotSize=args["dotSize"]||10;
            this._pDotColor="";
            this._pBgColor="";
            this._pFwColor="";
 
            this._nowProgessPos=parseInt(args["pos"])||0.5;
            this._nowProgessPosPx=this._nowProgessPos*this._pWidth;

            this._pf=fn.selectChild(this._dom,"processbody-fw"+this.idNum);
            this._bg=fn.selectChild(this._dom,"processbody-bg"+this.idNum);
            this._dot=fn.selectChild(this._pf,"processDot"+this.idNum);   

            var self=this;      

            //初始化html



            // 初始化样式

            this._dom.style.cursor="pointer";
            this._dom.style.overflow="hidden";
            this._dom.style.width=this._pWidth+"px";
            this._dom.style.padding="0 "+Math.round(this._dotSize/2)+"px";

            this._bg.style.height=this._pSize+"px";
            this._pf.style.height=this._pSize+"px";

            this._bg.style.margin=Math.round((this._dotSize-this._pSize)/2)+1+"px 0";
            this._pf.style.top=Math.round((this._dotSize-this._pSize)/2)+"px";

            this._dot.style.width=this._dotSize+"px";
            this._dot.style.height=this._dotSize+"px";
            this._dot.style.borderRadius=this._dotSize/2+"px";
            this._dot.style.top=-(this._dotSize-this._pSize)/2+"px";
            this._dot.style.right=-(this._dotSize)/2+"px";

            // ui初始化
            fn.showPos.call(self,parseInt(this._nowProgessPosPx));

            //事件初始化
            // pc

            fn.addEvent(self._dot,"mousedown",dotPress);


            fn.addEvent(self._dom,"mouseup",function(e){
                self._nowProgessPosPx=parseInt(fn.currenStyleFactort(self._pf,"width"));
                fn.removeEvent(document,"mousemove",dotMove);
            });            

            fn.addEvent(document,"mouseup",function(e){
                self._nowProgessPosPx=parseInt(fn.currenStyleFactort(self._pf,"width"));
                fn.removeEvent(document,"mousemove",dotMove);
            });            

            function dotPress(e){
                if(e.which===3)
                    return ;
                fn.mouseX=e.clientX;
                fn.addEvent(document,"mousemove",dotMove);
            }

            function dotMove(e){

                var posPx=parseInt(self._nowProgessPosPx)+(e.clientX-fn.mouseX);

 
                if(posPx>parseInt(self._pWidth)){
                    posPx=parseInt(self._pWidth);
                }else if(posPx<0){
                    posPx=0;
                }

                fn.showPos.call(self,posPx);
            }


            //mobile

            fn.addEvent(self._dot,"touchstart",dotTouchStart);

            function dotTouchStart(e){
                var touch;
                console.log(e);
                if(e.changedTouches.length===1){
                    touch=e.changedTouches[0];
                }else{
                    return;
                }

                fn.mouseX=touch.clientX;
                fn.addEvent(document,"touchmove",dotTouchMove);

               // console.log(touch);

            }

            fn.addEvent(self._dom,"touchend",function(e){
                self._nowProgessPosPx=parseInt(fn.currenStyleFactort(self._pf,"width"));
                fn.removeEvent(document,"touchmove",dotTouchMove);
            });            

            fn.addEvent(document,"touchend",function(e){
                self._nowProgessPosPx=parseInt(fn.currenStyleFactort(self._pf,"width"));
                fn.removeEvent(document,"touchmove",dotTouchMove);
            });            

            function dotTouchMove(e){

                e=e.changedTouches[0];
                var posPx=parseInt(self._nowProgessPosPx)+(e.clientX-fn.mouseX);

 
                if(posPx>parseInt(self._pWidth)){
                    posPx=parseInt(self._pWidth);
                }else if(posPx<0){
                    posPx=0;
                }

                fn.showPos.call(self,posPx);
            }            

            //endMobile
            return this;
         };

        fn.init.prototype=h5Progess.prototype;


        fn.setPos=function(x){
                this._nowProgessPos=x;
                this._nowProgessPosPx=this._nowProgessPos*this._pWidth;
                this.showPos(this._nowProgessPosPx);
                return this;
         };

        fn.getPos=function(){
             return this._nowProgessPos;
         };


         fn.showPos=function(xs){
            //console.log("wode "+xs);          
            this._pf.style.width=xs+"px";
         };

         return  h5Progess;
})();




// var h5Progess=(function(){
// 	"use strict";


//      /**
//       * 获取坐标相对指定容器的位置
//       * @param e
//       * @param pDom
//       * @returns {{x: number, y: number}}
//       */
//      function getMouseRelativePos(e){
//         //console.log(e);
//         alert(e.offsetX+":"+e.offsetY);
//      };

//     function getRelativePos(el,par,e){

//     }


//     /**
//      * 添加dom事件
//      * @param el
//      * @param event
//      * @param func
//      */
//      function addEvent(el,event,func){
//          if(el.attachEvent){
//              el.attachEvent("on"+event,func);
//          }else{
//              el.addEventListener(event,func);
//          }
//      };
//     /**
//      * 移除事件
//      * @param el
//      * @param event
//      * @param func
//      */
//      function removeEvent(el,event,func){
//          if(el.detach){
//              el.detachEvent("on"+event,func);
//          }else{
//              el.removeEventListener(event,func);
//          }
//      }

// 	var h5Progess=function(args){
//         if(!(this instanceof h5Progess)){
//             return new h5Progess();
//         }


//      };

//     var fn=h5Progess.prototype;

//         fn.init=function(args){

//          function newInstance(args){
//             console.log(this instanceof newInstance);
//             this._domID=args["pid"]||"";
//             this._pSize="";
//             this._pWidth="";
//             this._dotSize="";
//             this._pDotColor="";
//             this._pBgColor="";
//             this._pFwColor="";
//             this._nowProgessPos=args["pos"]||0;
//             this._dom=document.getElementById(this._domID);

//              addEvent(this._dom,"click",function(e){
//                  getMouseRelativePos(e);
//              });


//              var el = document.querySelector("#"+this._domID);

//              console.log("2:"+el.offsetLeft, el.offsetTop);
//         }

//         newInstance.prototype=fn;
//         delete newInstance.prototype.init;
//         return new newInstance(args);
//     };

//     fn.setPos=function(x){
//             this._nowProgessPos=x;
//             return this;
//      };

//     fn.getPos=function(){
//          return this._nowProgessPos;
//      };

//     return h5Progess(args);

// })();

// h5Progess({"pid":"processbody-con"});