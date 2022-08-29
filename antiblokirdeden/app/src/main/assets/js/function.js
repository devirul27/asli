window.modal_remove = false;
window.show_modal = false;
window.link = [];
var apiKeysNS = [
    'cb698fb57171901935e36cea2497ecc5:12:74822716',
    '74ba363337b66e8b4dcb92d57dc3d752:5:74822805',
    '55dea2e5231614b954692e66d4f662f4:4:74822810',
    '2d77e6800acf8d55d62dc67fcaafced0:0:74822866',
    '3f17e1188896ce2d78b308aa48e4364d:10:74822859',
    'b13b9dfb84f6d4f33efc1a25067fbfac:10:74822868'
], apiKeyNS = apiKeysNS[Math.floor(Math.random() * apiKeysNS.length)];

!function () {
    window.openHistory = function(){
        var mySwiper = myApp.swiper('.swiper-container');
        mySwiper.slideNext();    };
}();

function hideToasts() {
    setTimeout(function () {
        if(show_modal){
            modal_remove = true;
            $$('.close-notification').click();
        }
    }, 2000);
}

function removeLink(elem) {
    myApp.closeModal();
    var data = $$(elem).dataset();
    $$('[data-id="' + data.id + '"]').parent().hide();
    show_modal = true;
    myApp.addNotification({
        message: 'Bookmark was removed',
        button: {
            text: 'Cancel',
            color: 'lightgreen'
        },
        onClose: function () {
            if(modal_remove){
                show_modal = false;
                //if (window.AppsgeyserJSInterface) {
                if (1 === 1) {
                    modal_remove = false;
                    AppsgeyserJSInterface.removeFromHomepage(data.id);
                }
            } else {
                show_modal = false;
                $$('[data-id="' + data.id + '"]').parent().show();
            }
        }
    });
    hideToasts();
}

function getIconForUrl(url) {
    var iconSrc = '',
        url_parser = new URI(url),
        ic = {
            'facebook': 'facebook-icon.png',
            'www.google': 'google-search-icon.png',
            'twitter': 'twitter-icon.png',
            'youtube': 'youtube-icon.png',
            'vimeo': 'vimeo-icon.png',
            'apple': 'apple-icon.png',
            'instagram': 'instagram-icon.png',
            'drive.google': 'google-drive-icon.png',
            'plus.google': 'google-plus-icon.png',
            'www.tumblr.com': 'tumblr-icon.png',
            'yahoo': 'yahoo-icon.png',
            'github.com': 'github-icon.png',
            'dribbble.com': 'dribbble-icon.png',
            'www.ayonikah.com': 'ayonikah-icon.png',
            'idnbanget.net': 'gudangcara-icon.png',
            'mail.google': 'google-mail-icon.png',
            'reddit': 'reddit-icon.png',
            'pinterest': 'pinterest-icon.png',
            'aliexpress.com': 'aliexpress.png',
            'amazon.com': 'amazon.png',
            'aol.com': 'AOL.png',
            'asknetwork': 'ask_network.png',
            'booking.com': 'booking.png',
            'cbsinteractive.com': 'CBSInter.png',
            'cnn.com': 'CNN.png',
            'drom.ru': 'DROM.png',
            'ebay.com': 'ebay.png',
            'foxnews.com': 'foxnews2.png',
            'imdb.com': 'imdb-icon.png',
            'mode.com': 'ModeMedia.png',
            'nbc.com': 'NBSUniversal.png',
            'nytimes.com': 'newyorktimes.png',
            'vk.com': 'VK.png',
            'weather.com': 'weathercompany.png',
            'wikipedia': 'wikimediafoundation.png',
            'microsoft.com': 'windows.png',
            'yelp.com': 'Yelp.png',
            'www.merdeka.com': 'merdeka.png',
            'www.suara.com': 'suara.png',
            'www.kumparan.com': 'kumparan.png',
            'www.kompas.com': 'kompas.png',
            'www.liputan6.com': 'liputan6.png',
            'tribunnews.com': 'tribun.png',
            'www.okezone.com': 'okezone.png',
             'www.yandex.com': 'yandex.png',

        }, icon = null;

    $$.each(ic, function (i, v) {
        if (url_parser.hostname().indexOf(i) !== -1) icon = v;
    });
    if (!icon) {
        return 'img/custom-' + Math.floor(Math.random() * 17) + '.png';
    } else {
        return 'img/' + icon;
    }
}

