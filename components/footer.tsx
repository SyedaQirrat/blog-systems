import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// A simple placeholder for icons
const IconPlaceholder = ({ name }: { name: string }) => (
  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
    {name.charAt(0)}
  </div>
);

export function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Top section with CTA */}
        <div className="border-b border-gray-700 pb-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <h2 className="text-2xl font-bold text-center lg:text-left">
              Ready to get started?
            </h2>
            <form className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your work email"
                className="bg-gray-800 border-gray-700 text-white flex-grow"
              />
              <Button type="submit" className="bg-primary-accent hover:bg-primary-accent/90">
                Sign Up
              </Button>
            </form>
          </div>
        </div>

        {/* Main grid with links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="https://chromewebstore.google.com/detail/sstrack/gkmllhjndmaaapegaopkpapaamfaeckg?hl=en-US" className="text-white hover:text-white">Chrome Extension</Link></li>
              <li><Link href="https://www.sstrack.io/download" className="text-white hover:text-white">Desktop Application</Link></li>
              <li><Link href="https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share" className="text-white hover:text-white">Mobile Application</Link></li>
              <li><Link href="https://www.sstrack.io/signup" className="text-white hover:text-white">Integrations</Link></li>
              <li><Link href="https://www.sstrack.io/signup" className="text-white hover:text-white">Pricing</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-1">
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-4">Features</h4>
            <ul className="space-y-2">
              <li><Link href="https://www.sstrack.io/signup" className="text-white hover:text-white">Time Tracker with Screenshot</Link></li>
              <li><Link href="https://www.sstrack.io/signup" className="text-white hover:text-white">Employee Timesheet Software</Link></li>
              <li><Link href="https://www.sstrack.io/signup" className="text-white hover:text-white">GPS Time Clock</Link></li>
              <li><Link href="https://www.sstrack.io/signup" className="text-white hover:text-white">Overtime Tracker</Link></li>
              <li><Link href="https://www.sstrack.io/signup" className="text-white hover:text-white">Time Reporting</Link></li>
              <li><Link href="https://www.sstrack.io/signup" className="text-white hover:text-white">Attendance Tracker</Link></li>
              <li><Link href="https://www.sstrack.io/signup" className="text-white hover:text-white">Web Based Time Tracker</Link></li>
              <li><Link href="https://www.sstrack.io/signup" className="text-white hover:text-white">Activity Log App</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-1">
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="https://www.sstrack.io/aboutUs" className="text-white hover:text-white">About Us</Link></li>
              <li><Link href="https://www.sstrack.io/contactUs" className="text-white hover:text-white">Contact Us</Link></li>
              <li><Link href="https://www.sstrack.io/signup" className="text-white hover:text-white">Privacy Policy</Link></li>
              <li><Link href="https://www.sstrack.io/signup" className="text-white hover:text-white">FAQ</Link></li>
            </ul>
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-4">Apps Download</h4>

            <ul className="space-y-2">
              
              <li><Link href="#" className="text-white hover:text-white">Windows time tracker</Link></li>
              <li><Link href="#" className="text-white hover:text-white">Android time tracker</Link></li>
              <li><Link href="#" className="text-white hover:text-white">IOS time tracker</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-1">
            
          </div>
          <div className="lg:col-span-1 col-span-2">
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-4">Follow us on social media</h4>
             <p className="text-white text-sm mb-4">Stay connected for updates and productivity tips.</p>
            <div className="flex space-x-4">
               <Link href="#"><IconPlaceholder name="in" /></Link>
               <Link href="#"><IconPlaceholder name="f" /></Link>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-white text-sm">
            All Rights Reserved {new Date().getFullYear()} SSTRACK.IO
          </p>
          <div className="mt-4 sm:mt-0">
            {/* You can add logo here if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
}