var sendReq = getXmlHttpRequestObject();
var receiveReq = getXmlHttpRequestObject();
var receiveReqUsers = getXmlHttpRequestObject();
var lastMessage = 0;
var lastTextMessage = "";
var lastUserUpdate = 1;
var FlageSoundOn = -1;

var mTimer;
var usersTimer;

var TimerNewMsg;
var FlageMsg = 1;
var FlageIsOnFocus = 1;
var LoginType = -1;
var intMsgTimeA = 0;
var intMsgTimeB = 0;
var intMsgCountB = 0;
var intMsgCountA = 0;

if (/*@cc_on!@*/ false) {
  // check for Internet Explorer
  document.onfocusin = onFocus;
  document.onfocusout = onBlur;
} else {
  window.onfocus = onFocus;
  window.onblur = onBlur;
}

function onBlur() {
  FlageIsOnFocus = 0;
}
function onFocus() {
  FlageIsOnFocus = 1;
  document.title = "2all";
}

var G_SessionID = 744;
var G_Chat_ID = 7502;

function getChatLoad() {
  G_SessionID = $("#SessionID").val();
  $("#SessionID").val("");

  G_Chat_ID = $("#chat_id").val(); // document.getElementById("chat_id").value
  //$("#chat_id").val(''); // need chat id for login submit

  $("body").on("click", ".clsYoutubeShow", function () {
    var yid = $(this).attr("YoutubeID");
    setChatPlayYoutubeShow(yid);
  });
}
function startChat() {
  //Set the focus to the Message Box.
  document.getElementById("txt_message").focus();
  //Start Recieving Messages.
  //document.getElementById('DivLog').innerHTML = document.getElementById('DivLog').innerHTML + '<BR> startChat  '
  getChatText();
  getChatUsers();
}
//Gets the browser specific XmlHttpRequest Object
function getXmlHttpRequestObject() {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    return new ActiveXObject("Microsoft.XMLHTTP");
  } else {
    document.getElementById("p_status").innerHTML =
      "Status: Cound not create XmlHttpRequest Object.  Consider upgrading your browser.";
  }
}

//Gets the current messages from the server
function getChatText() {
  var chat_id;
  var SessionID;
  SessionID = G_SessionID;
  chat_id = G_Chat_ID;
  if (receiveReq.readyState == 4 || receiveReq.readyState == 0) {
    receiveReq.open(
      "GET",
      "http://chat.2all.co.il/getChat.asp?chat=" +
        chat_id +
        "&last=" +
        lastMessage +
        "&SessionID=" +
        SessionID,
      true
    );
    receiveReq.onreadystatechange = handleReceiveChat;
    receiveReq.send(null);
  }
}

