// TODO: fix target bug
// TODO: click on self

(function(){
    'use strict';

    document.addEventListener('DOMContentLoaded', function(){
        let pique = Pique();
        pique.init();
    });


    function Pique() {

        const accordion       = document.querySelector('.accordion-container'),
              panelHeader     = document.querySelector('.accordion-header'),
              accordions      = [ ...document.querySelectorAll('.accordion') ],
              panels          = [ ...document.querySelectorAll('.accordion-panel-content') ];

        let height          = {};

        //transitionend prefix
        const transitionEndPrefixes = {
            'WebkitTransition' : 'webkitTransitionEnd',
               'MozTransition' : 'transitionend',
                'msTransition' : 'MSTransitionEnd',
                 'OTransition' : 'oTransitionEnd',
                  'transition' : 'transitionend'
        };

        function init() {
            let panelHeights = getHeight( panels );

            accordion.addEventListener('click', function(ev){
                ev.preventDefault();

                let target = ev.target,
                    targetAccordion = target.parentNode.parentNode,
                    targetAccordionContent = targetAccordion.querySelector('.accordion-panel-content');

                //TODO: curry
                initPanels( closeAnyOpenedPanels(), targetAccordion, findPanelHeight( getThisPanelClassList(ev), panelHeights), targetAccordionContent, 'panel-is-open' );
            });
        }


        function setContainerClass(container, classname) {
            if ( !container.classList.contains(classname) ) {
                container.classList.add(classname);
            }
        }


        function removeContainerClass(container, classname) {
            if ( container.classList.contains(classname) ) {
                container.classList.remove(classname);
            }
        }


        function initPanels(panelsReady, target, height, targetContent, classname) {

            let promise = new Promise(function(resolve, reject) {
                ( panelsReady === true ) ? resolve(panelsReady) : reject(panelsReady);
            });

            //arrow
            promise.then(function(){
                openTargetPanel( target, height, targetContent, classname );
            }).catch(function(){
                closeTargetPanel( target, height, targetContent, classname );
            });
        }


        /**
         * application of relevant classes for transitions
         * @param  {[type]}  el        [description]
         * @param  {[type]}  classname [description]
         * @param  {[type]}  height    [description]
         * @return {Boolean}           [description]
         */
        function openTargetPanel(target, height, targetContent, classname) {

            if ( !target.classList.contains(classname) ) {
                setHeight(targetContent, height);
                setTargetAccordionClass(target, classname);
                setContainerClass(accordion, 'accordion-open');
            }
        }


        function closeTargetPanel(target, height, targetContent, classname) {

            if ( target.classList.contains(classname) ) {
                resetHeight(targetContent);
                removeTargetAccordionClass(target, classname);
                removeContainerClass(accordion, 'accordion-open');
            }
        }


        function setHeight(el, height) {
            if ( !isNaN(parseFloat(height)) && isFinite(height) ) {
                el.style.cssText = 'max-height:' + height + 'px; height:' +  height + 'px';
            }
        }

        function setTargetAccordionClass(el, classname) {
            if ( (Object.prototype.toString.call( classname.trim() ) === '[object String]') && !el.classList.contains(classname)  ) {
                el.classList.add(classname);
            }
        }


        function resetHeight(el, classname) {
            el.style.cssText = 'max-height: 0; height: 0;';
        }


        function removeTargetAccordionClass(targetContent, classname) {
            if ( (Object.prototype.toString.call( classname.trim() ) === '[object String]') && targetContent.nodeType === 1) {
                targetContent.addEventListener( applyTransitionEndPrefix(targetContent), function callback(ev){

                    if ( ev.propertyName === 'height' || ev.propertyName === 'maxHeight' && targetContent.parentNode.classList.contains(classname) ) {
                        targetContent.parentNode.classList.remove(classname);
                        targetContent.removeEventListener( applyTransitionEndPrefix(targetContent), callback, false );
                    }
                });
            }
        }


        function closeAnyOpenedPanels() {

            let panelsReady = false;

            accordions.forEach(function(el){
                if ( el.classList.contains('panel-is-open') ) {
                    el.classList.remove('panel-is-open');
                }
            });

            if ( document.querySelectorAll('.panel-is-open').length === 0 ) {
                panelsReady = !panelsReady;
            }

            return panelsReady;
        }


        function applyTransitionEndPrefix( element ) {

            let transition;

            //TODO: possibly a better method to do this
            for (transition in transitionEndPrefixes) {
                if ( element.style[transition] !== undefined ) {
                    return transitionEndPrefixes[transition];
                }
            }
        }


        /**
         * find matching class and return relevant height value
         * @param  {[array]} panelClasses  : classlist acquired from target panel
         * @param  {[object]} heights      : object with name of panel and measured height
         * @return {[number]}              : number value of target panel content height
         */
        function findPanelHeight(panelClasses, heights) {
            let panelHeight;

            Object.keys(heights).forEach(function(key) {

                panelClasses.some(function(el, i){
                    if ( panelClasses.includes(key) ) {
                        panelHeight = heights[key];
                    }
                });
            });

            return panelHeight;
        }


        /**
         * get target panel classList
         * @param  {[type]]} ev
         * @return {Boolean} : an array of classes belonging to panel
         */
        function getThisPanelClassList(ev) {
            let target        = ev.target,
                targetedPanel = target.parentNode.nextElementSibling;

            return [ ...targetedPanel.classList ];
        }


        /** getHeight
         *  Get heights of all panels and store in heightsList config object
         *  @param  {[object]} el        : panel elements
         *  @param  {[string]} panelKey  : string for identification of panels which is to be used as object key in heightsList config
         *  @return {[object]}           : returns array with panel key and value objects
         */
        function getHeight(el, panelKey) {

            if ( (el === Object(el)) && (!Array.isArray(el)) ) {

                Object.keys(el).forEach(function (key) {
                    if ( elemIsVisible(el[key]) ) {
                        let panel             = el[key],
                            panelBoundingRect = panel.getBoundingClientRect(),
                            objKey            = Array.from(panel.classList).slice(-1)[0],
                            value             = panelBoundingRect.height;

                        height[objKey] = value;
                    }
                });
            }

            return height;
        }

        /**
         * determine if node element is visible
         * @param  {[node element]} el      : element node
         * @return {[boolean]}      boolean : boolean value
         */
        function elemIsVisible(el) {
            return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
        }


        return Object.freeze({
            init : init
        });
    }

}());
