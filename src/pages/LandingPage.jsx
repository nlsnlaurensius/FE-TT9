import React from 'react';
import { Link } from 'react-router-dom';
import TickItLogo from '../assets/TickItLogo.svg';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import Mockup from '../assets/mockup.png'
import Feature from '../assets/feature.png'

const features = [
    { smallTitle: "FEATURE 1", title: "Comprehensive Task Management", description: "Organize tasks with details, deadlines, and projects." },
    { smallTitle: "FEATURE 2", title: "Project Organization", description: "Group related tasks into projects for better focus." },
    { smallTitle: "FEATURE 3", title: "Progress Tracking", description: "Mark tasks as completed and view overall stats." },
];
const sliderImages = Array(5).fill(null);

const footerLinks = {
    features: [
      { text: 'How It Works', href: '#' },
      { text: 'Pricing', href: '#' },
      { text: 'Templates', href: '#' },
      { text: 'Channel Partners', href: '#' },
      { text: 'Developer API', href: '#' },
      { text: 'Status', href: '#' },
    ],
    resources: [
      { text: 'Download Apps', href: '#' },
      { text: 'Help Center', href: '#' },
      { text: 'Productivity Methods', href: '#' },
      { text: 'Integrations', href: '#' },
    ],
    company: [
      { text: 'About Us', href: '#' },
      { text: 'Careers', href: '#' },
      { text: 'Inspiration Hub', href: '#' },
      { text: 'Press', href: '#' },
      { text: 'Twist', href: '#' },
    ],
  };


function LandingPage() {
    const { isAuthenticated } = useAuth();

  return (
     <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <Navbar />

        <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                    Organize your work and life, finally.
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8">
                    Tick It Off, Get It Done.
                </p>
                {isAuthenticated ? (
                    <Link to="/app" className="bg-tickitGreen-500 hover:bg-tickitGreen-600 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300">
                        Back to App
                    </Link>
                ) : (
                     <Link to="/register" className="bg-tickitGreen-500 hover:bg-tickitGreen-600 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300">
                        Get Started
                     </Link>
                )}
            </div>

            <div className="md:w-1/2 w-full">
                 <div className=" rounded-lg shadow-xl flex items-center justify-center ">
                 <img src={Mockup} alt="mockup" className="h-full" />
                 </div>
            </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
             <div className="flex flex-col md:flex-row items-center md:space-x-12">
              <div className="md:w-1/2 w-full mb-12 md:mb-0">
                {features.map((feature, index) => (
                  <div key={index} className="mb-12 last:mb-0">
                    <p className="text-yellow-600 uppercase text-sm font-semibold mb-2">
                      {feature.smallTitle}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className={`md:w-1/2 w-full flex justify-center items-center`}>
                 <div className="w-full h-64 md:h-[500px] rounded-lg shadow-xl flex items-center justify-center">
                 <img src={Feature} alt="feature" className="h-full" />
                 </div>
              </div>
             </div>
        </section>

        <section className="bg-gray-100 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:space-x-12 mb-16 md:mb-24">
              <div className="md:w-1/2 w-full mb-10 md:mb-0 text-center md:text-left">
                <p className="text-red-600 uppercase text-sm font-semibold mb-2">
                  In it for the long haul!
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  A task manager you can trust for life
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We've been building TickIt for 99999 years and 9999 days. Rest assured that we'll never sell out to the highest bidder.
                </p>
                <a href="#" className="text-tickitGreen-500 hover:underline font-semibold">
                  Read about our long-term mission &rarr;
                </a>
              </div>

              <div className="md:w-1/2 w-full overflow-x-auto">
              </div>
            </div>

            <div className="text-center">
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                 Gain calmness and clarity with the world's most beloved productivity app
               </h2>
               <p className="text-gray-600 mb-8">
                 37400+ <span className="text-yellow-500">★★★★★</span> reviews on Google Play and App Store
               </p>
               {isAuthenticated ? (
                   <Link to="/app" className="bg-tickitGreen-500 hover:bg-tickitGreen-600 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300">
                       Go to App
                   </Link>
               ) : (
                   <Link to="/register" className="bg-tickitGreen-500 hover:bg-tickitGreen-600 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300">
                       Start for free
                   </Link>
               )}
            </div>
          </div>
        </section>

         <footer className="bg-gray-200 py-16 md:py-20">
           <div className="container mx-auto px-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 text-gray-700 text-sm mb-12">
               <div className="col-span-1 md:col-span-1 lg:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
                 <img src={TickItLogo} alt="TickIt Logo" className="h-8 mb-4" />
                 <p className="leading-relaxed">
                   Join millions of people who organize work and life with TickIt.
                 </p>
               </div>
               <div className="col-span-1 md:col-span-1 lg:col-span-1 text-center md:text-left">
                 <h4 className="font-bold text-gray-800 mb-4">Features</h4>
                 <ul>
                   {footerLinks.features.map((link, index) => (
                     <li key={index} className="mb-2 last:mb-0">
                       <a href={link.href} className="hover:underline">{link.text}</a>
                     </li>
                   ))}
                 </ul>
               </div>
                <div className="col-span-1 md:col-span-1 lg:col-span-1 text-center md:text-left">
                 <h4 className="font-bold text-gray-800 mb-4">Resources</h4>
                 <ul>
                     {footerLinks.resources.map((link, index) => (
                     <li key={index} className="mb-2 last:mb-0">
                       <a href={link.href} className="hover:underline">{link.text}</a>
                     </li>
                   ))}
                 </ul>
               </div>
                <div className="col-span-1 md:col-span-1 lg:col-span-1 text-center md:text-left">
                 <h4 className="font-bold text-gray-800 mb-4">Company</h4>
                 <ul>
                     {footerLinks.company.map((link, index) => (
                     <li key={index} className="mb-2 last:mb-0 flex items-center justify-center md:justify-start">
                       <a href={link.href} className="hover:underline">{link.text}</a>
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
             <hr className="border-gray-300 mb-8" />
             <div className="text-center text-sm text-gray-600">
               &copy; 2025 TickIt by NelsonLaurensius_2306161845. All rights reserved.
             </div>
           </div>
         </footer>
     </div>
  );
}

export default LandingPage;