//Function for handling the return of chat text
function handleReceiveChat() {
  var int1;
  var int2;
  var Last_lastMessage;

  if (receiveReq.readyState == 4) {
    var chat_div = document.getElementById("div_chat");
    var chat_div_Parent = document.getElementById("div_chat_parent");
    // alert(receiveReq.responsetext);
    // document.writeln(receiveReq.responsetext);
    // document.getElementById('div_chat').innerHTML = receiveReq.responsetext;

    //chat_div.innerHTML += '<ul class="media-list">';
    //alert(receiveReq.responsetext);
    var TmpMsg = "";
    if (receiveReq.responseXML != null) {
      var xmldoc = receiveReq.responseXML;
      var message_nodes = xmldoc.getElementsByTagName("message");

      var n_messages = message_nodes.length;
      // alert(n_messages);

      for (i = n_messages - 1; i >= 0; i--) {
        var user_node = message_nodes[i].getElementsByTagName("user");
        var text_node = message_nodes[i].getElementsByTagName("text");
        var time_node = message_nodes[i].getElementsByTagName("time");
        var LoginType_node = message_nodes[i].getElementsByTagName("LoginType");
        /*
				    chat_div.innerHTML += '<font class="chat_time">' + time_node[0].firstChild.nodeValue + '</font><br>';				
				    if (LoginType_node[0].firstChild.nodeValue=='1')
				    {
					    chat_div.innerHTML += '<img src="http://chat.2all.co.il/PNG/UserGuest.jpg" align=texttop border=0 alt="אורח">' ;
				    }
				    else if (LoginType_node[0].firstChild.nodeValue=='2')
				    {
					    chat_div.innerHTML += '<img src="http://chat.2all.co.il/PNG/UserMember.jpg" align=texttop border=0 alt="משתמש רשום">' ;
				    }
				    else if (LoginType_node[0].firstChild.nodeValue=='3')
				    {
					    chat_div.innerHTML += '<img src="http://chat.2all.co.il/PNG/UserAdmin.jpg" align=texttop border=0 alt="מנהל">' ;
				    }
				    else if (LoginType_node[0].firstChild.nodeValue=='4')
				    {
					    chat_div.innerHTML += '<img src="http://chat.2all.co.il/PNG/UserAdminMain.jpg" align=texttop border=0 alt="מנהל ראשי">' ;
				    }
				    else if (LoginType_node[0].firstChild.nodeValue=='5')
				    {
					    chat_div.innerHTML += '<img src="http://chat.2all.co.il/PNG/UserMember2.jpg" align=texttop border=0 alt="אורח כבוד">' ;
				    }											
				    else
				    {
					    chat_div.innerHTML += '<img src="http://chat.2all.co.il/PNG/UserView.jpg" align=texttop border=0 alt="משתמש לצפיה בלבד">' ;
				    }
				    chat_div.innerHTML += ' '
				    chat_div.innerHTML += '<font class="chat_username">' + user_node[0].firstChild.nodeValue + ' </font> : <B> ' + text_node[0].firstChild.nodeValue + '</B> <BR>';
				    chat_div.scrollTop = chat_div.scrollHeight;
				    */

        TmpMsg += '  <div class="ChatMsg"><span class="MsgIcon">';
        if (LoginType_node[0].firstChild.nodeValue == "1") {
          TmpMsg +=
            '<img src="http://chat.2all.co.il/PNG/UserGuest.jpg" align=texttop border=0 alt="אורח" >';
        } else if (LoginType_node[0].firstChild.nodeValue == "2") {
          TmpMsg +=
            '<img src="http://chat.2all.co.il/PNG/UserMember.jpg" align=texttop border=0 alt="משתמש רשום" >';
        } else if (LoginType_node[0].firstChild.nodeValue == "3") {
          TmpMsg +=
            '<img src="http://chat.2all.co.il/PNG/UserAdmin.jpg" align=texttop border=0 alt="מנהל" >';
        } else if (LoginType_node[0].firstChild.nodeValue == "4") {
          TmpMsg +=
            '<img src="http://chat.2all.co.il/PNG/UserAdminMain.jpg" align=texttop border=0 alt="מנהל ראשי" >';
        } else if (LoginType_node[0].firstChild.nodeValue == "5") {
          TmpMsg +=
            '<img src="http://chat.2all.co.il/PNG/UserMember2.jpg" align=texttop border=0 alt="אורח כבוד" >';
        } else {
          TmpMsg +=
            '<img src="http://chat.2all.co.il/PNG/UserView.jpg" align=texttop border=0 alt="משתמש לצפיה בלבד" >';
        }

        TmpMsg += "</span>";
        TmpMsg +=
          '<span class="MsgTime">' +
          time_node[0].firstChild.nodeValue +
          "</span>";
        TmpMsg +=
          '<span class="MsgUserName">' +
          user_node[0].firstChild.nodeValue +
          "</span>";
        TmpMsg +=
          '<BR><span class="MsgText">' +
          text_node[0].firstChild.nodeValue +
          "</span>";
        TmpMsg += "</div>";

        chat_div.innerHTML += TmpMsg;
        TmpMsg = "";
        //$('#div_chat').append(TmpMsg)
        //.css('display','none').fadeIn('slow',function(){
        //});

        // var tmp1=chat_div_Parent.scrollHeight
        // $('#chat_div_Parent').animate({ scrollTop: tmp1 });

        chat_div_Parent.scrollTop = chat_div_Parent.scrollHeight;

        int1 = parseInt(lastMessage);
        int2 = parseInt(message_nodes[i].getAttribute("id"));
        if (int1 <= int2) {
          lastMessage = int2;
        }
      }

      /*chat_div.innerHTML += 'abacad';
                chat_div.innerHTML += '</ul>';
                */
    } else {
      //alert(receiveReq.responseText)
    }

    //document.getElementById('DivLog').innerHTML = document.getElementById('DivLog').innerHTML + '<BR>' + 'last : ' + lastMessage
    mTimer = setTimeout("getChatText();", 2000); //Refresh our chat in 2 seconds

    // מוחק הודעות מהמסך מידיי פעם
    if (n_messages > 0) {
      var tmps = chat_div.innerHTML;
      //alert($(chat_div).find('.ChatMsg').length);

      if ($(chat_div).find(".ChatMsg").length > 85) {
        $(chat_div).find(".ChatMsg").slice(1, 5).remove();
      }
    }

    if (n_messages > 0) {
      //TimerNewMsg = setTimeout('NewMsgAlert();',4000);

      NewMsgAlert();
      if (FlageIsOnFocus == 0) {
        PlaySoundObj("NewMsgSound");
      }
    }

    Last_lastMessage = lastMessage;
    //chat_div_Parent.scrollTop = chat_div_Parent.scrollHeight;
  }
}

