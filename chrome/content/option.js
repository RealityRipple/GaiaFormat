var GaiaFormatDialog =
{
 _Prefs:   Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('extensions.gaiaformat.'),
 _Syncs:   Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('services.sync.prefs.sync.extensions.gaiaformat.'),
 _Prompts: Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService),
 _format: [],
 _fIndex: 0,
 _xml_reader:  Components.classes['@mozilla.org/saxparser/xmlreader;1'].createInstance(Components.interfaces.nsISAXXMLReader),
 _xml_ctnr:    '',
 _xml_parsing: false,
 _xml_element: '',
 _xml_attr_n:  [],
 _xml_attr_v:  [],
 _xml_value:   '',
 _xml_EItem:   0,
 _lclPrefix:      '[color=green][align=left]--Personalize this formatting--[/align][/color][align=center]\n',
 _lclSuffix:      '\n[/align][color=green][align=right]--Customize it in Tools > Add-Ons > Extensions > GaiaFormat > Options--[/align][/color]',
 _lclSpecial:     '',
 _lclAlrtExp:     '',
 _lclAlrtExpFail: '',
 _lclAlrtImp:     '',
 _lclAlrtUnsafe:  '',
 _lclAlrtUnShow:  '',
 _lclAlrtNewFT:   '',
 _lclAlrtNewF:    '',
 _lclAlrtNewFN:   '',
 _lclAlrtRemFT:   '',
 _lclAlrtRemF:    '',
 loadLocales: function()
 {
  var locale = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://gaiaformat/locale/gaiaformat.properties');
  GaiaFormatDialog._lclSpecial =     locale.GetStringFromName('specialtext.label');
  GaiaFormatDialog._lclAlrtExp =     locale.GetStringFromName('alert.exported');
  GaiaFormatDialog._lclAlrtExpFail = locale.GetStringFromName('alert.expfail');
  GaiaFormatDialog._lclAlrtImp =     locale.GetStringFromName('alert.imported');
  GaiaFormatDialog._lclAlrtUnsafe =  locale.GetStringFromName('alert.unsafe');
  GaiaFormatDialog._lclAlrtUnShow =  locale.GetStringFromName('alert.unsafe.show');
  GaiaFormatDialog._lclAlrtNewFT =   locale.GetStringFromName('alert.newformat.title');
  GaiaFormatDialog._lclAlrtNewF =    locale.GetStringFromName('alert.newformat.value');
  GaiaFormatDialog._lclAlrtNewFN =   locale.GetStringFromName('alert.newformat.name');
  GaiaFormatDialog._lclAlrtRemFT =   locale.GetStringFromName('alert.remformat.title');
  GaiaFormatDialog._lclAlrtRemF =    locale.GetStringFromName('alert.remformat.value');
 },
 _formatCount: function()
 {
  var i = 0;
  var idx = 0;
  for (i in GaiaFormatDialog._format)
  {
   idx++;
  }
  return idx;
 },
 newFormat: function()
 {
  var newName = {value: GaiaFormatDialog._lclAlrtNewFN};
  var result = GaiaFormatDialog._Prompts.prompt(null, GaiaFormatDialog._lclAlrtNewFT, GaiaFormatDialog._lclAlrtNewF, newName, null, {value: false});
  if (result)
  {
   var retID = newName.value.toLowerCase() + GaiaFormatDialog._formatCount();
   retID = retID.replace(' ', '_');
   GaiaFormatDialog._format[retID] = {
    'name': newName.value,
    'id': retID,
    'Type_ForumT': true,
    'Type_Forum': true,
    'Type_Guild': true,
    'Type_PM': true,
    'Type_Comm': true,
    'Begin': '',
    'End': '',
    'Style': 0,
    'Extras': false,
    'ExtraItems': 0,
    'ExtraItem': []};
   document.getElementById('cmbFormat').appendItem(newName.value, retID);
   GaiaFormatDialog._selLastFormat();
   GaiaFormatDialog.showFormat();
   GaiaFormatDialog.SelectExtra();
  }
 },
 remFormat: function()
 {
  var cmbFormat = document.getElementById('cmbFormat');
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
   var result = !GaiaFormatDialog._Prompts.confirmEx(null, GaiaFormatDialog._lclAlrtRemFT, GaiaFormatDialog._lclAlrtRemF.replace('%1', retStr), GaiaFormatDialog._Prompts.STD_YES_NO_BUTTONS, null, null, null, null, {value: false});
   if (result)
   {
    cmbFormat.removeItemAt(cmbFormat.selectedIndex);
    delete GaiaFormatDialog._format[retID];
    GaiaFormatDialog._selLastFormat();
    GaiaFormatDialog.showFormat();
    GaiaFormatDialog.SelectExtra();
   }
  }
 },
 showFormat: function()
 {
  var cmbFormat = document.getElementById('cmbFormat');
  if (cmbFormat.selectedIndex > -1)
  {
   GaiaFormatDialog._fIndex = cmbFormat.selectedItem.value;
   if (GaiaFormatDialog._fIndex == null)
   {
    GaiaFormatDialog._fIndex = cmbFormat.value;
   }
   var myFormat = GaiaFormatDialog._format[GaiaFormatDialog._fIndex];
   document.getElementById('cmbFormat').disabled = false;
   document.getElementById('chkForumT').disabled = false;
   document.getElementById('chkForum').disabled = false;
   document.getElementById('chkGuild').disabled = false;
   document.getElementById('chkPM').disabled = false;
   document.getElementById('chkComment').disabled = false;
   document.getElementById('txtFormatPre').disabled = false;
   document.getElementById('txtFormatSuf').disabled = false;
   document.getElementById('cmbStyle').disabled = false;
   document.getElementById('chkExtra').disabled = false;
   document.getElementById('chkForumT').checked = myFormat.Type_ForumT;
   document.getElementById('chkForum').checked = myFormat.Type_Forum;
   document.getElementById('chkGuild').checked = myFormat.Type_Guild;
   document.getElementById('chkPM').checked = myFormat.Type_PM;
   document.getElementById('chkComment').checked = myFormat.Type_Comm;
   document.getElementById('txtFormatPre').value = myFormat.Begin;
   document.getElementById('txtFormatSuf').value = myFormat.End;
   document.getElementById('cmbStyle').value = myFormat.Style;
   document.getElementById('chkExtra').checked = myFormat.Extras;
   while(document.getElementById('lstExtras').getRowCount() != 0)
    document.getElementById('lstExtras').removeItemAt(0);
   for (var i = 0; i < myFormat.ExtraItems; i++)
   {
    document.getElementById('lstExtras').appendItem(myFormat.ExtraItem[i].Left + GaiaFormatDialog._lclSpecial + myFormat.ExtraItem[i].Right);
   }
   GaiaFormatDialog.SelectExtra();
  }
  else
  {
   GaiaFormatDialog._fIndex = 'none';
   document.getElementById('cmbFormat').disabled = true;
   document.getElementById('chkForumT').disabled = true;
   document.getElementById('chkForum').disabled = true;
   document.getElementById('chkGuild').disabled = true;
   document.getElementById('chkPM').disabled = true;
   document.getElementById('chkComment').disabled = true;
   document.getElementById('txtFormatPre').disabled = true;
   document.getElementById('txtFormatSuf').disabled = true;
   document.getElementById('cmbStyle').disabled = true;
   document.getElementById('chkExtra').disabled = true;
   document.getElementById('chkForumT').checked = false;
   document.getElementById('chkForum').checked = false;
   document.getElementById('chkGuild').checked = false;
   document.getElementById('chkPM').checked = false;
   document.getElementById('chkComment').checked = false;
   document.getElementById('txtFormatPre').value = '';
   document.getElementById('txtFormatSuf').value = '';
   document.getElementById('cmbStyle').value = 0;
   document.getElementById('chkExtra').checked = false;
   while(document.getElementById('lstExtras').getRowCount() != 0)
    document.getElementById('lstExtras').removeItemAt(0);
   GaiaFormatDialog.SelectExtra();
  }
 },
 _selLastFormat: function()
 {
  var cmbFormat = document.getElementById('cmbFormat');
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
 },
 AddExtra: function(sLeft, sRight, sBegin, sEnd)
 {
  var myFormat = GaiaFormatDialog._format[GaiaFormatDialog._fIndex];
  myFormat.ExtraItems++;
  myFormat.ExtraItem[myFormat.ExtraItems - 1] = {
   'Left': sLeft,
   'Right': sRight,
   'Begin': sBegin,
   'End': sEnd};
  document.getElementById('lstExtras').appendItem(sLeft + GaiaFormatDialog._lclSpecial + sRight);
 },
 SetExtra: function()
 {
  var i = document.getElementById('lstExtras').selectedIndex;
  if (i >= 0)
  {
   var myFormat = GaiaFormatDialog._format[GaiaFormatDialog._fIndex];
   myFormat.ExtraItem[i].Left = document.getElementById('txtELeft').value;
   myFormat.ExtraItem[i].Right = document.getElementById('txtERight').value;
   myFormat.ExtraItem[i].Begin = document.getElementById('txtEBegin').value;
   myFormat.ExtraItem[i].End   = document.getElementById('txtEEnd').value;
   document.getElementById('lstExtras').selectedItem.label = myFormat.ExtraItem[i].Left + GaiaFormatDialog._lclSpecial + myFormat.ExtraItem[i].Right;
  }
  else
  {
   document.getElementById('txtELeft').value   = '';
   document.getElementById('txtERight').value  = '';
   document.getElementById('txtEBegin').value  = '';
   document.getElementById('txtEEnd').value    = '';
  }
 },
 RemoveExtra: function()
 {
  var i = document.getElementById('lstExtras').selectedIndex;
  var myFormat = GaiaFormatDialog._format[GaiaFormatDialog._fIndex];
  if(myFormat.ExtraItems > 0 && i >= 0)
  {
   myFormat.ExtraItems--;
   myFormat.ExtraItem.splice(i, 1);
   document.getElementById('lstExtras').removeItemAt(i);
   document.getElementById('lstExtras').selectedIndex = i - 1;
  }
  if(myFormat.ExtraItems == 0)
  {
   document.getElementById('txtELeft').value = '';
   document.getElementById('txtERight').value = '';
   document.getElementById('txtEBegin').value = '';
   document.getElementById('txtEEnd').value = '';
  }
  GaiaFormatDialog.SelectExtra();
 },
 SelectExtra: function()
 {
  var i = document.getElementById('lstExtras').selectedIndex;
  if(i >= 0)
  {
   var myFormat = GaiaFormatDialog._format[GaiaFormatDialog._fIndex];
   document.getElementById('txtELeft').value   = myFormat.ExtraItem[i].Left;
   document.getElementById('txtERight').value  = myFormat.ExtraItem[i].Right;
   document.getElementById('txtEBegin').value  = myFormat.ExtraItem[i].Begin;
   document.getElementById('txtEEnd').value    = myFormat.ExtraItem[i].End;
  }
  else
  {
   document.getElementById('txtELeft').value   = '';
   document.getElementById('txtERight').value  = '';
   document.getElementById('txtEBegin').value  = '';
   document.getElementById('txtEEnd').value    = '';
  }
  GaiaFormatDialog.postCheck();
 },
 save: function()
 {
  var i = 0;
  var j = 0;
  var oldFCount = 0;
  try{oldFCount = GaiaFormatDialog._Prefs.getIntPref('Formats');}
  catch (e){oldFCount = 0;}
  if (oldFCount > GaiaFormatDialog._formatCount())
  {
   for (i = 0; i < oldFCount; i++)
   {
    GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].name');
    GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].id');
    GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Type.ForumT');
    GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Type.Forum');
    GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Type.Guild');
    GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Type.PM');
    GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Type.Comm');
    GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Style');
    GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Extras');
    GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Begin');
    GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].End');

    GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].name');
    GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].id');
    GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Type.ForumT');
    GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Type.Forum');
    GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Type.Guild');
    GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Type.PM');
    GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Type.Comm');
    GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Style');
    GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Extras');
    GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Begin');
    GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].End');
    var eItems = 0;
    try{eItems = GaiaFormatDialog._Prefs.getIntPref('Format[' + i + '].Extras.Items');}
    catch (e){eItems = 0;}
    if (eItems > 0)
    {
     for (j = 0; j < eItems; j++)
     GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Extras.Left[' + j + ']');
     GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Extras.Right[' + j + ']');
     GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Extras.Begin[' + j + ']');
     GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Extras.End[' + j + ']');

     GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Extras.Left[' + j + ']');
     GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Extras.Right[' + j + ']');
     GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Extras.Begin[' + j + ']');
     GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Extras.End[' + j + ']');
    }
    else
    {
     GaiaFormatDialog._Prefs.deleteBranch('Format[' + i + '].Extras.Items');

     GaiaFormatDialog._Syncs.deleteBranch('Format[' + i + '].Extras.Items');
    }
   }
  }
  GaiaFormatDialog._Prefs.setIntPref('Formats', GaiaFormatDialog._formatCount());
  GaiaFormatDialog._Prefs.setCharPref('Favored', GaiaFormatDialog._fIndex);
  var idx = 0;
  for (i in GaiaFormatDialog._format)
  {
   var itm = GaiaFormatDialog._format[i];
   GaiaFormatDialog._Prefs.setCharPref('Format[' + idx + '].name', itm.name);
   GaiaFormatDialog._Prefs.setCharPref('Format[' + idx + '].id', itm.id);
   GaiaFormatDialog._Prefs.setBoolPref('Format[' + idx + '].Type.ForumT', itm.Type_ForumT);
   GaiaFormatDialog._Prefs.setBoolPref('Format[' + idx + '].Type.Forum', itm.Type_Forum);
   GaiaFormatDialog._Prefs.setBoolPref('Format[' + idx + '].Type.Guild', itm.Type_Guild);
   GaiaFormatDialog._Prefs.setBoolPref('Format[' + idx + '].Type.PM', itm.Type_PM);
   GaiaFormatDialog._Prefs.setBoolPref('Format[' + idx + '].Type.Comm', itm.Type_Comm);
   GaiaFormatDialog._Prefs.setIntPref('Format[' + idx + '].Style', itm.Style);
   GaiaFormatDialog._Prefs.setBoolPref('Format[' + idx + '].Extras', itm.Extras);
   GaiaFormatDialog._Prefs.setCharPref('Format[' + idx + '].Begin', encodeURIComponent(itm.Begin));
   GaiaFormatDialog._Prefs.setCharPref('Format[' + idx + '].End',   encodeURIComponent(itm.End));

   GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].name', true);
   GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].id', true);
   GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Type.ForumT', true);
   GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Type.Forum', true);
   GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Type.Guild', true);
   GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Type.PM', true);
   GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Type.Comm', true);
   GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Style', true);
   GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Extras', true);
   GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Begin', true);
   GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].End',   true);
   var oldCount = 0;
   try{oldCount = GaiaFormatDialog._Prefs.getIntPref('Format[' + idx + '].Extras.Items');}
   catch (e){oldCount = 0;}
   if(oldCount > itm.ExtraItems)
   {
    for(j = 0; j < oldCount; j++)
    {
     GaiaFormatDialog._Prefs.deleteBranch('Format[' + idx + '].Extras.Left[' + j + ']');
     GaiaFormatDialog._Prefs.deleteBranch('Format[' + idx + '].Extras.Right[' + j + ']');
     GaiaFormatDialog._Prefs.deleteBranch('Format[' + idx + '].Extras.Begin[' + j + ']');
     GaiaFormatDialog._Prefs.deleteBranch('Format[' + idx + '].Extras.End[' + j + ']');
     GaiaFormatDialog._Syncs.deleteBranch('Format[' + idx + '].Extras.Left[' + j + ']');
     GaiaFormatDialog._Syncs.deleteBranch('Format[' + idx + '].Extras.Right[' + j + ']');
     GaiaFormatDialog._Syncs.deleteBranch('Format[' + idx + '].Extras.Begin[' + j + ']');
     GaiaFormatDialog._Syncs.deleteBranch('Format[' + idx + '].Extras.End[' + j + ']');
    }
   }
   GaiaFormatDialog._Prefs.setIntPref('Format[' + idx + '].Extras.Items', itm.ExtraItems);
   GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Extras.Items', true);
   if (itm.ExtraItems > 0)
   {
    var alrt = GaiaFormatDialog._Prefs.getBoolPref('UnsafeAlert');
    for(j = 0; j < itm.ExtraItems; j++)
    {
     GaiaFormatDialog._Prefs.setCharPref('Format[' + idx + '].Extras.Left[' + j + ']', encodeURIComponent(itm.ExtraItem[j].Left));
     GaiaFormatDialog._Prefs.setCharPref('Format[' + idx + '].Extras.Right[' + j + ']', encodeURIComponent(itm.ExtraItem[j].Right));
     GaiaFormatDialog._Prefs.setCharPref('Format[' + idx + '].Extras.Begin[' + j + ']', encodeURIComponent(itm.ExtraItem[j].Begin));
     GaiaFormatDialog._Prefs.setCharPref('Format[' + idx + '].Extras.End[' + j + ']', encodeURIComponent(itm.ExtraItem[j].End));
     GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Extras.Left[' + j + ']', true);
     GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Extras.Right[' + j + ']', true);
     GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Extras.Begin[' + j + ']', true);
     GaiaFormatDialog._Syncs.setBoolPref('Format[' + idx + '].Extras.End[' + j + ']', true);
     if (itm.ExtraItem[j].Left.indexOf('[') > -1 || itm.ExtraItem[j].Left.indexOf(']') > -1 ||
         itm.ExtraItem[j].Right.indexOf('[') > -1 || itm.ExtraItem[j].Right.indexOf(']') > -1)
     {
      if (alrt)
      {
       var notAgain = {value: false};
       GaiaFormatDialog._Prompts.alertCheck(null, 'GaiaFormat', GaiaFormatDialog._lclAlrtUnsafe, GaiaFormatDialog._lclAlrtUnShow, notAgain);
       if (notAgain.value)
        GaiaFormatDialog._Prefs.setBoolPref('UnsafeAlert', false);
      }
      alrt = false;
     }
    }
   }
   idx++;
  }
  var oldPrefs  = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('gaiaformat.');
  var pItems = oldPrefs.getChildList('', {});
  if (pItems.length > 0)
   oldPrefs.deleteBranch('');
  if (GaiaFormatDialog._Prefs.prefHasUserValue('ForumT'))
   GaiaFormatDialog._Prefs.deleteBranch('ForumT');
  if (GaiaFormatDialog._Prefs.prefHasUserValue('Forum'))
   GaiaFormatDialog._Prefs.deleteBranch('Forum');
  if (GaiaFormatDialog._Prefs.prefHasUserValue('Guild'))
   GaiaFormatDialog._Prefs.deleteBranch('Guild');
  if (GaiaFormatDialog._Prefs.prefHasUserValue('PM'))
   GaiaFormatDialog._Prefs.deleteBranch('PM');
  if (GaiaFormatDialog._Prefs.prefHasUserValue('Comm'))
   GaiaFormatDialog._Prefs.deleteBranch('Comm');
  if (GaiaFormatDialog._Prefs.prefHasUserValue('Begin'))
   GaiaFormatDialog._Prefs.deleteBranch('Begin');
  if (GaiaFormatDialog._Prefs.prefHasUserValue('End'))
   GaiaFormatDialog._Prefs.deleteBranch('End');
  if (GaiaFormatDialog._Prefs.prefHasUserValue('Style'))
   GaiaFormatDialog._Prefs.deleteBranch('Style');
  if (GaiaFormatDialog._Prefs.prefHasUserValue('Extras'))
   GaiaFormatDialog._Prefs.deleteBranch('Extras');
  if (GaiaFormatDialog._Prefs.prefHasUserValue('EItems'))
  {
   var oldItems = GaiaFormatDialog._Prefs.getIntPref('EItems');
   GaiaFormatDialog._Prefs.deleteBranch('EItems');
   for (i = 0; i < oldItems; i++)
   {
    if (GaiaFormatDialog._Prefs.prefHasUserValue('EBegin[' + i + ']'))
     GaiaFormatDialog._Prefs.deleteBranch('EBegin[' + i + ']');
    if (GaiaFormatDialog._Prefs.prefHasUserValue('EEnd[' + i + ']'))
     GaiaFormatDialog._Prefs.deleteBranch('EEnd[' + i + ']');
    if (GaiaFormatDialog._Prefs.prefHasUserValue('ELeft[' + i + ']'))
     GaiaFormatDialog._Prefs.deleteBranch('ELeft[' + i + ']');
    if (GaiaFormatDialog._Prefs.prefHasUserValue('ERight[' + i + ']'))
     GaiaFormatDialog._Prefs.deleteBranch('ERight[' + i + ']');
   }
  }
 },
 init: function()
 {
  try
  {
   var i = 0;
   var pForumT, pForum, pGuild, pPM, pComm, pBegin, pEnd, pStyle, pExtras, pExtraItems;
   var eBegin, eEnd, eLeft, eRight;
   document.getElementById('cmbFormat').removeAllItems();
   var fmtCount = GaiaFormatDialog._Prefs.getIntPref('Formats');
   if (fmtCount > 0)
   {
    var fFind = '';
    var iFound = -1;
    try
    {
     fFind = GaiaFormatDialog._Prefs.getCharPref('Favored');
    }
    catch(e)
    {
     iFound = 0;
    }
    for (i = 0; i < fmtCount; i++)
    {
     var pName = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('Format[' + i + '].name'));
     var pID = GaiaFormatDialog._Prefs.getCharPref('Format[' + i + '].id');
     if (iFound == -1 && fFind == pID)
      iFound = i;
     document.getElementById('cmbFormat').appendItem(pName, pID);
     try {pForumT = GaiaFormatDialog._Prefs.getBoolPref('Format[' + i + '].Type.ForumT');}
     catch (e) {pForumT = true;}
     try {pForumT = GaiaFormatDialog._Prefs.getBoolPref('Format[' + i + '].Type.ForumT');}
     catch (e) {pForumT = true;}
     try {pForum = GaiaFormatDialog._Prefs.getBoolPref('Format[' + i + '].Type.Forum');}
     catch (e) {pForum = true;}
     try {pGuild = GaiaFormatDialog._Prefs.getBoolPref('Format[' + i + '].Type.Guild');}
     catch (e) {pGuild = true;}
     try {pPM = GaiaFormatDialog._Prefs.getBoolPref('Format[' + i + '].Type.PM');}
     catch (e) {pPM = true;}
     try {pComm = GaiaFormatDialog._Prefs.getBoolPref('Format[' + i + '].Type.Comm');}
     catch (e) {pComm = true;}
     try {pBegin = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('Format[' + i + '].Begin'));}
     catch (e) {pBegin = GaiaFormatDialog._lclPrefix;}
     try {pEnd = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('Format[' + i + '].End'));}
     catch (e) {pEnd = GaiaFormatDialog._lclSuffix;}
     try {pStyle = GaiaFormatDialog._Prefs.getIntPref('Format[' + i + '].Style');}
     catch (e) {pStyle = 0;}
     try {pExtras = GaiaFormatDialog._Prefs.getBoolPref('Format[' + i + '].Extras');}
     catch (e) {pExtras = false;}
     try {pExtraItems = GaiaFormatDialog._Prefs.getIntPref('Format[' + i + '].Extras.Items');}
     catch (e) {pExtraItems = 0;}
     GaiaFormatDialog._format[pID] = {
      'name': pName,
      'id': pID,
      'Type_ForumT': pForumT,
      'Type_Forum': pForum,
      'Type_Guild': pGuild,
      'Type_PM': pPM,
      'Type_Comm': pComm,
      'Begin': pBegin,
      'End': pEnd,
      'Style': pStyle,
      'Extras': pExtras,
      'ExtraItems': pExtraItems,
      'ExtraItem': []};
     for (var j = 0; j < GaiaFormatDialog._format[pID].ExtraItems; j++)
     {
      try {eBegin = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('Format[' + i + '].Extras.Begin[' + j + ']'));}
      catch (e) {eBegin = '';}
      try {eEnd = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('Format[' + i + '].Extras.End[' + j + ']'));}
      catch (e) {eEnd = '';}
      try {eLeft = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('Format[' + i + '].Extras.Left[' + j + ']'));}
      catch (e) {eLeft = '';}
      try {eRight = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('Format[' + i + '].Extras.Right[' + j + ']'));}
      catch (e) {eRight = '';}
      GaiaFormatDialog._format[pID].ExtraItem[j] = {
       'Begin': eBegin,
       'End':   eEnd,
       'Left':  eLeft,
       'Right': eRight
      };
     }
    }
    if (iFound == -1)
     iFound = 0;
    document.getElementById('cmbFormat').selectedIndex = iFound;
    GaiaFormatDialog.showFormat();
   }
   else
   {
    document.getElementById('cmbFormat').appendItem('Default', 'default');
    try {pForumT = GaiaFormatDialog._Prefs.getBoolPref('ForumT');}
    catch (e) {pForumT = true;}
    try {pForum = GaiaFormatDialog._Prefs.getBoolPref('Forum');}
    catch (e) {pForum = true;}
    try {pGuild = GaiaFormatDialog._Prefs.getBoolPref('Guild');}
    catch (e) {pGuild = true;}
    try {pPM = GaiaFormatDialog._Prefs.getBoolPref('PM');}
    catch (e) {pPM = true;}
    try {pComm = GaiaFormatDialog._Prefs.getBoolPref('Comm');}
    catch (e) {pComm = true;}
    try {pBegin = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('Begin'));}
    catch (e) {pBegin = GaiaFormatDialog._lclPrefix;}
    try {pEnd = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('End'));}
    catch (e) {pEnd = GaiaFormatDialog._lclSuffix;}
    try {pStyle = GaiaFormatDialog._Prefs.getIntPref('Style');}
    catch (e) {pStyle = 0;}
    try {pExtras = GaiaFormatDialog._Prefs.getBoolPref('Extras');}
    catch (e) {pExtras = false;}
    try {pExtraItems = GaiaFormatDialog._Prefs.getIntPref('EItems');}
    catch (e) {pExtraItems = 0;}
    GaiaFormatDialog._format['default'] = {
      'name': 'Default',
      'id': 'default',
      'Type_ForumT': pForumT,
      'Type_Forum': pForum,
      'Type_Guild': pGuild,
      'Type_PM': pPM,
      'Type_Comm': pComm,
      'Begin': pBegin,
      'End': pEnd,
      'Style': pStyle,
      'Extras': pExtras,
      'ExtraItems': pExtraItems,
      'ExtraItem': []};
    if(GaiaFormatDialog._format['default'].ExtraItems > 0)
    {
     for(i = 0; i < GaiaFormatDialog._format['default'].ExtraItems; i++)
     {
      try {eBegin = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('EBegin[' + i + ']'));}
      catch (e) {eBegin = '';}
      try {eEnd = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('EEnd[' + i + ']'));}
      catch (e) {eEnd = '';}
      try {eLeft = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('ELeft[' + i + ']'));}
      catch (e) {eLeft = '';}
      try {eRight = decodeURIComponent(GaiaFormatDialog._Prefs.getCharPref('ERight[' + i + ']'));}
      catch (e) {eRight = '';}
      GaiaFormatDialog._format['default'].ExtraItem[i] = {
       'Begin': eBegin,
       'End':   eEnd,
       'Left':  eLeft,
       'Right': eRight
      };
     }
    }
    document.getElementById('cmbFormat').selectedIndex = 0;
    GaiaFormatDialog.showFormat();
   }
  }
  catch(e)
  {
   GaiaFormatDialog._format['default'] = {
     'name': 'Default',
     'id': 'default',
     'Type_ForumT': true,
     'Type_Forum': true,
     'Type_Guild': true,
     'Type_PM': true,
     'Type_Comm': true,
     'Begin': GaiaFormatDialog._lclPrefix,
     'End': GaiaFormatDialog._lclSuffix,
     'Style': 0,
     'Extras': false,
     'ExtraItems': 0,
     'ExtraItem': []};
   document.getElementById('cmbFormat').selectedIndex = 0;
   GaiaFormatDialog.showFormat();
  }
 },
 populateFormat: function()
 {
  var myFormat = GaiaFormatDialog._format[GaiaFormatDialog._fIndex];
  myFormat.Type_ForumT = document.getElementById('chkForumT').checked;
  myFormat.Type_Forum = document.getElementById('chkForum').checked;
  myFormat.Type_Guild = document.getElementById('chkGuild').checked;
  myFormat.Type_PM = document.getElementById('chkPM').checked;
  myFormat.Type_Comm = document.getElementById('chkComment').checked;
  myFormat.Begin = document.getElementById('txtFormatPre').value;
  myFormat.End = document.getElementById('txtFormatSuf').value;
  myFormat.Style = document.getElementById('cmbStyle').value;
  myFormat.Extras = document.getElementById('chkExtra').checked;
  GaiaFormatDialog.postCheck();
 },
 postCheck: function()
 {
  document.getElementById('cmbStyle').disabled  = !(document.getElementById('chkForum').checked || document.getElementById('chkForumT').checked );
  document.getElementById('lstExtras').disabled = !(document.getElementById('chkExtra').checked);
  document.getElementById('cmdAdd').disabled    = !(document.getElementById('chkExtra').checked);
  document.getElementById('cmdRem').disabled    = !(document.getElementById('chkExtra').checked);
  var i = document.getElementById('lstExtras').selectedIndex;
  document.getElementById('txtELeft').disabled  = !(document.getElementById('chkExtra').checked && i >= 0);
  document.getElementById('txtERight').disabled = !(document.getElementById('chkExtra').checked && i >= 0);
  document.getElementById('txtEBegin').disabled = !(document.getElementById('chkExtra').checked && i >= 0);
  document.getElementById('txtEEnd').disabled   = !(document.getElementById('chkExtra').checked && i >= 0);
 },
 importFile: function()
 {
  var picker = Components.classes['@mozilla.org/filepicker;1'].createInstance(Components.interfaces.nsIFilePicker);
  var fileLocator = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
  picker.init(window, 'Import GaiaFormat File...', picker.modeOpen);
  picker.appendFilters(picker.filterXML);
  picker.appendFilters(picker.filterAll);
  picker.displayDirectory = fileLocator.get('Desk', Components.interfaces.nsILocalFile);
  if (picker.show() != picker.returnCancel)
  {
   var fileStream = Components.classes['@mozilla.org/network/file-input-stream;1'].createInstance(Components.interfaces.nsIFileInputStream);
   fileStream.init(picker.file, 0x01, 0444, 0);
   var stream = Components.classes['@mozilla.org/intl/converter-input-stream;1'].createInstance(Components.interfaces.nsIConverterInputStream);
   stream.init(fileStream, 'iso-8859-1', 16384, Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
   stream = stream.QueryInterface(Components.interfaces.nsIUnicharLineInputStream);
   var lines = [];
   var line = {value: null};
   while (stream.readLine(line))
    lines.push(line.value);
   if (line.value)
    lines.push(line.value);
   stream.close();
   GaiaFormatDialog._xml_reader.parseFromString(lines.join('\n\r'), 'text/xml');
   GaiaFormatDialog.showFormat();
   GaiaFormatDialog.SelectExtra();
  }
 },
 exportFile: function()
 {
  var sFile;
  var picker = Components.classes['@mozilla.org/filepicker;1'].createInstance(Components.interfaces.nsIFilePicker);
  var fileLocator = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
  picker.init(window, 'Export GaiaFormat File...', picker.modeSave);
  picker.defaultExtension = '.xml';
  picker.appendFilters(picker.filterXML);
  picker.appendFilters(picker.filterAll);
  picker.displayDirectory = fileLocator.get('Desk', Components.interfaces.nsILocalFile);
  var myFormat = GaiaFormatDialog._format[GaiaFormatDialog._fIndex];
  if (picker.show() != picker.returnCancel)
  {
   var nl = '\r\n';
   sFile = '<?xml version="1.0" encoding="iso-8859-1"?>' + nl;
   sFile+= '<!DOCTYPE gaiaformat SYSTEM "https://realityripple.com/Software/XUL/GaiaFormat/gfs.dtd">' + nl;
   sFile+= '<gaiaformat>' + nl;
   sFile+= ' <standard>' + nl;
   sFile+= '  <prefix>' + encodeURIComponent(myFormat.Begin) + '</prefix>' + nl;
   sFile+= '  <suffix>' + encodeURIComponent(myFormat.End) + '</suffix>' + nl;
   sFile+= '  <message>' + nl;
   sFile+= '   <forumtopic>' + myFormat.Type_ForumT + '</forumtopic>' + nl;
   sFile+= '   <forum>' + myFormat.Type_Forum + '</forum>' + nl;
   sFile+= '   <pm>' + myFormat.Type_PM + '</pm>' + nl;
   sFile+= '   <guild>' + myFormat.Type_Guild + '</guild>' + nl;
   sFile+= '   <comment>' + myFormat.Type_Comm + '</comment>' + nl;
   sFile+= '  </message>' + nl;
   sFile+= '  <style>' + myFormat.Style + '</style>' + nl;
   sFile+= ' </standard>' + nl;
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
    var fileStream = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
    fileStream.init(picker.file, 0x02 | 0x08 | 0x20, 0644, 0);
    var stream = Components.classes['@mozilla.org/intl/converter-output-stream;1'].createInstance(Components.interfaces.nsIConverterOutputStream);
    stream.init(fileStream, 'UTF-8', 16384, Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
    stream.writeString(sFile);
    stream.close();
    GaiaFormatDialog._Prompts.alert(null,'GaiaFormat', GaiaFormatDialog._lclAlrtExp);
   }
   catch (e)
   {
    GaiaFormatDialog._Prompts.alert(null,'GaiaFormat', GaiaFormatDialog._lclAlrtExpFail + ' [' + e + ']');
   }
  }
 },
 _xml_parse: function()
 {
  var myFormat = GaiaFormatDialog._format[GaiaFormatDialog._fIndex];
  switch(GaiaFormatDialog._xml_ctnr)
  {
   case 'standard':
    switch(GaiaFormatDialog._xml_element)
    {
     case 'prefix':
      myFormat.Begin = decodeURIComponent(GaiaFormatDialog._xml_value);
      break;
     case 'suffix':
      myFormat.End = decodeURIComponent(GaiaFormatDialog._xml_value);
      break;
     case 'style':
      myFormat.Style = GaiaFormatDialog._xml_value;
      break;
    }
    break;
   case 'message':
    switch(GaiaFormatDialog._xml_element)
    {
     case 'forumtopic':
      myFormat.Type_ForumT = (GaiaFormatDialog._xml_value == 'true');
      break;
     case 'forum':
      myFormat.Type_Forum = (GaiaFormatDialog._xml_value == 'true');
      break;
     case 'pm':
      myFormat.Type_PM = (GaiaFormatDialog._xml_value == 'true');
      break;
     case 'guild':
      myFormat.Type_Guild = (GaiaFormatDialog._xml_value == 'true');
      break;
     case 'comment':
      myFormat.Type_Comm = (GaiaFormatDialog._xml_value == 'true');
      break;
    }
    break;
   case 'extras':
    switch(GaiaFormatDialog._xml_element)
    {
     case 'extras':
      myFormat.ExtraItems = GaiaFormatDialog._xml_attr_v[0];
      myFormat.ExtraItem = [];
      for (var i = 0; i < myFormat.ExtraItems; i++)
      {
       myFormat.ExtraItem[i] = {
        'Left': '',
        'Right': '',
        'Begin': '',
        'End': ''};
      }
      break;
     case 'enabled':
      myFormat.Extras = (GaiaFormatDialog._xml_value == 'true');
      break;
    }
    break;
   case 'extra':
    switch(GaiaFormatDialog._xml_element)
    {
     case 'leftkey':
      myFormat.ExtraItem[GaiaFormatDialog._xml_EItem].Left = decodeURIComponent(GaiaFormatDialog._xml_value);
      break;
     case 'rightkey':
      myFormat.ExtraItem[GaiaFormatDialog._xml_EItem].Right = decodeURIComponent(GaiaFormatDialog._xml_value);
      break;
     case 'prefix':
      myFormat.ExtraItem[GaiaFormatDialog._xml_EItem].Begin = decodeURIComponent(GaiaFormatDialog._xml_value);
      break;
     case 'suffix':
      myFormat.ExtraItem[GaiaFormatDialog._xml_EItem].End = decodeURIComponent(GaiaFormatDialog._xml_value);
      break;
    }
    break;
  }
 },
 _xml_cleanup: function()
 {
  while(document.getElementById('lstExtras').getRowCount() != 0)
   document.getElementById('lstExtras').removeItemAt(0);
  document.getElementById('txtELeft').value = '';
  document.getElementById('txtERight').value = '';
  document.getElementById('txtEBegin').value = '';
  document.getElementById('txtEEnd').value = '';
  var myFormat = GaiaFormatDialog._format[GaiaFormatDialog._fIndex];
  if(myFormat.ExtraItems > 0)
  {
   for(var i = 0; i < myFormat.ExtraItems; i++)
   {
    document.getElementById('lstExtras').appendItem(myFormat.ExtraItem[i].Left + GaiaFormatDialog._lclSpecial + myFormat.ExtraItem[i].Right);
   }
   document.getElementById('lstExtras').selectedIndex = 0;
   GaiaFormatDialog.SelectExtra();
  }
  GaiaFormatDialog.postCheck();
  GaiaFormatDialog._Prompts.alert(null,'GaiaFormat',GaiaFormatDialog._lclAlrtImp);
 },
 xml_prepare: function()
 {
  GaiaFormatDialog._xml_reader.contentHandler =
  {
   startDocument: function()
   {
    GaiaFormatDialog._xml_parsing = true;
   },
   endDocument: function()
   {
    GaiaFormatDialog._xml_parsing = false;
    GaiaFormatDialog._xml_cleanup();
   },
   startElement: function(uri, localName, qName, /*nsISAXAttributes*/ attributes)
   {
    var i = 0;
    if (GaiaFormatDialog._xml_parsing)
    {
     if (localName=='standard' || localName=='message' || localName=='extras' || localName=='extra')
     {
      GaiaFormatDialog._xml_ctnr = localName;
      if (localName=='extras')
      {
       for(i = 0; i < attributes.length; i++)
       {
        GaiaFormatDialog._xml_attr_n.push(attributes.getQName(i));
        GaiaFormatDialog._xml_attr_v.push(attributes.getValue(i));
       }
       GaiaFormatDialog._xml_element = localName;
       GaiaFormatDialog._xml_value   = '';
       GaiaFormatDialog._xml_EItem   = 0;
       GaiaFormatDialog._xml_parse();
      }
     }
     else
     {
      for(i = 0; i < attributes.length; i++)
      {
       GaiaFormatDialog._xml_attr_n.push(attributes.getQName(i));
       GaiaFormatDialog._xml_attr_v.push(attributes.getValue(i));
      }
      GaiaFormatDialog._xml_element = localName;
      GaiaFormatDialog._xml_value   = '';
     }
    }
   },
   endElement: function(uri, localName, qName)
   {
    if (localName=='standard' || localName=='message' || localName=='extras' || localName=='extra')
    {
     if (localName=='message')
      GaiaFormatDialog._xml_ctnr = 'standard';
     else if (localName=='extra')
     {
      GaiaFormatDialog._xml_EItem++;
      GaiaFormatDialog._xml_ctnr = 'extras';
     }
     else
      GaiaFormatDialog._xml_ctnr = '';
    }
    else
    {
     if (GaiaFormatDialog._xml_parsing)
     {
      if (GaiaFormatDialog._xml_element != '')
       GaiaFormatDialog._xml_parse();
      GaiaFormatDialog._xml_attr_n = [];
      GaiaFormatDialog._xml_attr_v = [];
      GaiaFormatDialog._xml_element = '';
      GaiaFormatDialog._xml_value   = '';
     }
    }
   },
   characters: function(value)
   {
    if (GaiaFormatDialog._xml_parsing)
    {
     if (GaiaFormatDialog._xml_element != '')
     {
      GaiaFormatDialog._xml_value+= value;
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
 }
};
GaiaFormatDialog.loadLocales();
GaiaFormatDialog.xml_prepare();
