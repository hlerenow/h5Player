
var strVar = "";
    strVar += "[ti:喜剧之王] ";
    strVar += "[ar:李荣浩] ";
    strVar += "[00:00.41] 喜剧之王 - 李荣浩";
    strVar += "[00:03.29] 词：黄伟文";
    strVar += "[00:04.76] 曲：李荣浩";
    strVar += "[00:16.18] 我看着颗猕猴桃";
    strVar += "[00:24.13] 眼泪突然被引爆";
    strVar += "[00:30.64] 我可不是 可不是 特别爱闹";
    strVar += "[00:34.84] 这叫做 这叫做 心灵感召";
    strVar += "[00:38.87] 不信你问李清照";
    strVar += "[00:46.13] 我天生不爱炫耀";
    strVar += "[00:53.14] 却太多艺术细胞";
    strVar += "[00:59.98] 我谈的情 拍的拖 也许很少";
    strVar += "[01:03.88] 中的枪 捱的刀 受的煎熬";
    strVar += "[01:07.96] 华丽得无法低调";
    strVar += "[01:17.39] 为什么 全世界的恋 我都失一遍";
    strVar += "[01:21.81] 为所有的悲剧 当特约演员";
    strVar += "[01:25.49] 我伤得断肠 我哭得夸张";
    strVar += "[01:29.06] 像一套港产片";
    strVar += "[01:32.08] 为何 普天下的泪 我先流一遍";
    strVar += "[01:36.24] 市面上的纸巾 都由我代言";
    strVar += "[01:39.97] 站在我旁边 你不算可怜";
    strVar += "[01:43.66] 这也是种贡献";
    strVar += "[01:53.26] 被分手的那一秒";
    strVar += "[02:00.63] 我疯狂往海边跑";
    strVar += "[02:06.98] 你有什么资格说 我很无聊";
    strVar += "[02:11.10] 你那次淋着雨 失控咆哮";
    strVar += "[02:15.23] 廉价小说那一套";
    strVar += "[02:24.44] 为什么 全世界的恋 我都失一遍";
    strVar += "[02:29.09] 为所有的悲剧 当特约演员";
    strVar += "[02:32.72] 我伤得断肠 我哭得夸张";
    strVar += "[02:36.37] 像一套港产片";
    strVar += "[02:39.35] 为何 普天下的泪 我先流一遍";
    strVar += "[02:43.56] 市面上的纸巾 都由我代言";
    strVar += "[02:47.30] 站在我旁边 你不算可怜";
    strVar += "[02:51.02] 这也是种贡献";
    strVar += "[02:53.97] 啦啦啦啦 啦啦啦 啦啦啦啦......";
    strVar += "[03:15.26] 每一天 都活在 电影里面";
    strVar += "[03:19.04] 每一天 都活在 小说里面";
    strVar += "[03:22.60] 每一天 都活在 K歌里面";
    strVar += "[03:26.23] 每一天 都活在 MV里面";
    strVar += "[03:29.86] 这世界本来就是场 真人秀表演";
    strVar += "[03:36.37] 实在难避免";
    strVar += "[03:39.29] 幕揭开 全世界的恋 我都失一遍";
    strVar += "[03:43.45] 为所有的悲剧 当特约演员";
    strVar += "[03:47.31] 我伤得断肠 我哭得夸张";
    strVar += "[03:51.00] 只为了红几年";


var analyseLrc=function(lrc){
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

	var returnHandle=function(lrc){
		this._sourceCode=lrc;
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

    returnHandle.prototype.getTagFiled=function(){
        return this._tagField;
    };

    returnHandle.prototype.innitLrc = function() {
        //console.log(this.sourceCode);
        // var moreTag=this.sourceCode.match(/\[(\S+):([^0-9]\S*)\]/gi);
        var i = 0,
            j = 0; //用于for循环计数
        var temp = "";

        //用于存储第一次正则匹配后特殊标签的的结果
        var moreTag = this._sourceCode.match(/\[(\S+?):([^0-9]\S*?)\]/ig);
        //用于储存一次正则匹配后歌词内容的结果
        var lrc_time_content = this._sourceCode.match(/\[[0-9\.:\[\]]+\][^\[\]]*/ig);

        //      将歌词信息字段写入tagField
        for (i = 0; i < moreTag.length; i = i + 1) {
            temp = moreTag[i].match(/\[(\S*):(\S*)\]/);
            this._tagField[temp[1]] = temp[2];
        }

        //      console.log(this.tagField);
        //        将歌词顺序写入lrcOrer;
        //        将每句歌词写入lrcFiled
        for (i = 0; i < lrc_time_content.length; i = i + 1) {
            temp = lrc_time_content[i].match(/(\[[0-9\.:\[\]]+\])(.*)/);
            //console.log(temp[1]+"5");

            var temp1 = temp[1].split("[").join("]").split("]");
            for (j = 1; j < temp1.length; j = j + 1) {
                if (temp1[j] !== "") {
                    var lrcOderTemp = timerToSencond(temp1[j]);
                    this._lrcOrder.push(lrcOderTemp);
                    this._lrcFiled["t" + lrcOderTemp] = temp[2];
                    //console.log(temp1);
                }
            }
        }

        //        console.log(this.lrcFiled);
        //        将歌词排序
        this._lrcOrder = this._lrcOrder.sort(function sortNumber(a, b) {
            return a - b;
        });
        //        修改初始化值
        this._init = true;
        //        console.log(this.lrcOrder);

        return this;

    };

	return new returnHandle(lrc);
};