//Add a message to the chat server.
function sendChatText() {
  var chat_id;
  var username;
  var nickname;
  var LoginType;
  var txt_message;
  var TmpSeconds;

  if (intMsgCountB >= 4) {
    var locMsgTime = (new Date() / 1000) | 0;
    TmpSeconds = locMsgTime - intMsgTimeB;
    if (TmpSeconds < 10) {
      alert("קיבלת בנגי לכמה שניות");
      return;
    }
  }

  intMsgTimeA = intMsgTimeB;
  intMsgTimeB = (new Date() / 1000) | 0;
  TmpSeconds = intMsgTimeB - intMsgTimeA;
  if (TmpSeconds < 3) {
    // start Count Msgs
    intMsgCountB += 1;
    // console.log('count : ' + intMsgCountB)
  } else if (TmpSeconds > 10) {
    intMsgCountB = 0;
    //  console.log('count 0 : ' + intMsgCountB)
  }

  $("#BtnSendMsg").hide();

  chat_id = G_Chat_ID;
  username = document.getElementById("username").value;
  nickname = document.getElementById("NickName").value;
  SessionID = G_SessionID;

  var TxtColor, SlctFilter, TxtImage;
  TxtColor = document.getElementById("TxtColor").value;

  SlctFilter = document.getElementById("SlctFilter").value;
  //document.getElementById("SlctFilter").value = ""

  TxtImage = document.getElementById("TxtImage").value;
  document.getElementById("TxtImage").value = "";
  //TxtImage = '';
  //'if (LoginType==-1)
  //{
  LoginType = document.getElementById("LoginType").value;
  //}

  if (document.getElementById("txt_message").value == "") {
    // alert("You have not entered a message");
    //alert("txt_message");
    $("#BtnSendMsg").show();
    return;
  }

  if (sendReq.readyState == 4 || sendReq.readyState == 0) {
    txt_message = document.getElementById("txt_message").value;
    if (lastTextMessage == txt_message) {
      $("#BtnSendMsg").show();
      return 0;
    }
    var param = "message=" + encodeURIComponent(txt_message);
    param += "&name=" + encodeURIComponent(nickname);
    //param += '&chatusername=' + encodeURIComponent(username);
    param += "&chat=" + chat_id;
    param += "&LoginType=" + String(LoginType);
    param += "&TxtColor=" + encodeURIComponent(TxtColor);
    param += "&SlctFilter=" + encodeURIComponent(SlctFilter);
    param += "&TxtImage=" + encodeURIComponent(TxtImage);
    var CheckIT = document.getElementById("CheckIT").value;
    param += "&CheckIT=" + encodeURIComponent(CheckIT);

    sendReq.open(
      "POST",
      "http://chat.2all.co.il/getChat.asp?chat=" +
        chat_id +
        "&last=" +
        lastMessage +
        "&SessionID=" +
        SessionID,
      true
    );
    lastTextMessage = txt_message;

    sendReq.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    //sendReq.setRequestHeader("Content-length", param.length);
    //sendReq.setRequestHeader("Connection", "close");

    sendReq.onreadystatechange = handleSendChat;

    sendReq.send(param);
    document.getElementById("txt_message").value = "";
  }

  $("#BtnSendMsg").show();
  document.getElementById("txt_message").focus();
}
//When our message has been sent, update our page.
function handleSendChat() {
  // document.writeln(receiveReq.responseXML);
  // return 0;
  if (sendReq.readyState == 4 || sendReq.readyState == 0) {
    //document.getElementById('DivLog').innerHTML = sendReq.responsetext
  }

  //Clear out the existing timer so we don't have
  //multiple timer instances running.
  clearInterval(mTimer);
  getChatText();
}

