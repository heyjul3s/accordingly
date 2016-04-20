// TODO: only one panel open at a time, collapse all before opening

(function(){
    'use strict';

    document.addEventListener('DOMContentLoaded', function(){
        var pique = Pique();
        pique.init();
    });


    function Pique() {

        let accordion       = document.querySelector('.accordion-container'),
            panelHeader     = document.querySelector('.accordion-header'),
            panels          = document.querySelector('.accordion-panel-content'),
            height          = {},
            isOpen          = false;


        function init() {
            var panelHeights = getHeight(document.querySelectorAll('.accordion-panel-content'));

            initialPanelHandler( panelHeights );

            accordion.addEventListener('click', function(ev){
                ev.preventDefault();

                isPanelOpen(
                    ev.target.parentNode.nextElementSibling,
                    'panel-is-open',
                    findPanelHeight(ev, getThisPanelClassList(ev), panelHeights)
                );
            });
        }


        /**
         * get target panel classList
         * @param  {[type]]} ev
         * @return {Boolean} : an array of classes belonging to panel
         */
        function getThisPanelClassList(ev) {
            let target = ev.target,
                targetedPanel = target.parentNode.nextElementSibling;

            return targetedPanel.classList;
        }


        /**
         * find matching class and return relevant height value
         * @param  {[nodeList]} panelClasses : a list of classes
         * @return {[number]}                : returns a numerical height value
         */
        function findPanelHeight(ev, panelClasses, heights) {
            //new feature in es2015 that makes this redundant?
            let panelClassesArray = [].slice.call(panelClasses),
                panelHeight;

            //TODO: switch to for of
            Object.keys(heights).forEach(function(key) {

                panelClassesArray.some(function(el, i){
                    if ( panelClassesArray.includes(key) ) {
                        panelHeight = heights[key];
                    }
                });

            });

            return panelHeight;
        }


        //make it usable for setting single panels as well, pass an object of css key values?
        function hidePanels() {
            let accordionPanels = document.querySelectorAll('.accordion-panel-content');

            //TODO: switch to newer loop
            for (var item in accordionPanels) {
                if ( accordionPanels.hasOwnProperty(item) ) {
                    accordionPanels[item].classList.add('hidden');
                }
            }
        }


        function swapClass(el, classname) {
            if (Object.prototype.toString.call(classname) === '[object String]') {
                return el.classList.contains(classname) ? el.classList.remove(classname) : el.classList.add(classname);
            }
        }


        /**
         * well, set the element height
         * @param {[type]} el     : selector
         * @param {number} height : height of panel
         */
        function setHeight(el, height, classname) {
            if ( (!isNaN(parseFloat(height)) && isFinite(height)) && (Object.prototype.toString.call(classname) === '[object String]') ) {
                swapClass(el, classname);
                swapClass(el, 'hidden');
                el.style.cssText = 'max-height:' + height + 'px; height:' +  height + 'px';
            }
        }


        /**
         * reset height to 0 and hide
         * @param {[type]} el [description]
         */
        function resetHeight(el, classname) {
            if (Object.prototype.toString.call(classname) === '[object String]') {
                el.classList.remove(classname);
                el.classList.add('hidden');
                el.style.cssText = 'max-height: 0; height: 0;';
            }
        }


        /**
         * application of relevant classes for transitions
         * @param  {[type]}  el        [description]
         * @param  {[type]}  classname [description]
         * @param  {[type]}  height    [description]
         * @return {Boolean}           [description]
         */
        function isPanelOpen(el, classname, height) {
            ( isOpen && !el.classList.contains(classname) )  ?  setHeight(el, height, classname) : resetHeight(el, classname);
            isOpen = !isOpen;
        }


        /** initialPanelHandler
         *  Promise handler that triggers hidePanels function
         *  @param  {[object]} heights  : argument of array type with object heights information
         *  @return {[type]}           : broken dreams
         */
        function initialPanelHandler(heights) {

            var promise = new Promise(function(resolve, reject){
                if ( (heights === Object(heights)) && (!Array.isArray(heights)) && Object.keys(heights).length !== 0 ) {
                    resolve(heights);
                } else {
                    reject(heights);
                }
            });

            //TODO: use arrows
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
         *  @return {[object]}           : returns array with panel key and value objects
         */
        function getHeight(el, panelKey) {

            if ( (el === Object(el)) && (!Array.isArray(el)) ) {

                Object.keys(el).forEach(function (key) {

                    if ( elemIsVisible(el[key]) ) {

                        //TODO: destructure
                        let panel   = el[key],
                            objKey  = panel.classList[1], //TODO : this is weak
                            value   = panel.clientHeight; //TODO : just the element or plus padding/margin?

                        height[objKey] = value;
                    }
                    // else {
                    // }

                });

            }
            // else if ( single dom element ) {
            // }

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