function edit(elem) {
    myApp.closeModal();

    var id = $$(elem).dataset().id;
    var name = $.jStorage.get('input_name');
    var url = $.jStorage.get('input_url');
    var custom_bookmark = true;

    $$.each(link, function(i,v){
       if(v.id == id){
           if(v.app_id === undefined){
               if (name === null) name = v.title;
               if (url === null) url = v.url;
           } else {
               custom_bookmark = false;
           }
       }
    });
    if(custom_bookmark){
        var array = {
            'name': name,
            'url': url
        };
        console.log(JSON.stringify(array));
        $.jStorage.deleteKey('input_name');
        $.jStorage.deleteKey('input_url');

        myApp.editLink('Edit ' + name, '', function (value) {
            var obj = {};
            var error = [];
            $$.each(value, function (i, v) {
                var name = $$(v).attr('name');
                if (name == 'url') {
                    if ($$(v).val().trim() == '') {
                        error.push('url');
                    } else {
                        obj.url = $$(v).val();
                        $.jStorage.set('input_url', $$(v).val());
                    }
                } else {
                    if ($$(v).val().trim() == '') {
                        error.push('name');
                    } else {
                        obj.name = $$(v).val();
                        $.jStorage.set('input_name', $$(v).val());
                    }
                }
            });
            if (error.length > 0) {
                var html = '<ul style="list-style: none;padding-left: 0;">';
                $$.each(error, function (i, v) {
                    if (v == 'name') {
                        html += '<li>Заполните имя сайта</li>';
                    } else {
                        html += '<li>Заполните ссылку на сайт</li>';
                    }
                });
                html += '</ul>';
                myApp.alert(html, '', function (val) {
                    edit(elem);
                });
            } else {
                $.jStorage.deleteKey('input_name');
                $.jStorage.deleteKey('input_url');
                var localLinks = JSON.parse(AppsgeyserJSInterface.getHomePageItems());
                $$.each(localLinks, function (i, v) {
                    if (id == v.id) {
                        localLinks[i].name = obj.name;
                        localLinks[i].url = obj.url;
                        $$('.content-link-' + id).parent().find('p').html(obj.name);
                        $$('.content-link-' + id).parent().attr('href', obj.url);
                    }
                });
                removeBookmarks(localLinks);
                addBookmarks(localLinks);
                console.log(JSON.stringify(localLinks));
            }
        }, function () {
        }, array);
    } else {
        myApp.alert('Sorry you can\'t change bookmarks in current browser version', '');
    }
}

function addBookmarks(local){
    $$.each(local, function(i,v){
        AppsgeyserJSInterface.addToHomePage(v.name, v.url);
    });
}

function removeBookmarks(local){
    $$.each(local, function(i,v){
        AppsgeyserJSInterface.removeFromHomepage(v.id);
    });
}

function addPages(){
    if ('AppsgeyserJSInterface' in window) {
        if(AppsgeyserJSInterface.getItem('loadLink') !== '1'){
            $$.each(Settings.browserLinks, function (i, v) {

                if(v.icon !== ''){
                    $.jStorage.set(v.url, v.icon);
                }

                AppsgeyserJSInterface.addToHomePage(v.title, v.url);
            });
            AppsgeyserJSInterface.setItem('loadLink','1');
        }
    }
}

function getPages() {
    if ('AppsgeyserJSInterface' in window) {
        var itemsString = AppsgeyserJSInterface.getHomePageItems(),
            items,
            localItems;
        var links = [];
        if (itemsString) {
            try {
                items = JSON.parse(itemsString);
                if (items && items.length > 0) {
                    var obj = {};
                    for (var i = 0; i < items.length; i++) {
                        var icon = getIconForUrl(items[i].url);

                        var localIcon = $.jStorage.get(items[i].url);

                        if (items[i].icon == undefined) {
                            if (localIcon) {
                                items[i].icon = localIcon;
                            } else {
                                $.jStorage.set(items[i].url, icon);
                                items[i].icon = icon;
                            }
                        }

                        obj = {
                            'id': items[i].id,
                            'title': items[i].name,
                            'url': items[i].url,
                            'icon': items[i].icon
                        };
                        links.push(obj);
                    }
                }
            } catch (e) {
            }
            link = links;
        }
    } else {
        $$.each(Settings.browserLinks, function (i, v) {
            var icon = getIconForUrl(v.url);
            if (v.icon === '') v.icon = icon;
            var obj = {
                'id': i,
                'icon': v.icon,
                'title': v.title,
                'url': v.url
            };
            link.push(obj);
        });
    }

}

