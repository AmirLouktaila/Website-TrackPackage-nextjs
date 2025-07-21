'use client';
import { MoveLeft } from 'lucide-react';
import Header from './Header'
import Link from 'next/link';
export default function TrackingResults({ data }) {

  const events = data?.events || [];
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-400';
      case 'in transit':
      case 'out for delivery':
        return 'text-blue-400';
      case 'processing':
      case 'dispatched':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500/20 border-green-500/30';
      case 'in transit':
      case 'out for delivery':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'processing':
      case 'dispatched':
        return 'bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/background.jpg')`,
          filter: 'blur(8px)',
          opacity: 0.5,
        }}
      ></div>


      <div className="relative z-10 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-indigo-900/60 py-12 px-4">
        <div className="w-full max-w-5xl mx-auto space-y-12">


          <Header />


          <div className="text-center">
            <Link href="/">
              <button className="mb-6 inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors cursor-pointer">
                <MoveLeft className="text-lg" />
                <span>Track Another Package</span>
              </button>
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">Package Tracking</h1>
            <p className="text-white/80">
              Tracking Number: <span className="font-mono font-semibold">{data.trackingNumber}</span>
            </p>
          </div>


          {data?.lastEvent ? (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 md:p-10">
              <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                  <h3 className="text-gray-600 text-sm font-medium mb-2">Current Status</h3>
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusBg(data.lastEvent.status)}`}>
                    <span className="text-2xl">{data.lastEvent.icon || "🚚"}</span>
                    <span className={`font-semibold ${getStatusColor(data.lastEvent.status)}`}>{data.lastEvent.status}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium mb-2">Current Location</h3>
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <i className="ri-map-pin-line text-gray-500"></i>
                    <span className="text-gray-800 font-medium">{data.lastEvent.location}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium mb-2">Estimated Delivery</h3>
                  <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                    <i className="ri-calendar-line text-gray-500"></i>
                    <span className="text-gray-800 font-medium">{data.lastEvent.timestamp}</span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium">
                    New Tracking Number: <span className="font-mono">{data.newTrackingNumber || '-'}</span>
                  </h3>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-300">No tracking information available.</div>
          )}

          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center space-x-3">
              <i className="ri-time-line text-blue-600"></i>
              <span>Delivery Timeline</span>
            </h2>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
              {events.length > 0 ? (
                events.map((item, index) => (
                  <div key={index} className="relative flex items-start space-x-6 pb-10 last:pb-0">
                    <div className={`z-10 w-12 h-12 flex items-center justify-center rounded-full border-4 ${item.completed
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-white'
                      : 'bg-gray-100 border-gray-300'
                      }`}>
                      <span className="text-lg">{item.icon}</span>
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div className="mb-2 sm:mb-0">
                          <h3 className={`text-lg font-semibold ${item.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                            {item.status}
                          </h3>
                          <div className="flex items-center space-x-2 text-gray-600 mt-1">
                            <i className="ri-map-pin-2-line text-sm"></i>
                            <span className="text-sm">{item.location}</span>
                          </div>
                        </div>
                        <div className={`text-sm font-mono ${item.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                          {item.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">No tracking events found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}