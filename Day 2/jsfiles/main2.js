class Tree {
    constructor(x, y, backgroundColor) {

        this.graphicsBuffer = createGraphics(CANVASWIDTH, CANVASHEIGHT);
        this.root = new Node(this.graphicsBuffer);
        this.controls = null;
        this.x = x;
        this.y = y;
        this.backgroundColor = backgroundColor;
        this.running = false;
        this.timeout = null;
        this.node = null;
        this.draw();
    }


    bindControls(controls) {
        this.controls = controls;
    }

    clear() {
        this.root = new Node(this.graphicsBuffer);
    }
    uniqueRandom(max) {
        while (true) {
            var value = Math.floor(random(0, max));

            if (!this.search(value)) {
                return value;
            }
        }
    }

    fill(count) {
        this.clear();

        for (var i = 0; i < count; i++) {
            var value = this.uniqueRandom(count);

            this.addValue(value);
        }

        this.draw();
    }

    addValue(value) {
        var shiftedNode = this.root.addValue(value);

        this.setCoordinates(shiftedNode);
    }
    search(value) {
        return this.root.search(value);
    }

    setCoordinates(node) {
        if (node === this.root) {
            node.setCoordinates(this.x, this.y);
        } else {
            node.setCoordinates();
        }
    }
    draw() {
        this.graphicsBuffer.background(this.backgroundColor);

        if (this.root.isFilled()) {
            this.root.draw();
        }

        this.updateDrawing();
    }

    updateDrawing() {
        image(this.graphicsBuffer, 0, 0);
    }


    resetVisuals() {
        this.root.resetVisuals();

        this.draw();
    }


    startAnimation(frame, ...args) {
        if (this.running) {
            throw Error('Animation is currently running');
        } else {
            this.running = true;
            this.node = this.root;

            this.resetVisuals();

            this.continueAnimation(frame.bind(this), ...args)
        }
    }


    continueAnimation(frame, ...args) {

        this.timeout = setTimeout(() => frame.bind(this)(...args),
            this.controls.animationInterval);
    }


    stopAnimation(complete = () => { }, ...callbackArgs) {
        this.running = false;
        this.node = null;

        clearTimeout(this.timeout);

        setTimeout(() => complete(...callbackArgs), this.controls.animationInterval);
    }


    addValueVisual(value, complete = () => { }, ...callbackArgs) {
        this.startAnimation(this.addValueFrame, value, complete, ...callbackArgs);
    }
    addValueFrame(value, complete, ...callbackArgs) {
        if (!this.node.isFilled()) {
            this.addValue(value);

            this.node.paint(Node.SUCCESS);

            this.draw();

            this.stopAnimation(complete, ...callbackArgs);

        } else {
            this.node.paint(Node.VISITED);

            this.updateDrawing();


            if (value < this.node.value) {
                this.node = this.node.leftNode;

            } else if (value > this.node.value) {
                this.node = this.node.rightNode;
            }


            this.continueAnimation(this.addValueFrame, value, complete, ...callbackArgs)
        }
    }


    searchVisual(value, complete = () => { }, ...callbackArgs) {
        this.startAnimation(this.searchFrame, value, complete, ...callbackArgs);
        console.log('searching visually')
    }


    searchFrame(value, complete, ...callbackArgs) {
        if (this.node.color !== Node.VISITED) {

            this.root.paint(Node.VISITED);

            this.updateDrawing();

            this.continueAnimation(this.searchFrame, value, complete, ...callbackArgs);

        } else if (!this.node.isFilled()) {


            this.stopAnimation(complete, ...callbackArgs);

        } else if (this.node.value === value) {

            this.node.paint(Node.SUCCESS);

            this.updateDrawing();

            this.stopAnimation(complete, ...callbackArgs);

        } else {


            var nextHalf;
            var cutHalf;

            if (value < this.node.value) {
                nextHalf = this.node.leftNode;
                cutHalf = this.node.rightNode;

            } else if (value > this.node.value) {
                nextHalf = this.node.rightNode;
                cutHalf = this.node.leftNode;
            }
            this.node = nextHalf;
            cutHalf.recursivePaint(Node.FAILURE);
            cutHalf.draw();
            nextHalf.paint(Node.VISITED);
            this.updateDrawing();

            this.continueAnimation(this.searchFrame, value, complete, ...callbackArgs);
        }
    }

    fillVisual(count, complete = () => { }) {
        this.clear();

        this.startAnimation(this.fillFrame, count, 0, complete);
    }


    fillFrame(count, filled, complete) {
        if (filled === count) {

            this.stopAnimation(complete);
        } else {

            this.stopAnimation();

            var value = this.uniqueRandom(count);

            this.startAnimation(this.addValueFrame, value,
                this.fillFrame.bind(this), count, filled + 1, complete);
        }
    }
}
