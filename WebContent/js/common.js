$.ajaxPrefilter(function () {
    var decreaseRunning = function (xhr) {
        if (xhr.status && xhr.status === 401) {
            alert('로그아웃 되었습니다.');
            (window.opener || window).top.location.href = '/loginForm.do';
            window.opener && window.close();
            return
        }

        !--$.running && $('#do-not-hurry-up').fadeOut()
    }

    return function (options, origin) {
        $.running = $.running > 0 ? $.running : 0
        options.beforeSend = function () {
            ++$.running && $('#do-not-hurry-up').stop(true, true).fadeIn()
        }

        options.url = (window.contextPath || '') + options.url
        options.success = function (res, status, xhr) {
            decreaseRunning(xhr)
            origin.success && origin.success.apply(this, arguments)
        }
        options.error = function (xhr, status) {
            decreaseRunning(xhr)
            origin.error && origin.error.apply(this, arguments)
        }
    }
}())

var __s = {};
__s.comcodes = {}; //공통코드를 보관하고 있는다.

var __last_menu ; // /ui/~ 형태로 접근 시 좌측메뉴 노출용. (맨마지막

var notFirstFocus = false;

/**
 * 로깅용
 *
 * @returns
 */
function $log(message) {
    if (console) {
        console.log(message);
    }
}

function $error(error) {
    if (console && console.error) {
        console.error(error)
    }
    else {
        alert(error)
    }
}

/**
 * 메뉴ID를 통하여 팝업을 호출한다.
 *
 * @param menuId
 *            메뉴ID
 * @param data
 *            팝업으로 넘기는 data
 * @param callback
 *            팝업 호출 후 콜백함수
 * @returns 팝업에서 리턴한 값
 *
 * usage)
 *
 * gfnPopup('MENU_ID',{param1:"1"},function(data){ alert(data); });
 *
 */

// 구 팝업호출방식 삭제
//function gfnPopup(menuId, data, callback) {
//
//	var $t = $T('/cm/menu/menuinfo.json')
//	.sync()
//	.inData('condition', {
//		menu_id : menuId
//	}).post();
//
//	var uuid = _gfnPopup(data, callback);
//
//	var menuInfo = $t.out.datas.result;
////	$log(menuInfo);
//	if(menuInfo == undefined){
//		alert('팝업이 존재하지 않습니다.');
//		return;
//	}
//
//	if(!menuInfo.wdh){
//		menuInfo.wdh = '600';
//	}
//	if(!menuInfo.hght){
//		menuInfo.hght = '600';
//	}
//
//	var width = menuInfo.wdh;
//	var height = menuInfo.hght;
//
//	var url = "/pop/" + menuId + ".do?p=" + uuid;
//	var name = menuInfo.name;
//	var option = "width=" + width + ",height=" + height + ",left=600,top=100";
//
//	var popup = window.open(url, name, option);
//	// popup.init(data);
//
//}

/**
 * url을 통하여 popup을 호출한다.
 * @param url : 경로
 * @param width : 너비
 * @param height : 높이
 * @param data : 팝업에 전달하는 데이터 값
 * @param callback : 팝업이 닫히면서 호출되는 기대하는 콜백함수
 * @returns
 *
 * usage) gfnPopup(
 *                '/cm/cmmnCodePopup'
 *            )
 */
function gfnPopup(url, width, height, data, callback, name) {

    if (!name)
        name = '_blank';
    var uuid = _gfnPopup(data, callback); // popup box 등록
    var url = (window.contextPath||'') + "/popup" + url + ".do?p=" + uuid;

    var left = (window.screen.width / 2) - (width / 2);
    var top = (window.screen.height - 60 - height) / 2;

    var option = "status=no,location=no,width=" + width + ",height=" + height + ",left=" + left + ",top=" + top + ",scrollbars=yes,resizable=yes";
    var popup = window.open(url, name, option);

    //로그아웃시 열려있으면 닫기
    arrayWindow.push(popup);

    fnSessInit()

}

function fnSessInit(){
	//쿠키 세션초기화
	!location.pathname.match(/^\/?$|login/) && gfnSetCookie('rh', window.idleLimited)
	//서버 세션초기화
	//$T('/sessionInit.json').onLoadCompleted(function(data){}).post();
}

var arrayWindow = new Array();

function gfnPopup2(url, width, height, data, callback, name) {

    if (!name)
        name = '_blank';
    var uuid = _gfnPopup(data, callback); // popup box 등록
    var urlStr = "";

    if (url.indexOf("centPlanNewDetail") > -1) {
        urlStr = "/popup2" + url + ".do?p=" + uuid + "&workIdx=" + data.workIdx;
    }
    else {
        urlStr = "/popup2" + url + ".do?p=" + uuid;
    }

    var left = (window.screen.width / 2) - (width / 2);
    var top = (window.screen.height - 60 - height) / 2;

    var option = "status=no,location=no,width=" + width + ",height=" + height + ",left=" + left + ",top=" + top + ",scrollbars=yes";
    var popup = window.open(urlStr, name, option);

    //로그아웃시 열려있으면 닫기
    arrayWindow.push(popup);

    //fnSessInit()
}


/**
 * url을 통하여 layer팝업을 호출한다.
 * @param url : 경로
 * @param width : 너비
 * @param height : 높이
 * @param data : 팝업에 전달하는 데이터 값
 * @param callback : 팝업이 닫히면서 호출되는 기대하는 콜백함수
 * @returns
 *
 * usage) gfnLayPopup('/rc/etcCvplProcessDePop', '460', '290', args 	,function(e){
 *
 *        });
 */
function gfnLayPopup(url, width, height, data, callback) {

    var uuid = _gfnPopup(data, callback); // popup box 등록
    var url = "/popup" + url + ".do?p=" + uuid;
    var layerId = "__popupLayer__";
    $(".__popupContent__").html("");

    var top  = ($(window).scrollTop() + ($(window).height() - height) / 2);
    var left = ($(window).scrollLeft() + ($(window).width() - width) / 2);
    var $layerPopupObj = $('#__popupLayer__');
    $("#"+layerId).width(width);
    $("#"+layerId).height(height);
  	$layerPopupObj.css({'left':left,'top':top, 'position':'absolute'});
  	$("body").css('position','relative').append($layerPopupObj);

  	//var $layerPopupObj = $('#__popupLayer__');

  	//$layerPopupObj.css({'left':left,'top':top, 'position':'absolute'});
  	//$('body').css('position','relative').append($layerPopupObj);

    $("#"+layerId).bPopup({
        content:'iframe',
        zIndex:100000,
        iframeAttr:'frameborder="auto"',
        iframeAttr:'frameborder=0',
        contentContainer:'.__popupContent__',
        loadUrl: url,
        modalClose : false,
        onOpen: function() {  },
        onClose: function() {  }
    },
    function() {});

    $(".b-iframe").width(width);
    $(".b-iframe").height(height);

}
/**
 *
 * select box에 option을 채운다.
 *
 * @param jqueryExpression
 * @param grpCode
 * @param options
 * @returns usage : gfnCodeToSelect('#id',[{cmmn_code:'1',cmmn_code_nm:'1'}],{header:"선택", filter: {chr_ainfo2:"0"}})
 */
function gfnCodeToSelect(jqueryExpression, codes, options) {

    var $select = $(jqueryExpression);
    if ($select.length != 1) {
        throw new Error('객체가 유니크하지 않습니다.');
    }

    if (!options) {
        options = {}
    }

    var val = $select.val();
    if (val == undefined || val == null) {
        val = "";
    }
    $select.empty();

    // TODO options 값을 적용하고자 할 경우 여기서 구현하시오.
    if (options.header) {
        var headerValue = "";
        if (options.headerValue) {
            headerValue = options.headerValue;
        }
        $select.append("<option value='" + headerValue + "' >"
            + options.header + "</option>");
    }
    if (options.value != undefined) {
        val = options.value;
    }

    codes.forEach(function (e) {
        if (options.filter) {
            if (isDisplay(options.filter, e)) {
                $select.append("<option value='" + e.cmmn_code + "' >" + e.cmmn_code_nm + "</option>");
            }
        }
        else {
            $select.append("<option value='" + e.cmmn_code + "' >" + e.cmmn_code_nm + "</option>");
        }
    });

    $select.val(val);

    /**
     * filter를 통과했다면 노출
     */
    function isDisplay(filter, e) {
        for (n in filter) {
            if (filter[n] != e[n]) {
                return false;
            }
        }
        return true;
    }
}

/**
 *
 * select box에 공통코드 option을 채운다.
 *
 * @param jqueryExpression
 * @param grpCode
 * @param options
 * @returns usage : gfnComCodeToSelect('#id','03',{header:"선택", filter: {chr_ainfo2:"0"}})
 */
function gfnComCodeToSelect(jqueryExpression, grpCode, options) {

    var $select = $(jqueryExpression);
    if ($select.length != 1) {
        throw new Error('객체가 유니크하지 않습니다.');
    }

    if (!options) {
        options = {}
    }


    var codes = gfnGetComCode(grpCode);
    var val = $select.val();
    if (val == undefined || val == null) {
        val = "";
    }
    $select.empty();


    if (options.remove) {
    	codes = codes.filter(function(e){
    		if(options.remove.some(function (item) {
    		    return item == e.cmmn_code
            }))
    			return false;
    		return true;
    	})
    }

    // TODO options 값을 적용하고자 할 경우 여기서 구현하시오.
    if (options.header) {
        var headerValue = "";
        if (options.headerValue) {
            headerValue = options.headerValue;
        }
        $select.append("<option value='" + headerValue + "' >"
            + options.header + "</option>");
    }
    if (options.value != undefined) {
        val = options.value;
    }

    codes.forEach(function (e) {
        if (options.filter) {
            if (isDisplay(options.filter, e)) {
                $select.append("<option value='" + e.cmmn_code + "' >" + e.cmmn_code_nm + "</option>");
            }
        }
        else {
            $select.append("<option value='" + e.cmmn_code + "' >" + e.cmmn_code_nm + "</option>");
        }
    });

    $select.val(val);

    /**
     * filter를 통과했다면 노출
     */
    function isDisplay(filter, e) {
        for (n in filter) {
            if (filter[n] != e[n]) {
                return false;
            }
        }
        return true;
    }
}

function gfnComCodeToRadio(jqueryExpression, grpCode, options) {

    var $radioBox = $(jqueryExpression); // 한 놈만 픽미.
    if ($radioBox.length != 1) {
        throw new Error('객체가 유니크하지 않습니다.');
    }

    if (!options) {
        options = {};
    }

    var name = $radioBox.attr('name');
    var i = 0;
    if (name == undefined) {
        throw new Error('name이 설정되지 않았습니다.');
    }

    var codes = gfnGetComCode(grpCode);
    var val = gfnGetValue($radioBox);
    if (val == undefined || val == null) {
        val = "";
    }

    $radioBox.empty();

    var classname = "";

    // TODO options 값을 적용하고자 할 경우 여기서 구현하시오.

    if (options.radioClassName) {
        classname = options.radioClassName;
    }
    if (options.header) {
        var headerValue = "";
        if (options.headerValue) {
            headerValue = options.headerValue;
        }
        //$radioBox.append("<input type='radio' name='" + name + "' value='"+ headerValue + "' >" + options.header + " ");
        var html = "";
        html += "<span class='radiobox'>";
        html += "<input type='radio' id='" + name + "_" + i + "' name='" + name + "' value='" + headerValue + "'   class='" + classname + "' />";
        html += "<label for='" + name + "_" + i + "'>" + options.header + "</label>";
        html += "</span>";
        $radioBox.append(html);
        i++;
    }
    if (options.value != undefined) {
        val = options.value;
    }

    codes.forEach(function (e) {

        if (options.filter) {
            if (isDisplay(options.filter, e)) {
                var html = "";
                html += "<span class='radiobox'>";
                html += "<input type='radio' id='" + name + "_" + i + "' name='" + name + "' value='" + e.cmmn_code + "'   class='" + classname + "' />";
                html += "<label for='" + name + "_" + i + "'>" + e.cmmn_code_nm + "</label>";
                html += "</span>";
                //$log(html);
                $radioBox.append(html);
                i++;
            }
        }
        else {
            var html = "";
            html += "<span class='radiobox'>";
            html += "<input type='radio' id='" + name + "_" + i + "' name='" + name + "' value='" + e.cmmn_code + "'   class='" + classname + "' />";
            html += "<label for='" + name + "_" + i + "'>" + e.cmmn_code_nm + "</label>";
            html += "</span>";
            //$log(html);
            $radioBox.append(html);
            i++;
        }

    });

    gfnSetValue($radioBox, val);

    /**
     * filter를 통과했다면 노출
     */
    function isDisplay(filter, e) {
        for (n in filter) {
            if (filter[n] != e[n]) {
                return false;
            }
        }
        return true;
    }


}


/**
 * 공통코드그룹코드를 통하여 공통코드 목록을 조회한다.
 *
 * @param grpCode
 * @returns
 */
function gfnGetComCode(grpCode, code) {

    if (__s.comcodes.YN == undefined) {
        __s.comcodes.YN = [{
            cmmn_group_code: "YN",
            cmmn_code_nm: "Y",
            cmmn_code: "Y"
        }, {
            cmmn_group_code: "YN",
            cmmn_code_nm: "N",
            cmmn_code: "N"
        }];
    }

    if (__s.comcodes[grpCode] == undefined) {
        var t = $T('/cm/cmmnCode/selectList.json').inData('condition', {
            cmmn_group_code: grpCode
        }).sync().post(); //동기
        __s.comcodes[grpCode] = t.out.datasets.dataset;
    }

    if (code === undefined) return __s.comcodes[grpCode];
    else {
        var contains = function (source, target) {
            for (var i in target) {
                if (target[i] !== source[i])
                    return false;
            }

            return true;
        };

        var result = (__s.comcodes[grpCode] || []).filter(function (item) {
            return contains(item, code)
        });

        if (result.length > 1)
            throw new Error('조건에 만족하는 행이 너무 많습니다.');

        return result[0] || {};
    }

}


/**
 * jquery표현식으로 object로 변환을 한다.
 *
 * @param jqueryExpression
 * @returns
 *
 * usage) var params = gfnFormToObject('.form1');
 */
function gfnFormToObject(jqueryExpression) {

    var ret = {};
    var $objs = $(jqueryExpression);
    $objs.each(function (ee) {
        var name = $(this).attr('name');
        if (name == undefined) {
            $log(this);
            throw new Error('name 이 누락되었습니다.');
        }

        ret[name] = gfnGetValue(this);
    });

    return ret;
}

/**
 * obj의 속성을 jquery표현식에 걸리는 객체에 바인딩한다.
 *
 * @param obj
 * @param jqueryExpression
 * @returns
 *
 * usage)) gfnObjectToForm({param1:"a"},'.form1')}
 */
function gfnObjectToForm(data, jqueryExpression) {

    if (data == undefined || data == null) {
        $log(data);
        throw new Error('데이터가 존재 하지 않습니다.');
    }
    ;

    var $objs = $(jqueryExpression);
    $objs.each(function (ee) {
        var name = $(this).attr('name');
        if (name != undefined && data.hasOwnProperty(name)) {
            gfnSetValue(this, data[name]);
        }
        else {
            //$log('[WARNING]name이 지정되지 않은 element가 존재합니다.');
            //$log(this);
        }
    });
}

/**
 * jquery 표현식 혹은 엘리먼트를 인자로 하여, 값을 get한다.
 * radio box는 상위 엘이먼트에 name 을 주어서 지정한다.
 */
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

/**
 * 20100115 -> 2010-01-15 으로 변환한다.
 * @param str
 * @returns
 */
function gfnDateFormating(str) {
    if (str == undefined || str == null || str == '') {
        return '';
    }
    if (str.length != 8) {
        return str;
    }
    return str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2);
}

/**
 * 20100115 -> 2010-01-15 으로 변환한다.
 * @param str
 * @returns
 */
function gfnTimeFormating(str) {
    if (str == undefined || str == null || str == '') {
        return '';
    }
    if (str.length != 14) {
        return str;
    }
    return str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2)  + " " + str.substr(8, 2)+ ":" + str.substr(10, 2);
}

