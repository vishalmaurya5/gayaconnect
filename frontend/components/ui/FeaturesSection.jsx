'use client';

import Link from 'next/link';

export default function FeaturesSection() {
    const features = [
        { 
            title: 'Local Discovery', 
            description: 'Find trusted services, shops, and vendors instantly across Gaya and Bodh Gaya.', 
            action: 'Explore Services', 
            link: '/services',
            icon: ( <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 2.5H3.333a.833.833 0 0 0-.833.833v5.834c0 .46.373.833.833.833H7.5c.46 0 .833-.373.833-.833V3.333A.833.833 0 0 0 7.5 2.5m9.167 0H12.5a.833.833 0 0 0-.833.833v2.5c0 .46.373.834.833.834h4.167c.46 0 .833-.373.833-.834v-2.5a.833.833 0 0 0-.833-.833m0 7.5H12.5a.833.833 0 0 0-.833.833v5.834c0 .46.373.833.833.833h4.167c.46 0 .833-.373.833-.833v-5.834a.833.833 0 0 0-.833-.833M7.5 13.336H3.333a.833.833 0 0 0-.833.833v2.5c0 .46.373.834.833.834H7.5c.46 0 .833-.373.833-.834v-2.5a.833.833 0 0 0-.833-.833" stroke="#314158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> )
        },
        { 
            title: 'Skilled Workforce', 
            description: 'Connect directly with verified daily-wage labourers, technicians, and professionals.', 
            action: 'Find Workers', 
            link: '/labour',
            icon: ( <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.333 11.666a.832.832 0 0 1-.65-1.358l8.25-8.5a.417.417 0 0 1 .717.383l-1.6 5.017a.833.833 0 0 0 .783 1.125h5.834a.833.833 0 0 1 .65 1.358l-8.25 8.5a.416.416 0 0 1-.717-.383l1.6-5.017a.833.833 0 0 0-.783-1.125z" stroke="#314158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)
        },
        { 
            title: 'Exclusive Deals', 
            description: 'Access amazing local discounts, daily deals, and special offers from businesses near you.', 
            action: 'View Offers', 
            link: '/offers',
            icon: ( <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.333 17.5v-1.667A3.333 3.333 0 0 0 10 12.5H5a3.333 3.333 0 0 0-3.333 3.333V17.5M13.333 2.61a3.333 3.333 0 0 1 0 6.453m5 8.438v-1.667a3.334 3.334 0 0 0-2.5-3.225M7.5 9.167a3.333 3.333 0 1 0 0-6.667 3.333 3.333 0 0 0 0 6.667" stroke="#314158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)
        },
        { 
            title: 'Verified Contacts', 
            description: 'Get premium access to direct phone numbers for seamless communication and hiring.', 
            action: 'Get Premium', 
            link: '/',
            icon: ( <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 10.831c0 4.167-2.917 6.25-6.384 7.458a.83.83 0 0 1-.558-.008c-3.475-1.2-6.392-3.283-6.392-7.45V4.998a.833.833 0 0 1 .834-.834c1.666 0 3.75-1 5.2-2.266a.975.975 0 0 1 1.266 0c1.459 1.275 3.534 2.266 5.2 2.266a.833.833 0 0 1 .834.834z" stroke="#314158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="m7.5 10.003 1.667 1.666L12.5 8.336" stroke="#314158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> )
        },
        { 
            title: 'Interactive Map', 
            description: 'Locate vendors, shops, and workers near your exact location easily with our integrated map.', 
            action: 'Open Map', 
            link: '/map',
            icon: ( <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 18.33v-4.166m2.5-7.5v-5m1.667 5a.833.833 0 0 1 .833.833v3.334a3.334 3.334 0 0 1-3.333 3.333H8.333A3.333 3.333 0 0 1 5 10.831V7.497a.833.833 0 0 1 .833-.833zm-6.667 0v-5" stroke="#314158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> )
        },
        { 
            title: 'Vendor Dashboard', 
            description: 'Business owners can manage listings, post banners, and track local engagement effortlessly.', 
            action: 'Register Business', 
            link: '/vendor/register',
            icon: ( <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 12.503v4.166s2.525-.458 3.333-1.666c.9-1.35 0-4.167 0-4.167M3.75 13.748c-1.25 1.05-1.667 4.167-1.667 4.167s3.117-.417 4.167-1.667c.592-.7.583-1.775-.075-2.425a1.817 1.817 0 0 0-2.425-.075" stroke="#314158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.5 9.998a18.3 18.3 0 0 1 1.667-3.292 10.73 10.73 0 0 1 9.166-5.042c0 2.267-.65 6.25-5 9.167A18.7 18.7 0 0 1 10 12.498z" stroke="#314158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.5 9.996H3.333S3.792 7.471 5 6.663c1.35-.9 4.167.042 4.167.042" stroke="#314158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> )
        },
    ];

    return (
        <section className="w-full flex-col items-center mx-auto px-5 lg:px-10 py-16 relative z-10 bg-transparent">
            <div className="max-w-[1440px] mx-auto flex w-full flex-col items-center">
                <div className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-[11px] font-bold text-indigo-800 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    Platform Features
                </div>

                <h2 className="mt-6 text-center text-3xl md:text-5xl font-[800] text-[#0F172A] font-sora tracking-tight">
                    Everything you need in Gaya
                </h2>

                <p className="mt-4 max-w-[600px] text-center text-[15px] md:text-base text-slate-500 leading-relaxed">
                    Discover local vendors, hire skilled professionals, and grab the best deals—all powered by a seamless digital platform.
                </p>

                <div className="mt-12 grid w-full max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col rounded-[24px] border border-slate-200 bg-white p-6 md:p-8 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 group">
                            <div className="flex size-12 items-center justify-center rounded-[14px] bg-slate-50 border border-slate-100 shadow-sm group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors duration-300 text-indigo-600">
                                {feature.icon}
                            </div>
                            <h3 className="mt-6 text-[17px] font-[800] text-[#0F172A] font-sora tracking-tight">{feature.title}</h3>
                            <p className="mt-3 grow text-[14px] leading-relaxed text-slate-500">{feature.description}</p>
                            <div className="my-5 h-px w-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" />
                            <Link href={feature.link} className="flex items-center gap-2 text-[14px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                {feature.action}
                                <svg className='transition-transform duration-300 group-hover:translate-x-1' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.333 8h9.334M8 3.336l4.667 4.667L8 12.669" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
