const menu = document.getElementById('radialMenu');
const fab = document.getElementById('fabRadial');
const menuItems = document.querySelectorAll('.menu-item');

fab.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    fab.classList.toggle('open', isOpen);
    fab.innerHTML = isOpen
        ? '<i>+</i>'
        : '<i>=</i>';
});

menuItems.forEach(item => {
    // 存储原始文本
    item.dataset.originalText = item.innerHTML;

    item.addEventListener('mouseenter', () => {
        if (menu.classList.contains('open')) {
            item.innerHTML = '<i>★</i>';
        }
    });

    item.addEventListener('mouseleave', () => {
        if (menu.classList.contains('open')) {
            item.innerHTML = item.dataset.originalText;
        }
    });
});