//This functions handles when the user presses enter.  Instead of submitting the form, we
//send a new message to the server and return false.
function blockSubmit() {
  sendChatText();
  return false;
}
//This cleans out the database so we can start a new chat session.
function resetChat() {
  if (sendReq.readyState == 4 || sendReq.readyState == 0) {
    sendReq.open(
      "POST",
      "http://chat.2all.co.il/getChat.asp?chat=1&last=" + lastMessage,
      true
    );
    sendReq.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    sendReq.onreadystatechange = handleResetChat;
    var param = "action=reset";
    sendReq.send(param);
    document.getElementById("txt_message").value = "";
  }
}
//This function handles the response after the page has been refreshed.
function handleResetChat() {
  document.getElementById("div_chat").innerHTML = "";
  getChatText();
}

// ******************************** users ****************************************

function getChatUsers() {
  var chat_id;
  var SessionID;
  var username;
  var url;
  chat_id = G_Chat_ID;
  SessionID = G_SessionID;
  username = document.getElementById("NickName").value;
  //document.getElementById('DivLog').innerHTML = document.getElementById('DivLog').innerHTML + '<BR>beginm getChatUsers.asp '
  //document.getElementById('DivLog').innerHTML = '';
  if (receiveReqUsers.readyState == 4 || receiveReqUsers.readyState == 0) {
    url =
      "getChatUsers.asp?chat=" +
      chat_id +
      "&last=" +
      lastUserUpdate +
      "&SessionID=" +
      SessionID +
      "&username=" +
      encodeURIComponent(username) +
      "&test=11";
    //document.getElementById('DivLog').innerHTML = document.getElementById('DivLog').innerHTML + '<BR>' + url

    receiveReqUsers.open("GET", url, true);
    receiveReqUsers.onreadystatechange = handleReceiveChatUsers;
    receiveReqUsers.send(null);
    //lastUserUpdate = parseInt(lastUserUpdate) + 1
  }
}

