function addAlert(message: string, setMessage: (x: string) => void, type: string = "alert-success") {
    // Close previous alert if it exists
    document.getElementById("closeAlert")?.click();
    if (message === "") return;

    const alertDiv = document.createElement("div");
    alertDiv.className = `alert ${type} alert-dismissable fade show`;
    alertDiv.innerHTML = `${message}
    <button type="button" class="close" id="closeAlert" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>`;
    alertDiv.onclick = () => setMessage("");
    document.getElementById("alertPlaceholder")?.appendChild(alertDiv);
}

export { addAlert }