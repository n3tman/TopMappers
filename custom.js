function getAvatarUrl($cell) {
    return $cell.closest('tr').find('td:eq(2) img').attr('src');
}

function getMapperName($cell) {
    return $cell.closest('tr').find('td:eq(3)').text();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function convertImgToDataURLviaCanvas(url, callback, format) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(format);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
}

$(function () {
    var $mapperTable = $('#mappers'),
        $songTable = $('#songs'),
        $table;

    if ($mapperTable.length) {
        $table = $mapperTable;
    } else {
        $table = $songTable;
    }

    $.tablesorter.addWidget({
        id: 'numbering',
        format: function (table) {
            $('tr:not(.filtered)', table.tBodies[0]).each(function (i) {
                $(this).find('td').eq(0).text(i + 1);
            });
        }
    });

    $('[data-toggle="tooltip"]').tooltip({
        boundary: 'window',
        delay: {'show': 500, 'hide': 100},
        html: true,
        trigger: 'hover'
    });

    // Reset sort button
    $('#reset-sort').click(function () {
        $table.trigger('sortReset');
    });

    // Scroll to top link
    $('#scroll-top').click(function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });

    // Tablesorter
    if ($mapperTable.length) {
        $mapperTable.tablesorter({
            theme: 'bootstrap',

            headerTemplate: '',

            delayInit: true,

            textExtraction: function (node) {
                return node.textContent || $(node).text() || '';
            },

            headers: {
                0: {sorter: false, parser: false, filter: false},
                1: {sorter: 'digit', filter: false},
                2: {sorter: false, parser: false, filter: false},
                3: {sorter: 'text'},
                4: {sorter: 'digit', sortInitialOrder: 'desc'},
                5: {sorter: 'digit', sortInitialOrder: 'desc'},
                6: {sorter: 'percent', sortInitialOrder: 'desc'},
                7: {sorter: 'digit', sortInitialOrder: 'desc'},
                8: {sorter: 'digit', sortInitialOrder: 'desc'},
                9: {sorter: 'percent', sortInitialOrder: 'desc'},
                10: {sorter: 'digit', sortInitialOrder: 'desc'},
                11: {sorter: 'digit', sortInitialOrder: 'desc'},
                12: {sorter: 'digit', sortInitialOrder: 'desc'},
                13: {sorter: 'digit', sortInitialOrder: 'desc'},
                14: {sorter: 'usLongDate'},
                15: {sorter: 'usLongDate', sortInitialOrder: 'desc'},
                16: {sorter: 'digit', sortInitialOrder: 'desc'},
                17: {sorter: 'digit', sortInitialOrder: 'desc'},
                18: {sorter: false, parser: false, filter: false},
                19: {sorter: false, parser: false, filter: false}
            },

            widgets: ['lazyload', 'filter', 'columns', 'zebra', 'numbering'],

            widgetOptions: {
                filter_cssFilter: 'form-control',
                filter_reset: '#reset-filter',
                filter_searchDelay: 500,
                filter_placeholder: {
                    search: 'Num..'
                },
                columns: ['secondary', 'tertiary']
            }
        });
    }

    $table.tablesorterPager({
        container: $('.ts-pager'),
        cssGoto: '.pagenum',
        size: 15,
        output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
    }).on('pagerChange sortEnd filterEnd', function () {
        $(window).trigger('scroll');
    });

    if ($mapperTable.length) {
        // Popovers with playlist data
        $.getJSON('/data/playlists.json', function (data) {
            var badgeSelector = '[data-lists]';

            $('body').on('click', badgeSelector, function (e) {
                e.preventDefault();
                $(badgeSelector).popover('hide');
            }).popover({
                selector: badgeSelector,
                boundary: 'window',
                title: function () {
                    var mapper = getMapperName($(this));
                    return 'Playlists featuring <strong>' + mapper + '</strong>';
                },
                html: true,
                placement: 'auto',
                trigger: 'click',
                content: function () {
                    var idArray = this.dataset.lists.split(',');
                    var text = '<ol>';
                    var index;

                    idArray.forEach(function (id) {
                        index = parseInt(id) - 1;
                        text += '<li><a href="' + data[index].url + '" target="_blank">'
                            + data[index].name + '</a> by&nbsp;' + data[index].author + '</li>';
                    });

                    text += '</ul>';

                    return text;
                }
            }).on('click', function (e) {
                if (!e.target.dataset.lists && !$('.popover').has(e.target).length) {
                    $(badgeSelector).popover('hide');
                }
            })
        });

        // Playlist generator
        $.getJSON('/data/maps.json', function (data) {
            var downloadSelector = '.download';

            $('body').on('click', downloadSelector, function (e) {
                var $this = $(this),
                    mapperName = getMapperName($this),
                    avatarUrl = getAvatarUrl($this),
                    ext = avatarUrl.split('.')[2],
                    corsUrl = 'https://cors-anywhere.herokuapp.com/',
                    uniqueUrl = corsUrl + avatarUrl + '?' + Date.now() + getRandomInt(1000),
                    mapNum = this.innerText,
                    title = 'Maps by ' + mapperName + ' (' + mapNum + ' Total)',
                    date = new Date().toISOString().replace(/^\d\d([^T]+).*/, '$1'),
                    listJson = {},
                    mime;

                e.preventDefault();

                $this.html('<div class="spinner-border spinner-border-sm"></div>');

                if (ext === 'jpg' || ext === 'jpeg') {
                    mime = 'image/jpeg';
                } else {
                    mime = 'image/png';
                }

                convertImgToDataURLviaCanvas(uniqueUrl, function (base64Img) {
                    listJson.playlistTitle = title;
                    listJson.playlistAuthor = mapperName;
                    listJson.playlistDescription = 'All maps by ' + mapperName + ' (' + date + ')';
                    listJson.image = base64Img;
                    listJson.songs = data[mapperName.toLowerCase()];

                    saveAs(new Blob(
                        [JSON.stringify(listJson)
                            .replace(/},{/g, '},\n{')
                            .replace('[{', '[\n{')
                            .replace('}]', '}\n]')],
                        {type: 'application/json;charset=utf-8'}
                    ), title + ' ' + date + '.json');

                    $this.html(mapNum);
                }, mime);
            });
        });
    }
});