function geo() {
    $$.getJSON("http://www.geoplugin.net/json.gp?jsoncallback=?",
        function (data) {
            $.jStorage.set('currencyCode', data.geoplugin_currencyCode);
            $.jStorage.set('countryCode', data.geoplugin_countryCode);
            if (data.geoplugin_city == '') {
                if ($.jStorage.get('city') == undefined && $.jStorage.get('city') == null) {
                    myApp.prompt('Enter city', '', function (data) {
                        if (data == '' || data == null) {
                            geo();
                        } else {
                            $.jStorage.set('city', data);
                            weather();
                            currency();
                        }
                    }, function (data) {
                        geo();
                    });
                } else {

                    weather();
                    currency();
                }
            } else {
                $.jStorage.set('city', data.geoplugin_city);
                weather();
                currency();
            }
        });
}

function getAltTemp(unit, temp) {
    if (unit === 'f') {
        return Math.round((5.0 / 9.0) * (temp - 32.0));
    } else {
        return Math.round((9.0 / 5.0) * temp + 32.0);
    }
}

function weather() {
    var location = $.jStorage.get('city');
    var woeid = $.jStorage.get('countryCode');
    var now = new Date(),
        weatherUrl = 'https://query.yahooapis.com/v1/public/yql?format=json&rnd=' + now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() + '&diagnostics=true&callback=?&q=';
    if (location !== '') {
        weatherUrl += 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '")';
    } else if (woeid !== '') {
        weatherUrl += 'select * from weather.forecast where woeid=' + woeid + ' and u="f"';
    }
    $$.getJSON(encodeURI(weatherUrl), function (data) {
        if (data !== null && data.query !== null && data.query.results !== null && data.query.results.channel.description !== 'Yahoo! Weather Error') {
            var result = data.query.results.channel,
                weather = {},
                forecast, compass = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'],
                image404 = "https://s.yimg.com/os/mit/media/m/weather/images/icons/l/44d-100567.png";
            weather.title = result.item.title;
            weather.temp = result.item.condition.temp;
            weather.code = result.item.condition.code;
            weather.todayCode = result.item.forecast[0].code;
            weather.currently = result.item.condition.text;
            weather.high = result.item.forecast[0].high;
            weather.low = result.item.forecast[0].low;
            weather.text = result.item.forecast[0].text;
            weather.humidity = result.atmosphere.humidity;
            weather.pressure = result.atmosphere.pressure;
            weather.rising = result.atmosphere.rising;
            weather.visibility = result.atmosphere.visibility;
            weather.sunrise = result.astronomy.sunrise;
            weather.sunset = result.astronomy.sunset;
            weather.description = result.item.description;
            weather.city = result.location.city;
            weather.country = result.location.country;
            weather.region = result.location.region;
            weather.updated = result.item.pubDate;
            weather.link = result.item.link;
            weather.units = {
                temp: result.units.temperature,
                distance: result.units.distance,
                pressure: result.units.pressure,
                speed: result.units.speed
            };
            weather.wind = {
                chill: result.wind.chill,
                direction: compass[Math.round(result.wind.direction / 22.5)],
                speed: result.wind.speed
            };
            if (result.item.condition.temp < 80 && result.atmosphere.humidity < 40) {
                weather.heatindex = -42.379 + 2.04901523 * result.item.condition.temp + 10.14333127 * result.atmosphere.humidity - 0.22475541 * result.item.condition.temp * result.atmosphere.humidity - 6.83783 * (Math.pow(10, -3)) * (Math.pow(result.item.condition.temp, 2)) - 5.481717 * (Math.pow(10, -2)) * (Math.pow(result.atmosphere.humidity, 2)) + 1.22874 * (Math.pow(10, -3)) * (Math.pow(result.item.condition.temp, 2)) * result.atmosphere.humidity + 8.5282 * (Math.pow(10, -4)) * result.item.condition.temp * (Math.pow(result.atmosphere.humidity, 2)) - 1.99 * (Math.pow(10, -6)) * (Math.pow(result.item.condition.temp, 2)) * (Math.pow(result.atmosphere.humidity, 2));
            } else {
                weather.heatindex = result.item.condition.temp;
            }
            if (result.item.condition.code == "3200") {
                weather.thumbnail = image404;
                weather.image = image404;
            } else {
                weather.thumbnail = "https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/" + result.item.condition.code + "ds.png";
                weather.image = "https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/" + result.item.condition.code + "d.png";
            }
            weather.alt = {
                temp: getAltTemp('f', result.item.condition.temp),
                high: getAltTemp('f', result.item.forecast[0].high),
                low: getAltTemp('f', result.item.forecast[0].low)
            };
            weather.alt.unit = 'c';

            weather.forecast = [];
            for (var i = 0; i < result.item.forecast.length; i++) {
                forecast = result.item.forecast[i];
                forecast.alt = {
                    high: getAltTemp('f', result.item.forecast[i].high),
                    low: getAltTemp('f', result.item.forecast[i].low)
                };

                if (result.item.forecast[i].code == "3200") {
                    forecast.thumbnail = image404;
                    forecast.image = image404;
                } else {
                    forecast.thumbnail = "https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/" + result.item.forecast[i].code + "ds.png";
                    forecast.image = "https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/" + result.item.forecast[i].code + "d.png";
                }

                weather.forecast.push(forecast);
            }
            var gr = $.jStorage.get('wea_gr');
            if (gr == null) $.jStorage.set('wea_gr', 'fr');

            if ($.jStorage.get('wea_gr') == 'fr') {
                $$('.fr').addClass('active-number');
                $$('.fahrenheit').addClass('active-select-f-c');
            } else {
                $$('.cl').addClass('active-number');
                $$('.celsius').addClass('active-select-f-c');
            }
            $$('#weather').attr('data-src', weather.link);
            $$('#weather').find('.image-weather').attr('src', weather.image);
            var c = (weather.temp - 32) * 5 / 9;
            $$('#weather').find('.number').find('.fr').html(weather.temp + '&deg;');
            $$('#weather').find('.number').find('.cl').html(Math.floor(c) + '&deg;');
            $$('#weather').find('.result-text').html(weather.currently);
        } else {
            $.jStorage.deleteKey('city');
            geo();
        }
    });
}

