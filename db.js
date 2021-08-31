const db = new loki('notes', {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 3000
});

function databaseInitialize() {
    const notes = db.getCollection('notes');
    if (notes === null) {
        db.addCollection('notes');
    }
}

function loadCollection(collecction) {
    return new Promise((resolve, reject) => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(collecction) || db.addCollection(collecction);
            resolve(_collection);
        })

    });
}