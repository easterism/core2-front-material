
var CoreUI = typeof CoreUI !== 'undefined' ? CoreUI : {};

CoreUI.table = {

    loc: {},
    _events: {
        checked: [],
        reload: [],
    },

    preloader : {

        /**
         * @param resource
         */
        show : function(resource) {

            var wrapper = document.getElementById('table-' + resource + '-wrapper');

            if (wrapper) {
                var nodes = wrapper.childNodes;
                for (var i = 0; i < nodes.length; i++) {
                    if (/(\\s|^)preloader(\\s|$)/.test(nodes[i].className)) {
                        nodes[i].style.display = 'block';
                        break;
                    }
                }
            }
        },


        /**
         * @param resource
         */
        hide : function(resource) {
            var wrapper = document.getElementById('table-' + resource + '-wrapper');

            if (wrapper) {
                var nodes = wrapper.childNodes;
                for (var i = 0; i < nodes.length; i++) {
                    if (/(\\s|^)preloader(\\s|$)/.test(nodes[i].className)) {
                        nodes[i].style.display = 'none';
                        break;
                    }
                }
            }
        }
    },


    search: {

        /**
         * @param resource
         */
        toggle : function(resource) {

            var $search_container = $("#search-" + resource);
            var templateContainer = $("#templates-" + resource);
            var columns           = $("#column-switcher-" + resource);

            if (columns.is(":visible")) {
                columns.hide();
            }

            if (templateContainer.is(":visible")) {
                templateContainer.hide();
            }

            $search_container.toggle('fast');

            var form = $search_container.find("form");
            form[0].elements[0].focus();
        },


        /**
         * @param resource
         * @param isAjax
         */
        clear : function(resource, isAjax) {

            var post      = {};
            var container = '';
            var pageParam = '_page_' + resource;
            var url       = CoreUI.table.loc[resource];

            url  = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
            url  = url.replace(/\&__clear=\d*/, '');
            url += "&" + pageParam + '=1';
            url += "&__clear=1";

            post['search_clear_' + resource] = 1;

            if (isAjax) {
                CoreUI.table.preloader.show(resource);
                var wrapper = document.getElementById("table-" + resource + "-wrapper");
                container   = wrapper ? wrapper.parentNode : null;

                load(url, post, container, function () {
                    CoreUI.table.preloader.hide(resource);
                    preloader.callback();
                    CoreUI.table._callEventReload(resource);
                });

            } else {
                var path = CoreUI.table._resetPathPage(resource);

                load(path, post, container, function () {
                    preloader.callback();
                    CoreUI.table._callEventReload(resource);
                });
            }
        },


        /**
         * @param resource
         * @param form
         * @param isAjax
         */
        submit : function(resource, form, isAjax) {

            var allInputs = $(form).find(":input");
            var post      = {};
            var container = '';
            var pageParam = '_page_' + resource;
            var url       = CoreUI.table.loc[resource];

            url  = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
            url  = url.replace(/\&__search=\d*/, '');
            url += "&" + pageParam + '=1';
            url += "&__search=1";


            post = allInputs.serializeArray();

            if (isAjax) {
                CoreUI.table.preloader.show(resource);
                var wrapper = document.getElementById("table-" + resource + "-wrapper");
                container   = wrapper ? wrapper.parentNode : null;

                load(url, post, container, function () {
                    CoreUI.table.preloader.hide(resource);
                    preloader.callback();
                    CoreUI.table._callEventReload(resource);
                });

            } else {
                var path = CoreUI.table._resetPathPage(resource);

                console.log(path)

                load(path, post, container, function () {
                    preloader.callback();
                    CoreUI.table._callEventReload(resource);
                });
            }
        }
    },


    filter: {

        /**
         * @param resource
         * @param isAjax
         */
        clear : function(resource, isAjax) {

            var post      = {};
            var container = '';
            var pageParam = '_page_' + resource;
            var url       = CoreUI.table.loc[resource];

            url  = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
            url  = url.replace(/\&__filter_clear=\d*/, '');
            url += "&" + pageParam + '=1';
            url += "&__filter_clear=1";

            post['filter_clear_' + resource] = 1;

            if (CoreUI.table.loc[resource]) {
                if (isAjax) {
                    CoreUI.table.preloader.show(resource);
                    var wrapper = document.getElementById("table-" + resource + "-wrapper");
                    container   = wrapper ? wrapper.parentNode : null;

                    load(url, post, container, function () {
                        CoreUI.table.preloader.hide(resource);
                        preloader.callback();
                        CoreUI.table._callEventReload(resource);
                    });

                } else {
                    var path = CoreUI.table._resetPathPage(resource);

                    load(path, post, container, function () {
                        preloader.callback();
                        CoreUI.table._callEventReload(resource);
                    });
                }
            }
        },


        /**
         * @param resource
         * @param isAjax
         */
        submit : function(resource, isAjax) {

            var allInputs = $("#filter-" + resource).find(":input");
            var post      = {};
            var container = '';
            var pageParam = '_page_' + resource;
            var url       = CoreUI.table.loc[resource];

            url  = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
            url  = url.replace(/\&__filter=\d*/, '');
            url += "&" + pageParam + '=1';
            url += "&__filter=1";

            $.each(allInputs, function(key, input) {
                var name = $(input).attr('name');

                if (name) {
                    if (name.slice(-2) === '[]') {
                        if ( ! post.hasOwnProperty(name)) {
                            post[name] = [];
                        }

                        if ($(input).attr('type') === 'checkbox' && ! $(input).is(':checked')) {
                            return true;
                        }

                        post[name].push($(input).val());

                    } else {
                        if ($(input).attr('type') === 'radio') {
                            if ($(input).is(':checked')) {
                                post[name] = $(input).val();
                            }
                        } else {
                            post[name] = $(input).val();
                        }
                    }
                }
            });

            $.each(post, function (name, value) {
                if (name.slice(-2) === '[]' && typeof value === 'object' && value.length === 0) {
                    post[name.substring(0, name.length - 2)] = '';
                    delete post[name];
                }
            });


            if (isAjax) {
                CoreUI.table.preloader.show(resource);
                var wrapper = document.getElementById("table-" + resource + "-wrapper");
                container   = wrapper ? wrapper.parentNode : null;

                load(url, post, container, function () {
                    CoreUI.table.preloader.hide(resource);
                    preloader.callback();
                    CoreUI.table._callEventReload(resource);
                });

            } else {
                var path = CoreUI.table._resetPathPage(resource);
                load(path, post, container, function () {
                    preloader.callback();
                    CoreUI.table._callEventReload(resource);
                });
            }
        },


        field: {

            /**
             * Поле с периодами
             * @param {jQuery}        container
             * @param {string|number} key
             * @param {string}        resource
             * @param {boolean}       isAjax
             */
            datePeriods: function (container, resource, key, isAjax) {

                let input = container.find('.input-daterangepicker');

                input.daterangepicker({
                    parentEl: container.find('.period-date-container'),
                    opens: 'left',
                    autoUpdateInput: false,
                    locale: {
                        format: 'DD.MM.YYYY',
                        applyLabel: "Применить",
                        cancelLabel: "Отмена",
                        firstDay:1,
                        daysOfWeek: [
                            "Вс","Пн", "Вт", "Ср", "Чт", "Пт", "Сб"
                        ],
                        monthNames: [
                            "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
                        ],
                    }
                }, function(start, end, label) {
                    container.find('.period-value-start').val(start.format('YYYY-MM-DD'));
                    container.find('.period-value-end').val(end.format('YYYY-MM-DD'));
                    container.find('.period-buttons input[type=radio]').prop('checked', false);

                    CoreUI.table.filter.submit(resource, isAjax)
                });

                container.find('.icon-calendar').click(function() {
                    input.trigger("click");
                });

                container.find('.period-buttons input[type=radio]').change(function () {
                    let periodType  = $(this).data('type');
                    let periodCount = $(this).data('count');

                    let dateStartFormat = '';
                    let dateStart       = '';
                    let dateEndFormat   = '';
                    let dateEnd         = '';

                    if (typeof periodCount === 'number') {
                        let start = moment();
                        let end   = moment();

                        if (periodCount <= 0) {
                            switch (periodType) {
                                case 'days':
                                    start = moment().add(periodCount, "days");
                                    break;

                                case 'week':
                                    start = moment().add(periodCount, "weeks");
                                    start.weekday(0);
                                    break;

                                case 'month':
                                    start = moment().add(periodCount, "months");
                                    start.date(1);
                                    break;

                                case 'year':
                                    start = moment().add(periodCount, "years");
                                    start.set('month', 1);
                                    start.set('date', 1);
                                    break;

                                default:
                                    throw new Error('Указан некорректный тип периода');
                                    break;
                            }

                        } else {
                            switch (periodType) {
                                case 'days':
                                    end = moment().add(periodCount, "days");
                                    break;

                                case 'week':
                                    end = moment().add(periodCount, "weeks");
                                    end.weekday(7);
                                    break;

                                case 'month':
                                    end = moment().add(periodCount, "months");
                                    end.endOf('month');
                                    break;

                                case 'year':
                                    end = moment().add(periodCount, "years");
                                    end.endOf('year');
                                    break;

                                default:
                                    throw new Error('Указан некорректный тип периода');
                                    break;
                            }
                        }

                        dateStartFormat = start.format('DD.MM.YYYY');
                        dateEndFormat   = end.format('DD.MM.YYYY');
                        dateStart       = start.format('YYYY-MM-DD');
                        dateEnd         = end.format('YYYY-MM-DD');
                    }

                    if (dateStartFormat || dateEndFormat) {
                        input.data('daterangepicker').setStartDate(dateStartFormat);
                        input.data('daterangepicker').setEndDate(dateEndFormat);

                    } else {
                        input.val('');
                    }

                    container.find('.period-value-start').val(dateStart);
                    container.find('.period-value-end').val(dateEnd);

                    CoreUI.table.filter.submit(resource, isAjax)
                });
            }
        }
    },


    field: {

        /**
         * Для указанного поля добавляет возможность автокомплита
         * @param {HTMLElement|jQuery} input
         * @param {object}             options
         */
        autocomplete: function (input, options) {

            options = $.extend(true, { url: '', minLength: 3 }, options);

            $(input).autocomplete({
                source: function (request, response) {

                    $.ajax({
                        method: 'GET',
                        data: {
                            query: $.trim(request.term)
                        },
                        url: options.url,
                    }).done(function (data) {

                        try {
                            data = CoreUI.table._isObject(data) ? data : JSON.parse(data);

                        } catch (e) {
                            response( [ { __empty__ : 'Не найдено' } ]);
                            return false;
                        }

                        var items = typeof data === 'object' && data.hasOwnProperty('items') && Array.isArray(data.items)
                            ? data.items
                            : [];

                        response(items);

                    }).fail(function (error) {
                        response([]);
                    });
                },
                minLength: options.minLength,
                focus: function( event, ui ) {
                    event.preventDefault();
                    $(input).val(ui.item.label);
                },
                select: function( event, ui ) {
                    event.preventDefault();
                    $(input).val(ui.item.label);
                },
                close: function( event, ui ) {
                    event.preventDefault();
                },
                create: function (event, ui) {

                    $(this).data('ui-autocomplete')._renderItem = function (ul, item) {
                        var info  = item.info ? '<br><small class="text-muted">' + item.info + '</small>': '';
                        var term  = this.term.split(' ').join('|');
                        var label = item.label;

                        if (term) {
                            term = term.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + '' + '-]', 'g'), '\\$&');
                            label = label.replace(
                                new RegExp("(" + term + ")", "gi"),
                                "<b>$1</b>"
                            );
                        }

                        return $('<li>')
                            .attr( "data-value", item.value )
                            .append('<a>' + label + info + '</a>')
                            .appendTo(ul);
                    };

                    $(this).data('ui-autocomplete')._renderMenu = function (ul, items) {
                        var that         = this;
                        var currentGroup = "";

                        ul.css('min-width', $(input).width());
                        ul.css('max-width', 400);

                        $.each( items, function( index, item ) {
                            if (item.group && item.group !== currentGroup) {
                                ul.append( "<li class=\"ui-autocomplete-category\">" + item.group + "</li>" );
                                currentGroup = item.group;
                            }

                            that._renderItemData( ul, item );
                        });
                    };
                }
            })
        },


        /**
         * Для указанного поля добавляет возможность автокомплита с таблицей
         * @param {HTMLElement|jQuery} input
         * @param {object}             options
         */
        autocompleteTable: function (input, options) {

            options = $.extend(true, { url: '', minLength: 3 }, options);

            var fieldSelect = null;
            var columns     = [];

            $(input).autocomplete({
                items: '.ui-menu-item',
                source: function (request, response) {

                    $.ajax({
                        method: 'GET',
                        data: {
                            query: $.trim(request.term)
                        },
                        url: options.url,
                    }).done(function (data) {

                        try {
                            data = CoreUI.table._isObject(data) ? data : JSON.parse(data);

                        } catch (e) {
                            response( [ { __empty__ : 'Не найдено' } ]);
                            return false;
                        }

                        columns = CoreUI.table._isObject(data) && data.hasOwnProperty('columns') && Array.isArray(data.columns)
                            ? data.columns
                            : [];

                        if (CoreUI.table._isObject(data) &&
                            data.hasOwnProperty('field_select') &&
                            typeof data.field_select === 'string'
                        ) {
                            fieldSelect = data.field_select;

                        } else if (columns.length > 0) {
                            $.each(columns, function (key, column) {

                                if (CoreUI.table._isObject(column) &&
                                    column.hasOwnProperty('field') &&
                                    typeof column.field === 'string' &&
                                    column.field
                                ) {
                                    fieldSelect = column.field;
                                    return false;
                                }
                            });
                        }

                        var records = CoreUI.table._isObject(data) && data.hasOwnProperty('records') && Array.isArray(data.records)
                            ? data.records
                            : [];

                        response(records.length > 0 ? records : [ { __empty__ : 'Не найдено' } ]);

                    }).fail(function (error) {
                        response([ { __empty__ : 'Не найдено' } ]);
                    });
                },
                minLength: options.minLength,
                select: function( event, ui ) {
                    event.preventDefault();

                    if (fieldSelect && ui.item) {
                        $(input).val(ui.item.hasOwnProperty(fieldSelect) ? ui.item[fieldSelect] : '');
                    }
                },
                open: function( event, ui ) {
                    $('.ui-autocomplete .ui-menu-item:first').trigger('mouseover');
                },
                close: function( event, ui ) {
                    event.preventDefault();
                },
                create: function (event, ui) {

                    $(this).data('ui-autocomplete')._renderMenu = function (ul, items) {

                        if (items.hasOwnProperty('0') && items[0].hasOwnProperty('__empty__')) {
                            ul.css('padding', '5px 10px');
                            ul.append('<li>' + items[0].__empty__ + '</li>');

                        } else {
                            ul.css('min-width',  $(input).width());
                            ul.css('max-width',  800);
                            ul.css('max-height', 800);
                            ul.css('overflow',   'auto');
                            ul.css('padding',    0);

                            var that         = this;
                            var theadColumns = [];

                            $.each(columns, function (key, column) {

                                if (CoreUI.table._isObject(column) &&
                                    column.hasOwnProperty('field') &&
                                    column.hasOwnProperty('label') &&
                                    typeof column.field === 'string' &&
                                    typeof column.label === 'string' &&
                                    column.field &&
                                    column.label
                                ) {
                                    theadColumns.push('<th>' + column.label + '</th>');
                                }
                            });

                            ul.append(
                                '<table class="table table-condensed table-bordered table-hover" style="margin: 0">' +
                                    '<thead><tr>' + theadColumns.join('') + '</tr></thead>' +
                                    '<tbody></tbody>' +
                                '</table>'
                            );

                            $.each(items, function (index, item) {
                                that._renderItemData(ul, ul.find("> table > tbody"), item);
                            });
                        }
                    };

                    $(this).data('ui-autocomplete')._renderItemData = function (ul, tbody, item) {
                        return this._renderItem(tbody, item)
                            .data("ui-autocomplete-item", item);
                    };

                    $(this).data('ui-autocomplete')._renderItem = function (tbody, item) {
                        var that = this;
                        var term = this.term.split(' ').join('|');
                        var $tr  = $('<tr class="ui-menu-item">');


                        $.each(columns, function (index, column) {

                            if (CoreUI.table._isObject(column) &&
                                column.hasOwnProperty('field') &&
                                column.hasOwnProperty('label') &&
                                typeof column.field === 'string' &&
                                typeof column.label === 'string' &&
                                column.field &&
                                column.label
                            ) {

                                var cellContent = item.hasOwnProperty(column.field) && typeof item[column.field] === 'string'
                                    ? item[column.field]
                                    : '';

                                if (term) {
                                    term        = term.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + '' + '-]', 'g'), '\\$&');
                                    cellContent = cellContent.replace(
                                        new RegExp("(" + term + ")", "gi"),
                                        "<b>$1</b>"
                                    );
                                }

                                $('<td>').html(cellContent).appendTo($tr);
                            }
                        });

                        $tr.click(function () {
                            $(input).val(item.hasOwnProperty(fieldSelect) ? item[fieldSelect] : '');
                            that.close();
                        });

                        item._tr = $tr;

                        return $tr.appendTo(tbody);
                    };
                }
            })
        }
    },

    columnSwitcher: {

        /**
         * Переключение панели управления колонками
         * @param resource
         */
        toggleContainer : function(resource) {

            var searchContainer   = $("#search-" + resource);
            var templateContainer = $("#templates-" + resource);
            var columnsContainer  = $("#column-switcher-" + resource);

            if (searchContainer.is(":visible")) {
                searchContainer.hide();
            }

            if (templateContainer.is(":visible")) {
                templateContainer.hide();
            }

            columnsContainer.toggle('fast');
        },


        /**
         * @param resource
         */
        toggleAllColumns : function(resource) {

            var filterContainer = $("#column-switcher-" + resource + ' form');
            var inputAll        = filterContainer.find('.checkbox-all input');

            if (inputAll.is(":checked")) {
                filterContainer.find('.checkbox input').prop("checked", true);
            } else {
                filterContainer.find('.checkbox input').prop("checked", false);
            }
        },


        /**
         * @param resource
         * @param isAjax
         */
        submit : function(resource, isAjax) {

            var checkboxes = $('#column-switcher-' + resource + ' form').find('.table-switch-column :checkbox:checked');
            var post       = {};
            var columns    = [];
            var container  = '';
            var pageParam = '_page_' + resource;
            var url       = CoreUI.table.loc[resource];

            url  = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
            url  = url.replace(/\&__filter=\d*/, '');
            url += "&" + pageParam + '=1';
            url += "&__filter=1";

            for (var i = 0; i < checkboxes.length; i++) {
                columns.push(checkboxes[i].value);
            }
            post['columns_' + resource] = columns;

            if (isAjax) {
                var wrapper = document.getElementById("table-" + resource + "-wrapper");
                container   = wrapper ? wrapper.parentNode : null;

                load(url, post, container, function () {
                    preloader.callback();
                    CoreUI.table._callEventReload(resource);
                });



            } else {
                load(url, post, container, function () {
                    preloader.callback();
                    CoreUI.table._callEventReload(resource);
                });
            }
        }
    },


    template: {

        /**
         * Переключение панели
         * @param resource
         */
        toggleContainer : function(resource) {

            var searchContainer   = $("#search-" + resource);
            var columnsContainer  = $("#column-switcher-" + resource);
            var templateContainer = $("#templates-" + resource);

            if (searchContainer.is(":visible")) {
                searchContainer.hide();
            }

            if (columnsContainer.is(":visible")) {
                columnsContainer.hide();
            }

            templateContainer.toggle('fast');
        },


        /**
         * Создание критерия поиска
         * @param resource
         * @param isAjax
         */
        create: function (resource, isAjax) {

            var searchControls = $("#search-" + resource).find(":input").serializeArray();

            if ($('#column-switcher-' + resource)[0]) {
                var columnsCheckboxes = $("#column-switcher-" + resource).find(':checkbox:checked');

                for (var i = 0; i < columnsCheckboxes.length; i++) {
                    if (columnsCheckboxes[i].value !== 'on') {
                        searchControls.push({
                            'name': 'columns_' + resource + '[]',
                            'value': columnsCheckboxes[i].value
                        });
                    }
                }
            }


            if ( ! searchControls || searchControls.length === 0) {
                swal('Не заполнены критерии для сохранения', '', 'warning').catch(swal.noop);
                return false;
            }

            if (isAjax) {
                // FIXME бех этого не ставится курсор в поле ввода названия
                $('.modal.in').removeAttr('tabindex');
            }

            swal({
                title: "Укажите название для шаблона",
                input: "text",
                showCancelButton: true,
                confirmButtonColor: '#5bc0de',
                confirmButtonText: "Сохранить",
                cancelButtonText: "Отмена",
                preConfirm: function (templateTitle) {

                    return new Promise(function (resolve, reject) {
                        if ( ! templateTitle || $.trim(templateTitle) === '') {
                            reject('Укажите название');
                        } else {
                            resolve();
                        }
                    });
                },
            }).then(
                function(templateTitle) {

                    preloader.show();

                    searchControls.push({
                        'name' : 'template_create_' + resource,
                        'value': templateTitle,
                    });


                    var pageParam = '_page_' + resource;
                    var url       = CoreUI.table.loc[resource];

                    url  = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
                    url += "&" + pageParam + '=1';

                    if (isAjax) {
                        var container = document.getElementById("table-" + resource).parentNode;
                        load(url, searchControls, container, function () {
                            preloader.hide();
                            CoreUI.table._callEventReload(resource);
                        });

                    } else {
                        var path = CoreUI.table._resetPathPage(resource);

                        load(path, searchControls, '', function () {
                            preloader.hide();
                            CoreUI.table._callEventReload(resource);
                        });
                    }

                }, function(dismiss) {}
            );
        },


        /**
         * Удаление критерия поиска
         * @param resource
         * @param id
         * @param isAjax
         */
        remove: function (resource, id, isAjax) {

            swal({
                title: 'Удалить этот шаблон?',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#f0ad4e',
                confirmButtonText: "Да",
                cancelButtonText: "Нет"
            }).then(
                function(result) {

                    preloader.show();

                    var post = [{
                        'name' : 'template_remove_' + resource,
                        'value': id,
                    }];

                    var pageParam = '_page_' + resource;
                    var url       = CoreUI.table.loc[resource];

                    url  = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
                    url += "&" + pageParam + '=1';

                    if (isAjax) {
                        var container = document.getElementById("table-" + resource).parentNode;
                        load(url, post, container, function () {
                            preloader.hide();
                            CoreUI.table._callEventReload(resource);
                        });

                    } else {
                        load(url, post, '', function () {
                            preloader.hide();
                            CoreUI.table._callEventReload(resource);
                        });
                    }

                }, function(dismiss) {}
            );
        },


        /**
         * Выбор критерия поиска
         * @param resource
         * @param id
         * @param isAjax
         */
        select: function (resource, id, isAjax) {

            preloader.show();

            var post = [{
                'name' : 'template_select_' + resource,
                'value': id,
            }];

            var pageParam = '_page_' + resource;
            var url       = CoreUI.table.loc[resource];

            url  = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
            url += "&" + pageParam + '=1';

            if (isAjax) {
                var container = document.getElementById("table-" + resource).parentNode;
                load(url, post, container, function () {
                    preloader.hide();
                    CoreUI.table._callEventReload(resource);
                });

            } else {
                var path = CoreUI.table._resetPathPage(resource);

                load(path, post, '', function () {
                    preloader.hide();
                    CoreUI.table._callEventReload(resource);
                });
            }
        }
    },


    /**
     * Установка прижатия шапки таблицы к верху страницы
     * @param resource
     */
    setHeadTop: function (resource) {

        setTimeout(function () {
            let table = $('#table-' + resource);

            $('.search-container form', table)
                .css('max-height', '400px')
                .css('overflow', 'auto');

            $('.column-switcher-container form', table)
                .css('max-height', '400px')
                .css('overflow', 'auto');

            table.floatThead({top: 50, zIndex: 1, headerCellSelector: 'tr.table-header>th:visible'});

            $('> thead > tr:first > th', table).css('border-bottom', '1px solid transparent');
            $('> tbody > tr:first > td', table).css('border-top', 'none');

            let body_height          = $('body').height();
            let body_width           = $('body').width();
            let menu_wrapper_width   = $('#menu-wrapper').width();
            let search_height        = $('.search-container', resource).height();
            let search_column_height = $('.column-switcher-container', resource).height();
            const top                = table.position();
            let list_top             = top ? top.top : 0;

            //Отлавливаем изменение размера браузера, сворачивание/разворачивание меню, открытие/закрытие поиска и делаем 'reflow'
            setInterval(function () {
                const current_body_height        = $('body').height();
                const current_body_width         = $('body').width();
                const current_menu_wrapper_width = $('#menu-wrapper').width();
                const current_search_height      = $('.search-container', resource).height();
                const current_column_height      = $('.column-switcher-container', resource).height();
                const top                        = table.position();
                const current_list_top           = top ? top.top : 0;

                table.css('table-layout', 'auto');

                if (current_body_height        !== body_height ||
                    current_body_width         !== body_width ||
                    current_menu_wrapper_width !== menu_wrapper_width ||
                    current_search_height      !== search_height ||
                    current_column_height      !== search_column_height ||
                    current_list_top           !== list_top
                ){
                    table.floatThead('reflow');

                    body_height          = current_body_height;
                    body_width           = current_body_width;
                    menu_wrapper_width   = current_menu_wrapper_width;
                    search_height        = current_search_height;
                    search_column_height = current_column_height;
                    list_top             = current_list_top;
                }
            }, 500);
        }, 500);
    },


    /**
     * @param obj
     * @param resource
     * @param isAjax
     */
    pageSw: function(obj, resource, isAjax) {

        var container = '';
        var pageParam = '_page_' + resource;
        var page      = obj.getAttribute('title');
        var url       = CoreUI.table.loc[resource];

        url = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
        url = url + "&" + pageParam + '=' + page;

        if (isAjax) {
            CoreUI.table.preloader.show(resource);

            var wrapper = document.getElementById("table-" + resource + "-wrapper");
            container   = wrapper ? wrapper.parentNode : null;

            if (url.indexOf('&__') < 0) {
                if (container && container.id) {
                    location.hash = preloader.prepare(location.hash.substr(1) + '&--' + container.id + '=' + preloader.toJson(url));
                }

            } else {
                load(url, '', container, function () {
                    CoreUI.table.preloader.hide(resource);
                    preloader.callback();
                    CoreUI.table._callEventReload(resource);
                });
            }
        } else {
            load(url, '', container, function () {
                preloader.callback();
                CoreUI.table._callEventReload(resource);
            });
        }
    },


    /**
     * @param obj
     * @param resource
     * @param isAjax
     */
    goToPage: function(obj, resource, isAjax) {

        var container = '';
        var pageParam = '_page_' + resource;
        var page      = $('#table-' + resource + '-gotopage').val();
        var url       = CoreUI.table.loc[resource];

        url = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
        url = url + "&" + pageParam + '=' + page;

        if (isAjax) {
            var wrapper = document.getElementById("table-" + resource + "-wrapper");
            container   = wrapper ? wrapper.parentNode : null;

            if (url.indexOf('&__') < 0) {
                if (container && container.id) {
                    location.hash = preloader.prepare(location.hash.substr(1) + '&--' + container.id + '=' + preloader.toJson(url));
                }
            } else {
                load(url, '', container, function () {
                    preloader.callback();
                    CoreUI.table._callEventReload(resource);
                });
            }

        } else {
            load(url, '', container, function () {
                preloader.callback();
                CoreUI.table._callEventReload(resource);
            });
        }
    },


    /**
     * @param resource
     * @param columnNumber
     * @param isAjax
     */
    order : function(resource, columnNumber, isAjax) {

        var container = '';
        var post      = {};
        var pageParam = '_page_' + resource;
        var page      = 1;
        var url       = CoreUI.table.loc[resource];

        url  = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
        url  = url.replace(/\$__order=\d*/, '');
        url += "&" + pageParam + '=' + page;
        url += "&__order=1";


        post['order_' + resource] = columnNumber;

        if (isAjax) {
            CoreUI.table.preloader.show(resource);
            var wrapper = document.getElementById("table-" + resource + "-wrapper");
            container   = wrapper ? wrapper.parentNode : null;

            load(url, post, container, function () {
                CoreUI.table.preloader.hide(resource);
                preloader.callback();
                CoreUI.table._callEventReload(resource);
            });

            preloader.hide();

        } else {
            var path = this._resetPathPage(resource);

            load(path, post, container, function () {
                preloader.callback();
                CoreUI.table._callEventReload(resource);
            });
        }
    },


    /**
     * Перезагрузка таблицы
     * @param resource
     * @param isAjax
     */
    reload: function (resource, isAjax) {

        if (isAjax) {
            CoreUI.table.preloader.show(resource);

            var wrapper = document.getElementById("table-" + resource + "-wrapper");
            container   = wrapper ? wrapper.parentNode : null;

            load(CoreUI.table.loc[resource], {}, container, function () {
                CoreUI.table.preloader.hide(resource);
                preloader.hide();
                CoreUI.table._callEventReload(resource);
            });

        } else {
            load(CoreUI.table.loc[resource], {}, '', function () {
                preloader.hide();
                CoreUI.table._callEventReload(resource);
            });
        }
    },


    /**
     *
     * @param resource
     */
    initSort : function(resource) {

        let container = $("#table-" + resource + " > tbody");

        container.sortable({
            opacity: 0.6,
            distance: 2,
            cursor: "n-resize",
            items: "tr.row-table",
            containment: "parent",
            handle: ".table-row-sortable",
            start: function (event, ui) {
                ui.helper.click(function (event) {
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                    return false;
                });
            },
            update : function (event, ui) {

                let rowsId = [];

                $('tr.row-table', container).each(function (i, tr) {
                    let id = $(tr).find('td .table-row-sortable').data('id');

                    if (id) {
                        rowsId.push(id);
                    }
                });

                $.post("index.php?module=admin&action=seq",
                    {
                        data : rowsId,
                        id : resource
                    },
                    function (data, textStatus) {
                        if (textStatus !== 'success') {
                            $(ui.item[0].parentNode).sortable( "cancel" );
                            return false;
                        } else {
                            if (data && data.error) {
                                swal(data.error, '', 'error').catch(swal.noop);
                                $(ui.item[0].parentNode).sortable( "cancel" );
                                return false;
                            }
                        }
                    },
                    "json"
                );
            }
        });
    },


    /**
     * @param {string}             resource
     * @param {string}             field
     * @param {string}             id
     * @param {jQuery|HTMLElement} container
     * @param {string}             messageActive
     * @param {string}             messageInactive
     */
    switchToggle: function (resource, field, id, container, messageActive, messageInactive) {

        let isActiveControl = $(container).find(':checked').hasClass('coreui-table-switch-active');

        messageActive = typeof messageActive === 'string' && messageActive
            ? messageActive
            : "Активировать?";

        messageInactive = typeof messageInactive === 'string' && messageInactive
            ? messageInactive
            : "Деактивировать?";


        swal({
            title: isActiveControl ? messageInactive : messageActive,
            type: isActiveControl ? "warning" : "info",
            showCancelButton: true,
            confirmButtonColor: isActiveControl ? '#f0ad4e' : '#5bc0de',
            confirmButtonText: "Да",
            cancelButtonText: "Нет"
        }).then(
            function(result) {
                var value = isActiveControl
                    ? $(container).find('.coreui-table-switch-inactive').val()
                    : $(container).find('.coreui-table-switch-active').val();
                $.post('admin/index/switch/' + resource, {
                        data:      field,
                        is_active: value,
                        value:     id
                    }, function(data, textStatus) {
                        if (textStatus === 'success' && data.status === "ok") {

                            if (isActiveControl) {
                                $(container).find('.coreui-table-switch-active').prop('checked', false);
                                $(container).find('.coreui-table-switch-inactive').prop('checked', true);

                            } else {
                                $(container).find('.coreui-table-switch-active').prop('checked', true);
                                $(container).find('.coreui-table-switch-inactive').prop('checked', false);
                            }

                        } else {
                            if (data.status) {
                                swal("Ошибка", data.status, 'error').catch(swal.noop);
                            }
                        }
                    },
                    'json');
            }, function(dismiss) {}
        );
    },


    /**
     * @param resource
     * @param returnArray
     * @returns {*[]|string|*}
     */
    getChecked : function (resource, returnArray) {
        var j = 1;
        if (returnArray === true) {
            var val = [];
        } else {
            var val = "";
        }

        for (var i = 0; i < j; i++) {
            if (document.getElementById("check-" + resource + '-' + j)) {
                if (document.getElementById("check-" + resource + '-' + j).checked) {
                    if (returnArray === true) {
                        val.push(document.getElementById("check-" + resource + '-' + j).value);
                    } else {
                        val += val === ''
                            ? document.getElementById("check-" + resource + '-' + j).value
                            : ',' + document.getElementById("check-" + resource + '-' + j).value;
                    }
                }
                j++;
            }
        }

        return val;
    },


    /**
     * @param resource
     * @param confirmMsg
     * @param noSelectMsg
     * @param isAjax
     */
    deleteRows: function (res, confirmMsg, noSelectMsg, isAjax) {
        res = res.split('.');
        var resource = res[0];
        var val = this.getChecked(resource, true);

        if (val) {
            if (val.length) {
                swal({
                    title: confirmMsg,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#f0ad4e',
                    confirmButtonText: "Да",
                    cancelButtonText: "Нет"
                }).then(
                    function(result) {
                        preloader.show();

                        var errorContainer = $("#table-" + resource + "-error");
                        var container      = '';

                        errorContainer.hide();

                        if (isAjax) {
                            CoreUI.table.preloader.show(resource);
                            var wrapper = document.getElementById("table-" + resource + "-wrapper");
                            container   = wrapper ? wrapper.parentNode : null;
                        }

                        let loc            = CoreUI.table.loc[resource];
                        const searchParams = new URLSearchParams(loc);
                        const module       = searchParams.get("module");
                        let action         = searchParams.get("action");

                        if ( ! action) {
                            action = 'index';
                        }


                        $.ajax({
                            method: "DELETE",
                            dataType: "json",
                            url: module + "/" + action + "/" + resource + "?" + res[1] + "." + res[2] + "=" + val
                        }).success(function (data) {
                            if (data && data.error) {
                                var msg = data.error ? data.error : "Не удалось выполнить удаление";
                                errorContainer.html(msg);
                                errorContainer.show();

                            } else {
                                if (data) {
                                    if (data.notice) {
                                        CoreUI.notice.create(data.notice);
                                    }
                                    if (data.alert) {
                                        alert(data.alert);
                                    }
                                    if (data.loc) {
                                        loc = data.loc;
                                    }
                                }

                                load(loc, '', container, function () {
                                    preloader.callback();
                                    CoreUI.table._callEventReload(resource);
                                });
                            }

                        }).fail(function (response) {

                            if (response.responseJSON && response.responseJSON.error) {
                                var msg = response.responseJSON.error
                                    ? response.responseJSON.error
                                    : "Не удалось выполнить удаление";
                                errorContainer.html(msg);
                                errorContainer.show();

                            } else {
                                swal("Не удалось выполнить удаление", '', 'error').catch(swal.noop);
                            }
                        }).always(function () {
                            CoreUI.table.preloader.hide(resource);
                            preloader.hide();
                        });
                    }, function(dismiss) {}
                );
            } else {
                swal(noSelectMsg, '', 'warning').catch(swal.noop);
            }
        }
    },


    /**
     * Выделение всех строк
     * @param obj
     * @param resource
     */
    checkAll : function (obj, resource) {

        var rowsId        = [];
        var state         = $(obj).is(":checked");
        var checkedInputs = $('#table-' + resource + ' .row-table .checked-row input');

        checkedInputs.prop('checked', state);
        checkedInputs.each(function (key, checked) {
            rowsId.push($(checked).val());
        });

        $('#table-' + resource + ' .coreui-table-row-group .checked-row input').prop('checked', state);

        CoreUI.table._callEventChecked(resource, rowsId, state);
    },


    /**
     * Выделение группы строк
     * @param obj
     * @param resource
     */
    checkGroup : function (obj, resource) {

        var j       = 1;
        var row     = $(obj).parent().parent();
        var rowsId = [];
        var state  = $(obj).is(":checked");

        for (var i = 0; i < j; i++) {
            row = row.next('tr');

            if (row.hasClass('row-table')) {
                var checked = row.find('.checked-row input');
                checked.prop('checked', state);

                rowsId.push(checked.val());

                j++;
            }
        }

        CoreUI.table._callEventChecked(resource, rowsId, state);
    },


    /**
     Выделение строки
     * @param obj
     * @param resource
     */
    checkRow: function (obj, resource) {

        var rowId = $(obj).val();
        var state = $(obj).is(":checked");

        CoreUI.table._callEventChecked(resource, [ rowId ], state);
    },


    /**
     * Событие выполняемое при массовом выделении строк
     * @param resource
     * @param callback
     */
    onChecked: function (resource, callback) {
        if (typeof callback === 'function') {
            CoreUI.table._events.checked.push({
                resource: resource,
                callback: callback
            });
        }
    },


    /**
     * Событие выполняемое при перезагрузке содержимого
     * @param resource
     * @param callback
     */
    onReload: function (resource, callback) {
        if (typeof callback === 'function') {
            CoreUI.table._events.reload.push({
                resource: resource,
                callback: callback
            });
        }
    },


    /**
     * Выполнение событий выделения
     * @param resource
     * @param rowsId
     * @param state
     * @private
     */
    _callEventChecked: function (resource, rowsId, state) {

        if (CoreUI.table._events.checked.length > 0) {
            $.each(CoreUI.table._events.checked, function () {
                if (this.resource === resource &&
                    typeof this.callback === 'function'
                ) {
                    this.callback(rowsId, state);
                }
            })
        }
    },


    /**
     * Выполнение событий перезагрузки
     * @param resource
     * @private
     */
    _callEventReload: function (resource) {

        if (CoreUI.table._events.reload.length > 0) {
            $.each(CoreUI.table._events.reload, function () {
                if (this.resource === resource &&
                    typeof this.callback === 'function'
                ) {
                    this.callback();
                }
            })
        }
    },


    /**
     * Раскрытие / скрытие дополнительных данных строки
     * @param resource
     * @param rowNmbr
     * @param url
     * @param isAjax
     * @deprecated toggleExpandRowUrl
     */
    toggleExpandColumn : function (resource, rowNmbr, url, isAjax) {

        this.toggleExpandRowUrl(resource, rowNmbr, url, isAjax);
    },


    /**
     * Раскрытие / скрытие дополнительных данных строки
     * @param resource
     * @param rowNmbr
     * @param url
     * @param isAjax
     * @param isRebuild
     */
    toggleExpandRowUrl : function (resource, rowNmbr, url, isAjax, isRebuild) {

        var hash   = this.crc32(url);
        var row    = $('#table-' + resource + ' > tbody > tr.row-table').eq(rowNmbr);
        var isLoad = ! row.next().hasClass('row-expand-name-' + hash);

        if (row.hasClass('row-expanded')) {
            if (row.next().is(':visible')) {
                row.next().hide('fast', function () {
                    if (isRebuild === null || isRebuild) {
                        row.removeClass('row-expanded');
                        $(this).remove();
                    }
                })
            } else {
                row.next().show('fast')
            }
        }

        if (isLoad) {
            if (isAjax) {
                CoreUI.table.preloader.show(resource);
            } else {
                preloader.show();
            }

            $.ajax({
                method : 'get',
                url    : url,
                success: function (response) {
                    row.after('<tr class="row-expand" style="display: none"><td colspan="1000">' + response + '</td></tr>');
                    row.addClass('row-expanded');
                    row.next()
                        .addClass('row-expand-name-' + hash)
                        .show('fast');

                    if (isAjax) {
                        CoreUI.table.preloader.hide(resource);
                    } else {
                        preloader.hide();
                    }
                },
                error : function () {
                    CoreUI.notice.create('Ошибка получения содержимого', 'danger');

                    if (isAjax) {
                        CoreUI.table.preloader.hide(resource);
                    } else {
                        preloader.hide();
                    }
                }
            });
        }
    },


    /**
     * Раскрытие / скрытие дополнительных данных строки
     * @param resource
     * @param rowNmbr
     * @param content
     * @param isRebuild
     */
    toggleExpandRowContent : function (resource, rowNmbr, content, isRebuild) {

        var hash    = this.crc32(content);
        var row     = $('#table-' + resource + ' > tbody > tr.row-table').eq(rowNmbr);
        var isLoad  = ! row.next().hasClass('row-expand-name-' + hash);

        if (row.hasClass('row-expanded')) {
            if (row.next().is(':visible')) {
                row.next().hide('fast', function () {
                    if (isRebuild === null || isRebuild) {
                        row.removeClass('row-expanded');
                        $(this).remove();
                    }
                })
            } else {
                row.next().show('fast')
            }
        }

        if (isLoad) {
            row.after('<tr class="row-expand" style="display: none"><td colspan="1000">' + content + '</td></tr>');
            row.addClass('row-expanded');
            row.next()
                .addClass('row-expand-name-' + hash)
                .show('fast');
        }
    },


    /**
     * CRC32 hash
     * @param str
     * @param isNumber
     * @returns {number}
     * @private
     */
    crc32: function(str, isNumber) {

        isNumber = typeof isNumber === 'undefined' ? false : !! isNumber;

        for (var a, o = [], c = 0; c < 256; c++) {
            a = c;
            for (var f = 0; f < 8; f++) {
                a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            }
            o[c] = a;
        }

        for (var n = -1, t = 0; t < str.length; t++) {
            n = n >>> 8 ^ o[255 & (n ^ str.charCodeAt(t))];
        }

        var result = (-1 ^ n) >>> 0;

        if ( ! isNumber) {
            result = result.toString(16);
        }

        return result;
    },


    /**
     * @param resource
     * @param select
     * @param isAjax
     */
    recordsPerPage : function(resource, select, isAjax) {

        var container = '';

        if (isAjax) {
            CoreUI.table.preloader.show(resource);
            var wrapper = document.getElementById("table-" + resource + "-wrapper");
            container   = wrapper ? wrapper.parentNode : null;
        }

        var post = {};
        post['count_' + resource] = select.value;

        var path = this._resetPathPage(resource);

        load(path, post, container, function () {
            CoreUI.table.preloader.hide(resource);
            preloader.callback();
            CoreUI.table._callEventReload(resource);
        });
    },


    /**
     * Проверка переменной является ли она объектом
     * @param {*} variable
     * @return {boolean}
     * @private
     */
    _isObject: function (variable) {

        return typeof variable === 'object' && variable !== null && ! Array.isArray(variable);
    },


    /**
     * Очистка номера страницы в адресе
     * @param resource
     * @return path
     * @private
     */
    _resetPathPage: function(resource) {

        var path      = 'index.php#' + CoreUI.table.loc[resource];
        var pageParam = '_page_' + resource;

        if (path.indexOf(pageParam) >= 0) {
            var regexp = new RegExp('&' + pageParam + '=\\d+', 'g');
            path = path.replace(regexp, '');

            window.history.pushState({ path: path }, '', path);
        }

        return path;
    }
};


$(document).ready(function(){
    /**
     * Очистка даты в календаре
     */
    $('.table-datepicker-clear, .table-datetimepicker-clear').on('click', function() {
        var container = $(this).parent();
        var $from_input = $('.table-datepicker-from-value, .table-datetimepicker-from-value', container);
        var $to_input   = $('.table-datepicker-to-value, .table-datetimepicker-to-value', container);

        $from_input.val('');
        $to_input.val('');

        CoreUI.table.search.setDate($from_input, $to_input, container);

        $('.datepicker-container, .datetimepicker-container', $(container).parent()).datepicker('refresh');
    });


    /**
     * Сткрытие открытых календарей
     */
    $(document).on('click', function(e) {
        var target = $(e.target);
        if ($(target).parents('.datepicker-container, .datetimepicker-container, .ui-datepicker-group').length) {
            return false;

        } else {
            $('.coreui-table .datepicker-container, .coreui-table .datetimepicker-container').hide('fast');
        }
    });


    /**
     * Создание календарей
     */
    $('.table-datepicker, .table-datetimepicker').each(function() {
        CoreUI.table.search.createCalendar(this);
    });
});