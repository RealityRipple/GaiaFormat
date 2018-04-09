if (!com) var com = {};
if (!com.RealityRipple) com.RealityRipple = {};
com.RealityRipple.GaiaFormatDialog = function()
{
 var pub  = {};
 var priv = {};

 priv.Prefs  = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.gaiaformat.");
 priv.Syncs  = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("services.sync.prefs.sync.extensions.gaiaformat.");
 priv.format = new Array();
 priv.fIndex = 0;

 priv.xml = {};
 priv.xml.reader  = Components.classes["@mozilla.org/saxparser/xmlreader;1"].createInstance(Components.interfaces.nsISAXXMLReader);
 priv.xml.ctnr    = '';
 priv.xml.parsing = false;
 priv.xml.element = '';
 priv.xml.attrs = {};
 priv.xml.attrs.n = new Array();
 priv.xml.attrs.v = new Array();
 priv.xml.value   = '';
 priv.xml.EItem = 0;

 priv.Prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
 priv.gBundle        = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
 priv.locale         = priv.gBundle.createBundle("chrome://gaiaformat/locale/gaiaformat.properties");
 priv.lclPrefix      = "[color=green][align=left]--Personalize this formatting--[/align][/color][align=center]\n";
 priv.lclSuffix      = "\n[/align][color=green][align=right]--Customize it in Tools > Add-Ons > Extensions > GaiaFormat > Options--[/align][/color]";
 priv.lclSpecial     = priv.locale.GetStringFromName("specialtext.label");
 priv.lclAlrtExp     = priv.locale.GetStringFromName("alert.exported");
 priv.lclAlrtExpFail = priv.locale.GetStringFromName("alert.expfail");
 priv.lclAlrtImp     = priv.locale.GetStringFromName("alert.imported");
 priv.lclAlrtUnsafe  = priv.locale.GetStringFromName("alert.unsafe");
 priv.lclAlrtUnShow  = priv.locale.GetStringFromName("alert.unsafe.show");
 priv.lclAlrtNewFT   = priv.locale.GetStringFromName("alert.newformat.title");
 priv.lclAlrtNewF    = priv.locale.GetStringFromName("alert.newformat.value");
 priv.lclAlrtNewFN   = priv.locale.GetStringFromName("alert.newformat.name");
 priv.lclAlrtRemFT   = priv.locale.GetStringFromName("alert.remformat.title");
 priv.lclAlrtRemF    = priv.locale.GetStringFromName("alert.remformat.value");
 priv.formatCount = function()
 {
  var idx = 0;
  for (var i in priv.format)
  {
   idx++;
  }
  return idx;
 }

 pub.newFormat = function()
 {
  var newName = {value: priv.lclAlrtNewFN};
  var result = priv.Prompts.prompt(null, priv.lclAlrtNewFT, priv.lclAlrtNewF, newName, null, {value: false});
  if (result)
  {
   var retID = newName.value.toLowerCase() + priv.formatCount();
   retID = retID.replace(' ', '_');
   priv.format[retID] = {
    "name": newName.value,
    "id": retID,
    "Type_Forum": true,
    "Type_Guild": true,
    "Type_PM": true,
    "Type_Comm": true,
    "Begin": '',
    "End": '',
    "Style": 0,
    "Extras": false,
    "ExtraItems": 0,
    "ExtraItem": []};
   document.getElementById("cmbFormat").appendItem(newName.value, retID);
   priv.selLastFormat();
   com.RealityRipple.GaiaFormatDialog.showFormat();
   com.RealityRipple.GaiaFormatDialog.SelectExtra();
  }
 }

 pub.remFormat = function()
 {
  var cmbFormat = document.getElementById("cmbFormat");
  if (cmbFormat.selectedIndex > -1)
  {
   var retID = cmbFormat.selectedItem.value;
   if (retID == null)
   {
    retID = cmbFormat.value;
   }
   var retStr = cmbFormat.selectedItem.label;
   if (retStr == null)
   {
    retStr = cmbFormat.label;
   }
   var result = !priv.Prompts.confirmEx(null, priv.lclAlrtRemFT, priv.lclAlrtRemF.replace('%1', retStr), priv.Prompts.STD_YES_NO_BUTTONS, null, null, null, null, {value: false});
   if (result)
   {
    cmbFormat.removeItemAt(cmbFormat.selectedIndex);
    delete priv.format[retID];
    priv.selLastFormat();
    com.RealityRipple.GaiaFormatDialog.showFormat();
    com.RealityRipple.GaiaFormatDialog.SelectExtra();
   }
  }
 }

 pub.showFormat = function()
 {
  var cmbFormat = document.getElementById("cmbFormat");
  if (cmbFormat.selectedIndex > -1)
  {
   priv.fIndex = cmbFormat.selectedItem.value;
   if (priv.fIndex == null)
   {
    priv.fIndex = cmbFormat.value;
   }
   var myFormat = priv.format[priv.fIndex];
   document.getElementById("cmbFormat").disabled = false;
   document.getElementById("chkForum").disabled = false;
   document.getElementById("chkGuild").disabled = false;
   document.getElementById("chkPM").disabled = false;
   document.getElementById("chkComment").disabled = false;
   document.getElementById("txtFormatPre").disabled = false;
   document.getElementById("txtFormatSuf").disabled = false;
   document.getElementById("cmbStyle").disabled = false;
   document.getElementById("chkExtra").disabled = false;
   document.getElementById("chkForum").checked = myFormat.Type_Forum;
   document.getElementById("chkGuild").checked = myFormat.Type_Guild;
   document.getElementById("chkPM").checked = myFormat.Type_PM;
   document.getElementById("chkComment").checked = myFormat.Type_Comm;
   document.getElementById("txtFormatPre").value = myFormat.Begin;
   document.getElementById("txtFormatSuf").value = myFormat.End;
   document.getElementById("cmbStyle").value = myFormat.Style;
   document.getElementById("chkExtra").checked = myFormat.Extras;
   while(document.getElementById("lstExtras").getRowCount() != 0)
    document.getElementById("lstExtras").removeItemAt(0);
   for (var i = 0; i < myFormat.ExtraItems; i++)
   {
    document.getElementById("lstExtras").appendItem(myFormat.ExtraItem[i].Left + priv.lclSpecial + myFormat.ExtraItem[i].Right);
   }
   com.RealityRipple.GaiaFormatDialog.SelectExtra();
  }
  else
  {
   priv.fIndex = 'none';
   document.getElementById("cmbFormat").disabled = true;
   document.getElementById("chkForum").disabled = true;
   document.getElementById("chkGuild").disabled = true;
   document.getElementById("chkPM").disabled = true;
   document.getElementById("chkComment").disabled = true;
   document.getElementById("txtFormatPre").disabled = true;
   document.getElementById("txtFormatSuf").disabled = true;
   document.getElementById("cmbStyle").disabled = true;
   document.getElementById("chkExtra").disabled = true;
   document.getElementById("chkForum").checked = false;
   document.getElementById("chkGuild").checked = false;
   document.getElementById("chkPM").checked = false;
   document.getElementById("chkComment").checked = false;
   document.getElementById("txtFormatPre").value = '';
   document.getElementById("txtFormatSuf").value = '';
   document.getElementById("cmbStyle").value = 0;
   document.getElementById("chkExtra").checked = false;
   while(document.getElementById("lstExtras").getRowCount() != 0)
    document.getElementById("lstExtras").removeItemAt(0);
   com.RealityRipple.GaiaFormatDialog.SelectExtra();
  }
 }

 priv.selLastFormat = function()
 {
  var cmbFormat = document.getElementById("cmbFormat");
  if (cmbFormat.itemCount == null)
  {
   if (cmbFormat.childNodes[0].childNodes.length > 0)
   {
    cmbFormat.selectedIndex = cmbFormat.childNodes[0].childNodes.length - 1;
   }
   else
   {
    cmbFormat.selectedIndex = -1;
   }
  }
  else
  {
   if (cmbFormat.itemCount > 0)
   {
    cmbFormat.selectedIndex = cmbFormat.itemCount - 1;
   }
   else
   {
    cmbFormat.selectedIndex = -1;
   }
  }
 }

 pub.AddExtra = function(sLeft, sRight, sBegin, sEnd)
 {
  var myFormat = priv.format[priv.fIndex];
  myFormat.ExtraItems++;
  myFormat.ExtraItem[myFormat.ExtraItems - 1] = {
   "Left": sLeft,
   "Right": sRight,
   "Begin": sBegin,
   "End": sEnd};
  document.getElementById("lstExtras").appendItem(sLeft + priv.lclSpecial + sRight);
 }
 
 pub.SetExtra = function()
 {
  var i = document.getElementById("lstExtras").selectedIndex;
  if (i >= 0)
  {
   var myFormat = priv.format[priv.fIndex];
   myFormat.ExtraItem[i].Left = document.getElementById("txtELeft").value;
   myFormat.ExtraItem[i].Right = document.getElementById("txtERight").value;
   myFormat.ExtraItem[i].Begin = document.getElementById("txtEBegin").value;
   myFormat.ExtraItem[i].End   = document.getElementById("txtEEnd").value
   document.getElementById("lstExtras").selectedItem.label = myFormat.ExtraItem[i].Left + priv.lclSpecial + myFormat.ExtraItem[i].Right;
  }
  else
  {
   document.getElementById("txtELeft").value   = '';
   document.getElementById("txtERight").value  = '';
   document.getElementById("txtEBegin").value  = '';
   document.getElementById("txtEEnd").value    = '';
  }
 }
 
 pub.RemoveExtra = function()
 {
  var i = document.getElementById("lstExtras").selectedIndex;
  var myFormat = priv.format[priv.fIndex];
  if(myFormat.ExtraItems > 0 && i >= 0)
  {
   myFormat.ExtraItems--;
   myFormat.ExtraItem.splice(i,1)
   document.getElementById("lstExtras").removeItemAt(i);
   document.getElementById("lstExtras").selectedIndex = i - 1;
  }
  if(myFormat.ExtraItems == 0)
  {
   document.getElementById("txtELeft").value = '';
   document.getElementById("txtERight").value = '';
   document.getElementById("txtEBegin").value = '';
   document.getElementById("txtEEnd").value = '';
  }
  com.RealityRipple.GaiaFormatDialog.SelectExtra();
 }
 
 pub.SelectExtra = function()
 {
  var i = document.getElementById("lstExtras").selectedIndex;
  if(i >= 0)
  {
   var myFormat = priv.format[priv.fIndex];
   document.getElementById("txtELeft").value   = myFormat.ExtraItem[i].Left;
   document.getElementById("txtERight").value  = myFormat.ExtraItem[i].Right;
   document.getElementById("txtEBegin").value  = myFormat.ExtraItem[i].Begin;
   document.getElementById("txtEEnd").value    = myFormat.ExtraItem[i].End;
  }
  else
  {
   document.getElementById("txtELeft").value   = '';
   document.getElementById("txtERight").value  = '';
   document.getElementById("txtEBegin").value  = '';
   document.getElementById("txtEEnd").value    = '';
  }
  com.RealityRipple.GaiaFormatDialog.postCheck();
 }
 
 pub.save = function()
 {
  var oldFCount = 0;
  try{oldFCount = priv.Prefs.getIntPref("Formats");}
  catch (e){oldFCount = 0;}
  if (oldFCount > priv.formatCount())
  {
   for (var i = 0; i < oldFCount; i++)
   {
    priv.Prefs.deleteBranch("Format[" + i + "].name");
    priv.Prefs.deleteBranch("Format[" + i + "].id");
    priv.Prefs.deleteBranch("Format[" + i + "].Type.Forum");
    priv.Prefs.deleteBranch("Format[" + i + "].Type.Guild");
    priv.Prefs.deleteBranch("Format[" + i + "].Type.PM");
    priv.Prefs.deleteBranch("Format[" + i + "].Type.Comm");
    priv.Prefs.deleteBranch("Format[" + i + "].Style");
    priv.Prefs.deleteBranch("Format[" + i + "].Extras");
    priv.Prefs.deleteBranch("Format[" + i + "].Begin");
    priv.Prefs.deleteBranch("Format[" + i + "].End");

    priv.Syncs.deleteBranch("Format[" + i + "].name");
    priv.Syncs.deleteBranch("Format[" + i + "].id");
    priv.Syncs.deleteBranch("Format[" + i + "].Type.Forum");
    priv.Syncs.deleteBranch("Format[" + i + "].Type.Guild");
    priv.Syncs.deleteBranch("Format[" + i + "].Type.PM");
    priv.Syncs.deleteBranch("Format[" + i + "].Type.Comm");
    priv.Syncs.deleteBranch("Format[" + i + "].Style");
    priv.Syncs.deleteBranch("Format[" + i + "].Extras");
    priv.Syncs.deleteBranch("Format[" + i + "].Begin");
    priv.Syncs.deleteBranch("Format[" + i + "].End");
    var eItems = 0;
    try{eItems = priv.Prefs.getIntPref("Format[" + i + "].Extras.Items");}
    catch (e){eItems = 0;}
    if (eItems > 0)
    {
     for (var j = 0; j < eItems; j++)
     priv.Prefs.deleteBranch("Format[" + i + "].Extras.Left[" + j + "]");
     priv.Prefs.deleteBranch("Format[" + i + "].Extras.Right[" + j + "]");
     priv.Prefs.deleteBranch("Format[" + i + "].Extras.Begin[" + j + "]");
     priv.Prefs.deleteBranch("Format[" + i + "].Extras.End[" + j + "]");

     priv.Syncs.deleteBranch("Format[" + i + "].Extras.Left[" + j + "]");
     priv.Syncs.deleteBranch("Format[" + i + "].Extras.Right[" + j + "]");
     priv.Syncs.deleteBranch("Format[" + i + "].Extras.Begin[" + j + "]");
     priv.Syncs.deleteBranch("Format[" + i + "].Extras.End[" + j + "]");
    }
    else
    {
     priv.Prefs.deleteBranch("Format[" + i + "].Extras.Items");

     priv.Syncs.deleteBranch("Format[" + i + "].Extras.Items");
    }
   }
  }
  priv.Prefs.setIntPref("Formats", priv.formatCount());
  priv.Prefs.setCharPref("Favored", priv.fIndex);
  var idx = 0;
  for (var i in priv.format)
  {
   var itm = priv.format[i];
   priv.Prefs.setCharPref("Format[" + idx + "].name", itm.name);
   priv.Prefs.setCharPref("Format[" + idx + "].id", itm.id);
   priv.Prefs.setBoolPref("Format[" + idx + "].Type.Forum", itm.Type_Forum);
   priv.Prefs.setBoolPref("Format[" + idx + "].Type.Guild", itm.Type_Guild);
   priv.Prefs.setBoolPref("Format[" + idx + "].Type.PM", itm.Type_PM);
   priv.Prefs.setBoolPref("Format[" + idx + "].Type.Comm", itm.Type_Comm);
   priv.Prefs.setIntPref("Format[" + idx + "].Style", itm.Style);
   priv.Prefs.setBoolPref("Format[" + idx + "].Extras", itm.Extras);
   priv.Prefs.setCharPref("Format[" + idx + "].Begin", encodeURIComponent(itm.Begin));
   priv.Prefs.setCharPref("Format[" + idx + "].End",   encodeURIComponent(itm.End));

   priv.Syncs.setBoolPref("Format[" + idx + "].name", true);
   priv.Syncs.setBoolPref("Format[" + idx + "].id", true);
   priv.Syncs.setBoolPref("Format[" + idx + "].Type.Forum", true);
   priv.Syncs.setBoolPref("Format[" + idx + "].Type.Guild", true);
   priv.Syncs.setBoolPref("Format[" + idx + "].Type.PM", true);
   priv.Syncs.setBoolPref("Format[" + idx + "].Type.Comm", true);
   priv.Syncs.setBoolPref("Format[" + idx + "].Style", true);
   priv.Syncs.setBoolPref("Format[" + idx + "].Extras", true);
   priv.Syncs.setBoolPref("Format[" + idx + "].Begin", true);
   priv.Syncs.setBoolPref("Format[" + idx + "].End",   true);
   var oldCount = 0;
   try{oldCount = priv.Prefs.getIntPref("Format[" + idx + "].Extras.Items");}
   catch (e){oldCount = 0;}
   if(oldCount > itm.ExtraItems)
   {
    for(var j = 0; j < oldCount; j++)
    {
     priv.Prefs.deleteBranch("Format[" + idx + "].Extras.Left[" + j + "]");
     priv.Prefs.deleteBranch("Format[" + idx + "].Extras.Right[" + j + "]");
     priv.Prefs.deleteBranch("Format[" + idx + "].Extras.Begin[" + j + "]");
     priv.Prefs.deleteBranch("Format[" + idx + "].Extras.End[" + j + "]");
     priv.Syncs.deleteBranch("Format[" + idx + "].Extras.Left[" + j + "]");
     priv.Syncs.deleteBranch("Format[" + idx + "].Extras.Right[" + j + "]");
     priv.Syncs.deleteBranch("Format[" + idx + "].Extras.Begin[" + j + "]");
     priv.Syncs.deleteBranch("Format[" + idx + "].Extras.End[" + j + "]");
    }
   }
   priv.Prefs.setIntPref("Format[" + idx + "].Extras.Items", itm.ExtraItems);
   priv.Syncs.setBoolPref("Format[" + idx + "].Extras.Items", true);
   if (itm.ExtraItems > 0)
   {
    var alrt = priv.Prefs.getBoolPref("UnsafeAlert");
    for(var j = 0; j < itm.ExtraItems; j++)
    {
     priv.Prefs.setCharPref("Format[" + idx + "].Extras.Left[" + j + "]", encodeURIComponent(itm.ExtraItem[j].Left));
     priv.Prefs.setCharPref("Format[" + idx + "].Extras.Right[" + j + "]", encodeURIComponent(itm.ExtraItem[j].Right));
     priv.Prefs.setCharPref("Format[" + idx + "].Extras.Begin[" + j + "]", encodeURIComponent(itm.ExtraItem[j].Begin));
     priv.Prefs.setCharPref("Format[" + idx + "].Extras.End[" + j + "]", encodeURIComponent(itm.ExtraItem[j].End));
     priv.Syncs.setBoolPref("Format[" + idx + "].Extras.Left[" + j + "]", true);
     priv.Syncs.setBoolPref("Format[" + idx + "].Extras.Right[" + j + "]", true);
     priv.Syncs.setBoolPref("Format[" + idx + "].Extras.Begin[" + j + "]", true);
     priv.Syncs.setBoolPref("Format[" + idx + "].Extras.End[" + j + "]", true);
     if (itm.ExtraItem[j].Left.indexOf('[') > -1 || itm.ExtraItem[j].Left.indexOf(']') > -1 ||
         itm.ExtraItem[j].Right.indexOf('[') > -1 || itm.ExtraItem[j].Right.indexOf(']') > -1)
     {
      if (alrt)
      {
       var notAgain = {value: false};
       priv.Prompts.alertCheck(null, "GaiaFormat", priv.lclAlrtUnsafe, priv.lclAlrtUnShow, notAgain);
       if (notAgain.value)
        priv.Prefs.setBoolPref("UnsafeAlert", false);
      }
      alrt = false;
     }
    }
   }
   idx++;
  }
  var oldPrefs  = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("gaiaformat.");
  var pItems = oldPrefs.getChildList("", {});
  if (pItems.length > 0)
   oldPrefs.deleteBranch("");
  if (priv.Prefs.prefHasUserValue("Forum"))
   priv.Prefs.deleteBranch("Forum");
  if (priv.Prefs.prefHasUserValue("Guild"))
   priv.Prefs.deleteBranch("Guild");
  if (priv.Prefs.prefHasUserValue("PM"))
   priv.Prefs.deleteBranch("PM");
  if (priv.Prefs.prefHasUserValue("Comm"))
   priv.Prefs.deleteBranch("Comm");
  if (priv.Prefs.prefHasUserValue("Begin"))
   priv.Prefs.deleteBranch("Begin");
  if (priv.Prefs.prefHasUserValue("End"))
   priv.Prefs.deleteBranch("End");
  if (priv.Prefs.prefHasUserValue("Style"))
   priv.Prefs.deleteBranch("Style");
  if (priv.Prefs.prefHasUserValue("Extras"))
   priv.Prefs.deleteBranch("Extras");
  if (priv.Prefs.prefHasUserValue("EItems"))
  {
   var oldItems = priv.Prefs.getIntPref("EItems");
   priv.Prefs.deleteBranch("EItems");
   for (var i = 0; i < oldItems; i++)
   {
    if (priv.Prefs.prefHasUserValue("EBegin[" + i + "]"))
     priv.Prefs.deleteBranch("EBegin[" + i + "]");
    if (priv.Prefs.prefHasUserValue("EEnd[" + i + "]"))
     priv.Prefs.deleteBranch("EEnd[" + i + "]");
    if (priv.Prefs.prefHasUserValue("ELeft[" + i + "]"))
     priv.Prefs.deleteBranch("ELeft[" + i + "]");
    if (priv.Prefs.prefHasUserValue("ERight[" + i + "]"))
     priv.Prefs.deleteBranch("ERight[" + i + "]");
   }
  }
 }

 pub.init = function()
 {
  try
  {
   document.getElementById("cmbFormat").removeAllItems();
   var fmtCount = priv.Prefs.getIntPref("Formats");
   if (fmtCount > 0)
   {
    var fFind = '';
    var iFound = -1;
    try
    {
     fFind = priv.Prefs.getCharPref("Favored");
    }
    catch(e)
    {
     iFound = 0;
    }
    for (var i = 0; i < fmtCount; i++)
    {
     var pName = decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].name"));
     var pID = priv.Prefs.getCharPref("Format[" + i + "].id");
     if (iFound == -1 && fFind == pID)
      iFound = i;
     document.getElementById("cmbFormat").appendItem(pName, pID);
     priv.format[pID] = {
      "name": pName,
      "id": pID,
      "Type_Forum": priv.Prefs.getBoolPref("Format[" + i + "].Type.Forum"),
      "Type_Guild": priv.Prefs.getBoolPref("Format[" + i + "].Type.Guild"),
      "Type_PM": priv.Prefs.getBoolPref("Format[" + i + "].Type.PM"),
      "Type_Comm": priv.Prefs.getBoolPref("Format[" + i + "].Type.Comm"),
      "Begin": decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].Begin")),
      "End": decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].End")),
      "Style": priv.Prefs.getIntPref("Format[" + i + "].Style"),
      "Extras": priv.Prefs.getBoolPref("Format[" + i + "].Extras"),
      "ExtraItems": priv.Prefs.getIntPref("Format[" + i + "].Extras.Items"),
      "ExtraItem": []};
     for (var j = 0; j < priv.format[pID].ExtraItems; j++)
     {
      priv.format[pID].ExtraItem[j] = {
       "Begin": decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].Extras.Begin[" + j + "]")),
       "End":   decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].Extras.End[" + j + "]")),
       "Left":  decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].Extras.Left[" + j + "]")),
       "Right": decodeURIComponent(priv.Prefs.getCharPref("Format[" + i + "].Extras.Right[" + j + "]"))
      };
     }
    }
    if (iFound == -1)
     iFound = 0;
    document.getElementById("cmbFormat").selectedIndex = iFound;
    com.RealityRipple.GaiaFormatDialog.showFormat();
   }
   else
   {
    document.getElementById("cmbFormat").appendItem("Default", 'default');
    var pForum, pGuild, pPM, pComm, pBegin, pEnd, pStyle, pExtras, pExtraItems;
    try {pForum = priv.Prefs.getBoolPref("Forum");}
    catch (e) {pForum = true;}
    try {pGuild = priv.Prefs.getBoolPref("Guild");}
    catch (e) {pGuild = true;}
    try {pPM = priv.Prefs.getBoolPref("PM");}
    catch (e) {pPM = true;}
    try {pComm = priv.Prefs.getBoolPref("Comm");}
    catch (e) {pComm = true;}
    try {pBegin = decodeURIComponent(priv.Prefs.getCharPref("Begin"));}
    catch (e) {pBegin = priv.lclPrefix;}
    try {pEnd = decodeURIComponent(priv.Prefs.getCharPref("End"));}
    catch (e) {pEnd = priv.lclSuffix;}
    try {pStyle = priv.Prefs.getIntPref("Style");}
    catch (e) {pStyle = 0;}
    try {pExtras = priv.Prefs.getBoolPref("Extras");}
    catch (e) {pExtras = false;}
    try {pExtraItems = priv.Prefs.getIntPref("EItems");}
    catch (e) {pExtraItems = 0;}
    priv.format['default'] = {
      "name": "Default",
      "id": 'default',
      "Type_Forum": pForum,
      "Type_Guild": pGuild,
      "Type_PM": pPM,
      "Type_Comm": pComm,
      "Begin": pBegin,
      "End": pEnd,
      "Style": pStyle,
      "Extras": pExtras,
      "ExtraItems": pExtraItems,
      "ExtraItem": []};
    if(priv.format['default'].ExtraItems > 0)
    {
     for(var i = 0; i < priv.format['default'].ExtraItems; i++)
     {
      var eBegin, eEnd, eLeft, eRight;
      try {eBegin = decodeURIComponent(priv.Prefs.getCharPref("EBegin[" + i + "]"));}
      catch (e) {eBegin = '';}
      try {eEnd = decodeURIComponent(priv.Prefs.getCharPref("EEnd[" + i + "]"));}
      catch (e) {eEnd = '';}
      try {eLeft = decodeURIComponent(priv.Prefs.getCharPref("ELeft[" + i + "]"));}
      catch (e) {eLeft = '';}
      try {eRight = decodeURIComponent(priv.Prefs.getCharPref("ERight[" + i + "]"));}
      catch (e) {eRight = '';}
      priv.format['default'].ExtraItem[i] = {
       "Begin": eBegin,
       "End":   eEnd,
       "Left":  eLeft,
       "Right": eRight
      };
     }
    }
    document.getElementById("cmbFormat").selectedIndex = 0;
    com.RealityRipple.GaiaFormatDialog.showFormat();
   }
  }
  catch(e)
  {
   priv.format['default'] = {
     "name": "Default",
     "id": 'default',
     "Type_Forum": true,
     "Type_Guild": true,
     "Type_PM": true,
     "Type_Comm": true,
     "Begin": priv.lclPrefix,
     "End": priv.lclSuffix,
     "Style": 0,
     "Extras": false,
     "ExtraItems": 0,
     "ExtraItem": []};
   document.getElementById("cmbFormat").selectedIndex = 0;
   com.RealityRipple.GaiaFormatDialog.showFormat();
  }
 }

 pub.populateFormat = function()
 {
  var myFormat = priv.format[priv.fIndex];
  myFormat.Type_Forum = document.getElementById("chkForum").checked;
  myFormat.Type_Guild = document.getElementById("chkGuild").checked;
  myFormat.Type_PM = document.getElementById("chkPM").checked;
  myFormat.Type_Comm = document.getElementById("chkComment").checked;
  myFormat.Begin = document.getElementById("txtFormatPre").value;
  myFormat.End = document.getElementById("txtFormatSuf").value;
  myFormat.Style = document.getElementById("cmbStyle").value;
  myFormat.Extras = document.getElementById("chkExtra").checked;
  
  com.RealityRipple.GaiaFormatDialog.postCheck();
 }

 pub.postCheck = function()
 {
  document.getElementById('cmbStyle').disabled  = !(document.getElementById('chkForum').checked);
  document.getElementById('lstExtras').disabled = !(document.getElementById('chkExtra').checked);
  document.getElementById('cmdAdd').disabled    = !(document.getElementById('chkExtra').checked);
  document.getElementById('cmdRem').disabled    = !(document.getElementById('chkExtra').checked);
  var i = document.getElementById("lstExtras").selectedIndex;
  document.getElementById('txtELeft').disabled  = !(document.getElementById('chkExtra').checked & i >= 0);
  document.getElementById('txtERight').disabled = !(document.getElementById('chkExtra').checked & i >= 0);
  document.getElementById('txtEBegin').disabled = !(document.getElementById('chkExtra').checked & i >= 0);
  document.getElementById('txtEEnd').disabled   = !(document.getElementById('chkExtra').checked & i >= 0);
 }

 pub.importFile = function()
 {
  var picker = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
  var fileLocator = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
  picker.init(window, "Import GaiaFormat File...", picker.modeOpen);
  picker.appendFilters(picker.filterXML);
  picker.appendFilters(picker.filterAll);
  picker.displayDirectory = fileLocator.get("Desk", Components.interfaces.nsILocalFile);
  if (picker.show() != picker.returnCancel)
  {
   var fileStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
   fileStream.init(picker.file, 0x01, 0444, 0);
   var stream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
   stream.init(fileStream, "iso-8859-1", 16384, Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
   stream = stream.QueryInterface(Components.interfaces.nsIUnicharLineInputStream);
   var lines = [];
   var line = {value: null};
   while (stream.readLine(line))
    lines.push(line.value);
   if (line.value)
    lines.push(line.value);
   stream.close();
   priv.xml.reader.parseFromString(lines.join("\n\r"), "text/xml");
   com.RealityRipple.GaiaFormatDialog.showFormat();
   com.RealityRipple.GaiaFormatDialog.SelectExtra();
  }
 }

 pub.exportFile = function()
 {
  var sFile;
  var picker = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
  var fileLocator = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
  picker.init(window, "Export GaiaFormat File...", picker.modeSave);
  picker.defaultExtension = ".xml";
  picker.appendFilters(picker.filterXML);
  picker.appendFilters(picker.filterAll);
  picker.displayDirectory = fileLocator.get("Desk", Components.interfaces.nsILocalFile);
  var myFormat = priv.format[priv.fIndex];
  if (picker.show() != picker.returnCancel)
  {
   var nl = "\r\n";
   sFile = '<?xml version="1.0" encoding="iso-8859-1"?>' + nl;
   sFile+= '<!DOCTYPE gaiaformat SYSTEM "https://realityripple.com/Software/Mozilla-Extensions/GaiaFormat/gfs.dtd">' + nl;
   sFile+= '<gaiaformat>' + nl;
   sFile+= ' <standard>' + nl;
   sFile+= '  <prefix>' + encodeURIComponent(myFormat.Begin) + '</prefix>' + nl;
   sFile+= '  <suffix>' + encodeURIComponent(myFormat.End) + '</suffix>' + nl;
   sFile+= '  <message>' + nl;
   sFile+= '   <forum>' + myFormat.Type_Forum + '</forum>' + nl;
   sFile+= '   <pm>' + myFormat.Type_PM + '</pm>' + nl;
   sFile+= '   <guild>' + myFormat.Type_Guild + '</guild>' + nl;
   sFile+= '   <comment>' + myFormat.Type_Comm + '</comment>' + nl;
   sFile+= '  </message>' + nl;
   sFile+= '  <style>' + myFormat.Style + '</style>' + nl;
   sFile+= ' </standard>' + nl
   sFile+= ' <extras count="' + myFormat.ExtraItems + '">' + nl;
   sFile+= '  <enabled>' + myFormat.Extras + '</enabled>' + nl;
   if(myFormat.ExtraItems > 0)
   {
    for(var i = 0; i < myFormat.ExtraItems; i++)
    {
     sFile+= '  <extra>' + nl;
     sFile+= '   <leftkey>' + encodeURIComponent(myFormat.ExtraItem[i].Left) + '</leftkey>' + nl;
     sFile+= '   <rightkey>' + encodeURIComponent(myFormat.ExtraItem[i].Right) + '</rightkey>' + nl;
     sFile+= '   <prefix>' + encodeURIComponent(myFormat.ExtraItem[i].Begin) + '</prefix>' + nl;
     sFile+= '   <suffix>' + encodeURIComponent(myFormat.ExtraItem[i].End) + '</suffix>' + nl;
     sFile+= '  </extra>' + nl;
    }
   }
   sFile+= ' </extras>' + nl;
   sFile+= '</gaiaformat>';
   try
   {
    var fileStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
    fileStream.init(picker.file, 0x02 | 0x08 | 0x20, 0644, 0);
    var stream = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
    stream.init(fileStream, "UTF-8", 16384, Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
    stream.writeString(sFile);
    stream.close();
    priv.Prompts.alert(null,'GaiaFormat',priv.lclAlrtExp);
   }
   catch (e)
   {
    priv.Prompts.alert(null,'GaiaFormat',priv.lclAlrtExpFail + " [" + e + "]");
   }
  }
 }

 priv.xml.parse = function(xdata)
 {
  var myFormat = priv.format[priv.fIndex];
  switch(xdata.ctnr)
  {
   case 'standard':
    switch(xdata.element)
    {
     case 'prefix':
      myFormat.Begin = decodeURIComponent(xdata.value);
      break;
     case 'suffix':
      myFormat.End = decodeURIComponent(xdata.value);
      break;
     case 'style':
      myFormat.Style = xdata.value;
      break;
    }
    break;
   case 'message':
    switch(xdata.element)
    {
     case 'forum':
      myFormat.Type_Forum = (xdata.value == 'true');
      break;
     case 'pm':
      myFormat.Type_PM = (xdata.value == 'true');
      break;
     case 'guild':
      myFormat.Type_Guild = (xdata.value == 'true');
      break;
     case 'comment':
      myFormat.Type_Comm = (xdata.value == 'true');
      break;
    }
    break;
   case 'extras':
    switch(xdata.element)
    {
     case 'extras':
      myFormat.ExtraItems = xdata.attrs.v[0];
      myFormat.ExtraItem = [];
      for (var i = 0; i < myFormat.ExtraItems; i++)
      {
       myFormat.ExtraItem[i] = {
        "Left": "",
        "Right": "",
        "Begin": "",
        "End": ""};
      }
      break;
     case 'enabled':
      myFormat.Extras = (xdata.value == 'true');
      break;
    }
    break;
   case 'extra':
    switch(xdata.element)
    {
     case 'leftkey':
      myFormat.ExtraItem[priv.xml.EItem].Left = decodeURIComponent(xdata.value);
      break;
     case 'rightkey':
      myFormat.ExtraItem[priv.xml.EItem].Right = decodeURIComponent(xdata.value);
      break;
     case 'prefix':
      myFormat.ExtraItem[priv.xml.EItem].Begin = decodeURIComponent(xdata.value);
      break;
     case 'suffix':
      myFormat.ExtraItem[priv.xml.EItem].End = decodeURIComponent(xdata.value);
      break;
    }
    break;
  }
 }

 priv.xml.cleanup = function()
 {
  while(document.getElementById("lstExtras").getRowCount() != 0)
   document.getElementById("lstExtras").removeItemAt(0);
  document.getElementById("txtELeft").value = '';
  document.getElementById("txtERight").value = '';
  document.getElementById("txtEBegin").value = '';
  document.getElementById("txtEEnd").value = '';
  var myFormat = priv.format[priv.fIndex];
  if(myFormat.ExtraItems > 0)
  {
   for(var i = 0; i < myFormat.ExtraItems; i++)
   {
    document.getElementById("lstExtras").appendItem(myFormat.ExtraItem[i].Left + priv.lclSpecial + myFormat.ExtraItem[i].Right);
   }
   document.getElementById("lstExtras").selectedIndex = 0;
   com.RealityRipple.GaiaFormatDialog.SelectExtra();
  }
  com.RealityRipple.GaiaFormatDialog.postCheck();
  priv.Prompts.alert(null,'GaiaFormat',priv.lclAlrtImp);
 }

 priv.xml.reader.contentHandler =
 {
  startDocument: function()
  {
   priv.xml.parsing = true;
  },
  endDocument: function()
  {
   priv.xml.parsing = false;
   priv.xml.cleanup();
  },
  startElement: function(uri, localName, qName, /*nsISAXAttributes*/ attributes)
  {
   if (priv.xml.parsing)
   {
    if (localName=='standard' || localName=='message' || localName=='extras' || localName=='extra')
    {
     priv.xml.ctnr = localName;
     if (localName=='extras')
     {
      for(var i = 0; i < attributes.length; i++)
      {
       priv.xml.attrs.n.push(attributes.getQName(i));
       priv.xml.attrs.v.push(attributes.getValue(i));
      }
      priv.xml.element = localName;
      priv.xml.value   = '';
      priv.xml.EItem  = 0;
      priv.xml.parse(priv.xml);
     }
    }
    else
    {
     for(var i = 0; i < attributes.length; i++)
     {
      priv.xml.attrs.n.push(attributes.getQName(i));
      priv.xml.attrs.v.push(attributes.getValue(i));
     }
     priv.xml.element = localName;
     priv.xml.value   = ''
    }
   }
  },
  endElement: function(uri, localName, qName)
  {
   if (localName=='standard' || localName=='message' || localName=='extras' || localName=='extra')
   {
    if (localName=='message')
     priv.xml.ctnr = 'standard';
    else if (localName=='extra')
    {
     priv.xml.EItem++;
     priv.xml.ctnr = 'extras';
    }
    else
     priv.xml.ctnr = '';
   }
   else
   {
    if (priv.xml.parsing)
    {
     if (priv.xml.element != '')
      priv.xml.parse(priv.xml)
     priv.xml.attrs.n = new Array();
     priv.xml.attrs.v = new Array();
     priv.xml.element = ''
     priv.xml.value   = ''
    }
   }
  },
  characters: function(value)
  {
   if (priv.xml.parsing)
   {
    if (priv.xml.element != '')
    {
     priv.xml.value+= value;
    }
   }
  },
  processingInstruction: function(target, data)
  {
   // don't care
  },
  ignorableWhitespace: function(whitespace)
  {
   // don't care
  },
  startPrefixMapping: function(prefix, uri)
  {
   // don't care
  },
  endPrefixMapping: function(prefix)
  {
   // don't care
  },
  QueryInterface: function(iid)
  {
   if(!iid.equals(Components.interfaces.nsISupports) && !iid.equals(Components.interfaces.nsISAXContentHandler))
    throw Components.results.NS_ERROR_NO_INTERFACE;
   return this;
  }
 };

 return pub;
}();