function handleReceiveChatUsers() {
  var int1;
  var int2;
  var tmptext;
  var TmpStr = "";
  var TmpStr0 = "";
  var TmpStr1 = "";
  var TmpStr2 = "";
  var TmpStr3 = "";
  var TmpStr4 = "";
  var TmpStr5 = "";

  // document.getElementById('DivLog').innerHTML = document.getElementById('DivLog').innerHTML + '<BR> handleReceiveChatUsers '
  TmpStr = "";
  if (receiveReqUsers.readyState == 4) {
    // alert(receiveReq.responsetext);
    // document.writeln(receiveReq.responsetext);
    // document.getElementById('div_chat').innerHTML = receiveReq.responsetext;
    // document.getElementById('DivLog').innerHTML = document.getElementById('DivLog').innerHTML + '<BR>  '  + receiveReqUsers.responseText
    //document.getElementById('DivLog').innerHTML = document.getElementById('DivLog').innerHTML + '<BR>' + receiveReqUsers.responseText;

    tmptext = receiveReqUsers.responseText;
    if (tmptext == "NoUpdate") {
      usersTimer = setTimeout("getChatUsers();", 3500); //Refresh our chat in 2 seconds
      return;
    }

    var chat_div = document.getElementById("Div_Users");
    var xmldoc = receiveReqUsers.responseXML;
    //document.getElementById('DivLog').innerHTML = document.getElementById('DivLog').innerHTML + '<BR>' + receiveReqUsers.responseText;
    var message_nodes = xmldoc.getElementsByTagName("message");
    var n_messages = message_nodes.length;

    // alert(n_messages);
    TmpStr = '<table width="100%" cellpadding=1 border=0>';

    for (i = n_messages - 1; i >= 0; i--) {
      var user_node = message_nodes[i].getElementsByTagName("user");
      var lastUserUpdate_node = message_nodes[i].getElementsByTagName(
        "LastUserUpdate"
      );
      var LogOnType = message_nodes[i].getElementsByTagName("LogOnType");
      var SessionID = message_nodes[i].getElementsByTagName("SessionID");
      //var text_node = message_nodes[i].getElementsByTagName("text");
      //var time_node = message_nodes[i].getElementsByTagName("time");

      var U, L, S;
      U = user_node[0].firstChild.nodeValue;
      L = LogOnType[0].firstChild.nodeValue;
      S = SessionID[0].firstChild.nodeValue;

      if (LogOnType[0].firstChild.nodeValue == "1") {
        TmpStr1 +=
          '<tr><td width="20" ><img src="http://chat.2all.co.il/PNG/UserGuest.jpg" align=texttop border=0 title="אורח" class="media-object"></td>';
        TmpStr1 +=
          '<td><font class="chat_username">' +
          user_node[0].firstChild.nodeValue +
          "</font>" +
          FuncGetUserLinks2(U, L, S) +
          "</td></tr>";
      } else if (LogOnType[0].firstChild.nodeValue == "2") {
        TmpStr2 +=
          '<tr><td width="20" ><img src="http://chat.2all.co.il/PNG/UserMember.jpg" align=texttop border=0 title="משתמש רשום" class="media-object"></td>';
        TmpStr2 +=
          '<td><font class="chat_username">' +
          FuncGetUserLinks(user_node[0].firstChild.nodeValue) +
          "</font>" +
          FuncGetUserLinks2(U, L, S) +
          "</td></tr>";
      } else if (LogOnType[0].firstChild.nodeValue == "3") {
        TmpStr3 +=
          '<tr><td width="20" ><img src="http://chat.2all.co.il/PNG/UserAdmin.jpg" align=texttop border=0 title="מנהל" class="media-object"></td>';
        TmpStr3 +=
          '<td><font class="chat_username">' +
          FuncGetUserLinks(user_node[0].firstChild.nodeValue) +
          "</font>" +
          FuncGetUserLinks2(U, L, S) +
          "</td></tr>";
      } else if (LogOnType[0].firstChild.nodeValue == "4") {
        TmpStr4 +=
          '<tr><td width="20" ><img src="http://chat.2all.co.il/PNG/UserAdminMain.jpg" align=texttop border=0 title="מנהל ראשי" class="media-object"></td>';
        TmpStr4 +=
          '<td><font class="chat_username">' +
          FuncGetUserLinks(user_node[0].firstChild.nodeValue) +
          "</font>" +
          FuncGetUserLinks2(U, L, S) +
          "</td></tr>";
      } else if (LogOnType[0].firstChild.nodeValue == "5") {
        TmpStr5 +=
          '<tr><td width="20" ><img src="http://chat.2all.co.il/PNG/UserMember2.jpg" align=texttop border=0 title="אורח כבוד" class="media-object"></td>';
        TmpStr5 +=
          '<td><font class="chat_username">' +
          FuncGetUserLinks(user_node[0].firstChild.nodeValue) +
          "</font>" +
          FuncGetUserLinks2(U, L, S) +
          "</td></tr>";
      } else {
        TmpStr0 +=
          '<tr><td><img src="http://chat.2all.co.il/PNG/UserView.jpg" align=texttop border=0 title="משתמש לצפיה בלבד" class="media-object"></td>';
        TmpStr0 +=
          '<td><font class="chat_username">' +
          user_node[0].firstChild.nodeValue +
          "</font></td></tr>";
      }

      //chat_div.innerHTML += '<font class="chat_time">' + time_node[0].firstChild.nodeValue + '</font><br />';
      // : <B> ' + text_node[0].firstChild.nodeValue + '</B> <br />';

      int1 = parseInt(lastUserUpdate);
      int2 = parseInt(lastUserUpdate_node[0].firstChild.nodeValue);
      if (int1 <= int2) {
        lastUserUpdate = int2;
      }
    }

    TmpStr = TmpStr + TmpStr4 + TmpStr3 + TmpStr5 + TmpStr2 + TmpStr1 + TmpStr0;

    TmpStr += "</table>";

    chat_div.innerHTML = TmpStr;
    chat_div.scrollTop = chat_div.scrollHeight;

    // document.getElementById('DivLog').innerText = TmpStr

    FuncGetUserLinks2_event();

    usersTimer = setTimeout("getChatUsers();", 3500); //Refresh our chat in 2 seconds
  }
}

function FuncGetUserLinks(username) {
  var newusername;
  newusername =
    '<a target="_blank" href="http://www.2all.co.il/FriendPage.asp?FriendUserName=' +
    encodeURIComponent(username) +
    '" >' +
    username +
    "</>";
  return newusername;
}

