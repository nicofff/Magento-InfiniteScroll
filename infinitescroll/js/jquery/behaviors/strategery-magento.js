/*
	--------------------------------
	Infinite Scroll Behavior
	Behavior for Magento
	--------------------------------
	+ https://github.com/paulirish/infinitescroll/
	+ version 2.0b2.110617
	+ Copyright 2011 Paul Irish & Luke Shumard
	+ Licensed under the MIT license
	
	+ Documentation: http://infinite-scroll.com/
	
*/
(function($){
    $(document).ready(function(){
        $.extend($.infinitescroll.prototype,{

            _setup_magento: function infscr_setup_magento () {

                var opts = this.options,
                        instance = this;

                this._binding('bind');

            },

            _loadcallback_magento: function infscr_loadcallback_magento (box,data) {

                var opts = this.options,
	    		callback = this.options.callback, // GLOBAL OBJECT FOR CALLBACK
	    		result = (opts.wasDoneLastTime) ? 'done' : (!opts.appendCallback) ? 'no-append' : 'append',
	    		frag;
                originalData=data;
                switch (result) {

                    case 'done':
                        this.options.isDone=true;
                        this._showdonemsg();
                        return false;

                        break;

                    case 'no-append':

                        if (opts.dataType == 'html') {
                            data = '<div>' + data + '</div>';
                            data = $(data).find(opts.itemSelector);
                        };

                        break;

                    case 'append':

                        var children = box.children();

                        // if it didn't return anything
                        if (children.length == 0) {
                            return this._error('end');
                        }


                        // use a documentFragment because it works when content is going into a table or UL
                        frag = document.createDocumentFragment();
                        while (box[0].firstChild) {
                            frag.appendChild(box[0].firstChild);
                        }

                        this._debug('contentSelector', $(opts.contentSelector)[0])
                        $(opts.contentSelector)[0].appendChild(frag);
                        // previously, we would pass in the new DOM element as context for the callback
                        // however we're now using a documentfragment, which doesnt havent parents or children,
                        // so the context is the contentContainer guy, and we pass in an array
                        //   of the elements collected as the first argument.

                        data = children.get();


                        break;

                }
                if ($(".i-next",originalData).length==0){ // fix for magento
                    this.options.wasDoneLastTime=true;
                }
                // loadingEnd function
                opts.loadingEnd.call($(opts.contentSelector)[0],opts)


                // smooth scroll to ease in the new content
                if (opts.animate) {
                    var scrollTo = $(window).scrollTop() + $('#infscr-loading').height() + opts.extraScrollPx + 'px';
                    $('html,body').animate({ scrollTop: scrollTo }, 800, function () { opts.isDuringAjax = false; });
                }

                if (!opts.animate) opts.isDuringAjax = false; // once the call is done, we can allow it again.

                callback.call($(opts.contentSelector)[0], data);
            }

        });
    });
})(jQuery);