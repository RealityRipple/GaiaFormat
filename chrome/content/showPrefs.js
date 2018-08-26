var GaiaFormatPrefDisp =
{
 _timer: Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer),
 Listen: function()
 {
  window.removeEventListener('load', GaiaFormatPrefDisp.Listen, false);
  gBrowser.addProgressListener(GaiaFormatPrefDisp.Listener);
 },
 URL: function(winLoc)
 {
  if (winLoc.indexOf('#') > -1)
  {
   if (winLoc.substr(winLoc.indexOf('#'), 19) == "#gaiaformat/options")
   {
    GaiaFormatPrefDisp._timer.init(GaiaFormatPrefDisp.event, 250, Components.interfaces.nsITimer.TYPE_ONE_SHOT);  
   }
  }
 },
 event:
 {
  observe: function(subject, topic, data)
  {
   if (window.content.document.getElementById('optionsGaiaFormat'))
    window.content.document.getElementById('optionsGaiaFormat').src = 'about:blank';
   window.openDialog('chrome://gaiaformat/content/option.xul', '', 'chrome,titlebar,toolbar,centerscreen,modal');
   GaiaFormatPrefDisp._timer.cancel();
  }
 },
 Listener:
 {
  QueryInterface: function(aIID)
  {
   if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
       aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
       aIID.equals(Components.interfaces.nsISupports))
    return this;
   throw Components.results.NS_NOINTERFACE;
  },
  onLocationChange: function(aProgress, aRequest, aURI)
  {
   if (aURI != null)
    GaiaFormatPrefDisp.URL(aURI.spec);
  },
  onStateChange: function() {},
  onProgressChange: function() {},
  onStatusChange: function() {},
  onSecurityChange: function() {},
  onLinkIconAvailable: function() {}
 }
};
window.addEventListener('load', GaiaFormatPrefDisp.Listen, false);
