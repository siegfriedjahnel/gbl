self.addEventListener('install', async function () { 
  const cache = await caches.open('static-cache'); 
  cache.addAll(['styles.css', 'index.html', 'libs/qrcode.min.js']); 
}); 


addEventListener('fetch', event => {
  
  if (event.request.method != 'GET') return; //only GET-events

  
  event.respondWith(async function() {
    const dynamicCache = await caches.open('dynamic-cache');//create a dynamic cache
    
   
    if (navigator.onLine) {//if online
      const networkResponse = await fetch(event.request); //fetch data and update cache
      dynamicCache.put(event.request, networkResponse.clone());
    return networkResponse;
    }else{//if offline
      const cachedResponse = await dynamicCache.match(event.request); // get data from cache
      return cachedResponse;
    }
    
    
    
  }());
});