/**
 * 2010-01-15 -> 20100115 으로 변환한다.
 * @param str
 * @returns
 */
function gfnDateUnformating(str) {
    if (str == undefined || str == null || str == '') {
        return '';
    }
    return str.replace(/-/g, '');
}


/**
 * jquery 표현식을 객체를 찾아서 value를 설정한다.\
 * radio 박스의 경우 radio를 감싸고 있는 객체에 name을 지정하면 그 하위의 name을 가진 객체에 값이설정된다.
 */
function gfnSetValue(jqueryExpression, value) {

    var $e = $(jqueryExpression);

    if ($e.length != 1) {
        throw new Error('객체가 식별가능하지 않습니다.');
    }

    var tagName = $e.prop('tagName');
    if (tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA') {
        return $e.val(value);
    }
    else if ($e.attr('name') != undefined) { //radio box라면
        var name = $e.attr('name');
        $e.find('[name="' + name + '"][value="' + value + '"]').attr('checked', true)
        /*
        var val = $e.find('[name="'+name+'"]').val();
        if(val==undefined)
            return "";
        return val;
        */
    }
    else {
        throw new Error('알수없는 테크입니다.');
    }

    //TODO 체크박스인 경우가 필요 할까? 필요하다면 여기서 구현..

}

/**
 * 날짜형식(yyyy-MM-dd) 이면 true 아니면 false
 *
 * @param value
 * @returns
 */
function gfnCheckDate(strDate) {

    if (strDate == undefined || strDate == null || strDate.length != 10) {
        return false;
    }
    var chkdate = Date.parse(strDate);

    if (isNaN(chkdate) == false) {
        var d = new Date(chkdate);
        var c = gfnFormateYyyy_MM_dd(d);
        if (c == strDate) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }

}

/**
 * date객체를 'YYYY-MM-DD' 형태로 리턴한다.
 * @param date
 * @returns
 */
function gfnFormateYyyy_MM_dd(date) {

    var year = date.getFullYear();
    var month = new String(date.getMonth() + 1);
    var day = new String(date.getDate());

    // 한자리수일 경우 0을 채워준다.
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }

    return year + "-" + month + "-" + day;

}

/**
 * 현재일자를 yyyy-MM-dd 형태의 String으로 리턴한다.
 *
 * @returns
 */
function gfnCurrentYyyy_MM_dd() {
    return gfnFormateYyyy_MM_dd(new Date());
}

/**
 * 현재일자를 yyyy-MM-dd 형태의 String으로 리턴한다.
 *
 * @returns
 */
function gfnCurrentDate() {
    return gfnCurrentYyyy_MM_dd();
}

/**
 * 월을
 * @param dateStr
 * @param month
 * @returns
 */
function gfnAddMonth(dateStr, month) {
    if (!gfnCheckDate(dateStr)) {
        throw new Error('날짜형식이 아닙니다.');
    }

    var date = new Date(dateStr);
    date.setMonth(date.getMonth() + month);

    return gfnFormateYyyy_MM_dd(date);

}


/**
 * 날짜 더하기
 * @param dateStr (YYYYMM)
 * @param day
 * @returns YYYYMMDD
 */
function gfnAddDay(dateStr, day) {
	if(dateStr!=null && dateStr.indexOf("-") == -1){
		dateStr = gfnDateFormating(dateStr);
	}

	if (!gfnCheckDate(dateStr)) {
	    throw new Error('날짜형식이 아닙니다.');
	}

	var date = new Date(dateStr);
	date.setDate(date.getMonth() + day);

	return gfnDateUnformating(gfnFormateYyyy_MM_dd(date));

}


/**
 * 월을 더하기
 * @param dateStr (YYYYMMDD)
 * @param month
 * @returns YYYYMMDD
 */
function gfnAddMonth2(dateStr, month) {
	if(dateStr!=null && dateStr.indexOf("-") == -1){
		dateStr = gfnDateFormating(dateStr);
	}

    if (!gfnCheckDate(dateStr)) {
        throw new Error('날짜형식이 아닙니다.');
    }

    var date = new Date(dateStr);
    date.setMonth(date.getMonth() + month);

    return gfnDateUnformating(gfnFormateYyyy_MM_dd(date));

}

/**
 * 월을 더하기
 * @param dateStr (YYYYMM)
 * @param month
 * @returns YYYYMM
 */
function gfnAddMonth3(dateStr, month) {
	if(dateStr!=null && dateStr.indexOf("-") == -1){
		dateStr = gfnDateFormating(dateStr);
	}

    var date = new Date(dateStr);
    //console.log(date);
    //console.log(date.getMonth());
    //console.log(date.getMonth() + month)
    date.setMonth(date.getMonth() + month);

    return gfnFormateYyyy_MM_dd(date);

}


/**
 * 일수 계산
 * @param fromDateStr (YYYYMMDD)
 * @param toDateStr (YYYYMMDD)
 * @returns 일수
 */
function gfnDiffDay(fromDateStr, toDateStr) {
	if(fromDateStr!=null && fromDateStr.indexOf("-") == -1){
		fromDateStr = gfnDateFormating(fromDateStr);
	}

	if(toDateStr!=null && toDateStr.indexOf("-") == -1){
		toDateStr = gfnDateFormating(toDateStr);
	}

    if (!gfnCheckDate(fromDateStr)) {
        throw new Error('날짜형식이 아닙니다.');
    }

    if (!gfnCheckDate(toDateStr)) {
        throw new Error('날짜형식이 아닙니다.');
    }

    var from_dt = new Date(fromDateStr);
    var to_dt = new Date(toDateStr);

    var diff = from_dt.getTime() - to_dt.getTime();
    diff = diff / (1000 * 60 * 60 * 24);

    return diff;

}


/**
 * 문자열의 byte length 리턴
 *
 * @param s
 *            문자열
 * @param b
 * @param i
 * @param c
 * @returns
 *
 * usage) gfnStringByteLength('문자열 Byte length 구하기');
 */
function gfnStringByteLength(s, b, i, c) {
    for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1)
        ;
    return b
}


/**
 * form 의 validation check
 * 각 input이 유효하면 true, 아니면 false를 리턴한다.
 * 현재는 필수 체크만 있으면 추후 더 추가될 예정이다. 필요한 유효성 검사는 각 개발자가 추가해서 사용해도 된다..
 * @param jqExpression
 * @returns
 *
 * 사용법)
 *
 *   if(gfnCheckValidation('.detail-form')==false){
 *     return false;
 *   }
 *
 *
 *   <input name="aaa" class="detail-form" required="required" stype="id" min-size="10"/>
 *                                         ------------------ 필수일 경우.
 *                                                             --------- id
 */
function gfnCheckValidation(jqExpression) {
    var $o = $(jqExpression);
    for (var i = 0; i < $o.length; i++) {
        if (check($o[i]) == false)
            return false;
    }

    var bizNos = $o.filter('[data-biz-no]');
    if (bizNos.length) {
        var concated = ''
        bizNos.each(function (i, el) {
            concated += el.value
        })

        if (concated && !gfnCheckValidation.bizNo(concated)) {
            alert('정상적인 법인등록번호가 아닙니다.');
            return false;
        }
    }

    var operatorNos = $o.filter('[data-operator-no]');
    if (operatorNos.length) {
        var concated = ''
        operatorNos.each(function (i, el) {
            concated += el.value
        })

        if (concated && !gfnCheckValidation.operatorNo(concated)) {
            alert('정상적인 사업자등록번호가 아닙니다.');
            return false;
        }
    }

    return true;

    function check(e) {

        //검사가 필요한 경우 title은 필수
        if (e.title) {
        }
        else if (e.type !== 'hidden') {
            $log(e);
            $log('[warning !!] 위 객체에 title을 설정하십시오.');
            return false;
        }

        var $e = $(e)
        var val = $e.val();

        //필수체크
        //ex) required="required"
        if (e.required) {
            if (val == undefined || val == "") {
                alert(e.title + "은 필수 입니다.");
                $(e).focus();
                return false;
            }
        }

        //값을 타입 설정
        // stype="id"  // 영문자숫자
        if ($e.attr('stype') && $e.data('bypass') === undefined) {
            if (val !== "") {
                var stype = $e.attr('stype');
                if (stype == 'id') {
                    var idReg = /^[a-zA-Zㄱ-힣]+[a-zA-Zㄱ-힣0-9]{5,19}/g;
                    if (!idReg.test(val)) {
                        alert(e.title + "는 숫자가 아닌 문자로 시작하는 6-20자 문자이어야 합니다.");
                        $e.focus();
                        return false;
                    }
                }else if (stype == 'eng-num') {
                    var idReg = /^[A-za-z0-9\s]+$/g;
                    if (!idReg.test(val)) {
                        alert(e.title + "는 영문 숫자이어야 합니다.");
                        $e.focus();
                        return false;
                    }
                }else if (stype == 'num') {
                    var idReg = /^[0-9]+$/g;
                    if (!idReg.test(val)) {
                        alert(e.title + "는 숫자이어야 합니다.");
                        $e.focus();
                        return false;
                    }
                }else if (stype == 'date') {
                    var idReg = /^(19|20|99)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
                    if (!idReg.test(val)) {
                        alert(e.title + "는 날짜형식이어야 합니다.");
                        $e.focus();
                        return false;
                    }
                }else if (stype == 'date-yymmdd') {
                    if (!gfnValidyyMMdd(val)) {
                        alert(e.title + "는 날짜형식이 올바르지 않습니다.");
                        $e.focus();
                        return false;
                    }
                }

            }
        }

        //최소길이
        if ($e.attr('minlength') && !$e.is('.nullable')) {
            var str = val + "";
            if (str.length < $e.attr('minlength')) {
                alert(e.title + "의 길이는 최소 " + $e.attr('minlength') + " 이어야 합니다.");e.select()
                return false;
            }
        }

        //최대길이
        if ($e.attr('maxlength') && !$e.is('.nullable')) {
            if (val !== "") {
                var str = val + "";
                if (str.length > $e.attr('maxlength')) {
                    alert(e.title + "의 길이는 최대 " + $e.attr('maxlength') + " 이어야 합니다.");e.select()
                    return false;
                }
            }
        }

        //길이
        if ($e.attr('length') && !$e.is('.nullable')) {
            var str = val + "";
            if (str.length > $e.attr('length')) {
                alert(e.title + "의 길이는 " + $e.attr('length') + "자 이하로 입력 해야 합니다.");e.select()
                return false;
            }
        }


        //Byte최대길이
        if ($e.attr('maxByteLength') && !$e.is('.nullable')) {
            if (val !== "") {
                var str = val + "";
                if (gfnStringByteLength(str) > $e.attr('maxByteLength')) {
                    alert(e.title + "의 Byte 길이는 최대 " + $e.attr('maxByteLength') + " 이어야 합니다.");e.select()
                    return false;
                }
            }
        }

        //TODO 다른 유효성 검사가 필요할 경우 여기에 작성하시오.

        return true;
    }
}
gfnCheckValidation.operatorNo = function (val) {
    var map = val.replace(/[^\d]/g, '').split('').map(function (item) {
        return Number(item);
    });

    /*
    // 10자리 숫자인지 확인합니다.
    if((num = (num+'').match(/\d{1}/g)).length != 10) { return false; }

    // 체크키
    var sum = 0, key = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    for (var i = 0 ; i < 9 ; i++) { sum += (key[i] * Number(num[i])); }

    // 각 8번배열의 값을 곱한 후 10으로 나누고 내림하여 기존 합에 더합니다.
    // 다시 10의 나머지를 구한후 그 값을 10에서 빼면 이것이 검증번호 이며 기존 검증번호와 비교하면됩니다.
    var chkSum = 0;
    chkSum = Math.floor(key[8] * Number(num[8]) / 10);
    sum +=chkSum;

    var reminder = (10 - (sum % 10)) % 10;
    //값 비교
    if(reminder==Number(num[9])) return true;

    return false;
    */

    if (map.length === 10) {

    	return true; //임시로 사업자번호 체크 빼달라고 하셔서 리턴트루 처리함 (자릿수만 맞으면 통과)

        var multiply = [1, 3, 7, 1, 3, 7, 1, 3, 5];
        var sum = 0;
        var i = 0;

        for (; i < multiply.length; i++) {
            sum += multiply[i] * map[i];
        }

        i = multiply.length - 1;
        sum += Math.floor(multiply[i] * map[i] / 10);

        return map[9] === (10 - (sum % 10)) % 10;
    }

    return false;
}


gfnCheckValidation.bizNo = function (val) {
	var isCheck = gfnCheckValidation.normalBizNo(val);

	if(!isCheck){
		return gfnCheckValidation.exceptBizNo(val);
	}

	return true;
}

gfnCheckValidation.normalBizNo = function (val) {
    var map = val.replace(/[^\d]/g, '').split('').map(function (item) {
        return Number(item);
    });

    var valStr = val.replace(/[^\d]/g, '');

    if (13 === map.length) {

    	return true; //임시로 법인번호 체크 빼달라고 하셔서 리턴트루 처리함 (자릿수만 맞으면 통과)

    	var sum = 0;
        var flip = 1;
        var i = 0;

        for (; i < map.length - 1; i++) {
            sum += map[i] * flip;
            flip = flip === 1 ? 2 : 1;
        }

        sum = sum % 10;
        sum = 10 - sum;

        if (sum > 9) {
            sum = 0;
        }

        return sum === map[map.length - 1]


    }

    return false;
}

gfnCheckValidation.exceptBizNo = function (val) {
    var map = val.replace(/[^\d]/g, '').split('').map(function (item) {
        return Number(item);
    });

    var valStr = val.replace(/[^\d]/g, '');

    if (13 === map.length) {

    	//수기로 잘못 입력된 법인번호가 존재하여 국가등기소 번호, 법인종류별 분류번호 체크로직 추가
    	//http://www.law.go.kr/lsInfoP.do?lsiSeq=196407#AJAX
    	//국가법령 사이트 등기관서별 분류번호 , 법인종류별 분류번호 참조
    	var args1 = [
    		'1101','1103','2401','2501','2602','2641','2643','2701','2741','2742','2743','2802','2841','2842','2843','2844','2845',
    		'2846','2847','2849','2850','1201','1211','1244','1245','1311','1312','1313','1314','1341','1342','1343','1344','1345','1346','1348','1349',
    		'1354','1355','1356','1357','1358','1359','1401','1411','1412','1413','1414','1441','1442','1443','1444','1445','1446','1447','1448','1449','1450','1451','1452','1501','1511','1512','1513','1541','1542','1543','1544','1545',
    		'1546',
    		'1601','1611','1612','1613','1614','1615','1641','1642','1643','1644','1645','1646','1647','1648','1649','1650',
    		'1651','1652','1701','1711','1712','1713','1714','1715','1716','1717','1718','1743','1744','1745','1747','1748',
    		'1749','1750','1751','1752','1754','1755','1756','1757','1758','1759','1760','1801','1811','1849','1841','1843','1844','1847','1851',
    		'1945','1946','1947','1948','1949','1950','1951','1952','1953','1954','1955','2001','2011','2012','2013','2014','2043','2044','2045',
    		'2301','2341','1942','1915','1911','1912','1913','1914','1941','1943','1944',
    		'2111','2112','2113','2141','2142','2143','2144','2145','2146','2147','2148','2149','2201','2241',
    		'2046','2047','2049','2050','2052','2053','2054','2055','2056','2057','2058','2059','2060','2061','2062','2101',
    		'1845' //실제 존재하여 추가
    	]
    	var args2 = [
    		'11','12','13','14','15','21','22','31','32','33','34','35','36','37','38','39',
    		'40','41','42','43','44','45','46','47','48','49','50','51','52','53','71',
    		'81','82','83','84','86','85',
    	]

    	var valStr1 = valStr.substr(0,4);
    	var valStr2 = valStr.substr(4,2);

    	if(args1.indexOf(valStr1) == -1){
    		return false;
    	}

    	if(args2.indexOf(valStr2) == -1){
    		return false;
    	}

        return true;

    }

    return false;
}

