// ============================================================================
// Hack.js
// ============================================================================
// A small JS library that will help you to do two thigs:
// =====================================================
// + Basic DOM manipulations.
// + Work with AJAX requests/responses.
// ============================================================================

// DOM
function $(id) { return document.getElementById(id); }
function byClass (el, cl) { return el ? el.getElementsByClassName(cl) : [] }
function byTag (el, tg) { return el ? el.getElementsByTagName(tg) : [] }
function allof (cl) { return byClass(document, cl) }
function hasClass (el, cl) { var a = el.className.split(' '); return afind(cl, a) }
function addClass (el, cl) { if (el) { var a = el.className.split(' '); if (!afind(cl, a)) { a.unshift(cl); el.className = a.join(' ')}} }
function remClass (el, cl) { if (el) { var a = el.className.split(' '); arem(a, cl); el.className = a.join(' ') } }
function html (el) { return el ? el.innerHTML : null; }
function attr (el, name) { return el.getAttribute(name) }
function tonum (x) { var n = parseFloat(x); return isNaN(n) ? null : n }
function remEl (el) { el.parentNode.removeChild(el) }
function posf (f, a) { for (var i=0; i < a.length; i++) { if (f(a[i])) return i; } return -1; }
function apos (x, a) { return (typeof x == 'function') ? posf(x,a) : Array.prototype.indexOf.call(a,x) }
function afind (x, a) { var i = apos(x, a); return (i >= 0) ? a[i] : null; }
function acut (a, m, n) { return Array.prototype.slice.call(a, m, n) }
function aeach (fn, a) { return Array.prototype.forEach.call(a, fn) }
function arem (a, x) { var i = apos(x, a); if (i >= 0) { a.splice(i, 1); } return a; }
function alast (a) { return a[a.length - 1] }
function vis(el, on) { if (el) { on ? remClass(el, 'nosee') : addClass(el, 'nosee') } }
function noshow (el) { addClass(el, 'noshow') }
function elShow (el) { remClass(el, 'noshow') }
function ind (el) { return (byTag(el, 'img')[0] || {}).width }

// AJAX
const HK_ERR_MSG = "Error. Request Failed.";
const defaultSuccessFn = (ajax) => { /* nada */; };
const defaultErrorFn   = (ajax) => { console.log(ajax); window.alert(HK_ERR_MSG); };

function setHeaders(ajax, token) {
	ajax.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	ajax.setRequestHeader("X-CSRF-Token", token);
}

function _openReq(method, url, flag, token) {
	const ajax = new XMLHttpRequest();
	ajax.open(method, url, flag);
	setHeaders(ajax, token);
	return ajax;
}

function _succeed(ajax) {
	return ajax && ajax.readyState == 4 && ajax.status < 400; 
}

function getJson(url, onloadfn, token) {
	const ajax = _openReq("GET", url, true, token);
	ajax.onload = function() {
		if (onloadfn) {
			onloadfn(ajax);
		}
		else {
			console.log("GET done.");
		}
	};
	ajax.send();
}

function postJson(url, model, token, successFn, errorFn) {
	const ajax  = _openReq("POST", url, true, token);
	ajax.onload = function () {
		if (_succeed(ajax)) {
			if (successFn)
				return successFn(ajax);
			else
				return defaultSuccessFn(ajax);
		} 
		else {
			if (errorFn)
				return errorFn(ajax);
			else
				return defaultErrorFn(ajax);
		}
	};
	ajax.send(JSON.stringify(model));
}

function putJson(url, model, token, successFn, errorFn) {
	const ajax = _openReq("PUT", url, true, token);
	ajax.onload = function () {
		if (_succeed(ajax)) {
			if (successFn)
				return successFn(ajax);
			else
				return defaultSuccessFn(ajax);
		} 
		else {
			if (errorFn)
				return errorFn(ajax);
			else
				return defaultErrorFn(ajax);
		}
	};
	ajax.send(JSON.stringify(model));
}

