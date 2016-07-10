// TODO: only one panel open at a time, collapse all before opening

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

        function init() {
            let panelHeights = getHeight( panels );

            accordion.addEventListener('click', function(ev){
                ev.preventDefault();

                let target = ev.target,
                    targetAccordion = target.parentNode.parentNode,
                    targetAccordionContent = targetAccordion.querySelector('.accordion-panel-content');

                //TODO: curry
                openTargetPanel( targetAccordion, findPanelHeight(getThisPanelClassList(ev), panelHeights), targetAccordionContent, 'panel-is-open' );
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
            } else {
                resetHeight(targetContent);
                removeTargetAccordionClass(target, classname);
            }
        }


        function setTargetAccordionClass(el, classname) {
            if ( (Object.prototype.toString.call( classname.trim() ) === '[object String]') && !el.classList.contains(classname)  ) {
                el.classList.add(classname);
            }
        }


        function removeTargetAccordionClass(el, classname) {
            if ( (Object.prototype.toString.call( classname.trim() ) === '[object String]') && el.classList.contains(classname) ) {
                el.classList.remove(classname);
            }
        }


        function setHeight(el, height) {
            if ( !isNaN(parseFloat(height)) && isFinite(height) ) {
                el.style.cssText = 'max-height:' + height + 'px; height:' +  height + 'px';
            }
        }


        function resetHeight(el, classname) {
            el.style.cssText = 'max-height: 0; height: 0;';
        }


        //TODO: to reset all panels. to be used in lieu with openTargetPanel to ensure only one panel is open at a time
        function resetAll() {

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
         *  Get heights of all panels and store in heightsList config array
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
