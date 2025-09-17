/**
 * 图片懒加载优化脚本
 * 确保文字内容优先显示，图片延迟加载
 */

(function() {
    'use strict';

    // 配置选项
    const config = {
        rootMargin: '50px 0px',
        threshold: 0.1,
        fadeInDuration: 300
    };

    // 预加载图片函数
    function preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    // 背景图片懒加载
    function initBackgroundLazyLoading() {
        const backgroundElements = [
            { selector: '.home-slider', imageSrc: '/assets/img/home/home.webp' },
            { selector: '.slider-service-bg', imageSrc: '/assets/img/service/service.webp' },
            { selector: '.slider-solution-bg', imageSrc: '/assets/img/solution/solution.webp' },
            { selector: '.slider-about-bg', imageSrc: '/assets/img/about/about.jpg' },
            { selector: '.slider-community-bg', imageSrc: '/assets/img/community/community.webp' },
            { selector: '.slider-common-bg', imageSrc: '/assets/img/common-background.jpg' },
            { selector: '.slider-career-bg', imageSrc: '/assets/img/career/jigsaw.jpg' }
        ];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const imageSrc = element.dataset.bgSrc;
                    
                    if (imageSrc && !element.classList.contains('loaded')) {
                        preloadImage(imageSrc).then(() => {
                            element.style.backgroundImage = `url(${imageSrc})`;
                            element.classList.add('loaded');
                        }).catch(error => {
                            console.warn('Failed to load background image:', imageSrc, error);
                        });
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, config);

        backgroundElements.forEach(({ selector, imageSrc }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.dataset.bgSrc = imageSrc;
                observer.observe(element);
            });
        });
    }

    // 普通图片懒加载
    function initImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    preloadImage(src).then(() => {
                        img.src = src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                    }).catch(error => {
                        console.warn('Failed to load image:', src, error);
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        }, config);

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 页面加载完成后立即显示文字内容
    function prioritizeTextContent() {
        // 确保文字内容立即可见
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .block');
        textElements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
        });
    }

    // 优化关键渲染路径
    function optimizeCriticalRenderingPath() {
        // 延迟加载非关键CSS
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-lazy]');
        nonCriticalCSS.forEach(link => {
            link.rel = 'stylesheet';
            link.removeAttribute('data-lazy');
        });
    }

    // 初始化函数
    function init() {
        // 立即显示文字内容
        prioritizeTextContent();
        
        // 延迟初始化懒加载，确保文字先显示
        requestAnimationFrame(() => {
            initBackgroundLazyLoading();
            initImageLazyLoading();
            optimizeCriticalRenderingPath();
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 导出函数供外部调用
    window.lazyLoading = {
        init: init,
        preloadImage: preloadImage
    };

})();
