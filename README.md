__Project Overview__

This project is a Brain-Computer Interface (BCI) art experience that uses a modified Arduino-based EEG/EKG to track a user's blinking and visually represents this data in real-time. It features a dynamic web interface where visual elements such as circle and background colors can be adjusted, enhancing the interactivity of the display.

__Features__

Arduino Serial Communication: Utilizes an Arduino-based EEG/EKG to collect blinking data.
Dynamic Visualization: Real-time visual representation of blinking data using p5.js.
Interactive Interface: Users can change the circle and background colors.
Responsive Web Design: The interface adapts to various screen sizes for optimal viewing.

__File Structure__

index.html: Main HTML file with the structure of the web interface.
script.js: Contains the JavaScript logic for serial communication, data processing, and visualization.
styles.css: CSS file for styling the web interface.
Setup and Installation

__Hardware Requirements:__

• EEG/EKG device for data collection (I use a Modified Arduino-based system).
• A computer with a USB port for connecting the Arduino.

__Software Dependencies:__

• Chrome web browser.
• The project utilizes the p5.js library, loaded directly from a CDN in the HTML file.

__Running the Project:__

Connect the Arduino-based EEG/EKG device to your computer.
Open index.html in a web browser.
Click the "Connect" button to establish a serial connection with the Arduino.
Interact with the color pickers to change the visual elements.

__How It Works__

Data Collection: The Arduino device tracks blinking and sends the data to the computer via serial communication.
Processing Data: script.js processes the incoming data and updates the visual elements based on the blink rate.
Visualization: The p5.js library is used to dynamically create and manipulate visual elements, representing the user's blinking pattern.
Contributing

__Contact__

For more information, please contact cdavodi@berkeley.edu
