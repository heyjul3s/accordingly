// TODO: only one panel open at a time, collapse all before opening
// TODO: fix target bug

(function(){
    'use strict';

    document.addEventListener('DOMContentLoaded', function(){
        let pique = Pique();
        pique.init();
    });


    function Pique() {

        let accordion       = document.querySelector('.accordion-container'),
            panelHeader     = document.querySelector('.accordion-header'),
            panels          = document.querySelectorAll('.accordion-panel-content'),
            height          = {};

        let panelsReady = true;

        //transitionend prefix
        let transitionEndPrefixes = {
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
                resetPanels( findOpenedPanel(), targetAccordion, findPanelHeight( getThisPanelClassList(ev), panelHeights), targetAccordionContent, 'panel-is-open' );
                // openTargetPanel( targetAccordion, findPanelHeight(getThisPanelClassList(ev), panelHeights), targetAccordionContent, 'panel-is-open' );
            });
        }


        function containerClass(container, classname) {
            if ( container.classList.contains(classname) ) {
                container.classList.remove(classname);
            } else {
                container.classList.add(classname);
            }
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
            } else if ( target.classList.contains(classname) ) {
                resetHeight(targetContent);
                removeTargetAccordionClass(target, classname);
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


        // containerClass( accordion, 'accordion-open');
        //TODO: reset all panels before opening another,
        function resetPanels(openedPanel, target, height, targetContent, classname) {
            //openedPanel must be undefined before setting class

            let promise = new Promise(function(resolve, reject){
                if ( openedPanel === undefined ) {
                    openTargetPanel( target, height, targetContent, classname );
                    resolve(openedPanel);
                } else {
                    //if there is an opened panel, remove and reset

                    resetHeight(openedPanel);
                    removeTargetAccordionClass(openedPanel, classname);

                    reject(openedPanel);
                }
            });

            promise.then(function(){
                console.log('opened');
                // openTargetPanel( target, height, targetContent, classname );
                // containerClass( accordion, 'accordion-open');
            }).catch(function(){
                openTargetPanel( target, height, targetContent, classname );
                // containerClass( accordion, 'accordion-open');
            });
        }


        function findOpenedPanel() {
            let panelsArray = Array.from(panels),
                openedPanel = panelsArray.find(function(){ return document.querySelector('.panel-is-open'); });

            if ( openedPanel !== undefined ) {
                return openedPanel;
            }
        }


        /**
         * get the parent element's children
         * @param  {[type]} element : target element
         * @return {[type]} array   : array list of child nodes
         */
        function _getChildren(element) {

            let i = 0,
                children = [],
                childrenNodes = element.childNodes,
                child;

            for ( i; i < childrenNodes.length; i += 1) {
                if ( childrenNodes[i].nodeType === 1 ) {
                    children.push(childrenNodes[i]);
                }
            }

            return children;
        }


        function resetHeight(el, classname) {
            el.style.cssText = 'max-height: 0; height: 0;';
        }


        function removeTargetAccordionClass(targetContent, classname) {

            if ( (Object.prototype.toString.call( classname.trim() ) === '[object String]') && targetContent.nodeType === 1) {
                targetContent.addEventListener( _applyTransitionEndPrefix(targetContent), function callback(ev){

                    if ( ev.propertyName === 'height' || ev.propertyName === 'maxHeight' && targetContent.parentNode.classList.contains(classname) ) {
                        console.log(targetContent.parentNode);
                        targetContent.parentNode.classList.remove(classname);
                        targetContent.removeEventListener( _applyTransitionEndPrefix(targetContent), callback, false );
                    }
                });
            }
        }


        function _applyTransitionEndPrefix( element ) {

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
            let panelClassesArray = Array.from(panelClasses),
                panelHeight;

            Object.keys(heights).forEach(function(key) {

                panelClassesArray.some(function(el, i){
                    if ( panelClassesArray.includes(key) ) {
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

            return targetedPanel.classList;
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
