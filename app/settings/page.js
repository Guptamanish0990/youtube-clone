// app/settings/page.js
export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-4 max-w-2xl">
        <div className="bg-[#272727] p-4 rounded-lg">
          <h3 className="font-medium mb-2">Account</h3>
          <p className="text-sm text-gray-400">Manage your account settings</p>
        </div>
        <div className="bg-[#272727] p-4 rounded-lg">
          <h3 className="font-medium mb-2">Privacy</h3>
          <p className="text-sm text-gray-400">Control your privacy settings</p>
        </div>
        <div className="bg-[#272727] p-4 rounded-lg">
          <h3 className="font-medium mb-2">Notifications</h3>
          <p className="text-sm text-gray-400">Manage notification preferences</p>
        </div>
      </div>
    </div>
  );
}

