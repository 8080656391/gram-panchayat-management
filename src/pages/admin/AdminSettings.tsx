import React, { useState } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';
import '../../styles/pages/AdminSettings.css';

interface SystemSettings {
  villageOfficialsEmail: string;
  taxDeadlineMonth: number;
  certificateProcessingDays: number;
  maxGrievancePriority: 'low' | 'medium' | 'high';
  notificationsEnabled: boolean;
  maintenanceMode: boolean;
  autoBackupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    villageOfficialsEmail: 'admin@grampanchayat.local',
    taxDeadlineMonth: 3,
    certificateProcessingDays: 5,
    maxGrievancePriority: 'high',
    notificationsEnabled: true,
    maintenanceMode: false,
    autoBackupEnabled: true,
    backupFrequency: 'daily',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = (key: keyof SystemSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaveMessage('Settings saved successfully!');
    setIsSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleReset = () => {
    // Reset to defaults
    setSettings({
      villageOfficialsEmail: 'admin@grampanchayat.local',
      taxDeadlineMonth: 3,
      certificateProcessingDays: 5,
      maxGrievancePriority: 'high',
      notificationsEnabled: true,
      maintenanceMode: false,
      autoBackupEnabled: true,
      backupFrequency: 'daily',
    });
  };

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h1>
          <Settings size={28} />
          System Settings
        </h1>
      </div>

      {saveMessage && <div className="save-message success">{saveMessage}</div>}

      <div className="settings-container">
        <div className="settings-section">
          <h2>Communication</h2>
          <div className="setting-group">
            <label>Village Officials Email</label>
            <input
              type="email"
              value={settings.villageOfficialsEmail}
              onChange={(e) => handleChange('villageOfficialsEmail', e.target.value)}
              placeholder="Enter officials email"
            />
            <p className="setting-hint">Email for receiving important system notifications</p>
          </div>
        </div>

        <div className="settings-section">
          <h2>Service Configuration</h2>
          <div className="setting-group">
            <label>Tax Deadline Month (1-12)</label>
            <input
              type="number"
              min="1"
              max="12"
              value={settings.taxDeadlineMonth}
              onChange={(e) => handleChange('taxDeadlineMonth', parseInt(e.target.value))}
            />
            <p className="setting-hint">Month by which taxes should be paid annually</p>
          </div>

          <div className="setting-group">
            <label>Certificate Processing Days</label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.certificateProcessingDays}
              onChange={(e) => handleChange('certificateProcessingDays', parseInt(e.target.value))}
            />
            <p className="setting-hint">Number of days to process certificate applications</p>
          </div>

          <div className="setting-group">
            <label>Maximum Grievance Priority</label>
            <select value={settings.maxGrievancePriority} onChange={(e) => handleChange('maxGrievancePriority', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <p className="setting-hint">Highest priority level for grievances</p>
          </div>
        </div>

        <div className="settings-section">
          <h2>System Features</h2>
          <div className="setting-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
              />
              <span>Enable Notifications</span>
            </label>
            <p className="setting-hint">Allow the system to send email notifications</p>
          </div>

          <div className="setting-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              />
              <span>Maintenance Mode</span>
            </label>
            <p className="setting-hint">Enable maintenance mode to restrict access (citizens only)</p>
          </div>

          <div className="setting-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.autoBackupEnabled}
                onChange={(e) => handleChange('autoBackupEnabled', e.target.checked)}
              />
              <span>Auto Backup</span>
            </label>
            <p className="setting-hint">Automatically backup system data</p>
          </div>

          <div className="setting-group">
            <label>Backup Frequency</label>
            <select value={settings.backupFrequency} onChange={(e) => handleChange('backupFrequency', e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <p className="setting-hint">How often to backup system data</p>
          </div>
        </div>

        <div className="settings-section">
          <h2>System Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">System Version</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Backup</span>
              <span className="info-value">Today, 03:00 AM</span>
            </div>
            <div className="info-item">
              <span className="info-label">Database Size</span>
              <span className="info-value">45 MB</span>
            </div>
            <div className="info-item">
              <span className="info-label">Active Sessions</span>
              <span className="info-value">8</span>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
        <button className="btn-secondary" onClick={handleReset}>
          <RotateCcw size={18} />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
