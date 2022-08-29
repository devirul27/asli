'use strict';

var  $$ = Dom7;

// Loading flag
var loading = false;

// Init App
window.myApp = new Framework7({
    init: false,
    material: true,
    pushState: true,
    domCache: true,
    onPageBeforeInit: function (page) {
        if (page.views[0].activePage.name === 'index') {
            addPages();
            getPages();
            geo();

            if (!Settings.weather) $$('#weather').parent().parent().parent().hide();

            if (!Settings.news) $$('#news').parent().hide();
            if (!Settings.reading) {
                if('AppsgeyserJSInterface' in window) AppsgeyserJSInterface.setMenuItemVisible('Toggle reading mode', false);
            }
            if (!Settings.night) {
                if('AppsgeyserJSInterface' in window) AppsgeyserJSInterface.setMenuItemVisible('Toggle night mode', false);

            }

            if ('AppsgeyserJSInterface' in window) {
                AppsgeyserJSInterface.getWeeklyHistory('loadHistory');
            } else {
                $$('[data-page="index"]').find('.virtual-list').html('<h2 style="text-align: center;width: 100%;">No history yet</h2>')
            }
        }
    },
    onPageAfterBack: function (page) {
        console.log('back');
    },
    tapHold: true
});

var mainView = myApp.addView('.view-main', {});
myApp.onPageInit('index', function (page) {

    var mySwiper = myApp.swiper('.swiper-container', {initialSlide: 0});

    if (window.location.hash == '#history') mySwiper.slideNext();
    window.location.hash = '';

    loadNews();

    loadImages(null, 'index');

    loadLink(link);

    $$('.block-site').on('taphold', function (event) {
        if (!$$(this).hasClass('content-add-link')) {
            var data = '';
            var app = 0;
            if ($$(this).children('div').hasClass('custom-img')) {
                data = $$(this).dataset();
                app = 1;
            } else {
                data = $$(this).children('div').dataset();
            }
            var clickedLink = this;
            var popoverHTML = '<div class="popover">' +
                '<div class="popover-inner">' +
                '<div class="list-block">' +
                '<ul>' +
                '<li><a href="#" data-app="' + app + '" data-id="' + data.id + '" class="item-link list-button edit" onclick="edit(this)">Edit</li>' +
                '<li><a href="#" data-app="' + app + '" data-id="' + data.id + '" class="item-link list-button" onclick="removeLink(this)">Remove</li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>';
            myApp.popover(popoverHTML, clickedLink);
        }
    });
    $$('#weather').on('taphold', function (event) {
        myApp.weatherModal('Change city ?', '', function (value) {
            $.jStorage.set('city', value);
            weather();
        }, function (val) {

        }, $.jStorage.get('city'));
    });
    $$('.open-url').on('click', function (event) {
        var src = $$('#weather').data('src');
        window.location = src;
        //if(!$$(event.target).hasClass('settings-weather') || ){
        //
        //}
        //console.log(event.target.hasClass('active-number'));
        //console.log(event.target.hasClass('image-weather'));
    });
    $$('.settings-weather').on('click', function () {
        myApp.weatherModal('Change city ?', '', function (value) {
            $.jStorage.set('city', value);
            weather();
        }, function (val) {

        }, $.jStorage.get('city'));
    });
    $$('.select-f-c div').on('click', function () {
        if (!$$(this).hasClass('active-select-f-c')) {
            $$('.select-f-c').find('.active-select-f-c').removeClass('active-select-f-c');
            $$(this).addClass('active-select-f-c');
            if ($$(this).hasClass('celsius')) {
                $$('.number').find('.active-number').removeClass('active-number');
                $$('.cl').addClass('active-number');
                $.jStorage.set('wea_gr', 'cl');
            } else {
                $$('.number').find('.active-number').removeClass('active-number');
                $$('.fr').addClass('active-number');
                $.jStorage.set('wea_gr', 'fr');
            }
        }
    });
});

