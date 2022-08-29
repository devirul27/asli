Framework7.prototype.plugins.upscroller = function (app, params) {
    'use strict';
    params = params || {text: 'Go up'};
    //Export selectors engine
    var $$ = window.Dom7;

    return {
        hooks: {
            pageBeforeInit: function (pageData) {
                var $$btn = $$('<div class="upscroller">' + params.text + '</div>');
                $$(pageData.container).prepend($$btn);

                $$btn.click(function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    var curpage = $$(".page-content", mainView.activePage.container);
                    $$(curpage).scrollTop(0, Math.round($$(curpage).scrollTop() / 4));
                });

                $$(".page-content", pageData.container).scroll(function (event) {

                    var e = $$(event.target).scrollTop();
                    var curpage = $$(".page-content", mainView.activePage.container);
                    var h = $$(curpage).find('.virtual-list').height() - 800;
                    if (e > 600) {
                        $$btn.addClass('show');
                        if(h <= e){
                            $$btn.removeClass('show');
                        }
                    } else {
                        $$btn.removeClass('show');
                    }

                });
            }
        }
    };
};