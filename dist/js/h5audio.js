h5audio=function(config){
	"use strict";
	var i=0;

	//去掉new字符
	if(!(this instanceof h5audio)){
		return new h5audio(config);
	}

	//对象私有变量
	this._audioObj=new Audio();
	this._sourceState=0;//1 可以播放 ，2 可以播放并且无卡顿
	this._playState=0;//1 播放 ，2 暂停，3停止

	//配置播放器属性
	for(i in config){
		if(config.hasOwnProperty(i))
			this._audioObj.setAttribute(i,config[i]);
			console.log(config[i]);
	}
	console.log(this._audioObj);
	self=this;

	this.addEvent(this._audioObj,'canplay',function(){
		alert("canpaly");
		self._sourceState=1;
	});

	this.addEvent(this._audioObj,'canplaythrough',function(){
		alert("oncanplaythrough");
		self._sourceState=2;
	});

	this.addEvent(window,'touchstart',function(){
		alert("5");

		self._audioObj.play();
	});

	this._eventBeforePlayBegin=function(){};
	this._eventAfterPlayEnd=function(){};
	this._eventOnLoading=function(){};
	this._eventOnLoaded=function(){}


};

h5audio.fn=h5audio.prototype;

h5audio.fn.addEvent=function(el,event,func){
	if(el.atachEvent){
		el.attachEvent('on'+event,func);
	}else{
		el.addEventListener(event,func);
	}
}

h5audio.fn.removeEvent=function(el,event,func){
	if(el.detachEvent){
		el.detachEvent('on'+event,func);
	}else{
		el.removeEventListener(event,func);
	}
}

h5audio.fn.setSource=function(sources){
	var i=0;
	var source="";

	for(i=0;i<sources.length;i=i+1){
		source=document.createElement("source");
		source.setAttribute("src",sources[i][0]);
		source.setAttribute("type",sources[i][1]);

		this._audioObj.appendChild(source);
	}

	return this;

}

h5audio.fn.play=function(){
	var self=this;
	var handle=setInterval(function(){
			if(self._sourceState===2){

				self._audioObj.play();
				clearInterval(handle);
			}
	},1000);
}

h5audio.fn.rePlay=function(){
	console.log("hello");
}

h5audio.fn.pause=function(){
	console.log("hello");
}

h5audio.fn.stop=function(){
	console.log("hello");
}

h5audio.fn.jumpTo=function(time){
	console.log("hello");
}

h5audio.fn.playOtherSong=function(){
	console.log("hello");
}

h5audio.fn.getAudioObj=function(){
	return this._audioObj;
}

h5audio.fn.setAudioObj=function(){

}
h5audio.fn.config=function(option){

}

h5audio.fn.setAudioObjByAttrName=function(attr,name){

}

h5audio.fn.beforePlayBegin=function(func){

}

h5audio.fn.afterPlayEnd=function(func){

}

h5audio.fn.getCurrentTime=function(){
	return this._audioObj.currentTime;
}

h5audio.fn.totalTime=function(){
	return this._audioObj.durationtime;
}

var cd = h5audio().setSource([['http://statics.h-five.com/mp3/%E5%96%9C%E5%89%A7%E4%B9%8B%E7%8E%8B-%E6%9D%8E%E8%8D%A3%E6%B5%A9.mp3','audio/mpeg'
	]]).play();

