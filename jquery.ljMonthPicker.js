/**
 *    Month picker plugin v0.1.1 by Lijie
 *    Build upon jQuery1.6+
 */

// ;(function ($) {

	$.fn.ljMonthPicker = function (options) {
		var $ljInput = $(this);

		var defaultOptions = {
			shortMonths: [
				'Jan', 'Feb', 'Mar', 'Apr',
			  	'May', 'Jun', 'Jul', 'Aug',
			  	'Sep', 'Oct', 'Nov', 'Dec'
		  	],
		  	longMonths: [
		  		'January', 'Febuary', 'March', 'April',
		  		'May', 'June', 'July', 'August',
		  		'September', 'October', 'November', 'December'
		  	],
		  	value: [2015, 5],	 // current selection value is 2015 May
		  	maxMonth: [2015, 6], // max month is 2015 June
		  	minMonth: [2005, 4], // min month is 2005 April
		  	toggleOnImg: false,
		  	closeOnSelect: true,
		  	onSelect: null,
		  	onOpen: null,
		  	onClose: null
		};

		var ljOptions = $.extend(defaultOptions, options),
			ljMaxMonth = ljOptions.maxMonth,
			ljMinMonth = ljOptions.minMonth,
			ljPickerClass = 'ljMonthPicker',
			ljCurrentMonth = ljOptions.value
			$ljPicker = null;

		var positionPicker = function () {
			var originalOffset = $ljInput.offset();
			$ljPicker.css({
				position: 'absolute',
				'z-index': 99999,
				left: originalOffset.left,
				top: originalOffset.top + $ljInput.height(),
				display: 'none'
			});
		};

		var setValue = function (newYearMonth) {
			var $monthBtns = $ljPicker.find('.ljMonthBtn').removeClass('selected'),
				$yeanSpan = $ljPicker.find('.ljMonthPickerHead .current'),
				$prevBtn = $ljPicker.find('.previous'),
				$nextBtn = $ljPicker.find('.next'),
				newYear = newYearMonth[0],
				newMonth = newYearMonth[1];
			$yeanSpan.text(newYear);
			if(!!newMonth) {
				$($monthBtns.get(newMonth-1)).addClass('selected');
			}
			if (newYear === ljMaxMonth[0]) {
				$nextBtn.addClass('disabled');
			}
			if (newYear === ljMinMonth[0]) {
				$prevBtn.addClass('disabled');
			}
			$ljInput.val(ljCurrentMonth[0] + ' - ' + ljCurrentMonth[1])
		};

		var bindPickerEvent = function () {
			var $prevBtn = $ljPicker.find('.previous'),
				$nextBtn = $ljPicker.find('.next'),
				$yeanSpan = $ljPicker.find('.ljMonthPickerHead .current'),
				$monthBtns = $ljPicker.find('.ljMonthBtn');

			$prevBtn.on('click', function () {
				if ($prevBtn.hasClass('disabled')) {
					return false;
				} else {
					$nextBtn.removeClass('disabled');
					var newYear = Number($yeanSpan.text()) - 1;
					setValue([newYear, 0]);
					customizePickerMonth([newYear, 0]);
				}
				return false;
			});

			$nextBtn.on('click', function () {
				if ($nextBtn.hasClass('disabled')) {
					return false;
				} else {
					$prevBtn.removeClass('disabled');
					var newYear = Number($yeanSpan.text()) + 1;
					setValue([newYear, 0]);
					customizePickerMonth([newYear, 0]);
				}
				return false;
			});

			$monthBtns.on('click', function () {
				if ($(this).hasClass('disabled')) {
					return false;
				} else {
					var selectedYear = $ljPicker.find('.ljMonthPickerHead .current').text();
					var selectedMonth = $monthBtns.index($(this)) + 1;
					$ljInput.val(selectedYear + ' - ' + selectedMonth);
					closeMonthPicker();
				}
				return false;
			});
		};

		var customizePickerMonth = function (newYearMonth) {
			var $monthBtns = $ljPicker.find('.ljMonthBtn').removeClass('disabled');
			// disable according to min/max
			if (newYearMonth[0] === ljMinMonth[0]) {
				$monthBtns.slice(0, ljMinMonth[1]).addClass('disabled');
			}
			if (newYearMonth[0] === ljMaxMonth[0]) {
				$monthBtns.slice(ljMaxMonth[1]).addClass('disabled');
			}
		};

		var generateDom = (function () {
			if (!$('.'+ljPickerClass).length) {
				// generate picker dom if not exists
				var monthHtmls = [];
				for (var i = 0; i < 12; i++) {
					monthHtmls.push('<div class="ljMonthBtn">'+ljOptions.shortMonths[i]+'</div>');
				}
				var monthHtml = monthHtmls.join('');
				var ljMonthPickerHtmls = [
					'<div class="'+ljPickerClass+'">',
						'<div class="ljMonthPickerHead"><div class="previous"><i></i></div><div class="current"></div><div class="next"><i></i></div></div>',
						'<div style="clear: both"></div>',
						monthHtml,
					'</div>'
				];
				$('body').append(ljMonthPickerHtmls.join(''));
				$ljPicker = $('.'+ljPickerClass);
			} else {
				// picker dom already exists
			}
			positionPicker();
			setValue(ljCurrentMonth);
			customizePickerMonth(ljCurrentMonth);
			bindPickerEvent();
		})();

		var showMonthPicker = function () {
			$ljPicker.show();
		};

		var closeMonthPicker = function () {
			$ljPicker.hide();
		};

		var triggerMonthPicker = function () {
			if (!!ljOptions.onSelect) {
				ljOptions.onSelect();
			}
			var currentMonth = [Number($ljInput.val().split(' - ')[0]), Number($ljInput.val().split(' - ')[1])];
			ljCurrentMonth = currentMonth;
			setValue(currentMonth);
			customizePickerMonth(currentMonth);
			showMonthPicker();
		};

		if (ljOptions.toggleOnImg) {
			$ljInput.on('click', 'img', function () {
				triggerMonthPicker();
				return false;
			});
		} else {
			$ljInput.on('click', function () {
				triggerMonthPicker();
				return false;
			});
		}

		return $ljInput;

	};

// });
