const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

// 初始化canvas尺寸
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
}

// 星空设置
const numStars = 2300;
let focalLength;
let centerX;
let centerY;
const baseTrailLength = 1; // 固定的拖尾长度

// 星星数组
let stars = [];

// 初始化星星
function initializeStars() {
    focalLength = canvas.width * 2; // 在初始化时根据canvas宽度设置
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * canvas.width,
            o: 0.5 + Math.random() * 0.5, // 星星的透明度
            trail: []
        });
    }
}

// 更新星星位置
function moveStars() {
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        // 以固定的慢速移动星星
        const speed = 1;
        star.z -= speed;

        // 当星星经过观察者时重置其位置
        if (star.z < 1) {
            star.z = canvas.width;
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
            star.trail = [];
        }
    }
}

// 绘制星星和它们的拖尾
function drawStars() {
    // 用半透明的背景来创建拖尾效果
    ctx.fillStyle = `rgba(17, 17, 17, 0.95)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制星星和拖尾
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // 计算屏幕位置与透视
        const px = (star.x - centerX) * (focalLength / star.z) + centerX;
        const py = (star.y - centerY) * (focalLength / star.z) + centerY;

        // 将位置添加到拖尾数组
        star.trail.push({ x: px, y: py });
        if (star.trail.length > baseTrailLength) {
            star.trail.shift();
        }

        // 绘制拖尾
        if (star.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(star.trail[0].x, star.trail[0].y);
            for (let j = 1; j < star.trail.length; j++) {
                ctx.lineTo(star.trail[j].x, star.trail[j].y);
            }
            ctx.strokeStyle = `rgba(209, 255, 255, ${star.o})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // 绘制星星本身
        ctx.fillStyle = `rgba(209, 255, 255, ${star.o})`;
        ctx.fillRect(px, py, 1, 1);
    }
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    moveStars();
    drawStars();
}

// 处理窗口大小调整
window.addEventListener("resize", () => {
    resizeCanvas();
    // 重新初始化星星以适应新尺寸
    initializeStars();
});

// 初始化并开始动画
resizeCanvas();
initializeStars();
animate();