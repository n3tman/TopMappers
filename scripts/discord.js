$(function() {
    var copyBtn = document.getElementById('copy');
    var currentColor = 'red';
    var currentBlock = 'anone';
    var $pickerGrid = $('.picker .grid');
    var $paintGrid = $('.paint .grid');
    var tdHtml = $paintGrid.find('td:first')[0].outerHTML;

    var copyTooltip = tippy(copyBtn, {
        placement: 'bottom',
        content: 'Copied!',
        trigger: 'manual',
    });

    var activeSelect = function($td) {
        $('.picker td').removeClass('active');
        $td.addClass('active');
        currentBlock = $td.data('name');
        var imageSrc = $('[data-name="' + currentBlock + '"] img').attr('src');
        $('.preview img').attr('src', imageSrc);
    };

    var updateText = function() {
        var text = '';
        $paintGrid.find('tr').each(function() {
            $(this).find('td').each(function () {
                text += ':' + this.dataset.name + ':';
            });
            text += '&#13;&#10;';
        });
        $('#result').html(text);
    };

    $(copyBtn).click(function (e) {
        e.preventDefault();
        copyTooltip.instances[0].show();

        setTimeout(function () {
            copyTooltip.instances[0].hide();
        }, 1000);
    });

    new ClipboardJS('#copy', {
        text: function () {
            return $('#result').val().trim();
        }
    });

    hotkeys('1', function () {
        $pickerGrid.removeClass('active');
        $('.grid.red').addClass('active');
        currentColor = 'red';
    });

    hotkeys('2', function () {
        $pickerGrid.removeClass('active');
        $('.grid.blue').addClass('active');
        currentColor = 'blue';
    });

    ['q', 'w', 'e', 'a', 's', 'd', 'z', 'x', 'c'].forEach(function (key, i) {
        hotkeys(key, function () {
            var $td = $('.grid.' + currentColor + ' td').eq(i);
            activeSelect($td);
        });
    });

    ['r', 'f', 'v'].forEach(function (key, i) {
        hotkeys(key, function () {
            var $td = $('.grid.other td').eq(i);
            activeSelect($td);
        });
    });

    $pickerGrid.find('td').click(function () {
        var $td = $(this);
        if (!$td.hasClass('skip')) {
            activeSelect($td);
        }
    });

    $paintGrid.on('mousedown mouseenter', 'td', function (e) {
        if (!$paintGrid.parent().hasClass('ui-resizable-resizing') && e.buttons === 1) {
            this.dataset.name = currentBlock;
            var currentSrc = $('[data-name="' + currentBlock + '"]:first img').attr('src');
            $(this).find('img').attr('src', currentSrc);
            updateText();
        }
    });

    $('#clear').click(function (e) {
        e.preventDefault();
        $paintGrid.find('td').replaceWith(tdHtml);
        updateText();
    });

    $('#reset').click(function (e) {
        e.preventDefault();
        $paintGrid.find('tr:gt(2)').remove();
        $paintGrid.find('td:nth-child(n + 5)').remove();
        $paintGrid.parent().css({
            width: 205,
            height: 154
        });
        updateText();
    });

    $paintGrid.parent().resizable({
        grid: [51, 51],
        resize: _.debounce(function (e, ui) {
            // Dynamically adding rows/cols

            var cols = (ui.size.width - 1) / 51;
            var rows = (ui.size.height - 1) / 51;

            var trCount = $paintGrid.find('tr').length;
            var tdCount = $paintGrid.find('tr:first td').length;

            if (trCount !== rows) {
                if (trCount > rows) {
                    $paintGrid.find('tr:gt(' + (rows - 1) + ')').remove();
                } else {
                    for (var i = 0; i < rows - trCount; i++) {
                        var trHtml = '<tr>';
                        for (var j = 0; j < tdCount; j++) {
                            trHtml += tdHtml;
                        }
                        trHtml += '</tr>';
                        $paintGrid.append(trHtml);
                    }
                }
            }

            if (tdCount !== cols) {
                $paintGrid.find('tr').each(function () {
                    $tr = $(this);

                    if (tdCount > cols) {
                        $tr.find('td:gt(' + (cols - 1) + ')').remove();
                    } else {
                        for (var i = 0; i < cols - tdCount; i++) {
                            $tr.append(tdHtml);
                        }
                    }
                });
            }

            updateText();
        }, 100)
    });
});
