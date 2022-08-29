/* AppsgeyserJavascriptInterface v0.1 */
if (typeof(appsgeyser) == 'undefined') appsgeyser = {};



appsgeyser =  {
    info: {
        getAppId: function() {},
        getGuid: function() {},
        getAppName: function() {},
        getAppPackageName: function() {}
    },
    data: {
        setItem: function(key, val) {},
        getItem: function(key) {}
    },
    ui: {
        showInfo: function(text) {},
        showLoadingDialog: function(text) {},
        hideLoadingDialog: function() {},
        showTabs: function() {},
        hideTabs: function() {},
        getTabUrl: function(tabId) {},
        setUrlBarVisibility: function(isVisible) {},
        shareText: function(subject,body) {},
        setMenuItemVisible: function(nameItem, enable) {},
        sharePicture: function(fileName,text) {},
        registerUpdateChecker: function(url, intervalMillis) {},
        removeUpdateChecker: function(url) {},
        clearUpdateCheckers: function() {}
    },

    web: {
        XmlHttpRequest: function() {},
        saveImage: function(base64, prefix) {}
    },

    media: {
        playYouTubeVideo : function(videoId, apiKey, startMillis, autoPlay, lightBox){}
    },

    isInApp: function(){
        return !!appsgeyser.getJSInterface();
    },

    getJSInterface: function () {
        if('AppsgeyserJSInterface' in window){
            return AppsgeyserJSInterface;
        } else if('NotificationInterface' in window){
            return NotificationInterface;
        }else {
            return null;
        }
    }

};

