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
              panels          = document.querySelectorAll('.accordion-panel-content');

        let lastAccordion    = null,
            currentAccordion = null,
            height           = {};


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

                let target                 = ev.target,
                    targetAccordion        = target.parentNode.parentNode,
                    targetAccordionContent = targetAccordion.querySelector('.accordion-panel-content');


                //make sure "this" means this
                if ( target !== this && target.tagName === 'A' ) {

                    let resetPanels       = closeAnyOpenedPanels.bind( null, targetAccordion, accordion, 'panel-is-open'),
                        targetPanelHeight = findPanelHeight.bind( null, getThisPanelClassList(ev), panelHeights),
                        initialisePique   = initPanels.bind( null, resetPanels(), targetAccordion, targetPanelHeight(), targetAccordionContent, 'panel-is-open' );

                    initialisePique();
                }
            });
        }


        //TODO: break down func
        /**
         * Previous and current accordion handler
         * @param  {[element]} targetAccordion   : accordion element
         * @param  {[element]} targetContent     : accordion panel content element
         * @param  {[string]} classname          : string of 'panel-is-open' expected
         * @return {[boolean]} panelsReady       : returns boolean to be used in promise
         */
        function closeAnyOpenedPanels( targetAccordion, targetContent, classname) {

            let panelsReady = false;

            lastAccordion    = currentAccordion;
            currentAccordion = targetAccordion;

            if ( (accordions.indexOf(lastAccordion) !== -1) )  {
                let lastAccordionIndex    = accordions.indexOf(lastAccordion),
                    currentAccordionIndex = accordions.indexOf(currentAccordion);

                if ( (currentAccordion !== lastAccordion) && (accordions[lastAccordionIndex].classList.contains(classname)) ) {

                    let lastAccordion                = accordions[lastAccordionIndex],
                        currentAccordion             = accordions[currentAccordionIndex],
                        lastAccordionPanelContent    = accordions[lastAccordionIndex].querySelector('.accordion-panel-content'),
                        currentAccordionPanelContent = accordions[currentAccordionIndex].querySelector('.accordion-panel-content');

                    resetHeight( lastAccordionPanelContent );
                    lastAccordionPanelContent.classList.add('hide');

                    //timing control
                    lastAccordionPanelContent.addEventListener( applyTransitionEndPrefix(lastAccordionPanelContent), function callback(ev) {
                        if ( ev.propertyName === 'height' ) {

                            if ( lastAccordion.classList.contains(classname) ) {
                                lastAccordion.classList.remove(classname);
                            }

                            lastAccordionPanelContent.removeEventListener(
                                applyTransitionEndPrefix( lastAccordionPanelContent ), callback, false
                            );

                            currentAccordionPanelContent.addEventListener( applyTransitionEndPrefix(lastAccordion), function callback(ev){
                                if ( ev.propertyName === 'height' ) {
                                    if ( currentAccordion.classList.contains(classname) ) {
                                        currentAccordion.classList.add(classname);
                                        currentAccordionPanelContent.classList.remove('hide');
                                    }

                                    currentAccordionPanelContent.removeEventListener(
                                        applyTransitionEndPrefix( lastAccordion ), callback, false
                                    );
                                }

                            });
                        }
                    });
                }
            }

            panelsReady = !panelsReady;

            return panelsReady;
        }


        function initPanels(panelsReady, target, height, targetContent, classname) {

            let promise = new Promise(function(resolve, reject) {
                if ( panelsReady === true ) {
                    resolve(panelsReady);
                } else {
                    reject(panelsReady);
                }
            });

            //arrow
            promise.then(function(){
                openTargetPanel( target, height, targetContent, classname );
            }).catch(function(){
                closeTargetPanel( target, targetContent, classname );
            });
        }


        /**
         * application of relevant classes for transitions
         * @param  {[type]}  el        [description]
         * @param  {[type]}  classname [description]
         * @param  {[type]}  height    [description]
         * @return {Boolean}           [description]
         */
        function openTargetPanel(targetAccordion, height, targetContent, classname) {

            if ( !targetAccordion.classList.contains(classname) ) {
                setHeight(targetContent, height);
                targetContent.classList.remove('hide');
                setTargetAccordionClass(targetAccordion, classname);
                setContainerClass(accordion, 'accordion-open');
            } else if ( targetAccordion.classList.contains(classname) ) {
                closeTargetPanel(targetAccordion, targetContent, classname);
            }
        }


        function closeTargetPanel(target, targetContent, classname) {

            if ( target.classList.contains(classname) ) {
                resetHeight(targetContent);
                targetContent.classList.add('hide');
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


        function resetHeight(el) {
            el.style.cssText = 'max-height: 0; height: 0;';
        }


        //TODO: refactor
        function removeTargetAccordionClass(targetContent, classname) {

            if ( (Object.prototype.toString.call( classname.trim() ) === '[object String]') && targetContent.nodeType === 1) {

                targetContent.addEventListener( applyTransitionEndPrefix(targetContent), function callback(ev){
                    if ( ev.propertyName === 'height' && targetContent.classList.contains(classname) ) {
                        targetContent.classList.remove(classname);
                        targetContent.removeEventListener( applyTransitionEndPrefix(targetContent), callback, false );
                    }
                });
            }
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


        function applyTransitionEndPrefix( element ) {

            let transition;

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
        //TODO: fix class bug
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
        //TODO: destructuring assignment
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
