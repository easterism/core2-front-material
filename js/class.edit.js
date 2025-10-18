

var edit = {
	ev: {},
	xfiles: {},
	saveSuccessParams: {},
	dateBlur : function(id) {
		var year = document.getElementById(id + '_year').value;
		var month = document.getElementById(id + '_month').value;
		var day = document.getElementById(id + '_day').value;
		document.getElementById('date_' + id).value = year + '-' + month + '-' + day;
		if (document.getElementById(id + '_hour')) {
			var h = document.getElementById(id + '_hour').value;
			var m = document.getElementById(id + '_min').value;
			if (!h) {
				if (m) {
					h = '00';
					document.getElementById(id + '_hour').value = h;
				}
			}
			else if (!m) {
				m = '00';
			}
			if (h && m) {
				document.getElementById('date_' + id).value += ' ' + h + ':' + m;
			}
		}
	},
	radioClick : function(o) {
		o.blur();
		o.focus();
	},
	dateKeyup : function (id, obj) {
		if (obj.id == id + '_day' && Number(obj.value) > 31) {
			obj.value = 31;
			obj.focus();
		}
		if (obj.id == id + '_month' && Number(obj.value) > 12) {
			obj.value = 12;
			obj.focus();
		}
		this.dateBlur(id);
	},
	timeKeyup : function (id, obj) {
		if (obj.id == id + '_hour' && Number(obj.value) > 23) {
			obj.value = 23;
			obj.focus();
		}
		if (obj.id == id + '_min' && Number(obj.value) > 59) {
			obj.value = 59;
			obj.focus();
		}
		this.dateBlur(id);
	},
	onsubmit: function (obj) {
		obj.elements[obj.elements.length - 1].focus();

		if (typeof PrepareSave == 'function') {
			PrepareSave();
		}
	},
	showMark : function(obj) {
		$(obj).find('.helpMark').show();
	},
	hideMark : function(obj) {
		$(obj).find('.helpMark').hide();
	},
	create_date: function (cal) {
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
		if (this.ev[cal]) {
			opt['beforeShowDay'] = function (day) {
				var s = "";
				var t = "";
				var v = day.valueOf();
				if (edit.ev[cal][v]) {
					if (edit.ev[cal][v][0]["title"]) {
						t = edit.ev[cal][v][0]["title"];
					}
					if (edit.ev[cal][v][0]["disabled"]) {
						s = "ui-datepicker-unselectable ui-state-disabled";
					}
					if (edit.ev[cal][v][0]["cssclass"]) {
						s += " " + edit.ev[cal][v][0]["cssclass"];
					}
				}
				return [true, s, t];
			}
		}
		$('#date_' + cal).datepicker(opt);
	},
	create_datetime: function (cal) {

			var h = $('#date_' + cal).val().substr(11, 2);
			if (!h) h = '00';
			var m = $('#date_' + cal).val().substr(14, 2);
			if (!m) m = '00';
            var opt = {
                firstDay: 1,
                currentText: 'Сегодня',
                dateFormat: 'yy-mm-dd',
                timeFormat: 'HH:mm',
                defaultDate: $('#date_' + cal).val().substr(0, 10),
                hour: h,
                minute: m,
                buttonImage: 'core2/html/' + coreTheme + '/img/calendar.png',
                buttonImageOnly: true,
                showOn: "button",
                onSelect: function (dateText, inst) {
                    //$('#date_' + cal).val(dateText);
                    $('#' + cal + '_day').val(dateText.substr(8, 2));
                    $('#' + cal + '_month').val(dateText.substr(5, 2));
                    $('#' + cal + '_year').val(dateText.substr(0, 4));
                    $('#' + cal + '_hour').val(dateText.substr(11, 2));
                    $('#' + cal + '_min').val(dateText.substr(14, 2));

                },
                beforeShow: function (event, ui) {
                    setTimeout(function () {
                        ui.dpDiv.css({ 'margin-top': '20px', 'margin-left': '-180px'});
                    }, 5);
                }
            };
            if (this.ev[cal]) {
                opt['beforeShowDay'] = function (day) {
                    var s = "";
                    var t = "";
                    var v = day.valueOf();
                    if (block.ev[cal][v]) {
                        if (block.ev[cal][v][0]["title"]) {
                            t = block.ev[cal][v][0]["title"];
                        }
                        if (block.ev[cal][v][0]["disabled"]) {
                            s = "ui-datepicker-unselectable ui-state-disabled";
                        }
                        if (block.ev[cal][v][0]["cssclass"]) {
                            s += " " + block.ev[cal][v][0]["cssclass"];
                        }
                    }
                    return [true, s, t];
                }
            }
			//$('#cal' + cal).datetimepicker(opt);
			$('#date_' + cal).datetimepicker(opt);
	},
	docSize : function (){
		return [
		document.body.scrollWidth > document.body.offsetWidth ?
			document.body.scrollWidth : document.body.offsetWidth,
		document.body.scrollHeight > document.body.offsetHeight ?
			document.body.scrollHeight : document.body.offsetHeight
		];
	},
	getClientSize : function (){
		if(document.compatMode=='CSS1Compat')
			return [document.documentElement.clientWidth, document.documentElement.clientHeight];
		else
			return [document.body.clientWidth, document.body.clientHeight];
	},
	getDocumentScroll : function(){
		return [
		self.pageXOffset || (document.documentElement && document.documentElement.scrollLeft)
			|| (document.body && document.body.scrollLeft),
		self.pageYOffset || (document.documentElement && document.documentElement.scrollTop)
			|| (document.body && document.body.scrollTop)
		];
	},
	getCenter : function (){
		var sizes = this.getClientSize();
		var scrl  = this.getDocumentScroll();
		return [parseInt(sizes[0]/2)+scrl[0], parseInt(sizes[1]/2)+scrl[1]];
	},

	changePass : function(id) {
		var obj = document.getElementById(id);
		var obj2 = document.getElementById(id + '2');
		if (obj.disabled) {
			obj.disabled = false;
			obj.value='';
			obj2.disabled=false;
			obj2.value='';
			obj2.nextSibling.value = 'отмена';
		} else {
			obj.disabled = true;
			obj.value='******';
			obj2.disabled = true;
			obj2.value='******';
			obj2.nextSibling.value = 'изменить';
		}
	},

	displayError: function(id, text) {
		var obj = document.getElementById('main_' + id + '_error');
		if (obj) {
			obj.innerHTML = text;
			obj.style.display = 'block';
			//for(var i = 0; i < 2; i++) {
			//	$(obj).fadeTo(100, 0.4).fadeTo(100, 1);
			//}
		}
	},
	changeButtonSwitch: function(obj) {
		var i = $(obj).find('img');
		if (document.getElementById(obj.id + 'hid').value == 'Y') {
			document.getElementById(obj.id + 'hid').value = 'N';
			for (var j = 0; j< i.length; j++) {
				if ($(i[j]).data('switch') == 'on') i[j].className = 'hide';
				else i[j].className = 'block';
			}
		} else {
			document.getElementById(obj.id + 'hid').value = 'Y';
			for (var j = 0; j < i.length; j++) {
				if ($(i[j]).data('switch') == 'on') i[j].className = 'block';
				else i[j].className = 'hide';
			}
		}
	},


	changeForm: {

		_forms: {},


		/**
		 * Показывает есть ли изменения в формах
		 * @return {boolean}
		 */
		issetChanged: function () {

			let issetChanges = false;

			$.each(this._forms, function (formName, form) {
				if (edit.changeForm.isChange(formName)) {
					issetChanges = true;
					return false;
				}
			});

			return issetChanges;
		},


		/**
		 * Проверка изменений в форме
		 * @param {string} formName
		 * @return {boolean}
		 */
		isChange: function (formName) {

			if (this._forms.hasOwnProperty(formName) &&
				! this._forms[formName].saveSuccess &&
				(this._forms[formName].form[0] && document.getElementById(this._forms[formName].form.attr('id')))
			) {
				let formData  = this._forms[formName].data
				let formData2 = xajax.getFormValues(this._forms[formName].form.attr('id'));

				if (JSON.stringify(formData) !== JSON.stringify(formData2)) {
					return true;
				}
			}

			return false;
		},


		/**
		 * Показать сообщение о несохраненных параметрах
		 * @param {Array} loadArgs
		 */
		showConfirm: function (loadArgs) {

			swal({
				title : 'Изменения не сохранены',
				text : 'Вы уверены, что хотите покинуть страницу?',
				type : 'warning',
				showCancelButton  : true,
				confirmButtonColor: '#f0ad4e',
				confirmButtonText : 'Покинуть страницу',
				cancelButtonText  : "Остаться"
			}).then(function () {

				edit.changeForm.removeListen();

				if (loadArgs) {
					load.apply(window, loadArgs);
				}

			}).catch(swal.noop);
		},


		/**
		 * Добавляет проверку на изменение формы перед сменой страницы
		 * @param {string} formName
		 */
		listen: function (formName) {

			let form = $('#main_' + formName + '_mainform');

			if ( ! form[0]) {
				return;
			}

			if ( ! this._forms.hasOwnProperty(formName)) {
				this._forms[formName] = {};
			}

			this._forms[formName] = {
				form: form,
				saveSuccess: false,
				data: xajax.getFormValues(form.attr('id')),
				unload: function(e) {
					if (edit.changeForm.isChange(formName)) {
						return 'Данные не будут сохранены';
					}
					return;
				}
			};


			$(window).bind('beforeunload', this._forms[formName].unload);
		},


		/**
		 * Убирает проверку на изменение формы перед сменой страницы
		 * @param {string|undefined} formName
		 */
		removeListen: function (formName) {

			if (typeof formName === 'string' && formName) {
				if (this._forms.hasOwnProperty(formName)) {
					$(window).unbind('beforeunload', this._forms[formName].unload);
					delete this._forms[formName];
				}

			} else {
				$.each(this._forms, function (formName, form) {
					$(window).unbind('beforeunload', form.unload);
				});

				this._forms = {};
			}
		},
	},

	modalClear: function(id) {
		document.getElementById(id).value = '';
		document.getElementById(id + '_text').value = '';
	},
	maskMe: function(id, options) {
        options = $.extend({
            numeral: true,
            numeralDecimalMark: '.',
            delimiter: ' ',
            numeralDecimalScale: 2
        }, options);

		new Cleave('#' + id, options);

		if (options.numeralDecimalMark === '.') {
			$('#' + id).bind('paste', function (e) {
				if (!e) {
					return;
				}

				let pasteText = String(e.originalEvent.clipboardData.getData('text'));

				if (pasteText) {
					this.value = pasteText.replace(",", '.');
				}
			});
		}
	},
	modal2: {
        key: '',
		options: [],


		/**
		 * Инициализация модала
		 * @param {object} options
		 */
		init: function (options) {

			edit.modal2.options[options.id] = {
				id: options.id,
				title: options.title || '',
				size: options.size || '',
				themeDir: options.themeDir || '',
				url: options.url || '',
				autocompleteUrl: options.autocompleteUrl || '',
				autocompleteMinLength: options.autocompleteMinLength || 2,
				onHidden: options.onHidden || '',
				onClear: options.onClear || '',
				onChoose: options.onChoose || ''
			};

			var modalOptions   = edit.modal2.options[options.id];
			var isAutocomplete = modalOptions.autocompleteUrl && typeof modalOptions.autocompleteUrl === 'string';
			var inputValue     = $('.modal-container-' + modalOptions.id + ' input[type="hidden"]');
			var inputTitle     = $('.modal-container-' + modalOptions.id + ' .modal-control-title');

			$('.modal-container-' + modalOptions.id + ' .modal-control-clear').click(function() {
				edit.modal2.clear(modalOptions.id);

				if (isAutocomplete) {
					inputTitle.removeAttr('disabled');
				}
			});

			$('.modal-container-' + modalOptions.id + ' .modal-control-button').click(function() {
				edit.modal2.load(modalOptions.themeDir, modalOptions.id, modalOptions.url);
			});

			if (isAutocomplete) {
				if ( ! inputValue.val()) {
					inputTitle.removeAttr('disabled');
				}

				let lastRequest = null;
				inputTitle.autocomplete({
					source: function (request, response) {
						// Прерываем предыдущий запрос
						if (lastRequest && lastRequest.readyState !== 4) {
							lastRequest.abort();
						}
						lastRequest = $.ajax({
							method: 'GET',
							url: modalOptions.autocompleteUrl,
							dataType: 'json',
							data: {
								term: $.trim(request.term)
							},
							success: function(data) {
								response(data.items || []);
							},
							error: function(xhr) {
								response([]);
								if (xhr.statusText === 'abort') return; // Игнорируем отменённые
							}
						});
					},
					minLength: modalOptions.autocompleteMinLength,
					focus: function( event, ui ) {
						event.preventDefault();
						inputTitle.val(ui.item.label);
					},
					select: function( event, ui ) {
						event.preventDefault();
						edit.modal2.key = options.id;
						edit.modal2.choose(ui.item.value, ui.item.label);
					},
					close: function( event, ui ) {
						event.preventDefault();

						if ( ! inputValue.val()) {
							inputTitle.val('');
						}
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

							ul.css('min-width', inputTitle.width());
							ul.css('max-width', 450);

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
			}
		},


		/**
		 * Загрузка содержимого модала
		 * @param theme_src
		 * @param key
		 * @param url
		 * @return {boolean}
		 */
        load: function(theme_src, key, url) {

			if (typeof url === 'function') {
				url = url();
			}

        	if ( ! url || ! edit.modal2.options.hasOwnProperty(key)) {
        		return false;
			}

			edit.modal2.key = key;

			var title = edit.modal2.options[key].title || '';
			var size  = edit.modal2.options[key].size || '' ;

			$('#main_body').append(
				'<div class="modal fade"  id="' + key + '-modal">' +
					'<div class="modal-dialog ' + size + '">' +
						'<div class="modal-content">' +
							'<div class="modal-header">' +
								'<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>' +
								'<h4 class="modal-title">' + title + '</h4>' +
							'</div>' +
							'<div class="modal-body">' +
								'<div class="text-center">' +
									'<i class="fa fa-fw fa-spin fa-spinner"></i> Загрузка' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>'
			);


			var modal = $('#' + key + '-modal');

			$('.modal-dialog > .modal-content > .modal-body', modal)
				.load(url, function( response, status, xhr ) {
					if ( status == "error" ) {
						$(".modal-dialog > .modal-content > .modal-body").html(xhr.status + " " + xhr.statusText );
					}
				});

			modal.modal('show');
			modal.on('hidden.bs.modal', function (e) {

				if (typeof edit.modal2.options[key].onHidden === 'function') {
					edit.modal2.options[key].onHidden();
				}

				modal.remove();
			});
        },


		/**
		 * Перезагрузка содержимого текущего модального окна которое будет получено с базового адреса
		 */
		reload: function () {

			var options = this.getOptions(this.key);

			if ( ! options.url) {
				return;
			}

			this.loadContent(this.key, options.url);
		},


		/**
		 * Загрузка содержимого модального окна которое будет получено с указанного адреса
		 */
		loadContent: function (key, url) {

			var modalBody = $('#' + key + '-modal .modal-dialog > .modal-content > .modal-body');

			if ( ! modalBody[0]) {
				return;
			}

			modalBody.html('<div class="text-center"><i class="fa fa-fw fa-spin fa-spinner"></i> Загрузка</div>')
				.load(url);
		},


		/**
		 * Очистка поля
		 * @param key
		 */
        clear: function(key) {

            $('#' + key).val('');
            $('#' + key + '-title').val('');


			if (this.options[key] && typeof this.options[key].onClear === 'function') {
				this.options[key].onClear();
			}
        },


		/**
		 * Скрытие модала
		 */
        hide: function() {
            $('#' + this.key + '-modal').modal('hide');
        },


		/**
		 * Выбор
		 * @param value
		 * @param title
		 */
        choose: function(value, title) {

			var inputTitle = $('.modal-container-' + this.key + ' .modal-control-title');
			var inputValue = $('.modal-container-' + this.key + ' input[type="hidden"]');

			inputValue.val(value);
			inputTitle.val(title);
			inputTitle.attr('disabled', 'disabled');

            this.hide();

			if (this.options[this.key] && typeof this.options[this.key].onChoose === 'function') {
				this.options[this.key].onChoose(value, title);
			}
		},


		/**
		 * Получение параметров указанного модального поля
		 * @param key
		 */
		getOptions: function (key) {
			if (edit.modal2.options.hasOwnProperty(key)) {
				return edit.modal2.options[key];
			} else {
				return [];
			}
		},


		/**
		 * Получение параметров указанного модального поля
		 * @param key
		 * @deprecated
		 */
		getOption: function (key) {
			return this.getOptions(key);
		},


		/**
		 * Установка параметра указанного модального поля
		 * @param key
		 * @param option_name
		 * @param val
		 */
		setOption: function (key, option_name, val){
			if (edit.modal2.options.hasOwnProperty(key)) {
				edit.modal2.options[key][option_name] = val;
			}
		}
    },


    modalList: {

		themeSrc: '',
		control: '',
		selectRows: {},
		options: [],


		/**
		 * @param control
		 * @param url
		 * @return {boolean}
		 */
		showModal: function(control, url) {

			if (typeof url === 'function') {
				url = url();
			}

			edit.modalList.control = control;

			if ( ! url || ! edit.modalList.options.hasOwnProperty(control)) {
				return false;
			}

			var title = edit.modalList.options[control].title || '';
			var size  = edit.modalList.options[control].size || 'modal-lg' ;

			$('#main_body').append(
				'<div class="modal fade" tabindex="-1" id="modal-list__' + control + '-modal">' +
					'<div class="modal-dialog ' + size + '">' +
						'<div class="modal-content">' +
							'<div class="modal-header">' +
								'<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>' +
								'<h4 class="modal-title">' + title + '</h4>' +
							'</div>' +
							'<div class="modal-body">' +
								'<div style="text-align:center">' +
									'<img src="' + edit.modalList.themeSrc + '/img/load.gif" alt="loading"> Загрузка' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>'
			);


			var modal = $('#modal-list__' + control + '-modal');

			$('.modal-dialog > .modal-content > .modal-body', modal)
				.load(url);

			modal.modal('show');
			modal.on('hidden.bs.modal', function (e) {

				if (typeof edit.modalList.options[control].onHidden === 'function') {
					edit.modalList.options[control].onHidden();
				}

				modal.remove();
			});
        },


		/**
		 *
		 */
		hideModal: function() {
			$('.modal.in').modal('hide');
		},


		/**
		 * @param items
		 */
		choose: function(items) {

			if (typeof items !== 'object') {
				return false;
			}

			$.each(items, function (key, item) {
				var id     = item.hasOwnProperty('id') && ['string', 'number'].indexOf(typeof item.id) >= 0 ? item.id : null;
				var text   = item.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof item.text) >= 0 ? item.text : null;
				var fields = item.hasOwnProperty('fields') && typeof item.fields === 'object' ? item.fields : null;

				edit.modalList.addItem(edit.modalList.control, id, text, fields);
			});

			this.hideModal();
		},


		/**
		 *
		 * @param control
		 * @param key
		 */
        deleteItem: function(control, key) {

			var item   = $('.modal-list__item-' + control + '-' + key);
			var itemId = $('.modal-list__item-id', item).val();

			item.fadeOut('fast', function () {
				$(this).remove();
			});

			if (this.options[control] && typeof this.options[control].onDelete === 'function') {
				this.options[control].onDelete(key, itemId);
			}
        },


		/**
		 *
		 * @param control
		 */
        deleteAll: function(control) {

			$('.modal-list__item-' + control + ' .modal-list__item').each(function (item) {
				var key = item.data('key');

				edit.modalList.deleteItem(control, key)
			});
        },


		/**
		 * Добавление строки
		 * @param control
		 * @param id
		 * @param text
		 * @param fields
		 * @returns {boolean}
		 */
		addItem: function (control, id, text, fields) {

			// Уже есть запись с таким ID
			var issetId = false;
			$('.modal-list__control-' + control + ' .modal-list__item-id').each(function (key, input) {
				if ($(input).val() === id.toString()) {
					issetId = true;
					return false;
				}
			});

			if (issetId) {
				return false;
			}

			var key          = edit.modalList.keygen();
			var renderFields = [];

			$.each(this.options[control].fields, function (index, field) {
				var type       = field.hasOwnProperty('type') && typeof field.type === 'string' ? field.type : 'text';
				var name       = field.hasOwnProperty('name') && typeof field.name === 'string' ? field.name : '';
				var title      = field.hasOwnProperty('title') && typeof field.title === 'string' ? field.title : '';
				var attributes = field.hasOwnProperty('attributes') && typeof field.attributes === 'string' ? field.attributes : '';

				var value = typeof fields === 'object' &&
							fields !== null &&
							fields.hasOwnProperty(name) &&
							['string', 'number'].indexOf(typeof fields[name]) >= 0
					? fields[name]
					: '';

				renderFields.push('<input type="' + type + '" class="form-control input-sm modal-list__item-field" ' +
										 'name="control[' + control + '][' + key + '][' + name + ']" value="' + value + '" ' +
										 'placeholder="' + title + '" ' + attributes + '>');
			});

			$('.modal-list__control-' + control)
				.append(
					$('<li class="modal-list__item modal-list__item-' + control + '-' + key + '" data-key="' + key + '" style="display: none">' +
						'<span class="modal-list__item-text">' + text + '</span>' +
						renderFields.join('') +
						'<div>' +
							'<input type="hidden" class="modal-list__item-id" name="control[' + control + '][' + key + '][id]" value="' + id + '">' +
							'<img src="' + edit.modalList.themeSrc + '/img/delete.png" ' +
								 'class="modal-list__item-delete" onclick="edit.modalList.deleteItem(\'' + control + '\', \'' + key + '\')"/>' +
						'</div>' +
					'</li>')
				);

			$('.modal-list__item-' + control + '-' + key).fadeIn('fast');


			if (this.options[control] && typeof this.options[this.control].onAdd === 'function') {
				this.options[control].onAdd(key, id, text, fields);
			}
		},


		/**
		 * @param tableName
		 * @param row
		 */
		rowToggle: function (tableName, row) {

			var checkbox = $('.checked-row input[type="checkbox"]', row);

			if (checkbox[0]) {
				checkbox.prop('checked', ! checkbox.prop('checked'));

				CoreUI.table.checkRow(checkbox, tableName);
			}
		},


		/**
		 * @param tableName
		 * @param btnAdd
		 * @param btnClear
		 */
		addItemsTable: function (tableName, btnAdd, btnClear) {

			var selectRows = edit.modalList.selectRows[tableName] || [];
			var buttonText = $(btnAdd).text();

			/**
			 * Обновление выбранных строк
			 */
			function updateChecked(rowsId, state) {

				// Добавление новых записей
				if (state) {
					$.each(rowsId, function (key, rowIdNew) {
						var issetKey = false;

						$.each(selectRows, function (key, row) {
							if (row.id === rowIdNew) {
								issetKey = true;
								return false;
							}
						});

						if ( ! issetKey) {
							var row    = $('#table-' + tableName + ' td.checked-row input[value="' + rowIdNew + '"]').parent().parent();
							var fields = {};

							$.each($(row).data(), function (dataName, dataValue) {
								if (dataName.indexOf('field') === 0 && dataName.length > 5) {
									let fieldName = dataName.substring(5).toLowerCase();
									fields[fieldName] = dataValue;
								}
							})

							selectRows.push({
								id : rowIdNew,
								text : row[0] ? row.data('text') : '-',
								fields : fields
							})
						}
					});

				// Удаление записей
				} else {
					var selectRowsNew = [];

					$.each(selectRows, function (key, row) {
						var issetKey = false;

						$.each(rowsId, function (key2, rowId) {
							if (row.id === rowId) {
								issetKey = true;
								return false;
							}
						});

						if ( ! issetKey) {
							selectRowsNew.push(row);
						}
					});

					selectRows = selectRowsNew;
				}


				edit.modalList.selectRows[tableName] = selectRows;

				refreshStateBtn();
			}


			/**
			 * Обновление состояния услуг в списке (чекбоксы и кнопка)
			 */
			function refreshState() {

				$('#table-' + tableName + ' > tbody tr').each(function (key, tr) {
					var isChecked = false;
					var rowId     = $('.checked-row input[type="checkbox"]', tr).val();

					$.each(selectRows, function (key, row) {
						if (row.id === rowId) {
							isChecked = true;
							return false;
						}
					});

					if (isChecked) {
						$('.checked-row input[type="checkbox"]', tr).prop('checked', 'checked');
					} else {
						$('.checked-row input[type="checkbox"]', tr).prop('checked', false);
					}
				});

				refreshStateBtn();
			}


			/**
			 *
			 */
			function clearSelected() {

				edit.modalList.selectRows[tableName] = [];
				selectRows                           = [];
				$('#table-' + tableName + ' > tbody tr .checked-row input[type="checkbox"]').prop('checked', false);
				refreshStateBtn();
			}


			/**
			 *
			 */
			function refreshStateBtn() {

				if ($(btnAdd).prop("tagName") === 'INPUT') {
					$(btnAdd).val(buttonText + ' ' + selectRows.length);
				} else {
					$(btnAdd).text(buttonText + ' ' + selectRows.length);
				}
			}


			$(btnAdd).click(function () {
				if (selectRows.length <= 0) {
					swal('Выберите хотя бы одну запись', '', 'warning').catch(swal.noop);
					return false;
				}

				$.each(selectRows, function (key, row) {
					edit.modalList.addItem(edit.modalList.control, row.id, row.text, row.fields);
				});

				clearSelected();
				edit.modalList.hideModal();
			});

			if (btnClear) {
				$(btnClear).click(clearSelected);
			}

			refreshState();

			CoreUI.table.onChecked(tableName, updateChecked);
			CoreUI.table.onReload(tableName, refreshState);
		},


		/**
		 * Генератор случайного ключа
		 * @param extInt
		 * @returns {*}
		 */
		keygen : function(extInt) {
			var d = new Date();
			var v1 = d.getTime();
			var v2 = d.getMilliseconds();
			var v3 = Math.floor((Math.random() * 1000) + 1);
			var v4 = extInt ? extInt : 0;

			return 'A' + v1 + v2 + v3 + v4;
		}
    },


    /**
     * @param toggleObject
     */
    toggleGroup: function(toggleObject) {
        $(toggleObject).parent().next().slideToggle('fast');
    },


	/**
	 *
	 */
	multilist2: {

		data: {},

		/**
		 * @param itemContainer
		 */
		deleteItem: function (itemContainer) {
			$(itemContainer).hide('fast', function () {
				$(this).remove();
			});
		},


		/**
		 * @param fieldId
		 * @param field
		 * @param attributes
		 * @param themePath
		 */
		addItem: function (fieldId, field, attributes, themePath) {

			var tpl =
				'<div class="multilist2-item" id="multilist2-item-[ID]" style="display: none">' +
				    '<select id="[ID]" name="control[[FIELD]][]" [ATTRIBUTES]>[OPTIONS]</select> ' +
				    '<img src="[THEME_PATH]/img/delete.png" alt="X" class="multilist2-delete"' +
				         'onclick="edit.multilist2.deleteItem($(\'#multilist2-item-[ID]\'))">' +
				'</div>';

			var options = [];

			if (typeof edit.multilist2.data[fieldId] !== "undefined") {
				$.each(edit.multilist2.data[fieldId], function (id, title) {
					if (typeof title === 'object') {
						options.push('<optgroup label="' + id + '">');

						$.each(title, function (grp_id, grp_title) {
							options.push('<option value="' + grp_id + '">' + grp_title + '</option>');
						});

						options.push('</optgroup>');

					} else {
						options.push('<option value="' + id + '">' + title + '</option>');
					}
				});
			}


			attributes = attributes.replace(/\!\:\:/g, '"');
			attributes = attributes.replace(/\!\:/g, "'");

			var id = this.keygen();

			tpl = tpl.replace(/\[ID\]/g, 		 id);
			tpl = tpl.replace(/\[FIELD\]/g,      field);
			tpl = tpl.replace(/\[ATTRIBUTES\]/g, attributes);
			tpl = tpl.replace(/\[OPTIONS\]/g,    options.join(''));
			tpl = tpl.replace(/\[THEME_PATH\]/g, themePath);

			$('#multilist2-' + fieldId + ' .multilist2-items').append(tpl);

			$('#multilist2-item-' + id + ' select').select2({
				language: 'ru',
				theme: 'bootstrap',
			});

			$('#multilist2-item-' + id).show('fast');
		},


		/**
		 * Генератор случайного ключа
		 * @param extInt
		 * @returns {*}
		 */
		keygen : function(extInt) {
			var d = new Date();
			var v1 = d.getTime();
			var v2 = d.getMilliseconds();
			var v3 = Math.floor((Math.random() * 1000) + 1);
			var v4 = extInt ? extInt : 0;

			return 'A' + v1 + v2 + v3 + v4;
		}
	},


	/**
	 *
	 */
	multilist3: {

		data : {},
		themePath : {},

		tpl :
			'<div class="multilist3-item multilist3-item-[KEY]" style="display: none">'+
				'<select name="control[[FIELD]][]" [ATTRIBUTES]' +
						'onchange="edit.multilist3.recalculateItems(\'[FIELD_ID]\');">[OPTIONS]</select> ' +
				'<span class="fa fa-bars multilist3-sort"></span> '+
				'<img src="[THEME_PATH]/img/delete.png" alt="X" title="Удалить" class="multilist3-delete"'+
					 'onclick="edit.multilist3.deleteItem(\'[FIELD_ID]\', \'[KEY]\')">'+
			'</div>',


		/**
		 * @param fieldId
		 * @param itemId
		 */
		deleteItem: function(fieldId, itemId) {
			$('#multilist3-' + fieldId + ' .multilist3-item-' + itemId).fadeOut('fast', function() {
				$(this).remove();
				edit.multilist3.recalculateItems(fieldId);
			});
		},


		/**
		 * @param fieldId
		 * @param fieldName
		 * @param attribs
		 * @returns {boolean}
		 */
		addItem: function(fieldId, fieldName, attribs) {

			var key         = this.keygen();
			var tpl         = this.tpl;
			var optionsData = '';
			var selectData  = edit.multilist3.getSelectedData(fieldId);
			var data        = this.data[fieldId];

			if (selectData.length >= Object.keys(data).length) {
				return false;
			}


			if (Object.keys(data).length) {
				// let groupPrev = '';

				$.each(data, function(key, item) {
					// item.group_name = item.group_name === null ? 'Без группы' : item.group_name;
					//
					// if (key === 0 || groupPrev !== item.group_name) {
					// 	optionsData += '<optgroup label="' + item.group_name + '">';
					// }



					optionsData += '<option value="' + key + '"';
					if ($.inArray(key, selectData) !== -1) {
						optionsData += ' disabled="disabled"';
					}
					optionsData += '>' + item + '</option>';


					// groupPrev     = item.group_name;
					// let groupNext = data[key + 1] !== undefined
					// 	? (data[key + 1].group_name !== null ? data[key + 1].group_name : 'Без группы')
					// 	: '';
					//
					// if (groupNext !== item.group_name || data[key + 1] === undefined) {
					// 	optionsData += '</optgroup>';
					// }
				});
			}

			attribs = attribs.replace(/!::/g, '"').replace(/!:/g, "'");

			tpl = tpl.replace(/\[KEY\]/g,        key);
			tpl = tpl.replace(/\[FIELD\]/g,      fieldName);
			tpl = tpl.replace(/\[FIELD_ID\]/g,   fieldId);
			tpl = tpl.replace(/\[ATTRIBUTES\]/g, attribs);
			tpl = tpl.replace(/\[THEME_PATH\]/g, edit.multilist3.themePath);
			tpl = tpl.replace(/\[OPTIONS\]/g,    optionsData);

			$('#multilist3-' + fieldId + ' .multilist3-items').append(tpl);
			$('#multilist3-' + fieldId + ' .multilist3-item-' + key).fadeIn('fast');

			edit.multilist3.recalculateItems(fieldId);
		},


		/**
		 * @param fieldId
		 * @returns {[]}
		 */
		getSelectedData: function(fieldId) {

			var selectData  = [];

			$('#multilist3-' + fieldId + ' select').each(function(key, select) {
				selectData.push($(select).val());
			});

			return selectData;
		},


		/**
		 * @param fieldId
		 */
		recalculateItems: function(fieldId) {

			var selectData = edit.multilist3.getSelectedData(fieldId);

			$('#multilist3-' + fieldId + ' select').each(function(key, select) {
				$('option', select).each(function(okey, option) {
					if ($(select).val() !== $(option).attr('value') &&
						$.inArray($(option).attr('value'), selectData) !== -1
					) {
						$(option).attr('disabled', 'disabled');
					} else {
						$(option).removeAttr('disabled');
					}
				});
			});
		},


		/**
		 * Генератор случайного ключа
		 * @param ext_int
		 * @returns {*}
		 */
		keygen : function(ext_int) {
			var d = new Date();
			var v1 = d.getTime();
			var v2 = d.getMilliseconds();
			var v3 = Math.floor((Math.random() * 1000) + 1);
			var v4 = ext_int ? ext_int : 0;

			return 'A' + v1 + v2 + v3 + v4;
		}
	},


	/**
	 *
	 */
	fieldDataset: {

		data: {},

		/**
		 * @param itemContainer
		 */
		deleteItem: function (itemContainer) {
			$(itemContainer).hide('fast', function () {
				$(this).remove();
			});
		},


		/**
		 * @param fieldId
		 * @param fieldName
		 * @param themePath
		 */
		addItem: function (fieldId, fieldName, themePath) {

			var tpl =
				'<tr class="field-dataset-item" id="field-dataset-item-[ID]" style="display: none">' +
				'[FIELDS] ' +
				'<td><img src="[THEME_PATH]/img/delete.png" alt="X" class="field-dataset-delete"' +
						 'onclick="edit.fieldDataset.deleteItem($(\'#field-dataset-item-[ID]\'))"></td>' +
				'</tr>';

			var tplFieldText =
				'<td>' +
				    '<input type="text" class="form-control input-sm" name="control[[FIELD]][[NUM]][[CODE]]" value="[VALUE]" [ATTRIBUTES]>' +
			    '</td>';

			var tplFieldTextReadonly = '<td><div [ATTRIBUTES]>[VALUE]</div></td>';

			var tplFieldTextarea =
				'<td>' +
				    '<textarea class="form-control input-sm" name="control[[FIELD]][[NUM]][[CODE]]" value="[VALUE]" [ATTRIBUTES]></textarea>' +
			    '</td>';

			var tplFieldDate =
				'<td>' +
				    '<input type="date" class="form-control input-sm" name="control[[FIELD]][[NUM]][[CODE]]" value="[VALUE]" [ATTRIBUTES]>' +
			    '</td>';

			var tplFieldDatetime =
				'<td>' +
				    '<input type="datetime-local" class="form-control input-sm" name="control[[FIELD]][[NUM]][[CODE]]" value="[VALUE]" [ATTRIBUTES]>' +
			    '</td>';

			var tplFieldNumber =
				'<td>' +
				    '<input type="number" class="form-control input-sm" name="control[[FIELD]][[NUM]][[CODE]]" value="[VALUE]" [ATTRIBUTES]>' +
			    '</td>';

			var tplFieldHidden =
				'<input type="hidden" name="control[[FIELD]][[NUM]][[CODE]]" value="[VALUE]">';

			var tplFieldSwitch =
				'<td>' +
					'<div class="core-switch color-primary" onclick="edit.switchToggle(this)" [ATTRIBUTES]>' +
						'<input type="radio" class="core-switch-active" ' +
							'name="control[[FIELD]][[NUM]][[CODE]]" value="Y" [CHECKED_Y]>' +
						'<input type="radio" class="core-switch-inactive" ' +
							'name="control[[FIELD]][[NUM]][[CODE]]" value="N" [CHECKED_N]>' +
						'<span class="core-slider"></span>' +
					'</div>' +
				'</td>';

			var tplFieldSelect =
				'<td>' +
					'<select class="form-control input-sm" name="control[[FIELD]][[NUM]][[CODE]]" [ATTRIBUTES]>[OPTIONS]</select>' +
			    '</td>';

			var tplFieldSelect2 =
				'<td>' +
				'<select id = "select2_[NUM]" class="form-control input-sm" name="control[[FIELD]][[NUM]][[CODE]]" [ATTRIBUTES]>[OPTIONS]</select>' +
				'</td>';

			var fields = [];
			var key    = this.keygen();

			if (typeof edit.fieldDataset.data[fieldId] !== "undefined") {
				$.each(edit.fieldDataset.data[fieldId], function (id, field) {
					var tplFieldCustom = tplFieldText;

					switch (field['type'] || 'text') {
						case 'text_readonly': tplFieldCustom = tplFieldTextReadonly; break;
						case 'date':          tplFieldCustom = tplFieldDate; break;
						case 'datetime':      tplFieldCustom = tplFieldDatetime; break;
						case 'number':        tplFieldCustom = tplFieldNumber; break;
						case 'hidden':        tplFieldCustom = tplFieldHidden; break;
						case 'textarea':      tplFieldCustom = tplFieldTextarea; break;
						case 'select':
							var selectOptions = '';

							$.each(field['options'], function (key, option) {
								var selected = '';

								if (field['default_value']) {
									selected = field['default_value'] === option.val ? 'selected' : '';
								} else {
									selected = option.val === '' ? 'selected' : ''
								}

								selectOptions += "<option value=\"" + option.val + "\" " + selected + ">" + option.title + "</option>";
							});

							tplFieldCustom = tplFieldSelect;
							tplFieldCustom = tplFieldCustom.replace(/\[OPTIONS\]/g, selectOptions);
							break;

						case 'select2':
							var selectOptions2 = '';
							$.each(field['options'], function (key, option) {
								var selected = '';

								if (field['default_value']) {
									selected = field['default_value'] === option.val ? 'selected' : '';
								} else {
									selected = option.val === '' ? 'selected' : ''
								}

								selectOptions2 += "<option value=\"" + option.val + "\" " + selected + ">" + option.title + "</option>";
							});

							tplFieldCustom = tplFieldSelect2;
							tplFieldCustom = tplFieldCustom.replace(/\[OPTIONS\]/g, selectOptions2);

							setTimeout(function () {
								$('#select2_' + key ).select2({
									language: 'ru',
									theme: 'bootstrap',
								});
							}, 10);

							break;

						case 'switch':
							tplFieldCustom = tplFieldSwitch;
							tplFieldCustom = tplFieldCustom.replace(/\[CHECKED_Y\]/g, field['default_value'] === "Y" ? 'checked="checked"' : '');
							tplFieldCustom = tplFieldCustom.replace(/\[CHECKED_N\]/g, field['default_value'] === "N" ? 'checked="checked"' : '');
							break;
					}

					if (field['code']) {
						tplFieldCustom = tplFieldCustom.replace(/\[FIELD\]/g,      fieldName);
						tplFieldCustom = tplFieldCustom.replace(/\[NUM\]/g,        key);
						tplFieldCustom = tplFieldCustom.replace(/\[CODE\]/g,       field['code']);
						tplFieldCustom = tplFieldCustom.replace(/\[VALUE\]/g,      field['default_value'] || '');
						tplFieldCustom = tplFieldCustom.replace(/\[ATTRIBUTES\]/g, field['attributes'] || '');

						fields.push(tplFieldCustom);
					}
				});
			}


			var id = fieldId + '-' + key;

			tpl = tpl.replace(/\[ID\]/g, 		 id);
			tpl = tpl.replace(/\[FIELDS\]/g,     fields.join(''));
			tpl = tpl.replace(/\[THEME_PATH\]/g, themePath);

			$('#field-dataset-' + fieldId + ' .field-dataset-items').append(tpl);
			$('#field-dataset-item-' + id).show('fast');
		},


		/**
		 * Генератор случайного ключа
		 * @param extInt
		 * @returns {*}
		 */
		keygen : function(extInt) {
			var d = new Date();
			var v1 = d.getTime();
			var v2 = d.getMilliseconds();
			var v3 = Math.floor((Math.random() * 1000) + 1);
			var v4 = extInt ? extInt : 0;

			return 'A' + v1 + v2 + v3 + v4;
		}
	},


	fieldImport: {


		/**
		 * Инициализация визуального редактора для импорта
		 * @param {string} field
		 * @param {Array}  options
		 */
		init: function (field, options) {

			let container = $('.field-import-' + field);

			$('thead select', container).change(function (event) {
				let selectChanged = this;

				$('thead select', container).each(function (i, select) {
					if (selectChanged !== select &&
						$(selectChanged).val() === $(select).val()
					) {
						$(select).val('');
					}
				});

				fillInputImport();
			});


			let rowSelect = ! options.rowSelect || options.rowSelect === 'start'
				? 'start'
				: (options.rowSelect === 'checked' ? 'checked' : 'start');

			if (rowSelect === 'start') {
				$('.row-number input', container).change(function () {
					let numberChanged = this;

					$('.row-number input', container).each(function (i, input) {
						if (numberChanged !== input && $(input).prop('checked')) {
							$(input).prop('checked', false);
						}
					});

					fillInputImport();
				});

			} else if (rowSelect === 'checked') {
				$('.checked-all', container).change(function () {
					let isChecked = $(this).prop('checked')
					$('.row-number input', container).prop('checked', isChecked);

					fillInputImport();
				});

				$('.row-number input', container).click(function (event) {

					if (event.shiftKey) {
						let currentRow   = Number(this.value);
						let isChecked    = $(this).prop('checked');
						let firstRow     = null;
						let lastRow      = null;

						$('.row-number input:checked', container).each(function (i, input) {
							if (firstRow === null) {
								firstRow = Number($(input).val());
							}
							lastRow = Number($(input).val());
						});


						if (firstRow !== null && firstRow < currentRow) {
							$('.row-number input', container).each(function (i, input) {
								if (firstRow <= Number(input.value) && Number(input.value) <= currentRow) {
									$(input).prop('checked', isChecked);
								}
							});

						} else if (lastRow !== null && Number(currentRow) < lastRow) {

							$('.row-number input', container).each(function (i, input) {
								if (currentRow <= Number(input.value) && Number(input.value) <= lastRow) {
									$(input).prop('checked', isChecked);
								}
							});
						}
					}

					fillInputImport();
				});
			}


			/**
			 * Заполнение поля для импорта
			 */
			function fillInputImport() {

				let importData = {};

				if (rowSelect === 'start') {
					importData.first_row = $(".row-number input:checked", container).val();

				} else if (rowSelect === 'checked') {
					importData.rows = $(".row-number input:checked", container).map(function() {
						return this.value;
					}).get();
				}

				importData.fields = {};

				$("thead select", container).each(function (i, select) {
					let fieldName   = $(select).val();
					let fieldNumber = $(select).data('field-number');

					if (fieldName) {
						importData['fields'][fieldName] = fieldNumber;
					}
				});

				$(".input-import", container).val(JSON.stringify(importData));
			}
		}
	},


	/**
	 * @param container
	 */
	switchToggle: function (container) {

		var isActiveControl = $(container).find(':checked').hasClass('core-switch-active');

		if (isActiveControl) {
			$(container).find('.core-switch-active').prop('checked', false);
			$(container).find('.core-switch-inactive').prop('checked', true);

		} else {
			$(container).find('.core-switch-active').prop('checked', true);
			$(container).find('.core-switch-inactive').prop('checked', false);
		}
	},



	/**
	 * Инициализация редактора
	 * @param id
	 * @param opt
	 */
	mceSetup: function (id, opt) {

		var options = {
			selector : '#' + id,
			language : 'ru',
			theme : 'modern',
			skin : 'light',
			forced_root_block : false,
			force_br_newlines : true,
			force_p_newlines : false,
			verify_html : true,
			convert_urls : false,
			relative_urls : false,
			plugins: [
				"advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
				"searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
				"save table contextmenu directionality emoticons template paste textcolor"
			],
			toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons",
			theme_advanced_resizing : true
		};
		for (k in opt) {
			options[k] = opt[k];
		}
		tinymce.init(options);
	},


	coordinates: {

		/**
		 * Создание экземпляра карты
		 * @param {Object} options
		 */
		create: function (options) {

			if (typeof options.mapContainer != 'object') {
				console.warn("При инициализации карты не указан или некорректно указан параметр mapContainer");
				return;
			}

			if (typeof options.inputCoordinates != 'object') {
				console.warn("При инициализации карты не указан или некорректно указан параметр inputCoordinates");
				return;
			}

			if (typeof options.apikey != 'string') {
				console.warn("При инициализации карты не указан или некорректно указан APIKEY Яндекс карт");
				return;
			}

			let promise  = this.loadYMap(options.apikey);
			let instance = $.extend(true, {}, this.instance);

			promise.then(function () {
				instance.init({
					mapContainer: options.mapContainer,
					inputCoordinates: options.inputCoordinates,
					inputAddressId: options.inputAddressId,
					center: options.hasOwnProperty('center') ? options.center : null,
					zoom: options.hasOwnProperty('zoom') ? options.zoom : 10,
					apikey: options.apikey,
				});
			});
		},


		/**
		 * Загрузка скриптов для яндекс карт
		 * @param apikey
		 * @returns {Promise<unknown>}
		 */
		loadYMap: function (apikey) {

			return new Promise(function (resolve) {
				if (window.hasOwnProperty('ymaps')) {
					resolve();

				} else {
					$.getScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=" + apikey, function (data, textStatus, jqxhr) {
						ymaps.ready(resolve);
					});
				}
			});
		},


		instance: {
			_map: null,
			_mapContainer: null,
			_mapCenter: null,
			_mapZoom: null,
			_mapPlacemark: null,
			_inputCoordinates: null,
			_inputAddressId: null,
			_apikey: null,


			/**
			 * Инициализация
			 * @param {object} options
			 */
			init: function (options) {

				this._mapContainer     = options.mapContainer
				this._inputCoordinates = options.inputCoordinates;
				this._inputAddressId   = options.inputAddressId;
				this._mapCenter        = options.center;
				this._mapZoom          = options.zoom;
				this._apikey           = options.apikey;



				let instance = this;
				let lat      = this._mapCenter[0];
				let lng      = this._mapCenter[1];

				if ($(this._inputCoordinates).val()) {
					let coordinates = $(this._inputCoordinates).val().split(',');
					lat = coordinates[0].trim();
					lng = coordinates[1].trim();
				}

				if (Array.isArray(this._inputAddressId) ** this._inputAddressId.length > 0) {

					let inputAddresses = this._inputAddressId;


					/**
					 *
					 */
					function findAddress() {

						let values = [];

						inputAddresses.map(function (inputId) {
							let value = $('#' + inputId).val().trim();

							if (value) {
								values.push(value);
							}
						});

						if (values.length > 0) {
							instance.findAddress(values.join(', '));
						}
					}

					this._inputAddressId.map(function (inputId) {
						let input = $('#' + inputId);

						if (['INPUT', 'TEXTAREA'].indexOf(input.prop("tagName")) >= 0) {
							input.keyup(function (event) {
								if (event.keyCode !== 32 &&
									event.keyCode !== 37 &&
									event.keyCode !== 39
								) {
									findAddress()
								}
							});

						} else {
							input.change(function (event) {

								if (event.keyCode !== 32 &&
									event.keyCode !== 37 &&
									event.keyCode !== 39
								) {
									findAddress()
								}
							});
						}
					});
				}

				this._map = new ymaps.Map(this._mapContainer, {
					center: [lat, lng],
					zoom: this._mapZoom,
					controls: [],
					dragCursor: 'arrow'
				}, {
					yandexMapDisablePoiInteractivity: true,
					suppressMapOpenBlock: true,
					avoidFractionalZoom: false,
					autoFitToViewport: 'always'
				});



				this._mapPlacemark = new ymaps.Placemark([lat, lng], {}, {
					iconLayout: 'default#image',
					draggable: true
				});

				let that = this;

				this._mapPlacemark.events.add("dragend", function (e) {
					let coords = this.geometry.getCoordinates();

					that.setCoordinatesInput(coords[0], coords[1])
				}, this._mapPlacemark);


				$(this._inputCoordinates).change(function () {
					let coords = $(this).val().split(',');
					let lat    = coords.hasOwnProperty('0') && coords[0] ? $.trim(coords[0]) : '';
					let lng    = coords.hasOwnProperty('1') && coords[1] ? $.trim(coords[1]) : '';

					if (lat !== '' && lng !== '') {
						that.setCoordinatesMarker(lat, lng, true);
					}
				});


				let geoObjects = new ymaps.GeoObjectCollection({}, {
					strokeWidth: 4,
					geodesic: true
				});
				geoObjects.add(this._mapPlacemark);


				this._map.geoObjects.add(geoObjects);
			},


			/**
			 * Установка координат для поля
			 * @param {string}  lat
			 * @param {string}  lng
			 */
			setCoordinatesInput: function (lat, lng) {

				$(this._inputCoordinates).val(lat + ', ' + lng);
			},


			/**
			 * Установка координат для маркера
			 * @param {string}  lat
			 * @param {string}  lng
			 * @param {boolean} setZoom
			 */
			setCoordinatesMarker: function (lat, lng, setZoom) {

				this._mapPlacemark.geometry.setCoordinates([lat, lng]);

				if (setZoom) {
					this._map.setBounds(this._map.geoObjects.getBounds(), {
						checkZoomRange: false,
					});
					this._map.setZoom(10);
				}
			},


			/**
			 * @param address
			 */
			findAddress: function (address) {

				let priority = 'Беларусь';
				let instance = this;

				address = address.trim();

				if (address) {
					$.get("https://geocode-maps.yandex.ru/1.x/?apikey=" + this._apikey + "&format=json&geocode=" + address,
						function (data) {

							let addresses = [];

							if (data &&
								data.response &&
								data.response.GeoObjectCollection &&
								data.response.GeoObjectCollection.featureMember.length > 0
							) {
								let geoObject = null;

								$.each(data.response.GeoObjectCollection.featureMember, function (key, object) {

									if (object &&
										object.GeoObject &&
										object.GeoObject.metaDataProperty &&
										object.GeoObject.metaDataProperty.GeocoderMetaData &&
										object.GeoObject.metaDataProperty.GeocoderMetaData.text
									) {
										addresses.push(object.GeoObject.metaDataProperty.GeocoderMetaData.text);
									}


									if ( ! geoObject &&
										object &&
										object.GeoObject &&
										object.GeoObject.description &&
										object.GeoObject.description.indexOf(priority) >= 0
									) {
										geoObject = object.GeoObject;
									}
								})


								if ( ! geoObject &&
									data.response.GeoObjectCollection.featureMember[0] &&
									data.response.GeoObjectCollection.featureMember[0].GeoObject &&
									data.response.GeoObjectCollection.featureMember[0].GeoObject.Point &&
									data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
								) {
									geoObject = data.response.GeoObjectCollection.featureMember[0].GeoObject;
								}

								if (geoObject &&
									geoObject.Point &&
									geoObject.Point.pos
								) {
									let coords = geoObject.Point.pos.split(' ');

									instance.setCoordinatesMarker(coords[1], coords[0], true);
									instance.setCoordinatesInput(coords[1], coords[0]);
								}
							}

							$('#' + instance._inputAddressId).autocomplete({
								source: addresses,
								minLength: 0
							});
						},
						'json'
					)
				}
			}
		}
	}
};


/**
 * @param id
 * @param opt
 * @deprecated
 */
function mceSetup(id, opt) {
	edit.mceSetup(id, opt);
}


/**
 * @param f
 * @deprecated
 */
function lastFocus(f){
	f.elements[f.elements.length - 1].focus();
}