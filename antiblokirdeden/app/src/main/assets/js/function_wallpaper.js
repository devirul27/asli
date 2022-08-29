var keyPixabay = [
    '1397207-d550dc8c67bf974e5968b96c5',
    '2615681-ff1d81320c942a7e76784b36e',
    '2615690-2fe0d0b1ca7f16011c6b6f2cc',
    '2615698-b75fae69e32b5a3eba691d90c',
    '2615706-01660c63300800eb44717fba3',
    '2615714-231d9166bbb8914ce03f78fcf',
    '2615718-f107bbcfe4cff87b548d6e466',
    '2615720-a7ae0401c229ab7ed6f4269a5'
];
function getPastTime() {
    var localTime = $.jStorage.get("past_time");
    var time;
    var today;
    if (!localTime) {
        today = new Date();
        time = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()).getTime();

        localTime = time;
        $.jStorage.set("past_time", localTime);
    }
    return localTime;
}
function checkDateTimestamp(current_time, past_time) {
    if (current_time - past_time >= 86400000 || current_time - past_time <= -86400000) return true;
    return false;
}
function setCategoryLocalStorage(cat) {
    $$.each(cat[1], function (i, v) {
        if (v[0].indexOf('custom') + 1) {
            addImagesInLocalStorage('custom', v);
        } else {
            addImagesInLocalStorage('api', v[1]);
        }
    });
}
function addImagesInLocalStorage(type, category) {
    var today = new Date();
    var time = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()).getTime();
    $.jStorage.set("past_time", time);
    if (type == 'custom') {
        var arrayElement = [];
        $$.each(category[2], function (i, v) {
            $$.each(v, function (a, d) {
                var thm_url = d.thumb;
                var path_url = d.path;
                var tags = '';
                arrayElement.push({thm_url: thm_url, path_url: path_url, tags: tags});
            });
            $.jStorage.set(category[1].replace(/\s/ig, '-') + '_custom', JSON.stringify(arrayElement));
        });
    } else {
        initApi(category);
    }
}
function initApi(category) {
    var key = keyPixabay[Math.floor(Math.random() * keyPixabay.length)];
    $$.ajax({
        url: 'https://pixabay.com/api/?key=' + key + '&q=' + category + '&image_type=photo&per_page=200',
        statusCode: {
            495: function (xhr) {
                console.log(xhr);
            },
            200: function (data) {
                console.log(data);
                var array = JSON.parse(data.response).hits;
                var arrayElement = [];
                $$.each(array, function (i, v) {
                    var thm_url = v.previewURL;
                    var path_url = v.webformatURL;
                    var tags = v.tags;
                    arrayElement.push({thm_url: thm_url, path_url: path_url, tags: tags});
                });
                $.jStorage.set(category + '_api', JSON.stringify(arrayElement));
            }
        }
    })
}
/**
 * Set wallpaper
 */