// =============================== 화면에서 별로 안 쓰일 함수들
// ===============================//

/**
 * 오브젝트 속성이 같은지를 확인한다. _로 시작하는 속성은 제외한다. obj1의 속성기준으로 비교한다. 값이 모두 같을 경우 true 아니면
 * a{a:1,b:2}
 * b{b:2}
 * b chk
 * false
 *
 * @returns
 */
function gfnIsCompareObj(obj1, obj2) {

    for (var n in obj1) {
        if (n.indexOf("_") != 0) {
            if (obj2.hasOwnProperty(n) && obj1[n] == obj2[n]) {
            }
            else {
                return false;
            }
        }
    }

    return true;
}

/**
 * 오브젝트 속성이 같은지를 확인한다. _로 시작하는 속성은 제외한다. obj1의 속성기준으로 비교한다. 값이 모두 같을 경우 true 아니면
 * a{a:1,b:2}
 * b{b:2}
 * b chk
 * false
 *
 * @returns
 */
function gfnIsCompareArray(ary1, ary2) {

	if ($.type(ary1) != 'array' || $.type(ary2) != 'array') {
		return false;
	}

	if(ary1.length != ary2.length){
		return false;
	}

	var rtnVal = true;
	$.each(ary1, function(i,item){
		if(rtnVal){
			rtnVal = gfnIsCompareObj(item, ary2[i]);
		}
	});

	return rtnVal;
}

/**
 * 객체의 내용을 복사하여 전달한다.
 *
 * @param source
 * @returns
 */
function gfnCloneObj(source) {
    var target = {};
    for (var n in source) {
        target[n] = source[n];
    }
    return target;
}

/**
 * source의 속성값을 target의 속성으로 복사한다.
 *
 * @param source
 * @param target
 * @returns
 */
function gfnObjAttrPushWithPublic(source, target) {
    for (var n in source) {
        target[n] = source[n];
    }
}

/**
 * 공개속성만 클론.
 *
 * @param source
 * @returns
 */
function gfnCloneObjWithPublic(source) {
    var target = {};
    for (var n in source) {
        target[n] = source[n];
    }
    return target;
}

/**
 * 그리드에 버튼이 달렸을 경우, 해당 컬럼에 바인딩 되어 있는 이벤트가 동작하게 된다.
 * @param me
 * @param rowId
 * @param colName
 * @returns
 */
function gfnGridBtn(me, rowId, colName) {

    var grid = $(me).parent().parent().parent().parent()[0].$g;
    var rowData = grid.getRowData(rowId);
    for (var i = 0; i < grid._grdInfo.colModel.length; i++) {
        if (colName == grid._grdInfo.colModel[i].name) {
            var m = grid._grdInfo.colModel[i];
            if (m.colOption && m.colOption.onclick) {
                m.colOption.onclick(rowId, colName, rowData);
            }
        }
    }

}

/**
 * byte단위의 파일사이즈를 파라미터로 받아 단위가 붙은 파일 사이즈 리턴한다.
 * @param size
 * @returns
 */
function gfnGetFileSizeStr(size) {
    var unit = "byte";
    if (size / 1024 >= 1) {
        size = size / 1024;
        unit = 'K';
        if (size / 1024 >= 1) {
            size = size / 1024;
            unit = 'M';
            if (size / 1024 >= 1) {
                size = size / 1024;
                unit = 'G';
            }
        }
    }
    return round(size) + "" + unit;

    function round(i) {
        return Math.round(i * 100) / 100;
    }
}

function _gfnPopup(data, callback) {
    var uuid = gfnUUid("P");

    _popup[uuid] = {
        data: data,
        callback: callback
    }

    return uuid;
}

var _popup = {};

function objectDeepCopy(source) {
    var type = $.type(source),
        target;

    if (type === 'array') {
        target = []

        $(source).each(function (i, raw) {
            target.push(objectDeepCopy(raw))
        })

        return target
    }
    else if (type === 'object') {
        target = {}

        for (var i in source) {
            target[i] = objectDeepCopy(source[i])
        }

        return target
    }

    return source
}

function _gfnPopupCallback(uuid, ret, win) {
    if ($.isFunction(ret)) {
        ret()
    }

    if ($.isFunction(_popup[uuid].callback)) {
        var obj = objectDeepCopy(ret)

        if (win) {
            win.close()
        }

        _popup[uuid].callback(obj)
    }
}


function gfnUUid(type) {

    return type + t5() + "_" + s4() + "_" + s4();

    function t5() {
        return new Date().getTime().toString().substring(8);
    }

    function s4() {
        return ((1 + Math['random']()) * 0x10000 | 0).toString(16).substring(1);
    }

}

/**
 * array 에서 해당 객체가 있을 경우 삭제한다.
 *
 * @param array
 * @param obj
 * @returns
 */
function gfnArrayRemoveObj(array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            array.splice(i, 1);
        }
    }
}

function gfnObjAttrEmptyArray(obj, attrs) {
    for (var i = 0; i < attrs.length; i++) {
        obj[attrs[i]] = [];
    }
}

// 사용하지 마세요.
function gfnSleep(millisecond) {
    var start = new Date().getTime();

    while (true) {
        var curr = new Date().getTime();
        // $log(curr);
        if ((curr - start) > millisecond) {
            break;
        }
    }
}

function gfnSplit(cha, object, valname, eArr) {
    if (object[valname]) {
        var arr = object[valname].split(cha);
        for (var i = 0; i < eArr.length; i++) {
            if (arr[i]) {
            	object[eArr[i]] = arr[i];
            }
        }
    }
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


        //

        // 이벤트 맵과 이벤트 statck 관리
        this._eventMap = {};
        this._eventMap.onLoad = []; // 통신이 끝나고서 호출
        this._eventMap.onLoadCompleted = []; // 데이터 처리 후 호출
        this._eventMap.onError = [];

    }
}();

/**
 * 요청을 파일을 전송할 수 있는 multipart 타입으로 변경한다.
 */
Transaction.prototype.multipart = function () {

    this._info.type = "multipart";
    var formData = new FormData();
    this._info.formData = formData;

    this.$ajax.dataType = 'json';
    this.$ajax.contentType = false;
    this.$ajax.cache = false;
    this.$ajax.processData = false;
    return this;

}

Transaction.prototype.addFile = function (paramName, file) {

    if (this._info.type != "multipart") {
        throw new Error('transaction 이 multipart type이 아닙니다.');
    }

    this._info.formData.append(paramName, file);
    return this;

};

Transaction.prototype.addFiles = function (paramName, jq) {

    if (this._info.type != "multipart") {
        throw new Error('transaction 이 multipart type이 아닙니다.');
    }

    var jq = jq.filter('input:file'); // 파일타입만 수집한다.
    var formData = this._info.formData;

    jq.each(function (i, e) {
        if (e.files[0]) {
            $log(' addFiles : !');
            $log(e.files[0]);
            formData.append(paramName, e.files[0]);
        }
    })

    return this;

};
/**
 * 동기로 사용할 경우.
 */
Transaction.prototype.sync = function () {
    this.$ajax.async = false;
    return this;
}

/**
 * input data 를 설정한다.
 */
Transaction.prototype.inData = function (name, obj) {
    this._in.datas[name] = obj;
    return this;
}

/**
 * input dataset을 설정한다.
 */
Transaction.prototype.inDataset = function (name, obj) {
    this._in.datasets[name] = obj;
    return this;
}

/**
 * output data 를 설정한다.
 */
Transaction.prototype.outData = function (name, obj) {

    this._outmapping.data[name] = {
        name: name,
        obj: obj
    }
    if (typeof obj == "string") {
        this._outmapping.data[name].type = 'expression';

    }
    else {
        this._outmapping.data[name].type = 'obj';
    }

    return this;
}
/**
 * out dataset를 grid로 자동 바인딩 된다.
 *
 */
Transaction.prototype.outDataSet = function (datasetName, obj) {
    
    this._outmapping.dataset[datasetName] = {
        name: datasetName
    }

    if (obj instanceof Grid) {
        this._outmapping.dataset[datasetName].type = 'grid';
        this._outmapping.dataset[datasetName].obj = obj;
    }
    else {
        throw new Error("취급할 수 없는 타입입니다.");
    }
    console.log('Transaction', this);
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
 * request 로딩된 이후에 발생후 에 호출된다.
 */
Transaction.prototype.onLoadCompleted = function (func) {
    if (typeof func != 'function') {
        throw new Error('함수를 바인딩하시오.');
    }
    this._eventMap.onLoadCompleted.push(func);
    return this;
}

Transaction.prototype.paging = function (conditionName, grid) {

    var me = this;

    this.onLoad(function (data) {
        if (data && data.datas[conditionName]) {
            grid._updatePagingInfo(me, conditionName, data.datas[conditionName]);
        }
        else {
            throw new Error('paging 관련데이터가 존재하지 않습니다.');
        }
    });

    return this;
}

Transaction.prototype.onError = function (func) {
    if (typeof func != 'function') {
        throw new Error('함수를 바인딩하시오.');
    }
    this._eventMap.onError.push(func);
    return this;
}

Transaction.prototype._bindData = function (data) {

    var datamappingMap = this._outmapping.data; // view

    for (var n in data.datas) { // server
        if (datamappingMap[n] != undefined) {
            if (datamappingMap[n].type == 'expression') {
                gfnObjectToForm(data.datas[n], datamappingMap[n].obj)
            }
            else {
                throw new Error('미구현중입니다.');
            }
        }
        else {

        }
    }

}

Transaction.prototype._bindDataset = function (data) {

    var datasetMap = this._outmapping.dataset;
    matchingDataset(this._outmapping.dataset, data.datasets);

    function matchingDataset(datasetMap, datasets) {
        for (var n in datasetMap) {
            for (var m in datasets) {
                if (n == m) {
                    if (datasetMap[n].type == 'grid') {
                        datasetMap[n].obj.data(datasets[m]);
                    }
                    else {
                        throw new Error('적용할 수 없는 타입니다.');
                    }
                }
            }
        }
    }
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

// ----------- Grid ---------------//

var $G = function (jqueryExpression) {

    var $obj = $(jqueryExpression);
    if ($obj.length != 1) {
        throw new Error('표현식은 유니크 하지 않습니다.');
    }
    var ret = new Grid($obj);
    $obj[0].$g = ret;
    return ret;

}

$G._event = {}
$G._event.checkboxOnchange = function (me, rowId, columnname) {

    var $checkbox = $(me);
    var grid = $checkbox.parent().parent().parent().parent()[0].$g;

    grid.$grid.getGridParam('data')[rowId][columnname] = $checkbox.prop('checked') ? 'Y' : 'N'

    grid._onChangeGridToData(rowId);

    //이벤트가 걸려 있다면 실행하라.
    var colModel = grid._grdInfo.colModel;
    var onChageEvent = getOnChageEvent();
    if (onChageEvent) {
        onChageEvent(rowId, columnname, me.checked, grid.getRowData(rowId));
    }

    function getOnChageEvent() {
        for (var i = 0; i < colModel.length; i++) {
            if (colModel[i] && colModel[i].colOption && colModel[i].colOption.onchange) {
                return colModel[i].colOption.onchange;
            }
        }
        return;
    }
}

$G._event.radioboxOnchange = function (me, rowId, columnname) {

    var $checkbox = $(me);
    var grid = $checkbox.parent().parent().parent().parent().parent()[0].$g

    var data = {}
    data[columnname] = $checkbox.prop('checked') ? 'Y' : 'N'
    grid.updateRow(rowId, data)

    //이벤트가 걸려 있다면 실행하라.
    var colModel = grid._grdInfo.colModel;
    var onChageEvent = getOnChageEvent();
    if (onChageEvent) {
        onChageEvent(rowId, columnname, grid.getRowData(rowId));
    }

    function getOnChageEvent() {
        for (var i = 0; i < colModel.length; i++) {
            if (colModel[i] && colModel[i].colOption && colModel[i].colOption.onchange) {
                return colModel[i].colOption.onchange;
            }
        }
        return;
    }

}

function Grid($grid) {

    var me = this;
    // this.name = name;
    this.$grid = $grid;

    // 기본정보
    this._info = {};
    this._info.lineEditable = false;
    this._info.colType = {};

    // 데이터 관련
    this._data = {}
    this._data.currentRowId = -1;// uniq pointer
    this._data.serverRowNum = 0; // 서버에서 받은 행수. custom row이지는 식별하는 기준.
    this._data.originalData = [] // 초기데이터
    this._data.gridData = []; // 그리드의 데이터

    // 그리드 생성정보 default
    this._grdInfo = {};

    //
    // fitting legacy
    //
    this._grdInfo.multiselectWidth = 30;
    this._grdInfo.singleSelectClickMode = 'not-toggle';
    this._grdInfo.loadonce = true;
    this._grdInfo.autoencode = false;
    this._grdInfo.applyLabelClasses = true;


    this._grdInfo.datatype = 'local';
    this._grdInfo.height = 'auto';
    //this._grdInfo.rowNum = 10;
    this._grdInfo.caption = "";
    this._grdInfo.autowidth = true;
    this._grdInfo.colNames = [];
    this._grdInfo.colModel = [];

    this._grdInfo.shrinkToFit = false; //가로스크롤 생성
    // 이벤트 map, stack, bind, method on.
    this._initevent();

    // //이벤트정리
    // //더블 클릭
    // this._grdInfo.ondblClickRow = function(id){
    // for (var i = 0; i < me._eventMap.onDblClickRow.length; i++) {
    // me._eventMap.onDblClickRow[i](id);
    // }
    // }
    //
    // //행 선택
    // this._grdInfo.onSelectRow = function(rowid, status, e) {
    // for (var i = 0; i < me._eventMap.onSelectRow.length; i++) {
    // me._eventMap.onSelectRow[i](rowid, status, e);
    // }
    // }

    // 행정보
    this.onSelectRow(function (rowid, status, e) {
        // $log('지나간다.');
        me._info.beforeselectedRowId = me._info.selectedRowId;
        me._info.selectedRowId = rowid;
    });

}

Grid.prototype.showCol = function () {
    // this.$grid.

}
Grid.prototype.multiselect = function () {
    this._grdInfo.multiselect = true;
    return this;
}

Grid.prototype.autowidth = function (autowidth) {
    this._grdInfo.autowidth = autowidth;
    return this;
}

Grid.prototype.width = function (width) {
    this._grdInfo.width = width;
    this._grdInfo.autowidth = false;
    return this;
}

Grid.prototype.height = function (height) {
    this._grdInfo.height = height;
    return this;
}

Grid.prototype.rowNum = function (rowNum) {
    this._grdInfo.rowNum = rowNum;
    return this;
}

Grid.prototype.caption = function (caption) {
    this._grdInfo.caption = caption;
    return this;
}

Grid.prototype.footerrow = function (caption) {
	this._grdInfo.footerrow = caption;
    return this;
}

/**
 * 해당설정을 하면 행 편집이 가능해진다.
 */
Grid.prototype.lineEditable = function() {
    var me = this;
    this._info.lineEditable = true;
    this._grdInfo.lineEditable = true;

    me.$grid.getDataIDs().forEach(function (id) {
        me.$grid.jqGrid('editRow', id, false)
    })

    // this.onDblClickRow(function(rowId, status, cell, e) {
    //     // me.$grid.jqGrid('setGridParam', {
    //     //     inlineEditing: {
    //     //         focusField: e
    //     //     }
    //     // })
    //
    //     me.$grid.jqGrid('editRow', rowId, true)/*, null, null, {
    //         keys: true,
    //         url: 'clientArray'
    //     });*/
    //
    //     me._info.editLineId = rowId;
    // });
    // this.onSelectRow(function() {
    //     if (me._info.editLineId != -1) {
    //
    //         me.$grid.jqGrid('saveRow', me._info.editLineId, {
    //             url: 'clientArray'
    //         });
    //
    //         me._onChangeGridToData(me._info.editLineId);
    //     }
    // })

    return this;
}

Grid.prototype.setFocus = function (rowid) {
/*
	this._info.editLineId = rowid || this.getLastRowNum();

    // 편집모드를 해제한다.
    if (!gfnIsNull(this.getRowId()) && this.getRowId() != -1) {
        this.$grid.jqGrid('saveRow', this.getRowId(), {
            url: 'clientArray'
        });
        this._onChangeGridToData(this.getRowId());
    }
    this.$grid
        .setSelection(this._info.editLineId)
        .jqGrid('editRow', this._info.editLineId, false, null, null, {
            url: 'clientArray'
        })
*/
	this._info.editLineId = rowid || this.getLastRowNum();

	this.$grid
    .setSelection(this._info.editLineId)
    .jqGrid('editRow', this._info.editLineId, false, null, null, {
        url: 'clientArray'
    });

}


Grid.prototype.colNames = function (colNamesArr) {
    this._info.colNames = colNamesArr;
    return this;
}

/**
 * 컬럼정보를 일괄설정한다.
 */
Grid.prototype.cols = function (cols) {
    for (var i = 0; i < cols.length; i++) {
        this.add(cols[i]);
    }

    return this;
}

/**
 * 컬럼정보를 개별 등록한다. Deprecated
 */
Grid.prototype.add = function (col) {

    var o = {}
    for (var n in col) {
        o[n] = col[n];
    }
    if (o.name == undefined) {
        throw new Error("name 속성은 필수 입니다.");
    }
    if (o.colType) {
        this._info.colType[o.name] = o.colType;
    }

    if (o.colType == 'cmmncd') {
        if (o.colOption == undefined || o.colOption.cmmnGroup == undefined) {
            throw new Error('colType 이 cmmncd 일 경우 colOption, cmmnGroup 이 필수입니다. ');
        }
        if (!o.align) {
            o.align = "left";
        }
        o.formatter = 'select';
        o.edittype = "select";

        var codes = gfnGetComCode(o.colOption.cmmnGroup);
        var value = "";

        if (o.colOption.header) {
            value += ":" + o.colOption.header + ";";
        }

        codes.forEach(function (c) {
            value += c.cmmn_code + ":" + c.cmmn_code_nm + ";";
        });
        value = value.substring(0, value.length - 1);
        o.editoptions = {value: value};

    }
    else if (o.colType == 'monthly') {
        if (!o.editoptions) {
            o.editoptions = {};
        }
        o.align = "center";
        o.editoptions.size = 6;
        o.editoptions.dataInit = function (el) {
            $(el).monthpicker()
        }
    }
    else if (o.colType == 'calendar') {
        if (!o.editoptions) {
            o.editoptions = {};
        }
        o.align = "center";
        o.editoptions.size = 10;
        o.editoptions.dataInit = function (el) {
            $(el).datepicker(
                {
                    dateFormat: 'yy-mm-dd', //Input Display Format 변경
                    prevText: '이전 달',
                    nextText: '다음 달',
                    showOtherMonths: true, //빈 공간에 현재월의 앞뒤월의 날짜를 표시
                    showMonthAfterYear: true, //년도 먼저 나오고, 뒤에 월 표시
                    yearSuffix: ".", //달력의 년도 부분 뒤에 붙는 텍스트
                    monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], //달력의 월 부분 Tooltip 텍스트
                    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], //달력의 요일 부분 텍스트
                    showOn: "both",
                    buttonImage: (window.contextPath||'') + "/images/ico_calendar.png",
                    buttonImageOnly: true
                });
        }
    }
    else if (o.colType == 'alwayscheckbox') {

        if (this._info.lineEditable == true) {
            throw new Error('행편집모드에서는 colType 을 alwayscheckbox 으로 사용할 수 없습니다.');
        }
        o.align = "center";
        o.formatter = function (cellvalue, options, rowObject) {
            var attr = " ";
            if (cellvalue == 'Y') {
                attr += "checked ";
            }
            if (!options.colModel.editable) {
                attr += " disabled ";
            }
            return '<input type="checkbox" ' + attr + ' onclick="$G._event.checkboxOnchange(this,' + options.rowId + ',\'' + options.colModel.name + '\');" />';
        }
        o.unformat = function (cellvalue, options, cell) {
            if ($(cell).children().is(':checked')) {
                return "Y";
            }
            else {
                return "N";
            }
        }
    }
    else if (o.colType == 'alwaysradiobox') {

        if (this._info.lineEditable == true) {
            throw new Error('행편집모드에서는 colType 을 alwayscheckbox 으로 사용할 수 없습니다.');
        }

        if (o.colOption == undefined) {
            o.colOption = {};
        }
        if (o.colOption.name == undefined) {
            o.colOption.name = o.name;
        }

        o.align = "center";
        o.formatter = function (cellvalue, options, rowObject) {
            var attr = " ";
            if (cellvalue && (cellvalue === 'Y' || cellvalue.indexOf('checked') > -1)) {//cellvalue == 'Y') {
                attr += "checked ";
            }
            if (!options.colModel.editable) {
                attr += " disabled ";
            }
            //<input type="radio" id="radio01" name="rdo00" checked/>
            return '<span class="radiobox"><input type="radio" name="' + o.colOption.name + '" ' + attr + ' value="' + options.rowId + '" id="radio_' + o.colOption.name + '_' + options.rowId + '" onchange="$G._event.radioboxOnchange(this,' + options.rowId + ',\'' + options.colModel.name + '\');"/><label for="radio_' + o.colOption.name + '_' + options.rowId + '"/></span>';
        }
        o.unformat = function (cellvalue, options, cell) {
            if ($(cell).children().children().is(':checked')) {
                return "Y";
            }
            else {
                return "N";
            }
        }

    }
    else if (o.colType == 'button') {

        var claz = "";
        var label = "";
        if (o.colOption && o.colOption.btnClass) {
            claz = o.colOption.btnClass;
        }

        if (o.colOption && o.colOption.label) {
        	label = o.colOption.label;
        }

        o.formatter = function (cellvalue, options, rowObject) {
            var str = "<a href='javascript:;' onclick='javascript:gfnGridBtn(this," + options.rowId + ",\"" + options.colModel.name + "\")' class='" + claz + "'>"+label+"</a>";
            return str;
        }
        o.editable = false;
        o.align = "center";
    }
    else if (o.colType == 'select') {

        if (o.colOption == undefined || o.colOption.codes == undefined) {
            throw new Error('colType 이 select 일 경우 colOption.codes 필수입니다. ');
        }
        if (!o.align) {
            o.align = 'center';
        }
        o.formatter = 'select';
        o.edittype = "select";
        value = "";
        o.colOption.codes.forEach(function (c) {
            value += c.code + ":" + c.name + ";";
        });

        value = value.substring(0, value.length - 1);
        o.editoptions = {value: value};


    }

    //최종정리

    if (this._info.colNames) {
        this._grdInfo.colNames = this._info.colNames;
    }
    else {
        if (o.label) {
            this._grdInfo.colNames.push(o.label);
        }
        else {
            this._grdInfo.colNames.push("-");
        }
    }

    this._grdInfo.colModel.push(o);

}

