const t="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,e=(t,e,i=null)=>{for(;e!==i;){const i=e.nextSibling;t.removeChild(e),e=i}},i=`{{lit-${String(Math.random()).slice(2)}}}`,s=`\x3c!--${i}--\x3e`,r=new RegExp(`${i}|${s}`);class n{constructor(t,e){this.parts=[],this.element=e;const s=[],n=[],a=document.createTreeWalker(e.content,133,null,!1);let h=0,p=-1,c=0;const{strings:u,values:{length:m}}=t;for(;c<m;){const t=a.nextNode();if(null!==t){if(p++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:i}=e;let s=0;for(let t=0;t<i;t++)o(e[t].name,"$lit$")&&s++;for(;s-- >0;){const e=u[c],i=l.exec(e)[2],s=i.toLowerCase()+"$lit$",n=t.getAttribute(s);t.removeAttribute(s);const o=n.split(r);this.parts.push({type:"attribute",index:p,name:i,strings:o}),c+=o.length-1}}"TEMPLATE"===t.tagName&&(n.push(t),a.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(i)>=0){const i=t.parentNode,n=e.split(r),a=n.length-1;for(let e=0;e<a;e++){let s,r=n[e];if(""===r)s=d();else{const t=l.exec(r);null!==t&&o(t[2],"$lit$")&&(r=r.slice(0,t.index)+t[1]+t[2].slice(0,-"$lit$".length)+t[3]),s=document.createTextNode(r)}i.insertBefore(s,t),this.parts.push({type:"node",index:++p})}""===n[a]?(i.insertBefore(d(),t),s.push(t)):t.data=n[a],c+=a}}else if(8===t.nodeType)if(t.data===i){const e=t.parentNode;null!==t.previousSibling&&p!==h||(p++,e.insertBefore(d(),t)),h=p,this.parts.push({type:"node",index:p}),null===t.nextSibling?t.data="":(s.push(t),p--),c++}else{let e=-1;for(;-1!==(e=t.data.indexOf(i,e+1));)this.parts.push({type:"node",index:-1}),c++}}else a.currentNode=n.pop()}for(const t of s)t.parentNode.removeChild(t)}}const o=(t,e)=>{const i=t.length-e.length;return i>=0&&t.slice(i)===e},a=t=>-1!==t.index,d=()=>document.createComment(""),l=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/,h=new WeakMap,p=t=>"function"==typeof t&&h.has(t),c={},u={};class m{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(const i of this.__parts)void 0!==i&&i.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const e=t?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),i=[],s=this.template.parts,r=document.createTreeWalker(e,133,null,!1);let n,o=0,d=0,l=r.nextNode();for(;o<s.length;)if(n=s[o],a(n)){for(;d<n.index;)d++,"TEMPLATE"===l.nodeName&&(i.push(l),r.currentNode=l.content),null===(l=r.nextNode())&&(r.currentNode=i.pop(),l=r.nextNode());if("node"===n.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(l.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(l,n.name,n.strings,this.options));o++}else this.__parts.push(void 0),o++;return t&&(document.adoptNode(e),customElements.upgrade(e)),e}}const f=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:t=>t}),g=` ${i} `;class v{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){const t=this.strings.length-1;let e="",r=!1;for(let n=0;n<t;n++){const t=this.strings[n],o=t.lastIndexOf("\x3c!--");r=(o>-1||r)&&-1===t.indexOf("--\x3e",o+1);const a=l.exec(t);e+=null===a?t+(r?g:s):t.substr(0,a.index)+a[1]+a[2]+"$lit$"+a[3]+i}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");let e=this.getHTML();return void 0!==f&&(e=f.createHTML(e)),t.innerHTML=e,t}}const w=t=>null===t||!("object"==typeof t||"function"==typeof t),y=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class _{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let t=0;t<i.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new b(this)}_getValue(){const t=this.strings,e=t.length-1,i=this.parts;if(1===e&&""===t[0]&&""===t[1]){const t=i[0].value;if("symbol"==typeof t)return String(t);if("string"==typeof t||!y(t))return t}let s="";for(let r=0;r<e;r++){s+=t[r];const e=i[r];if(void 0!==e){const t=e.value;if(w(t)||!y(t))s+="string"==typeof t?t:String(t);else for(const e of t)s+="string"==typeof e?e:String(e)}}return s+=t[e],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class b{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===c||w(t)&&t===this.value||(this.value=t,p(t)||(this.committer.dirty=!0))}commit(){for(;p(this.value);){const t=this.value;this.value=c,t(this)}this.value!==c&&this.committer.commit()}}class x{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(d()),this.endNode=t.appendChild(d())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=d()),t.__insert(this.endNode=d())}insertAfterPart(t){t.__insert(this.startNode=d()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(null===this.startNode.parentNode)return;for(;p(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=c,t(this)}const t=this.__pendingValue;t!==c&&(w(t)?t!==this.value&&this.__commitText(t):t instanceof v?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):y(t)?this.__commitIterable(t):t===u?(this.value=u,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,i="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof m&&this.value.template===e)this.value.update(t.values);else{const i=new m(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let i,s=0;for(const r of t)i=e[s],void 0===i&&(i=new x(this.options),e.push(i),0===s?i.appendIntoPart(this):i.insertAfterPart(e[s-1])),i.setValue(r),i.commit(),s++;s<e.length&&(e.length=s,this.clear(i&&i.endNode))}clear(t=this.startNode){e(this.startNode.parentNode,t.nextSibling,this.endNode)}}class S{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;p(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=c,t(this)}if(this.__pendingValue===c)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=c}}class k extends _{constructor(t,e,i){super(t,e,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new P(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class P extends b{}let T=!1;(()=>{try{const t={get capture(){return T=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class z{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;p(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=c,t(this)}if(this.__pendingValue===c)return;const t=this.__pendingValue,e=this.value,i=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=null!=t&&(null==e||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=$(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=c}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const $=t=>t&&(T?{capture:t.capture,passive:t.passive,once:t.once}:t.capture);function E(t){let e=q.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},q.set(t.type,e));let s=e.stringsArray.get(t.strings);if(void 0!==s)return s;const r=t.strings.join(i);return s=e.keyString.get(r),void 0===s&&(s=new n(t,t.getTemplateElement()),e.keyString.set(r,s)),e.stringsArray.set(t.strings,s),s}const q=new Map,C=new WeakMap,N=(t,i,s)=>{let r=C.get(i);void 0===r&&(e(i,i.firstChild),C.set(i,r=new x(Object.assign({templateFactory:E},s))),r.appendInto(i)),r.setValue(t),r.commit()};const A=new class{handleAttributeExpressions(t,e,i,s){const r=e[0];if("."===r){return new k(t,e.slice(1),i).parts}if("@"===r)return[new z(t,e.slice(1),s.eventContext)];if("?"===r)return[new S(t,e.slice(1),i)];return new _(t,e,i).parts}handleTextExpression(t){return new x(t)}};"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.3.0");const I=(t,...e)=>new v(t,e,"html",A);function M(t,e){const{element:{content:i},parts:s}=t,r=document.createTreeWalker(i,133,null,!1);let n=F(s),o=s[n],a=-1,d=0;const l=[];let h=null;for(;r.nextNode();){a++;const t=r.currentNode;for(t.previousSibling===h&&(h=null),e.has(t)&&(l.push(t),null===h&&(h=t)),null!==h&&d++;void 0!==o&&o.index===a;)o.index=null!==h?-1:o.index-d,n=F(s,n),o=s[n]}l.forEach((t=>t.parentNode.removeChild(t)))}const U=t=>{let e=11===t.nodeType?0:1;const i=document.createTreeWalker(t,133,null,!1);for(;i.nextNode();)e++;return e},F=(t,e=-1)=>{for(let i=e+1;i<t.length;i++){const e=t[i];if(a(e))return i}return-1};const R=(t,e)=>`${t}--${e}`;let L=!0;void 0===window.ShadyCSS?L=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),L=!1);const O=t=>e=>{const s=R(e.type,t);let r=q.get(s);void 0===r&&(r={stringsArray:new WeakMap,keyString:new Map},q.set(s,r));let o=r.stringsArray.get(e.strings);if(void 0!==o)return o;const a=e.strings.join(i);if(o=r.keyString.get(a),void 0===o){const i=e.getTemplateElement();L&&window.ShadyCSS.prepareTemplateDom(i,t),o=new n(e,i),r.keyString.set(a,o)}return r.stringsArray.set(e.strings,o),o},V=["html","svg"],j=new Set,D=(t,e,i)=>{j.add(t);const s=i?i.element:document.createElement("template"),r=e.querySelectorAll("style"),{length:n}=r;if(0===n)return void window.ShadyCSS.prepareTemplateStyles(s,t);const o=document.createElement("style");for(let t=0;t<n;t++){const e=r[t];e.parentNode.removeChild(e),o.textContent+=e.textContent}(t=>{V.forEach((e=>{const i=q.get(R(e,t));void 0!==i&&i.keyString.forEach((t=>{const{element:{content:e}}=t,i=new Set;Array.from(e.querySelectorAll("style")).forEach((t=>{i.add(t)})),M(t,i)}))}))})(t);const a=s.content;i?function(t,e,i=null){const{element:{content:s},parts:r}=t;if(null==i)return void s.appendChild(e);const n=document.createTreeWalker(s,133,null,!1);let o=F(r),a=0,d=-1;for(;n.nextNode();)for(d++,n.currentNode===i&&(a=U(e),i.parentNode.insertBefore(e,i));-1!==o&&r[o].index===d;){if(a>0){for(;-1!==o;)r[o].index+=a,o=F(r,o);return}o=F(r,o)}}(i,o,a.firstChild):a.insertBefore(o,a.firstChild),window.ShadyCSS.prepareTemplateStyles(s,t);const d=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==d)e.insertBefore(d.cloneNode(!0),e.firstChild);else if(i){a.insertBefore(o,a.firstChild);const t=new Set;t.add(o),M(i,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const B={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},W=(t,e)=>e!==t&&(e==e||t==t),H={attribute:!0,type:String,converter:B,reflect:!1,hasChanged:W};class G extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach(((e,i)=>{const s=this._attributeNameForProperty(i,e);void 0!==s&&(this._attributeToPropertyMap.set(s,i),t.push(s))})),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach(((t,e)=>this._classProperties.set(e,t)))}}static createProperty(t,e=H){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const i="symbol"==typeof t?Symbol():`__${t}`,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const r=this[t];this[e]=s,this.requestUpdateInternal(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||H}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty("finalized")||t.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const i of e)this.createProperty(i,t[i])}}static _attributeNameForProperty(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=W){return i(t,e)}static _propertyValueFromAttribute(t,e){const i=e.type,s=e.converter||B,r="function"==typeof s?s:s.fromAttribute;return r?r(t,i):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const i=e.type,s=e.converter;return(s&&s.toAttribute||B.toAttribute)(t,i)}initialize(){this._updateState=0,this._updatePromise=new Promise((t=>this._enableUpdatingResolver=t)),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach(((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}}))}_applyInstanceProperties(){this._instanceProperties.forEach(((t,e)=>this[e]=t)),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=H){const s=this.constructor,r=s._attributeNameForProperty(t,i);if(void 0!==r){const t=s._propertyValueToAttribute(e,i);if(void 0===t)return;this._updateState=8|this._updateState,null==t?this.removeAttribute(r):this.setAttribute(r,t),this._updateState=-9&this._updateState}}_attributeToProperty(t,e){if(8&this._updateState)return;const i=this.constructor,s=i._attributeToPropertyMap.get(t);if(void 0!==s){const t=i.getPropertyOptions(s);this._updateState=16|this._updateState,this[s]=i._propertyValueFromAttribute(e,t),this._updateState=-17&this._updateState}}requestUpdateInternal(t,e,i){let s=!0;if(void 0!==t){const r=this.constructor;i=i||r.getPropertyOptions(t),r._valueHasChanged(this[t],e,i.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==i.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,i))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(t){}const t=this.performUpdate();return null!=t&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(e){throw t=!1,this._markUpdated(),e}t&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach(((t,e)=>this._propertyToAttribute(e,this[e],t))),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}}G.finalized=!0;const Q=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,J=Symbol();class X{constructor(t,e){if(e!==J)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(Q?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const K=(t,...e)=>{const i=e.reduce(((e,i,s)=>e+(t=>{if(t instanceof X)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+t[s+1]),t[0]);return new X(i,J)};(window.litElementVersions||(window.litElementVersions=[])).push("2.4.0");const Z={};class Y extends G{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const t=this.getStyles();if(Array.isArray(t)){const e=(t,i)=>t.reduceRight(((t,i)=>Array.isArray(i)?e(i,t):(t.add(i),t)),i),i=e(t,new Set),s=[];i.forEach((t=>s.unshift(t))),this._styles=s}else this._styles=void 0===t?[]:[t];this._styles=this._styles.map((t=>{if(t instanceof CSSStyleSheet&&!Q){const e=Array.prototype.slice.call(t.cssRules).reduce(((t,e)=>t+e.cssText),"");return new X(String(e),J)}return t}))}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?Q?this.renderRoot.adoptedStyleSheets=t.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map((t=>t.cssText)),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){const e=this.render();super.update(t),e!==Z&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach((t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)})))}render(){return Z}}Y.finalized=!0,Y.render=(t,i,s)=>{if(!s||"object"!=typeof s||!s.scopeName)throw new Error("The `scopeName` option is required.");const r=s.scopeName,n=C.has(i),o=L&&11===i.nodeType&&!!i.host,a=o&&!j.has(r),d=a?document.createDocumentFragment():i;if(N(t,d,Object.assign({templateFactory:O(r)},s)),a){const t=C.get(d);C.delete(d);const s=t.value instanceof m?t.value.template:void 0;D(r,d,s),e(i,i.firstChild),i.appendChild(d),C.set(i,t)}!n&&o&&window.ShadyCSS.styleElement(i.host)};let tt,et,it=t=>t;customElements.define("drop-area",class extends Y{constructor(){super(),this.images=[]}static get styles(){return K(tt||(tt=it`
			:host .container {
				opacity: .5;
				border-radius: 6px;
				padding: 6vw 12vh;
				box-sizing: border-box;
				text-align: center;
				border: 3px dashed #f4a374;
				border-radius: 6px;
				transition: .2s ease-in-out all;
				cursor: pointer;
			}

			:host input {
				display: none;
			}

			:host p {
				margin: 0;
				font-weight: bold;
				font-size: 24px;
				letter-spacing: 4px;
			}

			:host .hint {
				font-weight: 300;
				font-size: 18px;
				margin-top: 16px;
				opacity: .9;
			}

			:host form.is-dragover {
				opacity: 1;
				transition: .2s ease-in-out all;
			}

			:host form:hover {
				opacity: 1;
				transition: .2s ease-in-out all;
			}
		`))}render(){return I(et||(et=it`
			<form class="container" @click=${0}>
				<input type="file" multiple accept="image/*">
				<p>Drop your (original size) image(s) here!</p>
				<p class="hint">(or click here for upload)</p>
			</form>
		`),this.openUpload)}openUpload(){this.images.length||this.shadowRoot.querySelector("input").click()}onDrop(t){t.preventDefault(),t.stopPropagation(),this.onFiles(t)}onFiles(t){let e=t.dataTransfer||t.target;for(let t=0;t<e.files.length;t++){let i=URL.createObjectURL(e.files[t]);this.images.push(this.newImage(i))}window.on("drop",[...this.images]),this.images=[],this.requestUpdate()}firstUpdated(){let t=this.shadowRoot.querySelector("form");this.shadowRoot.querySelector(".container").addEventListener("drop",this.onDrop.bind(this)),this.shadowRoot.querySelector(".container").addEventListener("change",this.onFiles.bind(this)),["drag","dragstart","dragend","dragover","dragenter","dragleave","drop"].forEach((e=>{t.addEventListener(e,(t=>{t.preventDefault(),t.stopPropagation()}))})),["dragover","dragenter"].forEach((e=>{t.addEventListener(e,(()=>{t.classList.add("is-dragover")}))})),["dragleave","dragend","drop"].forEach((e=>{t.addEventListener(e,(()=>{t.classList.remove("is-dragover")}))}))}newImage(t){let e=new Image;return e.src=t,e}});let st,rt,nt,ot,at,dt,lt,ht,pt=t=>t;customElements.define("lospec-palette",class extends Y{constructor(){super(),this.page=0,this.active=!1,this.getPalette(),this.toggle=this.toggle.bind(this),this.max_colors=20,this.loading=!1}static get styles(){return K(st||(st=pt`
			:host * {
				font-family: 'Fredoka One', sans-serif;
			}

			:host .color-preview-box {
				width: 12px;
				height: 12px;
				cursor: pointer;
			}

			:host .color-preview {
				display: flex;
				margin-bottom: 8px;
			}

			:host p {
				cursor: pointer;
			}

			:host .pagination {
				display: flex;
			}

			:host .pagination .page {
				width: 42px;
				height: 52px;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
			}

			:host .pagination .page.active {
				font-weight: bolder;
    			font-size: 24px;
    			transition: .2s ease all;
			}

			:host .container {
				display: none;
				background: #2e2549;
				border-radius: 6px;
				height: 100%;
				box-sizing: border-box;
				padding: 20px;

				position: fixed;
				left: calc(2vh + 30px);
				bottom: calc(2vh + 40px);
				height: 80vh;
				width: 25vw;
				z-index: 1100;
			}

			:host .active {
				display: flex;
				flex-direction: column;
			}

			:host .list {
				display: flex;
				flex-direction: column;
				height: 70vh;
				overflow-y: scroll;
				width: 100%;
				overflow-x: hidden;
			}

			:host .loader-container {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 70vh;
				width: 100%;
			}
			
			:host .item p {
				font-family: 'Montserrat', sans-serif;
			}

			:host p {
				margin: 0;
				font-size: 18px;
				font-weight: bold;
			}

			:host a.user {
				text-decoration: none;
				color: #fffbd1;
				font-size: 14px;
			}

			:host a.user:hover {
				text-decoration: underline;	
			}

			:host .item {
				margin-bottom: 20px;
				padding-left: 0;
				transition: .2s ease all;
			}
			
			:host .item:hover {
				cursor: pointer;
				padding-left: 20px;
				transition: .2s ease all;
				transition-delay: .05s;
			}

			:host .item.active {
				padding-left: 20px;
				transition: .2s ease all;
			}
		`))}render(){return I(rt||(rt=pt`
			<div class="container ${0}">
				${0}
			</div>
		`),this.active?"active":"",this.loading?I(nt||(nt=pt`<div class="loader-container">
					<svg-loader></svg-loader>
				</div>`)):I(ot||(ot=pt`<div class="list">
					${0}
				</div>
				<div class="pagination">
					${0}
				</div>`),this.getList(),this.getPagination()))}setPage(t){this.page=t,this.loading=!0,this.requestUpdate(),this.getPalette()}getPalette(){fetch(`https://pixelutils.lolastud.io/lospec/palettes?colorNumberFilterType=min&page=${this.page}&tag=&sortingType=default&colorNumber=0`).then((t=>{t.json().then((t=>{this.palettes=t,this.total_pages=Math.ceil(t.totalCount/t.palettes.length),this.loading=!1,this.requestUpdate()})).catch((t=>{console.log(t),this.loading=!1,this.requestUpdate()}))}))}getList(){if(this.palettes){let r=this.palettes.palettes,n=[];for(let o of r){var t,e,i,s;n.push(I(at||(at=pt`
					<div class="item ${0}" @click=${0}>
						<div class="color-preview">
							${0}
						</div>
						<p>${0} (${0} colors)</p>
						<a title="Visit ${0} profile on lospec" class="user"
							href="https://lospec.com/${0}" target="_blank">by ${0}</a>
					</div>
				`),(null===(t=this.selected)||void 0===t?void 0:t._id)==o._id?"active":"",(()=>{this.setPalette(o)}),o.colorsArray.map((t=>I(dt||(dt=pt`<div class="color-preview-box" style="background: #${0};"></div>`),t))),o.title,o.colorsArray.length,null===(e=o.user)||void 0===e?void 0:e.name,null===(i=o.user)||void 0===i?void 0:i.slug,null===(s=o.user)||void 0===s?void 0:s.name))}return n}}getPagination(){let t=this.page+1;new Array(this.total_pages);let e=[];t>1&&e.push(I(lt||(lt=pt`<div class="page" @click=${0}>${0}</div>`),(()=>{this.setPage(this.page-1)}),t-1));for(let i=t;i<=t+5;i++)e.push(I(ht||(ht=pt`<div class="page ${0}" @click=${0}>${0}</div>`),i==t?"active":"",(()=>{this.setPage(i-1)}),i));return e}setPalette(t){this.selected=t,console.log(t),t.rgbaArray=[];for(let e of t.colorsArray)e=this.hexToRgbA(e),t.rgbaArray.push(e.join(","));document.querySelector("canvas-renderer").setPalette(t.rgbaArray),this.requestUpdate()}hexToRgbA(t){var e=t.match(/.{1,2}/g);return[parseInt(e[0],16),parseInt(e[1],16),parseInt(e[2],16)]}toggle(t){this.active=void 0!==t?t:!this.active,this.requestUpdate()}updated(){this.shadowRoot.querySelector(".list").scrollTop=0}});let ct,ut,mt,ft,gt,vt,wt=t=>t;customElements.define("frame-control",class extends Y{constructor(){super(),this.setImages=this.setImages.bind(this),this.setFrame=this.setFrame.bind(this),this.fps=12,this.tpf=1e3/this.fps,this.skip_frames=2,this.images=[],window.listen("real_tpf",(t=>{this.rfps=Math.ceil(1e3/t)})),window.listen("fps_change",this.setFPS.bind(this))}static get properties(){return{active:Boolean}}static get styles(){return K(ct||(ct=wt`
			:host {
				top: 2vh;
				position: fixed;
				left: 10vw;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 80vw;
				padding-top: 40px;
			}

			.list {
				height: 98px;
				overflow-x: scroll;
				display: flex;
				box-sizing: border-box;
				overflow-y: hidden
				-ms-overflow-style: none;  /* IE and Edge */
  				scrollbar-width: none;  /* Firefox */
			}

			.list::-webkit-scrollbar {
				display: none;
			}

			img, .extra {
				height: 10vh;
			}

			img {
				opacity: .3;
				box-sizing: border-box;
				width: 100%;
				height: 100%;
				object-fit: cover;
				border-radius: 5px;
			}

			.active {
				// background: #fafafa;
				border-radius: 5px;
			}

			.active img {
				opacity: 1;
			}

			.fps, .skip-frame {
				position: fixed;
				display: flex;
				flex-direction: column;
				top: 2vh;
				padding: 50px 30px;
			}

			.fps {
				right: 2vh;
			}

			.skip-frame {
				right: 2vh;
				top: 116px;
			}

			button {
				background: #2e2549;
				border-radius: 6px;
				border: none;
				text-transform: uppercase;
				font-weight: bold;
				box-sizing: border-box;
				padding: 10px 18px;
				cursor: pointer;
				margin: 0 10px;
				letter-spacing: 2px;
				height: 46px;
				color: #fffbd1
			}

			.round {
                border-radius: 50%;
                padding: 20px;
                width: 24px;
                height: 24px;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
				margin-top: 4px;
            }

            .round p {
                margin: 0;
            }

			p {
				margin: 0;
				transition: .2s ease all;
			}

			.fps p, .skip-frame p {
				width: 100%;
				text-align: center;
				font-size: 20px;
				text-transform: uppercase;
				font-weight: bold;
			}

			.buttons {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				width: 102px;
				margin-top: 10px;
			}

			.buttons button {
				margin: 0;
			}

			.__hidden {
				display: none;
			}

			:host .img-container {
				min-width: 98px;
				min-height: 98px;
				padding: 10px;
				box-sizing: border-box;
				position: relative;
			}

			.img-container:hover {
				cursor: pointer;
			}

			.img-container:hover img {
				opacity: 1;
			}

			.img-container p {
				position: absolute;
				width: 100%;
				text-align: center;
				bottom: 0;
				margin: 0;
				margin-left: -10px;
			}

			.fps-text {
				cursor: pointer;
				transition: .2s ease all;
				display: flex;
			}

			.fps-text:hover {
				transform: scale(1.05);
				transition: .2s ease all;
			}

			.fps-text input {
				width: 40px;
				margin-right: 4px;
				text-align: right;
				background: transparent;
				color: #fffbd1;
				font-family: 'Fredoka One', sans-serif;
				font-size: 20px;
				border: none;
			}
		`))}render(){return I(ut||(ut=wt`
			<div class="skip-frame ${0}">
				<p>skip ${0}</p>
				<div class="buttons">
					<button class="round __small" @click=${0}>-</button>
					<button class="round __small" @click=${0}>+</button>
				</div>
			</div>
			<div class="list">
				${0}
			</div>
			<div class="fps ${0}">
				<div class="fps-text">
					${0}					
				</div>
				<!-- <p>real fps: ${0}</p> -->
				<div class="buttons">
					<button class="round" @click=${0}>-</button>
					<button class="round" @click=${0}>+</button>
				</div>
			</div>

		`),this.images.length>1?"":"__hidden",this.skip_frames-1,this.subSkip,this.addSkip,this.getList(),this.images.length>1?"":"__hidden",this.editing_fps?I(mt||(mt=wt`
							<input @keydown=${0} placeholder="xx.x" value="${0}">
							<p>fps</p>
						`),this.onFPSInputKey,this.fps):I(ft||(ft=wt`<p title="click to edit fps" @click=${0}>${0} fps</p>`),this.editFPS,this.fps),this.rfps,this.subFPS,this.addFPS)}onFPSInputKey(t,e){if(t&&13===t.keyCode||e){if(this.shadowRoot.querySelector(".fps-text input")){let t=this.shadowRoot.querySelector(".fps-text input").value;isNaN(t)||this.setFPS(+t,!0),this.editing_fps=!1,this.requestUpdate()}}}getList(){var t;let e=[];for(let t=0;t<this.images.length;t++)e.push(I(gt||(gt=wt`<div @click=${0} class="img-container ${0}">
				<img src="${0}" />
				<p>${0}</p>
			</div>`),(()=>{this.setFrame(t,!0)}),this.actual_frame==t?"active":"",this.images[t].src,t+1));let i=null===(t=this.shadowRoot.querySelector(".img-container"))||void 0===t?void 0:t.clientWidth;if(i){let t=Math.floor(.8*window.innerWidth/i/2),s=I(vt||(vt=wt`<div class="extra" style="min-width: ${0}px;"></div>`),i);for(let i=0;i<t;i++)e.unshift(s),e.push(s)}return e}updated(){this.setOffset()}setOffset(){var t;let e=+(null===(t=this.shadowRoot.querySelector(".img-container"))||void 0===t?void 0:t.clientWidth)||0;this.shadowRoot.querySelector(".list").scroll({left:this.actual_frame*e-e/4||0,top:0})}addFPS(){this.fps+=1,this.tpf=1e3/this.fps,window.on("fps_change",this.fps),this.requestUpdate()}subFPS(){this.fps-=1,this.fps=this.fps>0?this.fps:0,this.tpf=1e3/this.fps,window.on("fps_change",this.fps),this.requestUpdate()}addSkip(){this.skip_frames+=1,window.on("skip_frames_change",this.skip_frames),this.requestUpdate()}subSkip(){this.skip_frames-=1,this.skip_frames=this.skip_frames>1?this.skip_frames:1,window.on("skip_frames_change",this.skip_frames),this.requestUpdate()}setFPS(t,e){this.fps=t,this.tpf=1e3/this.fps,e&&window.on("fps_change",this.fps)}setFrame(t,e){this.actual_frame=t,e&&window.on("frame_set",t),this.requestUpdate()}setImages(t){this.images=t,this.requestUpdate()}editFPS(){this.editing_fps=!0,this.requestUpdate(),setTimeout((()=>{console.log(this.shadowRoot.querySelector(".fps-text").children),this.shadowRoot.querySelector(".fps-text input").focus()}),0)}});var yt=Math.sqrt,_t=Math.pow,bt=Math.cos,xt=Math.atan2,St=Math.sin,kt=Math.abs,Pt=Math.exp,Tt=Math.PI;function zt(t,e){t=qt(t),e=qt(e);var i=t.L,s=t.a,r=t.b,n=e.L,o=e.a,a=e.b,d=yt(_t(s,2)+_t(r,2)),l=yt(_t(o,2)+_t(a,2)),h=(d+l)/2,p=.5*(1-yt(_t(h,7)/(_t(h,7)+_t(25,7)))),c=(1+p)*s,u=(1+p)*o,m=yt(_t(c,2)+_t(r,2)),f=yt(_t(u,2)+_t(a,2)),g=Et(r,c),v=Et(a,u),w=n-i,y=f-m,_=function(t,e,i,s){if(t*e==0)return 0;if(kt(s-i)<=180)return s-i;if(s-i>180)return s-i-360;if(s-i<-180)return s-i+360;throw new Error}(d,l,g,v),b=2*yt(m*f)*St($t(_)/2),x=(i+n)/2,S=(m+f)/2,k=function(t,e,i,s){if(t*e==0)return i+s;if(kt(i-s)<=180)return(i+s)/2;if(kt(i-s)>180&&i+s<360)return(i+s+360)/2;if(kt(i-s)>180&&i+s>=360)return(i+s-360)/2;throw new Error}(d,l,g,v),P=1-.17*bt($t(k-30))+.24*bt($t(2*k))+.32*bt($t(3*k+6))-.2*bt($t(4*k-63)),T=30*Pt(-_t((k-275)/25,2)),z=yt(_t(S,7)/(_t(S,7)+_t(25,7))),$=1+.015*_t(x-50,2)/yt(20+_t(x-50,2)),E=1+.045*S,q=1+.015*S*P,C=-2*z*St($t(2*T));return yt(_t(w/(1*$),2)+_t(y/(1*E),2)+_t(b/(1*q),2)+C*(y/(1*E))*(b/(1*q)))}function $t(t){return t*(Tt/180)}function Et(t,e){if(0===t&&0===e)return 0;var i=xt(t,e)*(180/Tt);return i>=0?i:i+360}function qt(t){return function(t){var e=100,i=108.883,s=95.047,r=t.Y/e,n=t.Z/i,o=t.X/s;o=o>.008856?_t(o,1/3):7.787*o+16/116;r=r>.008856?_t(r,1/3):7.787*r+16/116;n=n>.008856?_t(n,1/3):7.787*n+16/116;return{L:116*r-16,a:500*(o-r),b:200*(r-n)}}(function(t){var e=(t=function(t){var e={R:t.R||t.r||0,G:t.G||t.g||0,B:t.B||t.b||0};void 0===t.a&&void 0===t.A||(e.A=t.A||t.a||0);return e}(t)).R/255,i=t.G/255,s=t.B/255;e>.04045?e=_t((e+.055)/1.055,2.4):e/=12.92;i>.04045?i=_t((i+.055)/1.055,2.4):i/=12.92;s>.04045?s=_t((s+.055)/1.055,2.4):s/=12.92;return{X:.4124*(e*=100)+.3576*(i*=100)+.1805*(s*=100),Y:.2126*e+.7152*i+.0722*s,Z:.0193*e+.1192*i+.9505*s}}(t))}const Ct=void 0===Number.MAX_SAFE_INTEGER?9007199254740991:Number.MAX_SAFE_INTEGER,Nt=new WeakMap;var At;const It=((t,e)=>i=>{const s=e.get(i);let r=void 0===s?i.size:s<1073741824?s+1:0;if(!i.has(r))return t(i,r);if(i.size<536870912){for(;i.has(r);)r=Math.floor(1073741824*Math.random());return t(i,r)}if(i.size>Ct)throw new Error("Congratulations, you created a collection of unique numbers which uses all available integers!");for(;i.has(r);)r=Math.floor(Math.random()*Ct);return t(i,r)})((At=Nt,(t,e)=>(At.set(t,e),e)),Nt);let Mt=null;const Ut=((t,e)=>()=>{if(null!==Mt)return Mt;const i=new Blob([e],{type:"application/javascript; charset=utf-8"}),s=URL.createObjectURL(i);return Mt=t(s),Mt.setTimeout((()=>URL.revokeObjectURL(s)),0),Mt})((t=>{const e=new Map([[0,()=>{}]]),i=new Map([[0,()=>{}]]),s=new Map,r=new Worker(t);r.addEventListener("message",(({data:t})=>{if(void 0!==(r=t).method&&"call"===r.method){const{params:{timerId:r,timerType:n}}=t;if("interval"===n){const t=e.get(r);if("number"==typeof t){const e=s.get(t);if(void 0===e||e.timerId!==r||e.timerType!==n)throw new Error("The timer is in an undefined state.")}else{if(void 0===t)throw new Error("The timer is in an undefined state.");t()}}else if("timeout"===n){const t=i.get(r);if("number"==typeof t){const e=s.get(t);if(void 0===e||e.timerId!==r||e.timerType!==n)throw new Error("The timer is in an undefined state.")}else{if(void 0===t)throw new Error("The timer is in an undefined state.");t(),i.delete(r)}}}else{if(!(t=>null===t.error&&"number"==typeof t.id)(t)){const{error:{message:e}}=t;throw new Error(e)}{const{id:r}=t,n=s.get(r);if(void 0===n)throw new Error("The timer is in an undefined state.");const{timerId:o,timerType:a}=n;s.delete(r),"interval"===a?e.delete(o):i.delete(o)}}var r}));return{clearInterval:t=>{const i=It(s);s.set(i,{timerId:t,timerType:"interval"}),e.set(t,i),r.postMessage({id:i,method:"clear",params:{timerId:t,timerType:"interval"}})},clearTimeout:t=>{const e=It(s);s.set(e,{timerId:t,timerType:"timeout"}),i.set(t,e),r.postMessage({id:e,method:"clear",params:{timerId:t,timerType:"timeout"}})},setInterval:(t,i)=>{const s=It(e);return e.set(s,(()=>{t(),"function"==typeof e.get(s)&&r.postMessage({id:null,method:"set",params:{delay:i,now:performance.now(),timerId:s,timerType:"interval"}})})),r.postMessage({id:null,method:"set",params:{delay:i,now:performance.now(),timerId:s,timerType:"interval"}}),s},setTimeout:(t,e)=>{const s=It(i);return i.set(s,t),r.postMessage({id:null,method:"set",params:{delay:e,now:performance.now(),timerId:s,timerType:"timeout"}}),s}}}),'(()=>{"use strict";const e=new Map,t=new Map,r=(e,t)=>{let r,o;const i=performance.now();r=i,o=e-Math.max(0,i-t);return{expected:r+o,remainingDelay:o}},o=(e,t,r,i)=>{const s=performance.now();s>r?postMessage({id:null,method:"call",params:{timerId:t,timerType:i}}):e.set(t,setTimeout(o,r-s,e,t,r,i))};addEventListener("message",(({data:i})=>{try{if("clear"===i.method){const{id:r,params:{timerId:o,timerType:s}}=i;if("interval"===s)(t=>{const r=e.get(t);if(void 0===r)throw new Error(\'There is no interval scheduled with the given id "\'.concat(t,\'".\'));clearTimeout(r),e.delete(t)})(o),postMessage({error:null,id:r});else{if("timeout"!==s)throw new Error(\'The given type "\'.concat(s,\'" is not supported\'));(e=>{const r=t.get(e);if(void 0===r)throw new Error(\'There is no timeout scheduled with the given id "\'.concat(e,\'".\'));clearTimeout(r),t.delete(e)})(o),postMessage({error:null,id:r})}}else{if("set"!==i.method)throw new Error(\'The given method "\'.concat(i.method,\'" is not supported\'));{const{params:{delay:s,now:n,timerId:a,timerType:d}}=i;if("interval"===d)((t,i,s)=>{const{expected:n,remainingDelay:a}=r(t,s);e.set(i,setTimeout(o,a,e,i,n,"interval"))})(s,a,n);else{if("timeout"!==d)throw new Error(\'The given type "\'.concat(d,\'" is not supported\'));((e,i,s)=>{const{expected:n,remainingDelay:a}=r(e,s);t.set(i,setTimeout(o,a,t,i,n,"timeout"))})(s,a,n)}}}}catch(e){postMessage({error:{message:e.message},id:i.id,result:null})}}))})();');let Ft,Rt,Lt,Ot,Vt=t=>t;customElements.define("canvas-renderer",class extends Y{constructor(){super(),this.tmpcanvas=document.createElement("canvas"),this.tmpctx=this.tmpcanvas.getContext("2d"),this.zoom=2,this.mapped={},this.mapped_quantized={},this.colorMap={},this.images=[],this.frame=0,this.last_delta=0,this.fps=12,this.tpf=1e3/this.fps,this.max_colors=24,this.colorThief=new ColorThief,this.skip_frames=2,this.active=!0,this.draw=this.draw.bind(this),this.setImages=this.setImages.bind(this),this.animate=this.animate.bind(this),this.setPalette=this.setPalette.bind(this),this.zoomOut=this.zoomOut.bind(this),this.zoomIn=this.zoomIn.bind(this),this.renderGIF=this.renderGIF.bind(this),this.saveFrame=this.saveFrame.bind(this),this.setFrame=this.setFrame.bind(this),this.setPlayerState=this.setPlayerState.bind(this),this.setDither=this.setDither.bind(this),this.animate=this.animate.bind(this),this.renderFrames=this.renderFrames.bind(this),this.quantizing_queue={},this.background=!1,this.transformed={},window.listen("fps_change",this.setFPS.bind(this)),window.listen("skip_frames_change",this.setSkip.bind(this)),window.listen("background_change",(t=>{this.background=t})),window.listen("dither_change",this.setDither),this.dither=!0,this.bayer8=[[0,32,8,40,2,34,10,42],[48,16,56,24,50,18,58,26],[12,44,4,36,14,46,6,38],[60,28,52,20,62,30,54,22],[3,35,11,43,1,33,9,41],[51,19,59,27,49,17,57,25],[15,47,7,39,13,45,5,37],[63,31,55,23,61,29,53,21]],this.bayer4=[[0,8,2,10,0],[12,4,14,6,12],[3,11,1,9,3],[15,7,13,5,15]],this.bayer_size=4}static get styles(){return K(Ft||(Ft=Vt`
			:host canvas, :host img {
				image-rendering: -moz-crisp-edges;
				image-rendering: -webkit-crisp-edges;
				image-rendering: pixelated;
			}

			:host canvas {
				transform: scale(1);
				transform-origin: 0 0;
			}

			:host .__hidden { 
				display: none !important;
			}

			:host .container {
				border-radius: 6px;
				// background: #fafafa;
				padding: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;	
			}

			:host p {
				position: absolute;
				bottom: -38px;
				right: 0;
			}
		`))}setImages(t){this.images=t;for(let t=0;t<this.images.length;t++)this.images[t].id||(this.images[t].id=Math.random().toString(36),this.mapped[this.images[t].id]={});window.animation_active=!0,this.images.length<12&&(this.setFPS(this.images.length),window.on("fps_change",this.fps)),window.on("updateApp"),this.animate(this.last_delta,!0),this.requestUpdate()}setFPS(t){this.fps=t,this.tpf=1e3/this.fps}setSkip(t){this.skip_frames=t}render(){return I(Rt||(Rt=Vt`
			<div class="container ${0}">
				<canvas></canvas>
				${0}
			</div>
		`),window.animation_active?"":"__hidden",this.frameDebug())}frameDebug(){var t,e;return!this.quantized||null!==(t=this.transformed[null===(e=this.actual_image)||void 0===e?void 0:e.id])&&void 0!==t&&t.quantized?I(Ot||(Ot=Vt`<p>(${0})</p>`),this.frame+1):I(Lt||(Lt=Vt`<p>Processing frame (${0})</p>`),this.frame+1)}firstUpdated(){this.canvas=this.shadowRoot.querySelector("canvas"),this.ctx=this.canvas.getContext("2d"),this.animate()}draw(t){this.checkImg(t,(()=>{this.updateCanvasSize(t),this.tmpctx.clearRect(0,0,t.width,t.height),this.tmpctx.drawImage(t,0,0),this.classify(t),this.drawMapped(t)}))}classify(t){if(this.transformed[t.id]||(this.transformed[t.id]=this.tmpctx.getImageData(0,0,t.width,t.height)),this.quantized&&!this.transformed[t.id].quantized&&!this.quantizing_queue[t.id]){this.quantizing_queue[t.id]=!0;let e=this.tmpctx.getImageData(0,0,t.width,t.height).data;for(let i=0;i<t.height;++i)for(let s=0;s<t.width;++s){let r=4*(i*t.width+s),[n,o,a,d]=[e[r],e[r+1],e[r+2],e[r+3]];if(this.dither){let e=this.bayer4[s%this.bayer_size][i%this.bayer_size];n=+n+e,o=+o+e,a=+a+e,[n,o,a]=this.getQuantized(n,o,a),this.transformed[t.id].data[r]=n,this.transformed[t.id].data[r+1]=o,this.transformed[t.id].data[r+2]=a,this.transformed[t.id].data[r+3]=d}else[n,o,a]=this.getQuantized(n,o,a),this.transformed[t.id].data[r]=n,this.transformed[t.id].data[r+1]=o,this.transformed[t.id].data[r+2]=a,this.transformed[t.id].data[r+3]=d}setTimeout((()=>{this.transformed[t.id].quantized=!0}),0)}return this.transformed[t.id]}drawMapped(t){this.ctx.putImageData(this.resize(this.transformed[t.id],t.width*this.zoom,t.height*this.zoom),0,0)}resize(t,e,i){let s,r,n,o=new ImageData(e,i),a=t.width/e,d=t.height/i,l=0;for(r=0;r<i;r++)for(n=(r*d|0)*t.width,s=0;s<e;s++){let e=n+s*a<<2;o.data[l]=t.data[e],o.data[l+1]=t.data[e+1],o.data[l+2]=t.data[e+2],o.data[l+3]=this.background?255:t.data[e+3],l+=4}return o}quantize(t){window.showLoader((()=>{if(this.classified||this.classifyColors(),this.quantized=!0,t)try{t()}catch(t){}window.hideLoader(),this.animate(this.last_delta,!0)}))}classifyColors(){let t={};for(let e of this.images){let i=this.colorThief.getPalette(e,this.max_colors,1);for(let e of i||[]){let i=e.join(",");t[i]||(t[i]=0),t[i]++}}this.analyzeColors(t)}analyzeColors(t){let e=[];for(let i in t){let s=t[i];e.push({color:i,total:s,array_color:i.split(",")})}e.sort(((t,e)=>e.total-t.total)),e.length<this.max_colors&&(this.max_colors=e.length),this.colors_ordered=e,this.classified=!0}getQuantized(t,e,i){let s=[t,e,i].join(","),r=this.colorMap[s];if(r)return r;{let r={};for(let s=0;s<this.max_colors;s++){let n=this.colors_ordered[s].array_color;r[this.colors_ordered[s].color]=zt({r:t,g:e,b:i},{r:+n[0],g:+n[1],b:+n[2]})}let n={color:[t,e,i].join(","),total:1/0};for(let t in r)r[t]<n.total&&(n={color:t,total:r[t]});let o=n.color.split(",");return this.colorMap[s]=o,o}}updateCanvasSize(t){this.canvas.width=t.width*this.zoom,this.canvas.height=t.height*this.zoom,this.tmpcanvas.width=t.width,this.tmpcanvas.height=t.height}checkImg(t,e){t&&(t.complete?e():t.onload=e)}animate(t,e){var i,s,r;if(e||(void 0!==this.wtimeout&&(r=this.wtimeout,Ut().clearTimeout(r)),this.wtimeout=(i=this.animate,s=this.rendering?0:this.tpf,Ut().setTimeout(i,s))),this.rendering&&(e=!0),this.actual_image=this.images[this.frame],window.on("frame",this.frame),window.on("real_tpf",t-this.last_delta),this.last_delta=t,this.requestUpdate(),this.draw(this.actual_image),0==this.frame&&this.rendering&&!this.capturing&&(this.capturer.start(),this.capturing=!0),this.rendering_frames&&this.zip.file(`${this.frame}.png`,this.canvas.toDataURL().split("base64,")[1],{base64:!0}),this.rendering&&this.capturing&&this.capturer.capture(this.canvas),this.frame>=this.images.length-1)this.rendering&&(this.rendering=!1,this.capturing=!1,this.stopped=!0,this.mime.split("webm").length>1&&this.capturer.capture(this.canvas),this.capturer.stop(),this.capturer.save((t=>{window.hideLoader(),download(t,this.capturer_options.name+(this.mime.split("webm").length>1?".webm":""),this.mime),this.stopped=!1,window.requestAnimationFrame(this.animate)}))),this.rendering_frames&&(this.rendering_frames=!1,this.zip.generateAsync({type:"blob"}).then((t=>{saveAs(t,`frames_skip${this.skip_frames-1}_${(""+this.fps).split(".").join("-")}fps_${window.getDate()}.zip`),window.hideLoader()}))),this.frame=0;else{var n;if(this.quantized&&this.actual_image&&(null===(n=this.transformed[this.actual_image.id])||void 0===n||!n.quantized))return;this.active&&(this.frame+=this.skip_frames)}}setPalette(t){if(this.palette=t,this.quantized){let e=this.active;this.setPlayerState(!1),window.showLoader((()=>{let i=[];for(let e of t)i.push({color:e,total:1,array_color:e.split(",")});this.colors_ordered=i,this.max_colors=t.length,this.colorMap={},this.mapped_quantized={},this.resetQuantization(),this.setPlayerState(e),this.animate(this.last_delta,!0),window.hideLoader()}))}else this.quantize((()=>{this.setPalette(t)}));window.on("palette_change",this.palette)}classifyAll(t,e){this.images[t]?(this.frame++,this.animate(this.last_delta,!0),setTimeout((()=>{this.classify(this.images[t]),t++,this.classifyAll(t,e)}),0)):e&&e()}resetQuantization(){this.colorMap={},this.quantizing_queue={};for(let t in this.transformed)this.transformed[t].quantized=!1}zoomIn(){this.zoom*=2,this.zoom=parseInt(this.zoom),this.animate(this.last_delta,!0),this.requestUpdate()}zoomOut(){this.zoom/=2,this.zoom=parseInt(this.zoom),this.zoom=this.zoom>=1?this.zoom:1,this.animate(this.last_delta,!0),this.requestUpdate()}renderGIF(){this.mime="image/gif",window.showLoader(),this.capturer_options={framerate:parseInt(this.fps),frameDuration:this.tpf,format:"gif",workersPath:"web_modules/",quality:10,name:`output_skip${this.skip_frames-1}_${(""+this.fps).split(".").join("-")}fps_${window.getDate()}`},this.capturer=new CCapture(this.capturer_options),this.frame=0,this.rendering=!0}renderWEBM(){this.mime="video/webm",window.showLoader(),this.capturer_options={framerate:parseInt(this.fps),format:"webm",name:`output_skip${this.skip_frames-1}_${(""+this.fps).split(".").join("-")}fps_${window.getDate()}`},this.capturer=new CCapture(this.capturer_options),this.frame=0,this.rendering=!0}saveFrame(){let t=this.canvas.toDataURL("image/png").replace("image/png","image/octet-stream"),e=document.createElement("a");e.setAttribute("download",`${this.frame}_${window.getDate()}.png`),e.setAttribute("href",t),e.click()}setFrame(t){this.frame=t,this.animate(this.last_delta,!0)}setPlayerState(t){this.active=t}setDither(t){this.dither=t,this.resetQuantization()}setPaletteLimit(t){this.max_colors=t,this.quantized&&!this.palette&&(this.classified=!1,this.quantize((()=>{this.resetQuantization()})))}renderFrames(){window.showLoader(),this.zip=new JSZip,this.rendering_frames=!0,this.frame=0}});let jt,Dt,Bt=t=>t;customElements.define("svg-loader",class extends Y{constructor(){super()}static get styles(){return K(jt||(jt=Bt`
		.spinner {
		  -webkit-animation: rotation 1s linear infinite;
		  animation: rotation 1s linear infinite;
		}
		
		@-webkit-keyframes rotation {
		  0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		  }
		
		  100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		  }
		}
		
		@keyframes rotation {
		  0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		  }
		
		  100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		  }
		}
		
		.circle {
		  stroke-dasharray: 187;
		  stroke-dashoffset: 0;
		  -webkit-transform-origin: center;
		  -ms-transform-origin: center;
		  transform-origin: center;
		  -webkit-animation: turn 1.4s ease-in-out infinite;
		  animation: turn 1.4s ease-in-out infinite;
		}
		
		@-webkit-keyframes turn {
		  0% {
			stroke-dashoffset: 180;
		  }
		
		  50% {
			stroke-dashoffset: 45;
			-webkit-transform: rotate(180deg);
			transform: rotate(180deg);
		  }
		
		  100% {
			stroke-dashoffset: 180;
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		  }
		}
		
		@keyframes turn {
		  0% {
			stroke-dashoffset: 180;
		  }
		
		  50% {
			stroke-dashoffset: 45;
			-webkit-transform: rotate(180deg);
			transform: rotate(180deg);
		  }
		
		  100% {
			stroke-dashoffset: 180;
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		  }
		}
		
		svg{
			stroke: #fffbd1;
		}
		`))}render(){return I(Dt||(Dt=Bt`
			<svg class="spinner" width="66px" height="66px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
				<circle class="circle" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
			</svg>
		`))}});let Wt,Ht,Gt=t=>t;customElements.define("options-button",class extends Y{constructor(){super(),this.c=[],this.disable=this.disable.bind(this)}static get styles(){return K(Wt||(Wt=Gt`
			:host {
				position: relative;
			}

			button {
				background: #2e2549;
				border-radius: 6px;
				border: none;   
				text-transform: uppercase;
				font-weight: bold;
				box-sizing: border-box;
				padding: 10px 18px;
				cursor: pointer;
				margin: 0 10px;
				letter-spacing: 2px;
				height: 46px;
				transition: all ease .2s;
				outline: none;
				width: 196px;
				padding-right: 28px;
				transform: scale(1);
                transition: all ease .2s;
			}

			* {
				color: #fffbd1;
				font-family: 'Fredoka One', sans-serif;
			}

			.menu {
				position: absolute;
				// top: -46px;
				background: #2e2549;
				border-top-left-radius: 6px;
				border-top-right-radius: 6px;
				margin: 0px 10px;
				width: 196px;
				height: 0;
				opacity: 0;
				bottom: 46px;
				z-index: -1;
			}

			.menu.__active {
				height: auto;
				opacity: 1;
				z-index: 1;
			}

			.menu button {
				margin: 0;
			}

			.chevron {
				width: 24px;
				border-left: 2px solid #1b1829;
				position: absolute;
				right: 10px;
				height: 46px;
				bottom: 0;
				z-index: 100;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				box-sizing: border-box;
			}

			button:hover {
				transform: scale(1.05);
                transition: all ease .2s;
			}

			.chevron:hover {
				transform: scale(1.1);
			}

			.chevron svg {
				transform: scale(1.1);
			}

			.menu button:hover {

			}

			.menu button {
				border-bottom: 2px solid #1b1829;
				border-radius: 0;
				z-index: 200;
				border-top-left-radius: 6px;
				border-top-right-radius: 6px;
				padding: 10px;
			}
		`))}render(){return I(Ht||(Ht=Gt`
			${0}
			<div class="chevron" @click=${0}>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical"
					viewBox="0 0 16 16">
					<path
						d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z">
					</path>
				</svg>
			</div>
			<div class="menu ${0}">
				${0}
			</div>
		`),this.active_item,this.toggle,this.active?"__active":"",this.getMenu())}disable(){this.active=!1,this.requestUpdate()}toggle(){this.active=!this.active,this.requestUpdate()}firstUpdated(){for(let t=0;t<this.children.length;t++)this.children[t].addEventListener("click",(()=>{this.active=!1,this.changeActiveItem(t)})),this.children[t].id=Math.random().toString(36),this.c.push(this.children[t]);this.active_item=this.c[0],this.requestUpdate()}changeActiveItem(t){this.active_item=this.c[t],this.requestUpdate()}getMenu(){let t=[];for(let e=0;e<this.c.length;e++)this.c[e].id!==this.active_item.id&&t.push(this.c[e]);return t}});let Qt,Jt,Xt,Kt=t=>t;customElements.define("palette-renderer",class extends Y{constructor(){super(),this.palette=[],window.listen("palette_change",(t=>{console.log(t),this.palette=t,this.requestUpdate()}))}static get styles(){return K(Qt||(Qt=Kt`
			:host {
				position: fixed;
				left: 2vw;
				top: 2vh;
				padding: 50px 30px;
			}

			:host .container {
				width: 51px;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				
			}

			:host .item {
				width: 15px;
				height: 15px;
				border-radius: 3px;
				margin-right: 2px;
				margin-bottom: 2px;
			}
		`))}render(){return I(Jt||(Jt=Kt`
			<div class="container">
				${0}
			</div>
		`),this.getPalette())}getPalette(){let t=[];for(let e of this.palette)t.push(I(Xt||(Xt=Kt`<div class="item" style="background: rgb(${0});"></div>`),e));return t}});let Zt,Yt,te,ee,ie,se,re,ne=t=>t,oe=0,ae=!0,de={background:!1,dither:!0},le=24;function he(){return re||(re=document.querySelector("canvas-renderer")),re}function pe(){he().quantize()}function ce(){he().zoomOut()}function ue(){he().zoomIn()}function me(){he().renderGIF()}function fe(){he().renderWEBM()}function ge(){he().renderFrames()}function ve(){he().saveFrame()}function we(){setTimeout((()=>{var t;null===(t=document.querySelector("lospec-palette"))||void 0===t||t.toggle()}),0)}function ye(){ae=!ae,he().setPlayerState(ae),be()}function _e(t){le+=t,le=le>=2?le:2,he().setPaletteLimit(le),be()}function be(){N(I(Zt||(Zt=ne`
        <style>
            button {
                background: #2e2549;
                border-radius: 6px;
                border: none;   
                text-transform: uppercase;
                font-weight: bold;
                box-sizing: border-box;
                padding: 10px 18px;
                cursor: pointer;
                margin: 0 10px;
                letter-spacing: 2px;
                height: 46px;
                transition: all ease .2s;
                outline: none;
            }

            .fixed-buttons {
                position: fixed;
                display: flex;
                bottom: 2vh;
                padding: 40px;
                box-sizing: border-box;
                align-items: center;
                z-index: 1000;
            }

            .fixed-buttons-right {
                position: fixed;
                display: flex;
                bottom: 2vh;
                right: 2vh;
                padding: 0 30px 40px 30px;
                z-index: 10;
            }

            .fixed-buttons-left {
                position: fixed;
                display: flex;
                bottom: 2vh;
                left: 2vh;
                padding: 40px 30px;
            }

            .round {
                border-radius: 50%;
                padding: 20px;
                width: 54px;
                height: 54px;
                font-size: 42px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .round p {
                margin: 0;
                width: 24px;
                height: 54px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding-bottom: 8px;
                padding-left: 1px;
            }

            .round.minus p {
                padding-bottom: 9px;
            }

            .no-outline {
                border: none;
                outline: none;
            }

            .floating-options {
                position: fixed;
                bottom: calc(2vh + 106px);
                right: calc(2vh + 40px);
                text-align: right;
            }

            .floating-options p {
                opacity: .2;
                transition: .2s ease all;
                margin: 0;
            }

            .floating-options p:hover {
                opacity: .75;
                transition: .1s ease all;
                cursor: pointer;
            }

            .floating-options p.__active {
                opacity: 1;
                transition: .2s ease all;
                cursor: pointer;
            }
            
            .color-palette-limit {
                position: relative;
                display: flex;
                margin-left: 8px;
            }

            .chevron {
                position: absolute;
                cursor: pointer;
                transition: all ease .2s;
            }

            .chevron:hover {
                transform: scale(1.2);
                transition: all ease .2s;
            }

            .chevron.up{
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 0 10px 15px 10px;
                border-color: transparent transparent #2e2549 transparent;
                top: -2px;
            }

            .chevron.down {
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 15px 10px 0 10px;
                border-color: #2e2549 transparent transparent transparent;
                bottom: -2px;
            }

            button:hover {
                transform: scale(1.05);
                transition: all ease .2s;
            }

            button.round:hover {
                transform: scale(1.2);
            }
        </style>
        <canvas-renderer></canvas-renderer>
        <frame-control active=${0}></frame-control>
        <palette-renderer></palette-renderer>
        ${0}
    `),oe>1,window.animation_active?I(Yt||(Yt=ne`
        <lospec-palette></lospec-palette>

        <div class="fixed-buttons-left">
            <button class="no-outline" @click=${0}>Palettes</button>
        </div>

        <div class="fixed-buttons">
            <button class="round" @click=${0}><img src="${0}"></button>
            <button class="round minus" @click=${0}><p>-</p></button>
            <button class="round" @click=${0}><p>+</p></button>
            <button @click=${0}>Quantize colors!</button>
            <div class="color-palette-limit">
                <div class="chevron up" @click=${0}></div>
                <p class="limit">${0} colors</p>
                <div class="chevron down" @click=${0}></div>
            </div>
        </div>

        <div class="fixed-buttons-right">
            <options-button>
                ${0}
                <button @click=${0}>Save Frame</button>
                ${0}
                ${0}
            </options-button>
        </div>

        <div class="floating-options">
            <p title="the dithering will be applied only on quantized palettes" class="${0}" @click=${0}>
                ordered dithering ${0}
            </p>
            <p title="exclude / include rgba alpha channel" class="${0}" @click=${0}>
                transparency ${0}
            </p>
        </div>

        `),we,ye,ae?"pause.svg":"play.svg",ce,ue,pe,(()=>{_e(1)}),le,(()=>{_e(-1)}),oe>1?I(te||(te=ne`<button @click=${0}>Export GIF</button>`),me):"",ve,oe>1?I(ee||(ee=ne`<button @click=${0}>Export Frames</button>`),ge):"",oe>1?I(ie||(ie=ne`<button @click=${0}>Export WEBM</button>`),fe):"",de.dither?"__active":"",(()=>xe("dither")),de.dither?"on":"off",de.background?"":"__active",(()=>xe("background")),de.background?"off":"on"):I(se||(se=ne`<drop-area></drop-area>`))),document.querySelector(".app"))}function xe(t){de[t]=!de[t],window.on(`${t}_change`,de[t]),be()}be(),window.addEventListener("click",(t=>{var e,i,s;"LOSPEC-PALETTE"!=t.target.nodeName&&(null===(e=document.querySelector("lospec-palette"))||void 0===e||e.toggle(!1));"FRAME-CONTROL"!=t.target.nodeName&&(null===(i=document.querySelector("frame-control"))||void 0===i||i.onFPSInputKey(null,!0));"OPTIONS-BUTTON"!=t.target.nodeName&&(null===(s=document.querySelector("options-button"))||void 0===s||s.disable())})),window.listen("updateApp",be),window.listen("drop",(t=>{oe=t.length,be()})),window.listen("frame_set",(function(t){he().setFrame(t)})),window.listen("drop",(t=>{var e,i;null===(e=document.querySelector("canvas-renderer"))||void 0===e||e.setImages(t),null===(i=document.querySelector("frame-control"))||void 0===i||i.setImages(t)})),window.listen("frame",(t=>{var e;null===(e=document.querySelector("frame-control"))||void 0===e||e.setFrame(t)}));