function popoverHtml(photo) {
    var count_photo = $$('.photo-browser-current').html() - 1;
    console.log(JSON.parse($$('#json_photo').html())[count_photo]);
    var object = JSON.parse($$('#json_photo').html())[count_photo];
    myApp.confirm('Set as wallpaper?', [''], function () {
        setWallpaper(object.url);
    });
}
function setWallpaper(url) {
    try {
        var urls;
        if( url.indexOf('uploaded_data')+1 > 0){
            var a = new Image();
            a.src = url;
            urls = a.src;
        }
        else { urls = url; }
        console.log(urls);
        AppsgeyserJSInterface.setWallpaper(urls);
        myApp.alert('Wallpaper was changed!', ['']);
    }
    catch (e) {
        myApp.alert('Wallpaper was not changed!', ['']);
    }
}
function checkAndMergeArray() {
    var api = [];
    var custom = [];
    var error_api = '';

    var type_error = '';
    var type_error_api = '';

    var menu_category_api = [];
    var menu_category_custom = [];
    // check api albums
    $$.each(Settings.categoryApiAlbum, function (i, v) {
        if (v.topic !== '') {
            if(Settings.tabs1 == 'tabApiAlbum'){
                if(v.topic !== Settings.categoryApiAlbum[0].topic){
                    api.push(v.topic);
                    menu_category_api.push([v.topic + '_api', v.topic]);
                }
            } else {
                api.push(v.topic);
                menu_category_api.push([v.topic + '_api', v.topic]);
            }
        }
        else {
            if (Settings.tabs1 == 'tabApiAlbum') type_error_api = 'API';error_api = 'Error: enter album topic';
        }
    });

    // check custom album
    $$.each(Settings.customAlbums, function (i, v) {
        if (v.nameAlbum !== '') {
            if (v.imgAlbum.length !== 0) {
                if(Settings.tabs1 == 'tabCustomAlbum'){
                    if(v.nameAlbum !== Settings.customAlbums[0].nameAlbum){
                        custom.push(v.nameAlbum);
                        menu_category_custom.push([v.nameAlbum + '_custom', v.nameAlbum, v]);
                    }
                } else {
                    custom.push(v.nameAlbum);
                    menu_category_custom.push([v.nameAlbum + '_custom', v.nameAlbum, v]);
                }
            }
            else {
                type_error = 'custom';
                error = 'Error: add images in ' + v.nameAlbum + ' album';
            }
        } else {
            type_error = 'custom';
            error = 'Error: enter album name';
        }
    });

    if(Settings.tabs1 == 'tabApiAlbum'){
        if(type_error_api == 'API'){
            return error_api;
        } else {
            if (api.length > 0 && custom.length > 0) {
                return clearBanedCategory([custom.concat(api), menu_category_custom.concat(menu_category_api)]);
            }
            else {
                if (api.length > 0) {
                    return clearBanedCategory([api, menu_category_api]);
                }
                else {
                    return clearBanedCategory([custom, menu_category_custom]);
                }
            }
        }
    } else {
        if(type_error == 'custom'){
            return error;
        } else {
            if (api.length > 0 && custom.length > 0) {
                return clearBanedCategory([custom.concat(api), menu_category_custom.concat(menu_category_api)]);
            }
            else {
                if (api.length > 0) {
                    return clearBanedCategory([api, menu_category_api]);
                }
                else {
                    return clearBanedCategory([custom, menu_category_custom]);
                }
            }
        }
    }
}
function clearBanedCategory(array) {
    var elem = array[1];
    $$.each(JSON.parse(localStorage.getItem('ban_category')), function (a, d) {
        $$.each(elem, function (i, v) {
            if (v[0] == d.topic) {
                elem.splice(i, 1);
            }
        });
    });
    return array;
}
function initMainAlbums() {
    var type = Settings.tabs1;
    var arrayElement = [];
    if (type == 'tabCustomAlbum') {
        $$.each(Settings.customAlbums[0].imgAlbum, function (i, v) {
            var path_url = v.path;
            var thm_url = v.thumb;
            var tags = '';
            arrayElement.push({thm_url: thm_url, url: path_url, caption: tags});
        });
        $.jStorage.set(Settings.customAlbums[0].nameAlbum, JSON.stringify(arrayElement));
        return [
            Settings.customAlbums[0].nameAlbum,
            arrayElement
        ];
    } else {
        return false;
    }
}

