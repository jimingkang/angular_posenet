var e={load:function e(t,a){var n=a||document;var r=n.createElement("link");r.type="text/css";r.rel="stylesheet";r.href=t;n.getElementsByTagName("head")[0].appendChild(r)},inject:function e(t,a){var n=a||document;var r=document.createElement("style");r.type="text/css";r.innerHTML=t;var c=n.getElementsByTagName("head")[0];try{c.appendChild(r)}catch(l){}}};export default e;