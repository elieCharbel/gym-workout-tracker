const totalLockers = 50;
let selectedLocker = null;

function initializeLockers() {
    const lockerContainerA = document.getElementById("lockerContainerA");
    const lockerContainerB = document.getElementById("lockerContainerB");

    for (let i = 1; i <= totalLockers; i++) {
        let locker = document.createElement("div");
        locker.className = "locker available";
        locker.id = "locker" + i;
        locker.innerText = i;
        locker.addEventListener("click", toggleLockerStatus);

        if (i <= 25) {
            lockerContainerA.appendChild(locker);
        } else {
            lockerContainerB.appendChild(locker);
        }
    }
}

function toggleLockerStatus() {
    if (this.classList.contains("taken")) return;

    // Deselect previous selection
    if (selectedLocker) {
        selectedLocker.classList.remove("taken");
        selectedLocker.classList.add("available");
    }

    // Select new locker
    this.classList.remove("available");
    this.classList.add("taken");
    selectedLocker = this;
}

document.addEventListener("DOMContentLoaded", initializeLockers);