var GaiaFormat =
{
 _Prefs: Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('extensions.gaiaformat.'),
 _lclDisForm: Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://gaiaformat/locale/gaiaformat.properties').GetStringFromName('disableformat.label'),
 _lclProfile: Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://gaiaformat/locale/gaiaformat.properties').GetStringFromName('profile.label'),
 _lclOptions: Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://gaiaformat/locale/gaiaformat.properties').GetStringFromName('options.title'),
 _selIndex: 'default',
 _opt64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABW0lEQVQ4y42SwY6CMBCGP4wNnEos3tS74X2M4SG8+wguV5/C+DBGDr6A3oA0XgykSbuHDSwEdsMkk5n87f9PZzoewPl8dq/Xi7qumWK+77NerzkcDp73laYu8H32+z3L5XKSQFEUXC4XqrpmVuQ5SZKglOLz+UxypRRJklDkOTNjDEopqqoaVJJSIqUc4FVVoZTCGMMMwDnXcyklzrmW0MW6DvwIdEXCMARoYzcPw7BHHhXQWv85PK31QGDekK21RFHUI5RlCdDii8WixRuROYAxhjzPBxXHsAYPguBXAMBay+PxACCOYwC2222P2Jxba/szaFqw1rbkMYvjuL03+IXmIMsygDZ28yzL2nuDIXYne7/fB3swhgHMhRBorVmtVjyfz96Tb7fboGeAzWaD1hohBF6apk4IwW636y3Pf/Z+v7lerxhj8ABOp5MryxJjzCQBIQRRFHE8Hr1vVIQNaigy/ikAAAAASUVORK5CYII=',
 _buffer: null,
 _trim: function(s)
 {
  s = s.replace(/(^\s*)|(\s*$)/gi, '');
  s = s.replace(/[ ]{2,}/gi, ' ');
  s = s.replace(/\n /, '');
  return s;
 },
 _contentDoc: function()
 {
  if (!gBrowser.selectedBrowser.contentDocumentAsCPOW)
   return gBrowser.selectedBrowser.contentDocument;
  else
   return gBrowser.selectedBrowser.contentDocumentAsCPOW;
 },
 _getElementsByAttribute: function(findme, attr)
 {
  var alltags = GaiaFormat._contentDoc().getElementsByTagName('*');
  var foundtags = [];
  for (var i = 0; i < alltags.length; i++)
  {
   if (attr == 'class')
   {
    if (alltags[i].className.indexOf(findme) >= 0)
     foundtags.push(alltags[i]);
   }
   else
    if (alltags[i].getAttribute(attr) == findme)
     foundtags.push(alltags[i]);
  }
  return foundtags;
 },
 _pagegrabber: function(doc)
 {
  var i = 0;
  var sVal = '';
  if (!GaiaFormat._isGaia())
   return;
  if (!GaiaFormat._isMsg())
   return;
  if(doc.getElementById('fmt_detector'))
   return;
  var postBox = GaiaFormat._getBox();
  if (!postBox)
   return;
  var fmtList = GaiaFormat._formatList();
  try
  {
   var postcheck = GaiaFormat._trim(postBox.value);
   var alreadyformed = false;
   if ((postcheck.indexOf('[quote]') != -1 && postcheck.substr(-8) != '[/quote]') || (postcheck.indexOf('[/quote]') == -1 && postcheck.length > 0))
    alreadyformed = true;
   for(i in fmtList)
   {
    sVal = fmtList[i];
    if (postcheck.substr(sVal.End.length * -1) == sVal.End)
    {
     alreadyformed = true;
     break;
    }
   }
   if (!doc.getElementById('fmt_selection'))
   {
    var fFind = '';
    var iIndex = -1;
    try
    {
     fFind = GaiaFormat._Prefs.getCharPref('Favored');
    }
    catch(e)
    {
     iIndex = 0;
    }
    var idx = 0;
    var submit_find;
    var insertData = '';
    var insertElement;
    var beforeElement;
    if (GaiaFormat._isPM())
    {
     submit_find = GaiaFormat._getElementsByAttribute('attach_sig', 'name')[0].parentNode;
     beforeElement = null;
     insertData = '<label for="fmt_selection">' + GaiaFormat._lclProfile + '</label>' +
                  ' <select name="fmtsel_' + Math.random() + '" id="fmt_selection" />';
     for(i in fmtList)
     {
      sVal = fmtList[i];
      if (sVal.Type_PM)
      {
       if (iIndex == -1 && fFind == sVal.id)
        iIndex = idx;
       idx++;
       insertData+='<option value="' + sVal.id + '">' + sVal.name + '</option>';
      }
     }
     insertData+= '<option value="none">' + GaiaFormat._lclDisForm + '</option>' +
                  '</select>';
     insertData+= ' <a href="//www.gaiaonline.com/favicon.ico#gaiaformat/options" target="optionsGaiaFormat" style="vertical-align: middle;"><img src="' + GaiaFormat._opt64 + '" alt="' + GaiaFormat._lclOptions + '" title="' + GaiaFormat._lclOptions + '"></a>' +
                  '<iframe name="optionsGaiaFormat" id="optionsGaiaFormat" src="about:blank" style="display: none;"> ';
     insertElement = GaiaFormat._contentDoc().createElement('div');
     insertElement.setAttribute('class', 'sig');
    }
    else if(GaiaFormat._isCom())
    {
     submit_find = GaiaFormat._getElementsByAttribute('Submit', 'value')[0];
     beforeElement = submit_find;
     insertData = '<br /><label for="fmt_selection">' + GaiaFormat._lclProfile + '</label>' +
                  ' <select name="fmtsel_' + Math.random() + '" id="fmt_selection" />';
     for(i in fmtList)
     {
      sVal = fmtList[i];
      if (sVal.Type_Comm)
      {
       if (iIndex == -1 && fFind == sVal.id)
        iIndex = idx;
       idx++;
       insertData+='<option value="' + sVal.id + '">' + sVal.name + '</option>';
      }
     }
     insertData+= '<option value="none">' + GaiaFormat._lclDisForm + '</option>' +
                  '</select>';
     insertData+= ' <a href="//www.gaiaonline.com/favicon.ico#gaiaformat/options" target="optionsGaiaFormat" style="vertical-align: middle;"><img src="' + GaiaFormat._opt64 + '" alt="' + GaiaFormat._lclOptions + '" title="' + GaiaFormat._lclOptions + '"></a>' +
                  '<iframe name="optionsGaiaFormat" id="optionsGaiaFormat" src="about:blank" style="display: none;"> ';
     insertElement = GaiaFormat._contentDoc().createElement('span');
    }
    else if(GaiaFormat._isGuild())
    {
     submit_find = GaiaFormat._getElementsByAttribute('attach_sig', 'name')[0].parentNode.parentNode.parentNode.parentNode;
     beforeElement = null;
     insertData = '<label for="fmt_selection">' + GaiaFormat._lclProfile + '</label>' +
                  ' <select name="fmtsel_' + Math.random() + '" id="fmt_selection" />';
     for(i in fmtList)
     {
      sVal = fmtList[i];
      if (sVal.Type_Guild)
      {
       if (iIndex == -1 && fFind == sVal.id)
        iIndex = idx;
       idx++;
       insertData+='<option value="' + sVal.id + '">' + sVal.name + '</option>';
      }
     }
     insertData+= '<option value="none">' + GaiaFormat._lclDisForm + '</option>' +
                  '</select>';
     insertData+= ' <a href="//www.gaiaonline.com/favicon.ico#gaiaformat/options" target="optionsGaiaFormat" style="vertical-align: middle;"><img src="' + GaiaFormat._opt64 + '" alt="' + GaiaFormat._lclOptions + '" title="' + GaiaFormat._lclOptions + '"></a>' +
                  '<iframe name="optionsGaiaFormat" id="optionsGaiaFormat" src="about:blank" style="display: none;">';
     insertElement = GaiaFormat._contentDoc().createElement('div');
     insertElement.setAttribute('class', 'sig');
    }
    else if(GaiaFormat._isQR())
    {
     submit_find = doc.getElementById('qr_submit');
     beforeElement = submit_find;
     insertData = '<label for="fmt_selection">' + GaiaFormat._lclProfile + '</label>' +
                  ' <select name="fmtsel_' + Math.random() + '" id="fmt_selection" />';
     for(i in fmtList)
     {
      sVal = fmtList[i];
      if (sVal.Type_Forum)
      {
       if (iIndex == -1 && fFind == sVal.id)
        iIndex = idx;
       idx++;
       insertData+='<option value="' + sVal.id + '">' + sVal.name + '</option>';
      }
     }
     insertData+= '<option value="none">' + GaiaFormat._lclDisForm + '</option>' +
                  '</select>';
     insertData+= '<a href="//www.gaiaonline.com/favicon.ico#gaiaformat/options" target="optionsGaiaFormat" style="vertical-align: bottom;"><img src="' + GaiaFormat._opt64 + '" alt="' + GaiaFormat._lclOptions + '" title="' + GaiaFormat._lclOptions + '"></a>' +
                  '<iframe name="optionsGaiaFormat" id="optionsGaiaFormat" src="about:blank" style="display: none;">';
     insertElement = GaiaFormat._contentDoc().createElement('span');
     insertElement.setAttribute('style','margin: 12px 15px 0px 15px; font-size: 11px; vertical-align: middle; display: inline-block;');
     submit_find.addEventListener('click', GaiaFormat.AutoFormat, true);
     GaiaFormat.httpRequest.register();
    }
    else if (GaiaFormat._isNewTopic())
    {
     if(doc.getElementById('post_style') === null)
     {
      if(doc.getElementById('post_action') !== null)
      {
       var insertNewTopicBox = GaiaFormat._contentDoc().createElement('div');
       insertNewTopicBox.setAttribute('id', 'gf_post_style');
       insertNewTopicBox.setAttribute('class', 'gaia-info nofooter');
       insertNewTopicBox.innerHTML = '<div class="hd">' +
        '<div class="rc_top_left">&nbsp;</div>' +
        '<div class="rc_top_right">&nbsp;</div>' +
        '<h3 id="yui-gen6">Post Style</h3>' +
        '</div>' +
        '<div class="ft" id="yui-gen20">' +
        '<div class="rc_bottom_left">&nbsp;</div>' +
        '<div class="rc_bottom_right">&nbsp;</div>' +
        '</div>';
       doc.getElementById('post_action').parentElement.insertBefore(insertNewTopicBox, doc.getElementById('post_action'));
       submit_find = doc.getElementById('gf_post_style').getElementsByTagName('h3')[0];
      }
     }
     else
      submit_find = doc.getElementById('post_style').getElementsByTagName('h3')[0];
     beforeElement = null;
     insertData = '';
     for(i in fmtList)
     {
      sVal = fmtList[i];
      if (sVal.Type_ForumT)
      {
       if (iIndex == -1 && fFind == sVal.id)
        iIndex = idx;
       idx++;
       insertData+='<option value="' + sVal.id + '">' + sVal.name + '</option>';
      }
     }
     insertData+= '<option value="none">' + GaiaFormat._lclDisForm + '</option>';
     insertElement = GaiaFormat._contentDoc().createElement('select');
     insertElement.setAttribute('id', 'fmt_selection');
     insertElement.setAttribute('name', 'fmtsel_' + Math.random());
     insertElement.setAttribute('style', 'position: absolute; top: 6px; right: 23px; width: 150px;');
     var newSiblingData = '<a href="//www.gaiaonline.com/favicon.ico#gaiaformat/options" target="optionsGaiaFormat"><img src="' + GaiaFormat._opt64 + '" alt="' + GaiaFormat._lclOptions + '" title="' + GaiaFormat._lclOptions + '"></a>' +
                       '<iframe name="optionsGaiaFormat" id="optionsGaiaFormat" src="about:blank" style="display: none;">';
     var insertNewSibling = GaiaFormat._contentDoc().createElement('span');
     insertNewSibling.setAttribute('style', 'position: absolute; top: 7px; right: 5px; width: 16px;');
     insertNewSibling.innerHTML = newSiblingData;
     submit_find.parentNode.insertBefore(insertNewSibling, null);
    }
    else
    {
     if(doc.getElementById('post_style') === null)
     {
      if(doc.getElementById('post_action') !== null)
      {
       var insertReplyBox = GaiaFormat._contentDoc().createElement('div');
       insertReplyBox.setAttribute('id', 'gf_post_style');
       insertReplyBox.setAttribute('class', 'gaia-info nofooter');
       insertReplyBox.innerHTML = '<div class="hd">' +
        '<div class="rc_top_left">&nbsp;</div>' +
        '<div class="rc_top_right">&nbsp;</div>' +
        '<h3 id="yui-gen6">Post Style</h3>' +
        '</div>' +
        '<div class="ft" id="yui-gen20">' +
        '<div class="rc_bottom_left">&nbsp;</div>' +
        '<div class="rc_bottom_right">&nbsp;</div>' +
        '</div>';
       doc.getElementById('post_action').parentElement.insertBefore(insertReplyBox, doc.getElementById('post_action'));
       submit_find = doc.getElementById('gf_post_style').getElementsByTagName('h3')[0];
      }
     }
     else
      submit_find = doc.getElementById('post_style').getElementsByTagName('h3')[0];
     beforeElement = null;
     insertData = '';
     for(i in fmtList)
     {
      sVal = fmtList[i];
      if (sVal.Type_Forum)
      {
       if (iIndex == -1 && fFind == sVal.id)
        iIndex = idx;
       idx++;
       insertData+='<option value="' + sVal.id + '">' + sVal.name + '</option>';
      }
     }
     insertData+= '<option value="none">' + GaiaFormat._lclDisForm + '</option>';
     insertElement = GaiaFormat._contentDoc().createElement('select');
     insertElement.setAttribute('id', 'fmt_selection');
     insertElement.setAttribute('name', 'fmtsel_' + Math.random());
     insertElement.setAttribute('style', 'position: absolute; top: 6px; right: 23px; width: 150px;');
     var siblingData = '<a href="//www.gaiaonline.com/favicon.ico#gaiaformat/options" target="optionsGaiaFormat"><img src="' + GaiaFormat._opt64 + '" alt="' + GaiaFormat._lclOptions + '" title="' + GaiaFormat._lclOptions + '"></a>' +
                       '<iframe name="optionsGaiaFormat" id="optionsGaiaFormat" src="about:blank" style="display: none;">';
     var insertSibling = GaiaFormat._contentDoc().createElement('span');
     insertSibling.setAttribute('style', 'position: absolute; top: 7px; right: 5px; width: 16px;');
     insertSibling.innerHTML = siblingData;
     submit_find.parentNode.insertBefore(insertSibling, null);
    }
    if (submit_find && !doc.getElementById('fmt_selection'))
    {
     insertElement.innerHTML = insertData;
     submit_find.parentNode.insertBefore(insertElement, beforeElement);
     var selFormat = GaiaFormat._getElementsByAttribute('fmt_selection', 'id')[0];
     if (alreadyformed)
      selFormat.selectedIndex = selFormat.length - 1;
     else if (iIndex != -1)
      selFormat.selectedIndex = iIndex;
     GaiaFormat._selIndex = selFormat.value;
     GaiaFormat._Prefs.setCharPref('Favored', GaiaFormat._selIndex);
    }
   }
  }
  catch(e){}
  try
  {
   var autoAreaForm = postBox.form;
   autoAreaForm.addEventListener('submit', GaiaFormat.AutoFormat, true);
  }
  catch(e){}
 },
 pagegrabber_start: function()
 {
  var doc = gBrowser.selectedBrowser.contentDocument;
  GaiaFormat._pagegrabber(doc);
 },
 standardLoad: function()
 {
  window.addEventListener('DOMContentLoaded', GaiaFormat.pagegrabber_start,false);
 },
 tablselect: function(event)
 {
  GaiaFormat._buffer = gBrowser.getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex);
  setTimeout(GaiaFormat.bufferLoad, 155);
 },
 bufferLoad: function()
 {
  if (GaiaFormat._isGaia())
   GaiaFormat._pagegrabber(GaiaFormat._buffer.contentDocument);
 },
 reLoad: function()
 {
  gBrowser.mPanelContainer.addEventListener('select', GaiaFormat.tablselect, false);
 },
 _myLoc: function()
 {
  var x = null;
  try
  {
   x = GaiaFormat._contentDoc().location.href;
  }
  catch(e)
  {
   return false;
  }
  return x;
 },
 _isGaia: function()
 {
  var url = GaiaFormat._myLoc();
  if (url == false)
   return false;
  if (url.indexOf('gaiaonline.com') != -1)
   return true;
  else
   return false;
 },
 _isMsg: function()
 {
  if (GaiaFormat._isGaia == false)
   return false;
  var url = GaiaFormat._myLoc();
  if (url.indexOf('compose/entry') != -1)
   return true;
  if (url.indexOf('compose/topic') != -1)
   return true;
  if (url.indexOf('posting.ph') != -1)
   return true;
  if (url.indexOf('mode=post') != -1)
   return true;
  if (url.indexOf('mode=reply') != -1)
   return true;
  if (url.indexOf('mode=entry') != -1)
   return true;
  if (url.indexOf('mode=comment') != -1)
   return true;
  if (url.indexOf('comment.AddComment') != -1)
   return true;
  if (url.indexOf('mode=addcomment') != -1)
   return true;
  if (url.indexOf('/t.') != -1)
   return true;
  if (url.substr(-11) == 'privmsg.php')
   return true;
  if (url.substr(-11) == 'journal.php')
   return true;
  if (url.substr(-18) == 'guilds/posting.php')
   return true;
  return false;
 },
 _isGuild: function()
 {
  if (GaiaFormat._isGaia == false)
   return false;
  var url = GaiaFormat._myLoc();
  if (url.indexOf('gaiaonline.com/guilds') == -1)
   return false;
  return true;
 },
 _isCom: function()
 {
  if (GaiaFormat._isGaia == false)
   return false;
  var url = GaiaFormat._myLoc();
  if (url.indexOf('comment.AddComment') == -1 && url.indexOf('mode=addcomment') == -1)
   return false;
  return true;
 },
 _isPM: function()
 {
  if (GaiaFormat._isGaia == false)
   return false;
  var url = GaiaFormat._myLoc();
  if (url.indexOf('privmsg.php') == -1)
   return false;
  return true;
 },
 _isQR: function()
 {
  if (GaiaFormat._isGaia == false)
   return false;
  var url = GaiaFormat._myLoc();
  if (url.indexOf('/t.') === -1)
   return false;
  return true;
 },
 _isNewTopic: function()
 {
  if (GaiaFormat._isGaia == false)
   return false;
  var url = GaiaFormat._myLoc();
  if (url.indexOf('forum/compose/topic') != -1)
   return true;
  if (url.indexOf('forum/compose/entry') != -1 && url.indexOf('forum/compose/entry/new') == -1 && url.indexOf('_1/') != -1)
   return true;
  return false;
 },
 _getBox: function()
 {
  try
  {
   var post  = GaiaFormat._contentDoc().getElementsByName('message').item(0);
   if(!post)
    post = GaiaFormat._contentDoc().getElementsByName('form[comment]').item(0);
   if(!post)
    post = GaiaFormat._contentDoc().getElementsByName('comment').item(0);
   if(!post)
    post = GaiaFormat._contentDoc().getElementById('comment');
   if(!post)
    post = GaiaFormat._contentDoc().getElementById('qr_text');
   return post;
  }
  catch(e){}
 },
 _specialFormat: function(sIn)
 {
  var fmtList   = GaiaFormat._formatList()[GaiaFormat._selIndex];
  if (fmtList.Extras)
  {
   var fmtEItems = fmtList.ExtraItems;
   var i = 0;
   for(i = 0; i < fmtEItems; i++)
   {
    var sLeft  = encodeURIComponent(fmtList.ExtraItem[i].Left);
    var sRight = encodeURIComponent(fmtList.ExtraItem[i].Right);
    var sBegin = encodeURIComponent(fmtList.ExtraItem[i].Begin);
    var sEnd   = encodeURIComponent(fmtList.ExtraItem[i].End);
    var lLeft  = sIn.indexOf(sLeft);
    var lRight = sIn.indexOf(sRight, lLeft + 1);
    while (lLeft >= 0 && lRight > 0)
    {
     var sFind = decodeURIComponent(sIn.substring(0, lLeft)).toLowerCase();
     var lLook = lRight + 1;
     if(sFind.lastIndexOf('[url=') > sFind.lastIndexOf(']')){}
     else if(sFind.lastIndexOf('[url]') > sFind.lastIndexOf('[/url]')){}
     else if(sFind.lastIndexOf('[img]') > sFind.lastIndexOf('[/img]')){}
     else if(sFind.lastIndexOf('[youtube]') > sFind.lastIndexOf('[/youtube]')){}
     else if(sFind.lastIndexOf('[video]') > sFind.lastIndexOf('[/video]')){}
     else if(sFind.lastIndexOf('[imgleft]') > sFind.lastIndexOf('[/imgleft]')){}
     else if(sFind.lastIndexOf('[imgright]') > sFind.lastIndexOf('[/imgright]')){}
     else if(sFind.lastIndexOf('[imgmap]') > sFind.lastIndexOf('[/imgmap]')){}
     else if(sFind.lastIndexOf('[code]') > sFind.lastIndexOf('[/code]')){}
     else if(sFind.slice(-1) === '[' && decodeURIComponent(sIn.substring(lLeft + sLeft.length)).substring(0, 1) === ']'){lLook = lLeft + 1;}
     else
     {
      sIn   = sIn.substring(0, lLeft) + sBegin + sIn.substring(lLeft, lRight + sRight.length) + sEnd + sIn.substring(lRight + sRight.length);
      lLook  = lRight + 1 + sBegin.length + sEnd.length;
     }
     lLeft  = sIn.indexOf(sLeft, lLook);
     lRight = sIn.indexOf(sRight, lLeft + 1);
    }
   }
  }
  return decodeURIComponent(sIn);
 },
 _doFormat: function()
 {
  var fmtList   = GaiaFormat._formatList()[GaiaFormat._selIndex];
  var fmtBegin  = fmtList.Begin;
  var fmtEnd    = fmtList.End;
  var fmtStyle  = fmtList.Style;
  var post  = GaiaFormat._getBox();
  if (!post)
   return;
  var postx = post.value+'';
  if (!GaiaFormat._isCom() && !GaiaFormat._isPM() && !GaiaFormat._isGuild())
  {
   try
   {
    GaiaFormat._contentDoc().getElementsByName('basic_type')[0].value = fmtStyle;
   }
   catch(e){}
  }
  if (post.selectionStart != post.selectionEnd)
  {
   var topstring = postx.substring(0, post.selectionStart);
   var midstring = encodeURIComponent(postx.substring(post.selectionStart, post.selectionEnd));
   var endstring = postx.substring(post.selectionEnd, post.value.length);
   post.value = topstring + fmtBegin + GaiaFormat._specialFormat(midstring) + fmtEnd + endstring;
  }
  else
  {
   var postUp = postx.toUpperCase();
   var sTmp;
   var nest = 0;
   var nold = 0;
   var outQuote = ['0'];
   var inQuote = [];
   var i;
   var j;
   for (i=0; i < postx.length; i++)
   {
    if (postUp.substr(i, 6) == '[QUOTE')
    {
     if (nest == 0)
      inQuote.push(i);
     nest++;
     for (j=i+1; j < postx.length; j++)
     {
      if (postx.substr(j,1) == ']')
      {
       i=j;
       break;
      }
     }
    }
    else if (postUp.substr(i, 8) == '[/QUOTE]')
    {
     nest--;
     i += 7;
     if (nest == 0)
      outQuote.push(i+1);
    }
    nold=nest;
   }
   if (nest == 0)
   {
    inQuote.push(postx.length);
    sTmp = '';
    for (i = 0; i < inQuote.length; i++)
    {
     if (inQuote[i] - outQuote[i] > 0)
     {
      var sChunk = postx.substr(outQuote[i], inQuote[i]-outQuote[i]);
      if (GaiaFormat._trim(sChunk) == '')
       sTmp += sChunk;
      else
       sTmp += fmtBegin + GaiaFormat._specialFormat(encodeURIComponent(sChunk)) + fmtEnd;
     }
     if (i + 1 < outQuote.length)
      sTmp += postx.substr(inQuote[i], outQuote[i+1] - inQuote[i]);
    }
    post.value = sTmp;
   }
  }
 },
 _formatList: function()
 {
  var fmtData = [];
  try
  {
   var i = 0;
   var fmtCount = GaiaFormat._Prefs.getIntPref('Formats');
   if (fmtCount > 0)
   {
    for (i = 0; i < fmtCount; i++)
    {
     var iID = GaiaFormat._Prefs.getCharPref('Format[' + i + '].id');
     fmtData[iID] = {
      'name': decodeURIComponent(GaiaFormat._Prefs.getCharPref('Format[' + i + '].name')),
      'id': iID,
      'Type_ForumT': GaiaFormat._Prefs.getBoolPref('Format[' + i + '].Type.ForumT'),
      'Type_Forum': GaiaFormat._Prefs.getBoolPref('Format[' + i + '].Type.Forum'),
      'Type_Guild': GaiaFormat._Prefs.getBoolPref('Format[' + i + '].Type.Guild'),
      'Type_PM': GaiaFormat._Prefs.getBoolPref('Format[' + i + '].Type.PM'),
      'Type_Comm': GaiaFormat._Prefs.getBoolPref('Format[' + i + '].Type.Comm'),
      'Begin': decodeURIComponent(GaiaFormat._Prefs.getCharPref('Format[' + i + '].Begin')),
      'End': decodeURIComponent(GaiaFormat._Prefs.getCharPref('Format[' + i + '].End')),
      'Style': GaiaFormat._Prefs.getIntPref('Format[' + i + '].Style'),
      'Extras': GaiaFormat._Prefs.getBoolPref('Format[' + i + '].Extras'),
      'ExtraItems': GaiaFormat._Prefs.getIntPref('Format[' + i + '].Extras.Items'),
      'ExtraItem': []
     };
     
     for (var j = 0; j < fmtData[iID].ExtraItems; j++)
     {
      fmtData[iID].ExtraItem[j] = {
       'Begin': decodeURIComponent(GaiaFormat._Prefs.getCharPref('Format[' + i + '].Extras.Begin[' + j + ']')),
       'End':   decodeURIComponent(GaiaFormat._Prefs.getCharPref('Format[' + i + '].Extras.End[' + j + ']')),
       'Left':  decodeURIComponent(GaiaFormat._Prefs.getCharPref('Format[' + i + '].Extras.Left[' + j + ']')),
       'Right': decodeURIComponent(GaiaFormat._Prefs.getCharPref('Format[' + i + '].Extras.Right[' + j + ']'))
      };
     }
    }
    return fmtData;
   }
   else
   {
    fmtData['default'] = {
     'name': 'Default',
     'id': 'default',
     'Type_ForumT': GaiaFormat._Prefs.getBoolPref('ForumT'),
     'Type_Forum': GaiaFormat._Prefs.getBoolPref('Forum'),
     'Type_Guild': GaiaFormat._Prefs.getBoolPref('Guild'),
     'Type_PM': GaiaFormat._Prefs.getBoolPref('PM'),
     'Type_Comm': GaiaFormat._Prefs.getBoolPref('Comm'),
     'Begin': decodeURIComponent(GaiaFormat._Prefs.getCharPref('Begin')),
     'End': decodeURIComponent(GaiaFormat._Prefs.getCharPref('End')),
     'Style': GaiaFormat._Prefs.getIntPref('Style'),
     'Extras': GaiaFormat._Prefs.getBoolPref('Extras'),
     'ExtraItems': GaiaFormat._Prefs.getIntPref('EItems'),
     'ExtraItem': []
    };
    for (i = 0; i < fmtData['default'].ExtraItems; i++)
    {
     fmtData['default'].ExtraItem[i] = {
      'Begin': decodeURIComponent(GaiaFormat._Prefs.getCharPref('EBegin[' + i + ']')),
      'End':   decodeURIComponent(GaiaFormat._Prefs.getCharPref('EEnd[' + i + ']')),
      'Left':  decodeURIComponent(GaiaFormat._Prefs.getCharPref('ELeft[' + i + ']')),
      'Right': decodeURIComponent(GaiaFormat._Prefs.getCharPref('ERight[' + i + ']'))
     };
    }
    return fmtData;
   }
  }
  catch(e)
  {
   fmtData['default'] =
   {
    'name': 'Default',
    'id': 'default',
    'Type_ForumT': true,
    'Type_Forum': true,
    'Type_Guild': true,
    'Type_PM': true,
    'Type_Comm': true,
    'Begin': '[color=green][align=left]--Personalize this formatting--[/align][/color][align=center]\n',
    'End': '\n[/align][color=green][align=right]--Customize it in Tools > Add-Ons > Extensions > GaiaFormat > Options--[/align][/color]',
    'Style': 0,
    'Extras': false,
    'ExtraItems': 0,
    'ExtraItem': []
   };
   return fmtData;
  }
 },
 AutoFormat: function()
 {
  try
  {
   var doc  = gBrowser.selectedBrowser.contentDocument;
   var pBox = GaiaFormat._getBox();
   if (!pBox)
    return;
   var post = pBox.value;
   var bFormed = false;
   var selFormat = doc.getElementById('fmt_selection');
   GaiaFormat._selIndex = selFormat.value;
   GaiaFormat._Prefs.setCharPref('Favored', GaiaFormat._selIndex);
   var fmtList = GaiaFormat._formatList()[GaiaFormat._selIndex];
   if (post.substr(fmtList.End.length * -1) == fmtList.End)
    bFormed = true;
   try
   {
    if(!bFormed && selFormat.value != 'none')
    {
     if (GaiaFormat._isCom())
     {
      if(fmtList.Type_Comm)
       GaiaFormat._doFormat();
     }
     else if (GaiaFormat._isPM())
     {
      if (fmtList.Type_PM)
       GaiaFormat._doFormat();
     }
     else if (GaiaFormat._isGuild())
     {
      if (fmtList.Type_Guild)
       GaiaFormat._doFormat();
     }
     else if (GaiaFormat._isNewTopic())
     {
      if (fmtList.Type_ForumT)
       GaiaFormat._doFormat();
     }
     else if (fmtList.Type_Forum)
      GaiaFormat._doFormat();
    }
   }
   catch(e){}
   return true;
  }
  catch(e){}
 },
 httpRequest:
 {
  observe: function(subject, topic, data)
  {
   if (topic == 'http-on-modify-request')
   {
    var oHttp = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
    if (oHttp.requestMethod == 'POST')
    {
     var uri = oHttp.URI.asciiSpec;
     if (uri.substr(uri.indexOf('gaiaonline.com'), 43) == 'gaiaonline.com/forum/compose/ajaxentry/new/' && GaiaFormat._selIndex != 'none')
     {
      var fmtList   = GaiaFormat._formatList()[GaiaFormat._selIndex];
      var sBody = GaiaFormat.getPostText(subject) + '&basic_type=' + fmtList[GaiaFormat._selIndex].Style + '&compound_type=0';
      GaiaFormat.setPostText(subject, sBody);
      oHttp.setRequestHeader('Content-Length', sBody.length, false);
      oHttp.requestMethod = 'POST';
      Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService).removeObserver(GaiaFormat, 'http-on-modify-request');
     }
    }
   }
  },
  register: function() {Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService).addObserver(GaiaFormat, 'http-on-modify-request', false);},
  getPostText: function(subject)
  {
   var upStream = subject.QueryInterface(Components.interfaces.nsIUploadChannel).uploadStream;
   if(upStream)
   {
    var seekStream = upStream.QueryInterface(Components.interfaces.nsISeekableStream);
    var prevOffset;
    if (seekStream)
    {
     prevOffset = seekStream.tell();
     seekStream.seek(Components.interfaces.nsISeekableStream.NS_SEEK_SET, 0);
    }
    var text = GaiaFormat.readFromStream(upStream, true);
    if (seekStream && prevOffset == 0)
     seekStream.seek(Components.interfaces.nsISeekableStream.NS_SEEK_SET, 0);
    return text;
   }
  },
  readFromStream: function(stream, noClose)
  {
   var binStream = Components.classes['@mozilla.org/binaryinputstream;1'].getService(Components.interfaces.nsIBinaryInputStream);
   binStream.setInputStream(stream);
   var segments = [];
   for (var count = stream.available(); count; count = stream.available())
    segments.push(binStream.readBytes(count));
   if (!noClose)
    binStream.close();
   var text = segments.join('');
   return text;
  },
  setPostText: function(subject, body)
  {
   var aBody = Components.classes['@mozilla.org/io/string-input-stream;1'].createInstance(Components.interfaces.nsIStringInputStream);
   aBody.setData(body, body.length);
   var uChan = subject.QueryInterface(Components.interfaces.nsIUploadChannel);
   uChan.setUploadStream(aBody, 'application/x-www-form-urlencoded', -1);
  }
 }
};
setTimeout(GaiaFormat.reLoad, 1777);
window.addEventListener('load', GaiaFormat.standardLoad, false);
