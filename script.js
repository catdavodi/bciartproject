let isCollectingData = false; // Flag to track data collection state
let port; // Variable to store the serial port object
let dataBuffer = new Uint8Array(2); // Buffer to hold two bytes
let bufferIndex = 0; // Index to track buffer position
let currentDataValue = 0; // Variable to hold the current data value
let circleColor = '#FF0000'; // Default red color for circle and particles
let backgroundColor = '#FFFFFF'; // Default white background color

// Variables for Perlin noise offset
let noiseOffset = 0;

// Particle class to represent spewing particles
class Particle {
    constructor(x, y, angle, speed) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.life = 650; // Adjust for longer or shorter lifespan
        this.xNoiseOffset = Math.random() * 1000; // Random offset for x
        this.yNoiseOffset = Math.random() * 1000; // Random offset for y
    }

    update(p) {
        // Move particle with Perlin noise
        this.x += Math.cos(this.angle) * this.speed + (p.noise(this.xNoiseOffset) - 0.5) * 2;
        this.y += Math.sin(this.angle) * this.speed + (p.noise(this.yNoiseOffset) - 0.5) * 2;
        this.life -= 2; // Decrease life
        this.xNoiseOffset += 0.01; // Increment noise offset
        this.yNoiseOffset += 0.01; // Increment noise offset
    }

    draw(p) {
        p.fill(circleColor); // Use global circleColor for particle color
        p.noStroke();
        p.ellipse(this.x, this.y, 5, 5); // Draw particle
    }

    isDead() {
        return this.life <= 0;
    }
}

let particles = []; // Array to store particles

// Setup the serial connection and data collection toggle
document.getElementById('connect-button').addEventListener('click', async () => {
    if (!port) { // If port is not yet initialized
        if ('serial' in navigator) {
            try {
                port = await navigator.serial.requestPort();
                await port.open({ baudRate: 230400 });
            } catch (err) {
                console.error('There was an error:', err);
            }
        } else {
            console.log('Web Serial API not supported in this browser.');
        }
    }

    isCollectingData = !isCollectingData; // Toggle the data collection state
    if (isCollectingData) {
        readSerialData(port); // Start reading data if collection is active
    }
});

// Read data from the serial port
async function readSerialData(port) {
    const reader = port.readable.getReader();

    try {
        while (isCollectingData) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }
            if (value) {
                processData(value); // Process each byte of data
            }
        }
    } catch (error) {
        console.error('Error reading from serial port:', error);
    } finally {
        reader.releaseLock();
    }
}

// Process incoming data
function processData(data) {
    for (let i = 0; i < data.length; i++) {
        dataBuffer[bufferIndex++] = data[i];

        if (bufferIndex === 2) {
            currentDataValue = parseData(dataBuffer);
            bufferIndex = 0;
        }
    }
}

// Parse the data from the buffer
function parseData(buffer) {
    let msb = buffer[0] & 0x07;
    let lsb = buffer[1];
    return (msb << 7) | lsb;
}

// Setup the p5 sketch
new p5((p) => {
    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);

        // Event listener for circle and particles color
        document.getElementById('circle-color').addEventListener('input', function () {
            circleColor = this.value;
        });

        // Event listener for background color
        document.getElementById('background-color').addEventListener('input', function () {
            backgroundColor = this.value;
        });
    };

    p.draw = () => {
        p.background(backgroundColor); // Use global backgroundColor

        // Center of the ellipse
        let centerX = window.innerWidth / 2;
        let centerY = window.innerHeight / 2;
        let radius = 150; // Base radius of the ellipse

        // Set the fill color to red
        p.fill(circleColor);
        p.noStroke();

        // Begin drawing the ellipse
        p.beginShape();
        for (let angle = 0; angle < 360; angle += 7) {
            let r = radius;
            if (currentDataValue >= 550) {
                // Apply Perlin noise for jiggling effect
                let xoff = (p.cos(p.radians(angle)) + 1) * noiseOffset;
                let yoff = (p.sin(p.radians(angle)) + 1) * noiseOffset;
                r += p.noise(xoff, yoff) * 30 - 15; // Jiggle range -15 to 15
                noiseOffset += 0.01;

                // Create particles
                let particleAngle = p.radians(angle);
                let px = centerX + r * p.cos(particleAngle);
                let py = centerY + r * p.sin(particleAngle);
                particles.push(new Particle(px, py, particleAngle, 2)); // Adjust speed as needed
            }

            // Calculate x and y coordinates
            let x = centerX + r * p.cos(p.radians(angle));
            let y = centerY + r * p.sin(p.radians(angle));

            // Create vertex at (x, y)
            p.vertex(x, y);
        }
        p.endShape(p.CLOSE);

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            let particle = particles[i];
            particle.update(p);
            particle.draw(p);
            if (particle.isDead()) {
                particles.splice(i, 1);
            }
        }
    };
});
