# Keyboard Shortcut Widget

## Description

This widget allows to connect any clickable object on your page with a keyboard shortcut. Define one or more shortcuts with a single Keyboard Shortcut widget!

Widget is based on shortcuts.js, accessible at  [http://www.openjs.com/scripts/events/keyboard_shortcuts/](http://www.openjs.com/scripts/events/keyboard_shortcuts/)! 

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

 - Set your form save button to ctrl+shift+s
 - Use the escape key to activate the cancel button
 - Activate a microflow button or other clickable custom widget using a keyboard combination.
 - Features and limitations

## Limitations 

The shortcuts.js library supports 2 additional options on each shortcut configured. These have not been implemented yet:

 - Event type can be 'keydown','keyup','keypress'. Default: 'keydown'
 - keycode - Watch for this keycode. For eg., the keycode '65' is 'a'.

## Recent Features

The following 3 features (already part of the shortcuts.js library) were added recently to the widget:
 - disable_in_input - If this is set to true, keyboard capture will be disabled in input and textarea fields. If these elements have focus, the keyboard shortcut will not work. This is very useful for single key shortcuts. Default: false
 - target - DOM Node - The element that should be watched for the keyboard event. Default : document
 - propagate - Allow the event to propagate? Default : false

## Configuration 

 - Add the Keyboard Shortcut to any page with clickable objects (buttons, other custom widgets)
 - Define a CSS class on the clickable object
 - Use that CSS class in the configuration of the keyboard shortcut, as well as the keyboard sequence that should activate the object
 - Special keys for shortcuts are: shift, ctrl, alt, option, meta, command, and mod (either ctrl or command depending on platform). 
 - Other special keys are backspace, tab, enter, return, capslock, esc, escape, space, pageup, pagedown, end, home, left, up, right, down, ins, and del. Any other key you should be able to reference by name like a, /, $, *, or =.


