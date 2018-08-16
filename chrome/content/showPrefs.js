if (!window.com) window.com = {};
if (!window.com.RealityRipple) window.com.RealityRipple = {};
window.com.RealityRipple.GaiaFormatPrefDisp = function()
{
 var pub = {};
 var priv = {};

 priv.timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
 priv.TIMER_ONE_SHOT = Components.interfaces.nsITimer.TYPE_ONE_SHOT;

 pub.Listen = function()
 {
  window.removeEventListener('load', pub.Listen, false);
  gBrowser.addProgressListener(pub.Listener);
 }

 pub.URL = function(winLoc)
 {
  if (winLoc.indexOf('#') > -1)
  {
   if (winLoc.substr(winLoc.indexOf('#'), 19) == "#gaiaformat/options")
   {
    priv.timer.init(pub.event, 250, priv.TIMER_ONE_SHOT);  
   }
  }
 }

 pub.event =
 {
  observe: function(subject, topic, data)
  {
   if (window.content.document.getElementById('optionsGaiaFormat'))
    window.content.document.getElementById('optionsGaiaFormat').src = 'about:blank';
   window.openDialog('chrome://gaiaformat/content/option.xul', '', 'chrome,titlebar,toolbar,centerscreen,modal');
   priv.timer.cancel();
  }
 }

 pub.Listener =
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
    pub.URL(aURI.spec);
  },
  onStateChange: function() {},
  onProgressChange: function() {},
  onStatusChange: function() {},
  onSecurityChange: function() {},
  onLinkIconAvailable: function() {}
 };	

 return pub;
}();

window.addEventListener('load', window.com.RealityRipple.GaiaFormatPrefDisp.Listen, false);
