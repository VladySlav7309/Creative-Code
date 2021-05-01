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
        const count = 8;
        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = count <= 1 ? 0.5 : x / (count - 1);
                const v = count <= 1 ? 0.5 : y / (count - 1);
                const radius = 0.05;
                const rotation = 0;
                // const radius = Math.abs(random.noise2D(u, v)) * 0.20;
                // const rotation = random.noise2D(u, v);

                points.push({
                    color: random.pick(palette),
                    position: [ u, v ],
                    maxBottomPositionOfCurrentColumn: [ u, 1 ],
                    rotation,
                    radius,
                    word: '0'
                });
            }
        }
        return points;
    };

    // random.setSeed(512);
    // const points = createGrid().filter(() => random.value() > 0.5);
    const margin = 100;

    const points = createGrid();
    const randomPairs = [];
    const availablePoints = points.slice();
    const isAllPointsAssigned = () => {
        return availablePoints.length === 0;
    }

    return ({ context, width, height }) => {
        context.fillStyle = '#fff';
        context.fillRect(0, 0, width, height);

        const drawLineFromP1ToP2 = ([x1 ,y1], [x2, y2], moveTo = false) => {
            if (moveTo) {
                context.moveTo(x1, y1);
            }
            context.lineTo(x2, y2);
        };

        const getPointXY = (p, key = 'position') => {
            const [ u , v ] = p[key];
            return [
                lerp(margin, width - margin, u),
                lerp(margin, height - margin, v)
            ];
        };

        const drawTrapezoid = (p1, p2) => {
            const [ x1, y1 ] = getPointXY(p1);
            const [ x2, y2 ] = getPointXY(p2);
            const p1maxXY = getPointXY(p1, 'maxBottomPositionOfCurrentColumn');
            const p2maxXY = getPointXY(p2, 'maxBottomPositionOfCurrentColumn');

            context.strokeStyle = '#eee';
            context.fillStyle = random.pick(palette);
            context.lineWidth = 20;
            context.beginPath();
            drawLineFromP1ToP2([x1,y1], [x2,y2], true);
            drawLineFromP1ToP2([ x2, y2 ], p2maxXY);
            drawLineFromP1ToP2(p2maxXY, p1maxXY);
            drawLineFromP1ToP2(p1maxXY, [ x1, y1 ]);
            context.stroke();
            context.fill();
        }

        while (!isAllPointsAssigned()) {
            const randomP1 = random.rangeFloor(0, availablePoints.length);
            const p1 = availablePoints.splice(randomP1, 1)[0];
            const randomP2 = random.rangeFloor(0, availablePoints.length);
            const p2 = availablePoints.splice(randomP2, 1)[0];

            const inDifferentColumns = p1.position[0] !== p2.position[0];
            const notOnTheSameLine = p1.position[1] !== p2.position[1];
            if (inDifferentColumns && notOnTheSameLine) {
                randomPairs.push([p1, p2]);
            }
        }

        const getPointsPairAverageY = (pair) => {
            const [p1, p2] = pair;
            const p1XY = getPointXY(p1);
            const p2XY = getPointXY(p2);

            return (p1XY[1] + p2XY[1]) / 2;
        };

        randomPairs.sort((pair1, pair2) => {
            const agvY1 = getPointsPairAverageY(pair1);
            const agvY2 = getPointsPairAverageY(pair2);

            if (agvY1 > agvY2) {
                return 1;
            }
            if (agvY1 < agvY2) {
                return -1;
            }
            return 0;
        })

        randomPairs.forEach(([p1, p2]) => {
            drawTrapezoid(p1, p2);
        });
    };
};

canvasSketch(sketch, settings);
