import { useState, useEffect } from "react";
import { Shield, MapPin, Users, Settings, CheckCircle, AlertCircle } from "lucide-react";
import { getContacts } from "@/utils/storage";
import { Link } from "react-router-dom";

const Index = () => {
  const [contactCount, setContactCount] = useState(0);
  const [locationStatus, setLocationStatus] = useState<'checking' | 'granted' | 'denied'>('checking');

  useEffect(() => {
    // Check contact count
    const contacts = getContacts();
    setContactCount(contacts.length);

    // Check location permission status
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
        setLocationStatus(result.state === 'granted' ? 'granted' : 'denied');
      }).catch(() => {
        setLocationStatus('denied');
      });
    } else {
      setLocationStatus('granted'); // Assume granted if permissions API not available
    }
  }, []);

  const getStatusIcon = (status: 'checking' | 'granted' | 'denied') => {
    switch (status) {
      case 'checking':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'granted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'denied':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (status: 'checking' | 'granted' | 'denied') => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'granted':
        return 'Ready';
      case 'denied':
        return 'Permission Required';
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background pt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            SOS <span className="text-primary">Beacon Pro</span>
          </h1>
          <p className="text-muted-foreground">
            Emergency alert system with real-time location sharing
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Emergency Contacts */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-primary" />
              <span className={`text-sm font-medium ${
                contactCount > 0 ? 'text-green-500' : 'text-yellow-500'
              }`}>
                {contactCount > 0 ? 'Configured' : 'Not Set'}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Emergency Contacts</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {contactCount === 0 
                ? 'No emergency contacts configured' 
                : `${contactCount} contact${contactCount > 1 ? 's' : ''} ready`
              }
            </p>
            {contactCount === 0 && (
              <Link 
                to="/contacts"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                Add Contact →
              </Link>
            )}
          </div>

          {/* Location Services */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <MapPin className="w-8 h-8 text-primary" />
              <div className="flex items-center gap-1">
                {getStatusIcon(locationStatus)}
                <span className="text-sm font-medium text-muted-foreground">
                  {getStatusText(locationStatus)}
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Location Services</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {locationStatus === 'granted' 
                ? 'Location access ready for emergencies' 
                : 'Location permission required for SOS'
              }
            </p>
            {locationStatus === 'denied' && (
              <button className="inline-flex items-center text-sm text-primary hover:underline">
                Enable Location →
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Settings className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium text-green-500">Active</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">System Status</h3>
            <p className="text-sm text-muted-foreground mb-3">
              All systems operational and ready
            </p>
            <Link 
              to="/"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              Test SOS →
            </Link>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <h3 className="font-medium text-foreground mb-1">Add Emergency Contact</h3>
              <p className="text-sm text-muted-foreground">
                Configure who will receive your SOS alerts
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                <span className="text-lg font-bold text-primary">2</span>
              </div>
              <h3 className="font-medium text-foreground mb-1">Enable Location</h3>
              <p className="text-sm text-muted-foreground">
                Allow location access for accurate emergency alerts
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                <span className="text-lg font-bold text-primary">3</span>
              </div>
              <h3 className="font-medium text-foreground mb-1">Press SOS Button</h3>
              <p className="text-sm text-muted-foreground">
                Send emergency alert with your location
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-100 mb-1">
                Emergency Use Only
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                This SOS alert system should only be used in genuine emergency situations. 
                False alerts may cause unnecessary concern and waste emergency resources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