function currency() {
    var conCode = $.jStorage.get('currencyCode');
    var dollar_c = 'USD';
    var euro_c = 'EUR';
    if (conCode == 'USD') {
        dollar_c = 'JPY';
        $$('#dollar').find('.col-20').html('&#165;');
    }
    if (conCode == 'EUR') {
        dollar_c = 'RUB';
        $$('#euro').find('.col-20').html('&#8381;');
    }

    var url_d = 'http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.xchange where pair in ("' + dollar_c + '' + conCode + '")&format=json&env=store://datatables.org/alltableswithkeys&callback=';
    $$.getJSON(encodeURI(url_d), function (data) {
        var rate = data.query.results.rate;
        $$('.d-1').html('Ask: ' + rate.Ask);
        $$('.d-2').html('Bid: ' + rate.Bid);
        $$('.main_d').html(rate.Rate);
    });

    var url_e = 'http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.xchange where pair in ("' + euro_c + '' + conCode + '")&format=json&env=store://datatables.org/alltableswithkeys&callback=';
    $$.getJSON(encodeURI(url_e), function (data) {
        var rate = data.query.results.rate;
        $$('.e-1').html('Ask: ' + rate.Ask);
        $$('.e-2').html('Bid: ' + rate.Bid);
        $$('.main_e').html(rate.Rate);
    });
}

function loadNews() {
    var url = "https://api.nytimes.com/svc/topstories/v2/home.json";
    url += '?' + $$.param({
            'api-key': apiKeyNS
        });
    var all = "https://api.nytimes.com/svc/news/v3/content/all/all.json";
    all += '?' + $$.param({
            'api-key': apiKeyNS
        });
    var a = 0;
    $$('#news').append('<h4 style="margin: 0; margin-bottom: 10px; margin-left: 10px;">LATEST NEWS</h4>');
    $$.ajax({
        url: url,
        success: function (data) {
            var json = JSON.parse(data);
            if (json.status === 'OK' && json.num_results > 0) {
                $$.each(json.results, function (i, v) {
                    if (v.multimedia.length > 0) {
                        if (a <= 0) {
                            var title = v.title;
                            var url = v.short_url;
                            var img = '';
                            var description = v.abstract;

                            if (!v.multimedia[1]) {
                                img = v.multimedia[2].url;
                            } else {
                                img = v.multimedia[1].url;
                            }
                            $$('#news').append(
                                '<div data-id="' + i + '" class="block-news col-100">'+
                            '<div class="img-news" style="float: left; text-align: left; width: 25%; margin-right: 22px;">'+
                            '<img style="border-radius: 50%;" src="' + img + '" />'+
                            '</div>'+
                            '<div class="content-news">'+
                            '<div class="title-news">'+title.substr(0, 18)+'...</div>'+
                            '<div class="description-news">'+ description.substr(0, 60) +'</div>'+
                            '</div>'+
                            '</div>'
                            );

                            a++;
                        }
                    }
                });
                $$('#news').append('<a href="news.html" style="position: absolute; bottom: -20px; right: 0; font-size: 1m; text-transform: lowercase; color: silver;" class="button">Show more ></a>');
            }
        }
    });
}