myApp.onPageInit('link', function (page) {
    $$.each(link, function (i, v) {
        var div = '';
        if(v.icon.indexOf('custom')+1) div = '<div class="charAt-title">'+v.title.charAt(0)+'</div>';

        $$(page.container).find('.link').append(
            '<a href="' + v.url + '" target="_blank" class="col-25 tablet-20 center external block-site">' +
            '<div class="content-link-'+v.id+'" data-id="'+ v.id +'" style="position: relative;">' +
            '<img src="./' + v.icon + '" class="images-link" style="max-width: 100%;"/>' +
            ''+div+'' +
            '</div>' +
            '<p class="content-text-'+ v.id+'" >' + v.title + '</p>' +
            '</a>'
        );
    });

    $$(page.container).find('.link').append('<a class="col-25 tablet-20 center external block-site content-add-link"> ' +
        '<div data-id="#" style="position: relative;">'+
        '<i class="material-icons add-link">&#xE146;</i>'+
        '</div> <p>Add link</p></a>');

    $$('.block-site').on('taphold', function (event) {
        var data = '';
        var app = 0;
        if ($$(this).children('div').hasClass('custom-img')) {
            data = $$(this).dataset();
            app = 1;
        } else {
            data = $$(this).children('div').dataset();
        }

        var clickedLink = this;
        var popoverHTML = '<div class="popover">' +
            '<div class="popover-inner">' +
            '<div class="list-block">' +
            '<ul>' +
            '<li><a href="#" data-app="' + app + '" data-id="' + data.id + '" class="item-link list-button edit" onclick="edit(this)">Edit</li>' +
            '<li><a href="#" data-app="' + app + '" data-id="' + data.id + '" class="item-link list-button" onclick="removeLink(this)">Remove</li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>';
        myApp.popover(popoverHTML, clickedLink);
    });
});

myApp.onPageInit('news', function (page) {
    var url = "https://api.nytimes.com/svc/topstories/v2/home.json";
    url += '?' + $$.param({
            'api-key': apiKeyNS
        });
    var all = "https://api.nytimes.com/svc/news/v3/content/all/all.json";
    all += '?' + $$.param({
            'api-key': apiKeyNS
        });
    $$.ajax({
        url: url,
        success: function (data) {
            var json = JSON.parse(data);
            if (json.status === 'OK' && json.num_results > 0) {
                $$.each(json.results, function (i, v) {
                    if (v.multimedia.length > 0) {
                        var title = v.title;
                        var url = v.url;
                        var img = '';
                        var description = v.abstract;
                        if (!v.multimedia[4]) {
                            img = v.multimedia[3].url;
                        } else {
                            img = v.multimedia[4].url;
                        }
                        if (url === undefined) url = v.short_url;
                        $$('#page-news').append(
                            '<div class="card demo-card-header-pic">'+
                            '<div style="background-image:url(' + img + ')" valign="bottom" class="card-header color-white no-border" data-url="' + url + '">' + title + '</div>'+
                            '<div class="card-content">'+
                            '<div class="card-content-inner">'+
                            '<p>' + description + '</p>'+
                            '</div>'+
                            '</div>'+
                            '<div class="card-footer" style="padding:0;">'+
                            '<a href="' + url + '" class="link external" style="width: 100%;">Read more</a>'+
                        '</div>'+
                        '</div>'
                        );
                    }

                    $$('.card-header.color-white.no-border').on('click', function (event) {
                        var href = $$(this).dataset('url');
                        window.location.href = href.url;
                    });

                });
            }
        }
    });
    $$.ajax({
        url: all,
        success: function (data) {
            var json = JSON.parse(data);
            if (json.status === 'OK' && json.num_results > 0) {
                $$.each(json.results, function (i, v) {
                    if (v.multimedia.length > 0) {
                        var title = v.title;
                        var url = v.url;
                        var img = '';
                        var description = v.abstract;

                        if (v.multimedia[3]) {
                            console.log(v.multimedia);
                            console.log(v.multimedia[3]);
                            img = v.multimedia[3].url;
                        } else {
                            img = v.multimedia[2].url;
                        }
                        if (url === undefined) url = v.short_url;
                        $$('#page-news').append(
                            '<div class="card demo-card-header-pic">'+
                            '<div style="background-image:url(' + img + ')" valign="bottom" class="card-header color-white no-border" data-url="' + url + '">' + title + '</div>'+
                            '<div class="card-content">'+
                            '<div class="card-content-inner">'+
                            '<p>' + description + '</p>'+
                            '</div>'+
                            '</div>'+
                            '<div class="card-footer" style="padding:0;">'+
                            '<a href="' + url + '" class="link external" style="width: 100%;">Read more</a>'+
                            '</div>'+
                            '</div>'
                        );
                    }
                });
            }

            $$('.card-header.color-white.no-border').on('click', function (event) {
                var href = $$(this).dataset('url');
                window.location.href = href.url;
            });
        }
    });
});

window.pages_reddit = '';

myApp.onPageInit('images', function (page) {
    redditImages(pages_reddit);

    $$('.infinite-scroll').on('infinite', function () {

        // Exit, if loading in progress
        if (loading) return;

        // Set loading flag
        loading = true;

        // Emulate 1s loading
        setTimeout(function () {
            // Reset loading flag
            loading = false;
            redditImages(pages_reddit);
        }, 1000);
    });
});

myApp.init();


$$(window).resize(function () {
    resizeLink();
});

window.onload = function () {
    resizeLink();
};
$$(document).on('focus','#url_edit', function(){
    $$(this).val('http://');
}).on('focusout', function(){
    $$(this).val('');
});

$$(document).on('click', '.content-add-link', function () {
    addCustomLink()
});