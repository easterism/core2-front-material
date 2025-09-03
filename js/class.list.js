
/**
 * @param res
 * @param preffix
 * @param activeTab
 * @param closeParamName
 */
function customDel(res, preffix, activeTab, closeParamName) {
    if (typeof (activeTab) == 'undefined') {
        activeTab = 1;
    }
    if (typeof (preffix) == 'undefined') {
        preffix = '';
    }
    if (typeof (closeParamName) == 'undefined') {
        closeParamName = 'close';
    }
    var id = 'main_' + res + preffix;
    
    var tabParam = 'tab_' + res;    
    var val = listx.getCheked(id, true);
    
    var res = res.split('_');
    
    if (typeof(res[1]) == 'undefined') {
        var act = new Array('');
    } else {
        var act = res[1].split('xxx');
    }
    
    $('.error')[0].style.display = 'none';
    
    var closeParam = '';
    for (i = 0; i < val.length; i++) {
        closeParam = closeParam + '&' + closeParamName + '[]=' + val[i];  
    }
    
    $.post('index.php',
        'module=' + res[0] + '&action=' + act[0] + closeParam + '&' + tabParam + '=' + activeTab,
        function(data) {
            if (data.error) {
                $('.error').html(data.error);
                $('.error')[0].style.display = 'block';
            } else {
                load('index.php?module=' + res[0] + '&action=' + act[0] + '&' + tabParam + '=' + activeTab);
            }
        },
        "json"
    );
}


/**
 * @param id
 */
function dateBlur(id) {
    if (document.getElementById('date_' + id)) {
        document.getElementById('date_' + id).value = document.getElementById(id + '_year').value + '-' + document.getElementById(id + '_month').value + '-' +document.getElementById(id + '_day').value;
        if (document.getElementById('date_' + id).value == "--") document.getElementById('date_' + id).value = '';
    }
}


/**
 * @param evt
 * @returns {boolean}
 */
function dateInt(evt) {
    var code = evt.charCode;
    if (document.all) {
        code = evt.keyCode;
    }
    var av = [0,48,49,50,51,52,53,54,55,56,57];
    for (var i = 0; i < av.length; i++) {
        if (av[i] == code) return true;
    }
    return false;
}


