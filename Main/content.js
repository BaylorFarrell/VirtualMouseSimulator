(function lightweightVirtualMouseSimulator() {
    const config = {
        safeZone: {
            xMin: 50,
            xMax: window.innerWidth - 50,
            yMin: 50,
            yMax: window.innerHeight - 50,
        },
        minDelay: 2000,
        maxDelay: 5000,
        hoverProbability: 0.4
    };

    let virtualMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isRunning = true;

    const getRandomCoordinate = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const triggerMouseEvent = (eventType, x, y, target = document) => {
        const event = new MouseEvent(eventType, {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
        });
        target.dispatchEvent(event);
    };

    const moveAlongBezierCurve = (startX, startY, endX, endY, steps = 20) => {
        const controlX = (startX + endX) / 2 + Math.random() * 100 - 50;
        const controlY = (startY + endY) / 2 + Math.random() * 100 - 50;

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
            const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;

            setTimeout(() => {
                if (!isRunning) return;
                virtualMouse.x = x;
                virtualMouse.y = y;
                triggerMouseEvent('mousemove', x, y);
            }, i * 50);
        }
    };

    const hoverRandomElement = () => {
        const elements = Array.from(document.querySelectorAll('button, a, input')).filter(el => el.offsetParent !== null);
        if (!elements.length) return;

        const element = elements[Math.floor(Math.random() * elements.length)];
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        moveAlongBezierCurve(virtualMouse.x, virtualMouse.y, x, y);

        setTimeout(() => {
            if (!isRunning) return;
            triggerMouseEvent('mouseover', x, y, element);
        }, 1000);
    };

    const simulateMouseActions = () => {
        if (!isRunning) return;

        if (Math.random() < config.hoverProbability) {
            hoverRandomElement();
        } else {
            const x = getRandomCoordinate(config.safeZone.xMin, config.safeZone.xMax);
            const y = getRandomCoordinate(config.safeZone.yMin, config.safeZone.yMax);
            moveAlongBezierCurve(virtualMouse.x, virtualMouse.y, x, y);
        }

        const delay = getRandomCoordinate(config.minDelay, config.maxDelay);
        setTimeout(simulateMouseActions, delay);
    };

    console.log("Starting virtual mouse simulation...");
    simulateMouseActions();

    window.stopSimulation = () => { isRunning = false; console.log("Simulation stopped."); };
})();
