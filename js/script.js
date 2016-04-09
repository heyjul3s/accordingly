// isObject  : ( obj ) => ( obj === Object(obj) ),
// isExists  : ( el )  => ( el && ( typeof el !== 'undefined') ),
// isString  : ( val ) => ( Object.prototype.toString.call(val) === '[object String]' );
// isNumber  : ( val ) => ( !isNaN(parseFloat(data)) && isFinite(data) ),
// isBoolean : ( val ) => ( typeof val === 'string' || val instanceof String )

(function(){
    'use strict';

    document.addEventListener('DOMContentLoaded', function(){
        var acc = Accordion();
        acc.init();
    });


    function Accordion() {

        let accordion       = document.querySelector('.accordion-container'),
            thisAccordion   = document.querySelector('.accordion'),
            panelHeader     = document.querySelector('.accordion-header'),
            panel           = document.querySelector('.accordion-panel-content'),
            accordionPanels = document.querySelectorAll('.accordion-body'),
            panelContent    = panelHeader.nextElementSibling,
            height          = {},
            isOpen          = false;


        function init() {
            initialPanelHandler( getHeight(document.querySelectorAll('.accordion-panel-content')) );

            accordion.addEventListener('click', function(ev){
                ev.preventDefault();
            });
        }


        function openThisPanel(el) {
            if ( !isOpen ) {
                addRemoveClass(el);
            }

            isOpen = !isOpen;
        }


        function hidePanels() {
            let accordionPanels = document.querySelectorAll('.accordion-body');

            for (var item in accordionPanels) {
                if ( accordionPanels.hasOwnProperty(item) ) {
                    accordionPanels[item].style.cssText = 'height: 0; display: none;';
                }
            }
        }


        function addRemoveClass(el) {
            return el.classList.contains('panel-is-open') ? el.classList.remove('panel-is-open') : el.classList.add('panel-is-open');
        }


        function setHeight(el, height) {
            el.style.cssText = 'height:' + height + 'px;';
        }


        function getPanel(ev) {
            let target = ev.target;
            target.querySelector(panel);
        }

        function isMatchKeyHeight() {
        }


        /** initialPanelHandler
         *  Promise handler that triggers hidePanels function
         *  @param  {[object]} heights  : argument of array type with object heights information
         *  @return {[type]}           : broken dreams
         */
        function initialPanelHandler(heights) {

            var promise = new Promise(function(resolve, reject){
                // TODO: check type and check if empty
                if ( heights === Object(heights ) ) {
                    resolve(heights);
                } else {
                    reject(heights);
                }
            });

            promise.then(function(){
                hidePanels();
    		}).catch(function(){
                console.log('did not work');
    		});

        }


        /** getHeight
         *  Get heights of all panels and store in heightsList config array
         *  @param  {[object]} el        : panel elements
         *  @param  {[string]} panelKey  : string for identification of panels which is to be used as object key in heightsList config
         *  @return {[object]}            : returns array with panel key and value objects
         */
        function getHeight(el, panelKey) {

            if ( el === Object(el) ) {

                Object.keys(el).forEach(function (key) {

                    if ( elemIsVisible(el[key]) ) {

                        let stuff   = el[key],
                            objKey  = stuff.classList[1], //TODO : pattern match for key values? if not, just trim argument string
                            value   = stuff.clientHeight;

                        height[objKey] = value;
                    }

                });

            }

            return height;
        }


        //borrowed from jQuery
        function elemIsVisible(el) {
            return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
        }



        return Object.freeze({
            init : init
        });
    }

}());
