"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, User, MapPin, Calendar, Settings, Star, Clock, Check, X } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockReviews } from "@/data/mechanicMockData";
import { apiRequest } from "@/lib/apiClient";

const MECHANIC_NAV = [
  { name: "Overview", href: "/mechanic/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/mechanic/profile", icon: User },
  { name: "Location", href: "/mechanic/location", icon: MapPin },
  { name: "Availability", href: "/mechanic/availability", icon: Calendar },
  { name: "Settings", href: "/mechanic/settings", icon: Settings },
];

export default function MechanicDashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await apiRequest<{ bookings: any[] }>("/api/v1/bookings/mechanic");
      if (res.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await apiRequest(`/api/v1/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (res.success) {
        fetchBookings(); // Refresh list
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const stats = [
    { label: "Total Bookings", value: bookings.length.toString(), trend: "All Time", positive: true },
    { label: "Profile Rating", value: "4.9", trend: "0", positive: true },
    { label: "Pending Requests", value: bookings.filter(b => b.status === "PENDING").length.toString(), trend: "Needs Action", positive: true },
    { label: "Service Hours", value: "120", trend: "+12", positive: true },
  ];

  return (
    <DashboardLayout navItems={MECHANIC_NAV} role="mechanic" title="Expert Portal">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">Expert Overview</h1>
          <p className="text-subtle text-sm">Manage your service requests, schedule, and profile visibility.</p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl"
            >
              <p className="text-subtle text-xs font-bold uppercase tracking-widest mb-4">{stat.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-display text-white">{stat.value}</span>
                <span className={`text-xs font-medium ${stat.positive ? "text-accent" : "text-white/40"}`}>
                  {stat.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[300px] flex flex-col"
          >
             <h2 className="text-white font-medium flex items-center gap-2 mb-6">
              <Calendar className="w-4 h-4 text-accent" />
              Upcoming Schedule
            </h2>
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-subtle text-sm">Loading bookings...</p>
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4 flex-1">
                {bookings.map((booking) => (
                  <div key={booking._id} className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-white font-medium">{booking.userId?.name || "Unknown User"}</p>
                        <p className="text-subtle text-sm">
                          {booking.vehicleDetails.make} {booking.vehicleDetails.model} ({booking.vehicleDetails.year})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm">
                          {new Date(booking.requestedDate).toLocaleDateString()}
                        </p>
                        <p className="text-accent text-sm flex items-center justify-end gap-1 mt-1">
                          <Clock className="w-3 h-3" /> 
                          {new Date(booking.requestedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 p-3 rounded-lg mb-4">
                      <p className="text-sm text-white/80">{booking.issueDescription}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                        booking.status === "PENDING" ? "bg-yellow-500/20 text-yellow-500" :
                        booking.status === "CONFIRMED" ? "bg-green-500/20 text-green-500" :
                        booking.status === "REJECTED" ? "bg-red-500/20 text-red-500" :
                        "bg-white/10 text-white/50"
                      }`}>
                        {booking.status}
                      </span>

                      {booking.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStatusChange(booking._id, "REJECTED")}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(booking._id, "CONFIRMED")}
                            className="p-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors"
                            title="Accept"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      {booking.status === "CONFIRMED" && (
                        <button 
                          onClick={() => handleStatusChange(booking._id, "COMPLETED")}
                          className="text-xs text-white/60 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                  <p className="text-subtle text-sm">No service requests yet.</p>
              </div>
            )}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[300px] flex flex-col"
          >
             <h2 className="text-white font-medium flex items-center gap-2 mb-6">
              <Star className="w-4 h-4 text-accent" />
              Recent Reviews
            </h2>
            {mockReviews.length > 0 ? (
              <div className="space-y-4 flex-1">
                {mockReviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium">{review.client}</p>
                      <span className="text-subtle text-xs">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-white/20"}`} />
                      ))}
                    </div>
                    <p className="text-subtle text-sm italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                  <p className="text-subtle text-sm">No recent reviews.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
