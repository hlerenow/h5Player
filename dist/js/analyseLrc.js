var analyseLrc=function(){
    "use strict";

    /**
     * 将lrc的时间转化为毫秒
     * @param strTime
     */
    var timerToSencond=function(strTime){

        var tp = strTime.match(/([0-9]+?):([0-9]+?)\.([0-9]+?)/);
        //console.log(strTime);
        //console.log(tp[1]);
        var timeSencond=parseInt(tp[1])*60*1000+parseInt(tp[2])*1000+parseInt(tp[3]);

        return timeSencond;
    };

	var returnHandle=function(){
		this._sourceCode='[ti:老街]'+
'[ar:李荣浩]'+
'[al:小黄EP]'+
'[by:王哲以勒]'+
'[00:00.89]李荣浩-老街'+
'[00:03.29]作词：李荣浩'+
'[00:06.49]作曲：李荣浩'+
'[00:09.55]LRC:以勒爱胡灵 QQ:286033739'+
'[00:13.94]'+
'[00:16.89]一张褪色的照片'+
'[00:19.87]好像带给我一点点怀念'+
'[00:23.86]巷尾老爷爷卖的热汤面'+
'[00:27.91]味道弥漫过旧旧的后院'+
'[00:31.90]流浪猫睡熟在摇晃秋千'+
'[00:35.80]夕阳照了一遍他咪着眼'+
'[00:40.14]那张同桌寄的明信片'+
'[00:43.78]安静的躺在课桌的里面'+
'[00:48.69]快要过完的春天'+
'[00:51.78]还有雕刻着图案的门帘'+
'[00:55.73]窄窄的长长的过道两边'+
'[00:59.67]老房子依然升起了炊烟'+
'[01:03.66]刚刚下完了小雨的季节'+
'[01:07.65]爸妈又一起走过的老街'+
'[01:11.95]记不得哪年的哪一天'+
'[01:15.64]很漫长又很短暂的岁月'+
'[01:19.94]现在已经回不去'+
'[01:23.93]早已流逝的光阴'+
'[01:27.73]手里的那一张渐渐模糊不清的车票'+
'[01:32.74]成了回忆的信号'+
'[01:37.49]忘不掉的是什么我也不知道'+
'[01:41.78]想不起当年模样'+
'[01:45.72]看也看不到 去也去不了的地方'+
'[01:53.55]也许那老街的腔调是属于我的忧伤'+
'[02:01.81]嘴角那点微笑越来越勉强'+
'[02:09.45]忘不掉的是什么我也不知道'+
'[02:13.80]放不下熟悉片段'+
'[02:17.59]回头望一眼 已经很多年的时间'+
'[02:25.22]透过手指间看着天'+
'[02:29.62]我又回到那老街'+
'[02:33.57]靠在你们身边渐行渐远'+
'[02:40.20]'+
'[03:10.97]快要过完的春天'+
'[03:13.80]还有雕刻着图案的门帘'+
'[03:17.84]窄窄的长长的过道两边'+
'[03:21.74]老房子依然升起了炊烟'+
'[03:25.79]刚刚下完了小雨的季节'+
'[03:29.82]爸妈又一起走过的老街'+
'[03:34.02]记不得哪年的哪一天'+
'[03:37.71]很漫长又很短暂的岁月'+
'[03:42.11]现在已经回不去'+
'[03:46.15]早已流逝的光阴'+
'[03:49.79]手里的那一张渐渐模糊不清的车票'+
'[03:54.80]成了回忆的信号'+
'[03:59.70]忘不掉的是什么我也不知道'+
'[04:03.90]想不起当年模样'+
'[04:07.85]看也看不到 去也去不了的地方'+
'[04:15.95]也许那老街的腔调是属于我的忧伤'+
'[04:24.34]嘴角那点微笑越来越勉强'+
'[04:31.97]忘不掉的是什么我也不知道'+
'[04:36.11]放不下熟悉片段'+
'[04:40.16]回头望一眼 已经很多年的时间'+
'[04:47.84]透过手指间看着天'+
'[04:52.15]我又回到那老街'+
'[04:56.14]靠在你们身边渐行渐远'+
'[05:02.91]'+
'[05:08.12]LRC:以勒爱胡灵 QQ:286033739'+
'[05:11.16]'+
'[05:17.22]--end--'+
'http://www.5ilrc.com 欢迎您的光临!';
        this._init=false;
		this._tagField={};
		this._lrcFiled={};
        this._lrcOrder=[];
	};

    returnHandle.prototype.getLrcFiled=function(){
        return this._lrcFiled;
    };

    returnHandle.prototype.getLrcOrder=function(){
        return this._lrcOrder;
    };

    returnHandle.prototype.getTafFiled=function(){
        return this._tagField;
    };

	returnHandle.prototype.innitLrc=function(){
		//console.log(this.sourceCode);
		// var moreTag=this.sourceCode.match(/\[(\S+):([^0-9]\S*)\]/gi);
        var i= 0,j=0;//用于for循环计数
        var temp="";

        //用于存储第一次正则匹配后特殊标签的的结果
		var moreTag=this.sourceCode.match(/\[(\S+?):([^0-9]\S*?)\]/ig);
        //用于储存一次正则匹配后歌词内容的结果
		var lrc_time_content=this._sourceCode.match(/\[[0-9\.:\[\]]+\][^\[\]]*/ig);

//      将歌词信息字段写入tagField
		for(i=0;i<moreTag.length;i=i+1){
			temp=moreTag[i].match(/\[(\S*):(\S*)\]/);
			this._tagField[temp[1]]=temp[2];
		}

//		console.log(this.tagField);
//        将歌词顺序写入lrcOrer;
//        将每句歌词写入lrcFiled
		for(i=0;i<lrc_time_content.length;i=i+1){
			temp=lrc_time_content[i].match(/(\[[0-9\.:\[\]]+\])(.*)/);
				//console.log(temp[1]+"5");

				var temp1=temp[1].split("[").join("]").split("]");
                for(j=1;j<temp1.length;j=j+1){
                    if(temp1[j]!==""){
                        var lrcOderTemp=timerToSencond(temp1[j]);
                        this._lrcOrder.push(lrcOderTemp);
                        this._lrcFiled["t"+lrcOderTemp]=temp[2];
                        //console.log(temp1);
                    }
                }
		}

//        console.log(this.lrcFiled);
//        将歌词排序
        this.lrcOrder=this.lrcOrder.sort(function sortNumber(a,b){
            return a - b;
        });
//        修改初始化值
         this._init=true;
//        console.log(this.lrcOrder);

	};

	return function(s){
        return new returnHandle(s);
    }

};

analyseLrc().innitLrc();