

'use client';
import TextType from './components/TextType';
import { useEffect, useState } from 'react';
import BlurText from "./components/BlurText";
import Link from 'next/link';
import Header from './components/Header';

export default function Home() {

  const [isLoading, setIsLoading] = useState(false);
  const [listit, setList] = useState([]);
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  const [trackingNumber, setTrackingNumber] = useState('');
  const addTrackNumber = (newTrackingNumber) => {
    let existingList = JSON.parse(localStorage.getItem('trackingNumbers')) || [];
    if (!existingList.includes(newTrackingNumber)) {
      existingList.push(newTrackingNumber);
      localStorage.setItem('trackingNumbers', JSON.stringify(existingList));
    }
  };
    useEffect(() => {
      const savedList = JSON.parse(localStorage.getItem('trackingNumbers')) || [];
      setList(savedList);
    }, []);

    return (
      <div className="min-h-screen relative">



        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat "
          style={{
            backgroundImage: `url('/background.jpg')`, filter: 'blur(5px)'

          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-indigo-900/60 blur"></div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-4xl">

              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  <TextType
                    text={["Track Your Package", "Track Your Package"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                  />

                </h1>

                <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto text-center">

                  <BlurText
                    text="Enter your tracking number below to get real-time updates on your parcel's journey"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    onAnimationComplete={handleAnimationComplete}
                    className="text-2xl mb-8 text-center"
                  />
                </p>

                <div className="relative">
                  <div className="relative flex items-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter your tracking number (e.g., 1Z999AA1234567890)"
                        className="w-full px-6 py-6 text-lg bg-transparent outline-none text-gray-800 placeholder-gray-500"
                        disabled={isLoading}
                      />
                    </div>
                    <Link
                      href={`/${trackingNumber}`}
                      passHref
                      legacyBehavior
                    >
                      <a>
                        <button
                          type="button"
                          onClick={() => {
                            addTrackNumber(trackingNumber)
                            setIsLoading(true)
                            
                            
                          } }
                          disabled={!trackingNumber.trim() || isLoading}
                          className={`px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap flex items-center justify-center space-x-2 ${isLoading ? 'cursor-wait' : 'cursor-pointer'
                            }`}
                          aria-disabled={!trackingNumber.trim() || isLoading}
                          aria-label={isLoading ? "Tracking in progress" : "Track package"}
                        >
                          {isLoading ? (
                            <>
                              <div
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                aria-hidden="true"
                              />
                              <span>Tracking...</span>
                            </>
                          ) : (
                            <>
                              <i className="ri-search-line text-xl" aria-hidden="true" />
                              <span>Track Now</span>
                            </>
                          )}
                        </button>
                      </a>
                    </Link>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-white/60 text-sm mb-3">Try these sample tracking numbers:</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {listit.map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => setTrackingNumber(sample)}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white/80 text-sm rounded-lg hover:bg-white/20 transition-all cursor-pointer whitespace-nowrap"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </main>

          {/* Footer */}
          <footer className="w-full py-8 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">


            </div>
          </footer>
        </div>
      </div>
    );
  }
