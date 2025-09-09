"use client"

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Linkedin } from 'lucide-react';

// Data for the footer links to keep the component clean
const productLinks = [
  { href: "https://chromewebstore.google.com/detail/sstrack/gkmllhjndmaaapegaopkpapaamfaeckg?hl=en-US", text: "Chrome Extension" },
  { href: "/download", text: "Desktop Application" },
  { href: "https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share", text: "Mobile Application" },
  { href: "/signup", text: "Integrations" },
  { href: "/#pricing", text: "Pricing", badge: "Free trial" },
];

const featureLinks = [
  { href: "/signup", text: "Time tracker with screenshots" },
  { href: "/signup", text: "Employee timesheet software" },
  { href: "/signup", text: "GPS time clock" },
  { href: "/signup", text: "Overtime tracker" },
  { href: "/signup", text: "Time reporting" },
  { href: "/signup", text: "Attendance tracker" },
];

const companyLinks = [
  { href: "/aboutUs", text: "About Us" },
  { href: "/contact", text: "Contact Us" },
  { href: "/privacy-policy", text: "Privacy Policy" },
  { href: "/#faq", text: "FAQ" },
];

const appLinks = [
    { href: "/download", text: "Windows time tracker" },
    { href: "/download", text: "Android time tracker" },
    { href: "/download", text: "iOS time tracker" },
];

export function Footer() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data: any) => {
    console.log("Signup attempt with email:", data.email);
    // TODO: Implement actual signup logic
    // For now, you can navigate to signup page with email as query param
    // router.push(`/signup?email=${data.email}`);
  };

  return (
    <footer className="bg-primary-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.text}
                    {link.badge && (
                      <span className="ml-2 text-xs bg-primary-accent text-white px-2 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features Links */}
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              {featureLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Apps Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold mb-4 mt-8">Apps Download</h4>
            <ul className="space-y-2">
              {appLinks.map((link, index) => (
                 <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Signup Form and Socials */}
          <div className="col-span-2 lg:col-span-2">
            <h4 className="font-semibold">Ready to get started?</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-4">
              <Input
                type="email"
                placeholder="Enter your work email"
                {...register("email", { required: "Email is required" })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button type="submit" className="bg-primary-accent hover:bg-primary-accent/90 w-full">
                Sign Up
              </Button>
               {errors.email && <p className="text-red-500 text-sm mt-1">{(errors.email as any).message}</p>}
            </form>

            <div className="mt-8">
              <h6 className="font-semibold">Follow us on social media</h6>
              <p className="text-sm text-gray-400 mt-2">Stay connected for updates and productivity tips.</p>
              <div className="flex space-x-4 mt-4">
                <Link href="https://www.instagram.com/sstrack.io" className="text-gray-400 hover:text-white">
                  <Instagram />
                </Link>
                <Link href="https://www.facebook.com/sstrack.io" className="text-gray-400 hover:text-white">
                  <Facebook />
                </Link>
                <Link href="https://www.linkedin.com/company/sstrack-io" className="text-gray-400 hover:text-white">
                  <Linkedin />
                </Link>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/">
                <Image
                  src="https://sstrack-public-assets.s3.ca-central-1.amazonaws.com/images/sloganLogo.png"
                  alt="SSTrack.io Logo"
                  width={250}
                  height={50}
                  className="h-auto"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            © All Rights Reserved {new Date().getFullYear()} SSTRACK.IO
          </p>
        </div>
      </div>
    </footer>
  );
}
