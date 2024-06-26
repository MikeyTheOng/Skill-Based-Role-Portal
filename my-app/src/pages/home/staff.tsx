import Head from 'next/head';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react';

// import Image from 'next/image'
import TopNavBar from '../../components/TopNavBar'
import Carousel, { CarouselItem } from '@/components/Carousel'

const styles= {
    landingeDiv:{
        backgroundImage: 'linear-gradient(to bottom, #9ca4ed, #b0b5f1, #c3c7f5, #d6d8f9, #e9eafc)'
    },
    contentDiv: {
        backgroundImage: 'url("/images/blurry-gradient-haikei.png")',
        backgroundSize: 'cover',      // Cover the entire container
        backgroundRepeat: 'no-repeat', // No image repetition
        backgroundPosition: 'center',  // Center the image
        width: '100%',                 // Set the width to 100% of the container
        // height: '100%',                // Set the height to 100% of the container
    },
    pageContentContainer:{
        // width: '80%'
    },
};

const containerStyles = {
    heroContentContainer: "py-6 px-5",
    contentContainer: "bg-background",
    landingCard: "ml-44 mt-36",
    featureContainer: "flex py-4 px-8 mx-24 mt-12"
}

const textStyles = {
    heroHeading: "text-[#060828] text-3xl xl:text-4xl font-bold ",
    heroText: "text-[#060828]/60 text-sm xl:text-base ",
    subHeading: "text-[#060828] text-4xl font-bold ",
    subtitle: "text-[#060828]/60 text-lg",
    text: "text-[#060828]/60 text-lg",
    cardHeading: 'text-[#060828] text-lg text-left cursor-pointer',
    cardText: "text-[#060828] text-sm mt-1 cursor-pointer",
}

const inputStyles = {
    buttonSizing: "px-4 py-2 ",
    defaultButtonStyling: "text-white bg-blurple rounded-full hover:bg-transparent hover:text-blurple border border-blurple hover:border-blurple transition duration-200 ease-in-out",
    altButtonStyling:"text-blurple bg-[#A5ACF3] rounded-full hover:bg-transparent hover:text-blurple border border-blurple hover:border-blurple transition duration-200 ease-in-out",
    featureButton: "w-full text-left p-4 cursor-pointer",
    selectedFeatureButton: "w-full text-left p-4 cursor-pointer bg-[#E9EAFC] bg-opacity-20 rounded-s-2xl border-2 border-gray-100/20 shadow-inner drop-shadow-2xl",
}

