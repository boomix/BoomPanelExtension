/**
 * Test page for extension - https://steamcommunity.com/id/boomix69
 * SteamID is public steamcommunity.com value, that is available for everyone
 * Getting steamID from report popup
 */
let steamId = $("input[name='abuseID']").val();
let groupName = (localStorage.getItem("servergroup")) ? (localStorage.getItem("servergroup")) : 'No group set';
let pressedButton = false;

// If steamID somehow is not found, then try second method to get it (user is not logged in)
if (steamId == null) {
  let html = $('.responsive_page_template_content').html();
  let version = $(html).filter('script').html();
  version = version.split('"');
  steamId = version[7];
}

// If it didn't get any steamID value, then we are in wrong page? So don't do anything
if (steamId != null && $('.playerAvatarAutoSizeInner').length !== 0) {
  // Create simple border in right side
  $('.profile_rightcol').prepend(
    '<div class="bgstyle">' +
    '  <div class="toptitle">' +
    '    ' + groupName + ' ' +
    '		 <button class="copyclip" id="steamId" title="Copy steamId to clipboard">Steam ID</button>' +
    '  </div>' +
    '	 <div id="server-info"></div>' +
    '</div>'
  );

  // On click for steamID copy
  $(document).ready(() => {
    $('#steamId').click(() => {
      pressedButton = true;
      document.execCommand('copy')
    });
  });

  // On copy event
  document.addEventListener('copy', e => {
    if (pressedButton) {
      pressedButton = false;
      e.clipboardData.setData('text/plain', steamId);
      e.preventDefault();
    }
  });

  // Request data, how much time has been spent in IDENTY.LV servers | JSON data is returned
  $.ajax({
    dataType: "json",
    url: 'https://boompanel.com/api/extension/' + steamId + '/' + groupName,
    type: 'get',
    success: data => {
      const serverInfo = $('#server-info');
      let serverIP = -1, serverName = -1, lastOnline = -1;

      serverInfo.append('<table id="srv-info">');

      if (!data.error) {
        for (let i = 0; i < data.length; i++) {
          // Update last online
          if (data[i].last_online > lastOnline) {
            lastOnline = data[i].last_online;
          }

          // Check if is admin
          let isOnline = ((data[i].online_now === 1) ? 'class="player_online"' : '');

          // Update serverIP and server name where player is online
          if (data[i].online_now === 1) {
            serverIP = data[i].server_ip;
            serverName = data[i].server_name;
          }

          // Append to web
          $('#srv-info').append(
            '	<tr>' +
            '		<td ' + isOnline + '></td>' +
            '		<td>' + (data[i].server_name).toUpperCase() + '</td>' +
            '		<td>' + (data[i].online_time) + '</td>' +
            '	</tr>'
          );
        }
      } else {
        $('#srv-info').append(
          '<tr>' +
          '  <td hidden></td>' +
          '	 <td class="neverplayed">' + data.error + '</td>' +
          '	 <td></td>' +
          '</tr>'
        );
      }

      serverInfo.append('</table>');

      // Add last online
      if (serverIP !== -1 && serverName !== -1) {
        serverInfo.append(
          '<p class="info">Currently online in ' + serverName + '</p>' +
          '<p class="connect">' +
          '  <a href="steam://connect/' + serverIP + '">Connect now!</a>' +
          '</p>'
        );
      } else if (!data.error) {
        serverInfo.append(
          '<p class="info">' +
          '  Last Online <span style="color: #cacaca">' + moment.unix(lastOnline).fromNow() + '</span>' +
          '</p>'
        );
      }
    }
  });
}

chrome.runtime.onMessage.addListener(servergroup => {

  if (groupName != servergroup) {
    localStorage.setItem("servergroup", servergroup);
    groupName = servergroup;
    location.reload();
  }

});