function FuncGetUserLinks2(U, L, S) {
  var Tmp;
  T = G_SessionID;
  Tmp = "<a onclick=\"javascript:FuncAddPrivateMsg('";
  Tmp = Tmp + U + "'";
  Tmp = Tmp + ",'" + L + "'";
  Tmp = Tmp + ",'" + S + "'";
  Tmp = Tmp + ",'" + T + '\')"" >';
  Tmp = Tmp + '<font style=""font-size:8px""><B>[פרטי]</B></font></a>';

  Tmp =
    '<SPAN class="BtnPrivate" U="' +
    U +
    '" L="' +
    L +
    '" S="' +
    S +
    '" T="' +
    T +
    '" >';
  Tmp = Tmp + "[פרטי]</SPAN>";

  return Tmp;
}

function FuncAddPrivateMsg(U, L, S, T) {
  var chat_id;
  var username;
  var nickname;
  var LoginType;

  chat_id = G_Chat_ID;
  username = document.getElementById("username").value;
  nickname = document.getElementById("NickName").value;
  SessionID = G_SessionID;
  LoginType = document.getElementById("LoginType").value;

  var TmpMsg;
  var TmpUrl;
  var d = new Date();
  var n = d.getTime();
  var scn = d.getSeconds();
  var tmpSession = parseInt(
    (parseInt(SessionID, 0) + parseInt(S, 0) + n) / scn
  );
  var tmps = String(tmpSession).substring(1, 10);
  tmps = tmps.replace(".");
  TmpUrl = "chat.asp?chat_id=" + tmps; //tmps.substring(1,10) ;
  //TmpMsg = username + ' רוצה לשוחח איתך בצאט פרטי לכניסה ' + '<a target="_blank" href="' + TmpUrl + '">לחץ כאן</a>';
  window.open(TmpUrl);

  if (sendReq.readyState == 4 || sendReq.readyState == 0) {
    var param = "message=" + encodeURIComponent(TmpMsg);
    param += "&name=" + encodeURIComponent(nickname);
    //param += '&chatusername=' + encodeURIComponent(username);
    param += "&chat=" + chat_id;
    param += "&privatechat=" + tmps;
    param += "&LoginType=" + String(LoginType);
    var CheckIT = document.getElementById("CheckIT").value;
    param += "&CheckIT=" + encodeURIComponent(CheckIT);

    sendReq.open(
      "POST",
      "http://chat.2all.co.il/getChat.asp?chat=" +
        chat_id +
        "&last=" +
        lastMessage +
        "&SessionID=" +
        SessionID +
        "&SessionIDTo=" +
        S,
      true
    );

    sendReq.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    //sendReq.setRequestHeader("Content-length", param.length);
    //sendReq.setRequestHeader("Connection", "close");

    sendReq.onreadystatechange = handleSendChat;

    sendReq.send(param);
    document.getElementById("txt_message").value = "";
  }

  try {
    document.getElementById("txt_message").focus();
  } catch (Err) {}
}

function NewMsgAlert() {
  //alert(FlageIsOnFocus);
  //alert(FlageIsOnFocus);
  if (FlageIsOnFocus == 1) {
    clearInterval(TimerNewMsg);
    return 0;
  }

  if (FlageMsg == 1) {
    document.title = "2all.co.il";
    FlageMsg = 2;
  } else {
    document.title = "תגובה חדשה";
    FlageMsg = 1;
  }
  TimerNewMsg = setTimeout("NewMsgAlert();", 3000);
}

function PlaySoundObj(soundobj) {
  try {
    if (FlageSoundOn == 1) {
      var thissound = document.getElementById(soundobj);
      thissound.Play();
      //alert('play sound obj');
      //var thissound=document.getElementById('SoundObj');
      //thissound.innerHTML = '<embed src="http://chat.2all.co.il/Sounds/alert_30.mp3" autostart=true width=0 height=0 id="NewMsgSound" enablejavascript="true">'
    }

    if (FlageSoundOn == -1) {
      var thissound = document.getElementById("SoundObj");
      thissound.innerHTML =
        '<embed src="http://chat.2all.co.il/Sounds/alert_30.mp3" autostart=false width=0 height=0 id="NewMsgSound" enablejavascript="true">';
      FlageSoundOn = 1;
      //alert('create sound obj');
    }
  } catch (Err) {}
}

