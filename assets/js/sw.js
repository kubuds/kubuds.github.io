/**
 * Service Worker for Kubuds Website
 * 提供缓存策略，提升网站性能
 */

const CACHE_NAME = 'kubuds-v1.0.0';
const STATIC_CACHE = 'kubuds-static-v1.0.0';
const IMAGE_CACHE = 'kubuds-images-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
    '/',
    '/assets/css/style.css',
    '/assets/css/lazy-loading.css',
    '/assets/js/lazy-loading.js',
    '/assets/js/main.js',
    '/assets/plugins/bootstrap/bootstrap.min.css',
    '/assets/plugins/bootstrap/bootstrap.min.js',
    '/assets/plugins/Ionicons/css/ionicons.min.css',
    '/assets/plugins/jquery/jquery.min.js'
];

// 需要缓存的图片资源
const IMAGE_ASSETS = [
    '/assets/img/home/home.webp',
    '/assets/img/service/service.webp',
    '/assets/img/about/about.webp',
    '/assets/img/community/community.webp',
    '/assets/img/common-background.webp',
    '/assets/img/logos/kubuds_en.webp'
];

// 安装事件
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            // 缓存静态资源
            caches.open(STATIC_CACHE).then(cache => {
                return cache.addAll(STATIC_ASSETS);
            }),
            // 缓存关键图片
            caches.open(IMAGE_CACHE).then(cache => {
                return cache.addAll(IMAGE_ASSETS);
            })
        ])
    );
    
    // 立即激活新的 Service Worker
    self.skipWaiting();
});

// 激活事件
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // 删除旧版本的缓存
                    if (cacheName !== STATIC_CACHE && 
                        cacheName !== IMAGE_CACHE && 
                        cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // 立即控制所有页面
    self.clients.claim();
});

// 拦截请求
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // 只处理同源请求
    if (url.origin !== location.origin) {
        return;
    }
    
    event.respondWith(
        caches.match(request).then(response => {
            // 如果缓存中有响应，直接返回
            if (response) {
                return response;
            }
            
            // 否则发起网络请求
            return fetch(request).then(fetchResponse => {
                // 检查响应是否有效
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                    return fetchResponse;
                }
                
                // 克隆响应
                const responseToCache = fetchResponse.clone();
                
                // 根据资源类型选择缓存策略
                if (request.destination === 'image') {
                    // 图片资源：缓存到图片缓存
                    caches.open(IMAGE_CACHE).then(cache => {
                        cache.put(request, responseToCache);
                    });
                } else if (request.destination === 'style' || 
                          request.destination === 'script' ||
                          request.destination === 'document') {
                    // 静态资源：缓存到静态缓存
                    caches.open(STATIC_CACHE).then(cache => {
                        cache.put(request, responseToCache);
                    });
                }
                
                return fetchResponse;
            }).catch(error => {
                console.error('Fetch failed:', error);
                
                // 如果是图片请求失败，返回占位符
                if (request.destination === 'image') {
                    return new Response(
                        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f5f5f7"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">图片加载失败</text></svg>',
                        { headers: { 'Content-Type': 'image/svg+xml' } }
                    );
                }
                
                throw error;
            });
        })
    );
});

// 消息处理
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 后台同步（如果支持）
if ('sync' in self.registration) {
    self.addEventListener('sync', event => {
        if (event.tag === 'background-sync') {
            event.waitUntil(
                // 执行后台同步任务
                console.log('Background sync triggered')
            );
        }
    });
}
