!function(t){var e={};function o(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=t,o.c=e,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)o.d(n,s,function(e){return t[e]}.bind(null,s));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=13)}({13:function(t,e,o){o(20),t.exports=o(14)},14:function(t,e,o){},20:function(t,e,o){"use strict";o.r(e);class n{constructor(t){this.el=t,this.$o={donateBox:t.querySelector(".rev-gen-contribution__donate"),customBox:{el:t.querySelector(".rev-gen-contribution__custom"),form:t.querySelector("form"),input:t.querySelector(".rev-gen-contribution-custom input"),backButton:t.querySelector(".rev-gen-contribution-custom__back"),send:t.querySelector(".rev-gen-contribution-custom__send")},amounts:t.getElementsByClassName("rev-gen-contribution__donation"),customAmount:t.querySelector(".rev-gen-contribution__donation--custom"),tip:t.querySelector(".rev-gen-contribution__tip")},this.bindEvents()}bindEvents(){for(const t of this.$o.amounts){const e=t.querySelector("a");if(!e)continue;e.addEventListener("mouseover",()=>{"ppu"===t.dataset.revenue?this.$o.tip.classList.remove("rev-gen-hidden"):this.$o.tip.classList.add("rev-gen-hidden")}),e.addEventListener("mouseout",()=>{this.$o.tip.classList.add("rev-gen-hidden")});new ResizeObserver(t=>{t.forEach(t=>{const e=t.target.dataset.breakpoints?JSON.parse(t.target.dataset.breakpoints):"";e&&Object.keys(e).forEach(o=>{const n=e[o],s="size-"+o;t.contentRect.width>=n?t.target.classList.add(s):t.target.classList.remove(s)})})}).observe(this.el)}this.$o.customAmount.addEventListener("click",t=>{t.preventDefault(),this.$o.donateBox.classList.add("rev-gen-hidden"),this.$o.customBox.el.classList.remove("rev-gen-hidden"),this.$o.customBox.el.removeAttribute("hidden"),this.$o.customBox.input.focus()}),this.$o.customBox.backButton.addEventListener("click",()=>{this.$o.customBox.el.classList.add("rev-gen-hidden"),this.$o.customBox.el.setAttribute("hidden",""),this.$o.donateBox.classList.remove("rev-gen-hidden")}),this.$o.customBox.input.addEventListener("change",()=>{this.validateAmount(),199>=this.getCustomAmount(!0)?this.$o.tip.classList.remove("rev-gen-hidden"):this.$o.tip.classList.add("rev-gen-hidden")}),this.$o.customBox.input.addEventListener("keyup",()=>{199>=this.getCustomAmount(!0)?this.$o.tip.classList.remove("rev-gen-hidden"):this.$o.tip.classList.add("rev-gen-hidden")}),this.$o.customBox.form.addEventListener("submit",t=>{t.preventDefault(),this.$o.customBox.send.classList.add("loading"),this.$o.customBox.send.setAttribute("disabled",!0);const e=this,o=new FormData(this.$o.customBox.form),n=new XMLHttpRequest;n.open("POST",this.$o.customBox.form.getAttribute("action"),!0),n.send(o),n.onreadystatechange=function(){if(4===this.readyState)if(e.$o.customBox.send.classList.remove("loading"),e.$o.customBox.send.removeAttribute("disabled"),200===this.status){const t=JSON.parse(this.response);t.data?(e.$o.customBox.form.classList.remove("error"),window.open(t.data)):e.$o.customBox.form.classList.add("error")}else e.$o.customBox.form.classList.add("error")}})}validateAmount(){let t=this.$o.customBox.input.value;return t=t.toString().replace(/[^0-9\,\.]/g,""),t="string"==typeof t&&t.indexOf(",")>-1?parseFloat(t.replace(",",".")):parseFloat(t),t=t.toFixed(2),isNaN(t)&&(t=.05),t=Math.abs(t),t>1e3?t=1e3:t<.05&&(t=.05),this.$o.customBox.input.value=t,t}getCustomAmount(t){let e=this.$o.customBox.input.value;return t&&(e*=100),e}}class s{constructor(t){this.$button={trigger:t.querySelector("button"),modal:t.querySelector(".rev-gen-contribution-modal")},this.$modal={el:""},this.bindButtonEvents()}bindButtonEvents(){this.$button.trigger.addEventListener("click",this.open.bind(this))}bindModalEvents(){this.$modal.closeButton.addEventListener("click",this.close.bind(this))}open(t){t.preventDefault();const e=this.$button.modal.cloneNode(!0);this.$modal.el=e,this.$modal.contributionEl=e.querySelector(".rev-gen-contribution"),this.$modal.closeButton=e.querySelector(".rev-gen-contribution-modal__close"),document.querySelector("body").appendChild(e),this.bindModalEvents(),this.initContributionRequest(),setTimeout((function(){e.classList.add("active")}),100)}initContributionRequest(){this.contributionInstance=new n(this.$modal.contributionEl)}close(t){t.preventDefault();const e=this.$modal.el;e.classList.remove("active"),setTimeout((function(){document.querySelector("body").removeChild(e)}),200)}}document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementsByClassName("rev-gen-contribution");for(const e of t)"button"!==e.dataset.type?new n(e):new s(e)})}});