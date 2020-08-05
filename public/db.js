let db;

// init budgetdb
const request = indexedDB.open("budget",1);

// objectstore
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore("heldTransaction", {autoIncrement:true});
};

request.onsuccess = (event) => {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    };
};

request.onerror = function(event) {
    console.log("Error: " + event.target.errorCode);
};

// if post fails
function saveRecord(record) {

    const transaction = db.transaction(["heldTransaction"], "readwrite");
    // Accessing heldTransaction
    const hTStore = transaction.objectStore("heldTransaction");
  
    hTStore.add(record);
}