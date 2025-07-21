// 导入anime.js库
import { animate, createTimeline, createTimer, stagger, utils } from 'https://esm.sh/animejs';

/**
 * 初始化封装的“关于我”动画板块
 * @param {string} containerSelector - 主容器的CSS选择器
 */
function initAboutMeAnimation(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error("Animation container not found:", containerSelector);
        return;
    }

    // --- 1. 粒子背景动画 (anime.js) ---
    const creatureEl = container.querySelector('.particle-creature');
    const viewport = { w: container.clientWidth, h: container.clientHeight };
    const cursor = { x: 0, y: 0 };
    const rows = 13;
    const grid = [rows, rows];
    const from = 'center';

    if (creatureEl.children.length === 0) {
        for (let i = 0; i < (rows * rows); i++) {
            creatureEl.appendChild(document.createElement('div'));
        }
    }

    const particuleEls = creatureEl.querySelectorAll('div');
    const scaleStagger = stagger([2, 5], { ease: 'inQuad', grid, from });
    const opacityStagger = stagger([1, .1], { grid, from });

    utils.set(creatureEl, { width: rows * 10 + 'em', height: rows * 10 + 'em' });
    utils.set(particuleEls, {
        x: 0, y: 0, scale: scaleStagger, opacity: opacityStagger,
        background: stagger([80, 20], { grid, from, modifier: v => `hsl(4, 70%, ${v}%)` }),
        boxShadow: stagger([8, 1], { grid, from, modifier: v => `0px 0px ${utils.round(v, 0)}em 0px var(--red)` }),
        zIndex: stagger([rows * rows, 1], { grid, from, modifier: utils.round(0) }),
    });

    const pulse = () => {
        animate(particuleEls, {
            keyframes: [
                { scale: 5, opacity: 1, delay: stagger(90, { start: 1650, grid, from }), duration: 150 },
                { scale: scaleStagger, opacity: opacityStagger, ease: 'inOutQuad', duration: 600 }
            ],
        });
    }

    const mainLoop = createTimer({
        frameRate: 15,
        onUpdate: () => {
            animate(particuleEls, {
                x: cursor.x, y: cursor.y,
                delay: stagger(40, { grid, from }),
                duration: stagger(120, { start: 750, ease: 'inQuad', grid, from }),
                ease: 'inOut', composition: 'blend',
            });
        }
    });

    const autoMove = createTimeline()
        .add({ targets: cursor, x: [-viewport.w * .25, viewport.w * .25], modifier: x => x + Math.sin(mainLoop.currentTime * .0007) * viewport.w * .2, duration: 3000, ease: 'inOutExpo', alternate: true, loop: true, onBegin: pulse, onLoop: pulse }, 0)
        .add({ targets: cursor, y: [-viewport.h * .25, viewport.h * .25], modifier: y => y + Math.cos(mainLoop.currentTime * .00012) * viewport.h * .2, duration: 1000, ease: 'inOutQuad', alternate: true, loop: true }, 0);

    const manualMovementTimeout = createTimer({ duration: 1500, onComplete: () => autoMove.play() });

    const followPointer = e => {
        const event = e.type === 'touchmove' ? e.touches[0] : e;
        const rect = container.getBoundingClientRect();
        cursor.x = (event.clientX - rect.left) - (viewport.w * 0.5);
        cursor.y = (event.clientY - rect.top) - (viewport.h * 0.5);
        autoMove.pause();
        manualMovementTimeout.restart();
    }

    // --- 2. SVG文本动画 (GSAP) ---
    const tl = gsap.timeline({
        defaults: { duration: 2, yoyo: true, repeat: -1, ease: 'power2.inOut' }
    })
        .fromTo(container.querySelectorAll('.left-text, .right-text'), {
            svgOrigin: '448 360', // 调整动画原点以匹配新的分割线 (1280 * 0.35)
            skewY: (i) => [-30, 15][i],
            scaleX: (i) => [0.6, 0.85][i],
            x: 200
        }, {
            skewY: (i) => [-15, 30][i],
            scaleX: (i) => [0.85, 0.6][i],
            x: -200
        })
        .play(.5);

    const tl2 = gsap.timeline({ repeat: -1, yoyo: true });
    container.querySelectorAll('text').forEach((t, i) => {
        tl2.add(gsap.fromTo(t, {
            xPercent: -100, x: 700
        }, {
            duration: 1, xPercent: 0, x: 640, ease: 'sine.inOut'
        }), i % 4 * 0.2);
    });

    // --- 3. 事件监听 ---
    // 只在当前容器内监听鼠标移动
    container.onpointermove = (e) => {
        followPointer(e);
        tl.pause();
        tl2.pause();
        const rect = container.getBoundingClientRect();
        const progress = (e.clientX - rect.left) / rect.width;
        gsap.to([tl, tl2], {
            duration: 2,
            ease: 'power4',
            progress: progress
        });
    };

    // 窗口缩放时更新视口尺寸
    window.addEventListener('resize', () => {
        viewport.w = container.clientWidth;
        viewport.h = container.clientHeight;
    });
}

// DOM加载完毕后，初始化动画
document.addEventListener('DOMContentLoaded', () => {
    initAboutMeAnimation('#about-me-section-wrapper');
});