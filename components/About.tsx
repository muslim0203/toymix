import React from 'react';
import { Heart, ShieldCheck, Users, Sparkles, Star, Award, Zap } from 'lucide-react';
import { AboutPageContent } from '../types';

interface AboutProps {
  content: AboutPageContent;
}

/**
 * Map icon_name string from bot API to a lucide-react icon component.
 */
function getValueIcon(iconName: string, index: number) {
  const iconMap: Record<string, React.ReactNode> = {
    shield: <ShieldCheck size={36} className="text-green-500" />,
    heart: <Heart size={36} className="text-[#FF6B6B]" />,
    users: <Users size={36} className="text-[#4D96FF]" />,
    star: <Star size={36} className="text-[#FFD93D]" />,
    award: <Award size={36} className="text-purple-500" />,
    zap: <Zap size={36} className="text-orange-500" />,
  };

  if (iconMap[iconName]) return iconMap[iconName];

  // Default icons cycle
  const defaults = [
    <ShieldCheck size={36} className="text-green-500" />,
    <Heart size={36} className="text-[#FF6B6B]" />,
    <Users size={36} className="text-[#4D96FF]" />,
  ];
  return defaults[index % defaults.length];
}

const About: React.FC<AboutProps> = ({ content }) => {
  return (
    <section className="container mx-auto px-4 py-10" aria-label="ToyMix haqida - O'zbekiston bolalar o'yinchoqlari do'koni">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">{content.hero_title}</h1>
        <p className="text-gray-400 font-medium text-lg max-w-2xl mx-auto">
          {content.hero_description}
        </p>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFD93D] rounded-[3rem] p-10 md:p-16 text-white text-center mb-16">
        <Sparkles className="mx-auto mb-4" size={40} />
        <h2 className="text-3xl font-black mb-4">Bizning Missiyamiz</h2>
        <p className="text-white/90 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
          {content.mission_text}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {content.stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-8 text-center toy-shadow">
            <p className="text-3xl font-black text-[#FF6B6B] mb-2">{stat.number}</p>
            <p className="text-gray-400 font-bold text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Values */}
      <h2 className="text-3xl font-black text-center mb-10">Bizning Qadriyatlarimiz</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {content.values.map((item, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-10 toy-shadow text-center flex flex-col items-center gap-5">
            <div className="bg-gray-50 p-5 rounded-full">{getValueIcon(item.icon_name, i)}</div>
            <h3 className="text-xl font-black text-gray-900">{item.title}</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="text-center">
        <h2 className="text-3xl font-black mb-4">Bizning Jamoa</h2>
        <p className="text-gray-400 font-medium mb-10 max-w-lg mx-auto">
          Professional va g'amxo'r jamoamiz har doim sizga yordam berishga tayyor
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {content.team_members.map((member, i) => (
            <div key={i} className="bg-white rounded-[2.5rem] p-8 toy-shadow flex flex-col items-center gap-4">
              <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-50" />
              <div className="text-center">
                <h4 className="font-black text-gray-900">{member.name}</h4>
                <p className="text-gray-400 text-sm font-bold">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
