
const dbName = 'history';
const version = 3;
const storeName = 'stack';

const dbPromise = new Promise((resolve, reject) => {
    let request = indexedDB.open(dbName, version);

    request.onerror = (event) => {
        console.error('Error opening database:', event.target.error);
        reject(event.target.error);
    };

    request.onupgradeneeded = (event) => {
        let db = event.target.result;
        // 检查是否已存在对象存储，如不存在则创建
        if (!db.objectStoreNames.contains(storeName)) {
            let objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('nameIndex', 'name');
        }
    };

    request.onsuccess = (event) => {
        resolve(event.target.result);
    };
});

const dbOperation = (transactionMode, operation) => {
    return dbPromise.then((db: any) => {
        const transaction = db.transaction(storeName, transactionMode);
        const objectStore = transaction.objectStore(storeName);
        return operation(objectStore, transaction);
    });
};


export const stepManager = {
    add(data) {
        return dbOperation('readwrite', (objectStore) => {
            return new Promise((resolve, reject) => {
                const request = objectStore.add(data);
                request.onsuccess = () => {
                    console.log('Data added successfully');
                    resolve(request.result);
                };
                request.onerror = reject;
            });
        });
    },
    findOne(id) {
        return dbOperation('readonly', (objectStore) => {
            return new Promise((resolve, reject) => {
                const request = objectStore.get(id);
                request.onsuccess = () => {
                    console.log('Data fetched successfully');
                    resolve(request.result);
                };
                request.onerror = reject;
            });
        });
    },
    findAll() {
        return dbOperation('readonly', (objectStore, transaction) => {
            return new Promise((res, rej) => {

                const request = objectStore.openCursor();
                const list = []
                request.onsuccess = (event) => {
                    const cursor = event.target.result
                    if (cursor) {
                        console.log('查询数据成功', cursor.value)
                        list.push(cursor.value)
                        cursor.continue()
                    } else {
                        console.log('no cursor')
                    }
                }
                request.onerror = (event) => {
                    rej(event)
                }
                if (transaction) {
                    transaction.oncomplete = () => {
                        console.log('遍历完成')
                        res(list)
                    }
                    transaction.onerror = function (e) {
                        rej(e)
                    }
                }

            })
        })
    },
    deleteOne(id) {
        return dbOperation('readwrite', (objectStore) => {
            return new Promise((res, rej) => {

                const findReq = objectStore.delete(id)
                findReq.onsuccess = (event) => {
                    console.log('删除数据成功')
                    res(event)
                }
                findReq.onerror = (event) => {
                    rej(event)
                }

            })
        })
    },
    delete(ids) {
        return dbOperation('readwrite', (objectStore, transaction) => {
            return new Promise((res, rej) => {
                const cursorReq = objectStore.openCursor()
                cursorReq.onsuccess = (e) => {
                    const cursor = e.target.result
                    if (cursor) {
                        if (ids.includes(cursor.value.id)) {
                            cursor.delete()
                        }
                        cursor.continue()
                    }
                }
                if (transaction) {
                    transaction.oncomplete = () => {
                        console.log('批量删除完成')
                        res('success')
                    }
                    transaction.onerror = function (e) {
                        rej(e)
                    }
                }

            })
        })
    }
}
// @ts-ignore
window.stepManager = stepManager