var serverAddress = "";

chrome.storage.onChanged.addListener(function(changes, namespace) {
        console.info(changes);
        for (key in changes) {
          if (key == "serverAddress") {
            var storageChange = changes[key];
            serverAddress = storageChange.newValue;
          }
      }
    });

chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    if(!text) return;
    var xhr = new XMLHttpRequest();
    chrome.storage.sync.get('buildServerAddress', function(data) {
      serverAddress = data.buildServerAddress;
    });
    xhr.open("GET", "https://" + serverAddress + "/rest/api/latest/quicksearch?searchTerm=" + text, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        // JSON.parse does not evaluate the attacker's scripts.
        var resp = JSON.parse(xhr.responseText);
        suggestionList = [];
        for (var result_id in resp.searchResults) {
          result = resp.searchResults[result_id];
          suggestion = result['entity']['branchName'] + ' (' + result['entity']['key'] + ')';
          suggestionList.push({
            content: suggestion,
            description: suggestion, 
          });
        }
        suggest(suggestionList);
      }
    }
    xhr.send();
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    // Get the key out of the suggestion.
    key = text.split(")")[0].split("(")[1]
    navigate("https://" + serverAddress + "/browse/" + key);
  });

function navigate(url) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: url});
    });
  }