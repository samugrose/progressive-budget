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

function checkDatabase() {
    const transaction = db.transaction(["heldTransaction"], "readwrite");
    const hTStore = transaction.objectStore("heldTransaction");
    const getAll = hTStore.getAll();

    getAll.onsuccess = function() {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(() => {
          const transaction = db.transaction(["heldTransaction"], "readwrite");
          const hTStore = transaction.objectStore("heldTransaction");
          hTStore.clear();
        });
      }
    };
  }

window.addEventListener("online", checkDatabase);