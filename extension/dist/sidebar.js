"use strict";(()=>{var yL=Object.create;var Cy=Object.defineProperty;var vL=Object.getOwnPropertyDescriptor;var SL=Object.getOwnPropertyNames;var _L=Object.getPrototypeOf,ML=Object.prototype.hasOwnProperty;var qn=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var bL=(t,e,a,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of SL(e))!ML.call(t,i)&&i!==a&&Cy(t,i,{get:()=>e[i],enumerable:!(n=vL(e,i))||n.enumerable});return t};var Pa=(t,e,a)=>(a=t!=null?yL(_L(t)):{},bL(e||!t||!t.__esModule?Cy(a,"default",{value:t,enumerable:!0}):a,t));var Uy=qn(Ut=>{"use strict";function Pp(t,e){var a=t.length;t.push(e);e:for(;0<a;){var n=a-1>>>1,i=t[n];if(0<zc(i,e))t[n]=e,t[a]=i,a=n;else break e}}function Wn(t){return t.length===0?null:t[0]}function Hc(t){if(t.length===0)return null;var e=t[0],a=t.pop();if(a!==e){t[0]=a;e:for(var n=0,i=t.length,s=i>>>1;n<s;){var r=2*(n+1)-1,o=t[r],l=r+1,u=t[l];if(0>zc(o,a))l<i&&0>zc(u,o)?(t[n]=u,t[l]=a,n=l):(t[n]=o,t[r]=a,n=r);else if(l<i&&0>zc(u,a))t[n]=u,t[l]=a,n=l;else break e}}return e}function zc(t,e){var a=t.sortIndex-e.sortIndex;return a!==0?a:t.id-e.id}Ut.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(Ty=performance,Ut.unstable_now=function(){return Ty.now()}):(Ip=Date,Ly=Ip.now(),Ut.unstable_now=function(){return Ip.now()-Ly});var Ty,Ip,Ly,ci=[],Ji=[],CL=1,hn=null,va=3,Up=!1,Ll=!1,Al=!1,Bp=!1,wy=typeof setTimeout=="function"?setTimeout:null,Iy=typeof clearTimeout=="function"?clearTimeout:null,Ay=typeof setImmediate<"u"?setImmediate:null;function kc(t){for(var e=Wn(Ji);e!==null;){if(e.callback===null)Hc(Ji);else if(e.startTime<=t)Hc(Ji),e.sortIndex=e.expirationTime,Pp(ci,e);else break;e=Wn(Ji)}}function Np(t){if(Al=!1,kc(t),!Ll)if(Wn(ci)!==null)Ll=!0,zr||(zr=!0,Fr());else{var e=Wn(Ji);e!==null&&Op(Np,e.startTime-t)}}var zr=!1,El=-1,Ry=5,Dy=-1;function Py(){return Bp?!0:!(Ut.unstable_now()-Dy<Ry)}function Rp(){if(Bp=!1,zr){var t=Ut.unstable_now();Dy=t;var e=!0;try{e:{Ll=!1,Al&&(Al=!1,Iy(El),El=-1),Up=!0;var a=va;try{t:{for(kc(t),hn=Wn(ci);hn!==null&&!(hn.expirationTime>t&&Py());){var n=hn.callback;if(typeof n=="function"){hn.callback=null,va=hn.priorityLevel;var i=n(hn.expirationTime<=t);if(t=Ut.unstable_now(),typeof i=="function"){hn.callback=i,kc(t),e=!0;break t}hn===Wn(ci)&&Hc(ci),kc(t)}else Hc(ci);hn=Wn(ci)}if(hn!==null)e=!0;else{var s=Wn(Ji);s!==null&&Op(Np,s.startTime-t),e=!1}}break e}finally{hn=null,va=a,Up=!1}e=void 0}}finally{e?Fr():zr=!1}}}var Fr;typeof Ay=="function"?Fr=function(){Ay(Rp)}:typeof MessageChannel<"u"?(Dp=new MessageChannel,Ey=Dp.port2,Dp.port1.onmessage=Rp,Fr=function(){Ey.postMessage(null)}):Fr=function(){wy(Rp,0)};var Dp,Ey;function Op(t,e){El=wy(function(){t(Ut.unstable_now())},e)}Ut.unstable_IdlePriority=5;Ut.unstable_ImmediatePriority=1;Ut.unstable_LowPriority=4;Ut.unstable_NormalPriority=3;Ut.unstable_Profiling=null;Ut.unstable_UserBlockingPriority=2;Ut.unstable_cancelCallback=function(t){t.callback=null};Ut.unstable_forceFrameRate=function(t){0>t||125<t?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Ry=0<t?Math.floor(1e3/t):5};Ut.unstable_getCurrentPriorityLevel=function(){return va};Ut.unstable_next=function(t){switch(va){case 1:case 2:case 3:var e=3;break;default:e=va}var a=va;va=e;try{return t()}finally{va=a}};Ut.unstable_requestPaint=function(){Bp=!0};Ut.unstable_runWithPriority=function(t,e){switch(t){case 1:case 2:case 3:case 4:case 5:break;default:t=3}var a=va;va=t;try{return e()}finally{va=a}};Ut.unstable_scheduleCallback=function(t,e,a){var n=Ut.unstable_now();switch(typeof a=="object"&&a!==null?(a=a.delay,a=typeof a=="number"&&0<a?n+a:n):a=n,t){case 1:var i=-1;break;case 2:i=250;break;case 5:i=1073741823;break;case 4:i=1e4;break;default:i=5e3}return i=a+i,t={id:CL++,callback:e,priorityLevel:t,startTime:a,expirationTime:i,sortIndex:-1},a>n?(t.sortIndex=a,Pp(Ji,t),Wn(ci)===null&&t===Wn(Ji)&&(Al?(Iy(El),El=-1):Al=!0,Op(Np,a-n))):(t.sortIndex=i,Pp(ci,t),Ll||Up||(Ll=!0,zr||(zr=!0,Fr()))),t};Ut.unstable_shouldYield=Py;Ut.unstable_wrapCallback=function(t){var e=va;return function(){var a=va;va=e;try{return t.apply(this,arguments)}finally{va=a}}}});var Ny=qn((TP,By)=>{"use strict";By.exports=Uy()});var Yy=qn(He=>{"use strict";var kp=Symbol.for("react.transitional.element"),TL=Symbol.for("react.portal"),LL=Symbol.for("react.fragment"),AL=Symbol.for("react.strict_mode"),EL=Symbol.for("react.profiler"),wL=Symbol.for("react.consumer"),IL=Symbol.for("react.context"),RL=Symbol.for("react.forward_ref"),DL=Symbol.for("react.suspense"),PL=Symbol.for("react.memo"),Hy=Symbol.for("react.lazy"),UL=Symbol.for("react.activity"),Oy=Symbol.iterator;function BL(t){return t===null||typeof t!="object"?null:(t=Oy&&t[Oy]||t["@@iterator"],typeof t=="function"?t:null)}var Vy={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Gy=Object.assign,qy={};function Hr(t,e,a){this.props=t,this.context=e,this.refs=qy,this.updater=a||Vy}Hr.prototype.isReactComponent={};Hr.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Hr.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Wy(){}Wy.prototype=Hr.prototype;function Hp(t,e,a){this.props=t,this.context=e,this.refs=qy,this.updater=a||Vy}var Vp=Hp.prototype=new Wy;Vp.constructor=Hp;Gy(Vp,Hr.prototype);Vp.isPureReactComponent=!0;var Fy=Array.isArray;function zp(){}var It={H:null,A:null,T:null,S:null},Xy=Object.prototype.hasOwnProperty;function Gp(t,e,a){var n=a.ref;return{$$typeof:kp,type:t,key:e,ref:n!==void 0?n:null,props:a}}function NL(t,e){return Gp(t.type,e,t.props)}function qp(t){return typeof t=="object"&&t!==null&&t.$$typeof===kp}function OL(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(a){return e[a]})}var zy=/\/+/g;function Fp(t,e){return typeof t=="object"&&t!==null&&t.key!=null?OL(""+t.key):e.toString(36)}function FL(t){switch(t.status){case"fulfilled":return t.value;case"rejected":throw t.reason;default:switch(typeof t.status=="string"?t.then(zp,zp):(t.status="pending",t.then(function(e){t.status==="pending"&&(t.status="fulfilled",t.value=e)},function(e){t.status==="pending"&&(t.status="rejected",t.reason=e)})),t.status){case"fulfilled":return t.value;case"rejected":throw t.reason}}throw t}function kr(t,e,a,n,i){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var r=!1;if(t===null)r=!0;else switch(s){case"bigint":case"string":case"number":r=!0;break;case"object":switch(t.$$typeof){case kp:case TL:r=!0;break;case Hy:return r=t._init,kr(r(t._payload),e,a,n,i)}}if(r)return i=i(t),r=n===""?"."+Fp(t,0):n,Fy(i)?(a="",r!=null&&(a=r.replace(zy,"$&/")+"/"),kr(i,e,a,"",function(u){return u})):i!=null&&(qp(i)&&(i=NL(i,a+(i.key==null||t&&t.key===i.key?"":(""+i.key).replace(zy,"$&/")+"/")+r)),e.push(i)),1;r=0;var o=n===""?".":n+":";if(Fy(t))for(var l=0;l<t.length;l++)n=t[l],s=o+Fp(n,l),r+=kr(n,e,a,s,i);else if(l=BL(t),typeof l=="function")for(t=l.call(t),l=0;!(n=t.next()).done;)n=n.value,s=o+Fp(n,l++),r+=kr(n,e,a,s,i);else if(s==="object"){if(typeof t.then=="function")return kr(FL(t),e,a,n,i);throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.")}return r}function Vc(t,e,a){if(t==null)return t;var n=[],i=0;return kr(t,n,"","",function(s){return e.call(a,s,i++)}),n}function zL(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(a){(t._status===0||t._status===-1)&&(t._status=1,t._result=a)},function(a){(t._status===0||t._status===-1)&&(t._status=2,t._result=a)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var ky=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},kL={map:Vc,forEach:function(t,e,a){Vc(t,function(){e.apply(this,arguments)},a)},count:function(t){var e=0;return Vc(t,function(){e++}),e},toArray:function(t){return Vc(t,function(e){return e})||[]},only:function(t){if(!qp(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};He.Activity=UL;He.Children=kL;He.Component=Hr;He.Fragment=LL;He.Profiler=EL;He.PureComponent=Hp;He.StrictMode=AL;He.Suspense=DL;He.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=It;He.__COMPILER_RUNTIME={__proto__:null,c:function(t){return It.H.useMemoCache(t)}};He.cache=function(t){return function(){return t.apply(null,arguments)}};He.cacheSignal=function(){return null};He.cloneElement=function(t,e,a){if(t==null)throw Error("The argument must be a React element, but you passed "+t+".");var n=Gy({},t.props),i=t.key;if(e!=null)for(s in e.key!==void 0&&(i=""+e.key),e)!Xy.call(e,s)||s==="key"||s==="__self"||s==="__source"||s==="ref"&&e.ref===void 0||(n[s]=e[s]);var s=arguments.length-2;if(s===1)n.children=a;else if(1<s){for(var r=Array(s),o=0;o<s;o++)r[o]=arguments[o+2];n.children=r}return Gp(t.type,i,n)};He.createContext=function(t){return t={$$typeof:IL,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null},t.Provider=t,t.Consumer={$$typeof:wL,_context:t},t};He.createElement=function(t,e,a){var n,i={},s=null;if(e!=null)for(n in e.key!==void 0&&(s=""+e.key),e)Xy.call(e,n)&&n!=="key"&&n!=="__self"&&n!=="__source"&&(i[n]=e[n]);var r=arguments.length-2;if(r===1)i.children=a;else if(1<r){for(var o=Array(r),l=0;l<r;l++)o[l]=arguments[l+2];i.children=o}if(t&&t.defaultProps)for(n in r=t.defaultProps,r)i[n]===void 0&&(i[n]=r[n]);return Gp(t,s,i)};He.createRef=function(){return{current:null}};He.forwardRef=function(t){return{$$typeof:RL,render:t}};He.isValidElement=qp;He.lazy=function(t){return{$$typeof:Hy,_payload:{_status:-1,_result:t},_init:zL}};He.memo=function(t,e){return{$$typeof:PL,type:t,compare:e===void 0?null:e}};He.startTransition=function(t){var e=It.T,a={};It.T=a;try{var n=t(),i=It.S;i!==null&&i(a,n),typeof n=="object"&&n!==null&&typeof n.then=="function"&&n.then(zp,ky)}catch(s){ky(s)}finally{e!==null&&a.types!==null&&(e.types=a.types),It.T=e}};He.unstable_useCacheRefresh=function(){return It.H.useCacheRefresh()};He.use=function(t){return It.H.use(t)};He.useActionState=function(t,e,a){return It.H.useActionState(t,e,a)};He.useCallback=function(t,e){return It.H.useCallback(t,e)};He.useContext=function(t){return It.H.useContext(t)};He.useDebugValue=function(){};He.useDeferredValue=function(t,e){return It.H.useDeferredValue(t,e)};He.useEffect=function(t,e){return It.H.useEffect(t,e)};He.useEffectEvent=function(t){return It.H.useEffectEvent(t)};He.useId=function(){return It.H.useId()};He.useImperativeHandle=function(t,e,a){return It.H.useImperativeHandle(t,e,a)};He.useInsertionEffect=function(t,e){return It.H.useInsertionEffect(t,e)};He.useLayoutEffect=function(t,e){return It.H.useLayoutEffect(t,e)};He.useMemo=function(t,e){return It.H.useMemo(t,e)};He.useOptimistic=function(t,e){return It.H.useOptimistic(t,e)};He.useReducer=function(t,e,a){return It.H.useReducer(t,e,a)};He.useRef=function(t){return It.H.useRef(t)};He.useState=function(t){return It.H.useState(t)};He.useSyncExternalStore=function(t,e,a){return It.H.useSyncExternalStore(t,e,a)};He.useTransition=function(){return It.H.useTransition()};He.version="19.2.8"});var Qi=qn((AP,Zy)=>{"use strict";Zy.exports=Yy()});var Jy=qn(Aa=>{"use strict";var HL=Qi();function Ky(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)e+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function ji(){}var La={d:{f:ji,r:function(){throw Error(Ky(522))},D:ji,C:ji,L:ji,m:ji,X:ji,S:ji,M:ji},p:0,findDOMNode:null},VL=Symbol.for("react.portal");function GL(t,e,a){var n=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:VL,key:n==null?null:""+n,children:t,containerInfo:e,implementation:a}}var wl=HL.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function Gc(t,e){if(t==="font")return"";if(typeof e=="string")return e==="use-credentials"?e:""}Aa.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=La;Aa.createPortal=function(t,e){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)throw Error(Ky(299));return GL(t,e,null,a)};Aa.flushSync=function(t){var e=wl.T,a=La.p;try{if(wl.T=null,La.p=2,t)return t()}finally{wl.T=e,La.p=a,La.d.f()}};Aa.preconnect=function(t,e){typeof t=="string"&&(e?(e=e.crossOrigin,e=typeof e=="string"?e==="use-credentials"?e:"":void 0):e=null,La.d.C(t,e))};Aa.prefetchDNS=function(t){typeof t=="string"&&La.d.D(t)};Aa.preinit=function(t,e){if(typeof t=="string"&&e&&typeof e.as=="string"){var a=e.as,n=Gc(a,e.crossOrigin),i=typeof e.integrity=="string"?e.integrity:void 0,s=typeof e.fetchPriority=="string"?e.fetchPriority:void 0;a==="style"?La.d.S(t,typeof e.precedence=="string"?e.precedence:void 0,{crossOrigin:n,integrity:i,fetchPriority:s}):a==="script"&&La.d.X(t,{crossOrigin:n,integrity:i,fetchPriority:s,nonce:typeof e.nonce=="string"?e.nonce:void 0})}};Aa.preinitModule=function(t,e){if(typeof t=="string")if(typeof e=="object"&&e!==null){if(e.as==null||e.as==="script"){var a=Gc(e.as,e.crossOrigin);La.d.M(t,{crossOrigin:a,integrity:typeof e.integrity=="string"?e.integrity:void 0,nonce:typeof e.nonce=="string"?e.nonce:void 0})}}else e==null&&La.d.M(t)};Aa.preload=function(t,e){if(typeof t=="string"&&typeof e=="object"&&e!==null&&typeof e.as=="string"){var a=e.as,n=Gc(a,e.crossOrigin);La.d.L(t,a,{crossOrigin:n,integrity:typeof e.integrity=="string"?e.integrity:void 0,nonce:typeof e.nonce=="string"?e.nonce:void 0,type:typeof e.type=="string"?e.type:void 0,fetchPriority:typeof e.fetchPriority=="string"?e.fetchPriority:void 0,referrerPolicy:typeof e.referrerPolicy=="string"?e.referrerPolicy:void 0,imageSrcSet:typeof e.imageSrcSet=="string"?e.imageSrcSet:void 0,imageSizes:typeof e.imageSizes=="string"?e.imageSizes:void 0,media:typeof e.media=="string"?e.media:void 0})}};Aa.preloadModule=function(t,e){if(typeof t=="string")if(e){var a=Gc(e.as,e.crossOrigin);La.d.m(t,{as:typeof e.as=="string"&&e.as!=="script"?e.as:void 0,crossOrigin:a,integrity:typeof e.integrity=="string"?e.integrity:void 0})}else La.d.m(t)};Aa.requestFormReset=function(t){La.d.r(t)};Aa.unstable_batchedUpdates=function(t,e){return t(e)};Aa.useFormState=function(t,e,a){return wl.H.useFormState(t,e,a)};Aa.useFormStatus=function(){return wl.H.useHostTransitionStatus()};Aa.version="19.2.8"});var $y=qn((wP,jy)=>{"use strict";function Qy(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Qy)}catch(t){console.error(t)}}Qy(),jy.exports=Jy()});var fb=qn(md=>{"use strict";var jt=Ny(),TS=Qi(),qL=$y();function J(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)e+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function LS(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function mu(t){var e=t,a=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(a=e.return),t=e.return;while(t)}return e.tag===3?a:null}function AS(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function ES(t){if(t.tag===31){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function ev(t){if(mu(t)!==t)throw Error(J(188))}function WL(t){var e=t.alternate;if(!e){if(e=mu(t),e===null)throw Error(J(188));return e!==t?null:t}for(var a=t,n=e;;){var i=a.return;if(i===null)break;var s=i.alternate;if(s===null){if(n=i.return,n!==null){a=n;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===a)return ev(i),t;if(s===n)return ev(i),e;s=s.sibling}throw Error(J(188))}if(a.return!==n.return)a=i,n=s;else{for(var r=!1,o=i.child;o;){if(o===a){r=!0,a=i,n=s;break}if(o===n){r=!0,n=i,a=s;break}o=o.sibling}if(!r){for(o=s.child;o;){if(o===a){r=!0,a=s,n=i;break}if(o===n){r=!0,n=s,a=i;break}o=o.sibling}if(!r)throw Error(J(189))}}if(a.alternate!==n)throw Error(J(190))}if(a.tag!==3)throw Error(J(188));return a.stateNode.current===a?t:e}function wS(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t;for(t=t.child;t!==null;){if(e=wS(t),e!==null)return e;t=t.sibling}return null}var Pt=Object.assign,XL=Symbol.for("react.element"),qc=Symbol.for("react.transitional.element"),Ol=Symbol.for("react.portal"),Yr=Symbol.for("react.fragment"),IS=Symbol.for("react.strict_mode"),Cm=Symbol.for("react.profiler"),RS=Symbol.for("react.consumer"),yi=Symbol.for("react.context"),vg=Symbol.for("react.forward_ref"),Tm=Symbol.for("react.suspense"),Lm=Symbol.for("react.suspense_list"),Sg=Symbol.for("react.memo"),$i=Symbol.for("react.lazy");Symbol.for("react.scope");var Am=Symbol.for("react.activity");Symbol.for("react.legacy_hidden");Symbol.for("react.tracing_marker");var YL=Symbol.for("react.memo_cache_sentinel");Symbol.for("react.view_transition");var tv=Symbol.iterator;function Il(t){return t===null||typeof t!="object"?null:(t=tv&&t[tv]||t["@@iterator"],typeof t=="function"?t:null)}var ZL=Symbol.for("react.client.reference");function Em(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===ZL?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Yr:return"Fragment";case Cm:return"Profiler";case IS:return"StrictMode";case Tm:return"Suspense";case Lm:return"SuspenseList";case Am:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case Ol:return"Portal";case yi:return t.displayName||"Context";case RS:return(t._context.displayName||"Context")+".Consumer";case vg:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Sg:return e=t.displayName||null,e!==null?e:Em(t.type)||"Memo";case $i:e=t._payload,t=t._init;try{return Em(t(e))}catch{}}return null}var Fl=Array.isArray,Fe=TS.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ct=qL.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Ks={pending:!1,data:null,method:null,action:null},wm=[],Zr=-1;function Jn(t){return{current:t}}function oa(t){0>Zr||(t.current=wm[Zr],wm[Zr]=null,Zr--)}function At(t,e){Zr++,wm[Zr]=t.current,t.current=e}var Kn=Jn(null),tu=Jn(null),cs=Jn(null),Cf=Jn(null);function Tf(t,e){switch(At(cs,e),At(tu,t),At(Kn,null),e.nodeType){case 9:case 11:t=(t=e.documentElement)&&(t=t.namespaceURI)?lS(t):0;break;default:if(t=e.tagName,e=e.namespaceURI)e=lS(e),t=QM(e,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}oa(Kn),At(Kn,t)}function ho(){oa(Kn),oa(tu),oa(cs)}function Im(t){t.memoizedState!==null&&At(Cf,t);var e=Kn.current,a=QM(e,t.type);e!==a&&(At(tu,t),At(Kn,a))}function Lf(t){tu.current===t&&(oa(Kn),oa(tu)),Cf.current===t&&(oa(Cf),du._currentValue=Ks)}var Wp,av;function Ws(t){if(Wp===void 0)try{throw Error()}catch(a){var e=a.stack.trim().match(/\n( *(at )?)/);Wp=e&&e[1]||"",av=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Wp+t+av}var Xp=!1;function Yp(t,e){if(!t||Xp)return"";Xp=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var n={DetermineComponentFrameRoot:function(){try{if(e){var f=function(){throw Error()};if(Object.defineProperty(f.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(f,[])}catch(p){var d=p}Reflect.construct(t,[],f)}else{try{f.call()}catch(p){d=p}t.call(f.prototype)}}else{try{throw Error()}catch(p){d=p}(f=t())&&typeof f.catch=="function"&&f.catch(function(){})}}catch(p){if(p&&d&&typeof p.stack=="string")return[p.stack,d.stack]}return[null,null]}};n.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var i=Object.getOwnPropertyDescriptor(n.DetermineComponentFrameRoot,"name");i&&i.configurable&&Object.defineProperty(n.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var s=n.DetermineComponentFrameRoot(),r=s[0],o=s[1];if(r&&o){var l=r.split(`
`),u=o.split(`
`);for(i=n=0;n<l.length&&!l[n].includes("DetermineComponentFrameRoot");)n++;for(;i<u.length&&!u[i].includes("DetermineComponentFrameRoot");)i++;if(n===l.length||i===u.length)for(n=l.length-1,i=u.length-1;1<=n&&0<=i&&l[n]!==u[i];)i--;for(;1<=n&&0<=i;n--,i--)if(l[n]!==u[i]){if(n!==1||i!==1)do if(n--,i--,0>i||l[n]!==u[i]){var c=`
`+l[n].replace(" at new "," at ");return t.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",t.displayName)),c}while(1<=n&&0<=i);break}}}finally{Xp=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?Ws(a):""}function KL(t,e){switch(t.tag){case 26:case 27:case 5:return Ws(t.type);case 16:return Ws("Lazy");case 13:return t.child!==e&&e!==null?Ws("Suspense Fallback"):Ws("Suspense");case 19:return Ws("SuspenseList");case 0:case 15:return Yp(t.type,!1);case 11:return Yp(t.type.render,!1);case 1:return Yp(t.type,!0);case 31:return Ws("Activity");default:return""}}function nv(t){try{var e="",a=null;do e+=KL(t,a),a=t,t=t.return;while(t);return e}catch(n){return`
Error generating stack: `+n.message+`
`+n.stack}}var Rm=Object.prototype.hasOwnProperty,_g=jt.unstable_scheduleCallback,Zp=jt.unstable_cancelCallback,JL=jt.unstable_shouldYield,QL=jt.unstable_requestPaint,$a=jt.unstable_now,jL=jt.unstable_getCurrentPriorityLevel,DS=jt.unstable_ImmediatePriority,PS=jt.unstable_UserBlockingPriority,Af=jt.unstable_NormalPriority,$L=jt.unstable_LowPriority,US=jt.unstable_IdlePriority,eA=jt.log,tA=jt.unstable_setDisableYieldValue,gu=null,en=null;function ss(t){if(typeof eA=="function"&&tA(t),en&&typeof en.setStrictMode=="function")try{en.setStrictMode(gu,t)}catch{}}var tn=Math.clz32?Math.clz32:iA,aA=Math.log,nA=Math.LN2;function iA(t){return t>>>=0,t===0?32:31-(aA(t)/nA|0)|0}var Wc=256,Xc=262144,Yc=4194304;function Xs(t){var e=t&42;if(e!==0)return e;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function $f(t,e,a){var n=t.pendingLanes;if(n===0)return 0;var i=0,s=t.suspendedLanes,r=t.pingedLanes;t=t.warmLanes;var o=n&134217727;return o!==0?(n=o&~s,n!==0?i=Xs(n):(r&=o,r!==0?i=Xs(r):a||(a=o&~t,a!==0&&(i=Xs(a))))):(o=n&~s,o!==0?i=Xs(o):r!==0?i=Xs(r):a||(a=n&~t,a!==0&&(i=Xs(a)))),i===0?0:e!==0&&e!==i&&!(e&s)&&(s=i&-i,a=e&-e,s>=a||s===32&&(a&4194048)!==0)?e:i}function xu(t,e){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&e)===0}function sA(t,e){switch(t){case 1:case 2:case 4:case 8:case 64:return e+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function BS(){var t=Yc;return Yc<<=1,!(Yc&62914560)&&(Yc=4194304),t}function Kp(t){for(var e=[],a=0;31>a;a++)e.push(t);return e}function yu(t,e){t.pendingLanes|=e,e!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function rA(t,e,a,n,i,s){var r=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var o=t.entanglements,l=t.expirationTimes,u=t.hiddenUpdates;for(a=r&~a;0<a;){var c=31-tn(a),f=1<<c;o[c]=0,l[c]=-1;var d=u[c];if(d!==null)for(u[c]=null,c=0;c<d.length;c++){var p=d[c];p!==null&&(p.lane&=-536870913)}a&=~f}n!==0&&NS(t,n,0),s!==0&&i===0&&t.tag!==0&&(t.suspendedLanes|=s&~(r&~e))}function NS(t,e,a){t.pendingLanes|=e,t.suspendedLanes&=~e;var n=31-tn(e);t.entangledLanes|=e,t.entanglements[n]=t.entanglements[n]|1073741824|a&261930}function OS(t,e){var a=t.entangledLanes|=e;for(t=t.entanglements;a;){var n=31-tn(a),i=1<<n;i&e|t[n]&e&&(t[n]|=e),a&=~i}}function FS(t,e){var a=e&-e;return a=a&42?1:Mg(a),a&(t.suspendedLanes|e)?0:a}function Mg(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function bg(t){return t&=-t,2<t?8<t?t&134217727?32:268435456:8:2}function zS(){var t=ct.p;return t!==0?t:(t=window.event,t===void 0?32:lb(t.type))}function iv(t,e){var a=ct.p;try{return ct.p=t,e()}finally{ct.p=a}}var bs=Math.random().toString(36).slice(2),da="__reactFiber$"+bs,za="__reactProps$"+bs,Co="__reactContainer$"+bs,Dm="__reactEvents$"+bs,oA="__reactListeners$"+bs,lA="__reactHandles$"+bs,sv="__reactResources$"+bs,vu="__reactMarker$"+bs;function Cg(t){delete t[da],delete t[za],delete t[Dm],delete t[oA],delete t[lA]}function Kr(t){var e=t[da];if(e)return e;for(var a=t.parentNode;a;){if(e=a[Co]||a[da]){if(a=e.alternate,e.child!==null||a!==null&&a.child!==null)for(t=hS(t);t!==null;){if(a=t[da])return a;t=hS(t)}return e}t=a,a=t.parentNode}return null}function To(t){if(t=t[da]||t[Co]){var e=t.tag;if(e===5||e===6||e===13||e===31||e===26||e===27||e===3)return t}return null}function zl(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t.stateNode;throw Error(J(33))}function so(t){var e=t[sv];return e||(e=t[sv]={hoistableStyles:new Map,hoistableScripts:new Map}),e}function ra(t){t[vu]=!0}var kS=new Set,HS={};function sr(t,e){po(t,e),po(t+"Capture",e)}function po(t,e){for(HS[t]=e,t=0;t<e.length;t++)kS.add(e[t])}var uA=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),rv={},ov={};function cA(t){return Rm.call(ov,t)?!0:Rm.call(rv,t)?!1:uA.test(t)?ov[t]=!0:(rv[t]=!0,!1)}function uf(t,e,a){if(cA(e))if(a===null)t.removeAttribute(e);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(e);return;case"boolean":var n=e.toLowerCase().slice(0,5);if(n!=="data-"&&n!=="aria-"){t.removeAttribute(e);return}}t.setAttribute(e,""+a)}}function Zc(t,e,a){if(a===null)t.removeAttribute(e);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(e);return}t.setAttribute(e,""+a)}}function fi(t,e,a,n){if(n===null)t.removeAttribute(a);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(e,a,""+n)}}function mn(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function VS(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function fA(t,e,a){var n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e);if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(r){a=""+r,s.call(this,r)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return a},setValue:function(r){a=""+r},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Pm(t){if(!t._valueTracker){var e=VS(t)?"checked":"value";t._valueTracker=fA(t,e,""+t[e])}}function GS(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var a=e.getValue(),n="";return t&&(n=VS(t)?t.checked?"true":"false":t.value),t=n,t!==a?(e.setValue(t),!0):!1}function Ef(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var dA=/[\n"\\]/g;function yn(t){return t.replace(dA,function(e){return"\\"+e.charCodeAt(0).toString(16)+" "})}function Um(t,e,a,n,i,s,r,o){t.name="",r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?t.type=r:t.removeAttribute("type"),e!=null?r==="number"?(e===0&&t.value===""||t.value!=e)&&(t.value=""+mn(e)):t.value!==""+mn(e)&&(t.value=""+mn(e)):r!=="submit"&&r!=="reset"||t.removeAttribute("value"),e!=null?Bm(t,r,mn(e)):a!=null?Bm(t,r,mn(a)):n!=null&&t.removeAttribute("value"),i==null&&s!=null&&(t.defaultChecked=!!s),i!=null&&(t.checked=i&&typeof i!="function"&&typeof i!="symbol"),o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"?t.name=""+mn(o):t.removeAttribute("name")}function qS(t,e,a,n,i,s,r,o){if(s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"&&(t.type=s),e!=null||a!=null){if(!(s!=="submit"&&s!=="reset"||e!=null)){Pm(t);return}a=a!=null?""+mn(a):"",e=e!=null?""+mn(e):a,o||e===t.value||(t.value=e),t.defaultValue=e}n=n??i,n=typeof n!="function"&&typeof n!="symbol"&&!!n,t.checked=o?t.checked:!!n,t.defaultChecked=!!n,r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"&&(t.name=r),Pm(t)}function Bm(t,e,a){e==="number"&&Ef(t.ownerDocument)===t||t.defaultValue===""+a||(t.defaultValue=""+a)}function ro(t,e,a,n){if(t=t.options,e){e={};for(var i=0;i<a.length;i++)e["$"+a[i]]=!0;for(a=0;a<t.length;a++)i=e.hasOwnProperty("$"+t[a].value),t[a].selected!==i&&(t[a].selected=i),i&&n&&(t[a].defaultSelected=!0)}else{for(a=""+mn(a),e=null,i=0;i<t.length;i++){if(t[i].value===a){t[i].selected=!0,n&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function WS(t,e,a){if(e!=null&&(e=""+mn(e),e!==t.value&&(t.value=e),a==null)){t.defaultValue!==e&&(t.defaultValue=e);return}t.defaultValue=a!=null?""+mn(a):""}function XS(t,e,a,n){if(e==null){if(n!=null){if(a!=null)throw Error(J(92));if(Fl(n)){if(1<n.length)throw Error(J(93));n=n[0]}a=n}a==null&&(a=""),e=a}a=mn(e),t.defaultValue=a,n=t.textContent,n===a&&n!==""&&n!==null&&(t.value=n),Pm(t)}function mo(t,e){if(e){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=e;return}}t.textContent=e}var hA=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function lv(t,e,a){var n=e.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?n?t.setProperty(e,""):e==="float"?t.cssFloat="":t[e]="":n?t.setProperty(e,a):typeof a!="number"||a===0||hA.has(e)?e==="float"?t.cssFloat=a:t[e]=(""+a).trim():t[e]=a+"px"}function YS(t,e,a){if(e!=null&&typeof e!="object")throw Error(J(62));if(t=t.style,a!=null){for(var n in a)!a.hasOwnProperty(n)||e!=null&&e.hasOwnProperty(n)||(n.indexOf("--")===0?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="");for(var i in e)n=e[i],e.hasOwnProperty(i)&&a[i]!==n&&lv(t,i,n)}else for(var s in e)e.hasOwnProperty(s)&&lv(t,s,e[s])}function Tg(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var pA=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),mA=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function cf(t){return mA.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function vi(){}var Nm=null;function Lg(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Jr=null,oo=null;function uv(t){var e=To(t);if(e&&(t=e.stateNode)){var a=t[za]||null;e:switch(t=e.stateNode,e.type){case"input":if(Um(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),e=a.name,a.type==="radio"&&e!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+yn(""+e)+'"][type="radio"]'),e=0;e<a.length;e++){var n=a[e];if(n!==t&&n.form===t.form){var i=n[za]||null;if(!i)throw Error(J(90));Um(n,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(e=0;e<a.length;e++)n=a[e],n.form===t.form&&GS(n)}break e;case"textarea":WS(t,a.value,a.defaultValue);break e;case"select":e=a.value,e!=null&&ro(t,!!a.multiple,e,!1)}}}var Jp=!1;function ZS(t,e,a){if(Jp)return t(e,a);Jp=!0;try{var n=t(e);return n}finally{if(Jp=!1,(Jr!==null||oo!==null)&&(fd(),Jr&&(e=Jr,t=oo,oo=Jr=null,uv(e),t)))for(e=0;e<t.length;e++)uv(t[e])}}function au(t,e){var a=t.stateNode;if(a===null)return null;var n=a[za]||null;if(n===null)return null;a=n[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(n=!n.disabled)||(t=t.type,n=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!n;break e;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(J(231,e,typeof a));return a}var Ci=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Om=!1;if(Ci)try{Vr={},Object.defineProperty(Vr,"passive",{get:function(){Om=!0}}),window.addEventListener("test",Vr,Vr),window.removeEventListener("test",Vr,Vr)}catch{Om=!1}var Vr,rs=null,Ag=null,ff=null;function KS(){if(ff)return ff;var t,e=Ag,a=e.length,n,i="value"in rs?rs.value:rs.textContent,s=i.length;for(t=0;t<a&&e[t]===i[t];t++);var r=a-t;for(n=1;n<=r&&e[a-n]===i[s-n];n++);return ff=i.slice(t,1<n?1-n:void 0)}function df(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Kc(){return!0}function cv(){return!1}function ka(t){function e(a,n,i,s,r){this._reactName=a,this._targetInst=i,this.type=n,this.nativeEvent=s,this.target=r,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(a=t[o],this[o]=a?a(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Kc:cv,this.isPropagationStopped=cv,this}return Pt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Kc)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Kc)},persist:function(){},isPersistent:Kc}),e}var rr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ed=ka(rr),Su=Pt({},rr,{view:0,detail:0}),gA=ka(Su),Qp,jp,Rl,td=Pt({},Su,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Eg,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Rl&&(Rl&&t.type==="mousemove"?(Qp=t.screenX-Rl.screenX,jp=t.screenY-Rl.screenY):jp=Qp=0,Rl=t),Qp)},movementY:function(t){return"movementY"in t?t.movementY:jp}}),fv=ka(td),xA=Pt({},td,{dataTransfer:0}),yA=ka(xA),vA=Pt({},Su,{relatedTarget:0}),$p=ka(vA),SA=Pt({},rr,{animationName:0,elapsedTime:0,pseudoElement:0}),_A=ka(SA),MA=Pt({},rr,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),bA=ka(MA),CA=Pt({},rr,{data:0}),dv=ka(CA),TA={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},LA={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},AA={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function EA(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=AA[t])?!!e[t]:!1}function Eg(){return EA}var wA=Pt({},Su,{key:function(t){if(t.key){var e=TA[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=df(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?LA[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Eg,charCode:function(t){return t.type==="keypress"?df(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?df(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),IA=ka(wA),RA=Pt({},td,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),hv=ka(RA),DA=Pt({},Su,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Eg}),PA=ka(DA),UA=Pt({},rr,{propertyName:0,elapsedTime:0,pseudoElement:0}),BA=ka(UA),NA=Pt({},td,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),OA=ka(NA),FA=Pt({},rr,{newState:0,oldState:0}),zA=ka(FA),kA=[9,13,27,32],wg=Ci&&"CompositionEvent"in window,Vl=null;Ci&&"documentMode"in document&&(Vl=document.documentMode);var HA=Ci&&"TextEvent"in window&&!Vl,JS=Ci&&(!wg||Vl&&8<Vl&&11>=Vl),pv=" ",mv=!1;function QS(t,e){switch(t){case"keyup":return kA.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function jS(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Qr=!1;function VA(t,e){switch(t){case"compositionend":return jS(e);case"keypress":return e.which!==32?null:(mv=!0,pv);case"textInput":return t=e.data,t===pv&&mv?null:t;default:return null}}function GA(t,e){if(Qr)return t==="compositionend"||!wg&&QS(t,e)?(t=KS(),ff=Ag=rs=null,Qr=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return JS&&e.locale!=="ko"?null:e.data;default:return null}}var qA={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function gv(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!qA[t.type]:e==="textarea"}function $S(t,e,a,n){Jr?oo?oo.push(n):oo=[n]:Jr=n,e=Xf(e,"onChange"),0<e.length&&(a=new ed("onChange","change",null,a,n),t.push({event:a,listeners:e}))}var Gl=null,nu=null;function WA(t){ZM(t,0)}function ad(t){var e=zl(t);if(GS(e))return t}function xv(t,e){if(t==="change")return e}var e_=!1;Ci&&(Ci?(Qc="oninput"in document,Qc||(em=document.createElement("div"),em.setAttribute("oninput","return;"),Qc=typeof em.oninput=="function"),Jc=Qc):Jc=!1,e_=Jc&&(!document.documentMode||9<document.documentMode));var Jc,Qc,em;function yv(){Gl&&(Gl.detachEvent("onpropertychange",t_),nu=Gl=null)}function t_(t){if(t.propertyName==="value"&&ad(nu)){var e=[];$S(e,nu,t,Lg(t)),ZS(WA,e)}}function XA(t,e,a){t==="focusin"?(yv(),Gl=e,nu=a,Gl.attachEvent("onpropertychange",t_)):t==="focusout"&&yv()}function YA(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return ad(nu)}function ZA(t,e){if(t==="click")return ad(e)}function KA(t,e){if(t==="input"||t==="change")return ad(e)}function JA(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var nn=typeof Object.is=="function"?Object.is:JA;function iu(t,e){if(nn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var a=Object.keys(t),n=Object.keys(e);if(a.length!==n.length)return!1;for(n=0;n<a.length;n++){var i=a[n];if(!Rm.call(e,i)||!nn(t[i],e[i]))return!1}return!0}function vv(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Sv(t,e){var a=vv(t);t=0;for(var n;a;){if(a.nodeType===3){if(n=t+a.textContent.length,t<=e&&n>=e)return{node:a,offset:e-t};t=n}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=vv(a)}}function a_(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?a_(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function n_(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var e=Ef(t.document);e instanceof t.HTMLIFrameElement;){try{var a=typeof e.contentWindow.location.href=="string"}catch{a=!1}if(a)t=e.contentWindow;else break;e=Ef(t.document)}return e}function Ig(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}var QA=Ci&&"documentMode"in document&&11>=document.documentMode,jr=null,Fm=null,ql=null,zm=!1;function _v(t,e,a){var n=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;zm||jr==null||jr!==Ef(n)||(n=jr,"selectionStart"in n&&Ig(n)?n={start:n.selectionStart,end:n.selectionEnd}:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}),ql&&iu(ql,n)||(ql=n,n=Xf(Fm,"onSelect"),0<n.length&&(e=new ed("onSelect","select",null,e,a),t.push({event:e,listeners:n}),e.target=jr)))}function qs(t,e){var a={};return a[t.toLowerCase()]=e.toLowerCase(),a["Webkit"+t]="webkit"+e,a["Moz"+t]="moz"+e,a}var $r={animationend:qs("Animation","AnimationEnd"),animationiteration:qs("Animation","AnimationIteration"),animationstart:qs("Animation","AnimationStart"),transitionrun:qs("Transition","TransitionRun"),transitionstart:qs("Transition","TransitionStart"),transitioncancel:qs("Transition","TransitionCancel"),transitionend:qs("Transition","TransitionEnd")},tm={},i_={};Ci&&(i_=document.createElement("div").style,"AnimationEvent"in window||(delete $r.animationend.animation,delete $r.animationiteration.animation,delete $r.animationstart.animation),"TransitionEvent"in window||delete $r.transitionend.transition);function or(t){if(tm[t])return tm[t];if(!$r[t])return t;var e=$r[t],a;for(a in e)if(e.hasOwnProperty(a)&&a in i_)return tm[t]=e[a];return t}var s_=or("animationend"),r_=or("animationiteration"),o_=or("animationstart"),jA=or("transitionrun"),$A=or("transitionstart"),e1=or("transitioncancel"),l_=or("transitionend"),u_=new Map,km="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");km.push("scrollEnd");function Rn(t,e){u_.set(t,e),sr(e,[t])}var wf=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},pn=[],eo=0,Rg=0;function nd(){for(var t=eo,e=Rg=eo=0;e<t;){var a=pn[e];pn[e++]=null;var n=pn[e];pn[e++]=null;var i=pn[e];pn[e++]=null;var s=pn[e];if(pn[e++]=null,n!==null&&i!==null){var r=n.pending;r===null?i.next=i:(i.next=r.next,r.next=i),n.pending=i}s!==0&&c_(a,i,s)}}function id(t,e,a,n){pn[eo++]=t,pn[eo++]=e,pn[eo++]=a,pn[eo++]=n,Rg|=n,t.lanes|=n,t=t.alternate,t!==null&&(t.lanes|=n)}function Dg(t,e,a,n){return id(t,e,a,n),If(t)}function lr(t,e){return id(t,null,null,e),If(t)}function c_(t,e,a){t.lanes|=a;var n=t.alternate;n!==null&&(n.lanes|=a);for(var i=!1,s=t.return;s!==null;)s.childLanes|=a,n=s.alternate,n!==null&&(n.childLanes|=a),s.tag===22&&(t=s.stateNode,t===null||t._visibility&1||(i=!0)),t=s,s=s.return;return t.tag===3?(s=t.stateNode,i&&e!==null&&(i=31-tn(a),t=s.hiddenUpdates,n=t[i],n===null?t[i]=[e]:n.push(e),e.lane=a|536870912),s):null}function If(t){if(50<$l)throw $l=0,og=null,Error(J(185));for(var e=t.return;e!==null;)t=e,e=t.return;return t.tag===3?t.stateNode:null}var to={};function t1(t,e,a,n){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=n,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Qa(t,e,a,n){return new t1(t,e,a,n)}function Pg(t){return t=t.prototype,!(!t||!t.isReactComponent)}function _i(t,e){var a=t.alternate;return a===null?(a=Qa(t.tag,e,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=e,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&65011712,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,e=t.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function f_(t,e){t.flags&=65011714;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=e,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,e=a.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t}function hf(t,e,a,n,i,s){var r=0;if(n=t,typeof t=="function")Pg(t)&&(r=1);else if(typeof t=="string")r=iE(t,a,Kn.current)?26:t==="html"||t==="head"||t==="body"?27:5;else e:switch(t){case Am:return t=Qa(31,a,e,i),t.elementType=Am,t.lanes=s,t;case Yr:return Js(a.children,i,s,e);case IS:r=8,i|=24;break;case Cm:return t=Qa(12,a,e,i|2),t.elementType=Cm,t.lanes=s,t;case Tm:return t=Qa(13,a,e,i),t.elementType=Tm,t.lanes=s,t;case Lm:return t=Qa(19,a,e,i),t.elementType=Lm,t.lanes=s,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case yi:r=10;break e;case RS:r=9;break e;case vg:r=11;break e;case Sg:r=14;break e;case $i:r=16,n=null;break e}r=29,a=Error(J(130,t===null?"null":typeof t,"")),n=null}return e=Qa(r,a,e,i),e.elementType=t,e.type=n,e.lanes=s,e}function Js(t,e,a,n){return t=Qa(7,t,n,e),t.lanes=a,t}function am(t,e,a){return t=Qa(6,t,null,e),t.lanes=a,t}function d_(t){var e=Qa(18,null,null,0);return e.stateNode=t,e}function nm(t,e,a){return e=Qa(4,t.children!==null?t.children:[],t.key,e),e.lanes=a,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}var Mv=new WeakMap;function vn(t,e){if(typeof t=="object"&&t!==null){var a=Mv.get(t);return a!==void 0?a:(e={value:t,source:e,stack:nv(e)},Mv.set(t,e),e)}return{value:t,source:e,stack:nv(e)}}var ao=[],no=0,Rf=null,su=0,gn=[],xn=0,vs=null,Xn=1,Yn="";function gi(t,e){ao[no++]=su,ao[no++]=Rf,Rf=t,su=e}function h_(t,e,a){gn[xn++]=Xn,gn[xn++]=Yn,gn[xn++]=vs,vs=t;var n=Xn;t=Yn;var i=32-tn(n)-1;n&=~(1<<i),a+=1;var s=32-tn(e)+i;if(30<s){var r=i-i%5;s=(n&(1<<r)-1).toString(32),n>>=r,i-=r,Xn=1<<32-tn(e)+i|a<<i|n,Yn=s+t}else Xn=1<<s|a<<i|n,Yn=t}function Ug(t){t.return!==null&&(gi(t,1),h_(t,1,0))}function Bg(t){for(;t===Rf;)Rf=ao[--no],ao[no]=null,su=ao[--no],ao[no]=null;for(;t===vs;)vs=gn[--xn],gn[xn]=null,Yn=gn[--xn],gn[xn]=null,Xn=gn[--xn],gn[xn]=null}function p_(t,e){gn[xn++]=Xn,gn[xn++]=Yn,gn[xn++]=vs,Xn=e.id,Yn=e.overflow,vs=t}var ha=null,Dt=null,st=!1,fs=null,Sn=!1,Hm=Error(J(519));function Ss(t){var e=Error(J(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw ru(vn(e,t)),Hm}function bv(t){var e=t.stateNode,a=t.type,n=t.memoizedProps;switch(e[da]=t,e[za]=n,a){case"dialog":je("cancel",e),je("close",e);break;case"iframe":case"object":case"embed":je("load",e);break;case"video":case"audio":for(a=0;a<cu.length;a++)je(cu[a],e);break;case"source":je("error",e);break;case"img":case"image":case"link":je("error",e),je("load",e);break;case"details":je("toggle",e);break;case"input":je("invalid",e),qS(e,n.value,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name,!0);break;case"select":je("invalid",e);break;case"textarea":je("invalid",e),XS(e,n.value,n.defaultValue,n.children)}a=n.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||e.textContent===""+a||n.suppressHydrationWarning===!0||JM(e.textContent,a)?(n.popover!=null&&(je("beforetoggle",e),je("toggle",e)),n.onScroll!=null&&je("scroll",e),n.onScrollEnd!=null&&je("scrollend",e),n.onClick!=null&&(e.onclick=vi),e=!0):e=!1,e||Ss(t,!0)}function Cv(t){for(ha=t.return;ha;)switch(ha.tag){case 5:case 31:case 13:Sn=!1;return;case 27:case 3:Sn=!0;return;default:ha=ha.return}}function Gr(t){if(t!==ha)return!1;if(!st)return Cv(t),st=!0,!1;var e=t.tag,a;if((a=e!==3&&e!==27)&&((a=e===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||dg(t.type,t.memoizedProps)),a=!a),a&&Dt&&Ss(t),Cv(t),e===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(J(317));Dt=dS(t)}else if(e===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(J(317));Dt=dS(t)}else e===27?(e=Dt,Cs(t.type)?(t=gg,gg=null,Dt=t):Dt=e):Dt=ha?Mn(t.stateNode.nextSibling):null;return!0}function er(){Dt=ha=null,st=!1}function im(){var t=fs;return t!==null&&(Oa===null?Oa=t:Oa.push.apply(Oa,t),fs=null),t}function ru(t){fs===null?fs=[t]:fs.push(t)}var Vm=Jn(null),ur=null,Si=null;function ts(t,e,a){At(Vm,e._currentValue),e._currentValue=a}function Mi(t){t._currentValue=Vm.current,oa(Vm)}function Gm(t,e,a){for(;t!==null;){var n=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,n!==null&&(n.childLanes|=e)):n!==null&&(n.childLanes&e)!==e&&(n.childLanes|=e),t===a)break;t=t.return}}function qm(t,e,a,n){var i=t.child;for(i!==null&&(i.return=t);i!==null;){var s=i.dependencies;if(s!==null){var r=i.child;s=s.firstContext;e:for(;s!==null;){var o=s;s=i;for(var l=0;l<e.length;l++)if(o.context===e[l]){s.lanes|=a,o=s.alternate,o!==null&&(o.lanes|=a),Gm(s.return,a,t),n||(r=null);break e}s=o.next}}else if(i.tag===18){if(r=i.return,r===null)throw Error(J(341));r.lanes|=a,s=r.alternate,s!==null&&(s.lanes|=a),Gm(r,a,t),r=null}else r=i.child;if(r!==null)r.return=i;else for(r=i;r!==null;){if(r===t){r=null;break}if(i=r.sibling,i!==null){i.return=r.return,r=i;break}r=r.return}i=r}}function Lo(t,e,a,n){t=null;for(var i=e,s=!1;i!==null;){if(!s){if(i.flags&524288)s=!0;else if(i.flags&262144)break}if(i.tag===10){var r=i.alternate;if(r===null)throw Error(J(387));if(r=r.memoizedProps,r!==null){var o=i.type;nn(i.pendingProps.value,r.value)||(t!==null?t.push(o):t=[o])}}else if(i===Cf.current){if(r=i.alternate,r===null)throw Error(J(387));r.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(t!==null?t.push(du):t=[du])}i=i.return}t!==null&&qm(e,t,a,n),e.flags|=262144}function Df(t){for(t=t.firstContext;t!==null;){if(!nn(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function tr(t){ur=t,Si=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function pa(t){return m_(ur,t)}function jc(t,e){return ur===null&&tr(t),m_(t,e)}function m_(t,e){var a=e._currentValue;if(e={context:e,memoizedValue:a,next:null},Si===null){if(t===null)throw Error(J(308));Si=e,t.dependencies={lanes:0,firstContext:e},t.flags|=524288}else Si=Si.next=e;return a}var a1=typeof AbortController<"u"?AbortController:function(){var t=[],e=this.signal={aborted:!1,addEventListener:function(a,n){t.push(n)}};this.abort=function(){e.aborted=!0,t.forEach(function(a){return a()})}},n1=jt.unstable_scheduleCallback,i1=jt.unstable_NormalPriority,Wt={$$typeof:yi,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Ng(){return{controller:new a1,data:new Map,refCount:0}}function _u(t){t.refCount--,t.refCount===0&&n1(i1,function(){t.controller.abort()})}var Wl=null,Wm=0,go=0,lo=null;function s1(t,e){if(Wl===null){var a=Wl=[];Wm=0,go=ox(),lo={status:"pending",value:void 0,then:function(n){a.push(n)}}}return Wm++,e.then(Tv,Tv),e}function Tv(){if(--Wm===0&&Wl!==null){lo!==null&&(lo.status="fulfilled");var t=Wl;Wl=null,go=0,lo=null;for(var e=0;e<t.length;e++)(0,t[e])()}}function r1(t,e){var a=[],n={status:"pending",value:null,reason:null,then:function(i){a.push(i)}};return t.then(function(){n.status="fulfilled",n.value=e;for(var i=0;i<a.length;i++)(0,a[i])(e)},function(i){for(n.status="rejected",n.reason=i,i=0;i<a.length;i++)(0,a[i])(void 0)}),n}var Lv=Fe.S;Fe.S=function(t,e){wM=$a(),typeof e=="object"&&e!==null&&typeof e.then=="function"&&s1(t,e),Lv!==null&&Lv(t,e)};var Qs=Jn(null);function Og(){var t=Qs.current;return t!==null?t:Mt.pooledCache}function pf(t,e){e===null?At(Qs,Qs.current):At(Qs,e.pool)}function g_(){var t=Og();return t===null?null:{parent:Wt._currentValue,pool:t}}var Ao=Error(J(460)),Fg=Error(J(474)),sd=Error(J(542)),Pf={then:function(){}};function Av(t){return t=t.status,t==="fulfilled"||t==="rejected"}function x_(t,e,a){switch(a=t[a],a===void 0?t.push(e):a!==e&&(e.then(vi,vi),e=a),e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,wv(t),t;default:if(typeof e.status=="string")e.then(vi,vi);else{if(t=Mt,t!==null&&100<t.shellSuspendCounter)throw Error(J(482));t=e,t.status="pending",t.then(function(n){if(e.status==="pending"){var i=e;i.status="fulfilled",i.value=n}},function(n){if(e.status==="pending"){var i=e;i.status="rejected",i.reason=n}})}switch(e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,wv(t),t}throw js=e,Ao}}function Ys(t){try{var e=t._init;return e(t._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(js=a,Ao):a}}var js=null;function Ev(){if(js===null)throw Error(J(459));var t=js;return js=null,t}function wv(t){if(t===Ao||t===sd)throw Error(J(483))}var uo=null,ou=0;function $c(t){var e=ou;return ou+=1,uo===null&&(uo=[]),x_(uo,t,e)}function Dl(t,e){e=e.props.ref,t.ref=e!==void 0?e:null}function ef(t,e){throw e.$$typeof===XL?Error(J(525)):(t=Object.prototype.toString.call(e),Error(J(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)))}function y_(t){function e(h,x){if(t){var S=h.deletions;S===null?(h.deletions=[x],h.flags|=16):S.push(x)}}function a(h,x){if(!t)return null;for(;x!==null;)e(h,x),x=x.sibling;return null}function n(h){for(var x=new Map;h!==null;)h.key!==null?x.set(h.key,h):x.set(h.index,h),h=h.sibling;return x}function i(h,x){return h=_i(h,x),h.index=0,h.sibling=null,h}function s(h,x,S){return h.index=S,t?(S=h.alternate,S!==null?(S=S.index,S<x?(h.flags|=67108866,x):S):(h.flags|=67108866,x)):(h.flags|=1048576,x)}function r(h){return t&&h.alternate===null&&(h.flags|=67108866),h}function o(h,x,S,v){return x===null||x.tag!==6?(x=am(S,h.mode,v),x.return=h,x):(x=i(x,S),x.return=h,x)}function l(h,x,S,v){var T=S.type;return T===Yr?c(h,x,S.props.children,v,S.key):x!==null&&(x.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===$i&&Ys(T)===x.type)?(x=i(x,S.props),Dl(x,S),x.return=h,x):(x=hf(S.type,S.key,S.props,null,h.mode,v),Dl(x,S),x.return=h,x)}function u(h,x,S,v){return x===null||x.tag!==4||x.stateNode.containerInfo!==S.containerInfo||x.stateNode.implementation!==S.implementation?(x=nm(S,h.mode,v),x.return=h,x):(x=i(x,S.children||[]),x.return=h,x)}function c(h,x,S,v,T){return x===null||x.tag!==7?(x=Js(S,h.mode,v,T),x.return=h,x):(x=i(x,S),x.return=h,x)}function f(h,x,S){if(typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint")return x=am(""+x,h.mode,S),x.return=h,x;if(typeof x=="object"&&x!==null){switch(x.$$typeof){case qc:return S=hf(x.type,x.key,x.props,null,h.mode,S),Dl(S,x),S.return=h,S;case Ol:return x=nm(x,h.mode,S),x.return=h,x;case $i:return x=Ys(x),f(h,x,S)}if(Fl(x)||Il(x))return x=Js(x,h.mode,S,null),x.return=h,x;if(typeof x.then=="function")return f(h,$c(x),S);if(x.$$typeof===yi)return f(h,jc(h,x),S);ef(h,x)}return null}function d(h,x,S,v){var T=x!==null?x.key:null;if(typeof S=="string"&&S!==""||typeof S=="number"||typeof S=="bigint")return T!==null?null:o(h,x,""+S,v);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case qc:return S.key===T?l(h,x,S,v):null;case Ol:return S.key===T?u(h,x,S,v):null;case $i:return S=Ys(S),d(h,x,S,v)}if(Fl(S)||Il(S))return T!==null?null:c(h,x,S,v,null);if(typeof S.then=="function")return d(h,x,$c(S),v);if(S.$$typeof===yi)return d(h,x,jc(h,S),v);ef(h,S)}return null}function p(h,x,S,v,T){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return h=h.get(S)||null,o(x,h,""+v,T);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case qc:return h=h.get(v.key===null?S:v.key)||null,l(x,h,v,T);case Ol:return h=h.get(v.key===null?S:v.key)||null,u(x,h,v,T);case $i:return v=Ys(v),p(h,x,S,v,T)}if(Fl(v)||Il(v))return h=h.get(S)||null,c(x,h,v,T,null);if(typeof v.then=="function")return p(h,x,S,$c(v),T);if(v.$$typeof===yi)return p(h,x,S,jc(x,v),T);ef(x,v)}return null}function g(h,x,S,v){for(var T=null,E=null,A=x,R=x=0,M=null;A!==null&&R<S.length;R++){A.index>R?(M=A,A=null):M=A.sibling;var b=d(h,A,S[R],v);if(b===null){A===null&&(A=M);break}t&&A&&b.alternate===null&&e(h,A),x=s(b,x,R),E===null?T=b:E.sibling=b,E=b,A=M}if(R===S.length)return a(h,A),st&&gi(h,R),T;if(A===null){for(;R<S.length;R++)A=f(h,S[R],v),A!==null&&(x=s(A,x,R),E===null?T=A:E.sibling=A,E=A);return st&&gi(h,R),T}for(A=n(A);R<S.length;R++)M=p(A,h,R,S[R],v),M!==null&&(t&&M.alternate!==null&&A.delete(M.key===null?R:M.key),x=s(M,x,R),E===null?T=M:E.sibling=M,E=M);return t&&A.forEach(function(I){return e(h,I)}),st&&gi(h,R),T}function y(h,x,S,v){if(S==null)throw Error(J(151));for(var T=null,E=null,A=x,R=x=0,M=null,b=S.next();A!==null&&!b.done;R++,b=S.next()){A.index>R?(M=A,A=null):M=A.sibling;var I=d(h,A,b.value,v);if(I===null){A===null&&(A=M);break}t&&A&&I.alternate===null&&e(h,A),x=s(I,x,R),E===null?T=I:E.sibling=I,E=I,A=M}if(b.done)return a(h,A),st&&gi(h,R),T;if(A===null){for(;!b.done;R++,b=S.next())b=f(h,b.value,v),b!==null&&(x=s(b,x,R),E===null?T=b:E.sibling=b,E=b);return st&&gi(h,R),T}for(A=n(A);!b.done;R++,b=S.next())b=p(A,h,R,b.value,v),b!==null&&(t&&b.alternate!==null&&A.delete(b.key===null?R:b.key),x=s(b,x,R),E===null?T=b:E.sibling=b,E=b);return t&&A.forEach(function(F){return e(h,F)}),st&&gi(h,R),T}function m(h,x,S,v){if(typeof S=="object"&&S!==null&&S.type===Yr&&S.key===null&&(S=S.props.children),typeof S=="object"&&S!==null){switch(S.$$typeof){case qc:e:{for(var T=S.key;x!==null;){if(x.key===T){if(T=S.type,T===Yr){if(x.tag===7){a(h,x.sibling),v=i(x,S.props.children),v.return=h,h=v;break e}}else if(x.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===$i&&Ys(T)===x.type){a(h,x.sibling),v=i(x,S.props),Dl(v,S),v.return=h,h=v;break e}a(h,x);break}else e(h,x);x=x.sibling}S.type===Yr?(v=Js(S.props.children,h.mode,v,S.key),v.return=h,h=v):(v=hf(S.type,S.key,S.props,null,h.mode,v),Dl(v,S),v.return=h,h=v)}return r(h);case Ol:e:{for(T=S.key;x!==null;){if(x.key===T)if(x.tag===4&&x.stateNode.containerInfo===S.containerInfo&&x.stateNode.implementation===S.implementation){a(h,x.sibling),v=i(x,S.children||[]),v.return=h,h=v;break e}else{a(h,x);break}else e(h,x);x=x.sibling}v=nm(S,h.mode,v),v.return=h,h=v}return r(h);case $i:return S=Ys(S),m(h,x,S,v)}if(Fl(S))return g(h,x,S,v);if(Il(S)){if(T=Il(S),typeof T!="function")throw Error(J(150));return S=T.call(S),y(h,x,S,v)}if(typeof S.then=="function")return m(h,x,$c(S),v);if(S.$$typeof===yi)return m(h,x,jc(h,S),v);ef(h,S)}return typeof S=="string"&&S!==""||typeof S=="number"||typeof S=="bigint"?(S=""+S,x!==null&&x.tag===6?(a(h,x.sibling),v=i(x,S),v.return=h,h=v):(a(h,x),v=am(S,h.mode,v),v.return=h,h=v),r(h)):a(h,x)}return function(h,x,S,v){try{ou=0;var T=m(h,x,S,v);return uo=null,T}catch(A){if(A===Ao||A===sd)throw A;var E=Qa(29,A,null,h.mode);return E.lanes=v,E.return=h,E}finally{}}}var ar=y_(!0),v_=y_(!1),es=!1;function zg(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Xm(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function ds(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function hs(t,e,a){var n=t.updateQueue;if(n===null)return null;if(n=n.shared,ut&2){var i=n.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),n.pending=e,e=If(t),c_(t,null,a),e}return id(t,n,e,a),If(t)}function Xl(t,e,a){if(e=e.updateQueue,e!==null&&(e=e.shared,(a&4194048)!==0)){var n=e.lanes;n&=t.pendingLanes,a|=n,e.lanes=a,OS(t,a)}}function sm(t,e){var a=t.updateQueue,n=t.alternate;if(n!==null&&(n=n.updateQueue,a===n)){var i=null,s=null;if(a=a.firstBaseUpdate,a!==null){do{var r={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};s===null?i=s=r:s=s.next=r,a=a.next}while(a!==null);s===null?i=s=e:s=s.next=e}else i=s=e;a={baseState:n.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:n.shared,callbacks:n.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=e:t.next=e,a.lastBaseUpdate=e}var Ym=!1;function Yl(){if(Ym){var t=lo;if(t!==null)throw t}}function Zl(t,e,a,n){Ym=!1;var i=t.updateQueue;es=!1;var s=i.firstBaseUpdate,r=i.lastBaseUpdate,o=i.shared.pending;if(o!==null){i.shared.pending=null;var l=o,u=l.next;l.next=null,r===null?s=u:r.next=u,r=l;var c=t.alternate;c!==null&&(c=c.updateQueue,o=c.lastBaseUpdate,o!==r&&(o===null?c.firstBaseUpdate=u:o.next=u,c.lastBaseUpdate=l))}if(s!==null){var f=i.baseState;r=0,c=u=l=null,o=s;do{var d=o.lane&-536870913,p=d!==o.lane;if(p?(it&d)===d:(n&d)===d){d!==0&&d===go&&(Ym=!0),c!==null&&(c=c.next={lane:0,tag:o.tag,payload:o.payload,callback:null,next:null});e:{var g=t,y=o;d=e;var m=a;switch(y.tag){case 1:if(g=y.payload,typeof g=="function"){f=g.call(m,f,d);break e}f=g;break e;case 3:g.flags=g.flags&-65537|128;case 0:if(g=y.payload,d=typeof g=="function"?g.call(m,f,d):g,d==null)break e;f=Pt({},f,d);break e;case 2:es=!0}}d=o.callback,d!==null&&(t.flags|=64,p&&(t.flags|=8192),p=i.callbacks,p===null?i.callbacks=[d]:p.push(d))}else p={lane:d,tag:o.tag,payload:o.payload,callback:o.callback,next:null},c===null?(u=c=p,l=f):c=c.next=p,r|=d;if(o=o.next,o===null){if(o=i.shared.pending,o===null)break;p=o,o=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(!0);c===null&&(l=f),i.baseState=l,i.firstBaseUpdate=u,i.lastBaseUpdate=c,s===null&&(i.shared.lanes=0),Ms|=r,t.lanes=r,t.memoizedState=f}}function S_(t,e){if(typeof t!="function")throw Error(J(191,t));t.call(e)}function __(t,e){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)S_(a[t],e)}var xo=Jn(null),Uf=Jn(0);function Iv(t,e){t=Ei,At(Uf,t),At(xo,e),Ei=t|e.baseLanes}function Zm(){At(Uf,Ei),At(xo,xo.current)}function kg(){Ei=Uf.current,oa(xo),oa(Uf)}var sn=Jn(null),_n=null;function as(t){var e=t.alternate;At(Ht,Ht.current&1),At(sn,t),_n===null&&(e===null||xo.current!==null||e.memoizedState!==null)&&(_n=t)}function Km(t){At(Ht,Ht.current),At(sn,t),_n===null&&(_n=t)}function M_(t){t.tag===22?(At(Ht,Ht.current),At(sn,t),_n===null&&(_n=t)):ns(t)}function ns(){At(Ht,Ht.current),At(sn,sn.current)}function Ja(t){oa(sn),_n===t&&(_n=null),oa(Ht)}var Ht=Jn(0);function Bf(t){for(var e=t;e!==null;){if(e.tag===13){var a=e.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||pg(a)||mg(a)))return e}else if(e.tag===19&&(e.memoizedProps.revealOrder==="forwards"||e.memoizedProps.revealOrder==="backwards"||e.memoizedProps.revealOrder==="unstable_legacy-backwards"||e.memoizedProps.revealOrder==="together")){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Ti=0,Ge=null,St=null,Gt=null,Nf=!1,co=!1,nr=!1,Of=0,lu=0,fo=null,o1=0;function zt(){throw Error(J(321))}function Hg(t,e){if(e===null)return!1;for(var a=0;a<e.length&&a<t.length;a++)if(!nn(t[a],e[a]))return!1;return!0}function Vg(t,e,a,n,i,s){return Ti=s,Ge=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Fe.H=t===null||t.memoizedState===null?$_:$g,nr=!1,s=a(n,i),nr=!1,co&&(s=C_(e,a,n,i)),b_(t),s}function b_(t){Fe.H=uu;var e=St!==null&&St.next!==null;if(Ti=0,Gt=St=Ge=null,Nf=!1,lu=0,fo=null,e)throw Error(J(300));t===null||Xt||(t=t.dependencies,t!==null&&Df(t)&&(Xt=!0))}function C_(t,e,a,n){Ge=t;var i=0;do{if(co&&(fo=null),lu=0,co=!1,25<=i)throw Error(J(301));if(i+=1,Gt=St=null,t.updateQueue!=null){var s=t.updateQueue;s.lastEffect=null,s.events=null,s.stores=null,s.memoCache!=null&&(s.memoCache.index=0)}Fe.H=eM,s=e(a,n)}while(co);return s}function l1(){var t=Fe.H,e=t.useState()[0];return e=typeof e.then=="function"?Mu(e):e,t=t.useState()[0],(St!==null?St.memoizedState:null)!==t&&(Ge.flags|=1024),e}function Gg(){var t=Of!==0;return Of=0,t}function qg(t,e,a){e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~a}function Wg(t){if(Nf){for(t=t.memoizedState;t!==null;){var e=t.queue;e!==null&&(e.pending=null),t=t.next}Nf=!1}Ti=0,Gt=St=Ge=null,co=!1,lu=Of=0,fo=null}function Ea(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Gt===null?Ge.memoizedState=Gt=t:Gt=Gt.next=t,Gt}function Vt(){if(St===null){var t=Ge.alternate;t=t!==null?t.memoizedState:null}else t=St.next;var e=Gt===null?Ge.memoizedState:Gt.next;if(e!==null)Gt=e,St=t;else{if(t===null)throw Ge.alternate===null?Error(J(467)):Error(J(310));St=t,t={memoizedState:St.memoizedState,baseState:St.baseState,baseQueue:St.baseQueue,queue:St.queue,next:null},Gt===null?Ge.memoizedState=Gt=t:Gt=Gt.next=t}return Gt}function rd(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Mu(t){var e=lu;return lu+=1,fo===null&&(fo=[]),t=x_(fo,t,e),e=Ge,(Gt===null?e.memoizedState:Gt.next)===null&&(e=e.alternate,Fe.H=e===null||e.memoizedState===null?$_:$g),t}function od(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return Mu(t);if(t.$$typeof===yi)return pa(t)}throw Error(J(438,String(t)))}function Xg(t){var e=null,a=Ge.updateQueue;if(a!==null&&(e=a.memoCache),e==null){var n=Ge.alternate;n!==null&&(n=n.updateQueue,n!==null&&(n=n.memoCache,n!=null&&(e={data:n.data.map(function(i){return i.slice()}),index:0})))}if(e==null&&(e={data:[],index:0}),a===null&&(a=rd(),Ge.updateQueue=a),a.memoCache=e,a=e.data[e.index],a===void 0)for(a=e.data[e.index]=Array(t),n=0;n<t;n++)a[n]=YL;return e.index++,a}function Li(t,e){return typeof e=="function"?e(t):e}function mf(t){var e=Vt();return Yg(e,St,t)}function Yg(t,e,a){var n=t.queue;if(n===null)throw Error(J(311));n.lastRenderedReducer=a;var i=t.baseQueue,s=n.pending;if(s!==null){if(i!==null){var r=i.next;i.next=s.next,s.next=r}e.baseQueue=i=s,n.pending=null}if(s=t.baseState,i===null)t.memoizedState=s;else{e=i.next;var o=r=null,l=null,u=e,c=!1;do{var f=u.lane&-536870913;if(f!==u.lane?(it&f)===f:(Ti&f)===f){var d=u.revertLane;if(d===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===go&&(c=!0);else if((Ti&d)===d){u=u.next,d===go&&(c=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(o=l=f,r=s):l=l.next=f,Ge.lanes|=d,Ms|=d;f=u.action,nr&&a(s,f),s=u.hasEagerState?u.eagerState:a(s,f)}else d={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(o=l=d,r=s):l=l.next=d,Ge.lanes|=f,Ms|=f;u=u.next}while(u!==null&&u!==e);if(l===null?r=s:l.next=o,!nn(s,t.memoizedState)&&(Xt=!0,c&&(a=lo,a!==null)))throw a;t.memoizedState=s,t.baseState=r,t.baseQueue=l,n.lastRenderedState=s}return i===null&&(n.lanes=0),[t.memoizedState,n.dispatch]}function rm(t){var e=Vt(),a=e.queue;if(a===null)throw Error(J(311));a.lastRenderedReducer=t;var n=a.dispatch,i=a.pending,s=e.memoizedState;if(i!==null){a.pending=null;var r=i=i.next;do s=t(s,r.action),r=r.next;while(r!==i);nn(s,e.memoizedState)||(Xt=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),a.lastRenderedState=s}return[s,n]}function T_(t,e,a){var n=Ge,i=Vt(),s=st;if(s){if(a===void 0)throw Error(J(407));a=a()}else a=e();var r=!nn((St||i).memoizedState,a);if(r&&(i.memoizedState=a,Xt=!0),i=i.queue,Zg(E_.bind(null,n,i,t),[t]),i.getSnapshot!==e||r||Gt!==null&&Gt.memoizedState.tag&1){if(n.flags|=2048,yo(9,{destroy:void 0},A_.bind(null,n,i,a,e),null),Mt===null)throw Error(J(349));s||Ti&127||L_(n,e,a)}return a}function L_(t,e,a){t.flags|=16384,t={getSnapshot:e,value:a},e=Ge.updateQueue,e===null?(e=rd(),Ge.updateQueue=e,e.stores=[t]):(a=e.stores,a===null?e.stores=[t]:a.push(t))}function A_(t,e,a,n){e.value=a,e.getSnapshot=n,w_(e)&&I_(t)}function E_(t,e,a){return a(function(){w_(e)&&I_(t)})}function w_(t){var e=t.getSnapshot;t=t.value;try{var a=e();return!nn(t,a)}catch{return!0}}function I_(t){var e=lr(t,2);e!==null&&Fa(e,t,2)}function Jm(t){var e=Ea();if(typeof t=="function"){var a=t;if(t=a(),nr){ss(!0);try{a()}finally{ss(!1)}}}return e.memoizedState=e.baseState=t,e.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Li,lastRenderedState:t},e}function R_(t,e,a,n){return t.baseState=a,Yg(t,St,typeof n=="function"?n:Li)}function u1(t,e,a,n,i){if(ud(t))throw Error(J(485));if(t=e.action,t!==null){var s={payload:i,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(r){s.listeners.push(r)}};Fe.T!==null?a(!0):s.isTransition=!1,n(s),a=e.pending,a===null?(s.next=e.pending=s,D_(e,s)):(s.next=a.next,e.pending=a.next=s)}}function D_(t,e){var a=e.action,n=e.payload,i=t.state;if(e.isTransition){var s=Fe.T,r={};Fe.T=r;try{var o=a(i,n),l=Fe.S;l!==null&&l(r,o),Rv(t,e,o)}catch(u){Qm(t,e,u)}finally{s!==null&&r.types!==null&&(s.types=r.types),Fe.T=s}}else try{s=a(i,n),Rv(t,e,s)}catch(u){Qm(t,e,u)}}function Rv(t,e,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(n){Dv(t,e,n)},function(n){return Qm(t,e,n)}):Dv(t,e,a)}function Dv(t,e,a){e.status="fulfilled",e.value=a,P_(e),t.state=a,e=t.pending,e!==null&&(a=e.next,a===e?t.pending=null:(a=a.next,e.next=a,D_(t,a)))}function Qm(t,e,a){var n=t.pending;if(t.pending=null,n!==null){n=n.next;do e.status="rejected",e.reason=a,P_(e),e=e.next;while(e!==n)}t.action=null}function P_(t){t=t.listeners;for(var e=0;e<t.length;e++)(0,t[e])()}function U_(t,e){return e}function Pv(t,e){if(st){var a=Mt.formState;if(a!==null){e:{var n=Ge;if(st){if(Dt){t:{for(var i=Dt,s=Sn;i.nodeType!==8;){if(!s){i=null;break t}if(i=Mn(i.nextSibling),i===null){i=null;break t}}s=i.data,i=s==="F!"||s==="F"?i:null}if(i){Dt=Mn(i.nextSibling),n=i.data==="F!";break e}}Ss(n)}n=!1}n&&(e=a[0])}}return a=Ea(),a.memoizedState=a.baseState=e,n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:U_,lastRenderedState:e},a.queue=n,a=J_.bind(null,Ge,n),n.dispatch=a,n=Jm(!1),s=jg.bind(null,Ge,!1,n.queue),n=Ea(),i={state:e,dispatch:null,action:t,pending:null},n.queue=i,a=u1.bind(null,Ge,i,s,a),i.dispatch=a,n.memoizedState=t,[e,a,!1]}function Uv(t){var e=Vt();return B_(e,St,t)}function B_(t,e,a){if(e=Yg(t,e,U_)[0],t=mf(Li)[0],typeof e=="object"&&e!==null&&typeof e.then=="function")try{var n=Mu(e)}catch(r){throw r===Ao?sd:r}else n=e;e=Vt();var i=e.queue,s=i.dispatch;return a!==e.memoizedState&&(Ge.flags|=2048,yo(9,{destroy:void 0},c1.bind(null,i,a),null)),[n,s,t]}function c1(t,e){t.action=e}function Bv(t){var e=Vt(),a=St;if(a!==null)return B_(e,a,t);Vt(),e=e.memoizedState,a=Vt();var n=a.queue.dispatch;return a.memoizedState=t,[e,n,!1]}function yo(t,e,a,n){return t={tag:t,create:a,deps:n,inst:e,next:null},e=Ge.updateQueue,e===null&&(e=rd(),Ge.updateQueue=e),a=e.lastEffect,a===null?e.lastEffect=t.next=t:(n=a.next,a.next=t,t.next=n,e.lastEffect=t),t}function N_(){return Vt().memoizedState}function gf(t,e,a,n){var i=Ea();Ge.flags|=t,i.memoizedState=yo(1|e,{destroy:void 0},a,n===void 0?null:n)}function ld(t,e,a,n){var i=Vt();n=n===void 0?null:n;var s=i.memoizedState.inst;St!==null&&n!==null&&Hg(n,St.memoizedState.deps)?i.memoizedState=yo(e,s,a,n):(Ge.flags|=t,i.memoizedState=yo(1|e,s,a,n))}function Nv(t,e){gf(8390656,8,t,e)}function Zg(t,e){ld(2048,8,t,e)}function f1(t){Ge.flags|=4;var e=Ge.updateQueue;if(e===null)e=rd(),Ge.updateQueue=e,e.events=[t];else{var a=e.events;a===null?e.events=[t]:a.push(t)}}function O_(t){var e=Vt().memoizedState;return f1({ref:e,nextImpl:t}),function(){if(ut&2)throw Error(J(440));return e.impl.apply(void 0,arguments)}}function F_(t,e){return ld(4,2,t,e)}function z_(t,e){return ld(4,4,t,e)}function k_(t,e){if(typeof e=="function"){t=t();var a=e(t);return function(){typeof a=="function"?a():e(null)}}if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function H_(t,e,a){a=a!=null?a.concat([t]):null,ld(4,4,k_.bind(null,e,t),a)}function Kg(){}function V_(t,e){var a=Vt();e=e===void 0?null:e;var n=a.memoizedState;return e!==null&&Hg(e,n[1])?n[0]:(a.memoizedState=[t,e],t)}function G_(t,e){var a=Vt();e=e===void 0?null:e;var n=a.memoizedState;if(e!==null&&Hg(e,n[1]))return n[0];if(n=t(),nr){ss(!0);try{t()}finally{ss(!1)}}return a.memoizedState=[n,e],n}function Jg(t,e,a){return a===void 0||Ti&1073741824&&!(it&261930)?t.memoizedState=e:(t.memoizedState=a,t=RM(),Ge.lanes|=t,Ms|=t,a)}function q_(t,e,a,n){return nn(a,e)?a:xo.current!==null?(t=Jg(t,a,n),nn(t,e)||(Xt=!0),t):!(Ti&42)||Ti&1073741824&&!(it&261930)?(Xt=!0,t.memoizedState=a):(t=RM(),Ge.lanes|=t,Ms|=t,e)}function W_(t,e,a,n,i){var s=ct.p;ct.p=s!==0&&8>s?s:8;var r=Fe.T,o={};Fe.T=o,jg(t,!1,e,a);try{var l=i(),u=Fe.S;if(u!==null&&u(o,l),l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=r1(l,n);Kl(t,e,c,an(t))}else Kl(t,e,n,an(t))}catch(f){Kl(t,e,{then:function(){},status:"rejected",reason:f},an())}finally{ct.p=s,r!==null&&o.types!==null&&(r.types=o.types),Fe.T=r}}function d1(){}function jm(t,e,a,n){if(t.tag!==5)throw Error(J(476));var i=X_(t).queue;W_(t,i,e,Ks,a===null?d1:function(){return Y_(t),a(n)})}function X_(t){var e=t.memoizedState;if(e!==null)return e;e={memoizedState:Ks,baseState:Ks,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Li,lastRenderedState:Ks},next:null};var a={};return e.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Li,lastRenderedState:a},next:null},t.memoizedState=e,t=t.alternate,t!==null&&(t.memoizedState=e),e}function Y_(t){var e=X_(t);e.next===null&&(e=t.alternate.memoizedState),Kl(t,e.next.queue,{},an())}function Qg(){return pa(du)}function Z_(){return Vt().memoizedState}function K_(){return Vt().memoizedState}function h1(t){for(var e=t.return;e!==null;){switch(e.tag){case 24:case 3:var a=an();t=ds(a);var n=hs(e,t,a);n!==null&&(Fa(n,e,a),Xl(n,e,a)),e={cache:Ng()},t.payload=e;return}e=e.return}}function p1(t,e,a){var n=an();a={lane:n,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},ud(t)?Q_(e,a):(a=Dg(t,e,a,n),a!==null&&(Fa(a,t,n),j_(a,e,n)))}function J_(t,e,a){var n=an();Kl(t,e,a,n)}function Kl(t,e,a,n){var i={lane:n,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(ud(t))Q_(e,i);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var r=e.lastRenderedState,o=s(r,a);if(i.hasEagerState=!0,i.eagerState=o,nn(o,r))return id(t,e,i,0),Mt===null&&nd(),!1}catch{}finally{}if(a=Dg(t,e,i,n),a!==null)return Fa(a,t,n),j_(a,e,n),!0}return!1}function jg(t,e,a,n){if(n={lane:2,revertLane:ox(),gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},ud(t)){if(e)throw Error(J(479))}else e=Dg(t,a,n,2),e!==null&&Fa(e,t,2)}function ud(t){var e=t.alternate;return t===Ge||e!==null&&e===Ge}function Q_(t,e){co=Nf=!0;var a=t.pending;a===null?e.next=e:(e.next=a.next,a.next=e),t.pending=e}function j_(t,e,a){if(a&4194048){var n=e.lanes;n&=t.pendingLanes,a|=n,e.lanes=a,OS(t,a)}}var uu={readContext:pa,use:od,useCallback:zt,useContext:zt,useEffect:zt,useImperativeHandle:zt,useLayoutEffect:zt,useInsertionEffect:zt,useMemo:zt,useReducer:zt,useRef:zt,useState:zt,useDebugValue:zt,useDeferredValue:zt,useTransition:zt,useSyncExternalStore:zt,useId:zt,useHostTransitionStatus:zt,useFormState:zt,useActionState:zt,useOptimistic:zt,useMemoCache:zt,useCacheRefresh:zt};uu.useEffectEvent=zt;var $_={readContext:pa,use:od,useCallback:function(t,e){return Ea().memoizedState=[t,e===void 0?null:e],t},useContext:pa,useEffect:Nv,useImperativeHandle:function(t,e,a){a=a!=null?a.concat([t]):null,gf(4194308,4,k_.bind(null,e,t),a)},useLayoutEffect:function(t,e){return gf(4194308,4,t,e)},useInsertionEffect:function(t,e){gf(4,2,t,e)},useMemo:function(t,e){var a=Ea();e=e===void 0?null:e;var n=t();if(nr){ss(!0);try{t()}finally{ss(!1)}}return a.memoizedState=[n,e],n},useReducer:function(t,e,a){var n=Ea();if(a!==void 0){var i=a(e);if(nr){ss(!0);try{a(e)}finally{ss(!1)}}}else i=e;return n.memoizedState=n.baseState=i,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:i},n.queue=t,t=t.dispatch=p1.bind(null,Ge,t),[n.memoizedState,t]},useRef:function(t){var e=Ea();return t={current:t},e.memoizedState=t},useState:function(t){t=Jm(t);var e=t.queue,a=J_.bind(null,Ge,e);return e.dispatch=a,[t.memoizedState,a]},useDebugValue:Kg,useDeferredValue:function(t,e){var a=Ea();return Jg(a,t,e)},useTransition:function(){var t=Jm(!1);return t=W_.bind(null,Ge,t.queue,!0,!1),Ea().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,e,a){var n=Ge,i=Ea();if(st){if(a===void 0)throw Error(J(407));a=a()}else{if(a=e(),Mt===null)throw Error(J(349));it&127||L_(n,e,a)}i.memoizedState=a;var s={value:a,getSnapshot:e};return i.queue=s,Nv(E_.bind(null,n,s,t),[t]),n.flags|=2048,yo(9,{destroy:void 0},A_.bind(null,n,s,a,e),null),a},useId:function(){var t=Ea(),e=Mt.identifierPrefix;if(st){var a=Yn,n=Xn;a=(n&~(1<<32-tn(n)-1)).toString(32)+a,e="_"+e+"R_"+a,a=Of++,0<a&&(e+="H"+a.toString(32)),e+="_"}else a=o1++,e="_"+e+"r_"+a.toString(32)+"_";return t.memoizedState=e},useHostTransitionStatus:Qg,useFormState:Pv,useActionState:Pv,useOptimistic:function(t){var e=Ea();e.memoizedState=e.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return e.queue=a,e=jg.bind(null,Ge,!0,a),a.dispatch=e,[t,e]},useMemoCache:Xg,useCacheRefresh:function(){return Ea().memoizedState=h1.bind(null,Ge)},useEffectEvent:function(t){var e=Ea(),a={impl:t};return e.memoizedState=a,function(){if(ut&2)throw Error(J(440));return a.impl.apply(void 0,arguments)}}},$g={readContext:pa,use:od,useCallback:V_,useContext:pa,useEffect:Zg,useImperativeHandle:H_,useInsertionEffect:F_,useLayoutEffect:z_,useMemo:G_,useReducer:mf,useRef:N_,useState:function(){return mf(Li)},useDebugValue:Kg,useDeferredValue:function(t,e){var a=Vt();return q_(a,St.memoizedState,t,e)},useTransition:function(){var t=mf(Li)[0],e=Vt().memoizedState;return[typeof t=="boolean"?t:Mu(t),e]},useSyncExternalStore:T_,useId:Z_,useHostTransitionStatus:Qg,useFormState:Uv,useActionState:Uv,useOptimistic:function(t,e){var a=Vt();return R_(a,St,t,e)},useMemoCache:Xg,useCacheRefresh:K_};$g.useEffectEvent=O_;var eM={readContext:pa,use:od,useCallback:V_,useContext:pa,useEffect:Zg,useImperativeHandle:H_,useInsertionEffect:F_,useLayoutEffect:z_,useMemo:G_,useReducer:rm,useRef:N_,useState:function(){return rm(Li)},useDebugValue:Kg,useDeferredValue:function(t,e){var a=Vt();return St===null?Jg(a,t,e):q_(a,St.memoizedState,t,e)},useTransition:function(){var t=rm(Li)[0],e=Vt().memoizedState;return[typeof t=="boolean"?t:Mu(t),e]},useSyncExternalStore:T_,useId:Z_,useHostTransitionStatus:Qg,useFormState:Bv,useActionState:Bv,useOptimistic:function(t,e){var a=Vt();return St!==null?R_(a,St,t,e):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:Xg,useCacheRefresh:K_};eM.useEffectEvent=O_;function om(t,e,a,n){e=t.memoizedState,a=a(n,e),a=a==null?e:Pt({},e,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var $m={enqueueSetState:function(t,e,a){t=t._reactInternals;var n=an(),i=ds(n);i.payload=e,a!=null&&(i.callback=a),e=hs(t,i,n),e!==null&&(Fa(e,t,n),Xl(e,t,n))},enqueueReplaceState:function(t,e,a){t=t._reactInternals;var n=an(),i=ds(n);i.tag=1,i.payload=e,a!=null&&(i.callback=a),e=hs(t,i,n),e!==null&&(Fa(e,t,n),Xl(e,t,n))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var a=an(),n=ds(a);n.tag=2,e!=null&&(n.callback=e),e=hs(t,n,a),e!==null&&(Fa(e,t,a),Xl(e,t,a))}};function Ov(t,e,a,n,i,s,r){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(n,s,r):e.prototype&&e.prototype.isPureReactComponent?!iu(a,n)||!iu(i,s):!0}function Fv(t,e,a,n){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(a,n),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(a,n),e.state!==t&&$m.enqueueReplaceState(e,e.state,null)}function ir(t,e){var a=e;if("ref"in e){a={};for(var n in e)n!=="ref"&&(a[n]=e[n])}if(t=t.defaultProps){a===e&&(a=Pt({},a));for(var i in t)a[i]===void 0&&(a[i]=t[i])}return a}function tM(t){wf(t)}function aM(t){console.error(t)}function nM(t){wf(t)}function Ff(t,e){try{var a=t.onUncaughtError;a(e.value,{componentStack:e.stack})}catch(n){setTimeout(function(){throw n})}}function zv(t,e,a){try{var n=t.onCaughtError;n(a.value,{componentStack:a.stack,errorBoundary:e.tag===1?e.stateNode:null})}catch(i){setTimeout(function(){throw i})}}function eg(t,e,a){return a=ds(a),a.tag=3,a.payload={element:null},a.callback=function(){Ff(t,e)},a}function iM(t){return t=ds(t),t.tag=3,t}function sM(t,e,a,n){var i=a.type.getDerivedStateFromError;if(typeof i=="function"){var s=n.value;t.payload=function(){return i(s)},t.callback=function(){zv(e,a,n)}}var r=a.stateNode;r!==null&&typeof r.componentDidCatch=="function"&&(t.callback=function(){zv(e,a,n),typeof i!="function"&&(ps===null?ps=new Set([this]):ps.add(this));var o=n.stack;this.componentDidCatch(n.value,{componentStack:o!==null?o:""})})}function m1(t,e,a,n,i){if(a.flags|=32768,n!==null&&typeof n=="object"&&typeof n.then=="function"){if(e=a.alternate,e!==null&&Lo(e,a,i,!0),a=sn.current,a!==null){switch(a.tag){case 31:case 13:return _n===null?Gf():a.alternate===null&&kt===0&&(kt=3),a.flags&=-257,a.flags|=65536,a.lanes=i,n===Pf?a.flags|=16384:(e=a.updateQueue,e===null?a.updateQueue=new Set([n]):e.add(n),ym(t,n,i)),!1;case 22:return a.flags|=65536,n===Pf?a.flags|=16384:(e=a.updateQueue,e===null?(e={transitions:null,markerInstances:null,retryQueue:new Set([n])},a.updateQueue=e):(a=e.retryQueue,a===null?e.retryQueue=new Set([n]):a.add(n)),ym(t,n,i)),!1}throw Error(J(435,a.tag))}return ym(t,n,i),Gf(),!1}if(st)return e=sn.current,e!==null?(!(e.flags&65536)&&(e.flags|=256),e.flags|=65536,e.lanes=i,n!==Hm&&(t=Error(J(422),{cause:n}),ru(vn(t,a)))):(n!==Hm&&(e=Error(J(423),{cause:n}),ru(vn(e,a))),t=t.current.alternate,t.flags|=65536,i&=-i,t.lanes|=i,n=vn(n,a),i=eg(t.stateNode,n,i),sm(t,i),kt!==4&&(kt=2)),!1;var s=Error(J(520),{cause:n});if(s=vn(s,a),jl===null?jl=[s]:jl.push(s),kt!==4&&(kt=2),e===null)return!0;n=vn(n,a),a=e;do{switch(a.tag){case 3:return a.flags|=65536,t=i&-i,a.lanes|=t,t=eg(a.stateNode,n,t),sm(a,t),!1;case 1:if(e=a.type,s=a.stateNode,(a.flags&128)===0&&(typeof e.getDerivedStateFromError=="function"||s!==null&&typeof s.componentDidCatch=="function"&&(ps===null||!ps.has(s))))return a.flags|=65536,i&=-i,a.lanes|=i,i=iM(i),sM(i,t,a,n),sm(a,i),!1}a=a.return}while(a!==null);return!1}var ex=Error(J(461)),Xt=!1;function fa(t,e,a,n){e.child=t===null?v_(e,null,a,n):ar(e,t.child,a,n)}function kv(t,e,a,n,i){a=a.render;var s=e.ref;if("ref"in n){var r={};for(var o in n)o!=="ref"&&(r[o]=n[o])}else r=n;return tr(e),n=Vg(t,e,a,r,s,i),o=Gg(),t!==null&&!Xt?(qg(t,e,i),Ai(t,e,i)):(st&&o&&Ug(e),e.flags|=1,fa(t,e,n,i),e.child)}function Hv(t,e,a,n,i){if(t===null){var s=a.type;return typeof s=="function"&&!Pg(s)&&s.defaultProps===void 0&&a.compare===null?(e.tag=15,e.type=s,rM(t,e,s,n,i)):(t=hf(a.type,null,n,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!tx(t,i)){var r=s.memoizedProps;if(a=a.compare,a=a!==null?a:iu,a(r,n)&&t.ref===e.ref)return Ai(t,e,i)}return e.flags|=1,t=_i(s,n),t.ref=e.ref,t.return=e,e.child=t}function rM(t,e,a,n,i){if(t!==null){var s=t.memoizedProps;if(iu(s,n)&&t.ref===e.ref)if(Xt=!1,e.pendingProps=n=s,tx(t,i))t.flags&131072&&(Xt=!0);else return e.lanes=t.lanes,Ai(t,e,i)}return tg(t,e,a,n,i)}function oM(t,e,a,n){var i=n.children,s=t!==null?t.memoizedState:null;if(t===null&&e.stateNode===null&&(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.mode==="hidden"){if(e.flags&128){if(s=s!==null?s.baseLanes|a:a,t!==null){for(n=e.child=t.child,i=0;n!==null;)i=i|n.lanes|n.childLanes,n=n.sibling;n=i&~s}else n=0,e.child=null;return Vv(t,e,s,a,n)}if(a&536870912)e.memoizedState={baseLanes:0,cachePool:null},t!==null&&pf(e,s!==null?s.cachePool:null),s!==null?Iv(e,s):Zm(),M_(e);else return n=e.lanes=536870912,Vv(t,e,s!==null?s.baseLanes|a:a,a,n)}else s!==null?(pf(e,s.cachePool),Iv(e,s),ns(e),e.memoizedState=null):(t!==null&&pf(e,null),Zm(),ns(e));return fa(t,e,i,a),e.child}function kl(t,e){return t!==null&&t.tag===22||e.stateNode!==null||(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),e.sibling}function Vv(t,e,a,n,i){var s=Og();return s=s===null?null:{parent:Wt._currentValue,pool:s},e.memoizedState={baseLanes:a,cachePool:s},t!==null&&pf(e,null),Zm(),M_(e),t!==null&&Lo(t,e,n,!0),e.childLanes=i,null}function xf(t,e){return e=zf({mode:e.mode,children:e.children},t.mode),e.ref=t.ref,t.child=e,e.return=t,e}function Gv(t,e,a){return ar(e,t.child,null,a),t=xf(e,e.pendingProps),t.flags|=2,Ja(e),e.memoizedState=null,t}function g1(t,e,a){var n=e.pendingProps,i=(e.flags&128)!==0;if(e.flags&=-129,t===null){if(st){if(n.mode==="hidden")return t=xf(e,n),e.lanes=536870912,kl(null,t);if(Km(e),(t=Dt)?(t=$M(t,Sn),t=t!==null&&t.data==="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:vs!==null?{id:Xn,overflow:Yn}:null,retryLane:536870912,hydrationErrors:null},a=d_(t),a.return=e,e.child=a,ha=e,Dt=null)):t=null,t===null)throw Ss(e);return e.lanes=536870912,null}return xf(e,n)}var s=t.memoizedState;if(s!==null){var r=s.dehydrated;if(Km(e),i)if(e.flags&256)e.flags&=-257,e=Gv(t,e,a);else if(e.memoizedState!==null)e.child=t.child,e.flags|=128,e=null;else throw Error(J(558));else if(Xt||Lo(t,e,a,!1),i=(a&t.childLanes)!==0,Xt||i){if(n=Mt,n!==null&&(r=FS(n,a),r!==0&&r!==s.retryLane))throw s.retryLane=r,lr(t,r),Fa(n,t,r),ex;Gf(),e=Gv(t,e,a)}else t=s.treeContext,Dt=Mn(r.nextSibling),ha=e,st=!0,fs=null,Sn=!1,t!==null&&p_(e,t),e=xf(e,n),e.flags|=4096;return e}return t=_i(t.child,{mode:n.mode,children:n.children}),t.ref=e.ref,e.child=t,t.return=e,t}function yf(t,e){var a=e.ref;if(a===null)t!==null&&t.ref!==null&&(e.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(J(284));(t===null||t.ref!==a)&&(e.flags|=4194816)}}function tg(t,e,a,n,i){return tr(e),a=Vg(t,e,a,n,void 0,i),n=Gg(),t!==null&&!Xt?(qg(t,e,i),Ai(t,e,i)):(st&&n&&Ug(e),e.flags|=1,fa(t,e,a,i),e.child)}function qv(t,e,a,n,i,s){return tr(e),e.updateQueue=null,a=C_(e,n,a,i),b_(t),n=Gg(),t!==null&&!Xt?(qg(t,e,s),Ai(t,e,s)):(st&&n&&Ug(e),e.flags|=1,fa(t,e,a,s),e.child)}function Wv(t,e,a,n,i){if(tr(e),e.stateNode===null){var s=to,r=a.contextType;typeof r=="object"&&r!==null&&(s=pa(r)),s=new a(n,s),e.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,s.updater=$m,e.stateNode=s,s._reactInternals=e,s=e.stateNode,s.props=n,s.state=e.memoizedState,s.refs={},zg(e),r=a.contextType,s.context=typeof r=="object"&&r!==null?pa(r):to,s.state=e.memoizedState,r=a.getDerivedStateFromProps,typeof r=="function"&&(om(e,a,r,n),s.state=e.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(r=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),r!==s.state&&$m.enqueueReplaceState(s,s.state,null),Zl(e,n,s,i),Yl(),s.state=e.memoizedState),typeof s.componentDidMount=="function"&&(e.flags|=4194308),n=!0}else if(t===null){s=e.stateNode;var o=e.memoizedProps,l=ir(a,o);s.props=l;var u=s.context,c=a.contextType;r=to,typeof c=="object"&&c!==null&&(r=pa(c));var f=a.getDerivedStateFromProps;c=typeof f=="function"||typeof s.getSnapshotBeforeUpdate=="function",o=e.pendingProps!==o,c||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(o||u!==r)&&Fv(e,s,n,r),es=!1;var d=e.memoizedState;s.state=d,Zl(e,n,s,i),Yl(),u=e.memoizedState,o||d!==u||es?(typeof f=="function"&&(om(e,a,f,n),u=e.memoizedState),(l=es||Ov(e,a,l,n,d,u,r))?(c||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(e.flags|=4194308)):(typeof s.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=n,e.memoizedState=u),s.props=n,s.state=u,s.context=r,n=l):(typeof s.componentDidMount=="function"&&(e.flags|=4194308),n=!1)}else{s=e.stateNode,Xm(t,e),r=e.memoizedProps,c=ir(a,r),s.props=c,f=e.pendingProps,d=s.context,u=a.contextType,l=to,typeof u=="object"&&u!==null&&(l=pa(u)),o=a.getDerivedStateFromProps,(u=typeof o=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(r!==f||d!==l)&&Fv(e,s,n,l),es=!1,d=e.memoizedState,s.state=d,Zl(e,n,s,i),Yl();var p=e.memoizedState;r!==f||d!==p||es||t!==null&&t.dependencies!==null&&Df(t.dependencies)?(typeof o=="function"&&(om(e,a,o,n),p=e.memoizedState),(c=es||Ov(e,a,c,n,d,p,l)||t!==null&&t.dependencies!==null&&Df(t.dependencies))?(u||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(n,p,l),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(n,p,l)),typeof s.componentDidUpdate=="function"&&(e.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof s.componentDidUpdate!="function"||r===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||r===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),e.memoizedProps=n,e.memoizedState=p),s.props=n,s.state=p,s.context=l,n=c):(typeof s.componentDidUpdate!="function"||r===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||r===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),n=!1)}return s=n,yf(t,e),n=(e.flags&128)!==0,s||n?(s=e.stateNode,a=n&&typeof a.getDerivedStateFromError!="function"?null:s.render(),e.flags|=1,t!==null&&n?(e.child=ar(e,t.child,null,i),e.child=ar(e,null,a,i)):fa(t,e,a,i),e.memoizedState=s.state,t=e.child):t=Ai(t,e,i),t}function Xv(t,e,a,n){return er(),e.flags|=256,fa(t,e,a,n),e.child}var lm={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function um(t){return{baseLanes:t,cachePool:g_()}}function cm(t,e,a){return t=t!==null?t.childLanes&~a:0,e&&(t|=ja),t}function lM(t,e,a){var n=e.pendingProps,i=!1,s=(e.flags&128)!==0,r;if((r=s)||(r=t!==null&&t.memoizedState===null?!1:(Ht.current&2)!==0),r&&(i=!0,e.flags&=-129),r=(e.flags&32)!==0,e.flags&=-33,t===null){if(st){if(i?as(e):ns(e),(t=Dt)?(t=$M(t,Sn),t=t!==null&&t.data!=="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:vs!==null?{id:Xn,overflow:Yn}:null,retryLane:536870912,hydrationErrors:null},a=d_(t),a.return=e,e.child=a,ha=e,Dt=null)):t=null,t===null)throw Ss(e);return mg(t)?e.lanes=32:e.lanes=536870912,null}var o=n.children;return n=n.fallback,i?(ns(e),i=e.mode,o=zf({mode:"hidden",children:o},i),n=Js(n,i,a,null),o.return=e,n.return=e,o.sibling=n,e.child=o,n=e.child,n.memoizedState=um(a),n.childLanes=cm(t,r,a),e.memoizedState=lm,kl(null,n)):(as(e),ag(e,o))}var l=t.memoizedState;if(l!==null&&(o=l.dehydrated,o!==null)){if(s)e.flags&256?(as(e),e.flags&=-257,e=fm(t,e,a)):e.memoizedState!==null?(ns(e),e.child=t.child,e.flags|=128,e=null):(ns(e),o=n.fallback,i=e.mode,n=zf({mode:"visible",children:n.children},i),o=Js(o,i,a,null),o.flags|=2,n.return=e,o.return=e,n.sibling=o,e.child=n,ar(e,t.child,null,a),n=e.child,n.memoizedState=um(a),n.childLanes=cm(t,r,a),e.memoizedState=lm,e=kl(null,n));else if(as(e),mg(o)){if(r=o.nextSibling&&o.nextSibling.dataset,r)var u=r.dgst;r=u,n=Error(J(419)),n.stack="",n.digest=r,ru({value:n,source:null,stack:null}),e=fm(t,e,a)}else if(Xt||Lo(t,e,a,!1),r=(a&t.childLanes)!==0,Xt||r){if(r=Mt,r!==null&&(n=FS(r,a),n!==0&&n!==l.retryLane))throw l.retryLane=n,lr(t,n),Fa(r,t,n),ex;pg(o)||Gf(),e=fm(t,e,a)}else pg(o)?(e.flags|=192,e.child=t.child,e=null):(t=l.treeContext,Dt=Mn(o.nextSibling),ha=e,st=!0,fs=null,Sn=!1,t!==null&&p_(e,t),e=ag(e,n.children),e.flags|=4096);return e}return i?(ns(e),o=n.fallback,i=e.mode,l=t.child,u=l.sibling,n=_i(l,{mode:"hidden",children:n.children}),n.subtreeFlags=l.subtreeFlags&65011712,u!==null?o=_i(u,o):(o=Js(o,i,a,null),o.flags|=2),o.return=e,n.return=e,n.sibling=o,e.child=n,kl(null,n),n=e.child,o=t.child.memoizedState,o===null?o=um(a):(i=o.cachePool,i!==null?(l=Wt._currentValue,i=i.parent!==l?{parent:l,pool:l}:i):i=g_(),o={baseLanes:o.baseLanes|a,cachePool:i}),n.memoizedState=o,n.childLanes=cm(t,r,a),e.memoizedState=lm,kl(t.child,n)):(as(e),a=t.child,t=a.sibling,a=_i(a,{mode:"visible",children:n.children}),a.return=e,a.sibling=null,t!==null&&(r=e.deletions,r===null?(e.deletions=[t],e.flags|=16):r.push(t)),e.child=a,e.memoizedState=null,a)}function ag(t,e){return e=zf({mode:"visible",children:e},t.mode),e.return=t,t.child=e}function zf(t,e){return t=Qa(22,t,null,e),t.lanes=0,t}function fm(t,e,a){return ar(e,t.child,null,a),t=ag(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function Yv(t,e,a){t.lanes|=e;var n=t.alternate;n!==null&&(n.lanes|=e),Gm(t.return,e,a)}function dm(t,e,a,n,i,s){var r=t.memoizedState;r===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:n,tail:a,tailMode:i,treeForkCount:s}:(r.isBackwards=e,r.rendering=null,r.renderingStartTime=0,r.last=n,r.tail=a,r.tailMode=i,r.treeForkCount=s)}function uM(t,e,a){var n=e.pendingProps,i=n.revealOrder,s=n.tail;n=n.children;var r=Ht.current,o=(r&2)!==0;if(o?(r=r&1|2,e.flags|=128):r&=1,At(Ht,r),fa(t,e,n,a),n=st?su:0,!o&&t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Yv(t,a,e);else if(t.tag===19)Yv(t,a,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(i){case"forwards":for(a=e.child,i=null;a!==null;)t=a.alternate,t!==null&&Bf(t)===null&&(i=a),a=a.sibling;a=i,a===null?(i=e.child,e.child=null):(i=a.sibling,a.sibling=null),dm(e,!1,i,a,s,n);break;case"backwards":case"unstable_legacy-backwards":for(a=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&Bf(t)===null){e.child=i;break}t=i.sibling,i.sibling=a,a=i,i=t}dm(e,!0,a,null,s,n);break;case"together":dm(e,!1,null,null,void 0,n);break;default:e.memoizedState=null}return e.child}function Ai(t,e,a){if(t!==null&&(e.dependencies=t.dependencies),Ms|=e.lanes,!(a&e.childLanes))if(t!==null){if(Lo(t,e,a,!1),(a&e.childLanes)===0)return null}else return null;if(t!==null&&e.child!==t.child)throw Error(J(153));if(e.child!==null){for(t=e.child,a=_i(t,t.pendingProps),e.child=a,a.return=e;t.sibling!==null;)t=t.sibling,a=a.sibling=_i(t,t.pendingProps),a.return=e;a.sibling=null}return e.child}function tx(t,e){return t.lanes&e?!0:(t=t.dependencies,!!(t!==null&&Df(t)))}function x1(t,e,a){switch(e.tag){case 3:Tf(e,e.stateNode.containerInfo),ts(e,Wt,t.memoizedState.cache),er();break;case 27:case 5:Im(e);break;case 4:Tf(e,e.stateNode.containerInfo);break;case 10:ts(e,e.type,e.memoizedProps.value);break;case 31:if(e.memoizedState!==null)return e.flags|=128,Km(e),null;break;case 13:var n=e.memoizedState;if(n!==null)return n.dehydrated!==null?(as(e),e.flags|=128,null):a&e.child.childLanes?lM(t,e,a):(as(e),t=Ai(t,e,a),t!==null?t.sibling:null);as(e);break;case 19:var i=(t.flags&128)!==0;if(n=(a&e.childLanes)!==0,n||(Lo(t,e,a,!1),n=(a&e.childLanes)!==0),i){if(n)return uM(t,e,a);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),At(Ht,Ht.current),n)break;return null;case 22:return e.lanes=0,oM(t,e,a,e.pendingProps);case 24:ts(e,Wt,t.memoizedState.cache)}return Ai(t,e,a)}function cM(t,e,a){if(t!==null)if(t.memoizedProps!==e.pendingProps)Xt=!0;else{if(!tx(t,a)&&!(e.flags&128))return Xt=!1,x1(t,e,a);Xt=!!(t.flags&131072)}else Xt=!1,st&&e.flags&1048576&&h_(e,su,e.index);switch(e.lanes=0,e.tag){case 16:e:{var n=e.pendingProps;if(t=Ys(e.elementType),e.type=t,typeof t=="function")Pg(t)?(n=ir(t,n),e.tag=1,e=Wv(null,e,t,n,a)):(e.tag=0,e=tg(null,e,t,n,a));else{if(t!=null){var i=t.$$typeof;if(i===vg){e.tag=11,e=kv(null,e,t,n,a);break e}else if(i===Sg){e.tag=14,e=Hv(null,e,t,n,a);break e}}throw e=Em(t)||t,Error(J(306,e,""))}}return e;case 0:return tg(t,e,e.type,e.pendingProps,a);case 1:return n=e.type,i=ir(n,e.pendingProps),Wv(t,e,n,i,a);case 3:e:{if(Tf(e,e.stateNode.containerInfo),t===null)throw Error(J(387));n=e.pendingProps;var s=e.memoizedState;i=s.element,Xm(t,e),Zl(e,n,null,a);var r=e.memoizedState;if(n=r.cache,ts(e,Wt,n),n!==s.cache&&qm(e,[Wt],a,!0),Yl(),n=r.element,s.isDehydrated)if(s={element:n,isDehydrated:!1,cache:r.cache},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){e=Xv(t,e,n,a);break e}else if(n!==i){i=vn(Error(J(424)),e),ru(i),e=Xv(t,e,n,a);break e}else{switch(t=e.stateNode.containerInfo,t.nodeType){case 9:t=t.body;break;default:t=t.nodeName==="HTML"?t.ownerDocument.body:t}for(Dt=Mn(t.firstChild),ha=e,st=!0,fs=null,Sn=!0,a=v_(e,null,n,a),e.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(er(),n===i){e=Ai(t,e,a);break e}fa(t,e,n,a)}e=e.child}return e;case 26:return yf(t,e),t===null?(a=mS(e.type,null,e.pendingProps,null))?e.memoizedState=a:st||(a=e.type,t=e.pendingProps,n=Yf(cs.current).createElement(a),n[da]=e,n[za]=t,ma(n,a,t),ra(n),e.stateNode=n):e.memoizedState=mS(e.type,t.memoizedProps,e.pendingProps,t.memoizedState),null;case 27:return Im(e),t===null&&st&&(n=e.stateNode=eb(e.type,e.pendingProps,cs.current),ha=e,Sn=!0,i=Dt,Cs(e.type)?(gg=i,Dt=Mn(n.firstChild)):Dt=i),fa(t,e,e.pendingProps.children,a),yf(t,e),t===null&&(e.flags|=4194304),e.child;case 5:return t===null&&st&&((i=n=Dt)&&(n=W1(n,e.type,e.pendingProps,Sn),n!==null?(e.stateNode=n,ha=e,Dt=Mn(n.firstChild),Sn=!1,i=!0):i=!1),i||Ss(e)),Im(e),i=e.type,s=e.pendingProps,r=t!==null?t.memoizedProps:null,n=s.children,dg(i,s)?n=null:r!==null&&dg(i,r)&&(e.flags|=32),e.memoizedState!==null&&(i=Vg(t,e,l1,null,null,a),du._currentValue=i),yf(t,e),fa(t,e,n,a),e.child;case 6:return t===null&&st&&((t=a=Dt)&&(a=X1(a,e.pendingProps,Sn),a!==null?(e.stateNode=a,ha=e,Dt=null,t=!0):t=!1),t||Ss(e)),null;case 13:return lM(t,e,a);case 4:return Tf(e,e.stateNode.containerInfo),n=e.pendingProps,t===null?e.child=ar(e,null,n,a):fa(t,e,n,a),e.child;case 11:return kv(t,e,e.type,e.pendingProps,a);case 7:return fa(t,e,e.pendingProps,a),e.child;case 8:return fa(t,e,e.pendingProps.children,a),e.child;case 12:return fa(t,e,e.pendingProps.children,a),e.child;case 10:return n=e.pendingProps,ts(e,e.type,n.value),fa(t,e,n.children,a),e.child;case 9:return i=e.type._context,n=e.pendingProps.children,tr(e),i=pa(i),n=n(i),e.flags|=1,fa(t,e,n,a),e.child;case 14:return Hv(t,e,e.type,e.pendingProps,a);case 15:return rM(t,e,e.type,e.pendingProps,a);case 19:return uM(t,e,a);case 31:return g1(t,e,a);case 22:return oM(t,e,a,e.pendingProps);case 24:return tr(e),n=pa(Wt),t===null?(i=Og(),i===null&&(i=Mt,s=Ng(),i.pooledCache=s,s.refCount++,s!==null&&(i.pooledCacheLanes|=a),i=s),e.memoizedState={parent:n,cache:i},zg(e),ts(e,Wt,i)):(t.lanes&a&&(Xm(t,e),Zl(e,null,null,a),Yl()),i=t.memoizedState,s=e.memoizedState,i.parent!==n?(i={parent:n,cache:n},e.memoizedState=i,e.lanes===0&&(e.memoizedState=e.updateQueue.baseState=i),ts(e,Wt,n)):(n=s.cache,ts(e,Wt,n),n!==i.cache&&qm(e,[Wt],a,!0))),fa(t,e,e.pendingProps.children,a),e.child;case 29:throw e.pendingProps}throw Error(J(156,e.tag))}function di(t){t.flags|=4}function hm(t,e,a,n,i){if((e=(t.mode&32)!==0)&&(e=!1),e){if(t.flags|=16777216,(i&335544128)===i)if(t.stateNode.complete)t.flags|=8192;else if(UM())t.flags|=8192;else throw js=Pf,Fg}else t.flags&=-16777217}function Zv(t,e){if(e.type!=="stylesheet"||e.state.loading&4)t.flags&=-16777217;else if(t.flags|=16777216,!nb(e))if(UM())t.flags|=8192;else throw js=Pf,Fg}function tf(t,e){e!==null&&(t.flags|=4),t.flags&16384&&(e=t.tag!==22?BS():536870912,t.lanes|=e,vo|=e)}function Pl(t,e){if(!st)switch(t.tailMode){case"hidden":e=t.tail;for(var a=null;e!==null;)e.alternate!==null&&(a=e),e=e.sibling;a===null?t.tail=null:a.sibling=null;break;case"collapsed":a=t.tail;for(var n=null;a!==null;)a.alternate!==null&&(n=a),a=a.sibling;n===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:n.sibling=null}}function Rt(t){var e=t.alternate!==null&&t.alternate.child===t.child,a=0,n=0;if(e)for(var i=t.child;i!==null;)a|=i.lanes|i.childLanes,n|=i.subtreeFlags&65011712,n|=i.flags&65011712,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)a|=i.lanes|i.childLanes,n|=i.subtreeFlags,n|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=n,t.childLanes=a,e}function y1(t,e,a){var n=e.pendingProps;switch(Bg(e),e.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Rt(e),null;case 1:return Rt(e),null;case 3:return a=e.stateNode,n=null,t!==null&&(n=t.memoizedState.cache),e.memoizedState.cache!==n&&(e.flags|=2048),Mi(Wt),ho(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(Gr(e)?di(e):t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,im())),Rt(e),null;case 26:var i=e.type,s=e.memoizedState;return t===null?(di(e),s!==null?(Rt(e),Zv(e,s)):(Rt(e),hm(e,i,null,n,a))):s?s!==t.memoizedState?(di(e),Rt(e),Zv(e,s)):(Rt(e),e.flags&=-16777217):(t=t.memoizedProps,t!==n&&di(e),Rt(e),hm(e,i,t,n,a)),null;case 27:if(Lf(e),a=cs.current,i=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==n&&di(e);else{if(!n){if(e.stateNode===null)throw Error(J(166));return Rt(e),null}t=Kn.current,Gr(e)?bv(e,t):(t=eb(i,n,a),e.stateNode=t,di(e))}return Rt(e),null;case 5:if(Lf(e),i=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==n&&di(e);else{if(!n){if(e.stateNode===null)throw Error(J(166));return Rt(e),null}if(s=Kn.current,Gr(e))bv(e,s);else{var r=Yf(cs.current);switch(s){case 1:s=r.createElementNS("http://www.w3.org/2000/svg",i);break;case 2:s=r.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;default:switch(i){case"svg":s=r.createElementNS("http://www.w3.org/2000/svg",i);break;case"math":s=r.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;case"script":s=r.createElement("div"),s.innerHTML="<script><\/script>",s=s.removeChild(s.firstChild);break;case"select":s=typeof n.is=="string"?r.createElement("select",{is:n.is}):r.createElement("select"),n.multiple?s.multiple=!0:n.size&&(s.size=n.size);break;default:s=typeof n.is=="string"?r.createElement(i,{is:n.is}):r.createElement(i)}}s[da]=e,s[za]=n;e:for(r=e.child;r!==null;){if(r.tag===5||r.tag===6)s.appendChild(r.stateNode);else if(r.tag!==4&&r.tag!==27&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===e)break e;for(;r.sibling===null;){if(r.return===null||r.return===e)break e;r=r.return}r.sibling.return=r.return,r=r.sibling}e.stateNode=s;e:switch(ma(s,i,n),i){case"button":case"input":case"select":case"textarea":n=!!n.autoFocus;break e;case"img":n=!0;break e;default:n=!1}n&&di(e)}}return Rt(e),hm(e,e.type,t===null?null:t.memoizedProps,e.pendingProps,a),null;case 6:if(t&&e.stateNode!=null)t.memoizedProps!==n&&di(e);else{if(typeof n!="string"&&e.stateNode===null)throw Error(J(166));if(t=cs.current,Gr(e)){if(t=e.stateNode,a=e.memoizedProps,n=null,i=ha,i!==null)switch(i.tag){case 27:case 5:n=i.memoizedProps}t[da]=e,t=!!(t.nodeValue===a||n!==null&&n.suppressHydrationWarning===!0||JM(t.nodeValue,a)),t||Ss(e,!0)}else t=Yf(t).createTextNode(n),t[da]=e,e.stateNode=t}return Rt(e),null;case 31:if(a=e.memoizedState,t===null||t.memoizedState!==null){if(n=Gr(e),a!==null){if(t===null){if(!n)throw Error(J(318));if(t=e.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(J(557));t[da]=e}else er(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Rt(e),t=!1}else a=im(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),t=!0;if(!t)return e.flags&256?(Ja(e),e):(Ja(e),null);if(e.flags&128)throw Error(J(558))}return Rt(e),null;case 13:if(n=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(i=Gr(e),n!==null&&n.dehydrated!==null){if(t===null){if(!i)throw Error(J(318));if(i=e.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(J(317));i[da]=e}else er(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Rt(e),i=!1}else i=im(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=i),i=!0;if(!i)return e.flags&256?(Ja(e),e):(Ja(e),null)}return Ja(e),e.flags&128?(e.lanes=a,e):(a=n!==null,t=t!==null&&t.memoizedState!==null,a&&(n=e.child,i=null,n.alternate!==null&&n.alternate.memoizedState!==null&&n.alternate.memoizedState.cachePool!==null&&(i=n.alternate.memoizedState.cachePool.pool),s=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(s=n.memoizedState.cachePool.pool),s!==i&&(n.flags|=2048)),a!==t&&a&&(e.child.flags|=8192),tf(e,e.updateQueue),Rt(e),null);case 4:return ho(),t===null&&lx(e.stateNode.containerInfo),Rt(e),null;case 10:return Mi(e.type),Rt(e),null;case 19:if(oa(Ht),n=e.memoizedState,n===null)return Rt(e),null;if(i=(e.flags&128)!==0,s=n.rendering,s===null)if(i)Pl(n,!1);else{if(kt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(s=Bf(t),s!==null){for(e.flags|=128,Pl(n,!1),t=s.updateQueue,e.updateQueue=t,tf(e,t),e.subtreeFlags=0,t=a,a=e.child;a!==null;)f_(a,t),a=a.sibling;return At(Ht,Ht.current&1|2),st&&gi(e,n.treeForkCount),e.child}t=t.sibling}n.tail!==null&&$a()>Hf&&(e.flags|=128,i=!0,Pl(n,!1),e.lanes=4194304)}else{if(!i)if(t=Bf(s),t!==null){if(e.flags|=128,i=!0,t=t.updateQueue,e.updateQueue=t,tf(e,t),Pl(n,!0),n.tail===null&&n.tailMode==="hidden"&&!s.alternate&&!st)return Rt(e),null}else 2*$a()-n.renderingStartTime>Hf&&a!==536870912&&(e.flags|=128,i=!0,Pl(n,!1),e.lanes=4194304);n.isBackwards?(s.sibling=e.child,e.child=s):(t=n.last,t!==null?t.sibling=s:e.child=s,n.last=s)}return n.tail!==null?(t=n.tail,n.rendering=t,n.tail=t.sibling,n.renderingStartTime=$a(),t.sibling=null,a=Ht.current,At(Ht,i?a&1|2:a&1),st&&gi(e,n.treeForkCount),t):(Rt(e),null);case 22:case 23:return Ja(e),kg(),n=e.memoizedState!==null,t!==null?t.memoizedState!==null!==n&&(e.flags|=8192):n&&(e.flags|=8192),n?a&536870912&&!(e.flags&128)&&(Rt(e),e.subtreeFlags&6&&(e.flags|=8192)):Rt(e),a=e.updateQueue,a!==null&&tf(e,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),n=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),n!==a&&(e.flags|=2048),t!==null&&oa(Qs),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),e.memoizedState.cache!==a&&(e.flags|=2048),Mi(Wt),Rt(e),null;case 25:return null;case 30:return null}throw Error(J(156,e.tag))}function v1(t,e){switch(Bg(e),e.tag){case 1:return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Mi(Wt),ho(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 26:case 27:case 5:return Lf(e),null;case 31:if(e.memoizedState!==null){if(Ja(e),e.alternate===null)throw Error(J(340));er()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 13:if(Ja(e),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(J(340));er()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return oa(Ht),null;case 4:return ho(),null;case 10:return Mi(e.type),null;case 22:case 23:return Ja(e),kg(),t!==null&&oa(Qs),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 24:return Mi(Wt),null;case 25:return null;default:return null}}function fM(t,e){switch(Bg(e),e.tag){case 3:Mi(Wt),ho();break;case 26:case 27:case 5:Lf(e);break;case 4:ho();break;case 31:e.memoizedState!==null&&Ja(e);break;case 13:Ja(e);break;case 19:oa(Ht);break;case 10:Mi(e.type);break;case 22:case 23:Ja(e),kg(),t!==null&&oa(Qs);break;case 24:Mi(Wt)}}function bu(t,e){try{var a=e.updateQueue,n=a!==null?a.lastEffect:null;if(n!==null){var i=n.next;a=i;do{if((a.tag&t)===t){n=void 0;var s=a.create,r=a.inst;n=s(),r.destroy=n}a=a.next}while(a!==i)}}catch(o){gt(e,e.return,o)}}function _s(t,e,a){try{var n=e.updateQueue,i=n!==null?n.lastEffect:null;if(i!==null){var s=i.next;n=s;do{if((n.tag&t)===t){var r=n.inst,o=r.destroy;if(o!==void 0){r.destroy=void 0,i=e;var l=a,u=o;try{u()}catch(c){gt(i,l,c)}}}n=n.next}while(n!==s)}}catch(c){gt(e,e.return,c)}}function dM(t){var e=t.updateQueue;if(e!==null){var a=t.stateNode;try{__(e,a)}catch(n){gt(t,t.return,n)}}}function hM(t,e,a){a.props=ir(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(n){gt(t,e,n)}}function Jl(t,e){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var n=t.stateNode;break;case 30:n=t.stateNode;break;default:n=t.stateNode}typeof a=="function"?t.refCleanup=a(n):a.current=n}}catch(i){gt(t,e,i)}}function Zn(t,e){var a=t.ref,n=t.refCleanup;if(a!==null)if(typeof n=="function")try{n()}catch(i){gt(t,e,i)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(i){gt(t,e,i)}else a.current=null}function pM(t){var e=t.type,a=t.memoizedProps,n=t.stateNode;try{e:switch(e){case"button":case"input":case"select":case"textarea":a.autoFocus&&n.focus();break e;case"img":a.src?n.src=a.src:a.srcSet&&(n.srcset=a.srcSet)}}catch(i){gt(t,t.return,i)}}function pm(t,e,a){try{var n=t.stateNode;z1(n,t.type,a,e),n[za]=e}catch(i){gt(t,t.return,i)}}function mM(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&Cs(t.type)||t.tag===4}function mm(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||mM(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&Cs(t.type)||t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function ng(t,e,a){var n=t.tag;if(n===5||n===6)t=t.stateNode,e?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(t,e):(e=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,e.appendChild(t),a=a._reactRootContainer,a!=null||e.onclick!==null||(e.onclick=vi));else if(n!==4&&(n===27&&Cs(t.type)&&(a=t.stateNode,e=null),t=t.child,t!==null))for(ng(t,e,a),t=t.sibling;t!==null;)ng(t,e,a),t=t.sibling}function kf(t,e,a){var n=t.tag;if(n===5||n===6)t=t.stateNode,e?a.insertBefore(t,e):a.appendChild(t);else if(n!==4&&(n===27&&Cs(t.type)&&(a=t.stateNode),t=t.child,t!==null))for(kf(t,e,a),t=t.sibling;t!==null;)kf(t,e,a),t=t.sibling}function gM(t){var e=t.stateNode,a=t.memoizedProps;try{for(var n=t.type,i=e.attributes;i.length;)e.removeAttributeNode(i[0]);ma(e,n,a),e[da]=t,e[za]=a}catch(s){gt(t,t.return,s)}}var xi=!1,qt=!1,gm=!1,Kv=typeof WeakSet=="function"?WeakSet:Set,sa=null;function S1(t,e){if(t=t.containerInfo,cg=Qf,t=n_(t),Ig(t)){if("selectionStart"in t)var a={start:t.selectionStart,end:t.selectionEnd};else e:{a=(a=t.ownerDocument)&&a.defaultView||window;var n=a.getSelection&&a.getSelection();if(n&&n.rangeCount!==0){a=n.anchorNode;var i=n.anchorOffset,s=n.focusNode;n=n.focusOffset;try{a.nodeType,s.nodeType}catch{a=null;break e}var r=0,o=-1,l=-1,u=0,c=0,f=t,d=null;t:for(;;){for(var p;f!==a||i!==0&&f.nodeType!==3||(o=r+i),f!==s||n!==0&&f.nodeType!==3||(l=r+n),f.nodeType===3&&(r+=f.nodeValue.length),(p=f.firstChild)!==null;)d=f,f=p;for(;;){if(f===t)break t;if(d===a&&++u===i&&(o=r),d===s&&++c===n&&(l=r),(p=f.nextSibling)!==null)break;f=d,d=f.parentNode}f=p}a=o===-1||l===-1?null:{start:o,end:l}}else a=null}a=a||{start:0,end:0}}else a=null;for(fg={focusedElem:t,selectionRange:a},Qf=!1,sa=e;sa!==null;)if(e=sa,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,sa=t;else for(;sa!==null;){switch(e=sa,s=e.alternate,t=e.flags,e.tag){case 0:if(t&4&&(t=e.updateQueue,t=t!==null?t.events:null,t!==null))for(a=0;a<t.length;a++)i=t[a],i.ref.impl=i.nextImpl;break;case 11:case 15:break;case 1:if(t&1024&&s!==null){t=void 0,a=e,i=s.memoizedProps,s=s.memoizedState,n=a.stateNode;try{var g=ir(a.type,i);t=n.getSnapshotBeforeUpdate(g,s),n.__reactInternalSnapshotBeforeUpdate=t}catch(y){gt(a,a.return,y)}}break;case 3:if(t&1024){if(t=e.stateNode.containerInfo,a=t.nodeType,a===9)hg(t);else if(a===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":hg(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(t&1024)throw Error(J(163))}if(t=e.sibling,t!==null){t.return=e.return,sa=t;break}sa=e.return}}function xM(t,e,a){var n=a.flags;switch(a.tag){case 0:case 11:case 15:pi(t,a),n&4&&bu(5,a);break;case 1:if(pi(t,a),n&4)if(t=a.stateNode,e===null)try{t.componentDidMount()}catch(r){gt(a,a.return,r)}else{var i=ir(a.type,e.memoizedProps);e=e.memoizedState;try{t.componentDidUpdate(i,e,t.__reactInternalSnapshotBeforeUpdate)}catch(r){gt(a,a.return,r)}}n&64&&dM(a),n&512&&Jl(a,a.return);break;case 3:if(pi(t,a),n&64&&(t=a.updateQueue,t!==null)){if(e=null,a.child!==null)switch(a.child.tag){case 27:case 5:e=a.child.stateNode;break;case 1:e=a.child.stateNode}try{__(t,e)}catch(r){gt(a,a.return,r)}}break;case 27:e===null&&n&4&&gM(a);case 26:case 5:pi(t,a),e===null&&n&4&&pM(a),n&512&&Jl(a,a.return);break;case 12:pi(t,a);break;case 31:pi(t,a),n&4&&SM(t,a);break;case 13:pi(t,a),n&4&&_M(t,a),n&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=w1.bind(null,a),Y1(t,a))));break;case 22:if(n=a.memoizedState!==null||xi,!n){e=e!==null&&e.memoizedState!==null||qt,i=xi;var s=qt;xi=n,(qt=e)&&!s?mi(t,a,(a.subtreeFlags&8772)!==0):pi(t,a),xi=i,qt=s}break;case 30:break;default:pi(t,a)}}function yM(t){var e=t.alternate;e!==null&&(t.alternate=null,yM(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&Cg(e)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var Bt=null,Na=!1;function hi(t,e,a){for(a=a.child;a!==null;)vM(t,e,a),a=a.sibling}function vM(t,e,a){if(en&&typeof en.onCommitFiberUnmount=="function")try{en.onCommitFiberUnmount(gu,a)}catch{}switch(a.tag){case 26:qt||Zn(a,e),hi(t,e,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:qt||Zn(a,e);var n=Bt,i=Na;Cs(a.type)&&(Bt=a.stateNode,Na=!1),hi(t,e,a),eu(a.stateNode),Bt=n,Na=i;break;case 5:qt||Zn(a,e);case 6:if(n=Bt,i=Na,Bt=null,hi(t,e,a),Bt=n,Na=i,Bt!==null)if(Na)try{(Bt.nodeType===9?Bt.body:Bt.nodeName==="HTML"?Bt.ownerDocument.body:Bt).removeChild(a.stateNode)}catch(s){gt(a,e,s)}else try{Bt.removeChild(a.stateNode)}catch(s){gt(a,e,s)}break;case 18:Bt!==null&&(Na?(t=Bt,cS(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),bo(t)):cS(Bt,a.stateNode));break;case 4:n=Bt,i=Na,Bt=a.stateNode.containerInfo,Na=!0,hi(t,e,a),Bt=n,Na=i;break;case 0:case 11:case 14:case 15:_s(2,a,e),qt||_s(4,a,e),hi(t,e,a);break;case 1:qt||(Zn(a,e),n=a.stateNode,typeof n.componentWillUnmount=="function"&&hM(a,e,n)),hi(t,e,a);break;case 21:hi(t,e,a);break;case 22:qt=(n=qt)||a.memoizedState!==null,hi(t,e,a),qt=n;break;default:hi(t,e,a)}}function SM(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{bo(t)}catch(a){gt(e,e.return,a)}}}function _M(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{bo(t)}catch(a){gt(e,e.return,a)}}function _1(t){switch(t.tag){case 31:case 13:case 19:var e=t.stateNode;return e===null&&(e=t.stateNode=new Kv),e;case 22:return t=t.stateNode,e=t._retryCache,e===null&&(e=t._retryCache=new Kv),e;default:throw Error(J(435,t.tag))}}function af(t,e){var a=_1(t);e.forEach(function(n){if(!a.has(n)){a.add(n);var i=I1.bind(null,t,n);n.then(i,i)}})}function Ua(t,e){var a=e.deletions;if(a!==null)for(var n=0;n<a.length;n++){var i=a[n],s=t,r=e,o=r;e:for(;o!==null;){switch(o.tag){case 27:if(Cs(o.type)){Bt=o.stateNode,Na=!1;break e}break;case 5:Bt=o.stateNode,Na=!1;break e;case 3:case 4:Bt=o.stateNode.containerInfo,Na=!0;break e}o=o.return}if(Bt===null)throw Error(J(160));vM(s,r,i),Bt=null,Na=!1,s=i.alternate,s!==null&&(s.return=null),i.return=null}if(e.subtreeFlags&13886)for(e=e.child;e!==null;)MM(e,t),e=e.sibling}var In=null;function MM(t,e){var a=t.alternate,n=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:Ua(e,t),Ba(t),n&4&&(_s(3,t,t.return),bu(3,t),_s(5,t,t.return));break;case 1:Ua(e,t),Ba(t),n&512&&(qt||a===null||Zn(a,a.return)),n&64&&xi&&(t=t.updateQueue,t!==null&&(n=t.callbacks,n!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?n:a.concat(n))));break;case 26:var i=In;if(Ua(e,t),Ba(t),n&512&&(qt||a===null||Zn(a,a.return)),n&4){var s=a!==null?a.memoizedState:null;if(n=t.memoizedState,a===null)if(n===null)if(t.stateNode===null){e:{n=t.type,a=t.memoizedProps,i=i.ownerDocument||i;t:switch(n){case"title":s=i.getElementsByTagName("title")[0],(!s||s[vu]||s[da]||s.namespaceURI==="http://www.w3.org/2000/svg"||s.hasAttribute("itemprop"))&&(s=i.createElement(n),i.head.insertBefore(s,i.querySelector("head > title"))),ma(s,n,a),s[da]=t,ra(s),n=s;break e;case"link":var r=xS("link","href",i).get(n+(a.href||""));if(r){for(var o=0;o<r.length;o++)if(s=r[o],s.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&s.getAttribute("rel")===(a.rel==null?null:a.rel)&&s.getAttribute("title")===(a.title==null?null:a.title)&&s.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){r.splice(o,1);break t}}s=i.createElement(n),ma(s,n,a),i.head.appendChild(s);break;case"meta":if(r=xS("meta","content",i).get(n+(a.content||""))){for(o=0;o<r.length;o++)if(s=r[o],s.getAttribute("content")===(a.content==null?null:""+a.content)&&s.getAttribute("name")===(a.name==null?null:a.name)&&s.getAttribute("property")===(a.property==null?null:a.property)&&s.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&s.getAttribute("charset")===(a.charSet==null?null:a.charSet)){r.splice(o,1);break t}}s=i.createElement(n),ma(s,n,a),i.head.appendChild(s);break;default:throw Error(J(468,n))}s[da]=t,ra(s),n=s}t.stateNode=n}else yS(i,t.type,t.stateNode);else t.stateNode=gS(i,n,t.memoizedProps);else s!==n?(s===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):s.count--,n===null?yS(i,t.type,t.stateNode):gS(i,n,t.memoizedProps)):n===null&&t.stateNode!==null&&pm(t,t.memoizedProps,a.memoizedProps)}break;case 27:Ua(e,t),Ba(t),n&512&&(qt||a===null||Zn(a,a.return)),a!==null&&n&4&&pm(t,t.memoizedProps,a.memoizedProps);break;case 5:if(Ua(e,t),Ba(t),n&512&&(qt||a===null||Zn(a,a.return)),t.flags&32){i=t.stateNode;try{mo(i,"")}catch(g){gt(t,t.return,g)}}n&4&&t.stateNode!=null&&(i=t.memoizedProps,pm(t,i,a!==null?a.memoizedProps:i)),n&1024&&(gm=!0);break;case 6:if(Ua(e,t),Ba(t),n&4){if(t.stateNode===null)throw Error(J(162));n=t.memoizedProps,a=t.stateNode;try{a.nodeValue=n}catch(g){gt(t,t.return,g)}}break;case 3:if(_f=null,i=In,In=Zf(e.containerInfo),Ua(e,t),In=i,Ba(t),n&4&&a!==null&&a.memoizedState.isDehydrated)try{bo(e.containerInfo)}catch(g){gt(t,t.return,g)}gm&&(gm=!1,bM(t));break;case 4:n=In,In=Zf(t.stateNode.containerInfo),Ua(e,t),Ba(t),In=n;break;case 12:Ua(e,t),Ba(t);break;case 31:Ua(e,t),Ba(t),n&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,af(t,n)));break;case 13:Ua(e,t),Ba(t),t.child.flags&8192&&t.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(cd=$a()),n&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,af(t,n)));break;case 22:i=t.memoizedState!==null;var l=a!==null&&a.memoizedState!==null,u=xi,c=qt;if(xi=u||i,qt=c||l,Ua(e,t),qt=c,xi=u,Ba(t),n&8192)e:for(e=t.stateNode,e._visibility=i?e._visibility&-2:e._visibility|1,i&&(a===null||l||xi||qt||Zs(t)),a=null,e=t;;){if(e.tag===5||e.tag===26){if(a===null){l=a=e;try{if(s=l.stateNode,i)r=s.style,typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none";else{o=l.stateNode;var f=l.memoizedProps.style,d=f!=null&&f.hasOwnProperty("display")?f.display:null;o.style.display=d==null||typeof d=="boolean"?"":(""+d).trim()}}catch(g){gt(l,l.return,g)}}}else if(e.tag===6){if(a===null){l=e;try{l.stateNode.nodeValue=i?"":l.memoizedProps}catch(g){gt(l,l.return,g)}}}else if(e.tag===18){if(a===null){l=e;try{var p=l.stateNode;i?fS(p,!0):fS(l.stateNode,!1)}catch(g){gt(l,l.return,g)}}}else if((e.tag!==22&&e.tag!==23||e.memoizedState===null||e===t)&&e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;a===e&&(a=null),e=e.return}a===e&&(a=null),e.sibling.return=e.return,e=e.sibling}n&4&&(n=t.updateQueue,n!==null&&(a=n.retryQueue,a!==null&&(n.retryQueue=null,af(t,a))));break;case 19:Ua(e,t),Ba(t),n&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,af(t,n)));break;case 30:break;case 21:break;default:Ua(e,t),Ba(t)}}function Ba(t){var e=t.flags;if(e&2){try{for(var a,n=t.return;n!==null;){if(mM(n)){a=n;break}n=n.return}if(a==null)throw Error(J(160));switch(a.tag){case 27:var i=a.stateNode,s=mm(t);kf(t,s,i);break;case 5:var r=a.stateNode;a.flags&32&&(mo(r,""),a.flags&=-33);var o=mm(t);kf(t,o,r);break;case 3:case 4:var l=a.stateNode.containerInfo,u=mm(t);ng(t,u,l);break;default:throw Error(J(161))}}catch(c){gt(t,t.return,c)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function bM(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var e=t;bM(e),e.tag===5&&e.flags&1024&&e.stateNode.reset(),t=t.sibling}}function pi(t,e){if(e.subtreeFlags&8772)for(e=e.child;e!==null;)xM(t,e.alternate,e),e=e.sibling}function Zs(t){for(t=t.child;t!==null;){var e=t;switch(e.tag){case 0:case 11:case 14:case 15:_s(4,e,e.return),Zs(e);break;case 1:Zn(e,e.return);var a=e.stateNode;typeof a.componentWillUnmount=="function"&&hM(e,e.return,a),Zs(e);break;case 27:eu(e.stateNode);case 26:case 5:Zn(e,e.return),Zs(e);break;case 22:e.memoizedState===null&&Zs(e);break;case 30:Zs(e);break;default:Zs(e)}t=t.sibling}}function mi(t,e,a){for(a=a&&(e.subtreeFlags&8772)!==0,e=e.child;e!==null;){var n=e.alternate,i=t,s=e,r=s.flags;switch(s.tag){case 0:case 11:case 15:mi(i,s,a),bu(4,s);break;case 1:if(mi(i,s,a),n=s,i=n.stateNode,typeof i.componentDidMount=="function")try{i.componentDidMount()}catch(u){gt(n,n.return,u)}if(n=s,i=n.updateQueue,i!==null){var o=n.stateNode;try{var l=i.shared.hiddenCallbacks;if(l!==null)for(i.shared.hiddenCallbacks=null,i=0;i<l.length;i++)S_(l[i],o)}catch(u){gt(n,n.return,u)}}a&&r&64&&dM(s),Jl(s,s.return);break;case 27:gM(s);case 26:case 5:mi(i,s,a),a&&n===null&&r&4&&pM(s),Jl(s,s.return);break;case 12:mi(i,s,a);break;case 31:mi(i,s,a),a&&r&4&&SM(i,s);break;case 13:mi(i,s,a),a&&r&4&&_M(i,s);break;case 22:s.memoizedState===null&&mi(i,s,a),Jl(s,s.return);break;case 30:break;default:mi(i,s,a)}e=e.sibling}}function ax(t,e){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&_u(a))}function nx(t,e){t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&_u(t))}function wn(t,e,a,n){if(e.subtreeFlags&10256)for(e=e.child;e!==null;)CM(t,e,a,n),e=e.sibling}function CM(t,e,a,n){var i=e.flags;switch(e.tag){case 0:case 11:case 15:wn(t,e,a,n),i&2048&&bu(9,e);break;case 1:wn(t,e,a,n);break;case 3:wn(t,e,a,n),i&2048&&(t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&_u(t)));break;case 12:if(i&2048){wn(t,e,a,n),t=e.stateNode;try{var s=e.memoizedProps,r=s.id,o=s.onPostCommit;typeof o=="function"&&o(r,e.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(l){gt(e,e.return,l)}}else wn(t,e,a,n);break;case 31:wn(t,e,a,n);break;case 13:wn(t,e,a,n);break;case 23:break;case 22:s=e.stateNode,r=e.alternate,e.memoizedState!==null?s._visibility&2?wn(t,e,a,n):Ql(t,e):s._visibility&2?wn(t,e,a,n):(s._visibility|=2,Wr(t,e,a,n,(e.subtreeFlags&10256)!==0||!1)),i&2048&&ax(r,e);break;case 24:wn(t,e,a,n),i&2048&&nx(e.alternate,e);break;default:wn(t,e,a,n)}}function Wr(t,e,a,n,i){for(i=i&&((e.subtreeFlags&10256)!==0||!1),e=e.child;e!==null;){var s=t,r=e,o=a,l=n,u=r.flags;switch(r.tag){case 0:case 11:case 15:Wr(s,r,o,l,i),bu(8,r);break;case 23:break;case 22:var c=r.stateNode;r.memoizedState!==null?c._visibility&2?Wr(s,r,o,l,i):Ql(s,r):(c._visibility|=2,Wr(s,r,o,l,i)),i&&u&2048&&ax(r.alternate,r);break;case 24:Wr(s,r,o,l,i),i&&u&2048&&nx(r.alternate,r);break;default:Wr(s,r,o,l,i)}e=e.sibling}}function Ql(t,e){if(e.subtreeFlags&10256)for(e=e.child;e!==null;){var a=t,n=e,i=n.flags;switch(n.tag){case 22:Ql(a,n),i&2048&&ax(n.alternate,n);break;case 24:Ql(a,n),i&2048&&nx(n.alternate,n);break;default:Ql(a,n)}e=e.sibling}}var Hl=8192;function qr(t,e,a){if(t.subtreeFlags&Hl)for(t=t.child;t!==null;)TM(t,e,a),t=t.sibling}function TM(t,e,a){switch(t.tag){case 26:qr(t,e,a),t.flags&Hl&&t.memoizedState!==null&&sE(a,In,t.memoizedState,t.memoizedProps);break;case 5:qr(t,e,a);break;case 3:case 4:var n=In;In=Zf(t.stateNode.containerInfo),qr(t,e,a),In=n;break;case 22:t.memoizedState===null&&(n=t.alternate,n!==null&&n.memoizedState!==null?(n=Hl,Hl=16777216,qr(t,e,a),Hl=n):qr(t,e,a));break;default:qr(t,e,a)}}function LM(t){var e=t.alternate;if(e!==null&&(t=e.child,t!==null)){e.child=null;do e=t.sibling,t.sibling=null,t=e;while(t!==null)}}function Ul(t){var e=t.deletions;if(t.flags&16){if(e!==null)for(var a=0;a<e.length;a++){var n=e[a];sa=n,EM(n,t)}LM(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)AM(t),t=t.sibling}function AM(t){switch(t.tag){case 0:case 11:case 15:Ul(t),t.flags&2048&&_s(9,t,t.return);break;case 3:Ul(t);break;case 12:Ul(t);break;case 22:var e=t.stateNode;t.memoizedState!==null&&e._visibility&2&&(t.return===null||t.return.tag!==13)?(e._visibility&=-3,vf(t)):Ul(t);break;default:Ul(t)}}function vf(t){var e=t.deletions;if(t.flags&16){if(e!==null)for(var a=0;a<e.length;a++){var n=e[a];sa=n,EM(n,t)}LM(t)}for(t=t.child;t!==null;){switch(e=t,e.tag){case 0:case 11:case 15:_s(8,e,e.return),vf(e);break;case 22:a=e.stateNode,a._visibility&2&&(a._visibility&=-3,vf(e));break;default:vf(e)}t=t.sibling}}function EM(t,e){for(;sa!==null;){var a=sa;switch(a.tag){case 0:case 11:case 15:_s(8,a,e);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var n=a.memoizedState.cachePool.pool;n!=null&&n.refCount++}break;case 24:_u(a.memoizedState.cache)}if(n=a.child,n!==null)n.return=a,sa=n;else e:for(a=t;sa!==null;){n=sa;var i=n.sibling,s=n.return;if(yM(n),n===a){sa=null;break e}if(i!==null){i.return=s,sa=i;break e}sa=s}}}var M1={getCacheForType:function(t){var e=pa(Wt),a=e.data.get(t);return a===void 0&&(a=t(),e.data.set(t,a)),a},cacheSignal:function(){return pa(Wt).controller.signal}},b1=typeof WeakMap=="function"?WeakMap:Map,ut=0,Mt=null,$e=null,it=0,mt=0,Ka=null,os=!1,Eo=!1,ix=!1,Ei=0,kt=0,Ms=0,$s=0,sx=0,ja=0,vo=0,jl=null,Oa=null,ig=!1,cd=0,wM=0,Hf=1/0,Vf=null,ps=null,Qt=0,ms=null,So=null,bi=0,sg=0,rg=null,IM=null,$l=0,og=null;function an(){return ut&2&&it!==0?it&-it:Fe.T!==null?ox():zS()}function RM(){if(ja===0)if(!(it&536870912)||st){var t=Xc;Xc<<=1,!(Xc&3932160)&&(Xc=262144),ja=t}else ja=536870912;return t=sn.current,t!==null&&(t.flags|=32),ja}function Fa(t,e,a){(t===Mt&&(mt===2||mt===9)||t.cancelPendingCommit!==null)&&(_o(t,0),ls(t,it,ja,!1)),yu(t,a),(!(ut&2)||t!==Mt)&&(t===Mt&&(!(ut&2)&&($s|=a),kt===4&&ls(t,it,ja,!1)),Qn(t))}function DM(t,e,a){if(ut&6)throw Error(J(327));var n=!a&&(e&127)===0&&(e&t.expiredLanes)===0||xu(t,e),i=n?L1(t,e):xm(t,e,!0),s=n;do{if(i===0){Eo&&!n&&ls(t,e,0,!1);break}else{if(a=t.current.alternate,s&&!C1(a)){i=xm(t,e,!1),s=!1;continue}if(i===2){if(s=e,t.errorRecoveryDisabledLanes&s)var r=0;else r=t.pendingLanes&-536870913,r=r!==0?r:r&536870912?536870912:0;if(r!==0){e=r;e:{var o=t;i=jl;var l=o.current.memoizedState.isDehydrated;if(l&&(_o(o,r).flags|=256),r=xm(o,r,!1),r!==2){if(ix&&!l){o.errorRecoveryDisabledLanes|=s,$s|=s,i=4;break e}s=Oa,Oa=i,s!==null&&(Oa===null?Oa=s:Oa.push.apply(Oa,s))}i=r}if(s=!1,i!==2)continue}}if(i===1){_o(t,0),ls(t,e,0,!0);break}e:{switch(n=t,s=i,s){case 0:case 1:throw Error(J(345));case 4:if((e&4194048)!==e)break;case 6:ls(n,e,ja,!os);break e;case 2:Oa=null;break;case 3:case 5:break;default:throw Error(J(329))}if((e&62914560)===e&&(i=cd+300-$a(),10<i)){if(ls(n,e,ja,!os),$f(n,0,!0)!==0)break e;bi=e,n.timeoutHandle=jM(Jv.bind(null,n,a,Oa,Vf,ig,e,ja,$s,vo,os,s,"Throttled",-0,0),i);break e}Jv(n,a,Oa,Vf,ig,e,ja,$s,vo,os,s,null,-0,0)}}break}while(!0);Qn(t)}function Jv(t,e,a,n,i,s,r,o,l,u,c,f,d,p){if(t.timeoutHandle=-1,f=e.subtreeFlags,f&8192||(f&16785408)===16785408){f={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:vi},TM(e,s,f);var g=(s&62914560)===s?cd-$a():(s&4194048)===s?wM-$a():0;if(g=rE(f,g),g!==null){bi=s,t.cancelPendingCommit=g(jv.bind(null,t,e,s,a,n,i,r,o,l,c,f,null,d,p)),ls(t,s,r,!u);return}}jv(t,e,s,a,n,i,r,o,l)}function C1(t){for(var e=t;;){var a=e.tag;if((a===0||a===11||a===15)&&e.flags&16384&&(a=e.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var n=0;n<a.length;n++){var i=a[n],s=i.getSnapshot;i=i.value;try{if(!nn(s(),i))return!1}catch{return!1}}if(a=e.child,e.subtreeFlags&16384&&a!==null)a.return=e,e=a;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function ls(t,e,a,n){e&=~sx,e&=~$s,t.suspendedLanes|=e,t.pingedLanes&=~e,n&&(t.warmLanes|=e),n=t.expirationTimes;for(var i=e;0<i;){var s=31-tn(i),r=1<<s;n[s]=-1,i&=~r}a!==0&&NS(t,a,e)}function fd(){return ut&6?!0:(Cu(0,!1),!1)}function rx(){if($e!==null){if(mt===0)var t=$e.return;else t=$e,Si=ur=null,Wg(t),uo=null,ou=0,t=$e;for(;t!==null;)fM(t.alternate,t),t=t.return;$e=null}}function _o(t,e){var a=t.timeoutHandle;a!==-1&&(t.timeoutHandle=-1,V1(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),bi=0,rx(),Mt=t,$e=a=_i(t.current,null),it=e,mt=0,Ka=null,os=!1,Eo=xu(t,e),ix=!1,vo=ja=sx=$s=Ms=kt=0,Oa=jl=null,ig=!1,e&8&&(e|=e&32);var n=t.entangledLanes;if(n!==0)for(t=t.entanglements,n&=e;0<n;){var i=31-tn(n),s=1<<i;e|=t[i],n&=~s}return Ei=e,nd(),a}function PM(t,e){Ge=null,Fe.H=uu,e===Ao||e===sd?(e=Ev(),mt=3):e===Fg?(e=Ev(),mt=4):mt=e===ex?8:e!==null&&typeof e=="object"&&typeof e.then=="function"?6:1,Ka=e,$e===null&&(kt=1,Ff(t,vn(e,t.current)))}function UM(){var t=sn.current;return t===null?!0:(it&4194048)===it?_n===null:(it&62914560)===it||it&536870912?t===_n:!1}function BM(){var t=Fe.H;return Fe.H=uu,t===null?uu:t}function NM(){var t=Fe.A;return Fe.A=M1,t}function Gf(){kt=4,os||(it&4194048)!==it&&sn.current!==null||(Eo=!0),!(Ms&134217727)&&!($s&134217727)||Mt===null||ls(Mt,it,ja,!1)}function xm(t,e,a){var n=ut;ut|=2;var i=BM(),s=NM();(Mt!==t||it!==e)&&(Vf=null,_o(t,e)),e=!1;var r=kt;e:do try{if(mt!==0&&$e!==null){var o=$e,l=Ka;switch(mt){case 8:rx(),r=6;break e;case 3:case 2:case 9:case 6:sn.current===null&&(e=!0);var u=mt;if(mt=0,Ka=null,io(t,o,l,u),a&&Eo){r=0;break e}break;default:u=mt,mt=0,Ka=null,io(t,o,l,u)}}T1(),r=kt;break}catch(c){PM(t,c)}while(!0);return e&&t.shellSuspendCounter++,Si=ur=null,ut=n,Fe.H=i,Fe.A=s,$e===null&&(Mt=null,it=0,nd()),r}function T1(){for(;$e!==null;)OM($e)}function L1(t,e){var a=ut;ut|=2;var n=BM(),i=NM();Mt!==t||it!==e?(Vf=null,Hf=$a()+500,_o(t,e)):Eo=xu(t,e);e:do try{if(mt!==0&&$e!==null){e=$e;var s=Ka;t:switch(mt){case 1:mt=0,Ka=null,io(t,e,s,1);break;case 2:case 9:if(Av(s)){mt=0,Ka=null,Qv(e);break}e=function(){mt!==2&&mt!==9||Mt!==t||(mt=7),Qn(t)},s.then(e,e);break e;case 3:mt=7;break e;case 4:mt=5;break e;case 7:Av(s)?(mt=0,Ka=null,Qv(e)):(mt=0,Ka=null,io(t,e,s,7));break;case 5:var r=null;switch($e.tag){case 26:r=$e.memoizedState;case 5:case 27:var o=$e;if(r?nb(r):o.stateNode.complete){mt=0,Ka=null;var l=o.sibling;if(l!==null)$e=l;else{var u=o.return;u!==null?($e=u,dd(u)):$e=null}break t}}mt=0,Ka=null,io(t,e,s,5);break;case 6:mt=0,Ka=null,io(t,e,s,6);break;case 8:rx(),kt=6;break e;default:throw Error(J(462))}}A1();break}catch(c){PM(t,c)}while(!0);return Si=ur=null,Fe.H=n,Fe.A=i,ut=a,$e!==null?0:(Mt=null,it=0,nd(),kt)}function A1(){for(;$e!==null&&!JL();)OM($e)}function OM(t){var e=cM(t.alternate,t,Ei);t.memoizedProps=t.pendingProps,e===null?dd(t):$e=e}function Qv(t){var e=t,a=e.alternate;switch(e.tag){case 15:case 0:e=qv(a,e,e.pendingProps,e.type,void 0,it);break;case 11:e=qv(a,e,e.pendingProps,e.type.render,e.ref,it);break;case 5:Wg(e);default:fM(a,e),e=$e=f_(e,Ei),e=cM(a,e,Ei)}t.memoizedProps=t.pendingProps,e===null?dd(t):$e=e}function io(t,e,a,n){Si=ur=null,Wg(e),uo=null,ou=0;var i=e.return;try{if(m1(t,i,e,a,it)){kt=1,Ff(t,vn(a,t.current)),$e=null;return}}catch(s){if(i!==null)throw $e=i,s;kt=1,Ff(t,vn(a,t.current)),$e=null;return}e.flags&32768?(st||n===1?t=!0:Eo||it&536870912?t=!1:(os=t=!0,(n===2||n===9||n===3||n===6)&&(n=sn.current,n!==null&&n.tag===13&&(n.flags|=16384))),FM(e,t)):dd(e)}function dd(t){var e=t;do{if(e.flags&32768){FM(e,os);return}t=e.return;var a=y1(e.alternate,e,Ei);if(a!==null){$e=a;return}if(e=e.sibling,e!==null){$e=e;return}$e=e=t}while(e!==null);kt===0&&(kt=5)}function FM(t,e){do{var a=v1(t.alternate,t);if(a!==null){a.flags&=32767,$e=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!e&&(t=t.sibling,t!==null)){$e=t;return}$e=t=a}while(t!==null);kt=6,$e=null}function jv(t,e,a,n,i,s,r,o,l){t.cancelPendingCommit=null;do hd();while(Qt!==0);if(ut&6)throw Error(J(327));if(e!==null){if(e===t.current)throw Error(J(177));if(s=e.lanes|e.childLanes,s|=Rg,rA(t,a,s,r,o,l),t===Mt&&($e=Mt=null,it=0),So=e,ms=t,bi=a,sg=s,rg=i,IM=n,e.subtreeFlags&10256||e.flags&10256?(t.callbackNode=null,t.callbackPriority=0,R1(Af,function(){return GM(),null})):(t.callbackNode=null,t.callbackPriority=0),n=(e.flags&13878)!==0,e.subtreeFlags&13878||n){n=Fe.T,Fe.T=null,i=ct.p,ct.p=2,r=ut,ut|=4;try{S1(t,e,a)}finally{ut=r,ct.p=i,Fe.T=n}}Qt=1,zM(),kM(),HM()}}function zM(){if(Qt===1){Qt=0;var t=ms,e=So,a=(e.flags&13878)!==0;if(e.subtreeFlags&13878||a){a=Fe.T,Fe.T=null;var n=ct.p;ct.p=2;var i=ut;ut|=4;try{MM(e,t);var s=fg,r=n_(t.containerInfo),o=s.focusedElem,l=s.selectionRange;if(r!==o&&o&&o.ownerDocument&&a_(o.ownerDocument.documentElement,o)){if(l!==null&&Ig(o)){var u=l.start,c=l.end;if(c===void 0&&(c=u),"selectionStart"in o)o.selectionStart=u,o.selectionEnd=Math.min(c,o.value.length);else{var f=o.ownerDocument||document,d=f&&f.defaultView||window;if(d.getSelection){var p=d.getSelection(),g=o.textContent.length,y=Math.min(l.start,g),m=l.end===void 0?y:Math.min(l.end,g);!p.extend&&y>m&&(r=m,m=y,y=r);var h=Sv(o,y),x=Sv(o,m);if(h&&x&&(p.rangeCount!==1||p.anchorNode!==h.node||p.anchorOffset!==h.offset||p.focusNode!==x.node||p.focusOffset!==x.offset)){var S=f.createRange();S.setStart(h.node,h.offset),p.removeAllRanges(),y>m?(p.addRange(S),p.extend(x.node,x.offset)):(S.setEnd(x.node,x.offset),p.addRange(S))}}}}for(f=[],p=o;p=p.parentNode;)p.nodeType===1&&f.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<f.length;o++){var v=f[o];v.element.scrollLeft=v.left,v.element.scrollTop=v.top}}Qf=!!cg,fg=cg=null}finally{ut=i,ct.p=n,Fe.T=a}}t.current=e,Qt=2}}function kM(){if(Qt===2){Qt=0;var t=ms,e=So,a=(e.flags&8772)!==0;if(e.subtreeFlags&8772||a){a=Fe.T,Fe.T=null;var n=ct.p;ct.p=2;var i=ut;ut|=4;try{xM(t,e.alternate,e)}finally{ut=i,ct.p=n,Fe.T=a}}Qt=3}}function HM(){if(Qt===4||Qt===3){Qt=0,QL();var t=ms,e=So,a=bi,n=IM;e.subtreeFlags&10256||e.flags&10256?Qt=5:(Qt=0,So=ms=null,VM(t,t.pendingLanes));var i=t.pendingLanes;if(i===0&&(ps=null),bg(a),e=e.stateNode,en&&typeof en.onCommitFiberRoot=="function")try{en.onCommitFiberRoot(gu,e,void 0,(e.current.flags&128)===128)}catch{}if(n!==null){e=Fe.T,i=ct.p,ct.p=2,Fe.T=null;try{for(var s=t.onRecoverableError,r=0;r<n.length;r++){var o=n[r];s(o.value,{componentStack:o.stack})}}finally{Fe.T=e,ct.p=i}}bi&3&&hd(),Qn(t),i=t.pendingLanes,a&261930&&i&42?t===og?$l++:($l=0,og=t):$l=0,Cu(0,!1)}}function VM(t,e){(t.pooledCacheLanes&=e)===0&&(e=t.pooledCache,e!=null&&(t.pooledCache=null,_u(e)))}function hd(){return zM(),kM(),HM(),GM()}function GM(){if(Qt!==5)return!1;var t=ms,e=sg;sg=0;var a=bg(bi),n=Fe.T,i=ct.p;try{ct.p=32>a?32:a,Fe.T=null,a=rg,rg=null;var s=ms,r=bi;if(Qt=0,So=ms=null,bi=0,ut&6)throw Error(J(331));var o=ut;if(ut|=4,AM(s.current),CM(s,s.current,r,a),ut=o,Cu(0,!1),en&&typeof en.onPostCommitFiberRoot=="function")try{en.onPostCommitFiberRoot(gu,s)}catch{}return!0}finally{ct.p=i,Fe.T=n,VM(t,e)}}function $v(t,e,a){e=vn(a,e),e=eg(t.stateNode,e,2),t=hs(t,e,2),t!==null&&(yu(t,2),Qn(t))}function gt(t,e,a){if(t.tag===3)$v(t,t,a);else for(;e!==null;){if(e.tag===3){$v(e,t,a);break}else if(e.tag===1){var n=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof n.componentDidCatch=="function"&&(ps===null||!ps.has(n))){t=vn(a,t),a=iM(2),n=hs(e,a,2),n!==null&&(sM(a,n,e,t),yu(n,2),Qn(n));break}}e=e.return}}function ym(t,e,a){var n=t.pingCache;if(n===null){n=t.pingCache=new b1;var i=new Set;n.set(e,i)}else i=n.get(e),i===void 0&&(i=new Set,n.set(e,i));i.has(a)||(ix=!0,i.add(a),t=E1.bind(null,t,e,a),e.then(t,t))}function E1(t,e,a){var n=t.pingCache;n!==null&&n.delete(e),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,Mt===t&&(it&a)===a&&(kt===4||kt===3&&(it&62914560)===it&&300>$a()-cd?!(ut&2)&&_o(t,0):sx|=a,vo===it&&(vo=0)),Qn(t)}function qM(t,e){e===0&&(e=BS()),t=lr(t,e),t!==null&&(yu(t,e),Qn(t))}function w1(t){var e=t.memoizedState,a=0;e!==null&&(a=e.retryLane),qM(t,a)}function I1(t,e){var a=0;switch(t.tag){case 31:case 13:var n=t.stateNode,i=t.memoizedState;i!==null&&(a=i.retryLane);break;case 19:n=t.stateNode;break;case 22:n=t.stateNode._retryCache;break;default:throw Error(J(314))}n!==null&&n.delete(e),qM(t,a)}function R1(t,e){return _g(t,e)}var qf=null,Xr=null,lg=!1,Wf=!1,vm=!1,us=0;function Qn(t){t!==Xr&&t.next===null&&(Xr===null?qf=Xr=t:Xr=Xr.next=t),Wf=!0,lg||(lg=!0,P1())}function Cu(t,e){if(!vm&&Wf){vm=!0;do for(var a=!1,n=qf;n!==null;){if(!e)if(t!==0){var i=n.pendingLanes;if(i===0)var s=0;else{var r=n.suspendedLanes,o=n.pingedLanes;s=(1<<31-tn(42|t)+1)-1,s&=i&~(r&~o),s=s&201326741?s&201326741|1:s?s|2:0}s!==0&&(a=!0,eS(n,s))}else s=it,s=$f(n,n===Mt?s:0,n.cancelPendingCommit!==null||n.timeoutHandle!==-1),!(s&3)||xu(n,s)||(a=!0,eS(n,s));n=n.next}while(a);vm=!1}}function D1(){WM()}function WM(){Wf=lg=!1;var t=0;us!==0&&H1()&&(t=us);for(var e=$a(),a=null,n=qf;n!==null;){var i=n.next,s=XM(n,e);s===0?(n.next=null,a===null?qf=i:a.next=i,i===null&&(Xr=a)):(a=n,(t!==0||s&3)&&(Wf=!0)),n=i}Qt!==0&&Qt!==5||Cu(t,!1),us!==0&&(us=0)}function XM(t,e){for(var a=t.suspendedLanes,n=t.pingedLanes,i=t.expirationTimes,s=t.pendingLanes&-62914561;0<s;){var r=31-tn(s),o=1<<r,l=i[r];l===-1?(!(o&a)||o&n)&&(i[r]=sA(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}if(e=Mt,a=it,a=$f(t,t===e?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),n=t.callbackNode,a===0||t===e&&(mt===2||mt===9)||t.cancelPendingCommit!==null)return n!==null&&n!==null&&Zp(n),t.callbackNode=null,t.callbackPriority=0;if(!(a&3)||xu(t,a)){if(e=a&-a,e===t.callbackPriority)return e;switch(n!==null&&Zp(n),bg(a)){case 2:case 8:a=PS;break;case 32:a=Af;break;case 268435456:a=US;break;default:a=Af}return n=YM.bind(null,t),a=_g(a,n),t.callbackPriority=e,t.callbackNode=a,e}return n!==null&&n!==null&&Zp(n),t.callbackPriority=2,t.callbackNode=null,2}function YM(t,e){if(Qt!==0&&Qt!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(hd()&&t.callbackNode!==a)return null;var n=it;return n=$f(t,t===Mt?n:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),n===0?null:(DM(t,n,e),XM(t,$a()),t.callbackNode!=null&&t.callbackNode===a?YM.bind(null,t):null)}function eS(t,e){if(hd())return null;DM(t,e,!0)}function P1(){G1(function(){ut&6?_g(DS,D1):WM()})}function ox(){if(us===0){var t=go;t===0&&(t=Wc,Wc<<=1,!(Wc&261888)&&(Wc=256)),us=t}return us}function tS(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:cf(""+t)}function aS(t,e){var a=e.ownerDocument.createElement("input");return a.name=e.name,a.value=e.value,t.id&&a.setAttribute("form",t.id),e.parentNode.insertBefore(a,e),t=new FormData(t),a.parentNode.removeChild(a),t}function U1(t,e,a,n,i){if(e==="submit"&&a&&a.stateNode===i){var s=tS((i[za]||null).action),r=n.submitter;r&&(e=(e=r[za]||null)?tS(e.formAction):r.getAttribute("formAction"),e!==null&&(s=e,r=null));var o=new ed("action","action",null,n,i);t.push({event:o,listeners:[{instance:null,listener:function(){if(n.defaultPrevented){if(us!==0){var l=r?aS(i,r):new FormData(i);jm(a,{pending:!0,data:l,method:i.method,action:s},null,l)}}else typeof s=="function"&&(o.preventDefault(),l=r?aS(i,r):new FormData(i),jm(a,{pending:!0,data:l,method:i.method,action:s},s,l))},currentTarget:i}]})}}for(nf=0;nf<km.length;nf++)sf=km[nf],nS=sf.toLowerCase(),iS=sf[0].toUpperCase()+sf.slice(1),Rn(nS,"on"+iS);var sf,nS,iS,nf;Rn(s_,"onAnimationEnd");Rn(r_,"onAnimationIteration");Rn(o_,"onAnimationStart");Rn("dblclick","onDoubleClick");Rn("focusin","onFocus");Rn("focusout","onBlur");Rn(jA,"onTransitionRun");Rn($A,"onTransitionStart");Rn(e1,"onTransitionCancel");Rn(l_,"onTransitionEnd");po("onMouseEnter",["mouseout","mouseover"]);po("onMouseLeave",["mouseout","mouseover"]);po("onPointerEnter",["pointerout","pointerover"]);po("onPointerLeave",["pointerout","pointerover"]);sr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));sr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));sr("onBeforeInput",["compositionend","keypress","textInput","paste"]);sr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));sr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));sr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var cu="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),B1=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(cu));function ZM(t,e){e=(e&4)!==0;for(var a=0;a<t.length;a++){var n=t[a],i=n.event;n=n.listeners;e:{var s=void 0;if(e)for(var r=n.length-1;0<=r;r--){var o=n[r],l=o.instance,u=o.currentTarget;if(o=o.listener,l!==s&&i.isPropagationStopped())break e;s=o,i.currentTarget=u;try{s(i)}catch(c){wf(c)}i.currentTarget=null,s=l}else for(r=0;r<n.length;r++){if(o=n[r],l=o.instance,u=o.currentTarget,o=o.listener,l!==s&&i.isPropagationStopped())break e;s=o,i.currentTarget=u;try{s(i)}catch(c){wf(c)}i.currentTarget=null,s=l}}}}function je(t,e){var a=e[Dm];a===void 0&&(a=e[Dm]=new Set);var n=t+"__bubble";a.has(n)||(KM(e,t,2,!1),a.add(n))}function Sm(t,e,a){var n=0;e&&(n|=4),KM(a,t,n,e)}var rf="_reactListening"+Math.random().toString(36).slice(2);function lx(t){if(!t[rf]){t[rf]=!0,kS.forEach(function(a){a!=="selectionchange"&&(B1.has(a)||Sm(a,!1,t),Sm(a,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[rf]||(e[rf]=!0,Sm("selectionchange",!1,e))}}function KM(t,e,a,n){switch(lb(e)){case 2:var i=uE;break;case 8:i=cE;break;default:i=dx}a=i.bind(null,e,a,t),i=void 0,!Om||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),n?i!==void 0?t.addEventListener(e,a,{capture:!0,passive:i}):t.addEventListener(e,a,!0):i!==void 0?t.addEventListener(e,a,{passive:i}):t.addEventListener(e,a,!1)}function _m(t,e,a,n,i){var s=n;if(!(e&1)&&!(e&2)&&n!==null)e:for(;;){if(n===null)return;var r=n.tag;if(r===3||r===4){var o=n.stateNode.containerInfo;if(o===i)break;if(r===4)for(r=n.return;r!==null;){var l=r.tag;if((l===3||l===4)&&r.stateNode.containerInfo===i)return;r=r.return}for(;o!==null;){if(r=Kr(o),r===null)return;if(l=r.tag,l===5||l===6||l===26||l===27){n=s=r;continue e}o=o.parentNode}}n=n.return}ZS(function(){var u=s,c=Lg(a),f=[];e:{var d=u_.get(t);if(d!==void 0){var p=ed,g=t;switch(t){case"keypress":if(df(a)===0)break e;case"keydown":case"keyup":p=IA;break;case"focusin":g="focus",p=$p;break;case"focusout":g="blur",p=$p;break;case"beforeblur":case"afterblur":p=$p;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=fv;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=yA;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=PA;break;case s_:case r_:case o_:p=_A;break;case l_:p=BA;break;case"scroll":case"scrollend":p=gA;break;case"wheel":p=OA;break;case"copy":case"cut":case"paste":p=bA;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=hv;break;case"toggle":case"beforetoggle":p=zA}var y=(e&4)!==0,m=!y&&(t==="scroll"||t==="scrollend"),h=y?d!==null?d+"Capture":null:d;y=[];for(var x=u,S;x!==null;){var v=x;if(S=v.stateNode,v=v.tag,v!==5&&v!==26&&v!==27||S===null||h===null||(v=au(x,h),v!=null&&y.push(fu(x,v,S))),m)break;x=x.return}0<y.length&&(d=new p(d,g,null,a,c),f.push({event:d,listeners:y}))}}if(!(e&7)){e:{if(d=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",d&&a!==Nm&&(g=a.relatedTarget||a.fromElement)&&(Kr(g)||g[Co]))break e;if((p||d)&&(d=c.window===c?c:(d=c.ownerDocument)?d.defaultView||d.parentWindow:window,p?(g=a.relatedTarget||a.toElement,p=u,g=g?Kr(g):null,g!==null&&(m=mu(g),y=g.tag,g!==m||y!==5&&y!==27&&y!==6)&&(g=null)):(p=null,g=u),p!==g)){if(y=fv,v="onMouseLeave",h="onMouseEnter",x="mouse",(t==="pointerout"||t==="pointerover")&&(y=hv,v="onPointerLeave",h="onPointerEnter",x="pointer"),m=p==null?d:zl(p),S=g==null?d:zl(g),d=new y(v,x+"leave",p,a,c),d.target=m,d.relatedTarget=S,v=null,Kr(c)===u&&(y=new y(h,x+"enter",g,a,c),y.target=S,y.relatedTarget=m,v=y),m=v,p&&g)t:{for(y=N1,h=p,x=g,S=0,v=h;v;v=y(v))S++;v=0;for(var T=x;T;T=y(T))v++;for(;0<S-v;)h=y(h),S--;for(;0<v-S;)x=y(x),v--;for(;S--;){if(h===x||x!==null&&h===x.alternate){y=h;break t}h=y(h),x=y(x)}y=null}else y=null;p!==null&&sS(f,d,p,y,!1),g!==null&&m!==null&&sS(f,m,g,y,!0)}}e:{if(d=u?zl(u):window,p=d.nodeName&&d.nodeName.toLowerCase(),p==="select"||p==="input"&&d.type==="file")var E=xv;else if(gv(d))if(e_)E=KA;else{E=YA;var A=XA}else p=d.nodeName,!p||p.toLowerCase()!=="input"||d.type!=="checkbox"&&d.type!=="radio"?u&&Tg(u.elementType)&&(E=xv):E=ZA;if(E&&(E=E(t,u))){$S(f,E,a,c);break e}A&&A(t,d,u),t==="focusout"&&u&&d.type==="number"&&u.memoizedProps.value!=null&&Bm(d,"number",d.value)}switch(A=u?zl(u):window,t){case"focusin":(gv(A)||A.contentEditable==="true")&&(jr=A,Fm=u,ql=null);break;case"focusout":ql=Fm=jr=null;break;case"mousedown":zm=!0;break;case"contextmenu":case"mouseup":case"dragend":zm=!1,_v(f,a,c);break;case"selectionchange":if(QA)break;case"keydown":case"keyup":_v(f,a,c)}var R;if(wg)e:{switch(t){case"compositionstart":var M="onCompositionStart";break e;case"compositionend":M="onCompositionEnd";break e;case"compositionupdate":M="onCompositionUpdate";break e}M=void 0}else Qr?QS(t,a)&&(M="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(M="onCompositionStart");M&&(JS&&a.locale!=="ko"&&(Qr||M!=="onCompositionStart"?M==="onCompositionEnd"&&Qr&&(R=KS()):(rs=c,Ag="value"in rs?rs.value:rs.textContent,Qr=!0)),A=Xf(u,M),0<A.length&&(M=new dv(M,t,null,a,c),f.push({event:M,listeners:A}),R?M.data=R:(R=jS(a),R!==null&&(M.data=R)))),(R=HA?VA(t,a):GA(t,a))&&(M=Xf(u,"onBeforeInput"),0<M.length&&(A=new dv("onBeforeInput","beforeinput",null,a,c),f.push({event:A,listeners:M}),A.data=R)),U1(f,t,u,a,c)}ZM(f,e)})}function fu(t,e,a){return{instance:t,listener:e,currentTarget:a}}function Xf(t,e){for(var a=e+"Capture",n=[];t!==null;){var i=t,s=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||s===null||(i=au(t,a),i!=null&&n.unshift(fu(t,i,s)),i=au(t,e),i!=null&&n.push(fu(t,i,s))),t.tag===3)return n;t=t.return}return[]}function N1(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function sS(t,e,a,n,i){for(var s=e._reactName,r=[];a!==null&&a!==n;){var o=a,l=o.alternate,u=o.stateNode;if(o=o.tag,l!==null&&l===n)break;o!==5&&o!==26&&o!==27||u===null||(l=u,i?(u=au(a,s),u!=null&&r.unshift(fu(a,u,l))):i||(u=au(a,s),u!=null&&r.push(fu(a,u,l)))),a=a.return}r.length!==0&&t.push({event:e,listeners:r})}var O1=/\r\n?/g,F1=/\u0000|\uFFFD/g;function rS(t){return(typeof t=="string"?t:""+t).replace(O1,`
`).replace(F1,"")}function JM(t,e){return e=rS(e),rS(t)===e}function vt(t,e,a,n,i,s){switch(a){case"children":typeof n=="string"?e==="body"||e==="textarea"&&n===""||mo(t,n):(typeof n=="number"||typeof n=="bigint")&&e!=="body"&&mo(t,""+n);break;case"className":Zc(t,"class",n);break;case"tabIndex":Zc(t,"tabindex",n);break;case"dir":case"role":case"viewBox":case"width":case"height":Zc(t,a,n);break;case"style":YS(t,n,s);break;case"data":if(e!=="object"){Zc(t,"data",n);break}case"src":case"href":if(n===""&&(e!=="a"||a!=="href")){t.removeAttribute(a);break}if(n==null||typeof n=="function"||typeof n=="symbol"||typeof n=="boolean"){t.removeAttribute(a);break}n=cf(""+n),t.setAttribute(a,n);break;case"action":case"formAction":if(typeof n=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof s=="function"&&(a==="formAction"?(e!=="input"&&vt(t,e,"name",i.name,i,null),vt(t,e,"formEncType",i.formEncType,i,null),vt(t,e,"formMethod",i.formMethod,i,null),vt(t,e,"formTarget",i.formTarget,i,null)):(vt(t,e,"encType",i.encType,i,null),vt(t,e,"method",i.method,i,null),vt(t,e,"target",i.target,i,null)));if(n==null||typeof n=="symbol"||typeof n=="boolean"){t.removeAttribute(a);break}n=cf(""+n),t.setAttribute(a,n);break;case"onClick":n!=null&&(t.onclick=vi);break;case"onScroll":n!=null&&je("scroll",t);break;case"onScrollEnd":n!=null&&je("scrollend",t);break;case"dangerouslySetInnerHTML":if(n!=null){if(typeof n!="object"||!("__html"in n))throw Error(J(61));if(a=n.__html,a!=null){if(i.children!=null)throw Error(J(60));t.innerHTML=a}}break;case"multiple":t.multiple=n&&typeof n!="function"&&typeof n!="symbol";break;case"muted":t.muted=n&&typeof n!="function"&&typeof n!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(n==null||typeof n=="function"||typeof n=="boolean"||typeof n=="symbol"){t.removeAttribute("xlink:href");break}a=cf(""+n),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":n!=null&&typeof n!="function"&&typeof n!="symbol"?t.setAttribute(a,""+n):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":n&&typeof n!="function"&&typeof n!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":n===!0?t.setAttribute(a,""):n!==!1&&n!=null&&typeof n!="function"&&typeof n!="symbol"?t.setAttribute(a,n):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":n!=null&&typeof n!="function"&&typeof n!="symbol"&&!isNaN(n)&&1<=n?t.setAttribute(a,n):t.removeAttribute(a);break;case"rowSpan":case"start":n==null||typeof n=="function"||typeof n=="symbol"||isNaN(n)?t.removeAttribute(a):t.setAttribute(a,n);break;case"popover":je("beforetoggle",t),je("toggle",t),uf(t,"popover",n);break;case"xlinkActuate":fi(t,"http://www.w3.org/1999/xlink","xlink:actuate",n);break;case"xlinkArcrole":fi(t,"http://www.w3.org/1999/xlink","xlink:arcrole",n);break;case"xlinkRole":fi(t,"http://www.w3.org/1999/xlink","xlink:role",n);break;case"xlinkShow":fi(t,"http://www.w3.org/1999/xlink","xlink:show",n);break;case"xlinkTitle":fi(t,"http://www.w3.org/1999/xlink","xlink:title",n);break;case"xlinkType":fi(t,"http://www.w3.org/1999/xlink","xlink:type",n);break;case"xmlBase":fi(t,"http://www.w3.org/XML/1998/namespace","xml:base",n);break;case"xmlLang":fi(t,"http://www.w3.org/XML/1998/namespace","xml:lang",n);break;case"xmlSpace":fi(t,"http://www.w3.org/XML/1998/namespace","xml:space",n);break;case"is":uf(t,"is",n);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=pA.get(a)||a,uf(t,a,n))}}function ug(t,e,a,n,i,s){switch(a){case"style":YS(t,n,s);break;case"dangerouslySetInnerHTML":if(n!=null){if(typeof n!="object"||!("__html"in n))throw Error(J(61));if(a=n.__html,a!=null){if(i.children!=null)throw Error(J(60));t.innerHTML=a}}break;case"children":typeof n=="string"?mo(t,n):(typeof n=="number"||typeof n=="bigint")&&mo(t,""+n);break;case"onScroll":n!=null&&je("scroll",t);break;case"onScrollEnd":n!=null&&je("scrollend",t);break;case"onClick":n!=null&&(t.onclick=vi);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!HS.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(i=a.endsWith("Capture"),e=a.slice(2,i?a.length-7:void 0),s=t[za]||null,s=s!=null?s[a]:null,typeof s=="function"&&t.removeEventListener(e,s,i),typeof n=="function")){typeof s!="function"&&s!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(e,n,i);break e}a in t?t[a]=n:n===!0?t.setAttribute(a,""):uf(t,a,n)}}}function ma(t,e,a){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":je("error",t),je("load",t);var n=!1,i=!1,s;for(s in a)if(a.hasOwnProperty(s)){var r=a[s];if(r!=null)switch(s){case"src":n=!0;break;case"srcSet":i=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(J(137,e));default:vt(t,e,s,r,a,null)}}i&&vt(t,e,"srcSet",a.srcSet,a,null),n&&vt(t,e,"src",a.src,a,null);return;case"input":je("invalid",t);var o=s=r=i=null,l=null,u=null;for(n in a)if(a.hasOwnProperty(n)){var c=a[n];if(c!=null)switch(n){case"name":i=c;break;case"type":r=c;break;case"checked":l=c;break;case"defaultChecked":u=c;break;case"value":s=c;break;case"defaultValue":o=c;break;case"children":case"dangerouslySetInnerHTML":if(c!=null)throw Error(J(137,e));break;default:vt(t,e,n,c,a,null)}}qS(t,s,o,l,u,r,i,!1);return;case"select":je("invalid",t),n=r=s=null;for(i in a)if(a.hasOwnProperty(i)&&(o=a[i],o!=null))switch(i){case"value":s=o;break;case"defaultValue":r=o;break;case"multiple":n=o;default:vt(t,e,i,o,a,null)}e=s,a=r,t.multiple=!!n,e!=null?ro(t,!!n,e,!1):a!=null&&ro(t,!!n,a,!0);return;case"textarea":je("invalid",t),s=i=n=null;for(r in a)if(a.hasOwnProperty(r)&&(o=a[r],o!=null))switch(r){case"value":n=o;break;case"defaultValue":i=o;break;case"children":s=o;break;case"dangerouslySetInnerHTML":if(o!=null)throw Error(J(91));break;default:vt(t,e,r,o,a,null)}XS(t,n,i,s);return;case"option":for(l in a)if(a.hasOwnProperty(l)&&(n=a[l],n!=null))switch(l){case"selected":t.selected=n&&typeof n!="function"&&typeof n!="symbol";break;default:vt(t,e,l,n,a,null)}return;case"dialog":je("beforetoggle",t),je("toggle",t),je("cancel",t),je("close",t);break;case"iframe":case"object":je("load",t);break;case"video":case"audio":for(n=0;n<cu.length;n++)je(cu[n],t);break;case"image":je("error",t),je("load",t);break;case"details":je("toggle",t);break;case"embed":case"source":case"link":je("error",t),je("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(u in a)if(a.hasOwnProperty(u)&&(n=a[u],n!=null))switch(u){case"children":case"dangerouslySetInnerHTML":throw Error(J(137,e));default:vt(t,e,u,n,a,null)}return;default:if(Tg(e)){for(c in a)a.hasOwnProperty(c)&&(n=a[c],n!==void 0&&ug(t,e,c,n,a,void 0));return}}for(o in a)a.hasOwnProperty(o)&&(n=a[o],n!=null&&vt(t,e,o,n,a,null))}function z1(t,e,a,n){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var i=null,s=null,r=null,o=null,l=null,u=null,c=null;for(p in a){var f=a[p];if(a.hasOwnProperty(p)&&f!=null)switch(p){case"checked":break;case"value":break;case"defaultValue":l=f;default:n.hasOwnProperty(p)||vt(t,e,p,null,n,f)}}for(var d in n){var p=n[d];if(f=a[d],n.hasOwnProperty(d)&&(p!=null||f!=null))switch(d){case"type":s=p;break;case"name":i=p;break;case"checked":u=p;break;case"defaultChecked":c=p;break;case"value":r=p;break;case"defaultValue":o=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(J(137,e));break;default:p!==f&&vt(t,e,d,p,n,f)}}Um(t,r,o,l,u,c,s,i);return;case"select":p=r=o=d=null;for(s in a)if(l=a[s],a.hasOwnProperty(s)&&l!=null)switch(s){case"value":break;case"multiple":p=l;default:n.hasOwnProperty(s)||vt(t,e,s,null,n,l)}for(i in n)if(s=n[i],l=a[i],n.hasOwnProperty(i)&&(s!=null||l!=null))switch(i){case"value":d=s;break;case"defaultValue":o=s;break;case"multiple":r=s;default:s!==l&&vt(t,e,i,s,n,l)}e=o,a=r,n=p,d!=null?ro(t,!!a,d,!1):!!n!=!!a&&(e!=null?ro(t,!!a,e,!0):ro(t,!!a,a?[]:"",!1));return;case"textarea":p=d=null;for(o in a)if(i=a[o],a.hasOwnProperty(o)&&i!=null&&!n.hasOwnProperty(o))switch(o){case"value":break;case"children":break;default:vt(t,e,o,null,n,i)}for(r in n)if(i=n[r],s=a[r],n.hasOwnProperty(r)&&(i!=null||s!=null))switch(r){case"value":d=i;break;case"defaultValue":p=i;break;case"children":break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(J(91));break;default:i!==s&&vt(t,e,r,i,n,s)}WS(t,d,p);return;case"option":for(var g in a)if(d=a[g],a.hasOwnProperty(g)&&d!=null&&!n.hasOwnProperty(g))switch(g){case"selected":t.selected=!1;break;default:vt(t,e,g,null,n,d)}for(l in n)if(d=n[l],p=a[l],n.hasOwnProperty(l)&&d!==p&&(d!=null||p!=null))switch(l){case"selected":t.selected=d&&typeof d!="function"&&typeof d!="symbol";break;default:vt(t,e,l,d,n,p)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var y in a)d=a[y],a.hasOwnProperty(y)&&d!=null&&!n.hasOwnProperty(y)&&vt(t,e,y,null,n,d);for(u in n)if(d=n[u],p=a[u],n.hasOwnProperty(u)&&d!==p&&(d!=null||p!=null))switch(u){case"children":case"dangerouslySetInnerHTML":if(d!=null)throw Error(J(137,e));break;default:vt(t,e,u,d,n,p)}return;default:if(Tg(e)){for(var m in a)d=a[m],a.hasOwnProperty(m)&&d!==void 0&&!n.hasOwnProperty(m)&&ug(t,e,m,void 0,n,d);for(c in n)d=n[c],p=a[c],!n.hasOwnProperty(c)||d===p||d===void 0&&p===void 0||ug(t,e,c,d,n,p);return}}for(var h in a)d=a[h],a.hasOwnProperty(h)&&d!=null&&!n.hasOwnProperty(h)&&vt(t,e,h,null,n,d);for(f in n)d=n[f],p=a[f],!n.hasOwnProperty(f)||d===p||d==null&&p==null||vt(t,e,f,d,n,p)}function oS(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function k1(){if(typeof performance.getEntriesByType=="function"){for(var t=0,e=0,a=performance.getEntriesByType("resource"),n=0;n<a.length;n++){var i=a[n],s=i.transferSize,r=i.initiatorType,o=i.duration;if(s&&o&&oS(r)){for(r=0,o=i.responseEnd,n+=1;n<a.length;n++){var l=a[n],u=l.startTime;if(u>o)break;var c=l.transferSize,f=l.initiatorType;c&&oS(f)&&(l=l.responseEnd,r+=c*(l<o?1:(o-u)/(l-u)))}if(--n,e+=8*(s+r)/(i.duration/1e3),t++,10<t)break}}if(0<t)return e/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var cg=null,fg=null;function Yf(t){return t.nodeType===9?t:t.ownerDocument}function lS(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function QM(t,e){if(t===0)switch(e){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&e==="foreignObject"?0:t}function dg(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.children=="bigint"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Mm=null;function H1(){var t=window.event;return t&&t.type==="popstate"?t===Mm?!1:(Mm=t,!0):(Mm=null,!1)}var jM=typeof setTimeout=="function"?setTimeout:void 0,V1=typeof clearTimeout=="function"?clearTimeout:void 0,uS=typeof Promise=="function"?Promise:void 0,G1=typeof queueMicrotask=="function"?queueMicrotask:typeof uS<"u"?function(t){return uS.resolve(null).then(t).catch(q1)}:jM;function q1(t){setTimeout(function(){throw t})}function Cs(t){return t==="head"}function cS(t,e){var a=e,n=0;do{var i=a.nextSibling;if(t.removeChild(a),i&&i.nodeType===8)if(a=i.data,a==="/$"||a==="/&"){if(n===0){t.removeChild(i),bo(e);return}n--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")n++;else if(a==="html")eu(t.ownerDocument.documentElement);else if(a==="head"){a=t.ownerDocument.head,eu(a);for(var s=a.firstChild;s;){var r=s.nextSibling,o=s.nodeName;s[vu]||o==="SCRIPT"||o==="STYLE"||o==="LINK"&&s.rel.toLowerCase()==="stylesheet"||a.removeChild(s),s=r}}else a==="body"&&eu(t.ownerDocument.body);a=i}while(a);bo(e)}function fS(t,e){var a=t;t=0;do{var n=a.nextSibling;if(a.nodeType===1?e?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(e?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),n&&n.nodeType===8)if(a=n.data,a==="/$"){if(t===0)break;t--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||t++;a=n}while(a)}function hg(t){var e=t.firstChild;for(e&&e.nodeType===10&&(e=e.nextSibling);e;){var a=e;switch(e=e.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":hg(a),Cg(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function W1(t,e,a,n){for(;t.nodeType===1;){var i=a;if(t.nodeName.toLowerCase()!==e.toLowerCase()){if(!n&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(n){if(!t[vu])switch(e){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(s=t.getAttribute("rel"),s==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(s!==i.rel||t.getAttribute("href")!==(i.href==null||i.href===""?null:i.href)||t.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin)||t.getAttribute("title")!==(i.title==null?null:i.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(s=t.getAttribute("src"),(s!==(i.src==null?null:i.src)||t.getAttribute("type")!==(i.type==null?null:i.type)||t.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin))&&s&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(e==="input"&&t.type==="hidden"){var s=i.name==null?null:""+i.name;if(i.type==="hidden"&&t.getAttribute("name")===s)return t}else return t;if(t=Mn(t.nextSibling),t===null)break}return null}function X1(t,e,a){if(e==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=Mn(t.nextSibling),t===null))return null;return t}function $M(t,e){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!e||(t=Mn(t.nextSibling),t===null))return null;return t}function pg(t){return t.data==="$?"||t.data==="$~"}function mg(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function Y1(t,e){var a=t.ownerDocument;if(t.data==="$~")t._reactRetry=e;else if(t.data!=="$?"||a.readyState!=="loading")e();else{var n=function(){e(),a.removeEventListener("DOMContentLoaded",n)};a.addEventListener("DOMContentLoaded",n),t._reactRetry=n}}function Mn(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?"||e==="$~"||e==="&"||e==="F!"||e==="F")break;if(e==="/$"||e==="/&")return null}}return t}var gg=null;function dS(t){t=t.nextSibling;for(var e=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"||a==="/&"){if(e===0)return Mn(t.nextSibling);e--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||e++}t=t.nextSibling}return null}function hS(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(e===0)return t;e--}else a!=="/$"&&a!=="/&"||e++}t=t.previousSibling}return null}function eb(t,e,a){switch(e=Yf(a),t){case"html":if(t=e.documentElement,!t)throw Error(J(452));return t;case"head":if(t=e.head,!t)throw Error(J(453));return t;case"body":if(t=e.body,!t)throw Error(J(454));return t;default:throw Error(J(451))}}function eu(t){for(var e=t.attributes;e.length;)t.removeAttributeNode(e[0]);Cg(t)}var bn=new Map,pS=new Set;function Zf(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var wi=ct.d;ct.d={f:Z1,r:K1,D:J1,C:Q1,L:j1,m:$1,X:tE,S:eE,M:aE};function Z1(){var t=wi.f(),e=fd();return t||e}function K1(t){var e=To(t);e!==null&&e.tag===5&&e.type==="form"?Y_(e):wi.r(t)}var wo=typeof document>"u"?null:document;function tb(t,e,a){var n=wo;if(n&&typeof e=="string"&&e){var i=yn(e);i='link[rel="'+t+'"][href="'+i+'"]',typeof a=="string"&&(i+='[crossorigin="'+a+'"]'),pS.has(i)||(pS.add(i),t={rel:t,crossOrigin:a,href:e},n.querySelector(i)===null&&(e=n.createElement("link"),ma(e,"link",t),ra(e),n.head.appendChild(e)))}}function J1(t){wi.D(t),tb("dns-prefetch",t,null)}function Q1(t,e){wi.C(t,e),tb("preconnect",t,e)}function j1(t,e,a){wi.L(t,e,a);var n=wo;if(n&&t&&e){var i='link[rel="preload"][as="'+yn(e)+'"]';e==="image"&&a&&a.imageSrcSet?(i+='[imagesrcset="'+yn(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(i+='[imagesizes="'+yn(a.imageSizes)+'"]')):i+='[href="'+yn(t)+'"]';var s=i;switch(e){case"style":s=Mo(t);break;case"script":s=Io(t)}bn.has(s)||(t=Pt({rel:"preload",href:e==="image"&&a&&a.imageSrcSet?void 0:t,as:e},a),bn.set(s,t),n.querySelector(i)!==null||e==="style"&&n.querySelector(Tu(s))||e==="script"&&n.querySelector(Lu(s))||(e=n.createElement("link"),ma(e,"link",t),ra(e),n.head.appendChild(e)))}}function $1(t,e){wi.m(t,e);var a=wo;if(a&&t){var n=e&&typeof e.as=="string"?e.as:"script",i='link[rel="modulepreload"][as="'+yn(n)+'"][href="'+yn(t)+'"]',s=i;switch(n){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":s=Io(t)}if(!bn.has(s)&&(t=Pt({rel:"modulepreload",href:t},e),bn.set(s,t),a.querySelector(i)===null)){switch(n){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Lu(s)))return}n=a.createElement("link"),ma(n,"link",t),ra(n),a.head.appendChild(n)}}}function eE(t,e,a){wi.S(t,e,a);var n=wo;if(n&&t){var i=so(n).hoistableStyles,s=Mo(t);e=e||"default";var r=i.get(s);if(!r){var o={loading:0,preload:null};if(r=n.querySelector(Tu(s)))o.loading=5;else{t=Pt({rel:"stylesheet",href:t,"data-precedence":e},a),(a=bn.get(s))&&ux(t,a);var l=r=n.createElement("link");ra(l),ma(l,"link",t),l._p=new Promise(function(u,c){l.onload=u,l.onerror=c}),l.addEventListener("load",function(){o.loading|=1}),l.addEventListener("error",function(){o.loading|=2}),o.loading|=4,Sf(r,e,n)}r={type:"stylesheet",instance:r,count:1,state:o},i.set(s,r)}}}function tE(t,e){wi.X(t,e);var a=wo;if(a&&t){var n=so(a).hoistableScripts,i=Io(t),s=n.get(i);s||(s=a.querySelector(Lu(i)),s||(t=Pt({src:t,async:!0},e),(e=bn.get(i))&&cx(t,e),s=a.createElement("script"),ra(s),ma(s,"link",t),a.head.appendChild(s)),s={type:"script",instance:s,count:1,state:null},n.set(i,s))}}function aE(t,e){wi.M(t,e);var a=wo;if(a&&t){var n=so(a).hoistableScripts,i=Io(t),s=n.get(i);s||(s=a.querySelector(Lu(i)),s||(t=Pt({src:t,async:!0,type:"module"},e),(e=bn.get(i))&&cx(t,e),s=a.createElement("script"),ra(s),ma(s,"link",t),a.head.appendChild(s)),s={type:"script",instance:s,count:1,state:null},n.set(i,s))}}function mS(t,e,a,n){var i=(i=cs.current)?Zf(i):null;if(!i)throw Error(J(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(e=Mo(a.href),a=so(i).hoistableStyles,n=a.get(e),n||(n={type:"style",instance:null,count:0,state:null},a.set(e,n)),n):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=Mo(a.href);var s=so(i).hoistableStyles,r=s.get(t);if(r||(i=i.ownerDocument||i,r={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},s.set(t,r),(s=i.querySelector(Tu(t)))&&!s._p&&(r.instance=s,r.state.loading=5),bn.has(t)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},bn.set(t,a),s||nE(i,t,a,r.state))),e&&n===null)throw Error(J(528,""));return r}if(e&&n!==null)throw Error(J(529,""));return null;case"script":return e=a.async,a=a.src,typeof a=="string"&&e&&typeof e!="function"&&typeof e!="symbol"?(e=Io(a),a=so(i).hoistableScripts,n=a.get(e),n||(n={type:"script",instance:null,count:0,state:null},a.set(e,n)),n):{type:"void",instance:null,count:0,state:null};default:throw Error(J(444,t))}}function Mo(t){return'href="'+yn(t)+'"'}function Tu(t){return'link[rel="stylesheet"]['+t+"]"}function ab(t){return Pt({},t,{"data-precedence":t.precedence,precedence:null})}function nE(t,e,a,n){t.querySelector('link[rel="preload"][as="style"]['+e+"]")?n.loading=1:(e=t.createElement("link"),n.preload=e,e.addEventListener("load",function(){return n.loading|=1}),e.addEventListener("error",function(){return n.loading|=2}),ma(e,"link",a),ra(e),t.head.appendChild(e))}function Io(t){return'[src="'+yn(t)+'"]'}function Lu(t){return"script[async]"+t}function gS(t,e,a){if(e.count++,e.instance===null)switch(e.type){case"style":var n=t.querySelector('style[data-href~="'+yn(a.href)+'"]');if(n)return e.instance=n,ra(n),n;var i=Pt({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return n=(t.ownerDocument||t).createElement("style"),ra(n),ma(n,"style",i),Sf(n,a.precedence,t),e.instance=n;case"stylesheet":i=Mo(a.href);var s=t.querySelector(Tu(i));if(s)return e.state.loading|=4,e.instance=s,ra(s),s;n=ab(a),(i=bn.get(i))&&ux(n,i),s=(t.ownerDocument||t).createElement("link"),ra(s);var r=s;return r._p=new Promise(function(o,l){r.onload=o,r.onerror=l}),ma(s,"link",n),e.state.loading|=4,Sf(s,a.precedence,t),e.instance=s;case"script":return s=Io(a.src),(i=t.querySelector(Lu(s)))?(e.instance=i,ra(i),i):(n=a,(i=bn.get(s))&&(n=Pt({},a),cx(n,i)),t=t.ownerDocument||t,i=t.createElement("script"),ra(i),ma(i,"link",n),t.head.appendChild(i),e.instance=i);case"void":return null;default:throw Error(J(443,e.type))}else e.type==="stylesheet"&&!(e.state.loading&4)&&(n=e.instance,e.state.loading|=4,Sf(n,a.precedence,t));return e.instance}function Sf(t,e,a){for(var n=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),i=n.length?n[n.length-1]:null,s=i,r=0;r<n.length;r++){var o=n[r];if(o.dataset.precedence===e)s=o;else if(s!==i)break}s?s.parentNode.insertBefore(t,s.nextSibling):(e=a.nodeType===9?a.head:a,e.insertBefore(t,e.firstChild))}function ux(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.title==null&&(t.title=e.title)}function cx(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.integrity==null&&(t.integrity=e.integrity)}var _f=null;function xS(t,e,a){if(_f===null){var n=new Map,i=_f=new Map;i.set(a,n)}else i=_f,n=i.get(a),n||(n=new Map,i.set(a,n));if(n.has(t))return n;for(n.set(t,null),a=a.getElementsByTagName(t),i=0;i<a.length;i++){var s=a[i];if(!(s[vu]||s[da]||t==="link"&&s.getAttribute("rel")==="stylesheet")&&s.namespaceURI!=="http://www.w3.org/2000/svg"){var r=s.getAttribute(e)||"";r=t+r;var o=n.get(r);o?o.push(s):n.set(r,[s])}}return n}function yS(t,e,a){t=t.ownerDocument||t,t.head.insertBefore(a,e==="title"?t.querySelector("head > title"):null)}function iE(t,e,a){if(a===1||e.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof e.precedence!="string"||typeof e.href!="string"||e.href==="")break;return!0;case"link":if(typeof e.rel!="string"||typeof e.href!="string"||e.href===""||e.onLoad||e.onError)break;switch(e.rel){case"stylesheet":return t=e.disabled,typeof e.precedence=="string"&&t==null;default:return!0}case"script":if(e.async&&typeof e.async!="function"&&typeof e.async!="symbol"&&!e.onLoad&&!e.onError&&e.src&&typeof e.src=="string")return!0}return!1}function nb(t){return!(t.type==="stylesheet"&&!(t.state.loading&3))}function sE(t,e,a,n){if(a.type==="stylesheet"&&(typeof n.media!="string"||matchMedia(n.media).matches!==!1)&&!(a.state.loading&4)){if(a.instance===null){var i=Mo(n.href),s=e.querySelector(Tu(i));if(s){e=s._p,e!==null&&typeof e=="object"&&typeof e.then=="function"&&(t.count++,t=Kf.bind(t),e.then(t,t)),a.state.loading|=4,a.instance=s,ra(s);return}s=e.ownerDocument||e,n=ab(n),(i=bn.get(i))&&ux(n,i),s=s.createElement("link"),ra(s);var r=s;r._p=new Promise(function(o,l){r.onload=o,r.onerror=l}),ma(s,"link",n),a.instance=s}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(a,e),(e=a.state.preload)&&!(a.state.loading&3)&&(t.count++,a=Kf.bind(t),e.addEventListener("load",a),e.addEventListener("error",a))}}var bm=0;function rE(t,e){return t.stylesheets&&t.count===0&&Mf(t,t.stylesheets),0<t.count||0<t.imgCount?function(a){var n=setTimeout(function(){if(t.stylesheets&&Mf(t,t.stylesheets),t.unsuspend){var s=t.unsuspend;t.unsuspend=null,s()}},6e4+e);0<t.imgBytes&&bm===0&&(bm=62500*k1());var i=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&Mf(t,t.stylesheets),t.unsuspend)){var s=t.unsuspend;t.unsuspend=null,s()}},(t.imgBytes>bm?50:800)+e);return t.unsuspend=a,function(){t.unsuspend=null,clearTimeout(n),clearTimeout(i)}}:null}function Kf(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Mf(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var Jf=null;function Mf(t,e){t.stylesheets=null,t.unsuspend!==null&&(t.count++,Jf=new Map,e.forEach(oE,t),Jf=null,Kf.call(t))}function oE(t,e){if(!(e.state.loading&4)){var a=Jf.get(t);if(a)var n=a.get(null);else{a=new Map,Jf.set(t,a);for(var i=t.querySelectorAll("link[data-precedence],style[data-precedence]"),s=0;s<i.length;s++){var r=i[s];(r.nodeName==="LINK"||r.getAttribute("media")!=="not all")&&(a.set(r.dataset.precedence,r),n=r)}n&&a.set(null,n)}i=e.instance,r=i.getAttribute("data-precedence"),s=a.get(r)||n,s===n&&a.set(null,i),a.set(r,i),this.count++,n=Kf.bind(this),i.addEventListener("load",n),i.addEventListener("error",n),s?s.parentNode.insertBefore(i,s.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(i,t.firstChild)),e.state.loading|=4}}var du={$$typeof:yi,Provider:null,Consumer:null,_currentValue:Ks,_currentValue2:Ks,_threadCount:0};function lE(t,e,a,n,i,s,r,o,l){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Kp(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Kp(0),this.hiddenUpdates=Kp(null),this.identifierPrefix=n,this.onUncaughtError=i,this.onCaughtError=s,this.onRecoverableError=r,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=l,this.incompleteTransitions=new Map}function ib(t,e,a,n,i,s,r,o,l,u,c,f){return t=new lE(t,e,a,r,l,u,c,f,o),e=1,s===!0&&(e|=24),s=Qa(3,null,null,e),t.current=s,s.stateNode=t,e=Ng(),e.refCount++,t.pooledCache=e,e.refCount++,s.memoizedState={element:n,isDehydrated:a,cache:e},zg(s),t}function sb(t){return t?(t=to,t):to}function rb(t,e,a,n,i,s){i=sb(i),n.context===null?n.context=i:n.pendingContext=i,n=ds(e),n.payload={element:a},s=s===void 0?null:s,s!==null&&(n.callback=s),a=hs(t,n,e),a!==null&&(Fa(a,t,e),Xl(a,t,e))}function vS(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<e?a:e}}function fx(t,e){vS(t,e),(t=t.alternate)&&vS(t,e)}function ob(t){if(t.tag===13||t.tag===31){var e=lr(t,67108864);e!==null&&Fa(e,t,67108864),fx(t,67108864)}}function SS(t){if(t.tag===13||t.tag===31){var e=an();e=Mg(e);var a=lr(t,e);a!==null&&Fa(a,t,e),fx(t,e)}}var Qf=!0;function uE(t,e,a,n){var i=Fe.T;Fe.T=null;var s=ct.p;try{ct.p=2,dx(t,e,a,n)}finally{ct.p=s,Fe.T=i}}function cE(t,e,a,n){var i=Fe.T;Fe.T=null;var s=ct.p;try{ct.p=8,dx(t,e,a,n)}finally{ct.p=s,Fe.T=i}}function dx(t,e,a,n){if(Qf){var i=xg(n);if(i===null)_m(t,e,n,jf,a),_S(t,n);else if(dE(i,t,e,a,n))n.stopPropagation();else if(_S(t,n),e&4&&-1<fE.indexOf(t)){for(;i!==null;){var s=To(i);if(s!==null)switch(s.tag){case 3:if(s=s.stateNode,s.current.memoizedState.isDehydrated){var r=Xs(s.pendingLanes);if(r!==0){var o=s;for(o.pendingLanes|=2,o.entangledLanes|=2;r;){var l=1<<31-tn(r);o.entanglements[1]|=l,r&=~l}Qn(s),!(ut&6)&&(Hf=$a()+500,Cu(0,!1))}}break;case 31:case 13:o=lr(s,2),o!==null&&Fa(o,s,2),fd(),fx(s,2)}if(s=xg(n),s===null&&_m(t,e,n,jf,a),s===i)break;i=s}i!==null&&n.stopPropagation()}else _m(t,e,n,null,a)}}function xg(t){return t=Lg(t),hx(t)}var jf=null;function hx(t){if(jf=null,t=Kr(t),t!==null){var e=mu(t);if(e===null)t=null;else{var a=e.tag;if(a===13){if(t=AS(e),t!==null)return t;t=null}else if(a===31){if(t=ES(e),t!==null)return t;t=null}else if(a===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null)}}return jf=t,null}function lb(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(jL()){case DS:return 2;case PS:return 8;case Af:case $L:return 32;case US:return 268435456;default:return 32}default:return 32}}var yg=!1,gs=null,xs=null,ys=null,hu=new Map,pu=new Map,is=[],fE="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function _S(t,e){switch(t){case"focusin":case"focusout":gs=null;break;case"dragenter":case"dragleave":xs=null;break;case"mouseover":case"mouseout":ys=null;break;case"pointerover":case"pointerout":hu.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":pu.delete(e.pointerId)}}function Bl(t,e,a,n,i,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:a,eventSystemFlags:n,nativeEvent:s,targetContainers:[i]},e!==null&&(e=To(e),e!==null&&ob(e)),t):(t.eventSystemFlags|=n,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function dE(t,e,a,n,i){switch(e){case"focusin":return gs=Bl(gs,t,e,a,n,i),!0;case"dragenter":return xs=Bl(xs,t,e,a,n,i),!0;case"mouseover":return ys=Bl(ys,t,e,a,n,i),!0;case"pointerover":var s=i.pointerId;return hu.set(s,Bl(hu.get(s)||null,t,e,a,n,i)),!0;case"gotpointercapture":return s=i.pointerId,pu.set(s,Bl(pu.get(s)||null,t,e,a,n,i)),!0}return!1}function ub(t){var e=Kr(t.target);if(e!==null){var a=mu(e);if(a!==null){if(e=a.tag,e===13){if(e=AS(a),e!==null){t.blockedOn=e,iv(t.priority,function(){SS(a)});return}}else if(e===31){if(e=ES(a),e!==null){t.blockedOn=e,iv(t.priority,function(){SS(a)});return}}else if(e===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function bf(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var a=xg(t.nativeEvent);if(a===null){a=t.nativeEvent;var n=new a.constructor(a.type,a);Nm=n,a.target.dispatchEvent(n),Nm=null}else return e=To(a),e!==null&&ob(e),t.blockedOn=a,!1;e.shift()}return!0}function MS(t,e,a){bf(t)&&a.delete(e)}function hE(){yg=!1,gs!==null&&bf(gs)&&(gs=null),xs!==null&&bf(xs)&&(xs=null),ys!==null&&bf(ys)&&(ys=null),hu.forEach(MS),pu.forEach(MS)}function of(t,e){t.blockedOn===e&&(t.blockedOn=null,yg||(yg=!0,jt.unstable_scheduleCallback(jt.unstable_NormalPriority,hE)))}var lf=null;function bS(t){lf!==t&&(lf=t,jt.unstable_scheduleCallback(jt.unstable_NormalPriority,function(){lf===t&&(lf=null);for(var e=0;e<t.length;e+=3){var a=t[e],n=t[e+1],i=t[e+2];if(typeof n!="function"){if(hx(n||a)===null)continue;break}var s=To(a);s!==null&&(t.splice(e,3),e-=3,jm(s,{pending:!0,data:i,method:a.method,action:n},n,i))}}))}function bo(t){function e(l){return of(l,t)}gs!==null&&of(gs,t),xs!==null&&of(xs,t),ys!==null&&of(ys,t),hu.forEach(e),pu.forEach(e);for(var a=0;a<is.length;a++){var n=is[a];n.blockedOn===t&&(n.blockedOn=null)}for(;0<is.length&&(a=is[0],a.blockedOn===null);)ub(a),a.blockedOn===null&&is.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(n=0;n<a.length;n+=3){var i=a[n],s=a[n+1],r=i[za]||null;if(typeof s=="function")r||bS(a);else if(r){var o=null;if(s&&s.hasAttribute("formAction")){if(i=s,r=s[za]||null)o=r.formAction;else if(hx(i)!==null)continue}else o=r.action;typeof o=="function"?a[n+1]=o:(a.splice(n,3),n-=3),bS(a)}}}function cb(){function t(s){s.canIntercept&&s.info==="react-transition"&&s.intercept({handler:function(){return new Promise(function(r){return i=r})},focusReset:"manual",scroll:"manual"})}function e(){i!==null&&(i(),i=null),n||setTimeout(a,20)}function a(){if(!n&&!navigation.transition){var s=navigation.currentEntry;s&&s.url!=null&&navigation.navigate(s.url,{state:s.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var n=!1,i=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",e),navigation.addEventListener("navigateerror",e),setTimeout(a,100),function(){n=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",e),navigation.removeEventListener("navigateerror",e),i!==null&&(i(),i=null)}}}function px(t){this._internalRoot=t}pd.prototype.render=px.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(J(409));var a=e.current,n=an();rb(a,n,t,e,null,null)};pd.prototype.unmount=px.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;rb(t.current,2,null,t,null,null),fd(),e[Co]=null}};function pd(t){this._internalRoot=t}pd.prototype.unstable_scheduleHydration=function(t){if(t){var e=zS();t={blockedOn:null,target:t,priority:e};for(var a=0;a<is.length&&e!==0&&e<is[a].priority;a++);is.splice(a,0,t),a===0&&ub(t)}};var CS=TS.version;if(CS!=="19.2.8")throw Error(J(527,CS,"19.2.8"));ct.findDOMNode=function(t){var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(J(188)):(t=Object.keys(t).join(","),Error(J(268,t)));return t=WL(e),t=t!==null?wS(t):null,t=t===null?null:t.stateNode,t};var pE={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:Fe,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Nl=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Nl.isDisabled&&Nl.supportsFiber))try{gu=Nl.inject(pE),en=Nl}catch{}var Nl;md.createRoot=function(t,e){if(!LS(t))throw Error(J(299));var a=!1,n="",i=tM,s=aM,r=nM;return e!=null&&(e.unstable_strictMode===!0&&(a=!0),e.identifierPrefix!==void 0&&(n=e.identifierPrefix),e.onUncaughtError!==void 0&&(i=e.onUncaughtError),e.onCaughtError!==void 0&&(s=e.onCaughtError),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=ib(t,1,!1,null,null,a,n,null,i,s,r,cb),t[Co]=e.current,lx(t),new px(e)};md.hydrateRoot=function(t,e,a){if(!LS(t))throw Error(J(299));var n=!1,i="",s=tM,r=aM,o=nM,l=null;return a!=null&&(a.unstable_strictMode===!0&&(n=!0),a.identifierPrefix!==void 0&&(i=a.identifierPrefix),a.onUncaughtError!==void 0&&(s=a.onUncaughtError),a.onCaughtError!==void 0&&(r=a.onCaughtError),a.onRecoverableError!==void 0&&(o=a.onRecoverableError),a.formState!==void 0&&(l=a.formState)),e=ib(t,1,!0,e,a??null,n,i,l,s,r,o,cb),e.context=sb(null),a=e.current,n=an(),n=Mg(n),i=ds(n),i.callback=null,hs(a,i,n),a=n,e.current.lanes=a,yu(e,a),Qn(e),t[Co]=e.current,lx(t),new pd(e)};md.version="19.2.8"});var pb=qn((RP,hb)=>{"use strict";function db(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(db)}catch(t){console.error(t)}}db(),hb.exports=fb()});var jT=qn(bp=>{"use strict";var xP=Symbol.for("react.transitional.element"),yP=Symbol.for("react.fragment");function QT(t,e,a){var n=null;if(a!==void 0&&(n=""+a),e.key!==void 0&&(n=""+e.key),"key"in e){a={};for(var i in e)i!=="key"&&(a[i]=e[i])}else a=e;return e=a.ref,{$$typeof:xP,type:t,key:n,ref:e!==void 0?e:null,props:a}}bp.Fragment=yP;bp.jsx=QT;bp.jsxs=QT});var Ki=qn((oO,$T)=>{"use strict";$T.exports=jT()});var cL=Pa(pb(),1);var Ze=Pa(Qi());var gd=Pa(Qi(),1);var mb=t=>t?.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();function gb(t,e,a=[]){if(e==null)throw new Error("[lucide]: iconNode is required when icon name is used");return{name:mb(t),size:24,node:e,...a.length>0?{aliases:a}:{}}}var xb=t=>{let e="",a=!1;for(let n of t){if(n==="-"||n==="_"||n<=" "){a=e.length>0;continue}e.length===0?e+=n.toLowerCase():e+=a?n.toUpperCase():n,a=!1}return e};var yb=t=>{let e=xb(t);return e.charAt(0).toUpperCase()+e.slice(1)};var Eu=Pa(Qi(),1);var Au=(...t)=>t.filter((e,a,n)=>!!e&&e.trim()!==""&&n.indexOf(e)===a).join(" ").trim();var Ts={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};function mx(t){return t!=null}function vb(t,e={}){let a=e.attributeNames??{},n=d=>a[d]??d,i=t.size??t.width??Ts.width,s=t.size??t.height??Ts.height,r=t.aliases?.filter(d=>typeof d=="string"&&d.trim()!=="").map(d=>`lucide-${d}`)??[],o=[...t.name?[`lucide-${t.name}`]:[],...r],l=e.className?.split(" ").filter(Boolean)??[],u=e.includeDefaultClasses===!1?Au(...l):Au("lucide",...o,...l),c=e.absoluteStrokeWidth?Number(e.strokeWidth??Ts["stroke-width"])*Number(t.size??t.width??Ts.width)/Number(e.size??e.width??Ts.width):e.strokeWidth??Ts["stroke-width"];return["svg",{...Object.entries(Ts).reduce((d,[p,g])=>(d[n(p)]=g,d),{}),..."color"in e&&e.color&&{[n("stroke")]:e.color},..."size"in e&&mx(e.size)&&{[n("width")]:e.size,[n("height")]:e.size},..."width"in e&&mx(e.width)&&{[n("width")]:e.width},..."height"in e&&mx(e.height)&&{[n("height")]:e.height},[n("stroke-width")]:c,...u&&{[n("class")]:u},[n("viewBox")]:`0 0 ${i} ${s}`,...e.hasA11yProp===!1?{[n("aria-hidden")]:"true"}:{},..."attributes"in e&&e.attributes},t.node.map(d=>{let[p,g,y]=d,m=e.nonScalingStroke?{[n("vector-effect")]:"non-scaling-stroke",...g}:g;return y?[p,m,y]:[p,m]})]}function Sb(t,e={}){return vb(t,{...e,attributeNames:{...e.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}var _b=t=>{for(let e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1};var Ro=Pa(Qi(),1);var mE=(0,Ro.createContext)({});var Mb=()=>(0,Ro.useContext)(mE);var bb=(0,Eu.forwardRef)(({color:t,size:e,width:a,height:n,strokeWidth:i,absoluteStrokeWidth:s,nonScalingStroke:r,className:o="",children:l,iconNode:u=[],icon:c={node:u,aliases:[],size:24},...f},d)=>{let{size:p=24,strokeWidth:g=2,absoluteStrokeWidth:y=!1,nonScalingStroke:m=!1,color:h="currentColor",className:x=""}=Mb()??{},S=!!l||_b(f),[v,T,E=[]]=Sb(c,{color:t??h,width:a??e??p,height:n??e??p,strokeWidth:i??g,absoluteStrokeWidth:s??y,nonScalingStroke:r??m,className:Au(x,o),hasA11yProp:S,attributes:f});return(0,Eu.createElement)(v,{ref:d,...T},[...E.map(([A,R])=>(0,Eu.createElement)(A,R)),...Array.isArray(l)?l:[l]])});function Cn(t,e=[],a=[]){let n=typeof t=="string"?gb(t,e,a):t,i=(0,gd.forwardRef)(({className:s,...r},o)=>(0,gd.createElement)(bb,{ref:o,icon:n,className:s,...r}));return n.name&&(i.displayName=yb(n.name)),i}var Cb={name:"captions",size:24,node:[["rect",{width:"18",height:"14",x:"3",y:"5",rx:"2",ry:"2",key:"12ruh7"}],["path",{d:"M7 15h4M15 15h2M7 11h2M13 11h4",key:"1ueiar"}]],aliases:["subtitles"]};Cb.node;var Ii=Cn(Cb);var Tb={name:"mic",size:24,node:[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["rect",{x:"9",y:"2",width:"6",height:"13",rx:"3",key:"s6n7sd"}]]};Tb.node;var wu=Cn(Tb);var Lb={name:"monitor-up",size:24,node:[["path",{d:"m9 10 3-3 3 3",key:"11gsxs"}],["path",{d:"M12 13V7",key:"h0r20n"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]};Lb.node;var Do=Cn(Lb);var Ab={name:"radio",size:24,node:[["path",{d:"M16.247 7.761a6 6 0 0 1 0 8.478",key:"1fwjs5"}],["path",{d:"M19.075 4.933a10 10 0 0 1 0 14.134",key:"ehdyv1"}],["path",{d:"M4.925 19.067a10 10 0 0 1 0-14.134",key:"1q22gi"}],["path",{d:"M7.753 16.239a6 6 0 0 1 0-8.478",key:"r2q7qm"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]};Ab.node;var Iu=Cn(Ab);var Eb={name:"square",size:24,node:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]};Eb.node;var Ru=Cn(Eb);var wb={name:"video",size:24,node:[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]]};wb.node;var Du=Cn(wb);var ia=Pa(Qi());var oh="180";var dC=0,e0=1,hC=2;var t0=1,lh=2,ri=3,zn=0,ya=1,Ln=2,kn=0,mr=1,yc=2,a0=3,n0=4,pC=5,Ps=100,mC=101,gC=102,xC=103,yC=104,vC=200,SC=201,_C=202,MC=203,Vd=204,Gd=205,bC=206,CC=207,TC=208,LC=209,AC=210,EC=211,wC=212,IC=213,RC=214,uh=0,ch=1,fh=2,gr=3,dh=4,hh=5,ph=6,mh=7,gh=0,DC=1,PC=2,Wi=0,xh=1,yh=2,vh=3,ol=4,Sh=5,_h=6,Mh=7,Gx="attached",UC="detached",i0=300,Ar=301,Er=302,bh=303,Ch=304,vc=306,Us=1e3,$n=1001,Zo=1002,ga=1003,Th=1004;var wr=1005;var Ia=1006,ll=1007;var Hn=1008;var Vn=1009,s0=1010,r0=1011,ul=1012,Lh=1013,Os=1014,An=1015,Wa=1016,Ah=1017,Eh=1018,cl=1020,o0=35902,l0=35899,u0=1021,c0=1022,un=1023,Ko=1026,fl=1027,wh=1028,Ih=1029,f0=1030,Rh=1031;var Dh=1033,Sc=33776,_c=33777,Mc=33778,bc=33779,Ph=35840,Uh=35841,Bh=35842,Nh=35843,Oh=36196,Fh=37492,zh=37496,kh=37808,Hh=37809,Vh=37810,Gh=37811,qh=37812,Wh=37813,Xh=37814,Yh=37815,Zh=37816,Kh=37817,Jh=37818,Qh=37819,jh=37820,$h=37821,ep=36492,tp=36494,ap=36495,np=36283,ip=36284,sp=36285,rp=36286;var xr=2300,yr=2301,Hd=2302,qx=2400,Wx=2401,Xx=2402,BC=2500;var d0=0,Cc=1,dl=2,NC=3200,OC=3201;var op=0,FC=1,Xi="",$t="srgb",xa="srgb-linear",Gu="linear",ft="srgb";var pr=7680;var Yx=519,zC=512,kC=513,HC=514,h0=515,VC=516,GC=517,qC=518,WC=519,qd=35044;var p0="300 es",Nn=2e3,qu=2001;var Fi=class{addEventListener(e,a){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(a)===-1&&n[e].push(a)}hasEventListener(e,a){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(a)!==-1}removeEventListener(e,a){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(a);s!==-1&&i.splice(s,1)}}dispatchEvent(e){let a=this._listeners;if(a===void 0)return;let n=a[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,r=i.length;s<r;s++)i[s].call(this,e);e.target=null}}},Sa=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ib=1234567,Hu=Math.PI/180,vr=180/Math.PI;function Fn(){let t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,a=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Sa[t&255]+Sa[t>>8&255]+Sa[t>>16&255]+Sa[t>>24&255]+"-"+Sa[e&255]+Sa[e>>8&255]+"-"+Sa[e>>16&15|64]+Sa[e>>24&255]+"-"+Sa[a&63|128]+Sa[a>>8&255]+"-"+Sa[a>>16&255]+Sa[a>>24&255]+Sa[n&255]+Sa[n>>8&255]+Sa[n>>16&255]+Sa[n>>24&255]).toLowerCase()}function et(t,e,a){return Math.max(e,Math.min(a,t))}function m0(t,e){return(t%e+e)%e}function gE(t,e,a,n,i){return n+(t-e)*(i-n)/(a-e)}function xE(t,e,a){return t!==e?(a-t)/(e-t):0}function Vu(t,e,a){return(1-a)*t+a*e}function yE(t,e,a,n){return Vu(t,e,1-Math.exp(-a*n))}function vE(t,e=1){return e-Math.abs(m0(t,e*2)-e)}function SE(t,e,a){return t<=e?0:t>=a?1:(t=(t-e)/(a-e),t*t*(3-2*t))}function _E(t,e,a){return t<=e?0:t>=a?1:(t=(t-e)/(a-e),t*t*t*(t*(t*6-15)+10))}function ME(t,e){return t+Math.floor(Math.random()*(e-t+1))}function bE(t,e){return t+Math.random()*(e-t)}function CE(t){return t*(.5-Math.random())}function TE(t){t!==void 0&&(Ib=t);let e=Ib+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function LE(t){return t*Hu}function AE(t){return t*vr}function EE(t){return(t&t-1)===0&&t!==0}function wE(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function IE(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function RE(t,e,a,n,i){let s=Math.cos,r=Math.sin,o=s(a/2),l=r(a/2),u=s((e+n)/2),c=r((e+n)/2),f=s((e-n)/2),d=r((e-n)/2),p=s((n-e)/2),g=r((n-e)/2);switch(i){case"XYX":t.set(o*c,l*f,l*d,o*u);break;case"YZY":t.set(l*d,o*c,l*f,o*u);break;case"ZXZ":t.set(l*f,l*d,o*c,o*u);break;case"XZX":t.set(o*c,l*g,l*p,o*u);break;case"YXY":t.set(l*p,o*c,l*g,o*u);break;case"ZYZ":t.set(l*g,l*p,o*c,o*u);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Bn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function xt(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}var Tc={DEG2RAD:Hu,RAD2DEG:vr,generateUUID:Fn,clamp:et,euclideanModulo:m0,mapLinear:gE,inverseLerp:xE,lerp:Vu,damp:yE,pingpong:vE,smoothstep:SE,smootherstep:_E,randInt:ME,randFloat:bE,randFloatSpread:CE,seededRandom:TE,degToRad:LE,radToDeg:AE,isPowerOfTwo:EE,ceilPowerOfTwo:wE,floorPowerOfTwo:IE,setQuaternionFromProperEuler:RE,normalize:xt,denormalize:Bn},Ie=class t{constructor(e=0,a=0){t.prototype.isVector2=!0,this.x=e,this.y=a}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,a){return this.x=e,this.y=a,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,a){switch(e){case 0:this.x=a;break;case 1:this.y=a;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,a){return this.x=e.x+a.x,this.y=e.y+a.y,this}addScaledVector(e,a){return this.x+=e.x*a,this.y+=e.y*a,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,a){return this.x=e.x-a.x,this.y=e.y-a.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let a=this.x,n=this.y,i=e.elements;return this.x=i[0]*a+i[3]*n+i[6],this.y=i[1]*a+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,a){return this.x=et(this.x,e.x,a.x),this.y=et(this.y,e.y,a.y),this}clampScalar(e,a){return this.x=et(this.x,e,a),this.y=et(this.y,e,a),this}clampLength(e,a){let n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,a))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let a=Math.sqrt(this.lengthSq()*e.lengthSq());if(a===0)return Math.PI/2;let n=this.dot(e)/a;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let a=this.x-e.x,n=this.y-e.y;return a*a+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,a){return this.x+=(e.x-this.x)*a,this.y+=(e.y-this.y)*a,this}lerpVectors(e,a,n){return this.x=e.x+(a.x-e.x)*n,this.y=e.y+(a.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,a=0){return this.x=e[a],this.y=e[a+1],this}toArray(e=[],a=0){return e[a]=this.x,e[a+1]=this.y,e}fromBufferAttribute(e,a){return this.x=e.getX(a),this.y=e.getY(a),this}rotateAround(e,a){let n=Math.cos(a),i=Math.sin(a),s=this.x-e.x,r=this.y-e.y;return this.x=s*n-r*i+e.x,this.y=s*i+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ua=class{constructor(e=0,a=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=a,this._z=n,this._w=i}static slerpFlat(e,a,n,i,s,r,o){let l=n[i+0],u=n[i+1],c=n[i+2],f=n[i+3],d=s[r+0],p=s[r+1],g=s[r+2],y=s[r+3];if(o===0){e[a+0]=l,e[a+1]=u,e[a+2]=c,e[a+3]=f;return}if(o===1){e[a+0]=d,e[a+1]=p,e[a+2]=g,e[a+3]=y;return}if(f!==y||l!==d||u!==p||c!==g){let m=1-o,h=l*d+u*p+c*g+f*y,x=h>=0?1:-1,S=1-h*h;if(S>Number.EPSILON){let T=Math.sqrt(S),E=Math.atan2(T,h*x);m=Math.sin(m*E)/T,o=Math.sin(o*E)/T}let v=o*x;if(l=l*m+d*v,u=u*m+p*v,c=c*m+g*v,f=f*m+y*v,m===1-o){let T=1/Math.sqrt(l*l+u*u+c*c+f*f);l*=T,u*=T,c*=T,f*=T}}e[a]=l,e[a+1]=u,e[a+2]=c,e[a+3]=f}static multiplyQuaternionsFlat(e,a,n,i,s,r){let o=n[i],l=n[i+1],u=n[i+2],c=n[i+3],f=s[r],d=s[r+1],p=s[r+2],g=s[r+3];return e[a]=o*g+c*f+l*p-u*d,e[a+1]=l*g+c*d+u*f-o*p,e[a+2]=u*g+c*p+o*d-l*f,e[a+3]=c*g-o*f-l*d-u*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,a,n,i){return this._x=e,this._y=a,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,a=!0){let n=e._x,i=e._y,s=e._z,r=e._order,o=Math.cos,l=Math.sin,u=o(n/2),c=o(i/2),f=o(s/2),d=l(n/2),p=l(i/2),g=l(s/2);switch(r){case"XYZ":this._x=d*c*f+u*p*g,this._y=u*p*f-d*c*g,this._z=u*c*g+d*p*f,this._w=u*c*f-d*p*g;break;case"YXZ":this._x=d*c*f+u*p*g,this._y=u*p*f-d*c*g,this._z=u*c*g-d*p*f,this._w=u*c*f+d*p*g;break;case"ZXY":this._x=d*c*f-u*p*g,this._y=u*p*f+d*c*g,this._z=u*c*g+d*p*f,this._w=u*c*f-d*p*g;break;case"ZYX":this._x=d*c*f-u*p*g,this._y=u*p*f+d*c*g,this._z=u*c*g-d*p*f,this._w=u*c*f+d*p*g;break;case"YZX":this._x=d*c*f+u*p*g,this._y=u*p*f+d*c*g,this._z=u*c*g-d*p*f,this._w=u*c*f-d*p*g;break;case"XZY":this._x=d*c*f-u*p*g,this._y=u*p*f-d*c*g,this._z=u*c*g+d*p*f,this._w=u*c*f+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return a===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,a){let n=a/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let a=e.elements,n=a[0],i=a[4],s=a[8],r=a[1],o=a[5],l=a[9],u=a[2],c=a[6],f=a[10],d=n+o+f;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(c-l)*p,this._y=(s-u)*p,this._z=(r-i)*p}else if(n>o&&n>f){let p=2*Math.sqrt(1+n-o-f);this._w=(c-l)/p,this._x=.25*p,this._y=(i+r)/p,this._z=(s+u)/p}else if(o>f){let p=2*Math.sqrt(1+o-n-f);this._w=(s-u)/p,this._x=(i+r)/p,this._y=.25*p,this._z=(l+c)/p}else{let p=2*Math.sqrt(1+f-n-o);this._w=(r-i)/p,this._x=(s+u)/p,this._y=(l+c)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,a){let n=e.dot(a)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*a.z-e.z*a.y,this._y=e.z*a.x-e.x*a.z,this._z=e.x*a.y-e.y*a.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(et(this.dot(e),-1,1)))}rotateTowards(e,a){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,a/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,a){let n=e._x,i=e._y,s=e._z,r=e._w,o=a._x,l=a._y,u=a._z,c=a._w;return this._x=n*c+r*o+i*u-s*l,this._y=i*c+r*l+s*o-n*u,this._z=s*c+r*u+n*l-i*o,this._w=r*c-n*o-i*l-s*u,this._onChangeCallback(),this}slerp(e,a){if(a===0)return this;if(a===1)return this.copy(e);let n=this._x,i=this._y,s=this._z,r=this._w,o=r*e._w+n*e._x+i*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=r,this._x=n,this._y=i,this._z=s,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-a;return this._w=p*r+a*this._w,this._x=p*n+a*this._x,this._y=p*i+a*this._y,this._z=p*s+a*this._z,this.normalize(),this}let u=Math.sqrt(l),c=Math.atan2(u,o),f=Math.sin((1-a)*c)/u,d=Math.sin(a*c)/u;return this._w=r*f+this._w*d,this._x=n*f+this._x*d,this._y=i*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,a,n){return this.copy(e).slerp(a,n)}random(){let e=2*Math.PI*Math.random(),a=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(a),s*Math.cos(a))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,a=0){return this._x=e[a],this._y=e[a+1],this._z=e[a+2],this._w=e[a+3],this._onChangeCallback(),this}toArray(e=[],a=0){return e[a]=this._x,e[a+1]=this._y,e[a+2]=this._z,e[a+3]=this._w,e}fromBufferAttribute(e,a){return this._x=e.getX(a),this._y=e.getY(a),this._z=e.getZ(a),this._w=e.getW(a),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},P=class t{constructor(e=0,a=0,n=0){t.prototype.isVector3=!0,this.x=e,this.y=a,this.z=n}set(e,a,n){return n===void 0&&(n=this.z),this.x=e,this.y=a,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,a){switch(e){case 0:this.x=a;break;case 1:this.y=a;break;case 2:this.z=a;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,a){return this.x=e.x+a.x,this.y=e.y+a.y,this.z=e.z+a.z,this}addScaledVector(e,a){return this.x+=e.x*a,this.y+=e.y*a,this.z+=e.z*a,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,a){return this.x=e.x-a.x,this.y=e.y-a.y,this.z=e.z-a.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,a){return this.x=e.x*a.x,this.y=e.y*a.y,this.z=e.z*a.z,this}applyEuler(e){return this.applyQuaternion(Rb.setFromEuler(e))}applyAxisAngle(e,a){return this.applyQuaternion(Rb.setFromAxisAngle(e,a))}applyMatrix3(e){let a=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*a+s[3]*n+s[6]*i,this.y=s[1]*a+s[4]*n+s[7]*i,this.z=s[2]*a+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let a=this.x,n=this.y,i=this.z,s=e.elements,r=1/(s[3]*a+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*a+s[4]*n+s[8]*i+s[12])*r,this.y=(s[1]*a+s[5]*n+s[9]*i+s[13])*r,this.z=(s[2]*a+s[6]*n+s[10]*i+s[14])*r,this}applyQuaternion(e){let a=this.x,n=this.y,i=this.z,s=e.x,r=e.y,o=e.z,l=e.w,u=2*(r*i-o*n),c=2*(o*a-s*i),f=2*(s*n-r*a);return this.x=a+l*u+r*f-o*c,this.y=n+l*c+o*u-s*f,this.z=i+l*f+s*c-r*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let a=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*a+s[4]*n+s[8]*i,this.y=s[1]*a+s[5]*n+s[9]*i,this.z=s[2]*a+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,a){return this.x=et(this.x,e.x,a.x),this.y=et(this.y,e.y,a.y),this.z=et(this.z,e.z,a.z),this}clampScalar(e,a){return this.x=et(this.x,e,a),this.y=et(this.y,e,a),this.z=et(this.z,e,a),this}clampLength(e,a){let n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,a))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,a){return this.x+=(e.x-this.x)*a,this.y+=(e.y-this.y)*a,this.z+=(e.z-this.z)*a,this}lerpVectors(e,a,n){return this.x=e.x+(a.x-e.x)*n,this.y=e.y+(a.y-e.y)*n,this.z=e.z+(a.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,a){let n=e.x,i=e.y,s=e.z,r=a.x,o=a.y,l=a.z;return this.x=i*l-s*o,this.y=s*r-n*l,this.z=n*o-i*r,this}projectOnVector(e){let a=e.lengthSq();if(a===0)return this.set(0,0,0);let n=e.dot(this)/a;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return gx.copy(this).projectOnVector(e),this.sub(gx)}reflect(e){return this.sub(gx.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let a=Math.sqrt(this.lengthSq()*e.lengthSq());if(a===0)return Math.PI/2;let n=this.dot(e)/a;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let a=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return a*a+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,a,n){let i=Math.sin(a)*e;return this.x=i*Math.sin(n),this.y=Math.cos(a)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,a,n){return this.x=e*Math.sin(a),this.y=n,this.z=e*Math.cos(a),this}setFromMatrixPosition(e){let a=e.elements;return this.x=a[12],this.y=a[13],this.z=a[14],this}setFromMatrixScale(e){let a=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=a,this.y=n,this.z=i,this}setFromMatrixColumn(e,a){return this.fromArray(e.elements,a*4)}setFromMatrix3Column(e,a){return this.fromArray(e.elements,a*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,a=0){return this.x=e[a],this.y=e[a+1],this.z=e[a+2],this}toArray(e=[],a=0){return e[a]=this.x,e[a+1]=this.y,e[a+2]=this.z,e}fromBufferAttribute(e,a){return this.x=e.getX(a),this.y=e.getY(a),this.z=e.getZ(a),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,a=Math.random()*2-1,n=Math.sqrt(1-a*a);return this.x=n*Math.cos(e),this.y=a,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},gx=new P,Rb=new ua,qe=class t{constructor(e,a,n,i,s,r,o,l,u){t.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,a,n,i,s,r,o,l,u)}set(e,a,n,i,s,r,o,l,u){let c=this.elements;return c[0]=e,c[1]=i,c[2]=o,c[3]=a,c[4]=s,c[5]=l,c[6]=n,c[7]=r,c[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let a=this.elements,n=e.elements;return a[0]=n[0],a[1]=n[1],a[2]=n[2],a[3]=n[3],a[4]=n[4],a[5]=n[5],a[6]=n[6],a[7]=n[7],a[8]=n[8],this}extractBasis(e,a,n){return e.setFromMatrix3Column(this,0),a.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let a=e.elements;return this.set(a[0],a[4],a[8],a[1],a[5],a[9],a[2],a[6],a[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,a){let n=e.elements,i=a.elements,s=this.elements,r=n[0],o=n[3],l=n[6],u=n[1],c=n[4],f=n[7],d=n[2],p=n[5],g=n[8],y=i[0],m=i[3],h=i[6],x=i[1],S=i[4],v=i[7],T=i[2],E=i[5],A=i[8];return s[0]=r*y+o*x+l*T,s[3]=r*m+o*S+l*E,s[6]=r*h+o*v+l*A,s[1]=u*y+c*x+f*T,s[4]=u*m+c*S+f*E,s[7]=u*h+c*v+f*A,s[2]=d*y+p*x+g*T,s[5]=d*m+p*S+g*E,s[8]=d*h+p*v+g*A,this}multiplyScalar(e){let a=this.elements;return a[0]*=e,a[3]*=e,a[6]*=e,a[1]*=e,a[4]*=e,a[7]*=e,a[2]*=e,a[5]*=e,a[8]*=e,this}determinant(){let e=this.elements,a=e[0],n=e[1],i=e[2],s=e[3],r=e[4],o=e[5],l=e[6],u=e[7],c=e[8];return a*r*c-a*o*u-n*s*c+n*o*l+i*s*u-i*r*l}invert(){let e=this.elements,a=e[0],n=e[1],i=e[2],s=e[3],r=e[4],o=e[5],l=e[6],u=e[7],c=e[8],f=c*r-o*u,d=o*l-c*s,p=u*s-r*l,g=a*f+n*d+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return e[0]=f*y,e[1]=(i*u-c*n)*y,e[2]=(o*n-i*r)*y,e[3]=d*y,e[4]=(c*a-i*l)*y,e[5]=(i*s-o*a)*y,e[6]=p*y,e[7]=(n*l-u*a)*y,e[8]=(r*a-n*s)*y,this}transpose(){let e,a=this.elements;return e=a[1],a[1]=a[3],a[3]=e,e=a[2],a[2]=a[6],a[6]=e,e=a[5],a[5]=a[7],a[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let a=this.elements;return e[0]=a[0],e[1]=a[3],e[2]=a[6],e[3]=a[1],e[4]=a[4],e[5]=a[7],e[6]=a[2],e[7]=a[5],e[8]=a[8],this}setUvTransform(e,a,n,i,s,r,o){let l=Math.cos(s),u=Math.sin(s);return this.set(n*l,n*u,-n*(l*r+u*o)+r+e,-i*u,i*l,-i*(-u*r+l*o)+o+a,0,0,1),this}scale(e,a){return this.premultiply(xx.makeScale(e,a)),this}rotate(e){return this.premultiply(xx.makeRotation(-e)),this}translate(e,a){return this.premultiply(xx.makeTranslation(e,a)),this}makeTranslation(e,a){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,a,0,0,1),this}makeRotation(e){let a=Math.cos(e),n=Math.sin(e);return this.set(a,-n,0,n,a,0,0,0,1),this}makeScale(e,a){return this.set(e,0,0,0,a,0,0,0,1),this}equals(e){let a=this.elements,n=e.elements;for(let i=0;i<9;i++)if(a[i]!==n[i])return!1;return!0}fromArray(e,a=0){for(let n=0;n<9;n++)this.elements[n]=e[n+a];return this}toArray(e=[],a=0){let n=this.elements;return e[a]=n[0],e[a+1]=n[1],e[a+2]=n[2],e[a+3]=n[3],e[a+4]=n[4],e[a+5]=n[5],e[a+6]=n[6],e[a+7]=n[7],e[a+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},xx=new qe;function g0(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Jo(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function XC(){let t=Jo("canvas");return t.style.display="block",t}var Db={};function Qo(t){t in Db||(Db[t]=!0,console.warn(t))}function YC(t,e,a){return new Promise(function(n,i){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:i();break;case t.TIMEOUT_EXPIRED:setTimeout(s,a);break;default:n()}}setTimeout(s,a)})}var Pb=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ub=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function DE(){let t={enabled:!0,workingColorSpace:xa,spaces:{},convert:function(i,s,r){return this.enabled===!1||s===r||!s||!r||(this.spaces[s].transfer===ft&&(i.r=Oi(i.r),i.g=Oi(i.g),i.b=Oi(i.b)),this.spaces[s].primaries!==this.spaces[r].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===ft&&(i.r=Yo(i.r),i.g=Yo(i.g),i.b=Yo(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Xi?Gu:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,r){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Qo("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Qo("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],a=[.2126,.7152,.0722],n=[.3127,.329];return t.define({[xa]:{primaries:e,whitePoint:n,transfer:Gu,toXYZ:Pb,fromXYZ:Ub,luminanceCoefficients:a,workingColorSpaceConfig:{unpackColorSpace:$t},outputColorSpaceConfig:{drawingBufferColorSpace:$t}},[$t]:{primaries:e,whitePoint:n,transfer:ft,toXYZ:Pb,fromXYZ:Ub,luminanceCoefficients:a,outputColorSpaceConfig:{drawingBufferColorSpace:$t}}}),t}var Je=DE();function Oi(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Yo(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}var Po,Wd=class{static getDataURL(e,a="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Po===void 0&&(Po=Jo("canvas")),Po.width=e.width,Po.height=e.height;let i=Po.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Po}return n.toDataURL(a)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let a=Jo("canvas");a.width=e.width,a.height=e.height;let n=a.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let r=0;r<s.length;r++)s[r]=Oi(s[r]/255)*255;return n.putImageData(i,0,0),a}else if(e.data){let a=e.data.slice(0);for(let n=0;n<a.length;n++)a instanceof Uint8Array||a instanceof Uint8ClampedArray?a[n]=Math.floor(Oi(a[n]/255)*255):a[n]=Oi(a[n]);return{data:a,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},PE=0,jo=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:PE++}),this.uuid=Fn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let a=this.data;return typeof HTMLVideoElement<"u"&&a instanceof HTMLVideoElement?e.set(a.videoWidth,a.videoHeight,0):a instanceof VideoFrame?e.set(a.displayHeight,a.displayWidth,0):a!==null?e.set(a.width,a.height,a.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let a=e===void 0||typeof e=="string";if(!a&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let r=0,o=i.length;r<o;r++)i[r].isDataTexture?s.push(yx(i[r].image)):s.push(yx(i[r]))}else s=yx(i);n.url=s}return a||(e.images[this.uuid]=n),n}};function yx(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?Wd.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var UE=0,vx=new P,ta=class t extends Fi{constructor(e=t.DEFAULT_IMAGE,a=t.DEFAULT_MAPPING,n=$n,i=$n,s=Ia,r=Hn,o=un,l=Vn,u=t.DEFAULT_ANISOTROPY,c=Xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:UE++}),this.uuid=Fn(),this.name="",this.source=new jo(e),this.mipmaps=[],this.mapping=a,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=r,this.anisotropy=u,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ie(0,0),this.repeat=new Ie(1,1),this.center=new Ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(vx).x}get height(){return this.source.getSize(vx).y}get depth(){return this.source.getSize(vx).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,a){this.updateRanges.push({start:e,count:a})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let a in e){let n=e[a];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${a}' has value of undefined.`);continue}let i=this[a];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${a}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[a]=n}}toJSON(e){let a=e===void 0||typeof e=="string";if(!a&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),a||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==i0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Us:e.x=e.x-Math.floor(e.x);break;case $n:e.x=e.x<0?0:1;break;case Zo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Us:e.y=e.y-Math.floor(e.y);break;case $n:e.y=e.y<0?0:1;break;case Zo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};ta.DEFAULT_IMAGE=null;ta.DEFAULT_MAPPING=i0;ta.DEFAULT_ANISOTROPY=1;var lt=class t{constructor(e=0,a=0,n=0,i=1){t.prototype.isVector4=!0,this.x=e,this.y=a,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,a,n,i){return this.x=e,this.y=a,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,a){switch(e){case 0:this.x=a;break;case 1:this.y=a;break;case 2:this.z=a;break;case 3:this.w=a;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,a){return this.x=e.x+a.x,this.y=e.y+a.y,this.z=e.z+a.z,this.w=e.w+a.w,this}addScaledVector(e,a){return this.x+=e.x*a,this.y+=e.y*a,this.z+=e.z*a,this.w+=e.w*a,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,a){return this.x=e.x-a.x,this.y=e.y-a.y,this.z=e.z-a.z,this.w=e.w-a.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let a=this.x,n=this.y,i=this.z,s=this.w,r=e.elements;return this.x=r[0]*a+r[4]*n+r[8]*i+r[12]*s,this.y=r[1]*a+r[5]*n+r[9]*i+r[13]*s,this.z=r[2]*a+r[6]*n+r[10]*i+r[14]*s,this.w=r[3]*a+r[7]*n+r[11]*i+r[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let a=Math.sqrt(1-e.w*e.w);return a<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/a,this.y=e.y/a,this.z=e.z/a),this}setAxisAngleFromRotationMatrix(e){let a,n,i,s,l=e.elements,u=l[0],c=l[4],f=l[8],d=l[1],p=l[5],g=l[9],y=l[2],m=l[6],h=l[10];if(Math.abs(c-d)<.01&&Math.abs(f-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(c+d)<.1&&Math.abs(f+y)<.1&&Math.abs(g+m)<.1&&Math.abs(u+p+h-3)<.1)return this.set(1,0,0,0),this;a=Math.PI;let S=(u+1)/2,v=(p+1)/2,T=(h+1)/2,E=(c+d)/4,A=(f+y)/4,R=(g+m)/4;return S>v&&S>T?S<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(S),i=E/n,s=A/n):v>T?v<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(v),n=E/i,s=R/i):T<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(T),n=A/s,i=R/s),this.set(n,i,s,a),this}let x=Math.sqrt((m-g)*(m-g)+(f-y)*(f-y)+(d-c)*(d-c));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(f-y)/x,this.z=(d-c)/x,this.w=Math.acos((u+p+h-1)/2),this}setFromMatrixPosition(e){let a=e.elements;return this.x=a[12],this.y=a[13],this.z=a[14],this.w=a[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,a){return this.x=et(this.x,e.x,a.x),this.y=et(this.y,e.y,a.y),this.z=et(this.z,e.z,a.z),this.w=et(this.w,e.w,a.w),this}clampScalar(e,a){return this.x=et(this.x,e,a),this.y=et(this.y,e,a),this.z=et(this.z,e,a),this.w=et(this.w,e,a),this}clampLength(e,a){let n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,a))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,a){return this.x+=(e.x-this.x)*a,this.y+=(e.y-this.y)*a,this.z+=(e.z-this.z)*a,this.w+=(e.w-this.w)*a,this}lerpVectors(e,a,n){return this.x=e.x+(a.x-e.x)*n,this.y=e.y+(a.y-e.y)*n,this.z=e.z+(a.z-e.z)*n,this.w=e.w+(a.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,a=0){return this.x=e[a],this.y=e[a+1],this.z=e[a+2],this.w=e[a+3],this}toArray(e=[],a=0){return e[a]=this.x,e[a+1]=this.y,e[a+2]=this.z,e[a+3]=this.w,e}fromBufferAttribute(e,a){return this.x=e.getX(a),this.y=e.getY(a),this.z=e.getZ(a),this.w=e.getW(a),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Xd=class extends Fi{constructor(e=1,a=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ia,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=a,this.depth=n.depth,this.scissor=new lt(0,0,e,a),this.scissorTest=!1,this.viewport=new lt(0,0,e,a);let i={width:e,height:a,depth:n.depth},s=new ta(i);this.textures=[];let r=n.count;for(let o=0;o<r;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let a={minFilter:Ia,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(a.mapping=e.mapping),e.wrapS!==void 0&&(a.wrapS=e.wrapS),e.wrapT!==void 0&&(a.wrapT=e.wrapT),e.wrapR!==void 0&&(a.wrapR=e.wrapR),e.magFilter!==void 0&&(a.magFilter=e.magFilter),e.minFilter!==void 0&&(a.minFilter=e.minFilter),e.format!==void 0&&(a.format=e.format),e.type!==void 0&&(a.type=e.type),e.anisotropy!==void 0&&(a.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(a.colorSpace=e.colorSpace),e.flipY!==void 0&&(a.flipY=e.flipY),e.generateMipmaps!==void 0&&(a.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(a.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(a)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,a,n=1){if(this.width!==e||this.height!==a||this.depth!==n){this.width=e,this.height=a,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=a,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,a),this.scissor.set(0,0,e,a)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let a=0,n=e.textures.length;a<n;a++){this.textures[a]=e.textures[a].clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;let i=Object.assign({},e.textures[a].image);this.textures[a].source=new jo(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ca=class extends Xd{constructor(e=1,a=1,n={}){super(e,a,n),this.isWebGLRenderTarget=!0}},Wu=class extends ta{constructor(e=null,a=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:a,height:n,depth:i},this.magFilter=ga,this.minFilter=ga,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Yd=class extends ta{constructor(e=null,a=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:a,height:n,depth:i},this.magFilter=ga,this.minFilter=ga,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ln=class{constructor(e=new P(1/0,1/0,1/0),a=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=a}set(e,a){return this.min.copy(e),this.max.copy(a),this}setFromArray(e){this.makeEmpty();for(let a=0,n=e.length;a<n;a+=3)this.expandByPoint(Dn.fromArray(e,a));return this}setFromBufferAttribute(e){this.makeEmpty();for(let a=0,n=e.count;a<n;a++)this.expandByPoint(Dn.fromBufferAttribute(e,a));return this}setFromPoints(e){this.makeEmpty();for(let a=0,n=e.length;a<n;a++)this.expandByPoint(e[a]);return this}setFromCenterAndSize(e,a){let n=Dn.copy(a).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,a=!1){return this.makeEmpty(),this.expandByObject(e,a)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,a=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(a===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=s.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,Dn):Dn.fromBufferAttribute(s,r),Dn.applyMatrix4(e.matrixWorld),this.expandByPoint(Dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xd.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xd.copy(n.boundingBox)),xd.applyMatrix4(e.matrixWorld),this.union(xd)}let i=e.children;for(let s=0,r=i.length;s<r;s++)this.expandByObject(i[s],a);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,a){return a.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Dn),Dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let a,n;return e.normal.x>0?(a=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(a=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(a+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(a+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(a+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(a+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),a<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Pu),yd.subVectors(this.max,Pu),Uo.subVectors(e.a,Pu),Bo.subVectors(e.b,Pu),No.subVectors(e.c,Pu),Ls.subVectors(Bo,Uo),As.subVectors(No,Bo),cr.subVectors(Uo,No);let a=[0,-Ls.z,Ls.y,0,-As.z,As.y,0,-cr.z,cr.y,Ls.z,0,-Ls.x,As.z,0,-As.x,cr.z,0,-cr.x,-Ls.y,Ls.x,0,-As.y,As.x,0,-cr.y,cr.x,0];return!Sx(a,Uo,Bo,No,yd)||(a=[1,0,0,0,1,0,0,0,1],!Sx(a,Uo,Bo,No,yd))?!1:(vd.crossVectors(Ls,As),a=[vd.x,vd.y,vd.z],Sx(a,Uo,Bo,No,yd))}clampPoint(e,a){return a.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ri[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ri[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ri[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ri[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ri[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ri[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ri[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ri[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ri),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Ri=[new P,new P,new P,new P,new P,new P,new P,new P],Dn=new P,xd=new ln,Uo=new P,Bo=new P,No=new P,Ls=new P,As=new P,cr=new P,Pu=new P,yd=new P,vd=new P,fr=new P;function Sx(t,e,a,n,i){for(let s=0,r=t.length-3;s<=r;s+=3){fr.fromArray(t,s);let o=i.x*Math.abs(fr.x)+i.y*Math.abs(fr.y)+i.z*Math.abs(fr.z),l=e.dot(fr),u=a.dot(fr),c=n.dot(fr);if(Math.max(-Math.max(l,u,c),Math.min(l,u,c))>o)return!1}return!0}var BE=new ln,Uu=new P,_x=new P,Ha=class{constructor(e=new P,a=-1){this.isSphere=!0,this.center=e,this.radius=a}set(e,a){return this.center.copy(e),this.radius=a,this}setFromPoints(e,a){let n=this.center;a!==void 0?n.copy(a):BE.setFromPoints(e).getCenter(n);let i=0;for(let s=0,r=e.length;s<r;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let a=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=a*a}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,a){let n=this.center.distanceToSquared(e);return a.copy(e),n>this.radius*this.radius&&(a.sub(this.center).normalize(),a.multiplyScalar(this.radius).add(this.center)),a}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Uu.subVectors(e,this.center);let a=Uu.lengthSq();if(a>this.radius*this.radius){let n=Math.sqrt(a),i=(n-this.radius)*.5;this.center.addScaledVector(Uu,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(_x.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Uu.copy(e.center).add(_x)),this.expandByPoint(Uu.copy(e.center).sub(_x))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Di=new P,Mx=new P,Sd=new P,Es=new P,bx=new P,_d=new P,Cx=new P,Sr=class{constructor(e=new P,a=new P(0,0,-1)){this.origin=e,this.direction=a}set(e,a){return this.origin.copy(e),this.direction.copy(a),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,a){return a.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Di)),this}closestPointToPoint(e,a){a.subVectors(e,this.origin);let n=a.dot(this.direction);return n<0?a.copy(this.origin):a.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let a=Di.subVectors(e,this.origin).dot(this.direction);return a<0?this.origin.distanceToSquared(e):(Di.copy(this.origin).addScaledVector(this.direction,a),Di.distanceToSquared(e))}distanceSqToSegment(e,a,n,i){Mx.copy(e).add(a).multiplyScalar(.5),Sd.copy(a).sub(e).normalize(),Es.copy(this.origin).sub(Mx);let s=e.distanceTo(a)*.5,r=-this.direction.dot(Sd),o=Es.dot(this.direction),l=-Es.dot(Sd),u=Es.lengthSq(),c=Math.abs(1-r*r),f,d,p,g;if(c>0)if(f=r*l-o,d=r*o-l,g=s*c,f>=0)if(d>=-g)if(d<=g){let y=1/c;f*=y,d*=y,p=f*(f+r*d+2*o)+d*(r*f+d+2*l)+u}else d=s,f=Math.max(0,-(r*d+o)),p=-f*f+d*(d+2*l)+u;else d=-s,f=Math.max(0,-(r*d+o)),p=-f*f+d*(d+2*l)+u;else d<=-g?(f=Math.max(0,-(-r*s+o)),d=f>0?-s:Math.min(Math.max(-s,-l),s),p=-f*f+d*(d+2*l)+u):d<=g?(f=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+u):(f=Math.max(0,-(r*s+o)),d=f>0?s:Math.min(Math.max(-s,-l),s),p=-f*f+d*(d+2*l)+u);else d=r>0?-s:s,f=Math.max(0,-(r*d+o)),p=-f*f+d*(d+2*l)+u;return n&&n.copy(this.origin).addScaledVector(this.direction,f),i&&i.copy(Mx).addScaledVector(Sd,d),p}intersectSphere(e,a){Di.subVectors(e.center,this.origin);let n=Di.dot(this.direction),i=Di.dot(Di)-n*n,s=e.radius*e.radius;if(i>s)return null;let r=Math.sqrt(s-i),o=n-r,l=n+r;return l<0?null:o<0?this.at(l,a):this.at(o,a)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let a=e.normal.dot(this.direction);if(a===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/a;return n>=0?n:null}intersectPlane(e,a){let n=this.distanceToPlane(e);return n===null?null:this.at(n,a)}intersectsPlane(e){let a=e.distanceToPoint(this.origin);return a===0||e.normal.dot(this.direction)*a<0}intersectBox(e,a){let n,i,s,r,o,l,u=1/this.direction.x,c=1/this.direction.y,f=1/this.direction.z,d=this.origin;return u>=0?(n=(e.min.x-d.x)*u,i=(e.max.x-d.x)*u):(n=(e.max.x-d.x)*u,i=(e.min.x-d.x)*u),c>=0?(s=(e.min.y-d.y)*c,r=(e.max.y-d.y)*c):(s=(e.max.y-d.y)*c,r=(e.min.y-d.y)*c),n>r||s>i||((s>n||isNaN(n))&&(n=s),(r<i||isNaN(i))&&(i=r),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,a)}intersectsBox(e){return this.intersectBox(e,Di)!==null}intersectTriangle(e,a,n,i,s){bx.subVectors(a,e),_d.subVectors(n,e),Cx.crossVectors(bx,_d);let r=this.direction.dot(Cx),o;if(r>0){if(i)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Es.subVectors(this.origin,e);let l=o*this.direction.dot(_d.crossVectors(Es,_d));if(l<0)return null;let u=o*this.direction.dot(bx.cross(Es));if(u<0||l+u>r)return null;let c=-o*Es.dot(Cx);return c<0?null:this.at(c/r,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},We=class t{constructor(e,a,n,i,s,r,o,l,u,c,f,d,p,g,y,m){t.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,a,n,i,s,r,o,l,u,c,f,d,p,g,y,m)}set(e,a,n,i,s,r,o,l,u,c,f,d,p,g,y,m){let h=this.elements;return h[0]=e,h[4]=a,h[8]=n,h[12]=i,h[1]=s,h[5]=r,h[9]=o,h[13]=l,h[2]=u,h[6]=c,h[10]=f,h[14]=d,h[3]=p,h[7]=g,h[11]=y,h[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new t().fromArray(this.elements)}copy(e){let a=this.elements,n=e.elements;return a[0]=n[0],a[1]=n[1],a[2]=n[2],a[3]=n[3],a[4]=n[4],a[5]=n[5],a[6]=n[6],a[7]=n[7],a[8]=n[8],a[9]=n[9],a[10]=n[10],a[11]=n[11],a[12]=n[12],a[13]=n[13],a[14]=n[14],a[15]=n[15],this}copyPosition(e){let a=this.elements,n=e.elements;return a[12]=n[12],a[13]=n[13],a[14]=n[14],this}setFromMatrix3(e){let a=e.elements;return this.set(a[0],a[3],a[6],0,a[1],a[4],a[7],0,a[2],a[5],a[8],0,0,0,0,1),this}extractBasis(e,a,n){return e.setFromMatrixColumn(this,0),a.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,a,n){return this.set(e.x,a.x,n.x,0,e.y,a.y,n.y,0,e.z,a.z,n.z,0,0,0,0,1),this}extractRotation(e){let a=this.elements,n=e.elements,i=1/Oo.setFromMatrixColumn(e,0).length(),s=1/Oo.setFromMatrixColumn(e,1).length(),r=1/Oo.setFromMatrixColumn(e,2).length();return a[0]=n[0]*i,a[1]=n[1]*i,a[2]=n[2]*i,a[3]=0,a[4]=n[4]*s,a[5]=n[5]*s,a[6]=n[6]*s,a[7]=0,a[8]=n[8]*r,a[9]=n[9]*r,a[10]=n[10]*r,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,this}makeRotationFromEuler(e){let a=this.elements,n=e.x,i=e.y,s=e.z,r=Math.cos(n),o=Math.sin(n),l=Math.cos(i),u=Math.sin(i),c=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){let d=r*c,p=r*f,g=o*c,y=o*f;a[0]=l*c,a[4]=-l*f,a[8]=u,a[1]=p+g*u,a[5]=d-y*u,a[9]=-o*l,a[2]=y-d*u,a[6]=g+p*u,a[10]=r*l}else if(e.order==="YXZ"){let d=l*c,p=l*f,g=u*c,y=u*f;a[0]=d+y*o,a[4]=g*o-p,a[8]=r*u,a[1]=r*f,a[5]=r*c,a[9]=-o,a[2]=p*o-g,a[6]=y+d*o,a[10]=r*l}else if(e.order==="ZXY"){let d=l*c,p=l*f,g=u*c,y=u*f;a[0]=d-y*o,a[4]=-r*f,a[8]=g+p*o,a[1]=p+g*o,a[5]=r*c,a[9]=y-d*o,a[2]=-r*u,a[6]=o,a[10]=r*l}else if(e.order==="ZYX"){let d=r*c,p=r*f,g=o*c,y=o*f;a[0]=l*c,a[4]=g*u-p,a[8]=d*u+y,a[1]=l*f,a[5]=y*u+d,a[9]=p*u-g,a[2]=-u,a[6]=o*l,a[10]=r*l}else if(e.order==="YZX"){let d=r*l,p=r*u,g=o*l,y=o*u;a[0]=l*c,a[4]=y-d*f,a[8]=g*f+p,a[1]=f,a[5]=r*c,a[9]=-o*c,a[2]=-u*c,a[6]=p*f+g,a[10]=d-y*f}else if(e.order==="XZY"){let d=r*l,p=r*u,g=o*l,y=o*u;a[0]=l*c,a[4]=-f,a[8]=u*c,a[1]=d*f+y,a[5]=r*c,a[9]=p*f-g,a[2]=g*f-p,a[6]=o*c,a[10]=y*f+d}return a[3]=0,a[7]=0,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,this}makeRotationFromQuaternion(e){return this.compose(NE,e,OE)}lookAt(e,a,n){let i=this.elements;return rn.subVectors(e,a),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),ws.crossVectors(n,rn),ws.lengthSq()===0&&(Math.abs(n.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),ws.crossVectors(n,rn)),ws.normalize(),Md.crossVectors(rn,ws),i[0]=ws.x,i[4]=Md.x,i[8]=rn.x,i[1]=ws.y,i[5]=Md.y,i[9]=rn.y,i[2]=ws.z,i[6]=Md.z,i[10]=rn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,a){let n=e.elements,i=a.elements,s=this.elements,r=n[0],o=n[4],l=n[8],u=n[12],c=n[1],f=n[5],d=n[9],p=n[13],g=n[2],y=n[6],m=n[10],h=n[14],x=n[3],S=n[7],v=n[11],T=n[15],E=i[0],A=i[4],R=i[8],M=i[12],b=i[1],I=i[5],F=i[9],G=i[13],z=i[2],X=i[6],k=i[10],K=i[14],O=i[3],ae=i[7],ce=i[11],me=i[15];return s[0]=r*E+o*b+l*z+u*O,s[4]=r*A+o*I+l*X+u*ae,s[8]=r*R+o*F+l*k+u*ce,s[12]=r*M+o*G+l*K+u*me,s[1]=c*E+f*b+d*z+p*O,s[5]=c*A+f*I+d*X+p*ae,s[9]=c*R+f*F+d*k+p*ce,s[13]=c*M+f*G+d*K+p*me,s[2]=g*E+y*b+m*z+h*O,s[6]=g*A+y*I+m*X+h*ae,s[10]=g*R+y*F+m*k+h*ce,s[14]=g*M+y*G+m*K+h*me,s[3]=x*E+S*b+v*z+T*O,s[7]=x*A+S*I+v*X+T*ae,s[11]=x*R+S*F+v*k+T*ce,s[15]=x*M+S*G+v*K+T*me,this}multiplyScalar(e){let a=this.elements;return a[0]*=e,a[4]*=e,a[8]*=e,a[12]*=e,a[1]*=e,a[5]*=e,a[9]*=e,a[13]*=e,a[2]*=e,a[6]*=e,a[10]*=e,a[14]*=e,a[3]*=e,a[7]*=e,a[11]*=e,a[15]*=e,this}determinant(){let e=this.elements,a=e[0],n=e[4],i=e[8],s=e[12],r=e[1],o=e[5],l=e[9],u=e[13],c=e[2],f=e[6],d=e[10],p=e[14],g=e[3],y=e[7],m=e[11],h=e[15];return g*(+s*l*f-i*u*f-s*o*d+n*u*d+i*o*p-n*l*p)+y*(+a*l*p-a*u*d+s*r*d-i*r*p+i*u*c-s*l*c)+m*(+a*u*f-a*o*p-s*r*f+n*r*p+s*o*c-n*u*c)+h*(-i*o*c-a*l*f+a*o*d+i*r*f-n*r*d+n*l*c)}transpose(){let e=this.elements,a;return a=e[1],e[1]=e[4],e[4]=a,a=e[2],e[2]=e[8],e[8]=a,a=e[6],e[6]=e[9],e[9]=a,a=e[3],e[3]=e[12],e[12]=a,a=e[7],e[7]=e[13],e[13]=a,a=e[11],e[11]=e[14],e[14]=a,this}setPosition(e,a,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=a,i[14]=n),this}invert(){let e=this.elements,a=e[0],n=e[1],i=e[2],s=e[3],r=e[4],o=e[5],l=e[6],u=e[7],c=e[8],f=e[9],d=e[10],p=e[11],g=e[12],y=e[13],m=e[14],h=e[15],x=f*m*u-y*d*u+y*l*p-o*m*p-f*l*h+o*d*h,S=g*d*u-c*m*u-g*l*p+r*m*p+c*l*h-r*d*h,v=c*y*u-g*f*u+g*o*p-r*y*p-c*o*h+r*f*h,T=g*f*l-c*y*l-g*o*d+r*y*d+c*o*m-r*f*m,E=a*x+n*S+i*v+s*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/E;return e[0]=x*A,e[1]=(y*d*s-f*m*s-y*i*p+n*m*p+f*i*h-n*d*h)*A,e[2]=(o*m*s-y*l*s+y*i*u-n*m*u-o*i*h+n*l*h)*A,e[3]=(f*l*s-o*d*s-f*i*u+n*d*u+o*i*p-n*l*p)*A,e[4]=S*A,e[5]=(c*m*s-g*d*s+g*i*p-a*m*p-c*i*h+a*d*h)*A,e[6]=(g*l*s-r*m*s-g*i*u+a*m*u+r*i*h-a*l*h)*A,e[7]=(r*d*s-c*l*s+c*i*u-a*d*u-r*i*p+a*l*p)*A,e[8]=v*A,e[9]=(g*f*s-c*y*s-g*n*p+a*y*p+c*n*h-a*f*h)*A,e[10]=(r*y*s-g*o*s+g*n*u-a*y*u-r*n*h+a*o*h)*A,e[11]=(c*o*s-r*f*s-c*n*u+a*f*u+r*n*p-a*o*p)*A,e[12]=T*A,e[13]=(c*y*i-g*f*i+g*n*d-a*y*d-c*n*m+a*f*m)*A,e[14]=(g*o*i-r*y*i-g*n*l+a*y*l+r*n*m-a*o*m)*A,e[15]=(r*f*i-c*o*i+c*n*l-a*f*l-r*n*d+a*o*d)*A,this}scale(e){let a=this.elements,n=e.x,i=e.y,s=e.z;return a[0]*=n,a[4]*=i,a[8]*=s,a[1]*=n,a[5]*=i,a[9]*=s,a[2]*=n,a[6]*=i,a[10]*=s,a[3]*=n,a[7]*=i,a[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,a=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(a,n,i))}makeTranslation(e,a,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,a,0,0,1,n,0,0,0,1),this}makeRotationX(e){let a=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,a,-n,0,0,n,a,0,0,0,0,1),this}makeRotationY(e){let a=Math.cos(e),n=Math.sin(e);return this.set(a,0,n,0,0,1,0,0,-n,0,a,0,0,0,0,1),this}makeRotationZ(e){let a=Math.cos(e),n=Math.sin(e);return this.set(a,-n,0,0,n,a,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,a){let n=Math.cos(a),i=Math.sin(a),s=1-n,r=e.x,o=e.y,l=e.z,u=s*r,c=s*o;return this.set(u*r+n,u*o-i*l,u*l+i*o,0,u*o+i*l,c*o+n,c*l-i*r,0,u*l-i*o,c*l+i*r,s*l*l+n,0,0,0,0,1),this}makeScale(e,a,n){return this.set(e,0,0,0,0,a,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,a,n,i,s,r){return this.set(1,n,s,0,e,1,r,0,a,i,1,0,0,0,0,1),this}compose(e,a,n){let i=this.elements,s=a._x,r=a._y,o=a._z,l=a._w,u=s+s,c=r+r,f=o+o,d=s*u,p=s*c,g=s*f,y=r*c,m=r*f,h=o*f,x=l*u,S=l*c,v=l*f,T=n.x,E=n.y,A=n.z;return i[0]=(1-(y+h))*T,i[1]=(p+v)*T,i[2]=(g-S)*T,i[3]=0,i[4]=(p-v)*E,i[5]=(1-(d+h))*E,i[6]=(m+x)*E,i[7]=0,i[8]=(g+S)*A,i[9]=(m-x)*A,i[10]=(1-(d+y))*A,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,a,n){let i=this.elements,s=Oo.set(i[0],i[1],i[2]).length(),r=Oo.set(i[4],i[5],i[6]).length(),o=Oo.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],Pn.copy(this);let u=1/s,c=1/r,f=1/o;return Pn.elements[0]*=u,Pn.elements[1]*=u,Pn.elements[2]*=u,Pn.elements[4]*=c,Pn.elements[5]*=c,Pn.elements[6]*=c,Pn.elements[8]*=f,Pn.elements[9]*=f,Pn.elements[10]*=f,a.setFromRotationMatrix(Pn),n.x=s,n.y=r,n.z=o,this}makePerspective(e,a,n,i,s,r,o=Nn,l=!1){let u=this.elements,c=2*s/(a-e),f=2*s/(n-i),d=(a+e)/(a-e),p=(n+i)/(n-i),g,y;if(l)g=s/(r-s),y=r*s/(r-s);else if(o===Nn)g=-(r+s)/(r-s),y=-2*r*s/(r-s);else if(o===qu)g=-r/(r-s),y=-r*s/(r-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return u[0]=c,u[4]=0,u[8]=d,u[12]=0,u[1]=0,u[5]=f,u[9]=p,u[13]=0,u[2]=0,u[6]=0,u[10]=g,u[14]=y,u[3]=0,u[7]=0,u[11]=-1,u[15]=0,this}makeOrthographic(e,a,n,i,s,r,o=Nn,l=!1){let u=this.elements,c=2/(a-e),f=2/(n-i),d=-(a+e)/(a-e),p=-(n+i)/(n-i),g,y;if(l)g=1/(r-s),y=r/(r-s);else if(o===Nn)g=-2/(r-s),y=-(r+s)/(r-s);else if(o===qu)g=-1/(r-s),y=-s/(r-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return u[0]=c,u[4]=0,u[8]=0,u[12]=d,u[1]=0,u[5]=f,u[9]=0,u[13]=p,u[2]=0,u[6]=0,u[10]=g,u[14]=y,u[3]=0,u[7]=0,u[11]=0,u[15]=1,this}equals(e){let a=this.elements,n=e.elements;for(let i=0;i<16;i++)if(a[i]!==n[i])return!1;return!0}fromArray(e,a=0){for(let n=0;n<16;n++)this.elements[n]=e[n+a];return this}toArray(e=[],a=0){let n=this.elements;return e[a]=n[0],e[a+1]=n[1],e[a+2]=n[2],e[a+3]=n[3],e[a+4]=n[4],e[a+5]=n[5],e[a+6]=n[6],e[a+7]=n[7],e[a+8]=n[8],e[a+9]=n[9],e[a+10]=n[10],e[a+11]=n[11],e[a+12]=n[12],e[a+13]=n[13],e[a+14]=n[14],e[a+15]=n[15],e}},Oo=new P,Pn=new We,NE=new P(0,0,0),OE=new P(1,1,1),ws=new P,Md=new P,rn=new P,Bb=new We,Nb=new ua,Va=class t{constructor(e=0,a=0,n=0,i=t.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=a,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,a,n,i=this._order){return this._x=e,this._y=a,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,a=this._order,n=!0){let i=e.elements,s=i[0],r=i[4],o=i[8],l=i[1],u=i[5],c=i[9],f=i[2],d=i[6],p=i[10];switch(a){case"XYZ":this._y=Math.asin(et(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,p),this._z=Math.atan2(-r,s)):(this._x=Math.atan2(d,u),this._z=0);break;case"YXZ":this._x=Math.asin(-et(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,u)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(et(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-r,u)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-et(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-r,u));break;case"YZX":this._z=Math.asin(et(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-c,u),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-et(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,u),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-c,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+a)}return this._order=a,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,a,n){return Bb.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Bb,a,n)}setFromVector3(e,a=this._order){return this.set(e.x,e.y,e.z,a)}reorder(e){return Nb.setFromEuler(this),this.setFromQuaternion(Nb,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],a=0){return e[a]=this._x,e[a+1]=this._y,e[a+2]=this._z,e[a+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Va.DEFAULT_ORDER="XYZ";var Xu=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},FE=0,Ob=new P,Fo=new ua,Pi=new We,bd=new P,Bu=new P,zE=new P,kE=new ua,Fb=new P(1,0,0),zb=new P(0,1,0),kb=new P(0,0,1),Hb={type:"added"},HE={type:"removed"},zo={type:"childadded",child:null},Tx={type:"childremoved",child:null},Et=class t extends Fi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:FE++}),this.uuid=Fn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=t.DEFAULT_UP.clone();let e=new P,a=new Va,n=new ua,i=new P(1,1,1);function s(){n.setFromEuler(a,!1)}function r(){a.setFromQuaternion(n,void 0,!1)}a._onChange(s),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:a},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new We},normalMatrix:{value:new qe}}),this.matrix=new We,this.matrixWorld=new We,this.matrixAutoUpdate=t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Xu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,a){this.quaternion.setFromAxisAngle(e,a)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,a){return Fo.setFromAxisAngle(e,a),this.quaternion.multiply(Fo),this}rotateOnWorldAxis(e,a){return Fo.setFromAxisAngle(e,a),this.quaternion.premultiply(Fo),this}rotateX(e){return this.rotateOnAxis(Fb,e)}rotateY(e){return this.rotateOnAxis(zb,e)}rotateZ(e){return this.rotateOnAxis(kb,e)}translateOnAxis(e,a){return Ob.copy(e).applyQuaternion(this.quaternion),this.position.add(Ob.multiplyScalar(a)),this}translateX(e){return this.translateOnAxis(Fb,e)}translateY(e){return this.translateOnAxis(zb,e)}translateZ(e){return this.translateOnAxis(kb,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Pi.copy(this.matrixWorld).invert())}lookAt(e,a,n){e.isVector3?bd.copy(e):bd.set(e,a,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Bu.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Pi.lookAt(Bu,bd,this.up):Pi.lookAt(bd,Bu,this.up),this.quaternion.setFromRotationMatrix(Pi),i&&(Pi.extractRotation(i.matrixWorld),Fo.setFromRotationMatrix(Pi),this.quaternion.premultiply(Fo.invert()))}add(e){if(arguments.length>1){for(let a=0;a<arguments.length;a++)this.add(arguments[a]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Hb),zo.child=e,this.dispatchEvent(zo),zo.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let a=this.children.indexOf(e);return a!==-1&&(e.parent=null,this.children.splice(a,1),e.dispatchEvent(HE),Tx.child=e,this.dispatchEvent(Tx),Tx.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Pi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Pi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Pi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Hb),zo.child=e,this.dispatchEvent(zo),zo.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,a){if(this[e]===a)return this;for(let n=0,i=this.children.length;n<i;n++){let r=this.children[n].getObjectByProperty(e,a);if(r!==void 0)return r}}getObjectsByProperty(e,a,n=[]){this[e]===a&&n.push(this);let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].getObjectsByProperty(e,a,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bu,e,zE),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bu,kE,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let a=this.matrixWorld.elements;return e.set(a[8],a[9],a[10]).normalize()}raycast(){}traverse(e){e(this);let a=this.children;for(let n=0,i=a.length;n<i;n++)a[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let a=this.children;for(let n=0,i=a.length;n<i;n++)a[n].traverseVisible(e)}traverseAncestors(e){let a=this.parent;a!==null&&(e(a),a.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let a=this.children;for(let n=0,i=a.length;n<i;n++)a[n].updateMatrixWorld(e)}updateWorldMatrix(e,a){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),a===!0){let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){let a=e===void 0||typeof e=="string",n={};a&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let u=0,c=l.length;u<c;u++){let f=l[u];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,u=this.material.length;l<u;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];i.animations.push(s(e.animations,l))}}if(a){let o=r(e.geometries),l=r(e.materials),u=r(e.textures),c=r(e.images),f=r(e.shapes),d=r(e.skeletons),p=r(e.animations),g=r(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),u.length>0&&(n.textures=u),c.length>0&&(n.images=c),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=i,n;function r(o){let l=[];for(let u in o){let c=o[u];delete c.metadata,l.push(c)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,a=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),a===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};Et.DEFAULT_UP=new P(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Un=new P,Ui=new P,Lx=new P,Bi=new P,ko=new P,Ho=new P,Vb=new P,Ax=new P,Ex=new P,wx=new P,Ix=new lt,Rx=new lt,Dx=new lt,Ds=class t{constructor(e=new P,a=new P,n=new P){this.a=e,this.b=a,this.c=n}static getNormal(e,a,n,i){i.subVectors(n,a),Un.subVectors(e,a),i.cross(Un);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,a,n,i,s){Un.subVectors(i,a),Ui.subVectors(n,a),Lx.subVectors(e,a);let r=Un.dot(Un),o=Un.dot(Ui),l=Un.dot(Lx),u=Ui.dot(Ui),c=Ui.dot(Lx),f=r*u-o*o;if(f===0)return s.set(0,0,0),null;let d=1/f,p=(u*l-o*c)*d,g=(r*c-o*l)*d;return s.set(1-p-g,g,p)}static containsPoint(e,a,n,i){return this.getBarycoord(e,a,n,i,Bi)===null?!1:Bi.x>=0&&Bi.y>=0&&Bi.x+Bi.y<=1}static getInterpolation(e,a,n,i,s,r,o,l){return this.getBarycoord(e,a,n,i,Bi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Bi.x),l.addScaledVector(r,Bi.y),l.addScaledVector(o,Bi.z),l)}static getInterpolatedAttribute(e,a,n,i,s,r){return Ix.setScalar(0),Rx.setScalar(0),Dx.setScalar(0),Ix.fromBufferAttribute(e,a),Rx.fromBufferAttribute(e,n),Dx.fromBufferAttribute(e,i),r.setScalar(0),r.addScaledVector(Ix,s.x),r.addScaledVector(Rx,s.y),r.addScaledVector(Dx,s.z),r}static isFrontFacing(e,a,n,i){return Un.subVectors(n,a),Ui.subVectors(e,a),Un.cross(Ui).dot(i)<0}set(e,a,n){return this.a.copy(e),this.b.copy(a),this.c.copy(n),this}setFromPointsAndIndices(e,a,n,i){return this.a.copy(e[a]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,a,n,i){return this.a.fromBufferAttribute(e,a),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Un.subVectors(this.c,this.b),Ui.subVectors(this.a,this.b),Un.cross(Ui).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return t.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,a){return t.getBarycoord(e,this.a,this.b,this.c,a)}getInterpolation(e,a,n,i,s){return t.getInterpolation(e,this.a,this.b,this.c,a,n,i,s)}containsPoint(e){return t.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return t.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,a){let n=this.a,i=this.b,s=this.c,r,o;ko.subVectors(i,n),Ho.subVectors(s,n),Ax.subVectors(e,n);let l=ko.dot(Ax),u=Ho.dot(Ax);if(l<=0&&u<=0)return a.copy(n);Ex.subVectors(e,i);let c=ko.dot(Ex),f=Ho.dot(Ex);if(c>=0&&f<=c)return a.copy(i);let d=l*f-c*u;if(d<=0&&l>=0&&c<=0)return r=l/(l-c),a.copy(n).addScaledVector(ko,r);wx.subVectors(e,s);let p=ko.dot(wx),g=Ho.dot(wx);if(g>=0&&p<=g)return a.copy(s);let y=p*u-l*g;if(y<=0&&u>=0&&g<=0)return o=u/(u-g),a.copy(n).addScaledVector(Ho,o);let m=c*g-p*f;if(m<=0&&f-c>=0&&p-g>=0)return Vb.subVectors(s,i),o=(f-c)/(f-c+(p-g)),a.copy(i).addScaledVector(Vb,o);let h=1/(m+y+d);return r=y*h,o=d*h,a.copy(n).addScaledVector(ko,r).addScaledVector(Ho,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ZC={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Is={h:0,s:0,l:0},Cd={h:0,s:0,l:0};function Px(t,e,a){return a<0&&(a+=1),a>1&&(a-=1),a<1/6?t+(e-t)*6*a:a<1/2?e:a<2/3?t+(e-t)*6*(2/3-a):t}var Ae=class{constructor(e,a,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,a,n)}set(e,a,n){if(a===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,a,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,a=$t){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,a),this}setRGB(e,a,n,i=Je.workingColorSpace){return this.r=e,this.g=a,this.b=n,Je.colorSpaceToWorking(this,i),this}setHSL(e,a,n,i=Je.workingColorSpace){if(e=m0(e,1),a=et(a,0,1),n=et(n,0,1),a===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+a):n+a-n*a,r=2*n-s;this.r=Px(r,s,e+1/3),this.g=Px(r,s,e),this.b=Px(r,s,e-1/3)}return Je.colorSpaceToWorking(this,i),this}setStyle(e,a=$t){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,r=i[1],o=i[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,a);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,a);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,a);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,a);if(r===6)return this.setHex(parseInt(s,16),a);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,a);return this}setColorName(e,a=$t){let n=ZC[e.toLowerCase()];return n!==void 0?this.setHex(n,a):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Oi(e.r),this.g=Oi(e.g),this.b=Oi(e.b),this}copyLinearToSRGB(e){return this.r=Yo(e.r),this.g=Yo(e.g),this.b=Yo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=$t){return Je.workingToColorSpace(_a.copy(this),e),Math.round(et(_a.r*255,0,255))*65536+Math.round(et(_a.g*255,0,255))*256+Math.round(et(_a.b*255,0,255))}getHexString(e=$t){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,a=Je.workingColorSpace){Je.workingToColorSpace(_a.copy(this),a);let n=_a.r,i=_a.g,s=_a.b,r=Math.max(n,i,s),o=Math.min(n,i,s),l,u,c=(o+r)/2;if(o===r)l=0,u=0;else{let f=r-o;switch(u=c<=.5?f/(r+o):f/(2-r-o),r){case n:l=(i-s)/f+(i<s?6:0);break;case i:l=(s-n)/f+2;break;case s:l=(n-i)/f+4;break}l/=6}return e.h=l,e.s=u,e.l=c,e}getRGB(e,a=Je.workingColorSpace){return Je.workingToColorSpace(_a.copy(this),a),e.r=_a.r,e.g=_a.g,e.b=_a.b,e}getStyle(e=$t){Je.workingToColorSpace(_a.copy(this),e);let a=_a.r,n=_a.g,i=_a.b;return e!==$t?`color(${e} ${a.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(a*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,a,n){return this.getHSL(Is),this.setHSL(Is.h+e,Is.s+a,Is.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,a){return this.r=e.r+a.r,this.g=e.g+a.g,this.b=e.b+a.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,a){return this.r+=(e.r-this.r)*a,this.g+=(e.g-this.g)*a,this.b+=(e.b-this.b)*a,this}lerpColors(e,a,n){return this.r=e.r+(a.r-e.r)*n,this.g=e.g+(a.g-e.g)*n,this.b=e.b+(a.b-e.b)*n,this}lerpHSL(e,a){this.getHSL(Is),e.getHSL(Cd);let n=Vu(Is.h,Cd.h,a),i=Vu(Is.s,Cd.s,a),s=Vu(Is.l,Cd.l,a);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let a=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*a+s[3]*n+s[6]*i,this.g=s[1]*a+s[4]*n+s[7]*i,this.b=s[2]*a+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,a=0){return this.r=e[a],this.g=e[a+1],this.b=e[a+2],this}toArray(e=[],a=0){return e[a]=this.r,e[a+1]=this.g,e[a+2]=this.b,e}fromBufferAttribute(e,a){return this.r=e.getX(a),this.g=e.getY(a),this.b=e.getZ(a),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},_a=new Ae;Ae.NAMES=ZC;var VE=0,Ma=class extends Fi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:VE++}),this.uuid=Fn(),this.name="",this.type="Material",this.blending=mr,this.side=zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vd,this.blendDst=Gd,this.blendEquation=Ps,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ae(0,0,0),this.blendAlpha=0,this.depthFunc=gr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Yx,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pr,this.stencilZFail=pr,this.stencilZPass=pr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let a in e){let n=e[a];if(n===void 0){console.warn(`THREE.Material: parameter '${a}' has value of undefined.`);continue}let i=this[a];if(i===void 0){console.warn(`THREE.Material: '${a}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[a]=n}}toJSON(e){let a=e===void 0||typeof e=="string";a&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==mr&&(n.blending=this.blending),this.side!==zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Vd&&(n.blendSrc=this.blendSrc),this.blendDst!==Gd&&(n.blendDst=this.blendDst),this.blendEquation!==Ps&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==gr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Yx&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==pr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==pr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==pr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let r=[];for(let o in s){let l=s[o];delete l.metadata,r.push(l)}return r}if(a){let s=i(e.textures),r=i(e.images);s.length>0&&(n.textures=s),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let a=e.clippingPlanes,n=null;if(a!==null){let i=a.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=a[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ra=class extends Ma{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Va,this.combine=gh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Yt=new P,Td=new Ie,GE=0,Kt=class{constructor(e,a,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:GE++}),this.name="",this.array=e,this.itemSize=a,this.count=e!==void 0?e.length/a:0,this.normalized=n,this.usage=qd,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,a){this.updateRanges.push({start:e,count:a})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,a,n){e*=this.itemSize,n*=a.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=a.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let a=0,n=this.count;a<n;a++)Td.fromBufferAttribute(this,a),Td.applyMatrix3(e),this.setXY(a,Td.x,Td.y);else if(this.itemSize===3)for(let a=0,n=this.count;a<n;a++)Yt.fromBufferAttribute(this,a),Yt.applyMatrix3(e),this.setXYZ(a,Yt.x,Yt.y,Yt.z);return this}applyMatrix4(e){for(let a=0,n=this.count;a<n;a++)Yt.fromBufferAttribute(this,a),Yt.applyMatrix4(e),this.setXYZ(a,Yt.x,Yt.y,Yt.z);return this}applyNormalMatrix(e){for(let a=0,n=this.count;a<n;a++)Yt.fromBufferAttribute(this,a),Yt.applyNormalMatrix(e),this.setXYZ(a,Yt.x,Yt.y,Yt.z);return this}transformDirection(e){for(let a=0,n=this.count;a<n;a++)Yt.fromBufferAttribute(this,a),Yt.transformDirection(e),this.setXYZ(a,Yt.x,Yt.y,Yt.z);return this}set(e,a=0){return this.array.set(e,a),this}getComponent(e,a){let n=this.array[e*this.itemSize+a];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,a,n){return this.normalized&&(n=xt(n,this.array)),this.array[e*this.itemSize+a]=n,this}getX(e){let a=this.array[e*this.itemSize];return this.normalized&&(a=Bn(a,this.array)),a}setX(e,a){return this.normalized&&(a=xt(a,this.array)),this.array[e*this.itemSize]=a,this}getY(e){let a=this.array[e*this.itemSize+1];return this.normalized&&(a=Bn(a,this.array)),a}setY(e,a){return this.normalized&&(a=xt(a,this.array)),this.array[e*this.itemSize+1]=a,this}getZ(e){let a=this.array[e*this.itemSize+2];return this.normalized&&(a=Bn(a,this.array)),a}setZ(e,a){return this.normalized&&(a=xt(a,this.array)),this.array[e*this.itemSize+2]=a,this}getW(e){let a=this.array[e*this.itemSize+3];return this.normalized&&(a=Bn(a,this.array)),a}setW(e,a){return this.normalized&&(a=xt(a,this.array)),this.array[e*this.itemSize+3]=a,this}setXY(e,a,n){return e*=this.itemSize,this.normalized&&(a=xt(a,this.array),n=xt(n,this.array)),this.array[e+0]=a,this.array[e+1]=n,this}setXYZ(e,a,n,i){return e*=this.itemSize,this.normalized&&(a=xt(a,this.array),n=xt(n,this.array),i=xt(i,this.array)),this.array[e+0]=a,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,a,n,i,s){return e*=this.itemSize,this.normalized&&(a=xt(a,this.array),n=xt(n,this.array),i=xt(i,this.array),s=xt(s,this.array)),this.array[e+0]=a,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==qd&&(e.usage=this.usage),e}};var Yu=class extends Kt{constructor(e,a,n){super(new Uint16Array(e),a,n)}};var Zu=class extends Kt{constructor(e,a,n){super(new Uint32Array(e),a,n)}};var ea=class extends Kt{constructor(e,a,n){super(new Float32Array(e),a,n)}},qE=0,Tn=new We,Ux=new Et,Vo=new P,on=new ln,Nu=new ln,la=new P,ba=class t extends Fi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qE++}),this.uuid=Fn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(g0(e)?Zu:Yu)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,a){return this.attributes[e]=a,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,a,n=0){this.groups.push({start:e,count:a,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,a){this.drawRange.start=e,this.drawRange.count=a}applyMatrix4(e){let a=this.attributes.position;a!==void 0&&(a.applyMatrix4(e),a.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new qe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Tn.makeRotationFromQuaternion(e),this.applyMatrix4(Tn),this}rotateX(e){return Tn.makeRotationX(e),this.applyMatrix4(Tn),this}rotateY(e){return Tn.makeRotationY(e),this.applyMatrix4(Tn),this}rotateZ(e){return Tn.makeRotationZ(e),this.applyMatrix4(Tn),this}translate(e,a,n){return Tn.makeTranslation(e,a,n),this.applyMatrix4(Tn),this}scale(e,a,n){return Tn.makeScale(e,a,n),this.applyMatrix4(Tn),this}lookAt(e){return Ux.lookAt(e),Ux.updateMatrix(),this.applyMatrix4(Ux.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vo).negate(),this.translate(Vo.x,Vo.y,Vo.z),this}setFromPoints(e){let a=this.getAttribute("position");if(a===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let r=e[i];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ea(n,3))}else{let n=Math.min(e.length,a.count);for(let i=0;i<n;i++){let s=e[i];a.setXYZ(i,s.x,s.y,s.z||0)}e.length>a.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),a.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ln);let e=this.attributes.position,a=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),a)for(let n=0,i=a.length;n<i;n++){let s=a[n];on.setFromBufferAttribute(s),this.morphTargetsRelative?(la.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(la),la.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(la)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ha);let e=this.attributes.position,a=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(on.setFromBufferAttribute(e),a)for(let s=0,r=a.length;s<r;s++){let o=a[s];Nu.setFromBufferAttribute(o),this.morphTargetsRelative?(la.addVectors(on.min,Nu.min),on.expandByPoint(la),la.addVectors(on.max,Nu.max),on.expandByPoint(la)):(on.expandByPoint(Nu.min),on.expandByPoint(Nu.max))}on.getCenter(n);let i=0;for(let s=0,r=e.count;s<r;s++)la.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(la));if(a)for(let s=0,r=a.length;s<r;s++){let o=a[s],l=this.morphTargetsRelative;for(let u=0,c=o.count;u<c;u++)la.fromBufferAttribute(o,u),l&&(Vo.fromBufferAttribute(e,u),la.add(Vo)),i=Math.max(i,n.distanceToSquared(la))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,a=this.attributes;if(e===null||a.position===void 0||a.normal===void 0||a.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=a.position,i=a.normal,s=a.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Kt(new Float32Array(4*n.count),4));let r=this.getAttribute("tangent"),o=[],l=[];for(let R=0;R<n.count;R++)o[R]=new P,l[R]=new P;let u=new P,c=new P,f=new P,d=new Ie,p=new Ie,g=new Ie,y=new P,m=new P;function h(R,M,b){u.fromBufferAttribute(n,R),c.fromBufferAttribute(n,M),f.fromBufferAttribute(n,b),d.fromBufferAttribute(s,R),p.fromBufferAttribute(s,M),g.fromBufferAttribute(s,b),c.sub(u),f.sub(u),p.sub(d),g.sub(d);let I=1/(p.x*g.y-g.x*p.y);isFinite(I)&&(y.copy(c).multiplyScalar(g.y).addScaledVector(f,-p.y).multiplyScalar(I),m.copy(f).multiplyScalar(p.x).addScaledVector(c,-g.x).multiplyScalar(I),o[R].add(y),o[M].add(y),o[b].add(y),l[R].add(m),l[M].add(m),l[b].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let R=0,M=x.length;R<M;++R){let b=x[R],I=b.start,F=b.count;for(let G=I,z=I+F;G<z;G+=3)h(e.getX(G+0),e.getX(G+1),e.getX(G+2))}let S=new P,v=new P,T=new P,E=new P;function A(R){T.fromBufferAttribute(i,R),E.copy(T);let M=o[R];S.copy(M),S.sub(T.multiplyScalar(T.dot(M))).normalize(),v.crossVectors(E,M);let I=v.dot(l[R])<0?-1:1;r.setXYZW(R,S.x,S.y,S.z,I)}for(let R=0,M=x.length;R<M;++R){let b=x[R],I=b.start,F=b.count;for(let G=I,z=I+F;G<z;G+=3)A(e.getX(G+0)),A(e.getX(G+1)),A(e.getX(G+2))}}computeVertexNormals(){let e=this.index,a=this.getAttribute("position");if(a!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Kt(new Float32Array(a.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let i=new P,s=new P,r=new P,o=new P,l=new P,u=new P,c=new P,f=new P;if(e)for(let d=0,p=e.count;d<p;d+=3){let g=e.getX(d+0),y=e.getX(d+1),m=e.getX(d+2);i.fromBufferAttribute(a,g),s.fromBufferAttribute(a,y),r.fromBufferAttribute(a,m),c.subVectors(r,s),f.subVectors(i,s),c.cross(f),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),u.fromBufferAttribute(n,m),o.add(c),l.add(c),u.add(c),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(m,u.x,u.y,u.z)}else for(let d=0,p=a.count;d<p;d+=3)i.fromBufferAttribute(a,d+0),s.fromBufferAttribute(a,d+1),r.fromBufferAttribute(a,d+2),c.subVectors(r,s),f.subVectors(i,s),c.cross(f),n.setXYZ(d+0,c.x,c.y,c.z),n.setXYZ(d+1,c.x,c.y,c.z),n.setXYZ(d+2,c.x,c.y,c.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let a=0,n=e.count;a<n;a++)la.fromBufferAttribute(e,a),la.normalize(),e.setXYZ(a,la.x,la.y,la.z)}toNonIndexed(){function e(o,l){let u=o.array,c=o.itemSize,f=o.normalized,d=new u.constructor(l.length*c),p=0,g=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?p=l[y]*o.data.stride+o.offset:p=l[y]*c;for(let h=0;h<c;h++)d[g++]=u[p++]}return new Kt(d,c,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let a=new t,n=this.index.array,i=this.attributes;for(let o in i){let l=i[o],u=e(l,n);a.setAttribute(o,u)}let s=this.morphAttributes;for(let o in s){let l=[],u=s[o];for(let c=0,f=u.length;c<f;c++){let d=u[c],p=e(d,n);l.push(p)}a.morphAttributes[o]=l}a.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let o=0,l=r.length;o<l;o++){let u=r[o];a.addGroup(u.start,u.count,u.materialIndex)}return a}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let u in l)l[u]!==void 0&&(e[u]=l[u]);return e}e.data={attributes:{}};let a=this.index;a!==null&&(e.data.index={type:a.array.constructor.name,array:Array.prototype.slice.call(a.array)});let n=this.attributes;for(let l in n){let u=n[l];e.data.attributes[l]=u.toJSON(e.data)}let i={},s=!1;for(let l in this.morphAttributes){let u=this.morphAttributes[l],c=[];for(let f=0,d=u.length;f<d;f++){let p=u[f];c.push(p.toJSON(e.data))}c.length>0&&(i[l]=c,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let a={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let u in i){let c=i[u];this.setAttribute(u,c.clone(a))}let s=e.morphAttributes;for(let u in s){let c=[],f=s[u];for(let d=0,p=f.length;d<p;d++)c.push(f[d].clone(a));this.morphAttributes[u]=c}this.morphTargetsRelative=e.morphTargetsRelative;let r=e.groups;for(let u=0,c=r.length;u<c;u++){let f=r[u];this.addGroup(f.start,f.count,f.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Gb=new We,dr=new Sr,Ld=new Ha,qb=new P,Ad=new P,Ed=new P,wd=new P,Bx=new P,Id=new P,Wb=new P,Rd=new P,pt=class extends Et{constructor(e=new ba,a=new Ra){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=a,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,a){return super.copy(e,a),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let a=this.geometry.morphAttributes,n=Object.keys(a);if(n.length>0){let i=a[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,a){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,r=n.morphTargetsRelative;a.fromBufferAttribute(i,e);let o=this.morphTargetInfluences;if(s&&o){Id.set(0,0,0);for(let l=0,u=s.length;l<u;l++){let c=o[l],f=s[l];c!==0&&(Bx.fromBufferAttribute(f,e),r?Id.addScaledVector(Bx,c):Id.addScaledVector(Bx.sub(a),c))}a.add(Id)}return a}raycast(e,a){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ld.copy(n.boundingSphere),Ld.applyMatrix4(s),dr.copy(e.ray).recast(e.near),!(Ld.containsPoint(dr.origin)===!1&&(dr.intersectSphere(Ld,qb)===null||dr.origin.distanceToSquared(qb)>(e.far-e.near)**2))&&(Gb.copy(s).invert(),dr.copy(e.ray).applyMatrix4(Gb),!(n.boundingBox!==null&&dr.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,a,dr)))}_computeIntersections(e,a,n){let i,s=this.geometry,r=this.material,o=s.index,l=s.attributes.position,u=s.attributes.uv,c=s.attributes.uv1,f=s.attributes.normal,d=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,y=d.length;g<y;g++){let m=d[g],h=r[m.materialIndex],x=Math.max(m.start,p.start),S=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let v=x,T=S;v<T;v+=3){let E=o.getX(v),A=o.getX(v+1),R=o.getX(v+2);i=Dd(this,h,e,n,u,c,f,E,A,R),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,a.push(i))}}else{let g=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);for(let m=g,h=y;m<h;m+=3){let x=o.getX(m),S=o.getX(m+1),v=o.getX(m+2);i=Dd(this,r,e,n,u,c,f,x,S,v),i&&(i.faceIndex=Math.floor(m/3),a.push(i))}}else if(l!==void 0)if(Array.isArray(r))for(let g=0,y=d.length;g<y;g++){let m=d[g],h=r[m.materialIndex],x=Math.max(m.start,p.start),S=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let v=x,T=S;v<T;v+=3){let E=v,A=v+1,R=v+2;i=Dd(this,h,e,n,u,c,f,E,A,R),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,a.push(i))}}else{let g=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let m=g,h=y;m<h;m+=3){let x=m,S=m+1,v=m+2;i=Dd(this,r,e,n,u,c,f,x,S,v),i&&(i.faceIndex=Math.floor(m/3),a.push(i))}}}};function WE(t,e,a,n,i,s,r,o){let l;if(e.side===ya?l=n.intersectTriangle(r,s,i,!0,o):l=n.intersectTriangle(i,s,r,e.side===zn,o),l===null)return null;Rd.copy(o),Rd.applyMatrix4(t.matrixWorld);let u=a.ray.origin.distanceTo(Rd);return u<a.near||u>a.far?null:{distance:u,point:Rd.clone(),object:t}}function Dd(t,e,a,n,i,s,r,o,l,u){t.getVertexPosition(o,Ad),t.getVertexPosition(l,Ed),t.getVertexPosition(u,wd);let c=WE(t,e,a,n,Ad,Ed,wd,Wb);if(c){let f=new P;Ds.getBarycoord(Wb,Ad,Ed,wd,f),i&&(c.uv=Ds.getInterpolatedAttribute(i,o,l,u,f,new Ie)),s&&(c.uv1=Ds.getInterpolatedAttribute(s,o,l,u,f,new Ie)),r&&(c.normal=Ds.getInterpolatedAttribute(r,o,l,u,f,new P),c.normal.dot(n.direction)>0&&c.normal.multiplyScalar(-1));let d={a:o,b:l,c:u,normal:new P,materialIndex:0};Ds.getNormal(Ad,Ed,wd,d.normal),c.face=d,c.barycoord=f}return c}var Bs=class t extends ba{constructor(e=1,a=1,n=1,i=1,s=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:a,depth:n,widthSegments:i,heightSegments:s,depthSegments:r};let o=this;i=Math.floor(i),s=Math.floor(s),r=Math.floor(r);let l=[],u=[],c=[],f=[],d=0,p=0;g("z","y","x",-1,-1,n,a,e,r,s,0),g("z","y","x",1,-1,n,a,-e,r,s,1),g("x","z","y",1,1,e,n,a,i,r,2),g("x","z","y",1,-1,e,n,-a,i,r,3),g("x","y","z",1,-1,e,a,n,i,s,4),g("x","y","z",-1,-1,e,a,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new ea(u,3)),this.setAttribute("normal",new ea(c,3)),this.setAttribute("uv",new ea(f,2));function g(y,m,h,x,S,v,T,E,A,R,M){let b=v/A,I=T/R,F=v/2,G=T/2,z=E/2,X=A+1,k=R+1,K=0,O=0,ae=new P;for(let ce=0;ce<k;ce++){let me=ce*I-G;for(let Oe=0;Oe<X;Oe++){let Ye=Oe*b-F;ae[y]=Ye*x,ae[m]=me*S,ae[h]=z,u.push(ae.x,ae.y,ae.z),ae[y]=0,ae[m]=0,ae[h]=E>0?1:-1,c.push(ae.x,ae.y,ae.z),f.push(Oe/A),f.push(1-ce/R),K+=1}}for(let ce=0;ce<R;ce++)for(let me=0;me<A;me++){let Oe=d+me+X*ce,Ye=d+me+X*(ce+1),Qe=d+(me+1)+X*(ce+1),at=d+(me+1)+X*ce;l.push(Oe,Ye,at),l.push(Ye,Qe,at),O+=6}o.addGroup(p,O,M),p+=O,d+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Ir(t){let e={};for(let a in t){e[a]={};for(let n in t[a]){let i=t[a][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[a][n]=null):e[a][n]=i.clone():Array.isArray(i)?e[a][n]=i.slice():e[a][n]=i}}return e}function Ca(t){let e={};for(let a=0;a<t.length;a++){let n=Ir(t[a]);for(let i in n)e[i]=n[i]}return e}function XE(t){let e=[];for(let a=0;a<t.length;a++)e.push(t[a].clone());return e}function x0(t){let e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var Yi={clone:Ir,merge:Ca},YE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ZE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Jt=class extends Ma{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=YE,this.fragmentShader=ZE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ir(e.uniforms),this.uniformsGroups=XE(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let a=super.toJSON(e);a.glslVersion=this.glslVersion,a.uniforms={};for(let i in this.uniforms){let r=this.uniforms[i].value;r&&r.isTexture?a.uniforms[i]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?a.uniforms[i]={type:"c",value:r.getHex()}:r&&r.isVector2?a.uniforms[i]={type:"v2",value:r.toArray()}:r&&r.isVector3?a.uniforms[i]={type:"v3",value:r.toArray()}:r&&r.isVector4?a.uniforms[i]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?a.uniforms[i]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?a.uniforms[i]={type:"m4",value:r.toArray()}:a.uniforms[i]={value:r}}Object.keys(this.defines).length>0&&(a.defines=this.defines),a.vertexShader=this.vertexShader,a.fragmentShader=this.fragmentShader,a.lights=this.lights,a.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(a.extensions=n),a}},Ku=class extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new We,this.projectionMatrix=new We,this.projectionMatrixInverse=new We,this.coordinateSystem=Nn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,a){return super.copy(e,a),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,a){super.updateWorldMatrix(e,a),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Rs=new P,Xb=new Ie,Yb=new Ie,Zt=class extends Ku{constructor(e=50,a=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=a,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,a){return super.copy(e,a),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let a=.5*this.getFilmHeight()/e;this.fov=vr*2*Math.atan(a),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Hu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return vr*2*Math.atan(Math.tan(Hu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,a,n){Rs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),a.set(Rs.x,Rs.y).multiplyScalar(-e/Rs.z),Rs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Rs.x,Rs.y).multiplyScalar(-e/Rs.z)}getViewSize(e,a){return this.getViewBounds(e,Xb,Yb),a.subVectors(Yb,Xb)}setViewOffset(e,a,n,i,s,r){this.aspect=e/a,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=a,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,a=e*Math.tan(Hu*.5*this.fov)/this.zoom,n=2*a,i=this.aspect*n,s=-.5*i,r=this.view;if(this.view!==null&&this.view.enabled){let l=r.fullWidth,u=r.fullHeight;s+=r.offsetX*i/l,a-=r.offsetY*n/u,i*=r.width/l,n*=r.height/u}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,a,a-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let a=super.toJSON(e);return a.object.fov=this.fov,a.object.zoom=this.zoom,a.object.near=this.near,a.object.far=this.far,a.object.focus=this.focus,a.object.aspect=this.aspect,this.view!==null&&(a.object.view=Object.assign({},this.view)),a.object.filmGauge=this.filmGauge,a.object.filmOffset=this.filmOffset,a}},Go=-90,qo=1,Zd=class extends Et{constructor(e,a,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Zt(Go,qo,e,a);i.layers=this.layers,this.add(i);let s=new Zt(Go,qo,e,a);s.layers=this.layers,this.add(s);let r=new Zt(Go,qo,e,a);r.layers=this.layers,this.add(r);let o=new Zt(Go,qo,e,a);o.layers=this.layers,this.add(o);let l=new Zt(Go,qo,e,a);l.layers=this.layers,this.add(l);let u=new Zt(Go,qo,e,a);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){let e=this.coordinateSystem,a=this.children.concat(),[n,i,s,r,o,l]=a;for(let u of a)this.remove(u);if(e===Nn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===qu)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let u of a)this.add(u),u.updateMatrixWorld()}update(e,a){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,r,o,l,u,c]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(a,s),e.setRenderTarget(n,1,i),e.render(a,r),e.setRenderTarget(n,2,i),e.render(a,o),e.setRenderTarget(n,3,i),e.render(a,l),e.setRenderTarget(n,4,i),e.render(a,u),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,i),e.render(a,c),e.setRenderTarget(f,d,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Ju=class extends ta{constructor(e=[],a=Ar,n,i,s,r,o,l,u,c){super(e,a,n,i,s,r,o,l,u,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Kd=class extends ca{constructor(e=1,a={}){super(e,e,a),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Ju(i),this._setTextureOptions(a),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,a){this.texture.type=a.type,this.texture.colorSpace=a.colorSpace,this.texture.generateMipmaps=a.generateMipmaps,this.texture.minFilter=a.minFilter,this.texture.magFilter=a.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Bs(5,5,5),s=new Jt({name:"CubemapFromEquirect",uniforms:Ir(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ya,blending:kn});s.uniforms.tEquirect.value=a;let r=new pt(i,s),o=a.minFilter;return a.minFilter===Hn&&(a.minFilter=Ia),new Zd(1,10,this).update(e,r),a.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,a=!0,n=!0,i=!0){let s=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(a,n,i);e.setRenderTarget(s)}},On=class extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}},KE={type:"move"},$o=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new On,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new On,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new On,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let a=this._hand;if(a)for(let n of e.hand.values())this._getHandJoint(a,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,a,n){let i=null,s=null,r=null,o=this._targetRay,l=this._grip,u=this._hand;if(e&&a.session.visibilityState!=="visible-blurred"){if(u&&e.hand){r=!0;for(let y of e.hand.values()){let m=a.getJointPose(y,n),h=this._getHandJoint(u,y);m!==null&&(h.matrix.fromArray(m.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=m.radius),h.visible=m!==null}let c=u.joints["index-finger-tip"],f=u.joints["thumb-tip"],d=c.position.distanceTo(f.position),p=.02,g=.005;u.inputState.pinching&&d>p+g?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&d<=p-g&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=a.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=a.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(KE)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),u!==null&&(u.visible=r!==null),this}_getHandJoint(e,a){if(e.joints[a.jointName]===void 0){let n=new On;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[a.jointName]=n,e.add(n)}return e.joints[a.jointName]}};var _r=class extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Va,this.environmentIntensity=1,this.environmentRotation=new Va,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,a){return super.copy(e,a),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let a=super.toJSON(e);return this.fog!==null&&(a.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(a.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(a.object.backgroundIntensity=this.backgroundIntensity),a.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(a.object.environmentIntensity=this.environmentIntensity),a.object.environmentRotation=this.environmentRotation.toArray(),a}},el=class{constructor(e,a){this.isInterleavedBuffer=!0,this.array=e,this.stride=a,this.count=e!==void 0?e.length/a:0,this.usage=qd,this.updateRanges=[],this.version=0,this.uuid=Fn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,a){this.updateRanges.push({start:e,count:a})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,a,n){e*=this.stride,n*=a.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=a.array[n+i];return this}set(e,a=0){return this.array.set(e,a),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Fn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let a=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(a,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Fn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},wa=new P,tl=class t{constructor(e,a,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=a,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let a=0,n=this.data.count;a<n;a++)wa.fromBufferAttribute(this,a),wa.applyMatrix4(e),this.setXYZ(a,wa.x,wa.y,wa.z);return this}applyNormalMatrix(e){for(let a=0,n=this.count;a<n;a++)wa.fromBufferAttribute(this,a),wa.applyNormalMatrix(e),this.setXYZ(a,wa.x,wa.y,wa.z);return this}transformDirection(e){for(let a=0,n=this.count;a<n;a++)wa.fromBufferAttribute(this,a),wa.transformDirection(e),this.setXYZ(a,wa.x,wa.y,wa.z);return this}getComponent(e,a){let n=this.array[e*this.data.stride+this.offset+a];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,a,n){return this.normalized&&(n=xt(n,this.array)),this.data.array[e*this.data.stride+this.offset+a]=n,this}setX(e,a){return this.normalized&&(a=xt(a,this.array)),this.data.array[e*this.data.stride+this.offset]=a,this}setY(e,a){return this.normalized&&(a=xt(a,this.array)),this.data.array[e*this.data.stride+this.offset+1]=a,this}setZ(e,a){return this.normalized&&(a=xt(a,this.array)),this.data.array[e*this.data.stride+this.offset+2]=a,this}setW(e,a){return this.normalized&&(a=xt(a,this.array)),this.data.array[e*this.data.stride+this.offset+3]=a,this}getX(e){let a=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(a=Bn(a,this.array)),a}getY(e){let a=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(a=Bn(a,this.array)),a}getZ(e){let a=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(a=Bn(a,this.array)),a}getW(e){let a=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(a=Bn(a,this.array)),a}setXY(e,a,n){return e=e*this.data.stride+this.offset,this.normalized&&(a=xt(a,this.array),n=xt(n,this.array)),this.data.array[e+0]=a,this.data.array[e+1]=n,this}setXYZ(e,a,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(a=xt(a,this.array),n=xt(n,this.array),i=xt(i,this.array)),this.data.array[e+0]=a,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,a,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(a=xt(a,this.array),n=xt(n,this.array),i=xt(i,this.array),s=xt(s,this.array)),this.data.array[e+0]=a,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let a=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)a.push(this.data.array[i+s])}return new Kt(new this.array.constructor(a),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new t(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let a=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)a.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:a,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var Zb=new P,Kb=new lt,Jb=new lt,JE=new P,Qb=new We,Pd=new P,Nx=new Ha,jb=new We,Ox=new Sr,Qu=class extends pt{constructor(e,a){super(e,a),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Gx,this.bindMatrix=new We,this.bindMatrixInverse=new We,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new ln),this.boundingBox.makeEmpty();let a=e.getAttribute("position");for(let n=0;n<a.count;n++)this.getVertexPosition(n,Pd),this.boundingBox.expandByPoint(Pd)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ha),this.boundingSphere.makeEmpty();let a=e.getAttribute("position");for(let n=0;n<a.count;n++)this.getVertexPosition(n,Pd),this.boundingSphere.expandByPoint(Pd)}copy(e,a){return super.copy(e,a),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,a){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Nx.copy(this.boundingSphere),Nx.applyMatrix4(i),e.ray.intersectsSphere(Nx)!==!1&&(jb.copy(i).invert(),Ox.copy(e.ray).applyMatrix4(jb),!(this.boundingBox!==null&&Ox.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,a,Ox)))}getVertexPosition(e,a){return super.getVertexPosition(e,a),this.applyBoneTransform(e,a),a}bind(e,a){this.skeleton=e,a===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),a=this.matrixWorld),this.bindMatrix.copy(a),this.bindMatrixInverse.copy(a).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new lt,a=this.geometry.attributes.skinWeight;for(let n=0,i=a.count;n<i;n++){e.fromBufferAttribute(a,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),a.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Gx?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===UC?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,a){let n=this.skeleton,i=this.geometry;Kb.fromBufferAttribute(i.attributes.skinIndex,e),Jb.fromBufferAttribute(i.attributes.skinWeight,e),Zb.copy(a).applyMatrix4(this.bindMatrix),a.set(0,0,0);for(let s=0;s<4;s++){let r=Jb.getComponent(s);if(r!==0){let o=Kb.getComponent(s);Qb.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),a.addScaledVector(JE.copy(Zb).applyMatrix4(Qb),r)}}return a.applyMatrix4(this.bindMatrixInverse)}},al=class extends Et{constructor(){super(),this.isBone=!0,this.type="Bone"}},ju=class extends ta{constructor(e=null,a=1,n=1,i,s,r,o,l,u=ga,c=ga,f,d){super(null,r,o,l,u,c,i,s,f,d),this.isDataTexture=!0,this.image={data:e,width:a,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},$b=new We,QE=new We,$u=class t{constructor(e=[],a=[]){this.uuid=Fn(),this.bones=e.slice(0),this.boneInverses=a,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,a=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),a.length===0)this.calculateInverses();else if(e.length!==a.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new We)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,a=this.bones.length;e<a;e++){let n=new We;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,a=this.bones.length;e<a;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,a=this.bones.length;e<a;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,a=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,r=e.length;s<r;s++){let o=e[s]?e[s].matrixWorld:QE;$b.multiplyMatrices(o,a[s]),$b.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new t(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let a=new Float32Array(e*e*4);a.set(this.boneMatrices);let n=new ju(a,e,e,un,An);return n.needsUpdate=!0,this.boneMatrices=a,this.boneTexture=n,this}getBoneByName(e){for(let a=0,n=this.bones.length;a<n;a++){let i=this.bones[a];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,a){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],r=a[s];r===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),r=new al),this.bones.push(r),this.boneInverses.push(new We().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let a=this.bones,n=this.boneInverses;for(let i=0,s=a.length;i<s;i++){let r=a[i];e.bones.push(r.uuid);let o=n[i];e.boneInverses.push(o.toArray())}return e}},Ns=class extends Kt{constructor(e,a,n,i=1){super(e,a,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Wo=new We,eC=new We,Ud=[],tC=new ln,jE=new We,Ou=new pt,Fu=new Ha,Mr=class extends pt{constructor(e,a,n){super(e,a),this.isInstancedMesh=!0,this.instanceMatrix=new Ns(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,jE)}computeBoundingBox(){let e=this.geometry,a=this.count;this.boundingBox===null&&(this.boundingBox=new ln),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<a;n++)this.getMatrixAt(n,Wo),tC.copy(e.boundingBox).applyMatrix4(Wo),this.boundingBox.union(tC)}computeBoundingSphere(){let e=this.geometry,a=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ha),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<a;n++)this.getMatrixAt(n,Wo),Fu.copy(e.boundingSphere).applyMatrix4(Wo),this.boundingSphere.union(Fu)}copy(e,a){return super.copy(e,a),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,a){a.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,a){a.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,a){let n=a.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,r=e*s+1;for(let o=0;o<n.length;o++)n[o]=i[r+o]}raycast(e,a){let n=this.matrixWorld,i=this.count;if(Ou.geometry=this.geometry,Ou.material=this.material,Ou.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Fu.copy(this.boundingSphere),Fu.applyMatrix4(n),e.ray.intersectsSphere(Fu)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Wo),eC.multiplyMatrices(n,Wo),Ou.matrixWorld=eC,Ou.raycast(e,Ud);for(let r=0,o=Ud.length;r<o;r++){let l=Ud[r];l.instanceId=s,l.object=this,a.push(l)}Ud.length=0}}setColorAt(e,a){this.instanceColor===null&&(this.instanceColor=new Ns(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),a.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,a){a.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,a){let n=a.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new ju(new Float32Array(i*this.count),i,this.count,wh,An));let s=this.morphTexture.source.data.data,r=0;for(let u=0;u<n.length;u++)r+=n[u];let o=this.geometry.morphTargetsRelative?1:1-r,l=i*e;s[l]=o,s.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Fx=new P,$E=new P,ew=new qe,jn=class{constructor(e=new P(1,0,0),a=0){this.isPlane=!0,this.normal=e,this.constant=a}set(e,a){return this.normal.copy(e),this.constant=a,this}setComponents(e,a,n,i){return this.normal.set(e,a,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,a){return this.normal.copy(e),this.constant=-a.dot(this.normal),this}setFromCoplanarPoints(e,a,n){let i=Fx.subVectors(n,a).cross($E.subVectors(e,a)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,a){return a.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,a){let n=e.delta(Fx),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?a.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:a.copy(e.start).addScaledVector(n,s)}intersectsLine(e){let a=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return a<0&&n>0||n<0&&a>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,a){let n=a||ew.getNormalMatrix(e),i=this.coplanarPoint(Fx).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},hr=new Ha,tw=new Ie(.5,.5),Bd=new P,nl=class{constructor(e=new jn,a=new jn,n=new jn,i=new jn,s=new jn,r=new jn){this.planes=[e,a,n,i,s,r]}set(e,a,n,i,s,r){let o=this.planes;return o[0].copy(e),o[1].copy(a),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(r),this}copy(e){let a=this.planes;for(let n=0;n<6;n++)a[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,a=Nn,n=!1){let i=this.planes,s=e.elements,r=s[0],o=s[1],l=s[2],u=s[3],c=s[4],f=s[5],d=s[6],p=s[7],g=s[8],y=s[9],m=s[10],h=s[11],x=s[12],S=s[13],v=s[14],T=s[15];if(i[0].setComponents(u-r,p-c,h-g,T-x).normalize(),i[1].setComponents(u+r,p+c,h+g,T+x).normalize(),i[2].setComponents(u+o,p+f,h+y,T+S).normalize(),i[3].setComponents(u-o,p-f,h-y,T-S).normalize(),n)i[4].setComponents(l,d,m,v).normalize(),i[5].setComponents(u-l,p-d,h-m,T-v).normalize();else if(i[4].setComponents(u-l,p-d,h-m,T-v).normalize(),a===Nn)i[5].setComponents(u+l,p+d,h+m,T+v).normalize();else if(a===qu)i[5].setComponents(l,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+a);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),hr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let a=e.geometry;a.boundingSphere===null&&a.computeBoundingSphere(),hr.copy(a.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(hr)}intersectsSprite(e){hr.center.set(0,0,0);let a=tw.distanceTo(e.center);return hr.radius=.7071067811865476+a,hr.applyMatrix4(e.matrixWorld),this.intersectsSphere(hr)}intersectsSphere(e){let a=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(a[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let a=this.planes;for(let n=0;n<6;n++){let i=a[n];if(Bd.x=i.normal.x>0?e.max.x:e.min.x,Bd.y=i.normal.y>0?e.max.y:e.min.y,Bd.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Bd)<0)return!1}return!0}containsPoint(e){let a=this.planes;for(let n=0;n<6;n++)if(a[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var il=class extends Ma{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Jd=new P,Qd=new P,aC=new We,zu=new Sr,Nd=new Ha,zx=new P,nC=new P,br=class extends Et{constructor(e=new ba,a=new il){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=a,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,a){return super.copy(e,a),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let a=e.attributes.position,n=[0];for(let i=1,s=a.count;i<s;i++)Jd.fromBufferAttribute(a,i-1),Qd.fromBufferAttribute(a,i),n[i]=n[i-1],n[i]+=Jd.distanceTo(Qd);e.setAttribute("lineDistance",new ea(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,a){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Nd.copy(n.boundingSphere),Nd.applyMatrix4(i),Nd.radius+=s,e.ray.intersectsSphere(Nd)===!1)return;aC.copy(i).invert(),zu.copy(e.ray).applyMatrix4(aC);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,u=this.isLineSegments?2:1,c=n.index,d=n.attributes.position;if(c!==null){let p=Math.max(0,r.start),g=Math.min(c.count,r.start+r.count);for(let y=p,m=g-1;y<m;y+=u){let h=c.getX(y),x=c.getX(y+1),S=Od(this,e,zu,l,h,x,y);S&&a.push(S)}if(this.isLineLoop){let y=c.getX(g-1),m=c.getX(p),h=Od(this,e,zu,l,y,m,g-1);h&&a.push(h)}}else{let p=Math.max(0,r.start),g=Math.min(d.count,r.start+r.count);for(let y=p,m=g-1;y<m;y+=u){let h=Od(this,e,zu,l,y,y+1,y);h&&a.push(h)}if(this.isLineLoop){let y=Od(this,e,zu,l,g-1,p,g-1);y&&a.push(y)}}}updateMorphTargets(){let a=this.geometry.morphAttributes,n=Object.keys(a);if(n.length>0){let i=a[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function Od(t,e,a,n,i,s,r){let o=t.geometry.attributes.position;if(Jd.fromBufferAttribute(o,i),Qd.fromBufferAttribute(o,s),a.distanceSqToSegment(Jd,Qd,zx,nC)>n)return;zx.applyMatrix4(t.matrixWorld);let u=e.ray.origin.distanceTo(zx);if(!(u<e.near||u>e.far))return{distance:u,point:nC.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}var iC=new P,sC=new P,ec=class extends br{constructor(e,a){super(e,a),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let a=e.attributes.position,n=[];for(let i=0,s=a.count;i<s;i+=2)iC.fromBufferAttribute(a,i),sC.fromBufferAttribute(a,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+iC.distanceTo(sC);e.setAttribute("lineDistance",new ea(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},tc=class extends br{constructor(e,a){super(e,a),this.isLineLoop=!0,this.type="LineLoop"}},sl=class extends Ma{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ae(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},rC=new We,Zx=new Sr,Fd=new Ha,zd=new P,ac=class extends Et{constructor(e=new ba,a=new sl){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=a,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,a){return super.copy(e,a),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,a){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Fd.copy(n.boundingSphere),Fd.applyMatrix4(i),Fd.radius+=s,e.ray.intersectsSphere(Fd)===!1)return;rC.copy(i).invert(),Zx.copy(e.ray).applyMatrix4(rC);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,u=n.index,f=n.attributes.position;if(u!==null){let d=Math.max(0,r.start),p=Math.min(u.count,r.start+r.count);for(let g=d,y=p;g<y;g++){let m=u.getX(g);zd.fromBufferAttribute(f,m),oC(zd,m,l,i,e,a,this)}}else{let d=Math.max(0,r.start),p=Math.min(f.count,r.start+r.count);for(let g=d,y=p;g<y;g++)zd.fromBufferAttribute(f,g),oC(zd,g,l,i,e,a,this)}}updateMorphTargets(){let a=this.geometry.morphAttributes,n=Object.keys(a);if(n.length>0){let i=a[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function oC(t,e,a,n,i,s,r){let o=Zx.distanceSqToPoint(t);if(o<a){let l=new P;Zx.closestPointToPoint(t,l),l.applyMatrix4(n);let u=i.ray.origin.distanceTo(l);if(u<i.near||u>i.far)return;s.push({distance:u,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:r})}}var nc=class extends ta{constructor(e,a,n,i,s,r,o,l,u){super(e,a,n,i,s,r,o,l,u),this.isCanvasTexture=!0,this.needsUpdate=!0}},ic=class extends ta{constructor(e,a,n=Os,i,s,r,o=ga,l=ga,u,c=Ko,f=1){if(c!==Ko&&c!==fl)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:a,depth:f};super(d,i,s,r,o,l,c,n,u),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new jo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let a=super.toJSON(e);return this.compareFunction!==null&&(a.compareFunction=this.compareFunction),a}},sc=class extends ta{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var rc=class t extends ba{constructor(e=1,a=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:a,thetaStart:n,thetaLength:i},a=Math.max(3,a);let s=[],r=[],o=[],l=[],u=new P,c=new Ie;r.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=a;f++,d+=3){let p=n+f/a*i;u.x=e*Math.cos(p),u.y=e*Math.sin(p),r.push(u.x,u.y,u.z),o.push(0,0,1),c.x=(r[d]/e+1)/2,c.y=(r[d+1]/e+1)/2,l.push(c.x,c.y)}for(let f=1;f<=a;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new ea(r,3)),this.setAttribute("normal",new ea(o,3)),this.setAttribute("uv",new ea(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.radius,e.segments,e.thetaStart,e.thetaLength)}};var Cr=class t extends ba{constructor(e=1,a=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:a,widthSegments:n,heightSegments:i};let s=e/2,r=a/2,o=Math.floor(n),l=Math.floor(i),u=o+1,c=l+1,f=e/o,d=a/l,p=[],g=[],y=[],m=[];for(let h=0;h<c;h++){let x=h*d-r;for(let S=0;S<u;S++){let v=S*f-s;g.push(v,-x,0),y.push(0,0,1),m.push(S/o),m.push(1-h/l)}}for(let h=0;h<l;h++)for(let x=0;x<o;x++){let S=x+u*h,v=x+u*(h+1),T=x+1+u*(h+1),E=x+1+u*h;p.push(S,v,E),p.push(v,T,E)}this.setIndex(p),this.setAttribute("position",new ea(g,3)),this.setAttribute("normal",new ea(y,3)),this.setAttribute("uv",new ea(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.width,e.height,e.widthSegments,e.heightSegments)}};var oc=class extends Ma{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Ae(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}},lc=class extends Jt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ti=class extends Ma{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ae(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=op,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Va,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ga=class extends ti{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ie(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return et(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(a){this.ior=(1+.4*a)/(1-.4*a)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ae(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ae(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ae(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var uc=class extends Ma{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=op,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Va,this.combine=gh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},jd=class extends Ma{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=NC,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},$d=class extends Ma{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function kd(t,e){return!t||t.constructor===e?t:typeof e.BYTES_PER_ELEMENT=="number"?new e(t):Array.prototype.slice.call(t)}function aw(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}function nw(t){function e(i,s){return t[i]-t[s]}let a=t.length,n=new Array(a);for(let i=0;i!==a;++i)n[i]=i;return n.sort(e),n}function lC(t,e,a){let n=t.length,i=new t.constructor(n);for(let s=0,r=0;r!==n;++s){let o=a[s]*e;for(let l=0;l!==e;++l)i[r++]=t[o+l]}return i}function KC(t,e,a,n){let i=1,s=t[0];for(;s!==void 0&&s[n]===void 0;)s=t[i++];if(s===void 0)return;let r=s[n];if(r!==void 0)if(Array.isArray(r))do r=s[n],r!==void 0&&(e.push(s.time),a.push(...r)),s=t[i++];while(s!==void 0);else if(r.toArray!==void 0)do r=s[n],r!==void 0&&(e.push(s.time),r.toArray(a,a.length)),s=t[i++];while(s!==void 0);else do r=s[n],r!==void 0&&(e.push(s.time),a.push(r)),s=t[i++];while(s!==void 0)}var zi=class{constructor(e,a,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new a.constructor(n),this.sampleValues=a,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let a=this.parameterPositions,n=this._cachedIndex,i=a[n],s=a[n-1];e:{t:{let r;a:{n:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break n;return n=a.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=a[++n],e<i)break t}r=a.length;break a}if(!(e>=s)){let o=a[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=a[--n-1],e>=s)break t}r=n,n=0;break a}break e}for(;n<r;){let o=n+r>>>1;e<a[o]?r=o:n=o+1}if(i=a[n],s=a[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=a.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let a=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let r=0;r!==i;++r)a[r]=n[s+r];return a}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},eh=class extends zi{constructor(e,a,n,i){super(e,a,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:qx,endingEnd:qx}}intervalChanged_(e,a,n){let i=this.parameterPositions,s=e-2,r=e+1,o=i[s],l=i[r];if(o===void 0)switch(this.getSettings_().endingStart){case Wx:s=e,o=2*a-n;break;case Xx:s=i.length-2,o=a+i[s]-i[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Wx:r=e,l=2*n-a;break;case Xx:r=1,l=n+i[1]-i[0];break;default:r=e-1,l=a}let u=(n-a)*.5,c=this.valueSize;this._weightPrev=u/(a-o),this._weightNext=u/(l-n),this._offsetPrev=s*c,this._offsetNext=r*c}interpolate_(e,a,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=e*o,u=l-o,c=this._offsetPrev,f=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-a)/(i-a),y=g*g,m=y*g,h=-d*m+2*d*y-d*g,x=(1+d)*m+(-1.5-2*d)*y+(-.5+d)*g+1,S=(-1-p)*m+(1.5+p)*y+.5*g,v=p*m-p*y;for(let T=0;T!==o;++T)s[T]=h*r[c+T]+x*r[u+T]+S*r[l+T]+v*r[f+T];return s}},th=class extends zi{constructor(e,a,n,i){super(e,a,n,i)}interpolate_(e,a,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=e*o,u=l-o,c=(n-a)/(i-a),f=1-c;for(let d=0;d!==o;++d)s[d]=r[u+d]*f+r[l+d]*c;return s}},ah=class extends zi{constructor(e,a,n,i){super(e,a,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},qa=class{constructor(e,a,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(a===void 0||a.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=kd(a,this.TimeBufferType),this.values=kd(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let a=e.constructor,n;if(a.toJSON!==this.toJSON)n=a.toJSON(e);else{n={name:e.name,times:kd(e.times,Array),values:kd(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ah(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new th(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new eh(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let a;switch(e){case xr:a=this.InterpolantFactoryMethodDiscrete;break;case yr:a=this.InterpolantFactoryMethodLinear;break;case Hd:a=this.InterpolantFactoryMethodSmooth;break}if(a===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=a,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return xr;case this.InterpolantFactoryMethodLinear:return yr;case this.InterpolantFactoryMethodSmooth:return Hd}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let a=this.times;for(let n=0,i=a.length;n!==i;++n)a[n]+=e}return this}scale(e){if(e!==1){let a=this.times;for(let n=0,i=a.length;n!==i;++n)a[n]*=e}return this}trim(e,a){let n=this.times,i=n.length,s=0,r=i-1;for(;s!==i&&n[s]<e;)++s;for(;r!==-1&&n[r]>a;)--r;if(++r,s!==0||r!==i){s>=r&&(r=Math.max(r,1),s=r-1);let o=this.getValueSize();this.times=n.slice(s,r),this.values=this.values.slice(s*o,r*o)}return this}validate(){let e=!0,a=this.getValueSize();a-Math.floor(a)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let r=null;for(let o=0;o!==s;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(r!==null&&r>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,r),e=!1;break}r=l}if(i!==void 0&&aw(i))for(let o=0,l=i.length;o!==l;++o){let u=i[o];if(isNaN(u)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,u),e=!1;break}}return e}optimize(){let e=this.times.slice(),a=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Hd,s=e.length-1,r=1;for(let o=1;o<s;++o){let l=!1,u=e[o],c=e[o+1];if(u!==c&&(o!==1||u!==e[0]))if(i)l=!0;else{let f=o*n,d=f-n,p=f+n;for(let g=0;g!==n;++g){let y=a[f+g];if(y!==a[d+g]||y!==a[p+g]){l=!0;break}}}if(l){if(o!==r){e[r]=e[o];let f=o*n,d=r*n;for(let p=0;p!==n;++p)a[d+p]=a[f+p]}++r}}if(s>0){e[r]=e[s];for(let o=s*n,l=r*n,u=0;u!==n;++u)a[l+u]=a[o+u];++r}return r!==e.length?(this.times=e.slice(0,r),this.values=a.slice(0,r*n)):(this.times=e,this.values=a),this}clone(){let e=this.times.slice(),a=this.values.slice(),n=this.constructor,i=new n(this.name,e,a);return i.createInterpolant=this.createInterpolant,i}};qa.prototype.ValueTypeName="";qa.prototype.TimeBufferType=Float32Array;qa.prototype.ValueBufferType=Float32Array;qa.prototype.DefaultInterpolation=yr;var ki=class extends qa{constructor(e,a,n){super(e,a,n)}};ki.prototype.ValueTypeName="bool";ki.prototype.ValueBufferType=Array;ki.prototype.DefaultInterpolation=xr;ki.prototype.InterpolantFactoryMethodLinear=void 0;ki.prototype.InterpolantFactoryMethodSmooth=void 0;var cc=class extends qa{constructor(e,a,n,i){super(e,a,n,i)}};cc.prototype.ValueTypeName="color";var ai=class extends qa{constructor(e,a,n,i){super(e,a,n,i)}};ai.prototype.ValueTypeName="number";var nh=class extends zi{constructor(e,a,n,i){super(e,a,n,i)}interpolate_(e,a,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=(n-a)/(i-a),u=e*o;for(let c=u+o;u!==c;u+=4)ua.slerpFlat(s,0,r,u-o,r,u,l);return s}},ni=class extends qa{constructor(e,a,n,i){super(e,a,n,i)}InterpolantFactoryMethodLinear(e){return new nh(this.times,this.values,this.getValueSize(),e)}};ni.prototype.ValueTypeName="quaternion";ni.prototype.InterpolantFactoryMethodSmooth=void 0;var Hi=class extends qa{constructor(e,a,n){super(e,a,n)}};Hi.prototype.ValueTypeName="string";Hi.prototype.ValueBufferType=Array;Hi.prototype.DefaultInterpolation=xr;Hi.prototype.InterpolantFactoryMethodLinear=void 0;Hi.prototype.InterpolantFactoryMethodSmooth=void 0;var ii=class extends qa{constructor(e,a,n,i){super(e,a,n,i)}};ii.prototype.ValueTypeName="vector";var fc=class{constructor(e="",a=-1,n=[],i=BC){this.name=e,this.tracks=n,this.duration=a,this.blendMode=i,this.uuid=Fn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let a=[],n=e.tracks,i=1/(e.fps||1);for(let r=0,o=n.length;r!==o;++r)a.push(sw(n[r]).scale(i));let s=new this(e.name,e.duration,a,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let a=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:a,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,r=n.length;s!==r;++s)a.push(qa.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,a,n,i){let s=a.length,r=[];for(let o=0;o<s;o++){let l=[],u=[];l.push((o+s-1)%s,o,(o+1)%s),u.push(0,1,0);let c=nw(l);l=lC(l,1,c),u=lC(u,1,c),!i&&l[0]===0&&(l.push(s),u.push(u[0])),r.push(new ai(".morphTargetInfluences["+a[o].name+"]",l,u).scale(1/n))}return new this(e,-1,r)}static findByName(e,a){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===a)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,a,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let u=e[o],c=u.name.match(s);if(c&&c.length>1){let f=c[1],d=i[f];d||(i[f]=d=[]),d.push(u)}}let r=[];for(let o in i)r.push(this.CreateFromMorphTargetSequence(o,i[o],a,n));return r}static parseAnimation(e,a){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(f,d,p,g,y){if(p.length!==0){let m=[],h=[];KC(p,m,h,g),m.length!==0&&y.push(new f(d,m,h))}},i=[],s=e.name||"default",r=e.fps||30,o=e.blendMode,l=e.length||-1,u=e.hierarchy||[];for(let f=0;f<u.length;f++){let d=u[f].keys;if(!(!d||d.length===0))if(d[0].morphTargets){let p={},g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let y=0;y<d[g].morphTargets.length;y++)p[d[g].morphTargets[y]]=-1;for(let y in p){let m=[],h=[];for(let x=0;x!==d[g].morphTargets.length;++x){let S=d[g];m.push(S.time),h.push(S.morphTarget===y?1:0)}i.push(new ai(".morphTargetInfluence["+y+"]",m,h))}l=p.length*r}else{let p=".bones["+a[f].name+"]";n(ii,p+".position",d,"pos",i),n(ni,p+".quaternion",d,"rot",i),n(ii,p+".scale",d,"scl",i)}}return i.length===0?null:new this(s,l,i,o)}resetDuration(){let e=this.tracks,a=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];a=Math.max(a,s.times[s.times.length-1])}return this.duration=a,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let a=0;a<this.tracks.length;a++)e=e&&this.tracks[a].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let a=new this.constructor(this.name,this.duration,e,this.blendMode);return a.userData=JSON.parse(JSON.stringify(this.userData)),a}toJSON(){return this.constructor.toJSON(this)}};function iw(t){switch(t.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ai;case"vector":case"vector2":case"vector3":case"vector4":return ii;case"color":return cc;case"quaternion":return ni;case"bool":case"boolean":return ki;case"string":return Hi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+t)}function sw(t){if(t.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=iw(t.type);if(t.times===void 0){let a=[],n=[];KC(t.keys,a,n,"value"),t.times=a,t.values=n}return e.parse!==void 0?e.parse(t):new e(t.name,t.times,t.values,t.interpolation)}var ei={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(this.files[t]=e)},get:function(t){if(this.enabled!==!1)return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}},ih=class{constructor(e,a,n){let i=this,s=!1,r=0,o=0,l,u=[];this.onStart=void 0,this.onLoad=e,this.onProgress=a,this.onError=n,this.abortController=new AbortController,this.itemStart=function(c){o++,s===!1&&i.onStart!==void 0&&i.onStart(c,r,o),s=!0},this.itemEnd=function(c){r++,i.onProgress!==void 0&&i.onProgress(c,r,o),r===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(c){i.onError!==void 0&&i.onError(c)},this.resolveURL=function(c){return l?l(c):c},this.setURLModifier=function(c){return l=c,this},this.addHandler=function(c,f){return u.push(c,f),this},this.removeHandler=function(c){let f=u.indexOf(c);return f!==-1&&u.splice(f,2),this},this.getHandler=function(c){for(let f=0,d=u.length;f<d;f+=2){let p=u[f],g=u[f+1];if(p.global&&(p.lastIndex=0),p.test(c))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},JC=new ih,si=class{constructor(e){this.manager=e!==void 0?e:JC,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,a){let n=this;return new Promise(function(i,s){n.load(e,i,a,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};si.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ni={},Kx=class extends Error{constructor(e,a){super(e),this.response=a}},rl=class extends si{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,a,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=ei.get(`file:${e}`);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{a&&a(s),this.manager.itemEnd(e)},0),s;if(Ni[e]!==void 0){Ni[e].push({onLoad:a,onProgress:n,onError:i});return}Ni[e]=[],Ni[e].push({onLoad:a,onProgress:n,onError:i});let r=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(r).then(u=>{if(u.status===200||u.status===0){if(u.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||u.body===void 0||u.body.getReader===void 0)return u;let c=Ni[e],f=u.body.getReader(),d=u.headers.get("X-File-Size")||u.headers.get("Content-Length"),p=d?parseInt(d):0,g=p!==0,y=0,m=new ReadableStream({start(h){x();function x(){f.read().then(({done:S,value:v})=>{if(S)h.close();else{y+=v.byteLength;let T=new ProgressEvent("progress",{lengthComputable:g,loaded:y,total:p});for(let E=0,A=c.length;E<A;E++){let R=c[E];R.onProgress&&R.onProgress(T)}h.enqueue(v),x()}},S=>{h.error(S)})}}});return new Response(m)}else throw new Kx(`fetch for "${u.url}" responded with ${u.status}: ${u.statusText}`,u)}).then(u=>{switch(l){case"arraybuffer":return u.arrayBuffer();case"blob":return u.blob();case"document":return u.text().then(c=>new DOMParser().parseFromString(c,o));case"json":return u.json();default:if(o==="")return u.text();{let f=/charset="?([^;"\s]*)"?/i.exec(o),d=f&&f[1]?f[1].toLowerCase():void 0,p=new TextDecoder(d);return u.arrayBuffer().then(g=>p.decode(g))}}}).then(u=>{ei.add(`file:${e}`,u);let c=Ni[e];delete Ni[e];for(let f=0,d=c.length;f<d;f++){let p=c[f];p.onLoad&&p.onLoad(u)}}).catch(u=>{let c=Ni[e];if(c===void 0)throw this.manager.itemError(e),u;delete Ni[e];for(let f=0,d=c.length;f<d;f++){let p=c[f];p.onError&&p.onError(u)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Xo=new WeakMap,sh=class extends si{constructor(e){super(e)}load(e,a,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,r=ei.get(`image:${e}`);if(r!==void 0){if(r.complete===!0)s.manager.itemStart(e),setTimeout(function(){a&&a(r),s.manager.itemEnd(e)},0);else{let f=Xo.get(r);f===void 0&&(f=[],Xo.set(r,f)),f.push({onLoad:a,onError:i})}return r}let o=Jo("img");function l(){c(),a&&a(this);let f=Xo.get(this)||[];for(let d=0;d<f.length;d++){let p=f[d];p.onLoad&&p.onLoad(this)}Xo.delete(this),s.manager.itemEnd(e)}function u(f){c(),i&&i(f),ei.remove(`image:${e}`);let d=Xo.get(this)||[];for(let p=0;p<d.length;p++){let g=d[p];g.onError&&g.onError(f)}Xo.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function c(){o.removeEventListener("load",l,!1),o.removeEventListener("error",u,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",u,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ei.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}};var dc=class extends si{constructor(e){super(e)}load(e,a,n,i){let s=new ta,r=new sh(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(e,function(o){s.image=o,s.needsUpdate=!0,a!==void 0&&a(s)},n,i),s}},Tr=class extends Et{constructor(e,a=1){super(),this.isLight=!0,this.type="Light",this.color=new Ae(e),this.intensity=a}dispose(){}copy(e,a){return super.copy(e,a),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let a=super.toJSON(e);return a.object.color=this.color.getHex(),a.object.intensity=this.intensity,this.groundColor!==void 0&&(a.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(a.object.distance=this.distance),this.angle!==void 0&&(a.object.angle=this.angle),this.decay!==void 0&&(a.object.decay=this.decay),this.penumbra!==void 0&&(a.object.penumbra=this.penumbra),this.shadow!==void 0&&(a.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(a.object.target=this.target.uuid),a}},hc=class extends Tr{constructor(e,a,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ae(a)}copy(e,a){return super.copy(e,a),this.groundColor.copy(e.groundColor),this}},kx=new We,uC=new P,cC=new P,pc=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ie(512,512),this.mapType=Vn,this.map=null,this.mapPass=null,this.matrix=new We,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new nl,this._frameExtents=new Ie(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let a=this.camera,n=this.matrix;uC.setFromMatrixPosition(e.matrixWorld),a.position.copy(uC),cC.setFromMatrixPosition(e.target.matrixWorld),a.lookAt(cC),a.updateMatrixWorld(),kx.multiplyMatrices(a.projectionMatrix,a.matrixWorldInverse),this._frustum.setFromProjectionMatrix(kx,a.coordinateSystem,a.reversedDepth),a.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(kx)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Jx=class extends pc{constructor(){super(new Zt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let a=this.camera,n=vr*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||a.far;(n!==a.fov||i!==a.aspect||s!==a.far)&&(a.fov=n,a.aspect=i,a.far=s,a.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},mc=class extends Tr{constructor(e,a,n=0,i=Math.PI/3,s=0,r=2){super(e,a),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.distance=n,this.angle=i,this.penumbra=s,this.decay=r,this.map=null,this.shadow=new Jx}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,a){return super.copy(e,a),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},fC=new We,ku=new P,Hx=new P,Qx=class extends pc{constructor(){super(new Zt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ie(4,2),this._viewportCount=6,this._viewports=[new lt(2,1,1,1),new lt(0,1,1,1),new lt(3,1,1,1),new lt(1,1,1,1),new lt(3,0,1,1),new lt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,a=0){let n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),ku.setFromMatrixPosition(e.matrixWorld),n.position.copy(ku),Hx.copy(n.position),Hx.add(this._cubeDirections[a]),n.up.copy(this._cubeUps[a]),n.lookAt(Hx),n.updateMatrixWorld(),i.makeTranslation(-ku.x,-ku.y,-ku.z),fC.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(fC,n.coordinateSystem,n.reversedDepth)}},Lr=class extends Tr{constructor(e,a,n=0,i=2){super(e,a),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Qx}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,a){return super.copy(e,a),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Vi=class extends Ku{constructor(e=-1,a=1,n=1,i=-1,s=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=a,this.top=n,this.bottom=i,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(e,a){return super.copy(e,a),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,a,n,i,s,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=a,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),a=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,r=n+e,o=i+a,l=i-a;if(this.view!==null&&this.view.enabled){let u=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=u*this.view.offsetX,r=s+u*this.view.width,o-=c*this.view.offsetY,l=o-c*this.view.height}this.projectionMatrix.makeOrthographic(s,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let a=super.toJSON(e);return a.object.zoom=this.zoom,a.object.left=this.left,a.object.right=this.right,a.object.top=this.top,a.object.bottom=this.bottom,a.object.near=this.near,a.object.far=this.far,this.view!==null&&(a.object.view=Object.assign({},this.view)),a}},jx=class extends pc{constructor(){super(new Vi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Gi=class extends Tr{constructor(e,a){super(e,a),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new jx}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var qi=class{static extractUrlBase(e){let a=e.lastIndexOf("/");return a===-1?"./":e.slice(0,a+1)}static resolveURL(e,a){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(a)&&/^\//.test(e)&&(a=a.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:a+e)}};var Vx=new WeakMap,gc=class extends si{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,a,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,r=ei.get(`image-bitmap:${e}`);if(r!==void 0){if(s.manager.itemStart(e),r.then){r.then(u=>{if(Vx.has(r)===!0)i&&i(Vx.get(r)),s.manager.itemError(e),s.manager.itemEnd(e);else return a&&a(u),s.manager.itemEnd(e),u});return}return setTimeout(function(){a&&a(r),s.manager.itemEnd(e)},0),r}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(u){return u.blob()}).then(function(u){return createImageBitmap(u,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(u){return ei.add(`image-bitmap:${e}`,u),a&&a(u),s.manager.itemEnd(e),u}).catch(function(u){i&&i(u),Vx.set(l,u),ei.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});ei.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var rh=class extends Zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},xc=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let a=performance.now();e=(a-this.oldTime)/1e3,this.oldTime=a,this.elapsedTime+=e}return e}};var y0="\\[\\]\\.:\\/",rw=new RegExp("["+y0+"]","g"),v0="[^"+y0+"]",ow="[^"+y0.replace("\\.","")+"]",lw=/((?:WC+[\/:])*)/.source.replace("WC",v0),uw=/(WCOD+)?/.source.replace("WCOD",ow),cw=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",v0),fw=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",v0),dw=new RegExp("^"+lw+uw+cw+fw+"$"),hw=["material","materials","bones","map"],$x=class{constructor(e,a,n){let i=n||bt.parseTrackName(a);this._targetGroup=e,this._bindings=e.subscribe_(a,i)}getValue(e,a){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,a)}setValue(e,a){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,a)}bind(){let e=this._bindings;for(let a=this._targetGroup.nCachedObjects_,n=e.length;a!==n;++a)e[a].bind()}unbind(){let e=this._bindings;for(let a=this._targetGroup.nCachedObjects_,n=e.length;a!==n;++a)e[a].unbind()}},bt=class t{constructor(e,a,n){this.path=a,this.parsedPath=n||t.parseTrackName(a),this.node=t.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,a,n){return e&&e.isAnimationObjectGroup?new t.Composite(e,a,n):new t(e,a,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(rw,"")}static parseTrackName(e){let a=dw.exec(e);if(a===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:a[2],objectName:a[3],objectIndex:a[4],propertyName:a[5],propertyIndex:a[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);hw.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,a){if(a===void 0||a===""||a==="."||a===-1||a===e.name||a===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(a);if(n!==void 0)return n}if(e.children){let n=function(s){for(let r=0;r<s.length;r++){let o=s[r];if(o.name===a||o.uuid===a)return o;let l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,a){e[a]=this.targetObject[this.propertyName]}_getValue_array(e,a){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[a++]=n[i]}_getValue_arrayElement(e,a){e[a]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,a){this.resolvedProperty.toArray(e,a)}_setValue_direct(e,a){this.targetObject[this.propertyName]=e[a]}_setValue_direct_setNeedsUpdate(e,a){this.targetObject[this.propertyName]=e[a],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,a){this.targetObject[this.propertyName]=e[a],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,a){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[a++]}_setValue_array_setNeedsUpdate(e,a){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[a++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,a){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[a++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,a){this.resolvedProperty[this.propertyIndex]=e[a]}_setValue_arrayElement_setNeedsUpdate(e,a){this.resolvedProperty[this.propertyIndex]=e[a],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,a){this.resolvedProperty[this.propertyIndex]=e[a],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,a){this.resolvedProperty.fromArray(e,a)}_setValue_fromArray_setNeedsUpdate(e,a){this.resolvedProperty.fromArray(e,a),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,a){this.resolvedProperty.fromArray(e,a),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,a){this.bind(),this.getValue(e,a)}_setValue_unbound(e,a){this.bind(),this.setValue(e,a)}bind(){let e=this.node,a=this.parsedPath,n=a.objectName,i=a.propertyName,s=a.propertyIndex;if(e||(e=t.findNode(this.rootNode,a.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let u=a.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let c=0;c<e.length;c++)if(e[c].name===u){u=c;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(u!==void 0){if(e[u]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[u]}}let r=e[i];if(r===void 0){let u=a.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+u+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else r.fromArray!==void 0&&r.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(l=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};bt.Composite=$x;bt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};bt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};bt.prototype.GetterByBindingType=[bt.prototype._getValue_direct,bt.prototype._getValue_array,bt.prototype._getValue_arrayElement,bt.prototype._getValue_toArray];bt.prototype.SetterByBindingTypeAndVersioning=[[bt.prototype._setValue_direct,bt.prototype._setValue_direct_setNeedsUpdate,bt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_array,bt.prototype._setValue_array_setNeedsUpdate,bt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_arrayElement,bt.prototype._setValue_arrayElement_setNeedsUpdate,bt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_fromArray,bt.prototype._setValue_fromArray_setNeedsUpdate,bt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var _U=new Float32Array(1);function S0(t,e,a,n){let i=pw(n);switch(a){case u0:return t*e;case wh:return t*e/i.components*i.byteLength;case Ih:return t*e/i.components*i.byteLength;case f0:return t*e*2/i.components*i.byteLength;case Rh:return t*e*2/i.components*i.byteLength;case c0:return t*e*3/i.components*i.byteLength;case un:return t*e*4/i.components*i.byteLength;case Dh:return t*e*4/i.components*i.byteLength;case Sc:case _c:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Mc:case bc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Uh:case Nh:return Math.max(t,16)*Math.max(e,8)/4;case Ph:case Bh:return Math.max(t,8)*Math.max(e,8)/2;case Oh:case Fh:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case zh:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case kh:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Hh:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Vh:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Gh:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case qh:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Wh:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Xh:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Yh:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Zh:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Kh:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Jh:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Qh:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case jh:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case $h:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case ep:case tp:case ap:return Math.ceil(t/4)*Math.ceil(e/4)*16;case np:case ip:return Math.ceil(t/4)*Math.ceil(e/4)*8;case sp:case rp:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${a} format.`)}function pw(t){switch(t){case Vn:case s0:return{byteLength:1,components:1};case ul:case r0:case Wa:return{byteLength:2,components:1};case Ah:case Eh:return{byteLength:2,components:4};case Os:case Lh:case An:return{byteLength:4,components:1};case o0:case l0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:oh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=oh);function ST(){let t=null,e=!1,a=null,n=null;function i(s,r){a(s,r),n=t.requestAnimationFrame(i)}return{start:function(){e!==!0&&a!==null&&(n=t.requestAnimationFrame(i),e=!0)},stop:function(){t.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){a=s},setContext:function(s){t=s}}}function mw(t){let e=new WeakMap;function a(o,l){let u=o.array,c=o.usage,f=u.byteLength,d=t.createBuffer();t.bindBuffer(l,d),t.bufferData(l,u,c),o.onUploadCallback();let p;if(u instanceof Float32Array)p=t.FLOAT;else if(typeof Float16Array<"u"&&u instanceof Float16Array)p=t.HALF_FLOAT;else if(u instanceof Uint16Array)o.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(u instanceof Int16Array)p=t.SHORT;else if(u instanceof Uint32Array)p=t.UNSIGNED_INT;else if(u instanceof Int32Array)p=t.INT;else if(u instanceof Int8Array)p=t.BYTE;else if(u instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:d,type:p,bytesPerElement:u.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,u){let c=l.array,f=l.updateRanges;if(t.bindBuffer(u,o),f.length===0)t.bufferSubData(u,0,c);else{f.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<f.length;p++){let g=f[d],y=f[p];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++d,f[d]=y)}f.length=d+1;for(let p=0,g=f.length;p<g;p++){let y=f[p];t.bufferSubData(u,y.start*c.BYTES_PER_ELEMENT,c,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let c=e.get(o);(!c||c.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let u=e.get(o);if(u===void 0)e.set(o,a(o,l));else if(u.version<o.version){if(u.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(u.buffer,o,l),u.version=o.version}}return{get:i,remove:s,update:r}}var gw=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,xw=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,yw=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vw=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sw=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,_w=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mw=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,bw=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cw=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Tw=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Lw=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Aw=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ew=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ww=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Iw=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Rw=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Dw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Pw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Uw=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bw=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Nw=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ow=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Fw=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,zw=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,kw=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Hw=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Vw=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Gw=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qw=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ww=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xw="gl_FragColor = linearToOutputTexel( gl_FragColor );",Yw=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Zw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Kw=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Jw=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Qw=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,$w=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,eI=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,tI=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,aI=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,nI=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,iI=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,sI=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,rI=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,oI=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lI=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,uI=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cI=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,fI=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,dI=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,hI=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,pI=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,mI=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,gI=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,xI=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yI=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,vI=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,SI=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_I=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,MI=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,bI=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,CI=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,TI=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,LI=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,AI=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,EI=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,wI=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,II=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,RI=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,DI=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,PI=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,UI=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,BI=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,NI=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,OI=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,FI=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,zI=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,kI=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,HI=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,VI=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,GI=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qI=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,WI=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,XI=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,YI=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ZI=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,KI=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,JI=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,QI=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,jI=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,$I=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,eR=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,tR=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,aR=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,nR=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,iR=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,sR=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,rR=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,oR=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,lR=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,uR=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,cR=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,fR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,dR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,hR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,pR=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,mR=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,gR=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yR=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,SR=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_R=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,MR=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,bR=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,CR=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,TR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,LR=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,AR=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ER=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wR=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,IR=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,RR=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,DR=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,PR=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,UR=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,BR=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,NR=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,OR=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,FR=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zR=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,kR=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,HR=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,VR=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,GR=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,qR=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,WR=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,XR=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,YR=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ZR=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:gw,alphahash_pars_fragment:xw,alphamap_fragment:yw,alphamap_pars_fragment:vw,alphatest_fragment:Sw,alphatest_pars_fragment:_w,aomap_fragment:Mw,aomap_pars_fragment:bw,batching_pars_vertex:Cw,batching_vertex:Tw,begin_vertex:Lw,beginnormal_vertex:Aw,bsdfs:Ew,iridescence_fragment:ww,bumpmap_pars_fragment:Iw,clipping_planes_fragment:Rw,clipping_planes_pars_fragment:Dw,clipping_planes_pars_vertex:Pw,clipping_planes_vertex:Uw,color_fragment:Bw,color_pars_fragment:Nw,color_pars_vertex:Ow,color_vertex:Fw,common:zw,cube_uv_reflection_fragment:kw,defaultnormal_vertex:Hw,displacementmap_pars_vertex:Vw,displacementmap_vertex:Gw,emissivemap_fragment:qw,emissivemap_pars_fragment:Ww,colorspace_fragment:Xw,colorspace_pars_fragment:Yw,envmap_fragment:Zw,envmap_common_pars_fragment:Kw,envmap_pars_fragment:Jw,envmap_pars_vertex:Qw,envmap_physical_pars_fragment:lI,envmap_vertex:jw,fog_vertex:$w,fog_pars_vertex:eI,fog_fragment:tI,fog_pars_fragment:aI,gradientmap_pars_fragment:nI,lightmap_pars_fragment:iI,lights_lambert_fragment:sI,lights_lambert_pars_fragment:rI,lights_pars_begin:oI,lights_toon_fragment:uI,lights_toon_pars_fragment:cI,lights_phong_fragment:fI,lights_phong_pars_fragment:dI,lights_physical_fragment:hI,lights_physical_pars_fragment:pI,lights_fragment_begin:mI,lights_fragment_maps:gI,lights_fragment_end:xI,logdepthbuf_fragment:yI,logdepthbuf_pars_fragment:vI,logdepthbuf_pars_vertex:SI,logdepthbuf_vertex:_I,map_fragment:MI,map_pars_fragment:bI,map_particle_fragment:CI,map_particle_pars_fragment:TI,metalnessmap_fragment:LI,metalnessmap_pars_fragment:AI,morphinstance_vertex:EI,morphcolor_vertex:wI,morphnormal_vertex:II,morphtarget_pars_vertex:RI,morphtarget_vertex:DI,normal_fragment_begin:PI,normal_fragment_maps:UI,normal_pars_fragment:BI,normal_pars_vertex:NI,normal_vertex:OI,normalmap_pars_fragment:FI,clearcoat_normal_fragment_begin:zI,clearcoat_normal_fragment_maps:kI,clearcoat_pars_fragment:HI,iridescence_pars_fragment:VI,opaque_fragment:GI,packing:qI,premultiplied_alpha_fragment:WI,project_vertex:XI,dithering_fragment:YI,dithering_pars_fragment:ZI,roughnessmap_fragment:KI,roughnessmap_pars_fragment:JI,shadowmap_pars_fragment:QI,shadowmap_pars_vertex:jI,shadowmap_vertex:$I,shadowmask_pars_fragment:eR,skinbase_vertex:tR,skinning_pars_vertex:aR,skinning_vertex:nR,skinnormal_vertex:iR,specularmap_fragment:sR,specularmap_pars_fragment:rR,tonemapping_fragment:oR,tonemapping_pars_fragment:lR,transmission_fragment:uR,transmission_pars_fragment:cR,uv_pars_fragment:fR,uv_pars_vertex:dR,uv_vertex:hR,worldpos_vertex:pR,background_vert:mR,background_frag:gR,backgroundCube_vert:xR,backgroundCube_frag:yR,cube_vert:vR,cube_frag:SR,depth_vert:_R,depth_frag:MR,distanceRGBA_vert:bR,distanceRGBA_frag:CR,equirect_vert:TR,equirect_frag:LR,linedashed_vert:AR,linedashed_frag:ER,meshbasic_vert:wR,meshbasic_frag:IR,meshlambert_vert:RR,meshlambert_frag:DR,meshmatcap_vert:PR,meshmatcap_frag:UR,meshnormal_vert:BR,meshnormal_frag:NR,meshphong_vert:OR,meshphong_frag:FR,meshphysical_vert:zR,meshphysical_frag:kR,meshtoon_vert:HR,meshtoon_frag:VR,points_vert:GR,points_frag:qR,shadow_vert:WR,shadow_frag:XR,sprite_vert:YR,sprite_frag:ZR},ge={common:{diffuse:{value:new Ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new Ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new Ae(16777215)},opacity:{value:1},center:{value:new Ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},oi={basic:{uniforms:Ca([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Ca([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Ae(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Ca([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Ae(0)},specular:{value:new Ae(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Ca([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new Ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Ca([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new Ae(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Ca([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Ca([ge.points,ge.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Ca([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Ca([ge.common,ge.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Ca([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Ca([ge.sprite,ge.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Ca([ge.common,ge.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Ca([ge.lights,ge.fog,{color:{value:new Ae(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};oi.physical={uniforms:Ca([oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new Ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new Ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new Ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new Ae(0)},specularColor:{value:new Ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new Ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};var lp={r:0,b:0,g:0},Rr=new Va,KR=new We;function JR(t,e,a,n,i,s,r){let o=new Ae(0),l=s===!0?0:1,u,c,f=null,d=0,p=null;function g(S){let v=S.isScene===!0?S.background:null;return v&&v.isTexture&&(v=(S.backgroundBlurriness>0?a:e).get(v)),v}function y(S){let v=!1,T=g(S);T===null?h(o,l):T&&T.isColor&&(h(T,1),v=!0);let E=t.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(t.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(S,v){let T=g(v);T&&(T.isCubeTexture||T.mapping===vc)?(c===void 0&&(c=new pt(new Bs(1,1,1),new Jt({name:"BackgroundCubeMaterial",uniforms:Ir(oi.backgroundCube.uniforms),vertexShader:oi.backgroundCube.vertexShader,fragmentShader:oi.backgroundCube.fragmentShader,side:ya,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),Rr.copy(v.backgroundRotation),Rr.x*=-1,Rr.y*=-1,Rr.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Rr.y*=-1,Rr.z*=-1),c.material.uniforms.envMap.value=T,c.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(KR.makeRotationFromEuler(Rr)),c.material.toneMapped=Je.getTransfer(T.colorSpace)!==ft,(f!==T||d!==T.version||p!==t.toneMapping)&&(c.material.needsUpdate=!0,f=T,d=T.version,p=t.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):T&&T.isTexture&&(u===void 0&&(u=new pt(new Cr(2,2),new Jt({name:"BackgroundMaterial",uniforms:Ir(oi.background.uniforms),vertexShader:oi.background.vertexShader,fragmentShader:oi.background.fragmentShader,side:zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),Object.defineProperty(u.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(u)),u.material.uniforms.t2D.value=T,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.toneMapped=Je.getTransfer(T.colorSpace)!==ft,T.matrixAutoUpdate===!0&&T.updateMatrix(),u.material.uniforms.uvTransform.value.copy(T.matrix),(f!==T||d!==T.version||p!==t.toneMapping)&&(u.material.needsUpdate=!0,f=T,d=T.version,p=t.toneMapping),u.layers.enableAll(),S.unshift(u,u.geometry,u.material,0,0,null))}function h(S,v){S.getRGB(lp,x0(t)),n.buffers.color.setClear(lp.r,lp.g,lp.b,v,r)}function x(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,v=1){o.set(S),l=v,h(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,h(o,l)},render:y,addToRenderList:m,dispose:x}}function QR(t,e){let a=t.getParameter(t.MAX_VERTEX_ATTRIBS),n={},i=d(null),s=i,r=!1;function o(b,I,F,G,z){let X=!1,k=f(G,F,I);s!==k&&(s=k,u(s.object)),X=p(b,G,F,z),X&&g(b,G,F,z),z!==null&&e.update(z,t.ELEMENT_ARRAY_BUFFER),(X||r)&&(r=!1,v(b,I,F,G),z!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function l(){return t.createVertexArray()}function u(b){return t.bindVertexArray(b)}function c(b){return t.deleteVertexArray(b)}function f(b,I,F){let G=F.wireframe===!0,z=n[b.id];z===void 0&&(z={},n[b.id]=z);let X=z[I.id];X===void 0&&(X={},z[I.id]=X);let k=X[G];return k===void 0&&(k=d(l()),X[G]=k),k}function d(b){let I=[],F=[],G=[];for(let z=0;z<a;z++)I[z]=0,F[z]=0,G[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:F,attributeDivisors:G,object:b,attributes:{},index:null}}function p(b,I,F,G){let z=s.attributes,X=I.attributes,k=0,K=F.getAttributes();for(let O in K)if(K[O].location>=0){let ce=z[O],me=X[O];if(me===void 0&&(O==="instanceMatrix"&&b.instanceMatrix&&(me=b.instanceMatrix),O==="instanceColor"&&b.instanceColor&&(me=b.instanceColor)),ce===void 0||ce.attribute!==me||me&&ce.data!==me.data)return!0;k++}return s.attributesNum!==k||s.index!==G}function g(b,I,F,G){let z={},X=I.attributes,k=0,K=F.getAttributes();for(let O in K)if(K[O].location>=0){let ce=X[O];ce===void 0&&(O==="instanceMatrix"&&b.instanceMatrix&&(ce=b.instanceMatrix),O==="instanceColor"&&b.instanceColor&&(ce=b.instanceColor));let me={};me.attribute=ce,ce&&ce.data&&(me.data=ce.data),z[O]=me,k++}s.attributes=z,s.attributesNum=k,s.index=G}function y(){let b=s.newAttributes;for(let I=0,F=b.length;I<F;I++)b[I]=0}function m(b){h(b,0)}function h(b,I){let F=s.newAttributes,G=s.enabledAttributes,z=s.attributeDivisors;F[b]=1,G[b]===0&&(t.enableVertexAttribArray(b),G[b]=1),z[b]!==I&&(t.vertexAttribDivisor(b,I),z[b]=I)}function x(){let b=s.newAttributes,I=s.enabledAttributes;for(let F=0,G=I.length;F<G;F++)I[F]!==b[F]&&(t.disableVertexAttribArray(F),I[F]=0)}function S(b,I,F,G,z,X,k){k===!0?t.vertexAttribIPointer(b,I,F,z,X):t.vertexAttribPointer(b,I,F,G,z,X)}function v(b,I,F,G){y();let z=G.attributes,X=F.getAttributes(),k=I.defaultAttributeValues;for(let K in X){let O=X[K];if(O.location>=0){let ae=z[K];if(ae===void 0&&(K==="instanceMatrix"&&b.instanceMatrix&&(ae=b.instanceMatrix),K==="instanceColor"&&b.instanceColor&&(ae=b.instanceColor)),ae!==void 0){let ce=ae.normalized,me=ae.itemSize,Oe=e.get(ae);if(Oe===void 0)continue;let Ye=Oe.buffer,Qe=Oe.type,at=Oe.bytesPerElement,Y=Qe===t.INT||Qe===t.UNSIGNED_INT||ae.gpuType===Lh;if(ae.isInterleavedBufferAttribute){let $=ae.data,ve=$.stride,Ue=ae.offset;if($.isInstancedInterleavedBuffer){for(let Ce=0;Ce<O.locationSize;Ce++)h(O.location+Ce,$.meshPerAttribute);b.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let Ce=0;Ce<O.locationSize;Ce++)m(O.location+Ce);t.bindBuffer(t.ARRAY_BUFFER,Ye);for(let Ce=0;Ce<O.locationSize;Ce++)S(O.location+Ce,me/O.locationSize,Qe,ce,ve*at,(Ue+me/O.locationSize*Ce)*at,Y)}else{if(ae.isInstancedBufferAttribute){for(let $=0;$<O.locationSize;$++)h(O.location+$,ae.meshPerAttribute);b.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let $=0;$<O.locationSize;$++)m(O.location+$);t.bindBuffer(t.ARRAY_BUFFER,Ye);for(let $=0;$<O.locationSize;$++)S(O.location+$,me/O.locationSize,Qe,ce,me*at,me/O.locationSize*$*at,Y)}}else if(k!==void 0){let ce=k[K];if(ce!==void 0)switch(ce.length){case 2:t.vertexAttrib2fv(O.location,ce);break;case 3:t.vertexAttrib3fv(O.location,ce);break;case 4:t.vertexAttrib4fv(O.location,ce);break;default:t.vertexAttrib1fv(O.location,ce)}}}}x()}function T(){R();for(let b in n){let I=n[b];for(let F in I){let G=I[F];for(let z in G)c(G[z].object),delete G[z];delete I[F]}delete n[b]}}function E(b){if(n[b.id]===void 0)return;let I=n[b.id];for(let F in I){let G=I[F];for(let z in G)c(G[z].object),delete G[z];delete I[F]}delete n[b.id]}function A(b){for(let I in n){let F=n[I];if(F[b.id]===void 0)continue;let G=F[b.id];for(let z in G)c(G[z].object),delete G[z];delete F[b.id]}}function R(){M(),r=!0,s!==i&&(s=i,u(s.object))}function M(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:R,resetDefaultState:M,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:y,enableAttribute:m,disableUnusedAttributes:x}}function jR(t,e,a){let n;function i(u){n=u}function s(u,c){t.drawArrays(n,u,c),a.update(c,n,1)}function r(u,c,f){f!==0&&(t.drawArraysInstanced(n,u,c,f),a.update(c,n,f))}function o(u,c,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,u,0,c,0,f);let p=0;for(let g=0;g<f;g++)p+=c[g];a.update(p,n,1)}function l(u,c,f,d){if(f===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<u.length;g++)r(u[g],c[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,u,0,c,0,d,0,f);let g=0;for(let y=0;y<f;y++)g+=c[y]*d[y];a.update(g,n,1)}}this.setMode=i,this.render=s,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function $R(t,e,a,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");i=t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function r(A){return!(A!==un&&n.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let R=A===Wa&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Vn&&n.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==An&&!R)}function l(A){if(A==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let u=a.precision!==void 0?a.precision:"highp",c=l(u);c!==u&&(console.warn("THREE.WebGLRenderer:",u,"not supported, using",c,"instead."),u=c);let f=a.logarithmicDepthBuffer===!0,d=a.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),h=t.getParameter(t.MAX_VERTEX_ATTRIBS),x=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),S=t.getParameter(t.MAX_VARYING_VECTORS),v=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,E=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:u,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:x,maxVaryings:S,maxFragmentUniforms:v,vertexTextures:T,maxSamples:E}}function e2(t){let e=this,a=null,n=0,i=!1,s=!1,r=new jn,o=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){let p=f.length!==0||d||n!==0||i;return i=d,n=f.length,p},this.beginShadows=function(){s=!0,c(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){a=c(f,d,0)},this.setState=function(f,d,p){let g=f.clippingPlanes,y=f.clipIntersection,m=f.clipShadows,h=t.get(f);if(!i||g===null||g.length===0||s&&!m)s?c(null):u();else{let x=s?0:n,S=x*4,v=h.clippingState||null;l.value=v,v=c(g,d,S,p);for(let T=0;T!==S;++T)v[T]=a[T];h.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=x}};function u(){l.value!==a&&(l.value=a,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function c(f,d,p,g){let y=f!==null?f.length:0,m=null;if(y!==0){if(m=l.value,g!==!0||m===null){let h=p+y*4,x=d.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<h)&&(m=new Float32Array(h));for(let S=0,v=p;S!==y;++S,v+=4)r.copy(f[S]).applyMatrix4(x,o),r.normal.toArray(m,v),m[v+3]=r.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function t2(t){let e=new WeakMap;function a(r,o){return o===bh?r.mapping=Ar:o===Ch&&(r.mapping=Er),r}function n(r){if(r&&r.isTexture){let o=r.mapping;if(o===bh||o===Ch)if(e.has(r)){let l=e.get(r).texture;return a(l,r.mapping)}else{let l=r.image;if(l&&l.height>0){let u=new Kd(l.height);return u.fromEquirectangularTexture(t,r),e.set(r,u),r.addEventListener("dispose",i),a(u.texture,r.mapping)}else return null}}return r}function i(r){let o=r.target;o.removeEventListener("dispose",i);let l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}var pl=4,QC=[.125,.215,.35,.446,.526,.582],Ur=20,_0=new Vi,jC=new Ae,M0=null,b0=0,C0=0,T0=!1,Pr=(1+Math.sqrt(5))/2,hl=1/Pr,$C=[new P(-Pr,hl,0),new P(Pr,hl,0),new P(-hl,0,Pr),new P(hl,0,Pr),new P(0,Pr,-hl),new P(0,Pr,hl),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)],a2=new P,gl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,a=0,n=.1,i=100,s={}){let{size:r=256,position:o=a2}=s;M0=this._renderer.getRenderTarget(),b0=this._renderer.getActiveCubeFace(),C0=this._renderer.getActiveMipmapLevel(),T0=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),a>0&&this._blur(l,0,0,a),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,a=null){return this._fromTexture(e,a)}fromCubemap(e,a=null){return this._fromTexture(e,a)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=aT(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=tT(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(M0,b0,C0),this._renderer.xr.enabled=T0,e.scissorTest=!1,up(e,0,0,e.width,e.height)}_fromTexture(e,a){e.mapping===Ar||e.mapping===Er?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),M0=this._renderer.getRenderTarget(),b0=this._renderer.getActiveCubeFace(),C0=this._renderer.getActiveMipmapLevel(),T0=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=a||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),a=4*this._cubeSize,n={magFilter:Ia,minFilter:Ia,generateMipmaps:!1,type:Wa,format:un,colorSpace:xa,depthBuffer:!1},i=eT(e,a,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==a){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=eT(e,a,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=n2(s)),this._blurMaterial=i2(s,e,a)}return i}_compileMaterial(e){let a=new pt(this._lodPlanes[0],e);this._renderer.compile(a,_0)}_sceneToCubeUV(e,a,n,i,s){let l=new Zt(90,1,a,n),u=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],f=this._renderer,d=f.autoClear,p=f.toneMapping;f.getClearColor(jC),f.toneMapping=Wi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(i),f.clearDepth(),f.setRenderTarget(null));let y=new Ra({name:"PMREM.Background",side:ya,depthWrite:!1,depthTest:!1}),m=new pt(new Bs,y),h=!1,x=e.background;x?x.isColor&&(y.color.copy(x),e.background=null,h=!0):(y.color.copy(jC),h=!0);for(let S=0;S<6;S++){let v=S%3;v===0?(l.up.set(0,u[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+c[S],s.y,s.z)):v===1?(l.up.set(0,0,u[S]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+c[S],s.z)):(l.up.set(0,u[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+c[S]));let T=this._cubeSize;up(i,v*T,S>2?T:0,T,T),f.setRenderTarget(i),h&&f.render(m,l),f.render(e,l)}m.geometry.dispose(),m.material.dispose(),f.toneMapping=p,f.autoClear=d,e.background=x}_textureToCubeUV(e,a){let n=this._renderer,i=e.mapping===Ar||e.mapping===Er;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=aT()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=tT());let s=i?this._cubemapMaterial:this._equirectMaterial,r=new pt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;let l=this._cubeSize;up(a,0,0,3*l,2*l),n.setRenderTarget(a),n.render(r,_0)}_applyPMREM(e){let a=this._renderer,n=a.autoClear;a.autoClear=!1;let i=this._lodPlanes.length;for(let s=1;s<i;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=$C[(i-s-1)%$C.length];this._blur(e,s-1,s,r,o)}a.autoClear=n}_blur(e,a,n,i,s){let r=this._pingPongRenderTarget;this._halfBlur(e,r,a,n,i,"latitudinal",s),this._halfBlur(r,e,n,n,i,"longitudinal",s)}_halfBlur(e,a,n,i,s,r,o){let l=this._renderer,u=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let c=3,f=new pt(this._lodPlanes[i],u),d=u.uniforms,p=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Ur-1),y=s/g,m=isFinite(s)?1+Math.floor(c*y):Ur;m>Ur&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ur}`);let h=[],x=0;for(let A=0;A<Ur;++A){let R=A/y,M=Math.exp(-R*R/2);h.push(M),A===0?x+=M:A<m&&(x+=2*M)}for(let A=0;A<h.length;A++)h[A]=h[A]/x;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=h,d.latitudinal.value=r==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:S}=this;d.dTheta.value=g,d.mipInt.value=S-n;let v=this._sizeLods[i],T=3*v*(i>S-pl?i-S+pl:0),E=4*(this._cubeSize-v);up(a,T,E,3*v,2*v),l.setRenderTarget(a),l.render(f,_0)}};function n2(t){let e=[],a=[],n=[],i=t,s=t-pl+1+QC.length;for(let r=0;r<s;r++){let o=Math.pow(2,i);a.push(o);let l=1/o;r>t-pl?l=QC[r-t+pl-1]:r===0&&(l=0),n.push(l);let u=1/(o-2),c=-u,f=1+u,d=[c,c,f,c,f,f,c,c,f,f,c,f],p=6,g=6,y=3,m=2,h=1,x=new Float32Array(y*g*p),S=new Float32Array(m*g*p),v=new Float32Array(h*g*p);for(let E=0;E<p;E++){let A=E%3*2/3-1,R=E>2?0:-1,M=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];x.set(M,y*g*E),S.set(d,m*g*E);let b=[E,E,E,E,E,E];v.set(b,h*g*E)}let T=new ba;T.setAttribute("position",new Kt(x,y)),T.setAttribute("uv",new Kt(S,m)),T.setAttribute("faceIndex",new Kt(v,h)),e.push(T),i>pl&&i--}return{lodPlanes:e,sizeLods:a,sigmas:n}}function eT(t,e,a){let n=new ca(t,e,a);return n.texture.mapping=vc,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function up(t,e,a,n,i){t.viewport.set(e,a,n,i),t.scissor.set(e,a,n,i)}function i2(t,e,a){let n=new Float32Array(Ur),i=new P(0,1,0);return new Jt({name:"SphericalGaussianBlur",defines:{n:Ur,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/a,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:B0(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function tT(){return new Jt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:B0(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function aT(){return new Jt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:B0(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function B0(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function s2(t){let e=new WeakMap,a=null;function n(o){if(o&&o.isTexture){let l=o.mapping,u=l===bh||l===Ch,c=l===Ar||l===Er;if(u||c){let f=e.get(o),d=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return a===null&&(a=new gl(t)),f=u?a.fromEquirectangular(o,f):a.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{let p=o.image;return u&&p&&p.height>0||c&&p&&i(p)?(a===null&&(a=new gl(t)),f=u?a.fromEquirectangular(o):a.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",s),f.texture):null}}}return o}function i(o){let l=0,u=6;for(let c=0;c<u;c++)o[c]!==void 0&&l++;return l===u}function s(o){let l=o.target;l.removeEventListener("dispose",s);let u=e.get(l);u!==void 0&&(e.delete(l),u.dispose())}function r(){e=new WeakMap,a!==null&&(a.dispose(),a=null)}return{get:n,dispose:r}}function r2(t){let e={};function a(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=t.getExtension(n)}return e[n]=i,i}return{has:function(n){return a(n)!==null},init:function(){a("EXT_color_buffer_float"),a("WEBGL_clip_cull_distance"),a("OES_texture_float_linear"),a("EXT_color_buffer_half_float"),a("WEBGL_multisampled_render_to_texture"),a("WEBGL_render_shared_exponent")},get:function(n){let i=a(n);return i===null&&Qo("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function o2(t,e,a,n){let i={},s=new WeakMap;function r(f){let d=f.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",r),delete i[d.id];let p=s.get(d);p&&(e.remove(p),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,a.memory.geometries--}function o(f,d){return i[d.id]===!0||(d.addEventListener("dispose",r),i[d.id]=!0,a.memory.geometries++),d}function l(f){let d=f.attributes;for(let p in d)e.update(d[p],t.ARRAY_BUFFER)}function u(f){let d=[],p=f.index,g=f.attributes.position,y=0;if(p!==null){let x=p.array;y=p.version;for(let S=0,v=x.length;S<v;S+=3){let T=x[S+0],E=x[S+1],A=x[S+2];d.push(T,E,E,A,A,T)}}else if(g!==void 0){let x=g.array;y=g.version;for(let S=0,v=x.length/3-1;S<v;S+=3){let T=S+0,E=S+1,A=S+2;d.push(T,E,E,A,A,T)}}else return;let m=new(g0(d)?Zu:Yu)(d,1);m.version=y;let h=s.get(f);h&&e.remove(h),s.set(f,m)}function c(f){let d=s.get(f);if(d){let p=f.index;p!==null&&d.version<p.version&&u(f)}else u(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:c}}function l2(t,e,a){let n;function i(d){n=d}let s,r;function o(d){s=d.type,r=d.bytesPerElement}function l(d,p){t.drawElements(n,p,s,d*r),a.update(p,n,1)}function u(d,p,g){g!==0&&(t.drawElementsInstanced(n,p,s,d*r,g),a.update(p,n,g))}function c(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,d,0,g);let m=0;for(let h=0;h<g;h++)m+=p[h];a.update(m,n,1)}function f(d,p,g,y){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let h=0;h<d.length;h++)u(d[h]/r,p[h],y[h]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,s,d,0,y,0,g);let h=0;for(let x=0;x<g;x++)h+=p[x]*y[x];a.update(h,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=u,this.renderMultiDraw=c,this.renderMultiDrawInstances=f}function u2(t){let e={geometries:0,textures:0},a={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,r,o){switch(a.calls++,r){case t.TRIANGLES:a.triangles+=o*(s/3);break;case t.LINES:a.lines+=o*(s/2);break;case t.LINE_STRIP:a.lines+=o*(s-1);break;case t.LINE_LOOP:a.lines+=o*s;break;case t.POINTS:a.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function i(){a.calls=0,a.triangles=0,a.points=0,a.lines=0}return{memory:e,render:a,programs:null,autoReset:!0,reset:i,update:n}}function c2(t,e,a){let n=new WeakMap,i=new lt;function s(r,o,l){let u=r.morphTargetInfluences,c=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=c!==void 0?c.length:0,d=n.get(o);if(d===void 0||d.count!==f){let M=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();let p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],h=o.morphAttributes.normal||[],x=o.morphAttributes.color||[],S=0;p===!0&&(S=1),g===!0&&(S=2),y===!0&&(S=3);let v=o.attributes.position.count*S,T=1;v>e.maxTextureSize&&(T=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let E=new Float32Array(v*T*4*f),A=new Wu(E,v,T,f);A.type=An,A.needsUpdate=!0;let R=S*4;for(let b=0;b<f;b++){let I=m[b],F=h[b],G=x[b],z=v*T*4*b;for(let X=0;X<I.count;X++){let k=X*R;p===!0&&(i.fromBufferAttribute(I,X),E[z+k+0]=i.x,E[z+k+1]=i.y,E[z+k+2]=i.z,E[z+k+3]=0),g===!0&&(i.fromBufferAttribute(F,X),E[z+k+4]=i.x,E[z+k+5]=i.y,E[z+k+6]=i.z,E[z+k+7]=0),y===!0&&(i.fromBufferAttribute(G,X),E[z+k+8]=i.x,E[z+k+9]=i.y,E[z+k+10]=i.z,E[z+k+11]=G.itemSize===4?i.w:1)}}d={count:f,texture:A,size:new Ie(v,T)},n.set(o,d),o.addEventListener("dispose",M)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",r.morphTexture,a);else{let p=0;for(let y=0;y<u.length;y++)p+=u[y];let g=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(t,"morphTargetBaseInfluence",g),l.getUniforms().setValue(t,"morphTargetInfluences",u)}l.getUniforms().setValue(t,"morphTargetsTexture",d.texture,a),l.getUniforms().setValue(t,"morphTargetsTextureSize",d.size)}return{update:s}}function f2(t,e,a,n){let i=new WeakMap;function s(l){let u=n.render.frame,c=l.geometry,f=e.get(l,c);if(i.get(f)!==u&&(e.update(f),i.set(f,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==u&&(a.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&a.update(l.instanceColor,t.ARRAY_BUFFER),i.set(l,u))),l.isSkinnedMesh){let d=l.skeleton;i.get(d)!==u&&(d.update(),i.set(d,u))}return f}function r(){i=new WeakMap}function o(l){let u=l.target;u.removeEventListener("dispose",o),a.remove(u.instanceMatrix),u.instanceColor!==null&&a.remove(u.instanceColor)}return{update:s,dispose:r}}var _T=new ta,nT=new ic(1,1),MT=new Wu,bT=new Yd,CT=new Ju,iT=[],sT=[],rT=new Float32Array(16),oT=new Float32Array(9),lT=new Float32Array(4);function xl(t,e,a){let n=t[0];if(n<=0||n>0)return t;let i=e*a,s=iT[i];if(s===void 0&&(s=new Float32Array(i),iT[i]=s),e!==0){n.toArray(s,0);for(let r=1,o=0;r!==e;++r)o+=a,t[r].toArray(s,o)}return s}function aa(t,e){if(t.length!==e.length)return!1;for(let a=0,n=t.length;a<n;a++)if(t[a]!==e[a])return!1;return!0}function na(t,e){for(let a=0,n=e.length;a<n;a++)t[a]=e[a]}function dp(t,e){let a=sT[e];a===void 0&&(a=new Int32Array(e),sT[e]=a);for(let n=0;n!==e;++n)a[n]=t.allocateTextureUnit();return a}function d2(t,e){let a=this.cache;a[0]!==e&&(t.uniform1f(this.addr,e),a[0]=e)}function h2(t,e){let a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),a[0]=e.x,a[1]=e.y);else{if(aa(a,e))return;t.uniform2fv(this.addr,e),na(a,e)}}function p2(t,e){let a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y||a[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),a[0]=e.x,a[1]=e.y,a[2]=e.z);else if(e.r!==void 0)(a[0]!==e.r||a[1]!==e.g||a[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),a[0]=e.r,a[1]=e.g,a[2]=e.b);else{if(aa(a,e))return;t.uniform3fv(this.addr,e),na(a,e)}}function m2(t,e){let a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y||a[2]!==e.z||a[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),a[0]=e.x,a[1]=e.y,a[2]=e.z,a[3]=e.w);else{if(aa(a,e))return;t.uniform4fv(this.addr,e),na(a,e)}}function g2(t,e){let a=this.cache,n=e.elements;if(n===void 0){if(aa(a,e))return;t.uniformMatrix2fv(this.addr,!1,e),na(a,e)}else{if(aa(a,n))return;lT.set(n),t.uniformMatrix2fv(this.addr,!1,lT),na(a,n)}}function x2(t,e){let a=this.cache,n=e.elements;if(n===void 0){if(aa(a,e))return;t.uniformMatrix3fv(this.addr,!1,e),na(a,e)}else{if(aa(a,n))return;oT.set(n),t.uniformMatrix3fv(this.addr,!1,oT),na(a,n)}}function y2(t,e){let a=this.cache,n=e.elements;if(n===void 0){if(aa(a,e))return;t.uniformMatrix4fv(this.addr,!1,e),na(a,e)}else{if(aa(a,n))return;rT.set(n),t.uniformMatrix4fv(this.addr,!1,rT),na(a,n)}}function v2(t,e){let a=this.cache;a[0]!==e&&(t.uniform1i(this.addr,e),a[0]=e)}function S2(t,e){let a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),a[0]=e.x,a[1]=e.y);else{if(aa(a,e))return;t.uniform2iv(this.addr,e),na(a,e)}}function _2(t,e){let a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y||a[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),a[0]=e.x,a[1]=e.y,a[2]=e.z);else{if(aa(a,e))return;t.uniform3iv(this.addr,e),na(a,e)}}function M2(t,e){let a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y||a[2]!==e.z||a[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),a[0]=e.x,a[1]=e.y,a[2]=e.z,a[3]=e.w);else{if(aa(a,e))return;t.uniform4iv(this.addr,e),na(a,e)}}function b2(t,e){let a=this.cache;a[0]!==e&&(t.uniform1ui(this.addr,e),a[0]=e)}function C2(t,e){let a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),a[0]=e.x,a[1]=e.y);else{if(aa(a,e))return;t.uniform2uiv(this.addr,e),na(a,e)}}function T2(t,e){let a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y||a[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),a[0]=e.x,a[1]=e.y,a[2]=e.z);else{if(aa(a,e))return;t.uniform3uiv(this.addr,e),na(a,e)}}function L2(t,e){let a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y||a[2]!==e.z||a[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),a[0]=e.x,a[1]=e.y,a[2]=e.z,a[3]=e.w);else{if(aa(a,e))return;t.uniform4uiv(this.addr,e),na(a,e)}}function A2(t,e,a){let n=this.cache,i=a.allocateTextureUnit();n[0]!==i&&(t.uniform1i(this.addr,i),n[0]=i);let s;this.type===t.SAMPLER_2D_SHADOW?(nT.compareFunction=h0,s=nT):s=_T,a.setTexture2D(e||s,i)}function E2(t,e,a){let n=this.cache,i=a.allocateTextureUnit();n[0]!==i&&(t.uniform1i(this.addr,i),n[0]=i),a.setTexture3D(e||bT,i)}function w2(t,e,a){let n=this.cache,i=a.allocateTextureUnit();n[0]!==i&&(t.uniform1i(this.addr,i),n[0]=i),a.setTextureCube(e||CT,i)}function I2(t,e,a){let n=this.cache,i=a.allocateTextureUnit();n[0]!==i&&(t.uniform1i(this.addr,i),n[0]=i),a.setTexture2DArray(e||MT,i)}function R2(t){switch(t){case 5126:return d2;case 35664:return h2;case 35665:return p2;case 35666:return m2;case 35674:return g2;case 35675:return x2;case 35676:return y2;case 5124:case 35670:return v2;case 35667:case 35671:return S2;case 35668:case 35672:return _2;case 35669:case 35673:return M2;case 5125:return b2;case 36294:return C2;case 36295:return T2;case 36296:return L2;case 35678:case 36198:case 36298:case 36306:case 35682:return A2;case 35679:case 36299:case 36307:return E2;case 35680:case 36300:case 36308:case 36293:return w2;case 36289:case 36303:case 36311:case 36292:return I2}}function D2(t,e){t.uniform1fv(this.addr,e)}function P2(t,e){let a=xl(e,this.size,2);t.uniform2fv(this.addr,a)}function U2(t,e){let a=xl(e,this.size,3);t.uniform3fv(this.addr,a)}function B2(t,e){let a=xl(e,this.size,4);t.uniform4fv(this.addr,a)}function N2(t,e){let a=xl(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,a)}function O2(t,e){let a=xl(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,a)}function F2(t,e){let a=xl(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,a)}function z2(t,e){t.uniform1iv(this.addr,e)}function k2(t,e){t.uniform2iv(this.addr,e)}function H2(t,e){t.uniform3iv(this.addr,e)}function V2(t,e){t.uniform4iv(this.addr,e)}function G2(t,e){t.uniform1uiv(this.addr,e)}function q2(t,e){t.uniform2uiv(this.addr,e)}function W2(t,e){t.uniform3uiv(this.addr,e)}function X2(t,e){t.uniform4uiv(this.addr,e)}function Y2(t,e,a){let n=this.cache,i=e.length,s=dp(a,i);aa(n,s)||(t.uniform1iv(this.addr,s),na(n,s));for(let r=0;r!==i;++r)a.setTexture2D(e[r]||_T,s[r])}function Z2(t,e,a){let n=this.cache,i=e.length,s=dp(a,i);aa(n,s)||(t.uniform1iv(this.addr,s),na(n,s));for(let r=0;r!==i;++r)a.setTexture3D(e[r]||bT,s[r])}function K2(t,e,a){let n=this.cache,i=e.length,s=dp(a,i);aa(n,s)||(t.uniform1iv(this.addr,s),na(n,s));for(let r=0;r!==i;++r)a.setTextureCube(e[r]||CT,s[r])}function J2(t,e,a){let n=this.cache,i=e.length,s=dp(a,i);aa(n,s)||(t.uniform1iv(this.addr,s),na(n,s));for(let r=0;r!==i;++r)a.setTexture2DArray(e[r]||MT,s[r])}function Q2(t){switch(t){case 5126:return D2;case 35664:return P2;case 35665:return U2;case 35666:return B2;case 35674:return N2;case 35675:return O2;case 35676:return F2;case 5124:case 35670:return z2;case 35667:case 35671:return k2;case 35668:case 35672:return H2;case 35669:case 35673:return V2;case 5125:return G2;case 36294:return q2;case 36295:return W2;case 36296:return X2;case 35678:case 36198:case 36298:case 36306:case 35682:return Y2;case 35679:case 36299:case 36307:return Z2;case 35680:case 36300:case 36308:case 36293:return K2;case 36289:case 36303:case 36311:case 36292:return J2}}var A0=class{constructor(e,a,n){this.id=e,this.addr=n,this.cache=[],this.type=a.type,this.setValue=R2(a.type)}},E0=class{constructor(e,a,n){this.id=e,this.addr=n,this.cache=[],this.type=a.type,this.size=a.size,this.setValue=Q2(a.type)}},w0=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,a,n){let i=this.seq;for(let s=0,r=i.length;s!==r;++s){let o=i[s];o.setValue(e,a[o.id],n)}}},L0=/(\w+)(\])?(\[|\.)?/g;function uT(t,e){t.seq.push(e),t.map[e.id]=e}function j2(t,e,a){let n=t.name,i=n.length;for(L0.lastIndex=0;;){let s=L0.exec(n),r=L0.lastIndex,o=s[1],l=s[2]==="]",u=s[3];if(l&&(o=o|0),u===void 0||u==="["&&r+2===i){uT(a,u===void 0?new A0(o,t,e):new E0(o,t,e));break}else{let f=a.map[o];f===void 0&&(f=new w0(o),uT(a,f)),a=f}}}var ml=class{constructor(e,a){this.seq=[],this.map={};let n=e.getProgramParameter(a,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let s=e.getActiveUniform(a,i),r=e.getUniformLocation(a,s.name);j2(s,r,this)}}setValue(e,a,n,i){let s=this.map[a];s!==void 0&&s.setValue(e,n,i)}setOptional(e,a,n){let i=a[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,a,n,i){for(let s=0,r=a.length;s!==r;++s){let o=a[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,a){let n=[];for(let i=0,s=e.length;i!==s;++i){let r=e[i];r.id in a&&n.push(r)}return n}};function cT(t,e,a){let n=t.createShader(e);return t.shaderSource(n,a),t.compileShader(n),n}var $2=37297,eD=0;function tD(t,e){let a=t.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,a.length);for(let r=i;r<s;r++){let o=r+1;n.push(`${o===e?">":" "} ${o}: ${a[r]}`)}return n.join(`
`)}var fT=new qe;function aD(t){Je._getMatrix(fT,Je.workingColorSpace,t);let e=`mat3( ${fT.elements.map(a=>a.toFixed(4))} )`;switch(Je.getTransfer(t)){case Gu:return[e,"LinearTransferOETF"];case ft:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function dT(t,e,a){let n=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return a.toUpperCase()+`

`+s+`

`+tD(t.getShaderSource(e),o)}else return s}function nD(t,e){let a=aD(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${a[1]}( vec4( value.rgb * ${a[0]}, value.a ) );`,"}"].join(`
`)}function iD(t,e){let a;switch(e){case xh:a="Linear";break;case yh:a="Reinhard";break;case vh:a="Cineon";break;case ol:a="ACESFilmic";break;case _h:a="AgX";break;case Mh:a="Neutral";break;case Sh:a="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),a="Linear"}return"vec3 "+t+"( vec3 color ) { return "+a+"ToneMapping( color ); }"}var cp=new P;function sD(){Je.getLuminanceCoefficients(cp);let t=cp.x.toFixed(4),e=cp.y.toFixed(4),a=cp.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${a} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rD(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Lc).join(`
`)}function oD(t){let e=[];for(let a in t){let n=t[a];n!==!1&&e.push("#define "+a+" "+n)}return e.join(`
`)}function lD(t,e){let a={},n=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let s=t.getActiveAttrib(e,i),r=s.name,o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),a[r]={type:s.type,location:t.getAttribLocation(e,r),locationSize:o}}return a}function Lc(t){return t!==""}function hT(t,e){let a=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,a).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function pT(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var uD=/^[ \t]*#include +<([\w\d./]+)>/gm;function I0(t){return t.replace(uD,fD)}var cD=new Map;function fD(t,e){let a=Xe[e];if(a===void 0){let n=cD.get(e);if(n!==void 0)a=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return I0(a)}var dD=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function mT(t){return t.replace(dD,hD)}function hD(t,e,a,n){let i="";for(let s=parseInt(e);s<parseInt(a);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function gT(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function pD(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===t0?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===lh?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===ri&&(e="SHADOWMAP_TYPE_VSM"),e}function mD(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case Ar:case Er:e="ENVMAP_TYPE_CUBE";break;case vc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function gD(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Er:e="ENVMAP_MODE_REFRACTION";break}return e}function xD(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case gh:e="ENVMAP_BLENDING_MULTIPLY";break;case DC:e="ENVMAP_BLENDING_MIX";break;case PC:e="ENVMAP_BLENDING_ADD";break}return e}function yD(t){let e=t.envMapCubeUVHeight;if(e===null)return null;let a=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,a),7*16)),texelHeight:n,maxMip:a}}function vD(t,e,a,n){let i=t.getContext(),s=a.defines,r=a.vertexShader,o=a.fragmentShader,l=pD(a),u=mD(a),c=gD(a),f=xD(a),d=yD(a),p=rD(a),g=oD(s),y=i.createProgram(),m,h,x=a.glslVersion?"#version "+a.glslVersion+`
`:"";a.isRawShaderMaterial?(m=["#define SHADER_TYPE "+a.shaderType,"#define SHADER_NAME "+a.shaderName,g].filter(Lc).join(`
`),m.length>0&&(m+=`
`),h=["#define SHADER_TYPE "+a.shaderType,"#define SHADER_NAME "+a.shaderName,g].filter(Lc).join(`
`),h.length>0&&(h+=`
`)):(m=[gT(a),"#define SHADER_TYPE "+a.shaderType,"#define SHADER_NAME "+a.shaderName,g,a.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",a.batching?"#define USE_BATCHING":"",a.batchingColor?"#define USE_BATCHING_COLOR":"",a.instancing?"#define USE_INSTANCING":"",a.instancingColor?"#define USE_INSTANCING_COLOR":"",a.instancingMorph?"#define USE_INSTANCING_MORPH":"",a.useFog&&a.fog?"#define USE_FOG":"",a.useFog&&a.fogExp2?"#define FOG_EXP2":"",a.map?"#define USE_MAP":"",a.envMap?"#define USE_ENVMAP":"",a.envMap?"#define "+c:"",a.lightMap?"#define USE_LIGHTMAP":"",a.aoMap?"#define USE_AOMAP":"",a.bumpMap?"#define USE_BUMPMAP":"",a.normalMap?"#define USE_NORMALMAP":"",a.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",a.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",a.displacementMap?"#define USE_DISPLACEMENTMAP":"",a.emissiveMap?"#define USE_EMISSIVEMAP":"",a.anisotropy?"#define USE_ANISOTROPY":"",a.anisotropyMap?"#define USE_ANISOTROPYMAP":"",a.clearcoatMap?"#define USE_CLEARCOATMAP":"",a.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",a.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",a.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",a.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",a.specularMap?"#define USE_SPECULARMAP":"",a.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",a.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",a.roughnessMap?"#define USE_ROUGHNESSMAP":"",a.metalnessMap?"#define USE_METALNESSMAP":"",a.alphaMap?"#define USE_ALPHAMAP":"",a.alphaHash?"#define USE_ALPHAHASH":"",a.transmission?"#define USE_TRANSMISSION":"",a.transmissionMap?"#define USE_TRANSMISSIONMAP":"",a.thicknessMap?"#define USE_THICKNESSMAP":"",a.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",a.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",a.mapUv?"#define MAP_UV "+a.mapUv:"",a.alphaMapUv?"#define ALPHAMAP_UV "+a.alphaMapUv:"",a.lightMapUv?"#define LIGHTMAP_UV "+a.lightMapUv:"",a.aoMapUv?"#define AOMAP_UV "+a.aoMapUv:"",a.emissiveMapUv?"#define EMISSIVEMAP_UV "+a.emissiveMapUv:"",a.bumpMapUv?"#define BUMPMAP_UV "+a.bumpMapUv:"",a.normalMapUv?"#define NORMALMAP_UV "+a.normalMapUv:"",a.displacementMapUv?"#define DISPLACEMENTMAP_UV "+a.displacementMapUv:"",a.metalnessMapUv?"#define METALNESSMAP_UV "+a.metalnessMapUv:"",a.roughnessMapUv?"#define ROUGHNESSMAP_UV "+a.roughnessMapUv:"",a.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+a.anisotropyMapUv:"",a.clearcoatMapUv?"#define CLEARCOATMAP_UV "+a.clearcoatMapUv:"",a.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+a.clearcoatNormalMapUv:"",a.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+a.clearcoatRoughnessMapUv:"",a.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+a.iridescenceMapUv:"",a.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+a.iridescenceThicknessMapUv:"",a.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+a.sheenColorMapUv:"",a.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+a.sheenRoughnessMapUv:"",a.specularMapUv?"#define SPECULARMAP_UV "+a.specularMapUv:"",a.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+a.specularColorMapUv:"",a.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+a.specularIntensityMapUv:"",a.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+a.transmissionMapUv:"",a.thicknessMapUv?"#define THICKNESSMAP_UV "+a.thicknessMapUv:"",a.vertexTangents&&a.flatShading===!1?"#define USE_TANGENT":"",a.vertexColors?"#define USE_COLOR":"",a.vertexAlphas?"#define USE_COLOR_ALPHA":"",a.vertexUv1s?"#define USE_UV1":"",a.vertexUv2s?"#define USE_UV2":"",a.vertexUv3s?"#define USE_UV3":"",a.pointsUvs?"#define USE_POINTS_UV":"",a.flatShading?"#define FLAT_SHADED":"",a.skinning?"#define USE_SKINNING":"",a.morphTargets?"#define USE_MORPHTARGETS":"",a.morphNormals&&a.flatShading===!1?"#define USE_MORPHNORMALS":"",a.morphColors?"#define USE_MORPHCOLORS":"",a.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+a.morphTextureStride:"",a.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+a.morphTargetsCount:"",a.doubleSided?"#define DOUBLE_SIDED":"",a.flipSided?"#define FLIP_SIDED":"",a.shadowMapEnabled?"#define USE_SHADOWMAP":"",a.shadowMapEnabled?"#define "+l:"",a.sizeAttenuation?"#define USE_SIZEATTENUATION":"",a.numLightProbes>0?"#define USE_LIGHT_PROBES":"",a.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",a.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Lc).join(`
`),h=[gT(a),"#define SHADER_TYPE "+a.shaderType,"#define SHADER_NAME "+a.shaderName,g,a.useFog&&a.fog?"#define USE_FOG":"",a.useFog&&a.fogExp2?"#define FOG_EXP2":"",a.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",a.map?"#define USE_MAP":"",a.matcap?"#define USE_MATCAP":"",a.envMap?"#define USE_ENVMAP":"",a.envMap?"#define "+u:"",a.envMap?"#define "+c:"",a.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",a.lightMap?"#define USE_LIGHTMAP":"",a.aoMap?"#define USE_AOMAP":"",a.bumpMap?"#define USE_BUMPMAP":"",a.normalMap?"#define USE_NORMALMAP":"",a.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",a.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",a.emissiveMap?"#define USE_EMISSIVEMAP":"",a.anisotropy?"#define USE_ANISOTROPY":"",a.anisotropyMap?"#define USE_ANISOTROPYMAP":"",a.clearcoat?"#define USE_CLEARCOAT":"",a.clearcoatMap?"#define USE_CLEARCOATMAP":"",a.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",a.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",a.dispersion?"#define USE_DISPERSION":"",a.iridescence?"#define USE_IRIDESCENCE":"",a.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",a.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",a.specularMap?"#define USE_SPECULARMAP":"",a.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",a.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",a.roughnessMap?"#define USE_ROUGHNESSMAP":"",a.metalnessMap?"#define USE_METALNESSMAP":"",a.alphaMap?"#define USE_ALPHAMAP":"",a.alphaTest?"#define USE_ALPHATEST":"",a.alphaHash?"#define USE_ALPHAHASH":"",a.sheen?"#define USE_SHEEN":"",a.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",a.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",a.transmission?"#define USE_TRANSMISSION":"",a.transmissionMap?"#define USE_TRANSMISSIONMAP":"",a.thicknessMap?"#define USE_THICKNESSMAP":"",a.vertexTangents&&a.flatShading===!1?"#define USE_TANGENT":"",a.vertexColors||a.instancingColor||a.batchingColor?"#define USE_COLOR":"",a.vertexAlphas?"#define USE_COLOR_ALPHA":"",a.vertexUv1s?"#define USE_UV1":"",a.vertexUv2s?"#define USE_UV2":"",a.vertexUv3s?"#define USE_UV3":"",a.pointsUvs?"#define USE_POINTS_UV":"",a.gradientMap?"#define USE_GRADIENTMAP":"",a.flatShading?"#define FLAT_SHADED":"",a.doubleSided?"#define DOUBLE_SIDED":"",a.flipSided?"#define FLIP_SIDED":"",a.shadowMapEnabled?"#define USE_SHADOWMAP":"",a.shadowMapEnabled?"#define "+l:"",a.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",a.numLightProbes>0?"#define USE_LIGHT_PROBES":"",a.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",a.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",a.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",a.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",a.toneMapping!==Wi?"#define TONE_MAPPING":"",a.toneMapping!==Wi?Xe.tonemapping_pars_fragment:"",a.toneMapping!==Wi?iD("toneMapping",a.toneMapping):"",a.dithering?"#define DITHERING":"",a.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,nD("linearToOutputTexel",a.outputColorSpace),sD(),a.useDepthPacking?"#define DEPTH_PACKING "+a.depthPacking:"",`
`].filter(Lc).join(`
`)),r=I0(r),r=hT(r,a),r=pT(r,a),o=I0(o),o=hT(o,a),o=pT(o,a),r=mT(r),o=mT(o),a.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,h=["#define varying in",a.glslVersion===p0?"":"layout(location = 0) out highp vec4 pc_fragColor;",a.glslVersion===p0?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);let S=x+m+r,v=x+h+o,T=cT(i,i.VERTEX_SHADER,S),E=cT(i,i.FRAGMENT_SHADER,v);i.attachShader(y,T),i.attachShader(y,E),a.index0AttributeName!==void 0?i.bindAttribLocation(y,0,a.index0AttributeName):a.morphTargets===!0&&i.bindAttribLocation(y,0,"position"),i.linkProgram(y);function A(I){if(t.debug.checkShaderErrors){let F=i.getProgramInfoLog(y)||"",G=i.getShaderInfoLog(T)||"",z=i.getShaderInfoLog(E)||"",X=F.trim(),k=G.trim(),K=z.trim(),O=!0,ae=!0;if(i.getProgramParameter(y,i.LINK_STATUS)===!1)if(O=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(i,y,T,E);else{let ce=dT(i,T,"vertex"),me=dT(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(y,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+X+`
`+ce+`
`+me)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(k===""||K==="")&&(ae=!1);ae&&(I.diagnostics={runnable:O,programLog:X,vertexShader:{log:k,prefix:m},fragmentShader:{log:K,prefix:h}})}i.deleteShader(T),i.deleteShader(E),R=new ml(i,y),M=lD(i,y)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let b=a.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=i.getProgramParameter(y,$2)),b},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(y),this.program=void 0},this.type=a.shaderType,this.name=a.shaderName,this.id=eD++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=T,this.fragmentShader=E,this}var SD=0,R0=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let a=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(a),s=this._getShaderStage(n),r=this._getShaderCacheForMaterial(e);return r.has(i)===!1&&(r.add(i),i.usedTimes++),r.has(s)===!1&&(r.add(s),s.usedTimes++),this}remove(e){let a=this.materialCache.get(e);for(let n of a)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let a=this.materialCache,n=a.get(e);return n===void 0&&(n=new Set,a.set(e,n)),n}_getShaderStage(e){let a=this.shaderCache,n=a.get(e);return n===void 0&&(n=new D0(e),a.set(e,n)),n}},D0=class{constructor(e){this.id=SD++,this.code=e,this.usedTimes=0}};function _D(t,e,a,n,i,s,r){let o=new Xu,l=new R0,u=new Set,c=[],f=i.logarithmicDepthBuffer,d=i.vertexTextures,p=i.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(M){return u.add(M),M===0?"uv":`uv${M}`}function m(M,b,I,F,G){let z=F.fog,X=G.geometry,k=M.isMeshStandardMaterial?F.environment:null,K=(M.isMeshStandardMaterial?a:e).get(M.envMap||k),O=K&&K.mapping===vc?K.image.height:null,ae=g[M.type];M.precision!==null&&(p=i.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));let ce=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,me=ce!==void 0?ce.length:0,Oe=0;X.morphAttributes.position!==void 0&&(Oe=1),X.morphAttributes.normal!==void 0&&(Oe=2),X.morphAttributes.color!==void 0&&(Oe=3);let Ye,Qe,at,Y;if(ae){let ht=oi[ae];Ye=ht.vertexShader,Qe=ht.fragmentShader}else Ye=M.vertexShader,Qe=M.fragmentShader,l.update(M),at=l.getVertexShaderID(M),Y=l.getFragmentShaderID(M);let $=t.getRenderTarget(),ve=t.state.buffers.depth.getReversed(),Ue=G.isInstancedMesh===!0,Ce=G.isBatchedMesh===!0,Ve=!!M.map,Ct=!!M.matcap,w=!!K,Ke=!!M.aoMap,Le=!!M.lightMap,Ee=!!M.bumpMap,Se=!!M.normalMap,rt=!!M.displacementMap,fe=!!M.emissiveMap,De=!!M.metalnessMap,Tt=!!M.roughnessMap,dt=M.anisotropy>0,L=M.clearcoat>0,_=M.dispersion>0,N=M.iridescence>0,q=M.sheen>0,j=M.transmission>0,W=dt&&!!M.anisotropyMap,ee=L&&!!M.clearcoatMap,re=L&&!!M.clearcoatNormalMap,ye=L&&!!M.clearcoatRoughnessMap,_e=N&&!!M.iridescenceMap,ne=N&&!!M.iridescenceThicknessMap,te=q&&!!M.sheenColorMap,he=q&&!!M.sheenRoughnessMap,de=!!M.specularMap,oe=!!M.specularColorMap,Be=!!M.specularIntensityMap,D=j&&!!M.transmissionMap,ie=j&&!!M.thicknessMap,ue=!!M.gradientMap,pe=!!M.alphaMap,se=M.alphaTest>0,Z=!!M.alphaHash,Te=!!M.extensions,ke=Wi;M.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(ke=t.toneMapping);let Lt={shaderID:ae,shaderType:M.type,shaderName:M.name,vertexShader:Ye,fragmentShader:Qe,defines:M.defines,customVertexShaderID:at,customFragmentShaderID:Y,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:Ce,batchingColor:Ce&&G._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&G.instanceColor!==null,instancingMorph:Ue&&G.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:$===null?t.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:xa,alphaToCoverage:!!M.alphaToCoverage,map:Ve,matcap:Ct,envMap:w,envMapMode:w&&K.mapping,envMapCubeUVHeight:O,aoMap:Ke,lightMap:Le,bumpMap:Ee,normalMap:Se,displacementMap:d&&rt,emissiveMap:fe,normalMapObjectSpace:Se&&M.normalMapType===FC,normalMapTangentSpace:Se&&M.normalMapType===op,metalnessMap:De,roughnessMap:Tt,anisotropy:dt,anisotropyMap:W,clearcoat:L,clearcoatMap:ee,clearcoatNormalMap:re,clearcoatRoughnessMap:ye,dispersion:_,iridescence:N,iridescenceMap:_e,iridescenceThicknessMap:ne,sheen:q,sheenColorMap:te,sheenRoughnessMap:he,specularMap:de,specularColorMap:oe,specularIntensityMap:Be,transmission:j,transmissionMap:D,thicknessMap:ie,gradientMap:ue,opaque:M.transparent===!1&&M.blending===mr&&M.alphaToCoverage===!1,alphaMap:pe,alphaTest:se,alphaHash:Z,combine:M.combine,mapUv:Ve&&y(M.map.channel),aoMapUv:Ke&&y(M.aoMap.channel),lightMapUv:Le&&y(M.lightMap.channel),bumpMapUv:Ee&&y(M.bumpMap.channel),normalMapUv:Se&&y(M.normalMap.channel),displacementMapUv:rt&&y(M.displacementMap.channel),emissiveMapUv:fe&&y(M.emissiveMap.channel),metalnessMapUv:De&&y(M.metalnessMap.channel),roughnessMapUv:Tt&&y(M.roughnessMap.channel),anisotropyMapUv:W&&y(M.anisotropyMap.channel),clearcoatMapUv:ee&&y(M.clearcoatMap.channel),clearcoatNormalMapUv:re&&y(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&y(M.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&y(M.iridescenceMap.channel),iridescenceThicknessMapUv:ne&&y(M.iridescenceThicknessMap.channel),sheenColorMapUv:te&&y(M.sheenColorMap.channel),sheenRoughnessMapUv:he&&y(M.sheenRoughnessMap.channel),specularMapUv:de&&y(M.specularMap.channel),specularColorMapUv:oe&&y(M.specularColorMap.channel),specularIntensityMapUv:Be&&y(M.specularIntensityMap.channel),transmissionMapUv:D&&y(M.transmissionMap.channel),thicknessMapUv:ie&&y(M.thicknessMap.channel),alphaMapUv:pe&&y(M.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(Se||dt),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!X.attributes.uv&&(Ve||pe),fog:!!z,useFog:M.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:ve,skinning:G.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:me,morphTextureStride:Oe,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:M.dithering,shadowMapEnabled:t.shadowMap.enabled&&I.length>0,shadowMapType:t.shadowMap.type,toneMapping:ke,decodeVideoTexture:Ve&&M.map.isVideoTexture===!0&&Je.getTransfer(M.map.colorSpace)===ft,decodeVideoTextureEmissive:fe&&M.emissiveMap.isVideoTexture===!0&&Je.getTransfer(M.emissiveMap.colorSpace)===ft,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Ln,flipSided:M.side===ya,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Te&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Te&&M.extensions.multiDraw===!0||Ce)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Lt.vertexUv1s=u.has(1),Lt.vertexUv2s=u.has(2),Lt.vertexUv3s=u.has(3),u.clear(),Lt}function h(M){let b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(let I in M.defines)b.push(I),b.push(M.defines[I]);return M.isRawShaderMaterial===!1&&(x(b,M),S(b,M),b.push(t.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function x(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function S(M,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),M.push(o.mask)}function v(M){let b=g[M.type],I;if(b){let F=oi[b];I=Yi.clone(F.uniforms)}else I=M.uniforms;return I}function T(M,b){let I;for(let F=0,G=c.length;F<G;F++){let z=c[F];if(z.cacheKey===b){I=z,++I.usedTimes;break}}return I===void 0&&(I=new vD(t,b,M,s),c.push(I)),I}function E(M){if(--M.usedTimes===0){let b=c.indexOf(M);c[b]=c[c.length-1],c.pop(),M.destroy()}}function A(M){l.remove(M)}function R(){l.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:T,releaseProgram:E,releaseShaderCache:A,programs:c,dispose:R}}function MD(){let t=new WeakMap;function e(r){return t.has(r)}function a(r){let o=t.get(r);return o===void 0&&(o={},t.set(r,o)),o}function n(r){t.delete(r)}function i(r,o,l){t.get(r)[o]=l}function s(){t=new WeakMap}return{has:e,get:a,remove:n,update:i,dispose:s}}function bD(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function xT(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function yT(){let t=[],e=0,a=[],n=[],i=[];function s(){e=0,a.length=0,n.length=0,i.length=0}function r(f,d,p,g,y,m){let h=t[e];return h===void 0?(h={id:f.id,object:f,geometry:d,material:p,groupOrder:g,renderOrder:f.renderOrder,z:y,group:m},t[e]=h):(h.id=f.id,h.object=f,h.geometry=d,h.material=p,h.groupOrder=g,h.renderOrder=f.renderOrder,h.z=y,h.group=m),e++,h}function o(f,d,p,g,y,m){let h=r(f,d,p,g,y,m);p.transmission>0?n.push(h):p.transparent===!0?i.push(h):a.push(h)}function l(f,d,p,g,y,m){let h=r(f,d,p,g,y,m);p.transmission>0?n.unshift(h):p.transparent===!0?i.unshift(h):a.unshift(h)}function u(f,d){a.length>1&&a.sort(f||bD),n.length>1&&n.sort(d||xT),i.length>1&&i.sort(d||xT)}function c(){for(let f=e,d=t.length;f<d;f++){let p=t[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:a,transmissive:n,transparent:i,init:s,push:o,unshift:l,finish:c,sort:u}}function CD(){let t=new WeakMap;function e(n,i){let s=t.get(n),r;return s===void 0?(r=new yT,t.set(n,[r])):i>=s.length?(r=new yT,s.push(r)):r=s[i],r}function a(){t=new WeakMap}return{get:e,dispose:a}}function TD(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let a;switch(e.type){case"DirectionalLight":a={direction:new P,color:new Ae};break;case"SpotLight":a={position:new P,direction:new P,color:new Ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":a={position:new P,color:new Ae,distance:0,decay:0};break;case"HemisphereLight":a={direction:new P,skyColor:new Ae,groundColor:new Ae};break;case"RectAreaLight":a={color:new Ae,position:new P,halfWidth:new P,halfHeight:new P};break}return t[e.id]=a,a}}}function LD(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let a;switch(e.type){case"DirectionalLight":a={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"SpotLight":a={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"PointLight":a={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=a,a}}}var AD=0;function ED(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function wD(t){let e=new TD,a=LD(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)n.probe.push(new P);let i=new P,s=new We,r=new We;function o(u){let c=0,f=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let p=0,g=0,y=0,m=0,h=0,x=0,S=0,v=0,T=0,E=0,A=0;u.sort(ED);for(let M=0,b=u.length;M<b;M++){let I=u[M],F=I.color,G=I.intensity,z=I.distance,X=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)c+=F.r*G,f+=F.g*G,d+=F.b*G;else if(I.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(I.sh.coefficients[k],G);A++}else if(I.isDirectionalLight){let k=e.get(I);if(k.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let K=I.shadow,O=a.get(I);O.shadowIntensity=K.intensity,O.shadowBias=K.bias,O.shadowNormalBias=K.normalBias,O.shadowRadius=K.radius,O.shadowMapSize=K.mapSize,n.directionalShadow[p]=O,n.directionalShadowMap[p]=X,n.directionalShadowMatrix[p]=I.shadow.matrix,x++}n.directional[p]=k,p++}else if(I.isSpotLight){let k=e.get(I);k.position.setFromMatrixPosition(I.matrixWorld),k.color.copy(F).multiplyScalar(G),k.distance=z,k.coneCos=Math.cos(I.angle),k.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),k.decay=I.decay,n.spot[y]=k;let K=I.shadow;if(I.map&&(n.spotLightMap[T]=I.map,T++,K.updateMatrices(I),I.castShadow&&E++),n.spotLightMatrix[y]=K.matrix,I.castShadow){let O=a.get(I);O.shadowIntensity=K.intensity,O.shadowBias=K.bias,O.shadowNormalBias=K.normalBias,O.shadowRadius=K.radius,O.shadowMapSize=K.mapSize,n.spotShadow[y]=O,n.spotShadowMap[y]=X,v++}y++}else if(I.isRectAreaLight){let k=e.get(I);k.color.copy(F).multiplyScalar(G),k.halfWidth.set(I.width*.5,0,0),k.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=k,m++}else if(I.isPointLight){let k=e.get(I);if(k.color.copy(I.color).multiplyScalar(I.intensity),k.distance=I.distance,k.decay=I.decay,I.castShadow){let K=I.shadow,O=a.get(I);O.shadowIntensity=K.intensity,O.shadowBias=K.bias,O.shadowNormalBias=K.normalBias,O.shadowRadius=K.radius,O.shadowMapSize=K.mapSize,O.shadowCameraNear=K.camera.near,O.shadowCameraFar=K.camera.far,n.pointShadow[g]=O,n.pointShadowMap[g]=X,n.pointShadowMatrix[g]=I.shadow.matrix,S++}n.point[g]=k,g++}else if(I.isHemisphereLight){let k=e.get(I);k.skyColor.copy(I.color).multiplyScalar(G),k.groundColor.copy(I.groundColor).multiplyScalar(G),n.hemi[h]=k,h++}}m>0&&(t.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ge.LTC_FLOAT_1,n.rectAreaLTC2=ge.LTC_FLOAT_2):(n.rectAreaLTC1=ge.LTC_HALF_1,n.rectAreaLTC2=ge.LTC_HALF_2)),n.ambient[0]=c,n.ambient[1]=f,n.ambient[2]=d;let R=n.hash;(R.directionalLength!==p||R.pointLength!==g||R.spotLength!==y||R.rectAreaLength!==m||R.hemiLength!==h||R.numDirectionalShadows!==x||R.numPointShadows!==S||R.numSpotShadows!==v||R.numSpotMaps!==T||R.numLightProbes!==A)&&(n.directional.length=p,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=h,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=v+T-E,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=A,R.directionalLength=p,R.pointLength=g,R.spotLength=y,R.rectAreaLength=m,R.hemiLength=h,R.numDirectionalShadows=x,R.numPointShadows=S,R.numSpotShadows=v,R.numSpotMaps=T,R.numLightProbes=A,n.version=AD++)}function l(u,c){let f=0,d=0,p=0,g=0,y=0,m=c.matrixWorldInverse;for(let h=0,x=u.length;h<x;h++){let S=u[h];if(S.isDirectionalLight){let v=n.directional[f];v.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),f++}else if(S.isSpotLight){let v=n.spot[p];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),p++}else if(S.isRectAreaLight){let v=n.rectArea[g];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(m),r.identity(),s.copy(S.matrixWorld),s.premultiply(m),r.extractRotation(s),v.halfWidth.set(S.width*.5,0,0),v.halfHeight.set(0,S.height*.5,0),v.halfWidth.applyMatrix4(r),v.halfHeight.applyMatrix4(r),g++}else if(S.isPointLight){let v=n.point[d];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(m),d++}else if(S.isHemisphereLight){let v=n.hemi[y];v.direction.setFromMatrixPosition(S.matrixWorld),v.direction.transformDirection(m),y++}}}return{setup:o,setupView:l,state:n}}function vT(t){let e=new wD(t),a=[],n=[];function i(c){u.camera=c,a.length=0,n.length=0}function s(c){a.push(c)}function r(c){n.push(c)}function o(){e.setup(a)}function l(c){e.setupView(a,c)}let u={lightsArray:a,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:u,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:r}}function ID(t){let e=new WeakMap;function a(i,s=0){let r=e.get(i),o;return r===void 0?(o=new vT(t),e.set(i,[o])):s>=r.length?(o=new vT(t),r.push(o)):o=r[s],o}function n(){e=new WeakMap}return{get:a,dispose:n}}var RD=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,DD=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function PD(t,e,a){let n=new nl,i=new Ie,s=new Ie,r=new lt,o=new jd({depthPacking:OC}),l=new $d,u={},c=a.maxTextureSize,f={[zn]:ya,[ya]:zn,[Ln]:Ln},d=new Jt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ie},radius:{value:4}},vertexShader:RD,fragmentShader:DD}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new ba;g.setAttribute("position",new Kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new pt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=t0;let h=this.type;this.render=function(E,A,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;let M=t.getRenderTarget(),b=t.getActiveCubeFace(),I=t.getActiveMipmapLevel(),F=t.state;F.setBlending(kn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let G=h!==ri&&this.type===ri,z=h===ri&&this.type!==ri;for(let X=0,k=E.length;X<k;X++){let K=E[X],O=K.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;i.copy(O.mapSize);let ae=O.getFrameExtents();if(i.multiply(ae),s.copy(O.mapSize),(i.x>c||i.y>c)&&(i.x>c&&(s.x=Math.floor(c/ae.x),i.x=s.x*ae.x,O.mapSize.x=s.x),i.y>c&&(s.y=Math.floor(c/ae.y),i.y=s.y*ae.y,O.mapSize.y=s.y)),O.map===null||G===!0||z===!0){let me=this.type!==ri?{minFilter:ga,magFilter:ga}:{};O.map!==null&&O.map.dispose(),O.map=new ca(i.x,i.y,me),O.map.texture.name=K.name+".shadowMap",O.camera.updateProjectionMatrix()}t.setRenderTarget(O.map),t.clear();let ce=O.getViewportCount();for(let me=0;me<ce;me++){let Oe=O.getViewport(me);r.set(s.x*Oe.x,s.y*Oe.y,s.x*Oe.z,s.y*Oe.w),F.viewport(r),O.updateMatrices(K,me),n=O.getFrustum(),v(A,R,O.camera,K,this.type)}O.isPointLightShadow!==!0&&this.type===ri&&x(O,R),O.needsUpdate=!1}h=this.type,m.needsUpdate=!1,t.setRenderTarget(M,b,I)};function x(E,A){let R=e.update(y);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new ca(i.x,i.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,t.setRenderTarget(E.mapPass),t.clear(),t.renderBufferDirect(A,null,R,d,y,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,t.setRenderTarget(E.map),t.clear(),t.renderBufferDirect(A,null,R,p,y,null)}function S(E,A,R,M){let b=null,I=R.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(I!==void 0)b=I;else if(b=R.isPointLight===!0?l:o,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let F=b.uuid,G=A.uuid,z=u[F];z===void 0&&(z={},u[F]=z);let X=z[G];X===void 0&&(X=b.clone(),z[G]=X,A.addEventListener("dispose",T)),b=X}if(b.visible=A.visible,b.wireframe=A.wireframe,M===ri?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:f[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,R.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let F=t.properties.get(b);F.light=R}return b}function v(E,A,R,M,b){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&b===ri)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,E.matrixWorld);let G=e.update(E),z=E.material;if(Array.isArray(z)){let X=G.groups;for(let k=0,K=X.length;k<K;k++){let O=X[k],ae=z[O.materialIndex];if(ae&&ae.visible){let ce=S(E,ae,M,b);E.onBeforeShadow(t,E,A,R,G,ce,O),t.renderBufferDirect(R,null,G,ce,E,O),E.onAfterShadow(t,E,A,R,G,ce,O)}}}else if(z.visible){let X=S(E,z,M,b);E.onBeforeShadow(t,E,A,R,G,X,null),t.renderBufferDirect(R,null,G,X,E,null),E.onAfterShadow(t,E,A,R,G,X,null)}}let F=E.children;for(let G=0,z=F.length;G<z;G++)v(F[G],A,R,M,b)}function T(E){E.target.removeEventListener("dispose",T);for(let R in u){let M=u[R],b=E.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}var UD={[uh]:ch,[fh]:ph,[dh]:mh,[gr]:hh,[ch]:uh,[ph]:fh,[mh]:dh,[hh]:gr};function BD(t,e){function a(){let D=!1,ie=new lt,ue=null,pe=new lt(0,0,0,0);return{setMask:function(se){ue!==se&&!D&&(t.colorMask(se,se,se,se),ue=se)},setLocked:function(se){D=se},setClear:function(se,Z,Te,ke,Lt){Lt===!0&&(se*=ke,Z*=ke,Te*=ke),ie.set(se,Z,Te,ke),pe.equals(ie)===!1&&(t.clearColor(se,Z,Te,ke),pe.copy(ie))},reset:function(){D=!1,ue=null,pe.set(-1,0,0,0)}}}function n(){let D=!1,ie=!1,ue=null,pe=null,se=null;return{setReversed:function(Z){if(ie!==Z){let Te=e.get("EXT_clip_control");Z?Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.ZERO_TO_ONE_EXT):Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.NEGATIVE_ONE_TO_ONE_EXT),ie=Z;let ke=se;se=null,this.setClear(ke)}},getReversed:function(){return ie},setTest:function(Z){Z?$(t.DEPTH_TEST):ve(t.DEPTH_TEST)},setMask:function(Z){ue!==Z&&!D&&(t.depthMask(Z),ue=Z)},setFunc:function(Z){if(ie&&(Z=UD[Z]),pe!==Z){switch(Z){case uh:t.depthFunc(t.NEVER);break;case ch:t.depthFunc(t.ALWAYS);break;case fh:t.depthFunc(t.LESS);break;case gr:t.depthFunc(t.LEQUAL);break;case dh:t.depthFunc(t.EQUAL);break;case hh:t.depthFunc(t.GEQUAL);break;case ph:t.depthFunc(t.GREATER);break;case mh:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}pe=Z}},setLocked:function(Z){D=Z},setClear:function(Z){se!==Z&&(ie&&(Z=1-Z),t.clearDepth(Z),se=Z)},reset:function(){D=!1,ue=null,pe=null,se=null,ie=!1}}}function i(){let D=!1,ie=null,ue=null,pe=null,se=null,Z=null,Te=null,ke=null,Lt=null;return{setTest:function(ht){D||(ht?$(t.STENCIL_TEST):ve(t.STENCIL_TEST))},setMask:function(ht){ie!==ht&&!D&&(t.stencilMask(ht),ie=ht)},setFunc:function(ht,ui,Gn){(ue!==ht||pe!==ui||se!==Gn)&&(t.stencilFunc(ht,ui,Gn),ue=ht,pe=ui,se=Gn)},setOp:function(ht,ui,Gn){(Z!==ht||Te!==ui||ke!==Gn)&&(t.stencilOp(ht,ui,Gn),Z=ht,Te=ui,ke=Gn)},setLocked:function(ht){D=ht},setClear:function(ht){Lt!==ht&&(t.clearStencil(ht),Lt=ht)},reset:function(){D=!1,ie=null,ue=null,pe=null,se=null,Z=null,Te=null,ke=null,Lt=null}}}let s=new a,r=new n,o=new i,l=new WeakMap,u=new WeakMap,c={},f={},d=new WeakMap,p=[],g=null,y=!1,m=null,h=null,x=null,S=null,v=null,T=null,E=null,A=new Ae(0,0,0),R=0,M=!1,b=null,I=null,F=null,G=null,z=null,X=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,K=0,O=t.getParameter(t.VERSION);O.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(O)[1]),k=K>=1):O.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),k=K>=2);let ae=null,ce={},me=t.getParameter(t.SCISSOR_BOX),Oe=t.getParameter(t.VIEWPORT),Ye=new lt().fromArray(me),Qe=new lt().fromArray(Oe);function at(D,ie,ue,pe){let se=new Uint8Array(4),Z=t.createTexture();t.bindTexture(D,Z),t.texParameteri(D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(D,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Te=0;Te<ue;Te++)D===t.TEXTURE_3D||D===t.TEXTURE_2D_ARRAY?t.texImage3D(ie,0,t.RGBA,1,1,pe,0,t.RGBA,t.UNSIGNED_BYTE,se):t.texImage2D(ie+Te,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,se);return Z}let Y={};Y[t.TEXTURE_2D]=at(t.TEXTURE_2D,t.TEXTURE_2D,1),Y[t.TEXTURE_CUBE_MAP]=at(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[t.TEXTURE_2D_ARRAY]=at(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),Y[t.TEXTURE_3D]=at(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),$(t.DEPTH_TEST),r.setFunc(gr),Ee(!1),Se(e0),$(t.CULL_FACE),Ke(kn);function $(D){c[D]!==!0&&(t.enable(D),c[D]=!0)}function ve(D){c[D]!==!1&&(t.disable(D),c[D]=!1)}function Ue(D,ie){return f[D]!==ie?(t.bindFramebuffer(D,ie),f[D]=ie,D===t.DRAW_FRAMEBUFFER&&(f[t.FRAMEBUFFER]=ie),D===t.FRAMEBUFFER&&(f[t.DRAW_FRAMEBUFFER]=ie),!0):!1}function Ce(D,ie){let ue=p,pe=!1;if(D){ue=d.get(ie),ue===void 0&&(ue=[],d.set(ie,ue));let se=D.textures;if(ue.length!==se.length||ue[0]!==t.COLOR_ATTACHMENT0){for(let Z=0,Te=se.length;Z<Te;Z++)ue[Z]=t.COLOR_ATTACHMENT0+Z;ue.length=se.length,pe=!0}}else ue[0]!==t.BACK&&(ue[0]=t.BACK,pe=!0);pe&&t.drawBuffers(ue)}function Ve(D){return g!==D?(t.useProgram(D),g=D,!0):!1}let Ct={[Ps]:t.FUNC_ADD,[mC]:t.FUNC_SUBTRACT,[gC]:t.FUNC_REVERSE_SUBTRACT};Ct[xC]=t.MIN,Ct[yC]=t.MAX;let w={[vC]:t.ZERO,[SC]:t.ONE,[_C]:t.SRC_COLOR,[Vd]:t.SRC_ALPHA,[AC]:t.SRC_ALPHA_SATURATE,[TC]:t.DST_COLOR,[bC]:t.DST_ALPHA,[MC]:t.ONE_MINUS_SRC_COLOR,[Gd]:t.ONE_MINUS_SRC_ALPHA,[LC]:t.ONE_MINUS_DST_COLOR,[CC]:t.ONE_MINUS_DST_ALPHA,[EC]:t.CONSTANT_COLOR,[wC]:t.ONE_MINUS_CONSTANT_COLOR,[IC]:t.CONSTANT_ALPHA,[RC]:t.ONE_MINUS_CONSTANT_ALPHA};function Ke(D,ie,ue,pe,se,Z,Te,ke,Lt,ht){if(D===kn){y===!0&&(ve(t.BLEND),y=!1);return}if(y===!1&&($(t.BLEND),y=!0),D!==pC){if(D!==m||ht!==M){if((h!==Ps||v!==Ps)&&(t.blendEquation(t.FUNC_ADD),h=Ps,v=Ps),ht)switch(D){case mr:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case yc:t.blendFunc(t.ONE,t.ONE);break;case a0:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case n0:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case mr:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case yc:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case a0:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case n0:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}x=null,S=null,T=null,E=null,A.set(0,0,0),R=0,m=D,M=ht}return}se=se||ie,Z=Z||ue,Te=Te||pe,(ie!==h||se!==v)&&(t.blendEquationSeparate(Ct[ie],Ct[se]),h=ie,v=se),(ue!==x||pe!==S||Z!==T||Te!==E)&&(t.blendFuncSeparate(w[ue],w[pe],w[Z],w[Te]),x=ue,S=pe,T=Z,E=Te),(ke.equals(A)===!1||Lt!==R)&&(t.blendColor(ke.r,ke.g,ke.b,Lt),A.copy(ke),R=Lt),m=D,M=!1}function Le(D,ie){D.side===Ln?ve(t.CULL_FACE):$(t.CULL_FACE);let ue=D.side===ya;ie&&(ue=!ue),Ee(ue),D.blending===mr&&D.transparent===!1?Ke(kn):Ke(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),s.setMask(D.colorWrite);let pe=D.stencilWrite;o.setTest(pe),pe&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),fe(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?$(t.SAMPLE_ALPHA_TO_COVERAGE):ve(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ee(D){b!==D&&(D?t.frontFace(t.CW):t.frontFace(t.CCW),b=D)}function Se(D){D!==dC?($(t.CULL_FACE),D!==I&&(D===e0?t.cullFace(t.BACK):D===hC?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):ve(t.CULL_FACE),I=D}function rt(D){D!==F&&(k&&t.lineWidth(D),F=D)}function fe(D,ie,ue){D?($(t.POLYGON_OFFSET_FILL),(G!==ie||z!==ue)&&(t.polygonOffset(ie,ue),G=ie,z=ue)):ve(t.POLYGON_OFFSET_FILL)}function De(D){D?$(t.SCISSOR_TEST):ve(t.SCISSOR_TEST)}function Tt(D){D===void 0&&(D=t.TEXTURE0+X-1),ae!==D&&(t.activeTexture(D),ae=D)}function dt(D,ie,ue){ue===void 0&&(ae===null?ue=t.TEXTURE0+X-1:ue=ae);let pe=ce[ue];pe===void 0&&(pe={type:void 0,texture:void 0},ce[ue]=pe),(pe.type!==D||pe.texture!==ie)&&(ae!==ue&&(t.activeTexture(ue),ae=ue),t.bindTexture(D,ie||Y[D]),pe.type=D,pe.texture=ie)}function L(){let D=ce[ae];D!==void 0&&D.type!==void 0&&(t.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function _(){try{t.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function N(){try{t.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{t.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function j(){try{t.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function W(){try{t.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ee(){try{t.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function re(){try{t.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ye(){try{t.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function _e(){try{t.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ne(){try{t.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function te(D){Ye.equals(D)===!1&&(t.scissor(D.x,D.y,D.z,D.w),Ye.copy(D))}function he(D){Qe.equals(D)===!1&&(t.viewport(D.x,D.y,D.z,D.w),Qe.copy(D))}function de(D,ie){let ue=u.get(ie);ue===void 0&&(ue=new WeakMap,u.set(ie,ue));let pe=ue.get(D);pe===void 0&&(pe=t.getUniformBlockIndex(ie,D.name),ue.set(D,pe))}function oe(D,ie){let pe=u.get(ie).get(D);l.get(ie)!==pe&&(t.uniformBlockBinding(ie,pe,D.__bindingPointIndex),l.set(ie,pe))}function Be(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),r.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),c={},ae=null,ce={},f={},d=new WeakMap,p=[],g=null,y=!1,m=null,h=null,x=null,S=null,v=null,T=null,E=null,A=new Ae(0,0,0),R=0,M=!1,b=null,I=null,F=null,G=null,z=null,Ye.set(0,0,t.canvas.width,t.canvas.height),Qe.set(0,0,t.canvas.width,t.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:$,disable:ve,bindFramebuffer:Ue,drawBuffers:Ce,useProgram:Ve,setBlending:Ke,setMaterial:Le,setFlipSided:Ee,setCullFace:Se,setLineWidth:rt,setPolygonOffset:fe,setScissorTest:De,activeTexture:Tt,bindTexture:dt,unbindTexture:L,compressedTexImage2D:_,compressedTexImage3D:N,texImage2D:_e,texImage3D:ne,updateUBOMapping:de,uniformBlockBinding:oe,texStorage2D:re,texStorage3D:ye,texSubImage2D:q,texSubImage3D:j,compressedTexSubImage2D:W,compressedTexSubImage3D:ee,scissor:te,viewport:he,reset:Be}}function ND(t,e,a,n,i,s,r){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new Ie,c=new WeakMap,f,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(L,_){return p?new OffscreenCanvas(L,_):Jo("canvas")}function y(L,_,N){let q=1,j=dt(L);if((j.width>N||j.height>N)&&(q=N/Math.max(j.width,j.height)),q<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){let W=Math.floor(q*j.width),ee=Math.floor(q*j.height);f===void 0&&(f=g(W,ee));let re=_?g(W,ee):f;return re.width=W,re.height=ee,re.getContext("2d").drawImage(L,0,0,W,ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+W+"x"+ee+")."),re}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),L;return L}function m(L){return L.generateMipmaps}function h(L){t.generateMipmap(L)}function x(L){return L.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?t.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function S(L,_,N,q,j=!1){if(L!==null){if(t[L]!==void 0)return t[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let W=_;if(_===t.RED&&(N===t.FLOAT&&(W=t.R32F),N===t.HALF_FLOAT&&(W=t.R16F),N===t.UNSIGNED_BYTE&&(W=t.R8)),_===t.RED_INTEGER&&(N===t.UNSIGNED_BYTE&&(W=t.R8UI),N===t.UNSIGNED_SHORT&&(W=t.R16UI),N===t.UNSIGNED_INT&&(W=t.R32UI),N===t.BYTE&&(W=t.R8I),N===t.SHORT&&(W=t.R16I),N===t.INT&&(W=t.R32I)),_===t.RG&&(N===t.FLOAT&&(W=t.RG32F),N===t.HALF_FLOAT&&(W=t.RG16F),N===t.UNSIGNED_BYTE&&(W=t.RG8)),_===t.RG_INTEGER&&(N===t.UNSIGNED_BYTE&&(W=t.RG8UI),N===t.UNSIGNED_SHORT&&(W=t.RG16UI),N===t.UNSIGNED_INT&&(W=t.RG32UI),N===t.BYTE&&(W=t.RG8I),N===t.SHORT&&(W=t.RG16I),N===t.INT&&(W=t.RG32I)),_===t.RGB_INTEGER&&(N===t.UNSIGNED_BYTE&&(W=t.RGB8UI),N===t.UNSIGNED_SHORT&&(W=t.RGB16UI),N===t.UNSIGNED_INT&&(W=t.RGB32UI),N===t.BYTE&&(W=t.RGB8I),N===t.SHORT&&(W=t.RGB16I),N===t.INT&&(W=t.RGB32I)),_===t.RGBA_INTEGER&&(N===t.UNSIGNED_BYTE&&(W=t.RGBA8UI),N===t.UNSIGNED_SHORT&&(W=t.RGBA16UI),N===t.UNSIGNED_INT&&(W=t.RGBA32UI),N===t.BYTE&&(W=t.RGBA8I),N===t.SHORT&&(W=t.RGBA16I),N===t.INT&&(W=t.RGBA32I)),_===t.RGB&&(N===t.UNSIGNED_INT_5_9_9_9_REV&&(W=t.RGB9_E5),N===t.UNSIGNED_INT_10F_11F_11F_REV&&(W=t.R11F_G11F_B10F)),_===t.RGBA){let ee=j?Gu:Je.getTransfer(q);N===t.FLOAT&&(W=t.RGBA32F),N===t.HALF_FLOAT&&(W=t.RGBA16F),N===t.UNSIGNED_BYTE&&(W=ee===ft?t.SRGB8_ALPHA8:t.RGBA8),N===t.UNSIGNED_SHORT_4_4_4_4&&(W=t.RGBA4),N===t.UNSIGNED_SHORT_5_5_5_1&&(W=t.RGB5_A1)}return(W===t.R16F||W===t.R32F||W===t.RG16F||W===t.RG32F||W===t.RGBA16F||W===t.RGBA32F)&&e.get("EXT_color_buffer_float"),W}function v(L,_){let N;return L?_===null||_===Os||_===cl?N=t.DEPTH24_STENCIL8:_===An?N=t.DEPTH32F_STENCIL8:_===ul&&(N=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Os||_===cl?N=t.DEPTH_COMPONENT24:_===An?N=t.DEPTH_COMPONENT32F:_===ul&&(N=t.DEPTH_COMPONENT16),N}function T(L,_){return m(L)===!0||L.isFramebufferTexture&&L.minFilter!==ga&&L.minFilter!==Ia?Math.log2(Math.max(_.width,_.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?_.mipmaps.length:1}function E(L){let _=L.target;_.removeEventListener("dispose",E),R(_),_.isVideoTexture&&c.delete(_)}function A(L){let _=L.target;_.removeEventListener("dispose",A),b(_)}function R(L){let _=n.get(L);if(_.__webglInit===void 0)return;let N=L.source,q=d.get(N);if(q){let j=q[_.__cacheKey];j.usedTimes--,j.usedTimes===0&&M(L),Object.keys(q).length===0&&d.delete(N)}n.remove(L)}function M(L){let _=n.get(L);t.deleteTexture(_.__webglTexture);let N=L.source,q=d.get(N);delete q[_.__cacheKey],r.memory.textures--}function b(L){let _=n.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),n.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(_.__webglFramebuffer[q]))for(let j=0;j<_.__webglFramebuffer[q].length;j++)t.deleteFramebuffer(_.__webglFramebuffer[q][j]);else t.deleteFramebuffer(_.__webglFramebuffer[q]);_.__webglDepthbuffer&&t.deleteRenderbuffer(_.__webglDepthbuffer[q])}else{if(Array.isArray(_.__webglFramebuffer))for(let q=0;q<_.__webglFramebuffer.length;q++)t.deleteFramebuffer(_.__webglFramebuffer[q]);else t.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&t.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&t.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let q=0;q<_.__webglColorRenderbuffer.length;q++)_.__webglColorRenderbuffer[q]&&t.deleteRenderbuffer(_.__webglColorRenderbuffer[q]);_.__webglDepthRenderbuffer&&t.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let N=L.textures;for(let q=0,j=N.length;q<j;q++){let W=n.get(N[q]);W.__webglTexture&&(t.deleteTexture(W.__webglTexture),r.memory.textures--),n.remove(N[q])}n.remove(L)}let I=0;function F(){I=0}function G(){let L=I;return L>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+i.maxTextures),I+=1,L}function z(L){let _=[];return _.push(L.wrapS),_.push(L.wrapT),_.push(L.wrapR||0),_.push(L.magFilter),_.push(L.minFilter),_.push(L.anisotropy),_.push(L.internalFormat),_.push(L.format),_.push(L.type),_.push(L.generateMipmaps),_.push(L.premultiplyAlpha),_.push(L.flipY),_.push(L.unpackAlignment),_.push(L.colorSpace),_.join()}function X(L,_){let N=n.get(L);if(L.isVideoTexture&&De(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&N.__version!==L.version){let q=L.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(N,L,_);return}}else L.isExternalTexture&&(N.__webglTexture=L.sourceTexture?L.sourceTexture:null);a.bindTexture(t.TEXTURE_2D,N.__webglTexture,t.TEXTURE0+_)}function k(L,_){let N=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&N.__version!==L.version){Y(N,L,_);return}a.bindTexture(t.TEXTURE_2D_ARRAY,N.__webglTexture,t.TEXTURE0+_)}function K(L,_){let N=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&N.__version!==L.version){Y(N,L,_);return}a.bindTexture(t.TEXTURE_3D,N.__webglTexture,t.TEXTURE0+_)}function O(L,_){let N=n.get(L);if(L.version>0&&N.__version!==L.version){$(N,L,_);return}a.bindTexture(t.TEXTURE_CUBE_MAP,N.__webglTexture,t.TEXTURE0+_)}let ae={[Us]:t.REPEAT,[$n]:t.CLAMP_TO_EDGE,[Zo]:t.MIRRORED_REPEAT},ce={[ga]:t.NEAREST,[Th]:t.NEAREST_MIPMAP_NEAREST,[wr]:t.NEAREST_MIPMAP_LINEAR,[Ia]:t.LINEAR,[ll]:t.LINEAR_MIPMAP_NEAREST,[Hn]:t.LINEAR_MIPMAP_LINEAR},me={[zC]:t.NEVER,[WC]:t.ALWAYS,[kC]:t.LESS,[h0]:t.LEQUAL,[HC]:t.EQUAL,[qC]:t.GEQUAL,[VC]:t.GREATER,[GC]:t.NOTEQUAL};function Oe(L,_){if(_.type===An&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Ia||_.magFilter===ll||_.magFilter===wr||_.magFilter===Hn||_.minFilter===Ia||_.minFilter===ll||_.minFilter===wr||_.minFilter===Hn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(L,t.TEXTURE_WRAP_S,ae[_.wrapS]),t.texParameteri(L,t.TEXTURE_WRAP_T,ae[_.wrapT]),(L===t.TEXTURE_3D||L===t.TEXTURE_2D_ARRAY)&&t.texParameteri(L,t.TEXTURE_WRAP_R,ae[_.wrapR]),t.texParameteri(L,t.TEXTURE_MAG_FILTER,ce[_.magFilter]),t.texParameteri(L,t.TEXTURE_MIN_FILTER,ce[_.minFilter]),_.compareFunction&&(t.texParameteri(L,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(L,t.TEXTURE_COMPARE_FUNC,me[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===ga||_.minFilter!==wr&&_.minFilter!==Hn||_.type===An&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let N=e.get("EXT_texture_filter_anisotropic");t.texParameterf(L,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,i.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Ye(L,_){let N=!1;L.__webglInit===void 0&&(L.__webglInit=!0,_.addEventListener("dispose",E));let q=_.source,j=d.get(q);j===void 0&&(j={},d.set(q,j));let W=z(_);if(W!==L.__cacheKey){j[W]===void 0&&(j[W]={texture:t.createTexture(),usedTimes:0},r.memory.textures++,N=!0),j[W].usedTimes++;let ee=j[L.__cacheKey];ee!==void 0&&(j[L.__cacheKey].usedTimes--,ee.usedTimes===0&&M(_)),L.__cacheKey=W,L.__webglTexture=j[W].texture}return N}function Qe(L,_,N){return Math.floor(Math.floor(L/N)/_)}function at(L,_,N,q){let W=L.updateRanges;if(W.length===0)a.texSubImage2D(t.TEXTURE_2D,0,0,0,_.width,_.height,N,q,_.data);else{W.sort((ne,te)=>ne.start-te.start);let ee=0;for(let ne=1;ne<W.length;ne++){let te=W[ee],he=W[ne],de=te.start+te.count,oe=Qe(he.start,_.width,4),Be=Qe(te.start,_.width,4);he.start<=de+1&&oe===Be&&Qe(he.start+he.count-1,_.width,4)===oe?te.count=Math.max(te.count,he.start+he.count-te.start):(++ee,W[ee]=he)}W.length=ee+1;let re=t.getParameter(t.UNPACK_ROW_LENGTH),ye=t.getParameter(t.UNPACK_SKIP_PIXELS),_e=t.getParameter(t.UNPACK_SKIP_ROWS);t.pixelStorei(t.UNPACK_ROW_LENGTH,_.width);for(let ne=0,te=W.length;ne<te;ne++){let he=W[ne],de=Math.floor(he.start/4),oe=Math.ceil(he.count/4),Be=de%_.width,D=Math.floor(de/_.width),ie=oe,ue=1;t.pixelStorei(t.UNPACK_SKIP_PIXELS,Be),t.pixelStorei(t.UNPACK_SKIP_ROWS,D),a.texSubImage2D(t.TEXTURE_2D,0,Be,D,ie,ue,N,q,_.data)}L.clearUpdateRanges(),t.pixelStorei(t.UNPACK_ROW_LENGTH,re),t.pixelStorei(t.UNPACK_SKIP_PIXELS,ye),t.pixelStorei(t.UNPACK_SKIP_ROWS,_e)}}function Y(L,_,N){let q=t.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(q=t.TEXTURE_2D_ARRAY),_.isData3DTexture&&(q=t.TEXTURE_3D);let j=Ye(L,_),W=_.source;a.bindTexture(q,L.__webglTexture,t.TEXTURE0+N);let ee=n.get(W);if(W.version!==ee.__version||j===!0){a.activeTexture(t.TEXTURE0+N);let re=Je.getPrimaries(Je.workingColorSpace),ye=_.colorSpace===Xi?null:Je.getPrimaries(_.colorSpace),_e=_.colorSpace===Xi||re===ye?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);let ne=y(_.image,!1,i.maxTextureSize);ne=Tt(_,ne);let te=s.convert(_.format,_.colorSpace),he=s.convert(_.type),de=S(_.internalFormat,te,he,_.colorSpace,_.isVideoTexture);Oe(q,_);let oe,Be=_.mipmaps,D=_.isVideoTexture!==!0,ie=ee.__version===void 0||j===!0,ue=W.dataReady,pe=T(_,ne);if(_.isDepthTexture)de=v(_.format===fl,_.type),ie&&(D?a.texStorage2D(t.TEXTURE_2D,1,de,ne.width,ne.height):a.texImage2D(t.TEXTURE_2D,0,de,ne.width,ne.height,0,te,he,null));else if(_.isDataTexture)if(Be.length>0){D&&ie&&a.texStorage2D(t.TEXTURE_2D,pe,de,Be[0].width,Be[0].height);for(let se=0,Z=Be.length;se<Z;se++)oe=Be[se],D?ue&&a.texSubImage2D(t.TEXTURE_2D,se,0,0,oe.width,oe.height,te,he,oe.data):a.texImage2D(t.TEXTURE_2D,se,de,oe.width,oe.height,0,te,he,oe.data);_.generateMipmaps=!1}else D?(ie&&a.texStorage2D(t.TEXTURE_2D,pe,de,ne.width,ne.height),ue&&at(_,ne,te,he)):a.texImage2D(t.TEXTURE_2D,0,de,ne.width,ne.height,0,te,he,ne.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){D&&ie&&a.texStorage3D(t.TEXTURE_2D_ARRAY,pe,de,Be[0].width,Be[0].height,ne.depth);for(let se=0,Z=Be.length;se<Z;se++)if(oe=Be[se],_.format!==un)if(te!==null)if(D){if(ue)if(_.layerUpdates.size>0){let Te=S0(oe.width,oe.height,_.format,_.type);for(let ke of _.layerUpdates){let Lt=oe.data.subarray(ke*Te/oe.data.BYTES_PER_ELEMENT,(ke+1)*Te/oe.data.BYTES_PER_ELEMENT);a.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,se,0,0,ke,oe.width,oe.height,1,te,Lt)}_.clearLayerUpdates()}else a.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,se,0,0,0,oe.width,oe.height,ne.depth,te,oe.data)}else a.compressedTexImage3D(t.TEXTURE_2D_ARRAY,se,de,oe.width,oe.height,ne.depth,0,oe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?ue&&a.texSubImage3D(t.TEXTURE_2D_ARRAY,se,0,0,0,oe.width,oe.height,ne.depth,te,he,oe.data):a.texImage3D(t.TEXTURE_2D_ARRAY,se,de,oe.width,oe.height,ne.depth,0,te,he,oe.data)}else{D&&ie&&a.texStorage2D(t.TEXTURE_2D,pe,de,Be[0].width,Be[0].height);for(let se=0,Z=Be.length;se<Z;se++)oe=Be[se],_.format!==un?te!==null?D?ue&&a.compressedTexSubImage2D(t.TEXTURE_2D,se,0,0,oe.width,oe.height,te,oe.data):a.compressedTexImage2D(t.TEXTURE_2D,se,de,oe.width,oe.height,0,oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?ue&&a.texSubImage2D(t.TEXTURE_2D,se,0,0,oe.width,oe.height,te,he,oe.data):a.texImage2D(t.TEXTURE_2D,se,de,oe.width,oe.height,0,te,he,oe.data)}else if(_.isDataArrayTexture)if(D){if(ie&&a.texStorage3D(t.TEXTURE_2D_ARRAY,pe,de,ne.width,ne.height,ne.depth),ue)if(_.layerUpdates.size>0){let se=S0(ne.width,ne.height,_.format,_.type);for(let Z of _.layerUpdates){let Te=ne.data.subarray(Z*se/ne.data.BYTES_PER_ELEMENT,(Z+1)*se/ne.data.BYTES_PER_ELEMENT);a.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Z,ne.width,ne.height,1,te,he,Te)}_.clearLayerUpdates()}else a.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,te,he,ne.data)}else a.texImage3D(t.TEXTURE_2D_ARRAY,0,de,ne.width,ne.height,ne.depth,0,te,he,ne.data);else if(_.isData3DTexture)D?(ie&&a.texStorage3D(t.TEXTURE_3D,pe,de,ne.width,ne.height,ne.depth),ue&&a.texSubImage3D(t.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,te,he,ne.data)):a.texImage3D(t.TEXTURE_3D,0,de,ne.width,ne.height,ne.depth,0,te,he,ne.data);else if(_.isFramebufferTexture){if(ie)if(D)a.texStorage2D(t.TEXTURE_2D,pe,de,ne.width,ne.height);else{let se=ne.width,Z=ne.height;for(let Te=0;Te<pe;Te++)a.texImage2D(t.TEXTURE_2D,Te,de,se,Z,0,te,he,null),se>>=1,Z>>=1}}else if(Be.length>0){if(D&&ie){let se=dt(Be[0]);a.texStorage2D(t.TEXTURE_2D,pe,de,se.width,se.height)}for(let se=0,Z=Be.length;se<Z;se++)oe=Be[se],D?ue&&a.texSubImage2D(t.TEXTURE_2D,se,0,0,te,he,oe):a.texImage2D(t.TEXTURE_2D,se,de,te,he,oe);_.generateMipmaps=!1}else if(D){if(ie){let se=dt(ne);a.texStorage2D(t.TEXTURE_2D,pe,de,se.width,se.height)}ue&&a.texSubImage2D(t.TEXTURE_2D,0,0,0,te,he,ne)}else a.texImage2D(t.TEXTURE_2D,0,de,te,he,ne);m(_)&&h(q),ee.__version=W.version,_.onUpdate&&_.onUpdate(_)}L.__version=_.version}function $(L,_,N){if(_.image.length!==6)return;let q=Ye(L,_),j=_.source;a.bindTexture(t.TEXTURE_CUBE_MAP,L.__webglTexture,t.TEXTURE0+N);let W=n.get(j);if(j.version!==W.__version||q===!0){a.activeTexture(t.TEXTURE0+N);let ee=Je.getPrimaries(Je.workingColorSpace),re=_.colorSpace===Xi?null:Je.getPrimaries(_.colorSpace),ye=_.colorSpace===Xi||ee===re?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);let _e=_.isCompressedTexture||_.image[0].isCompressedTexture,ne=_.image[0]&&_.image[0].isDataTexture,te=[];for(let Z=0;Z<6;Z++)!_e&&!ne?te[Z]=y(_.image[Z],!0,i.maxCubemapSize):te[Z]=ne?_.image[Z].image:_.image[Z],te[Z]=Tt(_,te[Z]);let he=te[0],de=s.convert(_.format,_.colorSpace),oe=s.convert(_.type),Be=S(_.internalFormat,de,oe,_.colorSpace),D=_.isVideoTexture!==!0,ie=W.__version===void 0||q===!0,ue=j.dataReady,pe=T(_,he);Oe(t.TEXTURE_CUBE_MAP,_);let se;if(_e){D&&ie&&a.texStorage2D(t.TEXTURE_CUBE_MAP,pe,Be,he.width,he.height);for(let Z=0;Z<6;Z++){se=te[Z].mipmaps;for(let Te=0;Te<se.length;Te++){let ke=se[Te];_.format!==un?de!==null?D?ue&&a.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Te,0,0,ke.width,ke.height,de,ke.data):a.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Te,Be,ke.width,ke.height,0,ke.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?ue&&a.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Te,0,0,ke.width,ke.height,de,oe,ke.data):a.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Te,Be,ke.width,ke.height,0,de,oe,ke.data)}}}else{if(se=_.mipmaps,D&&ie){se.length>0&&pe++;let Z=dt(te[0]);a.texStorage2D(t.TEXTURE_CUBE_MAP,pe,Be,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(ne){D?ue&&a.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,te[Z].width,te[Z].height,de,oe,te[Z].data):a.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Be,te[Z].width,te[Z].height,0,de,oe,te[Z].data);for(let Te=0;Te<se.length;Te++){let Lt=se[Te].image[Z].image;D?ue&&a.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Te+1,0,0,Lt.width,Lt.height,de,oe,Lt.data):a.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Te+1,Be,Lt.width,Lt.height,0,de,oe,Lt.data)}}else{D?ue&&a.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,de,oe,te[Z]):a.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Be,de,oe,te[Z]);for(let Te=0;Te<se.length;Te++){let ke=se[Te];D?ue&&a.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Te+1,0,0,de,oe,ke.image[Z]):a.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Te+1,Be,de,oe,ke.image[Z])}}}m(_)&&h(t.TEXTURE_CUBE_MAP),W.__version=j.version,_.onUpdate&&_.onUpdate(_)}L.__version=_.version}function ve(L,_,N,q,j,W){let ee=s.convert(N.format,N.colorSpace),re=s.convert(N.type),ye=S(N.internalFormat,ee,re,N.colorSpace),_e=n.get(_),ne=n.get(N);if(ne.__renderTarget=_,!_e.__hasExternalTextures){let te=Math.max(1,_.width>>W),he=Math.max(1,_.height>>W);j===t.TEXTURE_3D||j===t.TEXTURE_2D_ARRAY?a.texImage3D(j,W,ye,te,he,_.depth,0,ee,re,null):a.texImage2D(j,W,ye,te,he,0,ee,re,null)}a.bindFramebuffer(t.FRAMEBUFFER,L),fe(_)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,q,j,ne.__webglTexture,0,rt(_)):(j===t.TEXTURE_2D||j>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,q,j,ne.__webglTexture,W),a.bindFramebuffer(t.FRAMEBUFFER,null)}function Ue(L,_,N){if(t.bindRenderbuffer(t.RENDERBUFFER,L),_.depthBuffer){let q=_.depthTexture,j=q&&q.isDepthTexture?q.type:null,W=v(_.stencilBuffer,j),ee=_.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,re=rt(_);fe(_)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,re,W,_.width,_.height):N?t.renderbufferStorageMultisample(t.RENDERBUFFER,re,W,_.width,_.height):t.renderbufferStorage(t.RENDERBUFFER,W,_.width,_.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,ee,t.RENDERBUFFER,L)}else{let q=_.textures;for(let j=0;j<q.length;j++){let W=q[j],ee=s.convert(W.format,W.colorSpace),re=s.convert(W.type),ye=S(W.internalFormat,ee,re,W.colorSpace),_e=rt(_);N&&fe(_)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,_e,ye,_.width,_.height):fe(_)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,_e,ye,_.width,_.height):t.renderbufferStorage(t.RENDERBUFFER,ye,_.width,_.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Ce(L,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(a.bindFramebuffer(t.FRAMEBUFFER,L),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let q=n.get(_.depthTexture);q.__renderTarget=_,(!q.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),X(_.depthTexture,0);let j=q.__webglTexture,W=rt(_);if(_.depthTexture.format===Ko)fe(_)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,j,0,W):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,j,0);else if(_.depthTexture.format===fl)fe(_)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,j,0,W):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Ve(L){let _=n.get(L),N=L.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==L.depthTexture){let q=L.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),q){let j=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,q.removeEventListener("dispose",j)};q.addEventListener("dispose",j),_.__depthDisposeCallback=j}_.__boundDepthTexture=q}if(L.depthTexture&&!_.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");let q=L.texture.mipmaps;q&&q.length>0?Ce(_.__webglFramebuffer[0],L):Ce(_.__webglFramebuffer,L)}else if(N){_.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(a.bindFramebuffer(t.FRAMEBUFFER,_.__webglFramebuffer[q]),_.__webglDepthbuffer[q]===void 0)_.__webglDepthbuffer[q]=t.createRenderbuffer(),Ue(_.__webglDepthbuffer[q],L,!1);else{let j=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,W=_.__webglDepthbuffer[q];t.bindRenderbuffer(t.RENDERBUFFER,W),t.framebufferRenderbuffer(t.FRAMEBUFFER,j,t.RENDERBUFFER,W)}}else{let q=L.texture.mipmaps;if(q&&q.length>0?a.bindFramebuffer(t.FRAMEBUFFER,_.__webglFramebuffer[0]):a.bindFramebuffer(t.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=t.createRenderbuffer(),Ue(_.__webglDepthbuffer,L,!1);else{let j=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,W=_.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,W),t.framebufferRenderbuffer(t.FRAMEBUFFER,j,t.RENDERBUFFER,W)}}a.bindFramebuffer(t.FRAMEBUFFER,null)}function Ct(L,_,N){let q=n.get(L);_!==void 0&&ve(q.__webglFramebuffer,L,L.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),N!==void 0&&Ve(L)}function w(L){let _=L.texture,N=n.get(L),q=n.get(_);L.addEventListener("dispose",A);let j=L.textures,W=L.isWebGLCubeRenderTarget===!0,ee=j.length>1;if(ee||(q.__webglTexture===void 0&&(q.__webglTexture=t.createTexture()),q.__version=_.version,r.memory.textures++),W){N.__webglFramebuffer=[];for(let re=0;re<6;re++)if(_.mipmaps&&_.mipmaps.length>0){N.__webglFramebuffer[re]=[];for(let ye=0;ye<_.mipmaps.length;ye++)N.__webglFramebuffer[re][ye]=t.createFramebuffer()}else N.__webglFramebuffer[re]=t.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){N.__webglFramebuffer=[];for(let re=0;re<_.mipmaps.length;re++)N.__webglFramebuffer[re]=t.createFramebuffer()}else N.__webglFramebuffer=t.createFramebuffer();if(ee)for(let re=0,ye=j.length;re<ye;re++){let _e=n.get(j[re]);_e.__webglTexture===void 0&&(_e.__webglTexture=t.createTexture(),r.memory.textures++)}if(L.samples>0&&fe(L)===!1){N.__webglMultisampledFramebuffer=t.createFramebuffer(),N.__webglColorRenderbuffer=[],a.bindFramebuffer(t.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let re=0;re<j.length;re++){let ye=j[re];N.__webglColorRenderbuffer[re]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,N.__webglColorRenderbuffer[re]);let _e=s.convert(ye.format,ye.colorSpace),ne=s.convert(ye.type),te=S(ye.internalFormat,_e,ne,ye.colorSpace,L.isXRRenderTarget===!0),he=rt(L);t.renderbufferStorageMultisample(t.RENDERBUFFER,he,te,L.width,L.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+re,t.RENDERBUFFER,N.__webglColorRenderbuffer[re])}t.bindRenderbuffer(t.RENDERBUFFER,null),L.depthBuffer&&(N.__webglDepthRenderbuffer=t.createRenderbuffer(),Ue(N.__webglDepthRenderbuffer,L,!0)),a.bindFramebuffer(t.FRAMEBUFFER,null)}}if(W){a.bindTexture(t.TEXTURE_CUBE_MAP,q.__webglTexture),Oe(t.TEXTURE_CUBE_MAP,_);for(let re=0;re<6;re++)if(_.mipmaps&&_.mipmaps.length>0)for(let ye=0;ye<_.mipmaps.length;ye++)ve(N.__webglFramebuffer[re][ye],L,_,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+re,ye);else ve(N.__webglFramebuffer[re],L,_,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);m(_)&&h(t.TEXTURE_CUBE_MAP),a.unbindTexture()}else if(ee){for(let re=0,ye=j.length;re<ye;re++){let _e=j[re],ne=n.get(_e),te=t.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(te=L.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),a.bindTexture(te,ne.__webglTexture),Oe(te,_e),ve(N.__webglFramebuffer,L,_e,t.COLOR_ATTACHMENT0+re,te,0),m(_e)&&h(te)}a.unbindTexture()}else{let re=t.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(re=L.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),a.bindTexture(re,q.__webglTexture),Oe(re,_),_.mipmaps&&_.mipmaps.length>0)for(let ye=0;ye<_.mipmaps.length;ye++)ve(N.__webglFramebuffer[ye],L,_,t.COLOR_ATTACHMENT0,re,ye);else ve(N.__webglFramebuffer,L,_,t.COLOR_ATTACHMENT0,re,0);m(_)&&h(re),a.unbindTexture()}L.depthBuffer&&Ve(L)}function Ke(L){let _=L.textures;for(let N=0,q=_.length;N<q;N++){let j=_[N];if(m(j)){let W=x(L),ee=n.get(j).__webglTexture;a.bindTexture(W,ee),h(W),a.unbindTexture()}}}let Le=[],Ee=[];function Se(L){if(L.samples>0){if(fe(L)===!1){let _=L.textures,N=L.width,q=L.height,j=t.COLOR_BUFFER_BIT,W=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ee=n.get(L),re=_.length>1;if(re)for(let _e=0;_e<_.length;_e++)a.bindFramebuffer(t.FRAMEBUFFER,ee.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+_e,t.RENDERBUFFER,null),a.bindFramebuffer(t.FRAMEBUFFER,ee.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+_e,t.TEXTURE_2D,null,0);a.bindFramebuffer(t.READ_FRAMEBUFFER,ee.__webglMultisampledFramebuffer);let ye=L.texture.mipmaps;ye&&ye.length>0?a.bindFramebuffer(t.DRAW_FRAMEBUFFER,ee.__webglFramebuffer[0]):a.bindFramebuffer(t.DRAW_FRAMEBUFFER,ee.__webglFramebuffer);for(let _e=0;_e<_.length;_e++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(j|=t.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(j|=t.STENCIL_BUFFER_BIT)),re){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,ee.__webglColorRenderbuffer[_e]);let ne=n.get(_[_e]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,ne,0)}t.blitFramebuffer(0,0,N,q,0,0,N,q,j,t.NEAREST),l===!0&&(Le.length=0,Ee.length=0,Le.push(t.COLOR_ATTACHMENT0+_e),L.depthBuffer&&L.resolveDepthBuffer===!1&&(Le.push(W),Ee.push(W),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,Ee)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Le))}if(a.bindFramebuffer(t.READ_FRAMEBUFFER,null),a.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),re)for(let _e=0;_e<_.length;_e++){a.bindFramebuffer(t.FRAMEBUFFER,ee.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+_e,t.RENDERBUFFER,ee.__webglColorRenderbuffer[_e]);let ne=n.get(_[_e]).__webglTexture;a.bindFramebuffer(t.FRAMEBUFFER,ee.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+_e,t.TEXTURE_2D,ne,0)}a.bindFramebuffer(t.DRAW_FRAMEBUFFER,ee.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&l){let _=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[_])}}}function rt(L){return Math.min(i.maxSamples,L.samples)}function fe(L){let _=n.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function De(L){let _=r.render.frame;c.get(L)!==_&&(c.set(L,_),L.update())}function Tt(L,_){let N=L.colorSpace,q=L.format,j=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||N!==xa&&N!==Xi&&(Je.getTransfer(N)===ft?(q!==un||j!==Vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),_}function dt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(u.width=L.naturalWidth||L.width,u.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(u.width=L.displayWidth,u.height=L.displayHeight):(u.width=L.width,u.height=L.height),u}this.allocateTextureUnit=G,this.resetTextureUnits=F,this.setTexture2D=X,this.setTexture2DArray=k,this.setTexture3D=K,this.setTextureCube=O,this.rebindTextures=Ct,this.setupRenderTarget=w,this.updateRenderTargetMipmap=Ke,this.updateMultisampleRenderTarget=Se,this.setupDepthRenderbuffer=Ve,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=fe}function OD(t,e){function a(n,i=Xi){let s,r=Je.getTransfer(i);if(n===Vn)return t.UNSIGNED_BYTE;if(n===Ah)return t.UNSIGNED_SHORT_4_4_4_4;if(n===Eh)return t.UNSIGNED_SHORT_5_5_5_1;if(n===o0)return t.UNSIGNED_INT_5_9_9_9_REV;if(n===l0)return t.UNSIGNED_INT_10F_11F_11F_REV;if(n===s0)return t.BYTE;if(n===r0)return t.SHORT;if(n===ul)return t.UNSIGNED_SHORT;if(n===Lh)return t.INT;if(n===Os)return t.UNSIGNED_INT;if(n===An)return t.FLOAT;if(n===Wa)return t.HALF_FLOAT;if(n===u0)return t.ALPHA;if(n===c0)return t.RGB;if(n===un)return t.RGBA;if(n===Ko)return t.DEPTH_COMPONENT;if(n===fl)return t.DEPTH_STENCIL;if(n===wh)return t.RED;if(n===Ih)return t.RED_INTEGER;if(n===f0)return t.RG;if(n===Rh)return t.RG_INTEGER;if(n===Dh)return t.RGBA_INTEGER;if(n===Sc||n===_c||n===Mc||n===bc)if(r===ft)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Sc)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===_c)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Mc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===bc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Sc)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===_c)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Mc)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===bc)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ph||n===Uh||n===Bh||n===Nh)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Ph)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Uh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Bh)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Nh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Oh||n===Fh||n===zh)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Oh||n===Fh)return r===ft?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===zh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===kh||n===Hh||n===Vh||n===Gh||n===qh||n===Wh||n===Xh||n===Yh||n===Zh||n===Kh||n===Jh||n===Qh||n===jh||n===$h)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===kh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Hh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Vh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Gh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===qh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Wh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Xh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Yh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Zh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Kh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Jh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Qh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===jh)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===$h)return r===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ep||n===tp||n===ap)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===ep)return r===ft?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===tp)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ap)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===np||n===ip||n===sp||n===rp)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===np)return s.COMPRESSED_RED_RGTC1_EXT;if(n===ip)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===sp)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===rp)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===cl?t.UNSIGNED_INT_24_8:t[n]!==void 0?t[n]:null}return{convert:a}}var FD=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zD=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,P0=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,a){if(this.texture===null){let n=new sc(e.texture);(e.depthNear!==a.depthNear||e.depthFar!==a.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let a=e.cameras[0].viewport,n=new Jt({vertexShader:FD,fragmentShader:zD,uniforms:{depthColor:{value:this.texture},depthWidth:{value:a.z},depthHeight:{value:a.w}}});this.mesh=new pt(new Cr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},U0=class extends Fi{constructor(e,a){super();let n=this,i=null,s=1,r=null,o="local-floor",l=1,u=null,c=null,f=null,d=null,p=null,g=null,y=typeof XRWebGLBinding<"u",m=new P0,h={},x=a.getContextAttributes(),S=null,v=null,T=[],E=[],A=new Ie,R=null,M=new Zt;M.viewport=new lt;let b=new Zt;b.viewport=new lt;let I=[M,b],F=new rh,G=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let $=T[Y];return $===void 0&&($=new $o,T[Y]=$),$.getTargetRaySpace()},this.getControllerGrip=function(Y){let $=T[Y];return $===void 0&&($=new $o,T[Y]=$),$.getGripSpace()},this.getHand=function(Y){let $=T[Y];return $===void 0&&($=new $o,T[Y]=$),$.getHandSpace()};function X(Y){let $=E.indexOf(Y.inputSource);if($===-1)return;let ve=T[$];ve!==void 0&&(ve.update(Y.inputSource,Y.frame,u||r),ve.dispatchEvent({type:Y.type,data:Y.inputSource}))}function k(){i.removeEventListener("select",X),i.removeEventListener("selectstart",X),i.removeEventListener("selectend",X),i.removeEventListener("squeeze",X),i.removeEventListener("squeezestart",X),i.removeEventListener("squeezeend",X),i.removeEventListener("end",k),i.removeEventListener("inputsourceschange",K);for(let Y=0;Y<T.length;Y++){let $=E[Y];$!==null&&(E[Y]=null,T[Y].disconnect($))}G=null,z=null,m.reset();for(let Y in h)delete h[Y];e.setRenderTarget(S),p=null,d=null,f=null,i=null,v=null,at.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||r},this.setReferenceSpace=function(Y){u=Y},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return f===null&&y&&(f=new XRWebGLBinding(i,a)),f},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(S=e.getRenderTarget(),i.addEventListener("select",X),i.addEventListener("selectstart",X),i.addEventListener("selectend",X),i.addEventListener("squeeze",X),i.addEventListener("squeezestart",X),i.addEventListener("squeezeend",X),i.addEventListener("end",k),i.addEventListener("inputsourceschange",K),x.xrCompatible!==!0&&await a.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(A),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let ve=null,Ue=null,Ce=null;x.depth&&(Ce=x.stencil?a.DEPTH24_STENCIL8:a.DEPTH_COMPONENT24,ve=x.stencil?fl:Ko,Ue=x.stencil?cl:Os);let Ve={colorFormat:a.RGBA8,depthFormat:Ce,scaleFactor:s};f=this.getBinding(),d=f.createProjectionLayer(Ve),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new ca(d.textureWidth,d.textureHeight,{format:un,type:Vn,depthTexture:new ic(d.textureWidth,d.textureHeight,Ue,void 0,void 0,void 0,void 0,void 0,void 0,ve),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let ve={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(i,a,ve),i.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new ca(p.framebufferWidth,p.framebufferHeight,{format:un,type:Vn,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),u=null,r=await i.requestReferenceSpace(o),at.setContext(i),at.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function K(Y){for(let $=0;$<Y.removed.length;$++){let ve=Y.removed[$],Ue=E.indexOf(ve);Ue>=0&&(E[Ue]=null,T[Ue].disconnect(ve))}for(let $=0;$<Y.added.length;$++){let ve=Y.added[$],Ue=E.indexOf(ve);if(Ue===-1){for(let Ve=0;Ve<T.length;Ve++)if(Ve>=E.length){E.push(ve),Ue=Ve;break}else if(E[Ve]===null){E[Ve]=ve,Ue=Ve;break}if(Ue===-1)break}let Ce=T[Ue];Ce&&Ce.connect(ve)}}let O=new P,ae=new P;function ce(Y,$,ve){O.setFromMatrixPosition($.matrixWorld),ae.setFromMatrixPosition(ve.matrixWorld);let Ue=O.distanceTo(ae),Ce=$.projectionMatrix.elements,Ve=ve.projectionMatrix.elements,Ct=Ce[14]/(Ce[10]-1),w=Ce[14]/(Ce[10]+1),Ke=(Ce[9]+1)/Ce[5],Le=(Ce[9]-1)/Ce[5],Ee=(Ce[8]-1)/Ce[0],Se=(Ve[8]+1)/Ve[0],rt=Ct*Ee,fe=Ct*Se,De=Ue/(-Ee+Se),Tt=De*-Ee;if($.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Tt),Y.translateZ(De),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Ce[10]===-1)Y.projectionMatrix.copy($.projectionMatrix),Y.projectionMatrixInverse.copy($.projectionMatrixInverse);else{let dt=Ct+De,L=w+De,_=rt-Tt,N=fe+(Ue-Tt),q=Ke*w/L*dt,j=Le*w/L*dt;Y.projectionMatrix.makePerspective(_,N,q,j,dt,L),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function me(Y,$){$===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices($.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let $=Y.near,ve=Y.far;m.texture!==null&&(m.depthNear>0&&($=m.depthNear),m.depthFar>0&&(ve=m.depthFar)),F.near=b.near=M.near=$,F.far=b.far=M.far=ve,(G!==F.near||z!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),G=F.near,z=F.far),F.layers.mask=Y.layers.mask|6,M.layers.mask=F.layers.mask&3,b.layers.mask=F.layers.mask&5;let Ue=Y.parent,Ce=F.cameras;me(F,Ue);for(let Ve=0;Ve<Ce.length;Ve++)me(Ce[Ve],Ue);Ce.length===2?ce(F,M,b):F.projectionMatrix.copy(M.projectionMatrix),Oe(Y,F,Ue)};function Oe(Y,$,ve){ve===null?Y.matrix.copy($.matrixWorld):(Y.matrix.copy(ve.matrixWorld),Y.matrix.invert(),Y.matrix.multiply($.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy($.projectionMatrix),Y.projectionMatrixInverse.copy($.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=vr*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(Y){return h[Y]};let Ye=null;function Qe(Y,$){if(c=$.getViewerPose(u||r),g=$,c!==null){let ve=c.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let Ue=!1;ve.length!==F.cameras.length&&(F.cameras.length=0,Ue=!0);for(let w=0;w<ve.length;w++){let Ke=ve[w],Le=null;if(p!==null)Le=p.getViewport(Ke);else{let Se=f.getViewSubImage(d,Ke);Le=Se.viewport,w===0&&(e.setRenderTargetTextures(v,Se.colorTexture,Se.depthStencilTexture),e.setRenderTarget(v))}let Ee=I[w];Ee===void 0&&(Ee=new Zt,Ee.layers.enable(w),Ee.viewport=new lt,I[w]=Ee),Ee.matrix.fromArray(Ke.transform.matrix),Ee.matrix.decompose(Ee.position,Ee.quaternion,Ee.scale),Ee.projectionMatrix.fromArray(Ke.projectionMatrix),Ee.projectionMatrixInverse.copy(Ee.projectionMatrix).invert(),Ee.viewport.set(Le.x,Le.y,Le.width,Le.height),w===0&&(F.matrix.copy(Ee.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Ue===!0&&F.cameras.push(Ee)}let Ce=i.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&y){f=n.getBinding();let w=f.getDepthInformation(ve[0]);w&&w.isValid&&w.texture&&m.init(w,i.renderState)}if(Ce&&Ce.includes("camera-access")&&y){e.state.unbindTexture(),f=n.getBinding();for(let w=0;w<ve.length;w++){let Ke=ve[w].camera;if(Ke){let Le=h[Ke];Le||(Le=new sc,h[Ke]=Le);let Ee=f.getCameraImage(Ke);Le.sourceTexture=Ee}}}}for(let ve=0;ve<T.length;ve++){let Ue=E[ve],Ce=T[ve];Ue!==null&&Ce!==void 0&&Ce.update(Ue,$,u||r)}Ye&&Ye(Y,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),g=null}let at=new ST;at.setAnimationLoop(Qe),this.setAnimationLoop=function(Y){Ye=Y},this.dispose=function(){}}},Dr=new Va,kD=new We;function HD(t,e){function a(m,h){m.matrixAutoUpdate===!0&&m.updateMatrix(),h.value.copy(m.matrix)}function n(m,h){h.color.getRGB(m.fogColor.value,x0(t)),h.isFog?(m.fogNear.value=h.near,m.fogFar.value=h.far):h.isFogExp2&&(m.fogDensity.value=h.density)}function i(m,h,x,S,v){h.isMeshBasicMaterial||h.isMeshLambertMaterial?s(m,h):h.isMeshToonMaterial?(s(m,h),f(m,h)):h.isMeshPhongMaterial?(s(m,h),c(m,h)):h.isMeshStandardMaterial?(s(m,h),d(m,h),h.isMeshPhysicalMaterial&&p(m,h,v)):h.isMeshMatcapMaterial?(s(m,h),g(m,h)):h.isMeshDepthMaterial?s(m,h):h.isMeshDistanceMaterial?(s(m,h),y(m,h)):h.isMeshNormalMaterial?s(m,h):h.isLineBasicMaterial?(r(m,h),h.isLineDashedMaterial&&o(m,h)):h.isPointsMaterial?l(m,h,x,S):h.isSpriteMaterial?u(m,h):h.isShadowMaterial?(m.color.value.copy(h.color),m.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function s(m,h){m.opacity.value=h.opacity,h.color&&m.diffuse.value.copy(h.color),h.emissive&&m.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(m.map.value=h.map,a(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,a(h.alphaMap,m.alphaMapTransform)),h.bumpMap&&(m.bumpMap.value=h.bumpMap,a(h.bumpMap,m.bumpMapTransform),m.bumpScale.value=h.bumpScale,h.side===ya&&(m.bumpScale.value*=-1)),h.normalMap&&(m.normalMap.value=h.normalMap,a(h.normalMap,m.normalMapTransform),m.normalScale.value.copy(h.normalScale),h.side===ya&&m.normalScale.value.negate()),h.displacementMap&&(m.displacementMap.value=h.displacementMap,a(h.displacementMap,m.displacementMapTransform),m.displacementScale.value=h.displacementScale,m.displacementBias.value=h.displacementBias),h.emissiveMap&&(m.emissiveMap.value=h.emissiveMap,a(h.emissiveMap,m.emissiveMapTransform)),h.specularMap&&(m.specularMap.value=h.specularMap,a(h.specularMap,m.specularMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest);let x=e.get(h),S=x.envMap,v=x.envMapRotation;S&&(m.envMap.value=S,Dr.copy(v),Dr.x*=-1,Dr.y*=-1,Dr.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Dr.y*=-1,Dr.z*=-1),m.envMapRotation.value.setFromMatrix4(kD.makeRotationFromEuler(Dr)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=h.reflectivity,m.ior.value=h.ior,m.refractionRatio.value=h.refractionRatio),h.lightMap&&(m.lightMap.value=h.lightMap,m.lightMapIntensity.value=h.lightMapIntensity,a(h.lightMap,m.lightMapTransform)),h.aoMap&&(m.aoMap.value=h.aoMap,m.aoMapIntensity.value=h.aoMapIntensity,a(h.aoMap,m.aoMapTransform))}function r(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,h.map&&(m.map.value=h.map,a(h.map,m.mapTransform))}function o(m,h){m.dashSize.value=h.dashSize,m.totalSize.value=h.dashSize+h.gapSize,m.scale.value=h.scale}function l(m,h,x,S){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.size.value=h.size*x,m.scale.value=S*.5,h.map&&(m.map.value=h.map,a(h.map,m.uvTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,a(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function u(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.rotation.value=h.rotation,h.map&&(m.map.value=h.map,a(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,a(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function c(m,h){m.specular.value.copy(h.specular),m.shininess.value=Math.max(h.shininess,1e-4)}function f(m,h){h.gradientMap&&(m.gradientMap.value=h.gradientMap)}function d(m,h){m.metalness.value=h.metalness,h.metalnessMap&&(m.metalnessMap.value=h.metalnessMap,a(h.metalnessMap,m.metalnessMapTransform)),m.roughness.value=h.roughness,h.roughnessMap&&(m.roughnessMap.value=h.roughnessMap,a(h.roughnessMap,m.roughnessMapTransform)),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)}function p(m,h,x){m.ior.value=h.ior,h.sheen>0&&(m.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),m.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(m.sheenColorMap.value=h.sheenColorMap,a(h.sheenColorMap,m.sheenColorMapTransform)),h.sheenRoughnessMap&&(m.sheenRoughnessMap.value=h.sheenRoughnessMap,a(h.sheenRoughnessMap,m.sheenRoughnessMapTransform))),h.clearcoat>0&&(m.clearcoat.value=h.clearcoat,m.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(m.clearcoatMap.value=h.clearcoatMap,a(h.clearcoatMap,m.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,a(h.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(m.clearcoatNormalMap.value=h.clearcoatNormalMap,a(h.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===ya&&m.clearcoatNormalScale.value.negate())),h.dispersion>0&&(m.dispersion.value=h.dispersion),h.iridescence>0&&(m.iridescence.value=h.iridescence,m.iridescenceIOR.value=h.iridescenceIOR,m.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(m.iridescenceMap.value=h.iridescenceMap,a(h.iridescenceMap,m.iridescenceMapTransform)),h.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=h.iridescenceThicknessMap,a(h.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),h.transmission>0&&(m.transmission.value=h.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),h.transmissionMap&&(m.transmissionMap.value=h.transmissionMap,a(h.transmissionMap,m.transmissionMapTransform)),m.thickness.value=h.thickness,h.thicknessMap&&(m.thicknessMap.value=h.thicknessMap,a(h.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=h.attenuationDistance,m.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(m.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(m.anisotropyMap.value=h.anisotropyMap,a(h.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=h.specularIntensity,m.specularColor.value.copy(h.specularColor),h.specularColorMap&&(m.specularColorMap.value=h.specularColorMap,a(h.specularColorMap,m.specularColorMapTransform)),h.specularIntensityMap&&(m.specularIntensityMap.value=h.specularIntensityMap,a(h.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,h){h.matcap&&(m.matcap.value=h.matcap)}function y(m,h){let x=e.get(h).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function VD(t,e,a,n){let i={},s={},r=[],o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,S){let v=S.program;n.uniformBlockBinding(x,v)}function u(x,S){let v=i[x.id];v===void 0&&(g(x),v=c(x),i[x.id]=v,x.addEventListener("dispose",m));let T=S.program;n.updateUBOMapping(x,T);let E=e.render.frame;s[x.id]!==E&&(d(x),s[x.id]=E)}function c(x){let S=f();x.__bindingPointIndex=S;let v=t.createBuffer(),T=x.__size,E=x.usage;return t.bindBuffer(t.UNIFORM_BUFFER,v),t.bufferData(t.UNIFORM_BUFFER,T,E),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,S,v),v}function f(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){let S=i[x.id],v=x.uniforms,T=x.__cache;t.bindBuffer(t.UNIFORM_BUFFER,S);for(let E=0,A=v.length;E<A;E++){let R=Array.isArray(v[E])?v[E]:[v[E]];for(let M=0,b=R.length;M<b;M++){let I=R[M];if(p(I,E,M,T)===!0){let F=I.__offset,G=Array.isArray(I.value)?I.value:[I.value],z=0;for(let X=0;X<G.length;X++){let k=G[X],K=y(k);typeof k=="number"||typeof k=="boolean"?(I.__data[0]=k,t.bufferSubData(t.UNIFORM_BUFFER,F+z,I.__data)):k.isMatrix3?(I.__data[0]=k.elements[0],I.__data[1]=k.elements[1],I.__data[2]=k.elements[2],I.__data[3]=0,I.__data[4]=k.elements[3],I.__data[5]=k.elements[4],I.__data[6]=k.elements[5],I.__data[7]=0,I.__data[8]=k.elements[6],I.__data[9]=k.elements[7],I.__data[10]=k.elements[8],I.__data[11]=0):(k.toArray(I.__data,z),z+=K.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,F,I.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(x,S,v,T){let E=x.value,A=S+"_"+v;if(T[A]===void 0)return typeof E=="number"||typeof E=="boolean"?T[A]=E:T[A]=E.clone(),!0;{let R=T[A];if(typeof E=="number"||typeof E=="boolean"){if(R!==E)return T[A]=E,!0}else if(R.equals(E)===!1)return R.copy(E),!0}return!1}function g(x){let S=x.uniforms,v=0,T=16;for(let A=0,R=S.length;A<R;A++){let M=Array.isArray(S[A])?S[A]:[S[A]];for(let b=0,I=M.length;b<I;b++){let F=M[b],G=Array.isArray(F.value)?F.value:[F.value];for(let z=0,X=G.length;z<X;z++){let k=G[z],K=y(k),O=v%T,ae=O%K.boundary,ce=O+ae;v+=ae,ce!==0&&T-ce<K.storage&&(v+=T-ce),F.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=K.storage}}}let E=v%T;return E>0&&(v+=T-E),x.__size=v,x.__cache={},this}function y(x){let S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),S}function m(x){let S=x.target;S.removeEventListener("dispose",m);let v=r.indexOf(S.__bindingPointIndex);r.splice(v,1),t.deleteBuffer(i[S.id]),delete i[S.id],delete s[S.id]}function h(){for(let x in i)t.deleteBuffer(i[x]);r=[],i={},s={}}return{bind:l,update:u,dispose:h}}var fp=class{constructor(e={}){let{canvas:a=XC(),context:n=null,depth:i=!0,stencil:s=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:u=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=r;let g=new Uint32Array(4),y=new Int32Array(4),m=null,h=null,x=[],S=[];this.domElement=a,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Wi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,T=!1;this._outputColorSpace=$t;let E=0,A=0,R=null,M=-1,b=null,I=new lt,F=new lt,G=null,z=new Ae(0),X=0,k=a.width,K=a.height,O=1,ae=null,ce=null,me=new lt(0,0,k,K),Oe=new lt(0,0,k,K),Ye=!1,Qe=new nl,at=!1,Y=!1,$=new We,ve=new P,Ue=new lt,Ce={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ve=!1;function Ct(){return R===null?O:1}let w=n;function Ke(C,U){return a.getContext(C,U)}try{let C={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:u,powerPreference:c,failIfMajorPerformanceCaveat:f};if("setAttribute"in a&&a.setAttribute("data-engine",`three.js r${oh}`),a.addEventListener("webglcontextlost",ue,!1),a.addEventListener("webglcontextrestored",pe,!1),a.addEventListener("webglcontextcreationerror",se,!1),w===null){let U="webgl2";if(w=Ke(U,C),w===null)throw Ke(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let Le,Ee,Se,rt,fe,De,Tt,dt,L,_,N,q,j,W,ee,re,ye,_e,ne,te,he,de,oe,Be;function D(){Le=new r2(w),Le.init(),de=new OD(w,Le),Ee=new $R(w,Le,e,de),Se=new BD(w,Le),Ee.reversedDepthBuffer&&d&&Se.buffers.depth.setReversed(!0),rt=new u2(w),fe=new MD,De=new ND(w,Le,Se,fe,Ee,de,rt),Tt=new t2(v),dt=new s2(v),L=new mw(w),oe=new QR(w,L),_=new o2(w,L,rt,oe),N=new f2(w,_,L,rt),ne=new c2(w,Ee,De),re=new e2(fe),q=new _D(v,Tt,dt,Le,Ee,oe,re),j=new HD(v,fe),W=new CD,ee=new ID(Le),_e=new JR(v,Tt,dt,Se,N,p,l),ye=new PD(v,N,Ee),Be=new VD(w,rt,Ee,Se),te=new jR(w,Le,rt),he=new l2(w,Le,rt),rt.programs=q.programs,v.capabilities=Ee,v.extensions=Le,v.properties=fe,v.renderLists=W,v.shadowMap=ye,v.state=Se,v.info=rt}D();let ie=new U0(v,w);this.xr=ie,this.getContext=function(){return w},this.getContextAttributes=function(){return w.getContextAttributes()},this.forceContextLoss=function(){let C=Le.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){let C=Le.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(C){C!==void 0&&(O=C,this.setSize(k,K,!1))},this.getSize=function(C){return C.set(k,K)},this.setSize=function(C,U,H=!0){if(ie.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=C,K=U,a.width=Math.floor(C*O),a.height=Math.floor(U*O),H===!0&&(a.style.width=C+"px",a.style.height=U+"px"),this.setViewport(0,0,C,U)},this.getDrawingBufferSize=function(C){return C.set(k*O,K*O).floor()},this.setDrawingBufferSize=function(C,U,H){k=C,K=U,O=H,a.width=Math.floor(C*H),a.height=Math.floor(U*H),this.setViewport(0,0,C,U)},this.getCurrentViewport=function(C){return C.copy(I)},this.getViewport=function(C){return C.copy(me)},this.setViewport=function(C,U,H,V){C.isVector4?me.set(C.x,C.y,C.z,C.w):me.set(C,U,H,V),Se.viewport(I.copy(me).multiplyScalar(O).round())},this.getScissor=function(C){return C.copy(Oe)},this.setScissor=function(C,U,H,V){C.isVector4?Oe.set(C.x,C.y,C.z,C.w):Oe.set(C,U,H,V),Se.scissor(F.copy(Oe).multiplyScalar(O).round())},this.getScissorTest=function(){return Ye},this.setScissorTest=function(C){Se.setScissorTest(Ye=C)},this.setOpaqueSort=function(C){ae=C},this.setTransparentSort=function(C){ce=C},this.getClearColor=function(C){return C.copy(_e.getClearColor())},this.setClearColor=function(){_e.setClearColor(...arguments)},this.getClearAlpha=function(){return _e.getClearAlpha()},this.setClearAlpha=function(){_e.setClearAlpha(...arguments)},this.clear=function(C=!0,U=!0,H=!0){let V=0;if(C){let B=!1;if(R!==null){let le=R.texture.format;B=le===Dh||le===Rh||le===Ih}if(B){let le=R.texture.type,xe=le===Vn||le===Os||le===ul||le===cl||le===Ah||le===Eh,be=_e.getClearColor(),Me=_e.getClearAlpha(),Ne=be.r,ze=be.g,we=be.b;xe?(g[0]=Ne,g[1]=ze,g[2]=we,g[3]=Me,w.clearBufferuiv(w.COLOR,0,g)):(y[0]=Ne,y[1]=ze,y[2]=we,y[3]=Me,w.clearBufferiv(w.COLOR,0,y))}else V|=w.COLOR_BUFFER_BIT}U&&(V|=w.DEPTH_BUFFER_BIT),H&&(V|=w.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),w.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){a.removeEventListener("webglcontextlost",ue,!1),a.removeEventListener("webglcontextrestored",pe,!1),a.removeEventListener("webglcontextcreationerror",se,!1),_e.dispose(),W.dispose(),ee.dispose(),fe.dispose(),Tt.dispose(),dt.dispose(),N.dispose(),oe.dispose(),Be.dispose(),q.dispose(),ie.dispose(),ie.removeEventListener("sessionstart",Gn),ie.removeEventListener("sessionend",yy),Vs.stop()};function ue(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function pe(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let C=rt.autoReset,U=ye.enabled,H=ye.autoUpdate,V=ye.needsUpdate,B=ye.type;D(),rt.autoReset=C,ye.enabled=U,ye.autoUpdate=H,ye.needsUpdate=V,ye.type=B}function se(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Z(C){let U=C.target;U.removeEventListener("dispose",Z),Te(U)}function Te(C){ke(C),fe.remove(C)}function ke(C){let U=fe.get(C).programs;U!==void 0&&(U.forEach(function(H){q.releaseProgram(H)}),C.isShaderMaterial&&q.releaseShaderCache(C))}this.renderBufferDirect=function(C,U,H,V,B,le){U===null&&(U=Ce);let xe=B.isMesh&&B.matrixWorld.determinant()<0,be=dL(C,U,H,V,B);Se.setMaterial(V,xe);let Me=H.index,Ne=1;if(V.wireframe===!0){if(Me=_.getWireframeAttribute(H),Me===void 0)return;Ne=2}let ze=H.drawRange,we=H.attributes.position,nt=ze.start*Ne,yt=(ze.start+ze.count)*Ne;le!==null&&(nt=Math.max(nt,le.start*Ne),yt=Math.min(yt,(le.start+le.count)*Ne)),Me!==null?(nt=Math.max(nt,0),yt=Math.min(yt,Me.count)):we!=null&&(nt=Math.max(nt,0),yt=Math.min(yt,we.count));let Ft=yt-nt;if(Ft<0||Ft===1/0)return;oe.setup(B,V,be,H,Me);let wt,_t=te;if(Me!==null&&(wt=L.get(Me),_t=he,_t.setIndex(wt)),B.isMesh)V.wireframe===!0?(Se.setLineWidth(V.wireframeLinewidth*Ct()),_t.setMode(w.LINES)):_t.setMode(w.TRIANGLES);else if(B.isLine){let Pe=V.linewidth;Pe===void 0&&(Pe=1),Se.setLineWidth(Pe*Ct()),B.isLineSegments?_t.setMode(w.LINES):B.isLineLoop?_t.setMode(w.LINE_LOOP):_t.setMode(w.LINE_STRIP)}else B.isPoints?_t.setMode(w.POINTS):B.isSprite&&_t.setMode(w.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Qo("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),_t.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Le.get("WEBGL_multi_draw"))_t.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{let Pe=B._multiDrawStarts,Nt=B._multiDrawCounts,ot=B._multiDrawCount,Ya=Me?L.get(Me).bytesPerElement:1,Or=fe.get(V).currentProgram.getUniforms();for(let Za=0;Za<ot;Za++)Or.setValue(w,"_gl_DrawID",Za),_t.render(Pe[Za]/Ya,Nt[Za])}else if(B.isInstancedMesh)_t.renderInstances(nt,Ft,B.count);else if(H.isInstancedBufferGeometry){let Pe=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,Nt=Math.min(H.instanceCount,Pe);_t.renderInstances(nt,Ft,Nt)}else _t.render(nt,Ft)};function Lt(C,U,H){C.transparent===!0&&C.side===Ln&&C.forceSinglePass===!1?(C.side=ya,C.needsUpdate=!0,Fc(C,U,H),C.side=zn,C.needsUpdate=!0,Fc(C,U,H),C.side=Ln):Fc(C,U,H)}this.compile=function(C,U,H=null){H===null&&(H=C),h=ee.get(H),h.init(U),S.push(h),H.traverseVisible(function(B){B.isLight&&B.layers.test(U.layers)&&(h.pushLight(B),B.castShadow&&h.pushShadow(B))}),C!==H&&C.traverseVisible(function(B){B.isLight&&B.layers.test(U.layers)&&(h.pushLight(B),B.castShadow&&h.pushShadow(B))}),h.setupLights();let V=new Set;return C.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;let le=B.material;if(le)if(Array.isArray(le))for(let xe=0;xe<le.length;xe++){let be=le[xe];Lt(be,H,B),V.add(be)}else Lt(le,H,B),V.add(le)}),h=S.pop(),V},this.compileAsync=function(C,U,H=null){let V=this.compile(C,U,H);return new Promise(B=>{function le(){if(V.forEach(function(xe){fe.get(xe).currentProgram.isReady()&&V.delete(xe)}),V.size===0){B(C);return}setTimeout(le,10)}Le.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let ht=null;function ui(C){ht&&ht(C)}function Gn(){Vs.stop()}function yy(){Vs.start()}let Vs=new ST;Vs.setAnimationLoop(ui),typeof self<"u"&&Vs.setContext(self),this.setAnimationLoop=function(C){ht=C,ie.setAnimationLoop(C),C===null?Vs.stop():Vs.start()},ie.addEventListener("sessionstart",Gn),ie.addEventListener("sessionend",yy),this.render=function(C,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ie.enabled===!0&&ie.isPresenting===!0&&(ie.cameraAutoUpdate===!0&&ie.updateCamera(U),U=ie.getCamera()),C.isScene===!0&&C.onBeforeRender(v,C,U,R),h=ee.get(C,S.length),h.init(U),S.push(h),$.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Qe.setFromProjectionMatrix($,Nn,U.reversedDepth),Y=this.localClippingEnabled,at=re.init(this.clippingPlanes,Y),m=W.get(C,x.length),m.init(),x.push(m),ie.enabled===!0&&ie.isPresenting===!0){let le=v.xr.getDepthSensingMesh();le!==null&&Ep(le,U,-1/0,v.sortObjects)}Ep(C,U,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(ae,ce),Ve=ie.enabled===!1||ie.isPresenting===!1||ie.hasDepthSensing()===!1,Ve&&_e.addToRenderList(m,C),this.info.render.frame++,at===!0&&re.beginShadows();let H=h.state.shadowsArray;ye.render(H,C,U),at===!0&&re.endShadows(),this.info.autoReset===!0&&this.info.reset();let V=m.opaque,B=m.transmissive;if(h.setupLights(),U.isArrayCamera){let le=U.cameras;if(B.length>0)for(let xe=0,be=le.length;xe<be;xe++){let Me=le[xe];Sy(V,B,C,Me)}Ve&&_e.render(C);for(let xe=0,be=le.length;xe<be;xe++){let Me=le[xe];vy(m,C,Me,Me.viewport)}}else B.length>0&&Sy(V,B,C,U),Ve&&_e.render(C),vy(m,C,U);R!==null&&A===0&&(De.updateMultisampleRenderTarget(R),De.updateRenderTargetMipmap(R)),C.isScene===!0&&C.onAfterRender(v,C,U),oe.resetDefaultState(),M=-1,b=null,S.pop(),S.length>0?(h=S[S.length-1],at===!0&&re.setGlobalState(v.clippingPlanes,h.state.camera)):h=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Ep(C,U,H,V){if(C.visible===!1)return;if(C.layers.test(U.layers)){if(C.isGroup)H=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(U);else if(C.isLight)h.pushLight(C),C.castShadow&&h.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Qe.intersectsSprite(C)){V&&Ue.setFromMatrixPosition(C.matrixWorld).applyMatrix4($);let xe=N.update(C),be=C.material;be.visible&&m.push(C,xe,be,H,Ue.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Qe.intersectsObject(C))){let xe=N.update(C),be=C.material;if(V&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Ue.copy(C.boundingSphere.center)):(xe.boundingSphere===null&&xe.computeBoundingSphere(),Ue.copy(xe.boundingSphere.center)),Ue.applyMatrix4(C.matrixWorld).applyMatrix4($)),Array.isArray(be)){let Me=xe.groups;for(let Ne=0,ze=Me.length;Ne<ze;Ne++){let we=Me[Ne],nt=be[we.materialIndex];nt&&nt.visible&&m.push(C,xe,nt,H,Ue.z,we)}}else be.visible&&m.push(C,xe,be,H,Ue.z,null)}}let le=C.children;for(let xe=0,be=le.length;xe<be;xe++)Ep(le[xe],U,H,V)}function vy(C,U,H,V){let B=C.opaque,le=C.transmissive,xe=C.transparent;h.setupLightsView(H),at===!0&&re.setGlobalState(v.clippingPlanes,H),V&&Se.viewport(I.copy(V)),B.length>0&&Oc(B,U,H),le.length>0&&Oc(le,U,H),xe.length>0&&Oc(xe,U,H),Se.buffers.depth.setTest(!0),Se.buffers.depth.setMask(!0),Se.buffers.color.setMask(!0),Se.setPolygonOffset(!1)}function Sy(C,U,H,V){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;h.state.transmissionRenderTarget[V.id]===void 0&&(h.state.transmissionRenderTarget[V.id]=new ca(1,1,{generateMipmaps:!0,type:Le.has("EXT_color_buffer_half_float")||Le.has("EXT_color_buffer_float")?Wa:Vn,minFilter:Hn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));let le=h.state.transmissionRenderTarget[V.id],xe=V.viewport||I;le.setSize(xe.z*v.transmissionResolutionScale,xe.w*v.transmissionResolutionScale);let be=v.getRenderTarget(),Me=v.getActiveCubeFace(),Ne=v.getActiveMipmapLevel();v.setRenderTarget(le),v.getClearColor(z),X=v.getClearAlpha(),X<1&&v.setClearColor(16777215,.5),v.clear(),Ve&&_e.render(H);let ze=v.toneMapping;v.toneMapping=Wi;let we=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),h.setupLightsView(V),at===!0&&re.setGlobalState(v.clippingPlanes,V),Oc(C,H,V),De.updateMultisampleRenderTarget(le),De.updateRenderTargetMipmap(le),Le.has("WEBGL_multisampled_render_to_texture")===!1){let nt=!1;for(let yt=0,Ft=U.length;yt<Ft;yt++){let wt=U[yt],_t=wt.object,Pe=wt.geometry,Nt=wt.material,ot=wt.group;if(Nt.side===Ln&&_t.layers.test(V.layers)){let Ya=Nt.side;Nt.side=ya,Nt.needsUpdate=!0,_y(_t,H,V,Pe,Nt,ot),Nt.side=Ya,Nt.needsUpdate=!0,nt=!0}}nt===!0&&(De.updateMultisampleRenderTarget(le),De.updateRenderTargetMipmap(le))}v.setRenderTarget(be,Me,Ne),v.setClearColor(z,X),we!==void 0&&(V.viewport=we),v.toneMapping=ze}function Oc(C,U,H){let V=U.isScene===!0?U.overrideMaterial:null;for(let B=0,le=C.length;B<le;B++){let xe=C[B],be=xe.object,Me=xe.geometry,Ne=xe.group,ze=xe.material;ze.allowOverride===!0&&V!==null&&(ze=V),be.layers.test(H.layers)&&_y(be,U,H,Me,ze,Ne)}}function _y(C,U,H,V,B,le){C.onBeforeRender(v,U,H,V,B,le),C.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),B.onBeforeRender(v,U,H,V,C,le),B.transparent===!0&&B.side===Ln&&B.forceSinglePass===!1?(B.side=ya,B.needsUpdate=!0,v.renderBufferDirect(H,U,V,B,C,le),B.side=zn,B.needsUpdate=!0,v.renderBufferDirect(H,U,V,B,C,le),B.side=Ln):v.renderBufferDirect(H,U,V,B,C,le),C.onAfterRender(v,U,H,V,B,le)}function Fc(C,U,H){U.isScene!==!0&&(U=Ce);let V=fe.get(C),B=h.state.lights,le=h.state.shadowsArray,xe=B.state.version,be=q.getParameters(C,B.state,le,U,H),Me=q.getProgramCacheKey(be),Ne=V.programs;V.environment=C.isMeshStandardMaterial?U.environment:null,V.fog=U.fog,V.envMap=(C.isMeshStandardMaterial?dt:Tt).get(C.envMap||V.environment),V.envMapRotation=V.environment!==null&&C.envMap===null?U.environmentRotation:C.envMapRotation,Ne===void 0&&(C.addEventListener("dispose",Z),Ne=new Map,V.programs=Ne);let ze=Ne.get(Me);if(ze!==void 0){if(V.currentProgram===ze&&V.lightsStateVersion===xe)return by(C,be),ze}else be.uniforms=q.getUniforms(C),C.onBeforeCompile(be,v),ze=q.acquireProgram(be,Me),Ne.set(Me,ze),V.uniforms=be.uniforms;let we=V.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(we.clippingPlanes=re.uniform),by(C,be),V.needsLights=pL(C),V.lightsStateVersion=xe,V.needsLights&&(we.ambientLightColor.value=B.state.ambient,we.lightProbe.value=B.state.probe,we.directionalLights.value=B.state.directional,we.directionalLightShadows.value=B.state.directionalShadow,we.spotLights.value=B.state.spot,we.spotLightShadows.value=B.state.spotShadow,we.rectAreaLights.value=B.state.rectArea,we.ltc_1.value=B.state.rectAreaLTC1,we.ltc_2.value=B.state.rectAreaLTC2,we.pointLights.value=B.state.point,we.pointLightShadows.value=B.state.pointShadow,we.hemisphereLights.value=B.state.hemi,we.directionalShadowMap.value=B.state.directionalShadowMap,we.directionalShadowMatrix.value=B.state.directionalShadowMatrix,we.spotShadowMap.value=B.state.spotShadowMap,we.spotLightMatrix.value=B.state.spotLightMatrix,we.spotLightMap.value=B.state.spotLightMap,we.pointShadowMap.value=B.state.pointShadowMap,we.pointShadowMatrix.value=B.state.pointShadowMatrix),V.currentProgram=ze,V.uniformsList=null,ze}function My(C){if(C.uniformsList===null){let U=C.currentProgram.getUniforms();C.uniformsList=ml.seqWithValue(U.seq,C.uniforms)}return C.uniformsList}function by(C,U){let H=fe.get(C);H.outputColorSpace=U.outputColorSpace,H.batching=U.batching,H.batchingColor=U.batchingColor,H.instancing=U.instancing,H.instancingColor=U.instancingColor,H.instancingMorph=U.instancingMorph,H.skinning=U.skinning,H.morphTargets=U.morphTargets,H.morphNormals=U.morphNormals,H.morphColors=U.morphColors,H.morphTargetsCount=U.morphTargetsCount,H.numClippingPlanes=U.numClippingPlanes,H.numIntersection=U.numClipIntersection,H.vertexAlphas=U.vertexAlphas,H.vertexTangents=U.vertexTangents,H.toneMapping=U.toneMapping}function dL(C,U,H,V,B){U.isScene!==!0&&(U=Ce),De.resetTextureUnits();let le=U.fog,xe=V.isMeshStandardMaterial?U.environment:null,be=R===null?v.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:xa,Me=(V.isMeshStandardMaterial?dt:Tt).get(V.envMap||xe),Ne=V.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,ze=!!H.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),we=!!H.morphAttributes.position,nt=!!H.morphAttributes.normal,yt=!!H.morphAttributes.color,Ft=Wi;V.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Ft=v.toneMapping);let wt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,_t=wt!==void 0?wt.length:0,Pe=fe.get(V),Nt=h.state.lights;if(at===!0&&(Y===!0||C!==b)){let Ta=C===b&&V.id===M;re.setState(V,C,Ta)}let ot=!1;V.version===Pe.__version?(Pe.needsLights&&Pe.lightsStateVersion!==Nt.state.version||Pe.outputColorSpace!==be||B.isBatchedMesh&&Pe.batching===!1||!B.isBatchedMesh&&Pe.batching===!0||B.isBatchedMesh&&Pe.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Pe.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Pe.instancing===!1||!B.isInstancedMesh&&Pe.instancing===!0||B.isSkinnedMesh&&Pe.skinning===!1||!B.isSkinnedMesh&&Pe.skinning===!0||B.isInstancedMesh&&Pe.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Pe.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Pe.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Pe.instancingMorph===!1&&B.morphTexture!==null||Pe.envMap!==Me||V.fog===!0&&Pe.fog!==le||Pe.numClippingPlanes!==void 0&&(Pe.numClippingPlanes!==re.numPlanes||Pe.numIntersection!==re.numIntersection)||Pe.vertexAlphas!==Ne||Pe.vertexTangents!==ze||Pe.morphTargets!==we||Pe.morphNormals!==nt||Pe.morphColors!==yt||Pe.toneMapping!==Ft||Pe.morphTargetsCount!==_t)&&(ot=!0):(ot=!0,Pe.__version=V.version);let Ya=Pe.currentProgram;ot===!0&&(Ya=Fc(V,U,B));let Or=!1,Za=!1,Tl=!1,Ot=Ya.getUniforms(),fn=Pe.uniforms;if(Se.useProgram(Ya.program)&&(Or=!0,Za=!0,Tl=!0),V.id!==M&&(M=V.id,Za=!0),Or||b!==C){Se.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Ot.setValue(w,"projectionMatrix",C.projectionMatrix),Ot.setValue(w,"viewMatrix",C.matrixWorldInverse);let Da=Ot.map.cameraPosition;Da!==void 0&&Da.setValue(w,ve.setFromMatrixPosition(C.matrixWorld)),Ee.logarithmicDepthBuffer&&Ot.setValue(w,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Ot.setValue(w,"isOrthographic",C.isOrthographicCamera===!0),b!==C&&(b=C,Za=!0,Tl=!0)}if(B.isSkinnedMesh){Ot.setOptional(w,B,"bindMatrix"),Ot.setOptional(w,B,"bindMatrixInverse");let Ta=B.skeleton;Ta&&(Ta.boneTexture===null&&Ta.computeBoneTexture(),Ot.setValue(w,"boneTexture",Ta.boneTexture,De))}B.isBatchedMesh&&(Ot.setOptional(w,B,"batchingTexture"),Ot.setValue(w,"batchingTexture",B._matricesTexture,De),Ot.setOptional(w,B,"batchingIdTexture"),Ot.setValue(w,"batchingIdTexture",B._indirectTexture,De),Ot.setOptional(w,B,"batchingColorTexture"),B._colorsTexture!==null&&Ot.setValue(w,"batchingColorTexture",B._colorsTexture,De));let dn=H.morphAttributes;if((dn.position!==void 0||dn.normal!==void 0||dn.color!==void 0)&&ne.update(B,H,Ya),(Za||Pe.receiveShadow!==B.receiveShadow)&&(Pe.receiveShadow=B.receiveShadow,Ot.setValue(w,"receiveShadow",B.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(fn.envMap.value=Me,fn.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&U.environment!==null&&(fn.envMapIntensity.value=U.environmentIntensity),Za&&(Ot.setValue(w,"toneMappingExposure",v.toneMappingExposure),Pe.needsLights&&hL(fn,Tl),le&&V.fog===!0&&j.refreshFogUniforms(fn,le),j.refreshMaterialUniforms(fn,V,O,K,h.state.transmissionRenderTarget[C.id]),ml.upload(w,My(Pe),fn,De)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(ml.upload(w,My(Pe),fn,De),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Ot.setValue(w,"center",B.center),Ot.setValue(w,"modelViewMatrix",B.modelViewMatrix),Ot.setValue(w,"normalMatrix",B.normalMatrix),Ot.setValue(w,"modelMatrix",B.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){let Ta=V.uniformsGroups;for(let Da=0,wp=Ta.length;Da<wp;Da++){let Gs=Ta[Da];Be.update(Gs,Ya),Be.bind(Gs,Ya)}}return Ya}function hL(C,U){C.ambientLightColor.needsUpdate=U,C.lightProbe.needsUpdate=U,C.directionalLights.needsUpdate=U,C.directionalLightShadows.needsUpdate=U,C.pointLights.needsUpdate=U,C.pointLightShadows.needsUpdate=U,C.spotLights.needsUpdate=U,C.spotLightShadows.needsUpdate=U,C.rectAreaLights.needsUpdate=U,C.hemisphereLights.needsUpdate=U}function pL(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(C,U,H){let V=fe.get(C);V.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),fe.get(C.texture).__webglTexture=U,fe.get(C.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:H,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,U){let H=fe.get(C);H.__webglFramebuffer=U,H.__useDefaultFramebuffer=U===void 0};let mL=w.createFramebuffer();this.setRenderTarget=function(C,U=0,H=0){R=C,E=U,A=H;let V=!0,B=null,le=!1,xe=!1;if(C){let Me=fe.get(C);if(Me.__useDefaultFramebuffer!==void 0)Se.bindFramebuffer(w.FRAMEBUFFER,null),V=!1;else if(Me.__webglFramebuffer===void 0)De.setupRenderTarget(C);else if(Me.__hasExternalTextures)De.rebindTextures(C,fe.get(C.texture).__webglTexture,fe.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){let we=C.depthTexture;if(Me.__boundDepthTexture!==we){if(we!==null&&fe.has(we)&&(C.width!==we.image.width||C.height!==we.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");De.setupDepthRenderbuffer(C)}}let Ne=C.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(xe=!0);let ze=fe.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(ze[U])?B=ze[U][H]:B=ze[U],le=!0):C.samples>0&&De.useMultisampledRTT(C)===!1?B=fe.get(C).__webglMultisampledFramebuffer:Array.isArray(ze)?B=ze[H]:B=ze,I.copy(C.viewport),F.copy(C.scissor),G=C.scissorTest}else I.copy(me).multiplyScalar(O).floor(),F.copy(Oe).multiplyScalar(O).floor(),G=Ye;if(H!==0&&(B=mL),Se.bindFramebuffer(w.FRAMEBUFFER,B)&&V&&Se.drawBuffers(C,B),Se.viewport(I),Se.scissor(F),Se.setScissorTest(G),le){let Me=fe.get(C.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_CUBE_MAP_POSITIVE_X+U,Me.__webglTexture,H)}else if(xe){let Me=U;for(let Ne=0;Ne<C.textures.length;Ne++){let ze=fe.get(C.textures[Ne]);w.framebufferTextureLayer(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0+Ne,ze.__webglTexture,H,Me)}}else if(C!==null&&H!==0){let Me=fe.get(C.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,Me.__webglTexture,H)}M=-1},this.readRenderTargetPixels=function(C,U,H,V,B,le,xe,be=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=fe.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&xe!==void 0&&(Me=Me[xe]),Me){Se.bindFramebuffer(w.FRAMEBUFFER,Me);try{let Ne=C.textures[be],ze=Ne.format,we=Ne.type;if(!Ee.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ee.textureTypeReadable(we)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=C.width-V&&H>=0&&H<=C.height-B&&(C.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+be),w.readPixels(U,H,V,B,de.convert(ze),de.convert(we),le))}finally{let Ne=R!==null?fe.get(R).__webglFramebuffer:null;Se.bindFramebuffer(w.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(C,U,H,V,B,le,xe,be=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=fe.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&xe!==void 0&&(Me=Me[xe]),Me)if(U>=0&&U<=C.width-V&&H>=0&&H<=C.height-B){Se.bindFramebuffer(w.FRAMEBUFFER,Me);let Ne=C.textures[be],ze=Ne.format,we=Ne.type;if(!Ee.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ee.textureTypeReadable(we))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let nt=w.createBuffer();w.bindBuffer(w.PIXEL_PACK_BUFFER,nt),w.bufferData(w.PIXEL_PACK_BUFFER,le.byteLength,w.STREAM_READ),C.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+be),w.readPixels(U,H,V,B,de.convert(ze),de.convert(we),0);let yt=R!==null?fe.get(R).__webglFramebuffer:null;Se.bindFramebuffer(w.FRAMEBUFFER,yt);let Ft=w.fenceSync(w.SYNC_GPU_COMMANDS_COMPLETE,0);return w.flush(),await YC(w,Ft,4),w.bindBuffer(w.PIXEL_PACK_BUFFER,nt),w.getBufferSubData(w.PIXEL_PACK_BUFFER,0,le),w.deleteBuffer(nt),w.deleteSync(Ft),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,U=null,H=0){let V=Math.pow(2,-H),B=Math.floor(C.image.width*V),le=Math.floor(C.image.height*V),xe=U!==null?U.x:0,be=U!==null?U.y:0;De.setTexture2D(C,0),w.copyTexSubImage2D(w.TEXTURE_2D,H,0,0,xe,be,B,le),Se.unbindTexture()};let gL=w.createFramebuffer(),xL=w.createFramebuffer();this.copyTextureToTexture=function(C,U,H=null,V=null,B=0,le=null){le===null&&(B!==0?(Qo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),le=B,B=0):le=0);let xe,be,Me,Ne,ze,we,nt,yt,Ft,wt=C.isCompressedTexture?C.mipmaps[le]:C.image;if(H!==null)xe=H.max.x-H.min.x,be=H.max.y-H.min.y,Me=H.isBox3?H.max.z-H.min.z:1,Ne=H.min.x,ze=H.min.y,we=H.isBox3?H.min.z:0;else{let dn=Math.pow(2,-B);xe=Math.floor(wt.width*dn),be=Math.floor(wt.height*dn),C.isDataArrayTexture?Me=wt.depth:C.isData3DTexture?Me=Math.floor(wt.depth*dn):Me=1,Ne=0,ze=0,we=0}V!==null?(nt=V.x,yt=V.y,Ft=V.z):(nt=0,yt=0,Ft=0);let _t=de.convert(U.format),Pe=de.convert(U.type),Nt;U.isData3DTexture?(De.setTexture3D(U,0),Nt=w.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(De.setTexture2DArray(U,0),Nt=w.TEXTURE_2D_ARRAY):(De.setTexture2D(U,0),Nt=w.TEXTURE_2D),w.pixelStorei(w.UNPACK_FLIP_Y_WEBGL,U.flipY),w.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),w.pixelStorei(w.UNPACK_ALIGNMENT,U.unpackAlignment);let ot=w.getParameter(w.UNPACK_ROW_LENGTH),Ya=w.getParameter(w.UNPACK_IMAGE_HEIGHT),Or=w.getParameter(w.UNPACK_SKIP_PIXELS),Za=w.getParameter(w.UNPACK_SKIP_ROWS),Tl=w.getParameter(w.UNPACK_SKIP_IMAGES);w.pixelStorei(w.UNPACK_ROW_LENGTH,wt.width),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,wt.height),w.pixelStorei(w.UNPACK_SKIP_PIXELS,Ne),w.pixelStorei(w.UNPACK_SKIP_ROWS,ze),w.pixelStorei(w.UNPACK_SKIP_IMAGES,we);let Ot=C.isDataArrayTexture||C.isData3DTexture,fn=U.isDataArrayTexture||U.isData3DTexture;if(C.isDepthTexture){let dn=fe.get(C),Ta=fe.get(U),Da=fe.get(dn.__renderTarget),wp=fe.get(Ta.__renderTarget);Se.bindFramebuffer(w.READ_FRAMEBUFFER,Da.__webglFramebuffer),Se.bindFramebuffer(w.DRAW_FRAMEBUFFER,wp.__webglFramebuffer);for(let Gs=0;Gs<Me;Gs++)Ot&&(w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,fe.get(C).__webglTexture,B,we+Gs),w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,fe.get(U).__webglTexture,le,Ft+Gs)),w.blitFramebuffer(Ne,ze,xe,be,nt,yt,xe,be,w.DEPTH_BUFFER_BIT,w.NEAREST);Se.bindFramebuffer(w.READ_FRAMEBUFFER,null),Se.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else if(B!==0||C.isRenderTargetTexture||fe.has(C)){let dn=fe.get(C),Ta=fe.get(U);Se.bindFramebuffer(w.READ_FRAMEBUFFER,gL),Se.bindFramebuffer(w.DRAW_FRAMEBUFFER,xL);for(let Da=0;Da<Me;Da++)Ot?w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,dn.__webglTexture,B,we+Da):w.framebufferTexture2D(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,dn.__webglTexture,B),fn?w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,Ta.__webglTexture,le,Ft+Da):w.framebufferTexture2D(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,Ta.__webglTexture,le),B!==0?w.blitFramebuffer(Ne,ze,xe,be,nt,yt,xe,be,w.COLOR_BUFFER_BIT,w.NEAREST):fn?w.copyTexSubImage3D(Nt,le,nt,yt,Ft+Da,Ne,ze,xe,be):w.copyTexSubImage2D(Nt,le,nt,yt,Ne,ze,xe,be);Se.bindFramebuffer(w.READ_FRAMEBUFFER,null),Se.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else fn?C.isDataTexture||C.isData3DTexture?w.texSubImage3D(Nt,le,nt,yt,Ft,xe,be,Me,_t,Pe,wt.data):U.isCompressedArrayTexture?w.compressedTexSubImage3D(Nt,le,nt,yt,Ft,xe,be,Me,_t,wt.data):w.texSubImage3D(Nt,le,nt,yt,Ft,xe,be,Me,_t,Pe,wt):C.isDataTexture?w.texSubImage2D(w.TEXTURE_2D,le,nt,yt,xe,be,_t,Pe,wt.data):C.isCompressedTexture?w.compressedTexSubImage2D(w.TEXTURE_2D,le,nt,yt,wt.width,wt.height,_t,wt.data):w.texSubImage2D(w.TEXTURE_2D,le,nt,yt,xe,be,_t,Pe,wt);w.pixelStorei(w.UNPACK_ROW_LENGTH,ot),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,Ya),w.pixelStorei(w.UNPACK_SKIP_PIXELS,Or),w.pixelStorei(w.UNPACK_SKIP_ROWS,Za),w.pixelStorei(w.UNPACK_SKIP_IMAGES,Tl),le===0&&U.generateMipmaps&&w.generateMipmap(Nt),Se.unbindTexture()},this.initRenderTarget=function(C){fe.get(C).__webglFramebuffer===void 0&&De.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?De.setTextureCube(C,0):C.isData3DTexture?De.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?De.setTexture2DArray(C,0):De.setTexture2D(C,0),Se.unbindTexture()},this.resetState=function(){E=0,A=0,R=null,Se.reset(),oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Nn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let a=this.getContext();a.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),a.unpackColorSpace=Je._getUnpackColorSpace()}};function N0(t,e){if(e===d0)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),t;if(e===dl||e===Cc){let a=t.getIndex();if(a===null){let r=[],o=t.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)r.push(l);t.setIndex(r),a=t.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),t}let n=a.count-2,i=[];if(e===dl)for(let r=1;r<=n;r++)i.push(a.getX(0)),i.push(a.getX(r)),i.push(a.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(i.push(a.getX(r)),i.push(a.getX(r+1)),i.push(a.getX(r+2))):(i.push(a.getX(r+2)),i.push(a.getX(r+1)),i.push(a.getX(r)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let s=t.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),t}var hp=class extends si{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(a){return new G0(a)}),this.register(function(a){return new q0(a)}),this.register(function(a){return new $0(a)}),this.register(function(a){return new ey(a)}),this.register(function(a){return new ty(a)}),this.register(function(a){return new X0(a)}),this.register(function(a){return new Y0(a)}),this.register(function(a){return new Z0(a)}),this.register(function(a){return new K0(a)}),this.register(function(a){return new V0(a)}),this.register(function(a){return new J0(a)}),this.register(function(a){return new W0(a)}),this.register(function(a){return new j0(a)}),this.register(function(a){return new Q0(a)}),this.register(function(a){return new k0(a)}),this.register(function(a){return new ay(a)}),this.register(function(a){return new ny(a)})}load(e,a,n,i){let s=this,r;if(this.resourcePath!=="")r=this.resourcePath;else if(this.path!==""){let u=qi.extractUrlBase(e);r=qi.resolveURL(u,this.path)}else r=qi.extractUrlBase(e);this.manager.itemStart(e);let o=function(u){i?i(u):console.error(u),s.manager.itemError(e),s.manager.itemEnd(e)},l=new rl(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(u){try{s.parse(u,r,function(c){a(c),s.manager.itemEnd(e)},o)}catch(c){o(c)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,a,n,i){let s,r={},o={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===IT){try{r[tt.KHR_BINARY_GLTF]=new iy(e)}catch(f){i&&i(f);return}s=JSON.parse(r[tt.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let u=new fy(s,{path:a||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});u.fileLoader.setRequestHeader(this.requestHeader);for(let c=0;c<this.pluginCallbacks.length;c++){let f=this.pluginCallbacks[c](u);f.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[f.name]=f,r[f.name]=!0}if(s.extensionsUsed)for(let c=0;c<s.extensionsUsed.length;++c){let f=s.extensionsUsed[c],d=s.extensionsRequired||[];switch(f){case tt.KHR_MATERIALS_UNLIT:r[f]=new H0;break;case tt.KHR_DRACO_MESH_COMPRESSION:r[f]=new sy(s,this.dracoLoader);break;case tt.KHR_TEXTURE_TRANSFORM:r[f]=new ry;break;case tt.KHR_MESH_QUANTIZATION:r[f]=new oy;break;default:d.indexOf(f)>=0&&o[f]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+f+'".')}}u.setExtensions(r),u.setPlugins(o),u.parse(n,i)}parseAsync(e,a){let n=this;return new Promise(function(i,s){n.parse(e,a,i,s)})}};function GD(){let t={};return{get:function(e){return t[e]},add:function(e,a){t[e]=a},remove:function(e){delete t[e]},removeAll:function(){t={}}}}var tt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},k0=class{constructor(e){this.parser=e,this.name=tt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,a=this.parser.json.nodes||[];for(let n=0,i=a.length;n<i;n++){let s=a[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let a=this.parser,n="light:"+e,i=a.cache.get(n);if(i)return i;let s=a.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],u,c=new Ae(16777215);l.color!==void 0&&c.setRGB(l.color[0],l.color[1],l.color[2],xa);let f=l.range!==void 0?l.range:0;switch(l.type){case"directional":u=new Gi(c),u.target.position.set(0,0,-1),u.add(u.target);break;case"point":u=new Lr(c),u.distance=f;break;case"spot":u=new mc(c),u.distance=f,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,u.angle=l.spot.outerConeAngle,u.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,u.target.position.set(0,0,-1),u.add(u.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return u.position.set(0,0,0),li(u,l),l.intensity!==void 0&&(u.intensity=l.intensity),u.name=a.createUniqueName(l.name||"light_"+e),i=Promise.resolve(u),a.cache.add(n,i),i}getDependency(e,a){if(e==="light")return this._loadLight(a)}createNodeAttachment(e){let a=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(a.cache,o,l)})}},H0=class{constructor(){this.name=tt.KHR_MATERIALS_UNLIT}getMaterialType(){return Ra}extendParams(e,a,n){let i=[];e.color=new Ae(1,1,1),e.opacity=1;let s=a.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let r=s.baseColorFactor;e.color.setRGB(r[0],r[1],r[2],xa),e.opacity=r[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,$t))}return Promise.all(i)}},V0=class{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,a){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=i.extensions[this.name].emissiveStrength;return s!==void 0&&(a.emissiveIntensity=s),Promise.resolve()}},G0=class{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ga}extendMaterialParams(e,a){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],r=i.extensions[this.name];if(r.clearcoatFactor!==void 0&&(a.clearcoat=r.clearcoatFactor),r.clearcoatTexture!==void 0&&s.push(n.assignTexture(a,"clearcoatMap",r.clearcoatTexture)),r.clearcoatRoughnessFactor!==void 0&&(a.clearcoatRoughness=r.clearcoatRoughnessFactor),r.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(a,"clearcoatRoughnessMap",r.clearcoatRoughnessTexture)),r.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(a,"clearcoatNormalMap",r.clearcoatNormalTexture)),r.clearcoatNormalTexture.scale!==void 0)){let o=r.clearcoatNormalTexture.scale;a.clearcoatNormalScale=new Ie(o,o)}return Promise.all(s)}},q0=class{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_DISPERSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ga}extendMaterialParams(e,a){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=i.extensions[this.name];return a.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}},W0=class{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ga}extendMaterialParams(e,a){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],r=i.extensions[this.name];return r.iridescenceFactor!==void 0&&(a.iridescence=r.iridescenceFactor),r.iridescenceTexture!==void 0&&s.push(n.assignTexture(a,"iridescenceMap",r.iridescenceTexture)),r.iridescenceIor!==void 0&&(a.iridescenceIOR=r.iridescenceIor),a.iridescenceThicknessRange===void 0&&(a.iridescenceThicknessRange=[100,400]),r.iridescenceThicknessMinimum!==void 0&&(a.iridescenceThicknessRange[0]=r.iridescenceThicknessMinimum),r.iridescenceThicknessMaximum!==void 0&&(a.iridescenceThicknessRange[1]=r.iridescenceThicknessMaximum),r.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(a,"iridescenceThicknessMap",r.iridescenceThicknessTexture)),Promise.all(s)}},X0=class{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_SHEEN}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ga}extendMaterialParams(e,a){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[];a.sheenColor=new Ae(0,0,0),a.sheenRoughness=0,a.sheen=1;let r=i.extensions[this.name];if(r.sheenColorFactor!==void 0){let o=r.sheenColorFactor;a.sheenColor.setRGB(o[0],o[1],o[2],xa)}return r.sheenRoughnessFactor!==void 0&&(a.sheenRoughness=r.sheenRoughnessFactor),r.sheenColorTexture!==void 0&&s.push(n.assignTexture(a,"sheenColorMap",r.sheenColorTexture,$t)),r.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(a,"sheenRoughnessMap",r.sheenRoughnessTexture)),Promise.all(s)}},Y0=class{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ga}extendMaterialParams(e,a){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],r=i.extensions[this.name];return r.transmissionFactor!==void 0&&(a.transmission=r.transmissionFactor),r.transmissionTexture!==void 0&&s.push(n.assignTexture(a,"transmissionMap",r.transmissionTexture)),Promise.all(s)}},Z0=class{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_VOLUME}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ga}extendMaterialParams(e,a){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],r=i.extensions[this.name];a.thickness=r.thicknessFactor!==void 0?r.thicknessFactor:0,r.thicknessTexture!==void 0&&s.push(n.assignTexture(a,"thicknessMap",r.thicknessTexture)),a.attenuationDistance=r.attenuationDistance||1/0;let o=r.attenuationColor||[1,1,1];return a.attenuationColor=new Ae().setRGB(o[0],o[1],o[2],xa),Promise.all(s)}},K0=class{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_IOR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ga}extendMaterialParams(e,a){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=i.extensions[this.name];return a.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}},J0=class{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_SPECULAR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ga}extendMaterialParams(e,a){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],r=i.extensions[this.name];a.specularIntensity=r.specularFactor!==void 0?r.specularFactor:1,r.specularTexture!==void 0&&s.push(n.assignTexture(a,"specularIntensityMap",r.specularTexture));let o=r.specularColorFactor||[1,1,1];return a.specularColor=new Ae().setRGB(o[0],o[1],o[2],xa),r.specularColorTexture!==void 0&&s.push(n.assignTexture(a,"specularColorMap",r.specularColorTexture,$t)),Promise.all(s)}},Q0=class{constructor(e){this.parser=e,this.name=tt.EXT_MATERIALS_BUMP}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ga}extendMaterialParams(e,a){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],r=i.extensions[this.name];return a.bumpScale=r.bumpFactor!==void 0?r.bumpFactor:1,r.bumpTexture!==void 0&&s.push(n.assignTexture(a,"bumpMap",r.bumpTexture)),Promise.all(s)}},j0=class{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ga}extendMaterialParams(e,a){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],r=i.extensions[this.name];return r.anisotropyStrength!==void 0&&(a.anisotropy=r.anisotropyStrength),r.anisotropyRotation!==void 0&&(a.anisotropyRotation=r.anisotropyRotation),r.anisotropyTexture!==void 0&&s.push(n.assignTexture(a,"anisotropyMap",r.anisotropyTexture)),Promise.all(s)}},$0=class{constructor(e){this.parser=e,this.name=tt.KHR_TEXTURE_BASISU}loadTexture(e){let a=this.parser,n=a.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],r=a.options.ktx2Loader;if(!r){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return a.loadTextureImage(e,s.source,r)}},ey=class{constructor(e){this.parser=e,this.name=tt.EXT_TEXTURE_WEBP}loadTexture(e){let a=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[a])return null;let r=s.extensions[a],o=i.images[r.source],l=n.textureLoader;if(o.uri){let u=n.options.manager.getHandler(o.uri);u!==null&&(l=u)}return n.loadTextureImage(e,r.source,l)}},ty=class{constructor(e){this.parser=e,this.name=tt.EXT_TEXTURE_AVIF}loadTexture(e){let a=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[a])return null;let r=s.extensions[a],o=i.images[r.source],l=n.textureLoader;if(o.uri){let u=n.options.manager.getHandler(o.uri);u!==null&&(l=u)}return n.loadTextureImage(e,r.source,l)}},ay=class{constructor(e){this.name=tt.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let a=this.parser.json,n=a.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),r=this.parser.options.meshoptDecoder;if(!r||!r.supported){if(a.extensionsRequired&&a.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){let l=i.byteOffset||0,u=i.byteLength||0,c=i.count,f=i.byteStride,d=new Uint8Array(o,l,u);return r.decodeGltfBufferAsync?r.decodeGltfBufferAsync(c,f,d,i.mode,i.filter).then(function(p){return p.buffer}):r.ready.then(function(){let p=new ArrayBuffer(c*f);return r.decodeGltfBuffer(new Uint8Array(p),c,f,d,i.mode,i.filter),p})})}else return null}},ny=class{constructor(e){this.name=tt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let a=this.parser.json,n=a.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=a.meshes[n.mesh];for(let u of i.primitives)if(u.mode!==En.TRIANGLES&&u.mode!==En.TRIANGLE_STRIP&&u.mode!==En.TRIANGLE_FAN&&u.mode!==void 0)return null;let r=n.extensions[this.name].attributes,o=[],l={};for(let u in r)o.push(this.parser.getDependency("accessor",r[u]).then(c=>(l[u]=c,l[u])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(u=>{let c=u.pop(),f=c.isGroup?c.children:[c],d=u[0].count,p=[];for(let g of f){let y=new We,m=new P,h=new ua,x=new P(1,1,1),S=new Mr(g.geometry,g.material,d);for(let v=0;v<d;v++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,v),l.ROTATION&&h.fromBufferAttribute(l.ROTATION,v),l.SCALE&&x.fromBufferAttribute(l.SCALE,v),S.setMatrixAt(v,y.compose(m,h,x));for(let v in l)if(v==="_COLOR_0"){let T=l[v];S.instanceColor=new Ns(T.array,T.itemSize,T.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&g.geometry.setAttribute(v,l[v]);Et.prototype.copy.call(S,g),this.parser.assignFinalMaterial(S),p.push(S)}return c.isGroup?(c.clear(),c.add(...p),c):p[0]}))}},IT="glTF",Ac=12,LT={JSON:1313821514,BIN:5130562},iy=class{constructor(e){this.name=tt.KHR_BINARY_GLTF,this.content=null,this.body=null;let a=new DataView(e,0,Ac),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:a.getUint32(4,!0),length:a.getUint32(8,!0)},this.header.magic!==IT)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-Ac,s=new DataView(e,Ac),r=0;for(;r<i;){let o=s.getUint32(r,!0);r+=4;let l=s.getUint32(r,!0);if(r+=4,l===LT.JSON){let u=new Uint8Array(e,Ac+r,o);this.content=n.decode(u)}else if(l===LT.BIN){let u=Ac+r;this.body=e.slice(u,u+o)}r+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},sy=class{constructor(e,a){if(!a)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=tt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=a,this.dracoLoader.preload()}decodePrimitive(e,a){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,r=e.extensions[this.name].attributes,o={},l={},u={};for(let c in r){let f=uy[c]||c.toLowerCase();o[f]=r[c]}for(let c in e.attributes){let f=uy[c]||c.toLowerCase();if(r[c]!==void 0){let d=n.accessors[e.attributes[c]],p=yl[d.componentType];u[f]=p.name,l[f]=d.normalized===!0}}return a.getDependency("bufferView",s).then(function(c){return new Promise(function(f,d){i.decodeDracoFile(c,function(p){for(let g in p.attributes){let y=p.attributes[g],m=l[g];m!==void 0&&(y.normalized=m)}f(p)},o,u,xa,d)})})}},ry=class{constructor(){this.name=tt.KHR_TEXTURE_TRANSFORM}extendTexture(e,a){return(a.texCoord===void 0||a.texCoord===e.channel)&&a.offset===void 0&&a.rotation===void 0&&a.scale===void 0||(e=e.clone(),a.texCoord!==void 0&&(e.channel=a.texCoord),a.offset!==void 0&&e.offset.fromArray(a.offset),a.rotation!==void 0&&(e.rotation=a.rotation),a.scale!==void 0&&e.repeat.fromArray(a.scale),e.needsUpdate=!0),e}},oy=class{constructor(){this.name=tt.KHR_MESH_QUANTIZATION}},pp=class extends zi{constructor(e,a,n,i){super(e,a,n,i)}copySampleValue_(e){let a=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let r=0;r!==i;r++)a[r]=n[s+r];return a}interpolate_(e,a,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=o*2,u=o*3,c=i-a,f=(n-a)/c,d=f*f,p=d*f,g=e*u,y=g-u,m=-2*p+3*d,h=p-d,x=1-m,S=h-d+f;for(let v=0;v!==o;v++){let T=r[y+v+o],E=r[y+v+l]*c,A=r[g+v+o],R=r[g+v]*c;s[v]=x*T+S*E+m*A+h*R}return s}},qD=new ua,ly=class extends pp{interpolate_(e,a,n,i){let s=super.interpolate_(e,a,n,i);return qD.fromArray(s).normalize().toArray(s),s}},En={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},yl={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},AT={9728:ga,9729:Ia,9984:Th,9985:ll,9986:wr,9987:Hn},ET={33071:$n,33648:Zo,10497:Us},O0={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},uy={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Fs={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},WD={CUBICSPLINE:void 0,LINEAR:yr,STEP:xr},F0={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function XD(t){return t.DefaultMaterial===void 0&&(t.DefaultMaterial=new ti({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:zn})),t.DefaultMaterial}function Br(t,e,a){for(let n in a.extensions)t[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=a.extensions[n])}function li(t,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(t.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function YD(t,e,a){let n=!1,i=!1,s=!1;for(let u=0,c=e.length;u<c;u++){let f=e[u];if(f.POSITION!==void 0&&(n=!0),f.NORMAL!==void 0&&(i=!0),f.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(t);let r=[],o=[],l=[];for(let u=0,c=e.length;u<c;u++){let f=e[u];if(n){let d=f.POSITION!==void 0?a.getDependency("accessor",f.POSITION):t.attributes.position;r.push(d)}if(i){let d=f.NORMAL!==void 0?a.getDependency("accessor",f.NORMAL):t.attributes.normal;o.push(d)}if(s){let d=f.COLOR_0!==void 0?a.getDependency("accessor",f.COLOR_0):t.attributes.color;l.push(d)}}return Promise.all([Promise.all(r),Promise.all(o),Promise.all(l)]).then(function(u){let c=u[0],f=u[1],d=u[2];return n&&(t.morphAttributes.position=c),i&&(t.morphAttributes.normal=f),s&&(t.morphAttributes.color=d),t.morphTargetsRelative=!0,t})}function ZD(t,e){if(t.updateMorphTargets(),e.weights!==void 0)for(let a=0,n=e.weights.length;a<n;a++)t.morphTargetInfluences[a]=e.weights[a];if(e.extras&&Array.isArray(e.extras.targetNames)){let a=e.extras.targetNames;if(t.morphTargetInfluences.length===a.length){t.morphTargetDictionary={};for(let n=0,i=a.length;n<i;n++)t.morphTargetDictionary[a[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function KD(t){let e,a=t.extensions&&t.extensions[tt.KHR_DRACO_MESH_COMPRESSION];if(a?e="draco:"+a.bufferView+":"+a.indices+":"+z0(a.attributes):e=t.indices+":"+z0(t.attributes)+":"+t.mode,t.targets!==void 0)for(let n=0,i=t.targets.length;n<i;n++)e+=":"+z0(t.targets[n]);return e}function z0(t){let e="",a=Object.keys(t).sort();for(let n=0,i=a.length;n<i;n++)e+=a[n]+":"+t[a[n]]+";";return e}function cy(t){switch(t){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function JD(t){return t.search(/\.jpe?g($|\?)/i)>0||t.search(/^data\:image\/jpeg/)===0?"image/jpeg":t.search(/\.webp($|\?)/i)>0||t.search(/^data\:image\/webp/)===0?"image/webp":t.search(/\.ktx2($|\?)/i)>0||t.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var QD=new We,fy=class{constructor(e={},a={}){this.json=e,this.extensions={},this.plugins={},this.options=a,this.cache=new GD,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,r=-1;if(typeof navigator<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,s=o.indexOf("Firefox")>-1,r=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&r<98?this.textureLoader=new dc(this.options.manager):this.textureLoader=new gc(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new rl(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,a){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(r){return r._markDefs&&r._markDefs()}),Promise.all(this._invokeAll(function(r){return r.beforeRoot&&r.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(r){let o={scene:r[0][i.scene||0],scenes:r[0],animations:r[1],cameras:r[2],asset:i.asset,parser:n,userData:{}};return Br(s,o,i),li(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(a)}_markDefs(){let e=this.json.nodes||[],a=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=a.length;i<s;i++){let r=a[i].joints;for(let o=0,l=r.length;o<l;o++)e[r[o]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let r=e[i];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,a){a!==void 0&&(e.refs[a]===void 0&&(e.refs[a]=e.uses[a]=0),e.refs[a]++)}_getNodeRef(e,a,n){if(e.refs[a]<=1)return n;let i=n.clone(),s=(r,o)=>{let l=this.associations.get(r);l!=null&&this.associations.set(o,l);for(let[u,c]of r.children.entries())s(c,o.children[u])};return s(n,i),i.name+="_instance_"+e.uses[a]++,i}_invokeOne(e){let a=Object.values(this.plugins);a.push(this);for(let n=0;n<a.length;n++){let i=e(a[n]);if(i)return i}return null}_invokeAll(e){let a=Object.values(this.plugins);a.unshift(this);let n=[];for(let i=0;i<a.length;i++){let s=e(a[i]);s&&n.push(s)}return n}getDependency(e,a){let n=e+":"+a,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(a);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(a)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(a)});break;case"accessor":i=this.loadAccessor(a);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(a)});break;case"buffer":i=this.loadBuffer(a);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(a)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(a)});break;case"skin":i=this.loadSkin(a);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(a)});break;case"camera":i=this.loadCamera(a);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,a)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let a=this.cache.get(e);if(!a){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];a=Promise.all(i.map(function(s,r){return n.getDependency(e,r)})),this.cache.add(e,a)}return a}loadBuffer(e){let a=this.json.buffers[e],n=this.fileLoader;if(a.type&&a.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+a.type+" buffer type is not supported.");if(a.uri===void 0&&e===0)return Promise.resolve(this.extensions[tt.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,r){n.load(qi.resolveURL(a.uri,i.path),s,void 0,function(){r(new Error('THREE.GLTFLoader: Failed to load buffer "'+a.uri+'".'))})})}loadBufferView(e){let a=this.json.bufferViews[e];return this.getDependency("buffer",a.buffer).then(function(n){let i=a.byteLength||0,s=a.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let a=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let r=O0[i.type],o=yl[i.componentType],l=i.normalized===!0,u=new o(i.count*r);return Promise.resolve(new Kt(u,r,l))}let s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(r){let o=r[0],l=O0[i.type],u=yl[i.componentType],c=u.BYTES_PER_ELEMENT,f=c*l,d=i.byteOffset||0,p=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0,y,m;if(p&&p!==f){let h=Math.floor(d/p),x="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+h+":"+i.count,S=a.cache.get(x);S||(y=new u(o,h*p,i.count*p/c),S=new el(y,p/c),a.cache.add(x,S)),m=new tl(S,l,d%p/c,g)}else o===null?y=new u(i.count*l):y=new u(o,d,i.count*l),m=new Kt(y,l,g);if(i.sparse!==void 0){let h=O0.SCALAR,x=yl[i.sparse.indices.componentType],S=i.sparse.indices.byteOffset||0,v=i.sparse.values.byteOffset||0,T=new x(r[1],S,i.sparse.count*h),E=new u(r[2],v,i.sparse.count*l);o!==null&&(m=new Kt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let A=0,R=T.length;A<R;A++){let M=T[A];if(m.setX(M,E[A*l]),l>=2&&m.setY(M,E[A*l+1]),l>=3&&m.setZ(M,E[A*l+2]),l>=4&&m.setW(M,E[A*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){let a=this.json,n=this.options,s=a.textures[e].source,r=a.images[s],o=this.textureLoader;if(r.uri){let l=n.manager.getHandler(r.uri);l!==null&&(o=l)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,a,n){let i=this,s=this.json,r=s.textures[e],o=s.images[a],l=(o.uri||o.bufferView)+":"+r.sampler;if(this.textureCache[l])return this.textureCache[l];let u=this.loadImageSource(a,n).then(function(c){c.flipY=!1,c.name=r.name||o.name||"",c.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(c.name=o.uri);let d=(s.samplers||{})[r.sampler]||{};return c.magFilter=AT[d.magFilter]||Ia,c.minFilter=AT[d.minFilter]||Hn,c.wrapS=ET[d.wrapS]||Us,c.wrapT=ET[d.wrapT]||Us,c.generateMipmaps=!c.isCompressedTexture&&c.minFilter!==ga&&c.minFilter!==Ia,i.associations.set(c,{textures:e}),c}).catch(function(){return null});return this.textureCache[l]=u,u}loadImageSource(e,a){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(f=>f.clone());let r=i.images[e],o=self.URL||self.webkitURL,l=r.uri||"",u=!1;if(r.bufferView!==void 0)l=n.getDependency("bufferView",r.bufferView).then(function(f){u=!0;let d=new Blob([f],{type:r.mimeType});return l=o.createObjectURL(d),l});else if(r.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let c=Promise.resolve(l).then(function(f){return new Promise(function(d,p){let g=d;a.isImageBitmapLoader===!0&&(g=function(y){let m=new ta(y);m.needsUpdate=!0,d(m)}),a.load(qi.resolveURL(f,s.path),g,void 0,p)})}).then(function(f){return u===!0&&o.revokeObjectURL(l),li(f,r),f.userData.mimeType=r.mimeType||JD(r.uri),f}).catch(function(f){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),f});return this.sourceCache[e]=c,c}assignTexture(e,a,n,i){let s=this;return this.getDependency("texture",n.index).then(function(r){if(!r)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(r=r.clone(),r.channel=n.texCoord),s.extensions[tt.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[tt.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=s.associations.get(r);r=s.extensions[tt.KHR_TEXTURE_TRANSFORM].extendTexture(r,o),s.associations.set(r,l)}}return i!==void 0&&(r.colorSpace=i),e[a]=r,r})}assignFinalMaterial(e){let a=e.geometry,n=e.material,i=a.attributes.tangent===void 0,s=a.attributes.color!==void 0,r=a.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new sl,Ma.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new il,Ma.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||s||r){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),r&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),s&&(l.vertexColors=!0),r&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return ti}loadMaterial(e){let a=this,n=this.json,i=this.extensions,s=n.materials[e],r,o={},l=s.extensions||{},u=[];if(l[tt.KHR_MATERIALS_UNLIT]){let f=i[tt.KHR_MATERIALS_UNLIT];r=f.getMaterialType(),u.push(f.extendParams(o,s,a))}else{let f=s.pbrMetallicRoughness||{};if(o.color=new Ae(1,1,1),o.opacity=1,Array.isArray(f.baseColorFactor)){let d=f.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],xa),o.opacity=d[3]}f.baseColorTexture!==void 0&&u.push(a.assignTexture(o,"map",f.baseColorTexture,$t)),o.metalness=f.metallicFactor!==void 0?f.metallicFactor:1,o.roughness=f.roughnessFactor!==void 0?f.roughnessFactor:1,f.metallicRoughnessTexture!==void 0&&(u.push(a.assignTexture(o,"metalnessMap",f.metallicRoughnessTexture)),u.push(a.assignTexture(o,"roughnessMap",f.metallicRoughnessTexture))),r=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),u.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=Ln);let c=s.alphaMode||F0.OPAQUE;if(c===F0.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,c===F0.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&r!==Ra&&(u.push(a.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new Ie(1,1),s.normalTexture.scale!==void 0)){let f=s.normalTexture.scale;o.normalScale.set(f,f)}if(s.occlusionTexture!==void 0&&r!==Ra&&(u.push(a.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&r!==Ra){let f=s.emissiveFactor;o.emissive=new Ae().setRGB(f[0],f[1],f[2],xa)}return s.emissiveTexture!==void 0&&r!==Ra&&u.push(a.assignTexture(o,"emissiveMap",s.emissiveTexture,$t)),Promise.all(u).then(function(){let f=new r(o);return s.name&&(f.name=s.name),li(f,s),a.associations.set(f,{materials:e}),s.extensions&&Br(i,f,s),f})}createUniqueName(e){let a=bt.sanitizeNodeName(e||"");return a in this.nodeNamesUsed?a+"_"+ ++this.nodeNamesUsed[a]:(this.nodeNamesUsed[a]=0,a)}loadGeometries(e){let a=this,n=this.extensions,i=this.primitiveCache;function s(o){return n[tt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,a).then(function(l){return wT(l,o,a)})}let r=[];for(let o=0,l=e.length;o<l;o++){let u=e[o],c=KD(u),f=i[c];if(f)r.push(f.promise);else{let d;u.extensions&&u.extensions[tt.KHR_DRACO_MESH_COMPRESSION]?d=s(u):d=wT(new ba,u,a),i[c]={primitive:u,promise:d},r.push(d)}}return Promise.all(r)}loadMesh(e){let a=this,n=this.json,i=this.extensions,s=n.meshes[e],r=s.primitives,o=[];for(let l=0,u=r.length;l<u;l++){let c=r[l].material===void 0?XD(this.cache):this.getDependency("material",r[l].material);o.push(c)}return o.push(a.loadGeometries(r)),Promise.all(o).then(function(l){let u=l.slice(0,l.length-1),c=l[l.length-1],f=[];for(let p=0,g=c.length;p<g;p++){let y=c[p],m=r[p],h,x=u[p];if(m.mode===En.TRIANGLES||m.mode===En.TRIANGLE_STRIP||m.mode===En.TRIANGLE_FAN||m.mode===void 0)h=s.isSkinnedMesh===!0?new Qu(y,x):new pt(y,x),h.isSkinnedMesh===!0&&h.normalizeSkinWeights(),m.mode===En.TRIANGLE_STRIP?h.geometry=N0(h.geometry,Cc):m.mode===En.TRIANGLE_FAN&&(h.geometry=N0(h.geometry,dl));else if(m.mode===En.LINES)h=new ec(y,x);else if(m.mode===En.LINE_STRIP)h=new br(y,x);else if(m.mode===En.LINE_LOOP)h=new tc(y,x);else if(m.mode===En.POINTS)h=new ac(y,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(h.geometry.morphAttributes).length>0&&ZD(h,s),h.name=a.createUniqueName(s.name||"mesh_"+e),li(h,s),m.extensions&&Br(i,h,m),a.assignFinalMaterial(h),f.push(h)}for(let p=0,g=f.length;p<g;p++)a.associations.set(f[p],{meshes:e,primitives:p});if(f.length===1)return s.extensions&&Br(i,f[0],s),f[0];let d=new On;s.extensions&&Br(i,d,s),a.associations.set(d,{meshes:e});for(let p=0,g=f.length;p<g;p++)d.add(f[p]);return d})}loadCamera(e){let a,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?a=new Zt(Tc.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(a=new Vi(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(a.name=this.createUniqueName(n.name)),li(a,n),Promise.resolve(a)}loadSkin(e){let a=this.json.skins[e],n=[];for(let i=0,s=a.joints.length;i<s;i++)n.push(this._loadNodeShallow(a.joints[i]));return a.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",a.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let s=i.pop(),r=i,o=[],l=[];for(let u=0,c=r.length;u<c;u++){let f=r[u];if(f){o.push(f);let d=new We;s!==null&&d.fromArray(s.array,u*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',a.joints[u])}return new $u(o,l)})}loadAnimation(e){let a=this.json,n=this,i=a.animations[e],s=i.name?i.name:"animation_"+e,r=[],o=[],l=[],u=[],c=[];for(let f=0,d=i.channels.length;f<d;f++){let p=i.channels[f],g=i.samplers[p.sampler],y=p.target,m=y.node,h=i.parameters!==void 0?i.parameters[g.input]:g.input,x=i.parameters!==void 0?i.parameters[g.output]:g.output;y.node!==void 0&&(r.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",h)),l.push(this.getDependency("accessor",x)),u.push(g),c.push(y))}return Promise.all([Promise.all(r),Promise.all(o),Promise.all(l),Promise.all(u),Promise.all(c)]).then(function(f){let d=f[0],p=f[1],g=f[2],y=f[3],m=f[4],h=[];for(let S=0,v=d.length;S<v;S++){let T=d[S],E=p[S],A=g[S],R=y[S],M=m[S];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();let b=n._createAnimationTracks(T,E,A,R,M);if(b)for(let I=0;I<b.length;I++)h.push(b[I])}let x=new fc(s,void 0,h);return li(x,i),x})}createNodeMesh(e){let a=this.json,n=this,i=a.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){let r=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&r.traverse(function(o){if(o.isMesh)for(let l=0,u=i.weights.length;l<u;l++)o.morphTargetInfluences[l]=i.weights[l]}),r})}loadNode(e){let a=this.json,n=this,i=a.nodes[e],s=n._loadNodeShallow(e),r=[],o=i.children||[];for(let u=0,c=o.length;u<c;u++)r.push(n.getDependency("node",o[u]));let l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(r),l]).then(function(u){let c=u[0],f=u[1],d=u[2];d!==null&&c.traverse(function(p){p.isSkinnedMesh&&p.bind(d,QD)});for(let p=0,g=f.length;p<g;p++)c.add(f[p]);return c})}_loadNodeShallow(e){let a=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=a.nodes[e],r=s.name?i.createUniqueName(s.name):"",o=[],l=i._invokeOne(function(u){return u.createNodeMesh&&u.createNodeMesh(e)});return l&&o.push(l),s.camera!==void 0&&o.push(i.getDependency("camera",s.camera).then(function(u){return i._getNodeRef(i.cameraCache,s.camera,u)})),i._invokeAll(function(u){return u.createNodeAttachment&&u.createNodeAttachment(e)}).forEach(function(u){o.push(u)}),this.nodeCache[e]=Promise.all(o).then(function(u){let c;if(s.isBone===!0?c=new al:u.length>1?c=new On:u.length===1?c=u[0]:c=new Et,c!==u[0])for(let f=0,d=u.length;f<d;f++)c.add(u[f]);if(s.name&&(c.userData.name=s.name,c.name=r),li(c,s),s.extensions&&Br(n,c,s),s.matrix!==void 0){let f=new We;f.fromArray(s.matrix),c.applyMatrix4(f)}else s.translation!==void 0&&c.position.fromArray(s.translation),s.rotation!==void 0&&c.quaternion.fromArray(s.rotation),s.scale!==void 0&&c.scale.fromArray(s.scale);if(!i.associations.has(c))i.associations.set(c,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){let f=i.associations.get(c);i.associations.set(c,{...f})}return i.associations.get(c).nodes=e,c}),this.nodeCache[e]}loadScene(e){let a=this.extensions,n=this.json.scenes[e],i=this,s=new On;n.name&&(s.name=i.createUniqueName(n.name)),li(s,n),n.extensions&&Br(a,s,n);let r=n.nodes||[],o=[];for(let l=0,u=r.length;l<u;l++)o.push(i.getDependency("node",r[l]));return Promise.all(o).then(function(l){for(let c=0,f=l.length;c<f;c++)s.add(l[c]);let u=c=>{let f=new Map;for(let[d,p]of i.associations)(d instanceof Ma||d instanceof ta)&&f.set(d,p);return c.traverse(d=>{let p=i.associations.get(d);p!=null&&f.set(d,p)}),f};return i.associations=u(s),s})}_createAnimationTracks(e,a,n,i,s){let r=[],o=e.name?e.name:e.uuid,l=[];Fs[s.path]===Fs.weights?e.traverse(function(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}):l.push(o);let u;switch(Fs[s.path]){case Fs.weights:u=ai;break;case Fs.rotation:u=ni;break;case Fs.translation:case Fs.scale:u=ii;break;default:switch(n.itemSize){case 1:u=ai;break;case 2:case 3:default:u=ii;break}break}let c=i.interpolation!==void 0?WD[i.interpolation]:yr,f=this._getArrayFromAccessor(n);for(let d=0,p=l.length;d<p;d++){let g=new u(l[d]+"."+Fs[s.path],a.array,f,c);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),r.push(g)}return r}_getArrayFromAccessor(e){let a=e.array;if(e.normalized){let n=cy(a.constructor),i=new Float32Array(a.length);for(let s=0,r=a.length;s<r;s++)i[s]=a[s]*n;a=i}return a}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof ni?ly:pp;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function jD(t,e,a){let n=e.attributes,i=new ln;if(n.POSITION!==void 0){let o=a.json.accessors[n.POSITION],l=o.min,u=o.max;if(l!==void 0&&u!==void 0){if(i.set(new P(l[0],l[1],l[2]),new P(u[0],u[1],u[2])),o.normalized){let c=cy(yl[o.componentType]);i.min.multiplyScalar(c),i.max.multiplyScalar(c)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let o=new P,l=new P;for(let u=0,c=s.length;u<c;u++){let f=s[u];if(f.POSITION!==void 0){let d=a.json.accessors[f.POSITION],p=d.min,g=d.max;if(p!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(p[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(p[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(p[2]),Math.abs(g[2]))),d.normalized){let y=cy(yl[d.componentType]);l.multiplyScalar(y)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}t.boundingBox=i;let r=new Ha;i.getCenter(r.center),r.radius=i.min.distanceTo(i.max)/2,t.boundingSphere=r}function wT(t,e,a){let n=e.attributes,i=[];function s(r,o){return a.getDependency("accessor",r).then(function(l){t.setAttribute(o,l)})}for(let r in n){let o=uy[r]||r.toLowerCase();o in t.attributes||i.push(s(n[r],o))}if(e.indices!==void 0&&!t.index){let r=a.getDependency("accessor",e.indices).then(function(o){t.setIndex(o)});i.push(r)}return Je.workingColorSpace!==xa&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Je.workingColorSpace}" not supported.`),li(t,e),jD(t,e,a),Promise.all(i).then(function(){return e.targets!==void 0?YD(t,e.targets,a):t})}var mp=class extends _r{constructor(){super();let e=new Bs;e.deleteAttribute("uv");let a=new ti({side:ya}),n=new ti,i=new Lr(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);let s=new pt(e,a);s.position.set(-.757,13.219,.717),s.scale.set(31.713,28.305,28.591),this.add(s);let r=new Mr(e,n,6),o=new Et;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),r.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),r.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),r.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),r.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),r.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),r.setMatrixAt(5,o.matrix),this.add(r);let l=new pt(e,vl(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let u=new pt(e,vl(50));u.position.set(-16.109,18.021,-8.207),u.scale.set(.1,2.425,2.751),this.add(u);let c=new pt(e,vl(17));c.position.set(14.904,12.198,-1.832),c.scale.set(.15,4.265,6.331),this.add(c);let f=new pt(e,vl(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);let d=new pt(e,vl(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let p=new pt(e,vl(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){let e=new Set;this.traverse(a=>{a.isMesh&&(e.add(a.geometry),e.add(a.material))});for(let a of e)a.dispose()}};function vl(t){return new uc({color:0,emissive:16777215,emissiveIntensity:t})}var Sl={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var cn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},$D=new Vi(-1,1,1,-1,0,1),dy=class extends ba{constructor(){super(),this.setAttribute("position",new ea([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ea([0,2,0,0,2,0],2))}},eP=new dy,zs=class{constructor(e){this._mesh=new pt(eP,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,$D)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var gp=class extends cn{constructor(e,a="tDiffuse"){super(),this.textureID=a,this.uniforms=null,this.material=null,e instanceof Jt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Yi.clone(e.uniforms),this.material=new Jt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new zs(this.material)}render(e,a,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(a),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Ec=class extends cn{constructor(e,a){super(),this.scene=e,this.camera=a,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,a,n){let i=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let r,o;this.inverse?(r=0,o=1):(r=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),s.buffers.stencil.setFunc(i.ALWAYS,r,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(i.EQUAL,1,4294967295),s.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),s.buffers.stencil.setLocked(!0)}},xp=class extends cn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var yp=class{constructor(e,a){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),a===void 0){let n=e.getSize(new Ie);this._width=n.width,this._height=n.height,a=new ca(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Wa}),a.texture.name="EffectComposer.rt1"}else this._width=a.width,this._height=a.height;this.renderTarget1=a,this.renderTarget2=a.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new gp(Sl),this.copyPass.material.blending=kn,this.clock=new xc}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,a){this.passes.splice(a,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let a=this.passes.indexOf(e);a!==-1&&this.passes.splice(a,1)}isLastEnabledPass(e){for(let a=e+1;a<this.passes.length;a++)if(this.passes[a].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let a=this.renderer.getRenderTarget(),n=!1;for(let i=0,s=this.passes.length;i<s;i++){let r=this.passes[i];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Ec!==void 0&&(r instanceof Ec?n=!0:r instanceof xp&&(n=!1))}}this.renderer.setRenderTarget(a)}reset(e){if(e===void 0){let a=this.renderer.getSize(new Ie);this._pixelRatio=this.renderer.getPixelRatio(),this._width=a.width,this._height=a.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,a){this._width=e,this._height=a;let n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var vp=class extends cn{constructor(e,a,n=null,i=null,s=null){super(),this.scene=e,this.camera=a,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ae}render(e,a,n){let i=e.autoClear;e.autoClear=!1;let s,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=i}};var RT={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ae(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var _l=class t extends cn{constructor(e,a=1,n,i){super(),this.strength=a,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new Ie(e.x,e.y):new Ie(256,256),this.clearColor=new Ae(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new ca(s,r,{type:Wa}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let c=0;c<this.nMips;c++){let f=new ca(s,r,{type:Wa});f.texture.name="UnrealBloomPass.h"+c,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);let d=new ca(s,r,{type:Wa});d.texture.name="UnrealBloomPass.v"+c,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),s=Math.round(s/2),r=Math.round(r/2)}let o=RT;this.highPassUniforms=Yi.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Jt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[3,5,7,9,11];s=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let c=0;c<this.nMips;c++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[c])),this.separableBlurMaterials[c].uniforms.invSize.value=new Ie(1/s,1/r),s=Math.round(s/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=a,this.compositeMaterial.uniforms.bloomRadius.value=.1;let u=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=u,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Yi.clone(Sl.uniforms),this.blendMaterial=new Jt({uniforms:this.copyUniforms,vertexShader:Sl.vertexShader,fragmentShader:Sl.fragmentShader,blending:yc,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ae,this._oldClearAlpha=1,this._basic=new Ra,this._fsQuad=new zs(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,a){let n=Math.round(e/2),i=Math.round(a/2);this.renderTargetBright.setSize(n,i);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(n,i),this.renderTargetsVertical[s].setSize(n,i),this.separableBlurMaterials[s].uniforms.invSize.value=new Ie(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,a,n,i,s){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=t.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=t.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){let a=[];for(let n=0;n<e;n++)a.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Jt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ie(.5,.5)},direction:{value:new Ie(.5,.5)},gaussianCoefficients:{value:a}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new Jt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};_l.BlurDirectionX=new Ie(1,0);_l.BlurDirectionY=new Ie(0,1);var wc={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Sp=class extends cn{constructor(){super(),this.uniforms=Yi.clone(wc.uniforms),this.material=new lc({name:wc.name,uniforms:this.uniforms,vertexShader:wc.vertexShader,fragmentShader:wc.fragmentShader}),this._fsQuad=new zs(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,a,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Je.getTransfer(this._outputColorSpace)===ft&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===xh?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===yh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===vh?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ol?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===_h?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Mh?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Sh&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(a),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function DT(t){let e=Math.cos(t.x/2),a=Math.sin(t.x/2),n=Math.cos(t.y/2),i=Math.sin(t.y/2),s=Math.cos(t.z/2),r=Math.sin(t.z/2);return[a*n*s+e*i*r,e*i*s-a*n*r,e*n*r+a*i*s,e*n*s-a*i*r]}function hy(t,e,a){return{x:Math.abs(a.x)<.9999999?Math.atan2(-a.y,a.z):Math.atan2(e.z,e.y),y:Math.asin(Math.max(-1,Math.min(1,a.x))),z:Math.abs(a.x)<.9999999?Math.atan2(-e.x,t.x):0}}function PT(t,e,a){if(a<=0)return{...t};if(a>=1)return{...e};let n=DT(t),i=DT(e),s=n.reduce((m,h,x)=>m+h*i[x],0);s<0&&(i=i.map(m=>-m),s=-s);let r=Math.acos(Math.min(1,s)),o=Math.sin(r),l=o>1e-5?Math.sin((1-a)*r)/o:1-a,u=o>1e-5?Math.sin(a*r)/o:a,c=n.map((m,h)=>m*l+i[h]*u),f=Math.hypot(...c),[d,p,g,y]=c.map(m=>m/f);return hy({x:1-2*(p*p+g*g),y:2*(d*p+g*y),z:2*(d*g-p*y)},{x:2*(d*p-g*y),y:1-2*(d*d+g*g),z:2*(p*g+d*y)},{x:2*(d*g+p*y),y:2*(p*g-d*y),z:1-2*(d*d+p*p)})}var Re=(t,e,a)=>({x:t,y:e,z:a}),UT={head:Re(0,1.64,.16),forehead:Re(.05,1.7,.18),eyes:Re(.05,1.63,.18),nose:Re(.02,1.57,.2),mouth:Re(.03,1.52,.19),chin:Re(.03,1.47,.18),cheek:Re(.13,1.57,.16),neck:Re(0,1.42,.14),shoulders:Re(.18,1.38,.14),chest:Re(.06,1.26,.22),stomach:Re(.05,1.04,.2),neutral_space:Re(.22,1.2,.32),shoulder_l:Re(-.22,1.38,.14),shoulder_r:Re(.22,1.38,.14),palm_weak:Re(-.08,1.16,.36)},Ml={u:Re(0,1,0),d:Re(0,-1,0),l:Re(-1,0,0),r:Re(1,0,0),o:Re(0,0,1),i:Re(0,0,-1),ul:Re(-.71,.71,0),ur:Re(.71,.71,0),dl:Re(-.71,-.71,0),dr:Re(.71,-.71,0),ol:Re(-.71,0,.71),or:Re(.71,0,.71)},BT={fist:[.85,1,1,1,1],flat:[.15,0,0,0,0],finger2:[.9,0,1,1,1],finger23:[.9,0,0,1,1],finger23spread:[.9,0,0,1,1],finger2345:[.2,0,0,0,0],pinch12:[.55,.55,1,1,1],pinchall:[.6,.6,.6,.6,.6],cee12:[.45,.45,1,1,1],ceeall:[.45,.45,.45,.45,.45]},tP={finger23spread:1,finger2345:.8,flat:.15},aP={small:.05,medium:.1,large:.18};function Rc(t){let e=Math.max(0,Math.min(1,t));return e*e*e*(10+e*(-15+6*e))}function nP(t){return Re(-t.x,t.y,t.z)}function iP(t,e,a=0){let n=Ml[t.extFingerDir]??Ml.u,i=Math.hypot(n.x,n.y,n.z),s=Re((e?-n.x:n.x)/i,n.y/i,n.z/i),r=Ml[t.palmOr]??Ml.o,o=Re(e?-r.x:r.x,r.y,r.z),l=s.x*o.x+s.y*o.y+s.z*o.z;o=Re(o.x-s.x*l,o.y-s.y*l,o.z-s.z*l),Math.hypot(o.x,o.y,o.z)<1e-6&&(o=Math.abs(s.z)>.8?Re(0,-1,0):Re(0,0,1),l=s.x*o.x+s.y*o.y+s.z*o.z,o=Re(o.x-s.x*l,o.y-s.y*l,o.z-s.z*l));let u=Math.hypot(o.x,o.y,o.z);o=Re(o.x/u,o.y/u,o.z/u);let c=Re(s.y*o.z-s.z*o.y,s.z*o.x-s.x*o.z,s.x*o.y-s.y*o.x),f=e?-a:a,d=Math.cos(f),p=Math.sin(f);return hy(Re(c.x*d-o.x*p,c.y*d-o.y*p,c.z*d-o.z*p),s,Re(o.x*d+c.x*p,o.y*d+c.y*p,o.z*d+c.z*p))}function sP(t,e){let a=aP[t.size??"medium"]??.1,n=Math.max(t.repetitions??1,1),i=Rc(e)*n,s=t.direction?Ml[t.direction]:Ml.o;switch(t.type){case"straight":{let r=(n===1?Rc(e):(1-Math.cos(i*Math.PI*2))*.5)*a;return Re(s.x*r,s.y*r,s.z*r)}case"curved":{let r=Math.min(i,1)*Math.PI,o=Math.sin(r)*a;return Re(s.x*o,s.y*o+Math.sin(r)*a*.5,s.z*o)}case"circle":{let r=i*Math.PI*2;return Re(Math.cos(r)*a,Math.sin(r)*a,0)}case"wavy":{let r=Math.min(i,1)*a;return Re(s.x*r,Math.sin(i*Math.PI*4)*a*.4,s.z*r)}case"zigzag":{let r=Math.min(i,1)*a,o=(Math.abs(i*4%2-1)-.5)*a*.8;return Re(s.x*r+o,s.y*r,s.z*r)}case"tap":case"contact":{let r=Math.sin(i*Math.PI)**2;return Re(0,0,-r*a*.6)}case"twist":return Re(0,0,0);case"nod":return Re(0,-(Math.sin(i*Math.PI)**2)*a*.6,0);default:return Re(0,0,0)}}function rP(t,e){if(t.type!=="twist")return 0;let a=Math.max(t.repetitions??1,1);return Math.sin(Rc(e)*a*Math.PI*2)*.9}function NT(t,e=.7,a=0){let n={brow:0,mouth:.1,headPitch:0,headYaw:0,headRoll:0},i=e;switch(t){case"wh-question_browDown":return{...n,brow:-.9*i,headPitch:.12*i,mouth:.25};case"yes-no_browUp":return{...n,brow:.9*i,headPitch:.1*i};case"raised_brow":case"topic_eyebrow":return{...n,brow:.75*i,headPitch:-.08*i};case"negative_headshake":return{...n,brow:-.2*i,headYaw:Math.sin(a*Math.PI*6)*.35*i};case"positive_headnod":return{...n,headPitch:Math.sin(a*Math.PI*4)*.22*i};case"head_tilt_affirm":return{...n,headRoll:Math.sin(a*Math.PI*3)*.3*i,brow:.2*i};case"mouth_open_question":return{...n,brow:-.7*i,mouth:.7*i};case"puffedCheeks":return{...n,mouth:.55*i};case"pursedLips":return{...n,mouth:.05,brow:-.3*i};default:return n}}var Ic={pos:Re(.2,1.04,.26),rot:Re(2.15,.1,.2),curl:[.25,.22,.22,.22,.22],spread:.18,visible:!0},ks={...Ic,pos:Re(-.2,1.04,.26),rot:Re(2.15,-.1,-.2)};function Zi(){return{right:{...Ic,pos:{...Ic.pos},rot:{...Ic.rot},curl:[...Ic.curl]},left:{...ks,pos:{...ks.pos},rot:{...ks.rot},curl:[...ks.curl]},face:NT("neutral")}}function py(t,e,a,n){let i=UT[t.location]??UT.neutral_space,s=n?nP(i):i,r=sP(e,a),o=iP(t,n,rP(e,a));return{pos:Re(s.x+(n?-r.x:r.x),s.y+r.y,s.z+r.z),rot:o,curl:[...BT[t.shape]??BT.flat],spread:tP[t.shape]??.25,visible:!0}}function Hs(t,e){if(!t?.entry)return Zi();e=Number.isFinite(e)?Math.max(0,Math.min(1,e)):0;let a=t.entry,n=.9+t.emphasis*.2,i=py(a.dominant,a.movement,e,!1);i.pos.z*=n;let s;a.twoHanded&&a.nonDominant?s=py(a.nonDominant,a.movement,e,!0):a.twoHanded?s=py(a.dominant,a.movement,e,!0):s={...ks,pos:{...ks.pos},rot:{...ks.rot},curl:[...ks.curl]},a.twoHanded&&(s.pos.z*=n);let r=t.nmm[0],o=NT(r?.emotion,r?.intensity??.7,e);return{right:i,left:s,face:o}}function OT(t,e,a){a=Math.max(0,Math.min(1,a));let n=(r,o)=>Re(r.x+(o.x-r.x)*a,r.y+(o.y-r.y)*a,r.z+(o.z-r.z)*a),i=(r,o)=>r+(o-r)*a,s=(r,o)=>({pos:n(r.pos,o.pos),rot:PT(r.rot,o.rot,a),curl:r.curl.map((l,u)=>i(l,o.curl[u])),spread:i(r.spread,o.spread),visible:a<.5?r.visible:o.visible});return{right:s(t.right,e.right),left:s(t.left,e.left),face:{brow:i(t.face.brow,e.face.brow),mouth:i(t.face.mouth,e.face.mouth),headPitch:i(t.face.headPitch,e.face.headPitch),headYaw:i(t.face.headYaw,e.face.headYaw),headRoll:i(t.face.headRoll,e.face.headRoll)}}}function Dc(t,e,a){let n=Rc(a),i=OT(t,e,n);for(let s of["right","left"]){let r=t[s].pos,o=e[s].pos,l=Math.hypot(o.x-r.x,o.y-r.y,o.z-r.z),u=Math.min(.025,l*.08)*16*n*n*(1-n)*(1-n);i[s].pos.z+=u}return i}function FT(t,e){let a=t?.items,n=Number.isFinite(e)?Math.max(0,e):0;if(!a?.length)return{pose:Zi(),item:null,progress:0};let i=null;for(let s of a)if(!(s.endTime<=s.startTime)){if(n<s.startTime){let r=i?.endTime??0,o=s.startTime-r,l=Hs(s,0),u;if(i&&o<=.32)u=Dc(Hs(i,1),l,(n-r)/o);else{let c=Math.min(.22,o*.4),f=Math.min(.28,o*.4);u=n>=s.startTime-c?Dc(Zi(),l,(n-s.startTime+c)/c):i?Dc(Hs(i,1),Zi(),(n-r)/f):Zi()}return{pose:u,item:null,progress:0}}if(n<s.endTime){let r=s.endTime-s.startTime,o=n-s.startTime,l=Math.min(s.fingerspell?.09:.18,r*.22),u=Math.min(.1,r*.12),c=s.startTime-(i?.endTime??0),f=Hs(s,0),d=c>1e-6?f:i?Hs(i,1):Zi();return{pose:o<l?Dc(d,f,o/l):Hs(s,Math.min(1,(o-l)/(r-l-u))),item:s,progress:o/r}}i=s}return{pose:i?Dc(Hs(i,1),Zi(),(n-i.endTime)/.28):Zi(),item:null,progress:0}}function zT(t,e=!1){if(e)return{blink:0,breath:0,sway:0};let a=Math.max(0,t),n=a%4.7;return{blink:n>4.48?Math.sin((n-4.48)/.22*Math.PI)**2:0,breath:Math.sin(a*1.4)*.003,sway:Math.sin(a*.65)*.008}}function kT(t,e,a,n,i){let s=e.x-t.x,r=e.y-t.y,o=e.z-t.z,l=Math.hypot(s,r,o),u=l>1e-8?{x:s/l,y:r/l,z:o/l}:{x:0,y:-1,z:0},c=Math.max(Math.abs(a-n)+1e-4,Math.min((a+n)*.985,l)),f={x:t.x+u.x*c,y:t.y+u.y*c,z:t.z+u.z*c},d=(a*a+c*c-n*n)/(2*c),p=Math.sqrt(Math.max(0,a*a-d*d)),g={x:i*.45,y:-.85,z:.2},y=g.x*u.x+g.y*u.y+g.z*u.z,m={x:g.x-u.x*y,y:g.y-u.y*y,z:g.z-u.z*y},h=Math.hypot(m.x,m.y,m.z);return h<1e-6&&(g=Math.abs(u.z)<.9?{x:0,y:0,z:1}:{x:i,y:0,z:0},y=g.x*u.x+g.y*u.y+g.z*u.z,m={x:g.x-u.x*y,y:g.y-u.y*y,z:g.z-u.z*y},h=Math.hypot(m.x,m.y,m.z)),{target:f,elbow:{x:t.x+u.x*d+m.x/h*p,y:t.y+u.y*d+m.y/h*p,z:t.z+u.z*d+m.z/h*p}}}var oP=["Thumb","Index","Middle","Ring","Little"];function Pc(t,e){let a=t.get(e);if(!a)throw new Error(`NEXA rig is missing the bone "${e}"`);return a}function HT(t,e){let a=Pc(t,`${e}Shoulder`),n=Pc(t,`${e}UpperArm`),i=Pc(t,`${e}LowerArm`),s=Pc(t,`${e}Hand`),r=new P,o=new P,l=new P;n.getWorldPosition(r),i.getWorldPosition(o),s.getWorldPosition(l);let u=oP.map(c=>[1,2,3].map(f=>Pc(t,`${e}${c}${f}`)));return{shoulder:a,upper:n,lower:i,hand:s,fingers:u,shoulderRest:r.clone(),upperLength:r.distanceTo(o),lowerLength:o.distanceTo(l)}}function KT(t){t.updateMatrixWorld(!0);let e=new Map;t.traverse(s=>{s.isBone&&e.set(s.name,s)});let a=HT(e,"Left"),n=HT(e,"Right"),i={};for(let s of["FaceEyeLeft","FaceEyeRight","FaceArcLeft","FaceArcRight","FaceBrowLeft","FaceBrowRight","FaceSmile","FaceMouthOpen"]){let r=e.get(s);r&&(i[s]=r)}return{root:t,head:e.get("Head")??null,chest:e.get("Chest")??null,right:n,left:a,face:i,reach:n.upperLength+n.lowerLength}}var my=new ua,Nc=new ua,VT=new P;function GT(t,e,a){VT.set(a,0,0),my.setFromUnitVectors(VT,e),t.parent?(t.parent.getWorldQuaternion(Nc),Nc.invert(),t.quaternion.copy(Nc).multiply(my)):t.quaternion.copy(my),t.updateMatrixWorld(!0)}var lP=1.05,uP=-.1,Uc=new P,_p=new P,Mp=new P,Bc=new P,qT=new ua,gy=new ua,WT=new ua,XT=new Va,cP=new P(0,0,1);function fP(t,e,a,n){n.set(-t*lP,e+uP,a)}function YT(t,e,a,n){fP(a.pos.x,a.pos.y,a.pos.z,Uc),e.upper.getWorldPosition(Bc),t.worldToLocal(Bc);let i=kT(Bc,Uc,e.upperLength,e.lowerLength,n);Uc.set(i.target.x,i.target.y,i.target.z),_p.set(i.elbow.x,i.elbow.y,i.elbow.z),t.localToWorld(Uc),t.localToWorld(_p),t.localToWorld(Bc),Mp.subVectors(_p,Bc).normalize(),GT(e.upper,Mp,n),Mp.subVectors(Uc,_p).normalize(),GT(e.lower,Mp,n),t.getWorldQuaternion(qT),XT.set(a.rot.x,-a.rot.y,-a.rot.z),gy.setFromEuler(XT),WT.setFromAxisAngle(cP,n*Math.PI/2),gy.premultiply(qT).multiply(WT),e.lower.getWorldQuaternion(Nc),e.hand.quaternion.copy(Nc.invert()).multiply(gy),mP(e,a.curl,a.spread,n)}var dP=[1.18,1.32,.9],hP=.68,pP=[.11,.025,-.035,-.13];function mP(t,e,a,n){let i=n;t.fingers.forEach((s,r)=>{let o=r===0,l=Math.min(1,Math.max(0,e[r]??0));s.forEach((u,c)=>{let f=l*dP[c]*(o?hP:1);c===0&&!o?u.rotation.set(0,-i*f,i*pP[r-1]*Math.max(0,Math.min(1,a))*2*(1-l)):u.rotation.set(0,-i*f,0)})})}var bl=.001;function ZT(t,e){t&&t.scale.setScalar(e)}function gP(t,e,a){let n=t.face,i=e.face.brow,s=e.face.mouth,r=i<-.25,o=i>.25,l=!r&&s<.3,u=1-a;for(let f of["Left","Right"]){ZT(n[`FaceArc${f}`],l&&a<.5?1:bl);let d=n[`FaceEye${f}`];d&&(l&&a<.5?d.scale.setScalar(bl):d.scale.set(1,Math.max(u,bl),1));let p=n[`FaceBrow${f}`];if(p){p.scale.setScalar(r||o?1:bl);let g=r?.3:-.12;p.rotation.set(0,0,f==="Left"?g:-g),p.position.y=p.userData.restY??(p.userData.restY=p.position.y),p.position.y+=o?.006:0}}ZT(n.FaceSmile,l?1:bl);let c=n.FaceMouthOpen;c&&c.scale.set(.8,Math.max(s*1.4,bl),1)}function JT(t,e,a,n=0){t.chest&&(t.chest.rotation.x=n,t.chest.rotation.y=(e.right.pos.z-e.left.pos.z)*.045),t.root.updateMatrixWorld(!0),YT(t.root,t.right,e.right,-1),YT(t.root,t.left,e.left,1),t.head&&t.head.rotation.set(e.face.headPitch,e.face.headYaw,e.face.headRoll),gP(t,e,a)}var Xa=Pa(Ki()),tL={signing:{y:1.22,targetY:1.22,dist:2.24,width:1.15},full:{y:.9,targetY:.88,dist:3.62,width:1.2}};function eL(t,e){let a=tL[e],n=Math.max(a.dist,a.width/(2*Math.tan(Tc.degToRad(t.fov/2))*t.aspect));t.position.set(0,a.y,n),t.lookAt(0,a.targetY,0)}function Cp({plan:t,currentTime:e,playing:a,label:n,fullBody:i=!1,onError:s,onReady:r,modelUrl:o="/models/nexa.glb"}){let l=(0,ia.useRef)(null),u=(0,ia.useRef)({plan:t,currentTime:e,playing:a}),c=(0,ia.useRef)(null),f=(0,ia.useRef)(i?"full":"signing"),d=(0,ia.useRef)(s),p=(0,ia.useRef)(r),[g,y]=(0,ia.useState)(!1),[m,h]=(0,ia.useState)(null),[x,S]=(0,ia.useState)(0),[v,T]=(0,ia.useState)("\u2014"),[E,A]=(0,ia.useState)(i?"full":"signing");return(0,ia.useEffect)(()=>{u.current={plan:t,currentTime:e,playing:a}},[t,e,a]),(0,ia.useEffect)(()=>{d.current=s},[s]),(0,ia.useEffect)(()=>{p.current=r},[r]),(0,ia.useEffect)(()=>{let M=c.current;M&&(f.current=E,eL(M,E))},[E,g]),(0,ia.useEffect)(()=>{let M=l.current;if(!M)return;let b=!1;p.current?.(!1),queueMicrotask(()=>{b||(y(!1),h(null))});let I=new _r,F=new Zt(30,1,.1,50),G=tL[i?"full":"signing"];F.position.set(0,G.y,G.dist),F.lookAt(0,G.targetY,0),c.current=F;let z=new fp({antialias:!0,alpha:!0,powerPreference:"high-performance"}),X=z.getContext(),k=X.getExtension("WEBGL_debug_renderer_info"),K=k?String(X.getParameter(k.UNMASKED_RENDERER_WEBGL)):"",O=!/swiftshader|llvmpipe|software|basic render/i.test(K);z.setPixelRatio(O?Math.min(window.devicePixelRatio,1.5):1),z.shadowMap.enabled=O,z.shadowMap.type=lh,z.toneMapping=ol,z.toneMappingExposure=1,M.appendChild(z.domElement),Object.assign(z.domElement.style,{width:"100%",height:"100%",display:"block",cursor:"grab",touchAction:"none"});let ae=new gl(z),ce=ae.fromScene(new mp,.04);I.environment=ce.texture,I.environmentIntensity=.7;let me=new Gi(16774376,1.9);me.position.set(1.5,2.8,2.3),me.castShadow=!0,me.shadow.mapSize.set(1024,1024),me.shadow.camera.near=.5,me.shadow.camera.far=8,me.shadow.camera.left=-1.2,me.shadow.camera.right=1.2,me.shadow.camera.top=2.2,me.shadow.camera.bottom=-.4,me.shadow.bias=-.0012,me.shadow.normalBias=.02,I.add(me);let Oe=new Gi(13625847,.55);Oe.position.set(-2,1.5,1.4),I.add(Oe);let Ye=new Gi(5036022,1.5);Ye.position.set(-1.3,2,-2.2),I.add(Ye),I.add(new hc(11066604,857115,.35));let Qe=document.createElement("canvas");Qe.width=Qe.height=256;let at=Qe.getContext("2d"),Y=at.createRadialGradient(128,128,10,128,128,128);Y.addColorStop(0,"rgba(125,180,210,0.34)"),Y.addColorStop(.55,"rgba(50,95,125,0.12)"),Y.addColorStop(1,"rgba(8,14,20,0)"),at.fillStyle=Y,at.fillRect(0,0,256,256);let $=new nc(Qe),ve=new Cr(3.2,3.2),Ue=new Ra({map:$,transparent:!0,depthWrite:!1}),Ce=new pt(ve,Ue);Ce.position.set(0,1.2,-1.5),I.add(Ce);let Ve=new rc(1.6,64),Ct=new oc({opacity:.32}),w=new pt(Ve,Ct);w.rotation.x=-Math.PI/2,w.position.y=.001,w.receiveShadow=!0,I.add(w);let Ke=new yp(z,new ca(1,1,{type:Wa,samples:0}));Ke.addPass(new vp(I,F));let Le=new _l(new Ie(1,1),.7,.45,1.6);Ke.addPass(Le),Ke.addPass(new Sp);let Ee=0,Se=!1,rt=0,fe=te=>{Se=!0,rt=te.clientX,z.domElement.style.cursor="grabbing",z.domElement.setPointerCapture(te.pointerId)},De=te=>{Se&&(Ee+=(te.clientX-rt)*.01,rt=te.clientX)},Tt=te=>{Se=!1,z.domElement.style.cursor="grab";try{z.domElement.releasePointerCapture(te.pointerId)}catch{}};z.domElement.addEventListener("pointerdown",fe),z.domElement.addEventListener("pointermove",De),z.domElement.addEventListener("pointerup",Tt),z.domElement.addEventListener("pointercancel",Tt);let dt=()=>{let te=M.clientWidth||1,he=M.clientHeight||1;z.setSize(te,he,!1),Ke.setSize(te,he),Le.setSize(te,he),F.aspect=te/he,F.updateProjectionMatrix(),eL(F,f.current)};dt();let L=new ResizeObserver(dt);L.observe(M);let _=0,N=null,q=null,j=0,W=performance.now(),ee="",re=window.matchMedia("(prefers-reduced-motion: reduce)"),ye=0,_e=performance.now(),ne=()=>{_=requestAnimationFrame(ne);let te=performance.now(),{plan:he,currentTime:de}=u.current;if(N){let{item:oe,pose:Be}=FT(he,de),D=Math.min((te-_e)/1e3,.1);_e=te,he||(ye+=D);let ie=zT(he?de:ye,re.matches);q&&(q.position.y=0,q.rotation.y=Ee+ie.sway*(oe?.25:1)),JT(N,Be,ie.blink,ie.breath);let ue=oe?.fingerspell??oe?.gloss??"\u2014";ue!==ee&&(ee=ue,T(ue))}if(O?Ke.render():z.render(I,F),j++,te-W>=1e3){let oe=Math.round(j*1e3/(te-W));S(oe),O&&oe<24&&(O=!1,z.setPixelRatio(1),z.shadowMap.enabled=!1,dt()),j=0,W=te}};return new hp().load(o,te=>{if(!b){q=te.scene,q.traverse(he=>{he.isMesh&&(he.castShadow=!0,he.receiveShadow=!0)}),I.add(q);try{N=KT(q),y(!0),p.current?.(!0)}catch(he){let de=he instanceof Error?he.message:"NEXA rig could not be read";h(de),p.current?.(!1),d.current?.(de)}}},void 0,te=>{if(b)return;let he=te instanceof Error?te.message:`Failed to load ${o}`;h(he),p.current?.(!1),d.current?.(he)}),ne(),()=>{b=!0,p.current?.(!1),cancelAnimationFrame(_),L.disconnect(),z.domElement.removeEventListener("pointerdown",fe),z.domElement.removeEventListener("pointermove",De),z.domElement.removeEventListener("pointerup",Tt),z.domElement.removeEventListener("pointercancel",Tt),q&&q.traverse(te=>{let he=te;if(!he.isMesh)return;he.geometry?.dispose();let de=he.material;Array.isArray(de)?de.forEach(oe=>oe.dispose()):de?.dispose()}),Ke.dispose(),ve.dispose(),Ue.dispose(),$.dispose(),Ve.dispose(),Ct.dispose(),ce.texture.dispose(),ae.dispose(),z.dispose(),c.current=null,z.domElement.parentNode===M&&M.removeChild(z.domElement)}},[i,o]),(0,Xa.jsxs)("div",{className:"relative w-full h-full flex flex-col items-center justify-center",children:[(0,Xa.jsx)("div",{ref:l,className:"w-full flex-1 min-h-0"}),!g&&!m&&(0,Xa.jsx)("div",{className:"absolute inset-0 flex items-center justify-center text-on-surface-variant text-xs font-mono",children:"Loading NEXA\u2026"}),m&&(0,Xa.jsx)("div",{className:"absolute inset-0 flex items-center justify-center px-6 text-center text-xs font-mono text-error",children:m}),(0,Xa.jsxs)("button",{onClick:()=>A(M=>M==="signing"?"full":"signing"),title:E==="signing"?"Show full body":"Focus on signing space",className:"absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container/80 backdrop-blur-sm border border-outline-variant/30 text-[10px] font-mono text-on-surface-variant hover:text-primary transition-colors",children:[(0,Xa.jsx)("span",{className:"material-symbols-outlined text-[13px]",children:E==="signing"?"person":"zoom_in"}),E==="signing"?"Full body":"Signing view"]}),(0,Xa.jsxs)("div",{className:"absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none",children:[(0,Xa.jsx)("p",{className:"font-mono text-primary font-bold text-sm truncate max-w-[260px] text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]",children:n??v}),(0,Xa.jsxs)("div",{className:"flex items-center gap-2 text-[10px] font-mono",children:[(0,Xa.jsxs)("span",{className:"px-2 py-0.5 rounded-full bg-primary/10 text-primary",children:[x,"fps"]}),(0,Xa.jsx)("span",{className:"px-2 py-0.5 rounded-full bg-surface-container/80 backdrop-blur-sm text-on-surface-variant",children:t?`${t.items.length} signs`:"no plan"}),t&&(0,Xa.jsx)("span",{className:"px-2 py-0.5 rounded-full bg-surface-container/80 backdrop-blur-sm text-on-surface-variant",children:t.lang})]})]})]})}function aL(t,e){let a=new ArrayBuffer(44+t.length*2),n=new DataView(a),i=(s,r)=>{for(let o=0;o<r.length;o++)n.setUint8(s+o,r.charCodeAt(o))};i(0,"RIFF"),n.setUint32(4,a.byteLength-8,!0),i(8,"WAVE"),i(12,"fmt "),n.setUint32(16,16,!0),n.setUint16(20,1,!0),n.setUint16(22,1,!0),n.setUint32(24,e,!0),n.setUint32(28,e*2,!0),n.setUint16(32,2,!0),n.setUint16(34,16,!0),i(36,"data"),n.setUint32(40,t.length*2,!0);for(let s=0;s<t.length;s++){let r=Number.isFinite(t[s])?Math.max(-1,Math.min(1,t[s])):0;n.setInt16(44+s*2,Math.round(r*(r<0?32768:32767)),!0)}return a}var Tp=()=>new DOMException("Sharing was cancelled","AbortError");async function iL(t,e,a,n,i={}){if(n?.aborted)throw Tp();let s=i.source==="microphone";if(!window.AudioContext||!window.AudioWorkletNode||(s?!navigator.mediaDevices?.getUserMedia:!navigator.mediaDevices?.getDisplayMedia))throw new Error("Open Live meetings in desktop Chrome or Edge to capture the selected audio source.");let r=[],o=[],l=[],u=new AbortController,c=new AudioContext({sampleRate:16e3});c.resume().catch(()=>{});let f,d,p,g,y=!1,m,h=!1,x=0,S=0,v=performance.now(),T=!1,E=!1;function A(k){i.onStatus?.({state:k,level:k==="receiving"?S:0,receivedSeconds:x})}function R(){return r.flatMap(k=>k.getAudioTracks())}function M(){if(y)return;if(c.state!=="running")return A("suspended");let k=R();if(k.length&&k.every(K=>K.muted||!K.enabled))return A("muted");if(performance.now()-v>3e3)return A("stalled");A(T&&S>1e-5?"receiving":"silent")}function b(k,K,O){return new Promise((ae,ce)=>{let me,Oe=()=>{clearTimeout(me),u.signal.removeEventListener("abort",Ye)},Ye=()=>{Oe(),ce(Tp())};if(u.signal.aborted)return k.catch(()=>{}),Ye();u.signal.addEventListener("abort",Ye,{once:!0}),K&&(me=setTimeout(()=>{Oe(),ce(new Error(O))},K)),k.then(Qe=>{Oe(),ae(Qe)},Qe=>{Oe(),ce(Qe)})})}async function I(k){return b(k.then(K=>{if(y||u.signal.aborted)throw K.getTracks().forEach(O=>O.stop()),Tp();return r.push(K),K.getTracks().forEach(O=>O.addEventListener("ended",F,{once:!0})),K.getAudioTracks().forEach(O=>{O.addEventListener("mute",M),O.addEventListener("unmute",M)}),K}))}function F(){y||(X(h),e())}function G(){X(!1)}function z(){M(),h&&!y&&c.state==="suspended"&&!E&&(E=!0,b(c.resume(),5e3,"Audio processing stayed paused. Stop sharing and start again.").catch(k=>{y||(a(k.message),X(!1))}).finally(()=>{E=!1,M()}))}function X(k){if(m)return m;y=!0,u.abort(),n?.removeEventListener("abort",G),clearInterval(p),c.removeEventListener("statechange",z),o.forEach(K=>K.disconnect());for(let K of r)for(let O of K.getTracks())O.removeEventListener("ended",F),O.removeEventListener("mute",M),O.removeEventListener("unmute",M),O.stop();return m=(async()=>{k&&f&&c.state==="running"&&await new Promise(K=>{let O=setTimeout(K,500);g=()=>{clearTimeout(O),K()},f.port.postMessage("flush")}),f&&(f.port.onmessage=null,f.onprocessorerror=null,f.disconnect(),f.port.close()),l.forEach(K=>K.disconnect()),d?.disconnect(),c.state!=="closed"&&await c.close().catch(()=>{}),A("stopped")})(),m}n?.addEventListener("abort",G,{once:!0}),A("starting");try{let k;if(!s){if(k=await I(navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser"},audio:!0,selfBrowserSurface:"exclude",systemAudio:"exclude",surfaceSwitching:"exclude"})),k.getVideoTracks()[0]?.getSettings().displaySurface!=="browser")throw new Error("Choose your meeting from the browser tab section. Whole-screen and window sharing are not supported for live captions.");if(!k.getAudioTracks().length)throw new Error("No tab audio was shared. Choose your meeting under the browser tab section and turn on Share tab audio. Use desktop Chrome or Edge.")}if((s||i.includeMicrophone)&&(await I(navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0},video:!1})),!r.at(-1)?.getAudioTracks().length))throw new Error("No microphone audio was available. Choose an available microphone and start again.");if(await b(c.resume(),6e3,"The browser could not start audio processing. Click Start again and allow audio."),await b(c.audioWorklet.addModule("/live-audio-worklet.js"),1e4,"The audio recorder could not load. Refresh the page and start again."),y||u.signal.aborted)throw Tp();if(R().some(ae=>ae.readyState==="ended"))throw new Error("The selected audio source stopped before capture could start.");f=new AudioWorkletNode(c,"meeting-pcm",{processorOptions:{chunkSeconds:5,statusIntervalSeconds:.25}}),f.port.onmessage=({data:ae})=>{if(ae.type==="flushed"){g?.();return}if(ae.type==="status"){if(y)return;v=performance.now(),T=ae.hasInput===!0,S=typeof ae.rms=="number"&&Number.isFinite(ae.rms)?Math.min(1,Math.max(0,ae.rms)):0,x=typeof ae.receivedSeconds=="number"&&Number.isFinite(ae.receivedSeconds)?Math.max(x,ae.receivedSeconds):x,M();return}if(ae.type!=="chunk"||!(ae.samples instanceof Float32Array))return;let ce=ae.samples.length/ae.sampleRate;!Number.isFinite(ce)||ce<.15||ce>5+.01||t({audio:new Blob([aL(ae.samples,ae.sampleRate)],{type:"audio/wav"}),duration:ce})},f.onprocessorerror=()=>{y||(a("Audio capture stopped unexpectedly. Share the selected audio source again."),X(!1))},d=c.createGain(),d.gain.value=0,f.connect(d).connect(c.destination);for(let ae of r){let ce=c.createMediaStreamSource(new MediaStream(ae.getAudioTracks())),me=c.createGain();me.gain.value=1/r.length,ce.connect(me).connect(f),o.push(ce),l.push(me)}v=performance.now(),h=!0,c.addEventListener("statechange",z),p=setInterval(M,1e3);let K=k?.getVideoTracks()[0]?.label,O=K&&!/^(web-contents-media-stream|screen|window):/i.test(K)?K:"Shared browser tab";return{stop:()=>X(!0),label:s?"Your microphone":i.includeMicrophone?`${O} + your microphone`:O}}catch(k){throw await X(!1),k}}var Lp=class{constructor(e,a,n,i=6){this.process=e;this.onCount=a;this.onError=n;this.capacity=i;this.pending=[];this.busy=!1;this.closed=!1;this.controller=new AbortController}push(e){return this.closed||this.pending.length+Number(this.busy)>=this.capacity?!1:(this.pending.push(e),this.onCount(this.pending.length+Number(this.busy)),this.drain(),!0)}close(){this.closed=!0,this.pending=[],this.controller.abort(),this.onCount(0)}async drain(){if(!(this.busy||this.closed)){this.busy=!0;try{for(;!this.closed&&this.pending.length;){let e=this.pending.shift();await this.process(e,this.controller.signal),this.closed||this.onCount(this.pending.length)}}catch(e){this.closed||(this.close(),this.onError(e))}finally{this.busy=!1}}}};var Q=Pa(Ki());function sL(t){return`${Math.floor(t/60).toString().padStart(2,"0")}:${Math.floor(t%60).toString().padStart(2,"0")}`}function rL(t){return t instanceof DOMException&&t.name==="NotAllowedError"?"Audio access was cancelled or blocked. Allow access to your selected source, then start live captions again.":t instanceof DOMException&&t.name==="NotFoundError"?"No microphone was found. Connect one or choose Meeting tab instead.":t instanceof Error?t.message:"Could not connect the selected audio source. Try desktop Chrome or Edge."}function xy({captureAudio:t=iL,endpoint:e="/api/live",requestAudio:a,compact:n=!1,visible:i=!0,modelUrl:s,onCaptureChange:r}={}){let[o,l]=(0,Ze.useState)(!1),[u,c]=(0,Ze.useState)(!1),[f,d]=(0,Ze.useState)(!1),[p,g]=(0,Ze.useState)(!1),[y,m]=(0,Ze.useState)(""),[h,x]=(0,Ze.useState)(null),[S,v]=(0,Ze.useState)(0),[T,E]=(0,Ze.useState)([]),[A,R]=(0,Ze.useState)([]),[M,b]=(0,Ze.useState)({id:-1,time:0}),[I,F]=(0,Ze.useState)("tab"),[G,z]=(0,Ze.useState)(!1),[X,k]=(0,Ze.useState)(null),[K,O]=(0,Ze.useState)(null),[ae,ce]=(0,Ze.useState)(0),[me,Oe]=(0,Ze.useState)(!1),[Ye,Qe]=(0,Ze.useState)(!1),[at,Y]=(0,Ze.useState)(!1),[$,ve]=(0,Ze.useState)(0),[Ue,Ce]=(0,Ze.useState)(!0),Ve=Ue&&i,Ct=(0,Ze.useRef)(null),w=(0,Ze.useRef)(null),Ke=(0,Ze.useRef)(null),Le=(0,Ze.useRef)(0),Ee=(0,Ze.useRef)(0),Se=(0,Ze.useRef)({id:-1,elapsed:0}),rt=(0,Ze.useRef)(null),fe=A[0];(0,Ze.useEffect)(()=>{r?.(u)},[u,r]);let De=(0,Ze.useCallback)(async()=>{let ee=Ct.current;if(ee){Ct.current=null,c(!1),d(!0);try{await ee.stop()}finally{d(!1)}}},[]),Tt=(0,Ze.useCallback)(ee=>{Y(!0),x(`The avatar could not load: ${ee}. Start again to reload it.`),w.current?.abort(),Ke.current?.close(),De()},[De]);(0,Ze.useEffect)(()=>()=>{Le.current++,w.current?.abort(),Ke.current?.close(),Ct.current?.stop()},[]),(0,Ze.useEffect)(()=>{let ee=()=>Ce(document.visibilityState!=="hidden");return ee(),document.addEventListener("visibilitychange",ee),()=>document.removeEventListener("visibilitychange",ee)},[]),(0,Ze.useEffect)(()=>{if(K===null)return;let ee=setInterval(()=>ce(Math.floor((Date.now()-K)/1e3)),1e3);return()=>clearInterval(ee)},[K]),(0,Ze.useEffect)(()=>{if(!fe)return;let ee=Se.current;if(ee.id!==fe.id&&(ee.id=fe.id,ee.elapsed=0),!Ye||!Ve)return;let re=performance.now(),ye=0,_e=()=>{let ne=performance.now();ee.elapsed+=Math.min((ne-re)/1e3,.1),re=ne;let te=Math.min(ee.elapsed,fe.plan.duration);b({id:fe.id,time:te}),te<fe.plan.duration?ye=requestAnimationFrame(_e):(Ee.current--,R(he=>he.slice(1)))};return ye=requestAnimationFrame(_e),()=>cancelAnimationFrame(ye)},[fe,Ye,Ve]),(0,Ze.useEffect)(()=>{let ee=rt.current?.parentElement;ee&&(ee.scrollTop=ee.scrollHeight)},[T]);async function dt(){let ee=++Le.current;w.current?.abort();let re=new AbortController;w.current=re,Ke.current?.close(),l(!0),x(null),E([]),R([]),b({id:-1,time:0}),k(null),O(null),ce(0),Oe(!1),at&&(Y(!1),Qe(!1),ve(de=>de+1)),Se.current={id:-1,elapsed:0},Ee.current=0;let ye=0,_e=0,ne=!0,te=de=>{ee===Le.current&&(ne=!1,Ke.current?.close(),re.abort(),x(rL(de)),De())},he=new Lp(async(de,oe)=>{let Be=new FormData;Be.append("audio",de.audio,`meeting-${de.id}.wav`);let D=new AbortController,ie=setTimeout(()=>D.abort(),25e3);O(Date.now()),ce(0);let ue,pe;try{let Z=AbortSignal.any([oe,D.signal]);ue=a?await a(Be,Z):await fetch(e,{method:"POST",body:Be,signal:Z}),pe=await ue.json()}catch(Z){throw D.signal.aborted&&!oe.aborted?new Error("Transcription did not respond in time. Sharing has stopped. Start again to reconnect."):Z instanceof TypeError?new Error("The transcription connection was lost. Check your internet connection, then start again."):Z instanceof SyntaxError?new Error("The transcription service returned an unreadable response. Start again to reconnect."):Z}finally{clearTimeout(ie),ee===Le.current&&O(null)}if(!ue.ok)throw new Error(pe?.error||`Live transcription failed (${ue.status}). Please try again.`);if(!pe||typeof pe.speech!="boolean")throw new Error("Live transcription returned an invalid response. Share the tab again.");if(ee!==Le.current||oe.aborted||(Oe(!pe.speech),!pe.speech))return;if(!Array.isArray(pe.plan?.items)||pe.plan.lang!=="ASL"||!Number.isFinite(pe.plan.duration)||pe.plan.duration<=0)throw new Error("Speech was received, but signing could not be prepared. Start again to reconnect.");let se={id:de.id,offset:de.offset,text:String(pe.text)};E(Z=>[...Z,se].slice(-100)),pe.plan.items.length&&(Ee.current++,R(Z=>[...Z,{...se,plan:pe.plan}]),Ee.current>=8&&(x("Signing is catching up with the conversation. Sharing has stopped; queued captions will finish below."),De()))},de=>{ee===Le.current&&v(de)},te);Ke.current=he;try{let de=await t(oe=>{if(ee!==Le.current||!ne)return;let Be={...oe,offset:ye,id:_e++};ye+=oe.duration,he.push(Be)||(x("Transcription is taking longer than the conversation. Sharing has stopped; queued captions will finish below."),De())},()=>{De()},oe=>te(new Error(oe)),re.signal,{source:I,includeMicrophone:I==="tab"&&G,onStatus:oe=>{ee===Le.current&&k(oe)}});if(ee!==Le.current||!ne||re.signal.aborted){await de.stop();return}Ct.current=de,m(de.label),c(!0),g(!0)}catch(de){he.close(),ee===Le.current&&ne&&!re.signal.aborted&&x(rL(de))}finally{ee===Le.current&&l(!1)}}let L=o||f||S>0,_=u&&(X?.state==="silent"||X?.state==="muted"),N=u&&(X?.state==="suspended"||X?.state==="stalled"),q=X?.level?Math.round(Math.max(0,Math.min(1,(20*Math.log10(X.level)+80)/80))*100):0,j=u?S?ae>=8?"Transcription is taking longer than usual\u2026":"Turning speech into captions\u2026":_?"No audio detected":me?"Audio received; waiting for clear speech":"Listening for speech":f||S?"Finishing captured audio":fe?"Finishing ASL playback":p?"Sharing stopped":"Ready to connect";function W(){Le.current++,w.current?.abort(),Ke.current?.close(),Ct.current?.stop(),Ct.current=null,c(!1),l(!1),d(!1),v(0),R([]),Ee.current=0,O(null),x(null)}return n?(0,Q.jsxs)("div",{className:"live-mini",children:[(0,Q.jsxs)("div",{className:"live-mini-controls",children:[(0,Q.jsxs)("select",{"aria-label":"Audio source",disabled:u||L,value:I==="microphone"?"microphone":G?"both":"tab",onChange:ee=>{F(ee.target.value==="microphone"?"microphone":"tab"),z(ee.target.value==="both")},children:[(0,Q.jsx)("option",{value:"tab",children:"Meeting audio"}),(0,Q.jsx)("option",{value:"microphone",children:"My microphone"}),(0,Q.jsx)("option",{value:"both",children:"Meeting + microphone"})]}),u?(0,Q.jsx)("button",{onClick:()=>void De(),"aria-label":"Stop sharing",children:"Stop"}):(0,Q.jsx)("button",{onClick:()=>void dt(),disabled:L,"aria-label":"Start live captions",children:o?"Starting\u2026":L?"Finishing\u2026":"Start"}),!u&&(L||fe)&&(0,Q.jsx)("button",{onClick:W,"aria-label":"Cancel pending captions and signing",children:"Cancel"})]}),(0,Q.jsxs)("div",{className:"live-mini-input",children:[(0,Q.jsx)("p",{role:"status","data-testid":"live-status",children:h?"Needs attention":N?"Audio capture needs attention":j}),(0,Q.jsx)("div",{"aria-label":"Input audio level",role:"meter","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":q,className:"live-mini-meter",children:(0,Q.jsx)("div",{style:{width:`${u?q:0}%`}})})]}),(h||_||N)&&(0,Q.jsxs)("div",{className:"live-mini-feedback",role:h?"alert":"status",children:[h??(N?"Audio is paused. Stop and start again to reconnect.":I==="microphone"?"Check that your microphone is unmuted and speak near it.":G?"Check your microphone and meeting sound.":"Waiting for participant audio. Choose My microphone for your own voice."),h&&!u&&!L&&(0,Q.jsx)("button",{onClick:()=>void dt(),children:"Start again"})]}),(0,Q.jsx)("div",{className:"avatar-zone",children:(0,Q.jsx)(Cp,{modelUrl:s,plan:fe?.plan??null,currentTime:fe&&M.id===fe.id?M.time:0,playing:!!fe&&Ye&&Ve,label:fe?void 0:"Ready for conversation",onReady:Qe,onError:Tt},$)}),(0,Q.jsxs)("div",{className:"live-mini-current",children:[(0,Q.jsx)("span",{children:"Now signing"}),(0,Q.jsx)("p",{"data-testid":"live-current-caption",children:fe?.text||(u?"Listening for your first words\u2026":"Choose a source and press Start.")})]}),(0,Q.jsxs)("details",{className:"live-mini-history",children:[(0,Q.jsxs)("summary",{children:["Captions (",T.length,")"]}),(0,Q.jsxs)("div",{role:"log","aria-label":"Meeting captions","aria-live":"polite","aria-relevant":"additions",children:[T.length?T.map(ee=>(0,Q.jsxs)("p",{children:[(0,Q.jsx)("time",{children:sL(ee.offset)})," ",ee.text]},ee.id)):(0,Q.jsx)("p",{children:"No captions yet."}),(0,Q.jsx)("div",{ref:rt})]})]}),y&&(0,Q.jsx)("p",{className:"live-mini-source",title:y,children:y})]}):(0,Q.jsxs)("div",{className:"mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8",children:[(0,Q.jsxs)("header",{className:"flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",children:[(0,Q.jsxs)("div",{children:[(0,Q.jsx)("p",{className:"mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary",children:"Conversation, made visible"}),(0,Q.jsx)("h1",{className:"font-display text-3xl font-bold tracking-tight text-on-surface sm:text-4xl",children:"Live meetings"}),(0,Q.jsx)("p",{className:"mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant",children:"Turn speech from your meeting or your microphone into English captions and an ASL avatar."})]}),(0,Q.jsx)("span",{className:"self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary",children:"ASL \xB7 American Sign Language"})]}),(0,Q.jsxs)("section",{"aria-label":"Share meeting audio",className:"rounded-2xl border border-outline-variant bg-surface-container p-5 sm:p-6",children:[(0,Q.jsxs)("fieldset",{disabled:u||L,className:"mb-5 space-y-3 disabled:opacity-70",children:[(0,Q.jsx)("legend",{className:"mb-3 font-display text-lg font-semibold",children:"What should UNMUTE listen to?"}),(0,Q.jsxs)("div",{className:"grid gap-3 sm:grid-cols-2",children:[(0,Q.jsxs)("label",{className:`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${I==="tab"?"border-primary bg-primary/10":"border-outline-variant"}`,children:[(0,Q.jsx)("input",{type:"radio",name:"audio-source",value:"tab",checked:I==="tab",onChange:()=>F("tab"),className:"mt-1 accent-primary"}),(0,Q.jsxs)("span",{children:[(0,Q.jsx)("span",{className:"block font-semibold",children:"Meeting tab"}),(0,Q.jsx)("span",{className:"mt-1 block text-sm text-on-surface-variant",children:"Hear other participants from a browser tab."})]})]}),(0,Q.jsxs)("label",{className:`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${I==="microphone"?"border-primary bg-primary/10":"border-outline-variant"}`,children:[(0,Q.jsx)("input",{type:"radio",name:"audio-source",value:"microphone",checked:I==="microphone",onChange:()=>F("microphone"),className:"mt-1 accent-primary"}),(0,Q.jsxs)("span",{children:[(0,Q.jsx)("span",{className:"block font-semibold",children:"My microphone"}),(0,Q.jsx)("span",{className:"mt-1 block text-sm text-on-surface-variant",children:"Translate your voice, or try it without a meeting."})]})]})]}),I==="tab"&&(0,Q.jsxs)("label",{className:"flex min-h-11 cursor-pointer items-center gap-3 text-sm",children:[(0,Q.jsx)("input",{type:"checkbox",checked:G,onChange:ee=>z(ee.target.checked),className:"h-4 w-4 accent-primary"})," Include my microphone so my own words are translated too"]})]}),(0,Q.jsxs)("div",{className:"flex flex-col justify-between gap-5 lg:flex-row lg:items-center",children:[(0,Q.jsxs)("div",{className:"flex gap-3",children:[(0,Q.jsx)(Do,{"aria-hidden":"true",className:"mt-1 h-6 w-6 shrink-0 text-primary"}),(0,Q.jsxs)("div",{children:[(0,Q.jsx)("h2",{className:"font-display text-lg font-semibold",children:I==="microphone"?"Connect your microphone":"Connect your meeting tab"}),(0,Q.jsx)("p",{id:"share-instructions",className:"mt-1 max-w-2xl text-sm leading-6 text-on-surface-variant",children:I==="microphone"?"Select Start live captions, allow microphone access, then speak. No meeting tab is needed.":(0,Q.jsxs)(Q.Fragment,{children:["In desktop Chrome or Edge, choose your meeting in the ",(0,Q.jsx)("strong",{className:"text-on-surface",children:"browser tab"})," section and enable ",(0,Q.jsx)("strong",{className:"text-on-surface",children:"Share tab audio"}),". ",G?"Allow microphone access as well to include your own voice.":"Your own microphone is excluded unless you select it above."]})})]})]}),u?(0,Q.jsxs)("button",{onClick:()=>void De(),className:"flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-error px-5 font-semibold text-on-error transition-colors hover:bg-error/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",children:[(0,Q.jsx)(Ru,{"aria-hidden":"true",size:18})," Stop sharing"]}):(0,Q.jsxs)("button",{onClick:()=>void dt(),disabled:L,"aria-describedby":"share-instructions",className:"flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-on-primary transition-colors hover:bg-primary-fixed disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",children:[I==="microphone"?(0,Q.jsx)(wu,{"aria-hidden":"true",size:19}):(0,Q.jsx)(Do,{"aria-hidden":"true",size:19})," ",o?"Allow audio access\u2026":f||S?"Finishing captions\u2026":"Start live captions"]})]}),(0,Q.jsxs)("div",{className:"mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-outline-variant pt-4 text-xs text-on-surface-variant",children:[(0,Q.jsxs)("span",{className:"flex items-center gap-2",children:[(0,Q.jsx)(Du,{"aria-hidden":"true",size:15})," You choose which audio is shared"]}),(0,Q.jsx)("span",{children:"Audio is sent for transcription; screen video is never sent."}),(0,Q.jsx)("span",{children:"Only start with permission to transcribe the conversation."})]})]}),(0,Q.jsxs)("div",{className:"grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.85fr)]",children:[(0,Q.jsxs)("section",{"aria-label":"Live ASL avatar",className:"overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest",children:[(0,Q.jsxs)("div",{className:"flex items-center justify-between gap-2 border-b border-outline-variant px-5 py-4",children:[(0,Q.jsx)("h2",{className:"font-display font-semibold",children:"ASL interpretation"}),(0,Q.jsxs)("span",{className:"flex items-center gap-2 text-xs text-on-surface-variant",children:[(0,Q.jsx)(Iu,{"aria-hidden":"true",size:15,className:u?"text-primary":"text-outline"})," ",u?"Sharing audio":"Not sharing"]})]}),(0,Q.jsx)("div",{className:"h-[380px] sm:h-[470px]",children:(0,Q.jsx)(Cp,{modelUrl:s,plan:fe?.plan??null,currentTime:fe&&M.id===fe.id?M.time:0,playing:!!fe&&Ye&&Ve,label:fe?void 0:"Ready for conversation",onReady:Qe,onError:Tt},$)}),(0,Q.jsxs)("div",{className:"min-h-24 border-t border-outline-variant bg-surface-container px-5 py-4",children:[(0,Q.jsx)("p",{className:"mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary",children:"Now signing"}),(0,Q.jsx)("p",{"data-testid":"live-current-caption",className:"text-sm leading-6 text-on-surface",children:fe?.text||(I==="microphone"?"Speak into your microphone to start signing.":"Speech from your selected audio will appear here.")}),fe&&!Ye&&(0,Q.jsx)("p",{className:"mt-2 text-xs text-primary",children:"Your signs are saved while the avatar loads."})]})]}),(0,Q.jsxs)("section",{"aria-labelledby":"live-captions-heading",className:"flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container",children:[(0,Q.jsxs)("div",{className:"border-b border-outline-variant p-5",children:[(0,Q.jsxs)("h2",{id:"live-captions-heading",className:"flex items-center gap-2 font-display font-semibold",children:[(0,Q.jsx)(Ii,{"aria-hidden":"true",size:20,className:"text-primary"})," Live captions"]}),(0,Q.jsx)("p",{role:"status","data-testid":"live-status",className:"mt-2 text-sm text-on-surface-variant",children:h?"Needs attention":N?"Audio capture needs attention":j}),u&&(0,Q.jsxs)("div",{className:"mt-3 flex items-center gap-3 text-xs text-on-surface-variant",children:[(0,Q.jsx)("div",{"aria-label":"Input audio level",role:"meter","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":q,className:"h-2 w-24 overflow-hidden rounded-full bg-surface-container-highest",children:(0,Q.jsx)("div",{className:"h-full bg-primary transition-[width] motion-reduce:transition-none",style:{width:`${q}%`}})}),(0,Q.jsx)("span",{children:X?.state==="receiving"?"Audio is reaching UNMUTE":N?"Audio paused":"Waiting for audio"})]}),_&&(0,Q.jsx)("p",{className:"mt-3 text-sm leading-6 text-primary",children:I==="microphone"?"We cannot hear your microphone yet. Check that it is unmuted and speak near it.":G?"No audio is arriving. Check your microphone and the shared tab's sound.":"We cannot hear the meeting tab yet. To translate your own voice, stop sharing and choose My microphone or Include my microphone."}),N&&(0,Q.jsx)("p",{className:"mt-3 text-sm leading-6 text-error",children:"Your browser has paused the audio connection. Stop sharing and start again to reconnect."}),h&&(0,Q.jsxs)("div",{role:"alert","aria-label":"Live meeting feedback",className:"mt-4 rounded-xl border border-error/40 bg-error/10 p-4 text-sm leading-6 text-error",children:[h,!u&&!L&&(0,Q.jsx)("button",{onClick:()=>void dt(),className:"mt-3 block min-h-11 cursor-pointer rounded-lg border border-error/40 px-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",children:"Start again"})]})]}),(0,Q.jsxs)("div",{role:"log","aria-label":"Meeting captions","aria-live":"polite","aria-relevant":"additions",className:"max-h-[440px] min-h-60 flex-1 space-y-4 overflow-y-auto p-5",children:[T.length?T.map(ee=>(0,Q.jsxs)("div",{className:"flex gap-3",children:[(0,Q.jsx)("span",{className:"pt-1 font-mono text-xs text-primary",children:sL(ee.offset)}),(0,Q.jsx)("p",{className:"text-sm leading-6 text-on-surface",children:ee.text})]},ee.id)):(0,Q.jsxs)("div",{className:"flex h-full min-h-52 flex-col items-center justify-center text-center",children:[(0,Q.jsx)(Ii,{"aria-hidden":"true",className:"mb-4 h-10 w-10 text-outline"}),(0,Q.jsx)("p",{className:"font-medium text-on-surface",children:u?S?"Preparing your first captions\u2026":"Listening for your first words\u2026":"A place for every word"}),(0,Q.jsx)("p",{className:"mt-2 max-w-xs text-sm leading-6 text-on-surface-variant",children:u?"After a few seconds of speech, captions appear here and the avatar starts signing. Silence does not generate signs.":"Choose your audio source and start live captions."})]}),(0,Q.jsx)("div",{ref:rt})]}),(0,Q.jsxs)("div",{className:"border-t border-outline-variant p-5 text-xs leading-5 text-on-surface-variant",children:[(0,Q.jsx)("p",{children:"Expect a short delay while speech becomes captions and signs. Signing pauses when this tab is hidden and resumes when you return."}),y&&(0,Q.jsxs)("p",{className:"mt-2 truncate",title:y,children:["Source: ",y]})]})]})]}),(0,Q.jsx)("p",{className:"text-xs leading-5 text-on-surface-variant",children:"Only your selected audio sources are captured, after you allow access. Stop sharing releases the tab and microphone. Recent captions stay on this page until you start again or leave."})]})}var Ap=null,Cl=()=>new DOMException("Sharing was cancelled","AbortError");function vP(t){let e=atob(t),a=new Uint8Array(e.length);for(let n=0;n<e.length;n++)a[n]=e.charCodeAt(n);return a}async function SP(t){let e=new Uint8Array(await t.arrayBuffer()),a="";for(let n=0;n<e.length;n+=8192)a+=String.fromCharCode(...e.subarray(n,n+8192));return btoa(a)}function oL(t){return(e,a,n,i,s={})=>new Promise((r,o)=>{if(i?.aborted){o(Cl());return}let l=browser.runtime.connect({name:"unmute-meeting"}),u={port:l,session:crypto.randomUUID(),cancelled:!1,requests:new Map};Ap=u;let c=!1,f=!1,d=!1,p=null,g=null,y=setTimeout(()=>x("Audio did not start. Allow the selected input, then try again."),3e4),m=v=>{u.cancelled||l.postMessage({...v,captureSessionId:u.session})};function h(){u.cancelled||(m({type:"CANCEL"}),u.cancelled=!0,clearTimeout(y),i?.removeEventListener("abort",h),u.requests.forEach(v=>{v.cleanup(),v.reject(Cl())}),u.requests.clear(),p?.(),c||o(Cl()),Ap===u&&(Ap=null),l.disconnect())}function x(v){u.cancelled||(c?n(v):o(new Error(v)),h())}function S(){return g||(f=!0,d||u.cancelled?Promise.resolve():(g=new Promise(v=>{let T=setTimeout(()=>{v(),x("Audio did not stop cleanly. Reload the meeting before starting again.")},5e3);p=()=>{clearTimeout(T),v()},m({type:"STOP"})}),g))}l.onMessage.addListener(v=>{let T=v;if(!(u.cancelled||T.captureSessionId!==u.session)){if(T.type==="ERROR"){x(typeof T.message=="string"?T.message:"Audio capture could not continue.");return}if(T.type==="LIVE_RESULT"&&typeof T.requestId=="string"){let E=u.requests.get(T.requestId);if(!E)return;u.requests.delete(T.requestId),E.cleanup(),E.resolve(new Response(typeof T.body=="string"?T.body:"{}",{status:typeof T.status=="number"?T.status:502,headers:{"Content-Type":"application/json"}}))}else if(T.type==="INPUT_STATUS"&&T.status&&typeof T.status=="object")s.onStatus?.(T.status);else if(T.type==="AUDIO_CHUNK"&&typeof T.audioBase64=="string"&&T.audioBase64.length<=22e4&&!d)try{e({audio:new Blob([vP(T.audioBase64)],{type:"audio/wav"}),duration:Number(T.duration)})}catch{x("Audio could not be read. Start sharing again.")}else T.type==="CAPTURE_STARTED"?(clearTimeout(y),c=!0,r({stop:S,label:s.source==="microphone"?"Your microphone":s.includeMicrophone?"Meeting audio + your microphone":"Meeting audio"})):T.type==="CAPTURE_STOPPED"&&(d=!0,clearTimeout(y),p?.(),c?f||a():o(new Error("Sharing stopped before audio was ready.")))}}),l.onDisconnect.addListener(()=>{u.cancelled||x("The meeting connection closed. Reload the meeting and start again.")}),i?.addEventListener("abort",h,{once:!0}),m({type:"START",owner:t,options:{source:s.source==="microphone"?"microphone":"tab",includeMicrophone:s.includeMicrophone===!0}})})}async function lL(t,e){let a=Ap;if(!a||a.cancelled||e.aborted)throw Cl();let n=t.get("audio");if(!(n instanceof Blob)||n.size<46||n.size>17e4)throw new Error("The captured audio is invalid. Start sharing again.");let i=await SP(n);if(a.cancelled||e.aborted)throw Cl();let s=crypto.randomUUID();return new Promise((r,o)=>{let l=()=>{a.requests.delete(s),e.removeEventListener("abort",l),a.cancelled||a.port.postMessage({type:"LIVE_CANCEL",requestId:s,captureSessionId:a.session}),o(Cl())};e.addEventListener("abort",l,{once:!0}),a.requests.set(s,{resolve:r,reject:o,cleanup:()=>e.removeEventListener("abort",l)}),a.port.postMessage({type:"LIVE_REQUEST",requestId:s,audioBase64:i,captureSessionId:a.session})})}var Nr=Pa(Ki(),1),_P=oL("sidebar");function uL(){return(0,Nr.jsxs)("div",{className:"sidebar-live",children:[(0,Nr.jsxs)("header",{className:"widget-bar",children:[(0,Nr.jsx)("strong",{children:"UNMUTE"}),(0,Nr.jsx)("span",{className:"sidebar-label",children:"Live ASL"})]}),(0,Nr.jsx)(xy,{compact:!0,captureAudio:_P,requestAudio:lL,modelUrl:browser.runtime.getURL("dist/nexa.glb")})]})}var fL=Pa(Ki(),1),MP=document.getElementById("root");(0,cL.createRoot)(MP).render((0,fL.jsx)(uL,{}));})();
/*! Bundled license information:

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/context.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/Icon.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/createLucideIcon.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/captions.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/mic.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/monitor-up.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/radio.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/square.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/video.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.45.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

three/build/three.core.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
