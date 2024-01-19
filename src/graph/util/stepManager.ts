import { UpdateShapeValue } from "../service";

const dbName = 'history';
const version = 3;
const storeName = 'stack';

const dbPromise = new Promise((resolve, reject) => {
    let request = indexedDB.open(dbName, version);

    request.onerror = (event: any) => {
        console.error('Error opening database:', event.target.error);
        reject(event.target.error);
    };

    request.onupgradeneeded = (event: any) => {
        let db = event.target.result;
        // 检查是否已存在对象存储，如不存在则创建
        if (!db.objectStoreNames.contains(storeName)) {
            // 通过 shapeId 作为唯一值
            let objectStore = db.createObjectStore(storeName, { keyPath: 'stepId', autoIncrement: false });
            objectStore.createIndex('nameIndex', 'name');
        }
    };

    request.onsuccess = (event: any) => {
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

export enum ChangeType {
    INSERT = 1, // 插入对象
    UPDATE = 2, // 更新某个或多个字段
    DELETE = 3, // 删除对象
}

export class Change {
    constructor(public type: ChangeType, public shapeId: string) {

    }

    /** 新增和删除不需要这两个值 */
    oldValue?: UpdateShapeValue; // 更新前的key-value对象的 json串，只记录变更的字段即可，undo的时候会用这个keyValue去update对应的table
    newValue?: UpdateShapeValue; // 更新后的key-value对象的 json串，只记录变更的字段即可，redo的时候会用这个keyValue去update对应的table
}

export class Step {


    constructor(public stepId: string, public index: number /**序号 */, public changes: Change[]) {

    }
}

export const stepManager = {
    add(data: Step) {
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
    },
    findPre(id) {
        return dbOperation('readonly', (objectStore) => {
            return new Promise((res, rej) => {

                const request = objectStore.openCursor();
                const list = []
                request.onsuccess = (event) => {
                    const cursor = event.target.result
                    if (cursor) {
                        console.log('查询数据成功', cursor.value)
                        const value = cursor.value
                        /**找到目标 */
                        if (value.stepId === id) {
                            const prev = list[list.length - 1]
                            res({ step: value, prevStepId: prev?.stepId })
                        } else {
                            list.push(value)
                            cursor.continue()
                        }
                    } else {
                        rej('未找到')
                        console.log('no cursor')
                    }
                }
                request.onerror = (event) => {
                    rej(event)
                }
            })
        })
    },
    findNext(id) {
        return dbOperation('readonly', (objectStore) => {
            return new Promise((res, rej) => {
                const request = objectStore.openCursor();
                let isFindTarget = false
                request.onsuccess = (event) => {
                    const cursor = event.target.result
                    if (cursor) {
                        console.log('查询数据成功', cursor.value)
                        const value = cursor.value
                        if (id === undefined) {
                            res(value) // 说明是回退到头了
                            return
                        }
                        // 目标下一个元素
                        if (isFindTarget) {
                            res(value)
                            return
                        }

                        /**找到目标 */
                        if (value.stepId === id) {
                            isFindTarget = true
                        }
                        cursor.continue()
                    } else {
                        rej('未找到')
                        console.log('no cursor')
                    }
                }
                request.onerror = (event) => {
                    rej(event)
                }
            })
        })
    },
    deleteAfterIndex(index: number) {
        return dbOperation('readwrite', (objectStore, transaction) => {
            return new Promise((res, rej) => {

                const request = objectStore.openCursor();
                const list = []
                request.onsuccess = (event) => {
                    const cursor = event.target.result
                    if (cursor) {
                        console.log('查询数据成功', cursor.value)
                        const value = cursor.value as Step
                        if (value.index > index) {
                            objectStore.delete(value.stepId)
                        }
                        cursor.continue()
                    }
                }
                request.onerror = (event) => {
                    rej(event)
                }

                if (transaction) {
                    transaction.oncomplete = () => {
                        console.log('deleteAfterIndex 遍历完成')
                        res('success')
                    }
                    transaction.onerror = function (e) {
                        rej(e)
                    }
                }
            })
        })
    },
    clear() {
        return dbOperation('readwrite', objectStore => {
            return new Promise((res, rej) => {
                // 清空 objectStore
                const clearRequest = objectStore.clear();

                clearRequest.onsuccess = function (event) {
                    // 处理成功清空 objectStore 后的逻辑
                    console.log('ObjectStore has been cleared.');
                    res('success')
                };

                clearRequest.onerror = function (event) {
                    // 处理error
                    console.error('ClearRequest error:', event);
                    rej(event)
                }
            })
        })
    }
}