// Saves options to chrome.storage.sync.
function save_options() {
  var serverAddress = document.getElementById('serverAddress').value;
  chrome.storage.sync.set({
    "buildServerAddress": serverAddress,
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    console.info('saved');

    status.classList.remove('d-none')
    setTimeout(function () {
      status.classList.add('d-none')
    }, 2000);
  });
}

// Restores the state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    buildServerAddress: ''
  }, function (items) {
    document.getElementById('serverAddress').value = items.buildServerAddress;
    console.info(items.buildServerAddress);
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);