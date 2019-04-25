document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('button').addEventListener('click', () => {
    const text = document.getElementById('servergroup').value;
    localStorage.setItem('servergroup', text);

    //Update comment
    chrome.tabs.query(
      {
        currentWindow: true,
        active: true
      },
      tabs => chrome.tabs.sendMessage(tabs[0].id, localStorage.getItem('servergroup'))
    );

    //Show message that settings are saved
    document.getElementById('message').style.display = 'block';
  }, false);

  //Update already set value
  if (localStorage.getItem('servergroup')) {
    document.getElementById('servergroup').value = localStorage.getItem('servergroup');
  }
}, false);