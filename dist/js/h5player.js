(function() {
    // 'use strict';
    // //播放器句柄

    var Hlib = function() {};

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

    Hlib.liveEvent=function(chir,event,func,par){
        Hlib.addEvent(par||document,event,function(e){
            var found,el=e.target||e.srcElement;
            while(el&&!(found=el.nodeName===chir)){
                el=el.parentElement;
                if(found){
                    func.call(el,e)
                }
            }
        })

    }

    Hlib.getCurrentStyle=function(el,attr){
        var style=window.getComputedStyle?window.getComputedStyle(el,null):el.currentStyle;
            return style[attr];
    }

    var timeFctory = function(sec) {
        var m = parseInt(sec / 60);
        var s = parseInt(sec % 60);
        var result = 0;
        if (m > 9) {
            result = '' + m + ":";
        } else {
            result = "0" + m + ":";
        }

        if (s > 9) {
            result = result + s;
        } else {
            result = result + "0" + s;
        }

        return result;
    };
    //播放器service
    var player = {
        dom: document.getElementById("h5playerMatic"),
        deviceType: 1,
        /*0 pc 1 mobile*/
        volumeState: 0,
        /*音量调显示*/
        volume:0.1,
        playState: 0,
        /*播放状态 开始 暂停*/
        lrcState: 0,
        src: "",
        readyState: 0,
        lrcFactory:"",
        lrcData:"",
        progessBar:"",
        songList:[{
            title:"喜剧之王",
            source:[["http://www.h-five.com/MP3/xijuzhiwang.mp3",'audio/mpeg']],
            actor:"李荣浩",
            lrc:strVar
        },
        {
            title:'不搭',
            source:[['http://7xknbg.com1.z0.glb.clouddn.com/%E6%9D%8E%E8%8D%A3%E6%B5%A9%20-%20%E4%B8%8D%E6%90%AD.mp3','audio/mpeg']],
            actor:"李荣浩",
            lrc:''       
        }],
        nowSongId:0,
        timerHandle: function() {},
        setTimer: function() {

            clearInterval(this.timerHandle);

            var self = this;
            // 定时器
            var progessHandle = setInterval(function() {
                var rateB = self.dom.currentTime / self.dom.duration;
                //console.log("watch " + rateB);

                // 关闭之前的定时器
                if (rateB >= 1) {
                    clearInterval(progessHandle);
                    //界面Ui修改
                    self.dom.pause();
                    self.dom.currentTime = 0;
                    document.getElementById("h5-play").querySelector("i").className = "ion-ios-play-outline";
                }
                //同步歌曲当前时间
                document.getElementById("timer").innerHTML = timeFctory(self.dom.currentTime);

                // 同步歌词位置

                self.lrcFactory.srcollToLrcByTime(parseInt(self.dom.currentTime));

                self.progessBar.setPos(rateB);
                // 同步进度条位置
                self.progessBar.showPosPx(rateB);
            }, 500);

            this.timerHandle = progessHandle;
        },
        stopTimer: function() {
            clearInterval(this.timerHandle);
        },
        lrcLodaer: function(lrc) {
            this.lrcData = analyseLrc(lrc).innitLrc();
        },
        changeSongSrc:function(songNews){
            this.dom.pause();
            var type="";
            this.dom.innerHTML="";

            for(i=0;i<songNews.source.length;i=i+1){
                type=this.dom.canPlayType(songNews.source[i][1]);
                if(type=='maybe'||type==="probably"){
                    this.dom.src=songNews.source[i][0];
                    this.dom.type=songNews.source[i][1];
                }
            }
        },
        playOtherSong:function(songNews){
            //新的一曲
            this.dom.pause();
            this.changeSongSrc(songNews);

            //修改歌曲名

            
            document.getElementById("songTitle").innerHTML = songNews.title;
            //清空歌词
            this.lrcFactory.clear();
            //获取歌词
            this.getLrc(songNews.lrc);
            //歌词滚动
            this.lrcFactory.changLrc(this.lrcData);

            this.progessBar.setPos(0);
            document.getElementById("totalTime").innerHTML ="00:00";            
            document.getElementById("timer").innerHTML = timeFctory(this.dom.currentTime);

            //判断是否自动播放
            if (this.playState % 2 != 0) {
                this.dom.play();
                document.getElementById("h5-play").querySelector("i").className = "ion-ios-pause-outline";
                // 开启进度条
                this.setTimer();
            } else{
                player.dom.pause();
                document.getElementById("h5-play").querySelector("i").className = "ion-ios-play-outline";
                // 停止进度条
                player.stopTimer();
            }           
        },
        getLrc:function(lrcDate){
            this.lrcData=lrcDate;
        },
        createListHtml:function(){
            var html="<ul>";
            var i=0;
            var sl=this.songList;
            for(i=0;i<sl.length;i=i+1){
                html+="<li sId='"+i+"'>"+sl[i].title+"</li>";
            }

            html+="<ul>";
            document.getElementById("vList").innerHTML=html;
            return this;
        },
        init: function() {
            var self=this;


            this.createListHtml();
            /*pc端绑定音量调节事件，移动端则不*/

            if (parseInt(Hlib.getCurrentStyle(document.body,'width'))>=900 ) {

                //音量默认值                
                this.dom.volume = this.volume;

                // 音量条事件
                //创建音量调条
                h5Progess({
                    pid:"val",
                    width:"100%",
                    dotSize:16,
                    pSize:6,
                    pos:self.dom.volume,
                }).afterChanged(function(x){
                    //alert(x);
                    self.dom.volume=x;
                }); 

                //音量调节UI
                volumeUI = document.getElementById("h5p-volume");
                volumeUI.style.display = "block";
                Hlib.addEvent(volumeUI, "click", function() {
                    var state = ["hidden", "visible"];
                    player.volumeState = (player.volumeState + 1) % 2;

                    document.getElementById("valCon").style.visibility = state[player.volumeState];
                });
            }

            // 音量调 end

            // 进度条

            this.progessBar= h5Progess({
                pid: "processbody-con",
                width: "auto",
                dotSize: 20,
                pSize: 6,
                pos: 0,
                deviceType: 1
            }).afterStop(function(x) {
                player.dom.currentTime = player.dom.duration * x;
                self.lrcFactory.srcollToLrcByTime(parseInt(self.dom.currentTime));
                player.setTimer();

            }).afterChanged(function(x) {

            }).afterPress(function(x) {
                player.stopTimer();
            });


            this.lrcFactory = new lrcScroll({
                id: "lrcConP",
                lrc: ""
            });       


            Hlib.addEvent(this.dom,'canplay',function(){
                document.getElementById("totalTime").innerHTML = timeFctory(self.dom.duration);
                console.log('gg'+timeFctory(self.dom.duration));
            });

            // 播放控制按钮
            Hlib.addEvent(document.getElementById("h5-play"), "click", function() {
                player.playState = (player.playState + 1) % 2;
                if (player.playState === 0) {

                    player.dom.pause();
                    this.querySelector("i").className = "ion-ios-play-outline";
                    // 停止进度条
                    player.stopTimer();
                } else {
                    player.dom.play();
                    this.querySelector("i").className = "ion-ios-pause-outline";
                    // 开启进度条
                    player.lrcLodaer(strVar);
                    player.setTimer();
                }
            });

            //下一曲事件
            Hlib.addEvent(document.getElementById("h5-next"),'click',function(){
                var len=self.songList.length;
                if(self.nowSongId+1>=len){
                    self.nowSongId=0;
                }else{
                    self.nowSongId=self.nowSongId+1;
                }
                self.playOtherSong(self.songList[self.nowSongId]);                
            });

            //上一曲事件
            Hlib.addEvent(document.getElementById("h5-forward"),'click',function(){
                if(self.nowSongId-1<0){
                    self.nowSongId=self.songList.length-1;
                }else{
                    self.nowSongId=self.nowSongId-1;
                }
                self.playOtherSong(self.songList[self.nowSongId]);                
            });   

            //列表展示
            Hlib.addEvent(document.getElementById("songList"),'click',function(){
                document.getElementById("maskLayer").style.display="block";
                document.getElementById("bundleDioalg").style.bottom="0px";
            });    

            //列表关闭
            Hlib.addEvent(document.getElementById("closeList"),'click',function(){
                document.getElementById("maskLayer").style.display="none";
                document.getElementById("bundleDioalg").style.bottom="-100%";
            });                  

            this.playOtherSong(self.songList[0]);
        }
    }

    player.init();

})();