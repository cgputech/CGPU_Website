"use client";

import { useEffect, useState } from "react";
import { cmsService, TeamMember } from "@/services/cms";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Compass, 
  Target, 
  Users, 
  Send,
  CalendarDays
} from "lucide-react";

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await cmsService.getTeamMembers();
        setTeam(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setFormSubmitted(false);
    }, 3000);
  };

  const facultyMembers = team.filter((m) => m.category === "Faculty");
  const studentMembers = team.filter((m) => m.category === "Student Representative");

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-red"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="border-b border-border-custom pb-6 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            About CGPU SCTCE
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Vision, Mission, Placement leadership board, and operational coordinates of Sree Chitra Thirunal College of Engineering.
          </p>
        </div>
        <div className="flex-shrink-0">
          <img 
            src="/cgpulogo.png" 
            alt="SCTCE CGPU Logo" 
            className="h-16 w-auto object-contain bg-white p-1 border border-border-custom rounded-lg shadow-xs" 
          />
        </div>
      </div>

      {/* Vision & Mission Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="flex items-start space-x-4 p-6" hoverEffect={false}>
          <div className="p-3.5 bg-soft-red text-primary-red rounded-xl flex-shrink-0">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-text-primary mb-2 flex items-center">
              Our Vision
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              To cultivate a world-class training ecosystem that transforms engineering graduates into innovative, ethically grounded, industry-ready professionals who lead global technological outcomes.
            </p>
          </div>
        </Card>

        <Card className="flex items-start space-x-4 p-6" hoverEffect={false}>
          <div className="p-3.5 bg-soft-red text-primary-red rounded-xl flex-shrink-0">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-text-primary mb-2 flex items-center">
              Our Mission
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              To foster strong alliances with global recruiters, develop structured pre-placement tracks, construct state-of-the-art testing infrastructure, and guide students with personalized career counselling.
            </p>
          </div>
        </Card>
      </div>

      {/* Team Directory Section */}
      <section className="mb-16">
        <div className="flex items-center space-x-2.5 pb-4 border-b border-border-custom mb-8">
          <Users className="h-5 w-5 text-primary-red" />
          <h2 className="text-xl font-extrabold text-text-primary">Placement Board & Team</h2>
        </div>

        {/* Faculty Subheading */}
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-6">Faculty Coordinators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {facultyMembers.map((member) => (
            <Card key={member.id} className="p-5 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-soft-red flex items-center justify-center font-extrabold text-sm text-primary-red">
                {member.avatar}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-text-primary">{member.name}</h4>
                <p className="text-[10px] font-semibold text-primary-red">{member.role}</p>
                <div className="flex flex-col text-[10px] text-text-secondary space-y-0.5 pt-1.5">
                  <a href={`mailto:${member.email}`} className="hover:text-primary-red transition-colors flex items-center">
                    <Mail className="h-3 w-3 mr-1 text-primary-red" /> {member.email}
                  </a>
                  {member.phone && (
                    <span className="flex items-center">
                      <Phone className="h-3 w-3 mr-1 text-primary-red" /> {member.phone}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Students Subheading */}
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-6">Student Representatives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {studentMembers.map((member) => (
            <Card key={member.id} className="p-5 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-extrabold text-sm text-text-secondary">
                {member.avatar}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-text-primary">{member.name}</h4>
                <p className="text-[10px] font-semibold text-text-secondary">{member.role}</p>
                <div className="flex flex-col text-[10px] text-text-secondary space-y-0.5 pt-1.5">
                  <a href={`mailto:${member.email}`} className="hover:text-primary-red transition-colors flex items-center">
                    <Mail className="h-3 w-3 mr-1 text-primary-red" /> {member.email}
                  </a>
                  {member.phone && (
                    <span className="flex items-center">
                      <Phone className="h-3 w-3 mr-1 text-primary-red" /> {member.phone}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline Milestones */}
      <section className="mb-16 border-t border-border-custom pt-16">
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-10">
          <h2 className="text-xl font-extrabold text-text-primary">CGPU Growth Landmarks</h2>
          <p className="text-xs text-text-secondary">Key structural milestones that shaped our placement cell over the decade.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <Card className="p-5 space-y-3" hoverEffect={false}>
            <span className="text-lg font-extrabold text-primary-red">2012</span>
            <h4 className="font-bold text-xs text-text-primary">Inception</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Placement Cell founded with 3 faculty members and 10 core company alliances.
            </p>
          </Card>
          <Card className="p-5 space-y-3" hoverEffect={false}>
            <span className="text-lg font-extrabold text-primary-red">2018</span>
            <h4 className="font-bold text-xs text-text-primary">MNC Alliance</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Direct recruitment partnerships signed with tier-1 groups like Microsoft and Deloitte.
            </p>
          </Card>
          <Card className="p-5 space-y-3" hoverEffect={false}>
            <span className="text-lg font-extrabold text-primary-red">2022</span>
            <h4 className="font-bold text-xs text-text-primary">Digital Lab Launch</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Construction of advanced online assessment labs supporting 500+ simultaneous candidates.
            </p>
          </Card>
          <Card className="p-5 space-y-3" hoverEffect={false}>
            <span className="text-lg font-extrabold text-primary-red">2025</span>
            <h4 className="font-bold text-xs text-text-primary">94% Success Peak</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Recorded peak placement rate and average package packages of 8.4 LPA.
            </p>
          </Card>
        </div>
      </section>

      {/* Contact Form and Map details */}
      <section id="contact" className="border-t border-border-custom pt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact details */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-text-primary">Office Operations</h2>
            <p className="text-xs text-text-secondary mt-1">Get in touch with the CGPU Placement Officer directly.</p>
          </div>

          <ul className="space-y-4 text-xs text-text-secondary">
            <li className="flex items-start">
              <MapPin className="h-4.5 w-4.5 mr-3 text-primary-red flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary block">Office Address</span>
                <span>Placement Cell Block, Sree Chitra Thirunal College of Engineering, Pappanamcode, Thiruvananthapuram, Kerala, PIN: 695018</span>
              </div>
            </li>
            <li className="flex items-start">
              <Clock className="h-4.5 w-4.5 mr-3 text-primary-red flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary block">Operational Hours</span>
                <span>Monday - Friday: 09:00 AM - 05:00 PM<br />Saturday: 09:00 AM - 01:00 PM</span>
              </div>
            </li>
            <li className="flex items-start">
              <CalendarDays className="h-4.5 w-4.5 mr-3 text-primary-red flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary block">Recruiter Inquiries</span>
                <span>Please propose dates 2 weeks prior to campus talk schedule.</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2 bg-card border border-border-custom rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <h3 className="text-sm font-extrabold text-text-primary mb-4">Send a Direct Message</h3>
          
          {formSubmitted ? (
            <div className="text-center py-12 space-y-2">
              <span className="block text-sm font-bold text-emerald-600">Message Dispatched!</span>
              <span className="block text-xs text-text-secondary">Thank you. Our administration cell will respond via email.</span>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user-name" className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Full Name</label>
                  <input
                    id="user-name"
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full p-2 border border-border-custom bg-background rounded text-xs text-text-primary focus:outline-none focus:border-primary-red"
                  />
                </div>
                <div>
                  <label htmlFor="user-email" className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Email Address</label>
                  <input
                    id="user-email"
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="e.g. john@domain.com"
                    className="w-full p-2 border border-border-custom bg-background rounded text-xs text-text-primary focus:outline-none focus:border-primary-red"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message-subject" className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Subject</label>
                <input
                  id="message-subject"
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="e.g. Campus visit query or alumni mentor verification"
                  className="w-full p-2 border border-border-custom bg-background rounded text-xs text-text-primary focus:outline-none focus:border-primary-red"
                />
              </div>

              <div>
                <label htmlFor="message-body" className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Inquiry Details</label>
                <textarea
                  id="message-body"
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Describe your inquiry..."
                  className="w-full p-2 border border-border-custom bg-background rounded text-xs text-text-primary focus:outline-none focus:border-primary-red resize-none"
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-2.5 bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer"
                >
                  Send Inquiry
                  <Send className="ml-2 h-3.5 w-3.5" />
                </button>
              </div>

            </form>
          )}
        </div>

      </section>

    </div>
  );
}
