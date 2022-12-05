
class Node {

    static SIZE = 40;
    static COLOR = color(46, 208, 193);
    static STROKE = color(0, 0, 0, 0);
    static TEXTSIZE = 10;
    static TEXTCOLOR = color(0, 0, 0);
    static EDGECOLOR = color(0, 0, 0);
    static EDGETHICKNESS = 5;
    static VISITED = color(0, 0, 255);
    static SUCCESS = color(0, 255, 0);
    static FAILURE = color(255, 0, 0);
    static HORIZONTALSPACING = 40;
    static VERTICALSPACING = 50;

    constructor(graphicsBuffer, parent = null, size = Node.SIZE,
        color = Node.COLOR, stroke = Node.STROKE,
        textSize = Node.TEXTSIZE, textColor = Node.TEXTCOLOR,
        edgeColor = Node.EDGECOLOR,
        edgeThickness = Node.EDGETHICKNESS) {

        this.value = null;
        this.leftNode = null;
        this.rightNode = null;

        this.graphicsBuffer = graphicsBuffer;

        this.parent = parent;

        this.x = 0;
        this.y = 0;


        this.rightSpacing = 0;
        this.leftSpacing = 0;

        this.cumulativeRightSpacing = 0;
        this.cumulativeLeftSpacing = 0;
        this.size = size;
        this.color = color;
        this.stroke = stroke;
        this.textSize = textSize;
        this.textColor = textColor;
        this.edgeColor = edgeColor;
        this.edgeThickness = edgeThickness;
    }

    isFilled() {
        return this.value !== null;
    }

    hasParent() {
        return this.parent !== null;
    }


    addValue(value) {
        if (!this.isFilled()) {

            this.value = value;
            this.leftNode = new Node(this.graphicsBuffer, this);
            this.rightNode = new Node(this.graphicsBuffer, this);

            return this;

        } else if (value < this.value) {


            var initialLeftSpacing = this.leftNode.cumulativeRightSpacing
                + Node.HORIZONTALSPACING;


            var shiftedNode = this.leftNode.addValue(value);
            this.leftSpacing = this.leftNode.cumulativeRightSpacing
                + Node.HORIZONTALSPACING;
            this.cumulativeLeftSpacing = this.leftNode.cumulativeLeftSpacing
                + this.leftSpacing;
            if (this.leftSpacing !== initialLeftSpacing) {
                return this.leftNode;
            }

            return shiftedNode;

        } else if (value > this.value) {
            var rightSpacing = this.rightNode.cumulativeLeftSpacing
                + Node.HORIZONTALSPACING;

            var shiftedNode = this.rightNode.addValue(value);

            this.rightSpacing = this.rightNode.cumulativeLeftSpacing
                + Node.HORIZONTALSPACING;

            this.cumulativeRightSpacing = this.rightNode.cumulativeRightSpacing
                + this.rightSpacing;

            if (this.rightSpacing !== rightSpacing) {
                return this.rightNode;
            }

            return shiftedNode;
        }
    }


    setCoordinates(x, y) {
        if (this.isFilled()) {
            if (typeof x === "undefined" && typeof y === "undefined") {

                if (this.value < this.parent.value) {

                    this.x = this.parent.x - this.parent.leftSpacing;
                } else {

                    this.x = this.parent.x + this.parent.rightSpacing;
                }

                this.y = this.parent.y + Node.VERTICALSPACING;

            } else {

                this.x = x;
                this.y = y;
            }

            this.leftNode.setCoordinates();
            this.rightNode.setCoordinates();
        }
    }
    search(value) {
        if (!this.isFilled()) {
            return false;

        } else if (this.value === value) {
            return true;

        } else if (value < this.value) {
            return this.leftNode.search(value);

        } else if (value > this.value) {
            return this.rightNode.search(value);
        }
    }

    drawEdge() {
        if (this.hasParent()) {
            this.graphicsBuffer.stroke(this.edgeColor);
            this.graphicsBuffer.strokeWeight(this.edgeThickness);
            this.graphicsBuffer.line(this.x, this.y, this.parent.x, this.parent.y);
        }
    }
    drawNode() {
        this.graphicsBuffer.fill(this.color);
        this.graphicsBuffer.stroke(this.stroke);
        this.graphicsBuffer.ellipse(this.x, this.y, this.size, this.size);

        this.graphicsBuffer.noStroke();
        this.graphicsBuffer.fill(this.textColor);
        this.graphicsBuffer.textAlign(CENTER, CENTER);
        this.graphicsBuffer.textSize(this.textSize);
        this.graphicsBuffer.text(this.value, this.x, this.y + 1);
    }
    draw() {
        if (this.isFilled()) {
            this.leftNode.draw();
            this.rightNode.draw();

            this.drawEdge();
            this.drawNode();
        }
    }
    redraw() {
        if (this.isFilled()) {
            this.drawEdge();

            this.drawNode();

            if (this.hasParent()) {
                this.parent.drawNode();
            }
        }
    }

    recursivePaint(color) {
        if (this.isFilled()) {
            this.color = color;
            this.edgeColor = color;

            this.leftNode.recursivePaint(color);
            this.rightNode.recursivePaint(color);
        }
    }

    paint(color) {
        this.color = color;
        this.edgeColor = color;

        this.redraw();
    }

    resetVisuals() {
        if (this.isFilled()) {
            this.size = Node.SIZE;
            this.color = Node.COLOR;
            this.stroke = Node.STROKE;
            this.textSize = Node.TEXTSIZE;
            this.textColor = Node.TEXTCOLOR;

            this.edgeColor = Node.EDGECOLOR;
            this.edgeThickness = Node.EDGETHICKNESS;

            this.leftNode.resetVisuals();
            this.rightNode.resetVisuals();
        }
    }
}
