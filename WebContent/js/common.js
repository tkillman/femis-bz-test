const tag = '[common.js]'

console.log(tag);

function gfnFormToObject(jqueryExpression){
	var ret = {};
	var $objs = $(jqueryExpression);
	$objs.each(function(ee){
		var name = $(this).attr('name');
		if (name == undefined) {
			console.log(this);
			throw new Error('name이 누락되었습니다');
		}
		ret[name] = gfnGetValue(this);
	});

	return ret;
}

function gfnPopup(url, width, height, data, callback, name){
	if(name){
		name = '_black';
	}

	var uuid = _gfnPopup(data, callback);
	var url = (window.contextPath||'') + '/popup' + url + '.do?p='+uuid;

	var left = (window.screen.width / 2) - (width /2);
	var top = (window.screen.height - 60 - height) / 2;

    var option = "status=no,location=no,width=" + width + ",height=" + height + ",left=" + left + ",top=" + top + ",scrollbars=yes,resizable=yes";
	var popup = window.open(url, name, option);
	
	arrayWindow.push(popup);

    //fnSessInit();
}

var arrayWindow = new Array();

function _gfnPopup(data, callback){
	var uuid = gfnUUid("P");
	_popup[uuid] = {
        data: data,
        callback: callback
    }

    return uuid;
}
var _popup = {};

function gfnUUid(type) {

    return type + t5() + "_" + s4() + "_" + s4();

    function t5() {
        return new Date().getTime().toString().substring(8);
    }

    function s4() {
        return ((1 + Math['random']()) * 0x10000 | 0).toString(16).substring(1);
	}
	
}

function gfnCheckValidation(jqExpression){
	var $o = $(jqExpression)

	return true;
}

function gfnGetValue(jqueryExpression) {

    var $e = $(jqueryExpression);

    if ($e.length != 1) {
        throw new Error('객체가 식별가능하지 않습니다.');
    }

    var tagName = $e.prop('tagName');
    if (tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA') {
        return $e.val();
    }
    else if ($e.attr('name') != undefined) { //radio box라면
        var name = $e.attr('name');
        var val = $e.find('[name="' + name + '"]:checked').val();
        if (val == undefined)
            return "";
        return val;
    }
    else {
        throw new Error('값을 가져올 수 없습니다.');
    }

    //TODO 체크박스인 경우가 필요 할까? 필요하다면 여기서 구현..
}

// ----------- Transaction ---------------//
function $T(url) {

    if (url == undefined) {
        throw new Error('url을 입력하십시오.');
    }

    return new Transaction(url);

}

var Transaction = function () {

    var DIMQ = [];

    return function (url) {

        var me = this;
        this.DIMQ = DIMQ;
        this._info = {}
        this._info.type = "normal";

        // 기본값 설정
        this.$ajax = {};
        this.$ajax.type = 'POST';
        this.$ajax.method = 'POST';
        this.$ajax.url = url;
        this.$ajax.dataType = 'json';
        this.$ajax.data = '';
        this.$ajax.contentType = 'application/json; charset=utf-8';
        this.$ajax.success = function (data, status, xhr) {
            for (var i = 0; i < me._eventMap.onLoad.length; i++) {
                me._eventMap.onLoad[i](data);
            }

            try {
                me._bindData(data);
                me._bindDataset(data);
            }
            catch (e) {
                $log('[warning] 데이터 바인드 시 에러가 발생하였습니다.');
                $log(e);
            }
            me.out = data;

            for (var i = 0; i < me._eventMap.onLoadCompleted.length; i++) {
                me._eventMap.onLoadCompleted[i](data, status, xhr);
            }

            // 본인제거
            var idx = me.DIMQ.indexOf(me);
            if (idx > -1)
                me.DIMQ.splice(idx, 1);
            if (me.DIMQ.length == 0) {
                $('#tansactionDim').remove();
                // $log('제거함');
            }
            else {
                // $log('제거안함');
            }

        };
        this.$ajax.error = function (data) {
            if (data.readyState === 4 && data.status === 200 && data.statusText === 'parsererror') {
                console.debug && console.debug(data.statusText + ': ' + data.responseText);
            }
            else {
                var message = "시스템 에러가 발생하였습니다. 관리자에게 문의하세요.";
                if (data.status === 503 && data.responseText) {
                    message += ":\n\n" + data.responseText;
                }

                if (me._eventMap.onError.length === 0) {
                    //console.log(message);
                	alert(message);
                }

                for (var i = 0; i < me._eventMap.onError.length; i++) {
                    me._eventMap.onError[i](data);
                }
            }

            // 본인제거
            var idx = me.DIMQ.indexOf(me);
            if (idx > -1)
                me.DIMQ.splice(idx, 1);
            if (me.DIMQ.length === 0) {
                $('#tansactionDim').remove();
            }

        }

        // input 공간만들기
        this._in = {};
        this._in.datas = {};
        this._in.datasets = {};

        // out mapping 정보를 설정
        this._outmapping = {};
        this._outmapping.data = {};
        this._outmapping.dataset = {}; // out 데이터 메핑정보.

        // 이벤트 맵과 이벤트 statck 관리
        this._eventMap = {};
        this._eventMap.onLoad = []; // 통신이 끝나고서 호출
        this._eventMap.onLoadCompleted = []; // 데이터 처리 후 호출
        this._eventMap.onError = [];

    }
}();

/**
 * input data 를 설정한다.
 */
Transaction.prototype.inData = function (name, obj) {
    this._in.datas[name] = obj;
    return this;
}

/**
 * request가 종료된 이후 json데이터를 load한 후 호출된다.
 */
Transaction.prototype.onLoad = function (func) {
    if (typeof func != 'function') {
        throw new Error('함수를 바인딩하시오.');
    }
    this._eventMap.onLoad.push(func);
    return this;
}

/**
 * 요청을 날린다.
 */
Transaction.prototype.post = function () {

    var me = this;

    if (this._info.type == "multipart") { //파일전송일 경우 변경처리.
        this._info.formData.append('jsonData', JSON.stringify(this._in));
        this.$ajax.data = this._info.formData;
    }
    else {
        this.$ajax.data = JSON.stringify(this._in);
    }

    if (this.DIMQ.length == 0) {
        // $('body')
        //     .append('<div id="tansactionDim" class="dim" style="opacity:0.1"><div class="agnCenterBox"><div class="agnCenter"><div class="loader loader-4"></div></div></div></div>');
        //<div id="tansactionDim" class="dim" style="opacity:0.3"><div class="loader loader-1"></div></div>
        //
    }
    this.DIMQ.push(this);

    $.ajax(this.$ajax);

    return this;
}