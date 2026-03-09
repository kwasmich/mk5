import { initIndexedDB, simpleCreate, simpleGetAll, simpleIndexedGetAll } from "/util/indexed_db.js";



export class RTMSeries extends Object {
    id;
    name;
    taglist;
    color;
    targetInterval;
    averageInterval;
    quantils;
}



export class RTMEvent extends Object {
    id;
    seriesID;
    dateTime;
    payload;

    constructor(...args) {
        const self = super(args);
        return self;
    }
}



class DBService {
    #db;

    constructor() {
        Object.seal(this);
        this._init();
    }


    async _init() {
        const onupgradeneeded = (event) => {
            console.log('onupgradeneeded', event);
            const db = event.target.result;

            const series = db.createObjectStore('seriesTable', { keyPath: 'id', autoIncrement: true });

            const events = db.createObjectStore('eventTable', { keyPath: 'id', autoIncrement: true });
            events.createIndex('seriesID_idx', 'seriesID', { unique: false });
        };

        this.#db = await initIndexedDB('eventStore', 1, onupgradeneeded);
    }


    async addSeries(name, taglist, color, targetInterval) {
        const payload = { id: undefined, name, taglist: taglist ?? [], color, targetInterval, averageInterval: targetInterval, quantils: [] }
        return simpleCreate(this.#db, "seriesTable", payload);
    }


    async getSeries() {
        const seriesList = await simpleGetAll(this.#db, "seriesTable");
        seriesList.forEach((series) => Object.setPrototypeOf(series, RTMSeries.prototype));
        return seriesList;
    }


    async addEvent(seriesID, dateTime, data) {
        const payload = { id: undefined, seriesID, dateTime: dateTime ?? new Date(), data };
        return simpleCreate(this.#db, "eventTable", payload);
    }


    async getEvents(seriesID) {
        const seriesList = await simpleIndexedGetAll(this.#db, "eventTable", "seriesID_idx", seriesID);
        seriesList.forEach((series) => Object.setPrototypeOf(series, RTMEvent.prototype));
        return seriesList;
    }
}


export default new DBService();

// export default {};

// setTimeout(() => {
//     console.log('delete');
//     const request = globalThis.indexedDB.deleteDatabase('eventStore');

//     request.onerror = (event) => {
//         console.error('onerror', event);
//     };

//     request.onsuccess = (event) => {
//         console.info('onsuccess', event);
//     };
// }, 10_000);

