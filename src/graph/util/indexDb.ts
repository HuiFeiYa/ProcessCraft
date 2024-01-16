// 创建或打开数据库
const dbName = 'history'
const version = 3
const storeName = 'stack'

function createDb() {
    return new Promise((res) => {
        let request = indexedDB.open(dbName, version);
        let db;
        let objectStore;
        let transaction;
        request.onerror = function (event) {
            console.log('Error opening database:', event.target.error);
        };

        request.onupgradeneeded = function (event) {
            // 获取数据库对象
            db = event.target.result;

            // 创建一个名为 "myObjectStore" 的对象存储空间，指定 keyPath 为 "id"
            let objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });

            // 创建一个名为 "nameIndex" 的索引，用于根据 "name" 属性进行搜索
            objectStore.createIndex('nameIndex', 'name');
        };

        request.onsuccess = function (event) {
            // 获取数据库对象
            db = event.target.result;
            // 检查对象存储空间是否存在
            if (!db.objectStoreNames.contains(storeName)) {
                console.log('Object store not found');
                return;
            }
            // 新增数据到对象存储空间
            transaction = db.transaction([storeName], 'readwrite');
            objectStore = transaction.objectStore(storeName);
            res(db)
        };
    })
}


export const stepManager = {};
createDb().then((db: any) => {
    const utils = {
        add(data) {
            const transaction = db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
            return new Promise((res, rej) => {

                const addReq = objectStore.add(data)
                addReq.onsuccess = (event) => {
                    console.log('添加数据成功')
                    res(event)
                }
                addReq.onerror = (event) => {
                    rej(event)
                }

            })
        },
        findOne(id) {
            const transaction = db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
            return new Promise((res, rej) => {

                const findReq = objectStore.get(id)
                findReq.onsuccess = (event) => {
                    console.log('查询数据成功')
                    res(event.target.result)
                }
                findReq.onerror = (event) => {
                    rej(event)
                }

            })
        },
        findAll() {
            const transaction = db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
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
        },
        deleteOne(id) {
            const transaction = db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
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
        },
        delete(ids) {
            const transaction = db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
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
        }
    }
    Object.assign(indexDbUtil, utils)
})
// @ts-ignore
window.indexDbUtil = indexDbUtil