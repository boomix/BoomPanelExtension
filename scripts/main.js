//Test page for extension - https://steamcommunity.com/id/boomix69
//SteamID is public steamcommunity.com value, that is available for everyone
//Getting steamID from report popup
var steamid = $("input[name = 'abuseID']").val();
var groupName = (localStorage.getItem("servergroup")) ? (localStorage.getItem("servergroup")) : 'BoomPanel.com';
var pressedButton = false;

//If steamID somehow is not found, then try second method to get it (user is not logged in)
if (steamid == null) {
    var html = $('.responsive_page_template_content').html();
    var version = $(html).filter('script').html();
    version = version.split('"');
    steamid = version[7];
}

//If it didn't get any steamID value, then we are in wrong page? So dont do anything
if (steamid != null && $('.playerAvatarAutoSizeInner').length != 0) {

    //Create simple border in right side
    $('.profile_rightcol').prepend(
        '<div class="bgstyle">' +
        '       <div class="toptitle">' +
        '			' + groupName + ' ' +
        '			<button class="copyclip" id="steamid" title="Copy steamid to clipboard">Steam ID</button>' +
        '		</div>' +
        '	<div id="server-info"></div>' +
        '</div>'
    );


    //On click for steamID copy
    $(document).ready(function () {
        $('#steamid').click(function () {
            pressedButton = true;
            document.execCommand('copy')
        });
    });

    //On copy event
    document.addEventListener('copy', function (e) {
        if (pressedButton) {
            pressedButton = false;
            e.clipboardData.setData('text/plain', steamid);
            e.preventDefault();
        }
    });


    //Request data, how much time has been spent in IDENTY.LV servers | JSON data is returned
    $.ajax({
        dataType: "json",
        url: 'https://boompanel.com/api/extension/' + steamid + '/' + groupName,
        type: 'get',
        success: function (data, status) {

            var serverIP = -1, serverName = -1, lastOnline = -1;

            $('#server-info').append('<table id="srv-info">');

            if (!data.error) {

                for (var i = 0; i < data.length; i++) {

                    //Update last online
                    if (data[i].last_online > lastOnline)
                        lastOnline = data[i].last_online;

                    //Check if is admin
                    var isonline = ((data[i].online_now == 1) ? 'class="player_online"' : '');

                    //Update serverIP and server name where player is online
                    if (data[i].online_now == 1) {
                        serverIP = data[i].server_ip;
                        serverName = data[i].server_name;
                    }

                    //Append to web
                    $('#srv-info').append(
                        '	<tr>' +
                        '		<td ' + isonline + '></td>' +
                        '		<td>' + (data[i].server_name).toUpperCase() + '</td>' +
                        '		<td>' + (data[i].online_time) + '</td>' +
                        '	</tr>'
                    );

                }

            } else {

                $('#srv-info').append(
                    '	<tr>' +
                    '		<td hidden></td>' +
                    '		<td class="neverplayed">' + data.error + '</td>' +
                    '		<td></td>' +
                    '	</tr>'
                );

            }

            $('#server-info').append('</table>');


            //Add last online
            if (serverIP != -1 && serverName != -1) {
                $('#server-info').append(
                    '<p class="info">Currently online in ' + serverName + '</p>' +
                    '<p class="connect">' +
                    '   <a href="steam://connect/' + serverIP + '">Connect now!</a>' +
                    '</p>'
                );
            } else if (!data.error) {
                $('#server-info').append(
                    '<p class="info">Online ' +
                    '   <span style="color:#cacaca">' + moment.unix(lastOnline).fromNow() + '</span>' +
                    '</p>');
            }



        }

    });
}

chrome.runtime.onMessage.addListener(function (servergroup) {
    localStorage.setItem("servergroup", servergroup);
    groupName = servergroup;
});