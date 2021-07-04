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
        $playTable = $('#testplays'),
        $recomTable = $('#recom'),
        $table,
        $copy;

    if ($mapperTable.length) {
        $table = $mapperTable;
    }

    if ($songTable.length) {
        $table = $songTable;
    }

    if ($playTable.length) {
        $table = $playTable;
    }

    if ($recomTable.length) {
        $table = $recomTable;
    }

    $.tablesorter.addWidget({
        id: 'numbering',
        format: function (table) {
            $('tr:not(.filtered)', table.tBodies[0]).each(function (i) {
                $(this).find('td').eq(0).text(i + 1);
            });
        }
    });

    $.tablesorter.addWidget({
        id: 'card-num',
        format: function (table) {
            $('tr:not(.filtered)', table.tBodies[0]).each(function (i) {
                $(this).find('.counter').text(i + 1);
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
            behavior: 'smooth'
        });
    });

    $copy = $('.copy');

    $copy.tooltip({
        trigger: 'manual',
        title: 'Copied!'
    }).click(function () {
        $this = $(this);

        new ClipboardJS('.copy', {
            text: function (trigger) {
                return $(trigger).text();
            }
        });

        $this.tooltip('show');

        setTimeout(function () {
            $this.tooltip('hide');
        }, 1000);
    });

    // Tablesorter: top mappers
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
                13: {sorter: 'usLongDate'},
                14: {sorter: 'usLongDate', sortInitialOrder: 'desc'},
                15: {sorter: 'digit', sortInitialOrder: 'desc'},
                16: {sorter: 'digit', sortInitialOrder: 'desc'},
                17: {sorter: false, parser: false, filter: false},
                18: {sorter: false, parser: false, filter: false}
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

    // Tablesorter: ranked leaderboards
    if ($songTable.length) {
        $songTable.tablesorter({
            theme: 'bootstrap',

            headerTemplate: '',

            delayInit: true,

            textExtraction: function (node) {
                return node.textContent || $(node).text() || '';
            },

            headers: {
                0: {sorter: false, parser: false, filter: false},
                1: {sorter: 'text'},
                2: {sorter: 'text'},
                3: {sorter: 'text'},
                4: {sorter: 'digit', sortInitialOrder: 'desc'},
                5: {sorter: 'digit', sortInitialOrder: 'desc'},
                6: {sorter: 'digit', sortInitialOrder: 'desc'},
                7: {sorter: 'digit', sortInitialOrder: 'desc'},
                8: {sorter: 'digit', sortInitialOrder: 'desc'},
                9: {sorter: 'percent', sortInitialOrder: 'desc'},
                10: {sorter: 'digit', sortInitialOrder: 'desc'},
                11: {sorter: 'percent', sortInitialOrder: 'desc'},
                12: {sorter: 'digit', sortInitialOrder: 'desc'},
                13: {sorter: 'usLongDate', sortInitialOrder: 'desc'},
                14: {sorter: 'digit', sortInitialOrder: 'desc'},
                15: {sorter: false, parser: false, filter: false},
                16: {sorter: false, parser: false, filter: false},
                17: {sorter: 'text'},
                18: {sorter: false, parser: false, filter: false}
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

    // Tablesorter: recommended maps
    if ($recomTable.length) {
        $recomTable.tablesorter({
            theme: 'bootstrap',

            headerTemplate: '',

            delayInit: true,

            textExtraction: function (node) {
                return node.textContent || $(node).text() || '';
            },

            headers: {
                0: {sorter: false, parser: false, filter: false},
                1: {sorter: 'text'},
                2: {sorter: 'text'},
                3: {sorter: 'digit', sortInitialOrder: 'desc'},
                4: {sorter: 'digit', sortInitialOrder: 'desc'},
                5: {sorter: 'percent', sortInitialOrder: 'desc'},
                6: {sorter: 'digit', sortInitialOrder: 'desc'},
                7: {sorter: 'percent', sortInitialOrder: 'desc'},
                8: {sorter: 'digit', sortInitialOrder: 'desc'},
                9: {sorter: 'usLongDate', sortInitialOrder: 'desc'},
                10: {sorter: false, parser: false, filter: false},
                11: {sorter: false, parser: false, filter: false},
                12: {sorter: false, parser: false, filter: false},
                13: {sorter: 'text'},
                14: {sorter: false, parser: false, filter: false}
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

    // Tablesorter: testplays
    if ($playTable.length) {
        var playerDb = {},

            pidArray = [],

            autoplay = true,

            reloadPlayers = function () {
                $playTable.trigger('pagerChange').trigger('pagerComplete');
            },

            setActiveCard = function (pid) {
                var bClass = 'border-primary';
                $('.' + bClass).removeClass(bClass);
                $('#' + pid).closest('.card').addClass(bClass);
            },

            setOverlay = function (player, index, total, author, title) {
                player.overlay({
                    content: '[' + index + '/' + total + '] <strong>' + author + '</strong>: ' + title,
                    align: 'top-right'
                });
            },

            resetPlayer = function (vid) {
                vid.pause();
                vid.currentTime(0);

                vid.controlBar.hide();
                vid.posterImage.show();
                vid.bigPlayButton.show();

                vid.one('play', function () {
                    vid.posterImage.hide();
                    vid.controlBar.show();
                    vid.bigPlayButton.hide();
                });
            },

            initPlayer = function (pid, thumb, url, author, title) {
                var $html = $('<video-js class="embed-responsive-item vjs-big-play-centered" id="' + pid + '">'),
                    playerContainer = '#' + pid.replace('player-', '');

                $(playerContainer).html($html);

                if (!playerDb[pid]) {
                    playerDb[pid] = {};
                }

                playerDb[pid].thumb = thumb;
                playerDb[pid].url = url;
                playerDb[pid].author = author;
                playerDb[pid].title = title;

                var player = videojs(pid, {
                    controls: true,
                    preload: 'none',
                    poster: thumb,
                    sources: [{src: url, type: 'video/mp4'}]
                });

                // Allow only one video to be played
                player.on('play', function () {
                    var id = this.tagAttributes.id;

                    if (!this.autoplay()) {
                        this.autoplay(true);
                    }

                    setActiveCard(id);

                    for (var pid in videojs.players) {
                        var vid = videojs.players[pid];
                        if (vid && this.id_ !== vid.id_ && vid.hasStarted_) {
                            resetPlayer(vid);
                            vid.hasStarted_ = false;
                        }
                    }
                });

                player.on('ended', function () {
                    resetPlayer(player);
                });

                allLoaded();
            },

            reloadVideos = _.debounce(function () {
                pidArray = [];

                $('tr:visible .embed-responsive').each(function () {
                    var pid = 'player-' + this.id;
                    pidArray.push(pid);

                    if (playerDb[pid] && !playerDb[pid].loaded && !playerDb[pid].error) {
                        initPlayer(
                            pid, playerDb[pid].thumb, playerDb[pid].url,
                            playerDb[pid].author, playerDb[pid].title
                        );

                        playerDb[pid].loaded = true;
                    }
                });
            }, 500),

            allLoaded = _.debounce(function () {
                if (autoplay) {
                    var listArray = [],
                        pidFiltered = [];

                    pidArray.forEach(function (pid) {
                        if (playerDb[pid] && !playerDb[pid].error) {
                            listArray.push({
                                sources: [{
                                    src: playerDb[pid].url,
                                    type: 'video/mp4'
                                }],
                                poster: playerDb[pid].thumb
                            });

                            pidFiltered.push(pid);
                        }
                    });

                    pidFiltered.forEach(function (pid) {
                        var index = pidFiltered.indexOf(pid),
                            player = videojs.players[pid],
                            total = pidFiltered.length,

                            Button = videojs.getComponent('Button'),

                            PrevButton = videojs.extend(Button, {
                                constructor: function () {
                                    Button.apply(this, arguments);
                                    this.addClass('fas');
                                    this.addClass('fa-step-backward');
                                    this.controlText('Previous');
                                },

                                handleClick: function () {
                                    player.playlist.previous();
                                }
                            }),

                            NextButton = videojs.extend(Button, {
                                constructor: function () {
                                    Button.apply(this, arguments);
                                    this.addClass('fas');
                                    this.addClass('fa-step-forward');
                                    this.controlText('Next');
                                },

                                handleClick: function () {
                                    player.playlist.next();
                                }
                            });

                        if (player) {
                            if (!player.getChild('controlBar').getChild('NextButton')) {
                                videojs.registerComponent('NextButton', NextButton);
                                videojs.registerComponent('PrevButton', PrevButton);
                                player.getChild('controlBar').addChild('PrevButton', {}, 0);
                                player.getChild('controlBar').addChild('NextButton', {}, 2);
                            }

                            player.playlist(listArray, index);
                            player.playlist.autoadvance(0);

                            player.on('playlistitem', function () {
                                var ind = player.playlist.currentIndex(),
                                    id = pidFiltered[ind];

                                if (id) {
                                    setOverlay(
                                        player, ind + 1, total,
                                        playerDb[id].author, playerDb[id].title
                                    );

                                    if (this.hasStarted_) {
                                        player.userActive(true);
                                    }
                                }
                            });
                        }
                    });
                }
            }, 1000);


        $playTable.tablesorter({
            theme: 'bootstrap',

            headerTemplate: '',

            textExtraction: function (node) {
                return $(node).find('.text').text();
            },

            headers: {
                0: {sorter: 'text'},
                1: {sorter: 'text'},
                2: {sorter: 'usLongDate'}
            },

            widgets: ['filter', 'card-num', 'lazyload'],

            widgetOptions: {
                filter_cssFilter: 'form-control',
                filter_useParsedData: true,
                filter_reset: '#reset-filter',
                filter_searchDelay: 1000
            }
        });

        $playTable.on('appear', '.lazy', function () {
            var code = this.dataset.code,
                pid = 'player-' + code,
                author = $(this).parent().next().text();

            if (!playerDb[pid]) {
                playerDb[pid] = {};
            }

            if (!playerDb[pid].loaded) {
                $.get('https://api.streamable.com/videos/' + code, function (data) {
                    // console.log('fired: ' + pid);
                    initPlayer(
                        pid, data.thumbnail_url, data.files.mp4.url, author, data.title
                    );
                }).fail(function () {
                    playerDb[pid].error = true;
                });
            }

            playerDb[pid].loaded = true;
        });

        $playTable.on('pagerChange', function () {
            for (var pid in videojs.players) {
                var vid = videojs.players[pid];

                if (vid && !playerDb[pid].error) {
                    videojs.players[pid].dispose();
                    // console.log('disposed: ' + pid);
                }

                playerDb[pid].loaded = false;
            }
        }).on('pagerComplete', function () {
            reloadVideos();
        });

        $('#autoplay').click(function () {
            var $this = $(this);
            $this.toggleClass('btn-success btn-secondary');

            if ($this.hasClass('btn-success')) {
                $this.text('Autoplay Enabled');
                autoplay = true;
            } else {
                $this.text('Autoplay Disabled');
                autoplay = false;
            }

            reloadPlayers();
        });

        $('#reload').click(function () {
            reloadPlayers();
        });
    }

    if ($table) {
        $table.tablesorterPager({
            container: $('.ts-pager'),
            cssGoto: '.pagenum',
            size: $playTable.length ? 8 : 15,
            output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
        });

        $table.on('pagerChange sortEnd filterEnd', function () {
            $(window).trigger('scroll');
        });
    }

    if ($mapperTable.length) {
        // Popovers with playlist data
        $.getJSON('data/playlists.json', function (data) {
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
            });
        });

        // Playlist generator
        $.getJSON('data/maps.json', function (data) {
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
                    ), title + ' ' + date + '.bplist');

                    $this.html(mapNum);
                }, mime);
            });
        });
    }
});
