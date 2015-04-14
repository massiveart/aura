/*! Aura v0.9.4 | (c) 2013 The Aura authors | MIT License */
define("aura/platform",[],function(){"function"!=typeof Function.prototype.bind&&(Function.prototype.bind=function(e){var t=this,n=Array.prototype.slice.call(arguments,1);return function(){return t.apply(e,Array.prototype.concat.apply(n,arguments))}}),"function"!=typeof Array.isArray&&(Array.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)}),Object.create||(Object.create=function(e){function t(){}if(arguments.length>1)throw new Error("Object.create implementation only accepts the first parameter.");return t.prototype=e,new t}),Object.keys||(Object.keys=function(){var e=Object.prototype.hasOwnProperty,t=!{toString:null}.propertyIsEnumerable("toString"),n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],r=n.length;return function(i){if("object"!=typeof i&&"function"!=typeof i||null===i)throw new TypeError("Object.keys called on non-object");var o=[];for(var s in i)e.call(i,s)&&o.push(s);if(t)for(var a=0;r>a;a++)e.call(i,n[a])&&o.push(n[a]);return o}}())}),function(){window.jQuery?define("jquery",[],function(){return window.jQuery}):require.config({paths:{jquery:"bower_components/jquery/jquery"},shim:{jquery:{exports:"$"}}}),window._?define("underscore",[],function(){return window._}):require.config({paths:{underscore:"bower_components/underscore/underscore"},shim:{underscore:{exports:"_"}}}),define("aura/base",["module","underscore","jquery","./platform"],function(e,t,n){require.s.contexts._.config.paths.aura||require.config({paths:{aura:e.id.replace(/base$/,"")}});var r={};return r.dom={find:function(e,t){return t=t||document,n(t).find(e)},contains:function(e,t){return n.contains(t||document,e)},data:function(e,t){return n(e).data(t)}},r.data={deferred:n.Deferred,when:n.when},r.util={each:n.each,extend:n.extend,uniq:t.uniq,_:t,decamelize:function(e,t){return t=void 0===t?"_":t,e.replace(/([A-Z])/g,t+"$1").toLowerCase()}},r.events={listen:function(e,t,r,i){return n(e).on(t,r,i)},bindAll:function(){return t.bindAll.apply(this,arguments)}},r.template={parse:t.template},r})}(),define("aura/logger",[],function(){"use strict";function e(e){return this.name=e,this._log=t,this._warn=t,this._error=t,this._enabled=!1,this}var t=function(){},n=window.console||{};return e.prototype.isEnabled=function(){return this._enabled},e.prototype.setName=function(e){this.name=e},e.prototype.enable=function(){if(Function.prototype.bind&&"object"==typeof n)for(var e=["log","warn","error"],r=0;r<e.length;r++)n[e[r]]=Function.prototype.call.bind(n[e[r]],n);return this._log=n.log||t,this._warn=n.warn||this._log,this._error=n.error||this._log,this._enabled=!0,this},e.prototype.write=function(e,t){var r=Array.prototype.slice.call(t);r.unshift(this.name+":"),e.apply(n,r)},e.prototype.log=function(){this.write(this._log,arguments)},e.prototype.warn=function(){this.write(this._warn,arguments)},e.prototype.error=function(){this.write(this._error,arguments)},e}),define("aura/aura.extensions",["./base","./logger"],function(e,t){function n(){return this._extensions=[],this.initStatus=u(),this}function r(){for(var e,t=c.call(arguments),n=0,r=t.length;r>n;n++)if(e=t[n],"function"==typeof e)return e;return function(){}}function i(e){return"function"==typeof e?e.apply(void 0,c.call(arguments,1)):e}function o(e){var t=u(),n=e.ref,i=e.context,o=s(n,i);return o.fail(t.reject),o.done(function(e){if(!e)return t.resolve();var n=l(r(e,e.initialize)(i));n.done(function(){t.resolve(e)}),n.fail(t.reject)}),t.promise()}function s(e,t){var n=u(),r=function(e){if(e=i(e,t),e&&e.require&&e.require.paths){var r=Object.keys(e.require.paths)||[];require.config(e.require),require(r,function(){n.resolve(e)},o)}else n.resolve(e)},o=function(t){f.error("Error loading ext:",e,t),n.reject(t)};return"string"==typeof e?require([e],r,o):r(e),n}var a=e.util._,c=Array.prototype.slice,u=e.data.deferred,l=e.data.when,f=new t("Extensions").enable();return n.prototype.add=function(e){if(a.include(this._extensions,e)){var t=e.ref.toString()+" is already registered.";throw t+="Extensions can only be added once.",new Error(t)}if(this.initStarted)throw new Error("Init extensions already called");return this._extensions.push(e),this},n.prototype.onReady=function(e){return this.initStatus.then(e),this},n.prototype.onFailure=function(e){return this.initStatus.fail(e),this},n.prototype.init=function(){if(this.initStarted)throw new Error("Init extensions already called");this.initStarted=!0;var e=a.compact(this._extensions.slice(0)),t=[],n=this.initStatus;return function r(i){if(i){var s=o(i);t.push(s),s.done(function(){r(e.shift())}),s.fail(function(e){e||(e="Unknown error while loading an extension"),e instanceof Error||(e=new Error(e)),n.reject(e)})}else 0===e.length&&l.apply(void 0,t).done(function(){n.resolve(Array.prototype.slice.call(arguments))})}(e.shift()),n.promise()},n}),define("aura/aura",["./base","./aura.extensions","./logger"],function(e,t,n){function r(o){function s(e){if("string"==typeof e&&(e=c.sandboxes.get(e)),e){var t=["aura","sandbox","stop"].join(c.config.mediator.delimiter);return i.invoke(e._children,"stop"),c.core.mediator.emit(t,e),e._component&&(e._component.invokeWithCallbacks("remove"),e._component.invokeWithCallbacks("destroy")),e.stopped=!0,e.el&&c.core.dom.find(e.el).remove(),u[e.ref]=null,delete u[e.ref],e}}if(!(this instanceof r))return new r(o);var a=new t,c=this;c.ref=i.uniqueId("aura_"),c.config=o=o||{},c.config.sources=c.config.sources||{"default":"./aura_components"};var u={},l=Object.create(e);c.sandboxes={},c.sandboxes.create=function(e,t){if(e=e||i.uniqueId("sandbox-"),u[e])throw new Error("Sandbox with ref "+e+" already exists.");var r=Object.create(l);r.ref=e||i.uniqueId("sandbox-"),r.logger=new n(r.ref),u[r.ref]=r;var s=o.debug;return(s===!0||s.enable&&(0===s.components.length||-1!==s.components.indexOf(e)))&&r.logger.enable(),i.extend(r,t||{}),r},c.sandboxes.get=function(e){return u[e]},c.use=function(e){return a.add({ref:e,context:c}),c},c.components={},c.components.addSource=function(e,t){if(o.sources[e])throw new Error("Components source '"+e+"' is already registered");return o.sources[e]=t,c},c.core=Object.create(e),c.start=function(t){if(c.started)return c.logger.error("Aura already started!"),a.initStatus;c.logger.log("Starting Aura");var n=t||{};return"string"==typeof t?n={components:c.core.dom.find(t)}:Array.isArray(t)?n={components:t}:t&&t.widgets&&!t.components?n.components=t.widgets:void 0===n.components&&(n.components=c.core.dom.find(c.config.components||"body")),a.onReady(function(t){e.util.each(t,function(e,t){t&&"function"==typeof t.afterAppStart&&t.afterAppStart(c)})}),a.onFailure(function(){c.logger.error("Error initializing app:",c.config.name,arguments),c.stop()}),c.startOptions=n,c.started=!0,a.init()},c.stop=function(){c.started=!1},c.cleanUp=function(){i.defer(function(){i.each(u,function(e){e&&e.el&&!c.core.dom.contains($(e.el)[0],document)&&e.stop()})})},c.sandbox=l,c.logger=new n(c.ref),c.sandbox.stop=function(e){var t=c.sandboxes.get(e);t&&s(t);try{$.find(e)}catch(n){return n}e?c.core.dom.find(e,this.el).each(function(e,t){var n=c.core.dom.find(t).data("__sandbox_ref__");s(n)}):s(this)},o.debug=o.debug||{};var f=o.debug;return f===!0&&(o.debug=f={enable:!0}),f.enable&&(f.components=f.components?f.components.split(" "):[],c.logger.enable(),c.use("aura/ext/debug")),c.use("aura/ext/mediator"),c.use("aura/ext/components"),c}{var i=e.util._,o=function(){};Object.freeze||o}return r}),define("aura/ext/debug",[],function(){"use strict";return{name:"debug",initialize:function(e){"function"==typeof window.attachDebugger&&(e.logger.log("Attaching debugger ..."),window.attachDebugger(e))}}}),!function(){function e(){this._events={},this._conf&&t.call(this,this._conf)}function t(e){e&&(this._conf=e,e.delimiter&&(this.delimiter=e.delimiter),e.maxListeners&&(this._events.maxListeners=e.maxListeners),e.wildcard&&(this.wildcard=e.wildcard),e.newListener&&(this.newListener=e.newListener),this.wildcard&&(this.listenerTree={}))}function n(e){this._events={},this.newListener=!1,t.call(this,e)}function r(e,t,n,i){if(!n)return[];var o,s,a,c,u,l,f,p=[],h=t.length,d=t[i],m=t[i+1];if(i===h&&n._listeners){if("function"==typeof n._listeners)return e&&e.push(n._listeners),[n];for(o=0,s=n._listeners.length;s>o;o++)e&&e.push(n._listeners[o]);return[n]}if("*"===d||"**"===d||n[d]){if("*"===d){for(a in n)"_listeners"!==a&&n.hasOwnProperty(a)&&(p=p.concat(r(e,t,n[a],i+1)));return p}if("**"===d){f=i+1===h||i+2===h&&"*"===m,f&&n._listeners&&(p=p.concat(r(e,t,n,h)));for(a in n)"_listeners"!==a&&n.hasOwnProperty(a)&&("*"===a||"**"===a?(n[a]._listeners&&!f&&(p=p.concat(r(e,t,n[a],h))),p=p.concat(r(e,t,n[a],i))):p=p.concat(a===m?r(e,t,n[a],i+2):r(e,t,n[a],i)));return p}p=p.concat(r(e,t,n[d],i+1))}if(c=n["*"],c&&r(e,t,c,i+1),u=n["**"])if(h>i){u._listeners&&r(e,t,u,h);for(a in u)"_listeners"!==a&&u.hasOwnProperty(a)&&(a===m?r(e,t,u[a],i+2):a===d?r(e,t,u[a],i+1):(l={},l[a]=u[a],r(e,t,{"**":l},i+1)))}else u._listeners?r(e,t,u,h):u["*"]&&u["*"]._listeners&&r(e,t,u["*"],h);return p}function i(e,t){e="string"==typeof e?e.split(this.delimiter):e.slice();for(var n=0,r=e.length;r>n+1;n++)if("**"===e[n]&&"**"===e[n+1])return;for(var i=this.listenerTree,a=e.shift();a;){if(i[a]||(i[a]={}),i=i[a],0===e.length){if(i._listeners){if("function"==typeof i._listeners)i._listeners=[i._listeners,t];else if(o(i._listeners)&&(i._listeners.push(t),!i._listeners.warned)){var c=s;"undefined"!=typeof this._events.maxListeners&&(c=this._events.maxListeners),c>0&&i._listeners.length>c&&(i._listeners.warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",i._listeners.length),console.trace())}}else i._listeners=t;return!0}a=e.shift()}return!0}var o=Array.isArray?Array.isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)},s=10;n.prototype.delimiter=".",n.prototype.setMaxListeners=function(t){this._events||e.call(this),this._events.maxListeners=t,this._conf||(this._conf={}),this._conf.maxListeners=t},n.prototype.event="",n.prototype.once=function(e,t){return this.many(e,1,t),this},n.prototype.many=function(e,t,n){function r(){0===--t&&i.off(e,r),n.apply(this,arguments)}var i=this;if("function"!=typeof n)throw new Error("many only accepts instances of Function");return r._origin=n,this.on(e,r),i},n.prototype.emit=function(){this._events||e.call(this);var t=arguments[0];if("newListener"===t&&!this.newListener&&!this._events.newListener)return!1;if(this._all){for(var n=arguments.length,i=new Array(n-1),o=1;n>o;o++)i[o-1]=arguments[o];for(o=0,n=this._all.length;n>o;o++)this.event=t,this._all[o].apply(this,i)}if("error"===t&&!(this._all||this._events.error||this.wildcard&&this.listenerTree.error))throw arguments[1]instanceof Error?arguments[1]:new Error("Uncaught, unspecified 'error' event.");var s;if(this.wildcard){s=[];var a="string"==typeof t?t.split(this.delimiter):t.slice();r.call(this,s,a,this.listenerTree,0)}else s=this._events[t];if("function"==typeof s){if(this.event=t,1===arguments.length)s.call(this);else if(arguments.length>1)switch(arguments.length){case 2:s.call(this,arguments[1]);break;case 3:s.call(this,arguments[1],arguments[2]);break;default:for(var n=arguments.length,i=new Array(n-1),o=1;n>o;o++)i[o-1]=arguments[o];s.apply(this,i)}return!0}if(s){for(var n=arguments.length,i=new Array(n-1),o=1;n>o;o++)i[o-1]=arguments[o];for(var c=s.slice(),o=0,n=c.length;n>o;o++)this.event=t,c[o].apply(this,i);return c.length>0||!!this._all}return!!this._all},n.prototype.on=function(t,n){if("function"==typeof t)return this.onAny(t),this;if("function"!=typeof n)throw new Error("on only accepts instances of Function");if(this._events||e.call(this),this.emit("newListener",t,n),this.wildcard)return i.call(this,t,n),this;if(this._events[t]){if("function"==typeof this._events[t])this._events[t]=[this._events[t],n];else if(o(this._events[t])&&(this._events[t].push(n),!this._events[t].warned)){var r=s;"undefined"!=typeof this._events.maxListeners&&(r=this._events.maxListeners),r>0&&this._events[t].length>r&&(this._events[t].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[t].length),console.trace())}}else this._events[t]=n;return this},n.prototype.onAny=function(e){if("function"!=typeof e)throw new Error("onAny only accepts instances of Function");return this._all||(this._all=[]),this._all.push(e),this},n.prototype.addListener=n.prototype.on,n.prototype.off=function(e,t){if("function"!=typeof t)throw new Error("removeListener only takes instances of Function");var n,i=[];if(this.wildcard){var s="string"==typeof e?e.split(this.delimiter):e.slice();i=r.call(this,null,s,this.listenerTree,0)}else{if(!this._events[e])return this;n=this._events[e],i.push({_listeners:n})}for(var a=0;a<i.length;a++){var c=i[a];if(n=c._listeners,o(n)){for(var u=-1,l=0,f=n.length;f>l;l++)if(n[l]===t||n[l].listener&&n[l].listener===t||n[l]._origin&&n[l]._origin===t){u=l;break}if(0>u)continue;return this.wildcard?c._listeners.splice(u,1):this._events[e].splice(u,1),0===n.length&&(this.wildcard?delete c._listeners:delete this._events[e]),this}(n===t||n.listener&&n.listener===t||n._origin&&n._origin===t)&&(this.wildcard?delete c._listeners:delete this._events[e])}return this},n.prototype.offAny=function(e){var t,n=0,r=0;if(e&&this._all&&this._all.length>0){for(t=this._all,n=0,r=t.length;r>n;n++)if(e===t[n])return t.splice(n,1),this}else this._all=[];return this},n.prototype.removeListener=n.prototype.off,n.prototype.removeAllListeners=function(t){if(0===arguments.length)return!this._events||e.call(this),this;if(this.wildcard)for(var n="string"==typeof t?t.split(this.delimiter):t.slice(),i=r.call(this,null,n,this.listenerTree,0),o=0;o<i.length;o++){var s=i[o];s._listeners=null}else{if(!this._events[t])return this;this._events[t]=null}return this},n.prototype.listeners=function(t){if(this.wildcard){var n=[],i="string"==typeof t?t.split(this.delimiter):t.slice();return r.call(this,n,i,this.listenerTree,0),n}return this._events||e.call(this),this._events[t]||(this._events[t]=[]),o(this._events[t])||(this._events[t]=[this._events[t]]),this._events[t]},n.prototype.listenersAny=function(){return this._all?this._all:[]},"function"==typeof define&&define.amd?define("eventemitter",[],function(){return n}):"object"==typeof exports?exports.EventEmitter2=n:window.EventEmitter2=n}(),define("aura/ext/mediator",["eventemitter","underscore"],function(){"use strict";return{name:"mediator",require:{paths:{eventemitter:"bower_components/eventemitter2/lib/eventemitter2",underscore:"bower_components/underscore/underscore"},shim:{underscore:{exports:"_"}}},initialize:function(e){var t=require("eventemitter"),n=require("underscore");e.config.mediator=n.defaults(e.config.mediator||{},{wildcard:!0,delimiter:".",newListener:!0,maxListeners:20});var r=new t(e.config.mediator);e.core.mediator=r;var i=function(t){return function(i,o,s){if(!this.stopped){if(!n.isFunction(o)||!n.isString(i))throw new Error("Invalid arguments passed to sandbox."+t);s=s||this;var a=function(){var t=Array.prototype.slice.call(arguments);try{o.apply(s,t)}catch(n){e.logger.error("Error caught in listener '"+i+"', called with arguments: ",t,"\nError:",n.message,n,t)}};this._events=this._events||[],this._events.push({name:i,listener:o,callback:a}),r[t](i,a)}}};e.sandbox.on=i("on"),e.sandbox.once=i("once"),e.sandbox.off=function(e){this._events&&(this._events=n.reject(this._events,function(t){var n=t.name===e;return n&&r.off(e,t.callback),n}))},e.sandbox.emit=function(){if(!this.stopped){var t=e.config.debug;if(t.enable&&(0===t.components.length||-1!==t.components.indexOf("aura:mediator"))){var n=Array.prototype.slice.call(arguments);n.unshift("Event emitted"),e.logger.log.apply(e.logger,n)}r.emit.apply(r,arguments)}},e.sandbox.stopListening=function(){this._events&&n.each(this._events,function(e){r.off(e.name,e.callback)})};var o=["aura","sandbox","stop"].join(e.config.mediator.delimiter);e.core.mediator.on(o,function(e){e.stopListening()})}}}),define("aura/ext/components",[],function(){"use strict";return function(e){function t(t,n,r,i){var o=l[t+":"+n]||[],s=[];e.core.util.each(o,function(e,t){"function"==typeof t&&s.push(t.apply(r,i))});var a=e.core.data.when.apply(void 0,s).promise();return a}function n(n,r){var i;if("string"==typeof n)i=n,n=r[i]||function(){};else{if("string"!=typeof n.name)throw new Error("Error invoking Component with callbacks: ",r.options.name,". first argument should be either the name of a function or of the form : { name: 'fnName', fn: function() { ... } } ");i=n.name,n=n.fn||function(){}}var o,s=e.core.data.deferred(),c=[].slice.call(arguments,2);return o=t("before",i,r,c),o.then(function(){return n.apply(r,c)}).then(function(e){return t("after",i,r,c.concat(e)).then(function(){a.data.when(e).then(function(){s.resolve(e)})},s.reject)}).fail(function(t){e.logger.error("Error in Component "+r.options.name+" "+i+" callback",t),s.reject(t)}),s.promise()}function r(e){var t=c.clone(e),n=a.data.deferred(),r=this;return this.options=c.defaults(t||{},this.options||{}),this._ref=t._ref,this.$el=a.dom.find(t.el),this.initialized=n.promise(),this.invokeWithCallbacks("initialize",this.options).then(function(){n.resolve(r)}),this}function i(e,t,n){var r=c.clone(n||{});r.el=e,r.require={};var i,s=a.dom.data(e);return a.util.each(s,function(e,n){e=e.replace(new RegExp("^"+t),""),e=e.charAt(0).toLowerCase()+e.slice(1),"component"!==e&&"widget"!==e?r[e]=n:i=n}),o(i,r)}function o(t,n){var r=t.split("@"),i=a.util.decamelize(r[0]),o=r[1]||"default",s=(require.s.contexts._,e.config.sources[o]||"./aura_components");return n.name=i,n.ref="__component__$"+i+"@"+o,n.baseUrl=s+"/"+i,n.require=n.require||{},n.require.packages=n.require.packages||[],n.require.packages.push({name:n.ref,location:s+"/"+i}),n}var s=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a=e.core,c=e.core.util._;a.Components=a.Components||{};var u={},l={};r.prototype.initialize=function(){},r.prototype.html=function(e){var t=this.$el;t.html(e);var n=this;return c.defer(function(){n.sandbox.start(t,{reset:!0})}),this},r.prototype.$find=function(e){return this.$el.find(e)},r.prototype.invokeWithCallbacks=function(e){return n.apply(void 0,[e,this].concat([].slice.call(arguments,1)))};var f=function(e,t){var n,r=this;n=e&&s(e,"constructor")?e.constructor:function(){r.apply(this,arguments)},a.util.extend(n,r,t);var i=function(){this.constructor=n};return i.prototype=r.prototype,n.prototype=new i,e&&a.util.extend(n.prototype,e),n.__super__=r.prototype,n};return r.extend=f,r.load=function(t,n){var i,o=a.data.deferred(),s=n.ref,l=n.el;n._ref=a.util._.uniqueId(s+"+");var f=c.clone(n);return e.logger.log("Start loading component:",t),o.fail(function(n){e.logger.error("Error loading component:",t,n)}),require.config(f.require),require([s],function(c){if(!c)return o.reject("component "+s+" Definition is empty !");try{if(u[s])i=u[s];else{if(i=c.type?a.Components[c.type]:r,!i)throw new Error("Can't find component of type '"+c.type+"', did you forget to include the extension that provides it ?");a.util._.isObject(c)&&(i=u[s]=i.extend(c))}var p=e.sandboxes.create(n._ref,{el:l});p.logger.setName("Component '"+t+"'("+p.logger.name+")");var h={sandbox:p};"function"==typeof c&&(h.initialize=c),i=i.extend(h);var d=new i(f);d.$el.data("__sandbox_ref__",p.ref);var m=d.initialized;return m.then(function(e){o.resolve(e)}),m.fail(function(e){o.reject(e)}),m}catch(g){e.logger.error(g.message),o.reject(g)}},function(e){o.reject(e)}),o.promise()},r.parseList=function(t){var n=[];if(Array.isArray(t))c.map(t,function(e){var t=o(e.name,e.options);n.push({name:e.name,options:t})});else if(t&&a.dom.find(t)){var r=e.config.namespace,s=["[data-aura-component]","[data-aura-widget]"];r&&(s.push("[data-"+r+"-component]"),s.push("[data-"+r+"-widget]")),s=s.join(","),a.dom.find(s,t||"body").each(function(){var e="aura";r&&(this.getAttribute("data-"+r+"-component")||this.getAttribute("data-"+r+"-widget"))&&(e=r);var t=i(this,e);n.push({name:t.name,options:t})})}return n},r.startAll=function(e){var t=r.parseList(e),n=[];a.util.each(t,function(e,t){var i=r.load(t.name,t.options);n.push(i)});var i=a.data.when.apply(void 0,n);return i.promise()},{name:"components",require:{paths:{text:"bower_components/requirejs-text/text"}},initialize:function(e){function t(e,t){l[e]=l[e]||[],l[e].push(t)}e.core.Components.Base=r,e.components.before=function(e,n){var r="before:"+e;t(r,n)},e.components.after=function(e,n){var r="after:"+e;t(r,n)},e.components.addType=function(t,n){if(e.core.Components[t])throw new Error("Component type "+t+" already defined");e.core.Components[t]=r.extend(n)},e.sandbox.start=function(t,n){if(!this.stopped){var i=["aura","sandbox","start"].join(e.config.mediator.delimiter);e.core.mediator.emit(i,this);var o=this._children||[];n&&n.reset&&(c.invoke(this._children||[],"stop"),o=[]);var s=this;return r.startAll(t).done(function(){var e=Array.prototype.slice.call(arguments);c.each(e,function(e){e.sandbox._component=e,e.sandbox._parent=s,o.push(e.sandbox)}),s._children=o})}}},afterAppStart:function(e){if(e.config.components!==!1&&e.startOptions.components!==!1){var t;t=a.dom.find(Array.isArray(e.startOptions.components)?"body":e.startOptions.components),e.core.appSandbox=e.sandboxes.create(e.ref,{el:t}),e.core.appSandbox.start(e.startOptions.components)}}}}});