Grid.prototype.cellEditable = function () {
    this._grdInfo.cellEdit = true
    this._grdInfo.cellsubmit = 'clientArray'

    return this
}

/**
 * 그리드를 생성한다.
 */
Grid.prototype.build = function () {
    this.$grid.jqGrid(this._grdInfo);
    this.clearGridData();

    if (this._grdInfo.cellEdit) {
        this.$grid.on('jqGridAfterSaveCell', function (e, rowid, colname, value) {
            var src = this.$grid.jqGrid('getRowData', rowid),
                dest = this._data.gridData[Number(rowid)],
                key;

            for (key in dest) {
                if (src[key] && dest[key] === undefined) {
                    dest[key] = src[key]
                }
            }

            dest[colname] = value

            return value
        }.bind(this))
    }

    /*this.$grid.on('jqGridAfterGridComplete', function () {
        var wrapper = this.$grid.parent(),
            container = wrapper.parent('.ui-jqgrid-bdiv')

        container.css('overflow-y', container.height() < wrapper.height() ? 'scroll' : 'inherit')
    }.bind(this))*/

    return this;

};

/**
 * 해당 rowid의 행을 강제 선택한다.
 */
Grid.prototype.setSelection = function (rowid) {
    this.$grid.setSelection(rowid);
}

Grid.prototype._updatePagingInfo = function (transaction, conditionName, condition) {

    if (!this._info.paging) {
        throw new Error('그리드에 페이징 설정이 되어 있지 않습니다.');
    }
    this._info.paging.transaction = transaction;
    this._info.paging.conditionName = conditionName;
    this._info.paging.condition = condition;

}


Grid.prototype.pageRender = function () {

    var condition = this._info.paging.condition;
    var $pager = this._info.$pager;

    if (!condition || !condition.pageNo) {
        return;
    }

    $pager.html('<ul></ul>');

    var $ul = $pager.children('ul');

    //시작페이지번호

    var startPageNo = Math.ceil(condition.pageNo / 10) * 10 - 9;
    //종료페이지번호
    var endPageNo = startPageNo + 9;
    //마지막페이지번호
    var lastPageNo = condition.totalPageCnt;

    if (endPageNo > lastPageNo) {
        endPageNo = lastPageNo;
    }

    if (startPageNo != 1) {
        $ul.append('<li class="go_first"><a onclick="javascript:gfnGo(1,this);" style="cursor:pointer">첫번째페이지</a></li>');
    }
    if (startPageNo != 1) {
        var p = condition.pageNo - 10;
        if (p < 0) {
            p = 1;
        }
        $ul.append('<li class="go_prev"><a onclick="javascript:gfnGo(' + (p) + ',this);"  style="cursor:pointer">이전페이지</a></li>');
    }

    if (endPageNo == 0) {
        $ul.append('<li class="on" ><a>' + 1 + '</a></li>'); //내역이 없을 경우 1페이지는 노출
    }
    for (var i = startPageNo; i <= endPageNo; i++) {
        if (i == condition.pageNo) {
            $ul.append('<li class="on" ><a>' + i + '</a></li>');
        }
        else {
            $ul.append('<li><a onclick="javascript:gfnGo(' + i + ',this);" style="cursor:pointer">' + i + '</a></li>');
        }
    }

    if (condition.pageNo + 10 < lastPageNo) {
        //$ul.append('<li class="go_next"><a onclick="javascript:gfnGo(' + (condition.pageNo + 10) + ',this);" style="cursor:pointer">다음페이지</a></li>');
        $ul.append('<li class="go_next"><a onclick="javascript:gfnGo(' + (Math.ceil(condition.pageNo / 10)*10 + 1) + ',this);" style="cursor:pointer">다음페이지</a></li>');
    }

    if (condition.pageNo != lastPageNo && lastPageNo > 1) {
        var p = condition.pageNo + 10;
        if (p > lastPageNo) {
            p = lastPageNo;
        }
        $ul.append('<li class="go_last"><a onclick="javascript:gfnGo(' + lastPageNo + ',this);" style="cursor:pointer">마지막페이지</a></li>');
    }

    $pager.append('<span class="total">총 ' + numberWithCommas(condition.totalCnt) + '건</span>');

}

function gfnGo(pageNo, me) {
    var grid = $(me.parentElement.parentElement.parentElement).data('grid');
    grid.goPage(pageNo);
}

Grid.prototype.paging = function (pagerExpression) {

    var $pager = $(pagerExpression);
    if ($pager.length != 1) {
        throw new Error('paging 영역을 특정할 수 업습니다.');
    }
    this._info.paging = {}; //이 객체가 선언되면 paging 처리가 들어간 그리드이다.
    this._info.$pager = $pager;
    $pager.data('grid', this);
    var html = '<ul><li class="on"><a href="javascript:;">1</a></li></ul><span class="total">총 0건</span>';

    $pager.html(html);
    $pager.addClass("paging-ui");


    return this;
}

;
Grid.prototype.goPage = function (pageNo) {

    var $t = this._info.paging.transaction;
    this._info.paging.pageNo = pageNo;
    var conditionName = this._info.paging.conditionName;
    var condition = this._info.paging.condition;
    condition.pageNo = pageNo;

    $t.inData(conditionName, condition)
        .post();

}

/**
 * 페이징되었다면 재검색을 한다.
 */
Grid.prototype.research = function () {
    if (!this._info.paging) {
        throw new Error('페이징 되는 그리드가 아닙니다.');
    }
    this.goPage(this._info.paging.pageNo);
}

/**
 * 그리드의 데이터를 초기화 한다..
 */
Grid.prototype.clearGridData = function () {
    if (this._info.$pager && this._info.$pager.length > 0) {
        this._info.$pager.empty()
    }

    this.$grid.clearGridData(); // 데이터 초기화

    this._data.currentRowId = -1;// uniq pointer
    this._data.serverRowNum = 0; // server에서 받은 데이터 갯수
    this._data.originalData = []; // server에서 받은 데이터
    this._data.gridData = []; // 그리드 내에서의 데이터.

    this._info.selectedRowId = -1;
    this._info.beforeselectedRowId = -1;
    this._info.editLineId = -1;

    return this;
}

/**
 * 데이터를 바인딩한다.
 */
Grid.prototype.data = function (grdData) {

    this.clearGridData();
    var me = this;

    $('.i-am-hungry', me.$grid.parent().parent()).remove();

    $(grdData).each(function (i, row) {
        me._data.originalData.push(row);
        me._data.serverRowNum++;
        me._data.gridData.push(gfnCloneObj(row));
        me.$grid.jqGrid('addRowData', me._nextRowId(), row);
    })

    if (me._grdInfo.iAmHungry && $.isEmptyObject(grdData)) {
        me.$grid.parent()
            .after('<div class="i-am-hungry" style="font-size:16px;margin:1em;text-align:center">' +
                this._grdInfo.iAmHungry + '</div>')
    }

    if (this._info.$pager && this._info.$pager.length > 0) {
        this.pageRender();
    }
}

Grid.prototype.iamhungry = function (say) {
    this._grdInfo.iAmHungry = say || "검색 결과가 없습니다.";
    return this
}

/**
 * 이벤트 기능을 활성화 한다.
 */
Grid.prototype._initevent = function () {

    var me = this;
    this._eventMap = {};

    var arr = [

        {
            gridEvent: "onSelectRow",
            jqEvent: "onSelectRow"
        }
        ,
        {
            gridEvent: "onDblClickRow",
            jqEvent: "ondblClickRow"
        }
        , {
            gridEvent: "onAfterInsertRow",
            jqEvent: "afterInsertRow"
        }, {
            gridEvent: "onBeforeProcessing",
            jqEvent: "beforeProcessing"
        }, {
            gridEvent: "onBeforeRequest",
            jqEvent: "beforeRequest"
        }, {
            gridEvent: "onBeforeSelectRow",
            jqEvent: "beforeSelectRow",
            defaultReturn: true
        }, {
            gridEvent: "onGridComplete",
            jqEvent: "gridComplete"
        }, {
            gridEvent: "onLoadBeforeSend",
            jqEvent: "loadBeforeSend"
        }, {
            gridEvent: "onLoadComplete",
            jqEvent: "loadComplete"
        }, {
            gridEvent: "onLoadError",
            jqEvent: "loadError"
        }, {
            gridEvent: "onCellSelect",
            jqEvent: "onCellSelect"
        }, , {
            gridEvent: "onHeaderClick",
            jqEvent: "onHeaderClick"
        }, {
            gridEvent: "onPaging",
            jqEvent: "onPaging"
        }, {
            gridEvent: "onRightClickRow",
            jqEvent: "onRightClickRow"
        }, {
            gridEvent: "onSelectAll",
            jqEvent: "onSelectAll"
        }, {
            gridEvent: "onSelectRow",
            jqEvent: "onSelectRow"
        }, {
            gridEvent: "onSortCol",
            jqEvent: "onSortCol"
        }, {
            gridEvent: "onRowattr",
            jqEvent: "rowattr"
        }, {
            gridEvent: "onResizeStart",
            jqEvent: "resizeStart"
        }, {
            gridEvent: "onResizeStop",
            jqEvent: "resizeStop"
        }, {
            gridEvent: "onSerializeGridData",
            jqEvent: "serializeGridData"
        }];

    arr
        .forEach(function (ev) {

            // 이벤트맵 생성
            me._eventMap[ev.gridEvent] = [];

            // 이벤트맵 바인딩
            me._grdInfo[ev.jqEvent] = function (p1, p2, p3, p4, p5, p6) {

                // if(ev.jqEvent == "ondblClickRow"){
                // $log("ondblClickRow");
                // $log(p1);
                // $log(p2);
                // $log(p3);
                // $log(p4);
                // }

                // rmrjf dhoTjdy rdnfdu qhkdy.. wlwjrnlsms tpemf
                // 리턴값이 있는 이벤트 함수 때문에 변경.
                for (var i = 0; i < me._eventMap[ev.gridEvent].length; i++) {
                    var ret = me._eventMap[ev.gridEvent][i](p1, p2, p3, p4,
                        p5, p6);
                    if (ev.defaultReturn != undefined
                        && ev.defaultReturn == true && ret == false) {
                        return false;
                    }
                }

                // 기본 리턴값이 있으면 그 놈을 리턴한다.
                if (ev.defaultReturn != undefined)
                    return ev.defaultReturn;

                // return 값이 없는 이벤트 함수 일때.
                // me._eventMap[ev.gridEvent].forEach(function(ef){
                // var ret = ef(p1,p2,p3,p4,p5,p6);
                // // TODO 리턴 값의 정리가 필요하다.
                // })
                // return ev.defaultReturn;
            }

            // 이벤트가 추가되면 이벤트맵 queue 에 적재한다.
            me[ev.gridEvent] = function (func) {
                me._eventMap[ev.gridEvent].push(func);

                if (ev.gridEvent === 'onDblClickRow') {
                    me._eventMap[ev.gridEvent].push(function () {
                        window.getSelection && window.getSelection().removeAllRanges()
                    })
                }
            }
        });

}