export default function Home() {
    const { data, status } = useSession();
    const router = useRouter();

    const [selectedFeature, setSelectedFeature] = useState("Browse Listings");
    useEffect(() => {
        console.log("Selected feature: ", selectedFeature);
    }, [selectedFeature]);
    const features = [
        {
            "title": "Browse Listings",
            "description": "Browse for available roles and their skill requirements"
        },
        {
            "title": "Apply",
            "description": "Apply to roles that you are interested in"
        },
        {
            "title": "View Role-skill Match",
            "description": "View the match between your skills and the role's requirements"
        }
    ]

    const featuresRef = useRef(null);

    const handleClick = () => {
        if (featuresRef.current) {
            featuresRef.current.scrollIntoView({
                behavior: "smooth"
            });
        }
    };

    if (status === 'loading') {
        return (
            <main className='bg-white'>
                <h1> loading... please wait</h1>
            </main>
        );
    }
    else if (status === "authenticated") {
        if (data.role === 0) {
            return (
                <main className='min-w-screen'>
                    <Head>
                        <title>Staff Page</title>
                    </Head>
                    <div className={`w-full`} style={ styles.pageContentContainer }>
                        <div className={`${containerStyles['heroContentContainer']} h-screen grid grid-[auto,auto,1fr]`} style={ styles.landingeDiv }>
                            <div className=''>
                                <TopNavBar/>    
                            </div>
                            <div className={`${containerStyles['heroContentContainer']}`}>
                                <div className='justify-center text-center mt-8 mb-4'>
                                    <div>
                                        <h2 className={`${textStyles['heroHeading']}`}>Embark on a journey for your dream job</h2>
                                        <p className={`${textStyles['heroText']} w-full`}>
                                            We provide the platform for you to pursue your dream job.
                                        </p>
                                        <div className='justify-center mt-2'>
                                            <button 
                                                className={`${inputStyles['buttonSizing']} ${inputStyles['defaultButtonStyling']} mr-1.5`}
                                                onClick={ ()=>router.push('/roles/listings')}
                                            >
                                                Go To Listings
                                            </button>
                                            <button
                                                onClick={handleClick}
                                                className={`${inputStyles['buttonSizing']} ${inputStyles['altButtonStyling']}`}
                                            >
                                                Learn More
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className='grid grid-cols-4 gap-4 xl:mx-24'>
                                <div className='col-span-2'>
                                </div>
                                <div className='col-span-2 pl-12 pt-2'>
                                </div>
                            </div> */}
                            {/* <Carousel className="h-full aspect-square rounded-3xl">
                                {Array.from({ length: 5 }, (_, idx) => (
                                    <CarouselItem key={idx+1}>
                                        <img src={`/images/newsletter/${idx+1}.png`} />
                                    </CarouselItem>
                                ))}
                            </Carousel> */}
                        </div>
                        <div className={`${containerStyles['contentContainer']} pt-24 pb-14 min-h-screen`} id="features-div" style={styles.contentDiv}>
                            <div ref={featuresRef}>
                                <h4 className={`${textStyles['subHeading']} text-center`}>Features & Services</h4>
                                <p className={`${textStyles['subtitle']} text-center mt-4 mb-8`}>Find out how you can help staff members achieve their goals</p>
                            </div>
                            <div className='grid grid-cols-4 gap-4 mx-24'>
                                <div className='col-span-1' id='feature-buttons-div'>
                                    <div className='flex flex-col gap-y-2'>
                                        {features.map((feature, index) => (
                                            <div key={index} 
                                                // className={`${inputStyles['featureButton']}`}
                                                className={selectedFeature === feature.title ? `${inputStyles['selectedFeatureButton']}` : `${inputStyles['featureButton']}`}
                                                onClick={ () => setSelectedFeature(feature.title) }
                                            >
                                                <div className='pl-1 pb-1'>
                                                    <h4 className={`${textStyles['cardHeading']}`}>{feature.title}</h4>
                                                    <p className={`${textStyles['cardText']}`}>{feature.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='col-span-3'>
                                    <div className={selectedFeature === "Browse Listings" ? "block h-full" : "hidden"}>   
                                        <div className="aspect-video flex justify-end rounded-lg">
                                            <video className="rounded-xl" controls autoPlay loop muted >
                                                <source src="/home-page/STAFF-VIEW ROLES.mp4" type="video/mp4"/>
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    </div>
                                    <div className={selectedFeature === "Apply" ? "block" : "hidden"}>
                                        <div className="aspect-video flex justify-end rounded-lg">
                                            <video className="rounded-xl" controls autoPlay loop muted >
                                                <source src="/home-page/Staff-Apply for roles.mp4" type="video/mp4"/>
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    </div>
                                    <div className={selectedFeature === "View Role-skill Match" ? "block" : "hidden"}>
                                    <div className="shadow-md drop-shadow-md">
                                            <img className="rounded-lg" src="../../home-page/STAFF View RoleSkill Match.jpg" alt="STAFF View RoleSkill Match.png" />
                                            {/* <video className="rounded-xl" controls autoPlay loop muted >
                                                <source src="/home-page/HR-View Applicants.mp4" type="video/mp4"/>
                                                Your browser does not support the video tag.
                                            </video> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            );
        } else {
            // TODO: Access Denied Modal
            router.push('/');
            return null;
        }
    } else {
        router.push('/');
        return null;
    }
}

