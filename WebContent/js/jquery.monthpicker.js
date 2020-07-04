;(function ($) {
    var sequnceId = 1,
        methods = {
            init: function (options) {
                return this.each(function () {
                    var
                        $this = $(this),
                        data = $this.data('monthpicker'),
                        year = (options && options.year) ? options.year : (new Date()).getFullYear(),
                        settings = $.extend({
                            pattern: 'yyyy-mm',
                            selectedMonth: null,
                            selectedMonthName: '',
                            selectedYear: year,
                            startYear: year - 50,
                            finalYear: year + 10,
                            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                            id: "monthpicker_" + sequnceId++,
                            openOnFocus: true,
                            disabledMonths: []
                        }, options);

                    settings.dateSeparator = settings.pattern.replace(/(mm|m|yyyy|yy|y)/ig, '');

                    // If the plugin hasn't been initialized yet for this element
                    if (!data) {

                        $(this).data('monthpicker', {
                            'target': $this,
                            'settings': settings
                        });

                        if (settings.openOnFocus === true) {
                            $this.on('focus', function () {
                                $this.monthpicker('show');
                            });
                        }

                        $this.monthpicker('parseInputValue', settings);

                        $this.monthpicker('mountWidget', settings);

                        $this.on('monthpicker-click-month', function () {
                            $this.monthpicker('setValue', settings);
                            $this.monthpicker('hide');
                        });

                        $this.addClass("monthpicker-widget-container");
                        $(document).off("mousedown.monthpicker").on("mousedown.monthpicker", function (e) {
                            if (!e.target.className || e.target.className.toString().indexOf('monthpicker') < 0) {
                                $(this).monthpicker('hideAll');
                            }
                        });
                    }
                });
            },

            show: function () {
                $(this).monthpicker('hideAll');
                var widget = $('#' + this.data('monthpicker').settings.id);
                widget.css("top", this.offset().top + this.outerHeight());
                if ($(window).width() > (widget.width() + this.offset().left)) {
                    widget.css("left", this.offset().left);
                } else {
                    widget.css("left", this.offset().left - widget.width());
                }
                widget.show();
                this.trigger('monthpicker-show');
            },

            hide: function () {
                var widget = $('#' + this.data('monthpicker').settings.id);
                if (widget.is(':visible')) {
                    widget.hide();
                    this.trigger('monthpicker-hide');
                }
            },

            hideAll: function () {
                $(".monthpicker-widget-container").each(function () {
                    if (typeof ($(this).data("monthpicker")) != "undefined") {
                        $(this).monthpicker('hide');
                    }
                });
            },

            setValue: function (settings) {
                var month = settings.selectedMonth.toString(),
                    year = settings.selectedYear.toString();

                if (settings.pattern.indexOf('mm') >= 0 && month.length === 1) {
                    month = '0' + settings.selectedMonth;
                }

                if (settings.pattern.indexOf('yyyy') === -1 && settings.pattern.indexOf('yy') >= 0) {
                    year = year.toString().substr(2);
                }

                this.val(settings.pattern.replace(/y+/, year).replace(/m+/, month)).change();
            },
            mountWidget: function (settings) {
                var
                    monthpicker = this,
                    container = $('<div id="' + settings.id + '" class="ui-datepicker ui-monthpicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" />'),
                    header = $('<div class="ui-datepicker-header ui-datepicker-title ui-widget-header ui-helper-clearfix ui-corner-all" />'),
                    combo = $('<select class="ui-datepicker-year monthpicker" />'),
                    table = $('<table/>'),
                    tbody = $('<tbody/>'),
                    tr = $('<tr/>'),
                    td = '',
                    option = null,
                    attrSelectedYear = $(this).data('selected-year'),
                    attrStartYear = $(this).data('start-year'),
                    attrFinalYear = $(this).data('final-year');

                if (attrSelectedYear) {
                    settings.selectedYear = attrSelectedYear;
                }

                if (attrStartYear) {
                    settings.startYear = attrStartYear;
                }

                if (attrFinalYear) {
                    settings.finalYear = attrFinalYear;
                }

                container.css({
                    position: 'absolute',
                    zIndex: 999999,
                    whiteSpace: 'nowrap',
                    width: '250px',
                    overflow: 'hidden',
                    textAlign: 'center',
                    display: 'none',
                    top: monthpicker.offset().top + monthpicker.outerHeight(),
                    left: monthpicker.offset().left
                });

                combo.on('change', function () {
                    var months = $(this).parent().parent().find('td[data-month]');
                    months.removeClass('ui-state-active');
                    if ($(this).val() === String(settings.selectedYear)) {
                        months.filter('td[data-month=' + settings.selectedMonth + ']').addClass('ui-state-active');
                    }
                    monthpicker.trigger('monthpicker-change-year', $(this).val());
                });

                // mount years combo
                for (i = settings.startYear; i <= settings.finalYear; i++) {
                    option = $('<option/>').attr('value', i).append(i);
                    if (settings.selectedYear === i) {
                        option.attr('selected', 'selected');
                    }
                    combo.append(option);
                }
                header.append(combo).appendTo(container);

                // mount months table
                for (var i = 1; i <= 12; i++) {
                    td = $('<td class="ui-state-default monthpicker monthpicker-month" style="padding:5px;cursor:default;" />').attr('data-month', i);
                    if (settings.selectedMonth === i) {
                        td.addClass('ui-state-active');
                    }
                    td.append(settings.monthNames[i - 1]);
                    tr.append(td).appendTo(tbody);
                    if (i % 3 === 0) {
                        tr = $('<tr/>');
                    }
                }

                tbody.find('.monthpicker-month').on('click', function () {
                    var m = parseInt($(this).data('month'));
                    if ($.inArray(m, settings.disabledMonths) < 0) {
                        settings.selectedYear = $(this).closest('.ui-datepicker').find('.ui-datepicker-year').first().val();
                        settings.selectedMonth = $(this).data('month');
                        settings.selectedMonthName = $(this).text();
                        monthpicker.trigger('monthpicker-click-month', $(this).data('month'));
                        $(this).closest('table').find('.ui-state-active').removeClass('ui-state-active');
                        $(this).addClass('ui-state-active');
                    }
                });

                table.append(tbody).appendTo(container);

                container.appendTo('body');
            },

            destroy: function () {
                return this.each(function () {
                    $(this).removeClass('monthpicker-widget-container').unbind('focus').removeData('monthpicker');
                });
            },

            getDate: function () {
                var settings = this.data('monthpicker').settings;
                if (settings.selectedMonth && settings.selectedYear) {
                    return new Date(settings.selectedYear, settings.selectedMonth - 1);
                } else {
                    return null;
                }
            },

            parseInputValue: function (settings) {
                if (this.val()) {
                    if (settings.dateSeparator) {
                        var val = this.val().toString().split(settings.dateSeparator);
                        if (settings.pattern.indexOf('m') === 0) {
                            settings.selectedMonth = val[0];
                            settings.selectedYear = val[1];
                        } else {
                            settings.selectedMonth = val[1];
                            settings.selectedYear = val[0];
                        }
                    }
                }
            }

        };

    $.fn.monthpicker = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error(method + ' does not exist');
        }
    };

})(jQuery);