function loadImages(page, frm) {
    var pages = '';
    var a = 1;
    if (page) pages = page;
    $$('#images').append('<h4 style="margin: 0; margin-bottom: 10px; margin-left: 10px;">LATEST PICTURES</h4>');
    $$.getJSON("https://www.reddit.com/r/funny.json?after=" + pages, function (data) {
        $$.each(
            data.data.children,
            function (i, post) {
                var ext = post.data.url.split('.').pop();
                if (/png/i.test(ext) || /jpg/i.test(ext)) {
                    if (frm === 'index') {
                        if (a < 2) {
                            $$('#images').append(
                                '<div data-id="' + a + '" class="block-news col-100">'+
                                '<div class="img-news" style="width:30%;float: left;margin-right: 15px;">'+
                                    '<img src="' + post.data.url + '" />'+
                                '</div>'+
                                '<div class="content-news" style="height: 116px; display: flex; align-items: center; text-align: center; justify-content: center;">'+
                                    '<div class="title-news">'+ post.data.title +'</div>'+
                                '</div>'+
                                '</div>'
                            );
                            a++;
                        }

                    }
                }
            }
        );
        var h = $$('#images').find('.img-news').height();
        $$('#images').find('.content-news').css({height: h + 'px'});
        $$('#images').append('<a href="images.html" style="position: absolute; bottom: -20px; right: 0; font-size: 1em; text-transform: lowercase; color: silver;" class="button">Show more ></a>');
    });

}

function resizeLink() {
    var h = $$('.images-link').parent().parent().height();
    var h_ = $$('.images-link').height() + 6;
    var w = $$('.images-link').width();
    var element = $$('.custom-img');
    for (var i = 0; i < element.length; i++) {
        $$(element[i]).css({height: h_ + 'px', width: w + 'px'});
        $$(element[i]).find('p').css({lineHeight: h_ + 'px'});
        $$(element[i]).parent().parent().css({height: h + 'px'});
    }
}

function loadLink() {
    $$.each(link, function (i, v) {
        var div = '';
        if(v.icon.indexOf('custom')+1) div = '<div class="charAt-title">'+v.title.charAt(0)+'</div>';
        if (i <= 7) {
            $$('.link').append(
            '<a href="'+v.url+'" target="_blank" class="col-25 tablet-20 center external block-site">'+
            '<div class="content-link-'+v.id+'" data-id="'+v.id+'" style="position: relative;">'+
            '<img src="./'+v.icon+'" class="images-link" style="max-width: 100%;"/>'+div+'</div> ' +
            '<p class="content-text-'+v.id+'">'+v.title+'</p></a>'
            );
        }
    });
    if(link.length >= 8){
        $$('.link').append('<a href="link.html" style="position: absolute; bottom: -5px; right: 0; font-size: 1em; text-transform: lowercase; color: silver;" class="button">Show more ></a>');
    } else {
        $$('.link').append('<a class="col-25 tablet-20 center external block-site content-add-link"> ' +
            '<div data-id="#" style="position: relative;">'+
            '<i class="material-icons add-link">&#xE146;</i>'+
            '</div> <p>Add link</p></a>');
    }
}

