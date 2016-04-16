// TODO: css styles
// TODO: wait until max-height transition done and apply opacity
// TODO: only one panel open at a time

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
         * @param  {I don't know what this is}  ev : the event thing, okay? I don't know, stop asking
         * @return {Boolean}                       : an array of classes belonging to panel
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

            Object.keys(heights).forEach(function(key) {

                panelClassesArray.some(function(el, i){
                    if ( panelClassesArray.includes(key) ) {
                        // return heights[key];
                        panelHeight = heights[key];
                    }
                });

            });

            return panelHeight;
        }


        //make it usable for setting single panels as well, pass an object of css key values?
        function hidePanels() {
            let accordionPanels = document.querySelectorAll('.accordion-panel-content');

            for (var item in accordionPanels) {
                if ( accordionPanels.hasOwnProperty(item) ) {
                    accordionPanels[item].style.cssText = 'max-height: 0; height: 0; position:absolute; opacity: 0;';
                }
            }
        }


        function swapClass(el, classname) {
            if (Object.prototype.toString.call(classname) === '[object String]') {
                return el.classList.contains(classname) ? el.classList.remove(classname) : el.classList.add(classname);
            } else {
                return false;
            }
        }


        /**
         * well, set the element height
         * @param {[type]} el     [description]
         * @param {[type]} height [description]
         */
        function setHeight(el, height, classname) {
            if ( (!isNaN(parseFloat(height)) && isFinite(height)) && (Object.prototype.toString.call(classname) === '[object String]') ) {
                el.classList.add(classname);
                el.style.cssText = 'height:' + height + 'px;' + 'max-height:' + height + 'px;' + 'position: relative';
            }
        }


        /**
         * reset height to 0 and hide
         * @param {[type]} el [description]
         */
        function resetHeight(el, classname) {
            if (Object.prototype.toString.call(classname) === '[object String]') {
                el.classList.remove(classname);
                el.style.cssText = 'height: 0; max-height: 0; display: none; position: absolute;';
            }
        }


        function isPanelOpen(el, classname, height) {
            if ( isOpen && !el.classList.contains(classname) ) {
                setHeight(el, height, classname);
            } else {
                resetHeight(el, classname);
            }
            isOpen = !isOpen;
        }


        function panelVisibilityHandler(el, classname, height) {
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

            promise.then(function(){
                hidePanels();
    		}).catch(function(){
                console.log('did not work'); //TODO: anything to do if failure?
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
                        let stuff   = el[key],
                            objKey  = stuff.classList[1], //TODO : this is weak
                            value   = stuff.clientHeight; //TODO : just the element or plus padding/margin?

                        height[objKey] = value;
                    }
                    // else {
                        // what to do, what to do?
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
