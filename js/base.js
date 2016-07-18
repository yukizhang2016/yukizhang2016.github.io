
function domReady(fn){
    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded', function(){
            fn && fn();
        }, false);
    }else{
        document.attachEvent('onreadystatechange', function(){
            if(document.readyState=='complete'){
                fn && fn();
            }
        });
    }
}
//运动
function getStyle(obj, name){
    return (obj.currentStyle || getComputedStyle(obj, false))[name];
}
function move(obj, json, options){
    var options=options || {};
    options.duration=options.duration || 2000;
    options.easing=options.easing || 'linear';

    var start={};
    var dis={};
    for(var name in json){
        start[name]=parseFloat(getStyle(obj, name));
        if(isNaN(start[name])){
            switch(name){
                case 'left':
                    start[name]=obj.offsetLeft;
                    break;
                case 'top':
                    start[name]=obj.offsetTop;
                    break;
                case 'opacity':
                    start[name]=1;
                    break;
                case 'borderWidth':
                    start[name]=0;
                    break;
                // width
            }
        }
        dis[name]=json[name]-start[name];
    }

    var count=Math.floor(options.duration/30);
    var n=0;
    clearInterval(obj.timer);
    obj.timer=setInterval(function(){
        n++;

        for(var name in json){
            switch(options.easing){
                case 'linear':
                    var a=n/count;
                    var cur=start[name]+dis[name]*a;
                    break;
                case 'ease-in':
                    var a=n/count;
                    var cur=start[name]+dis[name]*a*a*a;
                    break;
                case 'ease-out':
                    var a=1-n/count;
                    var cur=start[name]+dis[name]*(1-a*a*a);
                    break;
            }

            if(name=='opacity' ){
                obj.style.opacity=cur;
                obj.style.filter='alpha(opacity='+cur*100+')';
            }else{
                obj.style[name]=cur+'px';
            }
        }


        if(n==count){
            clearInterval(obj.timer);
            options.complete && options.complete();
        }
    }, 30);
}
//随机数
function rnd(n,m){
    return parseInt(Math.random()*(m-n))+n;
}
//补0
function toDouble(n){
    return n<10?'0'+n:''+n;
}
//去重
function findInArr(n,arr){
    for(var i=0;i<arr.length;i++){
        if(arr[i]==n){
            return true;
        }else{
            return false;
        }
    }
}
//获取class
function getByClass(oParent, sClass){
    if(oParent.getElementsByClassName){
        return oParent.getElementsByClassName(sClass);
    }else{
        var aEle=oParent.getElementsByTagName('*');
        var arr=[];
        var reg=new RegExp('\\b'+sClass+'\\b');
        for(var i=0; i<aEle.length; i++){
            if(reg.test(aEle[i].className)){
                arr.push(aEle[i]);
            }
        }
        return arr;
    }
}
//圆周运动
function cirMove(obj, iTarget){
    var R=obj.parentNode.offsetWidth/2;
    var a=0;
    var start=0;
    var dis=iTarget-start;
    var timer;

    var count=Math.floor(4000/30);
    var n=0;
    clearInterval(timer);
    timer=setInterval(function(){
        n++;

        var a=n/count;
        var cur=start+dis*a;

        var x=R+R*Math.sin(cur*Math.PI/180);
        var y=R-R*Math.cos(cur*Math.PI/180);
        obj.style.left=x+'px';
        obj.style.top=y+'px';
        if(n==count){
            n=0;
        }
    }, 30);
    function show(){
        move(obj,{opacity:0.5},{complete:function(){
            move(obj,{opacity:1},{complete:function(){
                show();
            }})
        }})
    }
    show();
}
//导航栏运动效果
(function(window){
    var iSpeed=0;
    var left=0;
    var n=0;
    var timer;
    window.elastic=function(obj,iTarget){
        clearInterval(timer);
        timer=setInterval(function(){
            iSpeed+=(iTarget-left)/5;
            iSpeed=iSpeed*0.8;
            left+=iSpeed;
            obj.style.left=left+'px';
            if(Math.abs(iSpeed)<1 && Math.round(left)==iTarget){
                clearInterval(timer);
            }
        },30);  
    };
})(window);
function addEvent(obj, sEv, fn){
    if(obj.addEventListener){
        obj.addEventListener(sEv, fn, false);
    }else{
        obj.attachEvent('on'+sEv, fn);
    }
}
// 滚轮滚动事件
function addWheel(obj, fn){
    function wheel(ev){
        var oEvent=ev || event;

        var bDown=true;
        if(oEvent.wheelDelta){
            if(oEvent.wheelDelta>0){
                bDown=false;
            }else{
                bDown=true;
            }
        }else{
            if(oEvent.detail<0){
                bDown=false;
            }else{
                bDown=true;
            }
        }

        fn && fn(bDown);
        // 阻止默认事件
        oEvent.preventDefault && oEvent.preventDefault();
        return false;
    }

    if(navigator.userAgent.toLowerCase().indexOf('firefox')!=-1){
        obj.addEventListener('DOMMouseScroll', wheel, false);
    }else{
        // obj.onmousewheel=wheel;
        addEvent(obj, 'mousewheel', wheel);
    }
}

function setStyle3(obj, name, value){
    var w=name.charAt(0).toUpperCase()+name.substring(1);
    obj.style['Webkit'+w]=value;
    obj.style['Moz'+w]=value;
    obj.style['ms'+w]=value;
    obj.style['O'+w]=value;
    obj.style[name]=value;
}