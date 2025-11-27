// app/help/page.js
export default function HelpPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Help</h1>
      <div className="space-y-4 max-w-2xl">
        <div className="bg-[#272727] p-4 rounded-lg cursor-pointer hover:bg-[#3f3f3f]">
          <h3 className="font-medium">Getting Started</h3>
        </div>
        <div className="bg-[#272727] p-4 rounded-lg cursor-pointer hover:bg-[#3f3f3f]">
          <h3 className="font-medium">Account & Settings</h3>
        </div>
        <div className="bg-[#272727] p-4 rounded-lg cursor-pointer hover:bg-[#3f3f3f]">
          <h3 className="font-medium">Troubleshooting</h3>
        </div>
      </div>
    </div>
  );
}