var listx = {

    gMonths : ["","Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
    loc : {},
    checkAllEvents: [],
    reloadEvents: [],

    /**
     * @param id
     */
    look: function (id) {
        $('#' + id).toggle();
    },


    /**
     * @param id
     * @param obj
     * @returns {boolean}
     */
    dateKeyup: function (id, obj) {
        if (obj.id === id + '_day' && Number(obj.value) > 31) {
            obj.value = '';
            obj.focus();
            return false;
        }
        if (obj.id === id + '_month' && Number(obj.value) > 12) {
            obj.value = '';
            obj.focus();
            return false;
        }
    },


    /**
     * @param cal
     */
    create_date:function (cal) {
        var t = $('#date_' + cal).val().substr(10);
        var opt = {
            firstDay: 1,
            currentText: 'Сегодня',
            dateFormat: 'yy-mm-dd',
            defaultDate: t,
            buttonImage: 'core2/html/' + coreTheme + '/img/calendar.png',
            buttonImageOnly: true,
            showOn: "button",
            onSelect: function (dateText, inst) {
                $('#date_' + cal).val(dateText + t);
                $('#' + cal + '_day').val(dateText.substr(8, 2));
                $('#' + cal + '_month').val(dateText.substr(5, 2));
                $('#' + cal + '_year').val(dateText.substr(0, 4));
                $('#cal' + cal).datepicker('destroy');
            },
            beforeShow: function (event, ui) {
                setTimeout(function () {
                    ui.dpDiv.css({ 'margin-top': '20px', 'margin-left': '-100px'});
                }, 5);
            }
        };
        $('#date_' + cal).datepicker(opt);
    },


    /**
     * @param id
     * @param caption
     */
    modalClose: function(id, caption) {
        parent.xxxx = {id:id, name:caption};
        parent.$.modal.close();
    },


    /**
     * @param obj
     * @param id
     * @param isAjax
     */
    pageSw: function(obj, id, isAjax) {

        var container = '';
        var pageParam = '_page_' + id;
        var page      = obj.getAttribute('title');
        var url       = listx.loc[id];

        url = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
        url = url + "&" + pageParam + '=' + page;


        if (isAjax) {
            container = document.getElementById("list" + id).parentNode;
            if (listx.loc[id].indexOf('&__') < 0) {
                if (container.id) {
                    location.hash = preloader.prepare(location.hash.substr(1) + '&--' + container.id + '=' + preloader.toJson(url));
                }
            } else {
                load(url, '', container, function () {
                    if (listx.reloadEvents.length > 0) {
                        $.each(listx.reloadEvents, function () {
                            if (this.list_id === id) {
                                this.func();
                            }
                        })
                    }
                    preloader.callback();
                });
            }

        } else {
            load(url, '', container, function () {
                if (listx.reloadEvents.length > 0) {
                    $.each(listx.reloadEvents, function () {
                        if (this.list_id === id) {
                            this.func();
                        }
                    })
                }
                preloader.callback();
            })
        };
    },


    /**
     * @param obj
     * @param id
     * @param isAjax
     */
    goToPage: function(obj, id, isAjax) {

        var container = '';
        var pageParam = '_page_' + id;
        var page      = $('#pagin_' + id).find('input').val();
        var url       = listx.loc[id];

        url = url.replace(new RegExp('&' + pageParam + '=\\d*', 'i'), '');
        url = url + "&" + pageParam + '=' + page;

        if (isAjax) {
            container = document.getElementById("list" + id).parentNode;
            if (listx.loc[id].indexOf('&__') < 0) {
                if (container.id) {
                    location.hash = preloader.prepare(location.hash.substr(1) + '&--' + container.id + '=' + preloader.toJson(url));
                }
            } else {
                load(url, '', container, function () {
                    if (listx.reloadEvents.length > 0) {
                        $.each(listx.reloadEvents, function () {
                            if (this.list_id === id) {
                                this.func();
                            }
                        })
                    }
                    preloader.callback();
                });
            }
        }
        else {
            load(url, '', container, function () {
                if (listx.reloadEvents.length > 0) {
                    $.each(listx.reloadEvents, function () {
                        if (this.list_id === id) {
                            this.func();
                        }
                    })
                }
                preloader.callback();
            });
        }
    },


    /**
     * @param obj
     * @param id
     * @param isAjax
     */
    countSw: function(obj, id, isAjax) {

        var container = '';
        if (isAjax) {
            container = document.getElementById("list" + id).parentNode;
        }

        var post = {};
        post['count_' + id] = obj.value;
        load(listx.loc[id], post, container, function () {
            if (listx.reloadEvents.length > 0) {
                $.each(listx.reloadEvents, function () {
                    if (this.list_id === id) {
                        this.func();
                    }
                })
            }
            preloader.callback();
        });
    },


    /**
     * @param $this
     * @param e
     */
    switch_active: function($this, e) {
        e.cancelBubble = true;
        var data = String($($this).data('resource')).split('.');
        const resource = data[0];
        var src = String($($this).attr('src'));
        var alt = $($this).attr('alt');
        var val = $($this).attr('val');
        if (alt == 'on') {
            var is_active = "N";
            var new_src   = src.replace("on.png", "off.png");
            var new_alt   = "off";
            var str       = "Деактивировать запись?";
        } else {
            var is_active = "Y";
            var new_src   = src.replace("off.png", "on.png");
            var new_alt   = "on";
            var str       = "Активировать запись?";
        }

        swal({
            title: str,
            type: is_active == 'Y' ? "info" : "warning",
            showCancelButton: true,
            confirmButtonColor: is_active == 'Y' ? '#5bc0de' : '#f0ad4e',
            confirmButtonText: "Да",
            cancelButtonText: "Нет"
        }).then(
            function(result) {
                $.post('admin/index/switch/' + resource, {
                    data:      data[1] + '.' + data[2],
                    is_active: is_active,
                    value:     val
                }, function(data, textStatus) {
                    if (textStatus == 'success' && data.status == "ok") {
                        $($this).attr('src', new_src);
                        $($this).attr('alt', new_alt);
                    } else {
                        if (data.status) {
                            swal(data.status).catch(swal.noop);
                        }
                    }
                },
                'json');
            }, function(dismiss) {}
        );
    },


    /**
     * @param id
     * @param url
     * @param text
     * @param nocheck
     * @param obj
     * @param callback
     * @returns {boolean}
     */
    buttonAction : function(id, url, text, nocheck, obj, callback) {
        obj.disabled = true;
        obj.className = "buttonDisabled";
        if ( ! url) {
            alert('Временно недоступна.');
            obj.disabled = false;
            obj.className = "button";
            return;
        }
        var val = "";
        if ( ! nocheck) {
            var j = 1;
            for (var i = 0; i < j; i++) {
                if (document.getElementById("check" + id + i)) {
                    if (document.getElementById("check" + id + i).checked) {
                        val += document.getElementById("check" + id + i).value + ",";
                    }
                    j++;
                }
            }
        }
        if ( ! val && ! nocheck) {
            alert("Вы должны выбрать как минимум одну запись.");
            obj.disabled = false;
            obj.className = "button";
            return false;
        } else {
            if (text) {
                if (!confirm(text)) {
                    obj.disabled = false;
                    obj.className = "button";
                    return false;
                }
            }
            if (val && !nocheck) {
                val = val.slice(0, -1);
            }
            if ( ! callback) {
                callback = function(data) {
                    if (data && data.error) {
                        $('.error').html(data.error);
                        $('.error')[0].style.display = 'block';
                    } else {
                        load(url);
                    }
                }
            }
            $.post(url,
                {record_id: val},
                callback,
                "json"
            );
        }
        obj.className = "button";
        obj.disabled = false;

    },


    /**
     * @param id
     * @param returnArray
     * @returns {Array|string}
     */
    getCheked : function (id, returnArray) {
        var j = 1;
        if (returnArray == true) {
            var val = [];
        } else {
            var val = "";
        }

        for(var i = 0; i < j; i++) {
            if (document.getElementById("check" + id + i)) {
                if (document.getElementById("check" + id + i).checked) {
                    if (returnArray == true) {
                        val.push(document.getElementById("check" + id + i).value);
                    } else {
                        val += document.getElementById("check" + id + i).value + ",";
                    }
                }
                j++;
            }
        }
        return val;
    },


    /**
     * @param id
     * @param text
     * @param isAjax
     */
    del: function (res, text, isAjax) {
        res = res.split('.');
        var id = res[0];
        var val = this.getCheked(id, true);
        if (val) {
            if (val.length) {
                swal({
                    title: text,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#f0ad4e',
                    confirmButtonText: "Да",
                    cancelButtonText: "Нет"
                }).then(
                    function(result) {
                        preloader.show();
                        $("#main_" + id + "_error").hide();
                        var container = '';
                        if (isAjax) {
                            container = document.getElementById("list" + id).parentNode;
                        }
                        if (listx.loc[id]) {
                            const searchParams = new URLSearchParams(listx.loc[id]);
                            const module       = searchParams.get("module");
                            let action         = searchParams.get("action");

                            if ( ! action) {
                                action = 'index';
                            }

                            $.ajax({
                                method: "DELETE",
                                dataType: "json",
                                url: module + "/" + action + "/" + id + "?" + res[1] + "." + res[2] + "=" + val

                            }).success(function (data) {
                                if (data && data.error) {
                                    var msg = data.error ? data.error : "Не удалось выполнить удаление";
                                    $("#main_" + id + "_error").html(msg);
                                    $("#main_" + id + "_error").show();
                                } else {
                                    var loc = listx.loc[id];
                                    if (data) {
                                        if (data.notice) {
                                            CoreUI.notice.create(data.notice);
                                        }
                                        if (data.alert) {
                                            alert(data.alert);
                                        }
                                        if (data.loc) loc = data.loc;
                                    }
                                    load(loc, '', container, function () {
                                        if (listx.reloadEvents.length > 0) {
                                            $.each(listx.reloadEvents, function () {
                                                if (this.list_id === id) {
                                                    this.func();
                                                }
                                            })
                                        }
                                        preloader.callback();
                                    });
                                }
                            }).fail(function () {
                                swal("Не удалось выполнить удаление", '', 'error').catch(swal.noop);
                            }).always(function () {
                                preloader.hide();
                            });
                        }
                    }, function(dismiss) {}
                );
            } else {
                swal('Нужно выбрать хотя бы одну запись', '', 'warning').catch(swal.noop);
            }
        }
    },


    /**
     * @param e
     * @param id
     * @returns {boolean}
     */
    cancel : function (e, id) {
        e.cancelBubble = true;
        if (id) listx.checkChecked(id);
        return false;
    },


    /**
     * @param e
     * @param id
     * @returns {boolean}
     */
    cancel2 : function (e, id) {
        e.cancelBubble = true;
        this.look(id);
        return false;
    },


    /**
     * @param id
     */
    checkChecked : function (id) {
        var obj = document.getElementById("edit_" + id);
        if (obj) {
            var j = 1;
            var gotit = 0;
            for (var i = 0; i < j; i++) {
                if (document.getElementById("check" + id + i)) {
                    if (gotit >= 2) break;
                    if (document.getElementById("check" + id + i).checked) {
                        gotit++;
                    }
                    j++;
                }
            }
            if (gotit >= 2) obj.style.display = '';
            else obj.style.display = 'none';
        }

    },


    /**
     * @param obj
     * @param id
     */
    checkAll : function (obj, id) {
        var j = 1;
        var check = false;

        if (obj.checked) {
            check = true;
        }

        for(var i = 0; i < j; i++) {
            if (document.getElementById("check" + id + i)) {
                document.getElementById("check" + id + i).checked = check;
                j++;
            }
        }

        if (listx.checkAllEvents.length > 0) {
            $.each(listx.checkAllEvents, function () {
                if (this.list_id === id) {
                    this.func();
                }
            })
        }
    },


    /**
     * @param list_id
     * @param func
     */
    onCheckAll : function(list_id, func) {
        if (typeof func === 'function') {
            listx.checkAllEvents.push({
                list_id: list_id,
                func: func
            });
        }
    },


    /**
     * @param resource
     */
    toggleAllColumns : function(resource) {

        var filterContainer = $("#filterColumn" + resource + ' .list-filter-container');
        var inputAll        = filterContainer.find('.checkbox-all input');

        if (inputAll.is(":checked")) {
            filterContainer.find('.checkbox input').prop("checked", true);
        } else {
            filterContainer.find('.checkbox input').prop("checked", false);
        }
    },


    /**
     * @param resource
     */
    showFilter : function(resource) {

        var search    = $("#filter" + resource);
        var filters   = $("#filterColumn" + resource);
        var templates = $("#templates-row-" + resource);

        if (filters.is(":visible")) {
            this.toggle(filters);
        }
        if (templates.is(":visible")) {
            this.toggle(templates);
        }

        this.toggle(search);
        search.find("form")[0]
            .elements[0]
            .focus();
    },


    /**
     * @param resource
     */
    showTemplates : function(resource) {

        var search    = $("#filter" + resource);
        var filters   = $("#filterColumn" + resource);
        var templates = $("#templates-row-" + resource);

        if (search.is(":visible")) {
            this.toggle(search);
        }
        if (filters.is(":visible")) {
            this.toggle(filters);
        }

        this.toggle(templates);
    },


    /**
     * @param resource
     */
    columnFilter : function(resource) {

        var search    = $("#filter" + resource);
        var filters   = $("#filterColumn" + resource);
        var templates = $("#templates-row-" + resource);

        if (search.is(":visible")) {
            this.toggle(search);
        }

        if (templates.is(":visible")) {
            this.toggle(templates);
        }

        this.toggle(filters);
    },


    /**
     * @param f
     */
    toggle : function(f) {
        if (f.hasClass('hide')) {
            f.toggle('fast');
            f.removeClass('hide');
        } else {
            f.toggle('fast');
            f.addClass('hide');
        }
    },


    /**
     * @param id
     * @param isAjax
     */
    columnFilterStart : function(id, isAjax) {

        var o         = $('#filterColumn' + id + ' form').find('.list-filter-col :checkbox:checked');
        var l         = o.length;
        var post      = {};
        var t         = [];
        var container = '';

        for (var i = 0; i < l; i++) {
            t.push(o[i].value);
        }

        post['column_' + id] = t;

        if (listx.loc[id]) {
            if (isAjax) {
                container = document.getElementById("list" + id).parentNode;
                load(listx.loc[id] + '&__filter=1', post, container, function () {
                    if (listx.reloadEvents.length > 0) {
                        $.each(listx.reloadEvents, function () {
                            if (this.list_id === id) {
                                this.func();
                            }
                        })
                    }
                    preloader.callback();
                });

            } else {
                load(listx.loc[id], post, container, function () {
                    if (listx.reloadEvents.length > 0) {
                        $.each(listx.reloadEvents, function () {
                            if (this.list_id === id) {
                                this.func();
                            }
                        })
                    }
                    preloader.callback();
                });
            }
        }
    },

    template: {

        /**
         * Создание критерия поиска
         * @param resource
         * @param isAjax
         */
        create: function (resource, isAjax) {

            var post = $("#filter" + resource).find(":input").serializeArray();

            if ($('#filterColumn' + resource)[0]) {
                var columnsCheckboxes = $('#filterColumn' + resource + ' form').find(':checkbox:checked');

                for (var i = 0; i < columnsCheckboxes.length; i++) {
                    post.push({
                        'name' : 'column_' + resource + '[]',
                        'value': columnsCheckboxes[i].value
                    });
                }
            }

            if ( ! post || post.length === 0) {
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

                    post.push({
                        'name' : 'template_create_' + resource,
                        'value': templateTitle,
                    });

                    if (listx.loc[resource]) {
                        if (isAjax) {
                            var container = document.getElementById("list" + resource).parentNode;
                            load(listx.loc[resource] + '&__template_create=1', post, container, function () {
                                preloader.hide();
                            });

                        } else {
                            load(listx.loc[resource] + '&__template_create=1', post, '', function () {
                                preloader.hide();
                            });
                        }
                    } else {
                        swal('Ошибка', 'Обновите страницу и попробуйте снова', 'error').catch(swal.noop);
                        preloader.hide();
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

                    if (listx.loc[resource]) {
                        if (isAjax) {
                            var container = document.getElementById("list" + resource).parentNode;
                            load(listx.loc[resource] + '&__template_remove=1', post, container, function () {
                                preloader.hide();
                            });

                        } else {
                            load(listx.loc[resource] + '&__template_remove=1', post, '', function () {
                                preloader.hide();
                            });
                        }
                    } else {
                        swal('Ошибка', 'Обновите страницу и попробуйте снова', 'error').catch(swal.noop);
                        preloader.hide();
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

            if (listx.loc[resource]) {
                if (isAjax) {
                    var container = document.getElementById("list" + resource).parentNode;
                    load(listx.loc[resource] + '&__template_select=1', post, container, function () {
                        preloader.hide();
                    });

                } else {
                    load(listx.loc[resource] + '&__template_select=1', post, '', function () {
                        preloader.hide();
                    });
                }
            } else {
                swal('Ошибка', 'Обновите страницу и попробуйте снова', 'error').catch(swal.noop);
                preloader.hide();
            }
        }
    },


    /**
     * @param id
     * @param isAjax
     */
    clearFilter: function(id, isAjax) {

        var post      = {};
        var container = '';

        post['clear_form' + id] = 1;

        if (listx.loc[id]) {
            if (isAjax) {
                container = document.getElementById("list" + id).parentNode;
                load(listx.loc[id] + '&__clear=1', post, container, function () {
                    if (listx.reloadEvents.length > 0) {
                        $.each(listx.reloadEvents, function () {
                            if (this.list_id === id) {
                                this.func();
                            }
                        })
                    }
                    preloader.callback();
                });
            } else {
                load(listx.loc[id], post, container, function () {
                    if (listx.reloadEvents.length > 0) {
                        $.each(listx.reloadEvents, function () {
                            if (this.list_id === id) {
                                this.func();
                            }
                        })
                    }
                    preloader.callback();
                });
            }
        }
    },


    /**
     * @param id
     * @param isAjax
     */
    startSearch : function(id, isAjax) {
        var allInputs = $("#filter" + id).find(":input");
        var l = allInputs.length;
        var post = {};
        for (var i = 0; i < l; i++) {
            post[allInputs[i].name] = allInputs[i].value;
        }
        post = allInputs.serializeArray();
        var container = '';

        if (listx.loc[id]) {
            if (isAjax) {
                container = document.getElementById("list" + id).parentNode;
                load(listx.loc[id] + '&__search=1', post, container, function () {
                    if (listx.reloadEvents.length > 0) {
                        $.each(listx.reloadEvents, function () {
                            if (this.list_id === id) {
                                this.func();
                            }
                        })
                    }
                    preloader.callback();
                });
            } else {
                load(listx.loc[id], post, container, function () {
                    if (listx.reloadEvents.length > 0) {
                        $.each(listx.reloadEvents, function () {
                            if (this.list_id === id) {
                                this.func();
                            }
                        })
                    }
                    preloader.callback();
                });
            }
        }
    },


    /**
     * @param id
     * @param data
     * @param isAjax
     */
    doOrder : function(id, data, isAjax) {
        var container = '';
        var post = {};
        post['orderField_main_' + id] = data;
        if (listx.loc[id]) {
            if (isAjax) {
                container = document.getElementById("list" + id).parentNode;
                load(listx.loc[id] + '&__order=1', post, container, function () {
                    if (listx.reloadEvents.length > 0) {
                        $.each(listx.reloadEvents, function () {
                            if (this.list_id === id) {
                                this.func();
                            }
                        })
                    }
                    preloader.callback();
                });
            } else {
                load(listx.loc[id], post, container, function () {
                    if (listx.reloadEvents.length > 0) {
                        $.each(listx.reloadEvents, function () {
                            if (this.list_id === id) {
                                this.func();
                            }
                        })
                    }
                    preloader.callback();
                });
            }
        }
    },


    /**
     * @param id
     * @param tbl
     */
    initSort : function(id, tbl) {
        $("#list" + id + " > table > tbody").sortable({
            opacity: 0.6,
            distance: 5,
            cursor: "move",
            start: function (event, ui) {
                ui.helper.click(function (event) {
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                    return false;
                });
            },
            update : function (event, ui) {

                var src = ui.item[0].parentNode.childNodes;
                var so = [];
                if (src) {
                    for (var k in src) {
                        if (src[k].childNodes && src[k].childNodes.length) {
                            var el = src[k].childNodes[0];
                            if (el && el.nodeName === "TD") {
                                if (typeof el.getAttribute === "function") {
                                    var title = el.getAttribute("title");
                                    if (title) {
                                        so.push(title);
                                    }
                                }
                            }
                        }
                    }
                }
                $.post("index.php?module=admin&action=seq",
                    {data : so, tbl : tbl, id : id},
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
        $("#list" + id + " tbody").disableSelection();
    },


    /**
     * @param list_id
     * @param func
     */
    onReload : function(list_id, func) {
        if (typeof func === 'function') {
            listx.reloadEvents.push({
                list_id: list_id,
                func: func
            });
        }
    },


    /**
     * @param id
     */
    fixHead: function (id) {

        setTimeout(function () {
            var resource = id.match(/^list(.*)$/i)[1];
            $('#' + id + ' table').floatThead({top: 50, zIndex: 1, headerCellSelector: 'tr.headerText>td:visible'});
            $('#' + id + ' .searchContainer form').css('max-height', '400px');
            $('#' + id + ' .searchContainer form').css('overflow', 'auto');

            var body_height = $('body').height();
            var body_width = $('body').width();
            var menu_wrapper_width = $('#menu-wrapper').width();
            var search_height = $('#filter' + resource).height();
            var search_column_height = $('#filterColumn' + resource).height();
            var top = $('#' + id).position();
            var list_top = top ? top.top : 0;
            //Отлавливаем изменение размера браузера, сворачивание/разворачивание меню, открытие/закрытие поиска и делаем 'reflow'
            setInterval(function () {
                var current_body_height = $('body').height();
                var current_body_width = $('body').width();
                var current_menu_wrapper_width = $('#menu-wrapper').width();
                var current_search_height = $('#filter' + resource).height();
                var current_search_column_height = $('#filterColumn' + resource).height();
                var top = $('#' + id).position();
                var current_list_top = top ? top.top : 0;
                $('#' + id + ' table').css('table-layout', 'auto');
                if (current_body_height != body_height
                    || current_body_width != body_width
                    || current_menu_wrapper_width != menu_wrapper_width
                    || current_search_height != search_height
                    || current_search_column_height != search_column_height
                    || current_list_top != list_top
                ){
                    $('#' + id + ' table').floatThead('reflow');
                    body_height = current_body_height;
                    body_width = current_body_width;
                    menu_wrapper_width = current_menu_wrapper_width;
                    search_height = current_search_height;
                    search_column_height = current_search_column_height;
                    list_top = current_list_top;
                }
            }, 500);
        }, 500);

    }
};