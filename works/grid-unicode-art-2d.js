const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const canvasSketch = require('canvas-sketch');
const palettes = require('nice-color-palettes');
const settings = {
  dimensions: [ 2048, 2048 ],
  suffix: `seed-${random.getSeed()}`,
};

random.setSeed(random.getRandomSeed());
console.log('Seed : ', random.getSeed());

const sketch = () => {
    const colorCount = random.rangeFloor(2, 6);
    // const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);
    const palette = random.pick(palettes);

    const createGrid = () => {
        const points = [];
        const count = 50;
        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = count <= 1 ? 0.5 : x / (count - 1);
                const v = count <= 1 ? 0.5 : y / (count - 1);
                const radius = Math.abs(random.noise2D(u, v)) * 0.08;

                points.push({
                    color: random.pick(palette),
                    position: [ u, v ],
                    rotation: random.noise2D(u, v),
                    radius,
                    word: '~'
                    // radius: Math.abs(0.01 + random.gaussian() * 0.015),
                });
            }
        }
        return points;
    };

    // random.setSeed(512);
    // const points = createGrid().filter(() => random.value() > 0.5);
    const points = createGrid();
    const margin = 100;

    return ({ context, width, height }) => {
        context.fillStyle = '#fff';
        context.fillRect(0, 0, width, height);

        points.forEach(({ position, radius, color, rotation, word }) => {
            const [ u , v ] = position;
            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height - margin, v);

            // context.beginPath();
            // context.arc(x, y, radius * width, 0, Math.PI * 2, false);
            // context.lineWidth = 30;
            // context.fillStyle = color;
            // context.fill();
            context.save();
            context.fillStyle = color;
            context.font = `${radius * width}px "Arial"`;
            context.translate(x, y);
            context.rotate(rotation);
            context.fillText(word, 0, 0);
            context.restore();
        });
    };
};

canvasSketch(sketch, settings);