function getCategoryAlbum(category) {
    var re = /.*_/;
    var m;

    if ((m = re.exec(category)) !== null) {
        if (m.index === re.lastIndex) re.lastIndex++;
    }

    return m[0].slice(0, -1).replace(/\_/ig, ' ');
}
function getTypeAlbum(category) {
    var re = /_.*/;
    var m;

    if ((m = re.exec(category)) !== null) {
        if (m.index === re.lastIndex) re.lastIndex++;
    }

    return m[0].slice(1);
}
function getFavoritePhoto() {
    return $.jStorage.get('favorite');
}
function loadFavorite() {
    var category = 'Favorite';
    var json = getFavoritePhoto();
    var photo = [];
    $$('.favorite-title').html('Favorite');
    $$('.favorite').addClass('main-category-' + category.replace(/\s/ig, '-'));
    if (json) {
        $$.each(json, function (i, v) {photo.push({index: i, url: v.path_url, thm_url: v.thm_url, caption: v.tags});});
        window.photoBrowserStandalone = myApp.photoBrowser({photos: photo, lazyLoading: true, lazyLoadingInPrevNext: true, lazyLoadingOnTransitionStart: true, theme: 'dark'});
        $$.each(photo, function (i, v) {
            $$('.favorite').append('<li class="item-content"><div class="item-media open-img" data-id="' + v.index + '"><img data-id="' + v.index + '" src="' + v.thm_url + '"></div></li>');
        });
        $$('.open-img').on('click', function () {
            var id = $$(this).data('id');
            photoBrowserStandalone.open(id);
        });
    } else {
        $$('.favorite').html('<h2 class="not-favorite">Tap <i class="material-icons" style="    font-size: 1.4em;position: relative;top: 7px;width: 32px;">star_rate</i> to add image to favorites </h2>');
    }
}
function loadImages(category, element) {
    var photo = [];
    $$('.photo-images').attr('class','list-block virtual-list list-images photo-images main-category-' + category.replace(/\s/ig, '-')).find('li').remove();
    $$('.name_category').html(category.replace(/\-/ig, ' '));
    var json = JSON.parse(element);

    $$.each(json, function (i, v) {
        photo.push({index: i, url: v.path_url, thm_url: v.thm_url, caption: v.tags});
    });
    window.photoBrowserStandalone = myApp.photoBrowser({
        photos: photo,
        lazyLoading: true,
        lazyLoadingInPrevNext: true,
        lazyLoadingOnTransitionStart: true,
        theme: 'dark'
    });

    $$.each(photo, function (i, v) {
        $$('.main-category-' + category.replace(/\s/ig, '-')).append('' +
            '<li class="item-content"><div class="item-media open-img" data-id="' + v.index + '"><img data-id="' + v.index + '" src="' + v.thm_url + '"></div></li>' +
            '');
    });
    $$('.open-img').on('click', function () {
        var id = $$(this).data('id');
        photoBrowserStandalone.open(id);
    });
}