function FuncSoundOnOff() {
  var ObjSoundBtn = document.getElementById("SoundOnOff");
  if (FlageSoundOn == 1) {
    FlageSoundOn = 0;
    //ObjSoundBtn.innerHTML = '<img src="http://Chat.2all.co.il/png/SoundOff.jpg" alt="צליל התראה על הודעה חדשה לא פעיל">';

    $(ObjSoundBtn)
      .removeClass("btn-success")
      .removeClass("btn-danger")
      .addClass("btn-danger")
      .attr("title", "צליל התראה על הודעה חדשה לא פעיל")
      .html('<span class="fa fa-volume-off"></span> לא פעיל ');
    //title="צליל התראה על הודעה חדשה פעיל"><span class="fa fa-volume-up"></span> פעיל
  } else {
    FlageSoundOn = 1;
    $(ObjSoundBtn)
      .removeClass("btn-success")
      .removeClass("btn-danger")
      .addClass("btn-success")
      .attr("title", "צליל התראה על הודעה חדשה פעיל")
      .html('<span class="fa fa-volume-up"></span>  פעיל ');
    //ObjSoundBtn.innerHTML = '<img src="http://Chat.2all.co.il/png/SoundOn.jpg" alt="צליל התראה על הודעה חדשה פעיל">';
  }
}

function FuncFixMsg(str) {
  var newstr = "";
  newstr = str;
  return newstr;
}

// **************************************
// //////////  Games Script  ////////////
// **************************************
function getGameByID() {
  var err;
  try {
    getGameAdv();
  } catch (err) {}

  getGameByIDAjax();

  try {
    mTimer = setTimeout("FuncCloseGameAdv();", 10000);
  } catch (err) {}
}

function setChatPlayGame(GameID, GameImgTN) {
  setChatPlayGameShow(GameID);
  FuncAddGameMsg(GameID, GameImgTN);
}

function setChatPlayGameShow(GameID) {
  document.getElementById("game_id").value = GameID;
  getGameByID();
}

function setChatPlayYoutubeShow(youTubeID) {
  //alert(StrURL)
  var tmp =
    '<iframe width="100%" height="315" style="width: 100%; height: 315px;" src="https://www.youtube.com/embed/' +
    youTubeID +
    '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>';
  //var tmp = '<iframe width="100%" height="315" src="https://www.youtube.com/embed/' + youTubeID + '?wmode=transparent&amp;autoplay=1" frameborder="0" allowfullscreen=""></iframe>
  //$('#chatyoutubepreview').html('<iframe width="100%" height="315" src="https://' + StrURL + '&autoplay=1" frameborder="0" allowfullscreen></iframe>');
  $("#chatyoutubepreview").html(tmp);
}

function FuncAddGameMsg(GameID, GameImgTN) {
  var chat_id;
  var username;
  var nickname;
  var LoginType;

  chat_id = G_Chat_ID;
  username = document.getElementById("username").value;
  nickname = document.getElementById("NickName").value;
  SessionID = G_SessionID;
  LoginType = document.getElementById("LoginType").value;

  var TmpMsg;
  var TmpUrl;

  TmpMsg =
    username +
    " קורא לכם לשחק במשחק " +
    '<a href="#" onclick="setChatPlayGameShow(' +
    GameID +
    ')">לחץ כאן <BR> <img src="' +
    GameImgTN +
    '" border=0 > </a>';

  window.open(TmpUrl);

  if (sendReq.readyState == 4 || sendReq.readyState == 0) {
    var param = "message=" + encodeURIComponent(TmpMsg);
    param += "&name=" + encodeURIComponent(nickname);
    //param += '&chatusername=' + encodeURIComponent(username);
    param += "&chat=" + chat_id;
    param += "&LoginType=" + String(LoginType);
    param += "&GameID=" + String(GameID);
    var CheckIT = document.getElementById("CheckIT").value;
    param += "&CheckIT=" + encodeURIComponent(CheckIT);

    sendReq.open(
      "POST",
      "http://chat.2all.co.il/getChat.asp?chat=" +
        chat_id +
        "&last=" +
        lastMessage +
        "&SessionID=" +
        SessionID +
        "",
      true
    );

    sendReq.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    //sendReq.setRequestHeader("Content-length", param.length);
    //sendReq.setRequestHeader("Connection", "close");

    sendReq.onreadystatechange = handleSendChat;

    sendReq.send(param);
    document.getElementById("txt_message").value = "";
  }

  try {
    document.getElementById("txt_message").focus();
  } catch (Err) {}
}

