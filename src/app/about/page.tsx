import Layout from '@/components/Layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About EcoLife | Our Mission for a Sustainable Future',
  description: 'Learn about EcoLife\'s mission to empower individuals and communities with the knowledge and tools needed to create a more sustainable world.',
  keywords: 'about ecolife, environmental mission, sustainability team, green living platform, climate action',
  openGraph: {
    title: 'About EcoLife | Our Mission',
    description: 'Empowering sustainable living through education and action',
    url: 'https://ecolife.com/about',
  },
  alternates: {
    canonical: 'https://ecolife.com/about',
  },
};

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Environmental Officer',
      bio: 'Former NASA climate scientist with 15+ years researching atmospheric conditions and climate change.',
      expertise: ['Climate Science', 'Data Analysis', 'Policy Development'],
      image: '👩‍🔬'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Sustainability Director',
      bio: 'Renewable energy engineer and green building expert with experience at Tesla and Solar City.',
      expertise: ['Renewable Energy', 'Green Technology', 'Sustainable Design'],
      image: '👨‍💼'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Content & Research Lead',
      bio: 'Environmental journalist and researcher specializing in sustainable living and consumer behavior.',
      expertise: ['Environmental Journalism', 'Research', 'Content Strategy'],
      image: '👩‍💻'
    },
    {
      name: 'Alex Thompson',
      role: 'Community Manager',
      bio: 'Passionate environmental advocate focused on building engaged communities around sustainability.',
      expertise: ['Community Building', 'Social Impact', 'Environmental Education'],
      image: '👨‍🌾'
    }
  ];

  const milestones = [
    {
      year: '2019',
      title: 'EcoLife Founded',
      description: 'Started as a small blog sharing sustainable living tips with 100 monthly readers.',
      icon: '🌱'
    },
    {
      year: '2020',
      title: 'Community Growth',
      description: 'Reached 50,000 monthly readers and launched our first sustainability challenges.',
      icon: '👥'
    },
    {
      year: '2021',
      title: 'Expert Partnerships',
      description: 'Partnered with leading environmental scientists and sustainability experts.',
      icon: '🤝'
    },
    {
      year: '2022',
      title: 'Platform Expansion',
      description: 'Launched product reviews, data analytics, and comprehensive resource library.',
      icon: '📈'
    },
    {
      year: '2023',
      title: 'Global Impact',
      description: 'Reached 2 million monthly readers across 85 countries worldwide.',
      icon: '🌍'
    },
    {
      year: '2024',
      title: 'AI-Powered Future',
      description: 'Launched automated content generation and personalized sustainability recommendations.',
      icon: '🤖'
    }
  ];

  const values = [
    {
      title: 'Scientific Accuracy',
      description: 'All our content is fact-checked by environmental experts and based on peer-reviewed research.',
      icon: '🔬'
    },
    {
      title: 'Practical Action',
      description: 'We focus on actionable advice that real people can implement in their daily lives.',
      icon: '💪'
    },
    {
      title: 'Inclusive Sustainability',
      description: 'Environmental action should be accessible to everyone, regardless of income or location.',
      icon: '🤝'
    },
    {
      title: 'Transparency',
      description: 'We openly share our methodologies, data sources, and any potential conflicts of interest.',
      icon: '📖'
    },
    {
      title: 'Community First',
      description: 'Our community drives our content priorities and helps shape our platform development.',
      icon: '👥'
    },
    {
      title: 'Optimistic Future',
      description: 'We believe in humanity\'s ability to solve environmental challenges through collective action.',
      icon: '🌟'
    }
  ];

  const stats = [
    { label: 'Monthly Readers', value: '2.4M+', icon: '📖' },
    { label: 'Articles Published', value: '15,000+', icon: '📝' },
    { label: 'Products Reviewed', value: '3,200+', icon: '⭐' },
    { label: 'Community Members', value: '850K+', icon: '👥' },
    { label: 'Countries Reached', value: '85+', icon: '🌍' },
    { label: 'Tons CO₂ Saved', value: '125K+', icon: '🌱' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">🌍 About EcoLife</h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
                We're on a mission to empower millions of people worldwide with the knowledge, 
                tools, and community support needed to create a more sustainable future for our planet.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold text-green-300">{stat.value}</div>
                    <div className="text-sm text-green-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Mission Statement */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🎯 Our Mission</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  Climate change and environmental degradation are the defining challenges of our time. 
                  But we believe that through education, community action, and smart technology, 
                  we can build a sustainable future that works for everyone.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  EcoLife exists to bridge the gap between environmental science and everyday action. 
                  We translate complex research into practical advice, review eco-friendly products 
                  honestly, and build a community of changemakers working toward common goals.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">Science-backed content</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">Practical solutions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">Global community</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-700">
                    A world where sustainable living is the norm, not the exception. 
                    Where every person has the knowledge and tools to make choices 
                    that protect our planet for future generations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">💚 Our Values</h2>
              <p className="text-xl text-gray-600">The principles that guide everything we do</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">📅 Our Journey</h2>
              <p className="text-xl text-gray-600">Key milestones in our mission to promote sustainability</p>
            </div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                    {milestone.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-2xl font-bold text-green-600">{milestone.year}</span>
                      <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                    </div>
                    <p className="text-gray-700">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">👥 Meet Our Team</h2>
              <p className="text-xl text-gray-600">Environmental experts, researchers, and passionate advocates</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="text-5xl">{member.image}</div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-green-600 font-semibold mb-3">{member.role}</p>
                      <p className="text-gray-700 mb-4 text-sm">{member.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Partners & Certifications */}
          <section className="mb-20">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">🤝 Partners & Certifications</h2>
                <p className="text-xl text-gray-600">Working with leading organizations to ensure accuracy and impact</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎓</div>
                  <h3 className="font-bold text-gray-900 mb-2">Academic Partners</h3>
                  <p className="text-gray-600 text-sm">MIT Climate Portal, Stanford Woods Institute, Yale Environment 360</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🌍</div>
                  <h3 className="font-bold text-gray-900 mb-2">Global Organizations</h3>
                  <p className="text-gray-600 text-sm">UN Environment Programme, Climate Action Network, Green Building Council</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="font-bold text-gray-900 mb-2">Certifications</h3>
                  <p className="text-gray-600 text-sm">B-Corp Certified, Carbon Neutral Website, Fair Trade Supporter</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section>
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">🚀 Join Our Mission</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Whether you're just starting your sustainability journey or you're already an eco-expert, 
                there's a place for you in the EcoLife community. Together, we can create lasting change.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors">
                  📧 Join Our Newsletter
                </button>
                <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition-colors">
                  🤝 Become a Contributor
                </button>
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className="mt-16">
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📬 Get In Touch</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <strong>General Inquiries:</strong><br />
                  hello@ecolife.com
                </div>
                <div>
                  <strong>Press & Media:</strong><br />
                  press@ecolife.com
                </div>
                <div>
                  <strong>Partnerships:</strong><br />
                  partners@ecolife.com
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;