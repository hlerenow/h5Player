(function(){	
	// 'use strict';
	// //播放器句柄

	var Hlib=function(){};

    Hlib.addEvent = function(el, event, func) {
        if (el.attachEvent) {
            el.attachEvent("on" + event, func);
        } else {
            el.addEventListener(event, func);
        }
    };

    Hlib.removeEvent = function(el, event, func) {
        if (el.detachEvent) {
            el.detachEvent("on" + event, func);
        } else {
            el.removeEventListener(event, func);
        }
    };

    var timeFctory=function(sec){
        var m=parseInt(sec/60);
        var s=parseInt(sec%60);
        var result=0;
        if(m>9){
            result=''+m+":";
        }else{
            result="0"+m+":";
        }

        if(s>9){
            result=result+s;
        }else{
            result=result+"0"+s;
        }

        return result;
    };
    //播放器service
    var player = {
        dom: document.getElementById("h5playerMatic"),
        deviceType:1,/*0 pc 1 mobile*/
        volumeState: 0,
        /*音量调显示*/
        playState: 0,
        /*播放状态 开始 暂停*/
        lrcState:0,
        src:"",
        readyState:0,
        lrcFactory:"",
        timerHandle: function() {},
        setTimer: function() {

            clearInterval(this.timerHandle);
            
            var self=this;
            // 定时器
            var progessHandle = setInterval(function() {
                var rateB = self.dom.currentTime / self.dom.duration;
                //console.log("watch " + rateB);

                // 关闭之前的定时器
                if (rateB >= 1) {
                    clearInterval(progessHandle);
                    //界面Ui修改
                    self.dom.pause();
                    self.dom.currentTime=0;
                    document.getElementById("h5-play").querySelector("i").className="ion-ios-play-outline";
                }
                //同步歌曲当前时间
                console.log("循环");
                document.getElementById("timer").innerHTML=timeFctory(self.dom.currentTime);


                // 同步歌词位置
               // console.log(self.dom.currentTime);
                lrcS.srcollToLrcByTime(parseInt(self.dom.currentTime));
                
                JinDu.setPos(rateB);
                // 同步进度条位置
                JinDu.showPosPx(rateB);
            }, 500);

           
            this.timerHandle = progessHandle;
        },
        stopTimer: function() {
            clearInterval(this.timerHandle);    
        },
        lrcLodaer:function(lrc){
            var lrcData=analyseLrc(lrc).innitLrc();
            console.log(lrcData);
        }
    }

    //判断MP3是否可以播放

    //判断是否自动播放
	if(player.playState%2!=0){
		player.dom.play();
        // 开启进度条
        player.setTimer();
	}



	// 音量条事件


    //创建音量调条
    //音量默认值
    /*pc端绑定音量调节事件，移动端则不*/

    if(player.deviceType===0){
            document.getElementById("h5playerMatic").volume=0.3;
            player.dom.volume=0.3;
            

            h5Progess({
                pid:"val",
                width:"100%",
                dotSize:16,
                pSize:6,
                pos:player.dom.volume,
            }).afterChanged(function(x){
                //alert(x);
                player.dom.volume=x;
            }); 

            //音量调节UI
            volumeUI=document.getElementById("h5p-volume");
            volumeUI.style.display="block";
            Hlib.addEvent(volumeUI,"click",function(){
                var state=["hidden","visible"];
                player.volumeState=(player.volumeState+1)%2;

                document.getElementById("valCon").style.visibility=state[player.volumeState];
            });        
    }

//歌词滚动
    var lrcS=new lrcScroll({
        id:"lrcConP",
        lrc:strVar
    });
	// 音量调 end

	// 进度条



	var JinDu=h5Progess({
        	pid:"processbody-con",
        	width:"auto",
        	dotSize:20,
        	pSize:6,
        	pos:0,
            deviceType:1
        }).afterStop(function(x){
       
            player.dom.currentTime=player.dom.duration*x;
            lrcS.srcollToLrcByTime(parseInt(player.dom.currentTime));            
            player.setTimer();            

     	}).afterChanged(function(x){
            
     	}).afterPress(function(x){
            
            player.stopTimer();
        });

     // 播放控制按钮
     Hlib.addEvent(document.getElementById("h5-play"),"click",function(){
     	player.playState=(player.playState+1)%2;
     	if(player.playState===0){
                    
            player.dom.pause();
            this.querySelector("i").className="ion-ios-play-outline";
            // 停止进度条
            player.stopTimer();            
     	}else{
     		player.dom.play();
            this.querySelector("i").className="ion-ios-pause-outline";

            // 开启进度条
            player.lrcLodaer(strVar);
            player.setTimer();
     	}
     });


})();