function getGameByIDAjax() {
  var game_id;

  game_id = document.getElementById("game_id").value;
  if (receiveReq.readyState == 4 || receiveReq.readyState == 0) {
    // alert('readyState');
    // alert('getChat.asp?chat=1&last=' + lastMessage);

    // document.getElementById('DivLog').innerHTML = document.getElementById('DivLog').innerHTML + '<BR>' + 'getChat.asp?chat=' + chat_id + '&last=' + lastMessage

    receiveReq.open("GET", "ChatGameAjax.asp?ID=" + game_id + "", true);
    receiveReq.onreadystatechange = handleReceiveGame;
    receiveReq.send(null);
  }
}

//Function for handling the return of chat text
function handleReceiveGame() {
  var getgamehtml;
  var loc_div;

  if (receiveReq.readyState == 4) {
    var loc_div = document.getElementById("ShowGame");
    var getgamehtml = receiveReq.responseText;
    loc_div.innerHTML = getgamehtml;
    // mTimer = setTimeout('getChatText();',2000); //Refresh our chat in 2 seconds
  }
}

function GameClose() {
  var loc_div = document.getElementById("ShowGame");
  loc_div.innerHTML = "";
}

function ShowChatYoutube() {
  var tmpsrc = $("#ifrm_youtube").attr("src");
  if (!tmpsrc) {
    $("#ifrm_youtube").attr("src", "ChatYoutube.asp");
  }

  $("#div_chat_parent").hide();
  $("#div_chat_Youtube").show();
}

function func_YouTube_WindowParent_Return(YoutubeURL, img1, title1) {
  FuncAddYouTubeMsg(YoutubeURL, img1, title1);
  $("#div_chat_Youtube").hide();
  $("#div_chat_parent").show();
}

function FuncAddYouTubeMsg(StrYoutubeURL, img, title) {
  var chat_idS;
  var username;
  var nickname;
  var LoginType;

  chat_id = G_Chat_ID;
  username = document.getElementById("username").value;
  nickname = document.getElementById("NickName").value;
  SessionID = G_SessionID;
  LoginType = document.getElementById("LoginType").value;

  var TmpMsg = "";
  var TmpUrl;

  //TmpMsg =  username + ' וידאו ' + '<a href="#" onclick="setChatPlayYoutubeShow(&#039;' + StrYoutubeURL + '&#039;)">לחץ כאן <BR> ' + title + ' <BR> <img height="150" src="' + img + '" border=0 ></a>' ;

  var param = "message=" + encodeURIComponent(TmpMsg);
  param += "&name=" + encodeURIComponent(nickname);
  param += "&youtubeName=" + encodeURIComponent(title);

  //param += '&chatusername=' + encodeURIComponent(username);
  param += "&chat=" + chat_id;
  param += "&LoginType=" + String(LoginType);
  param += "&youtubeurl=" + String(StrYoutubeURL);
  var CheckIT = document.getElementById("CheckIT").value;
  param += "&CheckIT=" + encodeURIComponent(CheckIT);

  sendReq.open(
    "POST",
    "http://chat.2all.co.il/getChat.asp?chat=" +
      chat_id +
      "&last=" +
      lastMessage +
      "&SessionID=" +
      SessionID +
      "",
    true
  );

  sendReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //sendReq.setRequestHeader("Content-length", param.length);
  //sendReq.setRequestHeader("Connection", "close");

  sendReq.onreadystatechange = handleSendChat;

  sendReq.send(param);
  document.getElementById("txt_message").value = "";

  try {
    document.getElementById("txt_message").focus();
  } catch (Err) {}
}

function FuncGetUserLinks2_event() {
  $("#Div_Users .BtnPrivate").each(function () {
    var U, L, S, T;
    U = $(this).attr("U");
    L = $(this).attr("L");
    S = $(this).attr("S");
    T = $(this).attr("T");
    $(this).on("click", function () {
      FuncAddPrivateMsg(U, L, S, T);
      return false;
    });
    $(this).removeAttr("U");
    $(this).removeAttr("L");
    $(this).removeAttr("S");
    $(this).removeAttr("T");
  });
}
