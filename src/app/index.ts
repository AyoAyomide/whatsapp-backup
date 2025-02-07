import { openDB, deleteDB, wrap, unwrap } from 'idb';

async function doDatabaseStuff() {
    const db = await openDB("demo", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("notes"))
                db.createObjectStore("notes", { keyPath: "id" });
        }
    });

    const data = await db.getAll("notes");

    console.dir(data);

}

doDatabaseStuff();

