	(function(){
		var d = document,
			isStrict = d.compatMode == "CSS1Compat",dd = d.documentElement,db = d.body,m = Math.max,
			ie = !!d.all,head = d.getElementsByTagName('head')[0],
			getWH = function(){
				return {h:(isStrict?dd:db).clientHeight,w:(isStrict?dd:db).clientWidth}
			},
			getS = function(){
				return {t:m(dd.scrollTop,db.scrollTop),l:m(dd.scrollLeft,db.scrollLeft)};	
			},
			creElm = function(o,t,pN){
				var el = d.createElement(t||'div');
				for(var p in o){
					p=='style'?el[p].cssText=o[p]:el[p]=o[p];
				}
				return (pN||db).insertBefore(el,(pN||db).firstChild);
			},
			div,
			div1 = creElm({id:'ckepop',style:"position:absolute;z-index:100000;display:none;top:50%;left:50%;"}),
			inputTimer,list,clist,as,texts={},script,timerover,timerout,timerloop,
			loop =  function(){
	        	var t = 1000,st = getS().t,c,wh=getWH();
				c = st  - div.offsetTop + (wh.h/2-$CKE.pop.offsetHeight/2);
	            c!=0&&(div.style.top = div.offsetTop + c/10 + 'px',t=10);
	            timerloop = setTimeout(loop,t)
	        };
		var scripts = d.getElementsByTagName('script'),img = 'l.gif';
		for(var i=0,ci,btn;ci=scripts[i++];){
			if(ci.src.match(/btn=([^&]+)/)){
				img = ci.src.match(/btn=([^&]+)/)[1];
				break
			}
		};
		div = creElm({id:'ckepop',style:"left:-242px;position:absolute;z-index:100000000;",innerHTML:"<table cellPadding=0 cellSpacing=0 ><tr><td><div ></div></td><td><img id='a' src='../utf8/l2.gif' style='cursor:pointer;' onmouseover='$CKE.over()' onclick='$CKE.center(this)'/></td></tr></table>"});
		creElm({href:'../utf8/share.css',rel:'stylesheet',type:'text/css'},'link');
		d.write('<script src="../utf8/piece.js" charset="utf-8"></script>');
        $CKE = {
			pop : div.getElementsByTagName('div')[0],
			centerpop:div1,
			disappear : function(event){
				var evt = window.event||event,
					t = evt.srcElement||evt.target,
					contain = div1.contains?div1.contains(t):!!(div1.compareDocumentPosition(t) & 16),
				    contain1 = div.contains ? div.contains(t) : !!(div.compareDocumentPosition(t) & 16);
	            if (!contain &&!contain1) {
	                div1.style.display = 'none';
	            }
			},
			over : function(){
				if(!timerloop){
					loop();
                }else{
					clearTimeout(timerloop);
					clearInterval(timerout);
					clearInterval(timerover);
					var t = 10,tmp=0,step = Math.abs(div.offsetLeft/55);
					timerover = setInterval(function(){
						if(t==0){
							clearInterval(timerover);
							loop();
						}else{
							var n = Math.round(step*t--);
							div.style.left = div.offsetLeft + n + 'px';
						}
					},10)
				}
			},
			out : function(){
				clearInterval(timerover);
			   	clearInterval(timerout);
				clearTimeout(timerloop);
				var t = 10,tmp=0,step = Math.abs((div.offsetLeft+242)/55);
			
				timerout = setInterval(function(){
					if(t==0){
						clearInterval(timerout);
						div.style.left = '-242px'
						loop();
					}else{
						var n = Math.round(step*t--);
						div.style.left = div.offsetLeft - n + 'px';
					}
				},10)
				         
			},
			center : function(a){
				if(a){
					db.style.position = 'static';
					var tl = getS();
					div1.style.display = "block";
					div1.style.margin = (-div1.offsetHeight/2+tl.t)+"px "+(-div1.offsetWidth/2+tl.l)+"px";
					list = d.getElementById('ckelist'),
					clist = list.cloneNode(true),
					as = clist.getElementsByTagName('input');
					for(var i=0,ci;ci = as[i++];){
						texts[ci.value] = ci.parentNode;			
					}
				}
			},
			choose : function(o){
				clearTimeout(inputTimer);
				inputTimer = setTimeout(function(){
					var s = o.value.replace(/^\s+|\s+$/,''),
						frag = d.createDocumentFragment();
					for(var p in texts){
						eval("var f = /"+(s||'.')+"/ig.test(p)");
						f&&frag.appendChild(texts[p].cloneNode(true));
					}
					list.innerHTML = '';
					list.appendChild(frag);
				},100)
			},
			centerClose : function(){
				div1.style.display = 'none'
			}
		};
		if(ie){
			div.onmouseleave = $CKE.out
		}else{
			div.onmouseout = function(e){
				!(this===e.relatedTarget||(this.contains?this.contains(e.relatedTarget):this.compareDocumentPosition(e.relatedTarget)==20))&&$CKE.out.call(this);
			}
		}
		ie?d.attachEvent("onclick",$CKE.disappear):d.addEventListener("click",$CKE.disappear,false);
		$CKE.over();
	})()
	function sendto(m){
		url=encodeURIComponent(location).replace('left.html',"index.html");
		window.open('../utf8/url.php?webid='+m+'&url='+url+'&title='+encodeURIComponent(document.title),'')
		return false;
	}

 function jt_copyUrl(){
 var jtHerf=this.location.href;
 var jtTitle=document.title;
 if(window.clipboardData){
 var tempCurLink=jtTitle + "\n" + jtHerf;
 var ok=window.clipboardData.setData("Text",tempCurLink);
 if(ok) alert("复制成功,请粘贴到你的QQ/MSN上推荐给你的好友！");
 }else{alert("目前只支持IE，请复制地址栏URL,推荐给你的QQ/MSN好友！");}
 }
 
  function jt_addBookmark(title) {
                     var url=parent.location.href;
                     if (window.sidebar) { 
                            window.sidebar.addPanel(title, url,""); 
                     } else if( document.all ) {
                     window.external.AddFavorite( url, title);
                     } else if( window.opera && window.print ) {
                     return true;
                     }
       }