/*global logger*/
/*
    KeyboardShortcut
    ========================

    @file      : KeyboardShortcut.js
    @version   : 1.1.1
    @author    : Eric Tieniber
    @date      : Thu, 9 Feb 2017 18:00:39 GMT
    @copyright :
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dojo/_base/lang",
	"dojo/query"
], function(declare, _WidgetBase, dojoLang, dojoQuery) {
    "use strict";

    // Declare widget's prototype.
    return declare("KeyboardShortcut.widget.KeyboardShortcut", [ _WidgetBase ], {

        // Parameters configured in the Modeler.
		shortcuts: [],
		disableInput: false,
		limitScope: false,


		//internal variables
		_shortcut: null,


        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function() {
            // Uncomment the following line to enable debug messages
            //logger.level(logger.DEBUG);
            logger.debug(this.id + ".constructor");
			this._shortcut = new Shortcut();

        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function() {
            logger.debug(this.id + ".postCreate");

			var clicker, i, sc, scope, func, default_options;
			var self = this;

			clicker = function () {
				console.log("fireClickEvent: " + this.sclass);

				if (self.limitScope) {
					var scope = self.domNode.parentNode;
					if (!scope.contains(event.target)) {
						// the element causing the event isn't part of the scope, return;
						return;
					}
					
					// if the event happened within the scope, it should also stop propagation of the event
					event.cancelBubble = true;
					event.returnValue = false;
					 //e.stopPropagation works in Firefox.
					if (event.stopPropagation) {
						event.stopPropagation();
						event.preventDefault();
					}
				}

				var button, chosenButton;
				var buttons = dojoQuery(this.sclass);

				var buttonsLength = buttons.length;
				for (var i = 0; i < buttonsLength; i++) {
                    button = buttons[i];
					if (button.offsetHeight != 0) {
						chosenButton = button;
						break;
					}
				}

                if (self.focusButton) {
                    chosenButton.focus();
                }
				chosenButton.click();
				//var widget = dijit.byId(button.id);
				//widget.onClick();
			};

			// Options to default to. To make them configurable they are added here instead of in shortcut.
			default_options = {
				'type': 'keydown',
				'propagate': false,
				'disable_in_input': this.disableInput,
				'target': document,
				'keycode': false
				};
			//loop through all shortcuts
			for (i = 0; i < this.shortcuts.length; i++) {
				sc = this.shortcuts[i];
				//find the button to be executed by the shortcut, and define the callback function to fire
				scope = {
					sclass: "." + sc.buttonclass,

					action: clicker
				};
				func = dojoLang.hitch(scope, "action");
				if (this.limitScope == true) {
                    default_options['propagate'] = true;
                }
				this._shortcut.add(sc.shortcutkey, func, default_options);
			}

        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function() {
          logger.debug(this.id + ".enable");
        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function() {
          logger.debug(this.id + ".disable");
        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function(box) {
          logger.debug(this.id + ".resize");
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function() {
         	logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
			this._shortcut.removeAll();
        }
    });
});

require(["KeyboardShortcut/widget/KeyboardShortcut"], function() {
    "use strict";
});

/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
function Shortcut() {
	this.all_shortcuts = {}, //All the shortcuts are stored in this array
	this.add = function (shortcut_combination, callback, opt) {
		//Provide a set of default options
		var default_options = {
			'type': 'keydown',
			'propagate': false,
			'disable_in_input': false,
			'target': document,
			'keycode': false
		};
		if (!opt) opt = default_options;
		else {
			for (var dfo in default_options) {
				if (typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}

		var ele = opt.target;
		if (typeof opt.target == 'string') ele = document.getElementById(opt.target);
		var ths = this;
		shortcut_combination = shortcut_combination.toLowerCase();

		//The function to be called at keypress
		var func = function (e) {
			e = e || window.event;

			if (opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
				var element;
				if (e.target) element = e.target;
				else if (e.srcElement) element = e.srcElement;
				if (element.nodeType == 3) element = element.parentNode;

				if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
			}

			//Find Which key is pressed
			var code = null;
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();

			if (code == 188) character = ","; //If the user presses , when the type is onkeydown
			if (code == 190) character = "."; //If the user presses , when the type is onkeydown

			var keys = shortcut_combination.split("+");
			//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			var kp = 0;

			//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			var shift_nums = {
				"`": "~",
				"1": "!",
				"2": "@",
				"3": "#",
				"4": "$",
				"5": "%",
				"6": "^",
				"7": "&",
				"8": "*",
				"9": "(",
				"0": ")",
				"-": "_",
				"=": "+",
				";": ":",
				"'": "\"",
				",": "<",
				".": ">",
				"/": "?",
				"\\": "|"
			};
			//Special Keys - and their codes
			var special_keys = {
				'esc': 27,
				'escape': 27,
				'tab': 9,
				'space': 32,
				'return': 13,
				'enter': 13,
				'backspace': 8,

				'scrolllock': 145,
				'scroll_lock': 145,
				'scroll': 145,
				'capslock': 20,
				'caps_lock': 20,
				'caps': 20,
				'numlock': 144,
				'num_lock': 144,
				'num': 144,

				'pause': 19,
				'break': 19,

				'insert': 45,
				'home': 36,
				'delete': 46,
				'end': 35,

				'pageup': 33,
				'page_up': 33,
				'pu': 33,

				'pagedown': 34,
				'page_down': 34,
				'pd': 34,

				'left': 37,
				'up': 38,
				'right': 39,
				'down': 40,

				'f1': 112,
				'f2': 113,
				'f3': 114,
				'f4': 115,
				'f5': 116,
				'f6': 117,
				'f7': 118,
				'f8': 119,
				'f9': 120,
				'f10': 121,
				'f11': 122,
				'f12': 123
			};

			var modifiers = {
				shift: {
					wanted: false,
					pressed: false
				},
				ctrl: {
					wanted: false,
					pressed: false
				},
				alt: {
					wanted: false,
					pressed: false
				},
				meta: {
					wanted: false,
					pressed: false
				} //Meta is Mac specific
			};

			if (e.ctrlKey) modifiers.ctrl.pressed = true;
			if (e.shiftKey) modifiers.shift.pressed = true;
			if (e.altKey) modifiers.alt.pressed = true;
			if (e.metaKey) modifiers.meta.pressed = true;

			for (var i = 0; k = keys[i], i < keys.length; i++) {
				//Modifiers
				if (k == 'ctrl' || k == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if (k == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if (k == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if (k == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if (k.length > 1) { //If it is a special key
					if (special_keys[k] == code) kp++;

				} else if (opt['keycode']) {
					if (opt['keycode'] == code) kp++;

				} else { //The special keys did not match
					if (character == k) kp++;
					else {
						if (shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character];
							if (character == k) kp++;
						}
					}
				}
			}

			if (kp == keys.length &&
				modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
				modifiers.shift.pressed == modifiers.shift.wanted &&
				modifiers.alt.pressed == modifiers.alt.wanted &&
				modifiers.meta.pressed == modifiers.meta.wanted) {
				callback(e);

				if (!opt['propagate']) { //Stop the event
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = false;

					//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}
		};
		this.all_shortcuts[shortcut_combination] = {
			'callback': func,
			'target': ele,
			'event': opt['type']
		};
		//Attach the function with the event
		if (ele.addEventListener) ele.addEventListener(opt['type'], func, false);
		else if (ele.attachEvent) ele.attachEvent('on' + opt['type'], func);
		else ele['on' + opt['type']] = func;
	},

	//Remove the shortcut - just specify the shortcut and I will remove the binding
	this.remove = function (shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete(this.all_shortcuts[shortcut_combination]);
		if (!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if (ele.detachEvent) ele.detachEvent('on' + type, callback);
		else if (ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on' + type] = false;
	},

	//Remove all shortcuts
	this.removeAll= function () {
		for (x in this.all_shortcuts) {
			this.remove(x);
		}
	}
};