/**
 * 그리드의 행갯수를 리턴한다.
 */
Grid.prototype.length = function () {
    return this.$grid.getDataIDs().length;
}

// -- 선언 이후에 적용할 수 있는 api --//
/**
 * 해당 행의 값을 리턴한다. rowId을 비워서 호출할 경우 현재행의 값을 리턴한다.
 */
Grid.prototype.getRowData = function (rowId) {

    if (rowId == undefined || rowId == null) {
        rowId = this.getRowId();
        if (rowId == null) {
            throw new Error('행을 선택하십시오.');
        }
    }

    if (rowId > this._data.gridData.length) {
        throw new Error('존재하지 않는 rowId(' + rowId + ') 입니다. ');
    }

    rowId = rowId * 1;
    // return this.$grid.jqGrid('getRowData',rowId);
    // _gridData 기준으로 변경
    return $.extend(true, {}, this._data.gridData[rowId], this.$grid.getRowData(rowId))//gfnCloneObjWithPublic(this._data.gridData[rowId]);

}

/**
 * 변경이 발생한 데이터를 모두 가져온다.
 */
Grid.prototype.getCUDDatas = function () {

    // 편집모드를 해제한다.
    /*if (this._info.editLineId != -1) {
        this.$grid.jqGrid('saveRow', this._info.editLineId, true);
        this._onChangeGridToData(this._info.editLineId);
        this._info.editLineId = -1;
    }*/

    var ret = [];

    this._data.gridData.forEach(function (row) {
        if (row._status == 'C' || row._status == 'U' || row._status == 'D') {
            ret.push(gfnCloneObj(row))
        }
    });

    return ret;

}

/**
 * 그리드에 있는 정보를 데이터로 내 보낸다.
 */
Grid.prototype.getDatas = function () {
    var me = this,
        ret = [];

    this._data.gridData.forEach(function (row, i) {
        if (row._status == 'C' || row._status == 'U' || row._status == 'N'
            || row._status == '' || row._status == undefined) {
            ret.push($.extend(true,
                {},
                me._info.lineEditable ? me.$grid.getRowData(i) : row)
            )
        }
    });

    return ret;

}
Grid.prototype.setRowBackground = function (rowId, color) {
    this.$grid.setRowData(rowId, false, {background: color});
}

/**
 * 그리드의 셀의 정보를 가져온다.
 */
Grid.prototype.getCell = function (rowId, columnName) {
    return this.$grid.jqGrid('getCell', rowId, columnName);
}

/**
 * 그리드의 셀의 정보를 수정한다.
 */
Grid.prototype.setCell = function (rowId, columnName, value) {
    var gridRow = this._data.gridData[rowId]; //행에반영
    gridRow[columnName] = value;
    this.$grid.jqGrid('setCell', rowId, columnName, value);//그리드에 반영
    this._onChangeGridToData(rowId); //상태업데이트
}

/**
 * 현재선택되어 있는 RowId를 리턴
 */
Grid.prototype.getRowId = function () {
    return this.$grid.jqGrid('getGridParam', 'selrow');
}


/**
 * 멀티선택되어 있을 경우 array 행 리턴
 */
Grid.prototype.getRowIds = function () {
    return $.extend([], this.$grid.jqGrid('getGridParam', 'selarrrow'));
}

Grid.prototype._nextRowId = function () {
    return ++this._data.currentRowId;
}

/**
 * 그리드에 행을 추가한다. ex) grdMain.addRow(); grdMain.addRow({id:1 , name:"ㅎㅎ"});
 */
Grid.prototype.addRow = function (obj, position, srcrowid) {

    var rowData = gfnCloneObj(obj);

    // 내부데이터처리
    rowData._status = 'C';
    this._data.gridData.push(rowData);

    var rowid = this._nextRowId()

    // 그리드에 행추가
    this.$grid.jqGrid('addRowData', rowid, rowData, position, srcrowid);

    if (this._info.lineEditable) {
        this.$grid.jqGrid('editRow', rowid, false)
    }

    $('.i-am-hungry', this.$grid.parent().parent()).remove();
}

/**
 * 해당행의 정보가 수정된다.
 */
Grid.prototype.updateRow = function (rowId, obj) {

    if (rowId == undefined) {
        rowId = this.getRowId();
    }

    if (rowId < 0) {
        throw new Error('잘못된 행번호');
    }
    else if (rowId > this._data.currentRowId) {
        throw new Error('잘못된 행번호');
    }

    if (obj == undefined) {
        throw new Error('데이터가 등록되지 않았습니다.');
    }

    // jq-gird에 적용
    this.$grid.jqGrid('setRowData', rowId, obj);

    // Grid-data에 적용
    //gfnObjAttrPushWithPublic(obj, gridRow); // 값을 gridData로 밀어 넣어준다.

    // 상태변경
    this._onChangeGridToData(rowId, obj)

}

/**
 * 그리드에서 데이터가 수정이 되었을 경우. Grid data에 반영
 */
Grid.prototype._onChangeGridToData = function (rowId, row) {

    this._isUpdatableState(rowId, 'U'); // 변경이 가능한지 체크

    var jqGirdRow = this.$grid.getRowData(rowId); //화면 그리드에 있는데이터
    var gridRow = this._data.gridData[rowId]; // 행에 있는 원래 데이터

    //행에 있는 원래 데이터가 getRowData로 부정확하게 데이터를 수집하는 경우가 있다.
    //셀에 텍스트가 아니 html 객체로 되어 있는 경우..
    //이럴 경우는 getCell일 경우에만 정상적으로 동작을 하더라....

    for (var colname in this._info.colType) {
        if (this._info.colType[colname] == 'alwayscheckbox') {
            jqGirdRow[colname] = this.getCell(rowId, colname);
        }
        else if (this._info.colType[colname] == 'alwaysradiobox') {
            if (jqGirdRow[colname] === 'Y') {
                this._data.gridData.forEach(function (row) {
                    row[colname] = 'N'
                })
                this._data.gridData[rowId][colname] = 'Y'
            }
            jqGirdRow[colname] = this.getCell(rowId, colname);
        }
        else if (this._info.colType[colname] == 'button') {
            delete jqGirdRow[colname];
        }
    }

    // gfnObjAttrPushWithPublic(jqGirdRow, gridRow);
    this._data.gridData[rowId] = $.extend(true, gridRow, jqGirdRow, row)

    this._statusUpdate(rowId);

}

/**
 * 상태를 업데이트 한다. 데이터가 다르면 Update 데이터가 같으면 Normal 로 되돌린다.
 */
Grid.prototype._statusUpdate = function (rowId) {

    this._isUpdatableState(rowId, 'U');
    var status = this._data.gridData[rowId]._status;

    if (rowId < this._data.serverRowNum) {
        if (status == 'N' || status == 'U') {
            if (gfnIsCompareObj(this._data.originalData[rowId],
                this._data.gridData[rowId])) {
                this._data.gridData[rowId]._status = 'N';
            }
            else {
                this._data.gridData[rowId]._status = 'U';
            }
        }
    }
    else {

    }

}

/**
 * 해당 타입으로 변경이 가능한가를 체크한다.
 */
Grid.prototype._isUpdatableState = function (rowId, type) {

    if (rowId < 0 || rowId > this._data.currentRowId) {
        throw new Error('존재하지 않는 행입니다. rowId : ' + rowId);
    }
    else if (rowId < this._data.serverRowNum) {
        if (!(type == 'U' || type == 'D')) {
            throw new Error('처리할 수 없는 유형입니다.');
        }
        else {
            if (this._data.gridData[rowId]._status == 'D')
                throw new Error('삭제된 데이터입니다.');
        }
    }
    else {
        if (!(type == 'U' || type == 'D')) {
            throw new Error('처리할 수 없는 유형입니다.');
        }
        else {
            if (this._data.gridData[rowId]._status == 'D')
                throw new Error('삭제된 데이터입니다.');
        }
    }

}

/**
 * 그리드의 행을 삭제한다. 행이 지정되지 않을 경우 현재선택된 행이 삭제된다. ex) grdMain.deleteRow(1); //1행을
 * 삭제한다. grdMain.deleteRow(); //현재 행을 삭제한다.
 */
Grid.prototype.deleteRow = function (rowId) {

    if (rowId == undefined) {
        rowId = this.getRowId();
    }

    if (rowId < this._data.serverRowNum) {
        var org = this._data.originalData[rowId];
        org._status = "D";
        this._data.gridData[rowId]._status = 'D';
    }
    else {
        this._data.gridData[rowId]._status = 'X';
    }

    this.$grid.delRowData(rowId);
}

/**
 * 그리드의 전체 rowId 목록을 리턴한다.
 */
Grid.prototype.getDataIDs = function () {
    return this.$grid.getDataIDs();
}

/**
 * 컬럼의 내용으로 rowId를 가져온다.
 * 여러건이라하더라도 단건을 리턴한다.
 */
Grid.prototype.getRowIdByColValues = function (colname, value) {
    var rowids = this.getDataIDs();
    for (var i = 0; i < rowids.length; i++) {
        var data = this.getRowData(rowids[i]);
        if (data[colname] == value)
            return rowids[i];
    }
    return;
}

/**
 * 그리드의 내역을 엑셀다운로드 한다.
 */
Grid.prototype.excelDownload = function (option) {

    if (this.length() == 0) {
        alert('검색된 데이타가 존재하지 않습니다.');
        return false;
    }

    if (option == undefined) {
        option = {};
    }
    ;
    if (option.fileName == undefined) {
        option.fileName = this._grdInfo.caption + ".xlsx";
    }
    if (option.sheetName == undefined) {
        option.sheetName = this._grdInfo.caption;
    }

    var $table = this.$grid.clone();
    var $gbox = this.$grid.closest('.ui-jqgrid');
    var $theader = $gbox.find('thead').clone();
    $table.prepend($theader);
    $table.find('.jqgfirstrow,.ignore-xlsx').remove();

    var sheet = XLSX.utils.table_to_sheet($table[0]);
    var book = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(book, sheet, option.sheetName);
    XLSX.writeFile(book, option.fileName);

}

/**
 * 현재 그리드의 내역 뿐만 아니라. 페이징 처리로 인해 노출되지 않은 나머지에 대해서도 전체 엑셀다운로드 한다.
 */
Grid.prototype.excelAllDownload = function (option) {
    if (!this._info.paging) { //페이징 되는 그리드가 아닐 경우 화면에 있는 것만 처리
        this.excelDownload();
        return;
    }

    if (this.length() === 0) {
        alert('검색된 데이타가 존재하지 않습니다.');
        return false;
    }

    option = $.extend({
        fileName: this._grdInfo.caption + '.xlsx',
        sheetName: this._grdInfo.caption
    }, option)

    var colNames = this.$grid.getGridParam('colNames'),
        aliases = [],
        names = [],
        codes = {};

    $(this.$grid.getGridParam('colModel')).each(function (i, col) {
    	if(!gfnIsNull(col.classes) && col.classes == 'excel-hidden'){

    	}else if (col.hidden != true || (!gfnIsNull(col.classes) && col.classes == 'excel-show')) {
            aliases.push(colNames[i])
            names.push(col.name);
            if (col.colOption && col.colOption.cmmnGroup)
                codes[col.name] = gfnGetComCode(col.colOption.cmmnGroup)
        }
    })

    var n,
        datasetName = '',
        condition = $.extend({}, this._info.paging.condition, {pageNo: 1, pageSize: Math.pow(2, 20) - 1});

    for (n in this._info.paging.transaction._outmapping.dataset) {
        if (this._info.paging.transaction._outmapping.dataset[n].obj === this) {
            datasetName = this._info.paging.transaction._outmapping.dataset[n].name;
        }
    }

    $T(this._info.paging.transaction.$ajax.url)
        .inData(this._info.paging.conditionName, condition)
        .onLoad(function (e) {
            Grid.output(e.datasets[datasetName],
                codes,
                names,
                aliases,
                option.fileName,
                option.sheetName)

        })
        .post();
}

