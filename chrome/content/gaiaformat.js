if (!window.com) window.com = {};
if (!window.com.RealityRipple) window.com.RealityRipple = {};
window.com.RealityRipple.GaiaFormat = function()
{
 var pub  = {};
 var priv = {};
 priv.Cc = Components.classes;
 priv.Ci = Components.interfaces;
 priv.CccI = function(cName, ifaceName)
 {
  return priv.Cc[cName].createInstance(priv.Ci[ifaceName]);
 }
 priv.CcgS = function(cName, ifaceName)
 {
  if (priv.Cc[cName])
   return priv.Cc[cName].getService(priv.Ci[ifaceName]);
  else
   dumpError("CcgS fails for cName:" + cName);
 }
 priv.Prefs = priv.CcgS("@mozilla.org/preferences-service;1","nsIPrefService").getBranch("extensions.gaiaformat.");
 priv.gBundle= priv.CcgS("@mozilla.org/intl/stringbundle;1","nsIStringBundleService");
 priv.locale = priv.gBundle.createBundle("chrome://gaiaformat/locale/gaiaformat.properties");
 priv.lclDisForm = priv.locale.GetStringFromName("disableformat.label");
 priv.lclProfile = priv.locale.GetStringFromName("profile.label");
 priv.lclOptions = priv.locale.GetStringFromName("options.title");
 priv.selIndex = 'default';
 priv.opt64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABW0lEQVQ4y42SwY6CMBCGP4wNnEos3tS74X2M4SG8+wguV5/C+DBGDr6A3oA0XgykSbuHDSwEdsMkk5n87f9PZzoewPl8dq/Xi7qumWK+77NerzkcDp73laYu8H32+z3L5XKSQFEUXC4XqrpmVuQ5SZKglOLz+UxypRRJklDkOTNjDEopqqoaVJJSIqUc4FVVoZTCGMMMwDnXcyklzrmW0MW6DvwIdEXCMARoYzcPw7BHHhXQWv85PK31QGDekK21RFHUI5RlCdDii8WixRuROYAxhjzPBxXHsAYPguBXAMBay+PxACCOYwC2222P2Jxba/szaFqw1rbkMYvjuL03+IXmIMsygDZ28yzL2nuDIXYne7/fB3swhgHMhRBorVmtVjyfz96Tb7fboGeAzWaD1hohBF6apk4IwW636y3Pf/Z+v7lerxhj8ABOp5MryxJjzCQBIQRRFHE8Hr1vVIQNaigy/ikAAAAASUVORK5CYII=';
 priv.trim = function(s)
 {
  s = s.replace(/(^\s*)|(\s*$)/gi, "");
  s = s.replace(/[ ]{2,}/gi, " ");
  s = s.replace(/\n /, "");
  return s;
 }
 priv.contentDoc = function()
 {
  if (!gBrowser.selectedBrowser.contentDocumentAsCPOW)
   return gBrowser.selectedBrowser.contentDocument;
  else
   return gBrowser.selectedBrowser.contentDocumentAsCPOW;
 }
 priv.getElementsByAttribute = function(findme, attr)
 {
  var alltags = priv.contentDoc().getElementsByTagName("*");
  var foundtags = new Array();
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
 }
 priv.pagegrabber = function(doc)
 {
  if(priv.isGaia() && priv.isMsg() && !doc.getElementById("fmt_detector"))
  {
   var findurl = priv.contentDoc().location.href;
   var textbox;
   if (priv.isMsg())
   {
    var fmtList = priv.formatList();
    try
    {
     var postBox = priv.getBox();
     var postcheck = priv.trim(postBox.value);
     var alreadyformed = false;
     if (postcheck.indexOf('[quote]') > -1 && postcheck.substr(-8) != '[/quote]' || postcheck.indexOf('[/quote]') < 0 && postcheck.length > 0)
      alreadyformed = true;
     if (!doc.getElementById('fmt_selection'))
     {
      var fFind = '';
      var iIndex = -1;
      try
      {
       fFind = priv.Prefs.getCharPref("Favored");
      }
      catch(e)
      {
       iIndex = 0;
      }
      var idx = 0;
      var submit_find;
      var insertData = "";
      var insertElement;
      var beforeElement;
      if (priv.isPM())
      {
       submit_find = priv.getElementsByAttribute('attach_sig', 'name')[0].parentNode;
       beforeElement = null;
       insertData = "<label for=\"fmt_selection\">" + priv.lclProfile + "</label>" +
                    " <select name=\"fmtsel_" + Math.random() + "\" id=\"fmt_selection\" />";
       for(var i in fmtList)
       {
        var sVal = fmtList[i];
        if (sVal.Type_PM && !priv.isCom())
        {
         if (iIndex == -1 && fFind == sVal.id)
          iIndex = idx;
         idx++;
         insertData+="<option value=\"" + sVal.id + "\">" + sVal.name + "</option>";
        }
       }
       insertData+= "<option value=\"none\">" + priv.lclDisForm + "</option>" +
                    "</select>";
       insertData+= " <a href=\"//www.gaiaonline.com/favicon.ico#gaiaformat/options\" target=\"optionsGaiaFormat\" style=\"vertical-align: middle;\"><img src=\"" + priv.opt64 + "\" alt=\"" + priv.lclOptions + "\" title=\"" + priv.lclOptions + "\"></a>" +
                    "<iframe name=\"optionsGaiaFormat\" id=\"optionsGaiaFormat\" src=\"about:blank\" style=\"display: none;\"> ";
       insertElement = priv.contentDoc().createElement('div');
       insertElement.setAttribute("class", "sig");
      }
      else if(priv.isCom())
      {
       submit_find = priv.getElementsByAttribute('Submit', 'value')[0];
       beforeElement = submit_find;
       insertData = "<br /><label for=\"fmt_selection\">" + priv.lclProfile + "</label>" +
                    " <select name=\"fmtsel_" + Math.random() + "\" id=\"fmt_selection\" />";
       for(var i in fmtList)
       {
        var sVal = fmtList[i];
        if (sVal.Type_Comm)
        {
         if (iIndex == -1 && fFind == sVal.id)
          iIndex = idx;
         idx++;
         insertData+="<option value=\"" + sVal.id + "\">" + sVal.name + "</option>";
        }
       }
       insertData+= "<option value=\"none\">" + priv.lclDisForm + "</option>" +
                    "</select>";
       insertData+= " <a href=\"//www.gaiaonline.com/favicon.ico#gaiaformat/options\" target=\"optionsGaiaFormat\" style=\"vertical-align: middle;\"><img src=\"" + priv.opt64 + "\" alt=\"" + priv.lclOptions + "\" title=\"" + priv.lclOptions + "\"></a>" +
                    "<iframe name=\"optionsGaiaFormat\" id=\"optionsGaiaFormat\" src=\"about:blank\" style=\"display: none;\"> ";
       insertElement = priv.contentDoc().createElement('span');
      }
      else if(priv.isGuild())
      {
       submit_find = priv.getElementsByAttribute('attach_sig', 'name')[0].parentNode.parentNode.parentNode.parentNode;
       beforeElement = null;
       insertData = "<label for=\"fmt_selection\">" + priv.lclProfile + "</label>" +
                    " <select name=\"fmtsel_" + Math.random() + "\" id=\"fmt_selection\" />";
       for(var i in fmtList)
       {
        var sVal = fmtList[i];
        if (sVal.Type_Guild)
        {
         if (iIndex == -1 && fFind == sVal.id)
          iIndex = idx;
         idx++;
         insertData+="<option value=\"" + sVal.id + "\">" + sVal.name + "</option>";
        }
       }
       insertData+= "<option value=\"none\">" + priv.lclDisForm + "</option>" +
                    "</select>";
       insertData+= " <a href=\"//www.gaiaonline.com/favicon.ico#gaiaformat/options\" target=\"optionsGaiaFormat\" style=\"vertical-align: middle;\"><img src=\"" + priv.opt64 + "\" alt=\"" + priv.lclOptions + "\" title=\"" + priv.lclOptions + "\"></a>" +
                    "<iframe name=\"optionsGaiaFormat\" id=\"optionsGaiaFormat\" src=\"about:blank\" style=\"display: none;\">";
       insertElement = priv.contentDoc().createElement('div');
       insertElement.setAttribute("class", "sig");
      }
      else if(priv.isQR())
      {
       submit_find = doc.getElementById('qr_submit');
       beforeElement = submit_find;
       insertData = "<label for=\"fmt_selection\">" + priv.lclProfile + "</label>" +
                    " <select name=\"fmtsel_" + Math.random() + "\" id=\"fmt_selection\" />";
       for(var i in fmtList)
       {
        var sVal = fmtList[i];
        if (sVal.Type_Forum)
        {
         if (iIndex == -1 && fFind == sVal.id)
          iIndex = idx;
         idx++;
         insertData+="<option value=\"" + sVal.id + "\">" + sVal.name + "</option>";
        }
       }
       insertData+= "<option value=\"none\">" + priv.lclDisForm + "</option>" +
                    "</select>";
       insertData+= "<a href=\"//www.gaiaonline.com/favicon.ico#gaiaformat/options\" target=\"optionsGaiaFormat\" style=\"vertical-align: bottom;\"><img src=\"" + priv.opt64 + "\" alt=\"" + priv.lclOptions + "\" title=\"" + priv.lclOptions + "\"></a>" +
                    "<iframe name=\"optionsGaiaFormat\" id=\"optionsGaiaFormat\" src=\"about:blank\" style=\"display: none;\">";
       insertElement = priv.contentDoc().createElement('span');
       insertElement.setAttribute("style","margin: 12px 15px 0px 15px; font-size: 11px; vertical-align: middle; display: inline-block;");
       submit_find.addEventListener("click", window.com.RealityRipple.GaiaFormat.AutoFormat, true);
       httpRequest.register();
      }
      else
      {
       submit_find = doc.getElementById("post_style").getElementsByTagName('h3')[0];
       beforeElement = null;
       insertData = "";
       for(var i in fmtList)
       {
        var sVal = fmtList[i];
        if (sVal.Type_Forum && !priv.isGuild() && !priv.isCom() && !priv.isPM())
        {
         if (iIndex == -1 && fFind == sVal.id)
          iIndex = idx;
         idx++;
         insertData+="<option value=\"" + sVal.id + "\">" + sVal.name + "</option>";
        }
       }
       insertData+= "<option value=\"none\">" + priv.lclDisForm + "</option>";
       insertElement = priv.contentDoc().createElement('select');
       insertElement.setAttribute("id", "fmt_selection");
       insertElement.setAttribute("name", "fmtsel_" + Math.random());
       insertElement.setAttribute("style", "position: absolute; top: 6px; right: 23px; width: 150px;");
       var siblingData = "<a href=\"//www.gaiaonline.com/favicon.ico#gaiaformat/options\" target=\"optionsGaiaFormat\"><img src=\"" + priv.opt64 + "\" alt=\"" + priv.lclOptions + "\" title=\"" + priv.lclOptions + "\"></a>" +
                         "<iframe name=\"optionsGaiaFormat\" id=\"optionsGaiaFormat\" src=\"about:blank\" style=\"display: none;\">";
       var insertSibling = priv.contentDoc().createElement('span');
       insertSibling.setAttribute("style", "position: absolute; top: 7px; right: 5px; width: 16px;");
       insertSibling.innerHTML = siblingData;
       submit_find.parentNode.insertBefore(insertSibling, null);
      }
      if (submit_find && !doc.getElementById('fmt_selection'))
      {
       insertElement.innerHTML = insertData;
       submit_find.parentNode.insertBefore(insertElement, beforeElement);
       var selFormat = priv.getElementsByAttribute('fmt_selection', 'id')[0];
       if (alreadyformed)
        selFormat.selectedIndex = selFormat.length - 1;
       else if (iIndex > -1)
        selFormat.selectedIndex = iIndex;
       priv.selIndex = selFormat.value;
       priv.Prefs.setCharPref("Favored", priv.selIndex);
      }
     }
    }
    catch(e){}
    try
    {
     var autoArea = priv.getBox();
     var autoAreaForm = autoArea.form;
     autoAreaForm.addEventListener("submit", window.com.RealityRipple.GaiaFormat.AutoFormat, true);
    }
    catch(e){}
   }
  }
 }
 pub.pagegrabber_start = function()
 {
  var doc = gBrowser.selectedBrowser.contentDocument;
  priv.pagegrabber(doc);
 }
 pub.standardLoad = function()
 {
  window.addEventListener('DOMContentLoaded', window.com.RealityRipple.GaiaFormat.pagegrabber_start,false);
 }
 priv.buffer = null;
 pub.tablselect = function(event)
 {
  priv.buffer = gBrowser.getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex);
  setTimeout(window.com.RealityRipple.GaiaFormat.bufferLoad, 155);
 }
 pub.bufferLoad = function()
 {
  if (priv.isGaia())
   priv.pagegrabber(priv.buffer.contentDocument);
 }
 pub.reLoad = function()
 {
  gBrowser.mPanelContainer.addEventListener("select", window.com.RealityRipple.GaiaFormat.tablselect, false);
 }
 priv.isGaia = function()
 {
  try
  {
   var x = priv.contentDoc().location.href;
  }
  catch(e)
  {
   return false;
  }
  if (x.indexOf('gaiaonline.com') > 0)
   return true;
  else
   return false;
 }
 priv.isMsg = function()
 {
  var x = priv.contentDoc().location.href;
  if (x.indexOf('compose/entry') > 0) return true;
  if (x.indexOf('compose/topic') > 0) return true;
  if (x.indexOf('posting.ph') > 0) return true;
  if (x.indexOf('mode=post') > 0) return true;
  if (x.indexOf('mode=reply') > 0) return true;
  if (x.indexOf('mode=entry') > 0) return true;
  if (x.indexOf('mode=comment') > 0) return true;
  if (x.indexOf('comment.AddComment') > 0) return true;
  if (x.indexOf('mode=addcomment') > 0) return true;
  if (x.indexOf('/t.') > 0) return true;
  if (x.substr(-11) == 'privmsg.php') return true;
  if (x.substr(-11) == 'journal.php') return true;
  if (x.substr(-18) == 'guilds/posting.php') return true;
  return false;
 }
 priv.isGuild = function()
 {
  var x = priv.contentDoc().location.href;
  if (x.indexOf('gaiaonline.com/guilds') > 0)
   return true;
  else
   return false;
 }
 priv.isCom = function()
 {
  var x = priv.contentDoc().location.href;
  if (x.indexOf('comment.AddComment') > 0 || x.indexOf('mode=addcomment') > 0)
   return true;
  else
   return false;
 }
 priv.isPM = function()
 {
  var x = priv.contentDoc().location.href;
  if (x.indexOf('privmsg.php') > 0)
   return true;
  else
   return false;
 }
 priv.isQR = function()
 {
  var x = priv.contentDoc().location.href;
  if (x.indexOf('/t.') > 0)
   return true;
  else
   return false;
 }
 priv.getBox = function()
 {
  try
  {
   var post  = priv.contentDoc().getElementsByName('message').item(0);
   if(!post)
    post = priv.contentDoc().getElementsByName("form[comment]").item(0);
   if(!post)
    post = priv.contentDoc().getElementsByName("comment").item(0);
   if(!post)
    post = priv.contentDoc().getElementById("comment");
   if(!post)
    post = priv.contentDoc().getElementById('qr_text');
   return post;
  }
  catch(e){}
 }
 priv.trim = function(str, chars)
 {
  return priv.lTrim(priv.rTrim(str, chars), chars);
 }
 priv.lTrim = function(str, chars)
 {
  chars = chars || "\\s";
  return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
 }
 priv.rTrim = function(str, chars)
 {
  chars = chars || "\\s";
  return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
 }
 priv.specialFormat = function(sIn)
 {
  var fmtList   = priv.formatList()[priv.selIndex];
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
     else if(sFind.lastIndexOf('[imgleft]') > sFind.lastIndexOf('[/imgleft]')){}
     else if(sFind.lastIndexOf('[imgright]') > sFind.lastIndexOf('[/imgright]')){}
     else if(sFind.lastIndexOf('[imgmap]') > sFind.lastIndexOf('[/imgmap]')){}
     else if(sFind.lastIndexOf('[code]') > sFind.lastIndexOf('[/code]')){}
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
  return decodeURIComponent(sIn)
 }
 priv.doFormat = function()
 {
   var fmtList   = priv.formatList()[priv.selIndex];
   var fmtBegin  = fmtList.Begin;
   var fmtEnd    = fmtList.End;
   var fmtStyle  = fmtList.Style;
   var post  = priv.getBox();
   var postx = post.value+'';
   if (!priv.isCom() && !priv.isPM() && !priv.isGuild())
   {
    try
    {
     priv.contentDoc().getElementsByName("basic_type")[0].selectedIndex = fmtStyle;
    }
    catch(e){}
   }
   if (post.selectionStart != post.selectionEnd)
   {
    var topstring = postx.substring(0, post.selectionStart);
    var midstring = encodeURIComponent(postx.substring(post.selectionStart, post.selectionEnd));
    var endstring = postx.substring(post.selectionEnd, post.value.length);
    post.value = topstring + fmtBegin + priv.specialFormat(midstring) + fmtEnd + endstring;
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
       if (priv.trim(sChunk) == '')
        sTmp += sChunk;
       else
        sTmp += fmtBegin + priv.specialFormat(encodeURIComponent(sChunk)) + fmtEnd;
      }
      if (i + 1 < outQuote.length)
       sTmp += postx.substr(inQuote[i], outQuote[i+1] - inQuote[i]);
     }
     post.value = sTmp;
    }
   }

 }
 priv.formatList = function()
 {
  try
  {
   var fmtCount = priv.Prefs.getIntPref("Formats");
   if (fmtCount > 0)
   {
    var fmtData = [];
    for (var i = 0; i < fmtCount; i++)
    {
     var iID = priv.Prefs.getCharPref("Format[" + i + "].id");
     fmtData[iID] = {
      "name": decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].name")),
      "id": iID,
      "Type_Forum": priv.Prefs.getBoolPref("Format[" + i + "].Type.Forum"),
      "Type_Guild": priv.Prefs.getBoolPref("Format[" + i + "].Type.Guild"),
      "Type_PM": priv.Prefs.getBoolPref("Format[" + i + "].Type.PM"),
      "Type_Comm": priv.Prefs.getBoolPref("Format[" + i + "].Type.Comm"),
      "Begin": decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].Begin")),
      "End": decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].End")),
      "Style": priv.Prefs.getIntPref("Format[" + i + "].Style"),
      "Extras": priv.Prefs.getBoolPref("Format[" + i + "].Extras"),
      "ExtraItems": priv.Prefs.getIntPref("Format[" + i + "].Extras.Items"),
      "ExtraItem": []
     };
     
     for (var j = 0; j < fmtData[iID].ExtraItems; j++)
     {
      fmtData[iID].ExtraItem[j] = {
       "Begin": decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].Extras.Begin[" + j + "]")),
       "End":   decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].Extras.End[" + j + "]")),
       "Left":  decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].Extras.Left[" + j + "]")),
       "Right": decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].Extras.Right[" + j + "]"))
      };
     }
    }
    return fmtData;
   }
   else
   {
    var fmtData = [];
    fmtData['default'] = {
     "name": "Default",
     "id": "default",
     "Type_Forum": priv.Prefs.getBoolPref("Forum"),
     "Type_Guild": priv.Prefs.getBoolPref("Guild"),
     "Type_PM": priv.Prefs.getBoolPref("PM"),
     "Type_Comm": priv.Prefs.getBoolPref("Comm"),
     "Begin": decodeURIComponent(priv.Prefs.getCharPref("Begin")),
     "End": decodeURIComponent(priv.Prefs.getCharPref("End")),
     "Style": priv.Prefs.getIntPref("Style"),
     "Extras": priv.Prefs.getBoolPref("Extras"),
     "ExtraItems": priv.Prefs.getIntPref("EItems"),
     "ExtraItem": []
    };
    for (var i = 0; i < fmtData['default'].ExtraItems; i++)
    {
     fmtData['default'].ExtraItem[i] = {
      "Begin": decodeURIComponent(priv.Prefs.getCharPref("EBegin[" + i + "]")),
      "End":   decodeURIComponent(priv.Prefs.getCharPref("EEnd[" + i + "]")),
      "Left":  decodeURIComponent(priv.Prefs.getCharPref("ELeft[" + i + "]")),
      "Right": decodeURIComponent(priv.Prefs.getCharPref("ERight[" + i + "]"))
     };
    }
    return fmtData;
   }
  }
  catch(e)
  {
   var fmtData = [];
   fmtData['default'] =
   {
    "name": "Default",
    "id": "default",
    "Type_Forum": true,
    "Type_Guild": true,
    "Type_PM": true,
    "Type_Comm": true,
    "Begin": "[color=green][align=left]--Personalize this formatting--[/align][/color][align=center]\n",
    "End": "\n[/align][color=green][align=right]--Customize it in Tools > Add-Ons > Extensions > GaiaFormat > Options--[/align][/color]",
    "Style": 0,
    "Extras": false,
    "ExtraItems": 0,
    "ExtraItem": []
   };
   return fmtData;
  }
 }
 pub.AutoFormat = function()
 {
  try
  {
   var doc  = gBrowser.selectedBrowser.contentDocument;
   var post = priv.getBox().value;
   var bFormed  = false;
   var selFormat = doc.getElementById("fmt_selection");
   priv.selIndex = selFormat.value;
   priv.Prefs.setCharPref("Favored", priv.selIndex);
   var fmtList = priv.formatList()[priv.selIndex];
   if (post.substr(fmtList.End.length * -1) == fmtList.End)
    bFormed = true;
   try
   {
    if(!bFormed && selFormat.value != 'none')
    {
     if (priv.isCom() && fmtList.Type_Comm)
      priv.doFormat();
     else if (!priv.isCom() && priv.isPM() && fmtList.Type_PM)
      priv.doFormat();
     else if (priv.isGuild() && fmtList.Type_Guild)
      priv.doFormat();
     else if (!priv.isCom() && !priv.isPM() && !priv.isGuild() && fmtList.Type_Forum)
      priv.doFormat();
    }
   }
   catch(e){}
   return true;
  }
  catch(e){}
 }
 var httpRequest =
 {
  observe: function(subject, topic, data)
  {
   if (topic == "http-on-modify-request")
   {
    var oHttp = subject.QueryInterface(priv.Ci.nsIHttpChannel);
    if (oHttp.requestMethod == "POST")
    {
     var uri = oHttp.URI.asciiSpec;
     if (uri.substr(uri.indexOf('gaiaonline.com'), 43) == 'gaiaonline.com/forum/compose/ajaxentry/new/' && priv.selIndex != 'none')
     {
      var fmtList   = priv.formatList()[priv.selIndex];
      var fmtStyle  = fmtList.Style;
      var sBody = this.getPostText(subject) + '&basic_type=' + fmtList[priv.selIndex].Style + '&compound_type=0';
      this.setPostText(subject, sBody);
      oHttp.setRequestHeader("Content-Length", sBody.length, false);
      oHttp.requestMethod = "POST";
      this.observerService.removeObserver(this, "http-on-modify-request");
     }
    }
   }
  },
  get observerService() {return priv.CcgS("@mozilla.org/observer-service;1","nsIObserverService");},
  register: function() {this.observerService.addObserver(this, "http-on-modify-request", false);},
  getPostText: function(subject)
  {
   var upStream = subject.QueryInterface(priv.Ci.nsIUploadChannel).uploadStream;
   if(upStream)
   {
    var seekStream = upStream.QueryInterface(priv.Ci.nsISeekableStream);
    var prevOffset;
    if (seekStream)
    {
     prevOffset = seekStream.tell();
     seekStream.seek(priv.Ci.nsISeekableStream.NS_SEEK_SET, 0);
    }
    var text = this.readFromStream(upStream, true);
    if (seekStream && prevOffset == 0)
     seekStream.seek(priv.Ci.nsISeekableStream.NS_SEEK_SET, 0);
    return text;
   }
  },
  readFromStream: function(stream, noClose)
  {
   var binStream = priv.CcgS("@mozilla.org/binaryinputstream;1","nsIBinaryInputStream");
   binStream.setInputStream(stream);
   var segments = [];
   for (var count = stream.available(); count; count = stream.available())
    segments.push(binStream.readBytes(count));
   if (!noClose)
    binStream.close();
   var text = segments.join("");
   return text;
  },
  setPostText: function(subject, body)
  {
   var aBody = priv.CccI('@mozilla.org/io/string-input-stream;1','nsIStringInputStream');
   aBody.setData(body, body.length);
   var uChan = subject.QueryInterface(priv.Ci.nsIUploadChannel);
   uChan.setUploadStream(aBody, "application/x-www-form-urlencoded", -1);
  }
 };
 return pub;
}();
setTimeout(window.com.RealityRipple.GaiaFormat.reLoad, 1777);
window.addEventListener('load', window.com.RealityRipple.GaiaFormat.standardLoad, false);
