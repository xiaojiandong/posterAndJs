
window.onload=function(){
	
    addPhotos();
};

//1 定义方法turn，用于翻转海报
function turn (elem) {//参数elem-->当前选中元素（海报）
 //2 获取当前海报的className（字符串）	
  var cls=elem.className; 
  var n =elem.id.split('_')[1];//获取当前海报id后面的数字
  if(!/photo_center/.test(cls)){ //若当前海报没有photo_center类
  	return rsort(n); //排序返回中心海报，不翻转
  }
  //3 正则匹配
  if(/photo_front/.test(cls)){ //当前的cls类中包含有photo_front类  --海报正面
  	  cls=cls.replace(/photo_front/,"photo_back"); //将photo_front替换成photo_back
  	  g("#nav_"+n).className += " i_back ";
  }else{  //--海报反面
  	  cls=cls.replace(/photo_back/,"photo_front"); //将photo_back替换成photo_front
  	  g("#nav_"+n).className =g("#nav_"+n).className.replace(/\s*i_back\s*/," ");//去掉反面类
  }
  //4 最终返回需要的类
   return elem.className = cls; 
}

//通用函数；获取节点（通过类或id获取节点）
function g (selector) {
	var method = selector.substr(0,1) == "."? //截取字符串(从下标0开始往后截取1位)，若以.开头则是类
	              "getElementsByClassName":"getElementById"; //最后返回的结果
  return document[method](selector.substr(1)); //截取指定下标(从下标为1开始到末尾)
}

//输出所有海报
var data=data;//调用了data.js中的内容
function addPhotos () {//输出所有照片
  
  var template=g("#wrap").innerHTML; //获取模板节点的内容	
  var html = []; //需要返回的内容	
  var nav = []; //底部的导航条；每个导航条对应一个海报
  for(s in data){ //遍历数组的内容,s指数组的下标
  	//替换模板中的实体内容
  	var _html=template
  	          .replace("{{index}}",s) //替换成数组的下标s
  	          .replace("{{img}}",data[s].img)
  	          .replace("{{caption}}",data[s].caption)
  	          .replace("{{desc}}",data[s].desc);
  	   html.push(_html); //将实体内容追加到html数组中       ; \' -->表示引号
  	   nav.push('<span id="nav_'+s+'" onclick="turn(g(\'#photo_'
  	              +s+'\'))" class="i" >&nbsp;</span>');//动态生成导航条,控制按钮的id和海报id对应
  }
    html.push('<div class="nav">'+nav.join('')+'</div>');//将控制按钮追加到模板
   g("#wrap").innerHTML = html.join(""); //将实体内容追加到模板中(join方法将数组转变成字符串)
   rsort( random([0,data.length]) );//排序海报
}

//计算左右分区的随机范围，返回{ left:{x:[min,max] , y:[]},right:{} }
function range () {
  var range={ left:{x:[] , y:[]} , right:{x:[] , y:[]} };
  var wrap={ //整个父盒子 的宽高
  	   w:g("#wrap").clientWidth,
  	   h:g("#wrap").clientHeight
  	   // w:g("#wrap").clientWidth,
  	   // h:g("#wrap").clientHeight
  };
  var photo={//具体某个photo的宽高
  	   w:g(".photo")[0].clientWidth,
  	   h:g(".photo")[0].clientHeight
  	   // w:g(".photo")[0].clientWidth,
  	   // h:g(".photo")[0].clientHeight
  };
  range.wrap = wrap;//追加到range中
  range.photo = photo;
  
 // range.left.x = [0-photo.w , wrap.w/2-photo.w/2]; //left分区的x范围
  //range.left.y = [0-photo.h , wrap.h]; //left分区的y范围
  
 // range.right.x = [wrap.w/2+photo.w/2, wrap.w+photo.w]; //right区的x范围
 // range.right.y = [0-photo.h , wrap.h]; //right分区的y范围
  range.left.x = [-photo.w/2 , wrap.w/2-photo.w/2]; //left分区的x范围
  range.left.y = [-photo.h/2 , wrap.h]; //left分区的y范围
  
  range.right.x = [wrap.w/2+photo.w/2, wrap.w+photo.w/2]; //right区的x范围
  range.right.y = range.left.y;
  
  return range;
}

//排序全部海报，每排序一次就打乱一次（根据每张海报特定的id选择为中心海报）
function rsort( n ){
   var _photo = g(".photo"); //_photo表示临时变量，g(".photo")获取全部海报
   var photos = [];
   //循环遍历全部海报
   for (var i=0; i < _photo.length; i++) {//非正式数组(只有length)；正式数组存在length和sort
   	 //将全部海报的photo_center类替换为空"" , /\s*photo_center\s*/正则，去除空格
     _photo[i].className=_photo[i].className.replace(/\s*photo_center\s*/ , "");//去掉中心海报样式
     _photo[i].className=_photo[i].className.replace(/\s*photo_front\s*/ , "");//去掉前后样式
     _photo[i].className=_photo[i].className.replace(/\s*photo_back\s*/ , "");//去掉前后样式
     _photo[i].style.left = '';
   	 _photo[i].style.top = '';
   	 _photo[i].style["-webkit-transform"]="rotate(0deg) scale(1.2)";//设置角度(中心海报)
   	 _photo[i].className += " photo_front"; //初始状态
     photos.push(_photo[i]);
   };
   
   var photo_center = g("#photo_"+n); //定义中心海报	
   photo_center.className += " photo_center"; //已经在css中定义好的photo_center类(注意类要加空格)
   photo_center=photos.splice(n,1)[0];//删除当前中心海报
   //将海报分为photo_left和photo_right两个区域部分   
   var photo_left = photos.splice(0,Math.ceil(photos.length/2)); //8个海报
   var photo_right = photos;//7个海报
   
   var ranges = range();
   for(s in photo_left){ //遍历左边全部海报并打乱秩序
   	  var photo= photo_left[s];//
   	  photo.style.left = random(ranges.left.x) + "px";
   	  photo.style.top = random(ranges.left.y) + "px";
   	  photo.style["-webkit-transform"]="rotate("+random([-60,60])+"deg) scale(.8)";//设置角度
   }
   for(s in photo_right){//遍历右边全部海报并打乱秩序
   	  var photo= photo_right[s];//当前photo
   	  photo.style.left = random(ranges.right.x) + "px";
   	  photo.style.top = random(ranges.right.y) + "px";
   	  photo.style["-webkit-transform"]="rotate("+random([-60,60])+"deg) scale(.8)";//设置角度
   }
   //控制按钮排序
   var navs = g('.i');//获取全部的span，数组
    for (var s=0; s < navs.length; s++) {
      navs[s].className = navs[s].className.replace(/\s*i_current\s*/ , " "); 
      navs[s].className = navs[s].className.replace(/\s*i_back\s*/ , " "); 
    };   
 
   g('#nav_'+n).className += ' i_current '; //当前选中状态的导航条
   console.log(photo_left.length,photo_right.length);
}

//随机生成一个值0~8之间，只有8张海报（即随机生成海报居中）
function random(range){ //range是一个数组(内部有两个数，最大数和最小数)
	var max = Math.max( range[0], range[1] );
	var min = Math.min( range[0], range[1] );
    var diff = max - min; //大值和小值的差值， [-1,6] -->差值7
    var number = Math.ceil(Math.random()*diff + min); //向上取整
    return number; //最终返回的是数组range中最大值和最小值中间的整数
}



