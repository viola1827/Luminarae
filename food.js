class Foods{
    constructor(x, y, color) {
        this.position = createVector(x, y);
        this.color = color;
    }

    show() {
        fill(this.color);
        noStroke();
        ellipse(this.position.x, this.position.y, 8, 8);       

    }
}