if(appsgeyser.isInApp()){
    appsgeyser.info.getAppId = function(){
        return appsgeyser.getJSInterface().getAppId();
    };
    appsgeyser.info.getGuid = function(){
        return appsgeyser.getJSInterface().getInstallationGuid();
    };
    appsgeyser.info.getAppName = function(){
        return appsgeyser.getJSInterface().getAppName();
    };
    appsgeyser.info.getAppPackageName = function(){
        return appsgeyser.getJSInterface().getAppPackageName();
    };

    appsgeyser.data.setItem = function(key, val){
        appsgeyser.isInApp ? localStorage[key] = JSON.stringify(val) : appsgeyser.getJSInterface().setItem(key, JSON.stringify(val));
    };
    appsgeyser.data.getItem = function(key){
        return appsgeyser.isInApp ? JSON.parse(localStorage[key]) : JSON.parse(appsgeyser.getJSInterface().getItem(key));
    };

    appsgeyser.ui.showInfo = function(text){
        return appsgeyser.getJSInterface().showInfo(text)
    };
    appsgeyser.ui.showLoadingDialog = function(text){
        return appsgeyser.getJSInterface().showLoadingDialog(text);
    };
    appsgeyser.ui.hideLoadingDialog = function(){
        return appsgeyser.getJSInterface().hideLoadingDialog();
    };
    appsgeyser.ui.showTabs = function(){
        return appsgeyser.getJSInterface().showTabs();
    };
    appsgeyser.ui.hideTabs = function(){
        return appsgeyser.getJSInterface().hideTabs();
    };
    appsgeyser.ui.getTabUrl = function(tabId){
        return appsgeyser.getJSInterface().getTabUrl(tabId);
    };
    appsgeyser.ui.setUrlBarVisibility = function(isVisible){
        return appsgeyser.getJSInterface().setUrlBarVisibility(isVisible);
    };
    appsgeyser.ui.shareText = function(subject,body){
        return appsgeyser.getJSInterface().shareText(subject,body);
    };
    appsgeyser.ui.setMenuItemVisible = function(nameItem, enable){
        return appsgeyser.getJSInterface().setMenuItemVisible(nameItem, enable);
    };
    appsgeyser.ui.sharePicture = function(fileName,text){
        return appsgeyser.getJSInterface().shareText(fileName,text);
    };
    appsgeyser.ui.registerUpdateChecker = function(url, intervalMillis){
        return appsgeyser.getJSInterface().registerUpdateChecker(url, intervalMillis);
    };
    appsgeyser.ui.removeUpdateChecker = function(url){
        return appsgeyser.getJSInterface().removeUpdateChecker(url);
    };
    appsgeyser.ui.clearUpdateCheckers = function(){
        return appsgeyser.getJSInterface().clearUpdateCheckers();
    };

    appsgeyser.web.saveImage = function(base64, prefix){
        return appsgeyser.getJSInterface().saveImageFromBase64(base64, prefix);
    };

    appsgeyser.web.XmlHttpRequest = function() {
        this.method = 'get';
            this.url = "";
            this.async = true;
            this.asyncCallback = null;
            this.readyState = 0;
            this.status = null;
            this.responseText = "";

            this.open = function(method, url, async){
                this.method = method;//TODO: method and status support
                this.url = url;
                this.async = async;
                this.readyState = 0;
                this.status = null;
                this.responseText = "";
            };
            this.generateCallbackName = function(){
                this.asyncCallback = "asyncCallback" + (Math.round(Math.random()*10000000000000000));
                return this.asyncCallback;
            };
            this.sendAsync = function(body){
                var that = this;
                var callback = this.generateCallbackName();
                window[callback] = function(response){
                    that.responseText = response;
                    that.readyState = 4;
                    if(that.responseText.length > 0){
                        that.status = 200;
                    } else {
                        that.status = 400;
                    }
                    if(typeof that.onreadystatechange == 'function') that.onreadystatechange();
                    if(that.status == 200){
                        if(typeof that.onload == 'function') that.onload();
                    } else {
                        if(typeof that.onerror == 'function') that.onerror();
                    }
                };

                AppsgeyserJSInterface.sendXMLHTTPRequest(this.url, callback);
            };
            this.send =function(body){
                if(this.async){
                    this.sendAsync(body);
                } else {
                    throw "Unsupported";
                    this.sendSync(body);
                }
            };
            this.setRequestHeader = function(){
                //TODO: unsupported
            };
            this.abort = function(){
                //TODO: unsupported
            };
            this.getAllResponseHeaders = function(){
                //TODO: unsupported
            };
    };

    appsgeyser.media.playYouTubeVideo = function(videoId, apiKey, startMillis, autoPlay, lightBox){
        apiKey = 'AIzaSyAKWXtTS0zn_07Vo1FrRrgvIXuWr4x-20o';
        var res = getJSInterface().playYouTubeVideo(videoId, apiKey, startMillis, autoPlay, lightBox);
        if(!res){
            window.location = "https://www.youtube.com/watch?v=" + videoId;
        }
    }

} else {
    appsgeyser.web.XmlHttpRequest = function () {
        this.xhr = new XMLHttpRequest();
        var that = this;

        this.xhr.onreadystatechange = function(){
            if (typeof that.onreadystatechange == 'function') that.onreadystatechange();
        };

        this.xhr.onload = function(){
            if (typeof that.onload == 'function') that.onload();
        };

        this.xhr.onerror = function(){
            if (typeof that.onerror == 'function') that.onerror();
        };

        this.open = function (method, url, async) {
            url = "https://www.appsgeyser.com/parseUrl/proxy.php?q=" + encodeURIComponent(url);
            this.xhr.open(method, url, async)
        };

        this.send = function (body) {
            this.xhr.send(body);
        };
        this.setRequestHeader = function () {
            //TODO: unsupported
        };
        this.abort = function(){
            //TODO: unsupported
        };
        this.getAllResponseHeaders = function () {
            //TODO: unsupported
        };

        appsgeyser.media.playYouTubeVideo = function(videoId, apiKey, startMillis, autoPlay, lightBox){
            window.location = "https://www.youtube.com/watch?v=" + videoId;
        }
    };
}