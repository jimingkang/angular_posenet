parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"o0P8":[function(require,module,exports) {
var t,e=-1,n=4/3,o=3,i=o+1;function r(t){return"box"+t}function l(t,e){return{left:0,top:0,width:t,height:e}}function u(t,e){return{left:t/4,top:e/4,width:t/2,height:e/4}}function c(t,e){return{width:t-40}}easyrtc.dontAddCloseButtons(!0);var s=20;function d(t,e){var o,i;return t<e*n?i=(o=t-20)/n:o=(i=e-20)*n,{left:(t-o)/2,top:(e-i)/2,width:o,height:i}}function a(t,e,o,i,r,l){var u,c,s;i<r*n?c=(u=i*t)/l:u=(c=r*t)*l,s=e<0?i-u:0;var d=0;return d=o<0?r-c:0,{left:s+=Math.floor(e*i),top:d+=Math.floor(o*r),width:u,height:c}}function y(t,e,o,i,r){return a(t,e,o,i,r,n)}function h(t,e,n,o,i,r,l){return a(t,e,n,o,i,r/l)}var f=1,p=1;function m(e,n){return"p"==t?{left:(e-f)/2,top:(n-2*p)/3,width:f,height:p}:{left:(e-2*f)/3,top:(n-p)/2,width:f,height:p}}function g(e,n){return"p"==t?{left:(e-f)/2,top:(n-2*p)/3*2+p,width:f,height:p}:{left:(e-2*f)/3*2+f,top:(n-p)/2,width:f,height:p}}function x(e,n){return"p"==t?{left:(e-f)/2,top:(n-3*p)/4,width:f,height:p}:{left:(e-2*f)/3,top:(n-2*p)/3,width:f,height:p}}function B(e,n){return"p"==t?{left:(e-f)/2,top:(n-3*p)/4*2+p,width:f,height:p}:{left:(e-2*f)/3*2+f,top:(n-2*p)/3,width:f,height:p}}function v(e,n){return"p"==t?{left:(e-f)/2,top:(n-3*p)/4*3+2*p,width:f,height:p}:{left:(e-2*f)/3*1.5+f/2,top:(n-2*p)/3*2+p,width:f,height:p}}function w(t,e){return{left:(t-2*f)/3,top:(e-2*p)/3,width:f,height:p}}function I(t,e){return{left:(t-2*f)/3*2+f,top:(e-2*p)/3,width:f,height:p}}function E(t,e){return{left:(t-2*f)/3,top:(e-2*p)/3*2+p,width:f,height:p}}function b(t,e){return{left:(t-2*f)/3*2+f,top:(e-2*p)/3*2+p,width:f,height:p}}var C=[!0,!1,!1,!1],k=0;function M(e,o){var i,r;function l(t,e){return(t-s*(e+1))/e}switch((t=e/n<o?"p":"l")+(k+1)){case"p1":case"l1":i=l(e,1),r=l(o,1);break;case"l2":i=l(e,2),r=l(o,1);break;case"p2":i=l(e,1),r=l(o,2);break;case"p4":case"l4":case"l3":i=l(e,2),r=l(o,2);break;case"p3":i=l(e,1),r=l(o,3)}f=Math.min(i,r*n),p=Math.min(r,i/n)}var T=[function(t,n){if(e>0)return y(.2,.01,.01,t,n);switch(M(t,n),k){case 0:return d(t,n);case 1:return m(t,n);case 2:return x(t,n);case 3:return w(t,n)}},function(t,n){if(e>=0||!C[1])return y(.2,.01,-.01,t,n);switch(k){case 1:return g(t,n);case 2:return B(t,n);case 3:return I(t,n)}},function(t,n){if(e>=0||!C[2])return y(.2,-.01,.01,t,n);switch(k){case 1:return g(t,n);case 2:return C[1]?v(t,n):B(t,n);case 3:return E(t,n)}},function(t,n){if(e>=0||!C[3])return y(.2,-.01,-.01,t,n);switch(k){case 1:return g(t,n);case 2:return v(t,n);case 3:return b(t,n)}}];function N(t,e){return t<e?h(.1,-.51,-.01,t,e,128,128):h(.1,-.01,-.51,t,e,128,128)}function L(t,e){return t<e?h(.1,-.51,.01,t,e,32,32):h(.1,.01,-.51,t,e,32,32)}function O(t,e){return t<e?h(.1,.51,.01,t,e,32,32):h(.1,.01,.51,t,e,32,32)}function z(){var t=document.getElementById("fullpage");t.style.width=window.innerWidth+"px",t.style.height=window.innerHeight+"px",k=easyrtc.getConnectionCount(),function t(e,n,o){var i=e.reshapeMe(n,o);void 0!==i.left&&(e.style.left=Math.round(i.left)+"px"),void 0!==i.top&&(e.style.top=Math.round(i.top)+"px"),void 0!==i.width&&(e.style.width=Math.round(i.width)+"px"),void 0!==i.height&&(e.style.height=Math.round(i.height)+"px");for(var r=e.childNodes.length,l=0;l<r;l++){var u=e.childNodes[l];u.reshapeMe&&t(u,i.width,i.height)}}(t,window.innerWidth,window.innerHeight)}function F(t,e){var n=document.getElementById(t);n||alert("Attempt to apply to reshapeFn to non-existent element "+t),e||alert("Attempt to apply misnamed reshapeFn to element "+t),n.reshapeMe=e}function H(){if(e>=0){var t=r(e);document.getElementById(t).style.zIndex=2,F(t,T[e]),document.getElementById("muteButton").style.display="none",document.getElementById("killButton").style.display="none",e=-1}}function A(){H(),e=-1,W(!1),z()}function W(t){var n=document.getElementById("muteButton");if(e>0){n.style.display="block";var o=document.getElementById(r(e)),i=!!o.muted;t&&(i=!i,o.muted=i),n.src=i?"images/button_unmute.png":"images/button_mute.png"}else n.style.display="none"}function P(t){var n=e;if(e>=0&&H(),n!=t){var o=r(t);e=t,F(o,d),document.getElementById(o).style.zIndex=1,t>0&&(document.getElementById("muteButton").style.display="block",W(),document.getElementById("killButton").style.display="block")}W(!1),z()}function R(t){var e=r(t);F(e,T[t]),document.getElementById(e).onclick=function(){P(t)}}function S(){if(e>0){var t=easyrtc.getIthCaller(e-1);A(),setTimeout(function(){easyrtc.hangup(t)},400)}}function _(){W(!0)}function D(t,e){easyrtc.setRoomOccupantListener(null);var n=[],i=0;for(var r in e)n.push(r);n.length>0&&function t(e){easyrtc.call(n[e],function(){++i<o&&e>0&&t(e-1)},function(n,r){easyrtc.showError(n,r),i<o&&e>0&&t(e-1)})}(n.length-1)}function j(){P(0)}function q(){document.getElementById("textentryBox").style.display="none",document.getElementById("textEntryButton").style.display="block"}function G(t){document.getElementById("textentryBox").style.display="none",document.getElementById("textEntryButton").style.display="block";var e=document.getElementById("textentryField").value;if(e&&""!=e)for(var n=0;n<o;n++){var i=easyrtc.getIthCaller(n);i&&""!=i&&easyrtc.sendPeerMessage(i,"im",e)}return!1}function J(){document.getElementById("textentryField").value="",document.getElementById("textentryBox").style.display="block",document.getElementById("textEntryButton").style.display="none",document.getElementById("textentryField").focus()}function K(t,e,n){var o=document.getElementById("fullpage"),i=parseInt(o.offsetWidth),r=parseInt(o.offsetHeight),l=.2*t+.8*i/2,u=.2*e+.8*r/2,c=document.createElement("img");c.src="images/cloud.png",c.style.width="1px",c.style.height="1px",c.style.left=t+"px",c.style.top=e+"px",o.appendChild(c),c.onload=function(){var s;function d(){s&&(o.removeChild(s),o.removeChild(c))}c.style.left=t+"px",c.style.top=e+"px",c.style.width="4px",c.style.height="4px",c.style.opacity=.7,c.style.zIndex=5,c.className="transit boxCommon",setTimeout(function(){c.style.left=l-i/4+"px",c.style.top=u-r/4+"px",c.style.width=i/2+"px",c.style.height=r/2+"px"},10),setTimeout(function(){(s=document.createElement("div")).className="boxCommon",s.style.left=Math.floor(l-i/8)+"px",s.style.top=Math.floor(u)+"px",s.style.fontSize="36pt",s.style.width=.4*i+"px",s.style.height=.4*r+"px",s.style.zIndex=6,s.appendChild(document.createTextNode(n)),o.appendChild(s),s.onclick=d,c.onclick=d},1e3),setTimeout(function(){c.style.left=t+"px",c.style.top=e+"px",c.style.width="4px",c.style.height="4px",o.removeChild(s)},9e3),setTimeout(function(){o.removeChild(c)},1e4)}}function Q(t,e,n){for(var i=0;i<o;i++)if(easyrtc.getIthCaller(i)==t){var l=document.getElementById(r(i+1));K(parseInt(l.offsetLeft)+parseInt(l.offsetWidth)/2,parseInt(l.offsetTop)+parseInt(l.offsetHeight)/2,n)}}function U(){F("fullpage",l);for(var t=0;t<i;t++)R(t);F("killButton",N),F("muteButton",L),F("textentryBox",u),F("textentryField",c),F("textEntryButton",O),W(!1),window.onresize=z,z(),easyrtc.setRoomOccupantListener(D),easyrtc.easyApp("easyrtc.multiparty","box0",["box1","box2","box3"],j),easyrtc.setPeerListener(Q),easyrtc.setDisconnectListener(function(){easyrtc.showError("LOST-CONNECTION","Lost connection to signaling server")});document.getElementById("box0"),document.getElementById("canvas0");easyrtc.setOnCall(function(t,n){console.log("getConnection count="+easyrtc.getConnectionCount()),C[n+1]=!0,0==e&&(A(),document.getElementById("textEntryButton").style.display="block"),document.getElementById(r(n+1)).style.visibility="visible",z()}),easyrtc.setOnHangup(function(t,n){C[n+1]=!1,e>0&&n+1==e&&A(),setTimeout(function(){document.getElementById(r(n+1)).style.visibility="hidden",0==easyrtc.getConnectionCount()&&(P(0),document.getElementById("textEntryButton").style.display="none",document.getElementById("textentryBox").style.display="none"),z()},20)})}
},{}]},{},["o0P8"], null)
//# sourceMappingURL=/demo_multiparty.771b6e72.js.map