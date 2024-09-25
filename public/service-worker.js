const CACHE_NAME = 'static-cache-1';
const CACHE_ASSETS = [
    '/icons/144x144.png',
    '/icons/192x192.png',
    '/icons/512x512.png'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_ASSETS)
                .catch((error) => {
                    console.error("Falha ao adicionar os recursos ao cache: " + error);
                });
        })
    );
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-tasks') {
        event.waitUntil(syncTasksWithFirebase());
    }
});

async function syncTasksWithFirebase() {
    const tasks = await getTasksFromIndexedDB();
    for (const task of tasks) {
        await addTaskToFirestore(task); // Assure this function exists
    }
}

async function getTasksFromIndexedDB() {
    // Implement logic to fetch tasks from IndexedDB
}