Grid.fitting = function (arr, props, codes) {
    var list = [],
        converter = function (item, prop) {
            if (!codes.hasOwnProperty(prop)) return item[prop];

            var i = 0, currCode = codes[prop];
            for (; i < currCode.length; i++) {
                if (currCode[i].cmmn_code === item[prop]) {
                    return currCode[i].cmmn_code_nm;
                }
            }

            return item[prop];
        };

    $(arr).each(function (i, item) {
        list[i] = {};
        $(props).each(function (j, prop) {
            list[i][prop] = converter(item, prop)
        })
    })

    return list
}
Grid.output = function (json, codes, names, aliases, filename, sheetName) {
    var workbook = XLSX.utils.book_new(),
        worksheet = XLSX.utils.json_to_sheet(
            Grid.fitting(json, names, codes), {
                header: names
            }
        );

    $(aliases).each(function (i, alias) {
        worksheet[XLSX.utils.encode_cell({c: i, r: 0})].v = alias
    })

    if (!filename) {
        filename = $('.content-title')
            .text()
            .replace(/[/]/, '') || location.pathname.replace(/.+(\/(.+)\.do)/, '$2')
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.writeFile(workbook, filename)
}
/**
 * 그리드의 내역을 클립보드에 복사한다.
 */
Grid.prototype.clipboard = function () {

    if (this.length() == 0) {
        alert('검색된 데이타가 존재하지 않습니다.');
        return false;
    }

    var $table = this.$grid;
    var $table = this.$grid.clone();
    $table.find('.jqgfirstrow').remove();
    var $hiddenDiv = $('<div class=".invisible"></div>');
    var $body = $(document.body);
    $body.append($hiddenDiv);
    $hiddenDiv.append($table);

    if (document.body.creatTextRange) {
        var textRange = document.body.creatTextRange();
        textRange.moveToElementText($table[0]);
        textRange.execCommand("Copy");
        $hiddenDiv.remove();
        alert('클립보드에 복사되었습니다.');
    }
    else {
        window.getSelection().selectAllChildren($table[0]);
        document.execCommand("Copy");
        $hiddenDiv.remove();
        alert('클립보드에 복사되었습니다.');
    }

}


/**
 * 목록의 마지막 rowId
 * @returns {*}
 */
Grid.prototype.getLastRowNum = function () {
    return this.$grid.find('.jqgrow:last').prop('id')
};


/**
 *
 */
Transaction.prototype.dataType = function (dataType) {
    this.$ajax.dataType = dataType;
    return this;
}

/**
 * REST API 사용할 때, HTTP method 별 처리
 */
Transaction.prototype.req = function (options) {
    var tx = this,
        origin = tx.$ajax.url,
        pageable = {size: 20},
        grid = undefined,
        parameterize = function (f, s) {
            var body = {},
                callback;

            if (typeof f === 'function') callback = f;
            else if (f) {
                if (typeof s === 'function')
                    callback = s;

                body = f;
            }

            return [body, callback]
        },
        paginate = function (done, status, xhr) {
            var metadata = JSON.parse(xhr.getResponseHeader('X-Paginate') || null);
            if (grid && metadata) {
                grid._info.paging.condition = {
                    pageNo: metadata.pageNumber + 1,
                    totalPageCnt: Math.ceil(metadata.total / metadata.pageSize),
                    totalCnt: metadata.total,
                    transaction: tx
                };

                Grid.prototype.pageRender.call(grid);

                $('a[onclick]', grid._info.$pager).each(function (i, el) {
                    var index = /gfnGo\(["']?(\d+)/.exec(el.getAttribute('onclick'))[1];

                    $(el).attr('onclick', '').click(function () {
                        pageable.req.get(
                            $.extend({}, pageable.parameter, {page: index, size: pageable.size}),
                            pageable.callback
                        )
                    });
                });

                if (grid._info.$pager.is('.page-resizable')) {
                    $('.total', grid._info.$pager).prepend('<span>검색개수</span><select><option>10</option><option>20</option><option>30</option><option>40</option><option>50</option></select> &nbsp;');
                    $('.total>select', grid._info.$pager)
                        .val(pageable.size)
                        .change(function () {
                            pageable.size = pageable.parameter.size = this.value;
                            pageable.req.get(
                                $.extend({}, pageable.parameter, {page: 1, size: pageable.size}),
                                pageable.callback
                            )
                        })
                }
            }
        },
        body = function (method, f, s) {
            var param = parameterize(f, s);

            tx.$ajax.type = tx.$ajax.method = method;
            tx.$ajax.dataType = '';
            tx._in = param[0];
            tx._eventMap.onLoadCompleted = param[1] ? [param[1]] : [];
            tx.post();
        };

    if (options instanceof Grid) grid = options;
    else if ($.isPlainObject(options)) {
        Object.keys(options || {}).forEach(function (key) {
            if (options[key] instanceof Grid) grid = options[key];
            else if (key.match(/size/i)) $.extend(pageable, {size: Number(options[key])});
        });
    }

    return {
        get: function (f, s) {
            var param = parameterize(f, s),
                parameterObject = param[0],
                callbackFunction = param[1],
                queries = [];

            if (grid) {
                parameterObject = $.extend({}, pageable, parameterObject);
            }

            Object.keys(parameterObject).forEach(function (key) {
                if (!$.isFunction(parameterObject[key]) && !$.isPlainObject(parameterObject[key]))
                    queries.push(key + '=' + encodeURIComponent(parameterObject[key]));
            });

            tx.$ajax.url += queries.length ? '?' + queries.join('&') : '';
            tx.$ajax.type = tx.$ajax.method = 'get';
            tx.$ajax.dataType = '';
            tx._in = undefined;
            tx._eventMap.onLoadCompleted = callbackFunction ? [callbackFunction] : [];

            if (grid) {
                tx._eventMap.onLoadCompleted.push(paginate);
                $.extend(pageable, {
                    req: this,
                    parameter: parameterObject,
                    callback: callbackFunction
                });
            }

            tx.post();
            tx.$ajax.url = origin;
        },
        post: function (f, s) {
            body('post', f, s);
        },
        put: function (f, s) {
            body('put', f, s);
        },
        delete: function (f, s) {
            body('delete', f, s);
        }
    };
};

function $TR(jqExpression) {
    return new Tree(jqExpression);
}

function Tree(jqExpression) {

    this.$tree = $(jqExpression);
    if (this.$tree.length != 1) {
        throw new Error('Tree객체를 특정할 수 없습니다.');
    }

    this._event = {};

}

Tree.prototype.option = function (option) {

    var templateOption = {
        rootValue: null
        , upperColumn: ""
        , keyColumn: ""
        , nameColumn: ""
        , ignoreNoParent: true //부모가 없으면 append 하지 않는다.
    };

    this._option = {};

    for (var n in templateOption) {
        if (option[n] != undefined) {
            this._option[n] = option[n];
        }
        else {
            this._option[n] = templateOption[n];
        }
    }

    return this;
}

/**
 * 선택 시 이벤트 바인딩
 */
Tree.prototype.onSelectRow = function (func) {
    this._event.onSelectRow = func;
    return this;
}


Tree.prototype.clear = function () {
    this.$tree.empty();
    this._data = [];
    return this;
}

/**
 * 선택된 행의 정보를 리턴한다.
 */
Tree.prototype.getSelectRow = function(){
	var $on = this.$tree.find('.on');
	if($on.length <1){
		return ;
	}
	return $on.parent().data().data;
}

///**
// * 첫번째 행을 강제 선택한다.
// */
//Tree.prototype.selectFirstRow = function(){
//	this.$tree.find('a._li').click();
//}

/*
Tree.prototype.build = function(){
	this.clear();

	debugger;
	return this;
}
*/

/**
 * 데이터를 밀어 넣는다.
 */
Tree.prototype.data = function (data) {

    this.clear();
    this.addData(data);

}


Tree.prototype.addData = function (data) {

    for (var i = 0; i < data.length; i++) {

        if (data[i][this._option.upperColumn] == this._option.rootValue) {
            this._addRoot(data[i]);
        }
        else {
            var parent_data = this.lookupByUpper(data[i][this._option.upperColumn]);

            if (parent_data == undefined || parent_data == null) {
                if (this._option.ignoreNoParent == false) {
                    this._addRoot(data[i]);
                }
                else {
                    continue;
                }
            }
            else {
                this._addchild(parent_data, data[i]);
            }
        }
    }

    $.fnTreeMenu(this.$tree); //퍼블

}

Tree.prototype.open = function(){
	this.$tree.find('ul').show();
	this.$tree.find('a.control').addClass("close");
}

Tree.prototype.close = function(){
	this.$tree.find('ul').hide();
}

/**
 * uppperkey로 데이터를 찾아 낸다.
 */
Tree.prototype.lookupByUpper = function (upperKey) {
    for (var i = 0; i < this._data.length; i++) {
        if (this._data[i][this._option.keyColumn] == upperKey) {
            return this._data[i];
        }
    }
    return null;
}

Tree.prototype._addRoot = function (child) {

    var li = '<li><a class="_li">' + child[this._option.nameColumn] + '</a></li>';
    var $li = $(li);
    var $a = $li.children('a');

    $li.data('data', child);
    $li.data('tree', this);

    var me = this;
    $a.click(function () {
        var data = $(this).parent().data('data');
        var tree = $(this).parent().data('tree');
        me.$tree.find('a').removeClass('on')
        $(this).addClass('on');
        if (tree._event.onSelectRow) {
            tree._event.onSelectRow(data);
        }
    });


    //view
    this.$tree.append($li);

    //data
    this._data.push(child);
    child.$li = $li; // 본인을 가진다.

}

/**
 * 자식을 추가한다
 */
Tree.prototype._addchild = function (parent_data, child) {

    var li = '<li><a class="_li">' + child[this._option.nameColumn] + '</a></li>';
    var $li = $(li);
    var $a = $li.children('a');

    $li.data('data', child);
    $li.data('tree', this);
    var me = this;

    $a.click(function () {
        var data = $(this).parent().data('data');
        var tree = $(this).parent().data('tree');
        me.$tree.find('a').removeClass('on')
        $(this).addClass('on');
        if (tree._event.onSelectRow) {
            tree._event.onSelectRow(data);
        }
    });

    if (parent_data.$ul) {

    }
    else {
        parent_data.$ul = $('<ul></ul>');
        parent_data.$li.append(parent_data.$ul);
    }

    parent_data.$ul.append($li);
    //data
    this._data.push(child);
    child.$li = $li;

}

/**
 * 로그아웃처리가 된다.
 * 팝업에서 호출한 경우 팝업이 닫히고 메인창은 로그인페이지로 이동한다.
 * 메인에서 호출한 경우 로그인 페이지로 이동한다.
 * @returns
 */
function gfnLogout(gbn) {

	for(i=0;i<arrayWindow.length;i++){
    	arrayWindow[i].close();
    }

	$T('/logout.json')
        .onLoad(function (e) {
            //alert('로그아웃되었습니다.');
        	var hurl = '/loginForm.do';
        	if(!gfnIsNull(gbn)){
        		hurl = hurl + '?gbn='+gbn;
        	}
            (window.opener || window).top.location.href = hurl;
        })
        .post();
}


function gfnServerType(){
	var serverType = "";

	var hostname = location.hostname;
	//hostname= "www.factoryon.go.kr";

	if(hostname.indexOf("10.60.200") != -1 || hostname.indexOf("10.60.110") != -1 || hostname.toLowerCase().indexOf("factoryon.go.kr")  != -1){
		serverType = "prod";
	}else if(hostname.indexOf("10.60.119.201") != -1){
		serverType = "test";
	}else{
		serverType = "local"
	}

	return serverType;
}

function gfnReport(params) {

    var reportServerUrl = (location.hostname === 'localhost' ? 'http://10.60.119.201:8180' : '') + "/ClipReport4/report.jsp?";
    //용지방향에 따라 width 변경
    var width = "";
    if(params.orientation == "H"){
    	width = "1200";
    }else{
    	width = "950";
    }
    var height = "1000";
    var top = "10";
    var left = "10"
    var op = "status=no,location=no,width=" + width + ",height=" + height + ",left=" + left + ",top=" + top;
    var parmaString = "";
    for (n in params) {
        if (params[n] != "") {
            parmaString += "&" + n + "=" + encodeURIComponent(params[n]);
        }
    }
    window.open(reportServerUrl + parmaString, '_blank', op);

}

//메뉴를 이동한다.
function gfnGoMenu(menu_id, info) {
    if (menu_id) {
        location.href = window.contextPath + '/menu/' + menu_id + '.do'.replace(/\/\//, '/');
    }

    gfnSetCookie('prev', info, info ? 1 : -1)
}

//(최상위)부모창의 메뉴를 이동한다.
function gfnGoParentMenu(menu_id) {

    var win = window;
    while (win.opener != null) {
        win = win.opener;
    }
    //최상위부모
    win.location.href = '/menu/' + menu_id + '.do';
    try {
        onClosing();
    }
    catch (e) {
    	$log('에러가 발생하였습니다.');
        $log(e);
    }

}

// /ui/~ 로 이동한다. 현재 메뉴를 가지고 이동을 한다.
// ex) gfnGoUi('/ui/cm/UserRegConfirmInfo.do',{a:11,b:"cc",c:"한글"});
function gfnGoUi(url,params){

	if(!url || url ==''){
		throw new Error('url을 넣으십시오.');
	}

	url = url.trim();
	url += "?"
	if(params){
		for (var p in params) {
			url += p + '=' +encodeURIComponent(params[p])+'&';
		}
	}
	url +="__last_menu="+__last_menu;

	location.href = url;

}

/**
 * 화면에서 로딩될때 호출되기를 기대한다.
 * 글로벌하게 적용되기 기대하는 로직을 작성한다.
 * @returns
 */
function gfnPageInit() {

    $('[onEnter]').keypress(function (e) {
        if (e.which == 13) {
            //eval($(this).attr('onEnter'));
        	var enter_event = $(this).attr('onEnter');
        	new Function('return '+enter_event)();

        }
    });

    //숫자
    $('input[stype="num"]').mask('0#');

    if(notFirstFocus != true){ //강제포커스 안되게
	    //첫번째 input 에 포커스
	    if ($('.content').length != 0) {
            var $first = $('.content').find('input[type="text"]:enabled:visible:not(.date-picker)').not('[readonly]');
   	        if ($first.length > 0) {
   	            $($first[0]).css({imeMode: 'active'}).focus();
   	        }
   	    }
   	    else {
   	        var $first = $('body').find('input[type="text"]:enabled:visible:not(.date-picker)').not('[readonly]');
   	        if ($first.length > 0) {
   	            $($first[0]).css({imeMode: 'active'}).focus();
	        }
	    }
    }

    var title = $('.content-title,.pop-title').eq(0).text()
    if (title) {
        document.title = title + "-" + document.title
    }
    else

  //정수  mask
    $('input[stype="number"]').inputmask("numeric", {
    	groupSeparator: ",",
    	digits: 0,
    	placeholder : '',
    	clearMaskOnLostFocus: true,
    	showMaskOnHover: false, // default: true, 마우스 오버 했을 때 형식 노출 여부
      	showMaskOnFocus: false, // default: true, input 박스 클릭 했을 때 형식 노출
        inputEventOnly: false
    });

    //정수  mask
    $('input[stype="number2"]').inputmask("numeric", {
    	groupSeparator: ",",
    	digits: 0,
    	placeholder : '',
    	rightAlign: false,
    	clearMaskOnLostFocus: true,
    	showMaskOnHover: false, // default: true, 마우스 오버 했을 때 형식 노출 여부
      	showMaskOnFocus: false, // default: true, input 박스 클릭 했을 때 형식 노출
        inputEventOnly: false
    });

    /*
  //소수점 2자리 mask
    $('input[stype="numberPoint1"]').inputmask("numeric", {
    	groupSeparator: ",",
    	digits: 2,
    	digitsOptional : false,
    	placeholder : '0',
    	clearMaskOnLostFocus: true,
    	showMaskOnHover: false, // default: true, 마우스 오버 했을 때 형식 노출 여부
      	showMaskOnFocus: false, // default: true, input 박스 클릭 했을 때 형식 노출
        inputEventOnly: true
    });

    //소수점 2자리 mask
    $('input[stype="numberPoint2"]').inputmask("numeric", {
    	groupSeparator: ",",
    	digits: 2,
    	digitsOptional : false,
    	placeholder : '0',
    	clearMaskOnLostFocus: true,
    	showMaskOnHover: false, // default: true, 마우스 오버 했을 때 형식 노출 여부
      	showMaskOnFocus: false, // default: true, input 박스 클릭 했을 때 형식 노출
        inputEventOnly: true
    });

    //소수점 3자리 mask
    $('input[stype="numberPoint3"]').inputmask("numeric", {
    	groupSeparator: ",",
    	digits: 3,
    	clearMaskOnLostFocus: true,
    	digitsOptional : false,
    	placeholder : '0',
    	showMaskOnHover: false, // default: true, 마우스 오버 했을 때 형식 노출 여부
      	showMaskOnFocus: false, // default: true, input 박스 클릭 했을 때 형식 노출
        inputEventOnly: true
    });
*/

    $('input[stype="numberPoint0"]').on('keypress', function(e){
    	return gfnNumberMask(e, 'keypress', 0);
	});

    $('input[stype="numberPoint0"]').on('keyup', function(e){
    	gfnNumberMask(e, 'keyup', 0);
	});

    $('input[stype="numberPoint0"]').on('change paste', function(e){
    	gfnNumberMask(e, 'change', 0);
	});

    $('input[stype="numberPoint0"]').on('keydown', function(e){
    	//e.stopPropagation();
    	if(e.ctrlKey && e.which == 86){
			return false;
		}
	});

    $('input[stype="numberPoint0"]').on('focusout', function(e){
    	//e.stopPropagation();
    	gfnNumberMask(e, 'change', 0);
	});

    $('input[stype="numberPoint1"]').on('keypress', function(e){
    	return gfnNumberMask(e, 'keypress', 1);
	});

    $('input[stype="numberPoint1"]').on('keyup', function(e){
    	gfnNumberMask(e, 'keyup', 1);
	});

    $('input[stype="numberPoint1"]').on('change paste', function(e){
    	gfnNumberMask(e, 'change', 1);
	});

    $('input[stype="numberPoint1"]').on('keydown', function(e){
    	if(e.ctrlKey && e.which == 86){
			return false;
		}
	});

    $('input[stype="numberPoint1"]').on('focusout', function(e){
    	gfnNumberMask(e, 'change', 1);
	});

    $('input[stype="numberPoint2"]').on('keypress', function(e){
    	return gfnNumberMask(e, 'keypress', 2);
	});

    $('input[stype="numberPoint2"]').on('keyup', function(e){
    	gfnNumberMask(e, 'keyup', 2);
	});

    $('input[stype="numberPoint2"]').on('change paste', function(e){
    	gfnNumberMask(e, 'change', 2);
	});

    $('input[stype="numberPoint2"]').on('keydown', function(e){
    	//e.stopPropagation();
    	if(e.ctrlKey && e.which == 86){
			return false;
		}
	});

    $('input[stype="numberPoint2"]').on('focusout', function(e){
    	//e.stopPropagation();
    	gfnNumberMask(e, 'change', 2);
	});

    $('input[stype="numberPoint3"]').on('keypress', function(e){
    	//e.stopPropagation();
    	return gfnNumberMask(e, 'keypress', 3);
	});

    $('input[stype="numberPoint3"]').on('keyup', function(e){
    	//e.stopPropagation();
    	gfnNumberMask(e, 'keyup', 3);
	});

    $('input[stype="numberPoint3"]').on('change paste', function(e){
    	//e.stopPropagation();
    	gfnNumberMask(e, 'change', 3);
    	//e.stopImmediatePropagation(true);
	});

    $('input[stype="numberPoint3"]').on('keydown', function(e){
    	//e.stopPropagation();
    	if(e.ctrlKey && e.which == 86){
			return false;
		}
	});

    $('input[stype="numberPoint3"]').on('focusout', function(e){
    	//e.stopPropagation();
    	gfnNumberMask(e, 'change', 3);
	});

    $('input[stype="numberPoint0"],input[stype="numberPoint1"],input[stype="numberPoint2"],input[stype="numberPoint3"]').css('text-align','right');

    var originalVal = $.fn.val;
    $.fn.val = function () {
    	var result = originalVal.apply(this, arguments);
    	if(arguments.length > 0){
    		if( $(this).attr('stype') == 'numberPoint0'){
    			result[0].value = gfnNumberMaskVal(result[0].value, 0);
    		}
    		if( $(this).attr('stype') == 'numberPoint1'){
    			result[0].value = gfnNumberMaskVal(result[0].value, 1);
    		}
    		if( $(this).attr('stype') == 'numberPoint2'){
    			result[0].value = gfnNumberMaskVal(result[0].value, 2);
    		}
    		if( $(this).attr('stype') == 'numberPoint3'){
    			result[0].value = gfnNumberMaskVal(result[0].value, 3);
    		}
    	}
        return result;
    }

    //문자숫자 mask
    $('input[stype="decimal99"]').inputmask("999999999999999", {
    	groupSeparator: "",
    	placeholder : '',
    	clearMaskOnLostFocus: true,
    	showMaskOnHover: false, // default: true, 마우스 오버 했을 때 형식 노출 여부
      	showMaskOnFocus: false, // default: true, input 박스 클릭 했을 때 형식 노출
        inputEventOnly: true
    });

    //날짜 mask
	$('input[stype="date"]').inputmask("datetime", {
    	placeholder: "_",
        inputFormat: "yyyy-mm-dd",
        outputFormat: "yyyymmdd",
        showMaskOnHover: false, // default: true, 마우스 오버 했을 때 형식 노출 여부
    	showMaskOnFocus: false, // default: true, input 박스 클릭 했을 때 형식 노출
        inputEventOnly: true
	});


    //eng-num

    $('.h-menu,.l-menu').find('a[href]').click(function () {
      var menuId = /menu\/(.+?(?=\.|$))/.exec(this.href)
      if (menuId) {
          var name = $(this).closest('div').prev('a').text().trim()

          if (!name) {
              name = $(this).closest('.l-menu').find('h2').text().trim()
          }

          name += ' > ' + $(this).text().trim()

        $.ajax({
          method: 'post',
          url: '/cm/log',
          data: $.fmt('menu=%{0}&content=%EB%A9%94%EB%89%B4%EC%A0%91%EA%B7%BC: %{1}', menuId[1], encodeURIComponent(name))
        })
      }
    })

    $('#here-is').addClass(function () {
        return this.getAttribute('data-here-is') !== 'production' ? 'where-are-you' : ''
    })
}

function gfnNumberMask(e, nm, digits){

	if(nm == 'keypress'){
		var val = e.target.value;
		if (!(e.which && ((e.which  > 47 && e.which  < 58) || e.which == 8 ||  e.which == 46 || e.which == 45))) {
			e.preventDefault();
			return false;
		}

		var cnt = val.match(/[\.]/g || []);
		if(e.which && e.which == 46 && !(e.target.selectionStart == 0 && val.length > 0 && e.target.selectionEnd == val.length)){
			if(!gfnIsNull(cnt) && cnt.length > 0){
				e.preventDefault();
				return  false;
			}else{
				if(val.length > 0 && (val.length-e.target.selectionStart) > digits){ //소숫점 자리수 몇자리인지 확인 (점찍기용도)
					e.preventDefault();
					return  false;
				}
			}
		}

		if(e.which && e.which == 45 && e.target.selectionStart != 0){
			e.preventDefault();
			return  false;
		}

		var length = $(e.target).attr('maxlength');
		if(!gfnIsNull(length)){

			/*if(val.length >= parseInt(length)-1){
				e.preventDefault();
				return;
			}*/

			if(!gfnIsNull(cnt) && cnt.length > 0){
				var ary = val.split(".");
				var chkVal = numberWithCommas(ary[0].replace(/[^-\.0-9]/g, "")).length;
				if(!gfnIsNull(ary[0]) && chkVal == (length-digits-1)){
					if(e.target.selectionStart < (length-digits) && e.target.selectionEnd < (length-digits)){
						e.preventDefault();
						return false;
					}
				}
			}else{
				var chkVal = numberWithCommas(val.replace(/[^-\.0-9]/g, "")).length;
				if(chkVal == (length-digits-1)){
					if(e.target.selectionStart < e.target.selectionEnd  && (e.which  > 47 && e.which  < 58)){

					}else if(e.which && e.which != 46){
						e.preventDefault();
						return false;
					}
				}else if(chkVal > (length-digits-1)){
					return false;
				}
			}
		}
	}else if(nm == 'keyup'){
		if((e.shiftKey && e.which > 34 && e.which < 40) || (e.which > 34 && e.which < 40) || e.which == 16){
			return false;
		}

		var numberChk = 0;
		var orginVal = e.target.value;
		var val = e.target.value.replace(/[^-\.0-9]/g, "");
		if(gfnIsNull(val)){
			val = "";
		}

		var cnt = val.match(/[\.]/g || []);
		var digitChk = false;
		if(!gfnIsNull(cnt) && cnt.length > 0){
			var ary = val.split(".");
			var nChk = ary[0].length;
			if(!gfnIsNull(ary[0]) && ary[0] != '-0' && ary[0] != '0' && ary[0] != '-'){
				ary[0] = parseInt(ary[0]);
			}
			if(ary[0] == '-'){
				ary[0] = '-0';
				numberChk = 1;
			}
			else if(nChk != ary[0].toString().length){
				numberChk = -1;
			}
			val = numberWithCommas(ary[0])+"."+ary[1].substr(0,digits); //소숫점 자리수 자르기
			if(gfnIsNull(ary[0]) || gfnIsNull(ary[1])){
				digitChk = true;
			}
		}else{
			if(val.length > 1 && val.substr(0,1) == '0'){
				if(parseInt(val) == 0){
					val = "0";
				}else{
					val = numberWithCommas(val.substr(1));
				}
			}else{
				if(val != '-' && val != '-0' && val != '0' && !gfnIsNull(val)){
					val = parseInt(val);
				}
				val = numberWithCommas(val);
			}
		}

		var lng = e.target.selectionStart;
		var lng1 = (orginVal.match(/,/g) || []).length;
		var lng2 = (val.match(/,/g) || []).length;

		if(lng1 < lng2){
			if(e.keyCode != 8){
				lng = lng + (lng2 - lng1);
				//lng++;
			}
		}
		if(lng2 < lng1){lng--;}
		lng = lng + numberChk;
		if(lng == -1){lng = 0;}

		var chkValue = e.target.value.replace(/[^-\.0-9]/g, "");
		e.target.value = val;
		/*if(chkValue != val.replace(/[^-\.0-9]/g, "")){
			console.log("TEST");
			$(e.target).trigger("custom_change");
		}*/

		if(!digitChk){
			$(e.target).trigger("custom_change");
		}

		e.target.selectionStart = lng;
		e.target.selectionEnd = lng;

	}
	else if(nm == 'change'){
		var val = e.target.value.replace(/[^-\.0-9]/g, "");
		//val = numberWithCommas(val);

		if(gfnIsNull(val)){
			$(e.target).trigger("custom_change");
			return true;
		}else{
			var valAry = val.split(".");
			//console.log(val);
			if(val == '-' || (val.substr(0,1) == '-' && parseFloat(val.replace('-','')) == 0)){
				e.target.value = "";
				$(e.target).trigger("custom_change");
			}else{

				var cnt = val.match(/[\.]/g || []);
				if(!gfnIsNull(cnt) && cnt.length > 0){
					var ary = val.split(".");
					if(gfnIsNull(ary[0])){
						val = '0'+val;
					}
					if(gfnIsNull(ary[1])){
						val = val+"0";
					}
					//if(digits - ary[1].toString().length > 0){
						//val = rpad(val,digits-ary[1].toString().length,'0');  //소수점 자르기
					//}
				}else{
					//val = rpad(parseInt(val)+".",digits,'0'); //소수점 붙이기
				}
				val = numberWithCommas(val);
				//val = val.toFixed(digits);
				e.target.value = val;
				$(e.target).trigger("custom_change");
			}
		}

	}
	//return true;
}

function gfnNumberMaskVal(value, digits){
	var val = value.replace(/[^-\.0-9]/g, "");
	//val = numberWithCommas(val);
	if(gfnIsNull(val)){
		return "";
	}

	var cnt = val.match(/[\.]/g || []);
	if(!gfnIsNull(cnt) && cnt.length > 0){
		var ary = val.split(".");
		if(gfnIsNull(ary[0])){
			val = '0'+val;
		}
		if(gfnIsNull(ary[1])){
			val = val+"0";
		}
		//val = rpad(val,digits-ary[1].toString().length,'0');  //소수점 자르기
	}else{
		//val = rpad(parseInt(val)+".",digits,'0'); //소수점 붙이기
	}
	val = numberWithCommas(val);
	//val = val.toFixed(digits);
	return val;
}

function rpad(str, padLen, padStr) {
    var plusStr = "";
	if (padStr.length > parseInt(padLen)) {
        console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str + "";
    }
	plusStr += ""; // 문자로
    padStr += ""; // 문자로
    while (plusStr.length < padLen){
    	plusStr += padStr;
    }
    str += (plusStr.length >= padLen ? plusStr.substring(0, padLen) : plusStr);
    return str;
}

function lpad(str, padLen, padStr) {
    var plusStr = "";
	if (padStr.length > parseInt(padLen)) {
        console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str + "";
    }
	plusStr += ""; // 문자로
    padStr += ""; // 문자로
    while (plusStr.length < (padLen-str.length)){
    	plusStr += padStr;
    }
    str = plusStr + str;
    return str;
}


Date.prototype.HALF_DAYS = ['오전', '오후'];
Date.prototype.UNIT_TOKEN = {
    yyyy: [/\d{4}/, Date.prototype.setFullYear, Date.prototype.getFullYear],
    yy: [/\d{2}/, function (v) {
        this.setFullYear(Math.floor(new Date().getFullYear() / 1000) * 1000 + Number(v))
    }, function () {
        return String(this.getFullYear()).substring(2)
    }],
    MM: [/\d{2}/, function (v) {
        this.setMonth(v - 1)
    }, function () {
        return ('0' + (this.getMonth() + 1)).substr(-2)
    }],
    M: [/\d{1,2}/, function (v) {
        this.setMonth(v - 1)
    }, function () {
        return this.getMonth() + 1
    }],
    dd: [/\d{2}/, Date.prototype.setDate, function () {
        return ('0' + this.getDate()).substr(-2)
    }],
    d: [/\d{1,2}/, Date.prototype.setDate, function () {
        return this.getDate()
    }],
    HH: [/\d{2}/, function (v) {
        this.setHours(this.getHours() + Number(v))
    }, function () {
        return ('0' + this.getHours()).substr(-2)
    }],
    H: [/\d{1,2}/, function (v) {
        this.setHours(this.getHours() + v)
    }, function () {
        return this.getHours()
    }],
    hh: [/\d{2}/, function (v) {
        this.setHours(this.getHours() + Number(v))
    }, function () {
        return ('0' + String(this.getHours() % 12 || 12)).substr(-2)
    }],
    h: [/\d{1,2}/, function (v) {
        this.setHours(this.getHours() + Number(v))
    }, function () {
        return this.getHours() % 12 || 12
    }],
    mm: [/\d{2}/, function (v) {
        this.setMinutes(this.getMinutes() + Number(v))
    }, function () {
        return ('0' + this.getMinutes()).substr(-2)
    }],
    m: [/\d{1,2}/, function (v) {
        this.setMinutes(this.getMinutes() + Number(v))
    }, function () {
        return this.getMinutes()
    }],
    ss: [/\d{2}/, function (v) {
        this.setSeconds(this.getSeconds() + Number(v))
    }, function () {
        return ('0' + this.getSeconds()).substr(-2)
    }],
    s: [/\d{1,2}/, function (v) {
        this.setSeconds(this.getSeconds() + Number(v))
    }, function () {
        return this.getSeconds()
    }],
    SSS: [/\d{1,3}/, Date.prototype.setMilliseconds, function () {
        return ('00' + this.getMilliseconds()).substr(-3)
    }],
    S: [/\d{1,3}/, Date.prototype.setMilliseconds, function () {
        return this.getMilliseconds()
    }],
    a: [new RegExp(Date.prototype.HALF_DAYS.join('|')), function (v, h) {
        h = this.getHours();
        this.setHours(h + (Date.prototype.HALF_DAYS[1] === v ? 12 : 0))
    }, function () {
        return this.HALF_DAYS[Math.floor(this.getHours() / 12)]
    }]
};
/**
 * 문자로 된 날짜를 입력 받아, 패턴을 이용해서 날짜 객체로 만들어요.
 * 패턴은 {Date.prototype.UNIT_TOKENS} 참조

 * @example Date.prototype.parse('지금은 1983-9-5 오후, 1:23:45.67 이에요.', '지금은  yyyy-M-d a, H:m:s.S 이에요.');
 * @example Date.of('2019-01-31 12:34:56.890', 'yyyy-MM-dd HH:mm:ss.SSS');
 *
 * @param date: string
 * @param pattern: string
 * @return Date
 */
Date.prototype.parse = Date.of = function (date, pattern) {
    if (!date || !pattern) return null;

    var index = 0,
        groups = [],
        result = new Date(0, 0, 1);

    pattern.replace(/([^yMdaHhmsS]*)(y+|M+|d+|a|H+|h+|m+|s+|S+)([^yMdHhmsSa]*)/g, function (part) {
        groups.push(/([^yMdaHhmsS]*)(y+|M+|d+|a|H+|h+|m+|s+|S+)([^yMdHhmsSa]*)/.exec(part));
    });

    groups.forEach(function (group) {
        var prefix = group[1],
            unit = group[2],
            suffix = group[3];

        date.substring(index += prefix.length).replace(Date.prototype.UNIT_TOKEN[unit][0], function (token) {
            Date.prototype.UNIT_TOKEN[unit][1].call(result, Number(token) || token);
            index += token.length;
        });

        index += suffix.length;
    });

    return result;
};
/**
 * 날짜 객체를 패턴에 맞게 문자로 치환해요.
 * 패턴은 {Date.prototype.UNIT_TOKENS} 참조
 *
 * @example new Date().format('yyyy-MM-dd a HH:mm:ss.SSS')
 *
 * @param pattern: string
 * @return string
 */
Date.prototype.format = function (pattern) {
    return pattern.replace(/y+|M+|d+|H+|h+|m+|s+|S+|a/g, function (unit) {
        Object.keys(this.UNIT_TOKEN).some(function (key) {
            if (key === unit) {
                unit = this.UNIT_TOKEN[key][2].call(this);
                return true;
            }
        }.bind(this));
        return unit;
    }.bind(this))
};

/**
 * 팝업창 크기 조절(popupWindow Resize)
 * @example resizeWin()
 * @param
 * @returns
 */
function resizeWin(bbsAt) {
    var strWidth;
    var strHeight;

    //innerWidth / innerHeight / outerWidth / outerHeight 지원 브라우저
    if (window.innerWidth && window.innerHeight && window.outerWidth && window.outerHeight) {
        strWidth = $('.layerpop').outerWidth() + (window.outerWidth - window.innerWidth);
        strHeight = $('.layerpop').outerHeight() + (window.outerHeight - window.innerHeight);
    }
    else {
        var strDocumentWidth = $(document).outerWidth();
        var strDocumentHeight = $(document).outerHeight();

        window.resizeTo(strDocumentWidth, strDocumentHeight);

        var strMenuWidth = strDocumentWidth - $(window).width();
        var strMenuHeight = strDocumentHeight - $(window).height();

        strWidth = $('.layerpop').outerWidth() + strMenuWidth;
        strHeight = $('.layerpop').outerHeight() + strMenuHeight;
    }

    //resize
    if (bbsAt)
        window.resizeTo(strWidth, strHeight + 83);
    else
        window.resizeTo(strWidth, strHeight);
}


function gfnSetCookie(name, value, exp) {
    var date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
};

function gfnGetCookie(cookieName) {
    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if (start != -1) {
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if (end == -1) end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);

};

function gfnDeleteCookie(cookieName) {
    var expireDate = new Date();
    document.cookie = cookieName + "= " + "; expires=-1";
}

/* 파일 업로드 */
$.fn.fileuploadClear = function (callback) {
    if (this.data('atchmnflManageNo')) {
        $T('/attach-file/rollback').req()
            .get({
                    atchmnflManageNo: this.data('atchmnflManageNo')
                },
                function () {
                    $.isFunction(callback) && callback(arguments)
                })
    }

    return this
};
$.fn.fileuploadDelete = function (atchmnflManageNo, serverAtchmnflNm, callback) {
    if (this.data('atchmnflManageNo')) {
        $T('/attach-file/delete').req()
            .get({
                    atchmnflManageNo: atchmnflManageNo || this.data('atchmnflManageNo'),
                    serverAtchmnflNm: serverAtchmnflNm
                },
                function () {
                    $.isFunction(callback) && callback(arguments)
                })
    }

    return this
};
$.fn.fileupload = function (callback, prepared) {
    if (this.data('fn')) {
        callback = this.data('fn').callback
        prepared = this.data('fn').prepared
    }
    else {
        this.data('fn', {
            callback: callback,
            prepared: prepared
        })
    }

    if (!this.data('atchmnflSeCode')) {
        console.error(this.get(0));
        throw new TypeError('첨부파일 구분을 위한 data-atchmnfl-se-code 속성이 필요해요.');
    }

    if (!$('#fileupload-style').length) {
        $('head').append('<style id="fileupload-style">.fileupload--disabled label { display: none }</style>')
    }

    var uploader = this,
        isSingle = this.is('.fileupload--single'),
        isWithGrid = this.is('.fileupload--grid'),
        label = $('label', uploader).add($('<label class="fileupload__guide"/>')).eq(0),
        grid = null,
        gridData = null,
        uploading = function (files, datas) {
            if (isSingle && files.length > 1) {
                throw alert('여기는 파일을 하나만 올릴 수 있습니다.');
            }

            for (var i = 0; i < files.length; i++) {
                if (files[i].size === 0) {
                    throw alert('내용이 없는 파일은 업로드 할 수 없습니다: ' + files[i].name)
                }
            }

            if (isWithGrid && !gridData) {
                grid = $('.ui-jqgrid-btable', uploader)
                gridData = {
                    index: grid.getGridParam('selrow'),
                    data: grid.getRowData(grid.getGridParam('selrow'))
                }
            }

            if ($.isFunction(prepared) && prepared(files, datas, gridData) === false) {
                return
            }

            var i,
                tx = $T(datas.url || '/attach-file.do')
                    .multipart()
                    .inData('raw', datas)
                    .onLoadCompleted(function (res) {
                        $('input[type=file]', uploader).val('')

                        if (!datas.atchmnflManageNo && res && res.length) {
                            uploader.data('atchmnflManageNo', res[0].atchmnflManageNo);
                        }

                        callback && callback(res, gridData)

                        gridData = null
                    })
                    .onError(function (xhr) {
                        gridData = null;
                        $('input[type=file]', uploader).val('')

                        if (xhr.status === 400) { // BAD REQUEST
                            alert(xhr.responseText + ' 은(는) 업로드할 수 없는 파일 입니다.')
                        }
                    });

            for (i = 0; i < files.length; i++)
                tx.addFile('files', files[i]);

            tx.post()
        },
        style = {
            uploadable: {
                backgroundColor: 'rgba(0,0,0,.2)',
                border: '2px dashed #555',
                borderRadius: 4,
                boxSizing: 'border-box',
                zIndex: 9999
            },
            reset: {
                backgroundColor: '',
                border: '',
                zIndex: isWithGrid ? -1 : 0
            }
        };

    $(document)
        .off('dragover drop')
        .on('dragover drop', function (e) {
            e.preventDefault()
            return false
        })

    label
        .css({
            cursor: 'pointer',
            left: 1,
            position: 'absolute',
            top: 1,
            zIndex: isWithGrid ? -1 : 0
        })
        .off('dragenter dragleave drop')
        .on('dragenter', function () {
            $(this).css(style.uploadable);
        })
        .on('dragleave drop', function () {
            $(this).css(style.reset);
        })
        .on('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();

            if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.types) {
                if (e.originalEvent.dataTransfer.types[0] === 'Files') {
                    uploading(e.originalEvent.dataTransfer.files, $(uploader).data())
                }
            }
        })
        .height('100%')
        .width(uploader.width())
        .append(
            $('<input type="file" ' + (isSingle ? '' : 'multiple') + '>')
                .css({
                    position: 'absolute',
                    display: 'none'
                })
                .change(function (e) {
                    if (this.value && e.originalEvent.target.files)
                        uploading(e.originalEvent.target.files, uploader.data());
                })
        )

    uploader
        .css({position: 'relative'})
        .append(label)
        .off('dragenter')
        .on('dragenter', function (e) {
            e.stopPropagation();
            e.preventDefault();

            label.width(uploader.width())
                .css(style.uploadable)
        })

    if (isWithGrid) {
        uploader.off('dragenter')

        label.width(0)

        var dragEnter = function (el, index) {
                el = $(this)
                index = el.prop('id')

                gridData = {
                    index: index,
                    data: grid.getRowData(index)
                }

                label.css({
                    width: el.width(),
                    height: el.height() - 1,
                    top: el.position().top + 2,
                    zIndex: 1
                })
            },
            gridUploader = function () {
                grid = $('.ui-jqgrid-btable', uploader)
                grid.jqGrid('setGridParam', {
                    onSortedCol: function () {
                        grid.closest('.fileupload--grid').fileupload()
                    }
                })

                if (grid.length === 0) {
                    setTimeout(gridUploader, 500)
                    return
                }

                grid.setGridParam({
                    afterAddRow: function (row) {
                        $('#' + ($.type(row) === 'string' ? row : row.rowid), grid)
                            .off('dragover')
                            .on('dragover', dragEnter)
                    }
                })

                grid.after(label)

                grid.find('tr[id]')
                    .off('dragover')
                    .on('dragover', dragEnter)
            }

        gridUploader()
    }

    return this
};

/* 검증 */
$.fn.validate = function (fn) {
    var form = this,
        vo = this.data('vo');

    if (!vo)
        throw new Error('data-vo 속성에 값을 입력해주세요.');

    var serialized = {};
    $('[name]', form).each(function (i, item) {
        serialized[item.name] = encodeURIComponent(item.value)
    });

    var success = false;
    $.ajax({
            async: false,
            method: 'post',
            url: '/valid/' + this.data('vo') + '.do',
            contentType: 'application/json',
            data: JSON.stringify(serialized)
        })
        .done(function () {
            success = true
        })
        .fail(function (xhr) {
            var errors = $.parseJSON(xhr.responseText);

            if ($.type(fn) === 'function') fn(errors);
            else if (errors.length) {
                var item = $('[name=' + errors[0].field + ']', form);

                alert((item.prop('title') || '') + ' 항목의 ' + errors[0].defaultMessage);
                item.focus()
            }
            else {
                alert('오류가 발생 하였습니다. 지속되는 경우 관리자에게 문의 바랍니다.')
            }
        });

    return success;
};

$.fn.counter = function (value, duration) {
    this.prop('counting', 0)
        .animate({
            counting: value
        }, {
            duration: duration || 1000,
            easing: 'swing',
            step: function (n) {
                this.text(Math.ceil(n))
            }.bind(this)
        })

    return this
}

$.fn.cursor = function( pos ) {
    this.each( function( index, elem ) {
        if( elem.setSelectionRange ) {
            elem.setSelectionRange(pos, pos);
        } else if( elem.createTextRange ) {
            var range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    });

    return this;
}


//글자 포멧팅
function gridCellNumFormat( cellvalue, options, rowObject ){

	if(!gfnIsNull(cellvalue)){
		if(!gfnIsNull(options.colModel.formatoptions) && !gfnIsNull(options.colModel.formatoptions.decimalPlaces)){
			cellvalue = parseFloat(cellvalue.toString().replace(/[^\.0-9]/g,'')).toFixed(options.colModel.formatoptions.decimalPlaces)+"";
		}
	}

	var rslt;

	if(numberWithCommas(cellvalue) == '0.000' ){
		rslt = '0';
	}else{
		rslt = numberWithCommas(cellvalue);
	}

	return rslt;
}

function numberWithCommas(x) {

	var y;

	if(x == null ||  x == ""){
		return "";
	}

	if(x.toString().indexOf(",") != -1){
		return x;
	}

	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toDigitKorean(number) {
    var unitIndex = 0,
        numberString = String(number),
        digitNames = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'],
        units = ['', '십', '백', '천'], highUnits = ['', '만', '억', '조', '경'],
        inKorean = function (digit) {
            var korean = [],
                i = digit.length - 1, j = 0, name = null

            for (; i > -1; i--, j++) {
                name = digitNames[Number(digit.charAt(j))]
                if (name) {
                    korean.push(name + units[i])
                }
            }

            return korean.join('')
        }

    while (/\d([^\d]*)$/.test(
        numberString = numberString.replace(/(\d{1,4})([^\d]*)$/, function (ignored, digit, before) {
            var korean = inKorean(digit), highUnit = highUnits[unitIndex++]
            return korean + (korean && highUnit) + before
        })
    ));

    return numberString
}

function presentationOnCivilComplaintsStatus() {
    $.ajax('/dashboard/civil-complaints-status.json')
        .done(function (res) {
            $('.civil-complaints-status').each(function (i, el, value) {
                value = res[el.getAttribute('data-key')] || 0;
                (el = $(el)).prop('Counter', 0).addClass(value > 0 ? 'on' : '')
                    .animate({
                        Counter: value
                    }, {
                        duration: 2000,
                        easing: 'swing',
                        step: function (n) {
                            el.text(Math.ceil(n))
                        }
                    })
            })
        })
}

//JQGRID header checkbox event
function gfnGridCheckBox(e){
   e = e||event;/* get IE event ( not passed ) */
   e.stopPropagation? e.stopPropagation() : e.cancelBubble = true;
}

//JQGRID header checkbox event
function gfnGridAllCheck(e, grid, colNm, valAry){
   e = e||event;/* get IE event ( not passed ) */
   e.stopPropagation? e.stopPropagation() : e.cancelBubble = true;

   var val = e.target.checked ? valAry[0] : valAry[1];
   var rowId = grid.getDataIDs();
   $.each(rowId, function(i,idx){
       grid.$grid.getGridParam('data')[idx][colNm] = val
       grid.$grid.find('#' + idx).find('[title=' + colNm + ']').prop('checked', !!val.match(/Y|true/))
	   grid.setCell(idx, colNm, val);
   });
}

// startsWith IE 처리
String.prototype.startsWith = function(str) {
if (this.length < str.length) { return false; }
return this.indexOf(str) == 0;
}

// endsWith IE 처리
String.prototype.endsWith = function(str) {
if (this.length < str.length) { return false; }
return this.lastIndexOf(str) + str.length == this.length;
}

// String.repeat IE 처리
if (!String.prototype.repeat) {
	String.prototype.repeat = function(count) {
		'use strict';
		if (this == null) {
			throw new TypeError('can\'t convert ' + this + ' to object');
		}
		var str = '' + this;
		count = +count;
		if (count != count) {
			count = 0;
		}
		if (count < 0) {
			throw new RangeError('repeat count must be non-negative');
		}
		if (count == Infinity) {
			throw new RangeError('repeat count must be less than infinity');
		}
		count = Math.floor(count);
		if (str.length == 0 || count == 0) {
			return '';
		}
		// Ensuring count is a 31-bit integer allows us to heavily optimize the
		// main part. But anyway, most current (August 2014) browsers can't handle
		// strings 1 << 28 chars or longer, so:
		if (str.length * count >= 1 << 28) {
			throw new RangeError(
					'repeat count must not overflow maximum string size');
		}
		var maxCount = str.length * count;
		count = Math.floor(Math.log(count) / Math.log(2));
		while (count) {
			str += str;
			count--;
		}
		str += str.substring(0, maxCount - str.length);
		return str;
	}
}

function gfnIsNull(val){
	if(val != null && val != undefined && val != '' && val != [] && val != NaN && val != 'NaN' && val != {}){
		return false;
	}
	return true;
}

function gfnValidyyMMdd(value) {
    var plainText = (value||'').replace(/[^0-9]/g, '')
    return /^\d{2}.?(0[1-9])|(1[0-2]).?(0[1-9]|[12][0-9]|3[0-1])$/.test(value)
        && Date.of(plainText, 'yyMMdd').format('yyMMdd') === plainText
}

window.XLSX && window.XLSX.utils && (XLSX.utils.extract = function (file, callback) {
    var r = new FileReader()

    r.onload = function (progressEvent) {
        if (r.readAsBinaryString) {
            callback(XLSX.read(progressEvent.target.result, {type: 'binary'}))
            return
        }

        callback(XLSX.read(
            btoa(
                function (data) {
                    var o = "", i = 0, l = 1024;
                    for (; i < data.byteLength / l; ++i) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(i * l, i * l + l)));
                    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(i * l)));
                    return o;
                }(progressEvent.target.result)
            ),
            {type: 'base64'})
        )
    }

    r.readAsBinaryString ? r.readAsBinaryString(file) : r.readAsArrayBuffer(file)
})

function downloadAttachFile(manageNo, uuid) {
    var forDownload = $('iframe[name=for-download]')[0];
    (forDownload ? forDownload.contentWindow : window)
        .location.href = (window.contextPath||'') + '/attach-file/' + manageNo + '/' + uuid
}

function downloadAttachFileBySn(manageNo, atchmnflSn) {
    var forDownload = $('iframe[name=for-download]')[0];
    (forDownload ? forDownload.contentWindow : window)
        .location.href = (window.contextPath||'') + '/attach-file/download/' + manageNo + '/' + atchmnflSn
}

//
// fitting legacy jqgrid
//


$.jgrid && ($.jgrid.gridUnload = function (s) {
    $(s).GridUnload()
})

$.urlParam = function (name) {
    return (new RegExp('(?:\\?|&)' + name + '=([^&#]*)').exec(location.search) || [])[1] || ''
}

function gfnSortDatas(data, property, direction) {
	//if ($.type(data) == 'array') {
	if (!$.isArray(data)) {
    	return data;
    }

    var first = 1, second = -1;

    if (/desc/i.test(direction)) {
        first = -1
        second = 1
    }

    return data.sort(function (i, j) {
        return i[property] > j[property] ? first : second
    })
}