function loadHistory(link) {
    var items = [];
    var history = JSON.parse(link);
    parent.location.hash = '';
    if (history.history.length == 0) {
        $$('[data-page="index"]').find('.virtual-list').html('<h2 style="text-align: center;width: 100%;">No history yet</h2>')
    } else {
        history.history.reverse();
        for (var i = 0; i < history.history.length; i++) {

            console.log('------------------------------------------');
            console.log(history.history[i].title.length);
            console.log(history.history[i].title.length > 20);
            console.log(history.history[i].title);
            console.log((history.history[i].title.length > 20)? history.history[i].title.substr(0,history.history[i].title.length - 7)+'...' : history.history[i].title);
            console.log('------------------------------------------');
            items.push({
                images: 'http://www.google.com/s2/favicons?domain_url=' + history.history[i].url,
                title: (history.history[i].title.length > 30)? history.history[i].title.substr(0,25)+'...' : history.history[i].title ,
                date: history.history[i].date,
                url: history.history[i].url,
                id:history.history[i]._id
            });
        }

        var virtualList = myApp.virtualList($$('[data-page="index"]').find('.virtual-list'), {
            items: items,
            template: '<li class="history-{{id}}">' +
            '<a href="{{url}}" style="position: relative; top: 0;    width: 90%;" class="item-link external item-content">' +
            '<img src="{{images}}"/>' +
            '<a href="{{url}}" class="external" style="position: absolute; top: 12px; left: 50px;">{{title}}</a>' +
            '<i class="material-icons delete-history" style="position: absolute; right: 5px; top: 13px; color: #949494; font-size: 1.4em;    z-index: 124124124;" onclick="removeHistoryItem(this)" data-id="{{id}}">&#xE14C;</i></a>' +
            '</li>',
            height: 20,
        });
    }

}

function removeHistoryItem(elem){
    var id = $$(elem).dataset().id;
    $$('.history-'+id).remove();

    if($$('[data-page="index"]').find('.virtual-list').find('li').length == 0)$$('[data-page="index"]').find('.virtual-list').html('<h2 style="text-align: center;width: 100%;">No history yet</h2>')

    if ('AppsgeyserJSInterface' in window) AppsgeyserJSInterface.removeHistoryItem(id);
}
function redditImages(pages) {
    $$.getJSON("https://www.reddit.com/r/funny.json?after=" + pages, function (data) {
        $$.each(
            data.data.children,
            function (i, post) {
                var ext = post.data.url.split('.').pop();
                if (/png/i.test(ext) || /jpg/i.test(ext)) {
                    $$('#page-images').append(
                        '<div class="card demo-card-header-pic" style="width: 100%;">'+
                    '<div style="background-image:url('+post.data.url+');height: 75vw;" valign="bottom" class="card-header color-white no-border img" '+
                        'data-url="http://reddit.com/'+post.data.permalink+'" "></div>'+
                        '<div class="card-content">'+
                        '<div class="card-content-inner">'+
                        '<p>'+post.data.title+'</p>'+
                        '</div>'+
                        '</div>'+
                        '<div class="card-footer" style="padding:0;">'+
                        '<a class="external button" href="http://reddit.com/'+post.data.permalink+'" style="width: 100%;">Open</a>'+
                        '</div>'+
                        '</div>'
                    );
                }
            }
        );
        pages_reddit = data.data.after;

        $$('.img').on('click', function (event) {
            var href = $$(this).dataset('url');
            window.location.href = href.url;
        });
    });
}

function addCustomLink(){
    var url_add = $.jStorage.get('url_add');
    var title_add = $.jStorage.get('title_add');
    myApp.addLink('Add a bookmark', '', function (title, url) {
        var url_add = $.jStorage.set('url_add', url);
        var title_add = $.jStorage.set('title_add', title);
        if(url_add != '' && title_add != ''){
            var icon = getIconForUrl(url);
            var obj = {
                'id': link.length + 1,
                'icon': icon,
                'title': title,
                'url': url
            };
            var div = '';
            if (obj.icon.indexOf('custom') + 1) div = '<div class="charAt-title">' + obj.title.charAt(0) + '</div>';

            var ga = document.createElement('a');
            ga.href = obj.url;
            ga.target = '_blank';
            ga.className = 'col-25 tablet-20 center external block-site';

            ga.innerHTML = '<div data-id="' + obj.id + '" style="position: relative;">'+
            '<img src="./' + obj.icon + '" class="images-link" style="max-width: 100%;"/>'+ div +'</div> <p>' + obj.title + '</p>';

            var s = document.getElementsByClassName('content-add-link')[0];
            s.parentNode.insertBefore(ga, s);
            if ($$('[data-page="index"] .link a').length > 8){
                $$('[data-page="index"] .link a').html('<a href="link.html" style="position: absolute; bottom: -5px; right: 0; font-size: 1em; text-transform: lowercase; color: silver;" class="button">Show more ></a>');
                $$('[data-page="index"] .content-add-link').remove();
            }
            $.jStorage.deleteKey('url_add');
            $.jStorage.deleteKey('title_add');
            if ('AppsgeyserJSInterface' in window) AppsgeyserJSInterface.addToHomePage(obj.title, obj.url);

            link.push(obj);
        } else {
            addCustomLink();
        }
    }, function(){}, url_add, title_add)
}