function restoreCategory(){
    myApp.confirm('Restore category ?', [''], function () {
        if(localStorage.getItem('ban_category')){
            localStorage.removeItem('ban_category');
            myApp.alert('Categories successfully restored!', ['']);
        } else {
            myApp.alert('You have no deleted category!', ['']);
        }
    });
}
function removeFavorites(){
    myApp.confirm('Remove favorites ?', [''], function () {
        if($.jStorage.get('favorite')){
            $.jStorage.deleteKey('favorite');
            myApp.alert('Favorites successfully removed!', ['']);

        } else {
            myApp.alert('You have no favorite photos!', ['']);
        }
    });
}
function removeTutorial(){
    myApp.confirm('Show tutorial ?', [''], function () {
        if($.jStorage.get('tutorial')){
            $.jStorage.deleteKey('tutorial');
            window.location = './index.html';
        } else {
            myApp.alert('Error', ['']);
        }
    });
}
function loadSettings(){
    $$('.settings-title').html('Settings');
    $$('.settings').html('' +
        '<div class="list-block media-list" style="margin-top: -32px !important;">' +
        '<ul>' +
        '<li><a href="#" onclick="restoreCategory()" class="item-link item-content" style="width: 95% !Important;height: 80px !important; padding-left: 15px !Important;"><div class="item-inner">' +
        '<div class="item-title"><div class="item-title">Restore categories</div></div>' +
        '<div class="item-text">Restore deleted category</div></div></a></li>' +
        '' +
        '<li><a href="#" onclick="removeFavorites()" id="remove-favorites" class="item-link item-content" style="width: 95% !Important;height: 80px !important; padding-left: 15px !Important;"><div class="item-inner">' +
        '<div class="item-title"><div class="item-title">Remove favorites</div></div>' +
        '<div class="item-text">Remove your favorite photos</div></div></a></li>' +
        '' +
        '<li>' +
        '<li><a href="#" onclick="removeTutorial()" id="remove-favorites" class="item-link item-content" style="width: 95% !Important;height: 60px !important; padding-left: 15px !Important;"><div class="item-inner">' +
        '<div class="item-title" style="line-height: 29px;"><div class="item-title">Show tutorial</div></div>' +
        '<div class="item-text"></div></div></a></li>' +
        '' +
        '<li>' +
        '<div style="    width: 100px;text-align: center;margin: 0 auto;"><a href="https://pixabay.com/" class="extrenal" target="_blank" style="margin:5px 15px 5px 0;font-size:13px;line-height:1.4;color:#777;display:block;' +
        'float:left;padding:8px 12px 10px;border:1px solid #ccc">powered by ' +
        '<i style="display:block;width:68px;height:18px;overflow:hidden"><img src="https://pixabay.com/static/img/logo.svg" style="width:92px"></i></a></div>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '');
}
function getAlbumFromSettings(category, hash){
    var arrayElement = [];
    $$.each(Settings.customAlbums, function (d, a) {
       if(a.nameAlbum == category){
           $$.each(a.imgAlbum, function (i, v) {
               var path_url = v.path;
               var thm_url = v.thumb;
               var tags = '';
               arrayElement.push({thm_url: thm_url, path_url: path_url, tags: tags});
           });
       }
    });
    return JSON.stringify(arrayElement);
}
function loadCategory(category, type, hash) {
    var element = $.jStorage.get(category.replace(/\s/ig, '-') + '_' + type);
    var photo = [];
    $$('.name_category').html(category.replace(/\-/ig, ' '));
    if (element) {
        loadImages(category, element);
    } else {
        if (type == 'custom') {
            element = getAlbumFromSettings(category, hash);
            loadImages(category, element);
        } else {
            var key = keyPixabay[Math.floor(Math.random() * keyPixabay.length)];
            $$.ajax({
                url: 'https://pixabay.com/api/?key=' + key + '&q=' + encodeURI(category) + '&image_type=photo&per_page=200',
                statusCode: {
                    495: function (xhr) {
                        console.log(xhr);
                    },
                    200: function (data) {
                        var array = JSON.parse(data.response).hits;
                        var arrayElement = [];
                        if (array.length > 0) {
                            $$.each(array, function (i, v) {
                                var thm_url = v.previewURL;
                                var path_url = v.webformatURL;
                                var tags = v.tags;
                                arrayElement.push({thm_url: thm_url, path_url: path_url, tags: tags});
                            });
                            $.jStorage.set(category.replace(/\s/ig, '-') + '_api', JSON.stringify(arrayElement));
                            loadImages(category, JSON.stringify(arrayElement));
                        } else {
                            $$('.name_category').html(category.replace(/\-/ig, ' '));
                            $$('.photo-images').html('<h2 class="not-favorite">Not found "' + category.replace(/\-/ig, ' ') + '" photo</h2>');
                        }
                    }
                }
            })
        }
    }
    $$('.panel-overlay').remove();
}
function addFavorite(th) {
    var myApp = new Framework7();
    var favorite = $.jStorage.get('favorite');
    var block = $$(th).parent().parent().parent().parent();
    var url;
    var thm_url;

    $$.each(block.find('.photo-browser-slide'), function (i, v) {
        if ($$(v).hasClass('swiper-slide-active')) {
            url = $$(v).find('img').attr('src');
            thm_url = url;
        }
    });
    if (favorite) {
        var object = searchElementInObject(favorite, url);
        if (object !== undefined) {
            myApp.confirm('This image is already in Favourites. Do you want to delete it from Favourites?', [''], function () {
                favorite.splice(object, 1);
                if (favorite.length == 0) {
                    $.jStorage.set('favorite', null);
                } else {
                    $.jStorage.set('favorite', favorite);
                }
            });
        } else {
            myApp.confirm('Are you sure you want to add this image in Favourites?', [''], function () {
                favorite.push({thm_url: thm_url, path_url: url, tags: ''});
                $.jStorage.set('favorite', favorite);
            });
        }
    } else {
        myApp.confirm('Are you sure you want to add this image in Favourites?', [''], function () {
            $.jStorage.set('favorite', [{thm_url: thm_url, path_url: url, tags: ''}]);
        });
    }

}
function searchElementInObject(array, search) {
    var y;

    $$.each(array, function (i, v) {
        if (v !== null) if (v.path_url == search) y = i;
    });

    return y;
}

function clearSearch(){
    $$('.search-list ul li').remove();
    $$('.search-list').attr('class','search-list disabled');
}