let db;

// init budgetdb
const request = indexedDB.open("budget",1);

// objectstore
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore("heldTransaction", {autoIncrement:true});
};